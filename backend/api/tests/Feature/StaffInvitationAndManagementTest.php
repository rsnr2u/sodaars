<?php

namespace Tests\Feature;

use App\Enums\InvitationStatus;
use App\Enums\MembershipStatus;
use App\Enums\OrganizationStatus;
use App\Enums\PlatformRole;
use App\Enums\ProviderRole;
use App\Enums\VerificationStatus;
use App\Models\Organization;
use App\Models\OrganizationInvitation;
use App\Models\OrganizationUser;
use App\Models\User;
use App\Services\InvitationService;
use App\Services\Permission\PermissionService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class StaffInvitationAndManagementTest extends TestCase
{
    use RefreshDatabase;

    protected Organization $orgA;
    protected Organization $orgB;
    protected User $ownerA;
    protected User $managerA;
    protected User $staffA;
    protected OrganizationUser $ownerAMembership;
    protected OrganizationUser $managerAMembership;
    protected OrganizationUser $staffAMembership;

    protected User $adminUser;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
        Notification::fake();

        // Admin User
        $this->adminUser = User::factory()->create([
            'email' => 'admin@sodaars.com',
            'platform_role' => PlatformRole::ADMIN->value,
        ]);

        // Organization A
        $this->orgA = Organization::create([
            'name' => 'Metro Hoardings Pvt Ltd',
            'slug' => 'metro-hoardings',
            'status' => OrganizationStatus::ACTIVE->value,
            'verification_status' => VerificationStatus::PENDING->value,
        ]);

        // Owner A
        $this->ownerA = User::factory()->create([
            'email' => 'owner@metro.com',
            'password' => Hash::make('Secret123!'),
            'platform_role' => null,
        ]);
        $this->ownerAMembership = OrganizationUser::create([
            'organization_id' => $this->orgA->id,
            'user_id' => $this->ownerA->id,
            'role' => ProviderRole::PROVIDER_OWNER->value,
            'status' => MembershipStatus::ACTIVE->value,
            'is_default' => true,
        ]);

        // Manager A
        $this->managerA = User::factory()->create([
            'email' => 'manager@metro.com',
            'password' => Hash::make('Secret123!'),
            'platform_role' => null,
        ]);
        $this->managerAMembership = OrganizationUser::create([
            'organization_id' => $this->orgA->id,
            'user_id' => $this->managerA->id,
            'role' => ProviderRole::PROVIDER_MANAGER->value,
            'status' => MembershipStatus::ACTIVE->value,
            'is_default' => true,
        ]);

        // Staff A
        $this->staffA = User::factory()->create([
            'email' => 'staff@metro.com',
            'password' => Hash::make('Secret123!'),
            'platform_role' => null,
        ]);
        $this->staffAMembership = OrganizationUser::create([
            'organization_id' => $this->orgA->id,
            'user_id' => $this->staffA->id,
            'role' => ProviderRole::PROVIDER_STAFF->value,
            'status' => MembershipStatus::ACTIVE->value,
            'is_default' => true,
        ]);

        // Organization B (for isolation testing)
        $this->orgB = Organization::create([
            'name' => 'City Lights Media',
            'slug' => 'city-lights',
            'status' => OrganizationStatus::ACTIVE->value,
        ]);
    }

    /**
     * 1. Owner can invite Manager.
     */
    public function test_owner_can_invite_manager(): void
    {
        Sanctum::actingAs($this->ownerA);

        $response = $this->postJson('/api/v1/tenant/invitations', [
            'name' => 'New Operations Manager',
            'email' => 'newmanager@metro.com',
            'phone' => '+919876543210',
            'role' => ProviderRole::PROVIDER_MANAGER->value,
        ]);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'data' => [
                    'email' => 'newmanager@metro.com',
                    'role' => ProviderRole::PROVIDER_MANAGER->value,
                    'status' => InvitationStatus::PENDING->value,
                ],
            ]);

        $this->assertDatabaseHas('organization_invitations', [
            'organization_id' => $this->orgA->id,
            'email' => 'newmanager@metro.com',
            'role' => ProviderRole::PROVIDER_MANAGER->value,
            'status' => InvitationStatus::PENDING->value,
        ]);
    }

    /**
     * 2. Owner can invite Staff.
     */
    public function test_owner_can_invite_staff(): void
    {
        Sanctum::actingAs($this->ownerA);

        $response = $this->postJson('/api/v1/tenant/invitations', [
            'name' => 'Field Technician',
            'email' => 'tech@metro.com',
            'role' => ProviderRole::PROVIDER_STAFF->value,
        ]);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'data' => [
                    'email' => 'tech@metro.com',
                    'role' => ProviderRole::PROVIDER_STAFF->value,
                    'status' => InvitationStatus::PENDING->value,
                ],
            ]);
    }

    /**
     * 3. Manager can invite Staff.
     */
    public function test_manager_can_invite_staff(): void
    {
        Sanctum::actingAs($this->managerA);

        $response = $this->postJson('/api/v1/tenant/invitations', [
            'name' => 'Junior Staff',
            'email' => 'junior@metro.com',
            'role' => ProviderRole::PROVIDER_STAFF->value,
        ]);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'data' => [
                    'email' => 'junior@metro.com',
                    'role' => ProviderRole::PROVIDER_STAFF->value,
                ],
            ]);
    }

    /**
     * 4. Manager cannot invite Owner.
     */
    public function test_manager_cannot_invite_owner(): void
    {
        Sanctum::actingAs($this->managerA);

        $response = $this->postJson('/api/v1/tenant/invitations', [
            'name' => 'Rogue Owner',
            'email' => 'rogueowner@metro.com',
            'role' => ProviderRole::PROVIDER_OWNER->value,
        ]);

        // Form request validation strictly allows only PROVIDER_MANAGER or PROVIDER_STAFF
        $response->assertStatus(422);
    }

    /**
     * 5. Staff cannot invite users.
     */
    public function test_staff_cannot_invite_users(): void
    {
        Sanctum::actingAs($this->staffA);

        $response = $this->postJson('/api/v1/tenant/invitations', [
            'name' => 'Another Staff',
            'email' => 'unauthorized@metro.com',
            'role' => ProviderRole::PROVIDER_STAFF->value,
        ]);

        $response->assertStatus(403);
    }

    /**
     * 6. Invitation token is not stored in plain text.
     */
    public function test_invitation_token_is_not_stored_in_plain_text(): void
    {
        Sanctum::actingAs($this->ownerA);

        $service = app(InvitationService::class);
        $result = $service->createInvitation($this->orgA, $this->ownerA, [
            'name' => 'Secure Candidate',
            'email' => 'candidate@metro.com',
            'role' => ProviderRole::PROVIDER_STAFF->value,
        ]);

        $plainToken = $result['plain_token'];
        $invitation = $result['invitation'];

        $this->assertNotEmpty($plainToken);
        $this->assertNotEquals($plainToken, $invitation->token_hash);
        $this->assertEquals(hash('sha256', $plainToken), $invitation->token_hash);

        // Plain token must NOT exist anywhere in database
        $this->assertDatabaseMissing('organization_invitations', [
            'token_hash' => $plainToken,
        ]);
    }

    /**
     * 7. Invitation expires correctly.
     */
    public function test_invitation_expires_correctly(): void
    {
        $service = app(InvitationService::class);
        $result = $service->createInvitation($this->orgA, $this->ownerA, [
            'name' => 'Expired Candidate',
            'email' => 'expired@metro.com',
            'role' => ProviderRole::PROVIDER_STAFF->value,
        ]);

        // Force expiration to the past
        $result['invitation']->update(['expires_at' => now()->subDay()]);

        $response = $this->postJson('/api/v1/auth/invitations/accept', [
            'token' => $result['plain_token'],
            'password' => 'SecurePass123!',
        ]);

        $response->assertStatus(400);
        $this->assertEquals(InvitationStatus::EXPIRED->value, $result['invitation']->fresh()->status);
    }

    /**
     * 8. Revoked invitation cannot be accepted.
     */
    public function test_revoked_invitation_cannot_be_accepted(): void
    {
        Sanctum::actingAs($this->ownerA);

        $service = app(InvitationService::class);
        $result = $service->createInvitation($this->orgA, $this->ownerA, [
            'name' => 'Revoked Candidate',
            'email' => 'revoked@metro.com',
            'role' => ProviderRole::PROVIDER_STAFF->value,
        ]);

        // Revoke via API endpoint
        $revokeResponse = $this->deleteJson("/api/v1/tenant/invitations/{$result['invitation']->uuid}");
        $revokeResponse->assertStatus(200);

        // Attempt acceptance
        $acceptResponse = $this->postJson('/api/v1/auth/invitations/accept', [
            'token' => $result['plain_token'],
            'password' => 'SecurePass123!',
        ]);

        $acceptResponse->assertStatus(400);
    }

    /**
     * 9. Accepted invitation cannot be reused.
     */
    public function test_accepted_invitation_cannot_be_reused(): void
    {
        $service = app(InvitationService::class);
        $result = $service->createInvitation($this->orgA, $this->ownerA, [
            'name' => 'Single Use Candidate',
            'email' => 'singleuse@metro.com',
            'role' => ProviderRole::PROVIDER_STAFF->value,
        ]);

        // First acceptance
        $firstResponse = $this->postJson('/api/v1/auth/invitations/accept', [
            'token' => $result['plain_token'],
            'password' => 'Password123!',
        ]);
        $firstResponse->assertStatus(200);

        // Second acceptance attempt
        $secondResponse = $this->postJson('/api/v1/auth/invitations/accept', [
            'token' => $result['plain_token'],
            'password' => 'Password123!',
        ]);
        $secondResponse->assertStatus(400);
    }

    /**
     * 10. Existing user can accept invitation.
     */
    public function test_existing_user_can_accept_invitation(): void
    {
        $existingUser = User::factory()->create([
            'email' => 'existinguser@metro.com',
            'name' => 'Existing User',
            'password' => Hash::make('SecretPass123!'),
            'platform_role' => null,
        ]);

        $userCountBefore = User::count();

        $service = app(InvitationService::class);
        $result = $service->createInvitation($this->orgA, $this->ownerA, [
            'name' => 'Existing User',
            'email' => 'existinguser@metro.com',
            'role' => ProviderRole::PROVIDER_STAFF->value,
        ]);

        $response = $this->postJson('/api/v1/auth/invitations/accept', [
            'token' => $result['plain_token'],
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'provider_role' => ProviderRole::PROVIDER_STAFF->value,
                    'user' => [
                        'id' => $existingUser->id,
                        'email' => 'existinguser@metro.com',
                    ],
                ],
            ]);

        // User count should NOT have increased
        $this->assertEquals($userCountBefore, User::count());

        // Membership should be created
        $this->assertDatabaseHas('organization_users', [
            'organization_id' => $this->orgA->id,
            'user_id' => $existingUser->id,
            'role' => ProviderRole::PROVIDER_STAFF->value,
            'status' => MembershipStatus::ACTIVE->value,
        ]);
    }

    /**
     * 11. New user can accept invitation.
     */
    public function test_new_user_can_accept_invitation(): void
    {
        $service = app(InvitationService::class);
        $result = $service->createInvitation($this->orgA, $this->ownerA, [
            'name' => 'Brand New Staff',
            'email' => 'brandnew@metro.com',
            'role' => ProviderRole::PROVIDER_STAFF->value,
        ]);

        $response = $this->postJson('/api/v1/auth/invitations/accept', [
            'token' => $result['plain_token'],
            'password' => 'NewUserPass123!',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'provider_role' => ProviderRole::PROVIDER_STAFF->value,
                    'user' => [
                        'email' => 'brandnew@metro.com',
                    ],
                ],
            ]);

        $newUser = User::where('email', 'brandnew@metro.com')->first();
        $this->assertNotNull($newUser);
        $this->assertTrue(Hash::check('NewUserPass123!', $newUser->password));
    }

    /**
     * 12. Duplicate membership is prevented.
     */
    public function test_duplicate_membership_is_prevented(): void
    {
        Sanctum::actingAs($this->ownerA);

        // Attempt to invite an already existing active member of the same org
        $response = $this->postJson('/api/v1/tenant/invitations', [
            'name' => 'Already Member',
            'email' => $this->staffA->email,
            'role' => ProviderRole::PROVIDER_STAFF->value,
        ]);

        $response->assertStatus(422);
    }

    /**
     * 13. Owner can change Staff role.
     */
    public function test_owner_can_change_staff_role(): void
    {
        Sanctum::actingAs($this->ownerA);

        $response = $this->putJson("/api/v1/tenant/users/{$this->staffAMembership->id}/role", [
            'role' => ProviderRole::PROVIDER_MANAGER->value,
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'role' => ProviderRole::PROVIDER_MANAGER->value,
                ],
            ]);

        $this->assertEquals(ProviderRole::PROVIDER_MANAGER->value, $this->staffAMembership->fresh()->role);
    }

    /**
     * 14. Manager can change Staff role.
     */
    public function test_manager_can_change_staff_role(): void
    {
        Sanctum::actingAs($this->managerA);

        $response = $this->putJson("/api/v1/tenant/users/{$this->staffAMembership->id}/role", [
            'role' => ProviderRole::PROVIDER_STAFF->value,
        ]);

        $response->assertStatus(200);
    }

    /**
     * 15. Manager cannot change Owner role.
     */
    public function test_manager_cannot_change_owner_role(): void
    {
        Sanctum::actingAs($this->managerA);

        $response = $this->putJson("/api/v1/tenant/users/{$this->ownerAMembership->id}/role", [
            'role' => ProviderRole::PROVIDER_STAFF->value,
        ]);

        $response->assertStatus(403);
    }

    /**
     * 16. Staff cannot change roles.
     */
    public function test_staff_cannot_change_roles(): void
    {
        Sanctum::actingAs($this->staffA);

        $response = $this->putJson("/api/v1/tenant/users/{$this->managerAMembership->id}/role", [
            'role' => ProviderRole::PROVIDER_STAFF->value,
        ]);

        $response->assertStatus(403);
    }

    /**
     * 17. Last Owner cannot be removed.
     */
    public function test_last_owner_cannot_be_removed(): void
    {
        Sanctum::actingAs($this->ownerA);

        // Attempt deletion of the sole owner
        $deleteResponse = $this->deleteJson("/api/v1/tenant/users/{$this->ownerAMembership->id}");
        $deleteResponse->assertStatus(403);

        // Attempt role downgrade of the sole owner
        $downgradeResponse = $this->putJson("/api/v1/tenant/users/{$this->ownerAMembership->id}/role", [
            'role' => ProviderRole::PROVIDER_STAFF->value,
        ]);
        $downgradeResponse->assertStatus(403);

        $this->assertDatabaseHas('organization_users', [
            'id' => $this->ownerAMembership->id,
            'role' => ProviderRole::PROVIDER_OWNER->value,
        ]);
    }

    /**
     * 18. Owner can update organization settings.
     */
    public function test_owner_can_update_organization_settings(): void
    {
        Sanctum::actingAs($this->ownerA);

        $response = $this->putJson('/api/v1/tenant/organization/settings', [
            'contact_person' => 'Rajesh Sharma',
            'website' => 'https://metrohoardings.com',
            'gstin' => '29ABCDE1234F1Z5',
            'pan' => 'ABCDE1234F',
            'district' => 'Central Bangalore',
            'settings' => [
                'branding' => [
                    'primary_color' => '#0F172A',
                    'secondary_color' => '#38BDF8',
                    'accent_color' => '#F59E0B',
                ],
                'working_hours' => [
                    'monday' => '09:00 - 18:00',
                ],
            ],
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'contact_person' => 'Rajesh Sharma',
                    'website' => 'https://metrohoardings.com',
                    'gstin' => '29ABCDE1234F1Z5',
                    'pan' => 'ABCDE1234F',
                ],
            ]);

        $this->assertDatabaseHas('organizations', [
            'id' => $this->orgA->id,
            'contact_person' => 'Rajesh Sharma',
            'gstin' => '29ABCDE1234F1Z5',
        ]);
    }

    /**
     * 19. Staff cannot update organization settings.
     */
    public function test_staff_cannot_update_organization_settings(): void
    {
        Sanctum::actingAs($this->staffA);

        $response = $this->putJson('/api/v1/tenant/organization/settings', [
            'contact_person' => 'Hacker Staff',
        ]);

        $response->assertStatus(403);
    }

    /**
     * 20. Admin can suspend organization.
     */
    public function test_admin_can_suspend_organization(): void
    {
        Sanctum::actingAs($this->adminUser);

        $response = $this->postJson("/api/v1/admin/organizations/{$this->orgA->uuid}/suspend");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'status' => OrganizationStatus::SUSPENDED->value,
                ],
            ]);

        $this->assertEquals(OrganizationStatus::SUSPENDED->value, $this->orgA->fresh()->status);
    }

    /**
     * 21. Suspended organization cannot authenticate.
     */
    public function test_suspended_organization_cannot_authenticate(): void
    {
        $this->orgA->update(['status' => OrganizationStatus::SUSPENDED->value]);

        // Attempt Provider Login
        $loginResponse = $this->postJson('/api/v1/auth/provider/login', [
            'email' => $this->ownerA->email,
            'password' => 'Secret123!',
        ]);

        $loginResponse->assertStatus(403);

        // Attempt Tenant API request with authenticated token
        Sanctum::actingAs($this->ownerA);
        $tenantResponse = $this->getJson('/api/v1/tenant/organization');
        $tenantResponse->assertStatus(403);
    }

    /**
     * 22. Admin can reactivate organization.
     */
    public function test_admin_can_reactivate_organization(): void
    {
        $this->orgA->update(['status' => OrganizationStatus::SUSPENDED->value]);

        Sanctum::actingAs($this->adminUser);

        $response = $this->postJson("/api/v1/admin/organizations/{$this->orgA->uuid}/activate");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'status' => OrganizationStatus::ACTIVE->value,
                ],
            ]);

        $this->assertEquals(OrganizationStatus::ACTIVE->value, $this->orgA->fresh()->status);
    }

    /**
     * 23. Reactivated organization can authenticate.
     */
    public function test_reactivated_organization_can_authenticate(): void
    {
        // First suspend then reactivate
        $this->orgA->update(['status' => OrganizationStatus::SUSPENDED->value]);
        $this->orgA->update(['status' => OrganizationStatus::ACTIVE->value]);

        $loginResponse = $this->postJson('/api/v1/auth/provider/login', [
            'email' => $this->ownerA->email,
            'password' => 'Secret123!',
        ]);

        $loginResponse->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'provider_role' => ProviderRole::PROVIDER_OWNER->value,
                ],
            ]);
    }

    /**
     * 24. Tenant isolation remains intact.
     */
    public function test_tenant_isolation_remains_intact(): void
    {
        // Create an invitation in Org B
        $invitationB = OrganizationInvitation::create([
            'organization_id' => $this->orgB->id,
            'invited_by_user_id' => $this->ownerA->id,
            'email' => 'target@citylights.com',
            'name' => 'City Staff',
            'role' => ProviderRole::PROVIDER_STAFF->value,
            'token_hash' => hash('sha256', 'dummy_token'),
            'status' => InvitationStatus::PENDING->value,
            'expires_at' => now()->addDays(7),
        ]);

        Sanctum::actingAs($this->ownerA);

        // Org A cannot see Org B's invitations
        $listResponse = $this->getJson('/api/v1/tenant/invitations');
        $listResponse->assertStatus(200);
        $this->assertEmpty($listResponse->json('data'));

        // Org A cannot revoke Org B's invitation
        $revokeResponse = $this->deleteJson("/api/v1/tenant/invitations/{$invitationB->uuid}");
        $revokeResponse->assertStatus(404);
    }

    /**
     * 25. Permission checks work for all three provider roles.
     */
    public function test_permission_checks_work_for_all_three_provider_roles(): void
    {
        $permissionService = app(PermissionService::class);

        // OWNER: has wildcard '*'
        $this->assertTrue($permissionService->roleHasPermission(ProviderRole::PROVIDER_OWNER->value, 'organization.update'));
        $this->assertTrue($permissionService->roleHasPermission(ProviderRole::PROVIDER_OWNER->value, 'staff.invite'));
        $this->assertTrue($permissionService->roleHasPermission(ProviderRole::PROVIDER_OWNER->value, 'subscription.manage'));
        $this->assertTrue($permissionService->roleHasPermission(ProviderRole::PROVIDER_OWNER->value, 'booking.cancel'));
        $this->assertTrue($permissionService->userHasPermission($this->ownerA, $this->orgA, 'organization.update'));

        // MANAGER: has staff, locations, resources, view reports, but NOT subscription.manage
        $this->assertTrue($permissionService->roleHasPermission(ProviderRole::PROVIDER_MANAGER->value, 'staff.invite'));
        $this->assertTrue($permissionService->roleHasPermission(ProviderRole::PROVIDER_MANAGER->value, 'location.create'));
        $this->assertTrue($permissionService->roleHasPermission(ProviderRole::PROVIDER_MANAGER->value, 'reports.view'));
        $this->assertFalse($permissionService->roleHasPermission(ProviderRole::PROVIDER_MANAGER->value, 'subscription.manage'));
        $this->assertTrue($permissionService->userHasPermission($this->managerA, $this->orgA, 'staff.invite'));

        // STAFF: has view permissions, but NOT staff.invite or delete
        $this->assertTrue($permissionService->roleHasPermission(ProviderRole::PROVIDER_STAFF->value, 'organization.view'));
        $this->assertTrue($permissionService->roleHasPermission(ProviderRole::PROVIDER_STAFF->value, 'location.view'));
        $this->assertFalse($permissionService->roleHasPermission(ProviderRole::PROVIDER_STAFF->value, 'staff.invite'));
        $this->assertFalse($permissionService->roleHasPermission(ProviderRole::PROVIDER_STAFF->value, 'location.create'));
        $this->assertFalse($permissionService->userHasPermission($this->staffA, $this->orgA, 'staff.invite'));

        // Admin Lifecycle Verification endpoint
        Sanctum::actingAs($this->adminUser);
        $verifyResponse = $this->postJson("/api/v1/admin/organizations/{$this->orgA->uuid}/verify", [
            'verification_status' => VerificationStatus::VERIFIED->value,
        ]);
        $verifyResponse->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'verification_status' => VerificationStatus::VERIFIED->value,
                ],
            ]);
    }
}
