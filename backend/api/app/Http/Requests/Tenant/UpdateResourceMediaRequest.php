<?php

namespace App\Http\Requests\Tenant;

use App\Enums\ResourceMediaType;
use App\Services\Permission\PermissionService;
use App\Services\Tenant\TenantContext;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateResourceMediaRequest extends FormRequest
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
            'alt_text' => ['nullable', 'string', 'max:255'],
            'caption' => ['nullable', 'string', 'max:500'],
            'media_type' => ['nullable', 'string', Rule::in(ResourceMediaType::values())],
            'is_primary' => ['nullable', 'boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $isModifyingPrimaryOrOrder = $this->has('is_primary') || $this->has('sort_order');
            if ($isModifyingPrimaryOrOrder) {
                $tenantContext = app(TenantContext::class);
                $org = $tenantContext->getTenant();
                if ($org) {
                    $permissionService = app(PermissionService::class);
                    if (! $permissionService->userHasPermission($this->user(), $org, 'resource.media.manage')) {
                        if ($this->has('is_primary')) {
                            $validator->errors()->add('is_primary', 'Staff members are not permitted to set the primary cover photo.');
                        }
                        if ($this->has('sort_order')) {
                            $validator->errors()->add('sort_order', 'Staff members are not permitted to change gallery order.');
                        }
                    }
                }
            }
        });
    }
}
