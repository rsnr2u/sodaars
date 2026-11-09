'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  SlidersHorizontal, 
  Search, 
  ArrowUpDown, 
  MapPin, 
  ShieldCheck, 
  RotateCcw, 
  Layers, 
  Sparkles,
  X,
  Grid3X3,
  LayoutList,
  ListFilter,
  ArrowRight
} from 'lucide-react';
import { MarketplaceResource } from '@/types/marketplace';
import { MOCK_MARKETPLACE_RESOURCES } from '@/data/mockMarketplaceData';
import { ResourceCard } from '@/components/catalog/ResourceCard';
import { FacetedFilters } from '@/components/catalog/FacetedFilters';
import { GuestBookingModal } from '@/components/booking/GuestBookingModal';
import { formatCurrencyINR } from '@/lib/utils';

const CATEGORY_PILLS = [
  { id: 'all', label: 'All Media' },
  { id: 'Hoardings', label: 'Traditional' },
  { id: 'Gantries', label: 'Gantry' },
  { id: 'Unipoles', label: 'Unipole' },
  { id: 'DOOH Screens', label: 'DOOH Screens' },
  { id: 'Bus Shelters', label: 'Bus Shelter' },
  { id: 'Billboards', label: 'Billboards' },
];

export const ExploreCatalogClient: React.FC<{
  showHeroHeader?: boolean;
}> = ({ showHeroHeader = true }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Query parameter initial states
  const initialCity = searchParams.get('city') || 'all';
  const initialType = searchParams.get('type') || 'all';
  const initialQuery = searchParams.get('q') || '';

  const [selectedCity, setSelectedCity] = useState<string>(initialCity);
  const [selectedType, setSelectedType] = useState<string>(initialType);
  const [selectedIllumination, setSelectedIllumination] = useState<string>('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'impressions' | 'rating'>('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Mobile Filter Drawer State
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Quick Booking Modal State
  const [activeBookingResource, setActiveBookingResource] = useState<MarketplaceResource | null>(null);

  // Global Keyboard Shortcut: Focus search with Ctrl+K or /
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey && e.key === 'k') || (e.key === '/' && document.activeElement !== searchInputRef.current)) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter & Search Logic
  const filteredResources = useMemo(() => {
    return MOCK_MARKETPLACE_RESOURCES.filter((item) => {
      // City filter
      if (selectedCity !== 'all' && item.location.city.toLowerCase() !== selectedCity.toLowerCase()) {
        return false;
      }

      // Structure type filter
      if (selectedType !== 'all' && item.type.toLowerCase() !== selectedType.toLowerCase()) {
        return false;
      }

      // Illumination filter
      if (selectedIllumination !== 'all' && item.illumination.toLowerCase() !== selectedIllumination.toLowerCase()) {
        return false;
      }

      // Price Range filter
      if (selectedPriceRange !== 'all') {
        const price = item.marketplacePrice;
        if (selectedPriceRange === 'under-100k' && price >= 100000) return false;
        if (selectedPriceRange === '100k-250k' && (price < 100000 || price > 250000)) return false;
        if (selectedPriceRange === '250k-500k' && (price < 250000 || price > 500000)) return false;
        if (selectedPriceRange === 'above-500k' && price <= 500000) return false;
      }

      // Search Query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesArea = item.location.area.toLowerCase().includes(query);
        const matchesLandmark = item.location.landmark ? item.location.landmark.toLowerCase().includes(query) : false;
        const matchesCity = item.location.city.toLowerCase().includes(query);
        const matchesFacing = (item.orientation || '').toLowerCase().includes(query) || (item.visibilityFacing || '').toLowerCase().includes(query);

        if (!matchesName && !matchesArea && !matchesLandmark && !matchesCity && !matchesFacing) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.marketplacePrice - b.marketplacePrice;
      if (sortBy === 'price-desc') return b.marketplacePrice - a.marketplacePrice;
      if (sortBy === 'impressions') return b.totalSqFt - a.totalSqFt;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // featured default
    });
  }, [selectedCity, selectedType, selectedIllumination, selectedPriceRange, searchQuery, sortBy]);

  const handleResetFilters = () => {
    setSelectedCity('all');
    setSelectedType('all');
    setSelectedIllumination('all');
    setSelectedPriceRange('all');
    setSearchQuery('');
    setSortBy('featured');
  };

  const hasActiveFilters =
    selectedCity !== 'all' ||
    selectedType !== 'all' ||
    selectedIllumination !== 'all' ||
    selectedPriceRange !== 'all' ||
    searchQuery.trim() !== '';

  return (
    <div className="w-full">
      {/* Category Pills Bar (Matching reference image horizontal strip) */}
      <div className="py-4 border-b border-zinc-100 bg-white/70 backdrop-blur-md">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center sm:justify-start gap-2 overflow-x-auto no-scrollbar py-1">
            {CATEGORY_PILLS.map((pill) => {
              const isActive = selectedType.toLowerCase() === pill.id.toLowerCase();
              return (
                <button
                  key={pill.id}
                  onClick={() => setSelectedType(pill.id)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-[#B00020] to-[#c60025] text-white shadow-md shadow-brand-500/25 scale-[1.02]'
                      : 'bg-zinc-100/80 hover:bg-zinc-200/70 text-zinc-700'
                  }`}
                >
                  {pill.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Catalog Explorer Section */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Explorer Header with Title & Sort Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-zinc-950 font-sans tracking-tight">
              Explore <span className="text-[#B00020]">Spaces</span>
            </h2>
            <p className="text-xs text-zinc-500 font-medium mt-0.5">
              Showing 1,248 verified media spots across India
            </p>
          </div>

          <div className="flex items-center gap-3">
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="text-xs text-[#B00020] hover:text-brand-800 flex items-center gap-1 font-semibold cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}

            {/* Mobile Filter Drawer Button */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-zinc-900 text-white text-xs font-semibold shadow-xs cursor-pointer"
            >
              <ListFilter className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>

            {/* View Switcher: Grid vs List */}
            <div className="hidden sm:flex items-center bg-zinc-100 rounded-full p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-full transition-all cursor-pointer ${
                  viewMode === 'grid' ? 'bg-white shadow-xs text-[#B00020]' : 'text-zinc-500 hover:text-zinc-900'
                }`}
                title="Grid View"
              >
                <Grid3X3 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-full transition-all cursor-pointer ${
                  viewMode === 'list' ? 'bg-white shadow-xs text-[#B00020]' : 'text-zinc-500 hover:text-zinc-900'
                }`}
                title="List View"
              >
                <LayoutList className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white border border-zinc-200/80 text-xs font-medium text-zinc-700 shadow-2xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="bg-transparent font-semibold text-zinc-900 focus:outline-none cursor-pointer text-xs"
              >
                <option value="featured">Sort by: Recommended</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="impressions">Largest Area (Sq.Ft)</option>
                <option value="rating">Highest User Rating</option>
              </select>
            </div>
          </div>
        </div>

        {/* 2-Column Layout: Left Sticky Sidebar + Right 4-Column Card Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
          {/* Left Column: Faceted Filter Panel (Desktop) */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-24">
              <FacetedFilters
                selectedCity={selectedCity}
                onCityChange={setSelectedCity}
                selectedType={selectedType}
                onTypeChange={setSelectedType}
                selectedIllumination={selectedIllumination}
                onIlluminationChange={setSelectedIllumination}
                selectedPriceRange={selectedPriceRange}
                onPriceRangeChange={setSelectedPriceRange}
                onReset={handleResetFilters}
                totalResults={filteredResources.length}
              />
            </div>
          </aside>

          {/* Right Column: 4-Column Hoarding Cards Grid */}
          <main className="lg:col-span-9 space-y-4">
            {filteredResources.length > 0 ? (
              <>
                {viewMode === 'grid' ? (
                /* 4-Column responsive grid matching reference image */
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
                  {filteredResources.map((resource) => (
                    <ResourceCard
                      key={resource.id}
                      resource={resource}
                      onQuickBook={(item) => setActiveBookingResource(item)}
                    />
                  ))}
                </div>
              ) : (
                /* Compact List View */
                <div className="space-y-3">
                  {filteredResources.map((resource) => (
                    <div
                      key={resource.id}
                      className="group bg-white rounded-3xl border border-zinc-100 p-4 hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                    >
                      {/* Left: Thumbnail & Core Info */}
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="relative w-28 h-20 rounded-2xl overflow-hidden bg-zinc-900 shrink-0">
                          <img
                            src={resource.primaryPhotoUrl}
                            alt={resource.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-black/70 text-white uppercase">
                            {resource.type}
                          </span>
                        </div>

                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                              Verified Partner
                            </span>
                            <span className="text-xs text-zinc-500 font-medium">{resource.location.city}</span>
                          </div>

                          <Link
                            href={`/resources/${resource.slug}`}
                            className="font-semibold text-sm sm:text-base text-zinc-900 hover:text-[#B00020] transition-colors truncate block"
                          >
                            {resource.name}
                          </Link>

                          <div className="flex items-center gap-2 text-xs text-zinc-500">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-[#B00020]" />
                              <span className="truncate">{resource.location.landmark || resource.location.area}</span>
                            </span>
                            <span>•</span>
                            <span>{resource.widthFt}×{resource.heightFt} ft ({resource.totalSqFt} sq.ft)</span>
                            <span>•</span>
                            <span className="text-zinc-700 font-medium">{resource.illumination}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Price & Actions */}
                      <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-zinc-100">
                        <div className="text-right">
                          <div className="text-xs text-zinc-400 line-through">
                            {formatCurrencyINR(resource.regularPrice)}
                          </div>
                          <div className="text-lg font-semibold text-[#B00020] font-sans leading-none whitespace-nowrap">
                            {formatCurrencyINR(resource.marketplacePrice)}
                            <span className="text-xs text-zinc-500 font-normal ml-1">/mo</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setActiveBookingResource(resource)}
                            className="px-3.5 py-2 rounded-full bg-brand-50 hover:bg-brand-100 text-[#B00020] font-medium text-xs transition-colors cursor-pointer"
                          >
                            Quick Book
                          </button>
                          <Link
                            href={`/resources/${resource.slug}`}
                            className="px-4 py-2 rounded-full bg-[#B00020] hover:bg-[#8f0019] text-white font-medium text-xs transition-colors flex items-center gap-1 shadow-xs"
                          >
                            <span>Inspect</span>
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination Strip (Direct Match to Screen 1) */}
              <div className="pt-6 border-t border-zinc-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-zinc-500 font-normal">
                  Showing <span className="font-semibold text-zinc-900">1 to 8</span> of{' '}
                  <span className="font-semibold text-zinc-900">1,248</span> available inventory
                </div>

                <div className="flex items-center gap-1.5 text-xs font-medium">
                  <button
                    type="button"
                    className="px-3.5 py-1.5 rounded-lg border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 hover:text-zinc-950 transition-colors cursor-pointer"
                  >
                    Prev Page
                  </button>
                  <button
                    type="button"
                    className="w-8 h-8 rounded-lg bg-[#B00020] text-white flex items-center justify-center font-medium shadow-xs cursor-pointer"
                  >
                    1
                  </button>
                  <button
                    type="button"
                    className="w-8 h-8 rounded-lg border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 flex items-center justify-center font-medium transition-colors cursor-pointer"
                  >
                    2
                  </button>
                  <button
                    type="button"
                    className="w-8 h-8 rounded-lg border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 flex items-center justify-center font-medium transition-colors cursor-pointer"
                  >
                    3
                  </button>
                  <span className="px-1 text-zinc-400">...</span>
                  <button
                    type="button"
                    className="w-8 h-8 rounded-lg border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 flex items-center justify-center font-medium transition-colors cursor-pointer"
                  >
                    15
                  </button>
                  <button
                    type="button"
                    className="px-3.5 py-1.5 rounded-lg border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>Next Page</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </>
            ) : (
              /* Empty State */
              <div className="bg-white rounded-3xl border border-zinc-100 p-12 text-center max-w-lg mx-auto space-y-4 shadow-sm">
                <div className="w-14 h-14 rounded-2xl bg-brand-50 text-[#B00020] flex items-center justify-center mx-auto">
                  <Search className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-semibold text-zinc-900">No matching hoardings found</h3>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  We couldn't find any outdoor media matching your current combination of city, format, or budget filters.
                </p>
                <div className="pt-2">
                  <button
                    onClick={handleResetFilters}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#B00020] hover:bg-brand-700 text-white font-semibold text-xs shadow-sm cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset All Filters</span>
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Drawer Filter Dialog */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="relative ml-auto w-full max-w-xs bg-white h-full shadow-2xl p-6 overflow-y-auto flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-zinc-100 mb-6">
                <span className="font-semibold text-base text-zinc-900">Filters</span>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 rounded-xl hover:bg-zinc-100 text-zinc-500 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <FacetedFilters
                selectedCity={selectedCity}
                onCityChange={setSelectedCity}
                selectedType={selectedType}
                onTypeChange={setSelectedType}
                selectedIllumination={selectedIllumination}
                onIlluminationChange={setSelectedIllumination}
                selectedPriceRange={selectedPriceRange}
                onPriceRangeChange={setSelectedPriceRange}
                onReset={handleResetFilters}
                totalResults={filteredResources.length}
              />
            </div>

            <div className="pt-6 border-t border-zinc-100">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-3.5 rounded-full bg-[#B00020] text-white font-semibold text-xs cursor-pointer shadow-md shadow-brand-500/25"
              >
                Apply & View {filteredResources.length} Results
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Booking Modal */}
      {activeBookingResource && (
        <GuestBookingModal
          resource={activeBookingResource}
          onClose={() => setActiveBookingResource(null)}
        />
      )}
    </div>
  );
};
