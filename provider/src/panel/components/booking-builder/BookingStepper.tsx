import React from 'react';
import { Check } from 'lucide-react';

export interface BookingStepperProps {
  currentStep: number; // 1, 2, 3, 4
  onStepClick?: (step: number) => void;
}

export const BOOKING_STEPS = [
  { step: 1, number: '01', title: 'Customer' },
  { step: 2, number: '02', title: 'Booking Dates' },
  { step: 3, number: '03', title: 'Select Inventory' },
  { step: 4, number: '04', title: 'Review & Create' },
];

export const BookingStepper: React.FC<BookingStepperProps> = ({
  currentStep,
  onStepClick,
}) => {
  return (
    <div className="w-full bg-white border border-[#E5E5E5] rounded-xl p-3 sm:p-4 shadow-xs">
      <nav aria-label="Booking Creation Progress">
        <ol className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
          {BOOKING_STEPS.map((s) => {
            const isCompleted = s.step < currentStep;
            const isCurrent = s.step === currentStep;
            const isClickable = isCompleted && onStepClick;

            return (
              <li
                key={s.step}
                onClick={() => {
                  if (isClickable) onStepClick(s.step);
                }}
                className={`flex items-center gap-2.5 p-2 rounded-lg transition-all ${
                  isCurrent
                    ? 'bg-orange-50/70 border border-orange-200'
                    : isCompleted
                    ? 'bg-[#FAFAF9] border border-[#E5E5E5] cursor-pointer hover:border-orange-200'
                    : 'bg-[#FAFAF9]/60 border border-transparent opacity-60'
                }`}
              >
                {/* Step indicator circle / icon */}
                <div
                  className={`w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                    isCurrent
                      ? 'bg-[#EA580C] text-white shadow-xs'
                      : isCompleted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#E5E5E5] text-[#737373]'
                  }`}
                >
                  {isCompleted ? <Check size={14} strokeWidth={2.5} /> : s.number}
                </div>

                {/* Step title */}
                <div className="min-w-0 flex-1">
                  <span
                    className={`block text-[10px] font-mono font-bold uppercase tracking-wider ${
                      isCurrent
                        ? 'text-[#EA580C]'
                        : isCompleted
                        ? 'text-emerald-700'
                        : 'text-[#737373]'
                    }`}
                  >
                    Step {s.number}
                  </span>
                  <span
                    className={`block text-xs font-bold truncate ${
                      isCurrent
                        ? 'text-[#171717]'
                        : isCompleted
                        ? 'text-[#171717]'
                        : 'text-[#737373]'
                    }`}
                  >
                    {s.title}
                  </span>
                </div>
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
};

export default BookingStepper;
