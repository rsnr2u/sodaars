<?php

namespace App\Models\Traits;

use App\Models\Organization;
use App\Models\Scopes\TenantScope;
use App\Services\Tenant\TenantContext;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

trait BelongsToTenant
{
    /**
     * Boot the trait to add the global scope and auto-assign organization_id on creation.
     */
    protected static function bootBelongsToTenant(): void
    {
        static::addGlobalScope(new TenantScope());

        static::creating(function ($model) {
            $tenantContext = app(TenantContext::class);
            if ($tenantContext->hasTenant()) {
                // Ensure the organization_id is always stamped from TenantContext, preventing client spoofing
                $model->organization_id = $tenantContext->getTenantId();
            }
        });
    }

    /**
     * Relationship to the tenant organization.
     */
    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class, 'organization_id');
    }
}
