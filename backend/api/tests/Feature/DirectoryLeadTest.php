<?php

namespace Tests\Feature;

use App\Enums\DimensionUnit;
use App\Enums\LeadStatus;
use App\Enums\LocationStatus;
use App\Enums\ProviderRole;
use App\Enums\ResourceCategory;
use App\Enums\ResourceStatus;
use App\Enums\ResourceType;
use App\Enums\SubscriptionStatus;
use App\Models\AdvertisingResource;
use App\Models\DirectoryLead;
use App\Models\Location;
use App\Models\Organization;
use App\Models\OrganizationUser;
use App\Models\Subscription;
use App\Models\SubscriptionPlan;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class DirectoryLeadTest extends TestCase
{
    use RefreshDatabase;

    protected Organization $orgA;
    protected Organization $orgB;

    protected User $ownerA;
    protected User $managerA;
    protected User $staffA;
    protected User $ownerB;

    protected Location $locationA;
    protected AdvertisingResource $resourceA;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();

        $plan = SubscriptionPlan::where('slug', 'professional')->firstOrFail();

        // 1. Setup Org A
        $this->orgA = Organization::create([
            'name' => 'Metro Hoardings A',
            'slug' => 'metro-hoardings-a',
            'email' => 'contact@metro-a.test',
            'phone' => '+91 98765 11111',
            'status' => 'ACTIVE',
            'verification_status' => 'VERIFIED',
            'verified_at' => now(),
            'public_directory_visible' => true,
        ]);

        Subscription::create([
            'organization_id' => $this->orgA->id,
            'subscription_plan_id' => $plan->id,
            'status' => SubscriptionStatus::ACTIVE->value,
            'billing_cycle' => 'MONTHLY',
            'price' => 4999.00,
            'currency' => 'INR',
            'resource_limit' => 50,
            'starts_at' => now(),
            'current_period_starts_at' => now(),
            'current_period_ends_at' => now()->addMonth(),
        ]);

        $this->ownerA = User::create([
            'name' => 'Owner A',
            'email' => 'owner.a@example.test',
            'password' => Hash::make('Password@123'),
            'status' => 'ACTIVE',
        ]);
        OrganizationUser::create([
            'organization_id' => $this->orgA->id,
            'user_id' => $this->ownerA->id,
            'role' => ProviderRole::PROVIDER_OWNER->value,
            'status' => 'ACTIVE',
            'joined_at' => now(),
        ]);

        $this->managerA = User::create([
            'name' => 'Manager A',
            'email' => 'manager.a@example.test',
            'password' => Hash::make('Password@123'),
            'status' => 'ACTIVE',
        ]);
        OrganizationUser::create([
            'organization_id' => $this->orgA->id,
            'user_id' => $this->managerA->id,
            'role' => ProviderRole::PROVIDER_MANAGER->value,
            'status' => 'ACTIVE',
            'joined_at' => now(),
        ]);

        $this->staffA = User::create([
            'name' => 'Staff A',
            'email' => 'staff.a@example.test',
            'password' => Hash::make('Password@123'),
            'status' => 'ACTIVE',
        ]);
        OrganizationUser::create([
            'organization_id' => $this->orgA->id,
            'user_id' => $this->staffA->id,
            'role' => ProviderRole::PROVIDER_STAFF->value,
            'status' => 'ACTIVE',
            'joined_at' => now(),
        ]);

        // 2. Setup Org B
        $this->orgB = Organization::create([
            'name' => 'Apex Displays B',
            'slug' => 'apex-displays-b',
            'email' => 'contact@apex-b.test',
            'phone' => '+91 98765 22222',
            'status' => 'ACTIVE',
            'verification_status' => 'VERIFIED',
            'verified_at' => now(),
            'public_directory_visible' => true,
        ]);

        Subscription::create([
            'organization_id' => $this->orgB->id,
            'subscription_plan_id' => $plan->id,
            'status' => SubscriptionStatus::ACTIVE->value,
            'billing_cycle' => 'MONTHLY',
            'price' => 4999.00,
            'currency' => 'INR',
            'resource_limit' => 50,
            'starts_at' => now(),
            'current_period_starts_at' => now(),
            'current_period_ends_at' => now()->addMonth(),
        ]);

        $this->ownerB = User::create([
            'name' => 'Owner B',
            'email' => 'owner.b@example.test',
            'password' => Hash::make('Password@123'),
            'status' => 'ACTIVE',
        ]);
        OrganizationUser::create([
            'organization_id' => $this->orgB->id,
            'user_id' => $this->ownerB->id,
            'role' => ProviderRole::PROVIDER_OWNER->value,
            'status' => 'ACTIVE',
            'joined_at' => now(),
        ]);

        // 3. Setup Inventory for Org A
        $this->locationA = Location::create([
            'organization_id' => $this->orgA->id,
            'name' => 'MG Road Flyover',
            'code' => 'MGR-01',
            'city' => 'Vijayawada',
            'state' => 'Andhra Pradesh',
            'area' => 'Governorpet',
            'status' => LocationStatus::ACTIVE->value,
        ]);

        $this->resourceA = AdvertisingResource::create([
            'organization_id' => $this->orgA->id,
            'location_id' => $this->locationA->id,
            'name' => 'MG Road Spectacular Billboard',
            'code' => 'MGR-SPEC-01',
            'resource_type' => ResourceType::BILLBOARD->value,
            'category' => ResourceCategory::STATIC->value,
            'width' => 50.00,
            'height' => 20.00,
            'dimension_unit' => DimensionUnit::FEET->value,
            'base_price_monthly' => 75000.00,
            'currency' => 'INR',
            'status' => ResourceStatus::ACTIVE->value,
        ]);
    }

    public function test_resource_lead_submission_captures_immutable_historical_snapshots(): void
    {
        $payload = [
            'name' => 'Vikram Agency Buyer',
            'company_name' => 'Zenith Media Planners',
            'email' => 'vikram@zenithmedia.test',
            'phone' => '+91 99887 76655',
            'campaign_start_date' => '2026-10-01',
            'campaign_end_date' => '2026-10-31',
            'estimated_budget' => 80000.00,
            'message' => 'Interested in Diwali festive campaign placement.',
        ];

        $response = $this->postJson("/api/v1/public/resources/{$this->resourceA->slug}/contact", $payload);

        $response->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.resource_name', 'MG Road Spectacular Billboard');

        $lead = DirectoryLead::where('email', 'vikram@zenithmedia.test')->first();
        $this->assertNotNull($lead);
        $this->assertEquals($this->orgA->id, $lead->organization_id);
        $this->assertEquals($this->resourceA->id, $lead->advertising_resource_id);
        $this->assertEquals($this->locationA->id, $lead->location_id);

        // Verify snapshots are recorded
        $this->assertEquals('MG Road Spectacular Billboard', $lead->resource_name_snapshot);
        $this->assertEquals('MGR-SPEC-01', $lead->resource_code_snapshot);
        $this->assertEquals($this->resourceA->uuid, $lead->resource_uuid_snapshot);
        $this->assertEquals('MG Road Flyover', $lead->location_name_snapshot);
        $this->assertEquals('Governorpet', $lead->location_area_snapshot);
        $this->assertEquals($this->locationA->uuid, $lead->location_uuid_snapshot);
        $this->assertEquals('NEW', $lead->status->value);
    }

    public function test_provider_general_lead_submission(): void
    {
        $payload = [
            'name' => 'Ananya Brand Lead',
            'email' => 'ananya@brand.test',
            'phone' => '+91 91234 56789',
            'message' => 'Looking for multiple hoardings in Vijayawada for an upcoming product launch.',
        ];

        $response = $this->postJson("/api/v1/public/providers/{$this->orgA->slug}/contact", $payload);

        $response->assertStatus(201)
            ->assertJsonPath('success', true);

        $lead = DirectoryLead::where('email', 'ananya@brand.test')->first();
        $this->assertNotNull($lead);
        $this->assertEquals($this->orgA->id, $lead->organization_id);
        $this->assertNull($lead->advertising_resource_id);
        $this->assertNull($lead->location_id);
    }

    public function test_honeypot_rejects_spam_submissions(): void
    {
        $payload = [
            'name' => 'Spam Bot',
            'email' => 'spambot@spam.test',
            'phone' => '+1 555 123 4567',
            'message' => 'Cheap SEO services available.',
            'hp_field' => 'I am a bot', // Filled honeypot
        ];

        $response = $this->postJson("/api/v1/public/resources/{$this->resourceA->slug}/contact", $payload);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['hp_field']);
    }

    public function test_provider_lead_inbox_visibility_and_tenant_isolation(): void
    {
        // Create lead for Org A
        $leadA = DirectoryLead::create([
            'organization_id' => $this->orgA->id,
            'name' => 'Lead for A',
            'email' => 'client.a@test.com',
            'phone' => '+91 90000 11111',
            'message' => 'Inquiry for Org A',
            'status' => 'NEW',
        ]);

        // Create lead for Org B
        $leadB = DirectoryLead::create([
            'organization_id' => $this->orgB->id,
            'name' => 'Lead for B',
            'email' => 'client.b@test.com',
            'phone' => '+91 90000 22222',
            'message' => 'Inquiry for Org B',
            'status' => 'NEW',
        ]);

        // Owner A views lead inbox
        Sanctum::actingAs($this->ownerA);
        $responseA = $this->withHeaders(['X-Organization-Id' => $this->orgA->uuid])
            ->getJson('/api/v1/tenant/leads');

        $responseA->assertStatus(200);
        $leadsDataA = $responseA->json('data.items');
        $this->assertCount(1, $leadsDataA);
        $this->assertEquals('Lead for A', $leadsDataA[0]['visitor']['name']);

        // Owner A cannot view Lead B details (returns 404 or 403)
        $respCrossTenant = $this->withHeaders(['X-Organization-Id' => $this->orgA->uuid])
            ->getJson("/api/v1/tenant/leads/{$leadB->uuid}");
        $respCrossTenant->assertStatus(404);

        // Owner B views lead inbox
        Sanctum::actingAs($this->ownerB);
        $responseB = $this->withHeaders(['X-Organization-Id' => $this->orgB->uuid])
            ->getJson('/api/v1/tenant/leads');

        $responseB->assertStatus(200);
        $leadsDataB = $responseB->json('data.items');
        $this->assertCount(1, $leadsDataB);
        $this->assertEquals('Lead for B', $leadsDataB[0]['visitor']['name']);
    }

    public function test_lead_lifecycle_state_machine_valid_transitions(): void
    {
        Sanctum::actingAs($this->managerA);

        // 1. Create NEW lead
        $lead = DirectoryLead::create([
            'organization_id' => $this->orgA->id,
            'name' => 'Client',
            'email' => 'client@test.com',
            'phone' => '1234567890',
            'message' => 'Test',
            'status' => LeadStatus::NEW->value,
        ]);

        // Transition: NEW -> CONTACTED (valid)
        $resp1 = $this->withHeaders(['X-Organization-Id' => $this->orgA->uuid])
            ->putJson("/api/v1/tenant/leads/{$lead->uuid}/status", ['status' => 'CONTACTED']);
        $resp1->assertStatus(200)->assertJsonPath('data.status', 'CONTACTED');

        // Transition: CONTACTED -> CONVERTED (valid)
        $resp2 = $this->withHeaders(['X-Organization-Id' => $this->orgA->uuid])
            ->putJson("/api/v1/tenant/leads/{$lead->uuid}/status", ['status' => 'CONVERTED']);
        $resp2->assertStatus(200)->assertJsonPath('data.status', 'CONVERTED');

        // 2. Create another NEW lead for ARCHIVED branch
        $lead2 = DirectoryLead::create([
            'organization_id' => $this->orgA->id,
            'name' => 'Client 2',
            'email' => 'client2@test.com',
            'phone' => '1234567890',
            'message' => 'Test',
            'status' => LeadStatus::NEW->value,
        ]);

        // Transition: NEW -> ARCHIVED (valid)
        $resp3 = $this->withHeaders(['X-Organization-Id' => $this->orgA->uuid])
            ->putJson("/api/v1/tenant/leads/{$lead2->uuid}/status", ['status' => 'ARCHIVED']);
        $resp3->assertStatus(200)->assertJsonPath('data.status', 'ARCHIVED');
    }

    public function test_lead_lifecycle_state_machine_rejects_invalid_transitions(): void
    {
        Sanctum::actingAs($this->ownerA);

        // 1. Cannot transition directly from NEW to CONVERTED
        $leadNew = DirectoryLead::create([
            'organization_id' => $this->orgA->id,
            'name' => 'New Lead',
            'email' => 'new@test.com',
            'phone' => '1234567890',
            'message' => 'Test',
            'status' => LeadStatus::NEW->value,
        ]);

        $respInvalid = $this->withHeaders(['X-Organization-Id' => $this->orgA->uuid])
            ->putJson("/api/v1/tenant/leads/{$leadNew->uuid}/status", ['status' => 'CONVERTED']);
        $respInvalid->assertStatus(422)
            ->assertJsonPath('success', false);

        // 2. Terminal state: CONVERTED cannot transition out
        $leadConverted = DirectoryLead::create([
            'organization_id' => $this->orgA->id,
            'name' => 'Converted Lead',
            'email' => 'converted@test.com',
            'phone' => '1234567890',
            'message' => 'Test',
            'status' => LeadStatus::CONVERTED->value,
        ]);

        $respTerminal = $this->withHeaders(['X-Organization-Id' => $this->orgA->uuid])
            ->putJson("/api/v1/tenant/leads/{$leadConverted->uuid}/status", ['status' => 'CONTACTED']);
        $respTerminal->assertStatus(422);

        // 3. Terminal state: ARCHIVED cannot transition out
        $leadArchived = DirectoryLead::create([
            'organization_id' => $this->orgA->id,
            'name' => 'Archived Lead',
            'email' => 'archived@test.com',
            'phone' => '1234567890',
            'message' => 'Test',
            'status' => LeadStatus::ARCHIVED->value,
        ]);

        $respArchived = $this->withHeaders(['X-Organization-Id' => $this->orgA->uuid])
            ->putJson("/api/v1/tenant/leads/{$leadArchived->uuid}/status", ['status' => 'NEW']);
        $respArchived->assertStatus(422);
    }

    public function test_provider_can_update_internal_notes_and_soft_delete_lead(): void
    {
        Sanctum::actingAs($this->staffA);

        $lead = DirectoryLead::create([
            'organization_id' => $this->orgA->id,
            'name' => 'Followup Lead',
            'email' => 'followup@test.com',
            'phone' => '1234567890',
            'message' => 'Test',
            'status' => LeadStatus::NEW->value,
        ]);

        // Staff updates notes
        $noteResp = $this->withHeaders(['X-Organization-Id' => $this->orgA->uuid])
            ->putJson("/api/v1/tenant/leads/{$lead->uuid}/notes", [
                'internal_notes' => 'Called client on phone. Awaiting budget confirmation from their marketing director.',
            ]);

        $noteResp->assertStatus(200)
            ->assertJsonPath('data.internal_notes', 'Called client on phone. Awaiting budget confirmation from their marketing director.');

        // Manager soft deletes lead
        Sanctum::actingAs($this->managerA);
        $delResp = $this->withHeaders(['X-Organization-Id' => $this->orgA->uuid])
            ->deleteJson("/api/v1/tenant/leads/{$lead->uuid}");

        $delResp->assertStatus(200);
        $this->assertSoftDeleted('directory_leads', ['id' => $lead->id]);
    }

    public function test_only_provider_owner_can_toggle_public_directory_visibility(): void
    {
        // 1. Owner can toggle visibility
        Sanctum::actingAs($this->ownerA);
        $ownerResp = $this->withHeaders(['X-Organization-Id' => $this->orgA->uuid])
            ->putJson('/api/v1/tenant/organization/visibility', [
                'public_directory_visible' => false,
            ]);

        $ownerResp->assertStatus(200)
            ->assertJsonPath('data.public_directory_visible', false);

        $this->assertFalse((bool) $this->orgA->fresh()->public_directory_visible);

        // 2. Manager receives 403 Forbidden
        Sanctum::actingAs($this->managerA);
        $managerResp = $this->withHeaders(['X-Organization-Id' => $this->orgA->uuid])
            ->putJson('/api/v1/tenant/organization/visibility', [
                'public_directory_visible' => true,
            ]);

        $managerResp->assertStatus(403);

        // 3. Staff receives 403 Forbidden
        Sanctum::actingAs($this->staffA);
        $staffResp = $this->withHeaders(['X-Organization-Id' => $this->orgA->uuid])
            ->putJson('/api/v1/tenant/organization/visibility', [
                'public_directory_visible' => true,
            ]);

        $staffResp->assertStatus(403);
    }
}
