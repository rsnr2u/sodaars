<?php

namespace Tests\Feature;

use App\Enums\LocationStatus;
use App\Enums\MembershipStatus;
use App\Enums\ProviderRole;
use App\Models\Location;
use App\Models\Organization;
use App\Models\OrganizationUser;
use App\Models\User;
use App\Services\Permission\PermissionService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class LocationTest extends TestCase
{
    use RefreshDatabase;

    protected Organization $orgA;
    protected Organization $orgB;

    protected User $ownerA;
    protected User $managerA;
    protected User $staffA;

    protected User $ownerB;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();

        // Organization A
        $this->orgA = Organization::create([
            'name' => 'Apex Outdoor Advertising',
            'slug' => 'apex-outdoor',
            'status' => 'ACTIVE',
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

        // Organization B
        $this->orgB = Organization::create([
            'name' => 'Beacon Billboards Ltd',
            'slug' => 'beacon-billboards',
            'status' => 'ACTIVE',
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
    }

    /**
     * 1. Owner can create location.
     */
    public function test_owner_can_create_location(): void
    {
        Sanctum::actingAs($this->ownerA);

        $response = $this->postJson('/api/v1/tenant/locations', [
            'name' => 'Koramangala Sony Signal Unipole',
            'code' => 'LOC-KOR-001',
            'address' => '80 Feet Road, 4th Block, Koramangala',
            'area' => 'Koramangala',
            'locality' => '4th Block',
            'city' => 'Bengaluru',
            'district' => 'Bengaluru Urban',
            'state' => 'Karnataka',
            'pincode' => '560034',
            'country' => 'India',
            'landmark' => 'Near Sony World Junction',
            'latitude' => 12.9352,
            'longitude' => 77.6245,
            'description' => 'High-traffic intersection unipole with double-sided view.',
            'status' => LocationStatus::ACTIVE->value,
        ]);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'data' => [
                    'name' => 'Koramangala Sony Signal Unipole',
                    'code' => 'LOC-KOR-001',
                    'city' => 'Bengaluru',
                    'organization_id' => $this->orgA->id,
                ],
            ]);

        $this->assertDatabaseHas('locations', [
            'organization_id' => $this->orgA->id,
            'code' => 'LOC-KOR-001',
            'created_by_user_id' => $this->ownerA->id,
        ]);
    }

    /**
     * 2. Manager can create location.
     */
    public function test_manager_can_create_location(): void
    {
        Sanctum::actingAs($this->managerA);

        $response = $this->postJson('/api/v1/tenant/locations', [
            'name' => 'Indiranagar 100ft Road Billboard',
            'code' => 'LOC-IND-001',
            'city' => 'Bengaluru',
            'state' => 'Karnataka',
            'latitude' => 12.9784,
            'longitude' => 77.6408,
        ]);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'data' => [
                    'code' => 'LOC-IND-001',
                    'organization_id' => $this->orgA->id,
                ],
            ]);

        $this->assertDatabaseHas('locations', [
            'organization_id' => $this->orgA->id,
            'code' => 'LOC-IND-001',
            'created_by_user_id' => $this->managerA->id,
        ]);
    }

    /**
     * 3. Staff cannot create location.
     */
    public function test_staff_cannot_create_location(): void
    {
        Sanctum::actingAs($this->staffA);

        $response = $this->postJson('/api/v1/tenant/locations', [
            'name' => 'MG Road Billboard',
            'code' => 'LOC-MG-001',
            'city' => 'Bengaluru',
            'state' => 'Karnataka',
        ]);

        $response->assertStatus(403);
    }

    /**
     * 4. Owner can view location.
     */
    public function test_owner_can_view_location(): void
    {
        $location = Location::create([
            'organization_id' => $this->orgA->id,
            'name' => 'Outer Ring Road Bellandur Gantry',
            'code' => 'LOC-ORR-001',
            'city' => 'Bengaluru',
            'state' => 'Karnataka',
            'created_by_user_id' => $this->ownerA->id,
        ]);

        Sanctum::actingAs($this->ownerA);

        $response = $this->getJson("/api/v1/tenant/locations/{$location->uuid}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'uuid' => $location->uuid,
                    'code' => 'LOC-ORR-001',
                    'city' => 'Bengaluru',
                ],
            ]);
    }

    /**
     * 5. Manager can update location.
     */
    public function test_manager_can_update_location(): void
    {
        $location = Location::create([
            'organization_id' => $this->orgA->id,
            'name' => 'Original Location Name',
            'code' => 'LOC-UPD-001',
            'city' => 'Bengaluru',
            'state' => 'Karnataka',
            'created_by_user_id' => $this->ownerA->id,
        ]);

        Sanctum::actingAs($this->managerA);

        $response = $this->putJson("/api/v1/tenant/locations/{$location->uuid}", [
            'name' => 'Updated Location Name',
            'description' => 'Updated by operations manager.',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'name' => 'Updated Location Name',
                    'description' => 'Updated by operations manager.',
                ],
            ]);

        $this->assertEquals('Updated Location Name', $location->fresh()->name);
    }

    /**
     * 6. Staff can view location.
     */
    public function test_staff_can_view_location(): void
    {
        $location = Location::create([
            'organization_id' => $this->orgA->id,
            'name' => 'Whitefield ITPL Junction Hoarding',
            'code' => 'LOC-WTF-001',
            'city' => 'Bengaluru',
            'state' => 'Karnataka',
            'created_by_user_id' => $this->ownerA->id,
        ]);

        Sanctum::actingAs($this->staffA);

        $response = $this->getJson("/api/v1/tenant/locations/{$location->uuid}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'code' => 'LOC-WTF-001',
                ],
            ]);
    }

    /**
     * 7. Staff cannot update location.
     */
    public function test_staff_cannot_update_location(): void
    {
        $location = Location::create([
            'organization_id' => $this->orgA->id,
            'name' => 'Hebbal Flyover Gantry',
            'code' => 'LOC-HBL-001',
            'city' => 'Bengaluru',
            'state' => 'Karnataka',
            'created_by_user_id' => $this->ownerA->id,
        ]);

        Sanctum::actingAs($this->staffA);

        $response = $this->putJson("/api/v1/tenant/locations/{$location->uuid}", [
            'name' => 'Unauthorized Name Change',
        ]);

        $response->assertStatus(403);
    }

    /**
     * 8. Authorized user can list locations.
     */
    public function test_authorized_user_can_list_locations(): void
    {
        Location::create([
            'organization_id' => $this->orgA->id,
            'name' => 'Silk Board Site 01',
            'code' => 'LOC-SB-001',
            'city' => 'Bengaluru',
            'state' => 'Karnataka',
        ]);
        Location::create([
            'organization_id' => $this->orgA->id,
            'name' => 'Silk Board Site 02',
            'code' => 'LOC-SB-002',
            'city' => 'Bengaluru',
            'state' => 'Karnataka',
        ]);

        Sanctum::actingAs($this->ownerA);

        $response = $this->getJson('/api/v1/tenant/locations');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Locations retrieved successfully.',
            ])
            ->assertJsonStructure([
                'data' => [
                    'items',
                    'pagination' => ['total', 'per_page', 'current_page', 'last_page'],
                ],
            ]);

        $this->assertEquals(2, $response->json('data.pagination.total'));
    }

    /**
     * 9. Search works across name, code, area, city, locality, landmark.
     */
    public function test_search_works(): void
    {
        Location::create([
            'organization_id' => $this->orgA->id,
            'name' => 'Silk Board Flyover Hoarding',
            'code' => 'LOC-SB-01',
            'city' => 'Bengaluru',
            'state' => 'Karnataka',
        ]);
        Location::create([
            'organization_id' => $this->orgA->id,
            'name' => 'Indiranagar Prime Unipole',
            'code' => 'LOC-IN-02',
            'area' => 'Indiranagar 100ft',
            'city' => 'Bengaluru',
            'state' => 'Karnataka',
        ]);
        Location::create([
            'organization_id' => $this->orgA->id,
            'name' => 'MG Road Station Billboard',
            'code' => 'LOC-MG-03',
            'landmark' => 'Near Trinity Circle',
            'city' => 'Bengaluru',
            'state' => 'Karnataka',
        ]);

        Sanctum::actingAs($this->ownerA);

        // Search by name substring
        $response1 = $this->getJson('/api/v1/tenant/locations?search=Silk+Board');
        $this->assertEquals(1, $response1->json('data.pagination.total'));
        $this->assertEquals('LOC-SB-01', $response1->json('data.items.0.code'));

        // Search by code
        $response2 = $this->getJson('/api/v1/tenant/locations?search=LOC-IN-02');
        $this->assertEquals(1, $response2->json('data.pagination.total'));

        // Search by landmark
        $response3 = $this->getJson('/api/v1/tenant/locations?search=Trinity');
        $this->assertEquals(1, $response3->json('data.pagination.total'));
    }

    /**
     * 10. Status filtering works (ACTIVE, INACTIVE, UNDER_REVIEW).
     */
    public function test_status_filtering_works(): void
    {
        Location::create([
            'organization_id' => $this->orgA->id,
            'name' => 'Active Site',
            'code' => 'LOC-ACT-01',
            'city' => 'Bengaluru',
            'state' => 'Karnataka',
            'status' => LocationStatus::ACTIVE->value,
        ]);
        Location::create([
            'organization_id' => $this->orgA->id,
            'name' => 'Inactive Site',
            'code' => 'LOC-INA-01',
            'city' => 'Bengaluru',
            'state' => 'Karnataka',
            'status' => LocationStatus::INACTIVE->value,
        ]);
        Location::create([
            'organization_id' => $this->orgA->id,
            'name' => 'Review Site',
            'code' => 'LOC-REV-01',
            'city' => 'Bengaluru',
            'state' => 'Karnataka',
            'status' => LocationStatus::UNDER_REVIEW->value,
        ]);

        Sanctum::actingAs($this->ownerA);

        $response = $this->getJson('/api/v1/tenant/locations?status=' . LocationStatus::INACTIVE->value);

        $this->assertEquals(1, $response->json('data.pagination.total'));
        $this->assertEquals('LOC-INA-01', $response->json('data.items.0.code'));
    }

    /**
     * 11. City filtering works.
     */
    public function test_city_filtering_works(): void
    {
        Location::create([
            'organization_id' => $this->orgA->id,
            'name' => 'Bengaluru Site',
            'code' => 'LOC-BLR-01',
            'city' => 'Bengaluru',
            'state' => 'Karnataka',
        ]);
        Location::create([
            'organization_id' => $this->orgA->id,
            'name' => 'Mysuru Palace Road',
            'code' => 'LOC-MYS-01',
            'city' => 'Mysuru',
            'state' => 'Karnataka',
        ]);

        Sanctum::actingAs($this->ownerA);

        $response = $this->getJson('/api/v1/tenant/locations?city=Mysuru');

        $this->assertEquals(1, $response->json('data.pagination.total'));
        $this->assertEquals('LOC-MYS-01', $response->json('data.items.0.code'));
    }

    /**
     * 12. District filtering works.
     */
    public function test_district_filtering_works(): void
    {
        Location::create([
            'organization_id' => $this->orgA->id,
            'name' => 'Urban Site',
            'code' => 'LOC-U-01',
            'city' => 'Bengaluru',
            'district' => 'Bengaluru Urban',
            'state' => 'Karnataka',
        ]);
        Location::create([
            'organization_id' => $this->orgA->id,
            'name' => 'Rural Site',
            'code' => 'LOC-R-01',
            'city' => 'Doddaballapura',
            'district' => 'Bengaluru Rural',
            'state' => 'Karnataka',
        ]);

        Sanctum::actingAs($this->ownerA);

        $response = $this->getJson('/api/v1/tenant/locations?district=Bengaluru+Rural');

        $this->assertEquals(1, $response->json('data.pagination.total'));
        $this->assertEquals('LOC-R-01', $response->json('data.items.0.code'));
    }

    /**
     * 13. State filtering works.
     */
    public function test_state_filtering_works(): void
    {
        Location::create([
            'organization_id' => $this->orgA->id,
            'name' => 'Karnataka Site',
            'code' => 'LOC-KA-01',
            'city' => 'Bengaluru',
            'state' => 'Karnataka',
        ]);
        Location::create([
            'organization_id' => $this->orgA->id,
            'name' => 'Maharashtra Site',
            'code' => 'LOC-MH-01',
            'city' => 'Mumbai',
            'state' => 'Maharashtra',
        ]);

        Sanctum::actingAs($this->ownerA);

        $response = $this->getJson('/api/v1/tenant/locations?state=Maharashtra');

        $this->assertEquals(1, $response->json('data.pagination.total'));
        $this->assertEquals('LOC-MH-01', $response->json('data.items.0.code'));
    }

    /**
     * 14. Pagination works.
     */
    public function test_pagination_works(): void
    {
        for ($i = 1; $i <= 5; $i++) {
            Location::create([
                'organization_id' => $this->orgA->id,
                'name' => "Site {$i}",
                'code' => "LOC-PAGE-0{$i}",
                'city' => 'Bengaluru',
                'state' => 'Karnataka',
            ]);
        }

        Sanctum::actingAs($this->ownerA);

        $response = $this->getJson('/api/v1/tenant/locations?per_page=2&page=1');

        $response->assertStatus(200);
        $this->assertEquals(5, $response->json('data.pagination.total'));
        $this->assertEquals(2, $response->json('data.pagination.per_page'));
        $this->assertEquals(1, $response->json('data.pagination.current_page'));
        $this->assertCount(2, $response->json('data.items'));
    }

    /**
     * 15. Location code is unique within organization.
     */
    public function test_location_code_is_unique_within_organization(): void
    {
        Location::create([
            'organization_id' => $this->orgA->id,
            'name' => 'Existing Site',
            'code' => 'LOC-DUPLICATE-01',
            'city' => 'Bengaluru',
            'state' => 'Karnataka',
        ]);

        Sanctum::actingAs($this->ownerA);

        $response = $this->postJson('/api/v1/tenant/locations', [
            'name' => 'Second Site With Same Code',
            'code' => 'LOC-DUPLICATE-01',
            'city' => 'Bengaluru',
            'state' => 'Karnataka',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['code']);
    }

    /**
     * 16. Same location code can exist in another organization.
     */
    public function test_same_location_code_can_exist_in_another_organization(): void
    {
        // Organization A creates LOC-SHARED-001
        Location::create([
            'organization_id' => $this->orgA->id,
            'name' => 'Org A Shared Code Site',
            'code' => 'LOC-SHARED-001',
            'city' => 'Bengaluru',
            'state' => 'Karnataka',
        ]);

        // Organization B creates LOC-SHARED-001
        Sanctum::actingAs($this->ownerB);

        $response = $this->postJson('/api/v1/tenant/locations', [
            'name' => 'Org B Shared Code Site',
            'code' => 'LOC-SHARED-001',
            'city' => 'Mumbai',
            'state' => 'Maharashtra',
        ]);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'data' => [
                    'code' => 'LOC-SHARED-001',
                    'organization_id' => $this->orgB->id,
                ],
            ]);

        // Both records exist independently
        $this->assertEquals(1, Location::withoutGlobalScopes()->where('organization_id', $this->orgA->id)->where('code', 'LOC-SHARED-001')->count());
        $this->assertEquals(1, Location::withoutGlobalScopes()->where('organization_id', $this->orgB->id)->where('code', 'LOC-SHARED-001')->count());
    }

    /**
     * 17. Tenant A cannot access Tenant B location.
     */
    public function test_tenant_a_cannot_access_tenant_b_location(): void
    {
        $locationB = Location::create([
            'organization_id' => $this->orgB->id,
            'name' => 'Secret Org B Site',
            'code' => 'LOC-SEC-001',
            'city' => 'Mumbai',
            'state' => 'Maharashtra',
        ]);

        Sanctum::actingAs($this->ownerA);

        // Attempt to show Org B location while authenticated as Org A
        $response = $this->getJson("/api/v1/tenant/locations/{$locationB->uuid}");

        $response->assertStatus(404);
    }

    /**
     * 18. Tenant A cannot update Tenant B location.
     */
    public function test_tenant_a_cannot_update_tenant_b_location(): void
    {
        $locationB = Location::create([
            'organization_id' => $this->orgB->id,
            'name' => 'Org B Site',
            'code' => 'LOC-B-001',
            'city' => 'Mumbai',
            'state' => 'Maharashtra',
        ]);

        Sanctum::actingAs($this->ownerA);

        $response = $this->putJson("/api/v1/tenant/locations/{$locationB->uuid}", [
            'name' => 'Malicious Update By Org A',
        ]);

        $response->assertStatus(404);
        $this->assertEquals('Org B Site', $locationB->fresh()->name);
    }

    /**
     * 19. Tenant A cannot delete Tenant B location.
     */
    public function test_tenant_a_cannot_delete_tenant_b_location(): void
    {
        $locationB = Location::create([
            'organization_id' => $this->orgB->id,
            'name' => 'Org B Location To Preserve',
            'code' => 'LOC-PRE-001',
            'city' => 'Mumbai',
            'state' => 'Maharashtra',
        ]);

        Sanctum::actingAs($this->ownerA);

        $response = $this->deleteJson("/api/v1/tenant/locations/{$locationB->uuid}");

        $response->assertStatus(404);
        $this->assertNull($locationB->fresh()->deleted_at);
    }

    /**
     * 20. organization_id cannot be spoofed.
     */
    public function test_organization_id_cannot_be_spoofed(): void
    {
        Sanctum::actingAs($this->ownerA);

        // Attacker passes organization_id belonging to Org B
        $response = $this->postJson('/api/v1/tenant/locations', [
            'organization_id' => $this->orgB->id,
            'name' => 'Spoof Attempt Location',
            'code' => 'LOC-SPOOF-01',
            'city' => 'Bengaluru',
            'state' => 'Karnataka',
        ]);

        $response->assertStatus(201);

        // The stored location MUST belong to authenticated Org A, not Org B
        $created = Location::withoutGlobalScopes()->where('code', 'LOC-SPOOF-01')->first();
        $this->assertNotNull($created);
        $this->assertEquals($this->orgA->id, $created->organization_id);
        $this->assertNotEquals($this->orgB->id, $created->organization_id);
    }

    /**
     * 21. Latitude validation works (-90 to 90).
     */
    public function test_latitude_validation_works(): void
    {
        Sanctum::actingAs($this->ownerA);

        // Latitude > 90
        $invalidHigh = $this->postJson('/api/v1/tenant/locations', [
            'name' => 'Invalid Latitude High',
            'code' => 'LOC-LAT-01',
            'city' => 'Bengaluru',
            'state' => 'Karnataka',
            'latitude' => 95.5000000,
        ]);
        $invalidHigh->assertStatus(422)->assertJsonValidationErrors(['latitude']);

        // Latitude < -90
        $invalidLow = $this->postJson('/api/v1/tenant/locations', [
            'name' => 'Invalid Latitude Low',
            'code' => 'LOC-LAT-02',
            'city' => 'Bengaluru',
            'state' => 'Karnataka',
            'latitude' => -95.5000000,
        ]);
        $invalidLow->assertStatus(422)->assertJsonValidationErrors(['latitude']);

        // Valid latitude
        $valid = $this->postJson('/api/v1/tenant/locations', [
            'name' => 'Valid Latitude',
            'code' => 'LOC-LAT-03',
            'city' => 'Bengaluru',
            'state' => 'Karnataka',
            'latitude' => 12.9715987,
        ]);
        $valid->assertStatus(201);
    }

    /**
     * 22. Longitude validation works (-180 to 180).
     */
    public function test_longitude_validation_works(): void
    {
        Sanctum::actingAs($this->ownerA);

        // Longitude > 180
        $invalidHigh = $this->postJson('/api/v1/tenant/locations', [
            'name' => 'Invalid Longitude High',
            'code' => 'LOC-LNG-01',
            'city' => 'Bengaluru',
            'state' => 'Karnataka',
            'longitude' => 185.0000000,
        ]);
        $invalidHigh->assertStatus(422)->assertJsonValidationErrors(['longitude']);

        // Longitude < -180
        $invalidLow = $this->postJson('/api/v1/tenant/locations', [
            'name' => 'Invalid Longitude Low',
            'code' => 'LOC-LNG-02',
            'city' => 'Bengaluru',
            'state' => 'Karnataka',
            'longitude' => -185.0000000,
        ]);
        $invalidLow->assertStatus(422)->assertJsonValidationErrors(['longitude']);

        // Valid longitude
        $valid = $this->postJson('/api/v1/tenant/locations', [
            'name' => 'Valid Longitude',
            'code' => 'LOC-LNG-03',
            'city' => 'Bengaluru',
            'state' => 'Karnataka',
            'longitude' => 77.5945627,
        ]);
        $valid->assertStatus(201);
    }

    /**
     * 23. Soft delete works.
     */
    public function test_soft_delete_works(): void
    {
        $location = Location::create([
            'organization_id' => $this->orgA->id,
            'name' => 'Location To Delete',
            'code' => 'LOC-DEL-01',
            'city' => 'Bengaluru',
            'state' => 'Karnataka',
        ]);

        Sanctum::actingAs($this->ownerA);

        $response = $this->deleteJson("/api/v1/tenant/locations/{$location->uuid}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Location deleted successfully.',
            ]);

        // Row still exists in database with non-null deleted_at
        $this->assertSoftDeleted('locations', [
            'id' => $location->id,
            'code' => 'LOC-DEL-01',
        ]);
    }

    /**
     * 24. Deleted location does not appear in normal listing.
     */
    public function test_deleted_location_does_not_appear_in_normal_listing(): void
    {
        $locationActive = Location::create([
            'organization_id' => $this->orgA->id,
            'name' => 'Surviving Site',
            'code' => 'LOC-SURVIVE-01',
            'city' => 'Bengaluru',
            'state' => 'Karnataka',
        ]);

        $locationDeleted = Location::create([
            'organization_id' => $this->orgA->id,
            'name' => 'Ghost Site',
            'code' => 'LOC-GHOST-01',
            'city' => 'Bengaluru',
            'state' => 'Karnataka',
        ]);
        $locationDeleted->delete();

        Sanctum::actingAs($this->ownerA);

        $response = $this->getJson('/api/v1/tenant/locations');

        $response->assertStatus(200);
        $this->assertEquals(1, $response->json('data.pagination.total'));
        $this->assertEquals('LOC-SURVIVE-01', $response->json('data.items.0.code'));
    }

    /**
     * 25. Provider permissions work correctly (Owner, Manager, Staff).
     */
    public function test_provider_permissions_work_correctly(): void
    {
        $permissionService = app(PermissionService::class);

        // Owner: full access via wildcard
        $this->assertTrue($permissionService->roleHasPermission(ProviderRole::PROVIDER_OWNER->value, 'location.view'));
        $this->assertTrue($permissionService->roleHasPermission(ProviderRole::PROVIDER_OWNER->value, 'location.create'));
        $this->assertTrue($permissionService->roleHasPermission(ProviderRole::PROVIDER_OWNER->value, 'location.update'));
        $this->assertTrue($permissionService->roleHasPermission(ProviderRole::PROVIDER_OWNER->value, 'location.delete'));

        // Manager: has location.* wildcard
        $this->assertTrue($permissionService->roleHasPermission(ProviderRole::PROVIDER_MANAGER->value, 'location.view'));
        $this->assertTrue($permissionService->roleHasPermission(ProviderRole::PROVIDER_MANAGER->value, 'location.create'));
        $this->assertTrue($permissionService->roleHasPermission(ProviderRole::PROVIDER_MANAGER->value, 'location.update'));
        $this->assertTrue($permissionService->roleHasPermission(ProviderRole::PROVIDER_MANAGER->value, 'location.delete'));

        // Staff: view only
        $this->assertTrue($permissionService->roleHasPermission(ProviderRole::PROVIDER_STAFF->value, 'location.view'));
        $this->assertFalse($permissionService->roleHasPermission(ProviderRole::PROVIDER_STAFF->value, 'location.create'));
        $this->assertFalse($permissionService->roleHasPermission(ProviderRole::PROVIDER_STAFF->value, 'location.update'));
        $this->assertFalse($permissionService->roleHasPermission(ProviderRole::PROVIDER_STAFF->value, 'location.delete'));

        // Manager can delete location
        $location = Location::create([
            'organization_id' => $this->orgA->id,
            'name' => 'Site Managed by Manager',
            'code' => 'LOC-MGR-DEL',
            'city' => 'Bengaluru',
            'state' => 'Karnataka',
        ]);

        Sanctum::actingAs($this->managerA);
        $mgrDeleteResponse = $this->deleteJson("/api/v1/tenant/locations/{$location->uuid}");
        $mgrDeleteResponse->assertStatus(200);

        // Staff cannot delete location
        $location2 = Location::create([
            'organization_id' => $this->orgA->id,
            'name' => 'Site Cannot Be Deleted By Staff',
            'code' => 'LOC-STAFF-DEL',
            'city' => 'Bengaluru',
            'state' => 'Karnataka',
        ]);

        Sanctum::actingAs($this->staffA);
        $staffDeleteResponse = $this->deleteJson("/api/v1/tenant/locations/{$location2->uuid}");
        $staffDeleteResponse->assertStatus(403);
    }

    /**
     * 26. UUID routes work correctly.
     */
    public function test_uuid_routes_work_correctly(): void
    {
        Sanctum::actingAs($this->ownerA);

        // Non-existent UUID returns 404
        $notFoundResponse = $this->getJson('/api/v1/tenant/locations/00000000-0000-0000-0000-000000000000');
        $notFoundResponse->assertStatus(404)
            ->assertJson([
                'success' => false,
                'message' => 'Location not found.',
            ]);

        // Valid UUID returns 200 with matching UUID
        $location = Location::create([
            'organization_id' => $this->orgA->id,
            'name' => 'Valid UUID Site',
            'code' => 'LOC-UUID-01',
            'city' => 'Bengaluru',
            'state' => 'Karnataka',
        ]);

        $validResponse = $this->getJson("/api/v1/tenant/locations/{$location->uuid}");
        $validResponse->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'uuid' => $location->uuid,
                    'code' => 'LOC-UUID-01',
                ],
            ]);
    }
}
