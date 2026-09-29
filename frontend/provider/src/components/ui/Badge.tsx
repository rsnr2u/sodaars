import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'orange';
  className?: string;
  style?: React.CSSProperties;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  className = '',
  style,
  icon,
}) => {
  return (
    <span className={`badge badge-${variant} ${className}`} style={style}>
      {icon}
      <span>{children}</span>
    </span>
  );
};

export default Badge;
