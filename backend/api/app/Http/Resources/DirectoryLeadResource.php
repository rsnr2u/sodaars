<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DirectoryLeadResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     * Includes historical context snapshots even if related resources are modified or deleted.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'uuid' => $this->uuid,
            'status' => $this->status instanceof \BackedEnum ? $this->status->value : $this->status,
            'source' => $this->source,
            'visitor' => [
                'name' => $this->name,
                'company_name' => $this->company_name,
                'email' => $this->email,
                'phone' => $this->phone,
            ],
            'campaign' => [
                'start_date' => $this->campaign_start_date?->format('Y-m-d'),
                'end_date' => $this->campaign_end_date?->format('Y-m-d'),
                'estimated_budget' => $this->estimated_budget ? (float) $this->estimated_budget : null,
                'message' => $this->message,
            ],
            'snapshots' => [
                'resource_name' => $this->resource_name_snapshot,
                'resource_code' => $this->resource_code_snapshot,
                'resource_uuid' => $this->resource_uuid_snapshot,
                'location_name' => $this->location_name_snapshot,
                'location_area' => $this->location_area_snapshot,
                'location_uuid' => $this->location_uuid_snapshot,
            ],
            'referenced_resource' => $this->advertisingResource ? [
                'uuid' => $this->advertisingResource->uuid,
                'slug' => $this->advertisingResource->slug,
                'name' => $this->advertisingResource->name,
                'code' => $this->advertisingResource->code,
            ] : null,
            'referenced_location' => $this->location ? [
                'uuid' => $this->location->uuid,
                'name' => $this->location->name,
                'city' => $this->location->city,
                'area' => $this->location->area,
            ] : null,
            'internal_notes' => $this->internal_notes,
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
