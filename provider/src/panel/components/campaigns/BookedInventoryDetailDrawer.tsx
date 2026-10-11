import React from 'react';
import {
  Eye,
  Camera,
  MapPin,
  Calendar,
  Layers,
  Image as ImageIcon,
  Sparkles,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import Drawer from '../../../components/ui/Drawer';
import Button from '../../../components/ui/Button';
import {
  CampaignRecord,
  EXECUTION_STATUS_CONFIG,
} from '../../types/campaign';
import { BOOKING_SOURCE_CONFIG } from '../../types/booking';

export interface BookedInventoryDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: CampaignRecord | null;
  onOpenUpdateCreative?: (campaign: CampaignRecord) => void;
  onOpenProofModal?: (campaign: CampaignRecord) => void;
  onStatusChange?: (campaignId: string, newStatus: 'In Execution' | 'Completed') => void;
}

export const BookedInventoryDetailDrawer: React.FC<BookedInventoryDetailDrawerProps> = ({
  isOpen,
  onClose,
  campaign,
  onOpenUpdateCreative,
  onOpenProofModal,
  onStatusChange,
}) => {
  if (!campaign) return null;

  const executionMeta = EXECUTION_STATUS_CONFIG[campaign.executionStatus];
  const sourceConfig = campaign.bookingSource ? BOOKING_SOURCE_CONFIG[campaign.bookingSource] : null;
  const hasProof = campaign.photoProof && campaign.photoProof.length > 0;
  const activeCreative = campaign.activeCreative;

  // Calculate flight progress
  const start = new Date(campaign.startDate).getTime();
  const end = new Date(campaign.endDate).getTime();
  const now = new Date().getTime();
  const totalDuration = Math.max(1, end - start);
  const elapsed = Math.max(0, Math.min(totalDuration, now - start));
  const progressPercent = Math.round((elapsed / totalDuration) * 100);

  const daysRemaining = Math.max(0, Math.ceil((end - now) / (1000 * 60 * 60 * 24)));

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <Eye size={18} className="text-[#EA580C]" />
          <div>
            <div className="font-bold text-[#171717] text-sm sm:text-base">
              Booked Inventory & Campaign Specs
            </div>
            <div className="text-[11px] text-[#737373] font-normal">
              Booking Ref: <span className="font-mono font-semibold text-[#171717]">{campaign.bookingReference}</span> • Campaign ID: <span className="font-mono font-semibold text-[#171717]">{campaign.id}</span>
            </div>
          </div>
        </div>
      }
      width="max-w-3xl"
      footer={
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between w-full gap-2.5">
          <div className="text-[11px] text-[#737373]">
            Status: <span className="font-bold text-[#171717]">{executionMeta.label}</span>
          </div>
          <div className="flex items-center gap-2">
            {campaign.executionStatus !== 'In Execution' && onStatusChange && (
              <Button
                variant="outline"
                size="sm"
                className="border-emerald-300 text-emerald-800 hover:bg-emerald-50 text-xs font-semibold"
                leftIcon={<TrendingUp size={13} />}
                onClick={() => onStatusChange(campaign.id, 'In Execution')}
              >
                Mark In Execution (Running)
              </Button>
            )}
            {campaign.executionStatus !== 'Completed' && onStatusChange && (
              <Button
                variant="outline"
                size="sm"
                className="border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-semibold"
                leftIcon={<CheckCircle2 size={13} />}
                onClick={() => onStatusChange(campaign.id, 'Completed')}
              >
                Mark Completed
              </Button>
            )}
            <Button variant="secondary" size="sm" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-6 pb-6">
        {/* ========================================================================= */}
        {/* 1. TOP HIGHLIGHT STRIP: INVENTORY STATUS & ORIGIN                          */}
        {/* ========================================================================= */}
        <div className="bg-gradient-to-r from-orange-50/70 via-stone-50 to-white rounded-xl p-4 border border-orange-200/70 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${executionMeta.badgeBg} ${executionMeta.badgeText} ${executionMeta.badgeBorder}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${executionMeta.indicatorBg} mr-1.5`} />
                {executionMeta.label}
              </span>
              {sourceConfig && (
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${sourceConfig.badgeBg} ${sourceConfig.badgeText} ${sourceConfig.badgeBorder}`}
                >
                  Origin: {sourceConfig.label}
                </span>
              )}
              {campaign.resourceType && (
                <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-700 font-semibold text-[10px] uppercase border border-stone-200">
                  {campaign.resourceType}
                </span>
              )}
            </div>
            <h2 className="text-base sm:text-lg font-extrabold text-[#171717] leading-snug">
              {campaign.campaignName}
            </h2>
            <p className="text-xs text-[#525252]">
              Assigned to customer <strong className="text-[#171717]">{campaign.customerName}</strong> ({campaign.companyName || 'Corporate Client'})
            </p>
          </div>

          <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-orange-100 shrink-0">
            <span className="text-[10px] uppercase font-bold text-[#737373]">Booked Commercials</span>
            <span className="text-xl sm:text-2xl font-black text-[#EA580C]">
              ₹{Number(campaign.bookedAmount || 150000).toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-stone-500">Invoiced Value</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. BOOKED INVENTORY SPECIFICATIONS & LOCATION DETAILS                     */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-xl border border-[#E5E5E5] p-4 sm:p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-2.5">
            <div className="flex items-center gap-2">
              <Layers size={16} className="text-[#EA580C]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#171717]">
                Booked Outdoor Inventory Details
              </h3>
            </div>
            <span className="text-[10px] font-mono text-stone-500 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
              Asset ID: {campaign.resourceId || 'ASSET-MUM-101'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left specs card */}
            <div className="bg-[#FAFAF9] rounded-lg p-3.5 border border-[#E5E5E5] space-y-2.5 text-xs">
              <div>
                <span className="text-[11px] text-[#737373] block">Display Asset Name</span>
                <span className="font-bold text-[#171717] text-sm block">
                  {campaign.resourceName}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#E5E5E5]">
                <div>
                  <span className="text-[10px] text-[#737373] block uppercase font-semibold">Dimensions</span>
                  <span className="font-semibold text-[#171717]">
                    {campaign.dimensions || '40ft × 20ft (800 sq.ft)'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#737373] block uppercase font-semibold">Illumination</span>
                  <span className="font-semibold text-[#171717]">
                    {campaign.illumination || 'Front-lit (High Output LED)'}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#E5E5E5]">
                <span className="text-[10px] text-[#737373] block uppercase font-semibold">Mounting Crew Assigned</span>
                <span className="font-medium text-[#171717]">
                  {campaign.mountingTeam || 'Metro Rigger Squad Alpha'}
                </span>
              </div>
            </div>

            {/* Right location card */}
            <div className="bg-[#FAFAF9] rounded-lg p-3.5 border border-[#E5E5E5] space-y-2.5 text-xs">
              <div>
                <span className="text-[11px] text-[#737373] block">City & Micro-Market</span>
                <div className="flex items-center gap-1.5 font-bold text-[#171717] text-sm">
                  <MapPin size={14} className="text-[#EA580C] shrink-0" />
                  <span>{campaign.location}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#E5E5E5]">
                <span className="text-[10px] text-[#737373] block uppercase font-semibold">Precise Landmark</span>
                <p className="text-[#171717] font-medium leading-relaxed">
                  {campaign.landmark || 'Prominent traffic junction facing primary arterial road.'}
                </p>
              </div>

              <div className="pt-2 border-t border-[#E5E5E5]">
                <span className="text-[10px] text-[#737373] block uppercase font-semibold">Traffic Exposure</span>
                <span className="text-[#525252]">High-visibility vehicular & pedestrian transit corridor</span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. FLIGHTING SCHEDULE & DURATION PROGRESS                                  */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-xl border border-[#E5E5E5] p-4 sm:p-5 shadow-xs space-y-3.5">
          <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-2.5">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-[#EA580C]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#171717]">
                Flighting Period & Running Status
              </h3>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-stone-500">Days Remaining:</span>
              <span className="font-mono font-bold text-[#EA580C] bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                {daysRemaining} Days
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-[#FAFAF9] rounded-lg border border-[#E5E5E5]">
              <span className="text-[11px] text-[#737373] block">Display Start Date</span>
              <span className="font-bold text-[#171717] text-sm">{campaign.startDate}</span>
            </div>
            <div className="p-3 bg-[#FAFAF9] rounded-lg border border-[#E5E5E5]">
              <span className="text-[11px] text-[#737373] block">Display End Date</span>
              <span className="font-bold text-[#171717] text-sm">{campaign.endDate}</span>
            </div>
            <div className="p-3 bg-[#FAFAF9] rounded-lg border border-[#E5E5E5] col-span-2 sm:col-span-1">
              <span className="text-[11px] text-[#737373] block">Execution Lifecycle</span>
              <span className="font-bold text-[#171717]">{executionMeta.label}</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between text-[11px] text-stone-600 font-medium">
              <span>Flight Progress</span>
              <span>{progressPercent}% Complete</span>
            </div>
            <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden border border-stone-200">
              <div
                className="bg-[#EA580C] h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4. ACTIVE CREATIVE ARTWORK & IMAGE PREVIEW (CORE USER REQUIREMENT)        */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-xl border border-[#E5E5E5] p-4 sm:p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-2.5">
            <div className="flex items-center gap-2">
              <ImageIcon size={16} className="text-[#EA580C]" />
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#171717]">
                  Active Creative Artwork & Image Specs
                </h3>
              </div>
            </div>
            {onOpenUpdateCreative && (
              <Button
                variant="primary"
                size="sm"
                className="text-xs h-7 px-3 bg-[#EA580C] hover:bg-[#C2410C]"
                leftIcon={<RefreshCw size={12} />}
                onClick={() => onOpenUpdateCreative(campaign)}
              >
                Change / Update Creative
              </Button>
            )}
          </div>

          {activeCreative && activeCreative.imageUrl ? (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Image Preview Box */}
              <div className="md:col-span-7 bg-stone-900 rounded-xl overflow-hidden border border-stone-800 relative group flex items-center justify-center min-h-[220px]">
                <img
                  src={activeCreative.imageUrl}
                  alt={activeCreative.title}
                  className="w-full h-auto max-h-[320px] object-cover object-center group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2 bg-black/75 backdrop-blur-md text-white text-[10px] font-mono font-bold px-2.5 py-1 rounded-md border border-white/20 flex items-center gap-1.5">
                  <Sparkles size={11} className="text-amber-400" />
                  <span>Version {activeCreative.version || 1}.0 Active</span>
                </div>
                <a
                  href={activeCreative.imageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-2 right-2 bg-black/70 hover:bg-black text-white p-1.5 rounded-md text-[10px] flex items-center gap-1 opacity-80 hover:opacity-100 transition-opacity"
                >
                  <ExternalLink size={12} />
                  <span>Full View</span>
                </a>
              </div>

              {/* Specs & Material Details */}
              <div className="md:col-span-5 flex flex-col justify-between space-y-3 bg-[#FAFAF9] rounded-xl p-4 border border-[#E5E5E5] text-xs">
                <div className="space-y-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-[#737373] tracking-wider block">
                      Creative Title
                    </span>
                    <span className="font-extrabold text-[#171717] text-sm block mt-0.5">
                      {activeCreative.title}
                    </span>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-[#E5E5E5]">
                    <div>
                      <span className="text-[10px] font-semibold text-[#737373] block uppercase">
                        Print / Substrate Format
                      </span>
                      <span className="font-medium text-[#171717]">
                        {activeCreative.format || 'Frontlit Flex Vinyl 440 GSM Solvent Printed'}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-semibold text-[#737373] block uppercase">
                        Active Print Dimensions
                      </span>
                      <span className="font-medium text-[#171717]">
                        {activeCreative.dimensions || campaign.dimensions || '40ft × 20ft'}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-semibold text-[#737373] block uppercase">
                        Last Creative Update
                      </span>
                      <span className="font-mono text-stone-600">
                        {activeCreative.uploadedAt || campaign.startDate}
                      </span>
                    </div>
                  </div>

                  {activeCreative.notes && (
                    <div className="pt-2 border-t border-[#E5E5E5]">
                      <span className="text-[10px] font-semibold text-[#737373] block uppercase">
                        Production / Mounting Notes
                      </span>
                      <p className="text-[11px] text-[#525252] leading-relaxed italic">
                        "{activeCreative.notes}"
                      </p>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-[#E5E5E5] flex items-center justify-between text-[11px]">
                  <span className="text-stone-500">History: {campaign.creatives?.length || 1} iterations</span>
                  {onOpenUpdateCreative && (
                    <button
                      onClick={() => onOpenUpdateCreative(campaign)}
                      className="text-[#EA580C] hover:text-[#C2410C] font-semibold flex items-center gap-1 hover:underline"
                    >
                      <RefreshCw size={11} />
                      Replace Artwork
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-xl border border-dashed border-stone-300 bg-[#FAFAF9] text-center space-y-3">
              <ImageIcon size={32} className="mx-auto text-stone-400" />
              <div>
                <p className="text-sm font-bold text-[#171717]">No Creative Artwork Uploaded</p>
                <p className="text-xs text-[#737373] max-w-sm mx-auto mt-1">
                  Upload the digital banner or artwork image to update this booking to a live campaign.
                </p>
              </div>
              {onOpenUpdateCreative && (
                <Button
                  variant="primary"
                  size="sm"
                  className="text-xs"
                  leftIcon={<Sparkles size={13} />}
                  onClick={() => onOpenUpdateCreative(campaign)}
                >
                  Upload Creative Image
                </Button>
              )}
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* 5. PHOTO PROOF POP / VERIFICATION EVIDENCE                                */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-xl border border-[#E5E5E5] p-4 sm:p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-2.5">
            <div className="flex items-center gap-2">
              <Camera size={16} className="text-[#EA580C]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#171717]">
                Proof of Performance (POP) & Site Photos
              </h3>
            </div>
            {onOpenProofModal && (
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-7 border-orange-200 text-[#EA580C] hover:bg-orange-50 font-semibold"
                leftIcon={<Camera size={12} />}
                onClick={() => onOpenProofModal(campaign)}
              >
                Record Photo Proof
              </Button>
            )}
          </div>

          {hasProof ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {campaign.photoProof!.map((proof, idx) => (
                <div
                  key={proof.id || idx}
                  className="rounded-xl border border-[#E5E5E5] overflow-hidden bg-[#FAFAF9] space-y-2 text-xs shadow-xs"
                >
                  {proof.imageUrl ? (
                    <div className="relative group bg-stone-900 aspect-video overflow-hidden">
                      <img
                        src={proof.imageUrl}
                        alt={proof.caption || 'Photo Proof'}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded">
                        {proof.proofType || 'Physical Inspection'}
                      </div>
                    </div>
                  ) : (
                    <div className="aspect-video bg-stone-100 flex items-center justify-center text-stone-400">
                      <Camera size={24} />
                    </div>
                  )}

                  <div className="p-3 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#171717]">{proof.caption || 'Mounting Photo'}</span>
                      <span className="text-[10px] font-mono text-[#737373]">{proof.recordedAt}</span>
                    </div>
                    {proof.notes && (
                      <p className="text-[11px] text-[#525252] leading-snug">{proof.notes}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 rounded-xl border border-dashed border-[#E5E5E5] bg-[#FAFAF9] text-center space-y-2">
              <Camera size={26} className="mx-auto text-stone-400" />
              <p className="text-xs font-semibold text-[#171717]">
                No physical photo proof submitted yet.
              </p>
              <p className="text-[11px] text-[#737373] max-w-sm mx-auto">
                Capture day illumination or night lighting inspection photographs for client verification and billing closure.
              </p>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* 6. CUSTOMER & CLIENT BILLING LINKAGE                                      */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-xl border border-[#E5E5E5] p-4 sm:p-5 shadow-xs space-y-3.5">
          <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-2.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373]">
              Customer & Invoicing Details
            </span>
            <span className="text-[10px] font-mono text-stone-500">
              Customer ID: {campaign.customerId || 'CUST-2026-001'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-[#FAFAF9] p-3.5 rounded-lg border border-[#E5E5E5]">
            <div>
              <span className="text-[#737373] text-[10px] uppercase font-semibold block">Contact Person</span>
              <span className="font-bold text-[#171717]">{campaign.customerName}</span>
            </div>
            <div>
              <span className="text-[#737373] text-[10px] uppercase font-semibold block">Company / Brand</span>
              <span className="font-semibold text-[#171717]">{campaign.companyName || 'Corporate Client'}</span>
            </div>
            <div>
              <span className="text-[#737373] text-[10px] uppercase font-semibold block">Booking Origin</span>
              <span className="font-semibold text-[#171717]">{campaign.bookingSource || 'Provider Direct'}</span>
            </div>
            <div>
              <span className="text-[#737373] text-[10px] uppercase font-semibold block">Invoiced Total</span>
              <span className="font-extrabold text-[#EA580C]">₹{Number(campaign.bookedAmount || 150000).toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 7. EXECUTION LIFECYCLE AUDIT TRAIL                                        */}
        {/* ========================================================================= */}
        <div className="rounded-xl border border-stone-200 bg-white p-4 space-y-2">
          <div className="flex items-center gap-2">
            <ShieldCheck size={15} className="text-emerald-600" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373]">
              Outdoor Advertising Execution Pipeline
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#171717] flex-wrap pt-1">
            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
              1. Booked (Provider/Admin)
            </span>
            <ArrowRight size={11} className="text-stone-400" />
            <span className="px-2 py-0.5 rounded bg-orange-50 text-[#EA580C] border border-orange-200">
              2. Update Creative Artwork
            </span>
            <ArrowRight size={11} className="text-stone-400" />
            <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
              3. In Execution (Running)
            </span>
            <ArrowRight size={11} className="text-stone-400" />
            <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-700 border border-stone-200">
              4. Photo Proof POP
            </span>
            <ArrowRight size={11} className="text-stone-400" />
            <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-700 border border-stone-200">
              5. Completed Flight
            </span>
          </div>
          <p className="text-[11px] text-[#737373] pt-1">
            Real-time status updates are synchronized across the Provider Operating System, customer notifications, and verification records.
          </p>
        </div>
      </div>
    </Drawer>
  );
};

export default BookedInventoryDetailDrawer;
