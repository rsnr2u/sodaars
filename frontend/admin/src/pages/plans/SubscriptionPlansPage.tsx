import React, { useEffect, useState } from 'react';
import {
  PlusCircle,
  RefreshCw,
  Edit,
  Check,
  Info,
} from 'lucide-react';
import type { SubscriptionPlan } from '../../types/subscription';
import { subscriptionService } from '../../services/subscriptionService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import CreatePlanModal from './CreatePlanModal';
import EditPlanModal from './EditPlanModal';

export const SubscriptionPlansPage: React.FC = () => {
  const { isPlatformAdmin } = useAuth();
  const { error } = useToast();

  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);

  const fetchPlans = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await subscriptionService.getPlans();
      setPlans(data || []);
    } catch {
      error('Data Load Error', 'Failed to retrieve subscription plans list.');
    } finally {
      setIsLoading(false);
    }
  }, [error]);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Subscription Plans & Resource Quotas</h1>
          <p className="page-subtitle">
            Commercial tier definitions, inventory resource limits, and subscription governance
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={fetchPlans}
            disabled={isLoading}
          >
            <RefreshCw size={15} className={isLoading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
          {isPlatformAdmin ? (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setIsCreateOpen(true)}
            >
              <PlusCircle size={15} />
              <span>Create Plan Tier</span>
            </button>
          ) : (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.75rem',
                color: '#64748b',
                padding: '0.4rem 0.75rem',
                backgroundColor: '#f1f5f9',
                borderRadius: '6px',
              }}
            >
              <Info size={14} />
              <span>Staff Role: Read-only access</span>
            </div>
          )}
        </div>
      </div>

      {/* Plan Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem',
        }}
      >
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="card"
            style={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              marginBottom: 0,
              borderTop: `4px solid ${
                plan.status === 'ACTIVE' ? 'var(--primary)' : '#cbd5e1'
              }`,
            }}
          >
            <div style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{plan.name}</h3>
                <span className={`badge badge-${plan.status}`}>
                  <span className="badge-dot" />
                  <span>{plan.status}</span>
                </span>
              </div>

              <p style={{ fontSize: '0.8125rem', color: '#64748b', minHeight: '38px', marginBottom: '1rem' }}>
                {plan.description || 'Standard outdoor advertising provider quota tier.'}
              </p>

              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
                  <span style={{ fontSize: '1.75rem', fontWeight: 800 }}>
                    {plan.currency} {Number(plan.monthly_price).toLocaleString()}
                  </span>
                  <span style={{ fontSize: '0.8125rem', color: '#64748b' }}>/ month</span>
                </div>
                {plan.annual_price && (
                  <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600, marginTop: '0.15rem' }}>
                    {plan.currency} {Number(plan.annual_price).toLocaleString()} billed annually
                  </div>
                )}
              </div>

              <div
                style={{
                  padding: '0.75rem',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  marginBottom: '1.25rem',
                  fontSize: '0.8125rem',
                }}
              >
                <div style={{ fontWeight: 600, color: '#334155', marginBottom: '0.25rem' }}>
                  Resource Quota:
                </div>
                <div>
                  <strong>{plan.min_resources}</strong> to{' '}
                  <strong>{plan.max_resources ? `${plan.max_resources} units` : 'Unlimited'}</strong>
                </div>
              </div>

              <div style={{ fontSize: '0.8125rem' }}>
                <div style={{ fontWeight: 600, color: '#334155', marginBottom: '0.5rem' }}>
                  Included Features:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {Array.isArray(plan.features) && plan.features.length > 0 ? (
                    plan.features.map((feat, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem', color: '#475569' }}>
                        <Check size={14} style={{ color: '#10b981', flexShrink: 0, marginTop: '2px' }} />
                        <span>{feat}</span>
                      </div>
                    ))
                  ) : (
                    <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>Standard feature set</span>
                  )}
                </div>
              </div>
            </div>

            <div
              style={{
                padding: '0.875rem 1.5rem',
                backgroundColor: '#f8fafc',
                borderTop: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                Sort Order: {plan.sort_order ?? 0}
              </span>
              {isPlatformAdmin && (
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setEditingPlan(plan)}
                >
                  <Edit size={13} />
                  <span>Edit Plan</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Plan Matrix Table */}
      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">Plan Governance Table</h2>
            <p className="card-description">
              Comprehensive overview of all system subscription plans and quotas
            </p>
          </div>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Plan Name</th>
                <th>Slug</th>
                <th>Resource Limit</th>
                <th>Monthly Rate</th>
                <th>Annual Rate</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '2rem' }}>
                    Loading plan records...
                  </td>
                </tr>
              ) : plans.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                    No subscription plans configured.
                  </td>
                </tr>
              ) : (
                plans.map((plan) => (
                  <tr key={plan.id}>
                    <td>
                      <code>{plan.sort_order ?? 0}</code>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{plan.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        {plan.description}
                      </div>
                    </td>
                    <td>
                      <code>{plan.slug}</code>
                    </td>
                    <td>
                      {plan.min_resources} - {plan.max_resources || 'Unlimited'}
                    </td>
                    <td>
                      <strong>
                        {plan.currency} {Number(plan.monthly_price).toLocaleString()}
                      </strong>
                    </td>
                    <td>
                      {plan.annual_price ? (
                        <span>
                          {plan.currency} {Number(plan.annual_price).toLocaleString()}
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td>
                      <span className={`badge badge-${plan.status}`}>
                        <span className="badge-dot" />
                        <span>{plan.status}</span>
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {isPlatformAdmin ? (
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => setEditingPlan(plan)}
                        >
                          <Edit size={13} />
                          <span>Edit</span>
                        </button>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>View Only</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <CreatePlanModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={fetchPlans}
      />

      <EditPlanModal
        plan={editingPlan}
        isOpen={!!editingPlan}
        onClose={() => setEditingPlan(null)}
        onSuccess={fetchPlans}
      />
    </div>
  );
};

export default SubscriptionPlansPage;
