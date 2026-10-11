import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
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
      'bg-[#F97316] text-white hover:bg-[#EA580C] active:bg-[#C2410C] focus:ring-[#F97316]/30 shadow-xs border border-transparent',
    secondary:
      'bg-white text-[#171717] hover:bg-[#F5F5F4] active:bg-[#E5E5E5] border border-[#E5E5E5] focus:ring-[#F97316]/20 shadow-xs',
    outline:
      'bg-transparent text-[#171717] hover:bg-[#F5F5F4] border border-[#E5E5E5] focus:ring-[#F97316]/20',
    ghost:
      'bg-transparent text-[#525252] hover:bg-[#F5F5F4] hover:text-[#171717] focus:ring-neutral-200 border border-transparent',
    destructive:
      'bg-[#DC2626] text-white hover:bg-[#B91C1C] active:bg-[#991B1B] focus:ring-red-500/30 shadow-xs border border-transparent',
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
