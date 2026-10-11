import React, { useState } from 'react';
import { Camera, Upload, Image as ImageIcon, AlertCircle } from 'lucide-react';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import { CampaignRecord, PhotoProofRecord } from '../../types/campaign';

export interface PhotoProofUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: CampaignRecord | null;
  onUploadProof: (campaignId: string, proof: PhotoProofRecord) => void;
}

export const PhotoProofUploadModal: React.FC<PhotoProofUploadModalProps> = ({
  isOpen,
  onClose,
  campaign,
  onUploadProof,
}) => {
  const [selectedFileName, setSelectedFileName] = useState<string>('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [error, setError] = useState<string>('');

  if (!campaign) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFileName(file.name);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setError('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFileName && !previewUrl) {
      setError('Please select an image file to record proof.');
      return;
    }

    const proof: PhotoProofRecord = {
      id: `PRF-${Date.now()}`,
      imageUrl: previewUrl || undefined,
      caption: caption.trim() || selectedFileName || 'Execution Photo Proof',
      recordedAt: new Date().toISOString().split('T')[0],
      notes: notes.trim() || undefined,
    };

    onUploadProof(campaign.id, proof);
    handleReset();
    onClose();
  };

  const handleReset = () => {
    setSelectedFileName('');
    setPreviewUrl(null);
    setCaption('');
    setNotes('');
    setError('');
  };

  const handleModalClose = () => {
    handleReset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleModalClose}
      title={
        <div className="flex items-center gap-2 text-[#171717]">
          <Camera size={18} className="text-[#EA580C]" />
          <span>Photo Proof — Record Execution Evidence</span>
        </div>
      }
      maxWidth="max-w-lg"
      footer={
        <>
          <Button variant="secondary" size="sm" onClick={handleModalClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Upload size={14} />}
            onClick={handleSubmit}
          >
            Record Proof
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-3 rounded-lg bg-orange-50/60 border border-orange-200 text-xs text-orange-950 flex items-start gap-2">
          <AlertCircle size={15} className="text-[#EA580C] shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Record campaign execution evidence for <strong>{campaign.campaignName}</strong> on {campaign.resourceName}.
          </p>
        </div>

        {/* Campaign Context Strip */}
        <div className="bg-[#FAFAF9] rounded-lg p-3 border border-[#E5E5E5] grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-[#737373] text-[11px] block">Customer</span>
            <span className="font-semibold text-[#171717]">{campaign.customerName}</span>
          </div>
          <div>
            <span className="text-[#737373] text-[11px] block">Booking Ref</span>
            <span className="font-mono text-[#171717]">{campaign.bookingReference}</span>
          </div>
          <div className="col-span-2">
            <span className="text-[#737373] text-[11px] block">Location</span>
            <span className="text-[#171717]">{campaign.location}</span>
          </div>
        </div>

        {/* File Upload Area */}
        <div>
          <label className="block text-xs font-semibold text-[#171717] mb-1.5">
            Upload Photographic Evidence <span className="text-rose-500">*</span>
          </label>
          <div className="border-2 border-dashed border-[#E5E5E5] hover:border-[#EA580C] rounded-xl p-5 text-center transition-colors bg-[#FAFAF9]/60">
            {previewUrl ? (
              <div className="space-y-3">
                <img
                  src={previewUrl}
                  alt="Proof preview"
                  className="max-h-48 mx-auto rounded-lg border border-[#E5E5E5] object-cover shadow-xs"
                />
                <div className="flex items-center justify-center gap-2">
                  <span className="text-xs text-[#171717] font-medium">{selectedFileName}</span>
                  <label className="text-xs text-[#EA580C] font-semibold hover:underline cursor-pointer">
                    Change Photo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            ) : (
              <label className="flex flex-col items-center cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-orange-50 text-[#EA580C] flex items-center justify-center mb-2">
                  <ImageIcon size={20} />
                </div>
                <span className="text-xs font-semibold text-[#171717]">
                  Click to select photo proof file
                </span>
                <span className="text-[11px] text-[#737373] mt-0.5">
                  Record campaign execution evidence for this campaign.
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
          {error && <p className="text-[11px] text-rose-600 mt-1 font-medium">{error}</p>}
        </div>

        {/* Caption */}
        <div>
          <label className="block text-xs font-semibold text-[#171717] mb-1">
            Photo Caption
          </label>
          <input
            type="text"
            placeholder="e.g. Frontal view of advertising resource"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="w-full h-9 rounded-md border border-[#E5E5E5] px-3 text-xs text-[#171717] outline-none focus:border-[#EA580C]"
          />
        </div>

        {/* Proof Notes */}
        <div>
          <label className="block text-xs font-semibold text-[#171717] mb-1">
            Execution Notes
          </label>
          <textarea
            rows={2}
            placeholder="Execution proof notes or remarks..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full rounded-md border border-[#E5E5E5] p-2.5 text-xs text-[#171717] outline-none focus:border-[#EA580C]"
          />
        </div>
      </form>
    </Modal>
  );
};

export default PhotoProofUploadModal;
