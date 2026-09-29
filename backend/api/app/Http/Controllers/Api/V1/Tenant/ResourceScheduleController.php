<?php

namespace App\Http\Controllers\Api\V1\Tenant;

use App\Http\Controllers\Controller;
use App\Http\Requests\Tenant\ExtendHoldRequest;
use App\Http\Requests\Tenant\StoreResourceScheduleRequest;
use App\Http\Requests\Tenant\UpdateResourceScheduleRequest;
use App\Http\Resources\ResourceScheduleResource;
use App\Http\Traits\ApiResponse;
use App\Models\ResourceSchedule;
use App\Services\Availability\AvailabilityService;
use App\Services\Tenant\TenantContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class ResourceScheduleController extends Controller
{
    use ApiResponse;

    protected TenantContext $tenantContext;
    protected AvailabilityService $availabilityService;

    public function __construct(TenantContext $tenantContext, AvailabilityService $availabilityService)
    {
        $this->tenantContext = $tenantContext;
        $this->availabilityService = $availabilityService;
    }

    /**
     * List schedules belonging to the active tenant.
     */
    public function index(Request $request): JsonResponse
    {
        $organization = $this->tenantContext->getTenant();
        Gate::authorize('viewAny', [ResourceSchedule::class, $organization]);

        $schedules = $this->availabilityService->listSchedules($organization, $request->all());

        return $this->successResponse([
            'items' => ResourceScheduleResource::collection($schedules),
            'pagination' => [
                'total' => $schedules->total(),
                'per_page' => $schedules->perPage(),
                'current_page' => $schedules->currentPage(),
                'last_page' => $schedules->lastPage(),
            ],
        ], 'Resource schedules retrieved successfully.');
    }

    /**
     * Create a new schedule block or reservation for the active tenant.
     */
    public function store(StoreResourceScheduleRequest $request): JsonResponse
    {
        $organization = $this->tenantContext->getTenant();
        Gate::authorize('create', [ResourceSchedule::class, $organization]);

        $schedule = $this->availabilityService->createScheduleBlock(
            $organization,
            $request->user(),
            $request->validated()
        );

        return $this->successResponse(
            new ResourceScheduleResource($schedule),
            'Resource schedule created successfully.',
            201
        );
    }

    /**
     * Display schedule details by UUID.
     */
    public function show(string $uuid): JsonResponse
    {
        $schedule = ResourceSchedule::where('uuid', $uuid)
            ->with(['advertisingResource.location', 'createdByUser'])
            ->first();

        if (! $schedule) {
            return $this->errorResponse('Resource schedule not found.', null, 404);
        }

        Gate::authorize('view', $schedule);

        return $this->successResponse(
            new ResourceScheduleResource($schedule),
            'Resource schedule details retrieved successfully.'
        );
    }

    /**
     * Update an existing schedule block by UUID.
     */
    public function update(UpdateResourceScheduleRequest $request, string $uuid): JsonResponse
    {
        $schedule = ResourceSchedule::where('uuid', $uuid)->first();

        if (! $schedule) {
            return $this->errorResponse('Resource schedule not found.', null, 404);
        }

        Gate::authorize('update', $schedule);

        $updated = $this->availabilityService->updateScheduleBlock($schedule, $request->validated());

        return $this->successResponse(
            new ResourceScheduleResource($updated),
            'Resource schedule updated successfully.'
        );
    }

    /**
     * Delete/remove a schedule block by UUID.
     */
    public function destroy(string $uuid): JsonResponse
    {
        $schedule = ResourceSchedule::where('uuid', $uuid)->first();

        if (! $schedule) {
            return $this->errorResponse('Resource schedule not found.', null, 404);
        }

        Gate::authorize('delete', $schedule);

        $this->availabilityService->deleteScheduleBlock($schedule);

        return $this->successResponse(null, 'Resource schedule deleted successfully.');
    }

    /**
     * Release/cancel a schedule block or tentative hold.
     */
    public function release(string $uuid): JsonResponse
    {
        $schedule = ResourceSchedule::where('uuid', $uuid)->first();

        if (! $schedule) {
            return $this->errorResponse('Resource schedule not found.', null, 404);
        }

        Gate::authorize('release', $schedule);

        $released = $this->availabilityService->releaseScheduleBlock($schedule);

        return $this->successResponse(
            new ResourceScheduleResource($released),
            'Resource schedule released successfully.'
        );
    }

    /**
     * Extend a tentative hold's expiration date.
     */
    public function extend(ExtendHoldRequest $request, string $uuid): JsonResponse
    {
        $schedule = ResourceSchedule::where('uuid', $uuid)->first();

        if (! $schedule) {
            return $this->errorResponse('Resource schedule not found.', null, 404);
        }

        Gate::authorize('extend', $schedule);

        $extended = $this->availabilityService->extendHold($schedule, $request->input('hold_expires_at'));

        return $this->successResponse(
            new ResourceScheduleResource($extended),
            'Tentative hold extended successfully.'
        );
    }

    /**
     * Confirm a tentative hold into a confirmed booking.
     */
    public function confirm(string $uuid): JsonResponse
    {
        $schedule = ResourceSchedule::where('uuid', $uuid)->first();

        if (! $schedule) {
            return $this->errorResponse('Resource schedule not found.', null, 404);
        }

        Gate::authorize('confirm', $schedule);

        $confirmed = $this->availabilityService->confirmHold($schedule);

        return $this->successResponse(
            new ResourceScheduleResource($confirmed),
            'Tentative hold confirmed into booking successfully.'
        );
    }
}
