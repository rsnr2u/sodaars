<?php

namespace App\Models;

use App\Enums\PlatformRole;
use App\Enums\UserStatus;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Str;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'uuid',
        'name',
        'email',
        'phone',
        'password',
        'platform_role',
        'status',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Boot model.
     */
    protected static function booted(): void
    {
        static::creating(function ($user) {
            if (empty($user->uuid)) {
                $user->uuid = (string) Str::uuid();
            }
        });
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Organization memberships for this user.
     */
    public function organizationUsers(): HasMany
    {
        return $this->hasMany(OrganizationUser::class);
    }

    /**
     * Organizations the user belongs to.
     */
    public function organizations(): BelongsToMany
    {
        return $this->belongsToMany(Organization::class, 'organization_users')
            ->withPivot(['id', 'role', 'status', 'is_default', 'joined_at'])
            ->withTimestamps();
    }

    /**
     * Organizations created by this user.
     */
    public function createdOrganizations(): HasMany
    {
        return $this->hasMany(Organization::class, 'created_by_user_id');
    }

    /**
     * Check if user is Super Admin.
     */
    public function isSuperAdmin(): bool
    {
        return $this->platform_role === PlatformRole::SUPER_ADMIN->value;
    }

    /**
     * Check if user is Platform Admin (Super Admin or Admin).
     */
    public function isPlatformAdmin(): bool
    {
        return in_array($this->platform_role, [
            PlatformRole::SUPER_ADMIN->value,
            PlatformRole::ADMIN->value,
        ]);
    }

    /**
     * Check if user is Platform Staff.
     */
    public function isPlatformStaff(): bool
    {
        return in_array($this->platform_role, [
            PlatformRole::SUPER_ADMIN->value,
            PlatformRole::ADMIN->value,
            PlatformRole::STAFF->value,
        ]);
    }

    /**
     * Check if user has platform role.
     */
    public function isPlatformUser(): bool
    {
        return ! empty($this->platform_role);
    }

    /**
     * Check if user is active.
     */
    public function isActive(): bool
    {
        return $this->status === UserStatus::ACTIVE->value;
    }

    /**
     * Check if user has specific role(s) in an organization.
     */
    public function hasRoleInOrganization(int $orgId, array|string $roles): bool
    {
        $roles = (array) $roles;

        return $this->organizationUsers()
            ->where('organization_id', $orgId)
            ->where('status', 'ACTIVE')
            ->whereIn('role', $roles)
            ->exists();
    }

    /**
     * Get active membership in organization.
     */
    public function activeMembershipIn(int $orgId): ?OrganizationUser
    {
        return $this->organizationUsers()
            ->where('organization_id', $orgId)
            ->where('status', 'ACTIVE')
            ->first();
    }

    /**
     * Get user's role in the organization.
     */
    public function getRoleInOrganization(int $orgId): ?string
    {
        return $this->activeMembershipIn($orgId)?->role;
    }

    /**
     * Enquiries assigned to this user.
     */
    public function assignedEnquiries(): HasMany
    {
        return $this->hasMany(Enquiry::class, 'assigned_to_user_id');
    }
}
