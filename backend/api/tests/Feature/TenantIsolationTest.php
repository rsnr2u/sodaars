<?php

namespace Tests\Feature;

use App\Enums\MembershipStatus;
use App\Enums\ProviderRole;
use App\Models\Organization;
use App\Models\OrganizationUser;
use App\Models\Scopes\TenantScope;
use App\Models\Traits\BelongsToTenant;
use App\Models\User;
use App\Services\Tenant\TenantContext;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Schema;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

// Dummy model to test BelongsToTenant and TenantScope
class TestTenantResource extends Model
{
    use BelongsToTenant;

    protected $table = 'test_tenant_resources';
    protected $fillable = ['organization_id', 'title'];
}

class TenantIsolationTest extends TestCase
{
    use RefreshDatabase;

    protected Organization $orgA;
    protected Organization $orgB;
    protected User $ownerA;
    protected User $staffA;
    protected User $ownerB;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();

        // Create Organization A
        $this->orgA = Organization::create([
            'name' => 'Provider Alpha Ads',
            'slug' => 'provider-alpha-ads',
            'status' => 'ACTIVE',
        ]);

        // Owner A
        $this->ownerA = User::factory()->create(['name' => 'Owner Alpha', 'platform_role' => null]);
        OrganizationUser::create([
            'organization_id' => $this->orgA->id,
            'user_id' => $this->ownerA->id,
            'role' => ProviderRole::PROVIDER_OWNER->value,
            'status' => MembershipStatus::ACTIVE->value,
            'is_default' => true,
        ]);

        // Staff A
        $this->staffA = User::factory()->create(['name' => 'Staff Alpha', 'platform_role' => null]);
        OrganizationUser::create([
            'organization_id' => $this->orgA->id,
            'user_id' => $this->staffA->id,
            'role' => ProviderRole::PROVIDER_STAFF->value,
            'status' => MembershipStatus::ACTIVE->value,
            'is_default' => true,
        ]);

        // Create Organization B
        $this->orgB = Organization::create([
            'name' => 'Provider Beta Ads',
            'slug' => 'provider-beta-ads',
            'status' => 'ACTIVE',
        ]);

        // Owner B
        $this->ownerB = User::factory()->create(['name' => 'Owner Beta', 'platform_role' => null]);
        OrganizationUser::create([
            'organization_id' => $this->orgB->id,
            'user_id' => $this->ownerB->id,
            'role' => ProviderRole::PROVIDER_OWNER->value,
            'status' => MembershipStatus::ACTIVE->value,
            'is_default' => true,
        ]);

        // Setup temporary table for testing BelongsToTenant trait
        Schema::create('test_tenant_resources', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('organization_id');
            $table->string('title');
            $table->timestamps();
        });
    }

    protected function tearDown(): void
    {
        Schema::dropIfExists('test_tenant_resources');
        parent::tearDown();
    }

    /**
     * Test 6: Provider user can access their own organization.
     */
    public function test_provider_user_can_access_own_organization(): void
    {
        Sanctum::actingAs($this->ownerA);

        $response = $this->getJson('/api/v1/tenant/organization');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'id' => $this->orgA->id,
                    'name' => 'Provider Alpha Ads',
                ],
            ]);
    }

    /**
     * Test 7: Provider user cannot access another organization by passing arbitrary X-Organization-Id.
     */
    public function test_provider_user_cannot_access_another_organization(): void
    {
        Sanctum::actingAs($this->ownerA);

        // Attempt to access Organization B via header
        $response = $this->withHeaders([
            'X-Organization-Id' => $this->orgB->id,
        ])->getJson('/api/v1/tenant/organization');

        $response->assertStatus(403)
            ->assertJson([
                'success' => false,
                'message' => 'Access to this organization is unauthorized.',
            ]);
    }

    /**
     * Test 8 & 11: Tenant global scope and BelongsToTenant trait prevent cross-tenant access and client spoofing.
     */
    public function test_tenant_global_scope_prevents_cross_tenant_access(): void
    {
        // Set tenant context to Org A
        $context = app(TenantContext::class);
        $context->setTenant($this->orgA);

        // Create resource for Org A (auto-stamped with tenant id)
        $itemA = TestTenantResource::create(['title' => 'Hoarding Alpha 01']);
        $this->assertEquals($this->orgA->id, $itemA->organization_id);

        // Even if an attacker tries to supply organization_id = Org B, BelongsToTenant forces the authenticated tenant context
        $spoofedItem = TestTenantResource::create([
            'organization_id' => $this->orgB->id,
            'title' => 'Spoofed Resource',
        ]);
        $this->assertEquals($this->orgA->id, $spoofedItem->organization_id);

        // Switch tenant context to Org B
        $context->setTenant($this->orgB);
        TestTenantResource::create(['title' => 'LED Screen Beta 01']);

        // When Org B queries, only Org B records are returned
        $betaItems = TestTenantResource::all();
        $this->assertCount(1, $betaItems);
        $this->assertEquals('LED Screen Beta 01', $betaItems->first()->title);

        // Clean up context
        $context->clear();
    }

    /**
     * Test 9: Provider Owner permissions work (can add staff and update organization).
     */
    public function test_provider_owner_can_add_staff_and_update_profile(): void
    {
        Sanctum::actingAs($this->ownerA);

        // Owner can add a staff user
        $addResponse = $this->postJson('/api/v1/tenant/users', [
            'name' => 'New Staff Member',
            'email' => 'newstaff@alpha.com',
            'role' => ProviderRole::PROVIDER_STAFF->value,
        ]);

        $addResponse->assertStatus(201)
            ->assertJson([
                'success' => true,
                'data' => [
                    'role' => ProviderRole::PROVIDER_STAFF->value,
                ],
            ]);

        // Owner can update profile
        $updateResponse = $this->putJson('/api/v1/tenant/organization', [
            'city' => 'Hyderabad',
        ]);

        $updateResponse->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'city' => 'Hyderabad',
                ],
            ]);
    }

    /**
     * Test 10: Provider Staff cannot perform Owner-only operations.
     */
    public function test_provider_staff_cannot_perform_owner_operations(): void
    {
        Sanctum::actingAs($this->staffA);

        // Staff cannot update organization profile
        $updateResponse = $this->putJson('/api/v1/tenant/organization', [
            'city' => 'Guntur',
        ]);
        $updateResponse->assertStatus(403);

        // Staff cannot add new members
        $addResponse = $this->postJson('/api/v1/tenant/users', [
            'name' => 'Unauthorized User',
            'email' => 'unauth@alpha.com',
            'role' => ProviderRole::PROVIDER_STAFF->value,
        ]);
        $addResponse->assertStatus(403);
    }
}
