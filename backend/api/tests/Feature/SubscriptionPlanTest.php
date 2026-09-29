<?php

namespace Tests\Feature;

use App\Models\SubscriptionPlan;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SubscriptionPlanTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    /**
     * Test 1: Subscription plans are seeded correctly with limits and prices.
     */
    public function test_subscription_plans_are_seeded_with_correct_limits_and_pricing(): void
    {
        $starter = SubscriptionPlan::where('slug', 'starter')->first();
        $this->assertNotNull($starter);
        $this->assertEquals('Starter', $starter->name);
        $this->assertEquals(1, $starter->min_resources);
        $this->assertEquals(50, $starter->max_resources);
        $this->assertEquals(2499.00, (float) $starter->monthly_price);
        $this->assertEquals('INR', $starter->currency);

        $growth = SubscriptionPlan::where('slug', 'growth')->first();
        $this->assertNotNull($growth);
        $this->assertEquals('Growth', $growth->name);
        $this->assertEquals(51, $growth->min_resources);
        $this->assertEquals(150, $growth->max_resources);
        $this->assertEquals(5999.00, (float) $growth->monthly_price);

        $professional = SubscriptionPlan::where('slug', 'professional')->first();
        $this->assertNotNull($professional);
        $this->assertEquals('Professional', $professional->name);
        $this->assertEquals(151, $professional->min_resources);
        $this->assertEquals(250, $professional->max_resources);
        $this->assertEquals(9999.00, (float) $professional->monthly_price);

        $enterprise = SubscriptionPlan::where('slug', 'enterprise')->first();
        $this->assertNotNull($enterprise);
        $this->assertEquals('Enterprise', $enterprise->name);
        $this->assertEquals(251, $enterprise->min_resources);
        $this->assertNull($enterprise->max_resources); // Unlimited
    }

    /**
     * Test 2: Public users can retrieve active subscription plans via API.
     */
    public function test_public_users_can_retrieve_active_subscription_plans(): void
    {
        $response = $this->getJson('/api/v1/subscription-plans');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Subscription plans retrieved successfully.',
            ])
            ->assertJsonCount(4, 'data')
            ->assertJsonFragment(['slug' => 'starter', 'monthly_price' => 2499])
            ->assertJsonFragment(['slug' => 'growth', 'monthly_price' => 5999])
            ->assertJsonFragment(['slug' => 'professional', 'monthly_price' => 9999])
            ->assertJsonFragment(['slug' => 'enterprise']);
    }

    /**
     * Test: Public users can retrieve a single active plan by slug.
     */
    public function test_public_users_can_retrieve_plan_by_slug(): void
    {
        $response = $this->getJson('/api/v1/subscription-plans/starter');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'name' => 'Starter',
                    'slug' => 'starter',
                    'max_resources' => 50,
                    'monthly_price' => 2499,
                ],
            ]);
    }
}
