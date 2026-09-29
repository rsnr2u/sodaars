<?php

namespace App\Http\Resources\Public;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PublicProviderResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     * Enforces Public Business Contact Policy (omits all private data).
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'name' => $this->name,
            'slug' => $this->slug,
            'logo_url' => $this->logo_url,
            'business_description' => $this->business_description,
            'website' => $this->website,
            'business_phone' => $this->phone,
            'business_email' => $this->email,
            'business_address' => [
                'address' => $this->address,
                'city' => $this->city,
                'state' => $this->state,
                'pincode' => $this->pincode,
                'country' => $this->country ?? 'India',
            ],
            'operational_cities' => $this->settings['operational_cities'] ?? ($this->city ? [$this->city] : []),
            'verification_status' => $this->verification_status,
            'verified_at' => $this->verified_at?->toIso8601String(),
            'active_resources_count' => $this->whenCounted('advertisingResources'),
        ];
    }
}
