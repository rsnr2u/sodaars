<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Controllers\Controller;
use App\Http\Requests\Public\StoreDirectoryLeadRequest;
use App\Http\Resources\Public\PublicResourceDetailResource;
use App\Http\Resources\Public\PublicResourceListResource;
use App\Http\Resources\Public\PublicResourceMapResource;
use App\Http\Traits\ApiResponse;
use App\Models\DirectoryLead;
use App\Services\Directory\PublicDirectoryQueryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PublicResourceController extends Controller
{
    use ApiResponse;

    protected PublicDirectoryQueryService $directoryQueryService;

    public function __construct(PublicDirectoryQueryService $directoryQueryService)
    {
        $this->directoryQueryService = $directoryQueryService;
    }

    /**
     * Search and discover advertising resources with faceted filters.
     */
    public function index(Request $request): JsonResponse
    {
        $query = $this->directoryQueryService->queryResources()
            ->with([
                'location',
                'organization',
                'media' => fn($q) => $q->orderBy('sort_order')->orderBy('id'),
            ]);

        // City filter
        if ($request->filled('city')) {
            $city = $request->query('city');
            $query->whereHas('location', fn($q) => $q->where('city', $city));
        }

        // State filter
        if ($request->filled('state')) {
            $state = $request->query('state');
            $query->whereHas('location', fn($q) => $q->where('state', $state));
        }

        // Category filter (STATIC / DIGITAL)
        if ($request->filled('category')) {
            $query->where('advertising_resources.category', $request->query('category'));
        }

        // Resource type filter
        if ($request->filled('type')) {
            $query->where('advertising_resources.resource_type', $request->query('type'));
        }

        // Illumination filter
        if ($request->filled('illumination')) {
            $query->where('advertising_resources.illumination_type', $request->query('illumination'));
        }

        // Area filters (width * height in sqft)
        if ($request->filled('min_area')) {
            $minArea = (float) $request->query('min_area');
            $query->whereRaw("(advertising_resources.width * advertising_resources.height) >= {$minArea}");
        }

        if ($request->filled('max_area')) {
            $maxArea = (float) $request->query('max_area');
            $query->whereRaw("(advertising_resources.width * advertising_resources.height) <= {$maxArea}");
        }

        // Keyword search across resource and location
        if ($request->filled('search')) {
            $search = $request->query('search');
            $query->where(function ($q) use ($search) {
                $q->where('advertising_resources.name', 'like', "%{$search}%")
                    ->orWhere('advertising_resources.code', 'like', "%{$search}%")
                    ->orWhereHas('location', function ($locQ) use ($search) {
                        $locQ->where('name', 'like', "%{$search}%")
                            ->orWhere('city', 'like', "%{$search}%")
                            ->orWhere('area', 'like', "%{$search}%")
                            ->orWhere('landmark', 'like', "%{$search}%");
                    });
            });
        }

        // Sorting
        $sort = $request->query('sort', 'latest');
        match ($sort) {
            'price_low' => $query->orderBy('base_price_monthly', 'asc'),
            'price_high' => $query->orderBy('base_price_monthly', 'desc'),
            'area_desc' => $query->orderByRaw('(advertising_resources.width * advertising_resources.height) desc'),
            default => $query->latest('advertising_resources.id'),
        };

        $perPage = min(max((int) $request->query('per_page', 12), 1), 50);
        $resources = $query->paginate($perPage);

        return $this->successResponse([
            'items' => PublicResourceListResource::collection($resources),
            'pagination' => [
                'total' => $resources->total(),
                'per_page' => $resources->perPage(),
                'current_page' => $resources->currentPage(),
                'last_page' => $resources->lastPage(),
            ],
        ], 'Advertising resources retrieved successfully.');
    }

    /**
     * Lightweight geo feed for interactive map discovery.
     */
    public function map(Request $request): JsonResponse
    {
        $query = $this->directoryQueryService->queryResources()
            ->with([
                'location',
                'organization',
                'media' => fn($q) => $q->orderBy('sort_order')->orderBy('id'),
            ])
            ->whereHas('location', function ($q) {
                $q->whereNotNull('latitude')->whereNotNull('longitude');
            });

        if ($request->filled('city')) {
            $city = $request->query('city');
            $query->whereHas('location', fn($q) => $q->where('city', $city));
        }

        if ($request->filled('category')) {
            $query->where('advertising_resources.category', $request->query('category'));
        }

        if ($request->filled('type')) {
            $query->where('advertising_resources.resource_type', $request->query('type'));
        }

        // Limit map markers to avoid payload explosion
        $limit = min(max((int) $request->query('limit', 200), 1), 500);
        $resources = $query->limit($limit)->get();

        return $this->successResponse(
            PublicResourceMapResource::collection($resources),
            'Map resource points retrieved successfully.'
        );
    }

    /**
     * View detailed advertising resource specs, photos, and indicative rate.
     */
    public function show(string $slugOrUuid): JsonResponse
    {
        $resource = $this->directoryQueryService->findResource($slugOrUuid);

        return $this->successResponse(
            new PublicResourceDetailResource($resource),
            'Advertising resource details retrieved successfully.'
        );
    }

    /**
     * Submit inquiry for a specific advertising resource face.
     * Captures historical context snapshots.
     */
    public function contact(StoreDirectoryLeadRequest $request, string $slugOrUuid): JsonResponse
    {
        $resource = $this->directoryQueryService->findResource($slugOrUuid);

        $validated = $request->validated();
        unset($validated['hp_field']);

        $lead = DirectoryLead::create([
            ...$validated,
            'organization_id' => $resource->organization_id,
            'advertising_resource_id' => $resource->id,
            'location_id' => $resource->location_id,
            'resource_name_snapshot' => $resource->name,
            'resource_code_snapshot' => $resource->code,
            'resource_uuid_snapshot' => $resource->uuid,
            'location_name_snapshot' => $resource->location?->name,
            'location_area_snapshot' => $resource->location?->area ?: $resource->location?->city,
            'location_uuid_snapshot' => $resource->location?->uuid,
            'source' => 'PUBLIC_DIRECTORY',
            'ip_address' => $request->ip(),
            'user_agent' => substr((string) $request->userAgent(), 0, 255),
        ]);

        return $this->successResponse(
            [
                'lead_uuid' => $lead->uuid,
                'resource_name' => $resource->name,
                'provider_name' => $resource->organization?->name,
            ],
            'Your inquiry has been submitted directly to the provider.',
            201
        );
    }
}
