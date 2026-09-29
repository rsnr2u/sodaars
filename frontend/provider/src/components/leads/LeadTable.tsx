import React from 'react';
import { Table, type TableColumn } from '../ui/Table';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import EmptyState from '../ui/EmptyState';
import {
  Inbox,
  User,
  Building2,
  Mail,
  Phone,
  Calendar,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import type { DirectoryLead, LeadStatus } from '../../types/lead';
import type { PaginationMeta } from '../../types/common';
import { useAuth } from '../../context/AuthContext';

export interface LeadTableProps {
  leads: DirectoryLead[];
  pagination: PaginationMeta | null;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  onSelectLead: (lead: DirectoryLead) => void;
  onDeleteLead?: (lead: DirectoryLead) => void;
}

const STATUS_BADGES: Record<
  LeadStatus,
  { label: string; variant: 'primary' | 'warning' | 'success' | 'neutral' }
> = {
  NEW: { label: 'New', variant: 'primary' },
  CONTACTED: { label: 'Contacted', variant: 'warning' },
  CONVERTED: { label: 'Converted', variant: 'success' },
  ARCHIVED: { label: 'Archived', variant: 'neutral' },
};

export const LeadTable: React.FC<LeadTableProps> = ({
  leads,
  pagination,
  isLoading,
  onPageChange,
  onSelectLead,
  onDeleteLead,
}) => {
  const { role } = useAuth();
  const canDelete =
    role === 'PROVIDER_OWNER' ||
    role === 'PROVIDER_MANAGER' ||
    (role as any) === 'OWNER' ||
    (role as any) === 'MANAGER';

  const columns: TableColumn<DirectoryLead>[] = [
    {
      key: 'visitor',
      header: 'Prospective Client',
      width: '26%',
      render: (lead) => (
        <div>
          <div
            style={{
              fontWeight: 600,
              color: '#0f172a',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <User size={14} style={{ color: '#2563eb', flexShrink: 0 }} />
            <span>{lead.visitor.name}</span>
          </div>
          {lead.visitor.company_name && (
            <div
              style={{
                fontSize: '0.78rem',
                color: '#64748b',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                marginTop: '0.15rem',
              }}
            >
              <Building2 size={12} style={{ color: '#94a3b8' }} />
              <span>{lead.visitor.company_name}</span>
            </div>
          )}
          <div
            style={{
              fontSize: '0.75rem',
              color: '#94a3b8',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.5rem',
              marginTop: '0.25rem',
            }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
              <Mail size={11} /> {lead.visitor.email}
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
              <Phone size={11} /> {lead.visitor.phone}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'historical_inventory',
      header: 'Historical Snapshot',
      width: '26%',
      render: (lead) => (
        <div>
          <div
            style={{
              fontWeight: 600,
              color: '#1e293b',
              fontSize: '0.875rem',
            }}
          >
            {lead.snapshots.resource_name || 'General Inventory Inquiry'}
          </div>
          <div
            style={{
              fontSize: '0.78rem',
              color: '#64748b',
              marginTop: '0.15rem',
            }}
          >
            Code:{' '}
            <span style={{ fontFamily: 'monospace', fontWeight: 600, color: '#0f172a' }}>
              {lead.snapshots.resource_code || '—'}
            </span>
          </div>
          <div
            style={{
              fontSize: '0.75rem',
              color: '#94a3b8',
              marginTop: '0.15rem',
            }}
          >
            Location: {lead.snapshots.location_name || 'Unspecified'}
            {lead.snapshots.location_area ? ` (${lead.snapshots.location_area})` : ''}
          </div>
        </div>
      ),
    },
    {
      key: 'campaign',
      header: 'Campaign & Budget',
      width: '22%',
      render: (lead) => (
        <div>
          <div
            style={{
              fontSize: '0.8rem',
              color: '#0f172a',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <Calendar size={13} style={{ color: '#64748b', flexShrink: 0 }} />
            <span>
              {lead.campaign.start_date || 'TBD'} → {lead.campaign.end_date || 'TBD'}
            </span>
          </div>
          <div
            style={{
              fontSize: '0.8rem',
              fontWeight: 600,
              color: lead.campaign.estimated_budget ? '#0f766e' : '#94a3b8',
              marginTop: '0.2rem',
            }}
          >
            {lead.campaign.estimated_budget
              ? `$${lead.campaign.estimated_budget.toLocaleString()}`
              : 'Budget unstated'}
          </div>
          {lead.campaign.message && (
            <div
              style={{
                fontSize: '0.75rem',
                color: '#64748b',
                marginTop: '0.2rem',
                maxWidth: '220px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
              title={lead.campaign.message}
            >
              "{lead.campaign.message}"
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      width: '12%',
      render: (lead) => {
        const badgeConfig = STATUS_BADGES[lead.status] || {
          label: lead.status,
          variant: 'secondary',
        };
        return <Badge variant={badgeConfig.variant}>{badgeConfig.label}</Badge>;
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      width: '14%',
      align: 'right',
      render: (lead) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.4rem' }}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSelectLead(lead)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              fontSize: '0.8rem',
              padding: '0.35rem 0.6rem',
              color: '#2563eb',
            }}
          >
            <Eye size={14} />
            Inspect
          </Button>

          {canDelete && onDeleteLead && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDeleteLead(lead)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '0.35rem 0.5rem',
                color: '#ef4444',
              }}
              title="Delete lead (Owner/Manager only)"
            >
              <Trash2 size={14} />
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
        data={leads}
        keyExtractor={(lead) => lead.uuid}
        isLoading={isLoading}
        emptyState={
          <EmptyState
            icon={<Inbox size={32} />}
            title="No Directory Inquiries Found"
            description="Incoming advertiser leads submitted via the public discovery directory will appear here with full campaign requirements and immutable historical context."
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
            <strong>{pagination.last_page || 1}</strong> ({pagination.total} total leads)
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

export default LeadTable;
