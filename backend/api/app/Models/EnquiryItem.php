<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class EnquiryItem extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'uuid',
        'enquiry_id',
        'advertising_resource_id',
        'location_id',
        'start_date',
        'end_date',
        'slots_count',
        'proposed_rate',
        'notes',
    ];

    /**
     * Boot model.
     */
    protected static function booted(): void
    {
        static::creating(function ($item) {
            if (empty($item->uuid)) {
                $item->uuid = (string) Str::uuid();
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
            'start_date' => 'date:Y-m-d',
            'end_date' => 'date:Y-m-d',
            'slots_count' => 'integer',
            'proposed_rate' => 'decimal:2',
        ];
    }

    /**
     * Get the parent enquiry.
     */
    public function enquiry(): BelongsTo
    {
        return $this->belongsTo(Enquiry::class);
    }

    /**
     * Get the specific advertising resource if requested.
     */
    public function advertisingResource(): BelongsTo
    {
        return $this->belongsTo(AdvertisingResource::class);
    }

    /**
     * Get the specific location if requested as a general location demand.
     */
    public function location(): BelongsTo
    {
        return $this->belongsTo(Location::class);
    }

    /**
     * Get effective start date falling back to parent enquiry.
     */
    public function getEffectiveStartDateAttribute(): ?string
    {
        return $this->start_date ?? $this->enquiry?->start_date;
    }

    /**
     * Get effective end date falling back to parent enquiry.
     */
    public function getEffectiveEndDateAttribute(): ?string
    {
        return $this->end_date ?? $this->enquiry?->end_date;
    }
}
