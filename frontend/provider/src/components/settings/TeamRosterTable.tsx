import React, { useState } from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import Spinner from '../ui/Spinner';
import type { OrganizationMember } from '../../types/team';
import type { ProviderRole } from '../../types/auth';
import EditRoleModal from './EditRoleModal';
import teamService from '../../services/teamService';
import { getApiErrorMessage } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import {
  Users,
  UserPlus,
  Shield,
  Trash2,
  Edit2,
  Lock,
  Phone,
  AlertTriangle,
} from 'lucide-react';

export interface TeamRosterTableProps {
  members: OrganizationMember[];
  currentActorRole: ProviderRole;
  currentUserId?: number;
  isLoading: boolean;
  onMemberUpdated: (member: OrganizationMember) => void;
  onMemberRemoved: (membershipId: number) => void;
  onOpenInvite: () => void;
}

export const TeamRosterTable: React.FC<TeamRosterTableProps> = ({
  members,
  currentActorRole,
  currentUserId,
  isLoading,
  onMemberUpdated,
  onMemberRemoved,
  onOpenInvite,
}) => {
  const { success, error: showError } = useToast();
  const [selectedMemberForRole, setSelectedMemberForRole] = useState<OrganizationMember | null>(null);
  const [memberToDelete, setMemberToDelete] = useState<OrganizationMember | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Count active owners for sole-owner safeguards
  const activeOwnerCount = members.filter(
    (m) => m.role === 'PROVIDER_OWNER' && (m.status === 'ACTIVE' || !m.status)
  ).length;

  const canManageMember = (targetMember: OrganizationMember): boolean => {
    if (currentActorRole === 'PROVIDER_OWNER') {
      return true;
    }
    if (currentActorRole === 'PROVIDER_MANAGER') {
      return targetMember.role === 'PROVIDER_STAFF';
    }
    return false;
  };

  const handleConfirmDelete = async () => {
    if (!memberToDelete) return;

    if (memberToDelete.role === 'PROVIDER_OWNER' && activeOwnerCount <= 1) {
      showError('Cannot remove the sole active Owner of this organization.');
      setMemberToDelete(null);
      return;
    }

    try {
      setIsDeleting(true);
      await teamService.removeMember(memberToDelete.id);
      onMemberRemoved(memberToDelete.id);
      success(`Removed ${memberToDelete.user.name} from the organization.`);
      setMemberToDelete(null);
    } catch (err) {
      showError(getApiErrorMessage(err));
    } finally {
      setIsDeleting(false);
    }
  };

  const getRoleBadgeVariant = (
    role: ProviderRole
  ): 'orange' | 'info' | 'neutral' => {
    switch (role) {
      case 'PROVIDER_OWNER':
        return 'orange';
      case 'PROVIDER_MANAGER':
        return 'info';
      case 'PROVIDER_STAFF':
      default:
        return 'neutral';
    }
  };

  return (
    <>
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Users size={20} style={{ color: 'var(--navy-600)' }} />
              <span>Active Team Roster</span>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 400 }}>
                ({members.length} {members.length === 1 ? 'member' : 'members'})
              </span>
            </div>

            <Button
              variant="primary"
              size="sm"
              leftIcon={<UserPlus size={15} />}
              onClick={onOpenInvite}
            >
              Invite Member
            </Button>
          </div>
        }
        subtitle="Manage member access levels, assigned operational roles, and team seats"
      >
        {isLoading ? (
          <div style={{ padding: '3rem', display: 'flex', justifyContent: 'center' }}>
            <Spinner size={32} />
          </div>
        ) : members.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No members registered in this organization.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Team Member</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Contact</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Role</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Status</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Joined</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => {
                  const isSoleOwner =
                    member.role === 'PROVIDER_OWNER' && activeOwnerCount <= 1;
                  const isCurrentUser = member.user_id === currentUserId;
                  const isManageable = canManageMember(member);

                  return (
                    <tr
                      key={member.id}
                      style={{
                        borderBottom: '1px solid var(--border-color)',
                        background: isCurrentUser ? 'rgba(2, 132, 199, 0.03)' : undefined,
                      }}
                    >
                      {/* Member Info */}
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <div
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              background: 'var(--navy-100)',
                              color: 'var(--navy-700)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 600,
                              fontSize: '0.8rem',
                              flexShrink: 0,
                            }}
                          >
                            {member.user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, color: 'var(--navy-900)' }}>
                              {member.user.name}
                              {isCurrentUser && (
                                <span
                                  style={{
                                    marginLeft: '0.4rem',
                                    fontSize: '0.72rem',
                                    background: 'var(--slate-200)',
                                    padding: '1px 5px',
                                    borderRadius: '4px',
                                    color: 'var(--slate-700)',
                                  }}
                                >
                                  You
                                </span>
                              )}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                              {member.user.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td style={{ padding: '0.85rem 1rem', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                        {member.user.phone ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <Phone size={13} />
                            <span>{member.user.phone}</span>
                          </div>
                        ) : (
                          <span style={{ color: 'var(--slate-400)' }}>No phone</span>
                        )}
                      </td>

                      {/* Role Badge */}
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <Badge variant={getRoleBadgeVariant(member.role)}>
                          {member.role.replace('PROVIDER_', '')}
                        </Badge>
                      </td>

                      {/* Status */}
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <Badge variant={member.status === 'ACTIVE' ? 'success' : 'neutral'}>
                          {member.status || 'ACTIVE'}
                        </Badge>
                      </td>

                      {/* Joined Date */}
                      <td style={{ padding: '0.85rem 1rem', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                        {member.joined_at
                          ? new Date(member.joined_at).toLocaleDateString()
                          : member.created_at
                          ? new Date(member.created_at).toLocaleDateString()
                          : '—'}
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' }}>
                          {isSoleOwner ? (
                            <span
                              title="Sole Owner of organization — cannot be removed or demoted"
                              style={{
                                fontSize: '0.75rem',
                                color: 'var(--amber-700)',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.3rem',
                                background: '#fffbeb',
                                padding: '3px 7px',
                                borderRadius: '4px',
                                border: '1px solid #fde68a',
                              }}
                            >
                              <Lock size={12} />
                              <span>Sole Owner</span>
                            </span>
                          ) : isManageable ? (
                            <>
                              <Button
                                variant="secondary"
                                size="sm"
                                leftIcon={<Edit2 size={13} />}
                                onClick={() => setSelectedMemberForRole(member)}
                              >
                                Role
                              </Button>

                              <Button
                                variant="danger"
                                size="sm"
                                leftIcon={<Trash2 size={13} />}
                                onClick={() => setMemberToDelete(member)}
                              >
                                Remove
                              </Button>
                            </>
                          ) : (
                            <span
                              title="You do not have permission to manage this member's role"
                              style={{
                                fontSize: '0.75rem',
                                color: 'var(--slate-400)',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.3rem',
                              }}
                            >
                              <Shield size={12} />
                              <span>Locked</span>
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Edit Role Modal */}
      <EditRoleModal
        isOpen={Boolean(selectedMemberForRole)}
        onClose={() => setSelectedMemberForRole(null)}
        member={selectedMemberForRole}
        currentActorRole={currentActorRole}
        activeOwnerCount={activeOwnerCount}
        onRoleUpdated={(updated) => {
          onMemberUpdated(updated);
          setSelectedMemberForRole(null);
        }}
      />

      {/* Remove Member Confirmation Modal */}
      <Modal
        isOpen={Boolean(memberToDelete)}
        onClose={() => setMemberToDelete(null)}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--rose-600)' }}>
            <AlertTriangle size={18} />
            <span>Confirm Member Removal</span>
          </div>
        }
      >
        <div style={{ marginBottom: '1.25rem' }}>
          <p style={{ margin: '0 0 0.5rem', fontSize: '0.9rem' }}>
            Are you sure you want to remove <strong>{memberToDelete?.user.name}</strong> (
            {memberToDelete?.user.email}) from this organization?
          </p>
          <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            They will lose all administrative access to this organization’s inventory, schedules, customers, and settings.
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <Button variant="secondary" onClick={() => setMemberToDelete(null)} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleConfirmDelete}
            disabled={isDeleting}
            leftIcon={isDeleting ? <Spinner size={16} /> : <Trash2 size={16} />}
          >
            {isDeleting ? 'Removing...' : 'Remove Member'}
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default TeamRosterTable;
