import React, { useState, useEffect } from 'react';
import { X, ShieldCheck } from 'lucide-react';
import type { Organization, VerificationStatus } from '../../types/organization';
import { organizationService } from '../../services/organizationService';
import { useToast } from '../../context/ToastContext';

interface VerifyOrganizationModalProps {
  org: Organization | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const VerifyOrganizationModal: React.FC<VerifyOrganizationModalProps> = ({
  org,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { success, error } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<VerificationStatus>('VERIFIED');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (org) {
      setStatus(
        org.verification_status === 'VERIFIED'
          ? 'VERIFIED'
          : (org.verification_status as VerificationStatus) || 'VERIFIED'
      );
      setNotes('');
    }
  }, [org]);

  if (!isOpen || !org) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await organizationService.verifyOrganization(org.uuid, {
        verification_status: status,
        notes: notes || undefined,
      });
      success(
        'Verification Updated',
        `Organization "${org.name}" status updated to ${status}.`
      );
      onSuccess();
      onClose();
    } catch (err: any) {
      const msg =
        err.response?.data?.message || 'Failed to update verification status.';
      error('Verification Error', msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ width: '520px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={20} className="text-primary" />
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Provider Verification Governance</h3>
          </div>
          <button type="button" className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div style={{ marginBottom: '1rem', fontSize: '0.875rem' }}>
              Updating verification status for: <strong>{org.name}</strong>
            </div>

            <div className="form-group">
              <label className="form-label">Verification Decision *</label>
              <select
                className="select-control"
                value={status}
                onChange={(e) => setStatus(e.target.value as VerificationStatus)}
              >
                <option value="VERIFIED">VERIFIED (Approved for Discovery & Full Operations)</option>
                <option value="PENDING">PENDING (Awaiting statutory/GSTIN review)</option>
                <option value="REJECTED">REJECTED (Declined or failed compliance)</option>
                <option value="UNVERIFIED">UNVERIFIED (Initial unreviewed state)</option>
              </select>
              <span className="form-helper">
                Only VERIFIED providers satisfy the Directory Triple-Gate requirement.
              </span>
            </div>

            <div className="form-group">
              <label className="form-label">Internal Compliance Notes (Optional)</label>
              <textarea
                className="input-text"
                rows={3}
                placeholder="e.g. GSTIN and trade license verified via MCA database."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Updating...' : 'Confirm Decision'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerifyOrganizationModal;
