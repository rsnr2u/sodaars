import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Spinner from '../ui/Spinner';
import Select, { type SelectOption } from '../ui/Select';
import type { OrganizationMember } from '../../types/team';
import type { ProviderRole } from '../../types/auth';
import teamService from '../../services/teamService';
import { getApiErrorMessage } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Shield, AlertTriangle } from 'lucide-react';

export interface EditRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: OrganizationMember | null;
  currentActorRole: ProviderRole;
  activeOwnerCount: number;
  onRoleUpdated: (updatedMember: OrganizationMember) => void;
}

export const EditRoleModal: React.FC<EditRoleModalProps> = ({
  isOpen,
  onClose,
  member,
  currentActorRole,
  activeOwnerCount,
  onRoleUpdated,
}) => {
  const { success, error: showError } = useToast();
  const [selectedRole, setSelectedRole] = useState<ProviderRole>('PROVIDER_STAFF');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (member) {
      setSelectedRole(member.role);
    }
  }, [member]);

  if (!member) return null;

  const isSoleOwner = member.role === 'PROVIDER_OWNER' && activeOwnerCount <= 1;

  // Build permitted role options based on actor role
  const roleOptions: SelectOption[] = [];
  if (currentActorRole === 'PROVIDER_OWNER') {
    roleOptions.push(
      { label: 'Provider Owner (Full Administration)', value: 'PROVIDER_OWNER' },
      { label: 'Provider Manager (Operations & Inventory)', value: 'PROVIDER_MANAGER' },
      { label: 'Provider Staff (Field & Execution)', value: 'PROVIDER_STAFF' }
    );
  } else if (currentActorRole === 'PROVIDER_MANAGER') {
    roleOptions.push({ label: 'Provider Staff (Field & Execution)', value: 'PROVIDER_STAFF' });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSoleOwner && selectedRole !== 'PROVIDER_OWNER') {
      showError('Cannot demote the sole active Owner of this organization.');
      return;
    }

    try {
      setIsSubmitting(true);
      const updated = await teamService.updateMemberRole(member.id, selectedRole);
      onRoleUpdated(updated);
      success(`Updated role for ${member.user.name} to ${selectedRole.replace('PROVIDER_', '')}.`);
      onClose();
    } catch (err) {
      showError(getApiErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Shield size={18} style={{ color: 'var(--navy-600)' }} />
          <span>Update Team Member Role</span>
        </div>
      }
    >
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Member:</div>
          <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--navy-900)' }}>
            {member.user.name}
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{member.user.email}</div>
        </div>

        {isSoleOwner && (
          <div
            style={{
              background: '#fffbeb',
              border: '1px solid #fde68a',
              borderRadius: '6px',
              padding: '0.75rem',
              marginBottom: '1.25rem',
              fontSize: '0.84rem',
              color: '#92400e',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.5rem',
            }}
          >
            <AlertTriangle size={18} style={{ color: '#d97706', marginTop: '2px', flexShrink: 0 }} />
            <span>
              <strong>Sole Organization Owner:</strong> This member is currently the only active Owner.
              To demote this account, you must first promote another member to Provider Owner.
            </span>
          </div>
        )}

        <div style={{ marginBottom: '1.5rem' }}>
          <Select
            label="Assigned Role *"
            options={roleOptions}
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value as ProviderRole)}
            disabled={isSoleOwner || isSubmitting}
            required
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isSoleOwner || isSubmitting || selectedRole === member.role}
            leftIcon={isSubmitting ? <Spinner size={16} /> : undefined}
          >
            {isSubmitting ? 'Updating...' : 'Save Role'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditRoleModal;
