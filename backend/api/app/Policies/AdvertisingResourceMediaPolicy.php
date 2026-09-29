<?php

namespace App\Policies;

use App\Models\AdvertisingResource;
use App\Models\AdvertisingResourceMedia;
use App\Models\User;
use App\Services\Permission\PermissionService;

class AdvertisingResourceMediaPolicy
{
    public function __construct(
        protected PermissionService $permissionService
    ) {}

    /**
     * Determine whether the user can view media of an advertising resource.
     */
    public function viewAny(User $user, AdvertisingResource $resource): bool
    {
        if ($user->isPlatformStaff()) {
            return true;
        }

        return $this->permissionService->userHasPermission($user, $resource->organization, 'resource.view')
            || $this->permissionService->userHasPermission($user, $resource->organization, 'resource.media.view');
    }

    /**
     * Determine whether the user can view a specific resource media.
     */
    public function view(User $user, AdvertisingResourceMedia $media): bool
    {
        if ($user->isPlatformStaff()) {
            return true;
        }

        return $this->permissionService->userHasPermission($user, $media->organization, 'resource.view')
            || $this->permissionService->userHasPermission($user, $media->organization, 'resource.media.view');
    }

    /**
     * Determine whether the user can upload media to a resource.
     */
    public function upload(User $user, AdvertisingResource $resource): bool
    {
        if ($user->isPlatformAdmin()) {
            return true;
        }

        return $this->permissionService->userHasPermission($user, $resource->organization, 'resource.media.upload')
            || $this->permissionService->userHasPermission($user, $resource->organization, 'resource.update');
    }

    /**
     * Determine whether the user can update media metadata.
     */
    public function update(User $user, AdvertisingResourceMedia $media, bool $isModifyingPrimary = false): bool
    {
        if ($user->isPlatformAdmin()) {
            return true;
        }

        // Only Owner/Manager can modify primary flag
        if ($isModifyingPrimary) {
            return $this->permissionService->userHasPermission($user, $media->organization, 'resource.media.manage');
        }

        return $this->permissionService->userHasPermission($user, $media->organization, 'resource.media.update')
            || $this->permissionService->userHasPermission($user, $media->organization, 'resource.update');
    }

    /**
     * Determine whether the user can reorder gallery media.
     */
    public function reorder(User $user, AdvertisingResource $resource): bool
    {
        if ($user->isPlatformAdmin()) {
            return true;
        }

        // Only Owner/Manager can reorder gallery
        return $this->permissionService->userHasPermission($user, $resource->organization, 'resource.media.manage');
    }

    /**
     * Determine whether the user can delete a media asset.
     */
    public function delete(User $user, AdvertisingResourceMedia $media): bool
    {
        if ($user->isPlatformAdmin()) {
            return true;
        }

        // Only Owner/Manager can delete media
        return $this->permissionService->userHasPermission($user, $media->organization, 'resource.media.manage')
            || $this->permissionService->userHasPermission($user, $media->organization, 'resource.delete');
    }
}
