<?php

namespace App\Policies;

use App\Models\AdvertisingResource;
use App\Models\Organization;
use App\Models\User;
use App\Services\Permission\PermissionService;

class AdvertisingResourcePolicy
{
    protected PermissionService $permissionService;

    public function __construct(PermissionService $permissionService)
    {
        $this->permissionService = $permissionService;
    }

    /**
     * Determine whether the user can view any advertising resources of an organization.
     */
    public function viewAny(User $user, Organization $organization): bool
    {
        if ($user->isPlatformStaff()) {
            return true;
        }

        return $this->permissionService->userHasPermission($user, $organization, 'resource.view');
    }

    /**
     * Determine whether the user can view the advertising resource.
     */
    public function view(User $user, AdvertisingResource $resource): bool
    {
        if ($user->isPlatformStaff()) {
            return true;
        }

        return $this->permissionService->userHasPermission($user, $resource->organization, 'resource.view');
    }

    /**
     * Determine whether the user can create advertising resources for an organization.
     */
    public function create(User $user, Organization $organization): bool
    {
        if ($user->isPlatformAdmin()) {
            return true;
        }

        return $this->permissionService->userHasPermission($user, $organization, 'resource.create');
    }

    /**
     * Determine whether the user can update the advertising resource.
     */
    public function update(User $user, AdvertisingResource $resource): bool
    {
        if ($user->isPlatformAdmin()) {
            return true;
        }

        return $this->permissionService->userHasPermission($user, $resource->organization, 'resource.update');
    }

    /**
     * Determine whether the user can delete the advertising resource.
     */
    public function delete(User $user, AdvertisingResource $resource): bool
    {
        if ($user->isPlatformAdmin()) {
            return true;
        }

        return $this->permissionService->userHasPermission($user, $resource->organization, 'resource.delete');
    }
}
