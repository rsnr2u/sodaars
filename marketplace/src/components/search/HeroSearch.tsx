'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Layers, ArrowRight } from 'lucide-react';
import { POPULAR_CITIES } from '@/data/mockMarketplaceData';

const MEDIA_TYPES = [
  { value: 'all', label: 'All Types' },
  { value: 'Hoardings', label: 'Traditional Hoardings' },
  { value: 'Billboards', label: 'Large Format Billboards' },
  { value: 'Unipoles', label: 'Highway Unipoles' },
  { value: 'Gantries', label: 'Expressway Gantries' },
  { value: 'DOOH Screens', label: 'DOOH Digital Screens' },
  { value: 'Bus Shelters', label: 'Bus Shelters (BQS)' },
];

export const HeroSearch: React.FC<{
  initialCity?: string;
  initialType?: string;
  onSearch?: (city: string, type: string, query: string) => void;
}> = ({
  initialCity = 'all',
  initialType = 'all',
  onSearch,
}) => {
  const router = useRouter();
  const [city, setCity] = useState(initialCity);
  const [mediaType, setMediaType] = useState(initialType);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(city, mediaType, searchQuery);
      return;
    }
    const params = new URLSearchParams();
    if (city !== 'all') params.set('city', city);
    if (mediaType !== 'all') params.set('type', mediaType);
    if (searchQuery.trim()) params.set('q', searchQuery.trim());

    router.push(`/explore?${params.toString()}`);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Smooth Floating Search Container */}
      <form
        onSubmit={handleSubmit}
        className="bg-white/95 backdrop-blur-md rounded-3xl border border-zinc-200/60 shadow-[0_16px_50px_-10px_rgba(0,0,0,0.08)] p-3 sm:p-4 space-y-2.5 transition-all duration-300 hover:shadow-[0_20px_60px_-10px_rgba(0,0,0,0.11)]"
      >
        {/* Tier 1: Select City, All Types, and Search Button */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center">
          {/* Select City Dropdown */}
          <div className="sm:col-span-5 flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-zinc-50 hover:bg-zinc-100/70 transition-colors">
            <div className="w-8 h-8 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4 text-[#B00020]" />
            </div>
            <div className="w-full text-left">
              <label htmlFor="hero-city-select" className="text-[11px] uppercase font-semibold text-zinc-500 block leading-tight tracking-wider">
                Select Metro Hub
              </label>
              <select
                id="hero-city-select"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-transparent text-sm font-semibold text-zinc-900 focus:outline-none cursor-pointer mt-0.5"
              >
                <option value="all">Mumbai (WEH, BKC, Bandra)</option>
                {POPULAR_CITIES.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name} ({c.count}+ hoardings)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* All Types Dropdown */}
          <div className="sm:col-span-4 flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-zinc-50 hover:bg-zinc-100/70 transition-colors">
            <div className="w-8 h-8 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
              <Layers className="w-4 h-4 text-[#B00020]" />
            </div>
            <div className="w-full text-left">
              <label htmlFor="hero-type-select" className="text-[11px] uppercase font-semibold text-zinc-500 block leading-tight tracking-wider">
                Structure Type
              </label>
              <select
                id="hero-type-select"
                value={mediaType}
                onChange={(e) => setMediaType(e.target.value)}
                className="w-full bg-transparent text-sm font-semibold text-zinc-900 focus:outline-none cursor-pointer mt-0.5"
              >
                <option value="all">All Media Formats (480 Active)</option>
                {MEDIA_TYPES.filter(t => t.value !== 'all').map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Search Hoardings Action Button */}
          <div className="sm:col-span-3">
            <button
              type="submit"
              className="w-full py-3.5 px-5 rounded-2xl bg-[#B00020] hover:bg-[#8f0019] text-white font-medium text-sm tracking-wide transition-all shadow-md shadow-brand-500/20 hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
            >
              <span>Search Hoardings</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tier 2: Search Input + Trending Corridor Tags */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 border-t border-zinc-100">
          <div className="relative flex items-center flex-1 rounded-2xl bg-zinc-50 hover:bg-zinc-100/70 transition-colors px-3.5 py-2">
            <Search className="w-4 h-4 text-zinc-400 shrink-0" />
            <input
              type="text"
              placeholder="Search by Road, Landmark, Area or Pincode (e.g. Bandra, SV Road, JVLR)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent pl-2.5 pr-2 text-xs font-medium text-zinc-900 placeholder:text-zinc-500 focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-xs text-zinc-500 hover:text-zinc-800 px-2 py-0.5 cursor-pointer font-medium"
              >
                Clear
              </button>
            )}
          </div>

          <div className="hidden lg:flex items-center gap-1.5 text-xs text-zinc-500 px-2">
            <span className="font-semibold text-zinc-700">Trending:</span>
            <span className="text-zinc-600">BKC • Western Express • Silk Board • Outer Ring Road</span>
          </div>
        </div>
      </form>
    </div>
  );
};
