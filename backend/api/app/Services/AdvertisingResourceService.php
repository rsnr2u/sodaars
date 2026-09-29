<?php

namespace App\Services;

use App\Enums\ResourceCategory;
use App\Enums\ResourceStatus;
use App\Models\AdvertisingResource;
use App\Models\Location;
use App\Models\Organization;
use App\Models\User;
use App\Services\Subscription\ResourceQuotaService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Validation\ValidationException;

class AdvertisingResourceService
{
    protected ResourceQuotaService $quotaService;

    public function __construct(ResourceQuotaService $quotaService)
    {
        $this->quotaService = $quotaService;
    }

    /**
     * List advertising resources for an organization with searching, filtering, and pagination.
     */
    public function listResources(Organization $organization, array $filters = []): LengthAwarePaginator
    {
        $query = AdvertisingResource::where('organization_id', $organization->id)
            ->with(['location', 'createdByUser', 'media']);

        // Search across name, code, direction, traffic_flow, or hosted location
        if (! empty($filters['search'])) {
            $search = trim($filters['search']);
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%")
                    ->orWhere('direction', 'like', "%{$search}%")
                    ->orWhere('traffic_flow', 'like', "%{$search}%")
                    ->orWhereHas('location', function ($locQ) use ($search) {
                        $locQ->where('name', 'like', "%{$search}%")
                            ->orWhere('code', 'like', "%{$search}%")
                            ->orWhere('city', 'like', "%{$search}%");
                    });
            });
        }

        // Filter by location UUID
        if (! empty($filters['location_uuid'])) {
            $query->whereHas('location', function ($locQ) use ($filters) {
                $locQ->where('uuid', $filters['location_uuid']);
            });
        }

        // Filter by location ID
        if (! empty($filters['location_id'])) {
            $query->where('location_id', $filters['location_id']);
        }

        // Filter by resource type
        if (! empty($filters['resource_type'])) {
            $query->where('resource_type', $filters['resource_type']);
        }

        // Filter by category (STATIC / DIGITAL)
        if (! empty($filters['category'])) {
            $query->where('category', $filters['category']);
        }

        // Filter by status (ACTIVE, INACTIVE, UNDER_MAINTENANCE, UNDER_REVIEW)
        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        // Filter by illumination type
        if (! empty($filters['illumination_type'])) {
            $query->where('illumination_type', $filters['illumination_type']);
        }

        // Sorting
        $allowedSorts = ['id', 'name', 'code', 'base_price_monthly', 'created_at', 'status', 'face_number'];
        $sortBy = in_array($filters['sort_by'] ?? '', $allowedSorts, true) ? $filters['sort_by'] : 'created_at';
        $sortOrder = strtolower($filters['sort_order'] ?? 'desc') === 'asc' ? 'asc' : 'desc';
        $query->orderBy($sortBy, $sortOrder);

        // Pagination
        $perPage = min(max((int) ($filters['per_page'] ?? 15), 1), 100);

        return $query->paginate($perPage);
    }

    /**
     * Create a new advertising resource face for an organization.
     */
    public function createResource(Organization $organization, User $user, array $data): AdvertisingResource
    {
        // 1. Subscription Safety: Block creation if no valid active subscription exists
        if (! $this->quotaService->hasActiveSubscription($organization)) {
            throw ValidationException::withMessages([
                'subscription' => ['No active subscription found for this organization. A valid subscription is required to create resources.'],
            ]);
        }

        // 2. Resolve target status (defaults to ACTIVE)
        $status = $data['status'] ?? ResourceStatus::ACTIVE->value;

        // 3. Quota Enforcement: Only ACTIVE resources consume plan capacity
        if ($status === ResourceStatus::ACTIVE->value && ! $this->quotaService->canCreateResource($organization)) {
            $limit = $this->quotaService->getResourceLimit($organization);
            throw ValidationException::withMessages([
                'quota' => ["Active resource quota reached for your subscription plan (limit: {$limit}). Please upgrade your subscription to add more active resources."],
            ]);
        }

        // 4. Resolve Location by UUID (must belong to this organization)
        if (! empty($data['location_uuid'])) {
            $location = Location::where('organization_id', $organization->id)
                ->where('uuid', $data['location_uuid'])
                ->firstOrFail();

            $data['location_id'] = $location->id;
            unset($data['location_uuid']);
        }

        // 5. Enforce tenant boundary and audit attribution
        $data['organization_id'] = $organization->id;
        $data['created_by_user_id'] = $user->id;
        $data['status'] = $status;
        $data['dimension_unit'] = $data['dimension_unit'] ?? 'FEET';
        $data['currency'] = $data['currency'] ?? 'INR';

        return AdvertisingResource::create($data)->load(['location', 'createdByUser', 'media']);
    }

    /**
     * Update an existing advertising resource.
     */
    public function updateResource(AdvertisingResource $resource, array $data): AdvertisingResource
    {
        // Prevent spoofing immutable identifiers
        unset($data['organization_id'], $data['uuid'], $data['id'], $data['created_by_user_id']);

        // Resolve location update if specified
        if (! empty($data['location_uuid'])) {
            $location = Location::where('organization_id', $resource->organization_id)
                ->where('uuid', $data['location_uuid'])
                ->firstOrFail();

            $data['location_id'] = $location->id;
            unset($data['location_uuid']);
        }

        // Quota Reactivation Protection: Changing to ACTIVE from a non-active state must respect quota
        if (isset($data['status'])) {
            $newStatus = $data['status'];
            $isCurrentlyActive = $resource->status === ResourceStatus::ACTIVE;

            if ($newStatus === ResourceStatus::ACTIVE->value && ! $isCurrentlyActive) {
                if (! $this->quotaService->canActivateResource($resource->organization)) {
                    $limit = $this->quotaService->getResourceLimit($resource->organization);
                    throw ValidationException::withMessages([
                        'status' => ["Cannot activate resource. Active resource quota reached for your subscription plan (limit: {$limit}). Please upgrade your subscription."],
                    ]);
                }
            }
        }

        $resource->update($data);

        return $resource->fresh(['location', 'createdByUser', 'media']);
    }

    /**
     * Soft delete an advertising resource.
     */
    public function deleteResource(AdvertisingResource $resource): void
    {
        $resource->delete();
    }
}
