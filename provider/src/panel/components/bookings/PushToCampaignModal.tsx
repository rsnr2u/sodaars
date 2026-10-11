import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Layers,
  MapPin,
  Calendar,
  Clock,
  Truck,
} from 'lucide-react';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { BookingRecord } from '../../types/booking';

export interface PushToCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: BookingRecord | null;
  onConfirmPush: (
    booking: BookingRecord,
    campaignDetails: {
      campaignName: string;
      mountingTeam: string;
      flexSpec: string;
      notes: string;
      startDate: string;
      endDate: string;
    }
  ) => void;
}

const RIGGER_SQUADS = [
  'Metro Rigger Squad Alpha (Prime Central)',
  'Western Express Highway Cantilever Riggers',
  'DLF Cyber City Specialized Mounting Unit',
  'South Zone Rapid Response Rigger Crew',
  'In-House Media Engineering Team',
];

const FLEX_PRINT_SPECS = [
  'Frontlit Flex Vinyl 440 GSM Solvent Printed',
  'Seamless Backlit Fabric 510 GSM UV Ink',
  'Star Flex Banner 480 GSM Heavy Duty Weatherproof',
  'DOOH Digital Video Wall Spec (1920x1080 MP4 / 60fps)',
];

export const PushToCampaignModal: React.FC<PushToCampaignModalProps> = ({
  isOpen,
  onClose,
  booking,
  onConfirmPush,
}) => {
  const [campaignName, setCampaignName] = useState('');
  const [mountingTeam, setMountingTeam] = useState(RIGGER_SQUADS[0]);
  const [flexSpec, setFlexSpec] = useState(FLEX_PRINT_SPECS[0]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (booking) {
      setCampaignName(`${booking.companyName} — ${booking.resourceName}`);
      setStartDate(booking.startDate || '');
      setEndDate(booking.endDate || '');
      setNotes(`Work order mobilized from booking ${booking.id}. Mandatory Day and Night illumination proof required.`);
    }
  }, [booking]);

  if (!isOpen || !booking) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignName.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      onConfirmPush(booking, {
        campaignName: campaignName.trim(),
        mountingTeam,
        flexSpec,
        notes: notes.trim(),
        startDate,
        endDate,
      });
      setIsSubmitting(false);
      onClose();
    }, 300);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-orange-100 text-[#EA580C] flex items-center justify-center">
            <Sparkles size={16} />
          </div>
          <div>
            <span className="text-sm font-bold text-[#171717]">
              Push Booking to Campaign Execution
            </span>
            <p className="text-[11px] text-[#737373] font-normal">
              Convert confirmed booking into an operational rigger work order
            </p>
          </div>
        </div>
      }
      maxWidth="max-w-2xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <span className="text-[11px] text-[#737373]">
            Target Status:{' '}
            <strong className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Planned / Upcoming
            </strong>
          </span>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSubmit}
              isLoading={isSubmitting}
              leftIcon={<Truck size={14} />}
            >
              Confirm &amp; Push to Campaigns
            </Button>
          </div>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Source Booking Summary Banner */}
        <div className="p-3.5 rounded-xl bg-[#FAFAF9] border border-[#E5E5E5] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-[#EA580C] bg-orange-50 border border-orange-200 px-2 py-0.5 rounded">
              {booking.id}
            </span>
            <span className="text-[11px] font-semibold text-[#171717]">
              {booking.companyName}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
            <div className="flex items-center gap-1.5 text-[#525252]">
              <Layers size={13} className="text-[#EA580C] shrink-0" />
              <span className="truncate">{booking.resourceName}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#525252]">
              <MapPin size={13} className="text-[#EA580C] shrink-0" />
              <span className="truncate">{booking.location}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#525252] col-span-2">
              <Calendar size={13} className="text-stone-400 shrink-0" />
              <span>
                Schedule: <strong>{booking.startDate}</strong> to <strong>{booking.endDate}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Operational Notice */}
        <div className="p-3 rounded-lg bg-orange-50/70 border border-orange-200 text-[#7C2D12] text-[11px] leading-relaxed flex items-start gap-2">
          <Clock size={15} className="text-[#EA580C] shrink-0 mt-0.5" />
          <div>
            <strong>Planned / Upcoming Stage:</strong> This campaign will be initialized in the{' '}
            <span className="font-semibold underline">Planned</span> state on your Campaigns Board.
            Once the display start date arrives and your rigger begins mounting, you can click{' '}
            <strong>"Start Mounting / Mark Live"</strong> to begin POP photo capture.
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-3">
          <div>
            <label className="block text-[11px] font-semibold text-[#171717] mb-1">
              Campaign Execution Title *
            </label>
            <Input
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
              placeholder="e.g. Samsung Galaxy S26 BKC Corridor Blitz"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#171717] mb-1">
                Display Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-[#E5E5E5] text-xs bg-white text-[#171717] focus:outline-none focus:border-[#EA580C]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#171717] mb-1">
                Display End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-[#E5E5E5] text-xs bg-white text-[#171717] focus:outline-none focus:border-[#EA580C]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#171717] mb-1">
                Assigned Rigger Squad
              </label>
              <select
                value={mountingTeam}
                onChange={(e) => setMountingTeam(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-[#E5E5E5] text-xs bg-white text-[#171717] focus:outline-none focus:border-[#EA580C]"
              >
                {RIGGER_SQUADS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#171717] mb-1">
                Flex Print / Media Spec
              </label>
              <select
                value={flexSpec}
                onChange={(e) => setFlexSpec(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-[#E5E5E5] text-xs bg-white text-[#171717] focus:outline-none focus:border-[#EA580C]"
              >
                {FLEX_PRINT_SPECS.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#171717] mb-1">
              Rigger Dispatch Notes &amp; Illumination Checks
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. High wind load area; double eyelet stitching required. Confirm timer switch is set to 6:30 PM."
              className="w-full p-2.5 rounded-lg border border-[#E5E5E5] text-xs bg-white text-[#171717] focus:outline-none focus:border-[#EA580C] leading-relaxed resize-none"
            />
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default PushToCampaignModal;
