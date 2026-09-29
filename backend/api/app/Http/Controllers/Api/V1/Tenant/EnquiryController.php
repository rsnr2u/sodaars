<?php

namespace App\Http\Controllers\Api\V1\Tenant;

use App\Enums\EnquiryStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Tenant\PlaceEnquiryHoldRequest;
use App\Http\Requests\Tenant\StoreEnquiryRequest;
use App\Http\Requests\Tenant\TransitionEnquiryStatusRequest;
use App\Http\Requests\Tenant\UpdateEnquiryRequest;
use App\Http\Resources\EnquiryResource;
use App\Http\Resources\ResourceScheduleResource;
use App\Http\Traits\ApiResponse;
use App\Models\Enquiry;
use App\Services\Enquiry\EnquiryService;
use App\Services\Tenant\TenantContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class EnquiryController extends Controller
{
    use ApiResponse;

    protected TenantContext $tenantContext;
    protected EnquiryService $enquiryService;

    public function __construct(TenantContext $tenantContext, EnquiryService $enquiryService)
    {
        $this->tenantContext = $tenantContext;
        $this->enquiryService = $enquiryService;
    }

    /**
     * List enquiries for the active tenant.
     */
    public function index(Request $request): JsonResponse
    {
        $organization = $this->tenantContext->getTenant();
        Gate::authorize('viewAny', [Enquiry::class, $organization]);

        $enquiries = $this->enquiryService->listEnquiries($organization, $request->all());

        return $this->successResponse([
            'items' => EnquiryResource::collection($enquiries),
            'pagination' => [
                'total' => $enquiries->total(),
                'per_page' => $enquiries->perPage(),
                'current_page' => $enquiries->currentPage(),
                'last_page' => $enquiries->lastPage(),
            ],
        ], 'Enquiries retrieved successfully.');
    }

    /**
     * Create a new enquiry for the active tenant.
     * Does NOT create inventory holds by default.
     */
    public function store(StoreEnquiryRequest $request): JsonResponse
    {
        $organization = $this->tenantContext->getTenant();
        Gate::authorize('create', [Enquiry::class, $organization]);

        $enquiry = $this->enquiryService->createEnquiry(
            $organization,
            $request->user(),
            $request->validated()
        );

        return $this->successResponse(
            new EnquiryResource($enquiry),
            'Enquiry created successfully.',
            201
        );
    }

    /**
     * Display a specific enquiry with items and details.
     */
    public function show(string $uuid): JsonResponse
    {
        $organization = $this->tenantContext->getTenant();
        $enquiry = Enquiry::where('organization_id', $organization->id)
            ->where('uuid', $uuid)
            ->with(['customer', 'assignedToUser', 'createdByUser', 'items.advertisingResource', 'items.location'])
            ->withCount('schedules')
            ->firstOrFail();

        Gate::authorize('view', $enquiry);

        return $this->successResponse(
            new EnquiryResource($enquiry),
            'Enquiry details retrieved successfully.'
        );
    }

    /**
     * Update an existing enquiry and its items.
     */
    public function update(UpdateEnquiryRequest $request, string $uuid): JsonResponse
    {
        $organization = $this->tenantContext->getTenant();
        $enquiry = Enquiry::where('organization_id', $organization->id)
            ->where('uuid', $uuid)
            ->firstOrFail();

        Gate::authorize('update', $enquiry);

        $updated = $this->enquiryService->updateEnquiry($enquiry, $request->validated());

        return $this->successResponse(
            new EnquiryResource($updated),
            'Enquiry updated successfully.'
        );
    }

    /**
     * Delete an enquiry (soft delete) and auto-release attached tentative holds.
     */
    public function destroy(string $uuid): JsonResponse
    {
        $organization = $this->tenantContext->getTenant();
        $enquiry = Enquiry::where('organization_id', $organization->id)
            ->where('uuid', $uuid)
            ->firstOrFail();

        Gate::authorize('delete', $enquiry);

        $this->enquiryService->deleteEnquiry($enquiry);

        return $this->successResponse(null, 'Enquiry deleted successfully.');
    }

    /**
     * Transition enquiry status with state machine enforcement.
     */
    public function transitionStatus(TransitionEnquiryStatusRequest $request, string $uuid): JsonResponse
    {
        $organization = $this->tenantContext->getTenant();
        $enquiry = Enquiry::where('organization_id', $organization->id)
            ->where('uuid', $uuid)
            ->firstOrFail();

        Gate::authorize('update', $enquiry);

        $newStatus = EnquiryStatus::from($request->input('status'));
        $reason = $request->input('lost_reason');

        $updated = $this->enquiryService->transitionStatus($enquiry, $newStatus, $reason);

        return $this->successResponse(
            new EnquiryResource($updated),
            "Enquiry status transitioned to {$newStatus->value} successfully."
        );
    }

    /**
     * Check availability for all specific resource items in an enquiry.
     */
    public function checkAvailability(string $uuid): JsonResponse
    {
        $organization = $this->tenantContext->getTenant();
        $enquiry = Enquiry::where('organization_id', $organization->id)
            ->where('uuid', $uuid)
            ->with(['items.advertisingResource'])
            ->firstOrFail();

        Gate::authorize('view', $enquiry);

        $results = $this->enquiryService->checkEnquiryAvailability($enquiry);

        return $this->successResponse([
            'enquiry_uuid' => $enquiry->uuid,
            'enquiry_number' => $enquiry->enquiry_number,
            'items_count' => count($results),
            'items' => $results,
        ], 'Enquiry availability evaluated successfully.');
    }

    /**
     * Explicitly place a tentative hold for an enquiry item.
     * Restricted to PROVIDER_OWNER and PROVIDER_MANAGER.
     */
    public function placeHold(PlaceEnquiryHoldRequest $request, string $uuid, string $itemUuid): JsonResponse
    {
        $organization = $this->tenantContext->getTenant();
        $enquiry = Enquiry::where('organization_id', $organization->id)
            ->where('uuid', $uuid)
            ->firstOrFail();

        Gate::authorize('placeHold', $enquiry);

        $item = $enquiry->items()
            ->where('uuid', $itemUuid)
            ->with('advertisingResource')
            ->firstOrFail();

        $hold = $this->enquiryService->placeHoldForItem(
            $enquiry,
            $item,
            $request->user(),
            $request->input('hold_duration_hours')
        );

        return $this->successResponse(
            new ResourceScheduleResource($hold),
            'Tentative hold placed successfully for enquiry item.',
            201
        );
    }
}
