<?php

namespace App\Http\Requests\Tenant;

use App\Enums\EnquiryPriority;
use App\Enums\EnquirySource;
use App\Models\AdvertisingResource;
use App\Models\Customer;
use App\Models\Enquiry;
use App\Models\Location;
use App\Services\Tenant\TenantContext;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateEnquiryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Prepare inputs for validation (support UUID resolution).
     */
    protected function prepareForValidation(): void
    {
        $tenantId = app(TenantContext::class)->getTenantId();

        if ($this->has('customer_uuid') && ! $this->has('customer_id')) {
            $customer = Customer::where('organization_id', $tenantId)
                ->where('uuid', $this->input('customer_uuid'))
                ->first();

            if ($customer) {
                $this->merge(['customer_id' => $customer->id]);
            }
        }

        if ($this->has('items') && is_array($this->input('items'))) {
            $items = $this->input('items');
            foreach ($items as $index => $item) {
                if (isset($item['resource_uuid']) && ! isset($item['advertising_resource_id'])) {
                    $resource = AdvertisingResource::where('organization_id', $tenantId)
                        ->where('uuid', $item['resource_uuid'])
                        ->first();
                    if ($resource) {
                        $items[$index]['advertising_resource_id'] = $resource->id;
                    }
                }
                if (isset($item['location_uuid']) && ! isset($item['location_id'])) {
                    $location = Location::where('organization_id', $tenantId)
                        ->where('uuid', $item['location_uuid'])
                        ->first();
                    if ($location) {
                        $items[$index]['location_id'] = $location->id;
                    }
                }
            }
            $this->merge(['items' => $items]);
        }
    }

    public function rules(): array
    {
        $tenantId = app(TenantContext::class)->getTenantId();
        $uuid = $this->route('uuid');
        $enquiry = Enquiry::where('organization_id', $tenantId)->where('uuid', $uuid)->first();

        return [
            'customer_id' => [
                'sometimes',
                'integer',
                Rule::exists('customers', 'id')
                    ->where('organization_id', $tenantId)
                    ->whereNull('deleted_at'),
            ],
            'customer_uuid' => ['nullable', 'string'],
            'campaign_title' => ['sometimes', 'string', 'max:255'],
            'enquiry_number' => [
                'sometimes',
                'string',
                'max:50',
                Rule::unique('enquiries', 'enquiry_number')
                    ->where('organization_id', $tenantId)
                    ->ignore($enquiry?->id)
                    ->whereNull('deleted_at'),
            ],
            'priority' => ['sometimes', Rule::in(EnquiryPriority::values())],
            'source' => ['sometimes', Rule::in(EnquirySource::values())],
            'start_date' => ['nullable', 'date_format:Y-m-d'],
            'end_date' => ['nullable', 'date_format:Y-m-d', 'after_or_equal:start_date'],
            'estimated_budget' => ['nullable', 'numeric', 'min:0'],
            'currency' => ['nullable', 'string', 'size:3'],
            'assigned_to_user_id' => ['nullable', 'integer', Rule::exists('users', 'id')],
            'lost_reason' => ['nullable', 'string', 'max:255'],
            'requirements' => ['nullable', 'string'],
            'internal_notes' => ['nullable', 'string'],

            'items' => ['nullable', 'array'],
            'items.*.advertising_resource_id' => [
                'nullable',
                'integer',
                Rule::exists('advertising_resources', 'id')
                    ->where('organization_id', $tenantId)
                    ->whereNull('deleted_at'),
            ],
            'items.*.resource_uuid' => ['nullable', 'string'],
            'items.*.location_id' => [
                'nullable',
                'integer',
                Rule::exists('locations', 'id')
                    ->where('organization_id', $tenantId)
                    ->whereNull('deleted_at'),
            ],
            'items.*.location_uuid' => ['nullable', 'string'],
            'items.*.start_date' => ['nullable', 'date_format:Y-m-d'],
            'items.*.end_date' => ['nullable', 'date_format:Y-m-d', 'after_or_equal:items.*.start_date'],
            'items.*.slots_count' => ['nullable', 'integer', 'min:1'],
            'items.*.proposed_rate' => ['nullable', 'numeric', 'min:0'],
            'items.*.notes' => ['nullable', 'string'],
        ];
    }
}
