import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Spinner from '../ui/Spinner';
import Select, { type SelectOption } from '../ui/Select';
import type { OrganizationInvitation, InviteStaffPayload } from '../../types/team';
import type { ProviderRole } from '../../types/auth';
import teamService from '../../services/teamService';
import { getApiErrorMessage, getApiFieldErrors } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { UserPlus, Mail, Phone, User } from 'lucide-react';

export interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentActorRole: ProviderRole;
  onInvitationSent: (invitation: OrganizationInvitation) => void;
}

export const InviteMemberModal: React.FC<InviteMemberModalProps> = ({
  isOpen,
  onClose,
  currentActorRole,
  onInvitationSent,
}) => {
  const { success, error: showError } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'PROVIDER_MANAGER' | 'PROVIDER_STAFF'>(
    currentActorRole === 'PROVIDER_OWNER' ? 'PROVIDER_MANAGER' : 'PROVIDER_STAFF'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const roleOptions: SelectOption[] = [];
  if (currentActorRole === 'PROVIDER_OWNER') {
    roleOptions.push(
      { label: 'Provider Manager (Operations & Inventory Management)', value: 'PROVIDER_MANAGER' },
      { label: 'Provider Staff (Field Operations & View Only)', value: 'PROVIDER_STAFF' }
    );
  } else {
    roleOptions.push({
      label: 'Provider Staff (Field Operations & View Only)',
      value: 'PROVIDER_STAFF',
    });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      setFieldErrors({});

      const payload: InviteStaffPayload = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim() || undefined,
        role,
      };

      const invitation = await teamService.sendInvitation(payload);
      onInvitationSent(invitation);
      success(`Invitation sent successfully to ${email}.`);
      setName('');
      setEmail('');
      setPhone('');
      onClose();
    } catch (err) {
      const fieldErrs = getApiFieldErrors(err);
      if (fieldErrs) {
        const flat: Record<string, string> = {};
        Object.entries(fieldErrs).forEach(([k, v]) => {
          flat[k] = v[0];
        });
        setFieldErrors(flat);
      }
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
          <UserPlus size={18} style={{ color: 'var(--navy-600)' }} />
          <span>Invite New Team Member</span>
        </div>
      }
    >
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
          <Input
            label="Full Name *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={fieldErrors.name}
            required
            disabled={isSubmitting}
            placeholder="e.g. Priya Nair"
            leftIcon={<User size={16} />}
          />

          <Input
            label="Email Address *"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={fieldErrors.email}
            required
            disabled={isSubmitting}
            placeholder="e.g. priya@acmeoutdoor.com"
            leftIcon={<Mail size={16} />}
          />

          <Input
            label="Phone Number (Optional)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            error={fieldErrors.phone}
            disabled={isSubmitting}
            placeholder="e.g. +91 98765 43210"
            leftIcon={<Phone size={16} />}
          />

          <Select
            label="Assigned Role *"
            options={roleOptions}
            value={role}
            onChange={(e) => setRole(e.target.value as 'PROVIDER_MANAGER' | 'PROVIDER_STAFF')}
            disabled={isSubmitting || roleOptions.length <= 1}
            required
            helperText={
              currentActorRole === 'PROVIDER_MANAGER'
                ? 'Managers can only invite Provider Staff members.'
                : undefined
            }
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting || !name || !email}
            leftIcon={isSubmitting ? <Spinner size={16} /> : <UserPlus size={16} />}
          >
            {isSubmitting ? 'Sending Invitation...' : 'Send Invitation'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default InviteMemberModal;
