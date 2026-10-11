import React from 'react';
import {
  User,
  Calendar,
  Layers,
  ArrowLeft,
  CheckCircle2,
  Edit,
  DollarSign,
  AlertCircle,
} from 'lucide-react';
import Button from '../../../components/ui/Button';
import { CustomerRecord } from '../../types/customer';
import { AdvertisingResource } from '../../types/resource';

export interface BookingReviewStepProps {
  customer: CustomerRecord;
  startDate: string;
  endDate: string;
  selectedResources: AdvertisingResource[];
  onEditSection: (step: number) => void;
  onBack: () => void;
  onCreateBooking: () => void;
  isSubmitting?: boolean;
}

export const BookingReviewStep: React.FC<BookingReviewStepProps> = ({
  customer,
  startDate,
  endDate,
  selectedResources,
  onEditSection,
  onBack,
  onCreateBooking,
  isSubmitting = false,
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

  const subtotal = selectedResources.reduce((acc, r) => {
    return acc + (r.customerPrice || 0);
  }, 0);

  const formattedSubtotal = `₹${subtotal.toLocaleString('en-IN')}`;

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

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Step Header */}
      <div className="border-b border-[#E5E5E5] pb-4">
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#EA580C]">
          Step 04
        </span>
        <h2 className="text-lg font-bold text-[#171717] mt-0.5">
          Review &amp; Create Booking
        </h2>
        <p className="text-xs text-[#737373] mt-0.5">
          Verify all commercial terms, customer account details, flight duration, and selected inventory before finalizing.
        </p>
      </div>

      {/* SECTION 1 — CUSTOMER */}
      <div className="rounded-xl border border-[#E5E5E5] bg-white p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-[#F5F5F4] pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-orange-50 text-[#EA580C] flex items-center justify-center border border-orange-100">
              <User size={15} />
            </div>
            <h3 className="text-sm font-bold text-[#171717]">
              SECTION 1 — CUSTOMER
            </h3>
          </div>

          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Edit size={13} />}
            onClick={() => onEditSection(1)}
            className="text-xs text-[#EA580C] hover:bg-orange-50"
          >
            Edit
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373] block">
              Customer
            </span>
            <p className="font-bold text-[#171717] text-sm">
              {customer.companyName}
            </p>
            {customer.brandName && (
              <span className="text-[11px] text-[#737373]">
                Brand: {customer.brandName}
              </span>
            )}
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373] block">
              Customer Type
            </span>
            <span className="inline-block px-2 py-0.5 rounded font-semibold text-[11px] bg-[#FAFAF9] border border-[#E5E5E5] text-[#171717]">
              {customer.customerType}
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373] block">
              Contact
            </span>
            <p className="font-medium text-[#171717]">
              {customer.contactPerson}
            </p>
            <p className="text-[11px] text-[#737373] font-mono">
              {customer.phone}
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 2 — BOOKING PERIOD */}
      <div className="rounded-xl border border-[#E5E5E5] bg-white p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-[#F5F5F4] pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-orange-50 text-[#EA580C] flex items-center justify-center border border-orange-100">
              <Calendar size={15} />
            </div>
            <h3 className="text-sm font-bold text-[#171717]">
              SECTION 2 — BOOKING PERIOD
            </h3>
          </div>

          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Edit size={13} />}
            onClick={() => onEditSection(2)}
            className="text-xs text-[#EA580C] hover:bg-orange-50"
          >
            Edit
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373] block">
              Flight Schedule
            </span>
            <p className="font-bold text-[#171717] text-sm">
              {formatDateDisplay(startDate)} &nbsp;→&nbsp; {formatDateDisplay(endDate)}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#737373]">Total Contract Duration:</span>
            <span className="px-3 py-1 rounded-lg bg-orange-50 border border-orange-200 text-sm font-extrabold text-[#EA580C]">
              {durationDays} {durationDays === 1 ? 'Day' : 'Days'}
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 3 — SELECTED INVENTORY */}
      <div className="rounded-xl border border-[#E5E5E5] bg-white p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#F5F5F4] pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-orange-50 text-[#EA580C] flex items-center justify-center border border-orange-100">
              <Layers size={15} />
            </div>
            <h3 className="text-sm font-bold text-[#171717]">
              SECTION 3 — SELECTED INVENTORY ({selectedResources.length})
            </h3>
          </div>

          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Edit size={13} />}
            onClick={() => onEditSection(3)}
            className="text-xs text-[#EA580C] hover:bg-orange-50"
          >
            Edit
          </Button>
        </div>

        <div className="rounded-lg border border-[#E5E5E5] overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAFAF9] border-b border-[#E5E5E5] text-[10px] font-bold uppercase tracking-wider text-[#737373]">
              <tr>
                <th className="py-2.5 px-3">Resource</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Location</th>
                <th className="py-2.5 px-3">Dimensions</th>
                <th className="py-2.5 px-3 text-right">Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E5]">
              {selectedResources.map((res) => (
                <tr key={res.id} className="hover:bg-[#FAFAF9]/60">
                  <td className="py-2.5 px-3 font-bold text-[#171717]">
                    {res.name}
                  </td>
                  <td className="py-2.5 px-3 text-[#525252]">
                    <span className="px-2 py-0.5 rounded bg-[#FAFAF9] border border-[#E5E5E5] font-semibold text-[11px]">
                      {res.type}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-[#525252]">
                    {res.location.city}
                    {res.location.area ? `, ${res.location.area}` : ''}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-[11px] text-[#525252]">
                    {res.widthFt} × {res.heightFt} ft
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-[#171717]">
                    {res.customerPrice !== null && res.customerPrice !== undefined
                      ? `₹${res.customerPrice.toLocaleString('en-IN')}`
                      : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 4 — PRICING */}
      <div className="rounded-xl border border-[#E5E5E5] bg-white p-5 shadow-xs space-y-3">
        <div className="flex items-center gap-2 border-b border-[#F5F5F4] pb-3">
          <div className="w-7 h-7 rounded-md bg-orange-50 text-[#EA580C] flex items-center justify-center border border-orange-100">
            <DollarSign size={15} />
          </div>
          <h3 className="text-sm font-bold text-[#171717]">
            SECTION 4 — PRICING
          </h3>
        </div>

        <div className="max-w-md ml-auto space-y-2 text-xs">
          <div className="flex items-center justify-between text-[#525252]">
            <span>Subtotal</span>
            <span className="font-bold text-[#171717]">{formattedSubtotal}</span>
          </div>

          <div className="flex items-center justify-between text-[#737373]">
            <span>Adjustment</span>
            <span>—</span>
          </div>

          <div className="pt-2 border-t border-[#E5E5E5] flex items-center justify-between">
            <span className="font-bold text-sm text-[#171717]">Final Amount</span>
            <span className="font-extrabold text-lg text-[#EA580C]">
              {formattedSubtotal}
            </span>
          </div>
        </div>
      </div>

      {/* SODAARS Governance Disclaimer */}
      <div className="p-3.5 rounded-xl bg-[#FAFAF9] border border-[#E5E5E5] flex items-start gap-2.5 text-xs text-[#525252]">
        <AlertCircle size={15} className="text-[#EA580C] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-[#171717]">
            Booking vs Campaign Notice
          </p>
          <p className="text-[11px] text-[#737373] leading-relaxed">
            Creating this booking registers a commercial reservation under status <strong>UNDER REVIEW</strong> with source <strong>Provider</strong>. A separate Campaign for mounting, proof of flight, and execution can be scheduled after booking confirmation.
          </p>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-4 border-t border-[#E5E5E5] flex items-center justify-between">
        <Button variant="secondary" size="md" leftIcon={<ArrowLeft size={15} />} onClick={onBack}>
          Back
        </Button>

        <Button
          variant="primary"
          size="md"
          leftIcon={<CheckCircle2 size={16} />}
          disabled={isSubmitting}
          onClick={onCreateBooking}
          className="bg-[#EA580C] hover:bg-[#C2410C]"
        >
          {isSubmitting ? 'Creating Booking...' : 'Create Booking'}
        </Button>
      </div>
    </div>
  );
};

export default BookingReviewStep;
