<?php

namespace App\Models;

use App\Enums\ScheduleBlockType;
use App\Enums\ScheduleStatus;
use App\Models\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class ResourceSchedule extends Model
{
    use BelongsToTenant, HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'uuid',
        'organization_id',
        'advertising_resource_id',
        'title',
        'block_type',
        'status',
        'start_date',
        'end_date',
        'slots_count',
        'hold_expires_at',
        'released_at',
        'reference_type',
        'reference_id',
        'notes',
        'created_by_user_id',
    ];

    /**
     * Boot model.
     */
    protected static function booted(): void
    {
        static::creating(function ($schedule) {
            if (empty($schedule->uuid)) {
                $schedule->uuid = (string) Str::uuid();
            }
        });
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'block_type' => ScheduleBlockType::class,
            'status' => ScheduleStatus::class,
            'start_date' => 'date:Y-m-d',
            'end_date' => 'date:Y-m-d',
            'hold_expires_at' => 'datetime',
            'released_at' => 'datetime',
            'slots_count' => 'integer',
        ];
    }

    /**
     * Scope query to schedules that actively consume inventory.
     * 1. Confirmed bookings/blocks.
     * 2. Tentative holds whose expiry is in the future.
     */
    public function scopeActiveInventory(Builder $query): Builder
    {
        return $query->where(function (Builder $q) {
            $q->where('status', ScheduleStatus::CONFIRMED->value)
                ->orWhere(function (Builder $sub) {
                    $sub->where('status', ScheduleStatus::TENTATIVE->value)
                        ->where('hold_expires_at', '>', now());
                });
        });
    }

    /**
     * Scope query to schedules overlapping the given inclusive date range.
     * Overlap condition: start_date <= range_end AND end_date >= range_start.
     */
    public function scopeOverlapping(Builder $query, string $startDate, string $endDate): Builder
    {
        return $query->where('start_date', '<=', $endDate)
            ->where('end_date', '>=', $startDate);
    }

    /**
     * The advertising resource face this schedule belongs to.
     */
    public function advertisingResource(): BelongsTo
    {
        return $this->belongsTo(AdvertisingResource::class);
    }

    /**
     * The user who created this schedule block.
     */
    public function createdByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by_user_id');
    }
}
