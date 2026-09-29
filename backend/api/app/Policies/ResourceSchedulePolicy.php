<?php

namespace App\Policies;

use App\Models\Organization;
use App\Models\ResourceSchedule;
use App\Models\User;
use App\Services\Permission\PermissionService;

class ResourceSchedulePolicy
{
    protected PermissionService $permissionService;

    public function __construct(PermissionService $permissionService)
    {
        $this->permissionService = $permissionService;
    }

    /**
     * Determine whether the user can view any schedules of an organization.
     */
    public function viewAny(User $user, Organization $organization): bool
    {
        if ($user->isPlatformStaff()) {
            return true;
        }

        return $this->permissionService->userHasPermission($user, $organization, 'availability.view');
    }

    /**
     * Determine whether the user can view the schedule.
     */
    public function view(User $user, ResourceSchedule $schedule): bool
    {
        if ($user->isPlatformStaff()) {
            return true;
        }

        return $this->permissionService->userHasPermission($user, $schedule->organization, 'availability.view');
    }

    /**
     * Determine whether the user can create schedule blocks for an organization.
     */
    public function create(User $user, Organization $organization): bool
    {
        if ($user->isPlatformAdmin()) {
            return true;
        }

        return $this->permissionService->userHasPermission($user, $organization, 'availability.update');
    }

    /**
     * Determine whether the user can update the schedule block.
     */
    public function update(User $user, ResourceSchedule $schedule): bool
    {
        if ($user->isPlatformAdmin()) {
            return true;
        }

        return $this->permissionService->userHasPermission($user, $schedule->organization, 'availability.update');
    }

    /**
     * Determine whether the user can delete/cancel the schedule block.
     */
    public function delete(User $user, ResourceSchedule $schedule): bool
    {
        if ($user->isPlatformAdmin()) {
            return true;
        }

        return $this->permissionService->userHasPermission($user, $schedule->organization, 'availability.update');
    }

    /**
     * Determine whether the user can release a schedule hold/block.
     */
    public function release(User $user, ResourceSchedule $schedule): bool
    {
        return $this->update($user, $schedule);
    }

    /**
     * Determine whether the user can extend a tentative hold.
     */
    public function extend(User $user, ResourceSchedule $schedule): bool
    {
        return $this->update($user, $schedule);
    }

    /**
     * Determine whether the user can confirm a tentative hold into a booking.
     */
    public function confirm(User $user, ResourceSchedule $schedule): bool
    {
        return $this->update($user, $schedule);
    }
}
