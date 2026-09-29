<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\AcceptInvitationRequest;
use App\Http\Resources\AuthResource;
use App\Http\Traits\ApiResponse;
use App\Services\InvitationService;
use Illuminate\Http\JsonResponse;

class InvitationAcceptanceController extends Controller
{
    use ApiResponse;

    protected InvitationService $invitationService;

    public function __construct(InvitationService $invitationService)
    {
        $this->invitationService = $invitationService;
    }

    /**
     * Accept an organization staff invitation.
     */
    public function accept(AcceptInvitationRequest $request): JsonResponse
    {
        $result = $this->invitationService->acceptInvitation(
            $request->input('token'),
            $request->validated()
        );

        return $this->successResponse(
            new AuthResource($result),
            'Invitation accepted successfully. You are now a member of ' . $result['organization']->name . '.'
        );
    }
}
