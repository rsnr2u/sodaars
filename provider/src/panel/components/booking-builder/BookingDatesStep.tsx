import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
} from 'lucide-react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { CustomerRecord } from '../../types/customer';

export interface BookingDatesStepProps {
  customer: CustomerRecord | null;
  startDate: string;
  endDate: string;
  onDatesChange: (start: string, end: string) => void;
  onBack: () => void;
  onContinue: () => void;
}

export const BookingDatesStep: React.FC<BookingDatesStepProps> = ({
  customer,
  startDate,
  endDate,
  onDatesChange,
  onBack,
  onContinue,
}) => {
  const [internalStart, setInternalStart] = useState(startDate);
  const [internalEnd, setInternalEnd] = useState(endDate);

  const calculateDays = (start: string, end: string): number => {
    if (!start || !end) return 0;
    const s = new Date(start);
    const e = new Date(end);
    if (isNaN(s.getTime()) || isNaN(e.getTime())) return 0;
    const diffTime = e.getTime() - s.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1; // inclusive
    return diffDays > 0 ? diffDays : 0;
  };

  const isInvalidRange = Boolean(
    internalStart && internalEnd && internalEnd < internalStart
  );

  const durationDays = isInvalidRange ? 0 : calculateDays(internalStart, internalEnd);

  const isValid = Boolean(
    internalStart && internalEnd && !isInvalidRange && durationDays > 0
  );

  const handleStartChange = (val: string) => {
    setInternalStart(val);
    onDatesChange(val, internalEnd);
  };

  const handleEndChange = (val: string) => {
    setInternalEnd(val);
    onDatesChange(internalStart, val);
  };

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
    <div className="space-y-6">
      {/* Step Header */}
      <div className="border-b border-[#E5E5E5] pb-4">
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#EA580C]">
          Step 02
        </span>
        <h2 className="text-lg font-bold text-[#171717] mt-0.5">
          Booking Period
        </h2>
        <p className="text-xs text-[#737373] mt-0.5">
          Define the contract flight dates. Media availability in Step 03 will be evaluated against this period.
        </p>
      </div>

      {/* Customer Context Strip */}
      {customer && (
        <div className="p-3 rounded-lg bg-[#FAFAF9] border border-[#E5E5E5] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-[#737373]">Booking for Customer:</span>
            <span className="font-bold text-[#171717]">{customer.companyName}</span>
            <span className="text-[11px] text-[#737373]">({customer.customerType})</span>
          </div>
          <span className="text-[11px] text-[#737373]">
            Contact: {customer.contactPerson}
          </span>
        </div>
      )}

      {/* Date Selection Box */}
      <div className="max-w-xl mx-auto rounded-xl border border-[#E5E5E5] bg-white p-6 space-y-6 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Start Date */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#171717] flex items-center gap-1.5">
              <CalendarIcon size={14} className="text-[#EA580C]" />
              Start Date <span className="text-rose-500">*</span>
            </label>
            <Input
              type="date"
              value={internalStart}
              onChange={(e) => handleStartChange(e.target.value)}
              className="w-full text-xs h-10"
            />
            <span className="text-[11px] text-[#737373] block">
              Formatted: {formatDateDisplay(internalStart)}
            </span>
          </div>

          {/* End Date */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#171717] flex items-center gap-1.5">
              <CalendarIcon size={14} className="text-[#EA580C]" />
              End Date <span className="text-rose-500">*</span>
            </label>
            <Input
              type="date"
              value={internalEnd}
              onChange={(e) => handleEndChange(e.target.value)}
              className={`w-full text-xs h-10 ${
                isInvalidRange ? 'border-rose-400 focus:border-rose-500' : ''
              }`}
            />
            <span className="text-[11px] text-[#737373] block">
              Formatted: {formatDateDisplay(internalEnd)}
            </span>
          </div>
        </div>

        {/* Inline Error if End Date is before Start Date */}
        {isInvalidRange && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 flex items-center gap-2 text-xs text-rose-900">
            <AlertCircle size={15} className="text-rose-600 shrink-0" />
            <span>End Date cannot be before Start Date. Please select a valid date range.</span>
          </div>
        )}

        {/* Duration Calculation Banner */}
        {isValid && (
          <div className="p-4 rounded-xl bg-orange-50/60 border border-orange-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#EA580C]">
                Booking Duration
              </span>
              <p className="text-sm font-bold text-[#171717]">
                {formatDateDisplay(internalStart)} &nbsp;→&nbsp; {formatDateDisplay(internalEnd)}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="px-3.5 py-1.5 rounded-lg bg-white border border-orange-200 text-center shadow-2xs">
                <span className="text-base font-extrabold text-[#EA580C]">
                  {durationDays}
                </span>
                <span className="text-xs font-semibold text-[#171717] ml-1.5">
                  {durationDays === 1 ? 'Day' : 'Days'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Action Footer */}
      <div className="pt-4 border-t border-[#E5E5E5] flex items-center justify-between">
        <Button variant="secondary" size="md" leftIcon={<ArrowLeft size={15} />} onClick={onBack}>
          Back
        </Button>

        <Button
          variant="primary"
          size="md"
          rightIcon={<ArrowRight size={15} />}
          disabled={!isValid}
          onClick={onContinue}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default BookingDatesStep;
