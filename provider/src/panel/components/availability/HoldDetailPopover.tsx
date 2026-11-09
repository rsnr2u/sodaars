import React from 'react';
import { Clock, Info, Layers, MapPin, Calendar } from 'lucide-react';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';

export interface HoldDetailPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  resourceName: string;
  resourceType: string;
  locationName: string;
  dateRange: string;
  holdRef?: string;
}

export const HoldDetailPopover: React.FC<HoldDetailPopoverProps> = ({
  isOpen,
  onClose,
  resourceName,
  resourceType,
  locationName,
  dateRange,
  holdRef,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-amber-50 text-amber-700 flex items-center justify-center">
            <Clock size={16} />
          </div>
          <span>Provisional Hold Detail</span>
        </div>
      }
      maxWidth="max-w-md"
      footer={
        <Button type="button" variant="primary" size="sm" onClick={onClose}>
          Close
        </Button>
      }
    >
      <div className="space-y-4">
        {/* State Banner */}
        <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 flex items-start gap-2.5">
          <Clock size={16} className="text-amber-700 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 leading-snug">
            <strong className="block font-semibold">Hold State</strong>
            <span>Resource date is provisionally held.</span>
          </div>
        </div>

        {/* Resource Reference */}
        <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2 text-xs">
          <div className="flex items-center gap-2 text-[#1A2435]">
            <Layers size={14} className="text-[#E11D2E]" />
            <span className="font-bold">{resourceName}</span>
          </div>
          <div className="text-[11px] text-[#64748B]">
            Type: <span className="font-semibold text-[#1A2435]">{resourceType}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-[#64748B]">
            <MapPin size={11} className="text-[#E11D2E]" />
            <span>{locationName}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-[#64748B] pt-2 border-t border-[#E2E8F0]">
            <Calendar size={11} className="text-[#64748B]" />
            <span className="font-mono text-[#1A2435] font-semibold">{dateRange}</span>
          </div>
          {holdRef && (
            <div className="text-[11px] text-[#64748B]">
              Hold Reference: <span className="font-mono font-bold text-[#1A2435]">{holdRef}</span>
            </div>
          )}
        </div>

        {/* Policy Notice: Soft Hold Guidance */}
        <div className="p-3 rounded-lg bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900 flex items-start gap-2">
          <Info size={14} className="text-amber-700 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed">
            <strong>48–72h Tentative Hold:</strong> This asset is soft-blocked pending client quotation sign-off or direct deposit. Overlapping inquiries are placed on priority standby queue.
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default HoldDetailPopover;
