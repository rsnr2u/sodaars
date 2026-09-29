<?php

namespace App\Http\Controllers\Api\V1\Tenant;

use App\Contracts\MediaStorageInterface;
use App\Enums\LocationMediaType;
use App\Http\Controllers\Controller;
use App\Http\Requests\Tenant\ReorderMediaRequest;
use App\Http\Requests\Tenant\StoreLocationMediaRequest;
use App\Http\Requests\Tenant\UpdateLocationMediaRequest;
use App\Http\Resources\LocationMediaResource;
use App\Models\Location;
use App\Models\LocationMedia;
use App\Services\Media\ImageProcessorService;
use App\Services\Tenant\TenantContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;

class LocationMediaController extends Controller
{
    public function __construct(
        protected ImageProcessorService $imageProcessor,
        protected MediaStorageInterface $mediaStorage,
        protected TenantContext $tenantContext
    ) {}

    /**
     * List all media assets for a location.
     */
    public function index(Request $request, string $locationUuid): AnonymousResourceCollection
    {
        $location = $this->findLocation($locationUuid);
        Gate::authorize('viewAny', [LocationMedia::class, $location]);

        $query = $location->media();

        if ($request->filled('media_type')) {
            $query->where('media_type', $request->input('media_type'));
        }

        $media = $query->orderBy('is_primary', 'desc')
            ->orderBy('sort_order', 'asc')
            ->orderBy('id', 'asc')
            ->get();

        return LocationMediaResource::collection($media);
    }

    /**
     * Upload and process a new media asset for a location.
     */
    public function store(StoreLocationMediaRequest $request, string $locationUuid): JsonResponse
    {
        $location = $this->findLocation($locationUuid);
        Gate::authorize('upload', [LocationMedia::class, $location]);

        $org = $this->tenantContext->getTenant();

        // 1. Validate & process image into display and thumbnail versions
        $processed = $this->imageProcessor->process($request->file('file'));

        // 2. Store on disk under tenant-isolated path
        $stored = $this->mediaStorage->storeLocationMedia($org, $location, $processed);

        // 3. Determine primary status (first photo automatically becomes primary)
        $existingCount = LocationMedia::where('location_id', $location->id)->count();
        $isPrimary = $request->boolean('is_primary') || $existingCount === 0;

        $media = DB::transaction(function () use ($org, $location, $stored, $request, $isPrimary) {
            if ($isPrimary) {
                LocationMedia::where('location_id', $location->id)->update(['is_primary' => false]);
            }

            $maxOrder = LocationMedia::where('location_id', $location->id)->max('sort_order') ?? 0;

            return LocationMedia::create([
                'organization_id' => $org->id,
                'location_id' => $location->id,
                'file_url' => $this->mediaStorage->getUrl($stored->storagePath, $stored->storageDisk),
                'file_name' => $stored->fileName,
                'original_filename' => $stored->originalFilename,
                'mime_type' => $stored->mimeType,
                'file_size' => $stored->fileSize,
                'width' => $stored->width,
                'height' => $stored->height,
                'storage_disk' => $stored->storageDisk,
                'storage_path' => $stored->storagePath,
                'original_path' => $stored->originalPath,
                'thumbnail_path' => $stored->thumbnailPath,
                'alt_text' => $request->input('alt_text'),
                'caption' => $request->input('caption'),
                'is_primary' => $isPrimary,
                'sort_order' => $maxOrder + 1,
                'media_type' => $request->input('media_type', LocationMediaType::SITE_PHOTO->value),
            ]);
        });

        return (new LocationMediaResource($media))
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Show a single media asset for a location.
     */
    public function show(string $locationUuid, string $mediaUuid): LocationMediaResource
    {
        $location = $this->findLocation($locationUuid);
        $media = $this->findMedia($location, $mediaUuid);

        Gate::authorize('view', $media);

        return new LocationMediaResource($media);
    }

    /**
     * Update metadata, primary flag, or sort order for a media asset.
     */
    public function update(UpdateLocationMediaRequest $request, string $locationUuid, string $mediaUuid): LocationMediaResource
    {
        $location = $this->findLocation($locationUuid);
        $media = $this->findMedia($location, $mediaUuid);

        Gate::authorize('update', [$media, $request->has('is_primary')]);

        DB::transaction(function () use ($location, $media, $request) {
            if ($request->has('is_primary')) {
                if ($request->boolean('is_primary')) {
                    LocationMedia::where('location_id', $location->id)
                        ->where('id', '!=', $media->id)
                        ->update(['is_primary' => false]);
                    $media->is_primary = true;
                } else {
                    // Cannot unset primary if it's the only image
                    $otherCount = LocationMedia::where('location_id', $location->id)
                        ->where('id', '!=', $media->id)
                        ->count();
                    if ($otherCount > 0) {
                        $media->is_primary = false;
                    }
                }
            }

            if ($request->filled('alt_text')) {
                $media->alt_text = $request->input('alt_text');
            } elseif ($request->has('alt_text')) {
                $media->alt_text = null;
            }

            if ($request->filled('caption')) {
                $media->caption = $request->input('caption');
            } elseif ($request->has('caption')) {
                $media->caption = null;
            }

            if ($request->filled('media_type')) {
                $media->media_type = $request->input('media_type');
            }

            if ($request->filled('sort_order')) {
                $media->sort_order = (int) $request->input('sort_order');
            }

            $media->save();
        });

        return new LocationMediaResource($media->fresh());
    }

    /**
     * Batch reorder gallery images for a location.
     */
    public function reorder(ReorderMediaRequest $request, string $locationUuid): JsonResponse
    {
        $location = $this->findLocation($locationUuid);
        Gate::authorize('reorder', [LocationMedia::class, $location]);

        $items = $request->input('items', []);

        DB::transaction(function () use ($location, $items) {
            foreach ($items as $item) {
                LocationMedia::where('location_id', $location->id)
                    ->where('uuid', $item['uuid'])
                    ->update(['sort_order' => $item['sort_order']]);
            }
        });

        $updatedMedia = $location->media()
            ->orderBy('sort_order', 'asc')
            ->orderBy('id', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Gallery reordered successfully.',
            'data' => LocationMediaResource::collection($updatedMedia),
        ]);
    }

    /**
     * Soft delete a media asset.
     */
    public function destroy(string $locationUuid, string $mediaUuid): JsonResponse
    {
        $location = $this->findLocation($locationUuid);
        $media = $this->findMedia($location, $mediaUuid);

        Gate::authorize('delete', $media);

        DB::transaction(function () use ($location, $media) {
            $wasPrimary = $media->is_primary;
            $media->delete();

            // Auto-promote next available photo if primary was deleted
            if ($wasPrimary) {
                $next = LocationMedia::where('location_id', $location->id)
                    ->orderBy('sort_order', 'asc')
                    ->orderBy('id', 'asc')
                    ->first();

                if ($next) {
                    $next->update(['is_primary' => true]);
                }
            }
        });

        return response()->json([
            'success' => true,
            'message' => 'Media asset deleted successfully.',
        ]);
    }

    /**
     * Find location by UUID in active tenant context.
     */
    protected function findLocation(string $uuid): Location
    {
        return Location::where('uuid', $uuid)->firstOrFail();
    }

    /**
     * Find media asset for a location.
     */
    protected function findMedia(Location $location, string $mediaUuid): LocationMedia
    {
        return LocationMedia::where('location_id', $location->id)
            ->where('uuid', $mediaUuid)
            ->firstOrFail();
    }
}
