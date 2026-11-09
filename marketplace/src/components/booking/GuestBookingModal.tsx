'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Calendar, 
  Building2, 
  FileText, 
  User, 
  Phone, 
  Mail, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  Sparkles, 
  Receipt, 
  Printer 
} from 'lucide-react';
import { MarketplaceResource, GuestBookingRequest } from '@/types/marketplace';
import { formatCurrencyINR } from '@/lib/utils';

interface GuestBookingModalProps {
  resource: MarketplaceResource;
  onClose: () => void;
  onSuccess?: (booking: GuestBookingRequest) => void;
}

export const GuestBookingModal: React.FC<GuestBookingModalProps> = ({
  resource,
  onClose,
  onSuccess,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Form State
  const [startDate, setStartDate] = useState('2026-11-15');
  const [endDate, setEndDate] = useState('2026-12-14');
  const [brandName, setBrandName] = useState('');
  const [campaignTitle, setCampaignTitle] = useState('');
  const [buyerType, setBuyerType] = useState<GuestBookingRequest['buyerType']>('Brand / Direct Advertiser');
  const [artworkStatus, setArtworkStatus] = useState<GuestBookingRequest['artworkStatus']>('Ready to Print');
  const [includePrinting, setIncludePrinting] = useState(true);

  // Contact State
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [gstin, setGstin] = useState('');

  // Result state
  const [confirmedBooking, setConfirmedBooking] = useState<GuestBookingRequest | null>(null);

  // Calculations
  const durationMonths = 1; // 30-day baseline
  const rentalAmount = resource.marketplacePrice * durationMonths;
  // MANDATORY Mounting & Rigging by Provider (Always charged by media owner)
  const mountingAmount = Math.round(resource.totalSqFt * (resource.mountingRatePerSqFt || 6));
  // OPTIONAL Flex Printing (Advertiser or agency can supply their own printed flex or opt-in)
  const printingAmount = includePrinting
    ? Math.round(resource.totalSqFt * (resource.printingRatePerSqFt || 14))
    : 0;
  const subtotal = rentalAmount + mountingAmount + printingAmount;
  const gstAmount = Math.round(subtotal * 0.18);
  const totalAmount = subtotal + gstAmount;

  const handleCompleteBooking = (e: React.FormEvent) => {
    e.preventDefault();

    const newBooking: GuestBookingRequest = {
      id: `BKG-${Math.floor(1000 + Math.random() * 9000)}`,
      resourceId: resource.id,
      resourceName: resource.name,
      resourceType: resource.type,
      locationArea: `${resource.location.landmark || resource.location.area}, ${resource.location.city}`,
      city: resource.location.city,
      startDate,
      endDate,
      durationDays: 30,
      brandName: brandName || 'Brand Partner',
      campaignTitle: campaignTitle || `${brandName} Outdoor Campaign`,
      buyerType,
      artworkStatus,
      includePrintingMounting: includePrinting,
      includePrinting,
      rentalAmount,
      mountingAmount,
      printingAmount,
      printingMountingAmount: mountingAmount + printingAmount,
      estimatedGst: gstAmount,
      totalEstimatedAmount: totalAmount,
      contactName,
      contactPhone,
      contactEmail,
      companyName: companyName || brandName || 'Direct Media Buyer',
      gstin: gstin || 'Unregistered / Direct',
      createdAt: new Date().toISOString().split('T')[0],
      status: 'Under Review',
    };

    // Save to local storage for tracking
    try {
      const existing = JSON.parse(localStorage.getItem('sodaars_guest_bookings') || '[]');
      localStorage.setItem('sodaars_guest_bookings', JSON.stringify([newBooking, ...existing]));
    } catch (err) {
      console.warn('Storage sync skipped', err);
    }

    setConfirmedBooking(newBooking);
    setStep(5);
    if (onSuccess) onSuccess(newBooking);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/70">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-semibold px-2.5 py-1 rounded-full bg-brand-50 text-[#B00020] border border-brand-100">
                Option A: Fast Guest Booking
              </span>
              <span className="text-xs text-zinc-500 font-medium">No password required</span>
            </div>
            <h3 className="text-base font-semibold text-zinc-950 font-sans mt-0.5">
              Request Booking: {resource.name}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-zinc-200/60 text-zinc-400 hover:text-zinc-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Step Progress Tracker */}
        {step < 5 && (
          <div className="px-6 pt-4 pb-2 bg-white">
            <div className="grid grid-cols-4 gap-2 text-center text-xs font-sans font-semibold">
              {[
                { s: 1, label: '1. Dates' },
                { s: 2, label: '2. Brand' },
                { s: 3, label: '3. Flex Spec' },
                { s: 4, label: '4. Contact' },
              ].map((st) => (
                <div
                  key={st.s}
                  className={`py-1.5 rounded-xl border transition-all ${
                    step === st.s
                      ? 'bg-[#B00020] text-white border-[#B00020] shadow-xs'
                      : step > st.s
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-zinc-50 text-zinc-400 border-zinc-100'
                  }`}
                >
                  {st.label}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6">
          
          {/* STEP 1: CAMPAIGN FLIGHT DATES */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-zinc-950">Select Campaign Flight Dates</h4>
                <p className="text-xs text-zinc-500">
                  Standard OOH campaigns are booked on 30-day calendar blocks. Real-time availability will be locked.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-sans">
                <div className="p-3 rounded-xl border border-zinc-200 bg-zinc-50 space-y-1">
                  <label className="text-xs uppercase font-semibold text-zinc-500 block">Flight Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-transparent font-semibold text-zinc-900 focus:outline-none"
                  />
                </div>

                <div className="p-3 rounded-xl border border-zinc-200 bg-zinc-50 space-y-1">
                  <label className="text-xs uppercase font-semibold text-zinc-500 block">Flight End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-transparent font-semibold text-zinc-900 focus:outline-none"
                  />
                </div>
              </div>

              {/* Price Quote Preview */}
              <div className="p-4 rounded-2xl bg-brand-50/60 border border-brand-100 space-y-2 text-xs font-sans">
                <div className="flex justify-between items-center text-zinc-700">
                  <span>Base Monthly Display Rental:</span>
                  <strong className="font-semibold text-zinc-950 font-sans">{formatCurrencyINR(rentalAmount)}</strong>
                </div>
                <div className="flex justify-between items-center text-zinc-700">
                  <span>Media Provider Security:</span>
                  <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 text-xs">
                    <ShieldCheck className="w-3.5 h-3.5" /> Verified Partner
                  </span>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-5 py-2.5 rounded-xl bg-[#B00020] hover:bg-brand-700 text-white font-semibold text-xs flex items-center gap-2 shadow-sm cursor-pointer"
                >
                  <span>Continue to Brand Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: BRAND & CAMPAIGN DETAILS */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-zinc-950">Advertiser Brand & Identity</h4>
                <p className="text-xs text-zinc-500">
                  Help the media owner review category exclusivity (e.g. no conflicting auto/finance ads).
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-zinc-800 block mb-1">Advertiser / Brand Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tata Motors, Amazon Prime, HDFC Bank..."
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:border-[#B00020] font-sans"
                  />
                </div>

                <div>
                  <label className="font-semibold text-zinc-800 block mb-1">Campaign Title / Theme</label>
                  <input
                    type="text"
                    placeholder="e.g. Festive EV SUV Showcase Drive 2026"
                    value={campaignTitle}
                    onChange={(e) => setCampaignTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:border-[#B00020] font-sans"
                  />
                </div>

                <div>
                  <label className="font-semibold text-zinc-800 block mb-1">Who is booking this campaign?</label>
                  <select
                    value={buyerType}
                    onChange={(e) => setBuyerType(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 bg-white font-sans text-zinc-800 cursor-pointer"
                  >
                    <option value="Brand / Direct Advertiser">Brand / Direct Advertiser</option>
                    <option value="Advertising Agency">Advertising Agency / Media Planner</option>
                    <option value="Local Enterprise">Local Enterprise / Retail Business</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-700 cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  disabled={!brandName.trim()}
                  className="px-5 py-2.5 rounded-xl bg-[#B00020] hover:bg-brand-700 disabled:opacity-50 text-white font-semibold text-xs flex items-center gap-2 shadow-sm cursor-pointer"
                >
                  <span>Continue to Flex Specs</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: ARTWORK & PRINTING OPTIONS */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-zinc-950">Mounting & Flex Printing Options</h4>
                <p className="text-xs text-zinc-500">
                  Mounting is mandatory by the verified provider for high-altitude structural safety; flex printing is optional.
                </p>
              </div>

              <div className="space-y-3 text-xs">
                {/* 1. Mandatory Mounting by Provider */}
                <div className="p-3.5 rounded-2xl border border-zinc-200 bg-zinc-50 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white border border-zinc-200 flex items-center justify-center shrink-0 mt-0.5 overflow-hidden">
                    <img src="/mounting-rigger.png" alt="Mounting" className="w-7 h-7 object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-semibold text-zinc-950 flex items-center gap-1.5">
                        Mounting & Rigging by Provider
                        <span className="text-[10px] font-semibold uppercase px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                          Mandatory
                        </span>
                      </span>
                      <span className="font-semibold text-zinc-950">
                        {formatCurrencyINR(mountingAmount)}
                      </span>
                    </div>
                    <p className="text-zinc-500 text-[11px] mt-0.5 leading-relaxed">
                      Direct provider crew installation ({resource.totalSqFt} sq.ft @ ₹{resource.mountingRatePerSqFt || 6}/sq.ft). High-elevation safety rigging, tensioning, and municipal compliance.
                    </p>
                  </div>
                </div>

                {/* 2. Optional Flex Printing */}
                <label className="p-3.5 rounded-2xl border border-zinc-200 bg-zinc-50 flex items-start gap-3 cursor-pointer hover:bg-zinc-100/70 transition-colors">
                  <input
                    type="checkbox"
                    checked={includePrinting}
                    onChange={(e) => setIncludePrinting(e.target.checked)}
                    className="mt-0.5 accent-[#B00020] w-4 h-4 rounded cursor-pointer"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <strong className="text-zinc-950 block">Include High-Grade Flex Printing</strong>
                      <span className="font-semibold text-[#B00020]">
                        {includePrinting ? `+${formatCurrencyINR(printingAmount)}` : '₹0'}
                      </span>
                    </div>
                    <p className="text-zinc-500 text-[11px] mt-0.5 leading-relaxed">
                      Front-lit flex print ({resource.totalSqFt} sq.ft @ ₹{resource.printingRatePerSqFt || 14}/sq.ft). Leave unchecked if advertiser/agency supplies own printed flex.
                    </p>
                  </div>
                </label>

                <div>
                  <label className="font-semibold text-zinc-800 block mb-1">Artwork Readiness</label>
                  <select
                    value={artworkStatus}
                    onChange={(e) => setArtworkStatus(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 bg-white font-sans text-zinc-800 cursor-pointer"
                  >
                    <option value="Ready to Print">High-Res Print PDF / TIFF is ready</option>
                    <option value="Need Design & Creative Support">Need SODAARS Studio Creative Design Support</option>
                    <option value="Re-use Existing Flex">Re-use flex currently stored with provider</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-700 cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="px-5 py-2.5 rounded-xl bg-[#B00020] hover:bg-brand-700 text-white font-semibold text-xs flex items-center gap-2 shadow-sm cursor-pointer"
                >
                  <span>Continue to Contact</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: GUEST CONTACT & GSTIN */}
          {step === 4 && (
            <form onSubmit={handleCompleteBooking} className="space-y-4">
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-zinc-950">Contact & Invoicing Details</h4>
                <p className="text-xs text-zinc-500">
                  Where should we send the confirmation and verified mounting photo proof report?
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-semibold text-zinc-800 block mb-1">Contact Officer Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Singhania"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 focus:outline-none focus:border-[#B00020]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-zinc-800 block mb-1">Company Legal Entity *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apex Consumer India Ltd"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 focus:outline-none focus:border-[#B00020]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-zinc-800 block mb-1">Phone Number (WhatsApp) *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98200 12345"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 focus:outline-none focus:border-[#B00020] font-sans"
                  />
                </div>

                <div>
                  <label className="font-semibold text-zinc-800 block mb-1">Official Business Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="rahul@company.com"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 focus:outline-none focus:border-[#B00020]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-semibold text-zinc-800 block mb-1">GSTIN Number (Optional for Tax Invoice)</label>
                  <input
                    type="text"
                    placeholder="27AABCA1234F1Z5"
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 focus:outline-none focus:border-[#B00020] font-sans"
                  />
                </div>
              </div>

              {/* Total Summary Sheet */}
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-1.5 text-xs font-sans">
                <div className="flex justify-between text-zinc-600">
                  <span>Display Space Rental ({durationMonths} month):</span>
                  <span>{formatCurrencyINR(rentalAmount)}</span>
                </div>
                <div className="flex justify-between text-zinc-600">
                  <span className="flex items-center gap-1.5">
                    Mounting & Rigging:
                    <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded">Mandatory Provider</span>
                  </span>
                  <span>{formatCurrencyINR(mountingAmount)}</span>
                </div>
                <div className="flex justify-between text-zinc-600">
                  <span>Flex Printing (Optional):</span>
                  <span className={includePrinting ? 'text-zinc-900 font-medium' : 'text-zinc-400 italic'}>
                    {includePrinting ? formatCurrencyINR(printingAmount) : 'Self-Supplied by Advertiser (₹0)'}
                  </span>
                </div>
                <div className="flex justify-between text-zinc-600">
                  <span>Estimated 18% GST (SAC 998315):</span>
                  <span>{formatCurrencyINR(gstAmount)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-zinc-200 font-sans text-sm font-semibold text-zinc-950">
                  <span>Total Payable:</span>
                  <span className="text-[#B00020]">{formatCurrencyINR(totalAmount)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-4 py-2 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-700 cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={!contactName || !contactPhone || !contactEmail}
                  className="px-6 py-2.5 rounded-xl bg-[#B00020] hover:bg-brand-700 disabled:opacity-50 text-white font-semibold text-xs flex items-center gap-2 shadow-sm cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Submit Booking Request</span>
                </button>
              </div>
            </form>
          )}

          {/* STEP 5: SUCCESS CONFIRMATION RECEIPT */}
          {step === 5 && confirmedBooking && (
            <div className="text-center space-y-5 py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <span className="text-xs uppercase font-semibold text-[#B00020] tracking-wide block">
                  BOOKING REQUEST DISPATCHED
                </span>
                <h3 className="text-xl font-semibold text-zinc-950 font-sans">
                  Booking Reference: {confirmedBooking.id}
                </h3>
                <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                  Your request has been dispatched directly to the <strong>Verified Partner</strong> and our 24/7 Operations Desk.
                </p>
              </div>

              {/* Receipt Summary Card */}
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 text-left text-xs font-sans space-y-2">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Asset:</span>
                  <strong className="text-zinc-900 truncate max-w-[240px]">{confirmedBooking.resourceName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Location:</span>
                  <strong className="text-zinc-900">{confirmedBooking.locationArea}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Flight:</span>
                  <strong className="text-zinc-900">{confirmedBooking.startDate} to {confirmedBooking.endDate}</strong>
                </div>
                <div className="flex justify-between pt-1 border-t border-zinc-200">
                  <span className="text-zinc-500">Estimated Total:</span>
                  <strong className="text-[#B00020] font-sans text-sm font-semibold">
                    {formatCurrencyINR(confirmedBooking.totalEstimatedAmount)}
                  </strong>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 text-left flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <p>
                  <strong>What happens next?</strong> SODAARS holds your requested dates. Within 2 business hours, an operations coordinator will verify artwork specs and share the secure Escrow payment link.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Link
                  href="/track"
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#B00020] hover:bg-brand-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Receipt className="w-3.5 h-3.5" />
                  <span>Track This Booking Live</span>
                </Link>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-semibold text-xs cursor-pointer"
                >
                  Continue Browsing
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
