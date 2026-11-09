'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  ShieldCheck, 
  Eye, 
  Sun, 
  Moon, 
  Compass, 
  TrendingUp, 
  Calendar, 
  Share2, 
  PhoneCall, 
  CheckCircle2, 
  Sparkles, 
  Maximize2, 
  Printer, 
  FileCheck, 
  Info,
  Clock,
  Layers,
  Star,
  ArrowRight,
  ExternalLink,
  Car
} from 'lucide-react';
import { MarketplaceResource } from '@/types/marketplace';
import { formatCurrencyINR } from '@/lib/utils';
import { GuestBookingModal } from '@/components/booking/GuestBookingModal';
import { ResourceCard } from '@/components/catalog/ResourceCard';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, Check } from 'lucide-react';

interface ResourceDetailViewProps {
  resource: MarketplaceResource;
  relatedResources: MarketplaceResource[];
}

export const ResourceDetailView: React.FC<ResourceDetailViewProps> = ({
  resource,
  relatedResources,
}) => {
  const [photoMode, setPhotoMode] = useState<'day' | 'night' | 'approach'>('day');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [flightDuration, setFlightDuration] = useState<15 | 30 | 60>(30);
  const [includePrinting, setIncludePrinting] = useState(true);
  const { addToCart, isInCart, setIsDrawerOpen, totalCount } = useCart();
  const inCart = isInCart(resource.id);

  // Determine active photo
  const currentPhoto = 
    photoMode === 'night' && resource.nightPhotoUrl
      ? resource.nightPhotoUrl
      : photoMode === 'approach' && resource.approachPhotoUrl
      ? resource.approachPhotoUrl
      : resource.primaryPhotoUrl;

  const durationMultiplier = flightDuration === 15 ? 0.55 : flightDuration === 60 ? 1.9 : 1.0;
  const currentRentalPrice = Math.round(resource.marketplacePrice * durationMultiplier);
  // MANDATORY Mounting & Rigging by Provider (Charged by media owner for safety & municipal compliance)
  const mountingCost = Math.round(resource.totalSqFt * (resource.mountingRatePerSqFt || 6));
  // OPTIONAL Flex Printing (Advertiser or agency can supply their own printed flex or opt-in)
  const printingCost = includePrinting 
    ? Math.round(resource.totalSqFt * (resource.printingRatePerSqFt || 14))
    : 0;
  const proformaSubtotal = currentRentalPrice + mountingCost + printingCost;
  const estimatedGst = Math.round(proformaSubtotal * 0.18);
  const proformaTotal = proformaSubtotal + estimatedGst;

  const savings = resource.regularPrice - resource.marketplacePrice;
  const savingsPct = Math.round((savings / resource.regularPrice) * 100);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  // 12 Months Availability Visual Matrix
  const months = [
    { label: 'Nov 26', status: 'Available' },
    { label: 'Dec 26', status: 'Partially Booked' },
    { label: 'Jan 27', status: 'Available' },
    { label: 'Feb 27', status: 'Available' },
    { label: 'Mar 27', status: 'Booked' },
    { label: 'Apr 27', status: 'Available' },
    { label: 'May 27', status: 'Available' },
    { label: 'Jun 27', status: 'Available' },
    { label: 'Jul 27', status: 'Available' },
    { label: 'Aug 27', status: 'Available' },
    { label: 'Sep 27', status: 'Available' },
    { label: 'Oct 27', status: 'Available' },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 pb-24">
      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-zinc-200/90 py-3.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
          <nav className="flex items-center gap-2 text-zinc-500 overflow-x-auto">
            <Link href="/" className="hover:text-zinc-900 transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/explore" className="hover:text-zinc-900 transition-colors">
              Hoardings
            </Link>
            <span>/</span>
            <Link
              href={`/explore?city=${encodeURIComponent(resource.location.city)}`}
              className="hover:text-zinc-900 transition-colors"
            >
              {resource.location.city}
            </Link>
            <span>/</span>
            <span className="text-zinc-900 font-semibold truncate max-w-xs">
              {resource.name}
            </span>
          </nav>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg border border-zinc-200 hover:bg-zinc-50 text-zinc-700 text-xs font-semibold shrink-0 cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Left Column (Photos, Specs, Location, Calendar) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Asset Header Title & Badges */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-sans font-semibold uppercase tracking-wider bg-zinc-900 text-white">
                  {resource.type}
                </span>

                {/* Strict Platform Protection Badge */}
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-sans font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Verified Partner</span>
                </span>

                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-sans text-zinc-600 bg-zinc-100 font-medium">
                  <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                  <span>{resource.rating} ({resource.reviewCount} reviews)</span>
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-zinc-900 tracking-tight">
                {resource.name}
              </h1>

              <div className="flex items-center gap-2 text-zinc-600 text-xs sm:text-sm font-medium">
                <MapPin className="w-4 h-4 text-[#B00020] shrink-0" />
                <span>
                  {resource.location.landmark}, {resource.location.area}, {resource.location.city} - {resource.location.state}
                </span>
              </div>
            </div>

            {/* Interactive Image Gallery with Day/Night Switcher */}
            <div className="space-y-3">
              <div className="relative aspect-[16/10] w-full rounded-3xl overflow-hidden bg-zinc-950 border border-zinc-200/90 shadow-lg">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentPhoto}
                    src={currentPhoto}
                    alt={`${resource.name} - ${photoMode} view`}
                    initial={{ opacity: 0.7 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0.7 }}
                    transition={{ duration: 0.25 }}
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>

                {/* Day / Night Mode Selector Bar on top of image */}
                <div className="absolute top-4 right-4 flex items-center bg-black/75 backdrop-blur-md rounded-2xl p-1 border border-white/20 shadow-md z-10">
                  <button
                    onClick={() => setPhotoMode('day')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      photoMode === 'day'
                        ? 'bg-amber-500 text-zinc-950 shadow-xs'
                        : 'text-zinc-300 hover:text-white'
                    }`}
                  >
                    <Sun className="w-3.5 h-3.5" />
                    <span>Day Light</span>
                  </button>

                  {resource.nightPhotoUrl && (
                    <button
                      onClick={() => setPhotoMode('night')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        photoMode === 'night'
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'text-zinc-300 hover:text-white'
                      }`}
                    >
                      <Moon className="w-3.5 h-3.5" />
                      <span>Night Lit</span>
                    </button>
                  )}

                  {resource.approachPhotoUrl && (
                    <button
                      onClick={() => setPhotoMode('approach')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        photoMode === 'approach'
                          ? 'bg-[#B00020] text-white shadow-xs'
                          : 'text-zinc-300 hover:text-white'
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Approach</span>
                    </button>
                  )}
                </div>

                {/* Image caption tag */}
                <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-xl text-white text-xs font-sans border border-white/10 z-10">
                  <span className="text-zinc-400">Viewing: </span>
                  <span className="font-semibold capitalize">{photoMode} Perspective</span>
                  <span className="text-zinc-400"> • </span>
                  <span className="text-emerald-400">Audited High-Definition Proof</span>
                </div>
              </div>

              {/* Thumbnail Strip */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setPhotoMode('day')}
                  className={`relative w-24 h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                    photoMode === 'day' ? 'border-[#B00020] ring-2 ring-brand-500/20' : 'border-zinc-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={resource.primaryPhotoUrl} alt="Day thumbnail" className="w-full h-full object-cover" />
                  <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-xs font-sans bg-black/80 text-white font-semibold">
                    Day
                  </span>
                </button>

                {resource.nightPhotoUrl && (
                  <button
                    onClick={() => setPhotoMode('night')}
                    className={`relative w-24 h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                      photoMode === 'night' ? 'border-indigo-500 ring-2 ring-indigo-500/20' : 'border-zinc-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={resource.nightPhotoUrl} alt="Night thumbnail" className="w-full h-full object-cover" />
                    <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-xs font-sans bg-indigo-900/90 text-white font-semibold">
                      Night
                    </span>
                  </button>
                )}

                {resource.approachPhotoUrl && (
                  <button
                    onClick={() => setPhotoMode('approach')}
                    className={`relative w-24 h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                      photoMode === 'approach' ? 'border-[#B00020] ring-2 ring-brand-500/20' : 'border-zinc-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={resource.approachPhotoUrl} alt="Approach thumbnail" className="w-full h-full object-cover" />
                    <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-xs font-sans bg-brand-900/90 text-white font-semibold">
                      Angle
                    </span>
                  </button>
                )}
              </div>
            </div>

            {/* Quick Metrics Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-white rounded-3xl p-5 border border-zinc-100/90 shadow-[0_4px_25px_rgba(0,0,0,0.03)]">
              <div className="space-y-1">
                <span className="text-xs font-sans text-zinc-500 uppercase font-semibold">Dimensions</span>
                <p className="text-base font-semibold text-zinc-900">
                  {resource.widthFt} × {resource.heightFt} ft
                </p>
                <p className="text-xs text-[#B00020] font-semibold">{resource.totalSqFt} sq.ft</p>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-sans text-zinc-500 uppercase font-semibold">Illumination</span>
                <p className="text-base font-semibold text-zinc-900">{resource.illumination}</p>
                <p className="text-xs text-zinc-600 font-medium">Night Visibility Active</p>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-sans text-zinc-500 uppercase font-semibold">Daily Footfall</span>
                <p className="text-base font-semibold text-zinc-900">{resource.trafficDwellDaily}</p>
                <p className="text-xs text-emerald-800 font-semibold">High Dwell Corridor</p>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-sans text-zinc-500 uppercase font-semibold">Orientation</span>
                <p className="text-sm font-semibold text-zinc-900 leading-tight">{resource.orientation}</p>
                <p className="text-xs text-zinc-600">{resource.visibilityFacing}</p>
              </div>
            </div>

            {/* Comprehensive Specifications Table */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200/90 shadow-2xs space-y-5">
              <h2 className="text-xl font-semibold text-zinc-900 tracking-tight flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#B00020]" />
                <span>Technical Specifications & Media Characteristics</span>
              </h2>

              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                {resource.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 pt-4 border-t border-zinc-100 text-xs">
                <div className="flex items-center justify-between py-2 border-b border-zinc-100">
                  <span className="text-zinc-500">Structure Category:</span>
                  <span className="font-semibold text-zinc-900">{resource.type}</span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-zinc-100">
                  <span className="text-zinc-500">Illumination Type:</span>
                  <span className="font-semibold text-zinc-900">{resource.illumination}</span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-zinc-100">
                  <span className="text-zinc-500">Display Face Width:</span>
                  <span className="font-semibold text-zinc-900">{resource.widthFt} Feet</span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-zinc-100">
                  <span className="text-zinc-500">Display Face Height:</span>
                  <span className="font-semibold text-zinc-900">{resource.heightFt} Feet</span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-zinc-100">
                  <span className="text-zinc-500">Total Advertising Area:</span>
                  <span className="font-semibold text-zinc-900">{resource.totalSqFt} Sq.Ft</span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-zinc-100">
                  <span className="text-zinc-500">Traffic Heading:</span>
                  <span className="font-semibold text-zinc-900">{resource.orientation}</span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-zinc-100">
                  <span className="text-zinc-500">Sightline Visibility:</span>
                  <span className="font-semibold text-zinc-900">{resource.visibilityFacing}</span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-zinc-100">
                  <span className="text-zinc-500">Printing Flex Rate:</span>
                  <span className="font-semibold text-zinc-900">₹{resource.printingRatePerSqFt} / sq.ft (Optional - Can self-supply)</span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-zinc-100">
                  <span className="text-zinc-500">Mounting & Rigging Rate:</span>
                  <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded text-xs">
                    ₹{resource.mountingRatePerSqFt} / sq.ft (Mandatory Provider Crew)
                  </span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-zinc-100">
                  <span className="text-zinc-500">Listing Status:</span>
                  <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>{resource.status}</span>
                  </span>
                </div>
              </div>

              {/* Key Features Bullet List */}
              <div className="pt-4 space-y-2">
                <span className="text-xs font-sans font-semibold text-zinc-600 uppercase">
                  Highlights & Competitive Edge:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {resource.keyFeatures.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-zinc-700">
                      <Sparkles className="w-3.5 h-3.5 text-[#B00020] shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Location, Sightline Analysis & Geo-Coordinates */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-100/90 shadow-[0_4px_25px_rgba(0,0,0,0.03)] space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-zinc-100">
                <div>
                  <h2 className="text-xl font-semibold text-zinc-900 tracking-tight flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-[#B00020]" />
                    <span>Geographic Location & Sightline Analysis</span>
                  </h2>
                  <p className="text-xs text-zinc-600 mt-0.5">
                    Audited driver perspective, line-of-sight distance, and corridor dwell profile.
                  </p>
                </div>
                <a
                  href={`https://www.google.com/maps?q=${resource.location.latitude},${resource.location.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs font-semibold text-[#B00020] hover:text-brand-800 self-start sm:self-auto"
                >
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Sightline Radar Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-zinc-100 py-3 border-y border-zinc-100">
                <div className="sm:pr-4 space-y-1">
                  <span className="text-xs font-sans text-zinc-500 uppercase font-semibold block">
                    Unobstructed Sightline
                  </span>
                  <p className="text-base font-semibold text-zinc-950 font-sans">350+ Meters</p>
                  <p className="text-xs text-emerald-800 font-semibold">Zero tree/pole obstruction</p>
                </div>

                <div className="py-2 sm:py-0 sm:px-4 space-y-1">
                  <span className="text-xs font-sans text-zinc-500 uppercase font-semibold block">
                    Traffic Dwell Profile
                  </span>
                  <p className="text-base font-semibold text-zinc-950 font-sans">40 - 55 Seconds</p>
                  <p className="text-xs text-brand-900 font-semibold">Rush hour crawl zone</p>
                </div>

                <div className="pt-2 sm:pt-0 sm:pl-4 space-y-1">
                  <span className="text-xs font-sans text-zinc-500 uppercase font-semibold block">
                    Driver Angle
                  </span>
                  <p className="text-base font-semibold text-zinc-950 font-sans">Direct Frontal</p>
                  <p className="text-xs text-zinc-700 font-semibold">{resource.orientation}</p>
                </div>
              </div>

              {/* Exact Location & GPS Details */}
              <div className="p-4 rounded-2xl bg-zinc-50/80 space-y-2 text-xs">
                <div className="flex items-center gap-2 font-semibold text-zinc-900">
                  <span className="text-zinc-500">Major Arterial Corridor:</span>
                  <span className="text-brand-900 font-semibold">{resource.location.routeName || resource.location.area}</span>
                </div>
                <div className="text-zinc-700">
                  <span className="font-semibold text-zinc-900">Physical Landmark:</span> {resource.location.landmark}
                </div>
                <div className="font-sans text-xs text-zinc-600">
                  GPS Coordinates: {resource.location.latitude}° N, {resource.location.longitude}° E
                </div>
              </div>
            </div>

            {/* 12-Month Live Availability Visual Matrix */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-100/90 shadow-[0_4px_25px_rgba(0,0,0,0.03)] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-zinc-900 tracking-tight flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-[#B00020]" />
                    <span>Slot Availability Calendar (2026 - 2027)</span>
                  </h2>
                  <p className="text-xs text-zinc-600 mt-1">
                    Live schedule synchronized with our partner operations desk.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5 pt-2">
                {months.map((m) => (
                  <div
                    key={m.label}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      m.status === 'Available'
                        ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900'
                        : m.status === 'Partially Booked'
                        ? 'bg-amber-50/50 border-amber-200 text-amber-900'
                        : 'bg-zinc-100 border-zinc-200 text-zinc-600'
                    }`}
                  >
                    <div className="text-xs font-sans font-semibold">{m.label}</div>
                    <div className="text-xs font-semibold mt-1">
                      {m.status === 'Available' ? 'Available' : m.status === 'Partially Booked' ? 'Fast Filling' : 'Booked'}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-6 pt-2 text-xs font-sans text-zinc-600 border-t border-zinc-100">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span>Immediate Open Slot</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span>10-15 Days Open</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-zinc-400" />
                  <span>Fully Occupied</span>
                </span>
              </div>
            </div>
          </div>

          {/* Sticky Right Sidebar (Pricing & Booking Action Box) */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-6">
              {/* Pricing Box */}
              <div className="bg-white rounded-3xl border border-zinc-100/90 p-6 shadow-xl shadow-zinc-200/50 space-y-6">
                {/* Rate Card & Discount */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-sans uppercase font-semibold text-zinc-600">
                      Monthly Rental Rate
                    </span>
                    {savings > 0 && (
                      <span className="text-xs font-sans font-semibold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900">
                        SAVE {savingsPct}% ({formatCurrencyINR(savings)})
                      </span>
                    )}
                  </div>

                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-semibold text-zinc-900">
                      {formatCurrencyINR(resource.marketplacePrice)}
                    </span>
                    <span className="text-sm font-semibold text-zinc-500 line-through">
                      {formatCurrencyINR(resource.regularPrice)}
                    </span>
                    <span className="text-xs text-zinc-600 font-medium">/ month</span>
                  </div>
                </div>

                {/* Platform Protection & Provider Seal */}
                <div className="p-3.5 rounded-2xl bg-brand-50/80 space-y-1 text-xs">
                  <div className="flex items-center gap-1.5 font-semibold text-brand-950">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    <span>Verified Partner</span>
                  </div>
                  <p className="text-xs text-brand-950/80 leading-relaxed text-pretty">
                    Identity verified by SODAARS Operations Desk. 100% Escrow protected. Guaranteed date-stamped geo-tagged proof-of-posting.
                  </p>
                </div>

                {/* Instant Calculation Breakdown */}
                <div className="space-y-3 text-xs pt-2 border-t border-zinc-100">
                  {/* Flight Duration Selector */}
                  <div className="space-y-1.5">
                    <span className="text-xs font-sans text-zinc-600 uppercase font-semibold block">
                      Select Flight Duration:
                    </span>
                    <div className="grid grid-cols-3 gap-1.5">
                      {([15, 30, 60] as const).map((days) => (
                        <button
                          key={days}
                          type="button"
                          onClick={() => setFlightDuration(days)}
                          className={`py-1.5 px-2 rounded-xl text-xs font-semibold transition-all text-center cursor-pointer ${
                            flightDuration === days
                              ? 'bg-zinc-950 text-white shadow-xs'
                              : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-700 border border-zinc-200'
                          }`}
                        >
                          {days} Days
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Separate Mounting (Mandatory) & Flex Printing (Optional) */}
                  <div className="space-y-2">
                    {/* 1. Mandatory Mounting by Provider */}
                    <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/80 flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-white border border-zinc-200 flex items-center justify-center shrink-0 mt-0.5 overflow-hidden">
                        <img src="/mounting-rigger.png" alt="Mounting" className="w-8 h-8 object-contain" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-semibold text-zinc-900 text-xs flex items-center gap-1.5">
                            Mounting & Rigging
                            <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                              Mandatory
                            </span>
                          </span>
                          <span className="font-semibold text-zinc-900 text-xs">
                            {formatCurrencyINR(mountingCost)}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-500 mt-0.5 leading-snug">
                          Mandatory by provider (₹{resource.mountingRatePerSqFt || 6}/sq.ft). Structural rigging, safety cables & municipal compliance.
                        </p>
                      </div>
                    </div>

                    {/* 2. Optional Flex Printing */}
                    <label className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/80 flex items-start gap-3 cursor-pointer hover:bg-zinc-100/70 transition-colors">
                      <input
                        type="checkbox"
                        checked={includePrinting}
                        onChange={(e) => setIncludePrinting(e.target.checked)}
                        className="mt-0.5 w-4 h-4 text-[#B00020] rounded border-zinc-300 focus:ring-[#B00020] cursor-pointer"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-semibold text-zinc-900 text-xs">
                            Include Flex Printing
                          </span>
                          <span className="font-semibold text-zinc-900 text-xs">
                            {includePrinting ? `+${formatCurrencyINR(printingCost)}` : '₹0'}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-500 mt-0.5 leading-snug">
                          High-grade front-lit flex (₹{resource.printingRatePerSqFt || 14}/sq.ft). Uncheck if advertiser/agency supplies own printed flex.
                        </p>
                      </div>
                    </label>
                  </div>

                  <div className="space-y-2 pt-1 font-sans text-zinc-600">
                    <div className="flex items-center justify-between">
                      <span>Display Space Rental ({flightDuration}d):</span>
                      <span className="font-semibold text-zinc-900">{formatCurrencyINR(currentRentalPrice)}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        Mounting & Rigging ({resource.totalSqFt} sq.ft):
                        <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1 rounded font-medium">Provider</span>
                      </span>
                      <span className="font-semibold text-zinc-900">{formatCurrencyINR(mountingCost)}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span>Flex Printing ({resource.totalSqFt} sq.ft):</span>
                      <span className={`font-semibold ${includePrinting ? 'text-zinc-900' : 'text-zinc-400 font-normal italic'}`}>
                        {includePrinting ? formatCurrencyINR(printingCost) : 'Self-supplied by Advertiser (₹0)'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span>Estimated GST (18% SAC 998315):</span>
                      <span className="font-semibold text-zinc-900">{formatCurrencyINR(estimatedGst)}</span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-zinc-200 text-sm font-sans font-semibold text-zinc-950">
                      <span>Proforma Estimate:</span>
                      <span className="text-[#B00020] font-sans text-base font-semibold">
                        {formatCurrencyINR(proformaTotal)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Primary Booking & Cart Actions */}
                <div className="pt-2 space-y-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      addToCart(resource, flightDuration, includePrinting);
                      setIsDrawerOpen(true);
                    }}
                    className={`w-full py-3.5 px-6 rounded-2xl font-semibold text-xs transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer ${
                      inCart
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
                        : 'bg-zinc-900 hover:bg-zinc-800 text-white'
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4 text-rose-400" />
                    <span>
                      {inCart
                        ? `In Media Cart (${totalCount} Total) • View Cart`
                        : '+ Add to Media Cart'}
                    </span>
                  </button>

                  <button
                    onClick={() => setIsBookingModalOpen(true)}
                    className="w-full py-4 px-6 rounded-2xl bg-[#B00020] hover:bg-brand-700 text-white font-semibold text-sm tracking-wide transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Request Booking Inquiry</span>
                  </button>

                  <p className="text-xs text-center text-zinc-500">
                    No upfront payment required to submit inquiry • Fast response in 2-4 hours
                  </p>
                </div>

                {/* Direct Phone / Concierge Support */}
                <div className="pt-4 border-t border-zinc-100 flex items-center justify-between text-xs font-semibold text-zinc-700">
                  <div className="flex items-center gap-2">
                    <PhoneCall className="w-4 h-4 text-emerald-700" />
                    <span>Need planning help?</span>
                  </div>
                  <a
                    href="tel:+918000998877"
                    className="text-[#B00020] hover:text-brand-800 underline"
                  >
                    +91 8000 998 877
                  </a>
                </div>
              </div>

              {/* Trust Box */}
              <div className="bg-zinc-900 text-white rounded-3xl p-6 space-y-3">
                <div className="flex items-center gap-2 font-semibold text-sm text-zinc-100">
                  <FileCheck className="w-4 h-4 text-emerald-400" />
                  <span>SODAARS Buyer Guarantee</span>
                </div>
                <ul className="text-xs text-zinc-300 space-y-2 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>100% refund if flex mounting is delayed beyond promised flight start.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Geo-tagged and date-stamped night illumination verification photos.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Tax invoice with input tax credit (ITC) for GST registered businesses.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Prime Hoardings in City */}
      {relatedResources.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-8 pt-16">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-200">
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-zinc-900 tracking-tight">
                Similar Outdoor Hoardings in {resource.location.city}
              </h2>
            </div>

            <Link
              href={`/explore?city=${encodeURIComponent(resource.location.city)}`}
              className="text-xs font-semibold text-[#B00020] hover:text-brand-800 flex items-center gap-1 group cursor-pointer"
            >
              <span>View All {resource.location.city}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedResources.map((rel) => (
              <ResourceCard key={rel.id} resource={rel} />
            ))}
          </div>
        </section>
      )}

      {/* Booking Modal */}
      {isBookingModalOpen && (
        <GuestBookingModal
          resource={resource}
          onClose={() => setIsBookingModalOpen(false)}
        />
      )}
    </div>
  );
};
