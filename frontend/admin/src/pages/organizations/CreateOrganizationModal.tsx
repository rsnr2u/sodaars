import React, { useEffect, useState } from 'react';
import { X, Building2 } from 'lucide-react';
import type { StoreOrganizationPayload } from '../../types/organization';
import type { SubscriptionPlan } from '../../types/subscription';
import { subscriptionService } from '../../services/subscriptionService';
import { organizationService } from '../../services/organizationService';
import { useToast } from '../../context/ToastContext';

interface CreateOrganizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateOrganizationModal: React.FC<CreateOrganizationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { success, error } = useToast();

  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState<StoreOrganizationPayload>({
    name: '',
    slug: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    subscription_plan_id: 1,
    billing_cycle: 'MONTHLY',
    owner_name: '',
    owner_email: '',
    owner_password: '',
  });

  useEffect(() => {
    if (!isOpen) return;

    subscriptionService
      .getPlans()
      .then((data) => {
        setPlans(data || []);
        if (data && data.length > 0) {
          setForm((prev) => ({ ...prev, subscription_plan_id: data[0].id }));
        }
      })
      .catch(() => {
        error('Failed to load subscription plans');
      });
  }, [isOpen, error]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Clean payload: exclude empty optional owner fields if not provided
      const payload: StoreOrganizationPayload = {
        name: form.name,
        subscription_plan_id: Number(form.subscription_plan_id),
        billing_cycle: form.billing_cycle,
      };

      if (form.slug) payload.slug = form.slug;
      if (form.email) payload.email = form.email;
      if (form.phone) payload.phone = form.phone;
      if (form.city) payload.city = form.city;
      if (form.state) payload.state = form.state;

      if (form.owner_email) {
        payload.owner_email = form.owner_email;
        payload.owner_name = form.owner_name || form.name + ' Admin';
        payload.owner_password = form.owner_password || 'Password123!';
      }

      await organizationService.createOrganization(payload);
      success('Organization Created', `Organization "${form.name}" was successfully registered.`);
      onSuccess();
      onClose();
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        Object.values(err.response?.data?.errors || {})
          .flat()
          .join(', ') ||
        'Failed to create organization.';
      error('Creation Error', msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ width: '640px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Building2 size={20} className="text-primary" />
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Provision New Organization</h3>
          </div>
          <button type="button" className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ maxHeight: '70vh' }}>
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.75rem', color: '#1e293b' }}>
                1. Organization Details
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Organization Name *</label>
                  <input
                    type="text"
                    required
                    className="input-text"
                    placeholder="e.g. Apex Outdoor Advertising Ltd"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="input-text"
                    placeholder="contact@apexoutdoor.com"
                    value={form.email || ''}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input
                    type="text"
                    className="input-text"
                    placeholder="+91 98765 43210"
                    value={form.phone || ''}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">City</label>
                  <input
                    type="text"
                    className="input-text"
                    placeholder="e.g. Mumbai"
                    value={form.city || ''}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">State</label>
                  <input
                    type="text"
                    className="input-text"
                    placeholder="e.g. Maharashtra"
                    value={form.state || ''}
                    onChange={(e) => setForm({ ...form, state: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.75rem', color: '#1e293b' }}>
                2. Subscription & Plan Assignment
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Select Subscription Plan *</label>
                  <select
                    className="select-control"
                    value={form.subscription_plan_id}
                    onChange={(e) => setForm({ ...form, subscription_plan_id: Number(e.target.value) })}
                  >
                    {plans.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.currency} {p.monthly_price}/mo - up to {p.max_resources || '∞'} resources)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Billing Cycle</label>
                  <select
                    className="select-control"
                    value={form.billing_cycle}
                    onChange={(e) => setForm({ ...form, billing_cycle: e.target.value as any })}
                  >
                    <option value="MONTHLY">Monthly</option>
                    <option value="ANNUAL">Annual</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <div style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.75rem', color: '#1e293b' }}>
                3. Initial Organization Owner (Optional)
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Owner Full Name</label>
                  <input
                    type="text"
                    className="input-text"
                    placeholder="e.g. Rajiv Mehra"
                    value={form.owner_name || ''}
                    onChange={(e) => setForm({ ...form, owner_name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Owner Email</label>
                  <input
                    type="email"
                    className="input-text"
                    placeholder="rajiv@apexoutdoor.com"
                    value={form.owner_email || ''}
                    onChange={(e) => setForm({ ...form, owner_email: e.target.value })}
                  />
                </div>

                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Owner Initial Password</label>
                  <input
                    type="password"
                    className="input-text"
                    placeholder="Leave blank for default: Password123!"
                    value={form.owner_password || ''}
                    onChange={(e) => setForm({ ...form, owner_password: e.target.value })}
                  />
                  <span className="form-helper">
                    Minimum 8 characters. Defaults to Password123! if not provided.
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Register Organization'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateOrganizationModal;
