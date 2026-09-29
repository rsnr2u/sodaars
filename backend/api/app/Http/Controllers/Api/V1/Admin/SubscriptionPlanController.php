<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreSubscriptionPlanRequest;
use App\Http\Requests\Admin\UpdateSubscriptionPlanRequest;
use App\Http\Resources\SubscriptionPlanResource;
use App\Http\Traits\ApiResponse;
use App\Models\SubscriptionPlan;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;

class SubscriptionPlanController extends Controller
{
    use ApiResponse;

    /**
     * List all subscription plans (including inactive).
     */
    public function index(): JsonResponse
    {
        $plans = SubscriptionPlan::orderBy('sort_order')
            ->orderBy('monthly_price')
            ->get();

        return $this->successResponse(
            SubscriptionPlanResource::collection($plans),
            'All subscription plans retrieved successfully.'
        );
    }

    /**
     * Create a new subscription plan.
     */
    public function store(StoreSubscriptionPlanRequest $request): JsonResponse
    {
        $data = $request->validated();
        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['name']);
        }

        $plan = SubscriptionPlan::create($data);

        return $this->successResponse(
            new SubscriptionPlanResource($plan),
            'Subscription plan created successfully.',
            201
        );
    }

    /**
     * Update an existing subscription plan.
     */
    public function update(UpdateSubscriptionPlanRequest $request, int $id): JsonResponse
    {
        $plan = SubscriptionPlan::findOrFail($id);
        $plan->update($request->validated());

        return $this->successResponse(
            new SubscriptionPlanResource($plan),
            'Subscription plan updated successfully.'
        );
    }
}
