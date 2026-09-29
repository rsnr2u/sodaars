<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ResourceScheduleResource extends JsonResource
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
            'advertising_resource_id' => $this->advertising_resource_id,
            'title' => $this->title,
            'block_type' => $this->block_type instanceof \BackedEnum ? $this->block_type->value : $this->block_type,
            'status' => $this->status instanceof \BackedEnum ? $this->status->value : $this->status,
            'start_date' => $this->start_date?->toDateString(),
            'end_date' => $this->end_date?->toDateString(),
            'slots_count' => (int) $this->slots_count,
            'hold_expires_at' => $this->hold_expires_at?->toISOString(),
            'is_hold_expired' => $this->hold_expires_at ? $this->hold_expires_at->isPast() : false,
            'reference_type' => $this->reference_type,
            'reference_id' => $this->reference_id,
            'notes' => $this->notes,
            'advertising_resource' => $this->whenLoaded('advertisingResource', function () {
                return [
                    'id' => $this->advertisingResource->id,
                    'uuid' => $this->advertisingResource->uuid,
                    'name' => $this->advertisingResource->name,
                    'code' => $this->advertisingResource->code,
                    'category' => $this->advertisingResource->category instanceof \BackedEnum ? $this->advertisingResource->category->value : $this->advertisingResource->category,
                    'location' => ($this->advertisingResource->relationLoaded('location') && $this->advertisingResource->location) ? [
                        'id' => $this->advertisingResource->location->id,
                        'uuid' => $this->advertisingResource->location->uuid,
                        'name' => $this->advertisingResource->location->name,
                        'code' => $this->advertisingResource->location->code,
                        'city' => $this->advertisingResource->location->city,
                    ] : null,
                ];
            }),
            'created_by' => new UserResource($this->whenLoaded('createdByUser')),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
