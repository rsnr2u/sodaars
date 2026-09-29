<?php

namespace App\Services;

use App\Enums\BillingCycle;
use App\Enums\SubscriptionStatus;
use App\Models\Organization;
use App\Models\Subscription;
use App\Models\SubscriptionPlan;

class SubscriptionService
{
    /**
     * Create or renew a subscription for an organization.
     */
    public function assignPlan(
        Organization $organization,
        SubscriptionPlan $plan,
        string $billingCycle = BillingCycle::MONTHLY->value,
        ?int $customLimit = null,
        ?float $customPrice = null
    ): Subscription {
        $price = $customPrice ?? (
            ($billingCycle === BillingCycle::ANNUAL->value && $plan->annual_price !== null)
                ? $plan->annual_price
                : $plan->monthly_price
        );

        $resourceLimit = $customLimit ?? ($plan->max_resources ?? 999999);

        // Cancel previous active subscriptions
        $organization->subscriptions()
            ->whereIn('status', [SubscriptionStatus::ACTIVE->value, SubscriptionStatus::TRIAL->value])
            ->update([
                'status' => SubscriptionStatus::CANCELLED->value,
                'cancelled_at' => now(),
            ]);

        return Subscription::create([
            'organization_id' => $organization->id,
            'subscription_plan_id' => $plan->id,
            'status' => SubscriptionStatus::ACTIVE->value,
            'billing_cycle' => $billingCycle,
            'resource_limit' => $resourceLimit,
            'price' => $price,
            'currency' => $plan->currency,
            'starts_at' => now(),
            'ends_at' => $billingCycle === BillingCycle::ANNUAL->value ? now()->addYear() : now()->addMonth(),
        ]);
    }

    /**
     * Check if an organization can add more resources based on their subscription limit.
     */
    public function canAddResources(Organization $organization, int $newResourceCount = 1): bool
    {
        $subscription = $organization->activeSubscription;

        if (! $subscription || ! $subscription->isActive()) {
            return false;
        }

        // To be checked against advertising resources count in Stage 9
        return true;
    }
}
