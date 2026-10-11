import React from 'react';
import { AVAILABILITY_STATE_CONFIG, APPROVED_AVAILABILITY_STATES, AvailabilityState } from '../../types/availability';

export interface AvailabilityLegendProps {
  selectedStateFilter?: string;
  onSelectStateFilter?: (state: string) => void;
  className?: string;
}

export const AvailabilityLegend: React.FC<AvailabilityLegendProps> = ({
  selectedStateFilter = 'ALL',
  onSelectStateFilter,
  className = '',
}) => {
  return (
    <div
      className={`bg-white rounded-xl p-3.5 border border-[#E5E5E5] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs ${className}`}
    >
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373]">
          Availability States:
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {APPROVED_AVAILABILITY_STATES.map((state: AvailabilityState) => {
          const config = AVAILABILITY_STATE_CONFIG[state];
          const isSelected = selectedStateFilter === state;

          return (
            <button
              key={state}
              type="button"
              onClick={() => onSelectStateFilter && onSelectStateFilter(isSelected ? 'ALL' : state)}
              title={`${state}: ${config.meaning}`}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all border cursor-pointer ${
                config.badgeBg
              } ${config.badgeText} ${config.badgeBorder} ${
                isSelected ? 'ring-2 ring-[#EA580C] ring-offset-1 font-bold' : 'hover:opacity-90'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${config.indicatorBg}`} />
              <span>{state}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AvailabilityLegend;
