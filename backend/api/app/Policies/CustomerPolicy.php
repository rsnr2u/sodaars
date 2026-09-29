<?php

namespace App\Policies;

use App\Models\Customer;
use App\Models\Organization;
use App\Models\User;
use App\Services\Permission\PermissionService;

class CustomerPolicy
{
    protected PermissionService $permissionService;

    public function __construct(PermissionService $permissionService)
    {
        $this->permissionService = $permissionService;
    }

    /**
     * Determine whether the user can view any customers of an organization.
     */
    public function viewAny(User $user, Organization $organization): bool
    {
        if ($user->isPlatformStaff()) {
            return true;
        }

        return $this->permissionService->userHasPermission($user, $organization, 'customer.view');
    }

    /**
     * Determine whether the user can view the customer.
     */
    public function view(User $user, Customer $customer): bool
    {
        if ($user->isPlatformStaff()) {
            return true;
        }

        return $this->permissionService->userHasPermission($user, $customer->organization, 'customer.view');
    }

    /**
     * Determine whether the user can create customers in an organization.
     */
    public function create(User $user, Organization $organization): bool
    {
        if ($user->isPlatformAdmin()) {
            return true;
        }

        return $this->permissionService->userHasPermission($user, $organization, 'customer.create');
    }

    /**
     * Determine whether the user can update the customer.
     */
    public function update(User $user, Customer $customer): bool
    {
        if ($user->isPlatformAdmin()) {
            return true;
        }

        return $this->permissionService->userHasPermission($user, $customer->organization, 'customer.update');
    }

    /**
     * Determine whether the user can delete the customer.
     */
    public function delete(User $user, Customer $customer): bool
    {
        if ($user->isPlatformAdmin()) {
            return true;
        }

        return $this->permissionService->userHasPermission($user, $customer->organization, 'customer.delete');
    }
}
