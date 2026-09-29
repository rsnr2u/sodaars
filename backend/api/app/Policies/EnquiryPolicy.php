<?php

namespace App\Policies;

use App\Models\Enquiry;
use App\Models\Organization;
use App\Models\User;
use App\Services\Permission\PermissionService;

class EnquiryPolicy
{
    protected PermissionService $permissionService;

    public function __construct(PermissionService $permissionService)
    {
        $this->permissionService = $permissionService;
    }

    /**
     * Determine whether the user can view any enquiries of an organization.
     */
    public function viewAny(User $user, Organization $organization): bool
    {
        if ($user->isPlatformStaff()) {
            return true;
        }

        return $this->permissionService->userHasPermission($user, $organization, 'enquiry.view');
    }

    /**
     * Determine whether the user can view the enquiry.
     */
    public function view(User $user, Enquiry $enquiry): bool
    {
        if ($user->isPlatformStaff()) {
            return true;
        }

        return $this->permissionService->userHasPermission($user, $enquiry->organization, 'enquiry.view');
    }

    /**
     * Determine whether the user can create enquiries in an organization.
     */
    public function create(User $user, Organization $organization): bool
    {
        if ($user->isPlatformAdmin()) {
            return true;
        }

        return $this->permissionService->userHasPermission($user, $organization, 'enquiry.create');
    }

    /**
     * Determine whether the user can update the enquiry.
     */
    public function update(User $user, Enquiry $enquiry): bool
    {
        if ($user->isPlatformAdmin()) {
            return true;
        }

        return $this->permissionService->userHasPermission($user, $enquiry->organization, 'enquiry.update');
    }

    /**
     * Determine whether the user can delete the enquiry.
     */
    public function delete(User $user, Enquiry $enquiry): bool
    {
        if ($user->isPlatformAdmin()) {
            return true;
        }

        return $this->permissionService->userHasPermission($user, $enquiry->organization, 'enquiry.delete');
    }

    /**
     * Determine whether the user can place inventory holds for this enquiry.
     * Requires schedule hold management permissions (Owner and Manager only).
     */
    public function placeHold(User $user, Enquiry $enquiry): bool
    {
        if ($user->isPlatformAdmin()) {
            return true;
        }

        return $this->permissionService->userHasPermission($user, $enquiry->organization, 'availability.update');
    }
}
