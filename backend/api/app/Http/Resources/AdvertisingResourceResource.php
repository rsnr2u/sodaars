<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AdvertisingResourceResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'organization_id' => $this->organization_id,
            'location_id' => $this->location_id,
            'name' => $this->name,
            'code' => $this->code,
            'resource_type' => $this->resource_type instanceof \BackedEnum ? $this->resource_type->value : $this->resource_type,
            'category' => $this->category instanceof \BackedEnum ? $this->category->value : $this->category,
            'face_number' => (int) $this->face_number,
            'face_label' => $this->face_label,
            'direction' => $this->direction,
            'traffic_flow' => $this->traffic_flow,
            'width' => (float) $this->width,
            'height' => (float) $this->height,
            'dimension_unit' => $this->dimension_unit instanceof \BackedEnum ? $this->dimension_unit->value : $this->dimension_unit,
            'area' => (float) $this->area,
            'illumination_type' => $this->illumination_type instanceof \BackedEnum ? $this->illumination_type->value : $this->illumination_type,
            'operating_hours_from' => $this->operating_hours_from,
            'operating_hours_to' => $this->operating_hours_to,
            'resolution' => $this->resolution,
            'pixel_pitch' => $this->pixel_pitch,
            'slot_duration_seconds' => $this->slot_duration_seconds !== null ? (int) $this->slot_duration_seconds : null,
            'daily_impressions_estimate' => $this->daily_impressions_estimate !== null ? (int) $this->daily_impressions_estimate : null,
            'base_price_monthly' => $this->base_price_monthly !== null ? (float) $this->base_price_monthly : null,
            'currency' => $this->currency,
            'status' => $this->status instanceof \BackedEnum ? $this->status->value : $this->status,
            'description' => $this->description,
            'installation_details' => $this->installation_details,
            'notes' => $this->notes,
            'location' => $this->whenLoaded('location', function () {
                return [
                    'id' => $this->location->id,
                    'uuid' => $this->location->uuid,
                    'name' => $this->location->name,
                    'code' => $this->location->code,
                    'city' => $this->location->city,
                    'state' => $this->location->state,
                    'latitude' => $this->location->latitude !== null ? (float) $this->location->latitude : null,
                    'longitude' => $this->location->longitude !== null ? (float) $this->location->longitude : null,
                ];
            }),
            'created_by' => new UserResource($this->whenLoaded('createdByUser')),
            'media' => AdvertisingResourceMediaResource::collection($this->whenLoaded('media')),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
