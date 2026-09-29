<?php

namespace App\Providers;

use App\Services\Tenant\TenantContext;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(TenantContext::class, function () {
            return new TenantContext();
        });

        $this->app->bind(
            \App\Contracts\MediaStorageInterface::class,
            \App\Services\Media\MediaStorageService::class
        );
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        \Illuminate\Support\Facades\Gate::policy(\App\Models\Organization::class, \App\Policies\OrganizationPolicy::class);
        \Illuminate\Support\Facades\Gate::policy(\App\Models\OrganizationUser::class, \App\Policies\OrganizationUserPolicy::class);
        \Illuminate\Support\Facades\Gate::policy(\App\Models\OrganizationInvitation::class, \App\Policies\OrganizationInvitationPolicy::class);
        \Illuminate\Support\Facades\Gate::policy(\App\Models\Location::class, \App\Policies\LocationPolicy::class);
        \Illuminate\Support\Facades\Gate::policy(\App\Models\AdvertisingResource::class, \App\Policies\AdvertisingResourcePolicy::class);
        \Illuminate\Support\Facades\Gate::policy(\App\Models\ResourceSchedule::class, \App\Policies\ResourceSchedulePolicy::class);
        \Illuminate\Support\Facades\Gate::policy(\App\Models\Customer::class, \App\Policies\CustomerPolicy::class);
        \Illuminate\Support\Facades\Gate::policy(\App\Models\Enquiry::class, \App\Policies\EnquiryPolicy::class);
        \Illuminate\Support\Facades\Gate::policy(\App\Models\LocationMedia::class, \App\Policies\LocationMediaPolicy::class);
        \Illuminate\Support\Facades\Gate::policy(\App\Models\AdvertisingResourceMedia::class, \App\Policies\AdvertisingResourceMediaPolicy::class);
        // Rate limiter for admin and provider login (5 attempts per minute per email + IP)
        RateLimiter::for('login', function (Request $request) {
            $email = (string) $request->input('email');

            return Limit::perMinute(5)->by($email.$request->ip())->response(function (Request $request, array $headers) {
                return response()->json([
                    'success' => false,
                    'message' => 'Too many login attempts. Please try again in 1 minute.',
                ], 429, $headers);
            });
        });

        // Rate limiter for public provider registration (5 attempts per minute per IP)
        RateLimiter::for('register', function (Request $request) {
            return Limit::perMinute(5)->by($request->ip())->response(function (Request $request, array $headers) {
                return response()->json([
                    'success' => false,
                    'message' => 'Too many registration attempts. Please try again later.',
                ], 429, $headers);
            });
        });

        // Rate limiter for password reset requests (3 attempts per minute per email + IP)
        RateLimiter::for('password-reset', function (Request $request) {
            $email = (string) $request->input('email');

            return Limit::perMinute(3)->by($email.$request->ip())->response(function (Request $request, array $headers) {
                return response()->json([
                    'success' => false,
                    'message' => 'Too many password reset requests. Please try again later.',
                ], 429, $headers);
            });
        });

        // Configure frontend URL for password reset notifications
        \Illuminate\Auth\Notifications\ResetPassword::createUrlUsing(function (object $notifiable, string $token) {
            $frontendUrl = env('FRONTEND_PROVIDER_URL', 'http://localhost:5173');

            return "{$frontendUrl}/reset-password?token={$token}&email=".urlencode($notifiable->getEmailForPasswordReset());
        });
    }
}
