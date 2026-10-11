import React from 'react';
import {
  Camera,
  MapPin,
  Calendar,
  ArrowRight,
  Edit,
  Upload,
  Image as ImageIcon,
} from 'lucide-react';
import Drawer from '../../../components/ui/Drawer';
import Button from '../../../components/ui/Button';
import {
  CampaignRecord,
  EXECUTION_STATUS_CONFIG,
} from '../../types/campaign';

export interface CampaignDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: CampaignRecord | null;
  onEdit?: (campaign: CampaignRecord) => void;
  onOpenProofModal?: (campaign: CampaignRecord) => void;
}

export const CampaignDetailDrawer: React.FC<CampaignDetailDrawerProps> = ({
  isOpen,
  onClose,
  campaign,
  onEdit,
  onOpenProofModal,
}) => {
  if (!campaign) return null;

  const executionMeta = EXECUTION_STATUS_CONFIG[campaign.executionStatus];
  const hasProof = campaign.photoProof && campaign.photoProof.length > 0;

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <Camera size={17} className="text-[#EA580C]" />
          <span>Campaign Details — {campaign.campaignName}</span>
        </div>
      }
      width="max-w-2xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="text-xs text-[#737373]">
            Campaign ID:{' '}
            <span className="font-mono font-bold text-[#171717]">{campaign.id}</span>
          </div>
          <div className="flex items-center gap-2">
            {onOpenProofModal && (
              <Button
                variant="outline"
                size="sm"
                className="border-orange-200 text-[#EA580C] hover:bg-orange-50 font-semibold"
                leftIcon={<Camera size={14} />}
                onClick={() => onOpenProofModal(campaign)}
              >
                Record Photo Proof
              </Button>
            )}
            {onEdit && (
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Edit size={14} />}
                onClick={() => onEdit(campaign)}
              >
                Edit Campaign
              </Button>
            )}
            <Button variant="secondary" size="sm" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* ========================================================================= */}
        {/* A. CAMPAIGN OVERVIEW                                                      */}
        {/* ========================================================================= */}
        <div className="bg-[#FAFAF9] rounded-xl p-4 border border-[#E5E5E5] space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373]">
              Campaign Overview
            </span>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${executionMeta.badgeBg} ${executionMeta.badgeText} ${executionMeta.badgeBorder}`}
            >
              {executionMeta.label}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3.5 text-xs">
            <div className="col-span-2">
              <span className="text-[#737373] text-[11px] block">Campaign Name</span>
              <span className="font-bold text-[#171717] text-sm">{campaign.campaignName}</span>
            </div>
            <div className="col-span-2">
              <span className="text-[#737373] text-[11px] block">Execution Status</span>
              <span className="font-medium text-[#171717] mt-0.5 block">
                {executionMeta.label}
              </span>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-white border border-[#E5E5E5] text-[11px] text-[#525252] flex items-start gap-2">
            <span className="font-bold text-[#171717] shrink-0">Stage Context:</span>
            <span>{executionMeta.description}</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* B & C. CUSTOMER & BOOKING LINKAGE                                         */}
        {/* ========================================================================= */}
        <div className="rounded-xl border border-[#E5E5E5] p-4 bg-white space-y-3.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373]">
              Customer & Booking Linkage
            </span>
            <span className="text-[10px] font-semibold text-[#737373]">
              Upstream Records
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs bg-[#FAFAF9] p-3 rounded-lg border border-[#E5E5E5]">
            <div>
              <span className="text-[#737373] text-[11px] block">Customer</span>
              <span className="font-semibold text-[#171717]">{campaign.customerName}</span>
            </div>
            <div>
              <span className="text-[#737373] text-[11px] block">Booking Reference</span>
              <span className="font-mono font-semibold text-[#171717]">{campaign.bookingReference}</span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* D. ADVERTISING RESOURCE & LOCATION                                        */}
        {/* ========================================================================= */}
        <div className="rounded-xl border border-[#E5E5E5] p-4 bg-white space-y-3.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373]">
              Advertising Resource & Location
            </span>
            <MapPin size={13} className="text-[#EA580C]" />
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs bg-[#FAFAF9] p-3 rounded-lg border border-[#E5E5E5]">
            <div>
              <span className="text-[#737373] text-[11px] block">Advertising Resource</span>
              <span className="font-semibold text-[#171717]">{campaign.resourceName}</span>
            </div>
            <div>
              <span className="text-[#737373] text-[11px] block">Location</span>
              <span className="text-[#171717]">{campaign.location}</span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* E. CAMPAIGN PERIOD                                                        */}
        {/* ========================================================================= */}
        <div className="rounded-xl border border-[#E5E5E5] p-4 bg-white space-y-3.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373]">
              Campaign Period
            </span>
            <Calendar size={13} className="text-[#737373]" />
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs bg-[#FAFAF9] p-3 rounded-lg border border-[#E5E5E5]">
            <div>
              <span className="text-[#737373] text-[11px] block">Start Date</span>
              <span className="font-semibold text-[#171717]">{campaign.startDate}</span>
            </div>
            <div>
              <span className="text-[#737373] text-[11px] block">End Date</span>
              <span className="font-semibold text-[#171717]">{campaign.endDate}</span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* F. EXECUTION RECORD & NOTES                                               */}
        {/* ========================================================================= */}
        <div className="rounded-xl border border-[#E5E5E5] p-4 bg-white space-y-3.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373]">
              Execution Record
            </span>
            <span className="text-[10px] font-semibold text-[#737373]">
              Execution Progress
            </span>
          </div>

          <div className="p-3 rounded-lg bg-[#FAFAF9] border border-[#E5E5E5] space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[#737373]">Current Execution Stage</span>
              <span className="font-bold text-[#171717]">{executionMeta.label}</span>
            </div>
            {campaign.notes && (
              <div className="pt-2 border-t border-[#E5E5E5]">
                <span className="text-[#737373] text-[11px] block mb-1">Execution Notes</span>
                <p className="text-[#525252] leading-relaxed whitespace-pre-line">
                  {campaign.notes}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* G. PHOTO PROOF EVIDENCE                                                   */}
        {/* ========================================================================= */}
        <div className="rounded-xl border border-[#E5E5E5] p-4 bg-white space-y-3.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373]">
              Photo Proof
            </span>
            {onOpenProofModal && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs text-[#EA580C] hover:bg-orange-50"
                leftIcon={<Upload size={12} />}
                onClick={() => onOpenProofModal(campaign)}
              >
                Record Proof
              </Button>
            )}
          </div>

          {hasProof ? (
            <div className="space-y-3">
              {campaign.photoProof!.map((proof, idx) => (
                <div
                  key={proof.id || idx}
                  className="rounded-lg border border-[#E5E5E5] p-3 bg-[#FAFAF9] space-y-2 text-xs"
                >
                  {proof.imageUrl ? (
                    <img
                      src={proof.imageUrl}
                      alt={proof.caption || 'Photo Proof'}
                      className="max-h-48 rounded border border-[#E5E5E5] object-cover w-full shadow-xs"
                    />
                  ) : (
                    <div className="h-32 rounded bg-stone-100 flex items-center justify-center text-[#737373]">
                      <ImageIcon size={28} className="text-stone-400" />
                    </div>
                  )}
                  <div className="flex items-center justify-between font-medium">
                    <span className="text-[#171717]">{proof.caption || 'Photographic Proof'}</span>
                    <span className="text-[#737373] text-[11px]">{proof.recordedAt}</span>
                  </div>
                  {proof.notes && (
                    <p className="text-[11px] text-[#525252]">{proof.notes}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 rounded-lg border border-dashed border-[#E5E5E5] bg-[#FAFAF9] text-center">
              <Camera size={24} className="mx-auto text-[#737373] mb-2" />
              <p className="text-xs font-semibold text-[#171717]">
                No photo proof recorded yet.
              </p>
              <p className="text-[11px] text-[#737373] mt-1">
                Record campaign execution evidence for this campaign.
              </p>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* H. EXECUTION WORKFLOW VISUAL                                              */}
        {/* ========================================================================= */}
        <div className="rounded-xl border border-stone-200 bg-white p-4 space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373] block mb-2">
            Execution Lifecycle
          </span>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#171717] flex-wrap">
            <span className="px-2 py-0.5 rounded bg-[#FAFAF9] border border-[#E5E5E5]">
              Campaign
            </span>
            <ArrowRight size={11} className="text-[#737373]" />
            <span className="px-2 py-0.5 rounded bg-[#FAFAF9] border border-[#E5E5E5]">
              Booked Resource
            </span>
            <ArrowRight size={11} className="text-[#737373]" />
            <span className="px-2 py-0.5 rounded bg-[#FAFAF9] border border-[#E5E5E5]">
              Mounting / Installation
            </span>
            <ArrowRight size={11} className="text-[#737373]" />
            <span className="px-2 py-0.5 rounded bg-orange-50 border border-orange-200 text-[#EA580C]">
              Photo Proof
            </span>
            <ArrowRight size={11} className="text-[#737373]" />
            <span className="px-2 py-0.5 rounded bg-[#FAFAF9] border border-[#E5E5E5]">
              Execution Record
            </span>
            <ArrowRight size={11} className="text-[#737373]" />
            <span className="px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-800">
              Completed
            </span>
          </div>
          <p className="text-[11px] text-[#737373] pt-1">
            Conceptual workflow from booked resource through mounting, photo proof, execution record, and completion.
          </p>
        </div>
      </div>
    </Drawer>
  );
};

export default CampaignDetailDrawer;
