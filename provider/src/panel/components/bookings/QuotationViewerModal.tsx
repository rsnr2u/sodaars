import React from 'react';
import {
  X,
  Printer,
  CheckCircle2,
  MapPin,
  Calendar,
  Layers,
  ShieldCheck,
} from 'lucide-react';
import { BookingRecord, BOOKING_SOURCE_CONFIG } from '../../types/booking';
import Button from '../../../components/ui/Button';

export interface QuotationViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: BookingRecord | null;
  onConfirmBooking?: (booking: BookingRecord) => void;
}

export const QuotationViewerModal: React.FC<QuotationViewerModalProps> = ({
  isOpen,
  onClose,
  booking,
  onConfirmBooking,
}) => {
  if (!isOpen || !booking) return null;

  const handlePrint = () => {
    window.print();
  };

  const quotationId = `QUO-${booking.id.replace('BKG-', '')}`;
  const sourceMeta = BOOKING_SOURCE_CONFIG[booking.source];

  // Base pricing calculations
  const rawPrice = parseInt(
    booking.pricing.regularCustomerPrice ||
      booking.pricing.finalInvoicedAmount ||
      booking.pricing.sodaarsPrice ||
      '150000',
    10
  );
  const displayRental = Math.round(rawPrice * 0.85);
  const flexPrinting = Math.round(rawPrice * 0.1);
  const mountingElectricals = Math.round(rawPrice * 0.05);
  const subtotal = displayRental + flexPrinting + mountingElectricals;
  const gstRate = 18;
  const gstAmount = Math.round((subtotal * gstRate) / 100);
  const totalAmount = subtotal + gstAmount;

  const formatCurrency = (amt: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amt);
  };

  // Duration in days
  const start = new Date(booking.startDate);
  const end = new Date(booking.endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1 || 30;

  const canConfirm =
    booking.status === 'UNDER REVIEW' ||
    booking.status === 'NEW' ||
    booking.status === 'PROVIDER CONFIRMATION';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl bg-white rounded-xl border border-[#E5E5E5] shadow-2xl overflow-hidden flex flex-col my-auto max-h-[94vh]"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Top Bar (Toolbar) */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#E5E5E5] bg-[#FAFAF9]">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold text-[#EA580C] bg-orange-50 border border-orange-200 px-2 py-0.5 rounded">
              {quotationId}
            </span>
            <span className="text-xs text-[#737373] hidden sm:inline">
              Official OOH Media Rate Quotation &amp; Release Order (RO) Memo
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              leftIcon={<Printer size={13} />}
              className="text-xs"
            >
              Print / PDF
            </Button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#737373] hover:text-[#171717] hover:bg-[#E5E5E5] transition-colors"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Quotation Sheet */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-[#171717] bg-white print:p-0">
          {/* Header Block: Provider Letterhead */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-[#E5E5E5]">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-[#EA580C] text-white flex items-center justify-center font-black text-sm tracking-tight">
                  SO
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-[#171717] leading-none">
                    Apex Outdoor Media Network Pvt Ltd
                  </h2>
                  <p className="text-[11px] text-[#737373] mt-0.5">
                    Centralized Concessionaire • SODAARS Operating System Network
                  </p>
                </div>
              </div>
              <p className="text-xs text-[#525252] max-w-sm pt-2 leading-relaxed">
                Level 4, Trade Centre, Bandra Kurla Complex (BKC), Bandra East, Mumbai, Maharashtra 400051
              </p>
              <div className="flex items-center gap-4 text-xs font-mono text-[#525252] pt-1">
                <span>GSTIN: <strong>27AABCS1429B1Z4</strong></span>
                <span>PAN: <strong>AABCS1429B</strong></span>
              </div>
            </div>

            <div className="text-left sm:text-right space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#EA580C] bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                PROFORMA QUOTATION / RO
              </span>
              <div className="text-xl font-black font-mono text-[#171717] pt-1">
                {quotationId}
              </div>
              <p className="text-xs text-[#737373]">
                Booking Ref: <strong className="font-mono text-[#171717]">{booking.id}</strong>
              </p>
              <p className="text-xs text-[#737373]">
                Issue Date: <span className="font-medium text-[#171717]">{booking.createdAt || '11 Oct 2026'}</span>
              </p>
              <p className="text-xs text-[#737373]">
                Validity: <span className="font-semibold text-emerald-700">15 Days from Issue</span>
              </p>
            </div>
          </div>

          {/* Client & Agency Particulars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-[#FAFAF9] border border-[#E5E5E5] text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#737373] tracking-wider">
                Issued To (Agency / Client)
              </span>
              <h3 className="text-sm font-bold text-[#171717] mt-1">
                {booking.companyName}
              </h3>
              <p className="text-[#525252] mt-0.5">
                Attention: <span className="font-medium text-[#171717]">{booking.customerName}</span>
              </p>
              <p className="text-[#737373] mt-0.5">
                Email: {booking.contactEmail || 'media.buying@agency.com'}
              </p>
              <p className="text-[#737373]">
                Phone: {booking.contactPhone || '+91 98200 12345'}
              </p>
            </div>

            <div className="sm:border-l sm:border-[#E5E5E5] sm:pl-4 space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#737373] tracking-wider">
                Booking Channel &amp; Execution Terms
              </span>
              <div className="flex items-center gap-2 pt-1">
                <span className="text-[#737373]">Channel Source:</span>
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-extrabold uppercase border ${sourceMeta.badgeBg} ${sourceMeta.badgeText} ${sourceMeta.badgeBorder}`}
                >
                  {sourceMeta.badge}
                </span>
              </div>
              <p className="text-[#525252]">
                Service Code: <span className="font-mono font-semibold">SAC 998361 (Advertising Services)</span>
              </p>
              <p className="text-[#525252]">
                Proof Protocol: <span className="font-medium text-[#171717]">Dual Geotagged POP (Day + Night)</span>
              </p>
            </div>
          </div>

          {/* OOH Media Asset Specifications Table */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#737373]">
              Media Asset Specifications &amp; Schedule
            </h4>
            <div className="border border-[#E5E5E5] rounded-xl overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#FAFAF9] border-b border-[#E5E5E5] text-[10px] uppercase tracking-wider text-[#737373] font-bold">
                  <tr>
                    <th className="py-2.5 px-3">Asset Description</th>
                    <th className="py-2.5 px-3">Format</th>
                    <th className="py-2.5 px-3">Location</th>
                    <th className="py-2.5 px-3">Schedule</th>
                    <th className="py-2.5 px-3 text-right">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E5E5]">
                  <tr>
                    <td className="py-3 px-3 font-semibold text-[#171717]">
                      <div className="flex items-center gap-1.5">
                        <Layers size={13} className="text-[#EA580C] shrink-0" />
                        <span>{booking.resourceName}</span>
                      </div>
                      <span className="text-[10px] text-[#737373] font-mono">
                        Ref ID: {booking.resourceId}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[#525252]">{booking.resourceType}</td>
                    <td className="py-3 px-3 text-[#525252]">
                      <div className="flex items-center gap-1">
                        <MapPin size={11} className="text-[#EA580C] shrink-0" />
                        <span>{booking.location}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-[#171717] font-medium whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Calendar size={11} className="text-stone-400 shrink-0" />
                        <span>{booking.startDate} → {booking.endDate}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-[#171717]">
                      {diffDays} Days
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Commercial Rate Card Breakdown */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#737373]">
              Commercial Rate Card &amp; Tax Estimation
            </h4>
            <div className="border border-[#E5E5E5] rounded-xl overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#FAFAF9] border-b border-[#E5E5E5] text-[10px] uppercase tracking-wider text-[#737373] font-bold">
                  <tr>
                    <th className="py-2.5 px-3">Line Item Description</th>
                    <th className="py-2.5 px-3">SAC Code</th>
                    <th className="py-2.5 px-3 text-right">Units</th>
                    <th className="py-2.5 px-3 text-right">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E5E5]">
                  <tr>
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-[#171717]">
                        Outdoor Media Display Rental (Base Rate)
                      </div>
                      <div className="text-[11px] text-[#737373]">
                        Prime arterial traffic corridor exposure for {diffDays} calendar days.
                      </div>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[#737373]">998361</td>
                    <td className="py-2.5 px-3 text-right text-[#525252]">1 Lot</td>
                    <td className="py-2.5 px-3 text-right font-mono font-semibold text-[#171717]">
                      {formatCurrency(displayRental)}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-[#171717]">
                        Flex Vinyl Solvent Printing (Heavy Duty 440 GSM)
                      </div>
                      <div className="text-[11px] text-[#737373]">
                        High-density UV ink solvent printing with eyelet hems.
                      </div>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[#737373]">998361</td>
                    <td className="py-2.5 px-3 text-right text-[#525252]">1 Skin</td>
                    <td className="py-2.5 px-3 text-right font-mono font-semibold text-[#171717]">
                      {formatCurrency(flexPrinting)}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-[#171717]">
                        Rigger Squad Mounting, Tensioning &amp; Lighting Audit
                      </div>
                      <div className="text-[11px] text-[#737373]">
                        Certified night installation and high-beam electrical illumination check.
                      </div>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[#737373]">998361</td>
                    <td className="py-2.5 px-3 text-right text-[#525252]">1 Service</td>
                    <td className="py-2.5 px-3 text-right font-mono font-semibold text-[#171717]">
                      {formatCurrency(mountingElectricals)}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Totals Summary */}
              <div className="bg-[#FAFAF9] border-t border-[#E5E5E5] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
                    <ShieldCheck size={14} />
                    <span>Price Protected via SODAARS Rate Lock Protocol</span>
                  </div>
                  <p className="text-[11px] text-[#737373]">
                    Includes night illumination power, rigger insurance, and municipal permits.
                  </p>
                </div>

                <div className="w-full sm:w-64 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-[#525252]">
                    <span>Net Subtotal:</span>
                    <span className="font-mono font-semibold">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between text-[#525252]">
                    <span>GST (18% SAC 998361):</span>
                    <span className="font-mono font-semibold">{formatCurrency(gstAmount)}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-[#E5E5E5] text-sm font-black text-[#171717]">
                    <span>Total Quotation:</span>
                    <span className="font-mono text-[#EA580C]">{formatCurrency(totalAmount)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Standard Industry Terms */}
          <div className="p-4 rounded-xl border border-[#E5E5E5] bg-[#FAFAF9]/60 space-y-2 text-[11px] text-[#737373] leading-relaxed">
            <h5 className="font-bold uppercase tracking-wider text-[#171717]">
              Commercial Terms &amp; Settlement Protocols:
            </h5>
            <ol className="list-decimal pl-4 space-y-1">
              <li>
                <strong>Payment Schedule:</strong> 50% advance mobilization deposit on Release Order (RO) sign-off. Balance 50% upon delivery of geotagged POP day and night mounting photos.
              </li>
              <li>
                <strong>Marketplace Escrow:</strong> For bookings via SODAARS Marketplace, 100% funds are held in secure escrow and disbursed automatically upon night-illumination signoff.
              </li>
              <li>
                <strong>Mounting Proof:</strong> Certified timestamped photo proofs are uploaded to the SODAARS Provider Console within 24 hours of installation.
              </li>
            </ol>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#E5E5E5] bg-[#FAFAF9]">
          <span className="text-xs text-[#737373]">
            Status: <strong className="text-[#171717]">{booking.status}</strong>
          </span>

          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={onClose}>
              Close
            </Button>
            {canConfirm && onConfirmBooking && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  onConfirmBooking(booking);
                  onClose();
                }}
                leftIcon={<CheckCircle2 size={14} />}
              >
                Approve &amp; Confirm Booking
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotationViewerModal;
