import React from 'react';
import {
  FileText,
  MapPin,
  ArrowRight,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import Drawer from '../../../components/ui/Drawer';
import Button from '../../../components/ui/Button';
import {
  BookingRecord,
  BOOKING_SOURCE_CONFIG,
  BOOKING_STATUS_CONFIG,
} from '../../types/booking';

export interface BookingDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  booking: BookingRecord | null;
  onConfirm?: (booking: BookingRecord) => void;
  onDecline?: (booking: BookingRecord) => void;
}

export const BookingDetailDrawer: React.FC<BookingDetailDrawerProps> = ({
  isOpen,
  onClose,
  booking,
  onConfirm,
  onDecline,
}) => {
  if (!booking) return null;

  const sourceMeta = BOOKING_SOURCE_CONFIG[booking.source];
  const statusMeta = BOOKING_STATUS_CONFIG[booking.status];

  const canConfirm =
    booking.status === 'PROVIDER CONFIRMATION' ||
    booking.status === 'UNDER REVIEW';
  const canDecline =
    booking.status === 'PROVIDER CONFIRMATION' ||
    booking.status === 'UNDER REVIEW' ||
    booking.status === 'NEW';

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <FileText size={17} className="text-[#EA580C]" />
          <span>Booking Details — {booking.id}</span>
        </div>
      }
      width="max-w-2xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="text-xs text-[#737373]">
            Origin Channel:{' '}
            <span className="font-semibold text-[#171717]">
              {sourceMeta.label}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {canDecline && onDecline && (
              <Button
                variant="outline"
                size="sm"
                className="border-rose-200 text-rose-700 hover:bg-rose-50"
                leftIcon={<XCircle size={14} />}
                onClick={() => onDecline(booking)}
              >
                Decline Booking
              </Button>
            )}
            {canConfirm && onConfirm && (
              <Button
                variant="primary"
                size="sm"
                leftIcon={<CheckCircle2 size={14} />}
                onClick={() => onConfirm(booking)}
              >
                Confirm Booking
              </Button>
            )}
            <Button variant="secondary" size="sm" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* ========================================================================= */}
        {/* 1. BOOKING OVERVIEW                                                       */}
        {/* ========================================================================= */}
        <div className="bg-[#FAFAF9] rounded-xl p-4 border border-[#E5E5E5] space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373]">
              Booking Overview
            </span>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${statusMeta.badgeBg} ${statusMeta.badgeText} ${statusMeta.badgeBorder}`}
            >
              {statusMeta.label}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3.5 text-xs">
            <div>
              <span className="text-[#737373] text-[11px] block">Booking ID</span>
              <span className="font-mono font-bold text-[#171717]">{booking.id}</span>
            </div>
            <div>
              <span className="text-[#737373] text-[11px] block">Booking Source</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span
                  className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-extrabold uppercase border ${sourceMeta.badgeBg} ${sourceMeta.badgeText} ${sourceMeta.badgeBorder}`}
                >
                  {sourceMeta.badge}
                </span>
              </div>
            </div>
            <div>
              <span className="text-[#737373] text-[11px] block">Customer</span>
              <span className="font-medium text-[#171717]">{booking.customerName}</span>
            </div>
            <div>
              <span className="text-[#737373] text-[11px] block">Company</span>
              <span className="font-medium text-[#171717]">{booking.companyName}</span>
            </div>
            <div>
              <span className="text-[#737373] text-[11px] block">Start Date</span>
              <span className="font-medium text-[#171717]">{booking.startDate}</span>
            </div>
            <div>
              <span className="text-[#737373] text-[11px] block">End Date</span>
              <span className="font-medium text-[#171717]">{booking.endDate}</span>
            </div>
          </div>

          {/* Source Description banner */}
          <div className="p-2.5 rounded-lg bg-white border border-[#E5E5E5] text-[11px] text-[#525252] flex items-start gap-2">
            <span className="font-bold text-[#171717] shrink-0">Source Definition:</span>
            <span>{sourceMeta.description}</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. RESOURCE / AVAILABILITY RELATIONSHIP                                   */}
        {/* ========================================================================= */}
        <div className="rounded-xl border border-[#E5E5E5] p-4 bg-white space-y-3.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373]">
              Resource / Availability
            </span>
            <span className="text-[11px] text-[#737373] font-medium">
              Calendar Engine Linkage
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs bg-[#FAFAF9] p-3 rounded-lg border border-[#E5E5E5]">
            <div>
              <span className="text-[#737373] text-[11px] block">Resource Name</span>
              <span className="font-bold text-[#171717]">{booking.resourceName}</span>
            </div>
            <div>
              <span className="text-[#737373] text-[11px] block">Resource Type</span>
              <span className="font-medium text-[#171717]">{booking.resourceType}</span>
            </div>
            <div className="col-span-2">
              <span className="text-[#737373] text-[11px] block">Location</span>
              <span className="font-medium text-[#171717] flex items-center gap-1 mt-0.5">
                <MapPin size={12} className="text-[#EA580C]" />
                {booking.location}
              </span>
            </div>
          </div>

          {/* Connected relationship sequence */}
          <div className="p-3 rounded-lg border border-stone-200 bg-white">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373] block mb-2">
              Operational Relationship
            </span>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#171717] flex-wrap">
              <span className="px-2 py-1 rounded bg-[#FAFAF9] border border-[#E5E5E5]">
                Advertising Resource
              </span>
              <ArrowRight size={13} className="text-[#737373]" />
              <span className="px-2 py-1 rounded bg-[#FAFAF9] border border-[#E5E5E5]">
                Availability
              </span>
              <ArrowRight size={13} className="text-[#737373]" />
              <span className="px-2 py-1 rounded bg-orange-50 border border-orange-200 text-[#EA580C]">
                Booking
              </span>
            </div>
            <p className="text-[11px] text-[#737373] mt-2.5 leading-relaxed">
              Bookings are connected to the Availability Engine for scheduling verification across the specified date interval.
            </p>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. PRICING BREAKDOWN                                                      */}
        {/* ========================================================================= */}
        <div className="rounded-xl border border-[#E5E5E5] p-4 bg-white space-y-3.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373]">
              Pricing Breakdown
            </span>
            <span className="text-[10px] font-semibold text-[#737373]">
              Neutral Commercial Ledger
            </span>
          </div>

          <div className="divide-y divide-[#E5E5E5] text-xs">
            <div className="py-2 flex items-center justify-between">
              <span className="text-[#525252]">Regular Customer Price</span>
              <span className="font-semibold text-[#171717]">
                {booking.pricing.regularCustomerPrice || '—'}
              </span>
            </div>
            <div className="py-2 flex items-center justify-between">
              <div>
                <span className="text-[#525252] block">SODAARS Price / Provider Marketplace Net Price</span>
                <span className="text-[10px] text-[#737373]">
                  Provider settlement basis for applicable Marketplace transactions
                </span>
              </div>
              <span className="font-semibold text-[#171717]">
                {booking.pricing.sodaarsPrice || '—'}
              </span>
            </div>
            <div className="py-2 flex items-center justify-between">
              <span className="text-[#525252]">Agreed Markup Amount</span>
              <span className="font-semibold text-[#171717]">
                {booking.pricing.agreedMarkupAmount || '—'}
              </span>
            </div>
            <div className="py-2 flex items-center justify-between">
              <span className="text-[#525252]">Customer Adjustment Amount</span>
              <span className="font-semibold text-[#171717]">
                {booking.pricing.customerAdjustmentAmount || '—'}
              </span>
            </div>
            <div className="py-2.5 flex items-center justify-between bg-[#FAFAF9] -mx-4 px-4 font-bold border-t border-[#E5E5E5]">
              <span className="text-[#171717]">Final Invoiced Amount</span>
              <span className="text-[#EA580C] text-sm">
                {booking.pricing.finalInvoicedAmount || '—'}
              </span>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-[#FAFAF9] border border-[#E5E5E5] text-[11px] text-[#737373] leading-relaxed">
            Payment status is tracked as part of the booking workflow.
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4. CUSTOMER CONNECTION                                                    */}
        {/* ========================================================================= */}
        <div className="rounded-xl border border-[#E5E5E5] p-4 bg-white space-y-3.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373]">
              Customer Connection
            </span>
            <span className="text-[10px] font-semibold text-[#737373]">
              Lifecycle Linkage
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs bg-[#FAFAF9] p-3 rounded-lg border border-[#E5E5E5]">
            <div>
              <span className="text-[#737373] text-[11px] block">Customer Contact</span>
              <span className="font-medium text-[#171717]">{booking.customerName}</span>
            </div>
            <div>
              <span className="text-[#737373] text-[11px] block">Company Name</span>
              <span className="font-medium text-[#171717]">{booking.companyName}</span>
            </div>
            <div>
              <span className="text-[#737373] text-[11px] block">Email</span>
              <span className="font-medium text-[#171717]">
                {booking.contactEmail || '—'}
              </span>
            </div>
            <div>
              <span className="text-[#737373] text-[11px] block">Phone</span>
              <span className="font-medium text-[#171717]">
                {booking.contactPhone || '—'}
              </span>
            </div>
          </div>

          {/* Linear Relationship representation */}
          <div className="p-3 rounded-lg border border-stone-200 bg-white">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373] block mb-2">
              System Progression
            </span>
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#171717] flex-wrap">
              <span className="px-2 py-0.5 rounded bg-[#FAFAF9] border border-[#E5E5E5]">
                Customer
              </span>
              <ArrowRight size={12} className="text-[#737373]" />
              <span className="px-2 py-0.5 rounded bg-orange-50 border border-orange-200 text-[#EA580C]">
                Booking
              </span>
              <ArrowRight size={12} className="text-[#737373]" />
              <span className="px-2 py-0.5 rounded bg-[#FAFAF9] border border-[#E5E5E5]">
                Advertising Resource
              </span>
              <ArrowRight size={12} className="text-[#737373]" />
              <span className="px-2 py-0.5 rounded bg-[#FAFAF9] border border-[#E5E5E5]">
                Campaign
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 5. NOTES & DECLINE REASON (IF PRESENT)                                    */}
        {/* ========================================================================= */}
        {booking.declineReason && (
          <div className="rounded-xl border border-rose-200 p-4 bg-rose-50/50 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800 block">
              Decline Reason
            </span>
            <p className="text-xs text-rose-900 leading-relaxed font-medium">
              {booking.declineReason}
            </p>
          </div>
        )}

        {booking.notes && (
          <div className="rounded-xl border border-[#E5E5E5] p-4 bg-white space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373] block">
              Booking Notes
            </span>
            <p className="text-xs text-[#525252] leading-relaxed whitespace-pre-line">
              {booking.notes}
            </p>
          </div>
        )}
      </div>
    </Drawer>
  );
};

export default BookingDetailDrawer;
