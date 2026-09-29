<?php

namespace App\Http\Middleware;

use App\Http\Traits\ApiResponse;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsurePlatformRole
{
    use ApiResponse;

    /**
     * Handle an incoming request.
     *
     * @param  string  ...$roles
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (! $user) {
            return $this->errorResponse('Unauthenticated.', null, 401);
        }

        if (! $user->platform_role || (! empty($roles) && ! in_array($user->platform_role, $roles))) {
            return $this->errorResponse('You do not have permission to access platform administrative resources.', null, 403);
        }

        return $next($request);
    }
}
