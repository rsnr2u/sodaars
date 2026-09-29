<?php

namespace App\Http\Requests\Tenant;

use App\Enums\CustomerStatus;
use App\Enums\CustomerType;
use App\Models\Customer;
use App\Services\Tenant\TenantContext;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCustomerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $tenantId = app(TenantContext::class)->getTenantId();
        $uuid = $this->route('uuid');
        $customer = Customer::where('organization_id', $tenantId)->where('uuid', $uuid)->first();

        return [
            'code' => [
                'sometimes',
                'string',
                'max:50',
                Rule::unique('customers', 'code')
                    ->where('organization_id', $tenantId)
                    ->ignore($customer?->id)
                    ->whereNull('deleted_at'),
            ],
            'customer_type' => ['sometimes', Rule::in(CustomerType::values())],
            'company_name' => ['nullable', 'string', 'max:255'],
            'brand_name' => ['nullable', 'string', 'max:255'],
            'contact_person' => ['sometimes', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['sometimes', 'string', 'max:50'],
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
            'status' => ['sometimes', Rule::in(CustomerStatus::values())],
            'notes' => ['nullable', 'string'],
        ];
    }
}
