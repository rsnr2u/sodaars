import React, { useState, useEffect } from 'react';
import { X, Edit } from 'lucide-react';
import type { Organization, UpdateOrganizationPayload } from '../../types/organization';
import { organizationService } from '../../services/organizationService';
import { useToast } from '../../context/ToastContext';

interface EditOrganizationModalProps {
  org: Organization | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const EditOrganizationModal: React.FC<EditOrganizationModalProps> = ({
  org,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { success, error } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState<UpdateOrganizationPayload>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: '',
    status: 'ACTIVE',
  });

  useEffect(() => {
    if (org) {
      setForm({
        name: org.name || '',
        email: org.email || '',
        phone: org.phone || '',
        address: org.address || '',
        city: org.city || '',
        state: org.state || '',
        pincode: org.pincode || '',
        country: org.country || '',
        status: (org.status as any) || 'ACTIVE',
      });
    }
  }, [org]);

  if (!isOpen || !org) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await organizationService.updateOrganization(org.uuid, form);
      success('Organization Updated', `Organization "${form.name}" was successfully updated.`);
      onSuccess();
      onClose();
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        Object.values(err.response?.data?.errors || {})
          .flat()
          .join(', ') ||
        'Failed to update organization.';
      error('Update Error', msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ width: '600px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Edit size={20} className="text-primary" />
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Edit Organization Profile</h3>
          </div>
          <button type="button" className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Organization Name *</label>
              <input
                type="text"
                required
                className="input-text"
                value={form.name || ''}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="input-text"
                  value={form.email || ''}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone</label>
                <input
                  type="text"
                  className="input-text"
                  value={form.phone || ''}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">City</label>
                <input
                  type="text"
                  className="input-text"
                  value={form.city || ''}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">State</label>
                <input
                  type="text"
                  className="input-text"
                  value={form.state || ''}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Pincode</label>
                <input
                  type="text"
                  className="input-text"
                  value={form.pincode || ''}
                  onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Country</label>
                <input
                  type="text"
                  className="input-text"
                  value={form.country || ''}
                  onChange={(e) => setForm({ ...form, country: e.target.value })}
                />
              </div>

              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Street Address</label>
                <textarea
                  className="input-text"
                  rows={2}
                  value={form.address || ''}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                />
              </div>

              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Operational Status</label>
                <select
                  className="select-control"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                >
                  <option value="ACTIVE">ACTIVE (Operational)</option>
                  <option value="SUSPENDED">SUSPENDED (Access Blocked)</option>
                  <option value="INACTIVE">INACTIVE (Dormant)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving Changes...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditOrganizationModal;
