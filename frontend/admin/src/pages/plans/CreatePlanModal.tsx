import React, { useState } from 'react';
import { X, CreditCard, Plus, Trash2 } from 'lucide-react';
import type { CreateSubscriptionPlanPayload } from '../../types/subscription';
import { subscriptionService } from '../../services/subscriptionService';
import { useToast } from '../../context/ToastContext';

interface CreatePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreatePlanModal: React.FC<CreatePlanModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { success, error } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState<CreateSubscriptionPlanPayload>({
    name: '',
    slug: '',
    description: '',
    min_resources: 1,
    max_resources: 20,
    monthly_price: 2999,
    annual_price: 29990,
    currency: 'INR',
    features: ['Up to 20 OOH Billboards', 'Basic Analytics', 'Standard Lead Ingestion'],
    status: 'ACTIVE',
    sort_order: 1,
  });

  const [newFeature, setNewFeature] = useState('');

  if (!isOpen) return null;

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setForm((prev) => ({
        ...prev,
        features: [...(prev.features || []), newFeature.trim()],
      }));
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    setForm((prev) => ({
      ...prev,
      features: (prev.features || []).filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await subscriptionService.createPlan({
        ...form,
        min_resources: Number(form.min_resources),
        max_resources: form.max_resources ? Number(form.max_resources) : null,
        monthly_price: Number(form.monthly_price),
        annual_price: form.annual_price ? Number(form.annual_price) : null,
        sort_order: Number(form.sort_order),
      });
      success('Plan Created', `Subscription plan "${form.name}" was successfully registered.`);
      onSuccess();
      onClose();
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        Object.values(err.response?.data?.errors || {})
          .flat()
          .join(', ') ||
        'Failed to create subscription plan.';
      error('Plan Creation Error', msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ width: '600px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CreditCard size={20} className="text-primary" />
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Create Subscription Plan</h3>
          </div>
          <button type="button" className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ maxHeight: '72vh' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Plan Name *</label>
                <input
                  type="text"
                  required
                  className="input-text"
                  placeholder="e.g. Growth Tier"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Slug</label>
                <input
                  type="text"
                  className="input-text"
                  placeholder="Auto-generated if empty"
                  value={form.slug || ''}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  className="select-control"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                  <option value="ARCHIVED">ARCHIVED</option>
                </select>
              </div>

              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Description</label>
                <input
                  type="text"
                  className="input-text"
                  placeholder="Target provider tier description"
                  value={form.description || ''}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Min Resources *</label>
                <input
                  type="number"
                  min="1"
                  required
                  className="input-text"
                  value={form.min_resources}
                  onChange={(e) => setForm({ ...form, min_resources: Number(e.target.value) })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Max Resources (Cap)</label>
                <input
                  type="number"
                  min="1"
                  className="input-text"
                  placeholder="Leave empty for unlimited"
                  value={form.max_resources || ''}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      max_resources: e.target.value ? Number(e.target.value) : null,
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label className="form-label">Monthly Price (INR) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  className="input-text"
                  value={form.monthly_price}
                  onChange={(e) => setForm({ ...form, monthly_price: Number(e.target.value) })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Annual Price (INR)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className="input-text"
                  placeholder="Discounted annual rate"
                  value={form.annual_price || ''}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      annual_price: e.target.value ? Number(e.target.value) : null,
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label className="form-label">Currency</label>
                <input
                  type="text"
                  maxLength={3}
                  className="input-text"
                  value={form.currency || 'INR'}
                  onChange={(e) => setForm({ ...form, currency: e.target.value.toUpperCase() })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Display Sort Order</label>
                <input
                  type="number"
                  min="0"
                  className="input-text"
                  value={form.sort_order || 0}
                  onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
                />
              </div>

              {/* Feature List Builder */}
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Plan Features</label>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <input
                    type="text"
                    className="input-text"
                    placeholder="Add feature item (e.g. Priority Support)..."
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddFeature();
                      }
                    }}
                  />
                  <button type="button" className="btn btn-secondary btn-sm" onClick={handleAddFeature}>
                    <Plus size={14} />
                    <span>Add</span>
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  {form.features?.map((f, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.35rem 0.65rem',
                        backgroundColor: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px',
                        fontSize: '0.8125rem',
                      }}
                    >
                      <span>• {f}</span>
                      <button
                        type="button"
                        className="btn-icon"
                        style={{ padding: '0.2rem' }}
                        onClick={() => handleRemoveFeature(idx)}
                      >
                        <Trash2 size={13} style={{ color: '#ef4444' }} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Plan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePlanModal;
