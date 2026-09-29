<?php

namespace Tests\Feature;

use App\Enums\DimensionUnit;
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

class AvailabilityAndScheduleTest extends TestCase
{
    use RefreshDatabase;

    protected Organization $orgA;
    protected Organization $orgB;

    protected User $ownerA;
    protected User $managerA;
    protected User $staffA;

    protected User $ownerB;

    protected Location $locA;
    protected AdvertisingResource $staticResourceA;
    protected AdvertisingResource $digitalResourceA;

    protected Location $locB;
    protected AdvertisingResource $staticResourceB;

    protected SubscriptionPlan $starterPlan;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();

        $this->starterPlan = SubscriptionPlan::where('slug', 'starter')->firstOrFail();

        // 1. Setup Organization A
        $this->orgA = Organization::create([
            'name' => 'Apex Outdoor Media',
            'slug' => 'apex-outdoor-media',
            'status' => 'ACTIVE',
        ]);

        Subscription::create([
            'organization_id' => $this->orgA->id,
            'subscription_plan_id' => $this->starterPlan->id,
            'status' => SubscriptionStatus::ACTIVE->value,
            'billing_cycle' => 'MONTHLY',
            'price' => 2499.00,
            'currency' => 'INR',
            'resource_limit' => 50,
            'starts_at' => now(),
            'ends_at' => now()->addMonth(),
        ]);

        $this->ownerA = User::factory()->create([
            'email' => 'owner@apex.com',
            'password' => Hash::make('Secret123!'),
            'platform_role' => null,
        ]);
        OrganizationUser::create([
            'organization_id' => $this->orgA->id,
            'user_id' => $this->ownerA->id,
            'role' => ProviderRole::PROVIDER_OWNER->value,
            'status' => MembershipStatus::ACTIVE->value,
            'is_default' => true,
        ]);

        $this->managerA = User::factory()->create([
            'email' => 'manager@apex.com',
            'password' => Hash::make('Secret123!'),
            'platform_role' => null,
        ]);
        OrganizationUser::create([
            'organization_id' => $this->orgA->id,
            'user_id' => $this->managerA->id,
            'role' => ProviderRole::PROVIDER_MANAGER->value,
            'status' => MembershipStatus::ACTIVE->value,
            'is_default' => true,
        ]);

        $this->staffA = User::factory()->create([
            'email' => 'staff@apex.com',
            'password' => Hash::make('Secret123!'),
            'platform_role' => null,
        ]);
        OrganizationUser::create([
            'organization_id' => $this->orgA->id,
            'user_id' => $this->staffA->id,
            'role' => ProviderRole::PROVIDER_STAFF->value,
            'status' => MembershipStatus::ACTIVE->value,
            'is_default' => true,
        ]);

        $this->locA = Location::create([
            'organization_id' => $this->orgA->id,
            'name' => 'NH-16 Mangalagiri Site',
            'code' => 'LOC-NH16',
            'city' => 'Vijayawada',
            'state' => 'Andhra Pradesh',
            'status' => LocationStatus::ACTIVE->value,
        ]);

        // Static resource
        $this->staticResourceA = AdvertisingResource::create([
            'organization_id' => $this->orgA->id,
            'location_id' => $this->locA->id,
            'name' => 'NH-16 South Face A',
            'code' => 'UNI-NH16-A',
            'resource_type' => ResourceType::UNIPOLE->value,
            'category' => ResourceCategory::STATIC->value,
            'face_number' => 1,
            'face_label' => 'Face A',
            'width' => 40.0,
            'height' => 20.0,
            'dimension_unit' => DimensionUnit::FEET->value,
            'illumination_type' => IlluminationType::FRONT_LIT->value,
            'base_price_monthly' => 85000.00,
            'status' => ResourceStatus::ACTIVE->value,
        ]);

        // Digital resource (12 slots)
        $this->digitalResourceA = AdvertisingResource::create([
            'organization_id' => $this->orgA->id,
            'location_id' => $this->locA->id,
            'name' => 'NH-16 LED Screen',
            'code' => 'LED-NH16-01',
            'resource_type' => ResourceType::LED_SCREEN->value,
            'category' => ResourceCategory::DIGITAL->value,
            'face_number' => 2,
            'face_label' => 'LED Screen',
            'width' => 30.0,
            'height' => 15.0,
            'dimension_unit' => DimensionUnit::FEET->value,
            'illumination_type' => IlluminationType::DIGITAL_LED->value,
            'slot_duration_seconds' => 10,
            'total_slots' => 12,
            'base_price_monthly' => 125000.00,
            'status' => ResourceStatus::ACTIVE->value,
        ]);

        // 2. Setup Organization B
        $this->orgB = Organization::create([
            'name' => 'Beacon Billboards Ltd',
            'slug' => 'beacon-billboards',
            'status' => 'ACTIVE',
        ]);

        Subscription::create([
            'organization_id' => $this->orgB->id,
            'subscription_plan_id' => $this->starterPlan->id,
            'status' => SubscriptionStatus::ACTIVE->value,
            'billing_cycle' => 'MONTHLY',
            'price' => 2499.00,
            'currency' => 'INR',
            'resource_limit' => 50,
            'starts_at' => now(),
            'ends_at' => now()->addMonth(),
        ]);

        $this->ownerB = User::factory()->create([
            'email' => 'owner@beacon.com',
            'password' => Hash::make('Secret123!'),
            'platform_role' => null,
        ]);
        OrganizationUser::create([
            'organization_id' => $this->orgB->id,
            'user_id' => $this->ownerB->id,
            'role' => ProviderRole::PROVIDER_OWNER->value,
            'status' => MembershipStatus::ACTIVE->value,
            'is_default' => true,
        ]);

        $this->locB = Location::create([
            'organization_id' => $this->orgB->id,
            'name' => 'Marine Drive Site',
            'code' => 'LOC-B-01',
            'city' => 'Mumbai',
            'state' => 'Maharashtra',
            'status' => LocationStatus::ACTIVE->value,
        ]);

        $this->staticResourceB = AdvertisingResource::create([
            'organization_id' => $this->orgB->id,
            'location_id' => $this->locB->id,
            'name' => 'Marine Drive Hoarding',
            'code' => 'HOARD-B-01',
            'resource_type' => ResourceType::HOARDING->value,
            'category' => ResourceCategory::STATIC->value,
            'width' => 30.0,
            'height' => 15.0,
            'status' => ResourceStatus::ACTIVE->value,
        ]);
    }

    /**
     * 1. Static resource is available when no schedules exist.
     */
    public function test_static_resource_available_when_no_schedules_exist(): void
    {
        Sanctum::actingAs($this->ownerA);

        $response = $this->postJson('/api/v1/tenant/availability/check', [
            'resource_uuid' => $this->staticResourceA->uuid,
            'start_date' => '2026-10-01',
            'end_date' => '2026-10-31',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'is_available' => true,
                    'resource_category' => 'STATIC',
                    'available_slots' => 1,
                    'conflicts' => [],
                ],
            ]);
    }

    /**
     * 2. Static resource conflict on exact overlapping dates.
     */
    public function test_static_resource_conflict_on_exact_overlapping_dates(): void
    {
        ResourceSchedule::create([
            'organization_id' => $this->orgA->id,
            'advertising_resource_id' => $this->staticResourceA->id,
            'title' => 'Client A Diwali Campaign',
            'block_type' => ScheduleBlockType::BOOKING->value,
            'status' => ScheduleStatus::CONFIRMED->value,
            'start_date' => '2026-10-01',
            'end_date' => '2026-10-31',
        ]);

        Sanctum::actingAs($this->ownerA);

        $response = $this->postJson('/api/v1/tenant/availability/check', [
            'resource_uuid' => $this->staticResourceA->uuid,
            'start_date' => '2026-10-01',
            'end_date' => '2026-10-31',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'is_available' => false,
                    'available_slots' => 0,
                ],
            ]);

        $this->assertCount(1, $response->json('data.conflicts'));
        $this->assertEquals('Client A Diwali Campaign', $response->json('data.conflicts.0.title'));
    }

    /**
     * 3. Static resource conflict on partial start overlap.
     */
    public function test_static_resource_conflict_on_partial_start_overlap(): void
    {
        // Existing booking: Oct 10 to Oct 20
        ResourceSchedule::create([
            'organization_id' => $this->orgA->id,
            'advertising_resource_id' => $this->staticResourceA->id,
            'title' => 'Mid Month Booking',
            'block_type' => ScheduleBlockType::BOOKING->value,
            'status' => ScheduleStatus::CONFIRMED->value,
            'start_date' => '2026-10-10',
            'end_date' => '2026-10-20',
        ]);

        Sanctum::actingAs($this->ownerA);

        // Requested: Oct 01 to Oct 15 (overlaps Oct 10-15)
        $response = $this->postJson('/api/v1/tenant/availability/check', [
            'resource_uuid' => $this->staticResourceA->uuid,
            'start_date' => '2026-10-01',
            'end_date' => '2026-10-15',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'is_available' => false,
                ],
            ]);
    }

    /**
     * 4. Static resource conflict on partial end overlap.
     */
    public function test_static_resource_conflict_on_partial_end_overlap(): void
    {
        // Existing booking: Oct 10 to Oct 20
        ResourceSchedule::create([
            'organization_id' => $this->orgA->id,
            'advertising_resource_id' => $this->staticResourceA->id,
            'title' => 'Mid Month Booking',
            'block_type' => ScheduleBlockType::BOOKING->value,
            'status' => ScheduleStatus::CONFIRMED->value,
            'start_date' => '2026-10-10',
            'end_date' => '2026-10-20',
        ]);

        Sanctum::actingAs($this->ownerA);

        // Requested: Oct 18 to Oct 31 (overlaps Oct 18-20)
        $response = $this->postJson('/api/v1/tenant/availability/check', [
            'resource_uuid' => $this->staticResourceA->uuid,
            'start_date' => '2026-10-18',
            'end_date' => '2026-10-31',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'is_available' => false,
                ],
            ]);
    }

    /**
     * 5. Static resource conflict on enclosing date overlap.
     */
    public function test_static_resource_conflict_on_enclosing_date_overlap(): void
    {
        // Existing booking: Oct 12 to Oct 15
        ResourceSchedule::create([
            'organization_id' => $this->orgA->id,
            'advertising_resource_id' => $this->staticResourceA->id,
            'title' => 'Short Event Booking',
            'block_type' => ScheduleBlockType::BOOKING->value,
            'status' => ScheduleStatus::CONFIRMED->value,
            'start_date' => '2026-10-12',
            'end_date' => '2026-10-15',
        ]);

        Sanctum::actingAs($this->ownerA);

        // Requested: Entire month Oct 01 to Oct 31
        $response = $this->postJson('/api/v1/tenant/availability/check', [
            'resource_uuid' => $this->staticResourceA->uuid,
            'start_date' => '2026-10-01',
            'end_date' => '2026-10-31',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'is_available' => false,
                ],
            ]);
    }

    /**
     * 6. Static resource available on adjacent date (ends 15th, starts 16th).
     */
    public function test_static_resource_available_on_adjacent_date(): void
    {
        // Existing booking: Oct 01 to Oct 15
        ResourceSchedule::create([
            'organization_id' => $this->orgA->id,
            'advertising_resource_id' => $this->staticResourceA->id,
            'title' => 'First Half Month',
            'block_type' => ScheduleBlockType::BOOKING->value,
            'status' => ScheduleStatus::CONFIRMED->value,
            'start_date' => '2026-10-01',
            'end_date' => '2026-10-15',
        ]);

        Sanctum::actingAs($this->ownerA);

        // Requested: Oct 16 to Oct 31 (No overlap!)
        $response = $this->postJson('/api/v1/tenant/availability/check', [
            'resource_uuid' => $this->staticResourceA->uuid,
            'start_date' => '2026-10-16',
            'end_date' => '2026-10-31',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'is_available' => true,
                    'available_slots' => 1,
                    'conflicts' => [],
                ],
            ]);
    }

    /**
     * 7. Digital resource available when slots under capacity (12 total, 7 booked, 4 requested).
     */
    public function test_digital_resource_available_when_slots_under_capacity(): void
    {
        // Client A books 3 slots, Client B books 4 slots (Total booked: 7 / 12)
        ResourceSchedule::create([
            'organization_id' => $this->orgA->id,
            'advertising_resource_id' => $this->digitalResourceA->id,
            'title' => 'Brand A 3-slot campaign',
            'block_type' => ScheduleBlockType::BOOKING->value,
            'status' => ScheduleStatus::CONFIRMED->value,
            'start_date' => '2026-10-01',
            'end_date' => '2026-10-15',
            'slots_count' => 3,
        ]);

        ResourceSchedule::create([
            'organization_id' => $this->orgA->id,
            'advertising_resource_id' => $this->digitalResourceA->id,
            'title' => 'Brand B 4-slot campaign',
            'block_type' => ScheduleBlockType::BOOKING->value,
            'status' => ScheduleStatus::CONFIRMED->value,
            'start_date' => '2026-10-01',
            'end_date' => '2026-10-15',
            'slots_count' => 4,
        ]);

        Sanctum::actingAs($this->ownerA);

        // Requesting 4 slots (7 + 4 = 11 <= 12) => Available!
        $response = $this->postJson('/api/v1/tenant/availability/check', [
            'resource_uuid' => $this->digitalResourceA->uuid,
            'start_date' => '2026-10-01',
            'end_date' => '2026-10-15',
            'slots_count' => 4,
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'is_available' => true,
                    'resource_category' => 'DIGITAL',
                    'total_slots' => 12,
                    'available_slots' => 5,
                    'requested_slots' => 4,
                ],
            ]);
    }

    /**
     * 8. Digital resource conflict when requested slots exceed remaining capacity (12 total, 7 booked, 6 requested).
     */
    public function test_digital_resource_conflict_when_requested_slots_exceed_remaining_capacity(): void
    {
        ResourceSchedule::create([
            'organization_id' => $this->orgA->id,
            'advertising_resource_id' => $this->digitalResourceA->id,
            'title' => 'Heavy Brand Booking',
            'block_type' => ScheduleBlockType::BOOKING->value,
            'status' => ScheduleStatus::CONFIRMED->value,
            'start_date' => '2026-10-01',
            'end_date' => '2026-10-15',
            'slots_count' => 7,
        ]);

        Sanctum::actingAs($this->ownerA);

        // Requesting 6 slots (7 + 6 = 13 > 12) => Conflict!
        $response = $this->postJson('/api/v1/tenant/availability/check', [
            'resource_uuid' => $this->digitalResourceA->uuid,
            'start_date' => '2026-10-01',
            'end_date' => '2026-10-15',
            'slots_count' => 6,
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'is_available' => false,
                    'total_slots' => 12,
                    'available_slots' => 5,
                    'requested_slots' => 6,
                ],
            ]);
    }

    /**
     * 9. Digital resource detects bottleneck day in multi-day range.
     */
    public function test_digital_resource_detects_bottleneck_day_in_multi_day_range(): void
    {
        // 5 slots booked Oct 01-10
        ResourceSchedule::create([
            'organization_id' => $this->orgA->id,
            'advertising_resource_id' => $this->digitalResourceA->id,
            'title' => 'Standard Booking',
            'block_type' => ScheduleBlockType::BOOKING->value,
            'status' => ScheduleStatus::CONFIRMED->value,
            'start_date' => '2026-10-01',
            'end_date' => '2026-10-10',
            'slots_count' => 5,
        ]);

        // Special 1-day event on Oct 05 books 6 additional slots (Oct 05 total booked = 11, available = 1)
        ResourceSchedule::create([
            'organization_id' => $this->orgA->id,
            'advertising_resource_id' => $this->digitalResourceA->id,
            'title' => 'One-Day Flash Sale',
            'block_type' => ScheduleBlockType::BOOKING->value,
            'status' => ScheduleStatus::CONFIRMED->value,
            'start_date' => '2026-10-05',
            'end_date' => '2026-10-05',
            'slots_count' => 6,
        ]);

        Sanctum::actingAs($this->ownerA);

        // If client requests 3 slots across Oct 01-10, Oct 05 fails (only 1 slot available)!
        $response = $this->postJson('/api/v1/tenant/availability/check', [
            'resource_uuid' => $this->digitalResourceA->uuid,
            'start_date' => '2026-10-01',
            'end_date' => '2026-10-10',
            'slots_count' => 3,
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'is_available' => false,
                    'available_slots' => 1, // Minimum available across window
                ],
            ]);

        $this->assertEquals('2026-10-05', $response->json('data.conflicts.0.date'));
    }

    /**
     * 10. Digital resource full screen takeover consumes all slots.
     */
    public function test_digital_resource_full_screen_takeover_consumes_all_slots(): void
    {
        // 12 slots total. Client takes 12 slots for a full-screen takeover
        ResourceSchedule::create([
            'organization_id' => $this->orgA->id,
            'advertising_resource_id' => $this->digitalResourceA->id,
            'title' => 'Full Screen Takeover',
            'block_type' => ScheduleBlockType::BOOKING->value,
            'status' => ScheduleStatus::CONFIRMED->value,
            'start_date' => '2026-10-01',
            'end_date' => '2026-10-05',
            'slots_count' => 12,
        ]);

        Sanctum::actingAs($this->ownerA);

        // Even 1 slot cannot be booked during takeover
        $response = $this->postJson('/api/v1/tenant/availability/check', [
            'resource_uuid' => $this->digitalResourceA->uuid,
            'start_date' => '2026-10-02',
            'end_date' => '2026-10-03',
            'slots_count' => 1,
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'data' => [
                    'is_available' => false,
                    'available_slots' => 0,
                ],
            ]);
    }

    /**
     * 11. Maintenance and civic blocks prevent static booking.
     */
    public function test_maintenance_and_civic_blocks_prevent_static_booking(): void
    {
        // Maintenance block
        ResourceSchedule::create([
            'organization_id' => $this->orgA->id,
            'advertising_resource_id' => $this->staticResourceA->id,
            'title' => 'Monsoon Structural Refurbishment',
            'block_type' => ScheduleBlockType::MAINTENANCE->value,
            'status' => ScheduleStatus::CONFIRMED->value,
            'start_date' => '2026-10-01',
            'end_date' => '2026-10-10',
        ]);

        Sanctum::actingAs($this->ownerA);

        $response = $this->postJson('/api/v1/tenant/availability/check', [
            'resource_uuid' => $this->staticResourceA->uuid,
            'start_date' => '2026-10-05',
            'end_date' => '2026-10-12',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'data' => [
                    'is_available' => false,
                    'conflicts' => [
                        [
                            'title' => 'Monsoon Structural Refurbishment',
                            'block_type' => 'MAINTENANCE',
                        ],
                    ],
                ],
            ]);
    }

    /**
     * 12. Unexpired tentative hold blocks availability.
     */
    public function test_unexpired_tentative_hold_blocks_availability(): void
    {
        ResourceSchedule::create([
            'organization_id' => $this->orgA->id,
            'advertising_resource_id' => $this->staticResourceA->id,
            'title' => 'Quotation Hold for BigBrand',
            'block_type' => ScheduleBlockType::TENTATIVE_HOLD->value,
            'status' => ScheduleStatus::TENTATIVE->value,
            'start_date' => '2026-10-01',
            'end_date' => '2026-10-15',
            'hold_expires_at' => now()->addHours(48), // Active unexpired hold
        ]);

        Sanctum::actingAs($this->ownerA);

        $response = $this->postJson('/api/v1/tenant/availability/check', [
            'resource_uuid' => $this->staticResourceA->uuid,
            'start_date' => '2026-10-05',
            'end_date' => '2026-10-10',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'data' => [
                    'is_available' => false,
                    'conflicts' => [
                        [
                            'block_type' => 'TENTATIVE_HOLD',
                            'status' => 'TENTATIVE',
                        ],
                    ],
                ],
            ]);
    }

    /**
     * 13. Expired tentative hold is ignored by availability engine (self-expiring without cron).
     */
    public function test_expired_tentative_hold_is_ignored_by_availability_engine(): void
    {
        ResourceSchedule::create([
            'organization_id' => $this->orgA->id,
            'advertising_resource_id' => $this->staticResourceA->id,
            'title' => 'Expired Quote Hold',
            'block_type' => ScheduleBlockType::TENTATIVE_HOLD->value,
            'status' => ScheduleStatus::TENTATIVE->value,
            'start_date' => '2026-10-01',
            'end_date' => '2026-10-15',
            'hold_expires_at' => now()->subHour(), // Expired 1 hour ago!
        ]);

        Sanctum::actingAs($this->ownerA);

        $response = $this->postJson('/api/v1/tenant/availability/check', [
            'resource_uuid' => $this->staticResourceA->uuid,
            'start_date' => '2026-10-01',
            'end_date' => '2026-10-15',
        ]);

        // Self-expiring! Must be available
        $response->assertStatus(200)
            ->assertJson([
                'data' => [
                    'is_available' => true,
                    'available_slots' => 1,
                    'conflicts' => [],
                ],
            ]);
    }

    /**
     * 14. Cancelled schedule is ignored by availability engine.
     */
    public function test_cancelled_schedule_is_ignored_by_availability_engine(): void
    {
        ResourceSchedule::create([
            'organization_id' => $this->orgA->id,
            'advertising_resource_id' => $this->staticResourceA->id,
            'title' => 'Cancelled Booking',
            'block_type' => ScheduleBlockType::BOOKING->value,
            'status' => ScheduleStatus::CANCELLED->value, // Released/Cancelled
            'start_date' => '2026-10-01',
            'end_date' => '2026-10-15',
        ]);

        Sanctum::actingAs($this->ownerA);

        $response = $this->postJson('/api/v1/tenant/availability/check', [
            'resource_uuid' => $this->staticResourceA->uuid,
            'start_date' => '2026-10-01',
            'end_date' => '2026-10-15',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'data' => [
                    'is_available' => true,
                    'available_slots' => 1,
                ],
            ]);
    }

    /**
     * 15. Default hold duration is applied when expiry is omitted (72 hours).
     */
    public function test_default_hold_duration_is_applied_when_expiry_omitted(): void
    {
        Sanctum::actingAs($this->ownerA);

        $before = now()->addHours(72)->subMinute();

        $response = $this->postJson('/api/v1/tenant/resource-schedules', [
            'advertising_resource_uuid' => $this->staticResourceA->uuid,
            'title' => 'Client Hold Without Expiry',
            'block_type' => ScheduleBlockType::TENTATIVE_HOLD->value,
            'start_date' => '2026-11-01',
            'end_date' => '2026-11-15',
        ]);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'data' => [
                    'block_type' => 'TENTATIVE_HOLD',
                    'status' => 'TENTATIVE',
                ],
            ]);

        $holdExpiresAt = Carbon::parse($response->json('data.hold_expires_at'));
        $this->assertTrue($holdExpiresAt->gte($before));
    }

    /**
     * 16. Explicit hold expiry override is honored.
     */
    public function test_explicit_hold_expiry_override_is_honored(): void
    {
        Sanctum::actingAs($this->ownerA);

        $customExpiry = now()->addDays(5)->startOfHour();

        $response = $this->postJson('/api/v1/tenant/resource-schedules', [
            'advertising_resource_uuid' => $this->staticResourceA->uuid,
            'title' => 'Custom 5-Day Hold',
            'block_type' => ScheduleBlockType::TENTATIVE_HOLD->value,
            'start_date' => '2026-11-01',
            'end_date' => '2026-11-15',
            'hold_expires_at' => $customExpiry->toIso8601String(),
        ]);

        $response->assertStatus(201);
        $this->assertEquals($customExpiry->toISOString(), $response->json('data.hold_expires_at'));
    }

    /**
     * 17. Hold expiry exceeding 30 days is rejected.
     */
    public function test_hold_expiry_exceeding_30_days_is_rejected(): void
    {
        Sanctum::actingAs($this->ownerA);

        $invalidExpiry = now()->addDays(35);

        $response = $this->postJson('/api/v1/tenant/resource-schedules', [
            'advertising_resource_uuid' => $this->staticResourceA->uuid,
            'title' => 'Excessive 35-Day Hold',
            'block_type' => ScheduleBlockType::TENTATIVE_HOLD->value,
            'start_date' => '2026-11-01',
            'end_date' => '2026-11-15',
            'hold_expires_at' => $invalidExpiry->toIso8601String(),
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['hold_expires_at']);
    }

    /**
     * 18. Owner and manager can release hold.
     */
    public function test_owner_and_manager_can_release_hold(): void
    {
        $hold = ResourceSchedule::create([
            'organization_id' => $this->orgA->id,
            'advertising_resource_id' => $this->staticResourceA->id,
            'title' => 'Hold To Release',
            'block_type' => ScheduleBlockType::TENTATIVE_HOLD->value,
            'status' => ScheduleStatus::TENTATIVE->value,
            'start_date' => '2026-11-01',
            'end_date' => '2026-11-15',
            'hold_expires_at' => now()->addHours(72),
        ]);

        Sanctum::actingAs($this->managerA);

        $response = $this->postJson("/api/v1/tenant/resource-schedules/{$hold->uuid}/release");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'status' => 'CANCELLED',
                ],
            ]);

        $this->assertEquals(ScheduleStatus::CANCELLED, $hold->fresh()->status);
    }

    /**
     * 19. Owner and manager can extend hold.
     */
    public function test_owner_and_manager_can_extend_hold(): void
    {
        $hold = ResourceSchedule::create([
            'organization_id' => $this->orgA->id,
            'advertising_resource_id' => $this->staticResourceA->id,
            'title' => 'Hold To Extend',
            'block_type' => ScheduleBlockType::TENTATIVE_HOLD->value,
            'status' => ScheduleStatus::TENTATIVE->value,
            'start_date' => '2026-11-01',
            'end_date' => '2026-11-15',
            'hold_expires_at' => now()->addHours(24),
        ]);

        Sanctum::actingAs($this->ownerA);

        $newExpiry = now()->addDays(7)->startOfHour();

        $response = $this->postJson("/api/v1/tenant/resource-schedules/{$hold->uuid}/extend", [
            'hold_expires_at' => $newExpiry->toIso8601String(),
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'hold_expires_at' => $newExpiry->toISOString(),
                ],
            ]);
    }

    /**
     * 20. Owner and manager can confirm hold into booking.
     */
    public function test_owner_and_manager_can_confirm_hold_into_booking(): void
    {
        $hold = ResourceSchedule::create([
            'organization_id' => $this->orgA->id,
            'advertising_resource_id' => $this->staticResourceA->id,
            'title' => 'Hold Converting To Booking',
            'block_type' => ScheduleBlockType::TENTATIVE_HOLD->value,
            'status' => ScheduleStatus::TENTATIVE->value,
            'start_date' => '2026-11-01',
            'end_date' => '2026-11-15',
            'hold_expires_at' => now()->addHours(48),
        ]);

        Sanctum::actingAs($this->managerA);

        $response = $this->postJson("/api/v1/tenant/resource-schedules/{$hold->uuid}/confirm");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'block_type' => 'BOOKING',
                    'status' => 'CONFIRMED',
                    'hold_expires_at' => null,
                ],
            ]);

        $this->assertEquals(ScheduleBlockType::BOOKING, $hold->fresh()->block_type);
        $this->assertEquals(ScheduleStatus::CONFIRMED, $hold->fresh()->status);
    }

    /**
     * 21. Confirm hold rechecks availability and prevents race conditions (Safeguard 2).
     */
    public function test_confirm_hold_rechecks_availability_and_prevents_race_conditions(): void
    {
        $hold = ResourceSchedule::create([
            'organization_id' => $this->orgA->id,
            'advertising_resource_id' => $this->staticResourceA->id,
            'title' => 'Tentative Hold',
            'block_type' => ScheduleBlockType::TENTATIVE_HOLD->value,
            'status' => ScheduleStatus::TENTATIVE->value,
            'start_date' => '2026-11-01',
            'end_date' => '2026-11-15',
            'hold_expires_at' => now()->addHours(48),
        ]);

        // Intervening conflicting maintenance schedule booked on same dates
        ResourceSchedule::create([
            'organization_id' => $this->orgA->id,
            'advertising_resource_id' => $this->staticResourceA->id,
            'title' => 'Urgent Structural Repair',
            'block_type' => ScheduleBlockType::MAINTENANCE->value,
            'status' => ScheduleStatus::CONFIRMED->value,
            'start_date' => '2026-11-05',
            'end_date' => '2026-11-10',
        ]);

        Sanctum::actingAs($this->ownerA);

        // Confirmation must be blocked by safeguard 2 fresh check!
        $response = $this->postJson("/api/v1/tenant/resource-schedules/{$hold->uuid}/confirm");

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['hold']);

        // Verify hold remains tentative
        $this->assertEquals(ScheduleStatus::TENTATIVE, $hold->fresh()->status);
    }

    /**
     * 22. Update schedule rechecks availability and prevents overlaps (Safeguard 3).
     */
    public function test_update_schedule_rechecks_availability_and_prevents_overlaps(): void
    {
        // Booking 1: Nov 01 to Nov 10
        ResourceSchedule::create([
            'organization_id' => $this->orgA->id,
            'advertising_resource_id' => $this->staticResourceA->id,
            'title' => 'Booking 1',
            'block_type' => ScheduleBlockType::BOOKING->value,
            'status' => ScheduleStatus::CONFIRMED->value,
            'start_date' => '2026-11-01',
            'end_date' => '2026-11-10',
        ]);

        // Booking 2: Nov 15 to Nov 25
        $sched2 = ResourceSchedule::create([
            'organization_id' => $this->orgA->id,
            'advertising_resource_id' => $this->staticResourceA->id,
            'title' => 'Booking 2',
            'block_type' => ScheduleBlockType::BOOKING->value,
            'status' => ScheduleStatus::CONFIRMED->value,
            'start_date' => '2026-11-15',
            'end_date' => '2026-11-25',
        ]);

        Sanctum::actingAs($this->ownerA);

        // Attempt to update Booking 2 to start on Nov 05 (overlaps Booking 1 Nov 01-10)
        $response = $this->putJson("/api/v1/tenant/resource-schedules/{$sched2->uuid}", [
            'start_date' => '2026-11-05',
            'end_date' => '2026-11-25',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['dates']);

        // Dates remain unchanged
        $this->assertEquals('2026-11-15', $sched2->fresh()->start_date->toDateString());
    }

    /**
     * 23. Staff cannot create or modify schedules.
     */
    public function test_staff_cannot_create_or_modify_schedules(): void
    {
        Sanctum::actingAs($this->staffA);

        // Create attempt by staff -> 403
        $responseCreate = $this->postJson('/api/v1/tenant/resource-schedules', [
            'advertising_resource_uuid' => $this->staticResourceA->uuid,
            'title' => 'Staff Schedule Attempt',
            'block_type' => ScheduleBlockType::BOOKING->value,
            'start_date' => '2026-12-01',
            'end_date' => '2026-12-15',
        ]);
        $responseCreate->assertStatus(403);

        $sched = ResourceSchedule::create([
            'organization_id' => $this->orgA->id,
            'advertising_resource_id' => $this->staticResourceA->id,
            'title' => 'Owner Created',
            'block_type' => ScheduleBlockType::BOOKING->value,
            'status' => ScheduleStatus::CONFIRMED->value,
            'start_date' => '2026-12-01',
            'end_date' => '2026-12-15',
        ]);

        // Update attempt by staff -> 403
        $responseUpdate = $this->putJson("/api/v1/tenant/resource-schedules/{$sched->uuid}", [
            'title' => 'Staff Modification',
        ]);
        $responseUpdate->assertStatus(403);

        // Release attempt by staff -> 403
        $responseRelease = $this->postJson("/api/v1/tenant/resource-schedules/{$sched->uuid}/release");
        $responseRelease->assertStatus(403);
    }

    /**
     * 24. Staff can check availability and view calendar (view-only).
     */
    public function test_staff_can_check_availability_and_view_calendar(): void
    {
        Sanctum::actingAs($this->staffA);

        // Check availability
        $resCheck = $this->postJson('/api/v1/tenant/availability/check', [
            'resource_uuid' => $this->staticResourceA->uuid,
            'start_date' => '2026-10-01',
            'end_date' => '2026-10-15',
        ]);
        $resCheck->assertStatus(200);

        // View monthly calendar
        $resCal = $this->getJson("/api/v1/tenant/advertising-resources/{$this->staticResourceA->uuid}/calendar?year=2026&month=10");
        $resCal->assertStatus(200);

        // View schedule listing
        $resList = $this->getJson('/api/v1/tenant/resource-schedules');
        $resList->assertStatus(200);
    }

    /**
     * 25. Monthly calendar grid generation for static resource.
     */
    public function test_monthly_calendar_grid_generation_for_static_resource(): void
    {
        ResourceSchedule::create([
            'organization_id' => $this->orgA->id,
            'advertising_resource_id' => $this->staticResourceA->id,
            'title' => 'October Fest Booking',
            'block_type' => ScheduleBlockType::BOOKING->value,
            'status' => ScheduleStatus::CONFIRMED->value,
            'start_date' => '2026-10-10',
            'end_date' => '2026-10-20',
        ]);

        Sanctum::actingAs($this->ownerA);

        $response = $this->getJson("/api/v1/tenant/advertising-resources/{$this->staticResourceA->uuid}/calendar?year=2026&month=10");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'year' => 2026,
                    'month' => 10,
                ],
            ]);

        $days = $response->json('data.days');
        $this->assertCount(31, $days); // October has 31 days

        // Day 5 (Oct 05) should be AVAILABLE
        $day5 = collect($days)->firstWhere('day', 5);
        $this->assertEquals('AVAILABLE', $day5['status']);
        $this->assertEquals(1, $day5['available_slots']);

        // Day 15 (Oct 15) should be BOOKED
        $day15 = collect($days)->firstWhere('day', 15);
        $this->assertEquals('BOOKING', $day15['status']);
        $this->assertEquals(0, $day15['available_slots']);
    }

    /**
     * 26. Monthly calendar grid generation for digital resource.
     */
    public function test_monthly_calendar_grid_generation_for_digital_resource(): void
    {
        // 4 slots booked Oct 10 to Oct 20
        ResourceSchedule::create([
            'organization_id' => $this->orgA->id,
            'advertising_resource_id' => $this->digitalResourceA->id,
            'title' => '4-Slot Digital Ad',
            'block_type' => ScheduleBlockType::BOOKING->value,
            'status' => ScheduleStatus::CONFIRMED->value,
            'start_date' => '2026-10-10',
            'end_date' => '2026-10-20',
            'slots_count' => 4,
        ]);

        Sanctum::actingAs($this->ownerA);

        $response = $this->getJson("/api/v1/tenant/advertising-resources/{$this->digitalResourceA->uuid}/calendar?year=2026&month=10");

        $response->assertStatus(200);
        $days = $response->json('data.days');

        // Day 15 should be PARTIALLY_AVAILABLE with 8 slots remaining
        $day15 = collect($days)->firstWhere('day', 15);
        $this->assertEquals('PARTIALLY_AVAILABLE', $day15['status']);
        $this->assertEquals(12, $day15['total_slots']);
        $this->assertEquals(4, $day15['booked_slots']);
        $this->assertEquals(8, $day15['available_slots']);
    }

    /**
     * 27. Tenant A cannot access or schedule Tenant B resource.
     */
    public function test_tenant_a_cannot_access_or_schedule_tenant_b_resource(): void
    {
        Sanctum::actingAs($this->ownerA);

        // Attempt to check availability on Org B resource
        $resCheck = $this->postJson('/api/v1/tenant/availability/check', [
            'resource_uuid' => $this->staticResourceB->uuid,
            'start_date' => '2026-10-01',
            'end_date' => '2026-10-15',
        ]);
        $resCheck->assertStatus(422); // Not in Org A tenant

        // Attempt to create schedule on Org B resource
        $resCreate = $this->postJson('/api/v1/tenant/resource-schedules', [
            'advertising_resource_uuid' => $this->staticResourceB->uuid,
            'title' => 'Cross-Tenant Schedule Attempt',
            'block_type' => ScheduleBlockType::BOOKING->value,
            'start_date' => '2026-10-01',
            'end_date' => '2026-10-15',
        ]);
        $resCreate->assertStatus(422);
    }

    /**
     * 28. Soft delete works for resource schedules.
     */
    public function test_soft_delete_works_for_resource_schedules(): void
    {
        $sched = ResourceSchedule::create([
            'organization_id' => $this->orgA->id,
            'advertising_resource_id' => $this->staticResourceA->id,
            'title' => 'Schedule To Soft Delete',
            'block_type' => ScheduleBlockType::BOOKING->value,
            'status' => ScheduleStatus::CONFIRMED->value,
            'start_date' => '2026-11-01',
            'end_date' => '2026-11-15',
        ]);

        Sanctum::actingAs($this->ownerA);

        $response = $this->deleteJson("/api/v1/tenant/resource-schedules/{$sched->uuid}");
        $response->assertStatus(200);

        $this->assertNotNull($sched->fresh()->deleted_at);

        // Listing schedules returns 0
        $listRes = $this->getJson('/api/v1/tenant/resource-schedules');
        $this->assertEquals(0, $listRes->json('data.pagination.total'));
    }
}
