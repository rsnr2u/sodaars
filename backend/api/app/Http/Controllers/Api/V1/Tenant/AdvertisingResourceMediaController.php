<?php

namespace App\Http\Controllers\Api\V1\Tenant;

use App\Contracts\MediaStorageInterface;
use App\Enums\ResourceMediaType;
use App\Http\Controllers\Controller;
use App\Http\Requests\Tenant\ReorderMediaRequest;
use App\Http\Requests\Tenant\StoreResourceMediaRequest;
use App\Http\Requests\Tenant\UpdateResourceMediaRequest;
use App\Http\Resources\AdvertisingResourceMediaResource;
use App\Models\AdvertisingResource;
use App\Models\AdvertisingResourceMedia;
use App\Services\Media\ImageProcessorService;
use App\Services\Tenant\TenantContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;

class AdvertisingResourceMediaController extends Controller
{
    public function __construct(
        protected ImageProcessorService $imageProcessor,
        protected MediaStorageInterface $mediaStorage,
        protected TenantContext $tenantContext
    ) {}

    /**
     * List all media assets for an advertising resource face.
     */
    public function index(Request $request, string $resourceUuid): AnonymousResourceCollection
    {
        $resource = $this->findResource($resourceUuid);
        Gate::authorize('viewAny', [AdvertisingResourceMedia::class, $resource]);

        $query = $resource->media();

        if ($request->filled('media_type')) {
            $query->where('media_type', $request->input('media_type'));
        }

        $media = $query->orderBy('is_primary', 'desc')
            ->orderBy('sort_order', 'asc')
            ->orderBy('id', 'asc')
            ->get();

        return AdvertisingResourceMediaResource::collection($media);
    }

    /**
     * Upload and process a new media asset for an advertising resource.
     */
    public function store(StoreResourceMediaRequest $request, string $resourceUuid): JsonResponse
    {
        $resource = $this->findResource($resourceUuid);
        Gate::authorize('upload', [AdvertisingResourceMedia::class, $resource]);

        $org = $this->tenantContext->getTenant();

        // 1. Validate & process image into display and thumbnail versions
        $processed = $this->imageProcessor->process($request->file('file'));

        // 2. Store on disk under tenant-isolated path
        $stored = $this->mediaStorage->storeResourceMedia($org, $resource, $processed);

        // 3. Determine primary status (first photo automatically becomes primary)
        $existingCount = AdvertisingResourceMedia::where('advertising_resource_id', $resource->id)->count();
        $isPrimary = $request->boolean('is_primary') || $existingCount === 0;

        $media = DB::transaction(function () use ($org, $resource, $stored, $request, $isPrimary) {
            if ($isPrimary) {
                AdvertisingResourceMedia::where('advertising_resource_id', $resource->id)->update(['is_primary' => false]);
            }

            $maxOrder = AdvertisingResourceMedia::where('advertising_resource_id', $resource->id)->max('sort_order') ?? 0;

            return AdvertisingResourceMedia::create([
                'organization_id' => $org->id,
                'advertising_resource_id' => $resource->id,
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
                'media_type' => $request->input('media_type', ResourceMediaType::DAY_PHOTO->value),
            ]);
        });

        return (new AdvertisingResourceMediaResource($media))
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Show a single media asset for an advertising resource.
     */
    public function show(string $resourceUuid, string $mediaUuid): AdvertisingResourceMediaResource
    {
        $resource = $this->findResource($resourceUuid);
        $media = $this->findMedia($resource, $mediaUuid);

        Gate::authorize('view', $media);

        return new AdvertisingResourceMediaResource($media);
    }

    /**
     * Update metadata, primary flag, or sort order for a media asset.
     */
    public function update(UpdateResourceMediaRequest $request, string $resourceUuid, string $mediaUuid): AdvertisingResourceMediaResource
    {
        $resource = $this->findResource($resourceUuid);
        $media = $this->findMedia($resource, $mediaUuid);

        Gate::authorize('update', [$media, $request->has('is_primary')]);

        DB::transaction(function () use ($resource, $media, $request) {
            if ($request->has('is_primary')) {
                if ($request->boolean('is_primary')) {
                    AdvertisingResourceMedia::where('advertising_resource_id', $resource->id)
                        ->where('id', '!=', $media->id)
                        ->update(['is_primary' => false]);
                    $media->is_primary = true;
                } else {
                    // Cannot unset primary if it's the only image
                    $otherCount = AdvertisingResourceMedia::where('advertising_resource_id', $resource->id)
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

        return new AdvertisingResourceMediaResource($media->fresh());
    }

    /**
     * Batch reorder gallery images for an advertising resource.
     */
    public function reorder(ReorderMediaRequest $request, string $resourceUuid): JsonResponse
    {
        $resource = $this->findResource($resourceUuid);
        Gate::authorize('reorder', [AdvertisingResourceMedia::class, $resource]);

        $items = $request->input('items', []);

        DB::transaction(function () use ($resource, $items) {
            foreach ($items as $item) {
                AdvertisingResourceMedia::where('advertising_resource_id', $resource->id)
                    ->where('uuid', $item['uuid'])
                    ->update(['sort_order' => $item['sort_order']]);
            }
        });

        $updatedMedia = $resource->media()
            ->orderBy('sort_order', 'asc')
            ->orderBy('id', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Gallery reordered successfully.',
            'data' => AdvertisingResourceMediaResource::collection($updatedMedia),
        ]);
    }

    /**
     * Soft delete a media asset.
     */
    public function destroy(string $resourceUuid, string $mediaUuid): JsonResponse
    {
        $resource = $this->findResource($resourceUuid);
        $media = $this->findMedia($resource, $mediaUuid);

        Gate::authorize('delete', $media);

        DB::transaction(function () use ($resource, $media) {
            $wasPrimary = $media->is_primary;
            $media->delete();

            // Auto-promote next available photo if primary was deleted
            if ($wasPrimary) {
                $next = AdvertisingResourceMedia::where('advertising_resource_id', $resource->id)
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
     * Find resource by UUID in active tenant context.
     */
    protected function findResource(string $uuid): AdvertisingResource
    {
        return AdvertisingResource::where('uuid', $uuid)->firstOrFail();
    }

    /**
     * Find media asset for a resource.
     */
    protected function findMedia(AdvertisingResource $resource, string $mediaUuid): AdvertisingResourceMedia
    {
        return AdvertisingResourceMedia::where('advertising_resource_id', $resource->id)
            ->where('uuid', $mediaUuid)
            ->firstOrFail();
    }
}
