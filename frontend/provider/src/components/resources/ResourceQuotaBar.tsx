import React from 'react';
import type { TenantSubscription } from '../../types/resource';
import { Shield, AlertTriangle } from 'lucide-react';

export interface ResourceQuotaBarProps {
  activeCount: number;
  subscription: TenantSubscription | null;
  isLoading?: boolean;
}

export const ResourceQuotaBar: React.FC<ResourceQuotaBarProps> = ({
  activeCount,
  subscription,
  isLoading = false,
}) => {
  if (isLoading || !subscription) {
    return null;
  }

  const limit = subscription.resource_limit;
  const planName = subscription.plan?.name || 'Standard';
  const percentage = limit > 0 ? Math.min(Math.round((activeCount / limit) * 100), 100) : 0;
  const isAtLimit = activeCount >= limit;
  const isNearLimit = percentage >= 80 && !isAtLimit;

  let progressColor = 'var(--blue-600)';
  if (isAtLimit) {
    progressColor = 'var(--rose-600)';
  } else if (isNearLimit) {
    progressColor = 'var(--orange-500)';
  }

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-md)',
        padding: '0.85rem 1.25rem',
        marginBottom: '1.25rem',
        boxShadow: 'var(--shadow-xs)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '0.5rem',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '28px',
              height: '28px',
              borderRadius: 'var(--radius-xs)',
              backgroundColor: 'var(--blue-50)',
              color: 'var(--blue-700)',
            }}
          >
            <Shield size={16} />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-heading)' }}>
              Active Inventory Quota
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Plan: <strong>{planName}</strong>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <span
            style={{
              fontSize: '0.95rem',
              fontWeight: 700,
              color: isAtLimit ? 'var(--rose-600)' : 'var(--text-heading)',
              fontFamily: 'var(--font-mono)',
            }}
          >
            {activeCount}
          </span>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginLeft: '4px' }}>
            / {limit} active
          </span>
        </div>
      </div>

      {/* Progress Track */}
      <div
        style={{
          width: '100%',
          height: '6px',
          backgroundColor: 'var(--canvas-bg)',
          borderRadius: 'var(--radius-full)',
          overflow: 'hidden',
          marginBottom: isAtLimit ? '0.6rem' : '0',
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            height: '100%',
            backgroundColor: progressColor,
            borderRadius: 'var(--radius-full)',
            transition: 'width 0.4s ease, background-color 0.4s ease',
          }}
        />
      </div>

      {isAtLimit && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.78rem',
            color: 'var(--rose-700)',
            backgroundColor: 'var(--rose-50)',
            padding: '4px 8px',
            borderRadius: 'var(--radius-xs)',
          }}
        >
          <AlertTriangle size={14} style={{ flexShrink: 0 }} />
          <span>
            Your active resource limit has been reached for your current plan. Inactive resources can still be managed.
          </span>
        </div>
      )}
    </div>
  );
};

export default ResourceQuotaBar;
