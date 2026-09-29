<?php

namespace App\Services\Permission;

use App\Enums\ProviderRole;
use App\Models\Organization;
use App\Models\OrganizationUser;
use App\Models\User;

class PermissionService
{
    /**
     * Complete list of permissions across SODAARS provider domain.
     */
    public const PERMISSIONS = [
        // Organization
        'organization.view',
        'organization.update',
        'organization.settings',

        // Staff
        'staff.view',
        'staff.invite',
        'staff.update',
        'staff.remove',

        // Subscription
        'subscription.view',
        'subscription.manage',

        // Locations (Ready for Phase 1 Stage 5)
        'location.view',
        'location.create',
        'location.update',
        'location.delete',

        // Resources (Ready for Phase 1 Stage 6)
        'resource.view',
        'resource.create',
        'resource.update',
        'resource.delete',

        // Availability (Ready for Phase 1 Stage 7)
        'availability.view',
        'availability.update',

        // Customers (Ready for Phase 1 Stage 8)
        'customer.view',
        'customer.create',
        'customer.update',
        'customer.delete',

        // Enquiries (Ready for Phase 1 Stage 9)
        'enquiry.view',
        'enquiry.create',
        'enquiry.update',
        'enquiry.delete',

        // Directory Leads (Stage 10)
        'lead.view',
        'lead.update',
        'lead.delete',

        // Media Management (Stage 9)
        'location.media.view',
        'location.media.upload',
        'location.media.update',
        'location.media.manage',
        'resource.media.view',
        'resource.media.upload',
        'resource.media.update',
        'resource.media.manage',

        // Quotations (Ready for Phase 1 Stage 10)
        'quotation.view',
        'quotation.create',
        'quotation.update',
        'quotation.delete',

        // Bookings (Ready for Phase 1 Stage 11)
        'booking.view',
        'booking.create',
        'booking.update',
        'booking.cancel',

        // Campaigns (Ready for Phase 1 Stage 12)
        'campaign.view',
        'campaign.create',
        'campaign.update',

        // Invoices & Payments (Ready for Phase 1 Stage 13)
        'invoice.view',
        'invoice.create',
        'invoice.update',
        'payment.view',
        'payment.create',
        'payment.update',

        // Reports (Ready for Phase 1 Stage 14)
        'reports.view',
    ];

    /**
     * Centralized role-to-permission mapping matrix.
     */
    protected const ROLE_PERMISSIONS = [
        ProviderRole::PROVIDER_OWNER->value => [
            '*', // Wildcard: Owner possesses all provider permissions
        ],
        ProviderRole::PROVIDER_MANAGER->value => [
            'organization.view',
            'staff.view',
            'staff.invite',
            'staff.update',
            'staff.remove',
            'subscription.view',
            'location.*',
            'resource.*',
            'availability.*',
            'customer.*',
            'enquiry.*',
            'lead.*',
            'quotation.*',
            'booking.*',
            'campaign.*',
            'invoice.view',
            'payment.view',
            'reports.view',
        ],
        ProviderRole::PROVIDER_STAFF->value => [
            'organization.view',
            'location.view',
            'resource.view',
            'location.media.view',
            'location.media.upload',
            'location.media.update',
            'resource.media.view',
            'resource.media.upload',
            'resource.media.update',
            'availability.view',
            'customer.view',
            'customer.create',
            'customer.update',
            'enquiry.view',
            'enquiry.create',
            'enquiry.update',
            'lead.view',
            'lead.update',
            'quotation.view',
            'booking.view',
            'campaign.view',
            'invoice.view',
            'payment.view',
        ],
    ];

    /**
     * Check if a specific role has a specific permission.
     */
    public function roleHasPermission(string $role, string $permission): bool
    {
        $rolePermissions = self::ROLE_PERMISSIONS[$role] ?? [];

        if (in_array('*', $rolePermissions, true)) {
            return true;
        }

        if (in_array($permission, $rolePermissions, true)) {
            return true;
        }

        // Check for category wildcards (e.g. location.* matches location.create and location.media.manage)
        $parts = explode('.', $permission);
        if (count($parts) >= 2) {
            $wildcard = $parts[0] . '.*';
            if (in_array($wildcard, $rolePermissions, true)) {
                return true;
            }

            if (count($parts) >= 3) {
                $subWildcard = $parts[0] . '.' . $parts[1] . '.*';
                if (in_array($subWildcard, $rolePermissions, true)) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * Check if a user has a specific permission in an organization.
     */
    public function userHasPermission(User $user, Organization $organization, string $permission): bool
    {
        if ($user->isPlatformAdmin()) {
            return true;
        }

        $membership = OrganizationUser::where('user_id', $user->id)
            ->where('organization_id', $organization->id)
            ->where('status', 'ACTIVE')
            ->first();

        if (! $membership) {
            return false;
        }

        return $this->roleHasPermission($membership->role, $permission);
    }

    /**
     * Get all granted permissions for a role.
     */
    public function getPermissionsForRole(string $role): array
    {
        $rolePermissions = self::ROLE_PERMISSIONS[$role] ?? [];

        if (in_array('*', $rolePermissions, true)) {
            return self::PERMISSIONS;
        }

        $resolved = [];
        foreach (self::PERMISSIONS as $perm) {
            if ($this->roleHasPermission($role, $perm)) {
                $resolved[] = $perm;
            }
        }

        return $resolved;
    }

    /**
     * Determine if an acting role has authority to assign or alter a target role.
     */
    public function canManageRole(string $actingRole, string $targetRole): bool
    {
        if ($actingRole === ProviderRole::PROVIDER_OWNER->value) {
            return true; // Owner can manage any provider role
        }

        if ($actingRole === ProviderRole::PROVIDER_MANAGER->value) {
            // Manager can only manage Staff. Cannot touch Owner or Manager.
            return $targetRole === ProviderRole::PROVIDER_STAFF->value;
        }

        return false; // Staff cannot manage any roles
    }
}
