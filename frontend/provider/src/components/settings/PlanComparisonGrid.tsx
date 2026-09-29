import React from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Spinner from '../ui/Spinner';
import type { SubscriptionPlan } from '../../types/subscription';
import { Layers, Check, HelpCircle, PhoneCall, Mail } from 'lucide-react';

export interface PlanComparisonGridProps {
  plans: SubscriptionPlan[];
  currentPlanSlug?: string;
  isLoading: boolean;
}

export const PlanComparisonGrid: React.FC<PlanComparisonGridProps> = ({
  plans,
  currentPlanSlug,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <Card title="Platform Licensing Tiers">
        <div style={{ padding: '3rem', display: 'flex', justifyContent: 'center' }}>
          <Spinner size={32} />
        </div>
      </Card>
    );
  }

  return (
    <Card
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Layers size={20} style={{ color: 'var(--navy-600)' }} />
          <span>Available Platform Plans</span>
        </div>
      }
      subtitle="Compare resource allowances, analytics capabilities, and commercial tiers"
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.25rem',
          marginBottom: '1.5rem',
        }}
      >
        {plans.map((plan) => {
          const isCurrent = currentPlanSlug === plan.slug;
          const formattedMonthly = new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: plan.currency || 'INR',
            maximumFractionDigits: 0,
          }).format(plan.monthly_price);

          return (
            <div
              key={plan.id}
              style={{
                borderRadius: '8px',
                border: isCurrent
                  ? '2px solid var(--navy-600)'
                  : '1px solid var(--border-color)',
                padding: '1.25rem',
                background: isCurrent ? 'rgba(2, 132, 199, 0.02)' : 'var(--surface-color)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
              }}
            >
              {isCurrent && (
                <div
                  style={{
                    position: 'absolute',
                    top: '-10px',
                    right: '12px',
                  }}
                >
                  <Badge variant="primary">CURRENT PLAN</Badge>
                </div>
              )}

              <div>
                <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--navy-900)' }}>
                  {plan.name}
                </div>
                {plan.description && (
                  <p style={{ margin: '0.25rem 0 0.75rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    {plan.description}
                  </p>
                )}

                <div style={{ margin: '0.75rem 0', display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
                  <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--navy-900)' }}>
                    {formattedMonthly}
                  </span>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>/ month</span>
                </div>

                <div
                  style={{
                    fontSize: '0.84rem',
                    fontWeight: 600,
                    color: 'var(--navy-700)',
                    padding: '0.4rem 0.6rem',
                    background: 'var(--slate-100)',
                    borderRadius: '4px',
                    marginBottom: '1rem',
                  }}
                >
                  Capacity: {plan.min_resources} to {plan.max_resources} Advertising Units
                </div>

                {/* Features List */}
                {plan.features && plan.features.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
                    {plan.features.map((feature, idx) => (
                      <div
                        key={idx}
                        style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem', fontSize: '0.82rem', color: 'var(--navy-800)' }}
                      >
                        <Check size={14} style={{ color: 'var(--emerald-600)', marginTop: '2px', flexShrink: 0 }} />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Informational Advisory Notice */}
              <div
                style={{
                  paddingTop: '0.85rem',
                  borderTop: '1px solid var(--border-color)',
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                <HelpCircle size={14} />
                <span>
                  {isCurrent
                    ? 'Active subscription licensing tier'
                    : 'Contact enterprise support to change tiers'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Upgrade & Enterprise Support Contact Box */}
      <div
        style={{
          background: '#f8fafc',
          border: '1px solid var(--border-color)',
          borderRadius: '8px',
          padding: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <h4 style={{ margin: '0 0 0.25rem', fontSize: '0.95rem', fontWeight: 600, color: 'var(--navy-900)' }}>
            Need Higher Unit Allowances or Custom Enterprise Tiers?
          </h4>
          <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--text-muted)' }}>
            To expand your active inventory quota beyond standard tiers or customize billing frequencies, connect directly with our network operations team.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <a
            href="mailto:support@sodaars.com?subject=Subscription%20Tier%20Inquiry"
            className="btn btn-secondary btn-sm"
            style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Mail size={14} />
            <span>Email Enterprise Support</span>
          </a>
          <a
            href="tel:+911800123456"
            className="btn btn-secondary btn-sm"
            style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <PhoneCall size={14} />
            <span>Call Helpline</span>
          </a>
        </div>
      </div>
    </Card>
  );
};

export default PlanComparisonGrid;
