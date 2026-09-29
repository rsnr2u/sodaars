<?php

namespace Tests\Feature;

use App\Enums\MembershipStatus;
use App\Enums\OrganizationStatus;
use App\Enums\PlatformRole;
use App\Enums\ProviderRole;
use App\Enums\RegistrationSource;
use App\Enums\SubscriptionStatus;
use App\Enums\UserStatus;
use App\Models\Organization;
use App\Models\OrganizationUser;
use App\Models\SubscriptionPlan;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\URL;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    protected SubscriptionPlan $starterPlan;
    protected User $superAdmin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();

        $this->starterPlan = SubscriptionPlan::where('slug', 'starter')->first();
        $this->superAdmin = User::where('platform_role', PlatformRole::SUPER_ADMIN->value)->first();
    }

    /**
     * Test 1-6 & 21: Provider can register, creates organization, owner user, membership, subscription, uses SELF source.
     */
    public function test_provider_can_register_and_creates_all_entities_atomically(): void
    {
        Event::fake([Registered::class]);

        $payload = [
            'company_name' => 'Vertex Outdoor Advertising',
            'contact_name' => 'Kiran Varma',
            'email' => 'kiran@vertexads.com',
            'phone' => '+919876543222',
            'password' => 'SecretPassword123!',
            'password_confirmation' => 'SecretPassword123!',
            'terms' => true,
            'subscription_plan_id' => $this->starterPlan->id,
        ];

        $response = $this->postJson('/api/v1/auth/provider/register', $payload);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'message' => 'Provider registered successfully.',
            ])
            ->assertJsonStructure([
                'data' => [
                    'token',
                    'token_type',
                    'user' => ['id', 'uuid', 'name', 'email'],
                    'organization' => ['id', 'uuid', 'name', 'slug', 'registration_source', 'status'],
                    'provider_role',
                ],
            ]);

        // 21. Verify password is NOT exposed in response
        $this->assertArrayNotHasKey('password', $response->json('data.user'));
        $this->assertArrayNotHasKey('remember_token', $response->json('data.user'));

        // 2. Organization exists
        $organization = Organization::where('slug', 'vertex-outdoor-advertising')->first();
        $this->assertNotNull($organization);
        $this->assertEquals(OrganizationStatus::ACTIVE->value, $organization->status);

        // 6. Registration uses SELF source
        $this->assertEquals(RegistrationSource::SELF->value, $organization->registration_source);

        // 3. Owner User exists
        $owner = User::where('email', 'kiran@vertexads.com')->first();
        $this->assertNotNull($owner);
        $this->assertNull($owner->platform_role);
        $this->assertEquals(UserStatus::ACTIVE->value, $owner->status);

        // 4. Membership exists with PROVIDER_OWNER
        $this->assertDatabaseHas('organization_users', [
            'organization_id' => $organization->id,
            'user_id' => $owner->id,
            'role' => ProviderRole::PROVIDER_OWNER->value,
            'status' => MembershipStatus::ACTIVE->value,
        ]);

        // 5. Subscription exists
        $this->assertDatabaseHas('subscriptions', [
            'organization_id' => $organization->id,
            'subscription_plan_id' => $this->starterPlan->id,
            'status' => SubscriptionStatus::ACTIVE->value,
            'resource_limit' => 50,
            'price' => 2499.00,
        ]);

        Event::assertDispatched(Registered::class);
    }

    /**
     * Test 7: Provider can login with valid credentials.
     */
    public function test_provider_can_login_with_valid_credentials(): void
    {
        $org = Organization::create(['name' => 'Prime Ads', 'status' => 'ACTIVE']);
        $user = User::factory()->create([
            'email' => 'owner@primeads.com',
            'password' => Hash::make('ValidPassword123!'),
            'status' => UserStatus::ACTIVE->value,
            'platform_role' => null,
        ]);
        OrganizationUser::create([
            'organization_id' => $org->id,
            'user_id' => $user->id,
            'role' => ProviderRole::PROVIDER_OWNER->value,
            'status' => MembershipStatus::ACTIVE->value,
            'is_default' => true,
        ]);

        $response = $this->postJson('/api/v1/auth/provider/login', [
            'email' => 'owner@primeads.com',
            'password' => 'ValidPassword123!',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Provider authenticated successfully.',
                'data' => [
                    'provider_role' => ProviderRole::PROVIDER_OWNER->value,
                    'user' => ['email' => 'owner@primeads.com'],
                    'organization' => ['name' => 'Prime Ads'],
                ],
            ]);

        $this->assertNotEmpty($response->json('data.token'));
    }

    /**
     * Test 8: Provider cannot login with invalid password.
     */
    public function test_provider_cannot_login_with_invalid_password(): void
    {
        $user = User::factory()->create([
            'email' => 'user@ads.com',
            'password' => Hash::make('CorrectPassword123!'),
        ]);

        $response = $this->postJson('/api/v1/auth/provider/login', [
            'email' => 'user@ads.com',
            'password' => 'WrongPassword!',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    /**
     * Test 9: Provider cannot login when user is suspended.
     */
    public function test_provider_cannot_login_when_user_is_suspended(): void
    {
        $org = Organization::create(['name' => 'Suspended User Org', 'status' => 'ACTIVE']);
        $user = User::factory()->create([
            'email' => 'suspended@ads.com',
            'password' => Hash::make('Password123!'),
            'status' => UserStatus::SUSPENDED->value,
        ]);
        OrganizationUser::create([
            'organization_id' => $org->id,
            'user_id' => $user->id,
            'role' => ProviderRole::PROVIDER_OWNER->value,
            'status' => 'ACTIVE',
        ]);

        $response = $this->postJson('/api/v1/auth/provider/login', [
            'email' => 'suspended@ads.com',
            'password' => 'Password123!',
        ]);

        $response->assertStatus(403);
    }

    /**
     * Test 10: Provider cannot access when organization is suspended.
     */
    public function test_provider_cannot_access_suspended_organization(): void
    {
        $suspendedOrg = Organization::create([
            'name' => 'Suspended Org Media',
            'status' => OrganizationStatus::SUSPENDED->value,
        ]);
        $user = User::factory()->create([
            'email' => 'owner@suspendedorg.com',
            'password' => Hash::make('Password123!'),
            'status' => UserStatus::ACTIVE->value,
        ]);
        OrganizationUser::create([
            'organization_id' => $suspendedOrg->id,
            'user_id' => $user->id,
            'role' => ProviderRole::PROVIDER_OWNER->value,
            'status' => 'ACTIVE',
        ]);

        $response = $this->postJson('/api/v1/auth/provider/login', [
            'email' => 'owner@suspendedorg.com',
            'password' => 'Password123!',
        ]);

        $response->assertStatus(403);
    }

    /**
     * Test 11: Admin can login with valid platform credentials.
     */
    public function test_admin_can_login_with_platform_credentials(): void
    {
        $response = $this->postJson('/api/v1/auth/admin/login', [
            'email' => 'superadmin@sodaars.com',
            'password' => 'Password123!',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'platform_role' => PlatformRole::SUPER_ADMIN->value,
                    'user' => ['email' => 'superadmin@sodaars.com'],
                ],
            ]);

        $this->assertNotEmpty($response->json('data.token'));
    }

    /**
     * Test 12 & 13: Provider user cannot use admin login, non-platform user cannot access admin routes.
     */
    public function test_provider_user_cannot_use_admin_login(): void
    {
        $providerUser = User::factory()->create([
            'email' => 'provider@only.com',
            'password' => Hash::make('Password123!'),
            'platform_role' => null,
            'status' => 'ACTIVE',
        ]);

        $response = $this->postJson('/api/v1/auth/admin/login', [
            'email' => 'provider@only.com',
            'password' => 'Password123!',
        ]);

        $response->assertStatus(403);
    }

    /**
     * Test 14: Authenticated user can access /api/v1/auth/me.
     */
    public function test_authenticated_user_can_access_me_endpoint(): void
    {
        $org = Organization::create(['name' => 'Apex Outdoors', 'status' => 'ACTIVE']);
        $user = User::factory()->create([
            'name' => 'Arun Verma',
            'email' => 'arun@apex.com',
            'platform_role' => null,
            'status' => 'ACTIVE',
        ]);
        OrganizationUser::create([
            'organization_id' => $org->id,
            'user_id' => $user->id,
            'role' => ProviderRole::PROVIDER_OWNER->value,
            'status' => 'ACTIVE',
            'is_default' => true,
        ]);

        Sanctum::actingAs($user);

        $response = $this->getJson('/api/v1/auth/me');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'user' => [
                        'name' => 'Arun Verma',
                        'email' => 'arun@apex.com',
                    ],
                    'provider_role' => ProviderRole::PROVIDER_OWNER->value,
                    'current_organization' => [
                        'name' => 'Apex Outdoors',
                    ],
                    'is_platform_user' => false,
                ],
            ]);
    }

    /**
     * Test 15 & 16: Logout revokes current token and revoked token cannot access protected endpoint.
     */
    public function test_logout_revokes_token(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('test-token')->plainTextToken;

        // Verify token works
        $checkResponse = $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson('/api/v1/auth/me');
        $checkResponse->assertStatus(200);

        // Logout
        $logoutResponse = $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson('/api/v1/auth/logout');
        $logoutResponse->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Successfully logged out.',
            ]);

        // Verify token deleted from database
        $this->assertDatabaseCount('personal_access_tokens', 0);

        // Reset auth guards in memory for next request
        $this->app['auth']->forgetGuards();

        // Attempt to access again with revoked token
        $failedResponse = $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson('/api/v1/auth/me');
        $failedResponse->assertStatus(401);
    }

    /**
     * Test 17: Email verification flow works.
     */
    public function test_email_verification_flow_works(): void
    {
        $user = User::factory()->create([
            'email_verified_at' => null,
        ]);

        $this->assertFalse($user->hasVerifiedEmail());

        $verificationUrl = URL::temporarySignedRoute(
            'verification.verify',
            now()->addMinutes(60),
            ['id' => $user->id, 'hash' => sha1($user->getEmailForVerification())]
        );

        $response = $this->getJson($verificationUrl);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Email verified successfully.',
            ]);

        $this->assertTrue($user->fresh()->hasVerifiedEmail());
    }

    /**
     * Test 18 & 19: Password reset request sends link and changes password.
     */
    public function test_password_reset_flow_works(): void
    {
        $user = User::factory()->create([
            'email' => 'resetuser@sodaars.com',
            'password' => Hash::make('OldPassword123!'),
        ]);

        // 18. Forgot password request
        $forgotResponse = $this->postJson('/api/v1/auth/password/forgot', [
            'email' => 'resetuser@sodaars.com',
        ]);
        $forgotResponse->assertStatus(200);

        // Generate valid token directly using Password broker
        $token = Password::createToken($user);

        // 19. Reset password request
        $resetResponse = $this->postJson('/api/v1/auth/password/reset', [
            'token' => $token,
            'email' => 'resetuser@sodaars.com',
            'password' => 'NewPassword456!',
            'password_confirmation' => 'NewPassword456!',
        ]);

        $resetResponse->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Password has been reset successfully.',
            ]);

        // Verify user can login with new password
        $this->assertTrue(Hash::check('NewPassword456!', $user->fresh()->password));
    }

    /**
     * Test 20: Login rate limiting works after 5 failed attempts.
     */
    public function test_login_rate_limiting_protects_endpoint(): void
    {
        RateLimiter::clear('admin-rate-test@sodaars.com127.0.0.1');

        for ($i = 0; $i < 5; $i++) {
            $this->postJson('/api/v1/auth/admin/login', [
                'email' => 'admin-rate-test@sodaars.com',
                'password' => 'WrongPassword!',
            ]);
        }

        // 6th attempt should be blocked by throttle:login
        $blockedResponse = $this->postJson('/api/v1/auth/admin/login', [
            'email' => 'admin-rate-test@sodaars.com',
            'password' => 'WrongPassword!',
        ]);

        $blockedResponse->assertStatus(429);
    }

    /**
     * Test 22: Tenant isolation remains intact after provider authentication.
     */
    public function test_tenant_isolation_remains_intact_after_authentication(): void
    {
        $orgA = Organization::create(['name' => 'Provider Alpha', 'status' => 'ACTIVE']);
        $orgB = Organization::create(['name' => 'Provider Beta', 'status' => 'ACTIVE']);

        $userA = User::factory()->create(['email' => 'ownerA@alpha.com']);
        OrganizationUser::create([
            'organization_id' => $orgA->id,
            'user_id' => $userA->id,
            'role' => ProviderRole::PROVIDER_OWNER->value,
            'status' => 'ACTIVE',
            'is_default' => true,
        ]);

        $tokenA = $userA->createToken('web')->plainTextToken;

        // Provider A queries own tenant organization
        $response = $this->withHeader('Authorization', "Bearer {$tokenA}")
            ->getJson('/api/v1/tenant/organization');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'id' => $orgA->id,
                    'name' => 'Provider Alpha',
                ],
            ]);

        // Provider A attempts to access Org B data by sending Org B ID
        $spoofedResponse = $this->withHeaders([
            'Authorization' => "Bearer {$tokenA}",
            'X-Organization-Id' => $orgB->id,
        ])->getJson('/api/v1/tenant/organization');

        $spoofedResponse->assertStatus(403);
    }
}
