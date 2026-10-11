import React, { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftElement, rightElement, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-xs font-semibold text-[#171717] tracking-tight">
            {label}
            {props.required && <span className="text-[#DC2626] ml-0.5">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          {leftElement && (
            <div className="absolute left-3 text-[#737373] pointer-events-none flex items-center">
              {leftElement}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={`w-full h-9 rounded-md bg-white border text-sm text-[#171717] placeholder:text-[#A3A3A3] transition-colors focus:outline-none ${
              leftElement ? 'pl-9' : 'pl-3'
            } ${rightElement ? 'pr-9' : 'pr-3'} ${
              error
                ? 'border-[#DC2626] focus:border-[#DC2626] focus:ring-1 focus:ring-[#DC2626]'
                : 'border-[#E5E5E5] focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]'
            } disabled:bg-[#F5F5F4] disabled:text-[#A3A3A3] disabled:cursor-not-allowed shadow-xs ${className}`}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-3 text-[#737373] flex items-center">
              {rightElement}
            </div>
          )}
        </div>
        {error && <p className="text-xs text-[#DC2626] font-medium">{error}</p>}
        {helperText && !error && <p className="text-xs text-[#737373]">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
