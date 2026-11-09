import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed select-none rounded-md';

  const sizeStyles = {
    sm: 'h-8 px-2.5 text-xs gap-1.5',
    md: 'h-9 px-3.5 text-sm gap-2',
    lg: 'h-10 px-4 text-base gap-2.5',
  };

  const variantStyles = {
    primary:
      'bg-[#1A2435] text-white hover:bg-[#121A26] active:bg-[#0C121B] focus:ring-[#1A2435]/30 shadow-xs border border-transparent',
    accent:
      'bg-[#E11D2E] text-white hover:bg-[#C51323] active:bg-[#A50E1B] focus:ring-[#E11D2E]/30 shadow-xs border border-transparent',
    secondary:
      'bg-white text-[#1A2435] hover:bg-[#F4F6F8] active:bg-[#E2E8F0] border border-[#CBD5E1] focus:ring-[#E11D2E]/20 shadow-xs',
    outline:
      'bg-transparent text-[#1A2435] hover:bg-[#F4F6F8] border border-[#CBD5E1] focus:ring-[#E11D2E]/20',
    ghost:
      'bg-transparent text-[#475569] hover:bg-[#F4F6F8] hover:text-[#1A2435] focus:ring-neutral-200 border border-transparent',
    destructive:
      'bg-[#E11D2E] text-white hover:bg-[#C51323] active:bg-[#A50E1B] focus:ring-[#E11D2E]/30 shadow-xs border border-transparent',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg
          className="animate-spin -ml-0.5 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : (
        leftIcon
      )}
      {children}
      {!isLoading && rightIcon}
    </button>
  );
};

export default Button;
