import React, { useState } from 'react';
import { X, AlertTriangle, CheckCircle } from 'lucide-react';
import type { Organization } from '../../types/organization';
import { organizationService } from '../../services/organizationService';
import { useToast } from '../../context/ToastContext';

interface SuspendConfirmModalProps {
  org: Organization | null;
  mode: 'suspend' | 'activate';
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const SuspendConfirmModal: React.FC<SuspendConfirmModalProps> = ({
  org,
  mode,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { success, error } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !org) return null;

  const isSuspend = mode === 'suspend';

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      if (isSuspend) {
        await organizationService.suspendOrganization(org.uuid);
        success('Organization Suspended', `Organization "${org.name}" has been suspended.`);
      } else {
        await organizationService.activateOrganization(org.uuid);
        success('Organization Activated', `Organization "${org.name}" has been reactivated.`);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      const msg =
        err.response?.data?.message || `Failed to ${isSuspend ? 'suspend' : 'activate'} organization.`;
      error('Action Error', msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ width: '480px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {isSuspend ? (
              <AlertTriangle size={20} style={{ color: '#ef4444' }} />
            ) : (
              <CheckCircle size={20} style={{ color: '#10b981' }} />
            )}
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>
              {isSuspend ? 'Confirm Organization Suspension' : 'Reactivate Organization'}
            </h3>
          </div>
          <button type="button" className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <p style={{ fontSize: '0.875rem', color: '#334155', marginBottom: '1rem' }}>
            Are you sure you want to {isSuspend ? 'suspend' : 'reactivate'}{' '}
            <strong>"{org.name}"</strong>?
          </p>

          {isSuspend ? (
            <div
              style={{
                padding: '0.875rem',
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '8px',
                fontSize: '0.8125rem',
                color: '#991b1b',
              }}
            >
              <strong>Security & Operational Impact:</strong>
              <ul style={{ paddingLeft: '1.25rem', marginTop: '0.35rem', lineHeight: '1.4' }}>
                <li>All provider staff members will be blocked from logging in (HTTP 403 Forbidden).</li>
                <li>All advertising resources are immediately removed from the Public Directory.</li>
                <li>All direct lead routing and active operations will be frozen.</li>
              </ul>
            </div>
          ) : (
            <div
              style={{
                padding: '0.875rem',
                backgroundColor: '#ecfdf5',
                border: '1px solid #a7f3d0',
                borderRadius: '8px',
                fontSize: '0.8125rem',
                color: '#065f46',
              }}
            >
              Reactivating this organization will restore provider portal access for its team members and resume eligibility for public directory display.
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </button>
          <button
            type="button"
            className={isSuspend ? 'btn btn-danger' : 'btn btn-primary'}
            onClick={handleConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? isSuspend
                ? 'Suspending...'
                : 'Activating...'
              : isSuspend
              ? 'Yes, Suspend Organization'
              : 'Reactivate Organization'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuspendConfirmModal;
