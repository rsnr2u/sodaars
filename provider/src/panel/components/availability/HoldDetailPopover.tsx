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
        <div className="p-3.5 rounded-lg bg-[#FAFAF9] border border-[#E5E5E5] space-y-2 text-xs">
          <div className="flex items-center gap-2 text-[#171717]">
            <Layers size={14} className="text-[#EA580C]" />
            <span className="font-bold">{resourceName}</span>
          </div>
          <div className="text-[11px] text-[#737373]">
            Type: <span className="font-medium text-[#171717]">{resourceType}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-[#737373]">
            <MapPin size={11} className="text-[#EA580C]" />
            <span>{locationName}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-[#737373] pt-1 border-t border-[#E5E5E5]">
            <Calendar size={11} className="text-[#737373]" />
            <span className="font-mono text-[#171717] font-semibold">{dateRange}</span>
          </div>
          {holdRef && (
            <div className="text-[11px] text-[#737373]">
              Hold Reference: <span className="font-mono text-[#171717]">{holdRef}</span>
            </div>
          )}
        </div>

        {/* Policy Notice: No hardcoded expiry */}
        <div className="p-3 rounded-lg bg-stone-50 border border-stone-200 text-xs text-[#525252] flex items-start gap-2">
          <Info size={14} className="text-[#737373] shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed">
            <strong>System Policy:</strong> Hold auto-expiry threshold is currently TBD. No automatic slot release is applied.
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default HoldDetailPopover;
