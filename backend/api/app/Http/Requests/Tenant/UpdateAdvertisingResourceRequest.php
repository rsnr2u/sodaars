<?php

namespace App\Http\Requests\Tenant;

use App\Enums\DimensionUnit;
use App\Enums\IlluminationType;
use App\Enums\ResourceCategory;
use App\Enums\ResourceStatus;
use App\Enums\ResourceType;
use App\Models\AdvertisingResource;
use App\Services\Tenant\TenantContext;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateAdvertisingResourceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $tenantId = app(TenantContext::class)->getTenantId();
        $uuid = $this->route('uuid');
        $resource = AdvertisingResource::where('uuid', $uuid)->first();
        $resourceId = $resource?->id;

        return [
            'location_uuid' => [
                'sometimes',
                'required',
                'string',
                Rule::exists('locations', 'uuid')
                    ->where('organization_id', $tenantId)
                    ->whereNull('deleted_at'),
            ],
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'code' => [
                'sometimes',
                'required',
                'string',
                'max:100',
                Rule::unique('advertising_resources', 'code')
                    ->where('organization_id', $tenantId)
                    ->whereNull('deleted_at')
                    ->ignore($resourceId),
            ],
            'resource_type' => ['sometimes', 'required', Rule::in(ResourceType::values())],
            'category' => ['sometimes', 'required', Rule::in(ResourceCategory::values())],
            'face_number' => ['nullable', 'integer', 'min:1'],
            'face_label' => ['nullable', 'string', 'max:50'],
            'direction' => ['nullable', 'string', 'max:100'],
            'traffic_flow' => ['nullable', 'string', 'max:150'],
            'width' => ['sometimes', 'required', 'numeric', 'min:0.1'],
            'height' => ['sometimes', 'required', 'numeric', 'min:0.1'],
            'dimension_unit' => ['nullable', Rule::in(DimensionUnit::values())],
            'illumination_type' => ['sometimes', 'required', Rule::in(IlluminationType::values())],
            'operating_hours_from' => ['nullable', 'date_format:H:i'],
            'operating_hours_to' => ['nullable', 'date_format:H:i'],
            'resolution' => ['nullable', 'string', 'max:50'],
            'pixel_pitch' => ['nullable', 'string', 'max:20'],
            'slot_duration_seconds' => ['nullable', 'integer', 'min:1'],
            'daily_impressions_estimate' => ['nullable', 'integer', 'min:0'],
            'base_price_monthly' => ['nullable', 'numeric', 'min:0'],
            'currency' => ['nullable', 'string', 'size:3'],
            'status' => ['nullable', Rule::in(ResourceStatus::values())],
            'description' => ['nullable', 'string'],
            'installation_details' => ['nullable', 'string'],
            'notes' => ['nullable', 'string'],
        ];
    }
}
