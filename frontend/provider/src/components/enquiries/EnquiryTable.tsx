import React from 'react';
import { Table, type TableColumn } from '../ui/Table';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import EmptyState from '../ui/EmptyState';
import {
  FileText,
  Calendar,
  Lock,
  Layers,
  Edit2,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import type { Enquiry, EnquiryStatus, EnquiryPriority } from '../../types/enquiry';
import type { PaginationMeta } from '../../types/common';
import { useAuth } from '../../context/AuthContext';

export interface EnquiryTableProps {
  enquiries: Enquiry[];
  pagination: PaginationMeta | null;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  onViewEnquiry: (enquiry: Enquiry) => void;
  onEditEnquiry: (enquiry: Enquiry) => void;
  onDeleteEnquiry?: (enquiry: Enquiry) => void;
}

const STATUS_BADGES: Record<
  EnquiryStatus,
  { label: string; variant: 'primary' | 'info' | 'warning' | 'orange' | 'success' | 'neutral' | 'danger' }
> = {
  NEW: { label: 'New', variant: 'primary' },
  UNDER_REVIEW: { label: 'Under Review', variant: 'info' },
  QUOTED: { label: 'Quoted', variant: 'warning' },
  NEGOTIATING: { label: 'Negotiating', variant: 'orange' },
  CONVERTED: { label: 'Converted', variant: 'success' },
  LOST: { label: 'Lost', variant: 'neutral' },
  CANCELLED: { label: 'Cancelled', variant: 'danger' },
};

const PRIORITY_STYLES: Record<EnquiryPriority, { bg: string; color: string }> = {
  LOW: { bg: '#f1f5f9', color: '#475569' },
  MEDIUM: { bg: '#eff6ff', color: '#1d4ed8' },
  HIGH: { bg: '#fffbeb', color: '#b45309' },
  URGENT: { bg: '#fef2f2', color: '#b91c1c' },
};

export const EnquiryTable: React.FC<EnquiryTableProps> = ({
  enquiries,
  pagination,
  isLoading,
  onPageChange,
  onViewEnquiry,
  onEditEnquiry,
  onDeleteEnquiry,
}) => {
  const { role } = useAuth();

  // RBAC from backend policy:
  // All provider roles can view, create, and update enquiries.
  // Owner and Manager ONLY can delete enquiries.
  const canDelete =
    role === 'PROVIDER_OWNER' ||
    role === 'PROVIDER_MANAGER' ||
    (role as any) === 'OWNER' ||
    (role as any) === 'MANAGER';

  const columns: TableColumn<Enquiry>[] = [
    {
      key: 'campaign',
      header: 'Campaign & Ref',
      width: '28%',
      render: (e) => (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <span style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.9rem' }}>
              {e.campaign_title}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem' }}>
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
              {e.enquiry_number}
            </span>

            <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
              <Layers size={12} style={{ color: '#94a3b8' }} />
              {e.items?.length ?? 0} {e.items?.length === 1 ? 'unit' : 'units'} requested
            </span>

            {e.active_holds_count ? e.active_holds_count > 0 ? (
              <span
                style={{
                  fontSize: '0.7rem',
                  backgroundColor: '#fef3c7',
                  color: '#92400e',
                  padding: '0.1rem 0.4rem',
                  borderRadius: '4px',
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.2rem',
                }}
              >
                <Lock size={10} /> {e.active_holds_count} Hold{e.active_holds_count > 1 ? 's' : ''}
              </span>
            ) : null : null}
          </div>
        </div>
      ),
    },
    {
      key: 'client',
      header: 'Client / Agency',
      width: '24%',
      render: (e) => (
        <div>
          <div style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.85rem' }}>
            {e.customer?.company_name || e.customer?.contact_person || 'Unassigned Client'}
          </div>
          {e.customer?.contact_person && e.customer?.company_name && (
            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.15rem' }}>
              Attn: {e.customer.contact_person}
            </div>
          )}
          {e.customer?.phone && (
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.15rem' }}>
              {e.customer.phone}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'schedule_budget',
      header: 'Dates & Budget',
      width: '22%',
      render: (e) => (
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
            <Calendar size={13} style={{ color: '#64748b' }} />
            <span>
              {e.start_date || 'TBD'} → {e.end_date || 'TBD'}
            </span>
          </div>

          <div
            style={{
              fontSize: '0.82rem',
              fontWeight: 600,
              color: e.estimated_budget ? '#0f766e' : '#94a3b8',
              marginTop: '0.2rem',
            }}
          >
            {e.estimated_budget
              ? `${e.currency || 'INR'} ${e.estimated_budget.toLocaleString()}`
              : 'Flexible / Unspecified'}
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status & Priority',
      width: '14%',
      render: (e) => {
        const badge = STATUS_BADGES[e.status] || { label: e.status, variant: 'neutral' };
        const prio = PRIORITY_STYLES[e.priority] || { bg: '#f1f5f9', color: '#475569' };
        return (
          <div>
            <Badge variant={badge.variant}>{badge.label}</Badge>
            <div style={{ marginTop: '0.25rem' }}>
              <span
                style={{
                  fontSize: '0.7rem',
                  backgroundColor: prio.bg,
                  color: prio.color,
                  padding: '0.1rem 0.35rem',
                  borderRadius: '4px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                }}
              >
                {e.priority}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      width: '12%',
      align: 'right',
      render: (e) => (
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
            onClick={() => onViewEnquiry(e)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '0.35rem 0.5rem',
              color: '#2563eb',
            }}
            title="Inspect & Check Availability"
          >
            <Eye size={15} />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEditEnquiry(e)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '0.35rem 0.5rem',
              color: '#0f766e',
            }}
            title="Edit Proposal"
          >
            <Edit2 size={15} />
          </Button>

          {canDelete && onDeleteEnquiry && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDeleteEnquiry(e)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '0.35rem 0.5rem',
                color: '#ef4444',
              }}
              title="Delete Enquiry (Owner/Manager only)"
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
        data={enquiries}
        keyExtractor={(e) => e.uuid}
        isLoading={isLoading}
        emptyState={
          <EmptyState
            icon={<FileText size={32} />}
            title="No Campaign Proposals Found"
            description="Build multi-item inventory proposals, evaluate real-time availability across your faces, and place tentative reservation holds."
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
            <strong>{pagination.last_page || 1}</strong> ({pagination.total} total enquiries)
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

export default EnquiryTable;
