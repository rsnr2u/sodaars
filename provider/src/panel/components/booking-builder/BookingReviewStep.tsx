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
  includePrinting: boolean;
  onTogglePrinting: (val: boolean) => void;
  includeMounting: boolean;
  onToggleMounting: (val: boolean) => void;
  creativeOption: 'WAIVED' | 'BILLABLE' | 'NONE';
  onChangeCreativeOption: (val: 'WAIVED' | 'BILLABLE' | 'NONE') => void;
  commercialDiscount: number;
  onChangeCommercialDiscount: (val: number) => void;
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
  includePrinting,
  onTogglePrinting,
  includeMounting,
  onToggleMounting,
  creativeOption,
  onChangeCreativeOption,
  commercialDiscount,
  onChangeCommercialDiscount,
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

  // Area & Rates
  const totalAreaSqFt = selectedResources.reduce((acc, r) => acc + (r.totalSqFt || 0), 0);
  const printingRate = selectedResources[0]?.printingRatePerSqFt || 12;
  const mountingRate = selectedResources[0]?.mountingRatePerSqFt || 5;

  // Ancillary calculations
  const baseRental = selectedResources.reduce((acc, r) => acc + (r.customerPrice || 0), 0);
  const printingCharges = includePrinting
    ? Math.round(selectedResources.reduce((acc, r) => acc + ((r.totalSqFt || 0) * (r.printingRatePerSqFt || 12)), 0))
    : 0;
  const mountingCharges = includeMounting
    ? Math.round(selectedResources.reduce((acc, r) => acc + ((r.totalSqFt || 0) * (r.mountingRatePerSqFt || 5)), 0))
    : 0;

  const creativeFee = 3000;
  const creativeCharged = creativeOption === 'BILLABLE' ? creativeFee : 0;
  const grossSubtotal = baseRental + printingCharges + mountingCharges + creativeCharged;
  const discountAmount = Math.min(commercialDiscount, grossSubtotal);
  const netTaxable = Math.max(0, grossSubtotal - discountAmount);
  const gstAmount = Math.round(netTaxable * 0.18);
  const grandTotal = netTaxable + gstAmount;

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

      {/* SECTION 4 — PRICING & PRODUCTION ADD-ONS (MATCHING SCREENSHOT) */}
      <div className="rounded-xl border border-[#E5E5E5] bg-white p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-[#F5F5F4] pb-3">
          <div className="w-7 h-7 rounded-md bg-orange-50 text-[#EA580C] flex items-center justify-center border border-orange-100">
            <DollarSign size={15} />
          </div>
          <h3 className="text-sm font-bold text-[#171717]">
            SECTION 4 — COMMERCIAL RATE CARD &amp; PRODUCTION ADD-ONS
          </h3>
        </div>

        {/* The Exact Add-on Selector from Screenshot */}
        <div className="p-4 rounded-xl border border-stone-200 bg-[#FAFAF9] space-y-3.5">
          <div className="flex items-center justify-between border-b border-stone-200 pb-2">
            <div>
              <span className="text-xs font-bold text-[#171717] uppercase tracking-wide">
                Production, Mounting &amp; Creative Add-ons
              </span>
              <p className="text-[11px] text-[#737373]">
                Physical print fabrication, rigger mounting squad, and master artwork resizing
              </p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-50 text-[#EA580C] border border-orange-200 font-semibold">
              {totalAreaSqFt} sq.ft Total Area
            </span>
          </div>

          <div className="space-y-3">
            {/* 1. Printing Charges */}
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2.5 cursor-pointer font-medium text-stone-900">
                <input
                  type="checkbox"
                  checked={includePrinting}
                  onChange={(e) => onTogglePrinting(e.target.checked)}
                  className="w-4 h-4 rounded border-stone-300 text-[#EA580C] focus:ring-[#EA580C]"
                />
                <span>Printing Charges (₹{printingRate}/sqft)</span>
              </label>
              <span className="font-mono font-bold text-stone-900 text-sm">
                {includePrinting ? `₹${printingCharges.toLocaleString('en-IN')}` : '₹0'}
              </span>
            </div>

            {/* 2. Mounting Charges */}
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2.5 cursor-pointer font-medium text-stone-900">
                <input
                  type="checkbox"
                  checked={includeMounting}
                  onChange={(e) => onToggleMounting(e.target.checked)}
                  className="w-4 h-4 rounded border-stone-300 text-[#EA580C] focus:ring-[#EA580C]"
                />
                <span>Mounting Charges (₹{mountingRate}/sqft)</span>
              </label>
              <span className="font-mono font-bold text-stone-900 text-sm">
                {includeMounting ? `₹${mountingCharges.toLocaleString('en-IN')}` : '₹0'}
              </span>
            </div>

            {/* 3. Ad Creatives / Designs */}
            <div className="flex items-center justify-between text-xs pt-1 border-t border-stone-200/80">
              <div className="space-y-1">
                <label className="flex items-center gap-2.5 cursor-pointer font-medium text-stone-900">
                  <input
                    type="checkbox"
                    checked={creativeOption !== 'NONE'}
                    onChange={(e) => onChangeCreativeOption(e.target.checked ? 'WAIVED' : 'NONE')}
                    className="w-4 h-4 rounded border-stone-300 text-[#EA580C] focus:ring-[#EA580C]"
                  />
                  <span>Ad Creatives / Designs</span>
                </label>
                {creativeOption !== 'NONE' && (
                  <div className="pl-6.5 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onChangeCreativeOption('WAIVED')}
                      className={`text-[10px] px-2 py-0.5 rounded font-semibold transition-colors ${
                        creativeOption === 'WAIVED'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      Courtesy Waiver (Free)
                    </button>
                    <button
                      type="button"
                      onClick={() => onChangeCreativeOption('BILLABLE')}
                      className={`text-[10px] px-2 py-0.5 rounded font-semibold transition-colors ${
                        creativeOption === 'BILLABLE'
                          ? 'bg-orange-100 text-[#EA580C] border border-orange-300'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      Charge Fee (₹3,000)
                    </button>
                  </div>
                )}
              </div>

              <div className="font-mono font-bold flex items-center gap-2 text-sm">
                {creativeOption === 'WAIVED' && (
                  <>
                    <span className="line-through text-stone-400 font-normal">₹3,000</span>
                    <span className="text-emerald-700">₹0</span>
                  </>
                )}
                {creativeOption === 'BILLABLE' && <span className="text-stone-900">₹3,000</span>}
                {creativeOption === 'NONE' && (
                  <>
                    <span className="line-through text-stone-400 font-normal">₹3,000</span>
                    <span className="text-stone-500 font-normal">₹0</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Commercial Ledger Breakdown */}
        <div className="max-w-md ml-auto space-y-2 text-xs pt-1">
          <div className="flex items-center justify-between text-[#525252]">
            <span>Media Display Rental</span>
            <span className="font-bold font-mono text-[#171717]">₹{baseRental.toLocaleString('en-IN')}</span>
          </div>

          {includePrinting && (
            <div className="flex items-center justify-between text-[#525252]">
              <span>Flex Solvent Printing ({totalAreaSqFt} sq.ft)</span>
              <span className="font-bold font-mono text-[#171717]">₹{printingCharges.toLocaleString('en-IN')}</span>
            </div>
          )}

          {includeMounting && (
            <div className="flex items-center justify-between text-[#525252]">
              <span>Rigger Mounting Squad ({totalAreaSqFt} sq.ft)</span>
              <span className="font-bold font-mono text-[#171717]">₹{mountingCharges.toLocaleString('en-IN')}</span>
            </div>
          )}

          {creativeOption === 'BILLABLE' && (
            <div className="flex items-center justify-between text-[#525252]">
              <span>Master Ad Creative Fee</span>
              <span className="font-bold font-mono text-[#171717]">₹3,000</span>
            </div>
          )}

          {creativeOption === 'WAIVED' && (
            <div className="flex items-center justify-between text-emerald-700">
              <span>Courtesy Creative Fee Waiver</span>
              <span className="font-bold font-mono">-₹3,000 (100% Free)</span>
            </div>
          )}

          <div className="pt-2 border-t border-[#E5E5E5] flex items-center justify-between text-xs">
            <span className="font-bold text-[#171717]">Gross Subtotal</span>
            <span className="font-bold font-mono text-[#171717]">₹{grossSubtotal.toLocaleString('en-IN')}</span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-[#525252]">Commercial Discount (₹)</span>
            <input
              type="number"
              min={0}
              step={500}
              value={commercialDiscount || ''}
              onChange={(e) => onChangeCommercialDiscount(Number(e.target.value) || 0)}
              placeholder="0"
              className="w-24 h-7 text-right px-2 py-0.5 rounded border border-stone-200 font-mono text-xs text-stone-900 focus:outline-none focus:border-[#EA580C]"
            />
          </div>

          {discountAmount > 0 && (
            <div className="flex items-center justify-between text-emerald-700 text-xs font-semibold">
              <span>Discount Applied</span>
              <span className="font-mono">-₹{discountAmount.toLocaleString('en-IN')}</span>
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-[#525252]">
            <span>GST (18% SAC 998361)</span>
            <span className="font-mono font-medium">₹{gstAmount.toLocaleString('en-IN')}</span>
          </div>

          <div className="pt-2 border-t border-[#E5E5E5] flex items-center justify-between">
            <span className="font-bold text-sm text-[#171717]">Total Final Payable</span>
            <span className="font-extrabold text-lg text-[#EA580C] font-mono">
              ₹{grandTotal.toLocaleString('en-IN')}
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
