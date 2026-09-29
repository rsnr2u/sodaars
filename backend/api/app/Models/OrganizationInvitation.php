<?php

namespace App\Models;

use App\Enums\InvitationStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class OrganizationInvitation extends Model
{
    use HasFactory;

    protected $fillable = [
        'uuid',
        'organization_id',
        'invited_by_user_id',
        'email',
        'name',
        'phone',
        'role',
        'token_hash',
        'status',
        'expires_at',
        'accepted_at',
        'revoked_at',
    ];

    protected function casts(): array
    {
        return [
            'expires_at' => 'datetime',
            'accepted_at' => 'datetime',
            'revoked_at' => 'datetime',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function ($invitation) {
            if (empty($invitation->uuid)) {
                $invitation->uuid = (string) Str::uuid();
            }
        });
    }

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function invitedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'invited_by_user_id');
    }

    public function isPending(): bool
    {
        return $this->status === InvitationStatus::PENDING->value;
    }

    public function isExpired(): bool
    {
        return $this->status === InvitationStatus::EXPIRED->value || $this->expires_at->isPast();
    }

    public function isAccepted(): bool
    {
        return $this->status === InvitationStatus::ACCEPTED->value;
    }

    public function isRevoked(): bool
    {
        return $this->status === InvitationStatus::REVOKED->value;
    }

    public function isValid(): bool
    {
        return $this->isPending() && ! $this->expires_at->isPast();
    }
}
