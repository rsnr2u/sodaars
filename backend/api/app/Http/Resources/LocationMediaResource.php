<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LocationMediaResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'uuid' => $this->uuid,
            'location_uuid' => $this->location?->uuid,
            'original_filename' => $this->original_filename ?? $this->file_name,
            'media_type' => $this->media_type?->value ?? $this->media_type,
            'mime_type' => $this->mime_type,
            'file_size' => $this->file_size,
            'width' => $this->width,
            'height' => $this->height,
            'alt_text' => $this->alt_text,
            'caption' => $this->caption,
            'is_primary' => (bool) $this->is_primary,
            'sort_order' => $this->sort_order,
            'file_url' => $this->display_url,
            'thumbnail_url' => $this->thumbnail_url,
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
