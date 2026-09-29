<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Enums\MembershipStatus;
use App\Http\Controllers\Controller;
use App\Http\Resources\OrganizationResource;
use App\Http\Resources\OrganizationUserResource;
use App\Http\Resources\UserResource;
use App\Http\Traits\ApiResponse;
use App\Models\OrganizationUser;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    use ApiResponse;

    /**
     * Get details of currently authenticated user and their organization context.
     */
    public function me(Request $request): JsonResponse
    {
        $user = $request->user();

        // Load active memberships with organizations
        $memberships = OrganizationUser::where('user_id', $user->id)
            ->where('status', MembershipStatus::ACTIVE->value)
            ->with(['organization.activeSubscription.subscriptionPlan'])
            ->get();

        $defaultMembership = $memberships->firstWhere('is_default', true) ?? $memberships->first();

        return $this->successResponse([
            'user' => new UserResource($user),
            'platform_role' => $user->platform_role,
            'is_platform_user' => $user->isPlatformUser(),
            'memberships' => OrganizationUserResource::collection($memberships),
            'current_organization' => $defaultMembership?->organization ? new OrganizationResource($defaultMembership->organization) : null,
            'provider_role' => $defaultMembership?->role,
            'status' => $user->status,
            'email_verified' => $user->hasVerifiedEmail(),
        ], 'Authenticated user profile retrieved successfully.');
    }

    /**
     * Revoke the current authenticated user's access token.
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return $this->successResponse(
            null,
            'Successfully logged out.'
        );
    }
}
