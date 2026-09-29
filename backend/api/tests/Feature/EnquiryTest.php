<?php

namespace Tests\Feature;

use App\Enums\CustomerStatus;
use App\Enums\CustomerType;
use App\Enums\DimensionUnit;
use App\Enums\EnquiryPriority;
use App\Enums\EnquirySource;
use App\Enums\EnquiryStatus;
use App\Enums\IlluminationType;
use App\Enums\LocationStatus;
use App\Enums\MembershipStatus;
use App\Enums\ProviderRole;
use App\Enums\ResourceCategory;
use App\Enums\ResourceStatus;
use App\Enums\ResourceType;
use App\Enums\ScheduleBlockType;
use App\Enums\ScheduleStatus;
use App\Enums\SubscriptionStatus;
use App\Models\AdvertisingResource;
use App\Models\Customer;
use App\Models\Enquiry;
use App\Models\Location;
use App\Models\Organization;
use App\Models\OrganizationUser;
use App\Models\ResourceSchedule;
use App\Models\Subscription;
use App\Models\SubscriptionPlan;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class EnquiryTest extends TestCase
{
    use RefreshDatabase;

    protected Organization $orgA;
    protected Organization $orgB;

    protected User $ownerA;
    protected User $managerA;
    protected User $staffA;

    protected User $ownerB;

    protected Customer $customerA;
    protected Customer $blockedCustomerA;
    protected Customer $customerB;

    protected Location $locA;
    protected AdvertisingResource $resourceA;

    protected Location $locB;
    protected AdvertisingResource $resourceB;

    protected SubscriptionPlan $starterPlan;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();

        $this->starterPlan = SubscriptionPlan::where('slug', 'starter')->firstOrFail();

        // 1. Setup Organization A
        $this->orgA = Organization::create([
            'name' => 'Apex Media Network',
            'slug' => 'apex-media-network',
            'email' => 'contact@apexmedia.test',
            'status' => 'ACTIVE',
            'verification_status' => 'VERIFIED',
        ]);

        Subscription::create([
            'organization_id' => $this->orgA->id,
            'subscription_plan_id' => $this->starterPlan->id,
            'status' => SubscriptionStatus::ACTIVE->value,
            'billing_cycle' => 'MONTHLY',
            'price' => 2499.00,
            'currency' => 'INR',
            'resource_limit' => 50,
            'starts_at' => now()->subDays(10),
            'ends_at' => now()->addDays(20),
        ]);

        $this->ownerA = User::create([
            'name' => 'Owner Apex',
            'email' => 'owner@apexmedia.test',
            'password' => Hash::make('password123'),
            'email_verified_at' => now(),
            'status' => 'ACTIVE',
        ]);
        OrganizationUser::create([
            'organization_id' => $this->orgA->id,
            'user_id' => $this->ownerA->id,
            'role' => ProviderRole::PROVIDER_OWNER->value,
            'status' => MembershipStatus::ACTIVE->value,
        ]);

        $this->managerA = User::create([
            'name' => 'Manager Apex',
            'email' => 'manager@apexmedia.test',
            'password' => Hash::make('password123'),
            'email_verified_at' => now(),
            'status' => 'ACTIVE',
        ]);
        OrganizationUser::create([
            'organization_id' => $this->orgA->id,
            'user_id' => $this->managerA->id,
            'role' => ProviderRole::PROVIDER_MANAGER->value,
            'status' => MembershipStatus::ACTIVE->value,
        ]);

        $this->staffA = User::create([
            'name' => 'Staff Apex',
            'email' => 'staff@apexmedia.test',
            'password' => Hash::make('password123'),
            'email_verified_at' => now(),
            'status' => 'ACTIVE',
        ]);
        OrganizationUser::create([
            'organization_id' => $this->orgA->id,
            'user_id' => $this->staffA->id,
            'role' => ProviderRole::PROVIDER_STAFF->value,
            'status' => MembershipStatus::ACTIVE->value,
        ]);

        $this->customerA = Customer::create([
            'organization_id' => $this->orgA->id,
            'code' => 'CUST-A01',
            'customer_type' => CustomerType::DIRECT_ADVERTISER->value,
            'company_name' => 'Apex VIP Client',
            'contact_person' => 'Sunil Kumar',
            'phone' => '+91 91234 56789',
            'status' => CustomerStatus::ACTIVE->value,
        ]);

        $this->blockedCustomerA = Customer::create([
            'organization_id' => $this->orgA->id,
            'code' => 'CUST-A02',
            'customer_type' => CustomerType::DIRECT_ADVERTISER->value,
            'company_name' => 'Blocked Bad Debtor',
            'contact_person' => 'Bad Debtor',
            'phone' => '+91 91234 00000',
            'status' => CustomerStatus::BLOCKED->value,
        ]);

        $this->locA = Location::create([
            'organization_id' => $this->orgA->id,
            'name' => 'Koramangala Sony Signal',
            'code' => 'LOC-KOR-01',
            'latitude' => 12.9352,
            'longitude' => 77.6245,
            'city' => 'Bengaluru',
            'state' => 'Karnataka',
            'status' => LocationStatus::ACTIVE->value,
        ]);

        $this->resourceA = AdvertisingResource::create([
            'organization_id' => $this->orgA->id,
            'location_id' => $this->locA->id,
            'name' => 'Sony Signal Unipole Face A',
            'code' => 'RES-KOR-01A',
            'resource_type' => ResourceType::UNIPOLE->value,
            'category' => ResourceCategory::STATIC->value,
            'width' => 40.0,
            'height' => 20.0,
            'dimension_unit' => DimensionUnit::FEET->value,
            'illumination_type' => IlluminationType::FRONT_LIT->value,
            'status' => ResourceStatus::ACTIVE->value,
            'base_price_monthly' => 150000.00,
        ]);

        // 2. Setup Organization B
        $this->orgB = Organization::create([
            'name' => 'Zenith Outdoor Network',
            'slug' => 'zenith-outdoor-network',
            'email' => 'contact@zenithoutdoor.test',
            'status' => 'ACTIVE',
            'verification_status' => 'VERIFIED',
        ]);

        Subscription::create([
            'organization_id' => $this->orgB->id,
            'subscription_plan_id' => $this->starterPlan->id,
            'status' => SubscriptionStatus::ACTIVE->value,
            'billing_cycle' => 'MONTHLY',
            'price' => 2499.00,
            'currency' => 'INR',
            'resource_limit' => 50,
            'starts_at' => now()->subDays(10),
            'ends_at' => now()->addDays(20),
        ]);

        $this->ownerB = User::create([
            'name' => 'Owner Zenith',
            'email' => 'owner@zenithoutdoor.test',
            'password' => Hash::make('password123'),
            'email_verified_at' => now(),
            'status' => 'ACTIVE',
        ]);
        OrganizationUser::create([
            'organization_id' => $this->orgB->id,
            'user_id' => $this->ownerB->id,
            'role' => ProviderRole::PROVIDER_OWNER->value,
            'status' => MembershipStatus::ACTIVE->value,
        ]);

        $this->customerB = Customer::create([
            'organization_id' => $this->orgB->id,
            'code' => 'CUST-B01',
            'customer_type' => CustomerType::DIRECT_ADVERTISER->value,
            'company_name' => 'Zenith Private Client',
            'contact_person' => 'Ravi Zenith',
            'phone' => '+91 99887 66554',
            'status' => CustomerStatus::ACTIVE->value,
        ]);

        $this->locB = Location::create([
            'organization_id' => $this->orgB->id,
            'name' => 'Indiranagar 100ft Road',
            'code' => 'LOC-IND-01',
            'latitude' => 12.9716,
            'longitude' => 77.6412,
            'city' => 'Bengaluru',
            'state' => 'Karnataka',
            'status' => LocationStatus::ACTIVE->value,
        ]);

        $this->resourceB = AdvertisingResource::create([
            'organization_id' => $this->orgB->id,
            'location_id' => $this->locB->id,
            'name' => 'Indiranagar Gantry Face A',
            'code' => 'RES-IND-01A',
            'resource_type' => ResourceType::GANTRY->value,
            'category' => ResourceCategory::STATIC->value,
            'width' => 60.0,
            'height' => 15.0,
            'dimension_unit' => DimensionUnit::FEET->value,
            'illumination_type' => IlluminationType::BACK_LIT->value,
            'status' => ResourceStatus::ACTIVE->value,
            'base_price_monthly' => 200000.00,
        ]);
    }

    public function test_owner_can_create_enquiry_with_items(): void
    {
        Sanctum::actingAs($this->ownerA, ['*']);

        $response = $this->postJson('/api/v1/tenant/enquiries', [
            'customer_id' => $this->customerA->id,
            'campaign_title' => 'Diwali Grand Fest 2026',
            'priority' => EnquiryPriority::HIGH->value,
            'source' => EnquirySource::DIRECT_VISIT->value,
            'start_date' => '2026-11-01',
            'end_date' => '2026-11-15',
            'estimated_budget' => 300000.00,
            'items' => [
                [
                    'advertising_resource_id' => $this->resourceA->id,
                    'proposed_rate' => 140000.00,
                    'notes' => 'Negotiated festive discount',
                ],
                [
                    'location_id' => $this->locA->id,
                    'notes' => 'Looking for another face if available',
                ],
            ],
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.campaign_title', 'Diwali Grand Fest 2026')
            ->assertJsonPath('data.status', EnquiryStatus::NEW->value)
            ->assertJsonPath('data.enquiry_number', 'ENQ-' . date('Y') . '-0001')
            ->assertJsonCount(2, 'data.items');

        $this->assertDatabaseHas('enquiries', [
            'organization_id' => $this->orgA->id,
            'campaign_title' => 'Diwali Grand Fest 2026',
            'customer_id' => $this->customerA->id,
        ]);

        $this->assertDatabaseHas('enquiry_items', [
            'advertising_resource_id' => $this->resourceA->id,
            'location_id' => null,
        ]);

        $this->assertDatabaseHas('enquiry_items', [
            'advertising_resource_id' => null,
            'location_id' => $this->locA->id,
        ]);
    }

    public function test_manager_can_create_enquiry_with_items(): void
    {
        Sanctum::actingAs($this->managerA, ['*']);

        $response = $this->postJson('/api/v1/tenant/enquiries', [
            'customer_id' => $this->customerA->id,
            'campaign_title' => 'New Year Launch Campaign',
            'items' => [
                [
                    'advertising_resource_id' => $this->resourceA->id,
                ],
            ],
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.campaign_title', 'New Year Launch Campaign');
    }

    public function test_staff_can_create_enquiry_with_items(): void
    {
        Sanctum::actingAs($this->staffA, ['*']);

        $response = $this->postJson('/api/v1/tenant/enquiries', [
            'customer_id' => $this->customerA->id,
            'campaign_title' => 'Retail Promotional Push',
            'items' => [
                [
                    'location_id' => $this->locA->id,
                ],
            ],
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.campaign_title', 'Retail Promotional Push');
    }

    public function test_staff_can_update_enquiry(): void
    {
        $enquiry = Enquiry::create([
            'organization_id' => $this->orgA->id,
            'enquiry_number' => 'ENQ-2026-0001',
            'customer_id' => $this->customerA->id,
            'campaign_title' => 'Original Title',
            'status' => EnquiryStatus::NEW->value,
        ]);

        Sanctum::actingAs($this->staffA, ['*']);

        $response = $this->putJson("/api/v1/tenant/enquiries/{$enquiry->uuid}", [
            'campaign_title' => 'Updated Campaign Title',
            'estimated_budget' => 500000.00,
        ]);

        $response->assertOk()
            ->assertJsonPath('data.campaign_title', 'Updated Campaign Title')
            ->assertJsonPath('data.estimated_budget', 500000);
    }

    public function test_staff_cannot_delete_enquiry(): void
    {
        $enquiry = Enquiry::create([
            'organization_id' => $this->orgA->id,
            'enquiry_number' => 'ENQ-2026-0001',
            'customer_id' => $this->customerA->id,
            'campaign_title' => 'To Be Deleted',
            'status' => EnquiryStatus::NEW->value,
        ]);

        Sanctum::actingAs($this->staffA, ['*']);

        $response = $this->deleteJson("/api/v1/tenant/enquiries/{$enquiry->uuid}");

        $response->assertStatus(403);
        $this->assertDatabaseHas('enquiries', ['id' => $enquiry->id, 'deleted_at' => null]);
    }

    public function test_manager_and_owner_can_delete_enquiry(): void
    {
        $enquiry = Enquiry::create([
            'organization_id' => $this->orgA->id,
            'enquiry_number' => 'ENQ-2026-0001',
            'customer_id' => $this->customerA->id,
            'campaign_title' => 'Manager Deleted Enquiry',
            'status' => EnquiryStatus::NEW->value,
        ]);

        Sanctum::actingAs($this->managerA, ['*']);

        $response = $this->deleteJson("/api/v1/tenant/enquiries/{$enquiry->uuid}");

        $response->assertOk();
        $this->assertSoftDeleted('enquiries', ['id' => $enquiry->id]);
    }

    public function test_creating_enquiry_does_not_block_inventory_by_default(): void
    {
        Sanctum::actingAs($this->ownerA, ['*']);

        $response = $this->postJson('/api/v1/tenant/enquiries', [
            'customer_id' => $this->customerA->id,
            'campaign_title' => 'Passive Inquiry Without Hold',
            'start_date' => '2026-11-01',
            'end_date' => '2026-11-15',
            'items' => [
                [
                    'advertising_resource_id' => $this->resourceA->id,
                ],
            ],
        ]);

        $response->assertStatus(201);

        // Invariant: zero schedule records created
        $this->assertEquals(0, ResourceSchedule::count());
    }

    public function test_cannot_create_enquiry_for_blocked_customer(): void
    {
        Sanctum::actingAs($this->ownerA, ['*']);

        $response = $this->postJson('/api/v1/tenant/enquiries', [
            'customer_id' => $this->blockedCustomerA->id,
            'campaign_title' => 'Inquiry for Defaulting Debtor',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['customer_id']);
    }

    public function test_enquiry_item_enforces_exclusive_xor_resource_or_location(): void
    {
        Sanctum::actingAs($this->ownerA, ['*']);

        // Case A: Both populated (forbidden)
        $responseA = $this->postJson('/api/v1/tenant/enquiries', [
            'customer_id' => $this->customerA->id,
            'campaign_title' => 'Invalid Double Demand',
            'items' => [
                [
                    'advertising_resource_id' => $this->resourceA->id,
                    'location_id' => $this->locA->id,
                ],
            ],
        ]);
        $responseA->assertStatus(422);

        // Case B: Neither populated (forbidden)
        $responseB = $this->postJson('/api/v1/tenant/enquiries', [
            'customer_id' => $this->customerA->id,
            'campaign_title' => 'Invalid Empty Demand',
            'items' => [
                [
                    'notes' => 'No resource or location given',
                ],
            ],
        ]);
        $responseB->assertStatus(422);
    }

    public function test_tenant_integrity_blocks_cross_tenant_customer(): void
    {
        Sanctum::actingAs($this->ownerA, ['*']);

        $response = $this->postJson('/api/v1/tenant/enquiries', [
            'customer_id' => $this->customerB->id, // Belongs to Org B
            'campaign_title' => 'Spoofed Customer Enquiry',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['customer_id']);
    }

    public function test_tenant_integrity_blocks_cross_tenant_resource_in_item(): void
    {
        Sanctum::actingAs($this->ownerA, ['*']);

        $response = $this->postJson('/api/v1/tenant/enquiries', [
            'customer_id' => $this->customerA->id,
            'campaign_title' => 'Cross Tenant Resource Attack',
            'items' => [
                [
                    'advertising_resource_id' => $this->resourceB->id, // Belongs to Org B
                ],
            ],
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['items.0.advertising_resource_id']);
    }

    public function test_tenant_integrity_blocks_cross_tenant_location_in_item(): void
    {
        Sanctum::actingAs($this->ownerA, ['*']);

        $response = $this->postJson('/api/v1/tenant/enquiries', [
            'customer_id' => $this->customerA->id,
            'campaign_title' => 'Cross Tenant Location Attack',
            'items' => [
                [
                    'location_id' => $this->locB->id, // Belongs to Org B
                ],
            ],
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['items.0.location_id']);
    }

    public function test_authorized_user_can_list_enquiries_with_filters(): void
    {
        Enquiry::create([
            'organization_id' => $this->orgA->id,
            'enquiry_number' => 'ENQ-2026-0001',
            'customer_id' => $this->customerA->id,
            'campaign_title' => 'High Priority Urgent Lead',
            'status' => EnquiryStatus::NEW->value,
            'priority' => EnquiryPriority::HIGH->value,
        ]);

        Enquiry::create([
            'organization_id' => $this->orgA->id,
            'enquiry_number' => 'ENQ-2026-0002',
            'customer_id' => $this->customerA->id,
            'campaign_title' => 'Low Priority Lead',
            'status' => EnquiryStatus::QUOTED->value,
            'priority' => EnquiryPriority::LOW->value,
        ]);

        Sanctum::actingAs($this->staffA, ['*']);

        // Filter by priority
        $response = $this->getJson('/api/v1/tenant/enquiries?priority=' . EnquiryPriority::HIGH->value);
        $response->assertOk()
            ->assertJsonCount(1, 'data.items')
            ->assertJsonPath('data.items.0.enquiry_number', 'ENQ-2026-0001');

        // Filter by status
        $response = $this->getJson('/api/v1/tenant/enquiries?status=' . EnquiryStatus::QUOTED->value);
        $response->assertOk()
            ->assertJsonCount(1, 'data.items')
            ->assertJsonPath('data.items.0.enquiry_number', 'ENQ-2026-0002');
    }

    public function test_can_check_availability_for_all_enquiry_items(): void
    {
        $enquiry = Enquiry::create([
            'organization_id' => $this->orgA->id,
            'enquiry_number' => 'ENQ-2026-0001',
            'customer_id' => $this->customerA->id,
            'campaign_title' => 'Festive Campaign Review',
            'start_date' => '2026-11-01',
            'end_date' => '2026-11-10',
            'status' => EnquiryStatus::UNDER_REVIEW->value,
        ]);

        $itemResource = $enquiry->items()->create([
            'advertising_resource_id' => $this->resourceA->id,
        ]);

        $itemLocation = $enquiry->items()->create([
            'location_id' => $this->locA->id,
        ]);

        Sanctum::actingAs($this->staffA, ['*']);

        $response = $this->postJson("/api/v1/tenant/enquiries/{$enquiry->uuid}/check-availability");

        $response->assertOk()
            ->assertJsonPath('data.items_count', 2)
            ->assertJsonPath('data.items.0.type', 'RESOURCE_INQUIRY')
            ->assertJsonPath('data.items.0.is_available', true)
            ->assertJsonPath('data.items.1.type', 'LOCATION_INQUIRY');
    }

    public function test_owner_and_manager_can_place_hold_for_enquiry_item(): void
    {
        $enquiry = Enquiry::create([
            'organization_id' => $this->orgA->id,
            'enquiry_number' => 'ENQ-2026-0001',
            'customer_id' => $this->customerA->id,
            'campaign_title' => 'VIP Hold Request',
            'start_date' => '2026-11-01',
            'end_date' => '2026-11-10',
            'status' => EnquiryStatus::UNDER_REVIEW->value,
        ]);

        $item = $enquiry->items()->create([
            'advertising_resource_id' => $this->resourceA->id,
        ]);

        Sanctum::actingAs($this->managerA, ['*']);

        $response = $this->postJson("/api/v1/tenant/enquiries/{$enquiry->uuid}/items/{$item->uuid}/hold", [
            'hold_duration_hours' => 48,
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.block_type', ScheduleBlockType::TENTATIVE_HOLD->value)
            ->assertJsonPath('data.status', ScheduleStatus::TENTATIVE->value)
            ->assertJsonPath('data.reference_type', 'ENQUIRY')
            ->assertJsonPath('data.reference_id', $enquiry->id);

        $this->assertDatabaseHas('resource_schedules', [
            'organization_id' => $this->orgA->id,
            'advertising_resource_id' => $this->resourceA->id,
            'reference_type' => 'ENQUIRY',
            'reference_id' => $enquiry->id,
            'status' => ScheduleStatus::TENTATIVE->value,
        ]);
    }

    public function test_staff_cannot_place_hold_for_enquiry_item(): void
    {
        $enquiry = Enquiry::create([
            'organization_id' => $this->orgA->id,
            'enquiry_number' => 'ENQ-2026-0001',
            'customer_id' => $this->customerA->id,
            'campaign_title' => 'Staff Hold Attempt',
            'start_date' => '2026-11-01',
            'end_date' => '2026-11-10',
            'status' => EnquiryStatus::UNDER_REVIEW->value,
        ]);

        $item = $enquiry->items()->create([
            'advertising_resource_id' => $this->resourceA->id,
        ]);

        Sanctum::actingAs($this->staffA, ['*']);

        $response = $this->postJson("/api/v1/tenant/enquiries/{$enquiry->uuid}/items/{$item->uuid}/hold");

        // Staff lacks schedule.hold.manage
        $response->assertStatus(403);
    }

    public function test_status_transition_validates_allowed_state_machine_paths(): void
    {
        $enquiry = Enquiry::create([
            'organization_id' => $this->orgA->id,
            'enquiry_number' => 'ENQ-2026-0001',
            'customer_id' => $this->customerA->id,
            'campaign_title' => 'State Machine Check',
            'status' => EnquiryStatus::NEW->value,
        ]);

        Sanctum::actingAs($this->ownerA, ['*']);

        // 1. Valid: NEW -> UNDER_REVIEW
        $r1 = $this->postJson("/api/v1/tenant/enquiries/{$enquiry->uuid}/status", [
            'status' => EnquiryStatus::UNDER_REVIEW->value,
        ]);
        $r1->assertOk()->assertJsonPath('data.status', EnquiryStatus::UNDER_REVIEW->value);

        // 2. Valid: UNDER_REVIEW -> QUOTED
        $r2 = $this->postJson("/api/v1/tenant/enquiries/{$enquiry->uuid}/status", [
            'status' => EnquiryStatus::QUOTED->value,
        ]);
        $r2->assertOk()->assertJsonPath('data.status', EnquiryStatus::QUOTED->value);

        // 3. Valid: QUOTED -> NEGOTIATING
        $r3 = $this->postJson("/api/v1/tenant/enquiries/{$enquiry->uuid}/status", [
            'status' => EnquiryStatus::NEGOTIATING->value,
        ]);
        $r3->assertOk()->assertJsonPath('data.status', EnquiryStatus::NEGOTIATING->value);

        // 4. Valid: NEGOTIATING -> CONVERTED
        $r4 = $this->postJson("/api/v1/tenant/enquiries/{$enquiry->uuid}/status", [
            'status' => EnquiryStatus::CONVERTED->value,
        ]);
        $r4->assertOk()->assertJsonPath('data.status', EnquiryStatus::CONVERTED->value);

        // 5. Invalid: CONVERTED -> NEW (terminal state)
        $r5 = $this->postJson("/api/v1/tenant/enquiries/{$enquiry->uuid}/status", [
            'status' => EnquiryStatus::NEW->value,
        ]);
        $r5->assertStatus(422);
    }

    public function test_transition_to_lost_automatically_releases_active_tentative_holds_with_audit_note(): void
    {
        $enquiry = Enquiry::create([
            'organization_id' => $this->orgA->id,
            'enquiry_number' => 'ENQ-2026-0001',
            'customer_id' => $this->customerA->id,
            'campaign_title' => 'Will Be Lost Enquiry',
            'status' => EnquiryStatus::UNDER_REVIEW->value,
        ]);

        // Place a tentative hold
        $hold = ResourceSchedule::create([
            'organization_id' => $this->orgA->id,
            'advertising_resource_id' => $this->resourceA->id,
            'block_type' => ScheduleBlockType::TENTATIVE_HOLD->value,
            'status' => ScheduleStatus::TENTATIVE->value,
            'start_date' => '2026-11-01',
            'end_date' => '2026-11-10',
            'slots_count' => 1,
            'hold_expires_at' => now()->addHours(72),
            'reference_type' => 'ENQUIRY',
            'reference_id' => $enquiry->id,
            'title' => 'Hold for Enquiry',
        ]);

        Sanctum::actingAs($this->ownerA, ['*']);

        $response = $this->postJson("/api/v1/tenant/enquiries/{$enquiry->uuid}/status", [
            'status' => EnquiryStatus::LOST->value,
            'lost_reason' => 'Client chose competitor outdoor screen',
        ]);

        $response->assertOk()
            ->assertJsonPath('data.status', EnquiryStatus::LOST->value)
            ->assertJsonPath('data.lost_reason', 'Client chose competitor outdoor screen');

        // Verify hold was released and audited
        $hold->refresh();
        $this->assertEquals(ScheduleStatus::CANCELLED, $hold->status);
        $this->assertNotNull($hold->released_at);
        $this->assertStringContainsString('[AUTO-RELEASED: ENQUIRY_LOST]', $hold->notes);
    }

    public function test_transition_to_cancelled_automatically_releases_active_tentative_holds_with_audit_note(): void
    {
        $enquiry = Enquiry::create([
            'organization_id' => $this->orgA->id,
            'enquiry_number' => 'ENQ-2026-0001',
            'customer_id' => $this->customerA->id,
            'campaign_title' => 'Will Be Cancelled Enquiry',
            'status' => EnquiryStatus::UNDER_REVIEW->value,
        ]);

        $hold = ResourceSchedule::create([
            'organization_id' => $this->orgA->id,
            'advertising_resource_id' => $this->resourceA->id,
            'block_type' => ScheduleBlockType::TENTATIVE_HOLD->value,
            'status' => ScheduleStatus::TENTATIVE->value,
            'start_date' => '2026-11-01',
            'end_date' => '2026-11-10',
            'slots_count' => 1,
            'hold_expires_at' => now()->addHours(72),
            'reference_type' => 'ENQUIRY',
            'reference_id' => $enquiry->id,
            'title' => 'Hold for Enquiry',
        ]);

        Sanctum::actingAs($this->ownerA, ['*']);

        $response = $this->postJson("/api/v1/tenant/enquiries/{$enquiry->uuid}/status", [
            'status' => EnquiryStatus::CANCELLED->value,
        ]);

        $response->assertOk()
            ->assertJsonPath('data.status', EnquiryStatus::CANCELLED->value);

        $hold->refresh();
        $this->assertEquals(ScheduleStatus::CANCELLED, $hold->status);
        $this->assertNotNull($hold->released_at);
        $this->assertStringContainsString('[AUTO-RELEASED: ENQUIRY_CANCELLED]', $hold->notes);
    }

    public function test_automatic_release_never_cancels_confirmed_booking(): void
    {
        $enquiry = Enquiry::create([
            'organization_id' => $this->orgA->id,
            'enquiry_number' => 'ENQ-2026-0001',
            'customer_id' => $this->customerA->id,
            'campaign_title' => 'Enquiry With Confirmed Booking',
            'status' => EnquiryStatus::UNDER_REVIEW->value,
        ]);

        // A confirmed booking referencing this enquiry
        $confirmedBooking = ResourceSchedule::create([
            'organization_id' => $this->orgA->id,
            'advertising_resource_id' => $this->resourceA->id,
            'block_type' => ScheduleBlockType::BOOKING->value,
            'status' => ScheduleStatus::CONFIRMED->value,
            'start_date' => '2026-11-01',
            'end_date' => '2026-11-10',
            'slots_count' => 1,
            'reference_type' => 'ENQUIRY',
            'reference_id' => $enquiry->id,
            'title' => 'Confirmed Booking',
        ]);

        Sanctum::actingAs($this->ownerA, ['*']);

        $response = $this->postJson("/api/v1/tenant/enquiries/{$enquiry->uuid}/status", [
            'status' => EnquiryStatus::CANCELLED->value,
        ]);

        $response->assertOk();

        // Confirmed booking must remain untouched
        $confirmedBooking->refresh();
        $this->assertEquals(ScheduleStatus::CONFIRMED, $confirmedBooking->status);
        $this->assertNull($confirmedBooking->released_at);
    }

    public function test_tenant_a_cannot_access_or_modify_tenant_b_enquiry(): void
    {
        $enquiryB = Enquiry::create([
            'organization_id' => $this->orgB->id,
            'enquiry_number' => 'ENQ-B-001',
            'customer_id' => $this->customerB->id,
            'campaign_title' => 'Zenith Secret Enquiry',
            'status' => EnquiryStatus::NEW->value,
        ]);

        Sanctum::actingAs($this->ownerA, ['*']);

        // View attempt
        $r1 = $this->getJson("/api/v1/tenant/enquiries/{$enquiryB->uuid}");
        $r1->assertStatus(404);

        // Update attempt
        $r2 = $this->putJson("/api/v1/tenant/enquiries/{$enquiryB->uuid}", [
            'campaign_title' => 'Tampered Title',
        ]);
        $r2->assertStatus(404);

        // Delete attempt
        $r3 = $this->deleteJson("/api/v1/tenant/enquiries/{$enquiryB->uuid}");
        $r3->assertStatus(404);
    }

    public function test_soft_delete_works_for_enquiry(): void
    {
        $enquiry = Enquiry::create([
            'organization_id' => $this->orgA->id,
            'enquiry_number' => 'ENQ-2026-0001',
            'customer_id' => $this->customerA->id,
            'campaign_title' => 'Delete Test Enquiry',
            'status' => EnquiryStatus::NEW->value,
        ]);

        Sanctum::actingAs($this->ownerA, ['*']);

        $response = $this->deleteJson("/api/v1/tenant/enquiries/{$enquiry->uuid}");
        $response->assertOk();

        $this->assertSoftDeleted('enquiries', ['id' => $enquiry->id]);

        // Normal list does not show it
        $listResponse = $this->getJson('/api/v1/tenant/enquiries');
        $listResponse->assertOk()
            ->assertJsonCount(0, 'data.items');
    }
}
