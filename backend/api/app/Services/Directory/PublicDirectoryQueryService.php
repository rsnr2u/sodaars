<?php

namespace App\Services\Directory;

use App\Models\AdvertisingResource;
use App\Models\Location;
use App\Models\Organization;
use Illuminate\Database\Eloquent\Builder;

class PublicDirectoryQueryService
{
    /**
     * Base query for publicly visible, active, verified organizations.
     */
    public function queryOrganizations(): Builder
    {
        return Organization::query()->publiclyVisible();
    }

    /**
     * Base query for publicly visible advertising resources.
     * Enforces TRIPLE GATE:
     * 1. Organization: ACTIVE + VERIFIED + public_directory_visible=true
     * 2. Location: ACTIVE
     * 3. Resource: ACTIVE
     */
    public function queryResources(): Builder
    {
        return AdvertisingResource::query()
            ->where('advertising_resources.status', 'ACTIVE')
            ->whereHas('location', function (Builder $q) {
                $q->where('status', 'ACTIVE');
            })
            ->whereHas('organization', function (Builder $q) {
                $q->publiclyVisible();
            });
    }

    /**
     * Base query for publicly visible locations.
     */
    public function queryLocations(): Builder
    {
        return Location::query()
            ->where('locations.status', 'ACTIVE')
            ->whereHas('organization', function (Builder $q) {
                $q->publiclyVisible();
            });
    }

    /**
     * Resolve single publicly visible resource by SEO slug or UUID.
     */
    public function findResource(string $slugOrUuid): AdvertisingResource
    {
        return $this->queryResources()
            ->with([
                'location',
                'organization',
                'media' => fn($q) => $q->orderBy('sort_order')->orderBy('id'),
            ])
            ->where(function (Builder $q) use ($slugOrUuid) {
                $q->where('slug', $slugOrUuid)
                    ->orWhere('uuid', $slugOrUuid);
            })
            ->firstOrFail();
    }

    /**
     * Resolve single publicly visible provider by slug.
     */
    public function findProvider(string $slug): Organization
    {
        return $this->queryOrganizations()
            ->where('slug', $slug)
            ->firstOrFail();
    }
}
