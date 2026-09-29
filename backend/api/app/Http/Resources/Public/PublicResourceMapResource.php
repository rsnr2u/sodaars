<?php

namespace App\Http\Resources\Public;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PublicResourceMapResource extends JsonResource
{
    /**
     * Transform the resource into an array for high-performance map pins.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $primaryMedia = $this->relationLoaded('media')
            ? ($this->media->firstWhere('is_primary', true) ?? $this->media->first())
            : null;

        $rateFormatted = $this->base_price_monthly !== null
            ? '₹' . number_format((float) $this->base_price_monthly) . '/mo'
            : 'Price on Request';

        return [
            'uuid' => $this->uuid,
            'slug' => $this->slug,
            'name' => $this->name,
            'resource_type' => $this->resource_type instanceof \BackedEnum ? $this->resource_type->value : $this->resource_type,
            'category' => $this->category instanceof \BackedEnum ? $this->category->value : $this->category,
            'latitude' => (float) ($this->location?->latitude ?? 0),
            'longitude' => (float) ($this->location?->longitude ?? 0),
            'city' => $this->location?->city,
            'area' => $this->location?->area,
            'thumbnail_url' => $primaryMedia?->thumbnail_url,
            'indicative_rate' => $rateFormatted,
            'provider_name' => $this->organization?->name,
        ];
    }
}
