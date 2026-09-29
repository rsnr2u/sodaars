<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AuthResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $data = [
            'token' => $this->resource['token'] ?? null,
            'token_type' => 'Bearer',
            'user' => isset($this->resource['user']) ? new UserResource($this->resource['user']) : null,
        ];

        if (isset($this->resource['platform_role'])) {
            $data['platform_role'] = $this->resource['platform_role'];
        }

        if (isset($this->resource['provider_role'])) {
            $data['provider_role'] = $this->resource['provider_role'];
        }

        if (isset($this->resource['organization'])) {
            $data['organization'] = new OrganizationResource($this->resource['organization']);
        }

        if (isset($this->resource['memberships'])) {
            $data['memberships'] = OrganizationUserResource::collection($this->resource['memberships']);
        }

        return $data;
    }
}
