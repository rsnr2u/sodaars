import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: string;
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  width = 'max-w-xl',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={`relative z-10 w-full ${width} h-full bg-white border-l border-[#E5E5E5] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 ease-out`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E5E5] bg-[#FAFAF9]/60">
            <h3 className="text-base font-semibold text-[#171717]">{title}</h3>
            <button
              onClick={onClose}
              className="p-1 rounded-sm text-[#737373] hover:text-[#171717] hover:bg-[#F5F5F4] transition-colors"
              aria-label="Close drawer"
            >
              <X size={18} />
            </button>
          </div>
        )}
        <div className="flex-1 p-6 overflow-y-auto">{children}</div>
        {footer && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#E5E5E5] bg-[#FAFAF9]/60">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Drawer;
