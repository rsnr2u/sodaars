import React, { useState } from 'react';
import type { AvailabilityCheckResult } from '../../types/availability';
import availabilityService from '../../services/availabilityService';
import { getApiErrorMessage } from '../../services/api';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Badge from '../ui/Badge';
import {
  CheckCircle,
  AlertTriangle,
  Layers,
} from 'lucide-react';

export interface ResourceOption {
  uuid: string;
  name: string;
  code: string;
  category: 'STATIC' | 'DIGITAL';
  total_slots?: number;
}

export interface AvailabilityCheckerModalProps {
  isOpen: boolean;
  onClose: () => void;
  resources: ResourceOption[];
  initialResourceUuid?: string;
}

export const AvailabilityCheckerModal: React.FC<AvailabilityCheckerModalProps> = ({
  isOpen,
  onClose,
  resources,
  initialResourceUuid,
}) => {
  const [resourceUuid, setResourceUuid] = useState(
    initialResourceUuid || resources[0]?.uuid || ''
  );
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState(
    new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]
  );
  const [slotsCount, setSlotsCount] = useState('1');

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AvailabilityCheckResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selectedResource = resources.find((r) => r.uuid === resourceUuid);
  const isDigital = selectedResource?.category === 'DIGITAL';

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resourceUuid || !startDate || !endDate) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await availabilityService.checkAvailability({
        resource_uuid: resourceUuid,
        start_date: startDate,
        end_date: endDate,
        slots_count: isDigital && slotsCount ? parseInt(slotsCount, 10) : 1,
      });
      setResult(data);
    } catch (err: unknown) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Check Resource Availability"
      footer={
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', width: '100%' }}>
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCheck} isLoading={isLoading}>
            Check Dates
          </Button>
        </div>
      }
    >
      <form onSubmit={handleCheck}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.25rem' }}>
          {/* Resource Selector */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label required">Target Resource</label>
            <select
              value={resourceUuid}
              onChange={(e) => {
                setResourceUuid(e.target.value);
                setResult(null);
              }}
              className="form-select"
              required
            >
              {resources.map((r) => (
                <option key={r.uuid} value={r.uuid}>
                  {r.name} ({r.code}) — {r.category}
                </option>
              ))}
            </select>
          </div>

          {/* Date Window */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <Input
              label="Start Date"
              type="date"
              required
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setResult(null);
              }}
            />
            <Input
              label="End Date"
              type="date"
              required
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setResult(null);
              }}
            />
          </div>

          {/* Digital Slots Count (Conditional) */}
          {isDigital && (
            <div style={{ padding: '0.75rem', backgroundColor: 'var(--canvas-bg)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--blue-700)', fontWeight: 600 }}>
                <Layers size={14} />
                <span>Digital Share-of-Voice (SOV) Slots</span>
              </div>
              <Input
                label="Requested Slots"
                type="number"
                min="1"
                max={selectedResource?.total_slots || 10}
                value={slotsCount}
                onChange={(e) => {
                  setSlotsCount(e.target.value);
                  setResult(null);
                }}
                helperText={`Total capacity on this screen: ${selectedResource?.total_slots || 1} slots`}
              />
            </div>
          )}
        </div>

        {/* Error Alert */}
        {error && (
          <div
            style={{
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--rose-50)',
              border: '1px solid var(--rose-200)',
              color: 'var(--rose-700)',
              fontSize: '0.85rem',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <AlertTriangle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Result Display */}
        {result && (
          <div
            style={{
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              border: result.is_available
                ? '1px solid var(--emerald-200)'
                : '1px solid var(--rose-200)',
              backgroundColor: result.is_available ? 'var(--emerald-50)' : 'var(--rose-50)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              {result.is_available ? (
                <CheckCircle size={22} style={{ color: 'var(--emerald-600)' }} />
              ) : (
                <AlertTriangle size={22} style={{ color: 'var(--rose-600)' }} />
              )}
              <div>
                <h4
                  style={{
                    margin: 0,
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    color: result.is_available ? 'var(--emerald-900)' : 'var(--rose-900)',
                  }}
                >
                  {result.is_available
                    ? 'Available for Requested Window'
                    : 'Inventory Conflict Detected'}
                </h4>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  {startDate} to {endDate} • {result.resource_category}
                </div>
              </div>
            </div>

            {/* Capacity Metrics */}
            <div
              style={{
                display: 'flex',
                gap: '1.25rem',
                marginTop: '0.75rem',
                paddingTop: '0.6rem',
                borderTop: '1px solid rgba(0,0,0,0.06)',
                fontSize: '0.82rem',
              }}
            >
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Total Slots: </span>
                <strong>{result.total_slots}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Requested: </span>
                <strong>{result.requested_slots}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Min Available: </span>
                <strong>{result.available_slots}</strong>
              </div>
            </div>

            {/* Conflict List */}
            {result.conflicts && result.conflicts.length > 0 && (
              <div style={{ marginTop: '0.85rem' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--rose-900)', marginBottom: '0.35rem' }}>
                  Overlapping Schedules:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  {result.conflicts.map((c) => (
                    <div
                      key={c.uuid}
                      style={{
                        padding: '6px 10px',
                        backgroundColor: '#ffffff',
                        border: '1px solid var(--rose-200)',
                        borderRadius: 'var(--radius-xs)',
                        fontSize: '0.78rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        <strong>{c.title || 'Reserved Schedule'}</strong> ({c.start_date} to {c.end_date})
                      </div>
                      <Badge variant="warning">{c.block_type.replace('_', ' ')}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Digital Bottlenecks */}
            {result.bottlenecks && result.bottlenecks.length > 0 && (
              <div style={{ marginTop: '0.85rem' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--rose-900)', marginBottom: '0.35rem' }}>
                  Capacity Bottleneck Dates:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                  {result.bottlenecks.map((b) => (
                    <span
                      key={b.date}
                      style={{
                        padding: '2px 6px',
                        backgroundColor: '#ffffff',
                        border: '1px solid var(--rose-200)',
                        borderRadius: 'var(--radius-xs)',
                        fontSize: '0.75rem',
                        color: 'var(--rose-800)',
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      {b.date} ({b.available_slots} left)
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </form>
    </Modal>
  );
};

export default AvailabilityCheckerModal;
