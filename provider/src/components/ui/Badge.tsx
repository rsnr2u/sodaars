import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'active' | 'pending' | 'blocked' | 'error' | 'inactive' | 'brand';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'inactive',
  size = 'sm',
  className = '',
}) => {
  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-medium',
  };

  const variantStyles = {
    active: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    pending: 'bg-amber-50 text-amber-700 border border-amber-200',
    blocked: 'bg-orange-50 text-orange-700 border border-orange-200',
    error: 'bg-rose-50 text-rose-700 border border-rose-200',
    inactive: 'bg-stone-100 text-stone-700 border border-stone-200',
    brand: 'bg-orange-50 text-[#F97316] border border-orange-200',
  };

  return (
    <span
      className={`inline-flex items-center justify-center rounded-sm tracking-wide ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
