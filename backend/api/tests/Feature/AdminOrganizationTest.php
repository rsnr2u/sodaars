<?php

namespace Tests\Feature;

use App\Enums\PlatformRole;
use App\Enums\ProviderRole;
use App\Models\Organization;
use App\Models\SubscriptionPlan;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AdminOrganizationTest extends TestCase
{
    use RefreshDatabase;

    protected User $superAdmin;
    protected SubscriptionPlan $starterPlan;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();

        $this->superAdmin = User::where('platform_role', PlatformRole::SUPER_ADMIN->value)->first();
        $this->starterPlan = SubscriptionPlan::where('slug', 'starter')->first();
    }

    /**
     * Test 3, 4, 5, 12: Admin can create organization, owner is linked, subscription limit & price stored.
     */
    public function test_admin_can_create_organization_with_owner_and_subscription(): void
    {
        Sanctum::actingAs($this->superAdmin);

        $payload = [
            'name' => 'Metro Hoardings India',
            'email' => 'info@metrohoardings.com',
            'phone' => '+919876543210',
            'city' => 'Vijayawada',
            'state' => 'Andhra Pradesh',
            'subscription_plan_id' => $this->starterPlan->id,
            'billing_cycle' => 'MONTHLY',
            'owner_name' => 'Rajesh Kumar',
            'owner_email' => 'rajesh@metrohoardings.com',
            'owner_phone' => '+919876543211',
            'owner_password' => 'SecurePass123!',
        ];

        $response = $this->postJson('/api/v1/admin/organizations', $payload);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'message' => 'Organization created successfully.',
                'data' => [
                    'name' => 'Metro Hoardings India',
                    'slug' => 'metro-hoardings-india',
                    'city' => 'Vijayawada',
                ],
            ]);

        // 4. Verify Organization Owner is correctly linked in organization_users
        $owner = User::where('email', 'rajesh@metrohoardings.com')->first();
        $this->assertNotNull($owner);
        $this->assertNull($owner->platform_role); // Provider user has null platform_role

        $organization = Organization::where('slug', 'metro-hoardings-india')->first();
        $this->assertNotNull($organization);

        $this->assertDatabaseHas('organization_users', [
            'organization_id' => $organization->id,
            'user_id' => $owner->id,
            'role' => ProviderRole::PROVIDER_OWNER->value,
            'status' => 'ACTIVE',
        ]);

        // 5 & 12. Verify Subscription is correctly linked and resource limits stored
        $this->assertDatabaseHas('subscriptions', [
            'organization_id' => $organization->id,
            'subscription_plan_id' => $this->starterPlan->id,
            'status' => 'ACTIVE',
            'resource_limit' => 50,
            'price' => 2499.00,
        ]);
    }

    /**
     * Test: Non-admin users cannot access admin organization routes.
     */
    public function test_non_admin_cannot_access_admin_organization_endpoints(): void
    {
        // Unauthenticated
        $this->getJson('/api/v1/admin/organizations')->assertStatus(401);

        // Authenticated as Provider User (no platform role)
        $providerUser = User::factory()->create([
            'platform_role' => null,
        ]);
        Sanctum::actingAs($providerUser);

        $this->getJson('/api/v1/admin/organizations')->assertStatus(403);
    }

    /**
     * Test: Admin can view and update an organization.
     */
    public function test_admin_can_view_and_update_organization(): void
    {
        Sanctum::actingAs($this->superAdmin);

        $org = Organization::create([
            'name' => 'Skyline Media',
            'slug' => 'skyline-media',
            'status' => 'ACTIVE',
        ]);

        $response = $this->getJson("/api/v1/admin/organizations/{$org->uuid}");
        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'name' => 'Skyline Media',
                ],
            ]);

        $updateResponse = $this->putJson("/api/v1/admin/organizations/{$org->uuid}", [
            'status' => 'SUSPENDED',
        ]);

        $updateResponse->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'status' => 'SUSPENDED',
                ],
            ]);

        $this->assertDatabaseHas('organizations', [
            'id' => $org->id,
            'status' => 'SUSPENDED',
        ]);
    }
}
