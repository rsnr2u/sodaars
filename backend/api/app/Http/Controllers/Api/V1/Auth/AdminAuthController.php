<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\AdminLoginRequest;
use App\Http\Resources\AuthResource;
use App\Http\Traits\ApiResponse;
use App\Services\Auth\AuthService;
use Illuminate\Http\JsonResponse;

class AdminAuthController extends Controller
{
    use ApiResponse;

    protected AuthService $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    /**
     * Authenticate platform administrator and return Sanctum token.
     */
    public function login(AdminLoginRequest $request): JsonResponse
    {
        $result = $this->authService->authenticatePlatformAdmin(
            $request->input('email'),
            $request->input('password'),
            $request->input('device_name', 'admin-portal')
        );

        return $this->successResponse(
            new AuthResource($result),
            'Administrator authenticated successfully.'
        );
    }
}
