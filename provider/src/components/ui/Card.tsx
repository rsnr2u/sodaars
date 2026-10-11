import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  header,
  footer,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`bg-white border border-[#E5E5E5] rounded-lg shadow-xs overflow-hidden ${className}`}
      {...props}
    >
      {header && (
        <div className="px-5 py-4 border-b border-[#E5E5E5] bg-[#FAFAF9]/50">
          {header}
        </div>
      )}
      <div className="p-5">{children}</div>
      {footer && (
        <div className="px-5 py-3 border-t border-[#E5E5E5] bg-[#FAFAF9]/50">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
