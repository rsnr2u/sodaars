import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import {
  BookingRecord,
  BOOKING_STATUS_CONFIG,
} from '../../types/booking';

export interface ConfirmBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: BookingRecord | null;
  onConfirm: (booking: BookingRecord) => void;
}

export const ConfirmBookingModal: React.FC<ConfirmBookingModalProps> = ({
  isOpen,
  onClose,
  booking,
  onConfirm,
}) => {
  if (!booking) return null;

  const statusMeta = BOOKING_STATUS_CONFIG[booking.status];

  const handleConfirm = () => {
    onConfirm(booking);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2 text-[#171717]">
          <CheckCircle2 size={18} className="text-emerald-600" />
          <span>Confirm Booking</span>
        </div>
      }
      maxWidth="max-w-md"
      footer={
        <>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<CheckCircle2 size={14} />}
            onClick={handleConfirm}
          >
            Confirm Booking
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <p className="text-xs text-[#525252] leading-relaxed">
          Please verify the booking details below before recording provider confirmation.
        </p>

        <div className="bg-[#FAFAF9] rounded-lg p-3.5 border border-[#E5E5E5] space-y-2.5 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-[#E5E5E5]">
            <span className="text-[#737373]">Booking ID</span>
            <span className="font-mono font-bold text-[#171717]">{booking.id}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#737373]">Customer</span>
            <span className="font-semibold text-[#171717]">{booking.customerName}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#737373]">Company</span>
            <span className="text-[#171717]">{booking.companyName}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#737373]">Resource</span>
            <span className="font-semibold text-[#171717]">{booking.resourceName}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#737373]">Date Range</span>
            <span className="font-medium text-[#171717]">
              {booking.startDate} to {booking.endDate}
            </span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#E5E5E5]">
            <span className="text-[#737373]">Current Status</span>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${statusMeta.badgeBg} ${statusMeta.badgeText} ${statusMeta.badgeBorder}`}
            >
              {statusMeta.label}
            </span>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-orange-50/60 border border-orange-200/80 text-[11px] text-orange-950 flex items-start gap-2">
          <AlertCircle size={14} className="text-[#EA580C] shrink-0 mt-0.5" />
          <span>
            Confirming transitions this booking to <strong>Confirmed</strong> in your pipeline ledger.
          </span>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmBookingModal;
