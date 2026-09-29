<?php

namespace App\Http\Controllers\Api\V1\Tenant;

use App\Http\Controllers\Controller;
use App\Http\Requests\Tenant\StoreLocationRequest;
use App\Http\Requests\Tenant\UpdateLocationRequest;
use App\Http\Resources\LocationResource;
use App\Http\Traits\ApiResponse;
use App\Models\Location;
use App\Services\LocationService;
use App\Services\Tenant\TenantContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class LocationController extends Controller
{
    use ApiResponse;

    protected TenantContext $tenantContext;
    protected LocationService $locationService;

    public function __construct(TenantContext $tenantContext, LocationService $locationService)
    {
        $this->tenantContext = $tenantContext;
        $this->locationService = $locationService;
    }

    /**
     * List locations belonging to active tenant.
     */
    public function index(Request $request): JsonResponse
    {
        $organization = $this->tenantContext->getTenant();
        Gate::authorize('viewAny', [Location::class, $organization]);

        $locations = $this->locationService->listLocations($organization, $request->all());

        return $this->successResponse([
            'items' => LocationResource::collection($locations),
            'pagination' => [
                'total' => $locations->total(),
                'per_page' => $locations->perPage(),
                'current_page' => $locations->currentPage(),
                'last_page' => $locations->lastPage(),
            ],
        ], 'Locations retrieved successfully.');
    }

    /**
     * Create a new location for the active tenant.
     */
    public function store(StoreLocationRequest $request): JsonResponse
    {
        $organization = $this->tenantContext->getTenant();
        Gate::authorize('create', [Location::class, $organization]);

        $location = $this->locationService->createLocation(
            $organization,
            $request->user(),
            $request->validated()
        );

        return $this->successResponse(
            new LocationResource($location),
            'Location created successfully.',
            201
        );
    }

    /**
     * Display the specified location details by UUID.
     */
    public function show(string $uuid): JsonResponse
    {
        $location = Location::where('uuid', $uuid)
            ->with(['createdByUser', 'media'])
            ->first();

        if (! $location) {
            return $this->errorResponse('Location not found.', null, 404);
        }

        Gate::authorize('view', $location);

        return $this->successResponse(
            new LocationResource($location),
            'Location details retrieved successfully.'
        );
    }

    /**
     * Update the specified location by UUID.
     */
    public function update(UpdateLocationRequest $request, string $uuid): JsonResponse
    {
        $location = Location::where('uuid', $uuid)->first();

        if (! $location) {
            return $this->errorResponse('Location not found.', null, 404);
        }

        Gate::authorize('update', $location);

        $updatedLocation = $this->locationService->updateLocation($location, $request->validated());

        return $this->successResponse(
            new LocationResource($updatedLocation),
            'Location updated successfully.'
        );
    }

    /**
     * Soft-delete the specified location by UUID.
     */
    public function destroy(string $uuid): JsonResponse
    {
        $location = Location::where('uuid', $uuid)->first();

        if (! $location) {
            return $this->errorResponse('Location not found.', null, 404);
        }

        Gate::authorize('delete', $location);

        $this->locationService->deleteLocation($location);

        return $this->successResponse(null, 'Location deleted successfully.');
    }
}
