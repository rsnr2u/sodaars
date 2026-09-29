<?php

namespace App\Http\Controllers\Api\V1\Tenant;

use App\Http\Controllers\Controller;
use App\Http\Requests\Tenant\StoreAdvertisingResourceRequest;
use App\Http\Requests\Tenant\UpdateAdvertisingResourceRequest;
use App\Http\Resources\AdvertisingResourceResource;
use App\Http\Traits\ApiResponse;
use App\Models\AdvertisingResource;
use App\Services\AdvertisingResourceService;
use App\Services\Tenant\TenantContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class AdvertisingResourceController extends Controller
{
    use ApiResponse;

    protected TenantContext $tenantContext;
    protected AdvertisingResourceService $resourceService;

    public function __construct(TenantContext $tenantContext, AdvertisingResourceService $resourceService)
    {
        $this->tenantContext = $tenantContext;
        $this->resourceService = $resourceService;
    }

    /**
     * List advertising resources belonging to the active tenant.
     */
    public function index(Request $request): JsonResponse
    {
        $organization = $this->tenantContext->getTenant();
        Gate::authorize('viewAny', [AdvertisingResource::class, $organization]);

        $resources = $this->resourceService->listResources($organization, $request->all());

        return $this->successResponse([
            'items' => AdvertisingResourceResource::collection($resources),
            'pagination' => [
                'total' => $resources->total(),
                'per_page' => $resources->perPage(),
                'current_page' => $resources->currentPage(),
                'last_page' => $resources->lastPage(),
            ],
        ], 'Advertising resources retrieved successfully.');
    }

    /**
     * Create a new advertising resource face for the active tenant.
     */
    public function store(StoreAdvertisingResourceRequest $request): JsonResponse
    {
        $organization = $this->tenantContext->getTenant();
        Gate::authorize('create', [AdvertisingResource::class, $organization]);

        $resource = $this->resourceService->createResource(
            $organization,
            $request->user(),
            $request->validated()
        );

        return $this->successResponse(
            new AdvertisingResourceResource($resource),
            'Advertising resource created successfully.',
            201
        );
    }

    /**
     * Display the specified advertising resource details by UUID.
     */
    public function show(string $uuid): JsonResponse
    {
        $resource = AdvertisingResource::where('uuid', $uuid)
            ->with(['location', 'createdByUser', 'media'])
            ->first();

        if (! $resource) {
            return $this->errorResponse('Advertising resource not found.', null, 404);
        }

        Gate::authorize('view', $resource);

        return $this->successResponse(
            new AdvertisingResourceResource($resource),
            'Advertising resource details retrieved successfully.'
        );
    }

    /**
     * Update the specified advertising resource by UUID.
     */
    public function update(UpdateAdvertisingResourceRequest $request, string $uuid): JsonResponse
    {
        $resource = AdvertisingResource::where('uuid', $uuid)->first();

        if (! $resource) {
            return $this->errorResponse('Advertising resource not found.', null, 404);
        }

        Gate::authorize('update', $resource);

        $updatedResource = $this->resourceService->updateResource($resource, $request->validated());

        return $this->successResponse(
            new AdvertisingResourceResource($updatedResource),
            'Advertising resource updated successfully.'
        );
    }

    /**
     * Soft-delete the specified advertising resource by UUID.
     */
    public function destroy(string $uuid): JsonResponse
    {
        $resource = AdvertisingResource::where('uuid', $uuid)->first();

        if (! $resource) {
            return $this->errorResponse('Advertising resource not found.', null, 404);
        }

        Gate::authorize('delete', $resource);

        $this->resourceService->deleteResource($resource);

        return $this->successResponse(null, 'Advertising resource deleted successfully.');
    }
}
