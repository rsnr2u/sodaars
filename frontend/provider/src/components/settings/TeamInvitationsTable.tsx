import React, { useState } from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Spinner from '../ui/Spinner';
import Modal from '../ui/Modal';
import type { OrganizationInvitation } from '../../types/team';
import teamService from '../../services/teamService';
import { getApiErrorMessage } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Mail, Clock, XCircle, AlertTriangle, UserCheck } from 'lucide-react';

export interface TeamInvitationsTableProps {
  invitations: OrganizationInvitation[];
  isLoading: boolean;
  onInvitationRevoked: (uuid: string) => void;
  onOpenInvite?: () => void;
}

export const TeamInvitationsTable: React.FC<TeamInvitationsTableProps> = ({
  invitations,
  isLoading,
  onInvitationRevoked,
}) => {
  const { success, error: showError } = useToast();
  const [filterTab, setFilterTab] = useState<'pending' | 'historical' | 'all'>('pending');
  const [invitationToRevoke, setInvitationToRevoke] = useState<OrganizationInvitation | null>(null);
  const [isRevoking, setIsRevoking] = useState(false);

  const pendingInvitations = invitations.filter((inv) => inv.status === 'PENDING');
  const historicalInvitations = invitations.filter((inv) => inv.status !== 'PENDING');

  const displayedInvitations =
    filterTab === 'pending'
      ? pendingInvitations
      : filterTab === 'historical'
      ? historicalInvitations
      : invitations;

  const handleConfirmRevoke = async () => {
    if (!invitationToRevoke) return;

    try {
      setIsRevoking(true);
      await teamService.revokeInvitation(invitationToRevoke.uuid);
      onInvitationRevoked(invitationToRevoke.uuid);
      success(`Revoked invitation sent to ${invitationToRevoke.email}.`);
      setInvitationToRevoke(null);
    } catch (err) {
      showError(getApiErrorMessage(err));
    } finally {
      setIsRevoking(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="warning">PENDING</Badge>;
      case 'ACCEPTED':
        return <Badge variant="success">ACCEPTED</Badge>;
      case 'REVOKED':
        return <Badge variant="danger">REVOKED</Badge>;
      case 'EXPIRED':
        return <Badge variant="neutral">EXPIRED</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  return (
    <>
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Mail size={20} style={{ color: 'var(--navy-600)' }} />
              <span>Staff Invitations Pipeline</span>
              {pendingInvitations.length > 0 && (
                <Badge variant="warning">{pendingInvitations.length} Pending</Badge>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div
                style={{
                  display: 'inline-flex',
                  background: 'var(--slate-100)',
                  padding: '3px',
                  borderRadius: '6px',
                  fontSize: '0.82rem',
                }}
              >
                <button
                  type="button"
                  onClick={() => setFilterTab('pending')}
                  style={{
                    border: 'none',
                    background: filterTab === 'pending' ? '#fff' : 'transparent',
                    color: filterTab === 'pending' ? 'var(--navy-800)' : 'var(--text-muted)',
                    fontWeight: filterTab === 'pending' ? 600 : 400,
                    padding: '4px 10px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    boxShadow: filterTab === 'pending' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                  }}
                >
                  Active ({pendingInvitations.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterTab('historical')}
                  style={{
                    border: 'none',
                    background: filterTab === 'historical' ? '#fff' : 'transparent',
                    color: filterTab === 'historical' ? 'var(--navy-800)' : 'var(--text-muted)',
                    fontWeight: filterTab === 'historical' ? 600 : 400,
                    padding: '4px 10px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    boxShadow: filterTab === 'historical' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                  }}
                >
                  History ({historicalInvitations.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterTab('all')}
                  style={{
                    border: 'none',
                    background: filterTab === 'all' ? '#fff' : 'transparent',
                    color: filterTab === 'all' ? 'var(--navy-800)' : 'var(--text-muted)',
                    fontWeight: filterTab === 'all' ? 600 : 400,
                    padding: '4px 10px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    boxShadow: filterTab === 'all' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                  }}
                >
                  All ({invitations.length})
                </button>
              </div>
            </div>
          </div>
        }
        subtitle="Track dispatched member invitations, acceptances, and revoked access tokens"
      >
        {isLoading ? (
          <div style={{ padding: '3rem', display: 'flex', justifyContent: 'center' }}>
            <Spinner size={32} />
          </div>
        ) : displayedInvitations.length === 0 ? (
          <div style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            {filterTab === 'pending'
              ? 'No pending invitations. All invited members have either accepted or been revoked.'
              : 'No invitation records found in this view.'}
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Invited Candidate</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Role</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Invited By</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Sent On</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Expires At</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Status</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayedInvitations.map((inv) => {
                  const isPending = inv.status === 'PENDING';
                  const isExpired = inv.expires_at && new Date(inv.expires_at) < new Date();

                  return (
                    <tr key={inv.uuid || inv.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      {/* Candidate */}
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ fontWeight: 600, color: 'var(--navy-900)' }}>{inv.name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{inv.email}</div>
                      </td>

                      {/* Role */}
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <Badge variant={inv.role === 'PROVIDER_MANAGER' ? 'info' : 'neutral'}>
                          {inv.role.replace('PROVIDER_', '')}
                        </Badge>
                      </td>

                      {/* Invited By */}
                      <td style={{ padding: '0.85rem 1rem', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                        {inv.invited_by ? inv.invited_by.name : 'Administrator'}
                      </td>

                      {/* Sent Date */}
                      <td style={{ padding: '0.85rem 1rem', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                        {inv.created_at ? new Date(inv.created_at).toLocaleDateString() : '—'}
                      </td>

                      {/* Expiry */}
                      <td style={{ padding: '0.85rem 1rem', fontSize: '0.82rem' }}>
                        {inv.expires_at ? (
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              color: isExpired ? 'var(--rose-600)' : 'var(--text-muted)',
                            }}
                          >
                            <Clock size={13} />
                            <span>{new Date(inv.expires_at).toLocaleDateString()}</span>
                          </div>
                        ) : (
                          <span style={{ color: 'var(--slate-400)' }}>No expiry</span>
                        )}
                      </td>

                      {/* Status */}
                      <td style={{ padding: '0.85rem 1rem' }}>
                        {getStatusBadge(inv.status)}
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                        {isPending ? (
                          <Button
                            variant="danger"
                            size="sm"
                            leftIcon={<XCircle size={13} />}
                            onClick={() => setInvitationToRevoke(inv)}
                          >
                            Revoke
                          </Button>
                        ) : (
                          <span style={{ fontSize: '0.78rem', color: 'var(--slate-400)' }}>
                            {inv.status === 'ACCEPTED' ? (
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: 'var(--emerald-600)' }}>
                                <UserCheck size={13} /> Joined
                              </span>
                            ) : (
                              'Archived'
                            )}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Revoke Confirmation Modal */}
      <Modal
        isOpen={Boolean(invitationToRevoke)}
        onClose={() => setInvitationToRevoke(null)}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--rose-600)' }}>
            <AlertTriangle size={18} />
            <span>Revoke Staff Invitation</span>
          </div>
        }
      >
        <div style={{ marginBottom: '1.25rem' }}>
          <p style={{ margin: '0 0 0.5rem', fontSize: '0.9rem' }}>
            Are you sure you want to revoke the invitation sent to{' '}
            <strong>{invitationToRevoke?.email}</strong>?
          </p>
          <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            The invitation link will immediately expire and cannot be used to join this organization.
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <Button
            variant="secondary"
            onClick={() => setInvitationToRevoke(null)}
            disabled={isRevoking}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleConfirmRevoke}
            disabled={isRevoking}
            leftIcon={isRevoking ? <Spinner size={16} /> : <XCircle size={16} />}
          >
            {isRevoking ? 'Revoking...' : 'Revoke Invitation'}
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default TeamInvitationsTable;
