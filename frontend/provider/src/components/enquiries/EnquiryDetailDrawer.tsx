import React, { useState } from 'react';
import Drawer from '../ui/Drawer';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Spinner from '../ui/Spinner';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import type {
  Enquiry,
  EnquiryStatus,
  EnquiryAvailabilityResponse,
} from '../../types/enquiry';
import enquiryService from '../../services/enquiryService';
import { getApiErrorMessage } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  Building2,
  Lock,
  Layers,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Trash2,
  Edit2,
  ShieldAlert,
  Search,
} from 'lucide-react';

export interface EnquiryDetailDrawerProps {
  enquiry: Enquiry | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (enquiry: Enquiry) => void;
  onEnquiryUpdated: (updatedEnquiry: Enquiry) => void;
  onEnquiryDeleted?: (enquiry: Enquiry) => void;
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

// Exact backend state machine transitions from App\Enums\EnquiryStatus::canTransitionTo
const ALLOWED_ENQUIRY_TRANSITIONS: Record<EnquiryStatus, EnquiryStatus[]> = {
  NEW: ['UNDER_REVIEW', 'CANCELLED'],
  UNDER_REVIEW: ['QUOTED', 'LOST', 'CANCELLED'],
  QUOTED: ['NEGOTIATING', 'CONVERTED', 'LOST', 'CANCELLED'],
  NEGOTIATING: ['QUOTED', 'CONVERTED', 'LOST', 'CANCELLED'],
  CONVERTED: [], // Terminal
  LOST: ['UNDER_REVIEW'], // Re-open
  CANCELLED: [], // Terminal
};

export const EnquiryDetailDrawer: React.FC<EnquiryDetailDrawerProps> = ({
  enquiry,
  isOpen,
  onClose,
  onEdit,
  onEnquiryUpdated,
  onEnquiryDeleted,
}) => {
  const { role } = useAuth();
  const { success, error: showError } = useToast();

  // RBAC from backend policy:
  // Owner & Manager: can delete enquiry and place tentative holds (requires availability.update).
  // Staff: can view, update, check availability, transition status, but CANNOT delete or place holds!
  const canDelete =
    role === 'PROVIDER_OWNER' ||
    role === 'PROVIDER_MANAGER' ||
    (role as any) === 'OWNER' ||
    (role as any) === 'MANAGER';

  const canPlaceHold = canDelete;

  // Availability Check State
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [availabilityResults, setAvailabilityResults] = useState<EnquiryAvailabilityResponse | null>(null);

  // Status Transition State
  const [selectedNextStatus, setSelectedNextStatus] = useState<EnquiryStatus | ''>('');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [lostReason, setLostReason] = useState('');
  const [showLostReasonModal, setShowLostReasonModal] = useState(false);

  // Tentative Hold Placement State
  const [holdingItemUuid, setHoldingItemUuid] = useState<string | null>(null);
  const [holdDurationHours, setHoldDurationHours] = useState<number>(72);
  const [holdNotes, setHoldNotes] = useState<string>('');
  const [isPlacingHold, setIsPlacingHold] = useState(false);

  if (!enquiry) return null;

  const validNextStatuses = ALLOWED_ENQUIRY_TRANSITIONS[enquiry.status] || [];
  const isTerminal = validNextStatuses.length === 0;
  const statusBadge = STATUS_BADGES[enquiry.status] || { label: enquiry.status, variant: 'neutral' };

  // Trigger Live Availability Evaluation
  const handleCheckAvailability = async () => {
    try {
      setIsCheckingAvailability(true);
      const results = await enquiryService.checkAvailability(enquiry.uuid);
      setAvailabilityResults(results);
      success('Live availability evaluated for all items.');
    } catch (err: any) {
      showError(getApiErrorMessage(err));
    } finally {
      setIsCheckingAvailability(false);
    }
  };

  // Trigger Status Transition
  const handleTransitionStatus = async (targetStatus?: EnquiryStatus, reason?: string) => {
    const statusToApply = targetStatus || (selectedNextStatus as EnquiryStatus);
    if (!statusToApply) return;

    if (statusToApply === 'LOST' && !reason) {
      setShowLostReasonModal(true);
      return;
    }

    try {
      setIsTransitioning(true);
      const updated = await enquiryService.transitionStatus(
        enquiry.uuid,
        statusToApply,
        reason || undefined
      );
      onEnquiryUpdated(updated);
      setSelectedNextStatus('');
      setShowLostReasonModal(false);
      setLostReason('');
      success(`Proposal transitioned to ${statusToApply}.`);
    } catch (err: any) {
      showError(getApiErrorMessage(err));
    } finally {
      setIsTransitioning(false);
    }
  };

  // Trigger Hold Placement
  const handleConfirmPlaceHold = async () => {
    if (!holdingItemUuid || !canPlaceHold) return;

    try {
      setIsPlacingHold(true);
      await enquiryService.placeHold(enquiry.uuid, holdingItemUuid, {
        hold_duration_hours: holdDurationHours,
        notes: holdNotes || undefined,
      });

      // Refresh enquiry details
      const fresh = await enquiryService.getEnquiry(enquiry.uuid);
      onEnquiryUpdated(fresh);

      setHoldingItemUuid(null);
      setHoldNotes('');
      success('Tentative inventory hold placed successfully on Stage 7 calendar.');

      // Re-evaluate availability if was open
      if (availabilityResults) {
        handleCheckAvailability();
      }
    } catch (err: any) {
      showError(getApiErrorMessage(err));
    } finally {
      setIsPlacingHold(false);
    }
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="680px"
      title={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingRight: '1.5rem' }}>
          <div>
            <div style={{ fontSize: '1.15rem', fontWeight: 600, color: '#0f172a' }}>
              {enquiry.campaign_title}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.1rem' }}>
              Ref: <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{enquiry.enquiry_number}</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
            <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
          </div>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Section 1: Client & Commercial Overview */}
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
            <Building2 size={15} style={{ color: '#2563eb' }} />
            <span>Client & Commercial Terms</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>Commercial Client</label>
              <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.92rem' }}>
                {enquiry.customer?.company_name || enquiry.customer?.contact_person || 'Unassigned'}
              </div>
              {enquiry.customer?.brand_name && (
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  Brand: {enquiry.customer.brand_name}
                </div>
              )}
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>Contact Details</label>
              <div style={{ fontSize: '0.85rem', color: '#1e293b' }}>
                {enquiry.customer?.contact_person}
              </div>
              {enquiry.customer?.phone && (
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{enquiry.customer.phone}</div>
              )}
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>Target Dates</label>
              <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.88rem' }}>
                {enquiry.start_date || 'TBD'} → {enquiry.end_date || 'TBD'}
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>Estimated Budget</label>
              <div style={{ fontWeight: 600, color: '#0f766e', fontSize: '0.92rem' }}>
                {enquiry.estimated_budget
                  ? `${enquiry.currency || 'INR'} ${enquiry.estimated_budget.toLocaleString()}`
                  : 'Flexible / Unspecified'}
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>Priority</label>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  backgroundColor: '#f1f5f9',
                  padding: '0.15rem 0.45rem',
                  borderRadius: '4px',
                  color: '#475569',
                }}
              >
                {enquiry.priority}
              </span>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>Source</label>
              <span style={{ fontSize: '0.85rem', color: '#334155' }}>{enquiry.source}</span>
            </div>
          </div>

          {(enquiry.requirements || enquiry.internal_notes) && (
            <div style={{ marginTop: '0.85rem', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9' }}>
              {enquiry.requirements && (
                <div style={{ marginBottom: '0.5rem' }}>
                  <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>Advertiser Requirements</label>
                  <div style={{ fontSize: '0.82rem', color: '#334155', lineHeight: 1.4 }}>{enquiry.requirements}</div>
                </div>
              )}
              {enquiry.internal_notes && (
                <div>
                  <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>Internal Notes</label>
                  <div style={{ fontSize: '0.82rem', color: '#334155', lineHeight: 1.4 }}>{enquiry.internal_notes}</div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Section 2: Requested Inventory Units & Availability */}
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
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '0.85rem',
            }}
          >
            <div
              style={{
                fontSize: '0.85rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                color: '#64748b',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <Layers size={15} style={{ color: '#0f766e' }} />
              <span>Requested Inventory Faces ({(enquiry.items || []).length})</span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleCheckAvailability}
              disabled={isCheckingAvailability || (enquiry.items || []).length === 0}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.8rem',
              }}
            >
              {isCheckingAvailability ? (
                <>
                  <Spinner size={13} /> Evaluating...
                </>
              ) : (
                <>
                  <Search size={13} /> Check Availability
                </>
              )}
            </Button>
          </div>

          {(enquiry.items || []).length === 0 ? (
            <div style={{ fontSize: '0.82rem', color: '#64748b', textAlign: 'center', padding: '1rem' }}>
              No inventory units currently linked. Edit this proposal to attach advertising faces.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {enquiry.items.map((item, idx) => {
                const res = item.advertising_resource;
                const isDigital = res?.category === 'DIGITAL';

                // Find corresponding availability result if evaluated
                const availResult = availabilityResults?.items.find(
                  (ar) => ar.item_uuid === item.uuid || (res && ar.resource_uuid === res.uuid)
                );

                return (
                  <div
                    key={item.uuid || idx}
                    style={{
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      padding: '0.85rem',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '0.4rem',
                      }}
                    >
                      <div>
                        <span style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.88rem' }}>
                          {res ? res.name : item.location ? item.location.name : 'General Unit Inquiry'}
                        </span>
                        {res && (
                          <span
                            style={{
                              marginLeft: '0.45rem',
                              fontFamily: 'monospace',
                              fontSize: '0.75rem',
                              backgroundColor: '#e2e8f0',
                              padding: '0.1rem 0.35rem',
                              borderRadius: '3px',
                            }}
                          >
                            {res.code}
                          </span>
                        )}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        {canPlaceHold && res && (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setHoldingItemUuid(item.uuid)}
                            style={{
                              fontSize: '0.75rem',
                              padding: '0.25rem 0.55rem',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                            }}
                          >
                            <Lock size={12} /> Place Hold
                          </Button>
                        )}
                      </div>
                    </div>

                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1.5fr 1fr 1fr',
                        gap: '0.5rem',
                        fontSize: '0.78rem',
                        color: '#475569',
                      }}
                    >
                      <div>
                        Dates:{' '}
                        <strong>
                          {item.effective_start_date || 'TBD'} → {item.effective_end_date || 'TBD'}
                        </strong>
                      </div>
                      <div>
                        Capacity:{' '}
                        <strong>
                          {item.slots_count} {isDigital ? 'slot(s)' : 'face'}
                        </strong>
                      </div>
                      <div>
                        Proposed:{' '}
                        <strong>
                          {item.proposed_rate ? `₹${item.proposed_rate.toLocaleString()}` : 'Standard Rate'}
                        </strong>
                      </div>
                    </div>

                    {/* Live Availability Result Panel for this item */}
                    {availResult && (
                      <div
                        style={{
                          marginTop: '0.65rem',
                          padding: '0.55rem 0.75rem',
                          borderRadius: '5px',
                          backgroundColor:
                            availResult.is_available === true
                              ? '#f0fdf4'
                              : availResult.is_available === false
                              ? '#fef2f2'
                              : '#f8fafc',
                          border: `1px solid ${
                            availResult.is_available === true
                              ? '#bbf7d0'
                              : availResult.is_available === false
                              ? '#fecaca'
                              : '#e2e8f0'
                          }`,
                          fontSize: '0.78rem',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}>
                          {availResult.is_available === true ? (
                            <>
                              <CheckCircle size={14} style={{ color: '#16a34a' }} />
                              <span style={{ color: '#166534' }}>
                                Fully Available ({availResult.available_slots} / {availResult.total_slots} slots available)
                              </span>
                            </>
                          ) : availResult.is_available === false ? (
                            <>
                              <AlertTriangle size={14} style={{ color: '#dc2626' }} />
                              <span style={{ color: '#991b1b' }}>
                                Capacity Bottleneck Detected ({availResult.available_slots ?? 0} slots available vs {availResult.requested_slots ?? 1} requested)
                              </span>
                            </>
                          ) : (
                            <span style={{ color: '#64748b' }}>{availResult.message}</span>
                          )}
                        </div>

                        {availResult.conflicts && availResult.conflicts.length > 0 && (
                          <div style={{ marginTop: '0.35rem', color: '#b91c1c', fontSize: '0.74rem' }}>
                            Conflicting Dates:{' '}
                            {availResult.conflicts.map((c) => `${c.date} (${c.available_slots} avail)`).join(', ')}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Section 3: Proposal Lifecycle State Machine */}
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
            <span>Proposal Lifecycle Status</span>
          </div>

          <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '0 0 0.85rem' }}>
            Current status: <strong>{enquiry.status}</strong>
            {enquiry.lost_reason && <span> (Reason: "{enquiry.lost_reason}")</span>}.
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
                Proposal has reached terminal state <strong>{enquiry.status}</strong>. Per SODAARS workflow rules, it cannot be transitioned further.
              </span>
            </div>
          ) : (
            <div>
              <label style={{ fontSize: '0.75rem', color: '#475569', display: 'block', marginBottom: '0.35rem', fontWeight: 500 }}>
                Advance Status to Allowed Target State:
              </label>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <select
                  value={selectedNextStatus}
                  onChange={(e) => setSelectedNextStatus(e.target.value as EnquiryStatus)}
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
                  <option value="">Select next transition...</option>
                  {validNextStatuses.map((st) => (
                    <option key={st} value={st}>
                      {STATUS_BADGES[st]?.label || st}
                    </option>
                  ))}
                </select>

                <Button
                  variant="primary"
                  size="sm"
                  disabled={!selectedNextStatus || isTransitioning}
                  onClick={() => handleTransitionStatus()}
                  style={{ minWidth: '100px' }}
                >
                  {isTransitioning ? (
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Spinner size={14} /> Updating...
                    </div>
                  ) : (
                    'Advance'
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>

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
            {canDelete && onEnquiryDeleted ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  onClose();
                  onEnquiryDeleted(enquiry);
                }}
                style={{ color: '#ef4444', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <Trash2 size={14} /> Delete Proposal
              </Button>
            ) : (
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                <ShieldAlert size={13} /> Deletion restricted to Owner/Manager
              </span>
            )}
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              onClose();
              onEdit(enquiry);
            }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <Edit2 size={14} /> Edit Proposal
          </Button>
        </div>
      </div>

      {/* Place Tentative Hold Modal */}
      {holdingItemUuid && (
        <Modal
          isOpen={Boolean(holdingItemUuid)}
          onClose={() => setHoldingItemUuid(null)}
          title="Place Tentative Hold on Inventory Unit"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p style={{ fontSize: '0.88rem', color: '#475569', margin: 0, lineHeight: 1.5 }}>
              This will create an authoritative Stage 7 tentative hold on the inventory calendar for this enquiry.
            </p>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 500, color: '#1e293b', display: 'block', marginBottom: '0.35rem' }}>
                Hold Duration (Hours)
              </label>
              <Input
                type="number"
                min={1}
                max={720}
                value={holdDurationHours}
                onChange={(e) => setHoldDurationHours(parseInt(e.target.value, 10) || 72)}
              />
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.2rem', display: 'block' }}>
                Default: 72 hours (3 days). Hold will expire automatically if unconfirmed.
              </span>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 500, color: '#1e293b', display: 'block', marginBottom: '0.35rem' }}>
                Hold Notes (Optional)
              </label>
              <Input
                value={holdNotes}
                onChange={(e) => setHoldNotes(e.target.value)}
                placeholder="e.g. Awaiting client advance payment confirmation"
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
              <Button variant="ghost" size="sm" onClick={() => setHoldingItemUuid(null)} disabled={isPlacingHold}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleConfirmPlaceHold} disabled={isPlacingHold}>
                {isPlacingHold ? 'Placing Hold...' : 'Confirm Hold'}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Mandatory Lost Reason Modal */}
      {showLostReasonModal && (
        <Modal
          isOpen={showLostReasonModal}
          onClose={() => setShowLostReasonModal(false)}
          title="Reason for Lost Proposal"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p style={{ fontSize: '0.88rem', color: '#475569', margin: 0 }}>
              Per business rules, transitioning to <strong>LOST</strong> requires specifying the lost reason.
            </p>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 500, color: '#1e293b', display: 'block', marginBottom: '0.35rem' }}>
                Lost Reason <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <Input
                value={lostReason}
                onChange={(e) => setLostReason(e.target.value)}
                placeholder="e.g. Budget cut, competitor price undercutting, campaign cancelled"
                required
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
              <Button variant="ghost" size="sm" onClick={() => setShowLostReasonModal(false)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                disabled={!lostReason.trim() || isTransitioning}
                onClick={() => handleTransitionStatus('LOST', lostReason)}
              >
                Mark as Lost
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </Drawer>
  );
};

export default EnquiryDetailDrawer;
