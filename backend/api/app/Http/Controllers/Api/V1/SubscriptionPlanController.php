<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\SubscriptionPlanResource;
use App\Http\Traits\ApiResponse;
use App\Models\SubscriptionPlan;
use Illuminate\Http\JsonResponse;

class SubscriptionPlanController extends Controller
{
    use ApiResponse;

    /**
     * List all active subscription plans.
     */
    public function index(): JsonResponse
    {
        $plans = SubscriptionPlan::active()
            ->orderBy('sort_order')
            ->orderBy('monthly_price')
            ->get();

        return $this->successResponse(
            SubscriptionPlanResource::collection($plans),
            'Subscription plans retrieved successfully.'
        );
    }

    /**
     * Show a specific subscription plan by slug.
     */
    public function show(string $slug): JsonResponse
    {
        $plan = SubscriptionPlan::active()
            ->where('slug', $slug)
            ->first();

        if (! $plan) {
            return $this->errorResponse('Subscription plan not found.', null, 404);
        }

        return $this->successResponse(
            new SubscriptionPlanResource($plan),
            'Subscription plan retrieved successfully.'
        );
    }
}
