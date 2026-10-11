import React, { useState } from 'react';
import { XCircle } from 'lucide-react';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import {
  BookingRecord,
  BOOKING_STATUS_CONFIG,
} from '../../types/booking';

export interface DeclineBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: BookingRecord | null;
  onDecline: (booking: BookingRecord, declineReason: string) => void;
}

export const DeclineBookingModal: React.FC<DeclineBookingModalProps> = ({
  isOpen,
  onClose,
  booking,
  onDecline,
}) => {
  const [declineReason, setDeclineReason] = useState('');
  const [error, setError] = useState('');

  if (!booking) return null;

  const statusMeta = BOOKING_STATUS_CONFIG[booking.status];

  const handleDecline = () => {
    if (!declineReason.trim()) {
      setError('Please provide a reason for declining this booking.');
      return;
    }
    setError('');
    onDecline(booking, declineReason.trim());
    setDeclineReason('');
    onClose();
  };

  const handleModalClose = () => {
    setError('');
    setDeclineReason('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleModalClose}
      title={
        <div className="flex items-center gap-2 text-rose-800">
          <XCircle size={18} className="text-rose-600" />
          <span>Decline Booking</span>
        </div>
      }
      maxWidth="max-w-md"
      footer={
        <>
          <Button variant="secondary" size="sm" onClick={handleModalClose}>
            Cancel
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-rose-300 text-rose-700 hover:bg-rose-50 hover:border-rose-400 font-semibold"
            leftIcon={<XCircle size={14} />}
            onClick={handleDecline}
          >
            Decline Booking
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <p className="text-xs text-[#525252] leading-relaxed">
          Please review the booking context and provide the reason for declining.
        </p>

        <div className="bg-[#FAFAF9] rounded-lg p-3.5 border border-[#E5E5E5] space-y-2 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-[#E5E5E5]">
            <span className="text-[#737373]">Booking ID</span>
            <span className="font-mono font-bold text-[#171717]">{booking.id}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#737373]">Customer</span>
            <span className="font-semibold text-[#171717]">{booking.customerName}</span>
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

        {/* Decline Reason field - REQUIRED */}
        <div>
          <label className="block text-xs font-bold text-[#171717] mb-1">
            Decline Reason <span className="text-rose-500">*</span>
          </label>
          <textarea
            value={declineReason}
            onChange={(e) => {
              setDeclineReason(e.target.value);
              if (error) setError('');
            }}
            rows={3}
            placeholder="Specify reason for declining (e.g., physical site conflict, commercial non-agreement)..."
            className={`w-full rounded-md border text-xs p-2.5 outline-none transition-colors ${
              error
                ? 'border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-200'
                : 'border-[#E5E5E5] focus:border-[#EA580C] focus:ring-1 focus:ring-orange-100'
            }`}
          />
          {error && <p className="text-[11px] text-rose-600 mt-1 font-medium">{error}</p>}
        </div>

        <p className="text-[11px] text-[#737373]">
          A decline reason is required to complete this interaction.
        </p>
      </div>
    </Modal>
  );
};

export default DeclineBookingModal;
