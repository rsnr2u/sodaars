<?php

namespace App\Http\Requests\Public;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class StoreDirectoryLeadRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:150'],
            'company_name' => ['nullable', 'string', 'max:150'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['required', 'string', 'max:50'],
            'campaign_start_date' => ['nullable', 'date'],
            'campaign_end_date' => ['nullable', 'date', 'after_or_equal:campaign_start_date'],
            'estimated_budget' => ['nullable', 'numeric', 'min:0'],
            'message' => ['required', 'string', 'max:5000'],
            'hp_field' => ['nullable', 'string', 'max:0'], // Honeypot: must be empty
        ];
    }

    /**
     * Custom validation messages.
     */
    public function messages(): array
    {
        return [
            'hp_field.max' => 'Spam detected.',
            'campaign_end_date.after_or_equal' => 'Campaign end date must be on or after the start date.',
        ];
    }

    /**
     * In test or local environments, relax strict DNS check if needed.
     */
    protected function prepareForValidation(): void
    {
        if (app()->environment('testing', 'local') && $this->has('email')) {
            // No action needed if regular email
        }
    }
}
