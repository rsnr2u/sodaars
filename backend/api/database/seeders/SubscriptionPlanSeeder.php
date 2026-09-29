<?php

namespace Database\Seeders;

use App\Enums\PlanStatus;
use App\Models\SubscriptionPlan;
use Illuminate\Database\Seeder;

class SubscriptionPlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $plans = [
            [
                'name' => 'Starter',
                'slug' => 'starter',
                'description' => 'Ideal for emerging outdoor advertising owners managing up to 50 assets.',
                'min_resources' => 1,
                'max_resources' => 50,
                'monthly_price' => 2499.00,
                'annual_price' => 24990.00,
                'currency' => 'INR',
                'features' => [
                    'Up to 50 Advertising Resources',
                    'Full Resource & Location Management',
                    'Calendar & Availability Engine',
                    'Customer & Enquiry Tracking',
                    'Quotation & Booking Management',
                ],
                'status' => PlanStatus::ACTIVE->value,
                'sort_order' => 1,
            ],
            [
                'name' => 'Growth',
                'slug' => 'growth',
                'description' => 'Designed for growing media providers managing between 51 and 150 advertising assets.',
                'min_resources' => 51,
                'max_resources' => 150,
                'monthly_price' => 5999.00,
                'annual_price' => 59990.00,
                'currency' => 'INR',
                'features' => [
                    '51 to 150 Advertising Resources',
                    'All Starter Features',
                    'Campaign & Conflict Engine',
                    'Invoicing & Payment Logging',
                    'Multi-User Staff Permissions',
                ],
                'status' => PlanStatus::ACTIVE->value,
                'sort_order' => 2,
            ],
            [
                'name' => 'Professional',
                'slug' => 'professional',
                'description' => 'Comprehensive management solution for large media companies managing 151 to 250 assets.',
                'min_resources' => 151,
                'max_resources' => 250,
                'monthly_price' => 9999.00,
                'annual_price' => 99990.00,
                'currency' => 'INR',
                'features' => [
                    '151 to 250 Advertising Resources',
                    'All Growth Features',
                    'Advanced Availability & Utilization Analytics',
                    'Priority Support & System Customizations',
                    'Detailed Financial & Occupancy Reports',
                ],
                'status' => PlanStatus::ACTIVE->value,
                'sort_order' => 3,
            ],
            [
                'name' => 'Enterprise',
                'slug' => 'enterprise',
                'description' => 'Tailored enterprise infrastructure for networks with 251+ advertising resources.',
                'min_resources' => 251,
                'max_resources' => null, // Unlimited / Custom
                'monthly_price' => 0.00, // Custom pricing
                'annual_price' => null,
                'currency' => 'INR',
                'features' => [
                    '251+ Advertising Resources',
                    'All Professional Features',
                    'Dedicated Account Manager',
                    'Custom ERP & Third-party Integrations',
                    'Custom SLA & Unlimited Organization Users',
                ],
                'status' => PlanStatus::ACTIVE->value,
                'sort_order' => 4,
            ],
        ];

        foreach ($plans as $planData) {
            SubscriptionPlan::updateOrCreate(
                ['slug' => $planData['slug']],
                $planData
            );
        }
    }
}
