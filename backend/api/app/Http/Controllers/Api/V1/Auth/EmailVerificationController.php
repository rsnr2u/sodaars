<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Models\User;
use Illuminate\Auth\Events\Verified;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EmailVerificationController extends Controller
{
    use ApiResponse;

    /**
     * Send email verification notification to authenticated user.
     */
    public function sendNotification(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user->hasVerifiedEmail()) {
            return $this->errorResponse('Email is already verified.', null, 400);
        }

        $user->sendEmailVerificationNotification();

        return $this->successResponse(
            null,
            'Verification link sent to your registered email address.'
        );
    }

    /**
     * Mark email as verified using verification hash and ID.
     */
    public function verify(Request $request, int $id, string $hash): JsonResponse
    {
        $user = User::findOrFail($id);

        if (! hash_equals((string) $hash, sha1($user->getEmailForVerification()))) {
            return $this->errorResponse('Invalid verification link.', null, 403);
        }

        if ($user->hasVerifiedEmail()) {
            return $this->successResponse(null, 'Email is already verified.');
        }

        if ($user->markEmailAsVerified()) {
            event(new Verified($user));
        }

        return $this->successResponse(
            null,
            'Email verified successfully.'
        );
    }
}
