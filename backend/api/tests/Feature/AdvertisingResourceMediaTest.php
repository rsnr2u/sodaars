<?php

namespace Tests\Feature;

use App\Enums\DimensionUnit;
use App\Enums\LocationStatus;
use App\Enums\ProviderRole;
use App\Enums\ResourceCategory;
use App\Enums\ResourceMediaType;
use App\Enums\ResourceStatus;
use App\Enums\ResourceType;
use App\Enums\SubscriptionStatus;
use App\Models\AdvertisingResource;
use App\Models\AdvertisingResourceMedia;
use App\Models\Location;
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

class AdvertisingResourceMediaTest extends TestCase
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

    protected AdvertisingResource $resourceA;
    protected AdvertisingResource $resourceB;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
        Storage::fake('public');

        $plan = SubscriptionPlan::where('slug', 'professional')->firstOrFail();

        // Setup Org A
        $this->orgA = Organization::create([
            'name' => 'Metro Hoardings Ltd',
            'slug' => 'metro-hoardings-ltd',
            'email' => 'contact@metrohoardings.test',
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

        $this->ownerA = User::create([
            'name' => 'Owner A',
            'email' => 'owner@metrohoardings.test',
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
            'email' => 'manager@metrohoardings.test',
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
            'email' => 'staff@metrohoardings.test',
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

        $this->locationA = Location::create([
            'organization_id' => $this->orgA->id,
            'created_by_user_id' => $this->ownerA->id,
            'name' => 'Indiranagar 100ft Road Site',
            'code' => 'LOC-IND-001',
            'address' => '100ft Road, Indiranagar',
            'city' => 'Bengaluru',
            'state' => 'Karnataka',
            'country' => 'India',
            'pincode' => '560038',
            'status' => LocationStatus::ACTIVE->value,
        ]);

        $this->resourceA = AdvertisingResource::create([
            'organization_id' => $this->orgA->id,
            'location_id' => $this->locationA->id,
            'created_by_user_id' => $this->ownerA->id,
            'name' => 'Indiranagar 100ft Unipole Face A',
            'code' => 'RES-IND-001-A',
            'resource_type' => ResourceType::UNIPOLE->value,
            'category' => ResourceCategory::STATIC->value,
            'face_number' => 1,
            'face_label' => 'Face A (North)',
            'width' => 40.0,
            'height' => 20.0,
            'dimension_unit' => DimensionUnit::FEET->value,
            'base_price_monthly' => 120000.00,
            'status' => ResourceStatus::ACTIVE->value,
        ]);

        // Setup Org B
        $this->orgB = Organization::create([
            'name' => 'Skyline OOH Ltd',
            'slug' => 'skyline-ooh-ltd',
            'email' => 'contact@skylineooh.test',
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
            'email' => 'owner@skylineooh.test',
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
            'name' => 'Bandra Reclamation Site',
            'code' => 'LOC-BAN-001',
            'address' => 'Bandra West',
            'city' => 'Mumbai',
            'state' => 'Maharashtra',
            'country' => 'India',
            'pincode' => '400050',
            'status' => LocationStatus::ACTIVE->value,
        ]);

        $this->resourceB = AdvertisingResource::create([
            'organization_id' => $this->orgB->id,
            'location_id' => $this->locationB->id,
            'created_by_user_id' => $this->ownerB->id,
            'name' => 'Bandra Flyover Billboard Face B',
            'code' => 'RES-BAN-001-B',
            'resource_type' => ResourceType::BILLBOARD->value,
            'category' => ResourceCategory::STATIC->value,
            'face_number' => 1,
            'face_label' => 'Face B',
            'width' => 60.0,
            'height' => 20.0,
            'dimension_unit' => DimensionUnit::FEET->value,
            'base_price_monthly' => 250000.00,
            'status' => ResourceStatus::ACTIVE->value,
        ]);
    }

    public function test_owner_can_upload_valid_resource_media(): void
    {
        Sanctum::actingAs($this->ownerA);

        $file = UploadedFile::fake()->image('unipole-day.jpg', 3000, 2000)->size(1800);

        $response = $this->postJson("/api/v1/tenant/advertising-resources/{$this->resourceA->uuid}/media", [
            'file' => $file,
            'media_type' => ResourceMediaType::DAY_PHOTO->value,
            'alt_text' => 'Indiranagar 100ft road unipole daytime front shot',
            'caption' => 'Clear sightline viewing north towards Old Airport Road',
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.media_type', 'DAY_PHOTO')
            ->assertJsonPath('data.alt_text', 'Indiranagar 100ft road unipole daytime front shot')
            ->assertJsonPath('data.is_primary', true);

        $media = AdvertisingResourceMedia::first();
        $this->assertNotNull($media->storage_path);
        $this->assertNotNull($media->thumbnail_path);
        $this->assertNotNull($media->original_path);

        Storage::disk('public')->assertExists($media->storage_path);
        Storage::disk('public')->assertExists($media->thumbnail_path);
        Storage::disk('public')->assertExists($media->original_path);
    }

    public function test_filter_media_by_media_type(): void
    {
        Sanctum::actingAs($this->ownerA);

        $dayFile = UploadedFile::fake()->image('day.jpg', 800, 600)->size(300);
        $nightFile = UploadedFile::fake()->image('night.jpg', 800, 600)->size(300);

        $this->postJson("/api/v1/tenant/advertising-resources/{$this->resourceA->uuid}/media", [
            'file' => $dayFile,
            'media_type' => ResourceMediaType::DAY_PHOTO->value,
        ]);

        $this->postJson("/api/v1/tenant/advertising-resources/{$this->resourceA->uuid}/media", [
            'file' => $nightFile,
            'media_type' => ResourceMediaType::NIGHT_PHOTO->value,
        ]);

        $filterRes = $this->getJson("/api/v1/tenant/advertising-resources/{$this->resourceA->uuid}/media?media_type=NIGHT_PHOTO");
        $filterRes->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.media_type', 'NIGHT_PHOTO');
    }

    public function test_first_uploaded_resource_photo_is_automatically_primary(): void
    {
        Sanctum::actingAs($this->ownerA);

        $file1 = UploadedFile::fake()->image('photo1.jpg', 800, 600)->size(300);
        $res1 = $this->postJson("/api/v1/tenant/advertising-resources/{$this->resourceA->uuid}/media", ['file' => $file1]);
        $res1->assertStatus(201)->assertJsonPath('data.is_primary', true);

        $file2 = UploadedFile::fake()->image('photo2.jpg', 800, 600)->size(300);
        $res2 = $this->postJson("/api/v1/tenant/advertising-resources/{$this->resourceA->uuid}/media", ['file' => $file2]);
        $res2->assertStatus(201)->assertJsonPath('data.is_primary', false);
    }

    public function test_setting_new_primary_resets_previous_primary(): void
    {
        Sanctum::actingAs($this->ownerA);

        $file1 = UploadedFile::fake()->image('first.jpg', 800, 600)->size(300);
        $res1 = $this->postJson("/api/v1/tenant/advertising-resources/{$this->resourceA->uuid}/media", ['file' => $file1]);
        $uuid1 = $res1->json('data.uuid');

        $file2 = UploadedFile::fake()->image('second.jpg', 800, 600)->size(300);
        $res2 = $this->postJson("/api/v1/tenant/advertising-resources/{$this->resourceA->uuid}/media", [
            'file' => $file2,
            'is_primary' => true,
        ]);
        $uuid2 = $res2->json('data.uuid');

        $media1 = AdvertisingResourceMedia::where('uuid', $uuid1)->first();
        $media2 = AdvertisingResourceMedia::where('uuid', $uuid2)->first();

        $this->assertFalse((bool) $media1->is_primary);
        $this->assertTrue((bool) $media2->is_primary);
    }

    public function test_staff_can_upload_resource_media_and_update_metadata(): void
    {
        Sanctum::actingAs($this->staffA);

        $file = UploadedFile::fake()->image('staff_shot.jpg', 1000, 750)->size(400);
        $res = $this->postJson("/api/v1/tenant/advertising-resources/{$this->resourceA->uuid}/media", [
            'file' => $file,
            'media_type' => ResourceMediaType::CLOSE_UP->value,
            'alt_text' => 'Gantry truss close up',
        ]);
        $res->assertStatus(201);
        $mediaUuid = $res->json('data.uuid');

        // Staff updates caption
        $updateRes = $this->putJson("/api/v1/tenant/advertising-resources/{$this->resourceA->uuid}/media/{$mediaUuid}", [
            'caption' => 'Inspected mounting bolts and steel frame',
        ]);
        $updateRes->assertStatus(200)
            ->assertJsonPath('data.caption', 'Inspected mounting bolts and steel frame');
    }

    public function test_staff_cannot_set_primary_on_upload_or_update(): void
    {
        Sanctum::actingAs($this->staffA);

        $file = UploadedFile::fake()->image('test.jpg', 800, 600)->size(300);
        $uploadRes = $this->postJson("/api/v1/tenant/advertising-resources/{$this->resourceA->uuid}/media", [
            'file' => $file,
            'is_primary' => true,
        ]);
        $uploadRes->assertStatus(422)
            ->assertJsonValidationErrors(['is_primary']);

        // Upload legitimately via owner
        Sanctum::actingAs($this->ownerA);
        $ownerUpload = $this->postJson("/api/v1/tenant/advertising-resources/{$this->resourceA->uuid}/media", ['file' => $file]);
        $mediaUuid = $ownerUpload->json('data.uuid');

        // Staff tries to set primary on update
        Sanctum::actingAs($this->staffA);
        $updateRes = $this->putJson("/api/v1/tenant/advertising-resources/{$this->resourceA->uuid}/media/{$mediaUuid}", [
            'is_primary' => true,
        ]);
        $updateRes->assertStatus(422)
            ->assertJsonValidationErrors(['is_primary']);
    }

    public function test_staff_cannot_reorder_resource_gallery(): void
    {
        Sanctum::actingAs($this->ownerA);
        $file1 = UploadedFile::fake()->image('pic1.jpg', 800, 600)->size(300);
        $file2 = UploadedFile::fake()->image('pic2.jpg', 800, 600)->size(300);

        $res1 = $this->postJson("/api/v1/tenant/advertising-resources/{$this->resourceA->uuid}/media", ['file' => $file1]);
        $res2 = $this->postJson("/api/v1/tenant/advertising-resources/{$this->resourceA->uuid}/media", ['file' => $file2]);

        Sanctum::actingAs($this->staffA);
        $reorderRes = $this->putJson("/api/v1/tenant/advertising-resources/{$this->resourceA->uuid}/media/reorder", [
            'items' => [
                ['uuid' => $res2->json('data.uuid'), 'sort_order' => 1],
                ['uuid' => $res1->json('data.uuid'), 'sort_order' => 2],
            ],
        ]);
        $reorderRes->assertStatus(403);
    }

    public function test_staff_cannot_delete_resource_media(): void
    {
        Sanctum::actingAs($this->ownerA);
        $file = UploadedFile::fake()->image('pic.jpg', 800, 600)->size(300);
        $res = $this->postJson("/api/v1/tenant/advertising-resources/{$this->resourceA->uuid}/media", ['file' => $file]);
        $mediaUuid = $res->json('data.uuid');

        Sanctum::actingAs($this->staffA);
        $delRes = $this->deleteJson("/api/v1/tenant/advertising-resources/{$this->resourceA->uuid}/media/{$mediaUuid}");
        $delRes->assertStatus(403);
    }

    public function test_manager_can_reorder_resource_gallery(): void
    {
        Sanctum::actingAs($this->ownerA);
        $file1 = UploadedFile::fake()->image('pic1.jpg', 800, 600)->size(300);
        $file2 = UploadedFile::fake()->image('pic2.jpg', 800, 600)->size(300);

        $res1 = $this->postJson("/api/v1/tenant/advertising-resources/{$this->resourceA->uuid}/media", ['file' => $file1]);
        $res2 = $this->postJson("/api/v1/tenant/advertising-resources/{$this->resourceA->uuid}/media", ['file' => $file2]);

        Sanctum::actingAs($this->managerA);
        $reorderRes = $this->putJson("/api/v1/tenant/advertising-resources/{$this->resourceA->uuid}/media/reorder", [
            'items' => [
                ['uuid' => $res2->json('data.uuid'), 'sort_order' => 1],
                ['uuid' => $res1->json('data.uuid'), 'sort_order' => 2],
            ],
        ]);
        $reorderRes->assertStatus(200);

        $media2 = AdvertisingResourceMedia::where('uuid', $res2->json('data.uuid'))->first();
        $this->assertEquals(1, $media2->sort_order);
    }

    public function test_deleting_primary_resource_photo_promotes_next_available(): void
    {
        Sanctum::actingAs($this->ownerA);
        $file1 = UploadedFile::fake()->image('pic1.jpg', 800, 600)->size(300);
        $file2 = UploadedFile::fake()->image('pic2.jpg', 800, 600)->size(300);

        $res1 = $this->postJson("/api/v1/tenant/advertising-resources/{$this->resourceA->uuid}/media", ['file' => $file1]);
        $res2 = $this->postJson("/api/v1/tenant/advertising-resources/{$this->resourceA->uuid}/media", ['file' => $file2]);

        $uuid1 = $res1->json('data.uuid');
        $uuid2 = $res2->json('data.uuid');

        $delRes = $this->deleteJson("/api/v1/tenant/advertising-resources/{$this->resourceA->uuid}/media/{$uuid1}");
        $delRes->assertStatus(200);

        $media1 = AdvertisingResourceMedia::withTrashed()->where('uuid', $uuid1)->first();
        $this->assertNotNull($media1->deleted_at);

        $media2 = AdvertisingResourceMedia::where('uuid', $uuid2)->first();
        $this->assertTrue((bool) $media2->is_primary);
    }

    public function test_mime_and_security_validation_on_resource_media(): void
    {
        Sanctum::actingAs($this->ownerA);

        // PDF rejection
        $pdf = UploadedFile::fake()->create('doc.pdf', 500, 'application/pdf');
        $this->postJson("/api/v1/tenant/advertising-resources/{$this->resourceA->uuid}/media", ['file' => $pdf])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['file']);

        // SVG rejection
        $svg = UploadedFile::fake()->createWithContent('test.svg', '<svg></svg>');
        $this->postJson("/api/v1/tenant/advertising-resources/{$this->resourceA->uuid}/media", ['file' => $svg])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['file']);

        // Spoofed PHP rejection
        $php = UploadedFile::fake()->createWithContent('shell.jpg', '<?php system("ls"); ?>');
        $this->postJson("/api/v1/tenant/advertising-resources/{$this->resourceA->uuid}/media", ['file' => $php])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['file']);
    }

    public function test_tenant_isolation_prevents_cross_tenant_resource_media_access(): void
    {
        Sanctum::actingAs($this->ownerA);
        $file = UploadedFile::fake()->image('a.jpg', 800, 600)->size(300);
        $res = $this->postJson("/api/v1/tenant/advertising-resources/{$this->resourceA->uuid}/media", ['file' => $file]);
        $mediaUuid = $res->json('data.uuid');

        // Org B Owner tries to access Org A's resource media
        Sanctum::actingAs($this->ownerB);

        $this->getJson("/api/v1/tenant/advertising-resources/{$this->resourceA->uuid}/media")->assertStatus(404);
        $this->getJson("/api/v1/tenant/advertising-resources/{$this->resourceA->uuid}/media/{$mediaUuid}")->assertStatus(404);
        $this->putJson("/api/v1/tenant/advertising-resources/{$this->resourceA->uuid}/media/{$mediaUuid}", ['caption' => 'attack'])->assertStatus(404);
        $this->deleteJson("/api/v1/tenant/advertising-resources/{$this->resourceA->uuid}/media/{$mediaUuid}")->assertStatus(404);
    }
}
