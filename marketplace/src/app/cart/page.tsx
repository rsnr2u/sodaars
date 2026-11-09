'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  ShoppingBag, 
  Trash2, 
  ArrowRight, 
  Download, 
  PlusCircle, 
  ShieldCheck, 
  Layers, 
  Building2, 
  Calendar, 
  CheckCircle2, 
  Filter, 
  FileSpreadsheet, 
  MapPin, 
  Eye, 
  Clock,
  Sparkles,
  HelpCircle,
  FileCheck2,
  AlertCircle
} from 'lucide-react';
import { useCart, CartItem } from '@/context/CartContext';
import { formatCurrencyINR } from '@/lib/utils';
import { generateSampleHoardings } from '@/lib/bulkHoardingGenerator';

export default function CartMediaPlanPage() {
  const {
    items,
    removeFromCart,
    clearCart,
    updateDuration,
    updatePrinting,
    bulkSetDuration,
    bulkSetPrinting,
    totalCount,
    totalEffectiveRental,
    totalMountingCost,
    totalPrintingCost,
    totalGst,
    grandTotal,
    totalDailyReach,
    totalSqFt,
    citiesCovered,
    cityBreakdown,
    addMultipleToCart,
    exportMediaCartCSV,
  } = useCart();

  // Filters & State
  const [selectedCityFilter, setSelectedCityFilter] = useState<string>('All');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Checkout Modal State
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [campaignName, setCampaignName] = useState('Metro Brand Campaign 2026');
  const [clientName, setClientName] = useState('Apex Marketing Labs Pvt Ltd');
  const [clientEmail, setClientEmail] = useState('campaigns@brand.in');
  const [clientPhone, setClientPhone] = useState('+91 98201 44521');
  const [clientGstin, setClientGstin] = useState('27AABCA1234F1Z8');
  const [flightStartDate, setFlightStartDate] = useState('2026-12-01');
  const [paymentOption, setPaymentOption] = useState<'escrow-token' | 'proforma'>('escrow-token');
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);

  // Filtered items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const res = item.resource;
      const matchCity = selectedCityFilter === 'All' || res.location.city.toLowerCase() === selectedCityFilter.toLowerCase();
      const matchType = selectedTypeFilter === 'All' || res.type === selectedTypeFilter;
      const matchSearch = searchQuery === '' || 
        res.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.location.area.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCity && matchType && matchSearch;
    });
  }, [items, selectedCityFilter, selectedTypeFilter, searchQuery]);

  const handleAddDemo50 = () => {
    const demo = generateSampleHoardings(50);
    addMultipleToCart(demo);
  };

  const handleAddDemo100 = () => {
    const demo = generateSampleHoardings(100);
    addMultipleToCart(demo);
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const refCode = `CAM-${Math.floor(100000 + Math.random() * 900000)}`;
    setBookingSuccess(refCode);
  };

  return (
    <div className="min-h-screen bg-[#fafafc] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#B00020]">
              <ShoppingBag className="w-4 h-4" />
              <span>Agency & Advertiser Media Cart</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-zinc-900 tracking-tight mt-1">
              Media Cart ({totalCount} Hoardings)
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
              Review and customize duration, printing, and escrow terms for your multi-city outdoor advertising campaign.
            </p>
          </div>

          {/* Quick Actions (Export, Demo Loaders) */}
          <div className="flex flex-wrap items-center gap-2">
            {items.length > 0 && (
              <button
                type="button"
                onClick={() => exportMediaCartCSV(campaignName)}
                className="px-4 py-2 rounded-full border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                title="Download spreadsheet formatted for client presentations"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                <span>Export Media Cart (CSV)</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleAddDemo50}
              className="px-3.5 py-2 rounded-full border border-dashed border-[#B00020] bg-rose-50/50 hover:bg-rose-50 text-[#B00020] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>+ Add 50 Hoardings</span>
            </button>

            <button
              type="button"
              onClick={handleAddDemo100}
              className="px-3.5 py-2 rounded-full border border-dashed border-[#B00020] bg-rose-50/50 hover:bg-rose-50 text-[#B00020] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>+ Add 100 Hoardings</span>
            </button>
          </div>
        </div>

        {items.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-3xl border border-zinc-200/80 p-12 text-center space-y-4 shadow-xs max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-rose-50 text-[#B00020] flex items-center justify-center mx-auto">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-zinc-900">Your Media Cart is Empty</h2>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                Add hoardings, unipoles, and DOOH screens from our verified marketplace to build your multi-city media cart.
              </p>
            </div>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/explore"
                className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#B00020] hover:bg-[#8f0019] text-white text-xs font-semibold transition-colors shadow-xs"
              >
                Explore All Hoardings
              </Link>
              <button
                type="button"
                onClick={handleAddDemo50}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full border border-zinc-200 hover:bg-zinc-50 text-zinc-700 text-xs font-semibold transition-colors cursor-pointer"
              >
                + Load 50 Sample Hoardings
              </button>
            </div>
          </div>
        ) : (
          /* Active Cart with Hoardings */
          <div className="space-y-6">
            
            {/* 1. EXECUTIVE METRICS BAR (Total Reach, Rental, Mandatory Mounting, Printing, Total) */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="bg-white p-3.5 rounded-2xl border border-zinc-200/80 shadow-2xs">
                <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block">Total Assets</span>
                <span className="text-xl font-semibold text-zinc-900 mt-0.5 block">{totalCount} Hoardings</span>
                <span className="text-[11px] text-zinc-500 font-normal mt-0.5 block">{citiesCovered.length} Metros</span>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-zinc-200/80 shadow-2xs">
                <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block">Est. Daily Reach</span>
                <span className="text-xl font-semibold text-zinc-900 mt-0.5 block">
                  ~{(totalDailyReach / 100000).toFixed(1)} Lakh
                </span>
                <span className="text-[11px] text-zinc-500 font-normal mt-0.5 block">Daily Impressions</span>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-zinc-200/80 shadow-2xs">
                <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block">Space Rental</span>
                <span className="text-xl font-semibold text-zinc-900 mt-0.5 block">
                  {formatCurrencyINR(totalEffectiveRental)}
                </span>
                <span className="text-[11px] text-zinc-500 font-normal mt-0.5 block">Partner Direct Rate</span>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-emerald-200 bg-emerald-50/20 shadow-2xs">
                <span className="text-[10px] font-semibold text-emerald-800 uppercase tracking-wider block">Mandatory Mounting</span>
                <span className="text-xl font-semibold text-emerald-950 mt-0.5 block">
                  {formatCurrencyINR(totalMountingCost)}
                </span>
                <span className="text-[11px] text-emerald-700 font-normal mt-0.5 block">By Provider Crew</span>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-zinc-200/80 shadow-2xs">
                <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block">Flex Printing</span>
                <span className="text-xl font-semibold text-zinc-900 mt-0.5 block">
                  {totalPrintingCost > 0 ? formatCurrencyINR(totalPrintingCost) : '₹0'}
                </span>
                <span className="text-[11px] text-zinc-500 font-normal mt-0.5 block">
                  {totalPrintingCost > 0 ? 'Opted In' : 'Self-Supplied'}
                </span>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-rose-200 bg-rose-50/20 shadow-2xs">
                <span className="text-[10px] font-semibold text-[#B00020] uppercase tracking-wider block">Campaign Total</span>
                <span className="text-xl font-semibold text-[#B00020] mt-0.5 block">
                  {formatCurrencyINR(grandTotal)}
                </span>
                <span className="text-[11px] text-zinc-500 font-normal mt-0.5 block">Incl. Rigging & GST</span>
              </div>
            </div>

            {/* 2. AGENCY BULK CONTROLS & FILTER TOOLBAR */}
            <div className="bg-white rounded-3xl border border-zinc-200/80 p-4 sm:p-5 shadow-xs space-y-4">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                
                {/* City Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                  <span className="text-xs font-semibold text-zinc-500 mr-1 shrink-0">Metro:</span>
                  <button
                    type="button"
                    onClick={() => setSelectedCityFilter('All')}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer shrink-0 ${
                      selectedCityFilter === 'All'
                        ? 'bg-[#B00020] text-white shadow-xs'
                        : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
                    }`}
                  >
                    All ({items.length})
                  </button>
                  {Object.entries(cityBreakdown).map(([city, count]) => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => setSelectedCityFilter(city)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer shrink-0 ${
                        selectedCityFilter === city
                          ? 'bg-[#B00020] text-white shadow-xs'
                          : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
                      }`}
                    >
                      {city} ({count})
                    </button>
                  ))}
                </div>

                {/* Bulk Duration & Printing Buttons */}
                <div className="flex flex-wrap items-center gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-zinc-100">
                  <div className="flex items-center gap-1 text-xs">
                    <span className="text-[11px] text-zinc-500 font-medium mr-1">Set All Flight:</span>
                    {([15, 30, 60] as const).map((days) => (
                      <button
                        key={days}
                        type="button"
                        onClick={() => bulkSetDuration(days)}
                        className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition-colors cursor-pointer"
                      >
                        {days}d
                      </button>
                    ))}
                  </div>

                  <span className="text-zinc-300">|</span>

                  <button
                    type="button"
                    onClick={() => bulkSetPrinting(true)}
                    className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition-colors cursor-pointer"
                  >
                    + Add Flex Print to All
                  </button>

                  <span className="text-zinc-300">|</span>

                  <button
                    type="button"
                    onClick={clearCart}
                    className="text-xs text-zinc-400 hover:text-rose-600 transition-colors cursor-pointer"
                  >
                    Clear Plan
                  </button>
                </div>

              </div>
            </div>

            {/* 3. ITEM LIST (High-Density Cards optimized for 50-100 assets) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-zinc-500 px-1">
                <span>
                  Showing {filteredItems.length} of {items.length} hoardings in cart
                </span>
                <span className="text-[11px]">
                  All inventory guaranteed by <strong>Verified Partner</strong> protocol
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {filteredItems.map((item, idx) => {
                  const res = item.resource;
                  const durationFactor = item.durationDays / 30;
                  const itemRental = Math.round(res.marketplacePrice * durationFactor);
                  const itemMounting = Math.round((res.mountingRatePerSqFt || 6) * res.totalSqFt);
                  const itemPrinting = item.includePrinting
                    ? Math.round((res.printingRatePerSqFt || 14) * res.totalSqFt)
                    : 0;
                  const itemSubtotal = itemRental + itemMounting + itemPrinting;

                  return (
                    <div
                      key={`${res.id}-${idx}`}
                      className="bg-white rounded-2xl border border-zinc-200/80 p-4 shadow-2xs hover:border-zinc-300 transition-all flex flex-col justify-between space-y-3"
                    >
                      <div className="flex gap-3.5">
                        <div className="w-24 h-20 rounded-xl overflow-hidden bg-zinc-100 shrink-0 relative">
                          <img
                            src={res.primaryPhotoUrl}
                            alt={res.name}
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded text-[9px] font-semibold bg-black/75 text-white">
                            {res.type}
                          </span>
                        </div>

                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-start justify-between gap-1">
                            <span className="text-[10px] uppercase font-semibold text-[#B00020] tracking-wider truncate">
                              {res.location.city} • {res.location.area}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeFromCart(res.id)}
                              className="text-zinc-400 hover:text-rose-600 p-1 transition-colors cursor-pointer"
                              title="Remove from media cart"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <h3 className="text-xs sm:text-sm font-semibold text-zinc-900 leading-snug line-clamp-1">
                            {res.name}
                          </h3>

                          <p className="text-[11px] text-zinc-500 truncate">
                            {res.widthFt} × {res.heightFt} ft • {res.totalSqFt} sq.ft • {res.orientation || res.illumination}
                          </p>

                          <div className="flex items-center gap-2 text-[10px] text-zinc-400">
                            <span>Traffic: {res.trafficDwellDaily}</span>
                          </div>
                        </div>
                      </div>

                      {/* Controls Bar for this Item */}
                      <div className="pt-2.5 border-t border-zinc-100 space-y-2 text-xs">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          {/* Flight Duration Selector */}
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] text-zinc-400 font-medium mr-1">Duration:</span>
                            {([15, 30, 60, 90] as const).map((days) => (
                              <button
                                key={days}
                                type="button"
                                onClick={() => updateDuration(res.id, days)}
                                className={`px-2 py-0.5 rounded-md text-[10px] font-semibold transition-colors cursor-pointer ${
                                  item.durationDays === days
                                    ? 'bg-zinc-900 text-white'
                                    : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
                                }`}
                              >
                                {days}d
                              </button>
                            ))}
                          </div>

                          {/* Mandatory Mounting Pill */}
                          <span className="text-[10px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                            Mounting: {formatCurrencyINR(itemMounting)} (Mandatory)
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-2 pt-0.5">
                          {/* Flex Printing Checkbox */}
                          <label className="flex items-center gap-1.5 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={item.includePrinting}
                              onChange={(e) => updatePrinting(res.id, e.target.checked)}
                              className="w-3.5 h-3.5 text-[#B00020] rounded border-zinc-300 focus:ring-[#B00020] cursor-pointer"
                            />
                            <span className="text-[11px] text-zinc-600 font-medium">
                              {item.includePrinting ? `Flex Print (+${formatCurrencyINR(itemPrinting)})` : 'Self-Supply Flex (₹0)'}
                            </span>
                          </label>

                          {/* Calculated Subtotal */}
                          <div className="text-right">
                            <span className="text-xs font-semibold text-[#B00020]">
                              {formatCurrencyINR(itemSubtotal)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 4. CAMPAIGN CHECKOUT BAR */}
            <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-1.5 max-w-xl">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-base sm:text-lg font-semibold text-zinc-900">
                    Ready to lock in {totalCount} hoarding slots?
                  </h3>
                </div>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Lock campaign dates under our 100% Escrow Protection. Media owners receive payment only upon verification of high-resolution geo-tagged photo proof.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                <div className="text-right sm:mr-4">
                  <span className="text-[10px] text-zinc-400 uppercase font-semibold block">Total Campaign Budget</span>
                  <span className="text-2xl font-semibold text-[#B00020] block">
                    {formatCurrencyINR(grandTotal)}
                  </span>
                  <span className="text-[10px] text-zinc-400 block">Includes Space Rental, Mandatory Rigging & 18% GST</span>
                </div>

                <button
                  type="button"
                  onClick={() => setCheckoutModalOpen(true)}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#B00020] hover:bg-[#8f0019] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 cursor-pointer"
                >
                  <span>Proceed to Campaign Escrow</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* 5. CHECKOUT & ESCROW RESERVATION MODAL */}
      {checkoutModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto font-sans">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity" onClick={() => setCheckoutModalOpen(false)} />
          
          <div className="min-h-full flex items-center justify-center p-4">
            <div className="relative bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 z-10 border border-zinc-200">
              
              {bookingSuccess ? (
                /* Success View */
                <div className="text-center space-y-4 py-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs uppercase font-semibold text-emerald-700 tracking-wider">
                      RESERVATION CONFIRMED
                    </span>
                    <h2 className="text-xl sm:text-2xl font-semibold text-zinc-900">
                      Media Cart Campaign Submitted!
                    </h2>
                    <p className="text-xs text-zinc-600 max-w-sm mx-auto">
                      Your booking reference code is <strong className="text-zinc-900 font-mono text-sm">{bookingSuccess}</strong>.
                      Our partner operations desk has locked all {totalCount} hoarding assets.
                    </p>
                  </div>

                  <div className="p-4 bg-zinc-50 rounded-2xl text-left text-xs space-y-1.5 border border-zinc-100">
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Campaign:</span>
                      <span className="font-semibold text-zinc-900">{campaignName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Assets Booked:</span>
                      <span className="font-semibold text-zinc-900">{totalCount} Hoardings ({citiesCovered.length} Metros)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Display Space Rental:</span>
                      <span className="font-semibold text-zinc-900">{formatCurrencyINR(totalEffectiveRental)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Mandatory Mounting Charges:</span>
                      <span className="font-semibold text-zinc-900">{formatCurrencyINR(totalMountingCost)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Flex Printing Charges:</span>
                      <span className="font-semibold text-zinc-900">{totalPrintingCost > 0 ? formatCurrencyINR(totalPrintingCost) : 'Self-Supplied (₹0)'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">GST (18% SAC 998315):</span>
                      <span className="font-semibold text-zinc-900">{formatCurrencyINR(totalGst)}</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-zinc-200 text-zinc-950 font-semibold">
                      <span>Total Escrow Value:</span>
                      <span className="text-[#B00020]">{formatCurrencyINR(grandTotal)}</span>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Link
                      href="/account"
                      onClick={() => {
                        setCheckoutModalOpen(false);
                        clearCart();
                      }}
                      className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#B00020] text-white text-xs font-semibold"
                    >
                      View in My Account Dashboard
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setCheckoutModalOpen(false);
                        clearCart();
                      }}
                      className="w-full sm:w-auto px-6 py-2.5 rounded-full border border-zinc-200 text-zinc-700 text-xs font-semibold hover:bg-zinc-50"
                    >
                      Close Window
                    </button>
                  </div>
                </div>
              ) : (
                /* Checkout Form */
                <>
                  <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
                    <div>
                      <h2 className="text-base sm:text-lg font-semibold text-zinc-900">
                        Confirm Campaign Escrow Booking
                      </h2>
                      <p className="text-xs text-zinc-500">
                        {totalCount} Hoardings across {citiesCovered.length} Metros • {formatCurrencyINR(grandTotal)}
                      </p>
                    </div>
                    <button
                      onClick={() => setCheckoutModalOpen(false)}
                      className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>

                  <form onSubmit={handleConfirmBooking} className="space-y-4 text-xs">
                    <div className="space-y-1.5">
                      <label className="font-semibold text-zinc-700">Campaign Name *</label>
                      <input
                        type="text"
                        required
                        value={campaignName}
                        onChange={(e) => setCampaignName(e.target.value)}
                        placeholder="e.g. Q4 Festive Metro Launch"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs font-medium text-zinc-900 focus:outline-none focus:border-[#B00020] bg-zinc-50/50"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div className="space-y-1.5">
                        <label className="font-semibold text-zinc-700">Company / Agency *</label>
                        <input
                          type="text"
                          required
                          value={clientName}
                          onChange={(e) => setClientName(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs font-medium text-zinc-900 focus:outline-none focus:border-[#B00020] bg-zinc-50/50"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-semibold text-zinc-700">GSTIN Number</label>
                        <input
                          type="text"
                          value={clientGstin}
                          onChange={(e) => setClientGstin(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs font-medium text-zinc-900 focus:outline-none focus:border-[#B00020] bg-zinc-50/50"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div className="space-y-1.5">
                        <label className="font-semibold text-zinc-700">Contact Email *</label>
                        <input
                          type="email"
                          required
                          value={clientEmail}
                          onChange={(e) => setClientEmail(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs font-medium text-zinc-900 focus:outline-none focus:border-[#B00020] bg-zinc-50/50"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-semibold text-zinc-700">Campaign Start Date *</label>
                        <input
                          type="date"
                          required
                          value={flightStartDate}
                          onChange={(e) => setFlightStartDate(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs font-medium text-zinc-900 focus:outline-none focus:border-[#B00020] bg-zinc-50/50"
                        />
                      </div>
                    </div>

                    {/* Escrow Option Selection */}
                    <div className="space-y-1.5 pt-1">
                      <label className="font-semibold text-zinc-700 block">Payment & Reservation Method:</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <label className={`p-3 rounded-xl border cursor-pointer transition-colors ${
                          paymentOption === 'escrow-token'
                            ? 'border-[#B00020] bg-rose-50/40 text-zinc-900'
                            : 'border-zinc-200 hover:bg-zinc-50 text-zinc-600'
                        }`}>
                          <input
                            type="radio"
                            name="paymentOption"
                            value="escrow-token"
                            checked={paymentOption === 'escrow-token'}
                            onChange={() => setPaymentOption('escrow-token')}
                            className="sr-only"
                          />
                          <div className="font-semibold text-xs text-zinc-900">20% Escrow Hold Token</div>
                          <div className="text-[11px] text-zinc-500 mt-0.5">
                            Instant lock for {totalCount} assets. Balance due upon photo proof verification.
                          </div>
                        </label>

                        <label className={`p-3 rounded-xl border cursor-pointer transition-colors ${
                          paymentOption === 'proforma'
                            ? 'border-[#B00020] bg-rose-50/40 text-zinc-900'
                            : 'border-zinc-200 hover:bg-zinc-50 text-zinc-600'
                        }`}>
                          <input
                            type="radio"
                            name="paymentOption"
                            value="proforma"
                            checked={paymentOption === 'proforma'}
                            onChange={() => setPaymentOption('proforma')}
                            className="sr-only"
                          />
                          <div className="font-semibold text-xs text-zinc-900">Corporate PO / Proforma</div>
                          <div className="text-[11px] text-zinc-500 mt-0.5">
                            Receive official GST proforma invoice for corporate finance approval.
                          </div>
                        </label>
                      </div>
                    </div>

                    <div className="pt-3">
                      <button
                        type="submit"
                        className="w-full py-3 px-6 rounded-full bg-[#B00020] hover:bg-[#8f0019] text-white font-semibold text-xs transition-all shadow-xs cursor-pointer active:scale-98 flex items-center justify-center gap-2"
                      >
                        <span>Confirm & Lock Media Cart ({formatCurrencyINR(grandTotal)})</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </form>
                </>
              )}

            </div>
          </div>
        </div>
      )}

    </div>
  );
}

