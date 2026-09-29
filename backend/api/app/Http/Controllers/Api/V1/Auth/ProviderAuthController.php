<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\ProviderLoginRequest;
use App\Http\Requests\Auth\ProviderRegistrationRequest;
use App\Http\Resources\AuthResource;
use App\Http\Traits\ApiResponse;
use App\Services\Auth\AuthService;
use Illuminate\Http\JsonResponse;

class ProviderAuthController extends Controller
{
    use ApiResponse;

    protected AuthService $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    /**
     * Authenticate provider user and return Sanctum token with organization context.
     */
    public function login(ProviderLoginRequest $request): JsonResponse
    {
        $result = $this->authService->authenticateProvider(
            $request->input('email'),
            $request->input('password'),
            $request->input('organization_id'),
            $request->input('device_name', 'provider-portal')
        );

        return $this->successResponse(
            new AuthResource($result),
            'Provider authenticated successfully.'
        );
    }

    /**
     * Public registration for new outdoor advertising providers.
     */
    public function register(ProviderRegistrationRequest $request): JsonResponse
    {
        $result = $this->authService->registerProvider(
            $request->validated(),
            $request->input('device_name', 'provider-portal')
        );

        return $this->successResponse(
            new AuthResource($result),
            'Provider registered successfully.',
            201
        );
    }
}
