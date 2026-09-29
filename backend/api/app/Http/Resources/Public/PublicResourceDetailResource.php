<?php

namespace App\Http\Resources\Public;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PublicResourceDetailResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     * Enforces Public Data Protection, Technical Specs, Media Assets, and Indicative Pricing.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
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

        // Format media gallery using strictly Stage 9 display & thumbnail URLs (never originals)
        $mediaGallery = $this->relationLoaded('media')
            ? $this->media->map(function ($media) {
                return [
                    'uuid' => $media->uuid,
                    'media_type' => $media->media_type instanceof \BackedEnum ? $media->media_type->value : $media->media_type,
                    'display_url' => $media->display_url,
                    'thumbnail_url' => $media->thumbnail_url,
                    'alt_text' => $media->alt_text ?: $this->name,
                    'caption' => $media->caption,
                    'is_primary' => (bool) $media->is_primary,
                    'sort_order' => $media->sort_order,
                ];
            })->values()->all()
            : [];

        $isDigital = ($this->category instanceof \BackedEnum ? $this->category->value : $this->category) === 'DIGITAL';

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
            'face_number' => $this->face_number,
            'face_label' => $this->face_label,
            'direction' => $this->direction,
            'traffic_flow' => $this->traffic_flow,
            'illumination_type' => $this->illumination_type instanceof \BackedEnum ? $this->illumination_type->value : $this->illumination_type,
            'operating_hours' => [
                'from' => $this->operating_hours_from,
                'to' => $this->operating_hours_to,
            ],
            'digital_specs' => $isDigital ? [
                'resolution' => $this->resolution,
                'pixel_pitch' => $this->pixel_pitch,
                'slot_duration_seconds' => $this->slot_duration_seconds,
                'total_slots' => $this->total_slots,
                'daily_impressions_estimate' => $this->daily_impressions_estimate,
            ] : null,
            'description' => $this->description,
            'indicative_rate' => $indicativeRate,
            'media' => $mediaGallery,
            'location' => [
                'uuid' => $this->location?->uuid,
                'name' => $this->location?->name,
                'city' => $this->location?->city,
                'district' => $this->location?->district,
                'state' => $this->location?->state,
                'area' => $this->location?->area,
                'landmark' => $this->location?->landmark,
                'address' => $this->location?->address,
                'pincode' => $this->location?->pincode,
                'latitude' => $this->location?->latitude,
                'longitude' => $this->location?->longitude,
                'location_type' => $this->location?->location_type instanceof \BackedEnum ? $this->location->location_type->value : $this->location?->location_type,
            ],
            'provider' => [
                'name' => $this->organization?->name,
                'slug' => $this->organization?->slug,
                'logo_url' => $this->organization?->logo_url,
                'business_description' => $this->organization?->business_description,
                'website' => $this->organization?->website,
                'business_phone' => $this->organization?->phone,
                'business_email' => $this->organization?->email,
                'verification_status' => $this->organization?->verification_status,
                'verified_at' => $this->organization?->verified_at?->toIso8601String(),
            ],
        ];
    }
}
