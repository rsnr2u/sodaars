<?php
require __DIR__ . '/../backend/api/vendor/autoload.php';
$app = require_once __DIR__ . '/../backend/api/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Hash;

$u = User::where('email', 'provider@metrooutdoor.com')->first();
echo "User: " . ($u ? $u->email : 'NOT FOUND') . "\n";
if ($u) {
    echo "Check password123: " . (Hash::check('password123', $u->password) ? 'YES' : 'NO') . "\n";
    echo "Check Password@123: " . (Hash::check('Password@123', $u->password) ? 'YES' : 'NO') . "\n";
    echo "Check Password123!: " . (Hash::check('Password123!', $u->password) ? 'YES' : 'NO') . "\n";
}
