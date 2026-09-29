<?php

namespace App\Http\Controllers\Api\V1\Tenant;

use App\Http\Controllers\Controller;
use App\Http\Requests\Tenant\InviteStaffRequest;
use App\Http\Resources\OrganizationInvitationResource;
use App\Http\Traits\ApiResponse;
use App\Models\OrganizationInvitation;
use App\Services\InvitationService;
use App\Services\Tenant\TenantContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class OrganizationInvitationController extends Controller
{
    use ApiResponse;

    protected TenantContext $tenantContext;
    protected InvitationService $invitationService;

    public function __construct(TenantContext $tenantContext, InvitationService $invitationService)
    {
        $this->tenantContext = $tenantContext;
        $this->invitationService = $invitationService;
    }

    /**
     * List all staff invitations for active organization.
     */
    public function index(Request $request): JsonResponse
    {
        $organization = $this->tenantContext->getTenant();
        Gate::authorize('viewAny', [OrganizationInvitation::class, $organization]);

        $invitations = OrganizationInvitation::where('organization_id', $organization->id)
            ->with('invitedBy')
            ->latest()
            ->get();

        return $this->successResponse(
            OrganizationInvitationResource::collection($invitations),
            'Staff invitations retrieved successfully.'
        );
    }

    /**
     * Create and send a new staff invitation.
     */
    public function store(InviteStaffRequest $request): JsonResponse
    {
        $organization = $this->tenantContext->getTenant();
        Gate::authorize('create', [OrganizationInvitation::class, $organization, $request->input('role')]);

        $result = $this->invitationService->createInvitation(
            $organization,
            $request->user(),
            $request->validated()
        );

        return $this->successResponse(
            new OrganizationInvitationResource($result['invitation']),
            'Staff invitation created and sent successfully.',
            201
        );
    }

    /**
     * Revoke a staff invitation by UUID.
     */
    public function destroy(string $uuid): JsonResponse
    {
        $organization = $this->tenantContext->getTenant();

        $invitation = OrganizationInvitation::where('organization_id', $organization->id)
            ->where('uuid', $uuid)
            ->first();

        if (! $invitation) {
            return $this->errorResponse('Invitation not found.', null, 404);
        }

        Gate::authorize('delete', $invitation);

        $this->invitationService->revokeInvitation($organization, $uuid);

        return $this->successResponse(null, 'Staff invitation revoked successfully.');
    }
}
