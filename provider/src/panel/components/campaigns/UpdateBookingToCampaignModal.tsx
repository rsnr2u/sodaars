import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Image as ImageIcon,
  SlidersHorizontal,
} from 'lucide-react';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { CampaignRecord, CampaignExecutionStatus, CreativeAssetRecord } from '../../types/campaign';
import { BookingRecord } from '../../types/booking';
import { getAllProviderBookings } from '../../data/sampleBookings';

export interface UpdateBookingToCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveCampaign: (campaign: CampaignRecord) => void;
  preSelectedBooking?: BookingRecord | null;
}

const PRESET_CREATIVES = [
  {
    title: 'Festive High-Impact Celebration Creative',
    imageUrl: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=1000&auto=format&fit=crop&q=80',
    format: 'Frontlit Flex Vinyl 440 GSM Solvent Printed',
  },
  {
    title: 'Luxury EV Automotive Debut Display',
    imageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1000&auto=format&fit=crop&q=80',
    format: 'Seamless Backlit Fabric 510 GSM UV Ink',
  },
  {
    title: 'Smart Horizon Sapphire Tech Display',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1000&auto=format&fit=crop&q=80',
    format: 'Star Flex Banner 480 GSM Heavy Duty',
  },
  {
    title: 'Super Store Blockbuster Deals Creative',
    imageUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1000&auto=format&fit=crop&q=80',
    format: 'Frontlit Flex Vinyl 400 GSM',
  },
];

export const UpdateBookingToCampaignModal: React.FC<UpdateBookingToCampaignModalProps> = ({
  isOpen,
  onClose,
  onSaveCampaign,
  preSelectedBooking,
}) => {
  const [allBookings, setAllBookings] = useState<BookingRecord[]>([]);
  const [selectedBookingId, setSelectedBookingId] = useState<string>('');

  // Campaign fields
  const [campaignName, setCampaignName] = useState('');
  const [executionStatus, setExecutionStatus] = useState<CampaignExecutionStatus>('In Execution');
  const [mountingTeam, setMountingTeam] = useState('Metro Rigger Squad Alpha');
  const [notes, setNotes] = useState('');

  // Creative fields (Images / Creative artwork)
  const [creativeTitle, setCreativeTitle] = useState('');
  const [creativeImageUrl, setCreativeImageUrl] = useState('');
  const [creativeFormat, setCreativeFormat] = useState('Frontlit Flex Vinyl 440 GSM');
  const [creativeDimensions, setCreativeDimensions] = useState('40ft × 20ft (800 sq.ft)');

  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      const bookings = getAllProviderBookings();
      setAllBookings(bookings);

      if (preSelectedBooking) {
        setSelectedBookingId(preSelectedBooking.id);
        populateFromBooking(preSelectedBooking);
      } else if (bookings.length > 0) {
        setSelectedBookingId(bookings[0].id);
        populateFromBooking(bookings[0]);
      }
    }
  }, [isOpen, preSelectedBooking]);

  const populateFromBooking = (booking: BookingRecord) => {
    setCampaignName(`${booking.companyName} — ${booking.resourceName.split('-')[0].trim()} Flight`);
    setCreativeTitle(`${booking.companyName} Display Creative v1`);
    setCreativeImageUrl(PRESET_CREATIVES[0].imageUrl);
    setCreativeFormat('Frontlit Flex Vinyl 440 GSM Solvent Printed');
    setCreativeDimensions('40ft × 20ft (800 sq.ft)');
    setNotes(`Promoted from booking ${booking.id}. Media flighting from ${booking.startDate} to ${booking.endDate}.`);
    setError('');
  };

  const handleBookingChange = (bkgId: string) => {
    setSelectedBookingId(bkgId);
    const found = allBookings.find((b) => b.id === bkgId);
    if (found) {
      populateFromBooking(found);
    }
  };

  const selectedBooking = allBookings.find((b) => b.id === selectedBookingId) || preSelectedBooking;

  const handleSelectPreset = (preset: typeof PRESET_CREATIVES[0]) => {
    setCreativeTitle(preset.title);
    setCreativeImageUrl(preset.imageUrl);
    setCreativeFormat(preset.format);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooking) {
      setError('Please select a booking to update to campaign.');
      return;
    }
    if (!campaignName.trim()) {
      setError('Campaign name is required.');
      return;
    }
    if (!creativeImageUrl.trim()) {
      setError('Please provide a creative image URL or select an artwork preset.');
      return;
    }

    const creativeAsset: CreativeAssetRecord = {
      id: `CRV-${Date.now()}`,
      title: creativeTitle.trim() || `${campaignName} Creative`,
      imageUrl: creativeImageUrl.trim(),
      format: creativeFormat,
      dimensions: creativeDimensions,
      uploadedAt: new Date().toISOString().split('T')[0],
      version: 1,
    };

    const newCampaign: CampaignRecord = {
      id: `CMP-${Date.now().toString().slice(-6)}`,
      campaignName: campaignName.trim(),
      customerId: selectedBooking.customerId,
      customerName: selectedBooking.customerName,
      companyName: selectedBooking.companyName,
      bookingReference: selectedBooking.id,
      bookingSource: selectedBooking.source,
      resourceId: selectedBooking.resourceId,
      resourceName: selectedBooking.resourceName,
      resourceType: selectedBooking.resourceType,
      location: selectedBooking.location,
      startDate: selectedBooking.startDate,
      endDate: selectedBooking.endDate,
      bookedAmount: selectedBooking.pricing?.finalInvoicedAmount || selectedBooking.pricing?.regularCustomerPrice,
      executionStatus: executionStatus,
      mountingTeam: mountingTeam.trim() || undefined,
      notes: notes.trim() || undefined,
      activeCreative: creativeAsset,
      creatives: [creativeAsset],
      createdAt: new Date().toISOString().split('T')[0],
    };

    onSaveCampaign(newCampaign);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-3xl"
      title={
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-orange-50 border border-orange-200 text-[#EA580C] flex items-center justify-center font-bold text-xs shadow-2xs">
            <SlidersHorizontal size={14} />
          </span>
          <div>
            <h3 className="text-sm font-bold text-[#171717]">
              Update Booking to Active Campaign
            </h3>
            <span className="text-[11px] text-[#737373] block mt-0.5">
              Select bookings done by customer or admin, attach/change creative artwork, and launch campaign.
            </span>
          </div>
        </div>
      }
      footer={
        <div className="flex items-center justify-between w-full">
          <span className="text-[11px] text-[#737373]">
            Linked to Booking: <strong className="font-mono text-[#171717]">{selectedBooking?.id || '—'}</strong>
          </span>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<CheckCircle2 size={13} />}
              onClick={handleSubmit}
            >
              Update Booking to Campaign
            </Button>
          </div>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {error && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs">
            {error}
          </div>
        )}

        {/* 1. SELECT BOOKING (DONE BY CUSTOMER OR ADMIN) */}
        <div className="bg-[#FAFAF9] rounded-xl border border-[#E5E5E5] p-3.5 space-y-2.5">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#171717]">
            1. Select Confirmed Booking (Done to Customer or by Admin):
          </label>

          <select
            value={selectedBookingId}
            onChange={(e) => handleBookingChange(e.target.value)}
            className="w-full h-9 rounded-lg border border-[#E5E5E5] bg-white px-3 text-xs text-[#171717] focus:outline-none focus:border-[#EA580C] font-medium"
          >
            {allBookings.map((b) => (
              <option key={b.id} value={b.id}>
                [{b.id}] — {b.companyName} • {b.resourceName} ({b.startDate} to {b.endDate}) • Origin: {b.source}
              </option>
            ))}
          </select>

          {selectedBooking && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-lg bg-white border border-[#E5E5E5] text-[11px]">
              <div>
                <span className="text-[#737373] block">Customer</span>
                <span className="font-bold text-[#171717]">{selectedBooking.companyName}</span>
              </div>
              <div>
                <span className="text-[#737373] block">Booked Inventory</span>
                <span className="font-semibold text-[#171717] truncate block" title={selectedBooking.resourceName}>
                  {selectedBooking.resourceName}
                </span>
              </div>
              <div>
                <span className="text-[#737373] block">Origin Channel</span>
                <span className="font-semibold text-[#EA580C]">{selectedBooking.source} Booking</span>
              </div>
              <div>
                <span className="text-[#737373] block">Flighting Duration</span>
                <span className="font-semibold text-[#171717]">
                  {selectedBooking.startDate} to {selectedBooking.endDate}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* 2. CAMPAIGN DETAILS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Campaign Name"
            value={campaignName}
            onChange={(e) => setCampaignName(e.target.value)}
            placeholder="e.g. Festive Celebration Wave"
            required
          />

          <div>
            <label className="block text-xs font-semibold text-[#171717] mb-1">
              Campaign Execution Status
            </label>
            <select
              value={executionStatus}
              onChange={(e) => setExecutionStatus(e.target.value as CampaignExecutionStatus)}
              className="w-full h-9 rounded-lg border border-[#E5E5E5] bg-white px-3 text-xs text-[#171717] focus:outline-none focus:border-[#EA580C]"
            >
              <option value="In Execution">Running / In Execution (Live on Media)</option>
              <option value="Planned">Planned (Scheduled for Mounting)</option>
              <option value="Proof Submitted">Proof Submitted (Mounted, POP Pending)</option>
              <option value="Completed">Completed (Concluded)</option>
            </select>
          </div>
        </div>

        {/* 3. UPDATE CREATIVES & IMAGES */}
        <div className="border border-orange-200 bg-orange-50/20 rounded-xl p-3.5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#EA580C] flex items-center gap-1.5">
              <ImageIcon size={13} />
              2. Update Creatives (Artwork Image):
            </span>
            <span className="text-[10px] text-[#737373]">Live Creative Preview</span>
          </div>

          {/* Quick preset buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {PRESET_CREATIVES.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className="text-left p-1.5 rounded-lg border border-[#E5E5E5] bg-white hover:border-[#EA580C] transition-all flex items-center gap-2 group"
              >
                <img
                  src={preset.imageUrl}
                  alt={preset.title}
                  className="w-8 h-8 rounded object-cover border border-[#E5E5E5] shrink-0"
                />
                <span className="text-[10px] font-medium text-[#171717] truncate group-hover:text-[#EA580C]">
                  {preset.title.split(' ')[0]} Preset
                </span>
              </button>
            ))}
          </div>

          {/* Preview & Image URL */}
          <div className="flex flex-col sm:flex-row gap-3 items-center">
            {creativeImageUrl ? (
              <img
                src={creativeImageUrl}
                alt="Creative Artwork Preview"
                className="w-full sm:w-44 h-24 rounded-lg object-cover border border-[#E5E5E5] shadow-xs shrink-0"
              />
            ) : (
              <div className="w-full sm:w-44 h-24 rounded-lg border-2 border-dashed border-[#E5E5E5] bg-white flex items-center justify-center text-[#737373] text-[10px] shrink-0">
                No Artwork
              </div>
            )}

            <div className="w-full space-y-2">
              <Input
                label="Creative Artwork Title"
                value={creativeTitle}
                onChange={(e) => setCreativeTitle(e.target.value)}
                placeholder="e.g. Diwali Mega Sale Artwork v1"
              />
              <Input
                label="Creative Image Asset URL"
                value={creativeImageUrl}
                onChange={(e) => setCreativeImageUrl(e.target.value)}
                placeholder="https://..."
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#171717] mb-1">
                Print / Screen Format
              </label>
              <select
                value={creativeFormat}
                onChange={(e) => setCreativeFormat(e.target.value)}
                className="w-full h-8 rounded-lg border border-[#E5E5E5] bg-white px-2.5 text-xs text-[#171717] focus:outline-none focus:border-[#EA580C]"
              >
                <option value="Frontlit Flex Vinyl 440 GSM Solvent Printed">
                  Frontlit Flex Vinyl 440 GSM
                </option>
                <option value="Backlit Heavy Fabric 510 GSM UV Ink">
                  Backlit Fabric 510 GSM (Gantries)
                </option>
                <option value="Star Flex Heavy Duty 480 GSM (Highways)">
                  Star Flex Heavy Duty 480 GSM
                </option>
                <option value="Digital LED Screen UHD MP4/JPG (1920x1080)">
                  Digital LED Screen (1920×1080)
                </option>
              </select>
            </div>

            <Input
              label="Mounting Dimensions"
              value={creativeDimensions}
              onChange={(e) => setCreativeDimensions(e.target.value)}
              placeholder="e.g. 40ft × 20ft (800 sq.ft)"
            />
          </div>
        </div>

        {/* 4. OPERATIONAL NOTES & CREW */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Assigned Mounting Crew / Rigging Unit"
            value={mountingTeam}
            onChange={(e) => setMountingTeam(e.target.value)}
            placeholder="e.g. Mumbai Metro Squad Alpha"
          />

          <div>
            <label className="block text-xs font-semibold text-[#171717] mb-1">
              Execution Notes
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Night mounting scheduled; photo proof inspection by 8:00 AM..."
              className="w-full h-9 rounded-lg border border-[#E5E5E5] bg-white px-3 text-xs text-[#171717] focus:outline-none focus:border-[#EA580C]"
            />
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default UpdateBookingToCampaignModal;
