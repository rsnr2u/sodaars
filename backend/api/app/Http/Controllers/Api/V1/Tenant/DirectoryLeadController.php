<?php

namespace App\Http\Controllers\Api\V1\Tenant;

use App\Enums\LeadStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Tenant\UpdateLeadNotesRequest;
use App\Http\Requests\Tenant\UpdateLeadStatusRequest;
use App\Http\Resources\DirectoryLeadResource;
use App\Http\Traits\ApiResponse;
use App\Models\DirectoryLead;
use App\Services\Tenant\TenantContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class DirectoryLeadController extends Controller
{
    use ApiResponse;

    protected TenantContext $tenantContext;

    public function __construct(TenantContext $tenantContext)
    {
        $this->tenantContext = $tenantContext;
    }

    /**
     * List incoming leads for the current tenant.
     */
    public function index(Request $request): JsonResponse
    {
        $organization = $this->tenantContext->getTenant();
        Gate::authorize('viewAny', [DirectoryLead::class, $organization]);

        $query = DirectoryLead::query()
            ->where('organization_id', $organization->id)
            ->with(['advertisingResource', 'location']);

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->query('status'));
        }

        // Filter by resource UUID
        if ($request->filled('resource_uuid')) {
            $resourceUuid = $request->query('resource_uuid');
            $query->where(function ($q) use ($resourceUuid) {
                $q->where('resource_uuid_snapshot', $resourceUuid)
                    ->orWhereHas('advertisingResource', fn($resQ) => $resQ->where('uuid', $resourceUuid));
            });
        }

        // Search in visitor name, company, email, phone
        if ($request->filled('search')) {
            $search = $request->query('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('company_name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        $perPage = min(max((int) $request->query('per_page', 15), 1), 100);
        $leads = $query->orderByDesc('created_at')->paginate($perPage);

        return $this->successResponse([
            'items' => DirectoryLeadResource::collection($leads),
            'pagination' => [
                'total' => $leads->total(),
                'per_page' => $leads->perPage(),
                'current_page' => $leads->currentPage(),
                'last_page' => $leads->lastPage(),
            ],
        ], 'Leads retrieved successfully.');
    }

    /**
     * View lead details including historical snapshots.
     */
    public function show(string $uuid): JsonResponse
    {
        $organization = $this->tenantContext->getTenant();
        $lead = DirectoryLead::query()
            ->where('organization_id', $organization->id)
            ->with(['advertisingResource', 'location'])
            ->where('uuid', $uuid)
            ->firstOrFail();

        Gate::authorize('view', $lead);

        return $this->successResponse(
            new DirectoryLeadResource($lead),
            'Lead details retrieved successfully.'
        );
    }

    /**
     * Update lead status enforcing strict lifecycle transitions:
     * NEW -> CONTACTED | ARCHIVED
     * CONTACTED -> CONVERTED | ARCHIVED
     * CONVERTED & ARCHIVED are terminal (cannot transition out).
     */
    public function updateStatus(UpdateLeadStatusRequest $request, string $uuid): JsonResponse
    {
        $organization = $this->tenantContext->getTenant();
        $lead = DirectoryLead::query()
            ->where('organization_id', $organization->id)
            ->where('uuid', $uuid)
            ->firstOrFail();

        Gate::authorize('update', $lead);

        $currentStatus = $lead->status instanceof LeadStatus
            ? $lead->status
            : LeadStatus::from($lead->status);

        $targetStatus = LeadStatus::from($request->validated('status'));

        if (! $currentStatus->canTransitionTo($targetStatus)) {
            return $this->errorResponse(
                "Invalid status transition from {$currentStatus->value} to {$targetStatus->value}.",
                null,
                422
            );
        }

        $lead->update([
            'status' => $targetStatus->value,
        ]);

        return $this->successResponse(
            new DirectoryLeadResource($lead->fresh(['advertisingResource', 'location'])),
            "Lead status updated to {$targetStatus->value}."
        );
    }

    /**
     * Update internal notes on lead.
     */
    public function updateNotes(UpdateLeadNotesRequest $request, string $uuid): JsonResponse
    {
        $organization = $this->tenantContext->getTenant();
        $lead = DirectoryLead::query()
            ->where('organization_id', $organization->id)
            ->where('uuid', $uuid)
            ->firstOrFail();

        Gate::authorize('update', $lead);

        $lead->update([
            'internal_notes' => $request->validated('internal_notes'),
        ]);

        return $this->successResponse(
            new DirectoryLeadResource($lead->fresh(['advertisingResource', 'location'])),
            'Lead notes updated successfully.'
        );
    }

    /**
     * Soft delete a lead.
     */
    public function destroy(string $uuid): JsonResponse
    {
        $organization = $this->tenantContext->getTenant();
        $lead = DirectoryLead::query()
            ->where('organization_id', $organization->id)
            ->where('uuid', $uuid)
            ->firstOrFail();

        Gate::authorize('delete', $lead);

        $lead->delete();

        return $this->successResponse(
            null,
            'Lead archived/deleted successfully.'
        );
    }
}
