<?php

namespace App\Http\Requests\Tenant;

use App\Enums\LocationStatus;
use App\Services\Tenant\TenantContext;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreLocationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $tenantId = app(TenantContext::class)->getTenantId();

        return [
            'name' => ['required', 'string', 'max:255'],
            'code' => [
                'required',
                'string',
                'max:100',
                Rule::unique('locations', 'code')
                    ->where('organization_id', $tenantId)
                    ->whereNull('deleted_at'),
            ],
            'address' => ['nullable', 'string'],
            'area' => ['nullable', 'string', 'max:150'],
            'locality' => ['nullable', 'string', 'max:150'],
            'city' => ['required', 'string', 'max:150'],
            'district' => ['nullable', 'string', 'max:150'],
            'state' => ['required', 'string', 'max:150'],
            'pincode' => ['nullable', 'string', 'max:20'],
            'country' => ['nullable', 'string', 'max:100'],
            'landmark' => ['nullable', 'string', 'max:255'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],
            'description' => ['nullable', 'string'],
            'status' => ['nullable', Rule::in(LocationStatus::values())],
            'notes' => ['nullable', 'string'],
        ];
    }
}
