<?php

namespace App\Services;

use App\Enums\LocationStatus;
use App\Models\Location;
use App\Models\Organization;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Validation\ValidationException;

class LocationService
{
    /**
     * List locations for an organization with searching, filtering, and pagination.
     */
    public function listLocations(Organization $organization, array $filters = []): LengthAwarePaginator
    {
        $query = Location::where('organization_id', $organization->id)
            ->with(['createdByUser', 'media']);

        // Search across key text fields
        if (! empty($filters['search'])) {
            $search = trim($filters['search']);
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%")
                    ->orWhere('city', 'like', "%{$search}%")
                    ->orWhere('area', 'like', "%{$search}%")
                    ->orWhere('locality', 'like', "%{$search}%")
                    ->orWhere('landmark', 'like', "%{$search}%");
            });
        }

        // Filter by status
        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        // Filter by city
        if (! empty($filters['city'])) {
            $query->where('city', $filters['city']);
        }

        // Filter by district
        if (! empty($filters['district'])) {
            $query->where('district', $filters['district']);
        }

        // Filter by state
        if (! empty($filters['state'])) {
            $query->where('state', $filters['state']);
        }

        // Sorting
        $allowedSorts = ['name', 'code', 'city', 'state', 'status', 'created_at'];
        $sortBy = in_array($filters['sort_by'] ?? '', $allowedSorts, true) ? $filters['sort_by'] : 'created_at';
        $sortDir = strtolower($filters['sort_dir'] ?? 'desc') === 'asc' ? 'asc' : 'desc';
        $query->orderBy($sortBy, $sortDir);

        // Pagination
        $perPage = min(max((int) ($filters['per_page'] ?? 15), 1), 100);

        return $query->paginate($perPage);
    }

    /**
     * Create a new location record for an organization.
     */
    public function createLocation(Organization $organization, User $user, array $data): Location
    {
        // Enforce tenant boundary and creator attribution
        $data['organization_id'] = $organization->id;
        $data['created_by_user_id'] = $user->id;
        $data['country'] = $data['country'] ?? 'India';
        $data['status'] = $data['status'] ?? LocationStatus::ACTIVE->value;

        return Location::create($data)->load(['createdByUser', 'media']);
    }

    /**
     * Update an existing location record.
     */
    public function updateLocation(Location $location, array $data): Location
    {
        // Prevent spoofing immutable fields
        unset($data['organization_id'], $data['uuid'], $data['id'], $data['created_by_user_id']);

        $location->update($data);

        return $location->fresh(['createdByUser', 'media']);
    }

    /**
     * Soft delete a location record.
     * Guard: Location with existing advertising resources cannot be deleted.
     */
    public function deleteLocation(Location $location): void
    {
        if ($location->advertisingResources()->exists()) {
            throw ValidationException::withMessages([
                'location' => ['Cannot delete location because advertising resources are attached to it.'],
            ]);
        }

        $location->delete();
    }
}
