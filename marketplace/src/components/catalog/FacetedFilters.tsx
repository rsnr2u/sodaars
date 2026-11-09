'use client';

import React, { useState } from 'react';
import { 
  SlidersHorizontal, 
  RotateCcw, 
  MapPin, 
  Layers, 
  Sun, 
  IndianRupee, 
  Check,
  Search
} from 'lucide-react';
import { POPULAR_CITIES } from '@/data/mockMarketplaceData';

interface FacetedFiltersProps {
  selectedCity: string;
  onCityChange: (city: string) => void;
  selectedType: string;
  onTypeChange: (type: string) => void;
  selectedIllumination: string;
  onIlluminationChange: (illumination: string) => void;
  selectedPriceRange: string;
  onPriceRangeChange: (price: string) => void;
  onReset: () => void;
  totalResults: number;
}

export const FacetedFilters: React.FC<FacetedFiltersProps> = ({
  selectedCity,
  onCityChange,
  selectedType,
  onTypeChange,
  selectedIllumination,
  onIlluminationChange,
  selectedPriceRange,
  onPriceRangeChange,
  onReset,
  totalResults,
}) => {
  const [filterSearch, setFilterSearch] = useState('');

  const isFiltered =
    selectedCity !== 'all' ||
    selectedType !== 'all' ||
    selectedIllumination !== 'all' ||
    selectedPriceRange !== 'all';

  return (
    <div className="bg-white rounded-2xl border border-zinc-200/80 p-5 space-y-5 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[#B00020]" />
          <h2 className="text-sm font-semibold text-zinc-900 font-sans tracking-tight">Filters</h2>
        </div>

        {isFiltered && (
          <button
            onClick={onReset}
            className="text-xs font-sans text-[#B00020] hover:text-[#8f0019] flex items-center gap-1 font-semibold cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All</span>
          </button>
        )}
      </div>

      {/* Filter Search Input */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search location, area..."
          value={filterSearch}
          onChange={(e) => setFilterSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2 rounded-xl border border-zinc-200 text-xs font-normal text-zinc-800 placeholder:text-zinc-500 focus:outline-none focus:border-[#B00020] bg-zinc-50"
        />
      </div>

      {/* Filter 1: City / Metro Hub */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-zinc-800 font-sans flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-zinc-500" />
          <span>Select Metro Hub</span>
        </label>
        <select
          value={selectedCity}
          onChange={(e) => onCityChange(e.target.value)}
          className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-800 focus:outline-none focus:border-[#B00020] font-sans cursor-pointer"
        >
          <option value="all">All Cities across India</option>
          {POPULAR_CITIES.map((c) => (
            <option key={c.name} value={c.name}>
              {c.name} ({c.count}+ assets)
            </option>
          ))}
        </select>
      </div>

      {/* Filter 2: Media Type Checkboxes */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-zinc-800 font-sans flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-zinc-500" />
          <span>Media Structure Type</span>
        </label>
        <div className="space-y-1 text-xs">
          {[
            { id: 'all', label: 'All Media Types', count: '1,240+' },
            { id: 'Hoardings', label: 'Traditional Hoardings', count: '480' },
            { id: 'Billboards', label: 'Large Format Billboards', count: '320' },
            { id: 'Unipoles', label: 'Highway Unipoles', count: '210' },
            { id: 'Gantries', label: 'Bridge Gantries', count: '95' },
            { id: 'DOOH Screens', label: 'DOOH Digital Screens', count: '85' },
            { id: 'Bus Shelters', label: 'Bus Shelters (BQS)', count: '50' },
          ].map((fmt) => (
            <button
              key={fmt.id}
              onClick={() => onTypeChange(fmt.id)}
              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between cursor-pointer ${
                selectedType === fmt.id
                  ? 'bg-brand-50 text-[#B00020] font-semibold'
                  : 'text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`w-3.5 h-3.5 rounded flex items-center justify-center text-xs ${
                  selectedType === fmt.id
                    ? 'bg-[#B00020] text-white'
                    : 'border border-zinc-300 bg-white'
                }`}>
                  {selectedType === fmt.id && <Check className="w-2.5 h-2.5" />}
                </span>
                <span>{fmt.label}</span>
              </div>
              <span className="text-xs font-sans text-zinc-500 font-normal">({fmt.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Filter 3: Illumination Type (Pill Bar) */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-zinc-800 font-sans flex items-center gap-1.5">
          <Sun className="w-3.5 h-3.5 text-zinc-500" />
          <span>Illumination</span>
        </label>
        <div className="flex flex-wrap gap-1.5">
          {[
            { id: 'all', label: 'All' },
            { id: 'Front-lit', label: 'Front-lit' },
            { id: 'Back-lit', label: 'Back-lit' },
            { id: 'Digital LED', label: 'Digital LED' },
            { id: 'Non-lit', label: 'Non-lit' },
          ].map((ill) => (
            <button
              key={ill.id}
              onClick={() => onIlluminationChange(ill.id)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                selectedIllumination === ill.id
                  ? 'bg-[#B00020] text-white shadow-3xs'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200/80'
              }`}
            >
              {ill.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filter 4: Monthly Rental Budget */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-zinc-800 font-sans flex items-center gap-1.5">
          <IndianRupee className="w-3.5 h-3.5 text-zinc-500" />
          <span>Monthly Rental Budget</span>
        </label>
        <div className="space-y-1 text-xs">
          {[
            { id: 'all', label: 'All Price Ranges' },
            { id: 'under-100k', label: 'Under ₹1,00,000 / mo' },
            { id: '100k-250k', label: '₹1,00,000 - ₹2,50,000' },
            { id: '250k-500k', label: '₹2,50,000 - ₹5,00,000' },
            { id: 'above-500k', label: 'Above ₹5,00,000 / mo' },
          ].map((pr) => (
            <button
              key={pr.id}
              onClick={() => onPriceRangeChange(pr.id)}
              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between cursor-pointer ${
                selectedPriceRange === pr.id
                  ? 'bg-brand-50 text-[#B00020] font-semibold'
                  : 'text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950'
              }`}
            >
              <span>{pr.label}</span>
              {selectedPriceRange === pr.id && <Check className="w-3.5 h-3.5 text-[#B00020]" />}
            </button>
          ))}
        </div>
      </div>

      {/* Solid Red Apply Button */}
      <div className="pt-2 border-t border-zinc-100">
        <button
          type="button"
          className="w-full py-2.5 rounded-xl bg-[#B00020] hover:bg-[#8f0019] text-white font-medium text-xs shadow-sm transition-all cursor-pointer active:scale-98"
        >
          Apply Filters ({totalResults})
        </button>
      </div>
    </div>
  );
};
