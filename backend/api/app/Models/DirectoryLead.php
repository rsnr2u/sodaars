<?php

namespace App\Models;

use App\Enums\LeadStatus;
use App\Models\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class DirectoryLead extends Model
{
    use BelongsToTenant, HasFactory, SoftDeletes;

    protected $table = 'directory_leads';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'uuid',
        'organization_id',
        'advertising_resource_id',
        'location_id',
        'resource_name_snapshot',
        'resource_code_snapshot',
        'resource_uuid_snapshot',
        'location_name_snapshot',
        'location_area_snapshot',
        'location_uuid_snapshot',
        'name',
        'company_name',
        'email',
        'phone',
        'campaign_start_date',
        'campaign_end_date',
        'estimated_budget',
        'message',
        'source',
        'status',
        'internal_notes',
        'ip_address',
        'user_agent',
    ];

    /**
     * Boot model.
     */
    protected static function booted(): void
    {
        static::creating(function ($lead) {
            if (empty($lead->uuid)) {
                $lead->uuid = (string) Str::uuid();
            }
            if (empty($lead->source)) {
                $lead->source = 'PUBLIC_DIRECTORY';
            }
            if (empty($lead->status)) {
                $lead->status = LeadStatus::NEW->value;
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
            'status' => LeadStatus::class,
            'campaign_start_date' => 'date',
            'campaign_end_date' => 'date',
            'estimated_budget' => 'decimal:2',
        ];
    }

    /**
     * Organization hosting this lead.
     */
    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    /**
     * Advertising resource this inquiry references (if specific face).
     */
    public function advertisingResource(): BelongsTo
    {
        return $this->belongsTo(AdvertisingResource::class);
    }

    /**
     * Location this inquiry references.
     */
    public function location(): BelongsTo
    {
        return $this->belongsTo(Location::class);
    }

    /**
     * Scope query to specific status.
     */
    public function scopeStatus($query, string|LeadStatus $status)
    {
        $val = $status instanceof LeadStatus ? $status->value : $status;
        return $query->where('status', $val);
    }
}
