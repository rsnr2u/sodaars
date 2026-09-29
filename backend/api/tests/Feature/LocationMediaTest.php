<?php

namespace Tests\Feature;

use App\Enums\LocationMediaType;
use App\Enums\LocationStatus;
use App\Enums\ProviderRole;
use App\Enums\SubscriptionStatus;
use App\Models\Location;
use App\Models\LocationMedia;
use App\Models\Organization;
use App\Models\OrganizationUser;
use App\Models\Subscription;
use App\Models\SubscriptionPlan;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class LocationMediaTest extends TestCase
{
    use RefreshDatabase;

    protected Organization $orgA;
    protected Organization $orgB;

    protected User $ownerA;
    protected User $managerA;
    protected User $staffA;
    protected User $ownerB;

    protected Location $locationA;
    protected Location $locationB;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
        Storage::fake('public');

        $plan = SubscriptionPlan::where('slug', 'professional')->firstOrFail();

        // Setup Organization A
        $this->orgA = Organization::create([
            'name' => 'Prime Media Ltd',
            'slug' => 'prime-media-ltd',
            'email' => 'contact@primemedia.test',
            'status' => 'ACTIVE',
            'verification_status' => 'VERIFIED',
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

        // Setup Users for Org A
        $this->ownerA = User::create([
            'name' => 'Owner A',
            'email' => 'owner@primemedia.test',
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
            'email' => 'manager@primemedia.test',
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
            'email' => 'staff@primemedia.test',
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

        // Setup Location for Org A
        $this->locationA = Location::create([
            'organization_id' => $this->orgA->id,
            'created_by_user_id' => $this->ownerA->id,
            'name' => 'MG Road Junction Site',
            'code' => 'LOC-MGR-001',
            'address' => '100 MG Road',
            'city' => 'Bengaluru',
            'state' => 'Karnataka',
            'country' => 'India',
            'pincode' => '560001',
            'status' => LocationStatus::ACTIVE->value,
        ]);

        // Setup Organization B & Owner B
        $this->orgB = Organization::create([
            'name' => 'Apex Outdoor Ltd',
            'slug' => 'apex-outdoor-ltd',
            'email' => 'contact@apexoutdoor.test',
            'status' => 'ACTIVE',
            'verification_status' => 'VERIFIED',
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
            'email' => 'owner@apexoutdoor.test',
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

        $this->locationB = Location::create([
            'organization_id' => $this->orgB->id,
            'created_by_user_id' => $this->ownerB->id,
            'name' => 'Connaught Place Circle Site',
            'code' => 'LOC-CPC-001',
            'address' => 'Inner Circle',
            'city' => 'New Delhi',
            'state' => 'Delhi',
            'country' => 'India',
            'pincode' => '110001',
            'status' => LocationStatus::ACTIVE->value,
        ]);
    }

    public function test_owner_can_upload_valid_location_image(): void
    {
        Sanctum::actingAs($this->ownerA);

        $file = UploadedFile::fake()->image('junction-day.jpg', 2400, 1600)->size(1200);

        $response = $this->postJson("/api/v1/tenant/locations/{$this->locationA->uuid}/media", [
            'file' => $file,
            'media_type' => LocationMediaType::SITE_PHOTO->value,
            'alt_text' => 'High visibility junction view at MG Road',
            'caption' => 'Prime arterial road intersection facing south',
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.media_type', 'SITE_PHOTO')
            ->assertJsonPath('data.alt_text', 'High visibility junction view at MG Road')
            ->assertJsonPath('data.is_primary', true);

        $this->assertDatabaseHas('location_media', [
            'location_id' => $this->locationA->id,
            'organization_id' => $this->orgA->id,
            'alt_text' => 'High visibility junction view at MG Road',
            'is_primary' => 1,
        ]);

        $media = LocationMedia::first();
        $this->assertNotNull($media->storage_path);
        $this->assertNotNull($media->thumbnail_path);
        $this->assertNotNull($media->original_path);

        Storage::disk('public')->assertExists($media->storage_path);
        Storage::disk('public')->assertExists($media->thumbnail_path);
        Storage::disk('public')->assertExists($media->original_path);
    }

    public function test_first_uploaded_image_is_automatically_primary(): void
    {
        Sanctum::actingAs($this->ownerA);

        $file1 = UploadedFile::fake()->image('first.jpg', 800, 600)->size(500);
        $res1 = $this->postJson("/api/v1/tenant/locations/{$this->locationA->uuid}/media", [
            'file' => $file1,
        ]);
        $res1->assertStatus(201)->assertJsonPath('data.is_primary', true);

        $file2 = UploadedFile::fake()->image('second.jpg', 800, 600)->size(500);
        $res2 = $this->postJson("/api/v1/tenant/locations/{$this->locationA->uuid}/media", [
            'file' => $file2,
        ]);
        $res2->assertStatus(201)->assertJsonPath('data.is_primary', false);
    }

    public function test_setting_new_primary_image_resets_previous_primary(): void
    {
        Sanctum::actingAs($this->ownerA);

        $file1 = UploadedFile::fake()->image('first.jpg', 800, 600)->size(500);
        $res1 = $this->postJson("/api/v1/tenant/locations/{$this->locationA->uuid}/media", ['file' => $file1]);
        $uuid1 = $res1->json('data.uuid');

        $file2 = UploadedFile::fake()->image('second.jpg', 800, 600)->size(500);
        $res2 = $this->postJson("/api/v1/tenant/locations/{$this->locationA->uuid}/media", [
            'file' => $file2,
            'is_primary' => true,
        ]);
        $uuid2 = $res2->json('data.uuid');

        $media1 = LocationMedia::where('uuid', $uuid1)->first();
        $media2 = LocationMedia::where('uuid', $uuid2)->first();

        $this->assertFalse((bool) $media1->is_primary);
        $this->assertTrue((bool) $media2->is_primary);
    }

    public function test_staff_can_upload_and_view_media(): void
    {
        Sanctum::actingAs($this->staffA);

        $file = UploadedFile::fake()->image('staff_shot.jpg', 1000, 750)->size(400);

        $response = $this->postJson("/api/v1/tenant/locations/{$this->locationA->uuid}/media", [
            'file' => $file,
            'alt_text' => 'Field check photo',
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.alt_text', 'Field check photo');

        $listRes = $this->getJson("/api/v1/tenant/locations/{$this->locationA->uuid}/media");
        $listRes->assertStatus(200)->assertJsonCount(1, 'data');
    }

    public function test_staff_cannot_set_primary_image_on_upload_or_update(): void
    {
        Sanctum::actingAs($this->staffA);

        // Upload with is_primary = true
        $file = UploadedFile::fake()->image('staff_attempt.jpg', 1000, 750)->size(400);
        $response = $this->postJson("/api/v1/tenant/locations/{$this->locationA->uuid}/media", [
            'file' => $file,
            'is_primary' => true,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['is_primary']);

        // Now create a photo via owner
        Sanctum::actingAs($this->ownerA);
        $ownerUpload = $this->postJson("/api/v1/tenant/locations/{$this->locationA->uuid}/media", [
            'file' => $file,
        ]);
        $mediaUuid = $ownerUpload->json('data.uuid');

        // Staff tries to update is_primary to true
        Sanctum::actingAs($this->staffA);
        $updateRes = $this->putJson("/api/v1/tenant/locations/{$this->locationA->uuid}/media/{$mediaUuid}", [
            'is_primary' => true,
        ]);
        $updateRes->assertStatus(422)
            ->assertJsonValidationErrors(['is_primary']);
    }

    public function test_staff_cannot_reorder_gallery(): void
    {
        Sanctum::actingAs($this->ownerA);
        $file1 = UploadedFile::fake()->image('pic1.jpg', 800, 600)->size(300);
        $file2 = UploadedFile::fake()->image('pic2.jpg', 800, 600)->size(300);

        $res1 = $this->postJson("/api/v1/tenant/locations/{$this->locationA->uuid}/media", ['file' => $file1]);
        $res2 = $this->postJson("/api/v1/tenant/locations/{$this->locationA->uuid}/media", ['file' => $file2]);

        Sanctum::actingAs($this->staffA);
        $reorderRes = $this->putJson("/api/v1/tenant/locations/{$this->locationA->uuid}/media/reorder", [
            'items' => [
                ['uuid' => $res2->json('data.uuid'), 'sort_order' => 1],
                ['uuid' => $res1->json('data.uuid'), 'sort_order' => 2],
            ],
        ]);

        $reorderRes->assertStatus(403);
    }

    public function test_staff_cannot_delete_media(): void
    {
        Sanctum::actingAs($this->ownerA);
        $file = UploadedFile::fake()->image('todelete.jpg', 800, 600)->size(300);
        $res = $this->postJson("/api/v1/tenant/locations/{$this->locationA->uuid}/media", ['file' => $file]);
        $mediaUuid = $res->json('data.uuid');

        Sanctum::actingAs($this->staffA);
        $delRes = $this->deleteJson("/api/v1/tenant/locations/{$this->locationA->uuid}/media/{$mediaUuid}");

        $delRes->assertStatus(403);
        $this->assertDatabaseHas('location_media', ['uuid' => $mediaUuid, 'deleted_at' => null]);
    }

    public function test_manager_can_reorder_gallery(): void
    {
        Sanctum::actingAs($this->ownerA);
        $file1 = UploadedFile::fake()->image('pic1.jpg', 800, 600)->size(300);
        $file2 = UploadedFile::fake()->image('pic2.jpg', 800, 600)->size(300);

        $res1 = $this->postJson("/api/v1/tenant/locations/{$this->locationA->uuid}/media", ['file' => $file1]);
        $res2 = $this->postJson("/api/v1/tenant/locations/{$this->locationA->uuid}/media", ['file' => $file2]);

        Sanctum::actingAs($this->managerA);
        $reorderRes = $this->putJson("/api/v1/tenant/locations/{$this->locationA->uuid}/media/reorder", [
            'items' => [
                ['uuid' => $res2->json('data.uuid'), 'sort_order' => 1],
                ['uuid' => $res1->json('data.uuid'), 'sort_order' => 2],
            ],
        ]);

        $reorderRes->assertStatus(200);

        $media2 = LocationMedia::where('uuid', $res2->json('data.uuid'))->first();
        $this->assertEquals(1, $media2->sort_order);
    }

    public function test_deleting_primary_image_promotes_next_available_photo(): void
    {
        Sanctum::actingAs($this->ownerA);
        $file1 = UploadedFile::fake()->image('pic1.jpg', 800, 600)->size(300);
        $file2 = UploadedFile::fake()->image('pic2.jpg', 800, 600)->size(300);

        $res1 = $this->postJson("/api/v1/tenant/locations/{$this->locationA->uuid}/media", ['file' => $file1]);
        $res2 = $this->postJson("/api/v1/tenant/locations/{$this->locationA->uuid}/media", ['file' => $file2]);

        $uuid1 = $res1->json('data.uuid');
        $uuid2 = $res2->json('data.uuid');

        // pic1 was primary
        $delRes = $this->deleteJson("/api/v1/tenant/locations/{$this->locationA->uuid}/media/{$uuid1}");
        $delRes->assertStatus(200);

        $media1 = LocationMedia::withTrashed()->where('uuid', $uuid1)->first();
        $this->assertNotNull($media1->deleted_at);

        // pic2 should now be promoted to primary
        $media2 = LocationMedia::where('uuid', $uuid2)->first();
        $this->assertTrue((bool) $media2->is_primary);
    }

    public function test_mime_validation_rejects_non_image_files(): void
    {
        Sanctum::actingAs($this->ownerA);

        $file = UploadedFile::fake()->create('document.pdf', 500, 'application/pdf');

        $response = $this->postJson("/api/v1/tenant/locations/{$this->locationA->uuid}/media", [
            'file' => $file,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['file']);
    }

    public function test_security_rejects_svg_files(): void
    {
        Sanctum::actingAs($this->ownerA);

        $file = UploadedFile::fake()->createWithContent('malicious.svg', '<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>');

        $response = $this->postJson("/api/v1/tenant/locations/{$this->locationA->uuid}/media", [
            'file' => $file,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['file']);
    }

    public function test_security_rejects_spoofed_php_files(): void
    {
        Sanctum::actingAs($this->ownerA);

        $file = UploadedFile::fake()->createWithContent('backdoor.jpg', '<?php phpinfo(); ?>');

        $response = $this->postJson("/api/v1/tenant/locations/{$this->locationA->uuid}/media", [
            'file' => $file,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['file']);
    }

    public function test_file_size_limit_rejection(): void
    {
        Sanctum::actingAs($this->ownerA);

        // 20MB file exceeds 15MB limit
        $file = UploadedFile::fake()->image('huge.jpg', 4000, 3000)->size(20480);

        $response = $this->postJson("/api/v1/tenant/locations/{$this->locationA->uuid}/media", [
            'file' => $file,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['file']);
    }

    public function test_tenant_isolation_prevents_cross_tenant_media_access(): void
    {
        Sanctum::actingAs($this->ownerA);
        $file = UploadedFile::fake()->image('org_a_pic.jpg', 800, 600)->size(300);
        $res = $this->postJson("/api/v1/tenant/locations/{$this->locationA->uuid}/media", ['file' => $file]);
        $mediaUuid = $res->json('data.uuid');

        // Owner B tries to access Org A's location media
        Sanctum::actingAs($this->ownerB);

        $getRes = $this->getJson("/api/v1/tenant/locations/{$this->locationA->uuid}/media");
        $getRes->assertStatus(404);

        $showRes = $this->getJson("/api/v1/tenant/locations/{$this->locationA->uuid}/media/{$mediaUuid}");
        $showRes->assertStatus(404);

        $updateRes = $this->putJson("/api/v1/tenant/locations/{$this->locationA->uuid}/media/{$mediaUuid}", [
            'caption' => 'Hacked caption',
        ]);
        $updateRes->assertStatus(404);

        $delRes = $this->deleteJson("/api/v1/tenant/locations/{$this->locationA->uuid}/media/{$mediaUuid}");
        $delRes->assertStatus(404);
    }
}
