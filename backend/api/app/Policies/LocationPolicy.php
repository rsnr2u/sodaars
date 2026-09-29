<?php

namespace App\Policies;

use App\Models\Location;
use App\Models\Organization;
use App\Models\User;
use App\Services\Permission\PermissionService;

class LocationPolicy
{
    protected PermissionService $permissionService;

    public function __construct(PermissionService $permissionService)
    {
        $this->permissionService = $permissionService;
    }

    /**
     * Determine whether the user can view any locations of an organization.
     */
    public function viewAny(User $user, Organization $organization): bool
    {
        if ($user->isPlatformStaff()) {
            return true;
        }

        return $this->permissionService->userHasPermission($user, $organization, 'location.view');
    }

    /**
     * Determine whether the user can view the location.
     */
    public function view(User $user, Location $location): bool
    {
        if ($user->isPlatformStaff()) {
            return true;
        }

        return $this->permissionService->userHasPermission($user, $location->organization, 'location.view');
    }

    /**
     * Determine whether the user can create locations for an organization.
     */
    public function create(User $user, Organization $organization): bool
    {
        if ($user->isPlatformAdmin()) {
            return true;
        }

        return $this->permissionService->userHasPermission($user, $organization, 'location.create');
    }

    /**
     * Determine whether the user can update the location.
     */
    public function update(User $user, Location $location): bool
    {
        if ($user->isPlatformAdmin()) {
            return true;
        }

        return $this->permissionService->userHasPermission($user, $location->organization, 'location.update');
    }

    /**
     * Determine whether the user can delete the location.
     */
    public function delete(User $user, Location $location): bool
    {
        if ($user->isPlatformAdmin()) {
            return true;
        }

        return $this->permissionService->userHasPermission($user, $location->organization, 'location.delete');
    }
}
