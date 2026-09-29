<?php

namespace Database\Seeders;

use App\Enums\PlatformRole;
use App\Enums\UserStatus;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class SuperAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $email = env('SUPER_ADMIN_EMAIL', 'superadmin@sodaars.com');
        $password = env('SUPER_ADMIN_PASSWORD', 'Password123!');
        $name = env('SUPER_ADMIN_NAME', 'SODAARS Super Admin');

        User::updateOrCreate(
            ['email' => $email],
            [
                'uuid' => (string) Str::uuid(),
                'name' => $name,
                'phone' => '+919999999999',
                'password' => Hash::make($password),
                'platform_role' => PlatformRole::SUPER_ADMIN->value,
                'status' => UserStatus::ACTIVE->value,
                'email_verified_at' => now(),
            ]
        );
    }
}
