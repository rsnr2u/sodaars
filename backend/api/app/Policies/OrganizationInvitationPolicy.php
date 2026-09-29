<?php

namespace App\Policies;

use App\Models\Organization;
use App\Models\OrganizationInvitation;
use App\Models\User;
use App\Services\Permission\PermissionService;

class OrganizationInvitationPolicy
{
    protected PermissionService $permissionService;

    public function __construct(PermissionService $permissionService)
    {
        $this->permissionService = $permissionService;
    }

    /**
     * Determine whether the user can view invitations.
     */
    public function viewAny(User $user, Organization $organization): bool
    {
        if ($user->isPlatformStaff()) {
            return true;
        }

        return $this->permissionService->userHasPermission($user, $organization, 'staff.view');
    }

    /**
     * Determine whether the user can create an invitation.
     */
    public function create(User $user, Organization $organization, ?string $targetRole = null): bool
    {
        if ($user->isPlatformAdmin()) {
            return true;
        }

        if (! $this->permissionService->userHasPermission($user, $organization, 'staff.invite')) {
            return false;
        }

        if ($targetRole) {
            $userRole = $user->getRoleInOrganization($organization->id);
            if (! $userRole) {
                return false;
            }

            if (! $this->permissionService->canManageRole($userRole, $targetRole)) {
                return false;
            }
        }

        return true;
    }

    /**
     * Determine whether the user can revoke an invitation.
     */
    public function delete(User $user, OrganizationInvitation $invitation): bool
    {
        if ($user->isPlatformAdmin()) {
            return true;
        }

        $organization = $invitation->organization;

        if (! $this->permissionService->userHasPermission($user, $organization, 'staff.invite')) {
            return false;
        }

        $userRole = $user->getRoleInOrganization($invitation->organization_id);
        if (! $userRole) {
            return false;
        }

        return $this->permissionService->canManageRole($userRole, $invitation->role);
    }
}
