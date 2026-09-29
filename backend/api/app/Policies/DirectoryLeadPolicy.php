<?php

namespace App\Policies;

use App\Models\DirectoryLead;
use App\Models\Organization;
use App\Models\User;
use App\Services\Permission\PermissionService;

class DirectoryLeadPolicy
{
    protected PermissionService $permissionService;

    public function __construct(PermissionService $permissionService)
    {
        $this->permissionService = $permissionService;
    }

    /**
     * Determine whether the user can view any leads of an organization.
     */
    public function viewAny(User $user, Organization $organization): bool
    {
        if ($user->isPlatformStaff()) {
            return true;
        }

        return $this->permissionService->userHasPermission($user, $organization, 'lead.view');
    }

    /**
     * Determine whether the user can view the lead.
     */
    public function view(User $user, DirectoryLead $lead): bool
    {
        if ($user->isPlatformStaff()) {
            return true;
        }

        return $this->permissionService->userHasPermission($user, $lead->organization, 'lead.view');
    }

    /**
     * Determine whether the user can update the lead (status, notes).
     */
    public function update(User $user, DirectoryLead $lead): bool
    {
        if ($user->isPlatformAdmin()) {
            return true;
        }

        return $this->permissionService->userHasPermission($user, $lead->organization, 'lead.update');
    }

    /**
     * Determine whether the user can delete (soft delete) the lead.
     */
    public function delete(User $user, DirectoryLead $lead): bool
    {
        if ($user->isPlatformAdmin()) {
            return true;
        }

        return $this->permissionService->userHasPermission($user, $lead->organization, 'lead.delete');
    }
}
