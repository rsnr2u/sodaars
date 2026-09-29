<?php

namespace App\Http\Controllers\Api\V1\Tenant;

use App\Http\Controllers\Controller;
use App\Http\Resources\SubscriptionResource;
use App\Http\Traits\ApiResponse;
use App\Services\Tenant\TenantContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SubscriptionController extends Controller
{
    use ApiResponse;

    protected TenantContext $tenantContext;

    public function __construct(TenantContext $tenantContext)
    {
        $this->tenantContext = $tenantContext;
    }

    /**
     * Get active subscription details for current tenant.
     */
    public function show(Request $request): JsonResponse
    {
        $organization = $this->tenantContext->getTenant();
        $subscription = $organization->activeSubscription?->load('subscriptionPlan');

        if (! $subscription) {
            return $this->errorResponse('No active subscription found for this organization.', null, 404);
        }

        return $this->successResponse(
            new SubscriptionResource($subscription),
            'Subscription details retrieved successfully.'
        );
    }
}
