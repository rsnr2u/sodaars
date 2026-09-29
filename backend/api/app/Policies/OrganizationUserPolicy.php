<?php

namespace App\Policies;

use App\Enums\ProviderRole;
use App\Models\Organization;
use App\Models\OrganizationUser;
use App\Models\User;
use App\Services\Permission\PermissionService;

class OrganizationUserPolicy
{
    protected PermissionService $permissionService;

    public function __construct(PermissionService $permissionService)
    {
        $this->permissionService = $permissionService;
    }

    /**
     * Determine whether the user can view members of an organization.
     */
    public function viewAny(User $user, Organization $organization): bool
    {
        if ($user->isPlatformStaff()) {
            return true;
        }

        return $this->permissionService->userHasPermission($user, $organization, 'staff.view');
    }

    /**
     * Determine whether the user can add members to an organization.
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

            return $this->permissionService->canManageRole($userRole, $targetRole);
        }

        return true;
    }

    /**
     * Determine whether the user can update a member's role in an organization.
     */
    public function updateRole(User $user, OrganizationUser $targetMember, string $newRole): bool
    {
        if ($user->isPlatformAdmin()) {
            return true;
        }

        $organization = $targetMember->organization;

        if (! $this->permissionService->userHasPermission($user, $organization, 'staff.update')) {
            return false;
        }

        $actorRole = $user->getRoleInOrganization($organization->id);
        if (! $actorRole) {
            return false;
        }

        // Check if actor has authority over the target's current role and new role
        if (! $this->permissionService->canManageRole($actorRole, $targetMember->role)) {
            return false;
        }

        if (! $this->permissionService->canManageRole($actorRole, $newRole)) {
            return false;
        }

        // Protection: Nobody can downgrade the last active Owner
        if ($targetMember->role === ProviderRole::PROVIDER_OWNER->value && $newRole !== ProviderRole::PROVIDER_OWNER->value) {
            $ownerCount = OrganizationUser::where('organization_id', $organization->id)
                ->where('role', ProviderRole::PROVIDER_OWNER->value)
                ->where('status', 'ACTIVE')
                ->count();

            if ($ownerCount <= 1) {
                return false;
            }
        }

        return true;
    }

    /**
     * Determine whether the user can remove a member from an organization.
     */
    public function delete(User $user, OrganizationUser $targetMember): bool
    {
        if ($user->isPlatformAdmin()) {
            return true;
        }

        $organization = $targetMember->organization;

        if (! $this->permissionService->userHasPermission($user, $organization, 'staff.remove')) {
            return false;
        }

        $actorRole = $user->getRoleInOrganization($organization->id);
        if (! $actorRole) {
            return false;
        }

        // Check hierarchy authority
        if (! $this->permissionService->canManageRole($actorRole, $targetMember->role)) {
            return false;
        }

        // Protection: Never allow the last active Owner to be removed
        if ($targetMember->role === ProviderRole::PROVIDER_OWNER->value) {
            $ownerCount = OrganizationUser::where('organization_id', $organization->id)
                ->where('role', ProviderRole::PROVIDER_OWNER->value)
                ->where('status', 'ACTIVE')
                ->count();

            if ($ownerCount <= 1) {
                return false;
            }
        }

        return true;
    }
}
