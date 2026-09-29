<?php

namespace App\Http\Requests\Tenant;

use App\Enums\EnquiryStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class TransitionEnquiryStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'status' => ['required', Rule::in(EnquiryStatus::values())],
            'lost_reason' => ['nullable', 'string', 'max:255', 'required_if:status,' . EnquiryStatus::LOST->value],
            'notes' => ['nullable', 'string'],
        ];
    }
}
