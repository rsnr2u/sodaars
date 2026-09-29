import Link from 'next/link';
import { Search, Filter, Map, LayoutGrid, RotateCcw } from 'lucide-react';
import { getResources, getResourceMap } from '@/lib/api';
import ResourceCard from '@/components/ResourceCard';
import MapView from '@/components/MapView';

interface ExplorePageProps {
  searchParams: Promise<{
    search?: string;
    city?: string;
    category?: string;
    type?: string;
    illumination?: string;
    min_area?: string;
    max_area?: string;
    sort?: string;
    page?: string;
    view?: string;
  }>;
}

export const revalidate = 30;

export default async function ExplorePage({ searchParams }: ExplorePageProps) {
  const resolvedParams = await searchParams;

  const currentSearch = resolvedParams.search || '';
  const currentCity = resolvedParams.city || '';
  const currentCategory = resolvedParams.category || '';
  const currentType = resolvedParams.type || '';
  const currentIllumination = resolvedParams.illumination || '';
  const currentMinArea = resolvedParams.min_area || '';
  const currentMaxArea = resolvedParams.max_area || '';
  const currentSort = resolvedParams.sort || 'latest';
  const currentPage = resolvedParams.page || '1';
  const currentView = resolvedParams.view || 'grid'; // 'grid' | 'map'

  // Fetch paginated resources
  const apiParams: Record<string, string> = {
    page: currentPage,
    sort: currentSort,
  };
  if (currentSearch) apiParams.search = currentSearch;
  if (currentCity) apiParams.city = currentCity;
  if (currentCategory) apiParams.category = currentCategory;
  if (currentType) apiParams.type = currentType;
  if (currentIllumination) apiParams.illumination = currentIllumination;
  if (currentMinArea) apiParams.min_area = currentMinArea;
  if (currentMaxArea) apiParams.max_area = currentMaxArea;

  const [resourcesRes, mapRes] = await Promise.all([
    getResources(apiParams),
    currentView === 'map' ? getResourceMap(apiParams) : Promise.resolve({ success: true, message: '', data: [] }),
  ]);

  const items = resourcesRes.data?.items || [];
  const pagination = resourcesRes.data?.pagination || { total: 0, per_page: 12, current_page: 1, last_page: 1 };
  const mapPoints = mapRes.data || [];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Top Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Explore Outdoor Inventory
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Showing <strong className="font-semibold text-slate-900">{pagination.total}</strong> verified hoarding & screen assets across India
          </p>
        </div>

        {/* View Switcher: Grid vs Map */}
        <div className="flex items-center rounded-xl bg-slate-100 p-1 border border-slate-200/80 w-fit">
          <Link
            href={{
              pathname: '/explore',
              query: { ...resolvedParams, view: 'grid' },
            }}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition ${
              currentView !== 'map'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            <span>Card Grid</span>
          </Link>

          <Link
            href={{
              pathname: '/explore',
              query: { ...resolvedParams, view: 'map' },
            }}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition ${
              currentView === 'map'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Map className="h-3.5 w-3.5" />
            <span>Map View</span>
          </Link>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="rounded-2xl bg-white p-5 border border-slate-200/80 shadow-xs mb-8">
        <form action="/explore" method="GET" className="space-y-4">
          <input type="hidden" name="view" value={currentView} />

          {/* Row 1: Keyword Search + City + Category */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-12">
            <div className="relative sm:col-span-6">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                name="search"
                defaultValue={currentSearch}
                placeholder="Search landmark, area, or code..."
                className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-4 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
              />
            </div>

            <div className="sm:col-span-3">
              <input
                type="text"
                name="city"
                defaultValue={currentCity}
                placeholder="City (e.g. Vijayawada, Guntur)"
                className="w-full rounded-xl border border-slate-300 py-2.5 px-3.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
              />
            </div>

            <div className="sm:col-span-3">
              <select
                name="category"
                defaultValue={currentCategory}
                className="w-full rounded-xl border border-slate-300 py-2.5 px-3 text-xs sm:text-sm text-slate-700 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 bg-white"
              >
                <option value="">All Categories</option>
                <option value="STATIC">Static (Hoarding / Billboard)</option>
                <option value="DIGITAL">Digital DOOH (LED Screen)</option>
              </select>
            </div>
          </div>

          {/* Row 2: Faceted Filters (Type, Illumination, Min Area, Max Area, Sort) */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Resource Type</label>
              <select
                name="type"
                defaultValue={currentType}
                className="w-full rounded-xl border border-slate-300 py-2 px-2 text-xs text-slate-700 bg-white"
              >
                <option value="">Any Type</option>
                <option value="BILLBOARD">Billboard</option>
                <option value="UNIPOLE">Unipole</option>
                <option value="GANTRY">Gantry</option>
                <option value="LED_SCREEN">LED Screen</option>
                <option value="DIGITAL_SCREEN">Digital Screen</option>
                <option value="BUS_SHELTER">Bus Shelter</option>
                <option value="POLE_AD">Pole Ad</option>
                <option value="ROOFTOP">Rooftop</option>
                <option value="BRIDGE_PANEL">Bridge Panel</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Illumination</label>
              <select
                name="illumination"
                defaultValue={currentIllumination}
                className="w-full rounded-xl border border-slate-300 py-2 px-2 text-xs text-slate-700 bg-white"
              >
                <option value="">Any Illumination</option>
                <option value="FRONT_LIT">Front Lit</option>
                <option value="BACK_LIT">Back Lit</option>
                <option value="NON_LIT">Non Lit</option>
                <option value="DIGITAL">Digital Screen</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Min Area (sq.ft)</label>
              <input
                type="number"
                name="min_area"
                defaultValue={currentMinArea}
                placeholder="Min Sq.ft"
                className="w-full rounded-xl border border-slate-300 py-2 px-3 text-xs text-slate-900"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Max Area (sq.ft)</label>
              <input
                type="number"
                name="max_area"
                defaultValue={currentMaxArea}
                placeholder="Max Sq.ft"
                className="w-full rounded-xl border border-slate-300 py-2 px-3 text-xs text-slate-900"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Sort By</label>
              <select
                name="sort"
                defaultValue={currentSort}
                className="w-full rounded-xl border border-slate-300 py-2 px-2 text-xs text-slate-700 bg-white"
              >
                <option value="latest">Latest Listed</option>
                <option value="price_low">Rate: Low to High</option>
                <option value="price_high">Rate: High to Low</option>
                <option value="area_desc">Size: Largest First</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <Link
              href={{
                pathname: '/explore',
                query: currentView === 'map' ? { view: 'map' } : {},
              }}
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset Filters</span>
            </Link>

            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-5 py-2 text-xs font-bold text-white hover:bg-slate-800 transition active:scale-95"
            >
              <Filter className="h-3.5 w-3.5" />
              <span>Apply Filters</span>
            </button>
          </div>
        </form>
      </div>

      {/* Active Filter Chips with One-Click Removal */}
      {(() => {
        const chips: { label: string; removeQuery: Record<string, string | undefined> }[] = [];
        if (currentSearch) {
          const { search, ...rest } = resolvedParams;
          chips.push({ label: `Search: "${currentSearch}"`, removeQuery: rest });
        }
        if (currentCity) {
          const { city, ...rest } = resolvedParams;
          chips.push({ label: `City: ${currentCity}`, removeQuery: rest });
        }
        if (currentCategory) {
          const { category, ...rest } = resolvedParams;
          chips.push({ label: `Category: ${currentCategory}`, removeQuery: rest });
        }
        if (currentType) {
          const { type, ...rest } = resolvedParams;
          chips.push({ label: `Type: ${currentType.replace('_', ' ')}`, removeQuery: rest });
        }
        if (currentIllumination) {
          const { illumination, ...rest } = resolvedParams;
          chips.push({ label: `Illumination: ${currentIllumination.replace('_', ' ')}`, removeQuery: rest });
        }
        if (currentMinArea) {
          const { min_area, ...rest } = resolvedParams;
          chips.push({ label: `Min Area: ${currentMinArea} sq.ft`, removeQuery: rest });
        }
        if (currentMaxArea) {
          const { max_area, ...rest } = resolvedParams;
          chips.push({ label: `Max Area: ${currentMaxArea} sq.ft`, removeQuery: rest });
        }
        if (currentSort && currentSort !== 'latest') {
          const { sort, ...rest } = resolvedParams;
          chips.push({ label: `Sort: ${currentSort.replace('_', ' ')}`, removeQuery: rest });
        }

        if (chips.length === 0) return null;

        return (
          <div className="flex flex-wrap items-center gap-2 mb-6 p-1">
            <span className="text-xs font-semibold text-slate-500 mr-1">Active filters:</span>
            {chips.map((chip, idx) => (
              <Link
                key={idx}
                href={{ pathname: '/explore', query: chip.removeQuery }}
                className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 border border-indigo-200/70 hover:bg-indigo-100 transition group"
              >
                <span>{chip.label}</span>
                <span className="font-bold text-indigo-400 group-hover:text-indigo-800">×</span>
              </Link>
            ))}
            <Link
              href={{ pathname: '/explore', query: currentView === 'map' ? { view: 'map' } : {} }}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline ml-2"
            >
              Clear all
            </Link>
          </div>
        );
      })()}

      {/* Main View Display */}
      {currentView === 'map' ? (
        <div className="h-[600px] w-full mb-12">
          <MapView points={mapPoints} selectedCity={currentCity} />
        </div>
      ) : (
        <div>
          {items.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 p-16 text-center bg-white my-8">
              <Search className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-base font-bold text-slate-900">No Outdoor Inventory Found</h3>
              <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
                No active hoardings or screens matched your selected criteria. Try adjusting your city, area, or category filters.
              </p>
              <div className="mt-6">
                <Link
                  href="/explore"
                  className="rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 transition"
                >
                  Clear All Filters
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {items.map((resource) => (
                <ResourceCard key={resource.uuid} resource={resource} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.last_page > 1 && (
            <div className="mt-12 flex items-center justify-center gap-2">
              {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map((pageNum) => {
                const isActive = pageNum === pagination.current_page;
                return (
                  <Link
                    key={pageNum}
                    href={{
                      pathname: '/explore',
                      query: { ...resolvedParams, page: pageNum.toString() },
                    }}
                    className={`h-9 w-9 rounded-xl flex items-center justify-center text-xs font-bold transition ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {pageNum}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
