<?php

namespace App\Http\Requests\Tenant;

use App\Services\Tenant\TenantContext;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CheckAvailabilityRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $tenantId = app(TenantContext::class)->getTenantId();

        return [
            'resource_uuid' => [
                'required',
                'string',
                Rule::exists('advertising_resources', 'uuid')
                    ->where('organization_id', $tenantId)
                    ->whereNull('deleted_at'),
            ],
            'start_date' => ['required', 'date_format:Y-m-d'],
            'end_date' => ['required', 'date_format:Y-m-d', 'after_or_equal:start_date'],
            'slots_count' => ['nullable', 'integer', 'min:1'],
        ];
    }
}
