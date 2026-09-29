<?php

namespace App\Http\Requests\Tenant;

use App\Enums\ScheduleBlockType;
use App\Services\Tenant\TenantContext;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreResourceScheduleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $tenantId = app(TenantContext::class)->getTenantId();

        return [
            'advertising_resource_uuid' => [
                'required',
                'string',
                Rule::exists('advertising_resources', 'uuid')
                    ->where('organization_id', $tenantId)
                    ->whereNull('deleted_at'),
            ],
            'title' => ['nullable', 'string', 'max:255'],
            'block_type' => ['required', Rule::in(ScheduleBlockType::values())],
            'start_date' => ['required', 'date_format:Y-m-d'],
            'end_date' => ['required', 'date_format:Y-m-d', 'after_or_equal:start_date'],
            'slots_count' => ['nullable', 'integer', 'min:1'],
            'hold_expires_at' => ['nullable', 'date'],
            'reference_type' => ['nullable', 'string', 'max:100'],
            'reference_id' => ['nullable', 'integer'],
            'notes' => ['nullable', 'string'],
        ];
    }
}
