<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrganizationResource extends JsonResource
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
            'name' => $this->name,
            'slug' => $this->slug,
            'email' => $this->email,
            'phone' => $this->phone,
            'address' => $this->address,
            'city' => $this->city,
            'state' => $this->state,
            'pincode' => $this->pincode,
            'country' => $this->country,
            'contact_person' => $this->contact_person,
            'district' => $this->district,
            'website' => $this->website,
            'business_description' => $this->business_description,
            'gstin' => $this->gstin,
            'pan' => $this->pan,
            'logo_url' => $this->logo_url,
            'verification_status' => $this->verification_status,
            'verified_at' => $this->verified_at?->toISOString(),
            'registration_source' => $this->registration_source,
            'status' => $this->status,
            'public_directory_visible' => (bool) $this->public_directory_visible,
            'settings' => $this->settings,
            'active_subscription' => new SubscriptionResource($this->whenLoaded('activeSubscription')),
            'members_count' => $this->whenCounted('organizationUsers'),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
