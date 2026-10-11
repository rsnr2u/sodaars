import React from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  RotateCcw,
} from 'lucide-react';
import Button from '../../../components/ui/Button';

export type DatePreset = 'current-month' | 'current-week' | 'next-month' | 'custom';

export interface InventoryDateOccupationBarProps {
  preset: DatePreset;
  onPresetChange: (preset: DatePreset) => void;
  startDate: string;
  endDate: string;
  onCustomDateChange: (start: string, end: string) => void;
  onStepDate: (direction: 'prev' | 'next') => void;
  onResetToCurrentMonth: () => void;
  totalDays: number;
}

export const InventoryDateOccupationBar: React.FC<InventoryDateOccupationBarProps> = ({
  preset,
  onPresetChange,
  startDate,
  endDate,
  onCustomDateChange,
  onStepDate,
  onResetToCurrentMonth,
  totalDays,
}) => {
  // Format dates for friendly display e.g. "01 Oct 2026"
  const formatDateFriendly = (dateStr: string) => {
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
    <div className="bg-white rounded-xl p-3.5 sm:p-4 border border-[#E5E5E5] shadow-xs space-y-3">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Left: Label & Preset Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#171717] mr-1">
            <span className="w-7 h-7 rounded-lg bg-orange-50 border border-orange-200 text-[#EA580C] flex items-center justify-center">
              <CalendarIcon size={14} />
            </span>
            <span className="hidden sm:inline">Occupation Period:</span>
            <span className="sm:hidden">Period:</span>
          </div>

          {/* Quick Presets */}
          <div className="inline-flex items-center p-0.5 rounded-lg bg-[#FAFAF9] border border-[#E5E5E5] text-xs">
            <button
              type="button"
              onClick={() => onPresetChange('current-month')}
              className={`px-3 py-1.5 rounded-md font-semibold text-xs transition-colors cursor-pointer ${
                preset === 'current-month'
                  ? 'bg-white text-[#EA580C] shadow-xs border border-[#E5E5E5]'
                  : 'text-[#737373] hover:text-[#171717]'
              }`}
            >
              Current Month
            </button>

            <button
              type="button"
              onClick={() => onPresetChange('current-week')}
              className={`px-3 py-1.5 rounded-md font-semibold text-xs transition-colors cursor-pointer ${
                preset === 'current-week'
                  ? 'bg-white text-[#EA580C] shadow-xs border border-[#E5E5E5]'
                  : 'text-[#737373] hover:text-[#171717]'
              }`}
            >
              Current Week
            </button>

            <button
              type="button"
              onClick={() => onPresetChange('next-month')}
              className={`px-3 py-1.5 rounded-md font-semibold text-xs transition-colors cursor-pointer ${
                preset === 'next-month'
                  ? 'bg-white text-[#EA580C] shadow-xs border border-[#E5E5E5]'
                  : 'text-[#737373] hover:text-[#171717]'
              }`}
            >
              Next Month
            </button>

            <button
              type="button"
              onClick={() => onPresetChange('custom')}
              className={`px-3 py-1.5 rounded-md font-semibold text-xs transition-colors cursor-pointer ${
                preset === 'custom'
                  ? 'bg-white text-[#EA580C] shadow-xs border border-[#E5E5E5]'
                  : 'text-[#737373] hover:text-[#171717]'
              }`}
            >
              Custom Range
            </button>
          </div>

          {/* Prev / Next Step Arrows */}
          <div className="inline-flex items-center gap-0.5 ml-1">
            <button
              type="button"
              onClick={() => onStepDate('prev')}
              title="Previous Period"
              className="w-7 h-7 rounded-md border border-[#E5E5E5] bg-[#FAFAF9] hover:bg-white text-[#525252] hover:text-[#171717] flex items-center justify-center transition-colors cursor-pointer"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              type="button"
              onClick={() => onStepDate('next')}
              title="Next Period"
              className="w-7 h-7 rounded-md border border-[#E5E5E5] bg-[#FAFAF9] hover:bg-white text-[#525252] hover:text-[#171717] flex items-center justify-center transition-colors cursor-pointer"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* Right: Date Range Indicator & Quick Reset */}
        <div className="flex flex-wrap items-center gap-2">
          {preset === 'custom' ? (
            <div className="flex items-center gap-2 bg-[#FAFAF9] p-1 rounded-lg border border-[#E5E5E5]">
              <div className="flex items-center gap-1.5 text-xs text-[#737373] px-1">
                <span>Start:</span>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => onCustomDateChange(e.target.value, endDate)}
                  className="bg-white border border-[#E5E5E5] rounded px-2 py-0.5 text-xs text-[#171717] focus:outline-none focus:border-[#EA580C]"
                />
              </div>
              <span className="text-[#737373] text-xs">→</span>
              <div className="flex items-center gap-1.5 text-xs text-[#737373] px-1">
                <span>End:</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => onCustomDateChange(startDate, e.target.value)}
                  className="bg-white border border-[#E5E5E5] rounded px-2 py-0.5 text-xs text-[#171717] focus:outline-none focus:border-[#EA580C]"
                />
              </div>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50/70 border border-orange-200 text-xs">
              <Clock size={12} className="text-[#EA580C]" />
              <span className="font-semibold text-[#171717]">
                {formatDateFriendly(startDate)} → {formatDateFriendly(endDate)}
              </span>
              <span className="font-mono text-[11px] text-[#EA580C] bg-white px-1.5 py-0.5 rounded border border-orange-200">
                {totalDays} {totalDays === 1 ? 'Day' : 'Days'}
              </span>
            </div>
          )}

          {preset !== 'current-month' && (
            <Button
              variant="outline"
              size="sm"
              leftIcon={<RotateCcw size={12} />}
              onClick={onResetToCurrentMonth}
              className="text-xs h-7.5 border-[#E5E5E5] text-[#525252] hover:text-[#171717]"
            >
              Reset to Current Month
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default InventoryDateOccupationBar;
