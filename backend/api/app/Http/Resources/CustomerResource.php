<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CustomerResource extends JsonResource
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
            'code' => $this->code,
            'customer_type' => $this->customer_type instanceof \BackedEnum ? $this->customer_type->value : $this->customer_type,
            'company_name' => $this->company_name,
            'brand_name' => $this->brand_name,
            'contact_person' => $this->contact_person,
            'email' => $this->email,
            'phone' => $this->phone,
            'alternate_phone' => $this->alternate_phone,
            'website' => $this->website,
            'billing_address' => $this->billing_address,
            'city' => $this->city,
            'state' => $this->state,
            'pincode' => $this->pincode,
            'country' => $this->country,
            'gstin' => $this->gstin,
            'pan_number' => $this->pan_number,
            'credit_period_days' => (int) $this->credit_period_days,
            'status' => $this->status instanceof \BackedEnum ? $this->status->value : $this->status,
            'notes' => $this->notes,
            'enquiries_count' => $this->whenCounted('enquiries'),
            'created_by' => new UserResource($this->whenLoaded('createdByUser')),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
