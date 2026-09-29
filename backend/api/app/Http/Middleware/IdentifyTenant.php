<?php

namespace App\Http\Middleware;

use App\Enums\MembershipStatus;
use App\Enums\OrganizationStatus;
use App\Http\Traits\ApiResponse;
use App\Models\Organization;
use App\Models\OrganizationUser;
use App\Services\Tenant\TenantContext;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class IdentifyTenant
{
    use ApiResponse;

    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user) {
            return $this->errorResponse('Unauthenticated.', null, 401);
        }

        $tenantContext = app(TenantContext::class);
        $orgHeader = $request->header('X-Organization-Id');

        $membershipQuery = OrganizationUser::where('user_id', $user->id)
            ->where('status', MembershipStatus::ACTIVE->value);

        if ($orgHeader) {
            // Find organization by numeric ID or UUID
            $targetOrg = Organization::where(function ($q) use ($orgHeader) {
                if (is_numeric($orgHeader)) {
                    $q->where('id', $orgHeader);
                } else {
                    $q->where('uuid', $orgHeader);
                }
            })->first();

            if (! $targetOrg) {
                return $this->errorResponse('Requested organization not found.', null, 404);
            }

            $membership = $membershipQuery->where('organization_id', $targetOrg->id)->first();

            if (! $membership) {
                return $this->errorResponse('Access to this organization is unauthorized.', null, 403);
            }

            $organization = $targetOrg;
        } else {
            // Default active organization membership for user
            $membership = (clone $membershipQuery)->where('is_default', true)->first()
                ?? $membershipQuery->first();

            if (! $membership) {
                return $this->errorResponse('No active organization membership found for this user.', null, 403);
            }

            $organization = Organization::find($membership->organization_id);
        }

        if (! $organization) {
            return $this->errorResponse('Organization not found.', null, 404);
        }

        if ($organization->status === OrganizationStatus::SUSPENDED->value || $organization->status === OrganizationStatus::INACTIVE->value) {
            return $this->errorResponse('This organization account is currently inactive or suspended.', null, 403);
        }

        $tenantContext->setTenant($organization);
        $request->attributes->set('tenant', $organization);
        $request->attributes->set('membership', $membership);

        return $next($request);
    }
}
