<?php

namespace App\Models;

use App\Enums\DimensionUnit;
use App\Enums\IlluminationType;
use App\Enums\ResourceCategory;
use App\Enums\ResourceStatus;
use App\Enums\ResourceType;
use App\Models\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class AdvertisingResource extends Model
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
        'location_id',
        'name',
        'code',
        'slug',
        'resource_type',
        'category',
        'face_number',
        'face_label',
        'direction',
        'traffic_flow',
        'width',
        'height',
        'dimension_unit',
        'illumination_type',
        'operating_hours_from',
        'operating_hours_to',
        'resolution',
        'pixel_pitch',
        'slot_duration_seconds',
        'total_slots',
        'daily_impressions_estimate',
        'base_price_monthly',
        'currency',
        'status',
        'description',
        'installation_details',
        'notes',
        'created_by_user_id',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var list<string>
     */
    protected $appends = [
        'area',
    ];

    /**
     * Boot model.
     */
    protected static function booted(): void
    {
        static::creating(function ($resource) {
            if (empty($resource->uuid)) {
                $resource->uuid = (string) Str::uuid();
            }
            if (empty($resource->slug)) {
                $resource->slug = static::generateUniqueSlug($resource);
            }
        });
        // NOTE: Deliberately omitted from static::updating() to enforce slug immutability!
    }

    /**
     * Generate collision-safe unique slug for advertising resource.
     */
    public static function generateUniqueSlug(self $resource): string
    {
        $city = 'location';
        if ($resource->relationLoaded('location') && $resource->location) {
            $city = $resource->location->city ?: 'location';
        } elseif (! empty($resource->location_id)) {
            $city = \Illuminate\Support\Facades\DB::table('locations')
                ->where('id', $resource->location_id)
                ->value('city') ?: 'location';
        }

        $type = $resource->resource_type instanceof \BackedEnum
            ? strtolower($resource->resource_type->value)
            : strtolower((string) ($resource->resource_type ?? 'resource'));

        $code = strtolower((string) ($resource->code ?? Str::random(6)));

        $baseSlug = Str::slug("{$city}-{$type}-{$code}");
        $slug = $baseSlug;
        $counter = 1;

        while (static::withoutGlobalScopes()->where('slug', $slug)->where('id', '!=', $resource->id ?? 0)->exists()) {
            $counter++;
            $slug = "{$baseSlug}-{$counter}";
        }

        return $slug;
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'resource_type' => ResourceType::class,
            'category' => ResourceCategory::class,
            'dimension_unit' => DimensionUnit::class,
            'illumination_type' => IlluminationType::class,
            'status' => ResourceStatus::class,
            'width' => 'decimal:2',
            'height' => 'decimal:2',
            'face_number' => 'integer',
            'slot_duration_seconds' => 'integer',
            'total_slots' => 'integer',
            'daily_impressions_estimate' => 'integer',
            'base_price_monthly' => 'decimal:2',
        ];
    }

    /**
     * Dynamically compute the surface area from width and height.
     */
    public function getAreaAttribute(): float
    {
        return round((float) $this->width * (float) $this->height, 2);
    }

    /**
     * Get authoritative total slot capacity for availability calculations.
     */
    public function getTotalSlots(): int
    {
        if ($this->category === ResourceCategory::DIGITAL) {
            return (int) ($this->total_slots ?: 10);
        }

        return 1;
    }

    /**
     * The location hosting this advertising resource face.
     */
    public function location(): BelongsTo
    {
        return $this->belongsTo(Location::class);
    }

    /**
     * The user who created this resource record.
     */
    public function createdByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by_user_id');
    }

    /**
     * Media assets attached to this advertising resource.
     */
    public function media(): HasMany
    {
        return $this->hasMany(AdvertisingResourceMedia::class)->orderBy('sort_order');
    }

    /**
     * Primary cover photo for this advertising resource.
     */
    public function primaryMedia(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(AdvertisingResourceMedia::class)->where('is_primary', true);
    }

    /**
     * Schedules and calendar reservations attached to this advertising resource.
     */
    public function schedules(): HasMany
    {
        return $this->hasMany(ResourceSchedule::class);
    }

    /**
     * Get enquiry items requesting this advertising resource.
     */
    public function enquiryItems(): HasMany
    {
        return $this->hasMany(EnquiryItem::class);
    }

    /**
     * Public directory leads generated for this resource.
     */
    public function leads(): HasMany
    {
        return $this->hasMany(DirectoryLead::class);
    }
}
