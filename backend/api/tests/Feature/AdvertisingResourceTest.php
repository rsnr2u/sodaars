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
use App\Enums\SubscriptionStatus;
use App\Models\AdvertisingResource;
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

class AdvertisingResourceTest extends TestCase
{
    use RefreshDatabase;

    protected Organization $orgA;
    protected Organization $orgB;

    protected User $ownerA;
    protected User $managerA;
    protected User $staffA;

    protected User $ownerB;

    protected Location $locA;
    protected Location $locB;

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
            'name' => 'NH-16 Mangalagiri Junction',
            'code' => 'LOC-NH16-001',
            'city' => 'Vijayawada',
            'state' => 'Andhra Pradesh',
            'status' => LocationStatus::ACTIVE->value,
            'created_by_user_id' => $this->ownerA->id,
        ]);

        // 2. Setup Organization B
        $this->orgB = Organization::create([
            'name' => 'Beacon Displays Ltd',
            'slug' => 'beacon-displays',
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
            'name' => 'Marine Drive Promenade',
            'code' => 'LOC-B-001',
            'city' => 'Mumbai',
            'state' => 'Maharashtra',
            'status' => LocationStatus::ACTIVE->value,
            'created_by_user_id' => $this->ownerB->id,
        ]);
    }

    /**
     * 1. Owner can create advertising resource.
     */
    public function test_owner_can_create_advertising_resource(): void
    {
        Sanctum::actingAs($this->ownerA);

        $payload = [
            'location_uuid' => $this->locA->uuid,
            'name' => 'Mangalagiri South Face A',
            'code' => 'LOC-001-A',
            'resource_type' => ResourceType::UNIPOLE->value,
            'category' => ResourceCategory::STATIC->value,
            'face_number' => 1,
            'face_label' => 'Face A',
            'direction' => 'Towards Vijayawada',
            'traffic_flow' => 'High speed arterial highway traffic',
            'width' => 40.0,
            'height' => 20.0,
            'dimension_unit' => DimensionUnit::FEET->value,
            'illumination_type' => IlluminationType::FRONT_LIT->value,
            'base_price_monthly' => 85000.00,
            'currency' => 'INR',
            'status' => ResourceStatus::ACTIVE->value,
            'description' => 'Prominent high-visibility unipole on NH-16.',
        ];

        $response = $this->postJson('/api/v1/tenant/advertising-resources', $payload);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'data' => [
                    'name' => 'Mangalagiri South Face A',
                    'code' => 'LOC-001-A',
                    'face_number' => 1,
                    'face_label' => 'Face A',
                    'width' => 40.0,
                    'height' => 20.0,
                    'area' => 800.0,
                    'base_price_monthly' => 85000.00,
                    'status' => ResourceStatus::ACTIVE->value,
                    'organization_id' => $this->orgA->id,
                    'location' => [
                        'uuid' => $this->locA->uuid,
                        'name' => 'NH-16 Mangalagiri Junction',
                    ],
                ],
            ]);

        $this->assertDatabaseHas('advertising_resources', [
            'organization_id' => $this->orgA->id,
            'code' => 'LOC-001-A',
            'face_label' => 'Face A',
            'status' => ResourceStatus::ACTIVE->value,
        ]);
    }

    /**
     * 2. Manager can create advertising resource.
     */
    public function test_manager_can_create_advertising_resource(): void
    {
        Sanctum::actingAs($this->managerA);

        $payload = [
            'location_uuid' => $this->locA->uuid,
            'name' => 'Mangalagiri North Face B',
            'code' => 'LOC-001-B',
            'resource_type' => ResourceType::LED_SCREEN->value,
            'category' => ResourceCategory::DIGITAL->value,
            'face_number' => 2,
            'face_label' => 'Face B',
            'direction' => 'Towards Guntur',
            'width' => 30.0,
            'height' => 15.0,
            'dimension_unit' => DimensionUnit::FEET->value,
            'illumination_type' => IlluminationType::DIGITAL_LED->value,
            'resolution' => '1920x1080',
            'pixel_pitch' => 'P6',
            'slot_duration_seconds' => 10,
            'daily_impressions_estimate' => 120000,
            'base_price_monthly' => 125000.00,
            'status' => ResourceStatus::ACTIVE->value,
        ];

        $response = $this->postJson('/api/v1/tenant/advertising-resources', $payload);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'data' => [
                    'name' => 'Mangalagiri North Face B',
                    'code' => 'LOC-001-B',
                    'category' => ResourceCategory::DIGITAL->value,
                    'resource_type' => ResourceType::LED_SCREEN->value,
                    'resolution' => '1920x1080',
                    'slot_duration_seconds' => 10,
                    'area' => 450.0,
                ],
            ]);
    }

    /**
     * 3. Staff cannot create advertising resource.
     */
    public function test_staff_cannot_create_advertising_resource(): void
    {
        Sanctum::actingAs($this->staffA);

        $payload = [
            'location_uuid' => $this->locA->uuid,
            'name' => 'Unauthorized Hoarding',
            'code' => 'LOC-UNAUTH-01',
            'resource_type' => ResourceType::HOARDING->value,
            'category' => ResourceCategory::STATIC->value,
            'width' => 20.0,
            'height' => 10.0,
            'illumination_type' => IlluminationType::NON_LIT->value,
        ];

        $response = $this->postJson('/api/v1/tenant/advertising-resources', $payload);

        $response->assertStatus(403);
    }

    /**
     * 4. Owner can view advertising resource.
     */
    public function test_owner_can_view_advertising_resource(): void
    {
        $resource = AdvertisingResource::create([
            'organization_id' => $this->orgA->id,
            'location_id' => $this->locA->id,
            'name' => 'City Center Billboard',
            'code' => 'BIL-001',
            'resource_type' => ResourceType::BILLBOARD->value,
            'category' => ResourceCategory::STATIC->value,
            'face_number' => 1,
            'width' => 40.0,
            'height' => 20.0,
            'illumination_type' => IlluminationType::FRONT_LIT->value,
            'status' => ResourceStatus::ACTIVE->value,
        ]);

        Sanctum::actingAs($this->ownerA);

        $response = $this->getJson("/api/v1/tenant/advertising-resources/{$resource->uuid}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'uuid' => $resource->uuid,
                    'code' => 'BIL-001',
                    'area' => 800.0,
                    'location' => [
                        'uuid' => $this->locA->uuid,
                    ],
                ],
            ]);
    }

    /**
     * 5. Manager can update advertising resource.
     */
    public function test_manager_can_update_advertising_resource(): void
    {
        $resource = AdvertisingResource::create([
            'organization_id' => $this->orgA->id,
            'location_id' => $this->locA->id,
            'name' => 'Original Name',
            'code' => 'LOC-UPD-001',
            'resource_type' => ResourceType::UNIPOLE->value,
            'category' => ResourceCategory::STATIC->value,
            'face_number' => 1,
            'width' => 30.0,
            'height' => 15.0,
            'illumination_type' => IlluminationType::FRONT_LIT->value,
            'base_price_monthly' => 50000.00,
            'status' => ResourceStatus::ACTIVE->value,
        ]);

        Sanctum::actingAs($this->managerA);

        $response = $this->putJson("/api/v1/tenant/advertising-resources/{$resource->uuid}", [
            'name' => 'Updated Unipole Face',
            'base_price_monthly' => 65000.00,
            'direction' => 'Updated Direction',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'name' => 'Updated Unipole Face',
                    'base_price_monthly' => 65000.00,
                    'direction' => 'Updated Direction',
                ],
            ]);

        $this->assertEquals('Updated Unipole Face', $resource->fresh()->name);
        $this->assertEquals(65000.00, $resource->fresh()->base_price_monthly);
    }

    /**
     * 6. Staff can view advertising resource.
     */
    public function test_staff_can_view_advertising_resource(): void
    {
        $resource = AdvertisingResource::create([
            'organization_id' => $this->orgA->id,
            'location_id' => $this->locA->id,
            'name' => 'Gantry Face 1',
            'code' => 'GAN-001',
            'resource_type' => ResourceType::GANTRY->value,
            'category' => ResourceCategory::STATIC->value,
            'width' => 50.0,
            'height' => 10.0,
            'illumination_type' => IlluminationType::BACK_LIT->value,
            'status' => ResourceStatus::ACTIVE->value,
        ]);

        Sanctum::actingAs($this->staffA);

        $response = $this->getJson("/api/v1/tenant/advertising-resources/{$resource->uuid}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'uuid' => $resource->uuid,
                    'code' => 'GAN-001',
                ],
            ]);
    }

    /**
     * 7. Staff cannot update advertising resource.
     */
    public function test_staff_cannot_update_advertising_resource(): void
    {
        $resource = AdvertisingResource::create([
            'organization_id' => $this->orgA->id,
            'location_id' => $this->locA->id,
            'name' => 'Original Resource',
            'code' => 'RES-STAFF-01',
            'resource_type' => ResourceType::HOARDING->value,
            'category' => ResourceCategory::STATIC->value,
            'width' => 20.0,
            'height' => 10.0,
            'illumination_type' => IlluminationType::NON_LIT->value,
            'status' => ResourceStatus::ACTIVE->value,
        ]);

        Sanctum::actingAs($this->staffA);

        $response = $this->putJson("/api/v1/tenant/advertising-resources/{$resource->uuid}", [
            'name' => 'Tampered By Staff',
        ]);

        $response->assertStatus(403);
    }

    /**
     * 8. Authorized user can list advertising resources.
     */
    public function test_authorized_user_can_list_advertising_resources(): void
    {
        AdvertisingResource::create([
            'organization_id' => $this->orgA->id,
            'location_id' => $this->locA->id,
            'name' => 'Face 1',
            'code' => 'RES-001',
            'resource_type' => ResourceType::UNIPOLE->value,
            'category' => ResourceCategory::STATIC->value,
            'width' => 20.0,
            'height' => 10.0,
            'illumination_type' => IlluminationType::FRONT_LIT->value,
        ]);

        AdvertisingResource::create([
            'organization_id' => $this->orgA->id,
            'location_id' => $this->locA->id,
            'name' => 'Face 2',
            'code' => 'RES-002',
            'resource_type' => ResourceType::UNIPOLE->value,
            'category' => ResourceCategory::STATIC->value,
            'width' => 20.0,
            'height' => 10.0,
            'illumination_type' => IlluminationType::FRONT_LIT->value,
        ]);

        Sanctum::actingAs($this->ownerA);

        $response = $this->getJson('/api/v1/tenant/advertising-resources');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'pagination' => [
                        'total' => 2,
                    ],
                ],
            ]);
    }

    /**
     * 9. Search works across name, code, and location.
     */
    public function test_search_works_across_name_code_location(): void
    {
        AdvertisingResource::create([
            'organization_id' => $this->orgA->id,
            'location_id' => $this->locA->id,
            'name' => 'Expressway Spectacular',
            'code' => 'SPEC-999',
            'resource_type' => ResourceType::HOARDING->value,
            'category' => ResourceCategory::STATIC->value,
            'width' => 60.0,
            'height' => 20.0,
            'illumination_type' => IlluminationType::FRONT_LIT->value,
        ]);

        AdvertisingResource::create([
            'organization_id' => $this->orgA->id,
            'location_id' => $this->locA->id,
            'name' => 'Downtown Kiosk',
            'code' => 'KIOSK-101',
            'resource_type' => ResourceType::BUS_SHELTER->value,
            'category' => ResourceCategory::STATIC->value,
            'width' => 6.0,
            'height' => 4.0,
            'illumination_type' => IlluminationType::BACK_LIT->value,
        ]);

        Sanctum::actingAs($this->ownerA);

        // Search by name snippet
        $resName = $this->getJson('/api/v1/tenant/advertising-resources?search=Expressway');
        $resName->assertStatus(200);
        $this->assertEquals(1, $resName->json('data.pagination.total'));
        $this->assertEquals('SPEC-999', $resName->json('data.items.0.code'));

        // Search by code snippet
        $resCode = $this->getJson('/api/v1/tenant/advertising-resources?search=KIOSK');
        $resCode->assertStatus(200);
        $this->assertEquals(1, $resCode->json('data.pagination.total'));
        $this->assertEquals('KIOSK-101', $resCode->json('data.items.0.code'));

        // Search by location city snippet
        $resLoc = $this->getJson('/api/v1/tenant/advertising-resources?search=Vijayawada');
        $resLoc->assertStatus(200);
        $this->assertEquals(2, $resLoc->json('data.pagination.total'));
    }

    /**
     * 10. Filtering by location works.
     */
    public function test_filtering_by_location_works(): void
    {
        $secondLoc = Location::create([
            'organization_id' => $this->orgA->id,
            'name' => 'Benz Circle Flyover',
            'code' => 'LOC-BENZ-01',
            'city' => 'Vijayawada',
            'state' => 'Andhra Pradesh',
        ]);

        AdvertisingResource::create([
            'organization_id' => $this->orgA->id,
            'location_id' => $this->locA->id,
            'name' => 'Loc A Resource',
            'code' => 'RES-A1',
            'resource_type' => ResourceType::UNIPOLE->value,
            'category' => ResourceCategory::STATIC->value,
            'width' => 30.0,
            'height' => 15.0,
            'illumination_type' => IlluminationType::FRONT_LIT->value,
        ]);

        AdvertisingResource::create([
            'organization_id' => $this->orgA->id,
            'location_id' => $secondLoc->id,
            'name' => 'Loc B Resource',
            'code' => 'RES-B1',
            'resource_type' => ResourceType::UNIPOLE->value,
            'category' => ResourceCategory::STATIC->value,
            'width' => 30.0,
            'height' => 15.0,
            'illumination_type' => IlluminationType::FRONT_LIT->value,
        ]);

        Sanctum::actingAs($this->ownerA);

        $response = $this->getJson("/api/v1/tenant/advertising-resources?location_uuid={$secondLoc->uuid}");
        $response->assertStatus(200);
        $this->assertEquals(1, $response->json('data.pagination.total'));
        $this->assertEquals('RES-B1', $response->json('data.items.0.code'));
    }

    /**
     * 11. Filtering by resource type works.
     */
    public function test_filtering_by_resource_type_works(): void
    {
        AdvertisingResource::create([
            'organization_id' => $this->orgA->id,
            'location_id' => $this->locA->id,
            'name' => 'Unipole Unit',
            'code' => 'TYPE-UNI-01',
            'resource_type' => ResourceType::UNIPOLE->value,
            'category' => ResourceCategory::STATIC->value,
            'width' => 40.0,
            'height' => 20.0,
            'illumination_type' => IlluminationType::FRONT_LIT->value,
        ]);

        AdvertisingResource::create([
            'organization_id' => $this->orgA->id,
            'location_id' => $this->locA->id,
            'name' => 'Gantry Unit',
            'code' => 'TYPE-GAN-01',
            'resource_type' => ResourceType::GANTRY->value,
            'category' => ResourceCategory::STATIC->value,
            'width' => 50.0,
            'height' => 10.0,
            'illumination_type' => IlluminationType::FRONT_LIT->value,
        ]);

        Sanctum::actingAs($this->ownerA);

        $response = $this->getJson('/api/v1/tenant/advertising-resources?resource_type=UNIPOLE');
        $response->assertStatus(200);
        $this->assertEquals(1, $response->json('data.pagination.total'));
        $this->assertEquals('TYPE-UNI-01', $response->json('data.items.0.code'));
    }

    /**
     * 12. Filtering by category works (STATIC vs DIGITAL).
     */
    public function test_filtering_by_category_works(): void
    {
        AdvertisingResource::create([
            'organization_id' => $this->orgA->id,
            'location_id' => $this->locA->id,
            'name' => 'Static Hoarding',
            'code' => 'CAT-STAT-01',
            'resource_type' => ResourceType::HOARDING->value,
            'category' => ResourceCategory::STATIC->value,
            'width' => 40.0,
            'height' => 20.0,
            'illumination_type' => IlluminationType::FRONT_LIT->value,
        ]);

        AdvertisingResource::create([
            'organization_id' => $this->orgA->id,
            'location_id' => $this->locA->id,
            'name' => 'Digital LED Board',
            'code' => 'CAT-DIGI-01',
            'resource_type' => ResourceType::LED_SCREEN->value,
            'category' => ResourceCategory::DIGITAL->value,
            'width' => 20.0,
            'height' => 10.0,
            'illumination_type' => IlluminationType::DIGITAL_LED->value,
        ]);

        Sanctum::actingAs($this->ownerA);

        $response = $this->getJson('/api/v1/tenant/advertising-resources?category=DIGITAL');
        $response->assertStatus(200);
        $this->assertEquals(1, $response->json('data.pagination.total'));
        $this->assertEquals('CAT-DIGI-01', $response->json('data.items.0.code'));
    }

    /**
     * 13. Filtering by status works.
     */
    public function test_filtering_by_status_works(): void
    {
        AdvertisingResource::create([
            'organization_id' => $this->orgA->id,
            'location_id' => $this->locA->id,
            'name' => 'Active Unit',
            'code' => 'STAT-ACT-01',
            'resource_type' => ResourceType::UNIPOLE->value,
            'category' => ResourceCategory::STATIC->value,
            'width' => 30.0,
            'height' => 15.0,
            'illumination_type' => IlluminationType::FRONT_LIT->value,
            'status' => ResourceStatus::ACTIVE->value,
        ]);

        AdvertisingResource::create([
            'organization_id' => $this->orgA->id,
            'location_id' => $this->locA->id,
            'name' => 'Maintenance Unit',
            'code' => 'STAT-MAINT-01',
            'resource_type' => ResourceType::UNIPOLE->value,
            'category' => ResourceCategory::STATIC->value,
            'width' => 30.0,
            'height' => 15.0,
            'illumination_type' => IlluminationType::FRONT_LIT->value,
            'status' => ResourceStatus::UNDER_MAINTENANCE->value,
        ]);

        Sanctum::actingAs($this->ownerA);

        $response = $this->getJson('/api/v1/tenant/advertising-resources?status=UNDER_MAINTENANCE');
        $response->assertStatus(200);
        $this->assertEquals(1, $response->json('data.pagination.total'));
        $this->assertEquals('STAT-MAINT-01', $response->json('data.items.0.code'));
    }

    /**
     * 14. Filtering by illumination type works.
     */
    public function test_filtering_by_illumination_type_works(): void
    {
        AdvertisingResource::create([
            'organization_id' => $this->orgA->id,
            'location_id' => $this->locA->id,
            'name' => 'Backlit Billboard',
            'code' => 'ILLUM-BACK-01',
            'resource_type' => ResourceType::BILLBOARD->value,
            'category' => ResourceCategory::STATIC->value,
            'width' => 30.0,
            'height' => 15.0,
            'illumination_type' => IlluminationType::BACK_LIT->value,
        ]);

        AdvertisingResource::create([
            'organization_id' => $this->orgA->id,
            'location_id' => $this->locA->id,
            'name' => 'Frontlit Billboard',
            'code' => 'ILLUM-FRONT-01',
            'resource_type' => ResourceType::BILLBOARD->value,
            'category' => ResourceCategory::STATIC->value,
            'width' => 30.0,
            'height' => 15.0,
            'illumination_type' => IlluminationType::FRONT_LIT->value,
        ]);

        Sanctum::actingAs($this->ownerA);

        $response = $this->getJson('/api/v1/tenant/advertising-resources?illumination_type=BACK_LIT');
        $response->assertStatus(200);
        $this->assertEquals(1, $response->json('data.pagination.total'));
        $this->assertEquals('ILLUM-BACK-01', $response->json('data.items.0.code'));
    }

    /**
     * 15. Pagination and sorting work.
     */
    public function test_pagination_and_sorting_work(): void
    {
        for ($i = 1; $i <= 5; $i++) {
            AdvertisingResource::create([
                'organization_id' => $this->orgA->id,
                'location_id' => $this->locA->id,
                'name' => "Face #{$i}",
                'code' => "PAGE-{$i}",
                'resource_type' => ResourceType::UNIPOLE->value,
                'category' => ResourceCategory::STATIC->value,
                'face_number' => $i,
                'width' => 20.0,
                'height' => 10.0,
                'base_price_monthly' => $i * 10000.00,
                'illumination_type' => IlluminationType::FRONT_LIT->value,
            ]);
        }

        Sanctum::actingAs($this->ownerA);

        $response = $this->getJson('/api/v1/tenant/advertising-resources?per_page=2&sort_by=face_number&sort_order=asc');
        $response->assertStatus(200)
            ->assertJson([
                'data' => [
                    'pagination' => [
                        'total' => 5,
                        'per_page' => 2,
                        'current_page' => 1,
                        'last_page' => 3,
                    ],
                ],
            ]);

        $this->assertEquals('PAGE-1', $response->json('data.items.0.code'));
        $this->assertEquals('PAGE-2', $response->json('data.items.1.code'));
    }

    /**
     * 16. Resource code is unique within an organization.
     */
    public function test_resource_code_is_unique_within_organization(): void
    {
        AdvertisingResource::create([
            'organization_id' => $this->orgA->id,
            'location_id' => $this->locA->id,
            'name' => 'Original Face',
            'code' => 'DUP-CODE-001',
            'resource_type' => ResourceType::UNIPOLE->value,
            'category' => ResourceCategory::STATIC->value,
            'width' => 30.0,
            'height' => 15.0,
            'illumination_type' => IlluminationType::FRONT_LIT->value,
        ]);

        Sanctum::actingAs($this->ownerA);

        $response = $this->postJson('/api/v1/tenant/advertising-resources', [
            'location_uuid' => $this->locA->uuid,
            'name' => 'Duplicate Code Attempt',
            'code' => 'DUP-CODE-001',
            'resource_type' => ResourceType::UNIPOLE->value,
            'category' => ResourceCategory::STATIC->value,
            'width' => 30.0,
            'height' => 15.0,
            'illumination_type' => IlluminationType::FRONT_LIT->value,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['code']);
    }

    /**
     * 17. Same resource code can exist in another organization.
     */
    public function test_same_resource_code_can_exist_in_another_organization(): void
    {
        AdvertisingResource::create([
            'organization_id' => $this->orgA->id,
            'location_id' => $this->locA->id,
            'name' => 'Org A Resource',
            'code' => 'SHARED-CODE-01',
            'resource_type' => ResourceType::HOARDING->value,
            'category' => ResourceCategory::STATIC->value,
            'width' => 20.0,
            'height' => 10.0,
            'illumination_type' => IlluminationType::NON_LIT->value,
        ]);

        Sanctum::actingAs($this->ownerB);

        $response = $this->postJson('/api/v1/tenant/advertising-resources', [
            'location_uuid' => $this->locB->uuid,
            'name' => 'Org B Resource With Same Code',
            'code' => 'SHARED-CODE-01',
            'resource_type' => ResourceType::HOARDING->value,
            'category' => ResourceCategory::STATIC->value,
            'width' => 20.0,
            'height' => 10.0,
            'illumination_type' => IlluminationType::NON_LIT->value,
        ]);

        $response->assertStatus(201);
        $this->assertEquals(1, AdvertisingResource::withoutGlobalScopes()->where('organization_id', $this->orgA->id)->where('code', 'SHARED-CODE-01')->count());
        $this->assertEquals(1, AdvertisingResource::withoutGlobalScopes()->where('organization_id', $this->orgB->id)->where('code', 'SHARED-CODE-01')->count());
    }

    /**
     * 18. Tenant A cannot access Tenant B resource.
     */
    public function test_tenant_a_cannot_access_tenant_b_resource(): void
    {
        $resB = AdvertisingResource::create([
            'organization_id' => $this->orgB->id,
            'location_id' => $this->locB->id,
            'name' => 'Secret Org B Resource',
            'code' => 'SEC-B-01',
            'resource_type' => ResourceType::UNIPOLE->value,
            'category' => ResourceCategory::STATIC->value,
            'width' => 30.0,
            'height' => 15.0,
            'illumination_type' => IlluminationType::FRONT_LIT->value,
        ]);

        Sanctum::actingAs($this->ownerA);

        $response = $this->getJson("/api/v1/tenant/advertising-resources/{$resB->uuid}");

        $response->assertStatus(404);
    }

    /**
     * 19. Tenant A cannot update Tenant B resource.
     */
    public function test_tenant_a_cannot_update_tenant_b_resource(): void
    {
        $resB = AdvertisingResource::create([
            'organization_id' => $this->orgB->id,
            'location_id' => $this->locB->id,
            'name' => 'Org B Resource',
            'code' => 'RES-B-02',
            'resource_type' => ResourceType::UNIPOLE->value,
            'category' => ResourceCategory::STATIC->value,
            'width' => 30.0,
            'height' => 15.0,
            'illumination_type' => IlluminationType::FRONT_LIT->value,
        ]);

        Sanctum::actingAs($this->ownerA);

        $response = $this->putJson("/api/v1/tenant/advertising-resources/{$resB->uuid}", [
            'name' => 'Malicious Update By Org A',
        ]);

        $response->assertStatus(404);
        $this->assertEquals('Org B Resource', $resB->fresh()->name);
    }

    /**
     * 20. Tenant A cannot delete Tenant B resource.
     */
    public function test_tenant_a_cannot_delete_tenant_b_resource(): void
    {
        $resB = AdvertisingResource::create([
            'organization_id' => $this->orgB->id,
            'location_id' => $this->locB->id,
            'name' => 'Org B Resource Preserved',
            'code' => 'RES-B-03',
            'resource_type' => ResourceType::UNIPOLE->value,
            'category' => ResourceCategory::STATIC->value,
            'width' => 30.0,
            'height' => 15.0,
            'illumination_type' => IlluminationType::FRONT_LIT->value,
        ]);

        Sanctum::actingAs($this->ownerA);

        $response = $this->deleteJson("/api/v1/tenant/advertising-resources/{$resB->uuid}");

        $response->assertStatus(404);
        $this->assertNull($resB->fresh()->deleted_at);
    }

    /**
     * 21. Organization ID cannot be spoofed.
     */
    public function test_organization_id_cannot_be_spoofed(): void
    {
        Sanctum::actingAs($this->ownerA);

        $response = $this->postJson('/api/v1/tenant/advertising-resources', [
            'location_uuid' => $this->locA->uuid,
            'name' => 'Spoof Attempt',
            'code' => 'SPOOF-001',
            'organization_id' => $this->orgB->id,
            'resource_type' => ResourceType::HOARDING->value,
            'category' => ResourceCategory::STATIC->value,
            'width' => 20.0,
            'height' => 10.0,
            'illumination_type' => IlluminationType::NON_LIT->value,
        ]);

        $response->assertStatus(201);
        $this->assertEquals($this->orgA->id, $response->json('data.organization_id'));

        $this->assertDatabaseHas('advertising_resources', [
            'code' => 'SPOOF-001',
            'organization_id' => $this->orgA->id,
        ]);
        $this->assertDatabaseMissing('advertising_resources', [
            'code' => 'SPOOF-001',
            'organization_id' => $this->orgB->id,
        ]);
    }

    /**
     * 22. Area is dynamically calculated from width and height.
     */
    public function test_area_is_dynamically_calculated_from_width_and_height(): void
    {
        $resource = AdvertisingResource::create([
            'organization_id' => $this->orgA->id,
            'location_id' => $this->locA->id,
            'name' => 'Dynamic Area Unit',
            'code' => 'AREA-001',
            'resource_type' => ResourceType::BILLBOARD->value,
            'category' => ResourceCategory::STATIC->value,
            'width' => 40.0,
            'height' => 20.0,
            'illumination_type' => IlluminationType::FRONT_LIT->value,
        ]);

        $this->assertEquals(800.0, $resource->area);

        // Update dimensions
        $resource->update([
            'width' => 50.0,
            'height' => 20.0,
        ]);

        $this->assertEquals(1000.0, $resource->fresh()->area);

        Sanctum::actingAs($this->ownerA);
        $response = $this->getJson("/api/v1/tenant/advertising-resources/{$resource->uuid}");
        $response->assertStatus(200);
        $this->assertEquals(1000.0, $response->json('data.area'));
    }

    /**
     * 23. Subscription quota enforcement blocks creation when limit reached.
     */
    public function test_subscription_quota_enforcement_blocks_creation_when_limit_reached(): void
    {
        // Override Org A subscription to have a tight limit of 2
        $sub = $this->orgA->activeSubscription;
        $sub->update(['resource_limit' => 2]);

        // Create 2 ACTIVE resources
        AdvertisingResource::create([
            'organization_id' => $this->orgA->id,
            'location_id' => $this->locA->id,
            'name' => 'Resource 1',
            'code' => 'QUOTA-01',
            'resource_type' => ResourceType::UNIPOLE->value,
            'category' => ResourceCategory::STATIC->value,
            'width' => 20.0,
            'height' => 10.0,
            'illumination_type' => IlluminationType::FRONT_LIT->value,
            'status' => ResourceStatus::ACTIVE->value,
        ]);

        AdvertisingResource::create([
            'organization_id' => $this->orgA->id,
            'location_id' => $this->locA->id,
            'name' => 'Resource 2',
            'code' => 'QUOTA-02',
            'resource_type' => ResourceType::UNIPOLE->value,
            'category' => ResourceCategory::STATIC->value,
            'width' => 20.0,
            'height' => 10.0,
            'illumination_type' => IlluminationType::FRONT_LIT->value,
            'status' => ResourceStatus::ACTIVE->value,
        ]);

        Sanctum::actingAs($this->ownerA);

        // Attempt to create 3rd active resource
        $response = $this->postJson('/api/v1/tenant/advertising-resources', [
            'location_uuid' => $this->locA->uuid,
            'name' => 'Resource 3 - Exceeding',
            'code' => 'QUOTA-03',
            'resource_type' => ResourceType::UNIPOLE->value,
            'category' => ResourceCategory::STATIC->value,
            'width' => 20.0,
            'height' => 10.0,
            'illumination_type' => IlluminationType::FRONT_LIT->value,
            'status' => ResourceStatus::ACTIVE->value,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['quota']);
    }

    /**
     * 24. Maintenance and inactive resources do not consume active quota.
     */
    public function test_maintenance_and_inactive_resources_do_not_consume_active_quota(): void
    {
        // Set quota limit = 2
        $sub = $this->orgA->activeSubscription;
        $sub->update(['resource_limit' => 2]);

        // 2 ACTIVE resources already exist
        AdvertisingResource::create([
            'organization_id' => $this->orgA->id,
            'location_id' => $this->locA->id,
            'name' => 'Active 1',
            'code' => 'ACT-01',
            'resource_type' => ResourceType::UNIPOLE->value,
            'category' => ResourceCategory::STATIC->value,
            'width' => 20.0,
            'height' => 10.0,
            'illumination_type' => IlluminationType::FRONT_LIT->value,
            'status' => ResourceStatus::ACTIVE->value,
        ]);

        AdvertisingResource::create([
            'organization_id' => $this->orgA->id,
            'location_id' => $this->locA->id,
            'name' => 'Active 2',
            'code' => 'ACT-02',
            'resource_type' => ResourceType::UNIPOLE->value,
            'category' => ResourceCategory::STATIC->value,
            'width' => 20.0,
            'height' => 10.0,
            'illumination_type' => IlluminationType::FRONT_LIT->value,
            'status' => ResourceStatus::ACTIVE->value,
        ]);

        Sanctum::actingAs($this->ownerA);

        // Creating an UNDER_MAINTENANCE resource must succeed despite active quota being full
        $responseMaint = $this->postJson('/api/v1/tenant/advertising-resources', [
            'location_uuid' => $this->locA->uuid,
            'name' => 'Under Maintenance Face',
            'code' => 'MAINT-01',
            'resource_type' => ResourceType::UNIPOLE->value,
            'category' => ResourceCategory::STATIC->value,
            'width' => 20.0,
            'height' => 10.0,
            'illumination_type' => IlluminationType::FRONT_LIT->value,
            'status' => ResourceStatus::UNDER_MAINTENANCE->value,
        ]);

        $responseMaint->assertStatus(201);

        // Creating an INACTIVE resource must also succeed
        $responseInactive = $this->postJson('/api/v1/tenant/advertising-resources', [
            'location_uuid' => $this->locA->uuid,
            'name' => 'Inactive Face',
            'code' => 'INACT-01',
            'resource_type' => ResourceType::UNIPOLE->value,
            'category' => ResourceCategory::STATIC->value,
            'width' => 20.0,
            'height' => 10.0,
            'illumination_type' => IlluminationType::FRONT_LIT->value,
            'status' => ResourceStatus::INACTIVE->value,
        ]);

        $responseInactive->assertStatus(201);
    }

    /**
     * 25. Location with existing resources cannot be deleted.
     */
    public function test_location_with_existing_resources_cannot_be_deleted(): void
    {
        AdvertisingResource::create([
            'organization_id' => $this->orgA->id,
            'location_id' => $this->locA->id,
            'name' => 'Attached Resource Face',
            'code' => 'ATTACH-01',
            'resource_type' => ResourceType::HOARDING->value,
            'category' => ResourceCategory::STATIC->value,
            'width' => 20.0,
            'height' => 10.0,
            'illumination_type' => IlluminationType::NON_LIT->value,
        ]);

        Sanctum::actingAs($this->ownerA);

        $response = $this->deleteJson("/api/v1/tenant/locations/{$this->locA->uuid}");

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['location']);

        $this->assertNull($this->locA->fresh()->deleted_at);
    }

    /**
     * 26. Soft delete works for advertising resource.
     */
    public function test_soft_delete_works_for_advertising_resource(): void
    {
        $resource = AdvertisingResource::create([
            'organization_id' => $this->orgA->id,
            'location_id' => $this->locA->id,
            'name' => 'Resource To Soft Delete',
            'code' => 'DEL-001',
            'resource_type' => ResourceType::HOARDING->value,
            'category' => ResourceCategory::STATIC->value,
            'width' => 20.0,
            'height' => 10.0,
            'illumination_type' => IlluminationType::NON_LIT->value,
        ]);

        Sanctum::actingAs($this->ownerA);

        $response = $this->deleteJson("/api/v1/tenant/advertising-resources/{$resource->uuid}");

        $response->assertStatus(200);
        $this->assertNotNull($resource->fresh()->deleted_at);

        // Querying through API index returns 0 items
        $listRes = $this->getJson('/api/v1/tenant/advertising-resources');
        $this->assertEquals(0, $listRes->json('data.pagination.total'));
    }

    /**
     * 27. Reactivating resource is blocked when active quota is full.
     */
    public function test_reactivating_resource_is_blocked_when_active_quota_is_full(): void
    {
        // Limit = 2
        $sub = $this->orgA->activeSubscription;
        $sub->update(['resource_limit' => 2]);

        // 2 ACTIVE resources
        AdvertisingResource::create([
            'organization_id' => $this->orgA->id,
            'location_id' => $this->locA->id,
            'name' => 'Active 1',
            'code' => 'ACT-FULL-01',
            'resource_type' => ResourceType::UNIPOLE->value,
            'category' => ResourceCategory::STATIC->value,
            'width' => 20.0,
            'height' => 10.0,
            'illumination_type' => IlluminationType::FRONT_LIT->value,
            'status' => ResourceStatus::ACTIVE->value,
        ]);

        AdvertisingResource::create([
            'organization_id' => $this->orgA->id,
            'location_id' => $this->locA->id,
            'name' => 'Active 2',
            'code' => 'ACT-FULL-02',
            'resource_type' => ResourceType::UNIPOLE->value,
            'category' => ResourceCategory::STATIC->value,
            'width' => 20.0,
            'height' => 10.0,
            'illumination_type' => IlluminationType::FRONT_LIT->value,
            'status' => ResourceStatus::ACTIVE->value,
        ]);

        // 1 INACTIVE resource
        $inactiveResource = AdvertisingResource::create([
            'organization_id' => $this->orgA->id,
            'location_id' => $this->locA->id,
            'name' => 'Inactive 1',
            'code' => 'INACT-FULL-01',
            'resource_type' => ResourceType::UNIPOLE->value,
            'category' => ResourceCategory::STATIC->value,
            'width' => 20.0,
            'height' => 10.0,
            'illumination_type' => IlluminationType::FRONT_LIT->value,
            'status' => ResourceStatus::INACTIVE->value,
        ]);

        Sanctum::actingAs($this->ownerA);

        // Attempt to reactivate the INACTIVE resource: INACTIVE -> ACTIVE
        $response = $this->putJson("/api/v1/tenant/advertising-resources/{$inactiveResource->uuid}", [
            'status' => ResourceStatus::ACTIVE->value,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['status']);

        // Verify status remains INACTIVE
        $this->assertEquals(ResourceStatus::INACTIVE, $inactiveResource->fresh()->status);
    }

    /**
     * 28. Resource creation is blocked without active subscription.
     */
    public function test_resource_creation_is_blocked_without_active_subscription(): void
    {
        // Mark Org A subscription CANCELLED
        $sub = $this->orgA->activeSubscription;
        $sub->update(['status' => SubscriptionStatus::CANCELLED->value]);

        Sanctum::actingAs($this->ownerA);

        $response = $this->postJson('/api/v1/tenant/advertising-resources', [
            'location_uuid' => $this->locA->uuid,
            'name' => 'No Sub Hoarding',
            'code' => 'NOSUB-001',
            'resource_type' => ResourceType::HOARDING->value,
            'category' => ResourceCategory::STATIC->value,
            'width' => 20.0,
            'height' => 10.0,
            'illumination_type' => IlluminationType::NON_LIT->value,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['subscription']);
    }
}
