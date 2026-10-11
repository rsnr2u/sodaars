import React from 'react';
import {
  CheckCircle2,
  Calendar,
  User,
  ArrowRight,
  Plus,
  Clock,
} from 'lucide-react';
import Button from '../../../components/ui/Button';
import { CustomerRecord } from '../../types/customer';
import { AdvertisingResource } from '../../types/resource';

export interface BookingCreatedSuccessProps {
  bookingId: string;
  customer: CustomerRecord;
  startDate: string;
  endDate: string;
  selectedResources: AdvertisingResource[];
  status?: string;
  source?: string;
  onGoToBookings: () => void;
  onCreateAnother: () => void;
}

export const BookingCreatedSuccess: React.FC<BookingCreatedSuccessProps> = ({
  bookingId,
  customer,
  startDate,
  endDate,
  selectedResources,
  status = 'UNDER REVIEW',
  source = 'Provider',
  onGoToBookings,
  onCreateAnother,
}) => {
  const calculateDays = (start: string, end: string): number => {
    if (!start || !end) return 0;
    const s = new Date(start);
    const e = new Date(end);
    if (isNaN(s.getTime()) || isNaN(e.getTime())) return 0;
    const diffTime = e.getTime() - s.getTime();
    return Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const durationDays = calculateDays(startDate, endDate);

  const formatDateDisplay = (dateStr: string): string => {
    if (!dateStr) return '—';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const totalAmount = selectedResources.reduce((acc, r) => acc + (r.customerPrice || 0), 0);

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Success Hero Card */}
      <div className="rounded-2xl border border-emerald-200 bg-white p-8 text-center space-y-4 shadow-xs">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-700 mx-auto flex items-center justify-center border border-emerald-200 shadow-2xs">
          <CheckCircle2 size={32} />
        </div>

        <div className="space-y-1">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            Booking Registered
          </span>
          <h2 className="text-2xl font-extrabold text-[#171717]">
            Booking Created Successfully
          </h2>
          <p className="text-xs sm:text-sm text-[#525252] max-w-md mx-auto leading-relaxed">
            The commercial reservation has been logged into your SODAARS Provider ledger.
          </p>
        </div>

        {/* Booking Identification Key */}
        <div className="inline-flex items-center gap-3 p-3 rounded-xl bg-[#FAFAF9] border border-[#E5E5E5] text-xs">
          <span className="text-[#737373] font-semibold">Booking ID:</span>
          <span className="font-mono font-bold text-sm text-[#171717] bg-white px-2.5 py-0.5 rounded border border-[#E5E5E5]">
            {bookingId}
          </span>
        </div>
      </div>

      {/* Booking Summary Specifications */}
      <div className="rounded-xl border border-[#E5E5E5] bg-white p-6 shadow-xs space-y-5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#737373] border-b border-[#F5F5F4] pb-2">
          Booking Record Overview
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
          {/* Customer */}
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-[#737373] flex items-center gap-1">
              <User size={11} className="text-[#EA580C]" /> Customer
            </span>
            <p className="font-bold text-[#171717]">
              {customer.companyName}
            </p>
            <p className="text-[11px] text-[#737373]">
              Contact: {customer.contactPerson} ({customer.phone})
            </p>
          </div>

          {/* Booking Period */}
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-[#737373] flex items-center gap-1">
              <Calendar size={11} className="text-[#EA580C]" /> Flight Period
            </span>
            <p className="font-bold text-[#171717]">
              {formatDateDisplay(startDate)} &nbsp;→&nbsp; {formatDateDisplay(endDate)}
            </p>
            <p className="text-[11px] text-[#737373]">
              Duration: {durationDays} Days
            </p>
          </div>

          {/* Commercial Amount */}
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-[#737373]">
              Total Commercial Value
            </span>
            <p className="text-base font-extrabold text-[#EA580C]">
              ₹{totalAmount.toLocaleString('en-IN')}
            </p>
            <p className="text-[11px] text-[#737373]">
              {selectedResources.length} Physical {selectedResources.length === 1 ? 'Resource' : 'Resources'}
            </p>
          </div>

          {/* Source */}
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-[#737373]">
              Booking Source
            </span>
            <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-semibold bg-[#FAFAF9] text-[#171717] border border-[#E5E5E5]">
              {source}
            </span>
          </div>

          {/* Status */}
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-[#737373]">
              Booking Status
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
              <Clock size={11} className="text-amber-700" />
              {status}
            </span>
          </div>
        </div>

        {/* Selected Resources Table Preview */}
        <div className="pt-2 border-t border-[#F5F5F4] space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373] block">
            Reserved Advertising Displays
          </span>
          <div className="rounded-lg border border-[#E5E5E5] overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAFAF9] border-b border-[#E5E5E5] text-[10px] font-bold uppercase tracking-wider text-[#737373]">
                <tr>
                  <th className="py-2 px-3">Resource Name</th>
                  <th className="py-2 px-3">Type</th>
                  <th className="py-2 px-3">Location</th>
                  <th className="py-2 px-3 text-right">Customer Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E5E5]">
                {selectedResources.map((res) => (
                  <tr key={res.id}>
                    <td className="py-2 px-3 font-semibold text-[#171717]">
                      {res.name}
                    </td>
                    <td className="py-2 px-3 text-[#525252]">
                      {res.type}
                    </td>
                    <td className="py-2 px-3 text-[#737373]">
                      {res.location.city} {res.location.area ? `(${res.location.area})` : ''}
                    </td>
                    <td className="py-2 px-3 text-right font-bold text-[#171717]">
                      {res.customerPrice ? `₹${res.customerPrice.toLocaleString('en-IN')}` : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Commercial vs Campaign Note */}
        <div className="p-3 rounded-lg bg-orange-50/50 border border-orange-200 text-xs text-[#525252] flex items-start gap-2">
          <span className="font-bold text-[#EA580C] shrink-0">•</span>
          <p className="text-[11px] leading-relaxed">
            <strong>Next Operational Steps:</strong> This reservation will advance through the approved lifecycle (UNDER REVIEW → PROVIDER/CUSTOMER CONFIRMATION → CONFIRMED). The advertising execution Campaign (mounting &amp; photo proof) will be initiated separately after confirmation.
          </p>
        </div>
      </div>

      {/* Action CTA Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <Button
          variant="outline"
          size="md"
          leftIcon={<Plus size={15} />}
          onClick={onCreateAnother}
          className="w-full sm:w-auto border-[#E5E5E5]"
        >
          Create Another Booking
        </Button>

        <Button
          variant="primary"
          size="md"
          rightIcon={<ArrowRight size={15} />}
          onClick={onGoToBookings}
          className="w-full sm:w-auto"
        >
          View Bookings Ledger
        </Button>
      </div>
    </div>
  );
};

export default BookingCreatedSuccess;
