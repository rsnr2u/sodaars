<?php

namespace App\Models;

use App\Enums\SubscriptionStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Organization extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'uuid',
        'name',
        'slug',
        'contact_person',
        'email',
        'phone',
        'address',
        'city',
        'district',
        'state',
        'pincode',
        'country',
        'website',
        'business_description',
        'gstin',
        'pan',
        'logo_url',
        'registration_source',
        'status',
        'verification_status',
        'verified_at',
        'public_directory_visible',
        'created_by_user_id',
        'settings',
    ];

    protected function casts(): array
    {
        return [
            'settings' => 'array',
            'verified_at' => 'datetime',
            'public_directory_visible' => 'boolean',
        ];
    }

    public static function generateUniqueSlug(string $name, ?int $ignoreId = null): string
    {
        $baseSlug = Str::slug($name) ?: 'organization';
        $slug = $baseSlug;
        $counter = 1;

        while (static::where('slug', $slug)->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))->exists()) {
            $counter++;
            $slug = "{$baseSlug}-{$counter}";
        }

        return $slug;
    }

    protected static function booted(): void
    {
        static::creating(function ($organization) {
            if (empty($organization->uuid)) {
                $organization->uuid = (string) Str::uuid();
            }
            if (empty($organization->slug)) {
                $organization->slug = static::generateUniqueSlug($organization->name);
            } else {
                $organization->slug = static::generateUniqueSlug($organization->slug);
            }
        });
    }

    /**
     * Memberships in this organization.
     */
    public function organizationUsers(): HasMany
    {
        return $this->hasMany(OrganizationUser::class);
    }

    /**
     * Users belonging to this organization.
     */
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'organization_users')
            ->withPivot(['id', 'role', 'status', 'is_default', 'joined_at'])
            ->withTimestamps();
    }

    /**
     * Subscriptions for this organization.
     */
    public function subscriptions(): HasMany
    {
        return $this->hasMany(Subscription::class);
    }

    /**
     * Current active subscription.
     */
    public function activeSubscription(): HasOne
    {
        return $this->hasOne(Subscription::class)
            ->whereIn('status', [SubscriptionStatus::ACTIVE->value, SubscriptionStatus::TRIAL->value])
            ->latestOfMany();
    }

    /**
     * The platform user who created this organization (if any).
     */
    public function createdByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by_user_id');
    }

    /**
     * Staff invitations for this organization.
     */
    public function invitations(): HasMany
    {
        return $this->hasMany(OrganizationInvitation::class);
    }

    /**
     * Physical advertising locations owned by this organization.
     */
    public function locations(): HasMany
    {
        return $this->hasMany(Location::class);
    }

    /**
     * Advertising resources owned by this organization.
     */
    public function advertisingResources(): HasMany
    {
        return $this->hasMany(AdvertisingResource::class);
    }

    /**
     * Customers registered under this organization.
     */
    public function customers(): HasMany
    {
        return $this->hasMany(Customer::class);
    }

    /**
     * Enquiries logged under this organization.
     */
    public function enquiries(): HasMany
    {
        return $this->hasMany(Enquiry::class);
    }

    /**
     * Public directory leads received by this organization.
     */
    public function leads(): HasMany
    {
        return $this->hasMany(DirectoryLead::class);
    }

    /**
     * Scope query to publicly visible, verified, and active organizations.
     */
    public function scopePubliclyVisible($query)
    {
        return $query->where('status', 'ACTIVE')
            ->where('verification_status', 'VERIFIED')
            ->where('public_directory_visible', true);
    }
}
