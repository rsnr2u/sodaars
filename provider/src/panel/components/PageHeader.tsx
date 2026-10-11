import React from 'react';

export interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  eyebrow,
  title,
  description,
  actions,
}) => {
  return (
    <div className="bg-white border-b border-[#E5E5E5] py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          {/* Eyebrow */}
          {eyebrow && (
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#EA580C] block mb-1">
              {eyebrow}
            </span>
          )}

          {/* Page Title & Subtitle */}
          <h1 className="text-xl sm:text-2xl font-bold text-[#171717] tracking-tight">{title}</h1>
          {description && <p className="text-xs text-[#525252] mt-0.5">{description}</p>}
        </div>

        {/* Action Buttons Slot */}
        {actions && <div className="flex items-center gap-2.5 shrink-0">{actions}</div>}
      </div>
    </div>
  );
};

export default PageHeader;
