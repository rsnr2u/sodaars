<?php

namespace App\Http\Requests\Tenant;

use App\Enums\ProviderRole;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ChangeUserRoleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'role' => ['required', Rule::in(ProviderRole::values())],
        ];
    }
}
