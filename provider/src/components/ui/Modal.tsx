import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  maxWidth = 'max-w-lg',
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className={`w-full ${maxWidth} bg-white rounded-lg border border-[#E5E5E5] shadow-lg overflow-hidden flex flex-col`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {title && (
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E5E5] bg-[#FAFAF9]/50">
            <h3 className="text-base font-semibold text-[#171717]">{title}</h3>
            <button
              onClick={onClose}
              className="p-1 rounded-sm text-[#737373] hover:text-[#171717] hover:bg-[#F5F5F4] transition-colors"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
          </div>
        )}
        <div className="p-5 overflow-y-auto max-h-[80vh]">{children}</div>
        {footer && (
          <div className="flex items-center justify-end gap-3 px-5 py-3 border-t border-[#E5E5E5] bg-[#FAFAF9]/50">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
