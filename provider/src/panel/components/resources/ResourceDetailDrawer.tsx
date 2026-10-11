import React from 'react';
import { Link } from 'react-router-dom';
import {
  Layers,
  MapPin,
  Calendar,
  Edit,
  IndianRupee,
  Share2,
  Image as ImageIcon,
} from 'lucide-react';
import Drawer from '../../../components/ui/Drawer';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import { AdvertisingResource } from '../../types/resource';

export interface ResourceDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  resource: AdvertisingResource | null;
  onEdit: (resource: AdvertisingResource) => void;
  onToggleMarketplace: (resourceId: string, currentVal: boolean) => void;
}

export const ResourceDetailDrawer: React.FC<ResourceDetailDrawerProps> = ({
  isOpen,
  onClose,
  resource,
  onEdit,
  onToggleMarketplace,
}) => {
  if (!resource) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <Badge variant="active">Active</Badge>;
      case 'Inactive':
        return <Badge variant="inactive">Inactive</Badge>;
      case 'Archived':
        return <Badge variant="pending">Archived</Badge>;
      default:
        return <Badge variant="inactive">{status}</Badge>;
    }
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-md bg-orange-50 text-[#EA580C] flex items-center justify-center">
            <Layers size={18} />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold text-[#171717]">{resource.name}</span>
            <span className="text-[11px] text-[#737373]">
              {resource.type} • {resource.location.city}
            </span>
          </div>
        </div>
      }
      width="max-w-2xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Link to="/panel/availability">
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<Calendar size={14} className="text-[#EA580C]" />}
              >
                View Availability
              </Button>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Edit size={14} />}
              onClick={() => onEdit(resource)}
            >
              Edit
            </Button>
            <Button variant="primary" size="sm" onClick={onClose}>
              Done
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Visual Media Header Card */}
        <div className="rounded-xl overflow-hidden border border-[#E5E5E5] bg-[#FAFAF9]">
          {resource.mediaUrl ? (
            <div className="relative h-48 w-full bg-stone-900">
              <img
                src={resource.mediaUrl}
                alt={resource.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <div className="absolute top-3 right-3 flex items-center gap-2">
                {getStatusBadge(resource.status)}
              </div>
            </div>
          ) : (
            <div className="h-36 flex flex-col items-center justify-center text-center p-6 bg-gradient-to-b from-stone-50 to-stone-100/80">
              <div className="w-10 h-10 rounded-full bg-white border border-[#E5E5E5] text-[#737373] flex items-center justify-center mb-2 shadow-2xs">
                <ImageIcon size={18} />
              </div>
              <span className="text-xs font-semibold text-[#171717]">{resource.type} Static Display</span>
              <span className="text-[11px] text-[#737373] mt-0.5">No photograph uploaded</span>
              <div className="mt-2.5">{getStatusBadge(resource.status)}</div>
            </div>
          )}

          {/* Quick Specifications Strip */}
          <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white border-t border-[#E5E5E5] text-xs">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373]">
                Dimensions
              </span>
              <span className="font-mono font-bold text-[#171717] mt-0.5">
                {resource.widthFt}′ × {resource.heightFt}′
              </span>
              <span className="text-[11px] font-mono text-[#737373]">{resource.totalSqFt} sq.ft</span>
            </div>

            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373]">
                Illumination
              </span>
              <span className="font-semibold text-[#171717] mt-0.5">{resource.illumination}</span>
              <span className="text-[11px] text-[#737373]">Static night display</span>
            </div>

            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373]">
                Facing
              </span>
              <span className="font-semibold text-[#171717] mt-0.5">{resource.visibilityFacing}</span>
              <span className="text-[11px] text-[#737373]">{resource.orientation}</span>
            </div>

            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373]">
                Marketplace
              </span>
              <span className="font-semibold text-[#171717] mt-0.5">
                {resource.marketplaceParticipation ? 'Participating' : 'Off'}
              </span>
              <span className="text-[11px] text-[#737373]">
                {resource.marketplaceParticipation ? 'Discovery Active' : 'Private'}
              </span>
            </div>
          </div>
        </div>

        {/* Section 1: Location Details */}
        <div className="bg-white rounded-xl p-5 border border-[#E5E5E5] shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#E5E5E5]">
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-[#EA580C]" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#171717]">
                Location (Supporting Metadata)
              </h4>
            </div>
            <span className="text-[11px] font-mono text-[#737373]">
              ID: {resource.location.id}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-[#737373] block text-[11px]">Site Name</span>
              <span className="font-bold text-[#171717] text-sm mt-0.5 block">
                {resource.location.name}
              </span>
            </div>

            <div>
              <span className="text-[#737373] block text-[11px]">City / Area</span>
              <span className="font-semibold text-[#171717] mt-0.5 block">
                {resource.location.city}, {resource.location.area}
              </span>
            </div>

            {resource.location.landmark && (
              <div className="sm:col-span-2">
                <span className="text-[#737373] block text-[11px]">Landmark Reference</span>
                <span className="text-[#171717] mt-0.5 block">
                  {resource.location.landmark}
                </span>
              </div>
            )}

            {(resource.location.latitude || resource.location.longitude) && (
              <div className="sm:col-span-2">
                <span className="text-[#737373] block text-[11px]">GIS Coordinates</span>
                <span className="font-mono text-[11px] text-[#525252] mt-0.5 block">
                  {resource.location.latitude || '—'} , {resource.location.longitude || '—'}
                </span>
              </div>
            )}

            {resource.location.latitude && resource.location.longitude && (
              <div className="sm:col-span-2 pt-1">
                <span className="text-[#737373] block text-[11px] mb-1.5 font-semibold">
                  OpenStreetMap Visual Site Locator
                </span>
                <div className="relative w-full h-36 rounded-lg overflow-hidden border border-[#E5E5E5] bg-[#FAFAF9]">
                  <iframe
                    title="Resource OpenStreetMap Location"
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${
                      parseFloat(resource.location.longitude) - 0.008
                    }%2C${
                      parseFloat(resource.location.latitude) - 0.008
                    }%2C${
                      parseFloat(resource.location.longitude) + 0.008
                    }%2C${
                      parseFloat(resource.location.latitude) + 0.008
                    }&layer=mapnik&marker=${resource.location.latitude}%2C${resource.location.longitude}`}
                    className="w-full h-full border-0"
                    loading="lazy"
                  />
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-[#171717]/85 text-white text-[10px] font-mono">
                    {resource.location.latitude}° N, {resource.location.longitude}° E
                  </div>
                  <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-white/90 text-[#737373] text-[9px] font-mono border border-[#E5E5E5]">
                    © OpenStreetMap
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section 2: Commercial Pricing Structure */}
        <div className="bg-white rounded-xl p-5 border border-[#E5E5E5] shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#E5E5E5]">
            <div className="flex items-center gap-2">
              <IndianRupee size={16} className="text-[#EA580C]" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#171717]">
                Commercial Pricing
              </h4>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3 rounded-lg bg-[#FAFAF9] border border-[#E5E5E5]">
              <span className="text-[11px] font-semibold text-[#737373] block">
                Customer Reference Price
              </span>
              <span className="text-lg font-mono font-extrabold text-[#171717] mt-1 block">
                {resource.customerPrice !== null
                  ? `₹${resource.customerPrice.toLocaleString('en-IN')}`
                  : '—'}
              </span>
              <span className="text-[10px] text-[#737373] mt-0.5 block">
                Direct client catalog pricing
              </span>
            </div>

            <div className="p-3 rounded-lg bg-[#FAFAF9] border border-[#E5E5E5]">
              <span className="text-[11px] font-semibold text-[#737373] block">
                SODAARS Settlement Price
              </span>
              <span className="text-lg font-mono font-extrabold text-[#171717] mt-1 block">
                {resource.sodaarsPrice !== null
                  ? `₹${resource.sodaarsPrice.toLocaleString('en-IN')}`
                  : '—'}
              </span>
              <span className="text-[10px] text-[#737373] mt-0.5 block">
                Net settlement basis supplied to SODAARS
              </span>
            </div>
          </div>

          <p className="text-[11px] text-[#737373] leading-relaxed pt-1">
            Note: SODAARS does not impose hardcoded marketplace markups or commissions on direct provider assets. Commercial settlement adheres strictly to the provider agreement.
          </p>
        </div>

        {/* Section 3: Marketplace Participation */}
        <div className="bg-white rounded-xl p-5 border border-[#E5E5E5] shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#E5E5E5]">
            <div className="flex items-center gap-2">
              <Share2 size={16} className="text-[#EA580C]" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#171717]">
                Marketplace Participation
              </h4>
            </div>
            <button
              onClick={() =>
                onToggleMarketplace(resource.id, resource.marketplaceParticipation)
              }
              className="text-xs font-semibold text-[#EA580C] hover:underline cursor-pointer"
            >
              Toggle Status
            </button>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-lg bg-[#FAFAF9] border border-[#E5E5E5]">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-[#171717]">
                Participation Status:{' '}
                {resource.marketplaceParticipation ? (
                  <span className="text-emerald-700">Active (Discoverable)</span>
                ) : (
                  <span className="text-stone-500">Disabled (Private)</span>
                )}
              </span>
              <span className="text-xs text-[#525252] mt-0.5">
                {resource.marketplaceParticipation
                  ? 'Eligible for discovery by media buyers across SODAARS public search.'
                  : 'Hidden from public marketplace discovery.'}
              </span>
            </div>
            <span
              className={`w-3 h-3 rounded-full ${
                resource.marketplaceParticipation ? 'bg-emerald-500' : 'bg-stone-300'
              }`}
            />
          </div>

          <div className="p-3 rounded-lg bg-amber-50/60 border border-amber-200/60 text-xs text-amber-900 leading-relaxed">
            <strong>Boundary Rule:</strong> Marketplace Participation ≠ Availability. A resource may participate in the marketplace while being unavailable for specific booking dates. Manage dates in the Availability Engine.
          </div>
        </div>

        {/* Section 4: Description */}
        {resource.description && (
          <div className="bg-white rounded-xl p-5 border border-[#E5E5E5] shadow-xs space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#171717]">
              Description
            </h4>
            <p className="text-xs text-[#525252] leading-relaxed whitespace-pre-line">
              {resource.description}
            </p>
          </div>
        )}
      </div>
    </Drawer>
  );
};

export default ResourceDetailDrawer;
