<?php
require __DIR__ . '/../backend/api/vendor/autoload.php';
$app = require_once __DIR__ . '/../backend/api/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;
use App\Enums\PlatformRole;
use App\Enums\UserStatus;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

User::updateOrCreate(
    ['email' => 'admin@sodaars.com'],
    [
        'uuid' => (string) Str::uuid(),
        'name' => 'SODAARS Platform Admin',
        'phone' => '+919888888888',
        'password' => Hash::make('Password123!'),
        'platform_role' => PlatformRole::ADMIN->value,
        'status' => UserStatus::ACTIVE->value,
        'email_verified_at' => now(),
    ]
);

User::updateOrCreate(
    ['email' => 'staff@sodaars.com'],
    [
        'uuid' => (string) Str::uuid(),
        'name' => 'SODAARS Platform Staff',
        'phone' => '+919777777777',
        'password' => Hash::make('Password123!'),
        'platform_role' => PlatformRole::STAFF->value,
        'status' => UserStatus::ACTIVE->value,
        'email_verified_at' => now(),
    ]
);

echo "Platform Admin and Staff test accounts configured.\n";
