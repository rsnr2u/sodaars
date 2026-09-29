<?php

namespace Tests\Feature;

use App\Enums\CustomerStatus;
use App\Enums\CustomerType;
use App\Enums\EnquiryStatus;
use App\Enums\MembershipStatus;
use App\Enums\ProviderRole;
use App\Enums\SubscriptionStatus;
use App\Models\Customer;
use App\Models\Enquiry;
use App\Models\Organization;
use App\Models\OrganizationUser;
use App\Models\Subscription;
use App\Models\SubscriptionPlan;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class CustomerTest extends TestCase
{
    use RefreshDatabase;

    protected Organization $orgA;
    protected Organization $orgB;

    protected User $ownerA;
    protected User $managerA;
    protected User $staffA;

    protected User $ownerB;

    protected SubscriptionPlan $starterPlan;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();

        $this->starterPlan = SubscriptionPlan::where('slug', 'starter')->firstOrFail();

        // 1. Setup Organization A
        $this->orgA = Organization::create([
            'name' => 'Alpha Media Network',
            'slug' => 'alpha-media-network',
            'email' => 'contact@alphamedia.test',
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
            'name' => 'Owner Alpha',
            'email' => 'owner@alphamedia.test',
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
            'name' => 'Manager Alpha',
            'email' => 'manager@alphamedia.test',
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
            'name' => 'Staff Alpha',
            'email' => 'staff@alphamedia.test',
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

        // 2. Setup Organization B
        $this->orgB = Organization::create([
            'name' => 'Beta Outdoor Ads',
            'slug' => 'beta-outdoor-ads',
            'email' => 'contact@betaoutdoor.test',
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
            'name' => 'Owner Beta',
            'email' => 'owner@betaoutdoor.test',
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
    }

    public function test_owner_can_create_customer(): void
    {
        Sanctum::actingAs($this->ownerA, ['*']);

        $response = $this->postJson('/api/v1/tenant/customers', [
            'company_name' => 'Tata Motors Ltd',
            'customer_type' => CustomerType::DIRECT_ADVERTISER->value,
            'contact_person' => 'Rajesh Sharma',
            'phone' => '+91 98765 43210',
            'email' => 'rajesh.sharma@tatamotors.test',
            'city' => 'Mumbai',
            'state' => 'Maharashtra',
            'credit_period_days' => 45,
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.company_name', 'Tata Motors Ltd')
            ->assertJsonPath('data.credit_period_days', 45);

        $this->assertDatabaseHas('customers', [
            'organization_id' => $this->orgA->id,
            'company_name' => 'Tata Motors Ltd',
            'code' => 'CUST-0001',
        ]);
    }

    public function test_manager_can_create_customer(): void
    {
        Sanctum::actingAs($this->managerA, ['*']);

        $response = $this->postJson('/api/v1/tenant/customers', [
            'company_name' => 'Madison Media Agency',
            'customer_type' => CustomerType::AGENCY->value,
            'contact_person' => 'Priya Nair',
            'phone' => '+91 98765 11111',
            'email' => 'priya@madison.test',
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.company_name', 'Madison Media Agency');
    }

    public function test_staff_can_create_customer(): void
    {
        Sanctum::actingAs($this->staffA, ['*']);

        $response = $this->postJson('/api/v1/tenant/customers', [
            'company_name' => 'Local Jewellery Boutique',
            'customer_type' => CustomerType::BRAND->value,
            'contact_person' => 'Vikram Seth',
            'phone' => '+91 98765 22222',
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.company_name', 'Local Jewellery Boutique');
    }

    public function test_owner_can_view_customer(): void
    {
        $customer = Customer::create([
            'organization_id' => $this->orgA->id,
            'code' => 'CUST-0001',
            'customer_type' => CustomerType::DIRECT_ADVERTISER->value,
            'company_name' => 'Samsung India',
            'contact_person' => 'Amit Verma',
            'phone' => '+91 98765 33333',
        ]);

        Sanctum::actingAs($this->ownerA, ['*']);

        $response = $this->getJson("/api/v1/tenant/customers/{$customer->uuid}");

        $response->assertOk()
            ->assertJsonPath('data.company_name', 'Samsung India')
            ->assertJsonPath('data.code', 'CUST-0001');
    }

    public function test_staff_can_view_customer(): void
    {
        $customer = Customer::create([
            'organization_id' => $this->orgA->id,
            'code' => 'CUST-0001',
            'customer_type' => CustomerType::DIRECT_ADVERTISER->value,
            'company_name' => 'Samsung India',
            'contact_person' => 'Amit Verma',
            'phone' => '+91 98765 33333',
        ]);

        Sanctum::actingAs($this->staffA, ['*']);

        $response = $this->getJson("/api/v1/tenant/customers/{$customer->uuid}");

        $response->assertOk()
            ->assertJsonPath('data.company_name', 'Samsung India');
    }

    public function test_staff_can_update_customer(): void
    {
        $customer = Customer::create([
            'organization_id' => $this->orgA->id,
            'code' => 'CUST-0001',
            'customer_type' => CustomerType::DIRECT_ADVERTISER->value,
            'company_name' => 'Samsung India',
            'contact_person' => 'Amit Verma',
            'phone' => '+91 98765 33333',
        ]);

        Sanctum::actingAs($this->staffA, ['*']);

        $response = $this->putJson("/api/v1/tenant/customers/{$customer->uuid}", [
            'contact_person' => 'Amit Verma Updated',
            'city' => 'Bengaluru',
        ]);

        $response->assertOk()
            ->assertJsonPath('data.contact_person', 'Amit Verma Updated')
            ->assertJsonPath('data.city', 'Bengaluru');
    }

    public function test_staff_cannot_delete_customer(): void
    {
        $customer = Customer::create([
            'organization_id' => $this->orgA->id,
            'code' => 'CUST-0001',
            'customer_type' => CustomerType::DIRECT_ADVERTISER->value,
            'company_name' => 'Samsung India',
            'contact_person' => 'Amit Verma',
            'phone' => '+91 98765 33333',
        ]);

        Sanctum::actingAs($this->staffA, ['*']);

        $response = $this->deleteJson("/api/v1/tenant/customers/{$customer->uuid}");

        $response->assertStatus(403);
        $this->assertDatabaseHas('customers', ['id' => $customer->id, 'deleted_at' => null]);
    }

    public function test_manager_can_delete_customer(): void
    {
        $customer = Customer::create([
            'organization_id' => $this->orgA->id,
            'code' => 'CUST-0001',
            'customer_type' => CustomerType::DIRECT_ADVERTISER->value,
            'company_name' => 'Samsung India',
            'contact_person' => 'Amit Verma',
            'phone' => '+91 98765 33333',
        ]);

        Sanctum::actingAs($this->managerA, ['*']);

        $response = $this->deleteJson("/api/v1/tenant/customers/{$customer->uuid}");

        $response->assertOk();
        $this->assertSoftDeleted('customers', ['id' => $customer->id]);
    }

    public function test_owner_can_delete_customer(): void
    {
        $customer = Customer::create([
            'organization_id' => $this->orgA->id,
            'code' => 'CUST-0001',
            'customer_type' => CustomerType::DIRECT_ADVERTISER->value,
            'company_name' => 'Samsung India',
            'contact_person' => 'Amit Verma',
            'phone' => '+91 98765 33333',
        ]);

        Sanctum::actingAs($this->ownerA, ['*']);

        $response = $this->deleteJson("/api/v1/tenant/customers/{$customer->uuid}");

        $response->assertOk();
        $this->assertSoftDeleted('customers', ['id' => $customer->id]);
    }

    public function test_authorized_user_can_list_customers_with_filters(): void
    {
        Customer::create([
            'organization_id' => $this->orgA->id,
            'code' => 'CUST-0001',
            'customer_type' => CustomerType::DIRECT_ADVERTISER->value,
            'company_name' => 'Company One',
            'contact_person' => 'Contact 1',
            'phone' => '+91 99999 11111',
            'status' => CustomerStatus::ACTIVE->value,
        ]);

        Customer::create([
            'organization_id' => $this->orgA->id,
            'code' => 'CUST-0002',
            'customer_type' => CustomerType::AGENCY->value,
            'company_name' => 'Agency Two',
            'contact_person' => 'Contact 2',
            'phone' => '+91 99999 22222',
            'status' => CustomerStatus::INACTIVE->value,
        ]);

        Sanctum::actingAs($this->staffA, ['*']);

        // Filter by customer_type
        $response = $this->getJson('/api/v1/tenant/customers?customer_type=' . CustomerType::AGENCY->value);
        $response->assertOk()
            ->assertJsonCount(1, 'data.items')
            ->assertJsonPath('data.items.0.code', 'CUST-0002');

        // Filter by status
        $response = $this->getJson('/api/v1/tenant/customers?status=' . CustomerStatus::ACTIVE->value);
        $response->assertOk()
            ->assertJsonCount(1, 'data.items')
            ->assertJsonPath('data.items.0.code', 'CUST-0001');
    }

    public function test_search_works_across_company_name_contact_code(): void
    {
        Customer::create([
            'organization_id' => $this->orgA->id,
            'code' => 'CUST-0001',
            'customer_type' => CustomerType::DIRECT_ADVERTISER->value,
            'company_name' => 'Reliance Retail',
            'contact_person' => 'Mukesh A',
            'phone' => '+91 99999 12345',
        ]);

        Customer::create([
            'organization_id' => $this->orgA->id,
            'code' => 'CUST-0002',
            'customer_type' => CustomerType::DIRECT_ADVERTISER->value,
            'company_name' => 'Hero MotoCorp',
            'contact_person' => 'Pawan M',
            'phone' => '+91 99999 54321',
        ]);

        Sanctum::actingAs($this->ownerA, ['*']);

        $response = $this->getJson('/api/v1/tenant/customers?search=Reliance');
        $response->assertOk()
            ->assertJsonCount(1, 'data.items')
            ->assertJsonPath('data.items.0.company_name', 'Reliance Retail');

        $response = $this->getJson('/api/v1/tenant/customers?search=Pawan');
        $response->assertOk()
            ->assertJsonCount(1, 'data.items')
            ->assertJsonPath('data.items.0.company_name', 'Hero MotoCorp');
    }

    public function test_customer_code_is_unique_within_organization(): void
    {
        Customer::create([
            'organization_id' => $this->orgA->id,
            'code' => 'CUST-UNIQUE',
            'customer_type' => CustomerType::DIRECT_ADVERTISER->value,
            'company_name' => 'Original Customer',
            'contact_person' => 'Person A',
            'phone' => '+91 98765 00000',
        ]);

        Sanctum::actingAs($this->ownerA, ['*']);

        $response = $this->postJson('/api/v1/tenant/customers', [
            'code' => 'CUST-UNIQUE',
            'customer_type' => CustomerType::DIRECT_ADVERTISER->value,
            'company_name' => 'Duplicate Customer',
            'contact_person' => 'Person B',
            'phone' => '+91 98765 99999',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['code']);
    }

    public function test_same_customer_code_can_exist_in_different_organizations(): void
    {
        Customer::create([
            'organization_id' => $this->orgA->id,
            'code' => 'CUST-SHARED',
            'customer_type' => CustomerType::DIRECT_ADVERTISER->value,
            'company_name' => 'Org A Customer',
            'contact_person' => 'Person A',
            'phone' => '+91 98765 00000',
        ]);

        Sanctum::actingAs($this->ownerB, ['*']);

        $response = $this->postJson('/api/v1/tenant/customers', [
            'code' => 'CUST-SHARED',
            'customer_type' => CustomerType::DIRECT_ADVERTISER->value,
            'company_name' => 'Org B Customer',
            'contact_person' => 'Person B',
            'phone' => '+91 98765 99999',
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.code', 'CUST-SHARED');
    }

    public function test_tenant_a_cannot_view_or_update_tenant_b_customer(): void
    {
        $customerB = Customer::create([
            'organization_id' => $this->orgB->id,
            'code' => 'CUST-B01',
            'customer_type' => CustomerType::DIRECT_ADVERTISER->value,
            'company_name' => 'Secret Customer Beta',
            'contact_person' => 'Agent B',
            'phone' => '+91 98765 88888',
        ]);

        Sanctum::actingAs($this->ownerA, ['*']);

        // View attempt
        $response = $this->getJson("/api/v1/tenant/customers/{$customerB->uuid}");
        $response->assertStatus(404);

        // Update attempt
        $response = $this->putJson("/api/v1/tenant/customers/{$customerB->uuid}", [
            'company_name' => 'Hacked Name',
        ]);
        $response->assertStatus(404);

        // Delete attempt
        $response = $this->deleteJson("/api/v1/tenant/customers/{$customerB->uuid}");
        $response->assertStatus(404);
    }

    public function test_cannot_delete_customer_with_active_enquiries(): void
    {
        $customer = Customer::create([
            'organization_id' => $this->orgA->id,
            'code' => 'CUST-0001',
            'customer_type' => CustomerType::DIRECT_ADVERTISER->value,
            'company_name' => 'Client With Enquiries',
            'contact_person' => 'Contact Person',
            'phone' => '+91 98765 77777',
        ]);

        Enquiry::create([
            'organization_id' => $this->orgA->id,
            'enquiry_number' => 'ENQ-2026-0001',
            'customer_id' => $customer->id,
            'campaign_title' => 'Live Active Campaign Enquiry',
            'status' => EnquiryStatus::UNDER_REVIEW->value,
        ]);

        Sanctum::actingAs($this->ownerA, ['*']);

        $response = $this->deleteJson("/api/v1/tenant/customers/{$customer->uuid}");

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['customer']);

        $this->assertDatabaseHas('customers', ['id' => $customer->id, 'deleted_at' => null]);
    }

    public function test_blocked_customer_status_preserves_historical_visibility(): void
    {
        $customer = Customer::create([
            'organization_id' => $this->orgA->id,
            'code' => 'CUST-0001',
            'customer_type' => CustomerType::DIRECT_ADVERTISER->value,
            'company_name' => 'Defaulted Debtor Ltd',
            'contact_person' => 'Defaulting Contact',
            'phone' => '+91 98765 66666',
            'status' => CustomerStatus::BLOCKED->value,
        ]);

        Sanctum::actingAs($this->staffA, ['*']);

        // Historical view must be preserved
        $response = $this->getJson("/api/v1/tenant/customers/{$customer->uuid}");
        $response->assertOk()
            ->assertJsonPath('data.status', CustomerStatus::BLOCKED->value);

        // List must include it
        $response = $this->getJson('/api/v1/tenant/customers?status=' . CustomerStatus::BLOCKED->value);
        $response->assertOk()
            ->assertJsonCount(1, 'data.items');
    }
}
