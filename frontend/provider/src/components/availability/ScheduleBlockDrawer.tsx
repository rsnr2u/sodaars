import React, { useState, useEffect, useCallback } from 'react';
import type {
  ScheduleBlockType,
  ResourceSchedule,
  ResourceSchedulePayload,
} from '../../types/availability';
import type { ResourceOption } from './AvailabilityCheckerModal';
import availabilityService from '../../services/availabilityService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { getApiErrorMessage } from '../../services/api';
import Drawer from '../ui/Drawer';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Spinner from '../ui/Spinner';
import {
  Calendar,
  Lock,
  Trash2,
  RefreshCw,
  Clock,
  AlertTriangle,
  Plus,
} from 'lucide-react';

export interface ScheduleBlockDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  resources: ResourceOption[];
  initialResourceUuid?: string;
  onScheduleChanged?: () => void;
}

export const ScheduleBlockDrawer: React.FC<ScheduleBlockDrawerProps> = ({
  isOpen,
  onClose,
  resources,
  initialResourceUuid,
  onScheduleChanged,
}) => {
  const { role } = useAuth();
  const { success, error: showError } = useToast();

  // RBAC: Owner & Manager can create/update/release/delete; Staff has read-only view
  const canManageSchedules = role === 'PROVIDER_OWNER' || role === 'PROVIDER_MANAGER';

  const [selectedResourceUuid, setSelectedResourceUuid] = useState(
    initialResourceUuid || resources[0]?.uuid || ''
  );
  const [schedules, setSchedules] = useState<ResourceSchedule[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(false);

  // Form State for Creating Block
  const [isCreating, setIsCreating] = useState(false);
  const [blockType, setBlockType] = useState<ScheduleBlockType>('MAINTENANCE');
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState(
    new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]
  );
  const [slotsCount, setSlotsCount] = useState('1');
  const [holdExpiresAt, setHoldExpiresAt] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const activeResource = resources.find((r) => r.uuid === selectedResourceUuid);
  const isDigital = activeResource?.category === 'DIGITAL';

  // Load active schedules for this resource
  const fetchSchedules = useCallback(async () => {
    if (!selectedResourceUuid) return;
    setIsLoadingList(true);
    try {
      const data = await availabilityService.getSchedules({
        resource_uuid: selectedResourceUuid,
        per_page: 50,
      });
      setSchedules(data.items || []);
    } catch (err: unknown) {
      showError(getApiErrorMessage(err), 'Failed to load schedules');
    } finally {
      setIsLoadingList(false);
    }
  }, [selectedResourceUuid, showError]);

  useEffect(() => {
    if (isOpen) {
      if (initialResourceUuid) {
        setSelectedResourceUuid(initialResourceUuid);
      }
      setIsCreating(false);
      setFormError(null);
    }
  }, [isOpen, initialResourceUuid]);

  useEffect(() => {
    if (isOpen && selectedResourceUuid) {
      fetchSchedules();
    }
  }, [isOpen, selectedResourceUuid, fetchSchedules]);

  const handleCreateBlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canManageSchedules) return;

    setIsSubmitting(true);
    setFormError(null);

    const payload: ResourceSchedulePayload = {
      advertising_resource_uuid: selectedResourceUuid,
      title: title.trim() || undefined,
      block_type: blockType,
      start_date: startDate,
      end_date: endDate,
      slots_count: isDigital && slotsCount ? parseInt(slotsCount, 10) : 1,
      hold_expires_at: blockType === 'TENTATIVE_HOLD' && holdExpiresAt ? holdExpiresAt : undefined,
      notes: notes.trim() || undefined,
    };

    try {
      await availabilityService.createSchedule(payload);
      success('Schedule block created successfully.');
      setIsCreating(false);
      setTitle('');
      setNotes('');
      setHoldExpiresAt('');
      await fetchSchedules();
      onScheduleChanged?.();
    } catch (err: unknown) {
      setFormError(getApiErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReleaseBlock = async (sched: ResourceSchedule) => {
    if (!canManageSchedules) return;
    if (!window.confirm(`Are you sure you want to release "${sched.title || sched.block_type}"?`)) return;

    try {
      await availabilityService.releaseSchedule(sched.uuid, 'Released early by provider');
      success('Schedule released.');
      await fetchSchedules();
      onScheduleChanged?.();
    } catch (err: unknown) {
      showError(getApiErrorMessage(err), 'Release Failed');
    }
  };

  const handleDeleteBlock = async (sched: ResourceSchedule) => {
    if (!canManageSchedules) return;
    if (!window.confirm(`Delete schedule record for "${sched.title || sched.block_type}"?`)) return;

    try {
      await availabilityService.deleteSchedule(sched.uuid);
      success('Schedule removed.');
      await fetchSchedules();
      onScheduleChanged?.();
    } catch (err: unknown) {
      showError(getApiErrorMessage(err), 'Delete Failed');
    }
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div>
          <div>Inventory Schedule Blocks & Holds</div>
          <div style={{ fontSize: '0.8rem', fontWeight: 400, color: 'var(--text-muted)', marginTop: '2px' }}>
            Manage manual reservations, maintenance blackouts, and tentative holds.
          </div>
        </div>
      }
      maxWidth="680px"
      footer={
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', width: '100%' }}>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Resource Selection */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label required">Advertising Resource</label>
          <select
            value={selectedResourceUuid}
            onChange={(e) => setSelectedResourceUuid(e.target.value)}
            className="form-select"
          >
            {resources.map((r) => (
              <option key={r.uuid} value={r.uuid}>
                {r.name} ({r.code}) — {r.category}
              </option>
            ))}
          </select>
        </div>

        {/* Action Header / Create Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-heading)' }}>
            Scheduled Blocks ({schedules.length})
          </div>

          {canManageSchedules && !isCreating && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsCreating(true)}
              leftIcon={<Plus size={14} />}
            >
              Block Inventory
            </Button>
          )}
        </div>

        {/* Create Form Card */}
        {isCreating && canManageSchedules && (
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--canvas-bg)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600, fontSize: '0.85rem' }}>
                <Lock size={15} style={{ color: 'var(--blue-600)' }} />
                <span>New Inventory Block</span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setIsCreating(false)}>
                Cancel
              </Button>
            </div>

            {formError && (
              <div
                style={{
                  padding: '0.6rem 0.85rem',
                  borderRadius: 'var(--radius-xs)',
                  backgroundColor: 'var(--rose-50)',
                  border: '1px solid var(--rose-200)',
                  color: 'var(--rose-700)',
                  fontSize: '0.82rem',
                  marginBottom: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                <AlertTriangle size={15} style={{ flexShrink: 0 }} />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateBlock}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <Input
                  label="Title / Purpose"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Scheduled Structural Maintenance"
                  required
                />
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label required">Block Type</label>
                  <select
                    value={blockType}
                    onChange={(e) => setBlockType(e.target.value as ScheduleBlockType)}
                    className="form-select"
                  >
                    <option value="MAINTENANCE">Maintenance</option>
                    <option value="CIVIC_HOLD">Civic Hold</option>
                    <option value="INTERNAL_BLOCK">Internal Block</option>
                    <option value="TENTATIVE_HOLD">Tentative Hold</option>
                    <option value="BOOKING">Booking</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <Input
                  label="Start Date"
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <Input
                  label="End Date"
                  type="date"
                  required
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>

              {isDigital && (
                <div style={{ marginBottom: '0.75rem' }}>
                  <Input
                    label="Slots Count to Block"
                    type="number"
                    min="1"
                    max={activeResource?.total_slots || 10}
                    value={slotsCount}
                    onChange={(e) => setSlotsCount(e.target.value)}
                  />
                </div>
              )}

              {blockType === 'TENTATIVE_HOLD' && (
                <div style={{ marginBottom: '0.75rem' }}>
                  <Input
                    label="Hold Expiration Date & Time"
                    type="datetime-local"
                    value={holdExpiresAt}
                    onChange={(e) => setHoldExpiresAt(e.target.value)}
                    helperText="Tentative holds auto-expire if not confirmed or released."
                  />
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Notes (Optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Reason for blocking, contact reference, agency details..."
                  rows={2}
                  className="form-input"
                  style={{ width: '100%', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <Button variant="secondary" size="sm" onClick={() => setIsCreating(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit" isLoading={isSubmitting}>
                  Confirm Block
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Existing Schedules List */}
        {isLoadingList ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '2.5rem' }}>
            <Spinner size={24} />
          </div>
        ) : schedules.length === 0 ? (
          <div
            style={{
              padding: '2rem 1rem',
              textAlign: 'center',
              backgroundColor: 'var(--canvas-bg)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-muted)',
              fontSize: '0.85rem',
            }}
          >
            No active schedules or holds found for this resource.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {schedules.map((sched) => (
              <div
                key={sched.uuid}
                style={{
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  backgroundColor: '#ffffff',
                  boxShadow: 'var(--shadow-xs)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: '0.75rem',
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                    <strong style={{ fontSize: '0.9rem', color: 'var(--text-heading)' }}>
                      {sched.title || sched.block_type.replace('_', ' ')}
                    </strong>
                    <Badge variant="neutral">{sched.block_type.replace('_', ' ')}</Badge>
                    <Badge variant={sched.status === 'CONFIRMED' ? 'success' : sched.status === 'TENTATIVE' ? 'warning' : 'neutral'}>
                      {sched.status}
                    </Badge>
                  </div>

                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    <Calendar size={13} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '4px' }} />
                    {sched.start_date} to {sched.end_date}
                    {sched.slots_count > 1 && ` • ${sched.slots_count} slots`}
                  </div>

                  {sched.hold_expires_at && (
                    <div style={{ fontSize: '0.72rem', color: 'var(--orange-700)', marginTop: '2px' }}>
                      <Clock size={12} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '3px' }} />
                      Hold expires: {new Date(sched.hold_expires_at).toLocaleString()}
                    </div>
                  )}

                  {sched.notes && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      Note: {sched.notes}
                    </div>
                  )}
                </div>

                {/* Management Actions (Owner / Manager only) */}
                {canManageSchedules && sched.status !== 'CANCELLED' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleReleaseBlock(sched)}
                      title="Release Block Early"
                      style={{ padding: '4px 6px', fontSize: '0.75rem' }}
                    >
                      <RefreshCw size={13} style={{ marginRight: '3px' }} />
                      Release
                    </Button>
                    <button
                      onClick={() => handleDeleteBlock(sched)}
                      className="btn btn-ghost btn-sm"
                      style={{ padding: '4px 6px', color: 'var(--rose-600)' }}
                      title="Delete Schedule"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Drawer>
  );
};

export default ScheduleBlockDrawer;
