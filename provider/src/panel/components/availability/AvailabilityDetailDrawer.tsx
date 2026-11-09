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
  onReleaseBlock?: (intervalId: string) => void;
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
  onReleaseBlock,
  onOpenHoldDetail,
}) => {
  if (!selectedCell) return null;

  const { resource, formattedDate, state, bookingRef, holdRef, intervalId, date } = selectedCell;
  const stateConfig = AVAILABILITY_STATE_CONFIG[state];

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-red-50 text-[#E11D2E] flex items-center justify-center font-bold">
            <Calendar size={18} />
          </div>
          <div>
            <span className="font-bold text-[#1A2435]">Availability Inspector</span>
            <span className="text-[10px] text-[#64748B] block font-normal">Deterministic schedule state inspection</span>
          </div>
        </div>
      }
      width="max-w-lg"
      footer={
        <div className="flex items-center justify-between w-full">
          <span className="text-xs font-semibold text-[#64748B]">
            Inspecting: <strong className="text-[#1A2435]">{formattedDate}</strong>
          </span>
          <Button variant="primary" size="sm" onClick={onClose} className="bg-[#1A2435] hover:bg-[#253248] text-white">
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
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
              Availability Status
            </span>
            <span className={`text-base font-extrabold ${stateConfig.cellText}`}>
              {state}
            </span>
            <p className="text-xs text-[#475569] mt-0.5 leading-relaxed">
              {stateConfig.meaning}
            </p>
          </div>
          <span className={`w-3.5 h-3.5 rounded-full mt-1 shrink-0 ${stateConfig.indicatorBg}`} />
        </div>

        {/* Resource Details Card */}
        <div className="bg-[#F8FAFC] rounded-xl p-4 border border-[#E2E8F0] space-y-3">
          <div className="border-b border-[#E2E8F0] pb-2 flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
              Advertising Resource
            </h4>
            <Link
              to="/panel/resources"
              className="text-[11px] font-semibold text-[#E11D2E] hover:underline flex items-center gap-1"
            >
              <span>View in Inventory</span>
              <ExternalLink size={11} />
            </Link>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2 text-[#1A2435]">
              <Layers size={15} className="text-[#E11D2E]" />
              <span className="font-bold text-sm">{resource.name}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 text-[#64748B]">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#94A3B8] block">
                  Asset Type
                </span>
                <span className="font-semibold text-[#1A2435]">{resource.type}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#94A3B8] block">
                  Location Site
                </span>
                <span className="font-semibold text-[#1A2435] flex items-center gap-1">
                  <MapPin size={11} className="text-[#E11D2E]" />
                  {resource.location.name} ({resource.location.city})
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Date Context */}
        <div className="bg-white rounded-xl p-4 border border-[#E2E8F0] space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
            Selected Schedule Interval
          </h4>
          <div className="flex items-center gap-2 text-sm font-semibold text-[#1A2435]">
            <Calendar size={15} className="text-[#64748B]" />
            <span>{formattedDate}</span>
          </div>
          {bookingRef && (
            <div className="text-xs text-[#64748B] pt-1">
              Active Booking Code:{' '}
              <span className="font-mono font-bold text-[#1A2435]">{bookingRef}</span>
            </div>
          )}
          {holdRef && (
            <div className="text-xs text-[#64748B] pt-1">
              Provisional Hold ID:{' '}
              <span className="font-mono font-bold text-amber-700">{holdRef}</span>
            </div>
          )}
        </div>

        {/* Marketplace Participation Context (Strict Business Rule) */}
        <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[#1A2435]">Marketplace Syndication:</span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                resource.marketplaceParticipation
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-slate-100 text-slate-500 border border-slate-200'
              }`}
            >
              {resource.marketplaceParticipation ? 'Active on Marketplace' : 'Private to Provider'}
            </span>
          </div>
          <div className="flex items-start gap-2 pt-1 text-[11px] text-[#64748B] leading-relaxed">
            <Info size={13} className="shrink-0 mt-0.5 text-slate-400" />
            <p>
              <strong>SODAARS Engine Rule:</strong> Marketplace participation allows asset discovery. Actual real-time availability determines whether slots can be selected during checkout.
            </p>
          </div>
        </div>

        {/* Contextual Actions */}
        <div className="space-y-2.5 pt-2">
          {state === 'Available' && (
            <div className="space-y-2">
              <Button
                type="button"
                variant="primary"
                size="md"
                leftIcon={<Plus size={15} />}
                className="w-full bg-[#E11D2E] hover:bg-[#c81926] text-white"
                onClick={() => {
                  onClose();
                  onOpenCreateBlock(resource.id, date);
                }}
              >
                Place Operational Block for this Date
              </Button>
              <Link to={`/panel/bookings/create?resourceId=${resource.id}&startDate=${date}`} className="block">
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  leftIcon={<Layers size={15} />}
                  className="w-full border-[#E2E8F0] text-[#1A2435] hover:bg-[#F8FAFC]"
                >
                  Create Direct Booking for this Date
                </Button>
              </Link>
            </div>
          )}

          {state === 'Provider Block' && (
            <div className="space-y-2">
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-[#E11D2E]">
                <strong>Provider Block Active:</strong> This resource date is blocked from all client reservations.
              </div>
              {intervalId && onReleaseBlock && (
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  className="w-full border-red-200 text-[#E11D2E] hover:bg-red-50"
                  onClick={() => {
                    onReleaseBlock(intervalId);
                    onClose();
                  }}
                >
                  Release Provider Block (Restore to Available)
                </Button>
              )}
            </div>
          )}

          {state === 'Maintenance' && (
            <div className="space-y-2">
              <div className="p-3 rounded-lg bg-stone-100 border border-stone-200 text-xs text-stone-700">
                <strong>Under Maintenance:</strong> Physical structure is undergoing structural work, repainting or electrical repairs.
              </div>
              {intervalId && onReleaseBlock && (
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  className="w-full border-stone-300 text-stone-700 hover:bg-stone-50"
                  onClick={() => {
                    onReleaseBlock(intervalId);
                    onClose();
                  }}
                >
                  Complete Maintenance (Mark as Available)
                </Button>
              )}
            </div>
          )}

          {state === 'Hold' && onOpenHoldDetail && (
            <div className="space-y-2">
              <Button
                type="button"
                variant="secondary"
                size="md"
                leftIcon={<ShieldAlert size={15} className="text-amber-700" />}
                className="w-full bg-amber-50 border border-amber-200 text-amber-900 hover:bg-amber-100"
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
                Inspect Soft Hold Details
              </Button>
              <Link to="/panel/bookings?view=quotations&status=hold" className="block">
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  className="w-full border-[#E2E8F0] text-[#1A2435] hover:bg-[#F8FAFC]"
                >
                  View in Quotations &amp; Holds Ledger →
                </Button>
              </Link>
            </div>
          )}

          {state === 'Booked' && (
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-[#1A2435] flex items-center justify-between gap-2">
              <div>
                <div className="font-bold">Confirmed Contract In Flight</div>
                <div className="text-[11px] text-[#64748B]">Binding contract exists for this interval.</div>
              </div>
              <Link
                to="/panel/bookings"
                className="font-bold text-[#E11D2E] hover:underline shrink-0 text-xs"
              >
                Go to Bookings →
              </Link>
            </div>
          )}

          {state === 'Admin Block' && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800">
              <strong>Admin Compliance Block:</strong> SODAARS platform administration has locked this resource due to safety audit or licensing verification. Contact support for assistance.
            </div>
          )}
        </div>
      </div>
    </Drawer>
  );
};

export default AvailabilityDetailDrawer;
