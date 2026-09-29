<?php

namespace App\Http\Controllers\Api\V1\Tenant;

use App\Http\Controllers\Controller;
use App\Http\Requests\Tenant\UpdateOrganizationProfileRequest;
use App\Http\Requests\Tenant\UpdateOrganizationSettingsRequest;
use App\Http\Resources\OrganizationResource;
use App\Http\Traits\ApiResponse;
use App\Services\Tenant\TenantContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class OrganizationController extends Controller
{
    use ApiResponse;

    protected TenantContext $tenantContext;

    public function __construct(TenantContext $tenantContext)
    {
        $this->tenantContext = $tenantContext;
    }

    /**
     * Get profile of currently active organization.
     */
    public function show(Request $request): JsonResponse
    {
        $organization = $this->tenantContext->getTenant()->load([
            'activeSubscription.subscriptionPlan',
        ]);

        Gate::authorize('view', $organization);

        return $this->successResponse(
            new OrganizationResource($organization),
            'Organization profile retrieved successfully.'
        );
    }

    /**
     * Update profile of currently active organization.
     */
    public function update(UpdateOrganizationProfileRequest $request): JsonResponse
    {
        $organization = $this->tenantContext->getTenant();

        Gate::authorize('update', $organization);

        $organization->update($request->validated());

        return $this->successResponse(
            new OrganizationResource($organization->fresh(['activeSubscription.subscriptionPlan'])),
            'Organization profile updated successfully.'
        );
    }

    /**
     * Update business settings, details, and branding of currently active organization.
     */
    public function updateSettings(UpdateOrganizationSettingsRequest $request): JsonResponse
    {
        $organization = $this->tenantContext->getTenant();

        Gate::authorize('updateSettings', $organization);

        $validated = $request->validated();

        if (isset($validated['settings'])) {
            $existingSettings = $organization->settings ?? [];
            $validated['settings'] = array_replace_recursive($existingSettings, $validated['settings']);
        }

        $organization->update($validated);

        return $this->successResponse(
            new OrganizationResource($organization->fresh(['activeSubscription.subscriptionPlan'])),
            'Organization settings updated successfully.'
        );
    }

    /**
     * Update public directory visibility of currently active organization.
     * Restricted strictly to PROVIDER_OWNER (Manager and Staff receive 403).
     */
    public function updateVisibility(\App\Http\Requests\Tenant\UpdateOrganizationVisibilityRequest $request): JsonResponse
    {
        $organization = $this->tenantContext->getTenant();

        Gate::authorize('updateVisibility', $organization);

        $organization->update([
            'public_directory_visible' => (bool) $request->validated('public_directory_visible'),
        ]);

        return $this->successResponse(
            new OrganizationResource($organization->fresh(['activeSubscription.subscriptionPlan'])),
            'Public directory visibility updated successfully.'
        );
    }
}
