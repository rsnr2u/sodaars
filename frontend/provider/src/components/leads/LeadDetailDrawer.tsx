import React, { useState, useEffect } from 'react';
import Drawer from '../ui/Drawer';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Spinner from '../ui/Spinner';
import {
  User,
  Mail,
  Phone,
  Calendar,
  Camera,
  FileText,
  ArrowRight,
  Trash2,
  CheckCircle,
  ShieldAlert,
} from 'lucide-react';
import type { DirectoryLead, LeadStatus } from '../../types/lead';
import leadService from '../../services/leadService';
import { useAuth } from '../../context/AuthContext';

export interface LeadDetailDrawerProps {
  lead: DirectoryLead | null;
  isOpen: boolean;
  onClose: () => void;
  onLeadUpdated: (updatedLead: DirectoryLead) => void;
  onLeadDeleted: (leadUuid: string) => void;
}

const ALLOWED_TRANSITIONS: Record<LeadStatus, LeadStatus[]> = {
  NEW: ['CONTACTED', 'ARCHIVED'],
  CONTACTED: ['CONVERTED', 'ARCHIVED'],
  CONVERTED: [],
  ARCHIVED: [],
};

const STATUS_LABELS: Record<LeadStatus, { label: string; description: string }> = {
  NEW: { label: 'New', description: 'Fresh incoming lead awaiting first outreach' },
  CONTACTED: { label: 'Contacted', description: 'Outreach initiated with prospective advertiser' },
  CONVERTED: { label: 'Converted', description: 'Advertiser successfully retained for inventory' },
  ARCHIVED: { label: 'Archived', description: 'Inquiry closed or no longer actionable' },
};

export const LeadDetailDrawer: React.FC<LeadDetailDrawerProps> = ({
  lead,
  isOpen,
  onClose,
  onLeadUpdated,
  onLeadDeleted,
}) => {
  const { role } = useAuth();
  const canDelete =
    role === 'PROVIDER_OWNER' ||
    role === 'PROVIDER_MANAGER' ||
    (role as any) === 'OWNER' ||
    (role as any) === 'MANAGER';

  const [notes, setNotes] = useState('');
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [notesFeedback, setNotesFeedback] = useState<string | null>(null);

  const [selectedNextStatus, setSelectedNextStatus] = useState<LeadStatus | ''>('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [statusFeedback, setStatusFeedback] = useState<string | null>(null);

  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Sync internal state when lead changes
  useEffect(() => {
    if (lead) {
      setNotes(lead.internal_notes || '');
      setSelectedNextStatus('');
      setNotesFeedback(null);
      setStatusFeedback(null);
      setIsConfirmingDelete(false);
      setDeleteError(null);
    }
  }, [lead]);

  if (!lead) return null;

  const validNextStatuses = ALLOWED_TRANSITIONS[lead.status] || [];
  const isTerminal = validNextStatuses.length === 0;

  // Handle Note Save
  const handleSaveNotes = async () => {
    try {
      setIsSavingNotes(true);
      setNotesFeedback(null);
      const updated = await leadService.updateLeadNotes(lead.uuid, notes);
      onLeadUpdated(updated);
      setNotesFeedback('Notes updated successfully');
      setTimeout(() => setNotesFeedback(null), 3000);
    } catch (err: any) {
      setNotesFeedback(err.response?.data?.message || 'Failed to update internal notes');
    } finally {
      setIsSavingNotes(false);
    }
  };

  // Handle Status Update
  const handleUpdateStatus = async () => {
    if (!selectedNextStatus) return;
    try {
      setIsUpdatingStatus(true);
      setStatusFeedback(null);
      const updated = await leadService.updateLeadStatus(lead.uuid, selectedNextStatus as LeadStatus);
      onLeadUpdated(updated);
      setSelectedNextStatus('');
      setStatusFeedback(`Status advanced to ${selectedNextStatus}`);
      setTimeout(() => setStatusFeedback(null), 3000);
    } catch (err: any) {
      setStatusFeedback(err.response?.data?.message || 'Failed to advance status');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Handle Delete Lead
  const handleDelete = async () => {
    if (!canDelete) return;
    try {
      setIsDeleting(true);
      setDeleteError(null);
      await leadService.deleteLead(lead.uuid);
      onLeadDeleted(lead.uuid);
      onClose();
    } catch (err: any) {
      setDeleteError(err.response?.data?.message || 'Failed to delete directory lead');
      setIsDeleting(false);
    }
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="560px"
      title={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingRight: '1.5rem' }}>
          <div>
            <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0f172a' }}>
              Directory Inquiry
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.1rem' }}>
              Ref: {lead.uuid.slice(0, 13)}... • Source: {lead.source}
            </div>
          </div>
          <Badge
            variant={
              lead.status === 'CONVERTED'
                ? 'success'
                : lead.status === 'CONTACTED'
                ? 'warning'
                : lead.status === 'NEW'
                ? 'primary'
                : 'neutral'
            }
          >
            {lead.status}
          </Badge>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Section 1: Prospective Client Information */}
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
              marginBottom: '0.75rem',
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
              <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>Name</label>
              <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.92rem' }}>
                {lead.visitor.name}
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>Company</label>
              <div style={{ color: '#1e293b', fontSize: '0.92rem' }}>
                {lead.visitor.company_name || 'Individual Advertiser'}
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>Email</label>
              <a
                href={`mailto:${lead.visitor.email}`}
                style={{
                  color: '#2563eb',
                  textDecoration: 'none',
                  fontSize: '0.88rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                }}
              >
                <Mail size={13} /> {lead.visitor.email}
              </a>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>Phone</label>
              <a
                href={`tel:${lead.visitor.phone}`}
                style={{
                  color: '#2563eb',
                  textDecoration: 'none',
                  fontSize: '0.88rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                }}
              >
                <Phone size={13} /> {lead.visitor.phone}
              </a>
            </div>
          </div>
        </div>

        {/* Section 2: Immutable Historical Snapshots */}
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
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '0.6rem',
            }}
          >
            <div
              style={{
                fontSize: '0.85rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                color: '#475569',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <Camera size={15} style={{ color: '#0f766e' }} />
              <span>Historical Snapshot Values</span>
            </div>
            <span
              style={{
                fontSize: '0.7rem',
                backgroundColor: '#e2e8f0',
                color: '#475569',
                padding: '0.15rem 0.45rem',
                borderRadius: '4px',
                fontWeight: 500,
              }}
            >
              Immutable Record
            </span>
          </div>

          <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '0 0 0.85rem' }}>
            Historical advertising resource and location data recorded at the moment this directory inquiry was submitted.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>
                Resource Name (Historical)
              </label>
              <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.9rem' }}>
                {lead.snapshots.resource_name || 'General Inventory'}
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>
                Resource Code (Historical)
              </label>
              <div style={{ fontFamily: 'monospace', fontWeight: 600, color: '#0f172a', fontSize: '0.9rem' }}>
                {lead.snapshots.resource_code || '—'}
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>
                Location Name (Historical)
              </label>
              <div style={{ color: '#1e293b', fontSize: '0.88rem' }}>
                {lead.snapshots.location_name || 'Unspecified'}
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>
                Location Area (Historical)
              </label>
              <div style={{ color: '#1e293b', fontSize: '0.88rem' }}>
                {lead.snapshots.location_area || '—'}
              </div>
            </div>
          </div>

          {/* Current Reference Indicator */}
          <div
            style={{
              marginTop: '0.85rem',
              paddingTop: '0.75rem',
              borderTop: '1px solid #e2e8f0',
              fontSize: '0.75rem',
              color: '#64748b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span>Live Resource Link:</span>
            {lead.referenced_resource ? (
              <span style={{ color: '#0f766e', fontWeight: 500 }}>
                Active Unit: {lead.referenced_resource.code} ({lead.referenced_resource.name})
              </span>
            ) : (
              <span style={{ color: '#94a3b8' }}>Unit unreferenced or deleted</span>
            )}
          </div>
        </div>

        {/* Section 3: Campaign Requirements */}
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
              marginBottom: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <Calendar size={15} style={{ color: '#f97316' }} />
            <span>Campaign Specifications</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '0.85rem' }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>Target Dates</label>
              <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.88rem' }}>
                {lead.campaign.start_date || 'TBD'} → {lead.campaign.end_date || 'TBD'}
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>Estimated Budget</label>
              <div style={{ fontWeight: 600, color: '#0f766e', fontSize: '0.92rem' }}>
                {lead.campaign.estimated_budget
                  ? `$${lead.campaign.estimated_budget.toLocaleString()}`
                  : 'Flexible / Not Specified'}
              </div>
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '0.25rem' }}>
              Advertiser Message & Requirements
            </label>
            <div
              style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                padding: '0.75rem',
                fontSize: '0.85rem',
                color: '#1e293b',
                whiteSpace: 'pre-wrap',
                lineHeight: 1.5,
              }}
            >
              {lead.campaign.message || 'No additional message provided.'}
            </div>
          </div>
        </div>

        {/* Section 4: Lifecycle State Machine Transitions */}
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
              marginBottom: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <ArrowRight size={15} style={{ color: '#2563eb' }} />
            <span>Lifecycle Status Management</span>
          </div>

          <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '0 0 0.85rem' }}>
            Current status: <strong>{lead.status}</strong> ({STATUS_LABELS[lead.status]?.description}).
          </p>

          {isTerminal ? (
            <div
              style={{
                backgroundColor: '#f1f5f9',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                padding: '0.75rem',
                fontSize: '0.82rem',
                color: '#475569',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <CheckCircle size={16} style={{ color: '#64748b', flexShrink: 0 }} />
              <span>
                This lead has reached terminal state <strong>{lead.status}</strong>. Per SODAARS state machine policy, it cannot be transitioned further.
              </span>
            </div>
          ) : (
            <div>
              <label style={{ fontSize: '0.75rem', color: '#475569', display: 'block', marginBottom: '0.35rem', fontWeight: 500 }}>
                Advance Status to Allowed Next State:
              </label>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <select
                  value={selectedNextStatus}
                  onChange={(e) => setSelectedNextStatus(e.target.value as LeadStatus)}
                  style={{
                    flex: 1,
                    padding: '0.55rem 0.75rem',
                    fontSize: '0.85rem',
                    borderRadius: '6px',
                    border: '1px solid var(--border-color)',
                    backgroundColor: '#ffffff',
                    color: '#0f172a',
                    outline: 'none',
                  }}
                >
                  <option value="">Select next status transition...</option>
                  {validNextStatuses.map((st) => (
                    <option key={st} value={st}>
                      {STATUS_LABELS[st]?.label || st} — {STATUS_LABELS[st]?.description}
                    </option>
                  ))}
                </select>

                <Button
                  variant="primary"
                  size="sm"
                  disabled={!selectedNextStatus || isUpdatingStatus}
                  onClick={handleUpdateStatus}
                  style={{ minWidth: '100px' }}
                >
                  {isUpdatingStatus ? (
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Spinner size={14} /> Updating...
                    </div>
                  ) : (
                    'Advance'
                  )}
                </Button>
              </div>

              {statusFeedback && (
                <div
                  style={{
                    marginTop: '0.5rem',
                    fontSize: '0.78rem',
                    color: statusFeedback.includes('Failed') ? '#ef4444' : '#16a34a',
                    fontWeight: 500,
                  }}
                >
                  {statusFeedback}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Section 5: Internal Operational Notes */}
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
              marginBottom: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <FileText size={15} style={{ color: '#0f172a' }} />
            <span>Internal Operational Notes</span>
          </div>

          <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '0 0 0.75rem' }}>
            Private notes visible to organization staff, managers, and owners. Not shared with the advertiser.
          </p>

          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            placeholder="Add internal meeting logs, phone call notes, pricing negotiations, or follow-up details..."
            style={{
              width: '100%',
              padding: '0.65rem 0.75rem',
              fontSize: '0.85rem',
              borderRadius: '6px',
              border: '1px solid var(--border-color)',
              color: '#0f172a',
              resize: 'vertical',
              outline: 'none',
              fontFamily: 'inherit',
              boxSizing: 'border-box',
            }}
          />

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '0.65rem',
            }}
          >
            {notesFeedback ? (
              <span
                style={{
                  fontSize: '0.78rem',
                  color: notesFeedback.includes('Failed') ? '#ef4444' : '#16a34a',
                  fontWeight: 500,
                }}
              >
                {notesFeedback}
              </span>
            ) : (
              <span />
            )}

            <Button
              variant="secondary"
              size="sm"
              disabled={isSavingNotes || notes === (lead.internal_notes || '')}
              onClick={handleSaveNotes}
            >
              {isSavingNotes ? (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Spinner size={14} /> Saving...
                </div>
              ) : (
                'Save Notes'
              )}
            </Button>
          </div>
        </div>

        {/* Section 6: Lead Deletion (Owner / Manager Only) */}
        <div
          style={{
            borderTop: '1px solid var(--border-color)',
            paddingTop: '1.25rem',
          }}
        >
          {canDelete ? (
            !isConfirmingDelete ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsConfirmingDelete(true)}
                style={{
                  color: '#ef4444',
                  fontSize: '0.82rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                <Trash2 size={14} /> Delete This Directory Lead
              </Button>
            ) : (
              <div
                style={{
                  backgroundColor: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: '6px',
                  padding: '0.85rem',
                }}
              >
                <div
                  style={{
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    color: '#991b1b',
                    marginBottom: '0.35rem',
                  }}
                >
                  Confirm Lead Deletion
                </div>
                <p style={{ fontSize: '0.78rem', color: '#b91c1c', margin: '0 0 0.75rem' }}>
                  Are you sure you want to permanently delete this directory lead from your tenant inbox? This action cannot be undone.
                </p>

                {deleteError && (
                  <div
                    style={{
                      color: '#ef4444',
                      fontSize: '0.78rem',
                      marginBottom: '0.5rem',
                      fontWeight: 500,
                    }}
                  >
                    {deleteError}
                  </div>
                )}

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Button
                    variant="danger"
                    size="sm"
                    disabled={isDeleting}
                    onClick={handleDelete}
                  >
                    {isDeleting ? 'Deleting...' : 'Yes, Delete'}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={isDeleting}
                    onClick={() => setIsConfirmingDelete(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )
          ) : (
            <div
              style={{
                fontSize: '0.78rem',
                color: '#94a3b8',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <ShieldAlert size={14} />
              <span>Staff role has read and note permissions; lead deletion requires Owner or Manager privilege.</span>
            </div>
          )}
        </div>
      </div>
    </Drawer>
  );
};

export default LeadDetailDrawer;
