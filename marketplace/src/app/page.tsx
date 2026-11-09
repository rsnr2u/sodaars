import React, { Suspense } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  MapPin, 
  Eye, 
  Calendar, 
  ArrowRight, 
  Sparkles, 
  TrendingUp, 
  CheckCircle2, 
  Building2,
  Clock,
  Layers,
  Search,
  Globe,
  Award,
  Lock
} from 'lucide-react';
import { ExploreCatalogClient } from '@/components/catalog/ExploreCatalogClient';
import { CampaignPlannerWidget } from '@/components/home/CampaignPlannerWidget';
import { MOCK_MARKETPLACE_RESOURCES, POPULAR_CITIES } from '@/data/mockMarketplaceData';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#fafafc]">
      {/* HERO SECTION - AIRY, LIGHT & DIRECT MATCH TO SCREEN 1 */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-[#fff8f8] to-[#fafafc] text-zinc-900 pt-12 pb-14 sm:pt-16 sm:pb-16 px-4 sm:px-6 lg:px-8 border-b border-zinc-200/60">
        <div className="relative max-w-5xl mx-auto text-center space-y-4">
          {/* Main Headline with Integrated Kicker */}
          <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-semibold tracking-tight text-zinc-900 leading-[1.12] font-sans text-balance">
            <span className="block text-xs sm:text-sm font-semibold text-[#B00020] tracking-wide mb-3">
              Direct Concessionaire Rates • 100% Escrow Backed
            </span>
            Reach the right audience.<br />
            <span className="text-[#B00020]">Book the right hoardings.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm md:text-base text-zinc-600 max-w-2xl mx-auto font-normal leading-relaxed text-pretty">
            India's largest verified outdoor media exchange. Direct concessionaire rates, audited traffic metrics, and 100% escrow protection across 15+ metro hubs.
          </p>
        </div>

        {/* 4-COLUMN TRUST & PROOF METRICS STRIP */}
        <div className="max-w-5xl mx-auto mt-6 sm:mt-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 text-left">
            {/* Col 1: Pan-India Reach */}
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-zinc-200/80 shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-red-50 text-[#B00020] flex items-center justify-center shrink-0">
                <Globe className="w-4 h-4" />
              </div>
              <div className="space-y-0.5 min-w-0">
                <strong className="text-xs sm:text-sm font-semibold text-zinc-900 block truncate">Pan-India Reach</strong>
                <span className="text-xs text-zinc-500 block leading-tight truncate">50+ Tier-1 & 2 cities</span>
              </div>
            </div>

            {/* Col 2: 1,240+ Audited */}
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-zinc-200/80 shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                <Layers className="w-4 h-4" />
              </div>
              <div className="space-y-0.5 min-w-0">
                <strong className="text-xs sm:text-sm font-semibold text-zinc-900 block truncate">1,240+ Audited</strong>
                <span className="text-xs text-zinc-500 block leading-tight truncate">Direct inventory</span>
              </div>
            </div>

            {/* Col 3: Instant Slot Hold */}
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-zinc-200/80 shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <div className="space-y-0.5 min-w-0">
                <strong className="text-xs sm:text-sm font-semibold text-zinc-900 block truncate">Instant Slot Hold</strong>
                <span className="text-xs text-zinc-500 block leading-tight truncate">Lock flight dates</span>
              </div>
            </div>

            {/* Col 4: 100% Escrow Safe */}
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-zinc-200/80 shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="space-y-0.5 min-w-0">
                <strong className="text-xs sm:text-sm font-semibold text-zinc-900 block truncate">100% Escrow Safe</strong>
                <span className="text-xs text-zinc-500 block leading-tight truncate">Photo proof guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CATALOG EXPLORER (Left Filters + 4-Column Card Grid) */}
      <section className="w-full bg-[#fafafc] py-6 sm:py-8">
        <Suspense
          fallback={
            <div className="py-20 flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-3 border-[#B00020] border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-zinc-500 font-medium">Loading verified hoarding catalog...</p>
            </div>
          }
        >
          <ExploreCatalogClient showHeroHeader={false} />
        </Suspense>
      </section>

      {/* POPULAR METRO CITIES SECTION */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#B00020]">
              POPULAR METRO MARKETS
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold text-zinc-900 tracking-tight font-sans">
              Browse by Tier-1 Metro Hubs
            </h2>
          </div>
          <p className="text-zinc-500 text-xs sm:text-sm max-w-md">
            Target high-dwell commuter audiences across major expressway corridors and transit hubs.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {POPULAR_CITIES.map((city) => (
            <Link
              key={city.name}
              href={`/explore?city=${encodeURIComponent(city.name)}`}
              className="group rounded-2xl border border-zinc-200/80 bg-white hover:border-[#B00020] hover:shadow-md transition-all flex flex-col p-4 shadow-2xs"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-8 h-8 rounded-xl bg-brand-50 text-[#B00020] flex items-center justify-center font-semibold text-xs group-hover:bg-[#B00020] group-hover:text-white transition-colors duration-200">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="text-xs font-medium text-zinc-500">
                  {city.count}+ spots
                </span>
              </div>
              <h3 className="font-semibold text-zinc-900 text-sm group-hover:text-[#B00020] transition-colors">
                {city.name}
              </h3>
              <p className="text-xs text-[#B00020] mt-1 font-semibold">
                From {city.avgPrice}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* INTERACTIVE OOH REACH & BUDGET PLANNER (100% Light Theme) */}
      <CampaignPlannerWidget />

      {/* HOW IT WORKS 3 SIMPLE STEPS (Direct Match to Screen 1) */}
      <section id="how-it-works" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#B00020]">
            SIMPLE & TRANSPARENT
          </span>
          <h2 className="text-2xl sm:text-3xl font-semibold text-zinc-900 tracking-tight font-sans">
            Three Steps to Live Hoarding Campaigns
          </h2>
          <p className="text-zinc-600 text-xs sm:text-sm max-w-xl mx-auto">
            Effortless discovery and transparent execution designed for marketing teams, media agencies, and local business owners.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="p-7 rounded-3xl bg-white border border-zinc-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-full bg-brand-50 text-[#B00020] font-semibold text-sm flex items-center justify-center">
                  01
                </div>
                <Search className="w-5 h-5 text-zinc-400" />
              </div>
              <h3 className="font-semibold text-base text-zinc-900">Search & Inspect Sites</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Filter by city, format, illumination, and price. View certified daytime photos, night illumination shots, and driver approach angles.
              </p>
            </div>
            <Link href="/explore" className="text-xs font-semibold text-[#B00020] hover:underline flex items-center gap-1 pt-2">
              <span>Explore live inventory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Step 2 */}
          <div className="p-7 rounded-3xl bg-white border border-zinc-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 font-semibold text-sm flex items-center justify-center">
                  02
                </div>
                <Calendar className="w-5 h-5 text-zinc-400" />
              </div>
              <h3 className="font-semibold text-base text-zinc-900">Reserve Flight Dates</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Select your campaign start and end dates. Specify whether you need banner printing & mounting assistance. Get instant BKG reference.
              </p>
            </div>
            <Link href="/explore" className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1 pt-2">
              <span>Fast guest booking</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Step 3 */}
          <div className="p-7 rounded-3xl bg-white border border-zinc-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-800 font-semibold text-sm flex items-center justify-center">
                  03
                </div>
                <ShieldCheck className="w-5 h-5 text-zinc-400" />
              </div>
              <h3 className="font-semibold text-base text-zinc-900">Partner Execution & Proof</h3>
              <p className="text-xs text-zinc-600 leading-relaxed text-pretty">
                Our verified media concessionaire prints and mounts your creative. Funds stay safely held in escrow until geo-tagged photo proof is approved.
              </p>
            </div>
            <Link href="/track" className="text-xs font-semibold text-emerald-800 hover:underline flex items-center gap-1 pt-2">
              <span>100% escrow protection</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CONCESSIONAIRE CALL TO ACTION BANNER (Matching Screen 1) */}
      <section className="px-4 sm:px-6 lg:px-8 pb-16 max-w-[1440px] mx-auto w-full">
        <div className="rounded-3xl bg-brand-50/80 border border-brand-200/80 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#B00020] text-white flex items-center justify-center shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-zinc-900">
                Are you a Media Concessionaire or Billboard Concessionaire?
              </h3>
              <p className="text-xs sm:text-sm text-zinc-700 mt-0.5 text-pretty">
                Monetize your outdoor inventory with zero platform listing fees. Reach 5,000+ brand advertisers and agencies.
              </p>
            </div>
          </div>

          <a
            href="http://localhost:5173"
            target="_blank"
            rel="noreferrer"
            className="px-6 py-3 rounded-full bg-[#B00020] hover:bg-[#8f0019] text-white font-medium text-xs shrink-0 transition-all shadow-sm hover:shadow active:scale-98"
          >
            List Media Free
          </a>
        </div>
      </section>
    </div>
  );
}
