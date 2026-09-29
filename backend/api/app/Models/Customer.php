<?php

namespace App\Models;

use App\Enums\CustomerStatus;
use App\Enums\CustomerType;
use App\Models\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Customer extends Model
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
        'code',
        'customer_type',
        'company_name',
        'brand_name',
        'contact_person',
        'email',
        'phone',
        'alternate_phone',
        'website',
        'billing_address',
        'city',
        'state',
        'pincode',
        'country',
        'gstin',
        'pan_number',
        'credit_period_days',
        'status',
        'notes',
        'created_by_user_id',
    ];

    /**
     * Boot model.
     */
    protected static function booted(): void
    {
        static::creating(function ($customer) {
            if (empty($customer->uuid)) {
                $customer->uuid = (string) Str::uuid();
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
            'customer_type' => CustomerType::class,
            'status' => CustomerStatus::class,
            'credit_period_days' => 'integer',
        ];
    }

    /**
     * Check if the customer is blocked.
     */
    public function isBlocked(): bool
    {
        return $this->status === CustomerStatus::BLOCKED;
    }

    /**
     * Get the organization that owns this customer.
     */
    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    /**
     * Get the enquiries associated with this customer.
     */
    public function enquiries(): HasMany
    {
        return $this->hasMany(Enquiry::class);
    }

    /**
     * Get the user who created this customer.
     */
    public function createdByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by_user_id');
    }
}
