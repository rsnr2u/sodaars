<?php

namespace App\Policies;

use App\Enums\ProviderRole;
use App\Models\Organization;
use App\Models\User;

class OrganizationPolicy
{
    /**
     * Determine whether the user can view any organizations.
     */
    public function viewAny(User $user): bool
    {
        return $user->isPlatformStaff();
    }

    /**
     * Determine whether the user can view the organization.
     */
    public function view(User $user, Organization $organization): bool
    {
        if ($user->isPlatformStaff()) {
            return true;
        }

        return $user->hasRoleInOrganization($organization->id, [
            ProviderRole::PROVIDER_OWNER->value,
            ProviderRole::PROVIDER_MANAGER->value,
            ProviderRole::PROVIDER_STAFF->value,
        ]);
    }

    /**
     * Determine whether the user can create organizations.
     */
    public function create(User $user): bool
    {
        return $user->isPlatformAdmin();
    }

    /**
     * Determine whether the user can update the organization.
     */
    public function update(User $user, Organization $organization): bool
    {
        if ($user->isPlatformAdmin()) {
            return true;
        }

        return $user->hasRoleInOrganization($organization->id, [
            ProviderRole::PROVIDER_OWNER->value,
        ]);
    }

    /**
     * Determine whether the user can update organization settings and branding.
     */
    public function updateSettings(User $user, Organization $organization): bool
    {
        if ($user->isPlatformAdmin()) {
            return true;
        }

        return $user->hasRoleInOrganization($organization->id, [
            ProviderRole::PROVIDER_OWNER->value,
        ]);
    }

    /**
     * Determine whether the user can update the organization's public directory visibility.
     * STRICT: Only PROVIDER_OWNER can change public directory visibility.
     * Managers and Staff must receive 403.
     */
    public function updateVisibility(User $user, Organization $organization): bool
    {
        if ($user->isPlatformAdmin()) {
            return true;
        }

        return $user->hasRoleInOrganization($organization->id, [
            ProviderRole::PROVIDER_OWNER->value,
        ]);
    }

    /**
     * Determine whether the user can delete the organization.
     */
    public function delete(User $user, Organization $organization): bool
    {
        return $user->isSuperAdmin();
    }
}
