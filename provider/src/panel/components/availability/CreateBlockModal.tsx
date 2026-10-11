import React, { useState, useEffect } from 'react';
import { ShieldAlert, Info, Link as LinkIcon } from 'lucide-react';
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
    state: 'Provider Block';
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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setResourceId(preselectedResourceId || resources[0]?.id || '');
      const defaultDate = preselectedDate || new Date().toISOString().split('T')[0];
      setStartDate(defaultDate);
      setEndDate(defaultDate);
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
      state: 'Provider Block',
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
          <div className="w-7 h-7 rounded-md bg-orange-50 text-[#EA580C] flex items-center justify-center">
            <ShieldAlert size={16} />
          </div>
          <span>Create Provider Block</span>
        </div>
      }
      maxWidth="max-w-md"
      footer={
        <div className="flex items-center justify-between w-full">
          <span className="text-[11px] text-[#737373]">
            State: Provider Block
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
            >
              Apply Block
            </Button>
          </div>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {resources.length === 0 ? (
          <div className="p-4 rounded-lg bg-stone-50 border border-stone-200 text-center space-y-2">
            <p className="text-xs text-[#525252]">
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
            <div className="p-3 rounded-lg bg-orange-50/60 border border-orange-200/60 flex items-start gap-2.5">
              <Info size={15} className="text-[#EA580C] shrink-0 mt-0.5" />
              <p className="text-xs text-orange-950 leading-relaxed">
                <strong>Provider Block:</strong> Provider has blocked the resource/date.
              </p>
            </div>

            {error && (
              <div className="p-2.5 rounded-md bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#171717] mb-1">
                Advertising Resource <span className="text-rose-500">*</span>
              </label>
              <select
                value={resourceId}
                onChange={(e) => {
                  setResourceId(e.target.value);
                  if (error) setError(null);
                }}
                className="w-full text-xs h-9 px-3 rounded-md bg-white border border-[#E5E5E5] text-[#171717] focus:outline-none focus:border-[#EA580C] focus:ring-1 focus:ring-[#EA580C]"
              >
                {resources.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({r.type} • {r.location.city})
                  </option>
                ))}
              </select>
              {selectedResource && (
                <span className="text-[11px] text-[#737373] mt-0.5 block">
                  Location: {selectedResource.location.name}, {selectedResource.location.city}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#171717] mb-1">
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
                <label className="block text-xs font-semibold text-[#171717] mb-1">
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
          </>
        )}
      </form>
    </Modal>
  );
};

export default CreateBlockModal;
