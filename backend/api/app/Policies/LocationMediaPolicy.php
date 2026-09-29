<?php

namespace App\Policies;

use App\Models\Location;
use App\Models\LocationMedia;
use App\Models\User;
use App\Services\Permission\PermissionService;

class LocationMediaPolicy
{
    public function __construct(
        protected PermissionService $permissionService
    ) {}

    /**
     * Determine whether the user can view media of a location.
     */
    public function viewAny(User $user, Location $location): bool
    {
        if ($user->isPlatformStaff()) {
            return true;
        }

        return $this->permissionService->userHasPermission($user, $location->organization, 'location.view')
            || $this->permissionService->userHasPermission($user, $location->organization, 'location.media.view');
    }

    /**
     * Determine whether the user can view a specific location media.
     */
    public function view(User $user, LocationMedia $media): bool
    {
        if ($user->isPlatformStaff()) {
            return true;
        }

        return $this->permissionService->userHasPermission($user, $media->organization, 'location.view')
            || $this->permissionService->userHasPermission($user, $media->organization, 'location.media.view');
    }

    /**
     * Determine whether the user can upload media to a location.
     */
    public function upload(User $user, Location $location): bool
    {
        if ($user->isPlatformAdmin()) {
            return true;
        }

        return $this->permissionService->userHasPermission($user, $location->organization, 'location.media.upload')
            || $this->permissionService->userHasPermission($user, $location->organization, 'location.update');
    }

    /**
     * Determine whether the user can update media metadata.
     */
    public function update(User $user, LocationMedia $media, bool $isModifyingPrimary = false): bool
    {
        if ($user->isPlatformAdmin()) {
            return true;
        }

        // Only Owner/Manager can modify primary flag
        if ($isModifyingPrimary) {
            return $this->permissionService->userHasPermission($user, $media->organization, 'location.media.manage');
        }

        return $this->permissionService->userHasPermission($user, $media->organization, 'location.media.update')
            || $this->permissionService->userHasPermission($user, $media->organization, 'location.update');
    }

    /**
     * Determine whether the user can reorder gallery media.
     */
    public function reorder(User $user, Location $location): bool
    {
        if ($user->isPlatformAdmin()) {
            return true;
        }

        // Only Owner/Manager can reorder gallery
        return $this->permissionService->userHasPermission($user, $location->organization, 'location.media.manage');
    }

    /**
     * Determine whether the user can delete a media asset.
     */
    public function delete(User $user, LocationMedia $media): bool
    {
        if ($user->isPlatformAdmin()) {
            return true;
        }

        // Only Owner/Manager can delete media
        return $this->permissionService->userHasPermission($user, $media->organization, 'location.media.manage')
            || $this->permissionService->userHasPermission($user, $media->organization, 'location.delete');
    }
}
