'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MapPin, Sparkles, ExternalLink, MapPinOff, ArrowRight } from 'lucide-react';
import type { PublicMapPoint } from '@/lib/api';

interface MapViewProps {
  points: PublicMapPoint[];
  selectedCity?: string;
}

export default function MapView({ points, selectedCity }: MapViewProps) {
  const [selectedPoint, setSelectedPoint] = useState<PublicMapPoint | null>(points[0] || null);

  // If no points are found, display honest empty state rather than hardcoding arbitrary coordinates
  if (points.length === 0) {
    return (
      <div className="relative h-full w-full rounded-2xl border border-slate-200 shadow-sm bg-white flex flex-col items-center justify-center p-8 text-center min-h-[500px]">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mb-4 border border-slate-200">
          <MapPinOff className="h-8 w-8" />
        </div>
        <h3 className="text-base sm:text-lg font-bold text-slate-900">
          No advertising resources found for the selected filters.
        </h3>
        <p className="mt-2 text-xs sm:text-sm text-slate-500 max-w-md">
          {selectedCity
            ? `No geo-tagged hoardings or screens matched your criteria in ${selectedCity}. Try broadening your search or clearing specific filters.`
            : 'No geo-tagged hoardings or screens matched your search criteria. Try removing or adjusting filters to view available outdoor media.'}
        </p>
        <div className="mt-6">
          <Link
            href="/explore?view=map"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 transition"
          >
            <span>Reset Map Filters</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  // When points exist, center dynamically on the selected marker or the bounding centroid
  const activePin = selectedPoint || points[0];
  const centerLat = activePin.latitude;
  const centerLng = activePin.longitude;

  return (
    <div className="relative h-full w-full rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100 flex flex-col md:flex-row min-h-[550px]">
      {/* Interactive OpenStreetMap Embed */}
      <div className="relative flex-1 h-[350px] md:h-full w-full">
        <iframe
          key={`${centerLat}-${centerLng}`}
          title="OpenStreetMap Outdoor Inventory"
          width="100%"
          height="100%"
          className="border-0 w-full h-full"
          loading="lazy"
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${centerLng - 0.04}%2C${centerLat - 0.04}%2C${centerLng + 0.04}%2C${centerLat + 0.04}&layer=mapnik&marker=${centerLat}%2C${centerLng}`}
        />

        {/* Floating Marker Badge Indicator */}
        <div className="absolute top-4 left-4 z-10 rounded-xl bg-white/95 px-3.5 py-2 shadow-lg backdrop-blur-md border border-slate-200 text-xs flex items-center gap-2 font-semibold text-slate-800">
          <div className="h-2.5 w-2.5 rounded-full bg-indigo-600 animate-pulse" />
          <span>{points.length} Geocoded Outdoor Media Sites</span>
        </div>

        {/* Floating Preview Card on Map */}
        {activePin && (
          <div className="absolute bottom-4 left-4 right-4 md:right-auto md:w-84 z-10 rounded-2xl bg-white/95 p-4 shadow-xl backdrop-blur-md border border-slate-200 text-xs">
            <div className="flex items-start gap-3">
              {activePin.thumbnail_url ? (
                <img
                  src={activePin.thumbnail_url}
                  alt={activePin.name}
                  className="h-14 w-14 rounded-xl object-cover border border-slate-200 shrink-0"
                />
              ) : (
                <div className="h-14 w-14 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 shrink-0 border border-slate-200">
                  <MapPin className="h-6 w-6" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="inline-flex items-center gap-1 rounded bg-indigo-50 px-1.5 py-0.5 text-[10px] font-bold text-indigo-700">
                    {activePin.category === 'DIGITAL' && <Sparkles className="h-2.5 w-2.5 text-purple-600" />}
                    {activePin.resource_type.replace('_', ' ')}
                  </span>
                  <span className="font-extrabold text-slate-900 text-xs truncate">
                    {activePin.indicative_rate}
                  </span>
                </div>
                <h5 className="font-bold text-slate-900 text-xs mt-1 truncate">
                  {activePin.name}
                </h5>
                <p className="text-[11px] text-slate-500 truncate">
                  {activePin.area}, {activePin.city}
                </p>
              </div>
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] font-medium text-slate-500 truncate max-w-[140px]">
                {activePin.provider_name}
              </span>
              <Link
                href={`/resources/${activePin.slug}`}
                className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition"
              >
                <span>View Details</span>
                <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Sidebar List of Map Pins */}
      <div className="w-full md:w-88 bg-white border-t md:border-t-0 md:border-l border-slate-200 flex flex-col h-auto md:h-full max-h-[550px]">
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Discovered Locations ({points.length})
          </h4>
          <span className="text-[10px] text-slate-400 font-medium">Click to center</span>
        </div>

        <div className="divide-y divide-slate-100 flex-1 overflow-y-auto">
          {points.map((p) => {
            const isSelected = activePin.uuid === p.uuid;
            return (
              <div
                key={p.uuid}
                onClick={() => setSelectedPoint(p)}
                className={`p-3.5 transition cursor-pointer hover:bg-slate-50 ${
                  isSelected ? 'bg-indigo-50/80 border-l-4 border-indigo-600' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-700">
                    {p.category === 'DIGITAL' && <Sparkles className="h-2.5 w-2.5 text-purple-600" />}
                    {p.resource_type.replace('_', ' ')}
                  </span>
                  <span className="text-xs font-black text-slate-900">
                    {p.indicative_rate}
                  </span>
                </div>

                <h5 className="font-bold text-xs text-slate-900 mt-1.5 line-clamp-1">
                  {p.name}
                </h5>

                <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-500">
                  <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                  <span className="line-clamp-1">{p.area}, {p.city}</span>
                </div>

                {isSelected && (
                  <div className="mt-3 pt-2 border-t border-indigo-100 flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-slate-500 line-clamp-1">
                      {p.provider_name}
                    </span>
                    <Link
                      href={`/resources/${p.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span>Details</span>
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
