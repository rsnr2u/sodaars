<?php

namespace App\Http\Controllers\Api\V1\Tenant;

use App\Http\Controllers\Controller;
use App\Http\Requests\Tenant\CheckAvailabilityRequest;
use App\Http\Traits\ApiResponse;
use App\Models\AdvertisingResource;
use App\Services\Availability\AvailabilityService;
use App\Services\Tenant\TenantContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class AvailabilityController extends Controller
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
     * Check resource availability and slot capacity for a requested date range.
     */
    public function check(CheckAvailabilityRequest $request): JsonResponse
    {
        $organization = $this->tenantContext->getTenant();
        $validated = $request->validated();

        $resource = AdvertisingResource::where('organization_id', $organization->id)
            ->where('uuid', $validated['resource_uuid'])
            ->firstOrFail();

        Gate::authorize('view', $resource);

        $slotsCount = (int) ($validated['slots_count'] ?? 1);

        $result = $this->availabilityService->checkAvailability(
            $resource,
            $validated['start_date'],
            $validated['end_date'],
            $slotsCount
        );

        return $this->successResponse($result, 'Availability checked successfully.');
    }

    /**
     * Retrieve a monthly calendar matrix for an advertising resource.
     */
    public function calendar(Request $request, string $resourceUuid): JsonResponse
    {
        $organization = $this->tenantContext->getTenant();

        $resource = AdvertisingResource::where('organization_id', $organization->id)
            ->where('uuid', $resourceUuid)
            ->firstOrFail();

        Gate::authorize('view', $resource);

        $year = (int) $request->input('year', now()->year);
        $month = (int) $request->input('month', now()->month);

        if ($month < 1 || $month > 12) {
            $month = (int) now()->month;
        }

        $calendar = $this->availabilityService->getMonthlyCalendar($resource, $year, $month);

        return $this->successResponse($calendar, 'Monthly calendar retrieved successfully.');
    }
}
