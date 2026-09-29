<?php

namespace App\Http\Resources\Public;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PublicDirectoryOverviewResource extends JsonResource
{
    /**
     * Transform the directory statistics into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'counts' => [
                'verified_providers' => $this->resource['verified_providers_count'] ?? 0,
                'active_resources' => $this->resource['active_resources_count'] ?? 0,
                'active_locations' => $this->resource['active_locations_count'] ?? 0,
                'covered_cities' => $this->resource['covered_cities_count'] ?? 0,
            ],
            'featured_cities' => $this->resource['featured_cities'] ?? [],
            'featured_categories' => $this->resource['featured_categories'] ?? [],
            'recent_verified_providers' => PublicProviderResource::collection($this->resource['recent_providers'] ?? []),
            'featured_resources' => PublicResourceListResource::collection($this->resource['featured_resources'] ?? []),
        ];
    }
}
