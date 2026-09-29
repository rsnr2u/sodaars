import React from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Spinner from '../ui/Spinner';
import type { Subscription } from '../../types/subscription';
import { CreditCard, Calendar, Zap, AlertTriangle, CheckCircle } from 'lucide-react';

export interface SubscriptionOverviewCardProps {
  subscription: Subscription | null;
  activeResourceCount: number;
  isLoading: boolean;
}

export const SubscriptionOverviewCard: React.FC<SubscriptionOverviewCardProps> = ({
  subscription,
  activeResourceCount,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <Card title="Subscription & Resource Quota">
        <div style={{ padding: '2.5rem', display: 'flex', justifyContent: 'center' }}>
          <Spinner size={32} />
        </div>
      </Card>
    );
  }

  if (!subscription) {
    return (
      <Card title="Subscription & Resource Quota">
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          No active subscription record found for this organization.
        </div>
      </Card>
    );
  }

  const limit = subscription.resource_limit || 1;
  const usagePercentage = Math.min(Math.round((activeResourceCount / limit) * 100), 100);
  const isAtLimit = activeResourceCount >= limit;
  const isNearLimit = usagePercentage >= 80 && !isAtLimit;

  const getProgressColor = () => {
    if (isAtLimit) return 'var(--rose-500)';
    if (isNearLimit) return 'var(--amber-500)';
    return 'var(--emerald-500)';
  };

  const planName = subscription.plan?.name || 'Standard Provider Plan';
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: subscription.currency || 'INR',
    maximumFractionDigits: 0,
  }).format(subscription.price);

  return (
    <Card
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <CreditCard size={20} style={{ color: 'var(--navy-600)' }} />
          <span>Active Subscription & Inventory Quota</span>
        </div>
      }
      subtitle="Current licensing tier, renewal timeline, and live inventory capacity"
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
          marginBottom: '1.5rem',
        }}
      >
        {/* Plan Details Box */}
        <div
          style={{
            padding: '1.25rem',
            background: 'var(--slate-50)',
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>
              Current Plan
            </span>
            <Badge variant={subscription.status === 'ACTIVE' ? 'success' : 'warning'}>
              {subscription.status}
            </Badge>
          </div>

          <div style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--navy-900)' }}>
            {planName}
          </div>

          <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--navy-700)', marginTop: '0.25rem' }}>
            {formattedPrice}{' '}
            <span style={{ fontSize: '0.82rem', fontWeight: 400, color: 'var(--text-muted)' }}>
              / {subscription.billing_cycle.toLowerCase()}
            </span>
          </div>

          <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.84rem', color: 'var(--text-muted)' }}>
            {subscription.starts_at && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Calendar size={14} />
                <span>Started: {new Date(subscription.starts_at).toLocaleDateString()}</span>
              </div>
            )}
            {subscription.ends_at && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Calendar size={14} />
                <span>Valid Through: {new Date(subscription.ends_at).toLocaleDateString()}</span>
              </div>
            )}
            {subscription.trial_ends_at && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--amber-700)' }}>
                <Zap size={14} />
                <span>Trial Ends: {new Date(subscription.trial_ends_at).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>

        {/* Quota Progress Box */}
        <div
          style={{
            padding: '1.25rem',
            background: 'var(--surface-color)',
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>
                Inventory Resource Quota
              </span>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: getProgressColor() }}>
                {usagePercentage}%
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem', marginBottom: '0.85rem' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--navy-900)' }}>
                {activeResourceCount}
              </span>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                / {limit} Active Advertising Units
              </span>
            </div>

            {/* Visual Progress Bar */}
            <div
              style={{
                width: '100%',
                height: '8px',
                background: 'var(--slate-200)',
                borderRadius: '999px',
                overflow: 'hidden',
                marginBottom: '0.75rem',
              }}
            >
              <div
                style={{
                  width: `${usagePercentage}%`,
                  height: '100%',
                  background: getProgressColor(),
                  borderRadius: '999px',
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
          </div>

          {/* Quota Status Notice */}
          <div
            style={{
              padding: '0.65rem 0.85rem',
              borderRadius: '6px',
              fontSize: '0.82rem',
              background: isAtLimit ? '#fef2f2' : isNearLimit ? '#fffbeb' : '#f0fdf4',
              border: `1px solid ${
                isAtLimit ? '#fecaca' : isNearLimit ? '#fde68a' : '#bbf7d0'
              }`,
              color: isAtLimit ? '#991b1b' : isNearLimit ? '#92400e' : '#166534',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            {isAtLimit ? (
              <>
                <AlertTriangle size={15} style={{ flexShrink: 0 }} />
                <span>
                  <strong>Quota Reached:</strong> Creation of new active advertising units is locked by backend validation.
                </span>
              </>
            ) : isNearLimit ? (
              <>
                <AlertTriangle size={15} style={{ flexShrink: 0 }} />
                <span>
                  Approaching tier limit ({limit - activeResourceCount} units remaining).
                </span>
              </>
            ) : (
              <>
                <CheckCircle size={15} style={{ flexShrink: 0 }} />
                <span>
                  Healthy quota ({limit - activeResourceCount} units available for onboarding).
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SubscriptionOverviewCard;
