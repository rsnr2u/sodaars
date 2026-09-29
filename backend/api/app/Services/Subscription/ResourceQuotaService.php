<?php

namespace App\Services\Subscription;

use App\Enums\ResourceStatus;
use App\Enums\SubscriptionStatus;
use App\Models\Organization;
use App\Models\Subscription;

class ResourceQuotaService
{
    /**
     * Get the active or trial subscription for the organization.
     */
    public function getActiveSubscription(Organization $organization): ?Subscription
    {
        return $organization->subscriptions()
            ->whereIn('status', [SubscriptionStatus::ACTIVE->value, SubscriptionStatus::TRIAL->value])
            ->with('subscriptionPlan')
            ->latest()
            ->first();
    }

    /**
     * Check if the organization has an active or trial subscription.
     */
    public function hasActiveSubscription(Organization $organization): bool
    {
        return $this->getActiveSubscription($organization) !== null;
    }

    /**
     * Get the maximum active resource limit for the organization.
     *
     * Returns:
     * - int: The explicit maximum allowed active resources.
     * - null: Unlimited (ONLY when actively subscribed to an Enterprise/custom plan with max_resources = null).
     * - 0: When no valid active subscription exists (creation blocked).
     */
    public function getResourceLimit(Organization $organization): ?int
    {
        $subscription = $this->getActiveSubscription($organization);

        if (! $subscription) {
            // Missing active subscription is NOT unlimited; limit is 0
            return 0;
        }

        // Check if plan has explicit unlimited (max_resources === null)
        if ($subscription->subscriptionPlan && $subscription->subscriptionPlan->max_resources === null) {
            return null;
        }

        // Check for subscription-specific resource limit override (excluding 999999 fallback)
        if ($subscription->resource_limit !== null && $subscription->resource_limit !== 999999) {
            return $subscription->resource_limit;
        }

        // Fall back to plan's configured max_resources
        if ($subscription->subscriptionPlan) {
            return $subscription->subscriptionPlan->max_resources;
        }

        return $subscription->resource_limit ?? 0;
    }

    /**
     * Get the count of currently ACTIVE advertising resources for the organization.
     * Note: UNDER_MAINTENANCE, INACTIVE, and UNDER_REVIEW do not consume active quota.
     */
    public function getActiveResourceCount(Organization $organization): int
    {
        return $organization->advertisingResources()
            ->where('status', ResourceStatus::ACTIVE->value)
            ->count();
    }

    /**
     * Determine whether the organization can create or activate an advertising resource.
     */
    public function canCreateResource(Organization $organization): bool
    {
        // 1. Must have a valid active subscription
        if (! $this->hasActiveSubscription($organization)) {
            return false;
        }

        // 2. Resolve quota limit
        $limit = $this->getResourceLimit($organization);
        if ($limit === null) {
            // Explicitly unlimited Enterprise plan
            return true;
        }

        // 3. Compare active count against limit
        return $this->getActiveResourceCount($organization) < $limit;
    }

    /**
     * Determine whether an existing non-active resource can transition to ACTIVE.
     */
    public function canActivateResource(Organization $organization): bool
    {
        return $this->canCreateResource($organization);
    }

    /**
     * Get comprehensive quota telemetry for reporting and inspection.
     */
    public function getQuotaDetails(Organization $organization): array
    {
        $subscription = $this->getActiveSubscription($organization);
        $hasActiveSub = $subscription !== null;
        $limit = $this->getResourceLimit($organization);
        $activeCount = $this->getActiveResourceCount($organization);
        $isUnlimited = $hasActiveSub && ($limit === null);
        $canCreate = $this->canCreateResource($organization);

        return [
            'has_active_subscription' => $hasActiveSub,
            'subscription_status' => $subscription?->status,
            'plan_name' => $subscription?->subscriptionPlan?->name,
            'active_resources_count' => $activeCount,
            'resource_limit' => $limit,
            'is_unlimited' => $isUnlimited,
            'can_create' => $canCreate,
        ];
    }
}
