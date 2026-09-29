<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LocationResource extends JsonResource
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
            'name' => $this->name,
            'code' => $this->code,
            'address' => $this->address,
            'area' => $this->area,
            'locality' => $this->locality,
            'city' => $this->city,
            'district' => $this->district,
            'state' => $this->state,
            'pincode' => $this->pincode,
            'country' => $this->country,
            'landmark' => $this->landmark,
            'latitude' => $this->latitude !== null ? (float) $this->latitude : null,
            'longitude' => $this->longitude !== null ? (float) $this->longitude : null,
            'description' => $this->description,
            'status' => $this->status instanceof \BackedEnum ? $this->status->value : $this->status,
            'notes' => $this->notes,
            'created_by' => new UserResource($this->whenLoaded('createdByUser')),
            'media' => LocationMediaResource::collection($this->whenLoaded('media')),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
