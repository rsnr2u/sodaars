<?php

namespace App\Http\Requests\Tenant;

use App\Enums\LocationMediaType;
use App\Enums\ProviderRole;
use App\Services\Permission\PermissionService;
use App\Services\Tenant\TenantContext;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreLocationMediaRequest extends FormRequest
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
        $maxSizeKb = (int) config('media.max_file_size', 15360);

        return [
            'file' => ['required', 'file', 'mimes:jpg,jpeg,png,webp', "max:{$maxSizeKb}"],
            'media_type' => ['nullable', 'string', Rule::in(LocationMediaType::values())],
            'alt_text' => ['nullable', 'string', 'max:255'],
            'caption' => ['nullable', 'string', 'max:500'],
            'is_primary' => ['nullable', 'boolean'],
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            if ($this->boolean('is_primary')) {
                $tenantContext = app(TenantContext::class);
                $org = $tenantContext->getTenant();
                if ($org) {
                    $permissionService = app(PermissionService::class);
                    if (! $permissionService->userHasPermission($this->user(), $org, 'location.media.manage')) {
                        $validator->errors()->add('is_primary', 'Staff members are not permitted to set the primary cover photo.');
                    }
                }
            }
        });
    }
}
