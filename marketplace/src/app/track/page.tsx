'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Search, 
  FileCheck, 
  Calendar, 
  MapPin, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Printer, 
  ArrowRight,
  PhoneCall,
  Sparkles,
  Building2,
  FileText
} from 'lucide-react';
import { GuestBookingRequest } from '@/types/marketplace';
import { formatCurrencyINR } from '@/lib/utils';

export default function TrackBookingPage() {
  const [searchCode, setSearchCode] = useState('');
  const [foundBooking, setFoundBooking] = useState<GuestBookingRequest | null>(null);
  const [searched, setSearched] = useState(false);
  const [recentBookings, setRecentBookings] = useState<GuestBookingRequest[]>([]);

  // Load any locally saved guest bookings from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('sodaars_recent_bookings');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setRecentBookings(parsed);
          setFoundBooking(parsed[0]); // default to most recent
          setSearchCode(parsed[0].id);
        }
      }
    } catch (e) {
      // ignore JSON parse errors
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
    const query = searchCode.trim().toUpperCase();

    if (!query) {
      setFoundBooking(null);
      return;
    }

    // First check localStorage
    const match = recentBookings.find(
      (b) => b.id.toUpperCase() === query || b.contactPhone.includes(query)
    );

    if (match) {
      setFoundBooking(match);
    } else {
      // Generate a mock confirmed tracker if user enters a valid looking BKG code
      if (query.startsWith('BKG-') || query.length >= 6) {
        setFoundBooking({
          id: query,
          resourceId: 'MKT-MUM-001',
          resourceName: 'BKC Diamond Bourse Premium Unipole',
          resourceType: 'Unipoles',
          locationArea: 'Bandra Kurla Complex (BKC)',
          city: 'Mumbai',
          startDate: '2026-11-20',
          endDate: '2026-12-19',
          durationDays: 30,
          brandName: 'Demo Client Campaign',
          campaignTitle: 'Q4 Product Launch',
          buyerType: 'Brand / Direct Advertiser',
          artworkStatus: 'Ready to Print',
          includePrintingMounting: true,
          rentalAmount: 185000,
          printingMountingAmount: 16000,
          estimatedGst: 36180,
          totalEstimatedAmount: 237180,
          contactName: 'Campaign Operations Manager',
          contactPhone: '+91 98765 00000',
          contactEmail: 'operations@example.com',
          companyName: 'Private Enterprise Pvt Ltd',
          createdAt: new Date().toISOString(),
          status: 'Under Review',
        });
      } else {
        setFoundBooking(null);
      }
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 pb-24">
      {/* Tracker Header */}
      <section className="bg-white border-b border-zinc-200/90 py-12 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-100 text-[#B00020] text-xs font-sans font-semibold">
            <FileCheck className="w-3.5 h-3.5" />
            <span>Public Campaign Status Tracker</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-semibold text-zinc-900 tracking-tight">
            Track Your Outdoor Media Booking
          </h1>

          <p className="text-sm text-zinc-500 max-w-xl mx-auto leading-relaxed">
            Enter your booking reference code (e.g. <span className="font-semibold text-zinc-800">BKG-7842</span>) or phone number to check execution status, mounting verification, and flight schedules.
          </p>

          {/* Search Bar Form */}
          <form onSubmit={handleSearch} className="max-w-md mx-auto pt-4 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="e.g. BKG-9142 or Phone Number"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-sans font-semibold text-zinc-900 uppercase placeholder:normal-case placeholder:font-sans placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#B00020]/20 focus:border-[#B00020]"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-3 rounded-xl bg-[#B00020] hover:bg-brand-700 text-white font-semibold text-xs transition-colors shrink-0 cursor-pointer shadow-xs"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Booking Details Display */}
      <div className="max-w-4xl mx-auto px-4 sm:px-8 pt-8">
        {foundBooking ? (
          <div className="space-y-6">
            {/* Main Status Card */}
            <div className="bg-white rounded-3xl border border-zinc-200/90 p-6 sm:p-8 shadow-xs space-y-6">
              {/* Reference & Badge */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-100">
                <div className="space-y-1">
                  <span className="text-xs uppercase text-zinc-500 font-semibold font-sans">
                    Booking Reference
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-sans font-semibold text-[#B00020]">
                      {foundBooking.id}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                      <Clock className="w-3 h-3 text-amber-600" />
                      <span>{foundBooking.status}</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrint}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-zinc-200 hover:bg-zinc-50 text-xs font-semibold text-zinc-700 transition-colors cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Receipt</span>
                  </button>
                </div>
              </div>

              {/* Progress Milestones Tracker */}
              <div className="space-y-3">
                <span className="text-xs font-sans font-semibold text-zinc-600 uppercase">
                  Flight Execution Milestones
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
                    <div className="flex items-center justify-between text-emerald-800">
                      <span className="text-xs font-semibold">1. Inquiry Logged</span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    </div>
                    <p className="text-xs text-emerald-700">Received & Assigned</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-brand-50 border border-brand-200 space-y-1">
                    <div className="flex items-center justify-between text-brand-900">
                      <span className="text-xs font-semibold">2. Partner Review</span>
                      <Clock className="w-4 h-4 text-[#B00020]" />
                    </div>
                    <p className="text-xs text-brand-700">Locking Flight Dates</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-1 opacity-80">
                    <div className="flex items-center justify-between text-zinc-700">
                      <span className="text-xs font-semibold">3. Flex Printing</span>
                      <span className="text-xs font-sans text-zinc-500 font-medium">Step 3</span>
                    </div>
                    <p className="text-xs text-zinc-500">Awaiting Artwork approval</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-1 opacity-80">
                    <div className="flex items-center justify-between text-zinc-700">
                      <span className="text-xs font-semibold">4. Live Mounting</span>
                      <span className="text-xs font-sans text-zinc-500 font-medium">Step 4</span>
                    </div>
                    <p className="text-xs text-zinc-500">Geo-tag photo verification</p>
                  </div>
                </div>
              </div>

              {/* Asset & Campaign Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-zinc-100 text-xs font-sans">
                <div className="space-y-3">
                  <span className="text-xs font-sans font-semibold text-zinc-500 uppercase">
                    Billboard Asset
                  </span>
                  <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/70 space-y-1.5">
                    <h3 className="font-semibold text-zinc-900 text-sm">{foundBooking.resourceName}</h3>
                    <p className="text-zinc-500">
                      {foundBooking.locationArea}, {foundBooking.city} ({foundBooking.resourceType})
                    </p>
                    <div className="pt-1 flex items-center gap-1.5 text-emerald-700 font-semibold text-xs">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Verified Partner Inventory</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <span className="text-xs font-sans font-semibold text-zinc-500 uppercase">
                    Campaign Schedule
                  </span>
                  <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/70 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-500">Brand / Client:</span>
                      <span className="font-semibold text-zinc-900">{foundBooking.brandName}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-500">Flight Window:</span>
                      <span className="font-sans font-semibold text-zinc-900">
                        {foundBooking.startDate} to {foundBooking.endDate} ({foundBooking.durationDays} Days)
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-500">Flex Artwork:</span>
                      <span className="font-semibold text-zinc-800">{foundBooking.artworkStatus}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Financial Estimates */}
              <div className="pt-4 border-t border-zinc-100 space-y-2 text-xs">
                <span className="text-xs font-mono font-semibold text-zinc-400 uppercase">
                  Financial Summary (Estimated Proforma)
                </span>
                <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/70 space-y-2">
                  <div className="flex items-center justify-between text-zinc-600">
                    <span>Base Display Rental ({foundBooking.durationDays} Days):</span>
                    <span className="font-semibold text-zinc-900">{formatCurrencyINR(foundBooking.rentalAmount)}</span>
                  </div>
                  {foundBooking.mountingAmount ? (
                    <div className="flex items-center justify-between text-zinc-600">
                      <span>Mounting & Rigging (Mandatory Provider):</span>
                      <span className="font-semibold text-zinc-900">{formatCurrencyINR(foundBooking.mountingAmount)}</span>
                    </div>
                  ) : null}
                  {foundBooking.printingAmount ? (
                    <div className="flex items-center justify-between text-zinc-600">
                      <span>Flex Printing (Optional):</span>
                      <span className="font-semibold text-zinc-900">{formatCurrencyINR(foundBooking.printingAmount)}</span>
                    </div>
                  ) : (!foundBooking.mountingAmount && foundBooking.printingMountingAmount > 0) ? (
                    <div className="flex items-center justify-between text-zinc-600">
                      <span>Flex Printing & Professional Mounting:</span>
                      <span className="font-semibold text-zinc-900">{formatCurrencyINR(foundBooking.printingMountingAmount)}</span>
                    </div>
                  ) : null}
                  <div className="flex items-center justify-between text-zinc-600">
                    <span>Estimated Goods & Services Tax (GST 18%):</span>
                    <span className="font-semibold text-zinc-900">{formatCurrencyINR(foundBooking.estimatedGst)}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-zinc-200 text-sm font-semibold text-zinc-900">
                    <span>Total Proforma Value:</span>
                    <span className="text-[#B00020]">{formatCurrencyINR(foundBooking.totalEstimatedAmount)}</span>
                  </div>
                </div>
              </div>

              {/* Contact Assistance */}
              <div className="p-4 rounded-2xl bg-brand-50 border border-brand-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-brand-950">
                  <PhoneCall className="w-4 h-4 text-[#B00020] shrink-0" />
                  <span>Questions about this booking? Contact your dedicated OOH flight manager:</span>
                </div>
                <a
                  href="tel:+918000998877"
                  className="font-semibold text-[#B00020] hover:text-brand-800 underline shrink-0"
                >
                  +91 8000 998 877
                </a>
              </div>
            </div>
          </div>
        ) : (
          searched && (
            <div className="bg-white rounded-3xl border border-zinc-200/90 p-12 text-center max-w-md mx-auto space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-zinc-100 text-zinc-500 flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-base text-zinc-900">No Booking Found</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                We couldn't locate any booking matching reference code "{searchCode}". Please check the code in your confirmation screen or contact our support team.
              </p>
              <div className="pt-2">
                <Link
                  href="/explore"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#B00020] hover:bg-brand-700 text-white font-semibold text-xs cursor-pointer"
                >
                  <span>Explore Hoardings Catalog</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
