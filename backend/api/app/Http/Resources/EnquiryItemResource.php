<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EnquiryItemResource extends JsonResource
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
            'enquiry_id' => $this->enquiry_id,
            'advertising_resource_id' => $this->advertising_resource_id,
            'location_id' => $this->location_id,
            'item_type' => $this->advertising_resource_id ? 'RESOURCE' : 'LOCATION',
            'start_date' => $this->start_date?->toDateString(),
            'end_date' => $this->end_date?->toDateString(),
            'effective_start_date' => $this->effective_start_date,
            'effective_end_date' => $this->effective_end_date,
            'slots_count' => (int) $this->slots_count,
            'proposed_rate' => $this->proposed_rate !== null ? (float) $this->proposed_rate : null,
            'notes' => $this->notes,
            'advertising_resource' => $this->whenLoaded('advertisingResource', function () {
                return [
                    'id' => $this->advertisingResource->id,
                    'uuid' => $this->advertisingResource->uuid,
                    'name' => $this->advertisingResource->name,
                    'code' => $this->advertisingResource->code,
                    'resource_type' => $this->advertisingResource->resource_type instanceof \BackedEnum ? $this->advertisingResource->resource_type->value : $this->advertisingResource->resource_type,
                    'category' => $this->advertisingResource->category instanceof \BackedEnum ? $this->advertisingResource->category->value : $this->advertisingResource->category,
                    'base_price_monthly' => $this->advertisingResource->base_price_monthly,
                ];
            }),
            'location' => $this->whenLoaded('location', function () {
                return [
                    'id' => $this->location->id,
                    'uuid' => $this->location->uuid,
                    'name' => $this->location->name,
                    'code' => $this->location->code,
                    'city' => $this->location->city,
                    'state' => $this->location->state,
                ];
            }),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
