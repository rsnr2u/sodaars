<?php

namespace App\Http\Requests\Admin;

use App\Enums\PlanStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreSubscriptionPlanRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:100'],
            'slug' => ['nullable', 'string', 'max:100', 'unique:subscription_plans,slug'],
            'description' => ['nullable', 'string'],
            'min_resources' => ['required', 'integer', 'min:1'],
            'max_resources' => ['nullable', 'integer', 'gte:min_resources'],
            'monthly_price' => ['required', 'numeric', 'min:0'],
            'annual_price' => ['nullable', 'numeric', 'min:0'],
            'currency' => ['nullable', 'string', 'size:3'],
            'features' => ['nullable', 'array'],
            'status' => ['nullable', Rule::in(PlanStatus::values())],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ];
    }
}
