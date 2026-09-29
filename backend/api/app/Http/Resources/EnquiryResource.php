<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EnquiryResource extends JsonResource
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
            'enquiry_number' => $this->enquiry_number,
            'customer_id' => $this->customer_id,
            'campaign_title' => $this->campaign_title,
            'status' => $this->status instanceof \BackedEnum ? $this->status->value : $this->status,
            'priority' => $this->priority instanceof \BackedEnum ? $this->priority->value : $this->priority,
            'source' => $this->source instanceof \BackedEnum ? $this->source->value : $this->source,
            'start_date' => $this->start_date?->toDateString(),
            'end_date' => $this->end_date?->toDateString(),
            'estimated_budget' => $this->estimated_budget !== null ? (float) $this->estimated_budget : null,
            'currency' => $this->currency,
            'assigned_to_user_id' => $this->assigned_to_user_id,
            'lost_reason' => $this->lost_reason,
            'requirements' => $this->requirements,
            'internal_notes' => $this->internal_notes,
            'customer' => new CustomerResource($this->whenLoaded('customer')),
            'assigned_to' => new UserResource($this->whenLoaded('assignedToUser')),
            'created_by' => new UserResource($this->whenLoaded('createdByUser')),
            'items' => EnquiryItemResource::collection($this->whenLoaded('items')),
            'active_holds_count' => $this->whenCounted('schedules'),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
