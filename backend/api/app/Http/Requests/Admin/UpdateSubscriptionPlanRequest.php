<?php

namespace App\Http\Requests\Admin;

use App\Enums\PlanStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateSubscriptionPlanRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $planId = $this->route('id') ?? $this->route('subscription_plan');

        return [
            'name' => ['sometimes', 'required', 'string', 'max:100'],
            'slug' => ['sometimes', 'required', 'string', 'max:100', Rule::unique('subscription_plans', 'slug')->ignore($planId)],
            'description' => ['nullable', 'string'],
            'min_resources' => ['sometimes', 'required', 'integer', 'min:1'],
            'max_resources' => ['nullable', 'integer'],
            'monthly_price' => ['sometimes', 'required', 'numeric', 'min:0'],
            'annual_price' => ['nullable', 'numeric', 'min:0'],
            'currency' => ['nullable', 'string', 'size:3'],
            'features' => ['nullable', 'array'],
            'status' => ['sometimes', 'required', Rule::in(PlanStatus::values())],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ];
    }
}
