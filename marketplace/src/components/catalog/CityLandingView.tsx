'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  MapPin, 
  ShieldCheck, 
  ArrowRight, 
  Layers, 
  HelpCircle, 
  CheckCircle2, 
  ChevronDown,
  Sparkles,
  Search,
  Filter
} from 'lucide-react';
import { MarketplaceResource } from '@/types/marketplace';
import { ResourceCard } from '@/components/catalog/ResourceCard';
import { GuestBookingModal } from '@/components/booking/GuestBookingModal';

interface CityLandingViewProps {
  cityName: string;
  stateName: string;
  resources: MarketplaceResource[];
  averagePriceText: string;
}

export const CityLandingView: React.FC<CityLandingViewProps> = ({
  cityName,
  stateName,
  resources,
  averagePriceText,
}) => {
  const [selectedResource, setSelectedResource] = useState<MarketplaceResource | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: `What is the average cost of hoarding advertising in ${cityName}?`,
      a: `Billboard and hoarding rental rates in ${cityName} typically start from ${averagePriceText} per month for prime arterial corridors (e.g. flyovers and key transit junctions). Exact pricing depends on the display dimensions, traffic impressions, and whether the site is front-lit, back-lit, or a digital LED screen. SODAARS offers transparent direct-from-owner pricing without broker markups.`,
    },
    {
      q: `What are the top outdoor advertising corridors in ${cityName}?`,
      a: `Key high-impact corridors in ${cityName} include major financial districts, IT tech parks, airport approach roads, and major elevated flyovers where vehicle dwell times during peak rush hours are highest.`,
    },
    {
      q: `How do I book hoardings in ${cityName} on SODAARS?`,
      a: `Select your preferred billboard, choose your campaign flight dates, and submit an instant booking inquiry. Our Verified Partner locks your dates, handles flex printing and mounting, and provides date-stamped, geo-tagged night illumination proof.`,
    },
    {
      q: `What is the minimum booking flight period in ${cityName}?`,
      a: `Standard outdoor advertising campaigns in ${cityName} can be booked for a minimum duration of 15 days or 1 month. Longer 3 to 6-month bookings qualify for exclusive verified partner discounts.`,
    },
  ];

  return (
    <div className="min-h-screen bg-[#fafafc] pb-20">
      {/* City Hero Banner */}
      <section className="bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 text-white py-14 sm:py-20 px-4 sm:px-8 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-950/80 border border-brand-500/30 text-rose-300 text-xs font-sans font-medium">
            <MapPin className="w-3.5 h-3.5" />
            <span>{cityName}, {stateName} Hub</span>
            <span className="text-zinc-500">•</span>
            <span>{resources.length} Verified Hoardings Active</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-white leading-tight text-balance">
            Outdoor Hoardings & Billboard Advertising in{' '}
            <span className="text-rose-400">
              {cityName}
            </span>
          </h1>

          <p className="text-zinc-300 text-sm sm:text-base max-w-xl leading-relaxed text-pretty">
            Discover and book verified outdoor advertising assets across {cityName}. View high-resolution Day & Night visibility photos, daily audited traffic counts, and exact GPS coordinates with zero middleman markup.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-sans text-zinc-400 font-medium">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Verified Partners</span>
            </span>
            <span className="flex items-center gap-1.5 text-zinc-300">
              <span>Avg Rate:</span>
              <strong className="text-white">{averagePriceText}</strong>
            </span>
            <span className="flex items-center gap-1.5 text-brand-300">
              <Sparkles className="w-4 h-4" />
              <span>Instant Guest Booking Request</span>
            </span>
          </div>
        </div>
      </section>

      {/* Main Content & Hoardings Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-12">
        {/* Inventory Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-zinc-900 tracking-tight text-balance">
              Available Hoardings in {cityName}
            </h2>
            <p className="text-xs text-zinc-600 mt-0.5">
              Showing active inventory pre-cleared for immediate campaign flighting.
            </p>
          </div>

          <Link
            href={`/explore?city=${encodeURIComponent(cityName)}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#B00020] hover:bg-brand-700 text-white text-xs font-semibold transition-all shadow-xs self-start sm:self-auto cursor-pointer"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Open in Full Explorer</span>
          </Link>
        </div>

        {/* Resources Grid */}
        {resources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource) => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                onQuickBook={(item) => setSelectedResource(item)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-zinc-200 p-12 text-center max-w-lg mx-auto space-y-3">
            <MapPin className="w-10 h-10 text-[#B00020] mx-auto" />
            <h3 className="font-semibold text-base text-zinc-900">
              New {cityName} hoardings currently undergoing audit
            </h3>
            <p className="text-xs text-zinc-600">
              Our operations team is verifying new media assets in {cityName}. Contact our planning desk for offline availability.
            </p>
            <div className="pt-2">
              <Link
                href="/explore"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 text-white text-xs font-semibold cursor-pointer"
              >
                <span>Browse Other Cities</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

        {/* Programmatic SEO FAQ Section */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 border border-zinc-200/90 shadow-2xs space-y-6">
          <div className="max-w-2xl">
            <h2 className="text-xl sm:text-2xl font-semibold text-zinc-900 tracking-tight text-balance">
              Frequently Asked Questions About Billboard Advertising in {cityName}
            </h2>
            <p className="text-xs text-zinc-600 mt-1">
              Essential media planning guidelines, pricing benchmarks, and execution processes.
            </p>
          </div>

          <div className="divide-y divide-zinc-200 border-y border-zinc-200">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="py-2">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between py-4 text-left font-semibold text-sm text-zinc-900 hover:text-[#B00020] transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-zinc-500 shrink-0 transition-transform ${
                        isOpen ? 'rotate-180 text-[#B00020]' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="pb-4 text-xs text-zinc-600 leading-relaxed max-w-prose text-pretty">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* Guest Booking Modal */}
      {selectedResource && (
        <GuestBookingModal
          resource={selectedResource}
          onClose={() => setSelectedResource(null)}
        />
      )}
    </div>
  );
};
