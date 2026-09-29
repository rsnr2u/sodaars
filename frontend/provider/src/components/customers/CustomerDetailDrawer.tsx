import React from 'react';
import Drawer from '../ui/Drawer';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import type { Customer, CustomerType, CustomerStatus } from '../../types/customer';
import { useAuth } from '../../context/AuthContext';
import {
  User,
  Phone,
  Mail,
  CreditCard,
  Globe,
  FileText,
  Edit2,
  Trash2,
  ShieldAlert,
} from 'lucide-react';

export interface CustomerDetailDrawerProps {
  customer: Customer | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (customer: Customer) => void;
  onDelete?: (customer: Customer) => void;
}

const TYPE_LABELS: Record<CustomerType, string> = {
  DIRECT_ADVERTISER: 'Direct Advertiser',
  AGENCY: 'Advertising Agency',
  BRAND: 'Corporate Brand',
  INDIVIDUAL: 'Individual',
  GOVERNMENT: 'Government / Civic',
};

const STATUS_BADGES: Record<
  CustomerStatus,
  { label: string; variant: 'success' | 'neutral' | 'danger' }
> = {
  ACTIVE: { label: 'Active', variant: 'success' },
  INACTIVE: { label: 'Inactive', variant: 'neutral' },
  BLOCKED: { label: 'Blocked', variant: 'danger' },
};

export const CustomerDetailDrawer: React.FC<CustomerDetailDrawerProps> = ({
  customer,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}) => {
  const { role } = useAuth();

  const canDelete =
    role === 'PROVIDER_OWNER' ||
    role === 'PROVIDER_MANAGER' ||
    (role as any) === 'OWNER' ||
    (role as any) === 'MANAGER';

  if (!customer) return null;

  const statusBadge = STATUS_BADGES[customer.status] || { label: customer.status, variant: 'neutral' };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="560px"
      title={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingRight: '1.5rem' }}>
          <div>
            <div style={{ fontSize: '1.15rem', fontWeight: 600, color: '#0f172a' }}>
              {customer.company_name || customer.contact_person}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.1rem' }}>
              Code: <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{customer.code}</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
            <span
              style={{
                fontSize: '0.75rem',
                backgroundColor: '#eff6ff',
                color: '#1d4ed8',
                padding: '0.15rem 0.5rem',
                borderRadius: '4px',
                fontWeight: 500,
              }}
            >
              {TYPE_LABELS[customer.customer_type] || customer.customer_type}
            </span>
            <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
          </div>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Section 1: Contact Information */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            padding: '1.1rem',
          }}
        >
          <div
            style={{
              fontSize: '0.85rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              color: '#64748b',
              marginBottom: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <User size={15} style={{ color: '#2563eb' }} />
            <span>Contact Information</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>Contact Person</label>
              <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.92rem' }}>
                {customer.contact_person}
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>Brand Name</label>
              <div style={{ color: '#1e293b', fontSize: '0.92rem' }}>
                {customer.brand_name || '—'}
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>Primary Phone</label>
              <a
                href={`tel:${customer.phone}`}
                style={{
                  color: '#2563eb',
                  textDecoration: 'none',
                  fontSize: '0.88rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                }}
              >
                <Phone size={13} /> {customer.phone}
              </a>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>Official Email</label>
              {customer.email ? (
                <a
                  href={`mailto:${customer.email}`}
                  style={{
                    color: '#2563eb',
                    textDecoration: 'none',
                    fontSize: '0.88rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                  }}
                >
                  <Mail size={13} /> {customer.email}
                </a>
              ) : (
                <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Not provided</span>
              )}
            </div>

            {customer.alternate_phone && (
              <div>
                <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>Alternate Phone</label>
                <span style={{ fontSize: '0.85rem', color: '#334155' }}>{customer.alternate_phone}</span>
              </div>
            )}

            {customer.website && (
              <div>
                <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>Website</label>
                <a
                  href={customer.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: '#2563eb',
                    fontSize: '0.85rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                  }}
                >
                  <Globe size={13} /> {customer.website}
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Section 2: Commercial & Tax Profile */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            padding: '1.1rem',
          }}
        >
          <div
            style={{
              fontSize: '0.85rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              color: '#64748b',
              marginBottom: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <CreditCard size={15} style={{ color: '#f97316' }} />
            <span>Commercial & Tax Credentials</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '0.85rem' }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>GSTIN</label>
              <div style={{ fontFamily: 'monospace', fontWeight: 600, color: '#0f172a', fontSize: '0.88rem' }}>
                {customer.gstin || 'Unregistered'}
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>PAN Number</label>
              <div style={{ fontFamily: 'monospace', fontWeight: 600, color: '#0f172a', fontSize: '0.88rem' }}>
                {customer.pan_number || '—'}
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>Credit Period</label>
              <div style={{ fontWeight: 600, color: '#0f766e', fontSize: '0.88rem' }}>
                {customer.credit_period_days > 0 ? `${customer.credit_period_days} Days Net` : 'Immediate / Advance'}
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>Associated Enquiries</label>
              <div style={{ fontWeight: 600, color: '#2563eb', fontSize: '0.88rem' }}>
                {customer.enquiries_count ?? 0} Campaigns
              </div>
            </div>
          </div>

          {(customer.billing_address || customer.city || customer.state) && (
            <div style={{ paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9' }}>
              <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '0.2rem' }}>
                Billing Address
              </label>
              <div style={{ fontSize: '0.85rem', color: '#334155', lineHeight: 1.4 }}>
                {customer.billing_address && <div>{customer.billing_address}</div>}
                <div>
                  {[customer.city, customer.state, customer.pincode, customer.country]
                    .filter(Boolean)
                    .join(', ')}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Section 3: Notes & Relationship Context */}
        {customer.notes && (
          <div
            style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '1.1rem',
            }}
          >
            <div
              style={{
                fontSize: '0.85rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                color: '#64748b',
                marginBottom: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <FileText size={15} style={{ color: '#0f172a' }} />
              <span>Internal Notes</span>
            </div>
            <div style={{ fontSize: '0.82rem', color: '#334155', whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
              {customer.notes}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '1rem',
            borderTop: '1px solid var(--border-color)',
          }}
        >
          <div>
            {canDelete && onDelete ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  onClose();
                  onDelete(customer);
                }}
                style={{ color: '#ef4444', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <Trash2 size={14} /> Delete Client
              </Button>
            ) : (
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                <ShieldAlert size={13} /> Staff read/edit only
              </span>
            )}
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              onClose();
              onEdit(customer);
            }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <Edit2 size={14} /> Edit Client
          </Button>
        </div>
      </div>
    </Drawer>
  );
};

export default CustomerDetailDrawer;
