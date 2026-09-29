<?php

namespace App\Models;

use App\Enums\LocationStatus;
use App\Models\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Location extends Model
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
        'name',
        'code',
        'address',
        'area',
        'locality',
        'city',
        'district',
        'state',
        'pincode',
        'country',
        'landmark',
        'latitude',
        'longitude',
        'description',
        'status',
        'notes',
        'created_by_user_id',
    ];

    /**
     * Boot model.
     */
    protected static function booted(): void
    {
        static::creating(function ($location) {
            if (empty($location->uuid)) {
                $location->uuid = (string) Str::uuid();
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
            'status' => LocationStatus::class,
            'latitude' => 'decimal:7',
            'longitude' => 'decimal:7',
        ];
    }

    /**
     * The user who created this location record.
     */
    public function createdByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by_user_id');
    }

    /**
     * Media assets attached to this location.
     */
    public function media(): HasMany
    {
        return $this->hasMany(LocationMedia::class)->orderBy('sort_order');
    }

    /**
     * Advertising resource faces hosted at this location.
     */
    public function advertisingResources(): HasMany
    {
        return $this->hasMany(AdvertisingResource::class);
    }

    /**
     * General location demand items in enquiries.
     */
    public function enquiryItems(): HasMany
    {
        return $this->hasMany(EnquiryItem::class);
    }

    /**
     * Primary cover photo for this location.
     */
    public function primaryMedia(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(LocationMedia::class)->where('is_primary', true);
    }
}
