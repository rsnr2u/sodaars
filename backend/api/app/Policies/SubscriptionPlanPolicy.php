<?php

namespace App\Policies;

use App\Models\SubscriptionPlan;
use App\Models\User;

class SubscriptionPlanPolicy
{
    /**
     * Determine whether the user can view any subscription plans.
     */
    public function viewAny(?User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the subscription plan.
     */
    public function view(?User $user, SubscriptionPlan $subscriptionPlan): bool
    {
        return true;
    }

    /**
     * Determine whether the user can create subscription plans.
     */
    public function create(User $user): bool
    {
        return $user->isPlatformAdmin();
    }

    /**
     * Determine whether the user can update the subscription plan.
     */
    public function update(User $user, SubscriptionPlan $subscriptionPlan): bool
    {
        return $user->isPlatformAdmin();
    }

    /**
     * Determine whether the user can delete the subscription plan.
     */
    public function delete(User $user, SubscriptionPlan $subscriptionPlan): bool
    {
        return $user->isSuperAdmin();
    }
}
