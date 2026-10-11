import React from 'react';
import {
  Layers,
  MapPin,
  Calendar,
  Info,
  ShieldAlert,
  Plus,
  ExternalLink,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Drawer from '../../../components/ui/Drawer';
import Button from '../../../components/ui/Button';
import {
  AvailabilityState,
  AVAILABILITY_STATE_CONFIG,
  ResourceAvailabilityItem,
} from '../../types/availability';

export interface SelectedAvailabilityCell {
  resource: ResourceAvailabilityItem;
  date: string; // YYYY-MM-DD
  formattedDate: string;
  state: AvailabilityState;
  intervalId?: string;
  bookingRef?: string;
  holdRef?: string;
}

export interface AvailabilityDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCell: SelectedAvailabilityCell | null;
  onOpenCreateBlock: (resourceId: string, date: string) => void;
  onOpenHoldDetail?: (holdInfo: {
    resourceName: string;
    resourceType: string;
    locationName: string;
    dateRange: string;
    holdRef?: string;
  }) => void;
}

export const AvailabilityDetailDrawer: React.FC<AvailabilityDetailDrawerProps> = ({
  isOpen,
  onClose,
  selectedCell,
  onOpenCreateBlock,
  onOpenHoldDetail,
}) => {
  if (!selectedCell) return null;

  const { resource, formattedDate, state, bookingRef, holdRef, date } = selectedCell;
  const stateConfig = AVAILABILITY_STATE_CONFIG[state];

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-orange-50 text-[#EA580C] flex items-center justify-center">
            <Calendar size={16} />
          </div>
          <span>Availability Inspector</span>
        </div>
      }
      width="max-w-lg"
      footer={
        <div className="flex items-center justify-between w-full">
          <span className="text-[11px] text-[#737373]">
            Date: {formattedDate}
          </span>
          <Button variant="primary" size="sm" onClick={onClose}>
            Done
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Availability State Header */}
        <div
          className={`p-4 rounded-xl border flex items-start justify-between gap-3 ${stateConfig.cellBg} ${stateConfig.cellBorder}`}
        >
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373]">
              Availability Status
            </span>
            <span className={`text-base font-extrabold ${stateConfig.cellText}`}>
              {state}
            </span>
            <p className="text-xs text-[#525252] mt-0.5 leading-relaxed">
              {stateConfig.meaning}
            </p>
          </div>
          <span className={`w-3 h-3 rounded-full mt-1 shrink-0 ${stateConfig.indicatorBg}`} />
        </div>

        {/* Resource Details Card */}
        <div className="bg-[#FAFAF9] rounded-xl p-4 border border-[#E5E5E5] space-y-3">
          <div className="border-b border-[#E5E5E5] pb-2 flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#737373]">
              Advertising Resource
            </h4>
            <Link
              to="/panel/resources"
              className="text-[11px] font-semibold text-[#EA580C] hover:underline flex items-center gap-1"
            >
              <span>View in Register</span>
              <ExternalLink size={11} />
            </Link>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2 text-[#171717]">
              <Layers size={15} className="text-[#EA580C]" />
              <span className="font-bold text-sm">{resource.name}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 text-[#737373]">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#737373] block">
                  Asset Type
                </span>
                <span className="font-semibold text-[#171717]">{resource.type}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#737373] block">
                  Location Site
                </span>
                <span className="font-semibold text-[#171717] flex items-center gap-1">
                  <MapPin size={11} className="text-[#EA580C]" />
                  {resource.location.name} ({resource.location.city})
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Date Context */}
        <div className="bg-white rounded-xl p-4 border border-[#E5E5E5] space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#737373]">
            Selected Schedule Interval
          </h4>
          <div className="flex items-center gap-2 text-sm font-semibold text-[#171717]">
            <Calendar size={15} className="text-[#737373]" />
            <span>{formattedDate}</span>
          </div>
          {bookingRef && (
            <div className="text-xs text-[#525252] pt-1">
              Booking Identifier:{' '}
              <span className="font-mono font-bold text-[#171717]">{bookingRef}</span>
            </div>
          )}
          {holdRef && (
            <div className="text-xs text-[#525252] pt-1">
              Hold Identifier:{' '}
              <span className="font-mono font-bold text-[#171717]">{holdRef}</span>
            </div>
          )}
        </div>

        {/* Marketplace Participation Context (Strict Business Rule) */}
        <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 text-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[#171717]">Marketplace Participation:</span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                resource.marketplaceParticipation
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-stone-100 text-stone-500 border border-stone-200'
              }`}
            >
              {resource.marketplaceParticipation ? 'Opted In' : 'Not Participating'}
            </span>
          </div>
          <div className="flex items-start gap-2 pt-1 text-[11px] text-[#737373] leading-relaxed">
            <Info size={13} className="shrink-0 mt-0.5 text-stone-500" />
            <p>
              <strong>Business Rule:</strong> Marketplace Participation determines whether a resource can be presented through Marketplace. Availability determines whether the resource can be considered for a particular date or date range.
            </p>
          </div>
        </div>

        {/* Contextual Actions */}
        <div className="space-y-2 pt-2">
          {state === 'Available' && (
            <Button
              type="button"
              variant="primary"
              size="md"
              leftIcon={<Plus size={15} />}
              className="w-full"
              onClick={() => {
                onClose();
                onOpenCreateBlock(resource.id, date);
              }}
            >
              Create Provider Block for this Date
            </Button>
          )}

          {state === 'Provider Block' && (
            <div className="p-3 rounded-lg bg-orange-50 border border-orange-200 text-xs text-[#EA580C]">
              Provider has blocked the resource/date.
            </div>
          )}

          {state === 'Maintenance' && (
            <div className="p-3 rounded-lg bg-stone-100 border border-stone-200 text-xs text-stone-700">
              Resource/date is unavailable for maintenance.
            </div>
          )}

          {state === 'Hold' && onOpenHoldDetail && (
            <Button
              type="button"
              variant="secondary"
              size="md"
              leftIcon={<ShieldAlert size={15} className="text-amber-700" />}
              className="w-full"
              onClick={() => {
                onClose();
                onOpenHoldDetail({
                  resourceName: resource.name,
                  resourceType: resource.type,
                  locationName: `${resource.location.name}, ${resource.location.city}`,
                  dateRange: formattedDate,
                  holdRef,
                });
              }}
            >
              Inspect Hold Information
            </Button>
          )}

          {state === 'Booked' && (
            <div className="p-3 rounded-lg bg-stone-100 border border-stone-200 text-xs text-[#525252] flex items-center justify-between">
              <span>Booking management belongs to Bookings.</span>
              <Link
                to="/panel/bookings"
                className="font-semibold text-[#EA580C] hover:underline shrink-0"
              >
                Go to Bookings →
              </Link>
            </div>
          )}

          {state === 'Admin Block' && (
            <div className="p-3 rounded-lg bg-rose-50/60 border border-rose-200/60 text-xs text-rose-800">
              SODAARS administration has blocked the resource/date.
            </div>
          )}
        </div>
      </div>
    </Drawer>
  );
};

export default AvailabilityDetailDrawer;
