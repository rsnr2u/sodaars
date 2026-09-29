<?php
require __DIR__ . '/../backend/api/vendor/autoload.php';
$app = require_once __DIR__ . '/../backend/api/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;

$users = User::whereNotNull('platform_role')->get();
foreach ($users as $u) {
    echo "{$u->id} | {$u->email} | {$u->name} | {$u->platform_role}\n";
}
