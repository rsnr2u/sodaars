<?php

namespace App\Services;

use App\Enums\BillingCycle;
use App\Enums\MembershipStatus;
use App\Enums\OrganizationStatus;
use App\Enums\ProviderRole;
use App\Enums\RegistrationSource;
use App\Enums\SubscriptionStatus;
use App\Enums\UserStatus;
use App\Models\Organization;
use App\Models\OrganizationUser;
use App\Models\Subscription;
use App\Models\SubscriptionPlan;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class OrganizationService
{
    /**
     * Create an organization atomically with an owner and a subscription.
     */
    public function createOrganizationWithSubscription(array $data, ?User $createdBy = null): Organization
    {
        return DB::transaction(function () use ($data, $createdBy) {
            $registrationSource = $data['registration_source'] ?? ($createdBy ? RegistrationSource::ADMIN->value : RegistrationSource::SELF->value);

            // 1. Create Organization
            $organization = Organization::create([
                'name' => $data['name'],
                'slug' => ! empty($data['slug']) ? Str::slug($data['slug']) : Str::slug($data['name']),
                'email' => $data['email'] ?? null,
                'phone' => $data['phone'] ?? null,
                'address' => $data['address'] ?? null,
                'city' => $data['city'] ?? null,
                'state' => $data['state'] ?? null,
                'pincode' => $data['pincode'] ?? null,
                'country' => $data['country'] ?? 'India',
                'registration_source' => $registrationSource,
                'status' => $data['status'] ?? OrganizationStatus::ACTIVE->value,
                'created_by_user_id' => $createdBy?->id,
                'settings' => $data['settings'] ?? null,
            ]);

            // 2. Create or link Owner User
            $ownerUser = null;
            if (! empty($data['owner_email'])) {
                $ownerUser = User::where('email', $data['owner_email'])->first();

                if (! $ownerUser) {
                    $ownerUser = User::create([
                        'name' => $data['owner_name'] ?? $data['name'].' Owner',
                        'email' => $data['owner_email'],
                        'phone' => $data['owner_phone'] ?? null,
                        'password' => Hash::make($data['owner_password'] ?? Str::random(16)),
                        'status' => UserStatus::ACTIVE->value,
                        'platform_role' => null, // Provider user has null platform_role
                    ]);
                }

                OrganizationUser::create([
                    'organization_id' => $organization->id,
                    'user_id' => $ownerUser->id,
                    'role' => ProviderRole::PROVIDER_OWNER->value,
                    'status' => MembershipStatus::ACTIVE->value,
                    'is_default' => true,
                    'joined_at' => now(),
                ]);
            }

            // 3. Create Subscription
            $plan = SubscriptionPlan::findOrFail($data['subscription_plan_id']);
            $billingCycle = $data['billing_cycle'] ?? BillingCycle::MONTHLY->value;

            $price = ($billingCycle === BillingCycle::ANNUAL->value && $plan->annual_price !== null)
                ? $plan->annual_price
                : $plan->monthly_price;

            $resourceLimit = $plan->max_resources ?? 999999;

            Subscription::create([
                'organization_id' => $organization->id,
                'subscription_plan_id' => $plan->id,
                'status' => SubscriptionStatus::ACTIVE->value,
                'billing_cycle' => $billingCycle,
                'resource_limit' => $resourceLimit,
                'price' => $price,
                'currency' => $plan->currency,
                'starts_at' => now(),
                'ends_at' => $billingCycle === BillingCycle::ANNUAL->value ? now()->addYear() : now()->addMonth(),
                'notes' => 'Initial subscription provisioned on creation.',
            ]);

            return $organization->load(['activeSubscription.subscriptionPlan', 'users']);
        });
    }
}
