import React, { useState, useEffect } from 'react';
import { Camera, CheckCircle2, ArrowRight } from 'lucide-react';
import Drawer from '../../../components/ui/Drawer';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import {
  CampaignRecord,
  CampaignExecutionStatus,
  APPROVED_EXECUTION_STATUSES,
} from '../../types/campaign';

export interface CampaignFormDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  campaign?: CampaignRecord | null;
  onSave: (campaign: CampaignRecord) => void;
}

export const CampaignFormDrawer: React.FC<CampaignFormDrawerProps> = ({
  isOpen,
  onClose,
  campaign,
  onSave,
}) => {
  const [campaignName, setCampaignName] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [bookingReference, setBookingReference] = useState('');
  const [resourceName, setResourceName] = useState('');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [executionStatus, setExecutionStatus] = useState<CampaignExecutionStatus>('Planned');
  const [notes, setNotes] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (campaign) {
      setCampaignName(campaign.campaignName);
      setCustomerName(campaign.customerName);
      setBookingReference(campaign.bookingReference);
      setResourceName(campaign.resourceName);
      setLocation(campaign.location);
      setStartDate(campaign.startDate);
      setEndDate(campaign.endDate);
      setExecutionStatus(campaign.executionStatus);
      setNotes(campaign.notes || '');
      setErrors({});
    } else {
      handleReset();
    }
  }, [campaign, isOpen]);

  const handleReset = () => {
    setCampaignName('');
    setCustomerName('');
    setBookingReference('');
    setResourceName('');
    setLocation('');
    setStartDate('');
    setEndDate('');
    setExecutionStatus('Planned');
    setNotes('');
    setErrors({});
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!campaignName.trim()) errs.campaignName = 'Campaign name is required.';
    if (!customerName.trim()) errs.customerName = 'Customer is required.';
    if (!bookingReference.trim()) errs.bookingReference = 'Booking reference is required.';
    if (!resourceName.trim()) errs.resourceName = 'Advertising resource is required.';
    if (!location.trim()) errs.location = 'Location is required.';
    if (!startDate) errs.startDate = 'Start date is required.';
    if (!endDate) errs.endDate = 'End date is required.';
    if (startDate && endDate && startDate > endDate) {
      errs.endDate = 'End date cannot precede start date.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const campaignId =
      campaign?.id || `CMP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const savedRecord: CampaignRecord = {
      id: campaignId,
      campaignName: campaignName.trim(),
      customerName: customerName.trim(),
      bookingReference: bookingReference.trim(),
      resourceName: resourceName.trim(),
      location: location.trim(),
      startDate,
      endDate,
      executionStatus,
      notes: notes.trim() || undefined,
      photoProof: campaign?.photoProof || [],
      createdAt: campaign?.createdAt || new Date().toISOString().split('T')[0],
    };

    onSave(savedRecord);
    handleReset();
    onClose();
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <Camera size={18} className="text-[#EA580C]" />
          <span>{campaign ? `Edit Campaign — ${campaign.campaignName}` : 'Create Campaign'}</span>
        </div>
      }
      width="max-w-2xl"
      footer={
        <div className="flex items-center justify-end gap-2.5 w-full">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<CheckCircle2 size={14} />}
            onClick={handleSubmit}
          >
            {campaign ? 'Update Campaign' : 'Save Campaign'}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Relationship Pipeline Banner */}
        <div className="p-3 rounded-lg bg-[#FAFAF9] border border-[#E5E5E5] space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373] block">
            System Progression
          </span>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#171717] flex-wrap">
            <span className="px-2 py-0.5 rounded bg-white border border-[#E5E5E5]">Customer</span>
            <ArrowRight size={11} className="text-[#737373]" />
            <span className="px-2 py-0.5 rounded bg-white border border-[#E5E5E5]">Booking</span>
            <ArrowRight size={11} className="text-[#737373]" />
            <span className="px-2 py-0.5 rounded bg-white border border-[#E5E5E5]">
              Advertising Resource
            </span>
            <ArrowRight size={11} className="text-[#737373]" />
            <span className="px-2 py-0.5 rounded bg-orange-50 border border-orange-200 text-[#EA580C]">
              Campaign
            </span>
          </div>
        </div>

        {/* 1. CAMPAIGN DETAILS */}
        <div className="space-y-3.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373] block border-b border-[#E5E5E5] pb-1">
            Section 1 — Campaign Details
          </span>

          <Input
            label="Campaign Name"
            placeholder="e.g. Q4 Brand Launch — Metro Corridor"
            value={campaignName}
            onChange={(e) => setCampaignName(e.target.value)}
            error={errors.campaignName}
            required
          />

          <div>
            <label className="block text-xs font-semibold text-[#171717] mb-1">
              Execution Status <span className="text-rose-500">*</span>
            </label>
            <select
              value={executionStatus}
              onChange={(e) => setExecutionStatus(e.target.value as CampaignExecutionStatus)}
              className="w-full h-9 rounded-md border border-[#E5E5E5] bg-white px-3 text-xs text-[#171717] focus:outline-none focus:border-[#EA580C]"
            >
              {APPROVED_EXECUTION_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 2. CUSTOMER & BOOKING LINKAGE */}
        <div className="space-y-3.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373] block border-b border-[#E5E5E5] pb-1">
            Section 2 — Customer, Booking & Resource Linkage
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Customer"
              placeholder="e.g. Zenith Media India"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              error={errors.customerName}
              required
            />
            <Input
              label="Booking Reference"
              placeholder="e.g. BKG-2026-1049"
              value={bookingReference}
              onChange={(e) => setBookingReference(e.target.value)}
              error={errors.bookingReference}
              required
            />
            <Input
              label="Advertising Resource"
              placeholder="e.g. Prime Junction Unipole"
              value={resourceName}
              onChange={(e) => setResourceName(e.target.value)}
              error={errors.resourceName}
              required
            />
            <Input
              label="Location"
              placeholder="e.g. MG Road Junction, Bengaluru"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              error={errors.location}
              required
            />
          </div>
        </div>

        {/* 3. CAMPAIGN PERIOD */}
        <div className="space-y-3.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373] block border-b border-[#E5E5E5] pb-1">
            Section 3 — Campaign Period
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Start Date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              error={errors.startDate}
              required
            />
            <Input
              label="End Date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              error={errors.endDate}
              required
            />
          </div>
        </div>

        {/* 4. NOTES */}
        <div className="space-y-3.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373] block border-b border-[#E5E5E5] pb-1">
            Section 4 — Execution Notes
          </span>

          <div>
            <label className="block text-xs font-semibold text-[#171717] mb-1">
              Internal Campaign Notes
            </label>
            <textarea
              rows={3}
              placeholder="Internal execution notes or remarks..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-md border border-[#E5E5E5] p-2.5 text-xs text-[#171717] outline-none focus:border-[#EA580C]"
            />
          </div>
        </div>

        {/* 5. PHOTO PROOF */}
        <div className="space-y-3.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373] block border-b border-[#E5E5E5] pb-1">
            Section 5 — Photo Proof
          </span>

          <div className="p-3 rounded-lg bg-[#FAFAF9] border border-[#E5E5E5] text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[#171717] flex items-center gap-1.5">
                <Camera size={14} className="text-[#EA580C]" />
                Photo Proof Evidence
              </span>
              <span className="text-[11px] text-[#737373]">
                {campaign?.photoProof && campaign.photoProof.length > 0
                  ? `${campaign.photoProof.length} proof record(s)`
                  : '0 proof records'}
              </span>
            </div>
            <p className="text-[11px] text-[#737373]">
              Record campaign execution evidence for this campaign.
            </p>
            {campaign?.photoProof && campaign.photoProof.length > 0 && (
              <div className="pt-2 border-t border-[#E5E5E5] space-y-1.5">
                {campaign.photoProof.map((proof, idx) => (
                  <div
                    key={proof.id || idx}
                    className="flex items-center justify-between p-2 rounded bg-white border border-[#E5E5E5] text-[11px]"
                  >
                    <span className="font-medium text-[#171717] truncate">
                      {proof.caption || 'Photo Proof'}
                    </span>
                    <span className="text-[#737373] shrink-0">{proof.recordedAt}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </form>
    </Drawer>
  );
};

export default CampaignFormDrawer;
