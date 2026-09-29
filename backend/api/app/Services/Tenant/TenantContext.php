<?php

namespace App\Services\Tenant;

use App\Models\Organization;

class TenantContext
{
    protected ?Organization $tenant = null;

    public function setTenant(?Organization $tenant): void
    {
        $this->tenant = $tenant;
    }

    public function getTenant(): ?Organization
    {
        return $this->tenant;
    }

    public function getTenantId(): ?int
    {
        return $this->tenant?->id;
    }

    public function hasTenant(): bool
    {
        return $this->tenant !== null;
    }

    public function clear(): void
    {
        $this->tenant = null;
    }
}
