<?php

namespace App\Http\Requests\Tenant;

use Illuminate\Foundation\Http\FormRequest;

class PlaceEnquiryHoldRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'hold_duration_hours' => ['nullable', 'integer', 'min:1', 'max:720'],
            'notes' => ['nullable', 'string'],
        ];
    }
}
