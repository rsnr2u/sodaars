<?php

use App\Http\Controllers\Api\V1\Admin\OrganizationController as AdminOrganizationController;
use App\Http\Controllers\Api\V1\Admin\SubscriptionPlanController as AdminSubscriptionPlanController;
use App\Http\Controllers\Api\V1\Auth\AdminAuthController;
use App\Http\Controllers\Api\V1\Auth\AuthController;
use App\Http\Controllers\Api\V1\Auth\EmailVerificationController;
use App\Http\Controllers\Api\V1\Auth\InvitationAcceptanceController;
use App\Http\Controllers\Api\V1\Auth\PasswordResetController;
use App\Http\Controllers\Api\V1\Auth\ProviderAuthController;
use App\Http\Controllers\Api\V1\Public\PublicDirectoryController;
use App\Http\Controllers\Api\V1\Public\PublicResourceController;
use App\Http\Controllers\Api\V1\SubscriptionPlanController;
use App\Http\Controllers\Api\V1\Tenant\AdvertisingResourceController as TenantAdvertisingResourceController;
use App\Http\Controllers\Api\V1\Tenant\AdvertisingResourceMediaController as TenantAdvertisingResourceMediaController;
use App\Http\Controllers\Api\V1\Tenant\AvailabilityController as TenantAvailabilityController;
use App\Http\Controllers\Api\V1\Tenant\CustomerController as TenantCustomerController;
use App\Http\Controllers\Api\V1\Tenant\DirectoryLeadController as TenantDirectoryLeadController;
use App\Http\Controllers\Api\V1\Tenant\EnquiryController as TenantEnquiryController;
use App\Http\Controllers\Api\V1\Tenant\LocationController as TenantLocationController;
use App\Http\Controllers\Api\V1\Tenant\LocationMediaController as TenantLocationMediaController;
use App\Http\Controllers\Api\V1\Tenant\OrganizationController as TenantOrganizationController;
use App\Http\Controllers\Api\V1\Tenant\ResourceScheduleController as TenantResourceScheduleController;
use App\Http\Controllers\Api\V1\Tenant\OrganizationInvitationController as TenantOrganizationInvitationController;
use App\Http\Controllers\Api\V1\Tenant\OrganizationUserController as TenantOrganizationUserController;
use App\Http\Controllers\Api\V1\Tenant\SubscriptionController as TenantSubscriptionController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Legacy / User profile check
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// API Version 1 Group
Route::prefix('v1')->group(function () {

    // 1. AUTHENTICATION ROUTES
    Route::prefix('auth')->group(function () {
        // Platform Admin Login
        Route::post('/admin/login', [AdminAuthController::class, 'login'])->middleware('throttle:login');

        // Provider Login & Public Registration
        Route::post('/provider/login', [ProviderAuthController::class, 'login'])->middleware('throttle:login');
        Route::post('/provider/register', [ProviderAuthController::class, 'register'])->middleware('throttle:register');

        // Invitation Acceptance
        Route::post('/invitations/accept', [InvitationAcceptanceController::class, 'accept']);

        // Protected Auth Routes
        Route::middleware('auth:sanctum')->group(function () {
            Route::get('/me', [AuthController::class, 'me']);
            Route::post('/logout', [AuthController::class, 'logout']);
            Route::post('/email/verification-notification', [EmailVerificationController::class, 'sendNotification'])
                ->middleware('throttle:6,1');
        });

        // Email Verification
        Route::get('/email/verify/{id}/{hash}', [EmailVerificationController::class, 'verify'])
            ->name('verification.verify');

        // Password Reset
        Route::post('/password/forgot', [PasswordResetController::class, 'forgotPassword'])
            ->middleware('throttle:password-reset');
        Route::post('/password/reset', [PasswordResetController::class, 'resetPassword'])
            ->middleware('throttle:password-reset')
            ->name('password.reset');
    });

    // 2. PUBLIC ROUTES
    Route::get('/subscription-plans', [SubscriptionPlanController::class, 'index']);
    Route::get('/subscription-plans/{slug}', [SubscriptionPlanController::class, 'show']);

    // Public Directory & Inventory Discovery (Stage 10)
    Route::prefix('public')->group(function () {
        Route::get('/directory/overview', [PublicDirectoryController::class, 'overview'])
            ->middleware('throttle:60,1');
        Route::get('/providers', [PublicDirectoryController::class, 'providers'])
            ->middleware('throttle:60,1');
        Route::get('/providers/{slug}', [PublicDirectoryController::class, 'providerProfile'])
            ->middleware('throttle:60,1');
        Route::get('/providers/{slug}/inventory', [PublicDirectoryController::class, 'providerInventory'])
            ->middleware('throttle:60,1');
        Route::post('/providers/{slug}/contact', [PublicDirectoryController::class, 'contactProvider'])
            ->middleware('throttle:5,10');

        Route::get('/resources', [PublicResourceController::class, 'index'])
            ->middleware('throttle:60,1');
        Route::get('/resources/map', [PublicResourceController::class, 'map'])
            ->middleware('throttle:60,1');
        Route::get('/resources/{slugOrUuid}', [PublicResourceController::class, 'show'])
            ->middleware('throttle:60,1');
        Route::post('/resources/{slugOrUuid}/contact', [PublicResourceController::class, 'contact'])
            ->middleware('throttle:5,10');
    });

    // 3. ADMIN ROUTES (Platform Administration)
    Route::prefix('admin')->middleware(['auth:sanctum', 'platform.role:SUPER_ADMIN,ADMIN,STAFF'])->group(function () {
        Route::get('/organizations', [AdminOrganizationController::class, 'index']);
        Route::post('/organizations', [AdminOrganizationController::class, 'store']);
        Route::get('/organizations/{uuid}', [AdminOrganizationController::class, 'show']);
        Route::put('/organizations/{uuid}', [AdminOrganizationController::class, 'update']);
        Route::post('/organizations/{uuid}/activate', [AdminOrganizationController::class, 'activate']);
        Route::post('/organizations/{uuid}/suspend', [AdminOrganizationController::class, 'suspend']);
        Route::post('/organizations/{uuid}/verify', [AdminOrganizationController::class, 'verify']);

        Route::get('/subscription-plans', [AdminSubscriptionPlanController::class, 'index']);
        Route::post('/subscription-plans', [AdminSubscriptionPlanController::class, 'store']);
        Route::put('/subscription-plans/{id}', [AdminSubscriptionPlanController::class, 'update']);
    });

    // 4. TENANT ROUTES (Provider SaaS)
    Route::prefix('tenant')->middleware(['auth:sanctum', 'tenant'])->group(function () {
        Route::get('/organization', [TenantOrganizationController::class, 'show']);
        Route::put('/organization', [TenantOrganizationController::class, 'update']);
        Route::put('/organization/settings', [TenantOrganizationController::class, 'updateSettings']);
        Route::put('/organization/visibility', [TenantOrganizationController::class, 'updateVisibility']);

        Route::get('/users', [TenantOrganizationUserController::class, 'index']);
        Route::post('/users', [TenantOrganizationUserController::class, 'store']);
        Route::put('/users/{id}/role', [TenantOrganizationUserController::class, 'updateRole']);
        Route::delete('/users/{id}', [TenantOrganizationUserController::class, 'destroy']);

        Route::get('/invitations', [TenantOrganizationInvitationController::class, 'index']);
        Route::post('/invitations', [TenantOrganizationInvitationController::class, 'store']);
        Route::delete('/invitations/{uuid}', [TenantOrganizationInvitationController::class, 'destroy']);

        // Locations
        Route::get('/locations', [TenantLocationController::class, 'index']);
        Route::post('/locations', [TenantLocationController::class, 'store']);
        Route::get('/locations/{uuid}', [TenantLocationController::class, 'show']);
        Route::put('/locations/{uuid}', [TenantLocationController::class, 'update']);
        Route::delete('/locations/{uuid}', [TenantLocationController::class, 'destroy']);

        // Location Media (Stage 9)
        Route::get('/locations/{locationUuid}/media', [TenantLocationMediaController::class, 'index']);
        Route::post('/locations/{locationUuid}/media', [TenantLocationMediaController::class, 'store']);
        Route::put('/locations/{locationUuid}/media/reorder', [TenantLocationMediaController::class, 'reorder']);
        Route::get('/locations/{locationUuid}/media/{mediaUuid}', [TenantLocationMediaController::class, 'show']);
        Route::put('/locations/{locationUuid}/media/{mediaUuid}', [TenantLocationMediaController::class, 'update']);
        Route::delete('/locations/{locationUuid}/media/{mediaUuid}', [TenantLocationMediaController::class, 'destroy']);

        // Advertising Resources
        Route::get('/advertising-resources', [TenantAdvertisingResourceController::class, 'index']);
        Route::post('/advertising-resources', [TenantAdvertisingResourceController::class, 'store']);
        Route::get('/advertising-resources/{uuid}', [TenantAdvertisingResourceController::class, 'show']);
        Route::put('/advertising-resources/{uuid}', [TenantAdvertisingResourceController::class, 'update']);
        Route::delete('/advertising-resources/{uuid}', [TenantAdvertisingResourceController::class, 'destroy']);

        // Advertising Resource Media (Stage 9)
        Route::get('/advertising-resources/{resourceUuid}/media', [TenantAdvertisingResourceMediaController::class, 'index']);
        Route::post('/advertising-resources/{resourceUuid}/media', [TenantAdvertisingResourceMediaController::class, 'store']);
        Route::put('/advertising-resources/{resourceUuid}/media/reorder', [TenantAdvertisingResourceMediaController::class, 'reorder']);
        Route::get('/advertising-resources/{resourceUuid}/media/{mediaUuid}', [TenantAdvertisingResourceMediaController::class, 'show']);
        Route::put('/advertising-resources/{resourceUuid}/media/{mediaUuid}', [TenantAdvertisingResourceMediaController::class, 'update']);
        Route::delete('/advertising-resources/{resourceUuid}/media/{mediaUuid}', [TenantAdvertisingResourceMediaController::class, 'destroy']);

        // Availability Engine & Calendar Matrix
        Route::post('/availability/check', [TenantAvailabilityController::class, 'check']);
        Route::get('/advertising-resources/{uuid}/calendar', [TenantAvailabilityController::class, 'calendar']);

        // Resource Schedules & Holds
        Route::get('/resource-schedules', [TenantResourceScheduleController::class, 'index']);
        Route::post('/resource-schedules', [TenantResourceScheduleController::class, 'store']);
        Route::get('/resource-schedules/{uuid}', [TenantResourceScheduleController::class, 'show']);
        Route::put('/resource-schedules/{uuid}', [TenantResourceScheduleController::class, 'update']);
        Route::delete('/resource-schedules/{uuid}', [TenantResourceScheduleController::class, 'destroy']);
        Route::post('/resource-schedules/{uuid}/release', [TenantResourceScheduleController::class, 'release']);
        Route::post('/resource-schedules/{uuid}/extend', [TenantResourceScheduleController::class, 'extend']);
        Route::post('/resource-schedules/{uuid}/confirm', [TenantResourceScheduleController::class, 'confirm']);

        // Customers Management
        Route::get('/customers', [TenantCustomerController::class, 'index']);
        Route::post('/customers', [TenantCustomerController::class, 'store']);
        Route::get('/customers/{uuid}', [TenantCustomerController::class, 'show']);
        Route::put('/customers/{uuid}', [TenantCustomerController::class, 'update']);
        Route::delete('/customers/{uuid}', [TenantCustomerController::class, 'destroy']);

        // Enquiries Management
        Route::get('/enquiries', [TenantEnquiryController::class, 'index']);
        Route::post('/enquiries', [TenantEnquiryController::class, 'store']);
        Route::get('/enquiries/{uuid}', [TenantEnquiryController::class, 'show']);
        Route::put('/enquiries/{uuid}', [TenantEnquiryController::class, 'update']);
        Route::delete('/enquiries/{uuid}', [TenantEnquiryController::class, 'destroy']);
        Route::post('/enquiries/{uuid}/status', [TenantEnquiryController::class, 'transitionStatus']);
        Route::post('/enquiries/{uuid}/check-availability', [TenantEnquiryController::class, 'checkAvailability']);
        Route::post('/enquiries/{uuid}/items/{itemUuid}/hold', [TenantEnquiryController::class, 'placeHold']);

        // Directory Leads Management (Stage 10)
        Route::get('/leads', [TenantDirectoryLeadController::class, 'index']);
        Route::get('/leads/{uuid}', [TenantDirectoryLeadController::class, 'show']);
        Route::put('/leads/{uuid}/status', [TenantDirectoryLeadController::class, 'updateStatus']);
        Route::put('/leads/{uuid}/notes', [TenantDirectoryLeadController::class, 'updateNotes']);
        Route::delete('/leads/{uuid}', [TenantDirectoryLeadController::class, 'destroy']);

        Route::get('/subscription', [TenantSubscriptionController::class, 'show']);
    });
});
