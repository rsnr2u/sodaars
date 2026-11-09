import React, { useState, useEffect } from 'react';
import { ShieldAlert, Link as LinkIcon, Wrench, Ban } from 'lucide-react';
import { Link } from 'react-router-dom';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { ResourceAvailabilityItem } from '../../types/availability';

export interface CreateBlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveBlock: (block: {
    resourceId: string;
    startDate: string;
    endDate: string;
    state: 'Provider Block' | 'Maintenance';
    reason?: string;
    notes?: string;
  }) => void;
  resources: ResourceAvailabilityItem[];
  preselectedResourceId?: string;
  preselectedDate?: string;
}

export const CreateBlockModal: React.FC<CreateBlockModalProps> = ({
  isOpen,
  onClose,
  onSaveBlock,
  resources,
  preselectedResourceId,
  preselectedDate,
}) => {
  const [resourceId, setResourceId] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [blockType, setBlockType] = useState<'Provider Block' | 'Maintenance'>('Provider Block');
  const [reason, setReason] = useState<string>('Offline Client Hold');
  const [notes, setNotes] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setResourceId(preselectedResourceId || resources[0]?.id || '');
      const defaultDate = preselectedDate || new Date().toISOString().split('T')[0];
      setStartDate(defaultDate);
      setEndDate(defaultDate);
      setBlockType('Provider Block');
      setReason('Offline Client Hold');
      setNotes('');
      setError(null);
    }
  }, [isOpen, preselectedResourceId, preselectedDate, resources]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!resourceId) {
      setError('Please select an advertising resource.');
      return;
    }
    if (!startDate || !endDate) {
      setError('Start date and End date are required.');
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      setError('Start date cannot be after End date.');
      return;
    }

    onSaveBlock({
      resourceId,
      startDate,
      endDate,
      state: blockType,
      reason,
      notes: notes.trim() || undefined,
    });

    onClose();
  };

  const selectedResource = resources.find((r) => r.id === resourceId);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-red-50 text-[#E11D2E] flex items-center justify-center font-bold">
            <ShieldAlert size={18} />
          </div>
          <div>
            <span className="font-bold text-[#1A2435]">Place Operational Schedule Block</span>
            <span className="text-[10px] text-[#64748B] block font-normal">Freeze inventory from marketplace and direct reservations</span>
          </div>
        </div>
      }
      maxWidth="max-w-lg"
      footer={
        <div className="flex items-center justify-between w-full">
          <span className="text-xs font-semibold text-[#64748B]">
            Status: <strong className="text-[#1A2435]">{blockType}</strong>
          </span>
          <div className="flex items-center gap-2">
            <Button type="button" variant="secondary" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleSubmit}
              disabled={resources.length === 0}
              className="bg-[#E11D2E] hover:bg-[#c81926] text-white"
            >
              Apply Operational Block
            </Button>
          </div>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {resources.length === 0 ? (
          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-center space-y-2">
            <p className="text-xs text-[#64748B]">
              No registered advertising resources available. You must register an advertising resource before creating a block.
            </p>
            <Link to="/panel/resources">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                leftIcon={<LinkIcon size={13} />}
                className="mt-1"
              >
                Go to Advertising Resources
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Block Type Selector Tabs */}
            <div>
              <label className="block text-xs font-bold text-[#1A2435] mb-1.5">
                Block Classification <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setBlockType('Provider Block');
                    setReason('Offline Client Hold');
                  }}
                  className={`flex items-center gap-2 p-2.5 rounded-lg border text-left transition-all ${
                    blockType === 'Provider Block'
                      ? 'border-[#E11D2E] bg-red-50/60 text-[#1A2435] ring-1 ring-[#E11D2E]'
                      : 'border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#64748B]'
                  }`}
                >
                  <Ban size={16} className={blockType === 'Provider Block' ? 'text-[#E11D2E]' : 'text-slate-400'} />
                  <div>
                    <div className="font-bold text-xs text-[#1A2435]">Provider Block</div>
                    <div className="text-[10px] text-[#64748B]">Private offline hold / client reserve</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setBlockType('Maintenance');
                    setReason('Structural Inspection / Repairs');
                  }}
                  className={`flex items-center gap-2 p-2.5 rounded-lg border text-left transition-all ${
                    blockType === 'Maintenance'
                      ? 'border-slate-700 bg-slate-50 text-[#1A2435] ring-1 ring-slate-700'
                      : 'border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#64748B]'
                  }`}
                >
                  <Wrench size={16} className={blockType === 'Maintenance' ? 'text-slate-800' : 'text-slate-400'} />
                  <div>
                    <div className="font-bold text-xs text-[#1A2435]">Maintenance</div>
                    <div className="text-[10px] text-[#64748B]">Painting, lighting or structure repairs</div>
                  </div>
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
                {error}
              </div>
            )}

            {/* Resource Selector */}
            <div>
              <label className="block text-xs font-bold text-[#1A2435] mb-1">
                Target Advertising Resource <span className="text-rose-500">*</span>
              </label>
              <select
                value={resourceId}
                onChange={(e) => {
                  setResourceId(e.target.value);
                  if (error) setError(null);
                }}
                className="w-full text-xs h-9 px-3 rounded-lg bg-white border border-[#E2E8F0] text-[#1A2435] focus:outline-none focus:border-[#E11D2E] focus:ring-1 focus:ring-[#E11D2E]"
              >
                {resources.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({r.type} • {r.location.city})
                  </option>
                ))}
              </select>
              {selectedResource && (
                <span className="text-[11px] text-[#64748B] mt-1 block">
                  Location: <strong className="text-[#1A2435]">{selectedResource.location.name}</strong>, {selectedResource.location.city}
                </span>
              )}
            </div>

            {/* Date Range Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#1A2435] mb-1">
                  Start Date <span className="text-rose-500">*</span>
                </label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    if (error) setError(null);
                  }}
                  className="w-full text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1A2435] mb-1">
                  End Date <span className="text-rose-500">*</span>
                </label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    if (error) setError(null);
                  }}
                  className="w-full text-xs font-mono"
                />
              </div>
            </div>

            {/* Reason Selector */}
            <div>
              <label className="block text-xs font-bold text-[#1A2435] mb-1">
                Reason for Block
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full text-xs h-9 px-3 rounded-lg bg-white border border-[#E2E8F0] text-[#1A2435] focus:outline-none focus:border-[#E11D2E] focus:ring-1 focus:ring-[#E11D2E]"
              >
                {blockType === 'Provider Block' ? (
                  <>
                    <option value="Offline Client Hold">Offline Client Hold (Direct Deal Pending)</option>
                    <option value="VIP Reserved Slot">VIP Brand Advance Reservation</option>
                    <option value="Seasonal Rate Re-negotiation">Seasonal Rate Re-negotiation</option>
                    <option value="Internal House Ad Campaign">Internal House Ad / Self Promotion</option>
                    <option value="Discretionary Management Hold">Discretionary Management Hold</option>
                  </>
                ) : (
                  <>
                    <option value="Structural Inspection / Repairs">Structural Inspection &amp; Welding</option>
                    <option value="Electrical / Illumination Maintenance">LED &amp; Floodlight Electrical Maintenance</option>
                    <option value="Gantry / Frame Repainting">Gantry / Frame Anti-Rust Repainting</option>
                    <option value="Municipal / Safety Compliance Audit">Municipal Safety &amp; Weight Audit</option>
                    <option value="Storm / Weather Damage Restoration">Storm / Weather Damage Restoration</option>
                  </>
                )}
              </select>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-bold text-[#1A2435] mb-1">
                Operational Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Reserved for Diwali shopping festival campaign with Reliance Retail..."
                rows={2}
                className="w-full text-xs p-2.5 rounded-lg bg-white border border-[#E2E8F0] text-[#1A2435] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#E11D2E] focus:ring-1 focus:ring-[#E11D2E]"
              />
            </div>
          </>
        )}
      </form>
    </Modal>
  );
};

export default CreateBlockModal;
