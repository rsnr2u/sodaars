import React from 'react';
import {
  Layers,
  CheckCircle2,
  PieChart,
  ShieldCheck,
  Check,
} from 'lucide-react';

export type OccupationFilterType = 'ALL' | 'AVAILABLE' | 'PARTIAL' | 'FULL';

export interface OccupationStatusCardsProps {
  totalActiveCount: number;
  availableCount: number;
  partialCount: number;
  fullCount: number;
  activeFilter: OccupationFilterType;
  onFilterChange: (filter: OccupationFilterType) => void;
  overallOccupancyRate: number; // e.g. 58%
}

export const OccupationStatusCards: React.FC<OccupationStatusCardsProps> = ({
  totalActiveCount,
  availableCount,
  partialCount,
  fullCount,
  activeFilter,
  onFilterChange,
  overallOccupancyRate,
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
      {/* 1. TOTAL ACTIVE INVENTORY */}
      <div
        onClick={() => onFilterChange('ALL')}
        className={`bg-white rounded-xl p-4 border transition-all cursor-pointer flex flex-col justify-between select-none ${
          activeFilter === 'ALL'
            ? 'border-[#EA580C] ring-2 ring-[#EA580C] shadow-xs bg-orange-50/15'
            : 'border-[#E5E5E5] hover:border-orange-200 hover:shadow-xs'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373] flex items-center gap-1">
            <Layers size={12} className="text-[#EA580C]" />
            Total Active Inventory
          </span>
          {activeFilter === 'ALL' ? (
            <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-orange-50 text-[#EA580C] border border-orange-200 flex items-center gap-0.5">
              <Check size={9} /> Showing All
            </span>
          ) : (
            <span className="text-[9px] font-mono text-[#737373] bg-[#FAFAF9] px-1.5 py-0.5 rounded border border-[#E5E5E5]">
              Click to View All
            </span>
          )}
        </div>

        <div className="my-2.5 flex items-baseline gap-2">
          <span className="text-2xl font-extrabold text-[#171717] leading-none">
            {totalActiveCount}
          </span>
          <span className="text-xs text-[#737373]">
            {totalActiveCount === 1 ? 'Display' : 'Displays'}
          </span>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] text-[#737373]">
            <span>Portfolio Load:</span>
            <span className="font-semibold text-[#171717]">{overallOccupancyRate}% Booked</span>
          </div>
          <div className="w-full bg-[#E5E5E5] h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                overallOccupancyRate === 100
                  ? 'bg-emerald-600'
                  : overallOccupancyRate >= 30
                  ? 'bg-amber-500'
                  : 'bg-rose-500'
              }`}
              style={{ width: `${overallOccupancyRate}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. AVAILABLE (100% FREE) */}
      <div
        onClick={() => onFilterChange(activeFilter === 'AVAILABLE' ? 'ALL' : 'AVAILABLE')}
        className={`bg-white rounded-xl p-4 border transition-all cursor-pointer flex flex-col justify-between select-none ${
          activeFilter === 'AVAILABLE'
            ? 'border-emerald-600 ring-2 ring-emerald-600 shadow-xs bg-emerald-50/20'
            : 'border-[#E5E5E5] hover:border-emerald-300 hover:shadow-xs'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1">
            <CheckCircle2 size={12} className="text-emerald-600" />
            Available (Free)
          </span>
          <span
            className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded border ${
              activeFilter === 'AVAILABLE'
                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
            }`}
          >
            {activeFilter === 'AVAILABLE' ? 'Active Filter' : '100% Free'}
          </span>
        </div>

        <div className="my-2.5 flex items-baseline gap-2">
          <span className="text-2xl font-extrabold text-emerald-700 leading-none">
            {availableCount}
          </span>
          <span className="text-xs text-emerald-800 font-medium">
            {availableCount === 1 ? 'Display Free' : 'Displays Free'}
          </span>
        </div>

        <span className="text-[11px] text-[#737373]">
          0 days booked across selected dates • Ready to pitch
        </span>
      </div>

      {/* 3. PARTIALLY OCCUPIED */}
      <div
        onClick={() => onFilterChange(activeFilter === 'PARTIAL' ? 'ALL' : 'PARTIAL')}
        className={`bg-white rounded-xl p-4 border transition-all cursor-pointer flex flex-col justify-between select-none ${
          activeFilter === 'PARTIAL'
            ? 'border-amber-500 ring-2 ring-amber-500 shadow-xs bg-amber-50/20'
            : 'border-[#E5E5E5] hover:border-amber-300 hover:shadow-xs'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1">
            <PieChart size={12} className="text-amber-600" />
            Partially Occupied
          </span>
          <span
            className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded border ${
              activeFilter === 'PARTIAL'
                ? 'bg-amber-100 text-amber-900 border-amber-300'
                : 'bg-amber-50 text-amber-800 border-amber-200'
            }`}
          >
            {activeFilter === 'PARTIAL' ? 'Active Filter' : 'Open Slots'}
          </span>
        </div>

        <div className="my-2.5 flex items-baseline gap-2">
          <span className="text-2xl font-extrabold text-amber-800 leading-none">
            {partialCount}
          </span>
          <span className="text-xs text-amber-800 font-medium">
            {partialCount === 1 ? 'Display' : 'Displays'}
          </span>
        </div>

        <span className="text-[11px] text-[#737373]">
          Has open days to sell in this date window
        </span>
      </div>

      {/* 4. FULLY OCCUPIED */}
      <div
        onClick={() => onFilterChange(activeFilter === 'FULL' ? 'ALL' : 'FULL')}
        className={`bg-white rounded-xl p-4 border transition-all cursor-pointer flex flex-col justify-between select-none ${
          activeFilter === 'FULL'
            ? 'border-[#171717] ring-2 ring-[#171717] shadow-xs bg-stone-100/50'
            : 'border-[#E5E5E5] hover:border-stone-400 hover:shadow-xs'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#171717] flex items-center gap-1">
            <ShieldCheck size={12} className="text-emerald-700" />
            Fully Occupied
          </span>
          <span
            className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded border ${
              activeFilter === 'FULL'
                ? 'bg-[#171717] text-white border-[#171717]'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
            }`}
          >
            {activeFilter === 'FULL' ? 'Active Filter' : '100% Booked'}
          </span>
        </div>

        <div className="my-2.5 flex items-baseline gap-2">
          <span className="text-2xl font-extrabold text-[#171717] leading-none">
            {fullCount}
          </span>
          <span className="text-xs text-[#737373]">
            {fullCount === 1 ? 'Display' : 'Displays'}
          </span>
        </div>

        <span className="text-[11px] text-[#737373]">
          0 days available • 100% revenue realized
        </span>
      </div>
    </div>
  );
};

export default OccupationStatusCards;
