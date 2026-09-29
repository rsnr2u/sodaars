<?php
require __DIR__ . '/../backend/api/vendor/autoload.php';
$app = require_once __DIR__ . '/../backend/api/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Organization;
use App\Models\SubscriptionPlan;
use App\Models\User;

echo "=== CURRENT DATABASE STATE INSPECTION ===\n\n";

echo "Organizations (" . Organization::count() . "):\n";
foreach (Organization::all() as $org) {
    echo "  [ID: {$org->id}] {$org->name} | Slug: {$org->slug} | Status: {$org->status} | Verified: {$org->verification_status} | Visible: " . ($org->public_directory_visible ? 'YES' : 'NO') . "\n";
}

echo "\nSubscription Plans (" . SubscriptionPlan::count() . "):\n";
foreach (SubscriptionPlan::all() as $plan) {
    echo "  [ID: {$plan->id}] {$plan->name} | Slug: {$plan->slug} | Price: {$plan->monthly_price} | Status: {$plan->status}\n";
}

echo "\nPlatform Users:\n";
foreach (User::whereNotNull('platform_role')->get() as $u) {
    echo "  [ID: {$u->id}] {$u->email} ({$u->name}) => Role: {$u->platform_role}\n";
}
