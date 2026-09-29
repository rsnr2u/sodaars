<?php

namespace App\Models;

use App\Enums\SubscriptionStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Subscription extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'organization_id',
        'subscription_plan_id',
        'status',
        'billing_cycle',
        'resource_limit',
        'price',
        'currency',
        'starts_at',
        'ends_at',
        'trial_ends_at',
        'cancelled_at',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'resource_limit' => 'integer',
            'price' => 'decimal:2',
            'starts_at' => 'datetime',
            'ends_at' => 'datetime',
            'trial_ends_at' => 'datetime',
            'cancelled_at' => 'datetime',
        ];
    }

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function subscriptionPlan(): BelongsTo
    {
        return $this->belongsTo(SubscriptionPlan::class);
    }

    public function plan(): BelongsTo
    {
        return $this->subscriptionPlan();
    }

    public function isActive(): bool
    {
        return in_array($this->status, [
            SubscriptionStatus::ACTIVE->value,
            SubscriptionStatus::TRIAL->value,
        ]);
    }
}
