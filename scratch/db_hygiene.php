<?php

require __DIR__ . '/../backend/api/vendor/autoload.php';
$app = require_once __DIR__ . '/../backend/api/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Organization;
use App\Models\SubscriptionPlan;
use App\Models\User;
use App\Models\Subscription;
use App\Models\OrganizationUser;
use Illuminate\Support\Facades\DB;

$isDryRun = !in_array('--execute', $argv);

echo "=========================================================\n";
echo "SODAARS DATABASE HYGIENE AUDIT: " . ($isDryRun ? "DRY-RUN MODE (NO DATA MODIFIED)" : "EXECUTE MODE") . "\n";
echo "=========================================================\n\n";

// 1. Identify Test Verification Plans
// Canonical plans have slugs: 'starter', 'growth', 'professional', 'enterprise'
$canonicalSlugs = ['starter', 'growth', 'professional', 'enterprise'];
$testPlans = SubscriptionPlan::whereNotIn('slug', $canonicalSlugs)->get();

echo "1. SUBSCRIPTION PLANS:\n";
echo "   Canonical Plans (TO RETAIN):\n";
foreach (SubscriptionPlan::whereIn('slug', $canonicalSlugs)->get() as $p) {
    echo "     [RETAIN] ID: {$p->id} | Slug: {$p->slug} | Name: {$p->name} | Price: {$p->monthly_price}\n";
}

echo "   Temporary Verification Plans (IDENTIFIED FOR CLEANUP):\n";
if ($testPlans->isEmpty()) {
    echo "     (None found - already clean)\n";
} else {
    foreach ($testPlans as $p) {
        $subsCount = Subscription::where('subscription_plan_id', $p->id)->count();
        echo "     [PRUNE]  ID: {$p->id} | Slug: {$p->slug} | Name: {$p->name} | Subscriptions attached: {$subsCount}\n";
    }
}
echo "\n";

// 2. Identify Test Verification Organizations
// The test script explicitly generated organizations named "Apex Horizon Media <timestamp>" with slug "apex-horizon-media-<timestamp>"
// and owners matching "owner-<timestamp>@apexoutdoor.com".
$testOrgs = Organization::where('slug', 'like', 'apex-horizon-media-%')->get();

echo "2. ORGANIZATIONS:\n";
echo "   Authentic Demo Organizations (TO RETAIN):\n";
foreach (Organization::where('slug', 'not like', 'apex-horizon-media-%')->get() as $o) {
    $locCount = $o->locations()->count();
    $userCount = $o->users()->count();
    echo "     [RETAIN] ID: {$o->id} | Slug: {$o->slug} | Name: {$o->name} | Status: {$o->status} | Locs: {$locCount} | Users: {$userCount}\n";
}

echo "   Temporary Verification Organizations (IDENTIFIED FOR CLEANUP):\n";
if ($testOrgs->isEmpty()) {
    echo "     (None found - already clean)\n";
} else {
    foreach ($testOrgs as $o) {
        $subCount = Subscription::where('organization_id', $o->id)->count();
        $memCount = OrganizationUser::where('organization_id', $o->id)->count();
        echo "     [PRUNE]  ID: {$o->id} | Slug: {$o->slug} | Name: {$o->name} | Subscriptions: {$subCount} | Members: {$memCount}\n";
    }
}
echo "\n";

// 3. Identify Associated Test Owner Users
$testOwnerEmails = [];
foreach ($testOrgs as $o) {
    // Collect users linked to this test org who have the script-generated pattern
    $members = OrganizationUser::where('organization_id', $o->id)->with('user')->get();
    foreach ($members as $m) {
        if ($m->user && str_starts_with($m->user->email, 'owner-') && str_ends_with($m->user->email, '@apexoutdoor.com')) {
            $testOwnerEmails[] = $m->user->email;
        }
    }
}
$testOwnerUsers = User::whereIn('email', array_unique($testOwnerEmails))->get();

echo "3. PLATFORM & DEMO USERS:\n";
echo "   Authentic Platform & Demo Users (TO RETAIN):\n";
foreach (User::where('email', 'not like', 'owner-%@apexoutdoor.com')->get() as $u) {
    echo "     [RETAIN] ID: {$u->id} | Email: {$u->email} | Role: " . ($u->platform_role ?? 'PROVIDER') . " | Name: {$u->name}\n";
}

echo "   Temporary Test Owner Users (IDENTIFIED FOR CLEANUP):\n";
if ($testOwnerUsers->isEmpty()) {
    echo "     (None found - already clean)\n";
} else {
    foreach ($testOwnerUsers as $u) {
        echo "     [PRUNE]  ID: {$u->id} | Email: {$u->email} | Name: {$u->name}\n";
    }
}
echo "\n";

if ($isDryRun) {
    echo "---------------------------------------------------------\n";
    echo "DRY-RUN SUMMARY:\n";
    echo "  - Temporary Plans to remove: " . $testPlans->count() . "\n";
    echo "  - Temporary Organizations to remove: " . $testOrgs->count() . "\n";
    echo "  - Temporary Owner Users to remove: " . $testOwnerUsers->count() . "\n";
    echo "  - Authentic records to retain: UNTOUCHED\n";
    echo "\nTo execute this cleanup surgically, run with: --execute\n";
    echo "---------------------------------------------------------\n";
    exit(0);
}

// EXECUTE MODE
echo ">>> EXECUTING SURGICAL CLEANUP IN TRANSACTION...\n";

DB::transaction(function () use ($testOrgs, $testOwnerUsers, $testPlans) {
    // 1. Delete subscriptions and memberships attached to test organizations
    foreach ($testOrgs as $o) {
        Subscription::where('organization_id', $o->id)->delete();
        OrganizationUser::where('organization_id', $o->id)->delete();
        $o->forceDelete();
        echo "   Deleted test organization ID {$o->id} ({$o->slug})\n";
    }

    // 2. Delete test owner users
    foreach ($testOwnerUsers as $u) {
        // Also revoke any personal access tokens
        $u->tokens()->delete();
        $u->delete();
        echo "   Deleted test user ID {$u->id} ({$u->email})\n";
    }

    // 3. Delete any remaining subscriptions attached to test plans (if any)
    foreach ($testPlans as $p) {
        Subscription::where('subscription_plan_id', $p->id)->delete();
        $p->delete();
        echo "   Deleted test plan ID {$p->id} ({$p->slug})\n";
    }
});

echo "\n>>> SURGICAL CLEANUP COMPLETED SUCCESSFULLY!\n";
