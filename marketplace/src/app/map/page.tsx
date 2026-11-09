'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  MapPin, 
  Layers, 
  Filter, 
  ArrowRight, 
  ShieldCheck, 
  Maximize2,
  Navigation,
  Compass
} from 'lucide-react';
import { MOCK_MARKETPLACE_RESOURCES, POPULAR_CITIES } from '@/data/mockMarketplaceData';
import { formatCurrencyINR } from '@/lib/utils';
import { MarketplaceResource } from '@/types/marketplace';

export default function MapViewPage() {
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [selectedResource, setSelectedResource] = useState<MarketplaceResource | null>(
    MOCK_MARKETPLACE_RESOURCES[0] || null
  );

  const filteredResources = selectedCity === 'All' 
    ? MOCK_MARKETPLACE_RESOURCES 
    : MOCK_MARKETPLACE_RESOURCES.filter(r => r.location.city.toLowerCase() === selectedCity.toLowerCase());

  return (
    <div className="min-h-[calc(100vh-4.5rem)] flex flex-col font-sans bg-zinc-50">
      
      {/* Top Filter Bar */}
      <div className="bg-white border-b border-zinc-200/80 px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3 sticky top-18 z-20">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-[#B00020]" />
            <h1 className="text-base sm:text-lg font-semibold text-zinc-900 tracking-tight">
              Interactive Hoardings Map
            </h1>
          </div>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-600 font-medium">
            {filteredResources.length} Verified Billboards
          </span>
        </div>

        {/* City Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          <button
            onClick={() => setSelectedCity('All')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
              selectedCity === 'All'
                ? 'bg-[#B00020] text-white shadow-xs'
                : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
            }`}
          >
            All Cities
          </button>
          {POPULAR_CITIES.slice(0, 5).map(c => (
            <button
              key={c.name}
              onClick={() => setSelectedCity(c.name)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                selectedCity === c.name
                  ? 'bg-[#B00020] text-white shadow-xs'
                  : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Split View: Map Simulation Left/Center + Asset Sidebar Right */}
      <div className="flex-1 flex flex-col lg:flex-row relative">
        
        {/* Map Visualization Canvas */}
        <div className="flex-1 relative bg-zinc-100 min-h-[450px] lg:min-h-full overflow-hidden flex items-center justify-center">
          
          {/* Simulated Map Grid Background */}
          <div 
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage: `radial-gradient(#cbd5e1 1.5px, transparent 1.5px), radial-gradient(#cbd5e1 1.5px, #f8fafc 1.5px)`,
              backgroundSize: '36px 36px',
              backgroundPosition: '0 0, 18px 18px',
            }}
          />

          {/* Map Compass Indicator */}
          <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur-xs px-3 py-2 rounded-xl border border-zinc-200 shadow-xs flex items-center gap-2 text-xs font-medium text-zinc-700">
            <Navigation className="w-4 h-4 text-[#B00020]" />
            <span>GPS Coordinate Overlay • Pan & Zoom Enabled</span>
          </div>

          {/* Interactive Hoarding Pins */}
          <div className="relative z-10 w-full max-w-2xl h-96 p-6">
            <div className="relative w-full h-full border border-dashed border-zinc-300 rounded-3xl bg-white/60 backdrop-blur-xs flex items-center justify-center p-8 text-center">
              
              {/* Render dynamic pins for hoardings */}
              <div className="absolute inset-8">
                {filteredResources.map((res, idx) => {
                  const isSelected = selectedResource?.id === res.id;
                  // Distribute pseudo-positions across the canvas
                  const lefts = [18, 55, 75, 30, 68, 42];
                  const tops = [25, 20, 60, 70, 78, 48];
                  const left = lefts[idx % lefts.length];
                  const top = tops[idx % tops.length];

                  return (
                    <div
                      key={res.id}
                      style={{ left: `${left}%`, top: `${top}%` }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                      onClick={() => setSelectedResource(res)}
                    >
                      <div className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-semibold shadow-md transition-all ${
                        isSelected 
                          ? 'bg-[#B00020] text-white scale-110 ring-4 ring-rose-200 z-30'
                          : 'bg-white hover:bg-rose-50 text-zinc-900 border border-zinc-200 group-hover:scale-105 z-20'
                      }`}>
                        <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-[#B00020]'}`} />
                        <span className="truncate max-w-[110px]">{res.location.area}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="max-w-xs text-zinc-500 text-xs">
                Click any hoarding pin to view live photos, traffic statistics, and pricing details.
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Selected Asset Detail */}
        {selectedResource && (
          <div className="w-full lg:w-96 bg-white border-t lg:border-t-0 lg:border-l border-zinc-200/90 p-5 flex flex-col justify-between overflow-y-auto z-10">
            <div className="space-y-4">
              <div className="relative rounded-2xl overflow-hidden aspect-[16/10] bg-zinc-100">
                <img
                  src={selectedResource.primaryPhotoUrl}
                  alt={selectedResource.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/95 text-zinc-800 shadow-xs">
                  {selectedResource.type}
                </div>
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-800 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  Verified
                </div>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-[#B00020] uppercase tracking-wider">
                  {selectedResource.location.city} • {selectedResource.location.area}
                </span>
                <h2 className="text-base font-semibold text-zinc-900 mt-0.5">
                  {selectedResource.name}
                </h2>
                <p className="text-xs text-zinc-500 mt-1">
                  {selectedResource.widthFt} × {selectedResource.heightFt} ft • {selectedResource.totalSqFt} sq.ft • {selectedResource.illumination}
                </p>
              </div>

              <div className="p-3 bg-zinc-50 rounded-xl space-y-1.5 text-xs">
                <div className="flex justify-between text-zinc-600">
                  <span>Daily Traffic:</span>
                  <span className="font-semibold text-zinc-900">~1,45,000 vehicles/day</span>
                </div>
                <div className="flex justify-between text-zinc-600">
                  <span>Landmark:</span>
                  <span className="font-medium text-zinc-900 truncate max-w-[180px]">{selectedResource.location.landmark}</span>
                </div>
                <div className="flex justify-between text-zinc-600">
                  <span>GPS:</span>
                  <span className="font-mono text-zinc-700">{selectedResource.location.latitude}, {selectedResource.location.longitude}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-100 mt-4 space-y-3">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-zinc-400 block">Monthly Rate</span>
                  <span className="text-xl font-semibold text-[#B00020]">
                    {formatCurrencyINR(selectedResource.marketplacePrice)}
                  </span>
                </div>
                <span className="text-xs text-zinc-500">per month</span>
              </div>

              <Link
                href={`/resources/${selectedResource.slug}`}
                className="w-full py-3 rounded-full bg-[#B00020] hover:bg-[#8f0019] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs"
              >
                <span>View Full Details & Book</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
