<?php

namespace App\Models;

use App\Enums\EnquiryPriority;
use App\Enums\EnquirySource;
use App\Enums\EnquiryStatus;
use App\Models\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Enquiry extends Model
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
        'enquiry_number',
        'customer_id',
        'campaign_title',
        'status',
        'priority',
        'source',
        'start_date',
        'end_date',
        'estimated_budget',
        'currency',
        'assigned_to_user_id',
        'lost_reason',
        'requirements',
        'internal_notes',
        'created_by_user_id',
    ];

    /**
     * Boot model.
     */
    protected static function booted(): void
    {
        static::creating(function ($enquiry) {
            if (empty($enquiry->uuid)) {
                $enquiry->uuid = (string) Str::uuid();
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
            'status' => EnquiryStatus::class,
            'priority' => EnquiryPriority::class,
            'source' => EnquirySource::class,
            'start_date' => 'date:Y-m-d',
            'end_date' => 'date:Y-m-d',
            'estimated_budget' => 'decimal:2',
        ];
    }

    /**
     * Get the organization that owns this enquiry.
     */
    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    /**
     * Get the customer associated with this enquiry.
     */
    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    /**
     * Get the items requested in this enquiry.
     */
    public function items(): HasMany
    {
        return $this->hasMany(EnquiryItem::class);
    }

    /**
     * Get the staff user assigned to this enquiry.
     */
    public function assignedToUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to_user_id');
    }

    /**
     * Get the user who created this enquiry.
     */
    public function createdByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by_user_id');
    }

    /**
     * Get the resource schedules (tentative holds, bookings) referencing this enquiry.
     */
    public function schedules(): HasMany
    {
        return $this->hasMany(ResourceSchedule::class, 'reference_id')
            ->where('reference_type', 'ENQUIRY');
    }
}
