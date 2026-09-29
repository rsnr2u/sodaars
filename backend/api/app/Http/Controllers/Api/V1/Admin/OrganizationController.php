<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Enums\OrganizationStatus;
use App\Enums\VerificationStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreOrganizationRequest;
use App\Http\Requests\Admin\UpdateOrganizationRequest;
use App\Http\Requests\Admin\VerifyOrganizationRequest;
use App\Http\Resources\OrganizationResource;
use App\Http\Traits\ApiResponse;
use App\Models\Organization;
use App\Services\OrganizationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OrganizationController extends Controller
{
    use ApiResponse;

    protected OrganizationService $organizationService;

    public function __construct(OrganizationService $organizationService)
    {
        $this->organizationService = $organizationService;
    }

    /**
     * List organizations with filtering and pagination.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Organization::with(['activeSubscription.subscriptionPlan'])
            ->withCount('organizationUsers');

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('registration_source')) {
            $query->where('registration_source', $request->registration_source);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('city', 'like', "%{$search}%");
            });
        }

        $organizations = $query->latest()->paginate($request->integer('per_page', 15));

        return $this->successResponse([
            'items' => OrganizationResource::collection($organizations),
            'pagination' => [
                'total' => $organizations->total(),
                'per_page' => $organizations->perPage(),
                'current_page' => $organizations->currentPage(),
                'last_page' => $organizations->lastPage(),
            ],
        ], 'Organizations retrieved successfully.');
    }

    /**
     * Create a new organization with initial owner and subscription.
     */
    public function store(StoreOrganizationRequest $request): JsonResponse
    {
        $organization = $this->organizationService->createOrganizationWithSubscription(
            $request->validated(),
            $request->user()
        );

        return $this->successResponse(
            new OrganizationResource($organization),
            'Organization created successfully.',
            201
        );
    }

    /**
     * Show organization details by UUID.
     */
    public function show(string $uuid): JsonResponse
    {
        $organization = Organization::with([
            'activeSubscription.subscriptionPlan',
            'users',
            'organizationUsers.user',
        ])->where('uuid', $uuid)->first();

        if (! $organization) {
            return $this->errorResponse('Organization not found.', null, 404);
        }

        return $this->successResponse(
            new OrganizationResource($organization),
            'Organization details retrieved successfully.'
        );
    }

    /**
     * Update an organization by UUID.
     */
    public function update(UpdateOrganizationRequest $request, string $uuid): JsonResponse
    {
        $organization = Organization::where('uuid', $uuid)->first();

        if (! $organization) {
            return $this->errorResponse('Organization not found.', null, 404);
        }

        $organization->update($request->validated());

        return $this->successResponse(
            new OrganizationResource($organization->fresh(['activeSubscription.subscriptionPlan'])),
            'Organization updated successfully.'
        );
    }

    /**
     * Activate a suspended or pending organization.
     */
    public function activate(string $uuid): JsonResponse
    {
        $organization = Organization::where('uuid', $uuid)->first();

        if (! $organization) {
            return $this->errorResponse('Organization not found.', null, 404);
        }

        $organization->update([
            'status' => OrganizationStatus::ACTIVE->value,
        ]);

        return $this->successResponse(
            new OrganizationResource($organization->fresh(['activeSubscription.subscriptionPlan'])),
            'Organization activated successfully.'
        );
    }

    /**
     * Suspend an organization.
     */
    public function suspend(string $uuid): JsonResponse
    {
        $organization = Organization::where('uuid', $uuid)->first();

        if (! $organization) {
            return $this->errorResponse('Organization not found.', null, 404);
        }

        $organization->update([
            'status' => OrganizationStatus::SUSPENDED->value,
        ]);

        return $this->successResponse(
            new OrganizationResource($organization->fresh(['activeSubscription.subscriptionPlan'])),
            'Organization suspended successfully.'
        );
    }

    /**
     * Verify or update verification status of an organization.
     */
    public function verify(VerifyOrganizationRequest $request, string $uuid): JsonResponse
    {
        $organization = Organization::where('uuid', $uuid)->first();

        if (! $organization) {
            return $this->errorResponse('Organization not found.', null, 404);
        }

        $status = $request->input('verification_status', VerificationStatus::VERIFIED->value);

        $organization->update([
            'verification_status' => $status,
            'verified_at' => $status === VerificationStatus::VERIFIED->value ? now() : null,
        ]);

        return $this->successResponse(
            new OrganizationResource($organization->fresh(['activeSubscription.subscriptionPlan'])),
            "Organization verification status updated to {$status}."
        );
    }
}
