import React from 'react';
import {
  Layers,
  MapPin,
  Check,
  Plus,
} from 'lucide-react';
import Button from '../../../components/ui/Button';
import { AdvertisingResource } from '../../types/resource';

export interface InventoryCardProps {
  resource: AdvertisingResource;
  isSelected: boolean;
  onToggle: (resource: AdvertisingResource) => void;
}

export const InventoryCard: React.FC<InventoryCardProps> = ({
  resource,
  isSelected,
  onToggle,
}) => {
  const formattedPrice =
    resource.customerPrice !== null && resource.customerPrice !== undefined
      ? `₹${resource.customerPrice.toLocaleString('en-IN')}`
      : 'Price on Request';

  return (
    <div
      className={`rounded-xl border transition-all p-4 flex flex-col justify-between space-y-3.5 ${
        isSelected
          ? 'border-[#EA580C] bg-orange-50/30 shadow-xs ring-1 ring-[#EA580C]'
          : 'border-[#E5E5E5] bg-white hover:border-orange-300 hover:shadow-xs'
      }`}
    >
      <div className="space-y-3">
        {/* Top Header: Image/Placeholder + Name + Type */}
        <div className="flex items-start gap-3">
          {/* Media placeholder */}
          <div className="w-14 h-14 rounded-lg bg-[#FAFAF9] border border-[#E5E5E5] overflow-hidden flex items-center justify-center shrink-0">
            {resource.mediaUrl ? (
              <img
                src={resource.mediaUrl}
                alt={resource.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <Layers size={20} className="text-[#EA580C]" />
            )}
          </div>

          {/* Name & Type */}
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex items-start justify-between gap-2">
              <h4 className="text-sm font-bold text-[#171717] leading-snug line-clamp-1">
                {resource.name}
              </h4>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Available
              </span>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-[#737373]">
              <span className="font-semibold text-[#171717] bg-[#FAFAF9] px-2 py-0.5 rounded border border-[#E5E5E5]">
                {resource.type}
              </span>
              <span className="truncate flex items-center gap-1">
                <MapPin size={11} className="text-[#737373] shrink-0" />
                {resource.location.city}
                {resource.location.area ? `, ${resource.location.area}` : ''}
              </span>
            </div>
          </div>
        </div>

        {/* Specifications Strip: Dimensions, Facing, Illumination */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-2.5 rounded-lg bg-[#FAFAF9] border border-[#E5E5E5] text-[11px] text-[#525252]">
          <div className="space-y-0.5">
            <span className="text-[9px] uppercase tracking-wider text-[#737373] font-bold block">
              Dimensions
            </span>
            <span className="font-mono font-medium text-[#171717]">
              {resource.widthFt} × {resource.heightFt} ft
            </span>
          </div>

          <div className="space-y-0.5">
            <span className="text-[9px] uppercase tracking-wider text-[#737373] font-bold block">
              Orientation
            </span>
            <span className="truncate block text-[#171717]">
              {resource.orientation}
            </span>
          </div>

          <div className="space-y-0.5 col-span-2 sm:col-span-1">
            <span className="text-[9px] uppercase tracking-wider text-[#737373] font-bold block">
              Illumination
            </span>
            <span className="truncate block text-[#171717]">
              {resource.illumination}
            </span>
          </div>
        </div>
      </div>

      {/* Pricing & Add Action */}
      <div className="pt-2 border-t border-[#F5F5F4] flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-[#737373] font-bold block">
            Customer Price
          </span>
          <span className="text-base font-extrabold text-[#171717]">
            {formattedPrice}
          </span>
        </div>

        <Button
          variant={isSelected ? 'primary' : 'outline'}
          size="sm"
          onClick={() => onToggle(resource)}
          leftIcon={isSelected ? <Check size={14} /> : <Plus size={14} />}
          className={
            isSelected
              ? 'bg-[#EA580C] hover:bg-[#C2410C] text-white border-transparent'
              : 'border-[#E5E5E5] text-[#171717] hover:border-orange-300 hover:bg-[#FAFAF9]'
          }
        >
          {isSelected ? 'Added' : 'Add'}
        </Button>
      </div>
    </div>
  );
};

export default InventoryCard;
