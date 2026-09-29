<?php

namespace App\Http\Controllers\Api\V1\Tenant;

use App\Enums\MembershipStatus;
use App\Enums\UserStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Tenant\ChangeUserRoleRequest;
use App\Http\Requests\Tenant\StoreOrganizationUserRequest;
use App\Http\Resources\OrganizationUserResource;
use App\Http\Traits\ApiResponse;
use App\Models\OrganizationUser;
use App\Models\User;
use App\Services\Tenant\TenantContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class OrganizationUserController extends Controller
{
    use ApiResponse;

    protected TenantContext $tenantContext;

    public function __construct(TenantContext $tenantContext)
    {
        $this->tenantContext = $tenantContext;
    }

    /**
     * List users belonging to the active organization.
     */
    public function index(Request $request): JsonResponse
    {
        $organization = $this->tenantContext->getTenant();
        Gate::authorize('viewAny', [OrganizationUser::class, $organization]);

        $members = OrganizationUser::where('organization_id', $organization->id)
            ->with('user')
            ->get();

        return $this->successResponse(
            OrganizationUserResource::collection($members),
            'Organization users retrieved successfully.'
        );
    }

    /**
     * Add or invite a user to the active organization.
     */
    public function store(StoreOrganizationUserRequest $request): JsonResponse
    {
        $organization = $this->tenantContext->getTenant();
        Gate::authorize('create', [OrganizationUser::class, $organization]);

        $data = $request->validated();

        $user = User::where('email', $data['email'])->first();

        if (! $user) {
            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'phone' => $data['phone'] ?? null,
                'password' => Hash::make($data['password'] ?? Str::random(16)),
                'status' => UserStatus::ACTIVE->value,
                'platform_role' => null,
            ]);
        }

        $existingMembership = OrganizationUser::where('organization_id', $organization->id)
            ->where('user_id', $user->id)
            ->first();

        if ($existingMembership) {
            return $this->errorResponse('This user is already a member of this organization.', null, 422);
        }

        $membership = OrganizationUser::create([
            'organization_id' => $organization->id,
            'user_id' => $user->id,
            'role' => $data['role'],
            'status' => MembershipStatus::ACTIVE->value,
            'is_default' => false,
            'joined_at' => now(),
        ]);

        return $this->successResponse(
            new OrganizationUserResource($membership->load('user')),
            'User added to organization successfully.',
            201
        );
    }

    /**
     * Update a user's role within the active organization.
     */
    public function updateRole(ChangeUserRoleRequest $request, int $id): JsonResponse
    {
        $organization = $this->tenantContext->getTenant();
        $membership = OrganizationUser::where('organization_id', $organization->id)
            ->where('id', $id)
            ->first();

        if (! $membership) {
            return $this->errorResponse('Organization member not found.', null, 404);
        }

        $newRole = $request->input('role');

        Gate::authorize('updateRole', [$membership, $newRole]);

        $membership->update(['role' => $newRole]);

        return $this->successResponse(
            new OrganizationUserResource($membership->fresh('user')),
            'Member role updated successfully.'
        );
    }

    /**
     * Remove a user from the active organization.
     */
    public function destroy(int $id): JsonResponse
    {
        $organization = $this->tenantContext->getTenant();
        $membership = OrganizationUser::where('organization_id', $organization->id)
            ->where('id', $id)
            ->first();

        if (! $membership) {
            return $this->errorResponse('Organization member not found.', null, 404);
        }

        Gate::authorize('delete', $membership);

        $membership->delete();

        return $this->successResponse(null, 'User removed from organization successfully.');
    }
}
