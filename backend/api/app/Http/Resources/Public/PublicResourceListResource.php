<?php

namespace App\Http\Resources\Public;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PublicResourceListResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     * Enforces Public Data Protection & Indicative Rate Card rules.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $primaryMedia = $this->relationLoaded('media')
            ? ($this->media->firstWhere('is_primary', true) ?? $this->media->first())
            : null;

        $indicativeRate = $this->base_price_monthly !== null
            ? [
                'amount' => (float) $this->base_price_monthly,
                'currency' => $this->currency ?? 'INR',
                'period' => 'month',
                'display_label' => 'Indicative Rate Card',
                'formatted' => '₹' . number_format((float) $this->base_price_monthly) . ' / month',
                'disclaimer' => 'Final quotation provided directly by the provider.',
            ]
            : [
                'amount' => null,
                'currency' => $this->currency ?? 'INR',
                'period' => null,
                'display_label' => 'Price on Request',
                'formatted' => 'Price on Request',
                'disclaimer' => 'Contact provider directly for rate and availability.',
            ];

        return [
            'uuid' => $this->uuid,
            'slug' => $this->slug,
            'name' => $this->name,
            'code' => $this->code,
            'resource_type' => $this->resource_type instanceof \BackedEnum ? $this->resource_type->value : $this->resource_type,
            'category' => $this->category instanceof \BackedEnum ? $this->category->value : $this->category,
            'dimensions' => [
                'width' => (float) $this->width,
                'height' => (float) $this->height,
                'unit' => $this->dimension_unit instanceof \BackedEnum ? $this->dimension_unit->value : $this->dimension_unit,
                'area_sqft' => (float) $this->area,
            ],
            'illumination_type' => $this->illumination_type instanceof \BackedEnum ? $this->illumination_type->value : $this->illumination_type,
            'indicative_rate' => $indicativeRate,
            'primary_media' => $primaryMedia ? [
                'uuid' => $primaryMedia->uuid,
                'display_url' => $primaryMedia->display_url,
                'thumbnail_url' => $primaryMedia->thumbnail_url,
                'alt_text' => $primaryMedia->alt_text ?: $this->name,
                'caption' => $primaryMedia->caption,
            ] : null,
            'location' => [
                'city' => $this->location?->city,
                'district' => $this->location?->district,
                'state' => $this->location?->state,
                'area' => $this->location?->area,
                'landmark' => $this->location?->landmark,
                'latitude' => $this->location?->latitude,
                'longitude' => $this->location?->longitude,
            ],
            'provider' => [
                'name' => $this->organization?->name,
                'slug' => $this->organization?->slug,
                'logo_url' => $this->organization?->logo_url,
                'verification_status' => $this->organization?->verification_status,
            ],
        ];
    }
}
