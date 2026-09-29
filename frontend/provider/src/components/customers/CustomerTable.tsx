import React from 'react';
import { Table, type TableColumn } from '../ui/Table';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import EmptyState from '../ui/EmptyState';
import {
  Users,
  Mail,
  Phone,
  Edit2,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import type { Customer, CustomerType, CustomerStatus } from '../../types/customer';
import type { PaginationMeta } from '../../types/common';
import { useAuth } from '../../context/AuthContext';

export interface CustomerTableProps {
  customers: Customer[];
  pagination: PaginationMeta | null;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  onViewCustomer: (customer: Customer) => void;
  onEditCustomer: (customer: Customer) => void;
  onDeleteCustomer?: (customer: Customer) => void;
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

export const CustomerTable: React.FC<CustomerTableProps> = ({
  customers,
  pagination,
  isLoading,
  onPageChange,
  onViewCustomer,
  onEditCustomer,
  onDeleteCustomer,
}) => {
  const { role } = useAuth();

  // RBAC from backend policy:
  // All provider roles (Owner, Manager, Staff) can view, create, and update customers.
  // Owner and Manager ONLY can delete customers (Staff receives 403).
  const canDelete =
    role === 'PROVIDER_OWNER' ||
    role === 'PROVIDER_MANAGER' ||
    (role as any) === 'OWNER' ||
    (role as any) === 'MANAGER';

  const columns: TableColumn<Customer>[] = [
    {
      key: 'client',
      header: 'Client / Organization',
      width: '28%',
      render: (c) => (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <span style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.9rem' }}>
              {c.company_name || c.contact_person}
            </span>
            <span
              style={{
                fontSize: '0.72rem',
                fontFamily: 'monospace',
                backgroundColor: '#f1f5f9',
                color: '#475569',
                padding: '0.1rem 0.4rem',
                borderRadius: '4px',
                fontWeight: 600,
              }}
            >
              {c.code}
            </span>
          </div>

          {c.brand_name && (
            <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.15rem' }}>
              Brand: <strong>{c.brand_name}</strong>
            </div>
          )}

          {c.city && (
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.15rem' }}>
              {c.city}
              {c.state ? `, ${c.state}` : ''}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'contact',
      header: 'Contact Person',
      width: '24%',
      render: (c) => (
        <div>
          <div style={{ fontWeight: 500, color: '#1e293b', fontSize: '0.85rem' }}>
            {c.contact_person}
          </div>
          <div
            style={{
              fontSize: '0.75rem',
              color: '#64748b',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.15rem',
              marginTop: '0.2rem',
            }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
              <Phone size={11} style={{ color: '#94a3b8' }} /> {c.phone}
            </span>
            {c.email && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                <Mail size={11} style={{ color: '#94a3b8' }} /> {c.email}
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Classification',
      width: '18%',
      render: (c) => (
        <div>
          <span
            style={{
              fontSize: '0.8rem',
              backgroundColor: '#eff6ff',
              color: '#1d4ed8',
              padding: '0.2rem 0.5rem',
              borderRadius: '4px',
              fontWeight: 500,
              display: 'inline-block',
            }}
          >
            {TYPE_LABELS[c.customer_type] || c.customer_type}
          </span>
          {c.credit_period_days > 0 && (
            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
              Credit: {c.credit_period_days} days
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'tax_status',
      header: 'Tax & Status',
      width: '16%',
      render: (c) => {
        const badge = STATUS_BADGES[c.status] || { label: c.status, variant: 'neutral' };
        return (
          <div>
            <Badge variant={badge.variant}>{badge.label}</Badge>
            {c.gstin && (
              <div
                style={{
                  fontSize: '0.72rem',
                  fontFamily: 'monospace',
                  color: '#64748b',
                  marginTop: '0.25rem',
                }}
              >
                GST: {c.gstin}
              </div>
            )}
          </div>
        );
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      width: '14%',
      align: 'right',
      render: (c) => (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '0.35rem',
          }}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewCustomer(c)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '0.35rem 0.5rem',
              color: '#2563eb',
            }}
            title="View Details"
          >
            <Eye size={15} />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEditCustomer(c)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '0.35rem 0.5rem',
              color: '#0f766e',
            }}
            title="Edit Customer"
          >
            <Edit2 size={15} />
          </Button>

          {canDelete && onDeleteCustomer && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDeleteCustomer(c)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '0.35rem 0.5rem',
                color: '#ef4444',
              }}
              title="Delete Customer (Owner/Manager only)"
            >
              <Trash2 size={15} />
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid var(--border-color)',
        borderRadius: '10px',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)',
      }}
    >
      <Table
        columns={columns}
        data={customers}
        keyExtractor={(c) => c.uuid}
        isLoading={isLoading}
        emptyState={
          <EmptyState
            icon={<Users size={32} />}
            title="No Commercial Clients Found"
            description="Create client records for direct advertisers, brands, or media buying agencies to manage campaign enquiries and proposals."
          />
        }
      />

      {/* Pagination Footer */}
      {pagination && pagination.total > 0 && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.85rem 1.25rem',
            borderTop: '1px solid var(--border-color)',
            backgroundColor: '#f8fafc',
            fontSize: '0.85rem',
            color: '#64748b',
          }}
        >
          <div>
            Showing Page <strong>{pagination.current_page}</strong> of{' '}
            <strong>{pagination.last_page || 1}</strong> ({pagination.total} total clients)
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.current_page <= 1 || isLoading}
              onClick={() => onPageChange(pagination.current_page - 1)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                fontSize: '0.8rem',
              }}
            >
              <ChevronLeft size={14} />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.current_page >= pagination.last_page || isLoading}
              onClick={() => onPageChange(pagination.current_page + 1)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                fontSize: '0.8rem',
              }}
            >
              Next
              <ChevronRight size={14} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerTable;
