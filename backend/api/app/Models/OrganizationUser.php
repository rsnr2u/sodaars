<?php

namespace App\Models;

use App\Enums\ProviderRole;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrganizationUser extends Model
{
    use HasFactory;

    protected $table = 'organization_users';

    protected $fillable = [
        'organization_id',
        'user_id',
        'role',
        'status',
        'is_default',
        'joined_at',
    ];

    protected function casts(): array
    {
        return [
            'is_default' => 'boolean',
            'joined_at' => 'datetime',
        ];
    }

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function isOwner(): bool
    {
        return $this->role === ProviderRole::PROVIDER_OWNER->value;
    }

    public function isManager(): bool
    {
        return $this->role === ProviderRole::PROVIDER_MANAGER->value;
    }

    public function isStaff(): bool
    {
        return $this->role === ProviderRole::PROVIDER_STAFF->value;
    }
}
