import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, CheckCircle2, Sparkles } from 'lucide-react';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { CampaignRecord, CreativeAssetRecord } from '../../types/campaign';

export interface UpdateCreativeModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: CampaignRecord | null;
  onSaveCreative: (campaignId: string, creative: CreativeAssetRecord) => void;
}

const PRESET_CREATIVES = [
  {
    title: 'Festive Mega Celebration Artwork',
    imageUrl: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=1000&auto=format&fit=crop&q=80',
    format: 'Frontlit Flex Vinyl 440 GSM Solvent Printed',
  },
  {
    title: 'Luxury EV Automotive Debut Creative',
    imageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1000&auto=format&fit=crop&q=80',
    format: 'Seamless Backlit Fabric 510 GSM UV Ink',
  },
  {
    title: 'Smart Tech Sapphire Flagship Creative',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1000&auto=format&fit=crop&q=80',
    format: 'Star Flex Banner 480 GSM Heavy Duty',
  },
  {
    title: 'Super Store Big Savings Yellow Banner',
    imageUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1000&auto=format&fit=crop&q=80',
    format: 'Frontlit Flex Vinyl 400 GSM',
  },
  {
    title: 'Pure Cruiser Motorcycling Route Art',
    imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=1000&auto=format&fit=crop&q=80',
    format: 'Solvent Flex 440 GSM Matt Lamination',
  },
];

export const UpdateCreativeModal: React.FC<UpdateCreativeModalProps> = ({
  isOpen,
  onClose,
  campaign,
  onSaveCreative,
}) => {
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [format, setFormat] = useState('Frontlit Flex Vinyl 440 GSM');
  const [dimensions, setDimensions] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (campaign) {
      const active = campaign.activeCreative;
      setTitle(active?.title || `${campaign.campaignName} Display Creative`);
      setImageUrl(active?.imageUrl || '');
      setFormat(active?.format || 'Frontlit Flex Vinyl 440 GSM');
      setDimensions(active?.dimensions || campaign.dimensions || '40ft × 20ft');
      setNotes(active?.notes || '');
      setError('');
    }
  }, [campaign, isOpen]);

  if (!campaign || !isOpen) return null;

  const currentVersion = (campaign.activeCreative?.version || 1) + 1;

  const handleSelectPreset = (preset: typeof PRESET_CREATIVES[0]) => {
    setTitle(preset.title);
    setImageUrl(preset.imageUrl);
    setFormat(preset.format);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Creative title is required.');
      return;
    }
    if (!imageUrl.trim()) {
      setError('Please provide an image URL or choose a creative image preset.');
      return;
    }

    const updatedCreative: CreativeAssetRecord = {
      id: `CRV-${Date.now()}`,
      title: title.trim(),
      imageUrl: imageUrl.trim(),
      format: format.trim(),
      dimensions: dimensions.trim() || campaign.dimensions,
      uploadedAt: new Date().toISOString().split('T')[0],
      version: currentVersion,
      notes: notes.trim() || undefined,
    };

    onSaveCreative(campaign.id, updatedCreative);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-2xl"
      title={
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-orange-50 border border-orange-200 text-[#EA580C] flex items-center justify-center font-bold text-xs shadow-2xs">
            <ImageIcon size={14} />
          </span>
          <div>
            <h3 className="text-sm font-bold text-[#171717]">
              Change Creatives & Update Image — {campaign.campaignName}
            </h3>
            <span className="text-[11px] text-[#737373] block mt-0.5">
              Booked Asset: <strong>{campaign.resourceName}</strong> • {campaign.location}
            </span>
          </div>
        </div>
      }
      footer={
        <div className="flex items-center justify-between w-full">
          <span className="text-[11px] text-[#737373]">
            This will record <strong className="text-[#171717]">Version {currentVersion}</strong> of
            the creative artwork.
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
              Update Creative Image
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

        {/* Current / New Image Preview */}
        <div className="bg-[#FAFAF9] rounded-xl border border-[#E5E5E5] p-3.5 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#737373]">
            <span>Creative Image Preview</span>
            <span className="text-[#EA580C]">Version {currentVersion}</span>
          </div>

          {imageUrl ? (
            <div className="relative rounded-lg overflow-hidden border border-[#E5E5E5] bg-black max-h-56 flex items-center justify-center">
              <img
                src={imageUrl}
                alt="Creative Preview"
                className="w-full object-cover max-h-56"
                onError={() => setError('Image could not be loaded. Please check URL.')}
              />
              <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 text-white text-[10px] font-medium backdrop-blur-xs">
                {dimensions || 'Dimensions Specified on Mounting'}
              </div>
            </div>
          ) : (
            <div className="h-40 rounded-lg border-2 border-dashed border-[#E5E5E5] bg-white flex flex-col items-center justify-center text-[#737373] p-4 text-center">
              <ImageIcon size={32} className="text-stone-400 mb-2" />
              <p className="font-semibold text-[#171717]">No Creative Artwork Selected</p>
              <p className="text-[11px] text-[#737373] mt-0.5">
                Paste an image URL below or pick one of the sample high-res artwork presets.
              </p>
            </div>
          )}
        </div>

        {/* Quick Creative Presets */}
        <div>
          <span className="text-[11px] font-bold text-[#171717] block mb-1.5 flex items-center gap-1">
            <Sparkles size={12} className="text-[#EA580C]" />
            Quick Artwork Presets (Click to Load):
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {PRESET_CREATIVES.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className="text-left p-2 rounded-lg border border-[#E5E5E5] hover:border-[#EA580C] hover:bg-orange-50/40 transition-all flex items-center gap-2 group"
              >
                <img
                  src={preset.imageUrl}
                  alt={preset.title}
                  className="w-10 h-8 rounded object-cover border border-[#E5E5E5] shrink-0"
                />
                <div className="truncate">
                  <span className="font-medium text-[#171717] block truncate group-hover:text-[#EA580C]">
                    {preset.title}
                  </span>
                  <span className="text-[10px] text-[#737373] block truncate">{preset.format}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Image URL & Title Input */}
        <div className="space-y-3 pt-1">
          <Input
            label="Creative Artwork Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Festive Diwali Campaign Creative v2"
            required
          />

          <Input
            label="Creative Image URL / Cloud Asset Link"
            value={imageUrl}
            onChange={(e) => {
              setImageUrl(e.target.value);
              setError('');
            }}
            placeholder="https://..."
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#171717] mb-1">
                Print Material / Digital Spec
              </label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="w-full h-9 rounded-lg border border-[#E5E5E5] bg-white px-3 text-xs text-[#171717] focus:outline-none focus:border-[#EA580C]"
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
                  Digital LED Display (1920×1080)
                </option>
                <option value="Translit Backlit Film with UV Lamination">
                  Translit Film (Bus Shelters)
                </option>
              </select>
            </div>

            <Input
              label="Creative Dimensions"
              value={dimensions}
              onChange={(e) => setDimensions(e.target.value)}
              placeholder="e.g. 40ft × 20ft (800 sq.ft)"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#171717] mb-1">
              Creative Notes / Flighting Instructions
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. High color saturation required for day and night LED front-lit reflection..."
              rows={2}
              className="w-full rounded-lg border border-[#E5E5E5] bg-white p-2.5 text-xs text-[#171717] focus:outline-none focus:border-[#EA580C]"
            />
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default UpdateCreativeModal;
