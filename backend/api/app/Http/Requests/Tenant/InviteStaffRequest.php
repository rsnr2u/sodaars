<?php

namespace App\Http\Requests\Tenant;

use App\Enums\ProviderRole;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class InviteStaffRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'role' => [
                'required',
                Rule::in([
                    ProviderRole::PROVIDER_MANAGER->value,
                    ProviderRole::PROVIDER_STAFF->value,
                ]),
            ],
        ];
    }
}
