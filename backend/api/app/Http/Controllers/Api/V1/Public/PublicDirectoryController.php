<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Controllers\Controller;
use App\Http\Requests\Public\StoreDirectoryLeadRequest;
use App\Http\Resources\Public\PublicDirectoryOverviewResource;
use App\Http\Resources\Public\PublicProviderResource;
use App\Http\Resources\Public\PublicResourceListResource;
use App\Http\Traits\ApiResponse;
use App\Models\DirectoryLead;
use App\Services\Directory\PublicDirectoryQueryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PublicDirectoryController extends Controller
{
    use ApiResponse;

    protected PublicDirectoryQueryService $directoryQueryService;

    public function __construct(PublicDirectoryQueryService $directoryQueryService)
    {
        $this->directoryQueryService = $directoryQueryService;
    }

    /**
     * Public directory overview & discovery highlights.
     */
    public function overview(Request $request): JsonResponse
    {
        $orgQuery = $this->directoryQueryService->queryOrganizations();
        $resQuery = $this->directoryQueryService->queryResources();
        $locQuery = $this->directoryQueryService->queryLocations();

        $verifiedProvidersCount = $orgQuery->count();
        $activeResourcesCount = $resQuery->count();
        $activeLocationsCount = $locQuery->count();

        // Distinct cities with active inventory
        $coveredCities = (clone $locQuery)
            ->whereNotNull('city')
            ->distinct()
            ->pluck('city');

        // Recent verified providers
        $recentProviders = (clone $orgQuery)
            ->withCount(['advertisingResources' => function ($q) {
                $q->where('status', 'ACTIVE');
            }])
            ->orderByDesc('verified_at')
            ->limit(6)
            ->get();

        // Featured resources (with media and location loaded)
        $featuredResources = (clone $resQuery)
            ->with([
                'location',
                'organization',
                'media' => fn($q) => $q->orderBy('sort_order')->orderBy('id'),
            ])
            ->latest()
            ->limit(8)
            ->get();

        $data = [
            'verified_providers_count' => $verifiedProvidersCount,
            'active_resources_count' => $activeResourcesCount,
            'active_locations_count' => $activeLocationsCount,
            'covered_cities_count' => $coveredCities->count(),
            'featured_cities' => $coveredCities->take(10)->values()->all(),
            'recent_providers' => $recentProviders,
            'featured_resources' => $featuredResources,
        ];

        return $this->successResponse(
            new PublicDirectoryOverviewResource($data),
            'Public directory overview retrieved successfully.'
        );
    }

    /**
     * List verified outdoor advertising providers.
     */
    public function providers(Request $request): JsonResponse
    {
        $query = $this->directoryQueryService->queryOrganizations()
            ->withCount(['advertisingResources' => function ($q) {
                $q->where('status', 'ACTIVE');
            }]);

        if ($request->filled('city')) {
            $city = $request->query('city');
            $query->where(function ($q) use ($city) {
                $q->where('city', 'like', "%{$city}%")
                    ->orWhereJsonContains('settings->operational_cities', $city);
            });
        }

        if ($request->filled('search')) {
            $search = $request->query('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('city', 'like', "%{$search}%")
                    ->orWhere('business_description', 'like', "%{$search}%");
            });
        }

        $perPage = min(max((int) $request->query('per_page', 12), 1), 50);
        $providers = $query->orderBy('name')->paginate($perPage);

        return $this->successResponse([
            'items' => PublicProviderResource::collection($providers),
            'pagination' => [
                'total' => $providers->total(),
                'per_page' => $providers->perPage(),
                'current_page' => $providers->currentPage(),
                'last_page' => $providers->lastPage(),
            ],
        ], 'Verified providers retrieved successfully.');
    }

    /**
     * View single verified provider profile.
     */
    public function providerProfile(string $slug): JsonResponse
    {
        $provider = $this->directoryQueryService->findProvider($slug);
        $provider->loadCount(['advertisingResources' => function ($q) {
            $q->where('status', 'ACTIVE');
        }]);

        return $this->successResponse(
            new PublicProviderResource($provider),
            'Provider profile retrieved successfully.'
        );
    }

    /**
     * List active inventory of a single verified provider.
     */
    public function providerInventory(Request $request, string $slug): JsonResponse
    {
        $provider = $this->directoryQueryService->findProvider($slug);

        $query = $this->directoryQueryService->queryResources()
            ->where('advertising_resources.organization_id', $provider->id)
            ->with([
                'location',
                'organization',
                'media' => fn($q) => $q->orderBy('sort_order')->orderBy('id'),
            ]);

        if ($request->filled('category')) {
            $query->where('advertising_resources.category', $request->query('category'));
        }

        if ($request->filled('type')) {
            $query->where('advertising_resources.resource_type', $request->query('type'));
        }

        if ($request->filled('city')) {
            $city = $request->query('city');
            $query->whereHas('location', fn($q) => $q->where('city', $city));
        }

        $perPage = min(max((int) $request->query('per_page', 12), 1), 50);
        $resources = $query->latest('advertising_resources.id')->paginate($perPage);

        return $this->successResponse([
            'items' => PublicResourceListResource::collection($resources),
            'pagination' => [
                'total' => $resources->total(),
                'per_page' => $resources->perPage(),
                'current_page' => $resources->currentPage(),
                'last_page' => $resources->lastPage(),
            ],
        ], 'Provider inventory retrieved successfully.');
    }

    /**
     * Submit general inquiry to a provider.
     */
    public function contactProvider(StoreDirectoryLeadRequest $request, string $slug): JsonResponse
    {
        $provider = $this->directoryQueryService->findProvider($slug);

        $validated = $request->validated();
        unset($validated['hp_field']);

        $lead = DirectoryLead::create([
            ...$validated,
            'organization_id' => $provider->id,
            'advertising_resource_id' => null,
            'location_id' => null,
            'source' => 'PUBLIC_DIRECTORY',
            'ip_address' => $request->ip(),
            'user_agent' => substr((string) $request->userAgent(), 0, 255),
        ]);

        return $this->successResponse(
            [
                'lead_uuid' => $lead->uuid,
                'provider_name' => $provider->name,
            ],
            'Your inquiry has been submitted directly to the provider.',
            201
        );
    }
}
