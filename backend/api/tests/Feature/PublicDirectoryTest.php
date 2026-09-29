<?php

namespace Tests\Feature;

use App\Enums\DimensionUnit;
use App\Enums\IlluminationType;
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
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class PublicDirectoryTest extends TestCase
{
    use RefreshDatabase;

    protected Organization $orgVisible;
    protected Organization $orgHidden;
    protected Organization $orgUnverified;
    protected Organization $orgInactive;

    protected Location $locationActive;
    protected Location $locationInactive;

    protected AdvertisingResource $resourcePublic;
    protected AdvertisingResource $resourceNoPrice;
    protected AdvertisingResource $resourceInactive;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
        Storage::fake('public');

        $plan = SubscriptionPlan::where('slug', 'professional')->firstOrFail();

        // 1. Fully visible, verified, active organization
        $this->orgVisible = Organization::create([
            'name' => 'Metro Outdoor Media',
            'slug' => 'metro-outdoor-media',
            'email' => 'business@metrooutdoor.test',
            'phone' => '+91 98765 43210',
            'website' => 'https://metrooutdoor.test',
            'business_description' => 'Premier outdoor media across Andhra Pradesh and Telangana.',
            'address' => '4th Floor, Metro Towers',
            'city' => 'Vijayawada',
            'state' => 'Andhra Pradesh',
            'pincode' => '520001',
            'status' => 'ACTIVE',
            'verification_status' => 'VERIFIED',
            'verified_at' => now(),
            'public_directory_visible' => true,
            'settings' => ['operational_cities' => ['Vijayawada', 'Guntur']],
        ]);

        Subscription::create([
            'organization_id' => $this->orgVisible->id,
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

        $owner = User::create([
            'name' => 'John Owner',
            'email' => 'john.personal@example.com',
            'phone' => '+91 91111 22222',
            'password' => Hash::make('Password@123'),
            'status' => 'ACTIVE',
        ]);
        OrganizationUser::create([
            'organization_id' => $this->orgVisible->id,
            'user_id' => $owner->id,
            'role' => ProviderRole::PROVIDER_OWNER->value,
            'status' => 'ACTIVE',
            'joined_at' => now(),
        ]);

        // 2. Active location
        $this->locationActive = Location::create([
            'organization_id' => $this->orgVisible->id,
            'name' => 'Benz Circle Junction',
            'code' => 'BC-001',
            'city' => 'Vijayawada',
            'state' => 'Andhra Pradesh',
            'area' => 'Benz Circle',
            'landmark' => 'Near Jyothi Mall',
            'latitude' => 16.5033,
            'longitude' => 80.6465,
            'status' => LocationStatus::ACTIVE->value,
        ]);

        // 3. Inactive location
        $this->locationInactive = Location::create([
            'organization_id' => $this->orgVisible->id,
            'name' => 'Old Bus Stand',
            'code' => 'OBS-002',
            'city' => 'Vijayawada',
            'state' => 'Andhra Pradesh',
            'area' => 'Governorpet',
            'latitude' => 16.5100,
            'longitude' => 80.6200,
            'status' => LocationStatus::INACTIVE->value,
        ]);

        // 4. Public Active Resource (with indicative price & Stage 9 media)
        $this->resourcePublic = AdvertisingResource::create([
            'organization_id' => $this->orgVisible->id,
            'location_id' => $this->locationActive->id,
            'name' => 'Benz Circle High Impact Unipole',
            'code' => 'BC-UNI-01',
            'resource_type' => ResourceType::UNIPOLE->value,
            'category' => ResourceCategory::STATIC->value,
            'face_number' => 1,
            'face_label' => 'Facing MG Road',
            'direction' => 'Towards Bandar Road',
            'traffic_flow' => 'Heavy Commuter Traffic',
            'width' => 40.00,
            'height' => 20.00,
            'dimension_unit' => DimensionUnit::FEET->value,
            'illumination_type' => IlluminationType::FRONT_LIT->value,
            'base_price_monthly' => 85000.00,
            'currency' => 'INR',
            'status' => ResourceStatus::ACTIVE->value,
            'description' => 'Prime landmark hoarding visible from 500 meters.',
        ]);

        // Attach Stage 9 Media
        AdvertisingResourceMedia::create([
            'organization_id' => $this->orgVisible->id,
            'advertising_resource_id' => $this->resourcePublic->id,
            'file_name' => 'bc-unipole-day.webp',
            'file_url' => 'http://localhost/storage/tenants/1/resources/display/test-display.webp',
            'storage_path' => 'tenants/1/resources/display/test-display.webp',
            'original_path' => 'tenants/1/resources/originals/test-original.webp',
            'thumbnail_path' => 'tenants/1/resources/thumbnails/test-thumb.webp',
            'media_type' => ResourceMediaType::DAY_PHOTO->value,
            'mime_type' => 'image/webp',
            'file_size' => 245000,
            'width' => 1920,
            'height' => 960,
            'alt_text' => 'Benz Circle Unipole Day View',
            'caption' => 'High visibility daytime view',
            'is_primary' => true,
            'sort_order' => 1,
        ]);

        // 5. Public Active Resource with NO base_price_monthly ("Price on Request")
        $this->resourceNoPrice = AdvertisingResource::create([
            'organization_id' => $this->orgVisible->id,
            'location_id' => $this->locationActive->id,
            'name' => 'Benz Circle Gantry Billboard',
            'code' => 'BC-GAN-02',
            'resource_type' => ResourceType::GANTRY->value,
            'category' => ResourceCategory::STATIC->value,
            'width' => 60.00,
            'height' => 15.00,
            'dimension_unit' => DimensionUnit::FEET->value,
            'illumination_type' => IlluminationType::BACK_LIT->value,
            'base_price_monthly' => null,
            'currency' => 'INR',
            'status' => ResourceStatus::ACTIVE->value,
        ]);

        // 6. Inactive Resource under active location
        $this->resourceInactive = AdvertisingResource::create([
            'organization_id' => $this->orgVisible->id,
            'location_id' => $this->locationActive->id,
            'name' => 'Maintenance Screen',
            'code' => 'BC-OFF-03',
            'resource_type' => ResourceType::LED_SCREEN->value,
            'category' => ResourceCategory::DIGITAL->value,
            'width' => 20.00,
            'height' => 10.00,
            'status' => ResourceStatus::UNDER_MAINTENANCE->value,
        ]);

        // 7. Organization with visibility = false
        $this->orgHidden = Organization::create([
            'name' => 'Private Billboard Co',
            'slug' => 'private-billboard-co',
            'status' => 'ACTIVE',
            'verification_status' => 'VERIFIED',
            'public_directory_visible' => false,
        ]);

        // 8. Unverified Organization
        $this->orgUnverified = Organization::create([
            'name' => 'Unverified Media Ltd',
            'slug' => 'unverified-media-ltd',
            'status' => 'ACTIVE',
            'verification_status' => 'PENDING',
            'public_directory_visible' => true,
        ]);

        // 9. Inactive Organization
        $this->orgInactive = Organization::create([
            'name' => 'Defunct Advertising',
            'slug' => 'defunct-advertising',
            'status' => 'SUSPENDED',
            'verification_status' => 'VERIFIED',
            'public_directory_visible' => true,
        ]);
    }

    public function test_public_overview_returns_active_counts_and_highlights(): void
    {
        $response = $this->getJson('/api/v1/public/directory/overview');

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.counts.verified_providers', 1)
            ->assertJsonPath('data.counts.active_resources', 2)
            ->assertJsonPath('data.counts.active_locations', 1)
            ->assertJsonPath('data.counts.covered_cities', 1);
    }

    public function test_triple_gate_excludes_hidden_unverified_and_inactive_organizations(): void
    {
        $response = $this->getJson('/api/v1/public/providers');

        $response->assertStatus(200);
        $providerSlugs = collect($response->json('data.items'))->pluck('slug')->all();

        $this->assertContains('metro-outdoor-media', $providerSlugs);
        $this->assertNotContains('private-billboard-co', $providerSlugs);
        $this->assertNotContains('unverified-media-ltd', $providerSlugs);
        $this->assertNotContains('defunct-advertising', $providerSlugs);
    }

    public function test_triple_gate_excludes_inactive_locations_and_inactive_resources(): void
    {
        // Add a resource under the inactive location
        $resUnderInactiveLoc = AdvertisingResource::create([
            'organization_id' => $this->orgVisible->id,
            'location_id' => $this->locationInactive->id,
            'name' => 'Orphan Resource',
            'code' => 'ORPH-01',
            'resource_type' => ResourceType::HOARDING->value,
            'category' => ResourceCategory::STATIC->value,
            'status' => ResourceStatus::ACTIVE->value,
            'width' => 20.0,
            'height' => 10.0,
        ]);

        $response = $this->getJson('/api/v1/public/resources');

        $response->assertStatus(200);
        $resourceCodes = collect($response->json('data.items'))->pluck('code')->all();

        $this->assertContains('BC-UNI-01', $resourceCodes);
        $this->assertContains('BC-GAN-02', $resourceCodes);
        $this->assertNotContains('BC-OFF-03', $resourceCodes); // Inactive resource excluded
        $this->assertNotContains('ORPH-01', $resourceCodes);   // Resource under inactive location excluded
    }

    public function test_resource_search_and_faceted_filters(): void
    {
        // Filter by city
        $resCity = $this->getJson('/api/v1/public/resources?city=Vijayawada');
        $resCity->assertStatus(200)->assertJsonCount(2, 'data.items');

        $resOtherCity = $this->getJson('/api/v1/public/resources?city=Hyderabad');
        $resOtherCity->assertStatus(200)->assertJsonCount(0, 'data.items');

        // Filter by resource type
        $resType = $this->getJson('/api/v1/public/resources?type=UNIPOLE');
        $resType->assertStatus(200)
            ->assertJsonCount(1, 'data.items')
            ->assertJsonPath('data.items.0.code', 'BC-UNI-01');

        // Filter by illumination
        $resIllum = $this->getJson('/api/v1/public/resources?illumination=FRONT_LIT');
        $resIllum->assertStatus(200)
            ->assertJsonCount(1, 'data.items')
            ->assertJsonPath('data.items.0.code', 'BC-UNI-01');

        // Filter by area range (800 sqft vs 900 sqft)
        $resArea = $this->getJson('/api/v1/public/resources?min_area=850');
        $resArea->assertStatus(200)
            ->assertJsonCount(1, 'data.items')
            ->assertJsonPath('data.items.0.code', 'BC-GAN-02'); // 60 * 15 = 900 sqft
    }

    public function test_slug_resolution_and_uuid_fallback(): void
    {
        $slug = $this->resourcePublic->slug;
        $uuid = $this->resourcePublic->uuid;

        // Resolve by slug
        $respSlug = $this->getJson("/api/v1/public/resources/{$slug}");
        $respSlug->assertStatus(200)
            ->assertJsonPath('data.uuid', $uuid)
            ->assertJsonPath('data.slug', $slug);

        // Resolve by UUID fallback
        $respUuid = $this->getJson("/api/v1/public/resources/{$uuid}");
        $respUuid->assertStatus(200)
            ->assertJsonPath('data.uuid', $uuid)
            ->assertJsonPath('data.slug', $slug);
    }

    public function test_resource_slug_is_immutable_on_update(): void
    {
        $initialSlug = $this->resourcePublic->slug;
        $this->assertNotEmpty($initialSlug);

        // Update resource name, code, and dimensions
        $this->resourcePublic->update([
            'name' => 'Renamed Super Unipole',
            'code' => 'NEW-CODE-999',
            'width' => 50.00,
        ]);

        $freshResource = $this->resourcePublic->fresh();
        $this->assertEquals('Renamed Super Unipole', $freshResource->name);
        $this->assertEquals('NEW-CODE-999', $freshResource->code);
        $this->assertEquals($initialSlug, $freshResource->slug, 'Resource slug must remain strictly immutable after creation.');
    }

    public function test_indicative_rate_card_and_price_on_request_formatting(): void
    {
        // 1. Resource with base_price_monthly configured
        $respWithPrice = $this->getJson("/api/v1/public/resources/{$this->resourcePublic->slug}");
        $respWithPrice->assertStatus(200)
            ->assertJsonPath('data.indicative_rate.display_label', 'Indicative Rate Card')
            ->assertJsonPath('data.indicative_rate.formatted', '₹85,000 / month')
            ->assertJsonPath('data.indicative_rate.disclaimer', 'Final quotation provided directly by the provider.');

        // 2. Resource without base_price_monthly configured
        $respNoPrice = $this->getJson("/api/v1/public/resources/{$this->resourceNoPrice->slug}");
        $respNoPrice->assertStatus(200)
            ->assertJsonPath('data.indicative_rate.display_label', 'Price on Request')
            ->assertJsonPath('data.indicative_rate.formatted', 'Price on Request')
            ->assertJsonPath('data.indicative_rate.disclaimer', 'Contact provider directly for rate and availability.');
    }

    public function test_public_business_contact_policy_and_private_data_exclusion(): void
    {
        $response = $this->getJson("/api/v1/public/providers/{$this->orgVisible->slug}");

        $response->assertStatus(200)
            // Public business data present
            ->assertJsonPath('data.name', 'Metro Outdoor Media')
            ->assertJsonPath('data.business_phone', '+91 98765 43210')
            ->assertJsonPath('data.business_email', 'business@metrooutdoor.test')
            ->assertJsonPath('data.website', 'https://metrooutdoor.test')
            ->assertJsonPath('data.business_address.city', 'Vijayawada')
            // Confidential data omitted
            ->assertJsonMissing(['id' => $this->orgVisible->id])
            ->assertJsonMissing(['organization_id' => $this->orgVisible->id])
            ->assertJsonMissing(['john.personal@example.com'])
            ->assertJsonMissing(['+91 91111 22222'])
            ->assertJsonMissing(['subscription_plan_id'])
            ->assertJsonMissing(['gstin'])
            ->assertJsonMissing(['pan']);
    }

    public function test_map_feed_returns_lightweight_coordinates_and_thumbnails(): void
    {
        $response = $this->getJson('/api/v1/public/resources/map');

        $response->assertStatus(200)
            ->assertJsonPath('success', true);

        $data = $response->json('data');
        $this->assertCount(2, $data);

        $pin = collect($data)->firstWhere('slug', $this->resourcePublic->slug);
        $this->assertNotNull($pin);
        $this->assertEquals(16.5033, $pin['latitude']);
        $this->assertEquals(80.6465, $pin['longitude']);
        $this->assertEquals('₹85,000/mo', $pin['indicative_rate']);
        $this->assertStringContainsString('test-thumb.webp', $pin['thumbnail_url']);
    }

    public function test_stage_9_media_urls_used_and_original_paths_never_exposed(): void
    {
        $response = $this->getJson("/api/v1/public/resources/{$this->resourcePublic->slug}");

        $response->assertStatus(200);
        $media = $response->json('data.media.0');

        $this->assertNotNull($media);
        $this->assertStringContainsString('test-display.webp', $media['display_url']);
        $this->assertStringContainsString('test-thumb.webp', $media['thumbnail_url']);
        $this->assertEquals('Benz Circle Unipole Day View', $media['alt_text']);

        // Never expose raw originals/ internal paths
        $rawJson = $response->getContent();
        $this->assertStringNotContainsString('test-original.webp', $rawJson);
        $this->assertStringNotContainsString('tenants/1/resources/originals', $rawJson);
    }
}
