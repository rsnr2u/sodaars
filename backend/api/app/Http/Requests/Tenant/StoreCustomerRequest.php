<?php

namespace App\Http\Requests\Tenant;

use App\Enums\CustomerStatus;
use App\Enums\CustomerType;
use App\Services\Tenant\TenantContext;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCustomerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $tenantId = app(TenantContext::class)->getTenantId();

        return [
            'code' => [
                'nullable',
                'string',
                'max:50',
                Rule::unique('customers', 'code')
                    ->where('organization_id', $tenantId)
                    ->whereNull('deleted_at'),
            ],
            'customer_type' => ['required', Rule::in(CustomerType::values())],
            'company_name' => ['nullable', 'string', 'max:255'],
            'brand_name' => ['nullable', 'string', 'max:255'],
            'contact_person' => ['required', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['required', 'string', 'max:50'],
            'alternate_phone' => ['nullable', 'string', 'max:50'],
            'website' => ['nullable', 'string', 'max:255'],
            'billing_address' => ['nullable', 'string'],
            'city' => ['nullable', 'string', 'max:100'],
            'state' => ['nullable', 'string', 'max:100'],
            'pincode' => ['nullable', 'string', 'max:20'],
            'country' => ['nullable', 'string', 'max:100'],
            'gstin' => ['nullable', 'string', 'max:20'],
            'pan_number' => ['nullable', 'string', 'max:20'],
            'credit_period_days' => ['nullable', 'integer', 'min:0', 'max:365'],
            'status' => ['nullable', Rule::in(CustomerStatus::values())],
            'notes' => ['nullable', 'string'],
        ];
    }
}
