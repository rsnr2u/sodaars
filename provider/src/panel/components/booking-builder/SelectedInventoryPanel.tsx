import React from 'react';
import { ArrowRight, ArrowLeft, Layers, X } from 'lucide-react';
import Button from '../../../components/ui/Button';
import { AdvertisingResource } from '../../types/resource';

export interface SelectedInventoryPanelProps {
  selectedResources: AdvertisingResource[];
  onRemoveResource: (resourceId: string) => void;
  onContinue: () => void;
  onBack: () => void;
}

export const SelectedInventoryPanel: React.FC<SelectedInventoryPanelProps> = ({
  selectedResources,
  onRemoveResource,
  onContinue,
  onBack,
}) => {
  // Calculate Subtotal and Total strictly from customer prices
  const subtotal = selectedResources.reduce((acc, r) => {
    return acc + (r.customerPrice || 0);
  }, 0);

  const formattedSubtotal = `₹${subtotal.toLocaleString('en-IN')}`;

  return (
    <div className="bg-white rounded-xl border border-[#E5E5E5] p-5 shadow-xs space-y-5 sticky top-20 flex flex-col justify-between">
      <div className="space-y-4">
        {/* Panel Header */}
        <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#EA580C]">
              Step 03 — Cart
            </span>
            <h3 className="text-sm font-bold text-[#171717]">
              SELECTED INVENTORY
            </h3>
          </div>

          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-orange-50 text-[#EA580C] border border-orange-200">
            {selectedResources.length} {selectedResources.length === 1 ? 'Resource' : 'Resources'} Selected
          </span>
        </div>

        {/* Selected Items List */}
        {selectedResources.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#E5E5E5] bg-[#FAFAF9] p-6 text-center space-y-2">
            <Layers size={24} className="mx-auto text-[#737373]" />
            <p className="text-xs font-bold text-[#171717]">
              No inventory selected yet
            </p>
            <p className="text-[11px] text-[#737373] leading-relaxed">
              Browse available outdoor displays on the left and click &quot;+ Add&quot; to include them in this booking.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
            {selectedResources.map((res) => (
              <div
                key={res.id}
                className="p-3 rounded-lg border border-[#E5E5E5] bg-[#FAFAF9] hover:bg-white transition-colors flex items-start justify-between gap-3 text-xs"
              >
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h5 className="font-bold text-[#171717] truncate">
                      {res.name}
                    </h5>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-white border border-[#E5E5E5] text-[#525252] shrink-0 font-medium">
                      {res.type}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-[#737373]">
                    <span className="truncate">
                      {res.location.city} {res.location.area ? `(${res.location.area})` : ''}
                    </span>
                    <span>•</span>
                    <span className="font-mono">
                      {res.widthFt} × {res.heightFt} ft
                    </span>
                  </div>

                  <div className="pt-0.5">
                    <span className="font-extrabold text-[#171717] text-xs">
                      {res.customerPrice !== null && res.customerPrice !== undefined
                        ? `₹${res.customerPrice.toLocaleString('en-IN')}`
                        : '—'}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onRemoveResource(res.id)}
                  className="text-[#737373] hover:text-rose-600 p-1 rounded hover:bg-rose-50 transition-colors"
                  title="Remove resource"
                  aria-label={`Remove ${res.name}`}
                >
                  <X size={15} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Pricing Summary */}
        <div className="pt-3 border-t border-[#E5E5E5] space-y-2 text-xs">
          <div className="flex items-center justify-between text-[#525252]">
            <span>Subtotal</span>
            <span className="font-bold text-[#171717]">
              {selectedResources.length > 0 ? formattedSubtotal : '₹0'}
            </span>
          </div>

          <div className="flex items-center justify-between text-[#737373]">
            <span>Adjustment</span>
            <span>—</span>
          </div>

          <div className="pt-2 border-t border-[#F5F5F4] flex items-center justify-between">
            <span className="font-bold text-sm text-[#171717]">Total</span>
            <span className="font-extrabold text-base text-[#EA580C]">
              {selectedResources.length > 0 ? formattedSubtotal : '₹0'}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-4 border-t border-[#E5E5E5] flex items-center gap-2">
        <Button
          variant="secondary"
          size="md"
          leftIcon={<ArrowLeft size={14} />}
          onClick={onBack}
          className="flex-1"
        >
          Back
        </Button>

        <Button
          variant="primary"
          size="md"
          rightIcon={<ArrowRight size={14} />}
          disabled={selectedResources.length === 0}
          onClick={onContinue}
          className="flex-[2] justify-center"
        >
          Continue to Review
        </Button>
      </div>
    </div>
  );
};

export default SelectedInventoryPanel;
