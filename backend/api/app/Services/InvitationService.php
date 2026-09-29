<?php

namespace App\Services;

use App\Enums\InvitationStatus;
use App\Enums\MembershipStatus;
use App\Enums\UserStatus;
use App\Models\Organization;
use App\Models\OrganizationInvitation;
use App\Models\OrganizationUser;
use App\Models\User;
use App\Notifications\StaffInvitationNotification;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class InvitationService
{
    /**
     * Create and send a new staff invitation.
     */
    public function createInvitation(Organization $organization, User $invitedBy, array $data): array
    {
        $email = strtolower(trim($data['email']));

        // Check if user is already an active member of this organization
        $existingUser = User::where('email', $email)->first();
        if ($existingUser) {
            $isAlreadyMember = OrganizationUser::where('organization_id', $organization->id)
                ->where('user_id', $existingUser->id)
                ->where('status', MembershipStatus::ACTIVE->value)
                ->exists();

            if ($isAlreadyMember) {
                throw ValidationException::withMessages([
                    'email' => ['A user with this email address is already a member of this organization.'],
                ]);
            }
        }

        // Revoke any previous pending invitation for this email in this organization
        OrganizationInvitation::where('organization_id', $organization->id)
            ->where('email', $email)
            ->where('status', InvitationStatus::PENDING->value)
            ->update([
                'status' => InvitationStatus::REVOKED->value,
                'revoked_at' => now(),
            ]);

        $plainToken = Str::random(64);
        $tokenHash = hash('sha256', $plainToken);

        $invitation = OrganizationInvitation::create([
            'organization_id' => $organization->id,
            'invited_by_user_id' => $invitedBy->id,
            'email' => $email,
            'name' => $data['name'],
            'phone' => $data['phone'] ?? null,
            'role' => $data['role'],
            'token_hash' => $tokenHash,
            'status' => InvitationStatus::PENDING->value,
            'expires_at' => now()->addDays(7),
        ]);

        // Send email invitation notification
        Notification::route('mail', $email)
            ->notify(new StaffInvitationNotification($invitation->load('organization'), $plainToken));

        return [
            'invitation' => $invitation,
            'plain_token' => $plainToken,
        ];
    }

    /**
     * Accept an invitation using the cryptographic plain token.
     */
    public function acceptInvitation(string $plainToken, array $userData = []): array
    {
        $tokenHash = hash('sha256', $plainToken);

        $invitation = OrganizationInvitation::where('token_hash', $tokenHash)->first();

        if (! $invitation) {
            abort(404, 'Invalid or non-existent invitation token.');
        }

        if ($invitation->status === InvitationStatus::REVOKED->value) {
            abort(400, 'This invitation has been revoked by the organization administrator.');
        }

        if ($invitation->status === InvitationStatus::ACCEPTED->value) {
            abort(400, 'This invitation has already been accepted.');
        }

        if ($invitation->isExpired()) {
            $invitation->update(['status' => InvitationStatus::EXPIRED->value]);
            abort(400, 'This invitation has expired.');
        }

        return DB::transaction(function () use ($invitation, $userData) {
            // Find existing user or create a new one
            $user = User::where('email', $invitation->email)->first();

            if (! $user) {
                $password = $userData['password'] ?? Str::random(16);

                $user = User::create([
                    'name' => $userData['name'] ?? $invitation->name,
                    'email' => $invitation->email,
                    'phone' => $userData['phone'] ?? $invitation->phone,
                    'password' => Hash::make($password),
                    'status' => UserStatus::ACTIVE->value,
                    'platform_role' => null,
                    'email_verified_at' => now(), // Email verified through invitation token click
                ]);
            } else {
                // If existing user has no active status, check
                if ($user->status !== UserStatus::ACTIVE->value) {
                    abort(403, 'Your account is suspended.');
                }
            }

            // Check if user is already a member
            $existingMembership = OrganizationUser::where('organization_id', $invitation->organization_id)
                ->where('user_id', $user->id)
                ->first();

            if ($existingMembership && $existingMembership->status === MembershipStatus::ACTIVE->value) {
                abort(409, 'You are already an active member of this organization.');
            }

            if ($existingMembership) {
                $existingMembership->update([
                    'role' => $invitation->role,
                    'status' => MembershipStatus::ACTIVE->value,
                    'joined_at' => now(),
                ]);
            } else {
                OrganizationUser::create([
                    'organization_id' => $invitation->organization_id,
                    'user_id' => $user->id,
                    'role' => $invitation->role,
                    'status' => MembershipStatus::ACTIVE->value,
                    'is_default' => false,
                    'joined_at' => now(),
                ]);
            }

            // Mark invitation as accepted
            $invitation->update([
                'status' => InvitationStatus::ACCEPTED->value,
                'accepted_at' => now(),
            ]);

            $token = $user->createToken('provider-portal', [
                'provider:' . strtolower($invitation->role),
            ])->plainTextToken;

            return [
                'user' => $user,
                'organization' => $invitation->organization,
                'provider_role' => $invitation->role,
                'token' => $token,
            ];
        });
    }

    /**
     * Revoke a pending invitation.
     */
    public function revokeInvitation(Organization $organization, string $uuid): OrganizationInvitation
    {
        $invitation = OrganizationInvitation::where('organization_id', $organization->id)
            ->where('uuid', $uuid)
            ->firstOrFail();

        if ($invitation->status === InvitationStatus::ACCEPTED->value) {
            abort(400, 'Cannot revoke an invitation that has already been accepted.');
        }

        $invitation->update([
            'status' => InvitationStatus::REVOKED->value,
            'revoked_at' => now(),
        ]);

        return $invitation;
    }
}
