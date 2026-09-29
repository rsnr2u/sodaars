<?php

namespace App\Services\Auth;

use App\Enums\MembershipStatus;
use App\Enums\OrganizationStatus;
use App\Enums\ProviderRole;
use App\Enums\RegistrationSource;
use App\Enums\UserStatus;
use App\Models\Organization;
use App\Models\OrganizationUser;
use App\Models\SubscriptionPlan;
use App\Models\User;
use App\Services\OrganizationService;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthService
{
    protected OrganizationService $organizationService;

    public function __construct(OrganizationService $organizationService)
    {
        $this->organizationService = $organizationService;
    }

    /**
     * Authenticate a platform administrator.
     */
    public function authenticatePlatformAdmin(string $email, string $password, string $deviceName = 'admin-web'): array
    {
        $user = User::where('email', $email)->first();

        if (! $user || ! Hash::check($password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials do not match our records.'],
            ]);
        }

        if ($user->status !== UserStatus::ACTIVE->value) {
            abort(403, 'Your account is suspended or inactive.');
        }

        if (! $user->isPlatformUser()) {
            abort(403, 'Access denied. Only platform administrators can log in here.');
        }

        $token = $user->createToken($deviceName, [
            'platform:' . strtolower($user->platform_role),
        ])->plainTextToken;

        return [
            'user' => $user,
            'platform_role' => $user->platform_role,
            'token' => $token,
        ];
    }

    /**
     * Authenticate a provider user into an active organization.
     */
    public function authenticateProvider(string $email, string $password, mixed $orgIdentifier = null, string $deviceName = 'provider-web'): array
    {
        $user = User::where('email', $email)->first();

        if (! $user || ! Hash::check($password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials do not match our records.'],
            ]);
        }

        if ($user->status !== UserStatus::ACTIVE->value) {
            abort(403, 'Your account is suspended or inactive.');
        }

        // Retrieve active organization memberships
        $memberships = OrganizationUser::where('user_id', $user->id)
            ->where('status', MembershipStatus::ACTIVE->value)
            ->with('organization')
            ->get();

        if ($memberships->isEmpty()) {
            abort(403, 'No active provider organization found for this user.');
        }

        // Resolve specific or default organization
        $activeMembership = null;
        if ($orgIdentifier) {
            $activeMembership = $memberships->first(function ($m) use ($orgIdentifier) {
                return (string) $m->organization_id === (string) $orgIdentifier
                    || $m->organization?->uuid === (string) $orgIdentifier;
            });

            if (! $activeMembership) {
                abort(403, 'You do not have an active membership in the requested organization.');
            }
        } else {
            $activeMembership = $memberships->firstWhere('is_default', true) ?? $memberships->first();
        }

        $organization = $activeMembership->organization;

        if (! $organization || $organization->status === OrganizationStatus::SUSPENDED->value || $organization->status === OrganizationStatus::INACTIVE->value) {
            abort(403, 'The selected organization is currently inactive or suspended.');
        }

        $token = $user->createToken($deviceName, [
            'provider:' . strtolower($activeMembership->role),
        ])->plainTextToken;

        return [
            'user' => $user,
            'organization' => $organization,
            'provider_role' => $activeMembership->role,
            'token' => $token,
        ];
    }

    /**
     * Register a new provider organization with owner user and subscription.
     */
    public function registerProvider(array $data, string $deviceName = 'provider-web'): array
    {
        // Resolve subscription plan (default to Starter if omitted)
        $planId = $data['subscription_plan_id'] ?? null;
        if (! $planId) {
            $starterPlan = SubscriptionPlan::where('slug', 'starter')->first();
            $planId = $starterPlan?->id;
        }

        $orgData = [
            'name' => $data['company_name'],
            'email' => $data['email'],
            'phone' => $data['phone'] ?? $data['mobile'] ?? null,
            'registration_source' => RegistrationSource::SELF->value,
            'owner_name' => $data['contact_name'],
            'owner_email' => $data['email'],
            'owner_phone' => $data['phone'] ?? $data['mobile'] ?? null,
            'owner_password' => $data['password'],
            'subscription_plan_id' => $planId,
        ];

        $organization = $this->organizationService->createOrganizationWithSubscription($orgData);

        $ownerUser = User::where('email', $data['email'])->firstOrFail();

        // Trigger standard Laravel registered event for email verification
        event(new Registered($ownerUser));

        $token = $ownerUser->createToken($deviceName, [
            'provider:' . strtolower(ProviderRole::PROVIDER_OWNER->value),
        ])->plainTextToken;

        $memberships = OrganizationUser::where('user_id', $ownerUser->id)
            ->where('status', MembershipStatus::ACTIVE->value)
            ->with('organization')
            ->get();

        return [
            'user' => $ownerUser,
            'organization' => $organization,
            'provider_role' => ProviderRole::PROVIDER_OWNER->value,
            'token' => $token,
            'memberships' => $memberships,
        ];
    }
}
