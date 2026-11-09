'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Calculator, 
  Sparkles, 
  ArrowRight, 
  TrendingUp, 
  Eye, 
  MapPin, 
  Calendar, 
  IndianRupee, 
  Layers, 
  ShieldCheck 
} from 'lucide-react';
import { formatCurrencyINR } from '@/lib/utils';
import { POPULAR_CITIES } from '@/data/mockMarketplaceData';

export const CampaignPlannerWidget: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState('Mumbai');
  const [budget, setBudget] = useState(250000);
  const [durationDays, setDurationDays] = useState(30);

  // Dynamic calculations based on outdoor media industry benchmarks
  const metrics = useMemo(() => {
    // City multiplier for average daily traffic
    const cityMultipliers: Record<string, number> = {
      Mumbai: 1.25,
      'Delhi NCR': 1.2,
      Bengaluru: 1.1,
      Hyderabad: 0.95,
      Pune: 0.85,
      Chennai: 0.9,
    };

    const multiplier = cityMultipliers[selectedCity] || 1.0;
    
    // Average daily impressions per 1L budget in metro
    const baseDailyImpressionsPer100k = 85000;
    const estimatedDailyImpressions = Math.round(
      (budget / 100000) * baseDailyImpressionsPer100k * multiplier
    );
    const totalCampaignImpressions = estimatedDailyImpressions * durationDays;
    
    // CPM Calculation = (Total Cost / Total Impressions) * 1000
    const estimatedCPM = Math.max(12, Math.round((budget / totalCampaignImpressions) * 1000));
    
    // Recommended asset mix
    let recommendedMix = '1 Prime Flyover Unipole or 2 High-Street Billboards';
    if (budget < 120000) {
      recommendedMix = '1 Arterial Road Front-Lit Billboard or 3 Bus Shelters';
    } else if (budget >= 400000) {
      recommendedMix = '1 High-Dwell DOOH LED Screen + 2 Highway Cantilever Unipoles';
    }

    return {
      dailyImpressions: estimatedDailyImpressions,
      totalImpressions: totalCampaignImpressions,
      cpm: estimatedCPM,
      mix: recommendedMix,
    };
  }, [selectedCity, budget, durationDays]);

  return (
    <section id="reach-planner" className="w-full bg-[#f8f9fb] border-y border-zinc-200/80 py-12 sm:py-16">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 text-zinc-900">
        {/* Section Eyebrow & Title */}
        <div className="mb-8 space-y-1.5">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#B00020] uppercase tracking-wider">
            <Calculator className="w-3.5 h-3.5" />
            <span>Audited Metrics & Forecasting</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold text-zinc-900 tracking-tight font-sans">
            Interactive OOH Reach & Budget Planner
          </h2>
          <p className="text-zinc-600 text-xs sm:text-sm max-w-2xl text-pretty">
            Tune your media budget and target metro to preview real-time vehicle impression counts and effective CPM.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Interactive Inputs */}
          <div className="lg:col-span-6 space-y-6">
            {/* 1. Target Metro Hub Pills */}
            <div className="space-y-2">
              <label className="text-[11px] uppercase font-semibold text-zinc-500 flex items-center justify-between tracking-wide">
                <span>Target Metro Market</span>
                <span className="text-[#B00020] font-semibold">{selectedCity}</span>
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {POPULAR_CITIES.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedCity(c.name)}
                    className={`px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer text-center ${
                      selectedCity === c.name
                        ? 'bg-[#B00020] text-white shadow-sm'
                        : 'bg-white hover:bg-zinc-100 text-zinc-700 border border-zinc-200/80'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Budget Range Slider */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="uppercase font-semibold text-zinc-500 tracking-wide text-[11px]">
                  Monthly Media Budget:
                </span>
                <span className="text-2xl font-semibold text-[#B00020] tracking-tight">
                  {formatCurrencyINR(budget)}
                </span>
              </div>
              <input
                type="range"
                min="60000"
                max="1000000"
                step="20000"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-[#B00020]"
              />
              <div className="flex justify-between text-xs text-zinc-500 font-normal">
                <span>₹60k (Local)</span>
                <span>₹2.5L (Corridor)</span>
                <span>₹5L (Multi-Site)</span>
                <span>₹10L+ (Metro Impact)</span>
              </div>
            </div>

            {/* 3. Duration Tabs */}
            <div className="space-y-2">
              <label className="text-[11px] uppercase font-semibold text-zinc-500 block tracking-wide">
                Flight Duration
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[15, 30, 60, 90].map((days) => (
                  <button
                    key={days}
                    onClick={() => setDurationDays(days)}
                    className={`py-2 px-3 rounded-xl text-xs font-medium transition-all text-center cursor-pointer ${
                      durationDays === days
                        ? 'bg-zinc-900 text-white shadow-xs'
                        : 'bg-white hover:bg-zinc-100 text-zinc-700 border border-zinc-200/80'
                    }`}
                  >
                    {days} Days
                  </button>
                ))}
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-2">
              <Link
                href={`/explore?city=${encodeURIComponent(selectedCity)}`}
                className="w-full py-3.5 px-6 rounded-full bg-[#B00020] hover:bg-[#8f0019] text-white font-medium text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-brand-500/20 cursor-pointer active:scale-98"
              >
                <span>Generate Campaign Media Plan</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Column: 4 Clean Stat Projection Cards (2x2 Grid) */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Card 1: Estimated Daily Impressions */}
            <div className="bg-white rounded-2xl border border-zinc-200/80 p-5 shadow-xs space-y-2">
              <div className="w-8 h-1 bg-[#B00020] rounded-full" />
              <span className="text-[11px] uppercase font-semibold text-zinc-500 block tracking-wider">
                Estimated Daily Impressions
              </span>
              <div className="text-2xl sm:text-3xl font-semibold text-zinc-900 tracking-tight">
                {metrics.dailyImpressions.toLocaleString('en-IN')}+
              </div>
              <p className="text-xs text-zinc-500 font-normal">
                Audited commuter footfall & vehicles in {selectedCity}
              </p>
            </div>

            {/* Card 2: Total Campaign Reach */}
            <div className="bg-white rounded-2xl border border-zinc-200/80 p-5 shadow-xs space-y-2">
              <div className="w-8 h-1 bg-emerald-500 rounded-full" />
              <span className="text-[11px] uppercase font-semibold text-zinc-500 block tracking-wider">
                Total Campaign Reach
              </span>
              <div className="text-2xl sm:text-3xl font-semibold text-zinc-900 tracking-tight">
                {Math.round(metrics.totalImpressions / 100000)} Lakhs
              </div>
              <p className="text-xs text-zinc-500 font-normal">
                Gross impressions across {durationDays} campaign days
              </p>
            </div>

            {/* Card 3: Effective CPM */}
            <div className="bg-white rounded-2xl border border-zinc-200/80 p-5 shadow-xs space-y-2">
              <div className="w-8 h-1 bg-blue-500 rounded-full" />
              <span className="text-[11px] uppercase font-semibold text-zinc-500 block tracking-wider">
                Effective CPM
              </span>
              <div className="text-2xl sm:text-3xl font-semibold text-zinc-900 tracking-tight">
                ₹{metrics.cpm} CPM
              </div>
              <p className="text-xs text-zinc-500 font-normal">
                Cost per 1,000 audited driver impressions
              </p>
            </div>

            {/* Card 4: Recommended Asset Mix */}
            <div className="bg-white rounded-2xl border border-zinc-200/80 p-5 shadow-xs space-y-2">
              <div className="w-8 h-1 bg-purple-500 rounded-full" />
              <span className="text-[11px] uppercase font-semibold text-zinc-500 block tracking-wider">
                Recommended Asset Mix
              </span>
              <div className="text-sm font-semibold text-zinc-900 leading-snug">
                {metrics.mix}
              </div>
              <p className="text-xs text-zinc-500 font-normal">
                Optimized format configuration for your budget
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
