import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Layers,
  Plus,
  Search,
  RotateCcw,
  Calendar,
  MoreVertical,
  MapPin,
  Eye,
  Edit,
  ExternalLink,
  SlidersHorizontal,
  Upload,
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '../../components/ui/Table';
import {
  AdvertisingResource,
  LocationMetadata,
  APPROVED_RESOURCE_TYPES,
} from '../types/resource';
import ResourceFormDrawer from '../components/resources/ResourceFormDrawer';
import ResourceDetailDrawer from '../components/resources/ResourceDetailDrawer';
import LocationInlineModal from '../components/resources/LocationInlineModal';
import ImportInventoryDrawer from '../components/resources/ImportInventoryDrawer';
import { SAMPLE_RESOURCES, SAMPLE_LOCATIONS } from '../data/sampleInventory';
import InventoryDateOccupationBar, {
  DatePreset,
} from '../components/resources/InventoryDateOccupationBar';
import OccupationStatusCards, {
  OccupationFilterType,
} from '../components/resources/OccupationStatusCards';
import { calculateResourceOccupation } from '../data/sampleResourceBookings';
import { BookingRecord } from '../types/booking';

// Helper to format Date to YYYY-MM-DD
const formatDateIso = (d: Date) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Current Month range helper (October 2026 active baseline)
const getMonthRange = (date: Date) => {
  const y = date.getFullYear();
  const m = date.getMonth();
  const first = new Date(y, m, 1);
  const last = new Date(y, m + 1, 0);
  return { start: formatDateIso(first), end: formatDateIso(last) };
};

// Current Week range helper (Monday - Sunday)
const getWeekRange = (date: Date) => {
  const d = new Date(date);
  const day = d.getDay(); // 0 is Sunday
  const diffToMonday = (day === 0 ? -6 : 1) - day;
  const monday = new Date(d);
  monday.setDate(d.getDate() + diffToMonday);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return { start: formatDateIso(monday), end: formatDateIso(sunday) };
};

export const ResourcesPage: React.FC = () => {
  // State for resources and supporting locations initialized with 10 sample records
  const [resources, setResources] = useState<AdvertisingResource[]>(SAMPLE_RESOURCES);
  const [locations, setLocations] = useState<LocationMetadata[]>(SAMPLE_LOCATIONS);

  // Filter and search state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedCity, setSelectedCity] = useState<string>('ALL');
  const [selectedArea, setSelectedArea] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedMarketplace, setSelectedMarketplace] = useState<string>('ALL');

  // Date-based Occupation state (Default: Current Month - Oct 2026)
  const [dateCursor, setDateCursor] = useState<Date>(() => new Date(2026, 9, 1));
  const [datePreset, setDatePreset] = useState<DatePreset>('current-month');
  const [startDate, setStartDate] = useState<string>(() => getMonthRange(new Date(2026, 9, 1)).start);
  const [endDate, setEndDate] = useState<string>(() => getMonthRange(new Date(2026, 9, 1)).end);

  // Click-to-filter Occupation Status Card filter
  const [activeOccupationFilter, setActiveOccupationFilter] = useState<OccupationFilterType>('ALL');

  // Load saved direct bookings if any from localStorage to blend with baseline bookings
  const savedBookings = useMemo<BookingRecord[]>(() => {
    try {
      const stored = localStorage.getItem('sodaars_provider_bookings');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }, []);

  // Compute total days in active window
  const selectedTotalDays = useMemo(() => {
    const s = new Date(startDate);
    const e = new Date(endDate);
    return Math.max(1, Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1);
  }, [startDate, endDate]);

  // Handle Preset changes
  const handlePresetChange = (newPreset: DatePreset) => {
    setDatePreset(newPreset);
    if (newPreset === 'current-month') {
      const base = new Date(2026, 9, 1); // Oct 2026
      setDateCursor(base);
      const r = getMonthRange(base);
      setStartDate(r.start);
      setEndDate(r.end);
    } else if (newPreset === 'current-week') {
      const base = new Date(2026, 9, 5); // Monday, 05 Oct 2026
      setDateCursor(base);
      const r = getWeekRange(base);
      setStartDate(r.start);
      setEndDate(r.end);
    } else if (newPreset === 'next-month') {
      const base = new Date(2026, 10, 1); // Nov 2026
      setDateCursor(base);
      const r = getMonthRange(base);
      setStartDate(r.start);
      setEndDate(r.end);
    }
  };

  // Step Date: previous or next week/month
  const handleStepDate = (direction: 'prev' | 'next') => {
    const factor = direction === 'next' ? 1 : -1;
    if (datePreset === 'current-week') {
      const nextDate = new Date(dateCursor);
      nextDate.setDate(nextDate.getDate() + factor * 7);
      setDateCursor(nextDate);
      const r = getWeekRange(nextDate);
      setStartDate(r.start);
      setEndDate(r.end);
    } else {
      // Month-based step
      const nextDate = new Date(dateCursor.getFullYear(), dateCursor.getMonth() + factor, 1);
      setDateCursor(nextDate);
      const r = getMonthRange(nextDate);
      setStartDate(r.start);
      setEndDate(r.end);
      if (datePreset !== 'custom') {
        setDatePreset('current-month');
      }
    }
  };

  // Reset to Current Month
  const handleResetCurrentMonth = () => {
    handlePresetChange('current-month');
  };

  // Custom date range change
  const handleCustomDateChange = (start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
  };

  // Calculate occupation map for all resources across [startDate, endDate]
  const resourceOccupationMap = useMemo(() => {
    const map = new Map<string, ReturnType<typeof calculateResourceOccupation>>();
    resources.forEach((r) => {
      map.set(r.id, calculateResourceOccupation(r.id, startDate, endDate, savedBookings));
    });
    return map;
  }, [resources, startDate, endDate, savedBookings]);

  // Aggregate metrics for active resources
  const activeResources = useMemo(() => {
    return resources.filter((r) => r.status === 'Active');
  }, [resources]);

  const activeResourcesCount = activeResources.length;

  const availableResourcesCount = useMemo(() => {
    return activeResources.filter((r) => {
      const occ = resourceOccupationMap.get(r.id);
      return occ?.status === 'AVAILABLE';
    }).length;
  }, [activeResources, resourceOccupationMap]);

  const partialResourcesCount = useMemo(() => {
    return activeResources.filter((r) => {
      const occ = resourceOccupationMap.get(r.id);
      return occ?.status === 'PARTIALLY_OCCUPIED';
    }).length;
  }, [activeResources, resourceOccupationMap]);

  const fullResourcesCount = useMemo(() => {
    return activeResources.filter((r) => {
      const occ = resourceOccupationMap.get(r.id);
      return occ?.status === 'FULLY_OCCUPIED';
    }).length;
  }, [activeResources, resourceOccupationMap]);

  // Overall Occupancy Rate % (booked-days across all active displays / total capacity days)
  const overallOccupancyPercent = useMemo(() => {
    if (activeResourcesCount === 0 || selectedTotalDays === 0) return 0;
    const totalCapacityDays = activeResourcesCount * selectedTotalDays;
    let totalBookedDays = 0;
    activeResources.forEach((r) => {
      const occ = resourceOccupationMap.get(r.id);
      if (occ) totalBookedDays += occ.bookedDays;
    });
    return Math.min(100, Math.round((totalBookedDays / totalCapacityDays) * 100));
  }, [activeResources, activeResourcesCount, selectedTotalDays, resourceOccupationMap]);

  // Modals & Drawers state
  const [isFormDrawerOpen, setIsFormDrawerOpen] = useState(false);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isImportDrawerOpen, setIsImportDrawerOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<AdvertisingResource | null>(null);
  const [selectedResource, setSelectedResource] = useState<AdvertisingResource | null>(null);

  // Active action menu row id
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Success toast message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };



  // Unique Cities derived from resources and locations
  const availableCities = useMemo(() => {
    const cities = new Set<string>();
    resources.forEach((r) => {
      if (r.location?.city) cities.add(r.location.city);
    });
    locations.forEach((l) => {
      if (l.city) cities.add(l.city);
    });
    return Array.from(cities).sort();
  }, [resources, locations]);

  // Unique Areas derived from resources and locations (filtered by selected city if any)
  const availableAreas = useMemo(() => {
    const areas = new Set<string>();
    resources.forEach((r) => {
      if (
        r.location?.area &&
        (selectedCity === 'ALL' || r.location.city.toLowerCase() === selectedCity.toLowerCase())
      ) {
        areas.add(r.location.area);
      }
    });
    locations.forEach((l) => {
      if (
        l.area &&
        (selectedCity === 'ALL' || l.city.toLowerCase() === selectedCity.toLowerCase())
      ) {
        areas.add(l.area);
      }
    });
    return Array.from(areas).sort();
  }, [resources, locations, selectedCity]);

  // Filtered resources
  const filteredResources = useMemo(() => {
    return resources.filter((r) => {
      // Search across name, site name, city, area, landmark
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === '' ||
        r.name.toLowerCase().includes(q) ||
        r.location.name.toLowerCase().includes(q) ||
        r.location.city.toLowerCase().includes(q) ||
        r.location.area.toLowerCase().includes(q) ||
        (r.location.landmark && r.location.landmark.toLowerCase().includes(q));

      // Type
      const matchesType = selectedType === 'ALL' || r.type === selectedType;

      // Location: City
      const matchesCity =
        selectedCity === 'ALL' ||
        r.location.city.toLowerCase() === selectedCity.toLowerCase();

      // Location: Area
      const matchesArea =
        selectedArea === 'ALL' ||
        r.location.area.toLowerCase() === selectedArea.toLowerCase();

      // Status
      const matchesStatus = selectedStatus === 'ALL' || r.status === selectedStatus;

      // Marketplace
      const matchesMarketplace =
        selectedMarketplace === 'ALL' ||
        (selectedMarketplace === 'YES' && r.marketplaceParticipation) ||
        (selectedMarketplace === 'NO' && !r.marketplaceParticipation);

      // Occupation Status Filter (from clicking status cards)
      if (activeOccupationFilter !== 'ALL') {
        const occ = resourceOccupationMap.get(r.id);
        if (!occ) return false;
        if (activeOccupationFilter === 'AVAILABLE' && occ.status !== 'AVAILABLE') return false;
        if (activeOccupationFilter === 'PARTIAL' && occ.status !== 'PARTIALLY_OCCUPIED') return false;
        if (activeOccupationFilter === 'FULL' && occ.status !== 'FULLY_OCCUPIED') return false;
      }

      return (
        matchesSearch &&
        matchesType &&
        matchesCity &&
        matchesArea &&
        matchesStatus &&
        matchesMarketplace
      );
    });
  }, [
    resources,
    searchQuery,
    selectedType,
    selectedCity,
    selectedArea,
    selectedStatus,
    selectedMarketplace,
    activeOccupationFilter,
    resourceOccupationMap,
  ]);

  const hasActiveFilters =
    searchQuery !== '' ||
    selectedType !== 'ALL' ||
    selectedCity !== 'ALL' ||
    selectedArea !== 'ALL' ||
    selectedStatus !== 'ALL' ||
    selectedMarketplace !== 'ALL' ||
    activeOccupationFilter !== 'ALL';

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedType('ALL');
    setSelectedCity('ALL');
    setSelectedArea('ALL');
    setSelectedStatus('ALL');
    setSelectedMarketplace('ALL');
    setActiveOccupationFilter('ALL');
  };

  // Handlers
  const handleAddNewLocation = (newLoc: LocationMetadata) => {
    setLocations((prev) => [...prev, newLoc]);
    showToast(`Location "${newLoc.name}" created successfully.`);
  };

  const handleSaveResource = (res: AdvertisingResource) => {
    if (editingResource) {
      setResources((prev) => prev.map((item) => (item.id === res.id ? res : item)));
      showToast(`Inventory item "${res.name}" updated successfully.`);
      if (selectedResource?.id === res.id) {
        setSelectedResource(res);
      }
    } else {
      setResources((prev) => [res, ...prev]);
      showToast(`Inventory item "${res.name}" registered successfully.`);
    }
    setEditingResource(null);
  };

  const handleImportResources = (imported: AdvertisingResource[]) => {
    setResources((prev) => [...imported, ...prev]);
    // Also add any new locations found in imported resources
    const newLocs = imported.map((r) => r.location).filter(Boolean);
    if (newLocs.length > 0) {
      setLocations((prev) => {
        const existingNames = new Set(prev.map((l) => l.name.toLowerCase()));
        const unique = newLocs.filter((l) => !existingNames.has(l.name.toLowerCase()));
        return [...prev, ...unique];
      });
    }
    showToast(`Successfully imported ${imported.length} inventory item${imported.length === 1 ? '' : 's'} as Inactive.`);
  };

  const handleToggleMarketplace = (resourceId: string, currentVal: boolean) => {
    const updatedVal = !currentVal;
    setResources((prev) =>
      prev.map((r) =>
        r.id === resourceId ? { ...r, marketplaceParticipation: updatedVal } : r
      )
    );
    if (selectedResource && selectedResource.id === resourceId) {
      setSelectedResource((prev) =>
        prev ? { ...prev, marketplaceParticipation: updatedVal } : null
      );
    }
    showToast(
      `Marketplace participation ${updatedVal ? 'enabled' : 'disabled'} for this resource.`
    );
  };

  const handleOpenEdit = (res: AdvertisingResource) => {
    setEditingResource(res);
    setIsFormDrawerOpen(true);
    setActiveMenuId(null);
  };

  const handleOpenDetail = (res: AdvertisingResource) => {
    setSelectedResource(res);
    setIsDetailDrawerOpen(true);
    setActiveMenuId(null);
  };

  // Status Badge Helper
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Active
          </span>
        );
      case 'Inactive':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-stone-100 text-stone-600 border border-stone-200">
            <span className="w-1.5 h-1.5 rounded-full bg-stone-400" />
            Inactive
          </span>
        );
      case 'Archived':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Archived
          </span>
        );
      default:
        return <Badge variant="inactive">{status}</Badge>;
    }
  };

  return (
    <div className="flex-1 flex flex-col w-full">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-3.5 rounded-lg bg-[#171717] text-white text-xs font-semibold shadow-lg flex items-center gap-2 border border-stone-800 transition-all animate-in fade-in slide-in-from-bottom-2">
          <span className="w-2 h-2 rounded-full bg-[#EA580C]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header (Stitch Specification) */}
      <PageHeader
        title="Inventory"
        description="Master ledger of registered static outdoor media displays (hoardings, unipoles, gantries, bus shelters). Manage specifications, pricing, and marketplace participation."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Upload size={14} className="text-[#EA580C]" />}
              onClick={() => setIsImportDrawerOpen(true)}
              className="border-[#E5E5E5] text-[#171717] hover:bg-[#FAFAF9]"
            >
              Import Inventory
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus size={14} />}
              onClick={() => {
                setEditingResource(null);
                setIsFormDrawerOpen(true);
              }}
            >
              Add Inventory
            </Button>
          </div>
        }
      />

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* ========================================================================= */}
        {/* 1. OCCUPATION DATE SELECTOR BAR                                           */}
        {/* ========================================================================= */}
        <InventoryDateOccupationBar
          preset={datePreset}
          onPresetChange={handlePresetChange}
          startDate={startDate}
          endDate={endDate}
          onCustomDateChange={handleCustomDateChange}
          onStepDate={handleStepDate}
          onResetToCurrentMonth={handleResetCurrentMonth}
          totalDays={selectedTotalDays}
        />

        {/* ========================================================================= */}
        {/* 2. DATE-FILTERED OCCUPATION STATUS CARDS (Click-to-filter active below)   */}
        {/* ========================================================================= */}
        <OccupationStatusCards
          totalActiveCount={activeResourcesCount}
          availableCount={availableResourcesCount}
          partialCount={partialResourcesCount}
          fullCount={fullResourcesCount}
          activeFilter={activeOccupationFilter}
          onFilterChange={setActiveOccupationFilter}
          overallOccupancyRate={overallOccupancyPercent}
        />

        {/* ========================================================================= */}
        {/* 2. SEARCH & FILTER CONTROLS BAR (Including Location-Specific Filters)     */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-xl p-4 border border-[#E5E5E5] shadow-xs space-y-3">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Left: Search input */}
            <div className="relative flex-1 max-w-md">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#737373]"
              />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, site, city, area, landmark..."
                className="w-full pl-9 pr-3 text-xs"
              />
            </div>

            {/* Right: Showing count & active indicator */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#737373]">
              <span className="font-medium text-[#171717]">
                Showing {filteredResources.length} of {resources.length} items
              </span>
              {hasActiveFilters && (
                <span className="text-[11px] font-semibold text-[#EA580C] bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">
                  Filtered
                </span>
              )}
              {activeOccupationFilter !== 'ALL' && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#EA580C] bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">
                  <span>Occupation: {activeOccupationFilter}</span>
                  <button
                    type="button"
                    onClick={() => setActiveOccupationFilter('ALL')}
                    className="hover:text-black cursor-pointer font-bold ml-0.5"
                    title="Clear occupation filter"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          </div>

          {/* Filter Dropdowns Row */}
          <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-[#F5F5F4]">
            <div className="flex items-center gap-1.5 text-xs text-[#737373] mr-0.5">
              <SlidersHorizontal size={13} />
              <span className="font-semibold text-[#171717]">Filters:</span>
            </div>

            {/* Static Resource Type Filter */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="text-xs h-8 px-2.5 py-1 rounded-md bg-[#FAFAF9] border border-[#E5E5E5] text-[#171717] focus:outline-none focus:border-[#EA580C]"
              title="Filter by Asset Type"
            >
              <option value="ALL">All Asset Types</option>
              {APPROVED_RESOURCE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>

            {/* Location Filter: City */}
            <div className="flex items-center">
              <select
                value={selectedCity}
                onChange={(e) => {
                  setSelectedCity(e.target.value);
                  setSelectedArea('ALL'); // Reset area when city changes
                }}
                className={`text-xs h-8 px-2.5 py-1 rounded-md border text-[#171717] focus:outline-none focus:border-[#EA580C] ${
                  selectedCity !== 'ALL'
                    ? 'bg-orange-50/50 border-orange-300 font-semibold'
                    : 'bg-[#FAFAF9] border-[#E5E5E5]'
                }`}
                title="Filter by City / Town"
              >
                <option value="ALL">All Cities ({availableCities.length})</option>
                {availableCities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            {/* Location Filter: Area / Locality */}
            <div className="flex items-center">
              <select
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className={`text-xs h-8 px-2.5 py-1 rounded-md border text-[#171717] focus:outline-none focus:border-[#EA580C] ${
                  selectedArea !== 'ALL'
                    ? 'bg-orange-50/50 border-orange-300 font-semibold'
                    : 'bg-[#FAFAF9] border-[#E5E5E5]'
                }`}
                title="Filter by Area / Locality"
              >
                <option value="ALL">
                  {selectedCity !== 'ALL'
                    ? `All Areas in ${selectedCity} (${availableAreas.length})`
                    : `All Areas (${availableAreas.length})`}
                </option>
                {availableAreas.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="text-xs h-8 px-2.5 py-1 rounded-md bg-[#FAFAF9] border border-[#E5E5E5] text-[#171717] focus:outline-none focus:border-[#EA580C]"
              title="Filter by Status"
            >
              <option value="ALL">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Archived">Archived</option>
            </select>

            {/* Marketplace Participation Filter */}
            <select
              value={selectedMarketplace}
              onChange={(e) => setSelectedMarketplace(e.target.value)}
              className="text-xs h-8 px-2.5 py-1 rounded-md bg-[#FAFAF9] border border-[#E5E5E5] text-[#171717] focus:outline-none focus:border-[#EA580C]"
              title="Filter by Marketplace Participation"
            >
              <option value="ALL">All Marketplace</option>
              <option value="YES">Participating (ON)</option>
              <option value="NO">Not Participating (OFF)</option>
            </select>

            {/* Reset Filters CTA */}
            {hasActiveFilters && (
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<RotateCcw size={12} />}
                onClick={resetFilters}
                className="h-8 text-xs py-0 px-2.5"
              >
                Reset
              </Button>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. MAIN DATA REGISTER / TABLE & EMPTY STATE                               */}
        {/* ========================================================================= */}
        {resources.length === 0 ? (
          /* Empty State: No resources registered yet */
          <div className="bg-white rounded-xl border border-[#E5E5E5] p-12 text-center shadow-xs flex flex-col items-center justify-center max-w-2xl mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-orange-50 text-[#EA580C] flex items-center justify-center mb-4 border border-orange-100 shadow-2xs">
              <Layers size={28} />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-[#171717]">
              No inventory registered yet
            </h3>
            <p className="text-xs sm:text-sm text-[#525252] max-w-md mt-1.5 leading-relaxed">
              Start building your static outdoor asset register. Register your hoardings, billboards, unipoles, and gantries to track availability, pricing, and client bookings.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
              <Button
                variant="primary"
                size="md"
                leftIcon={<Plus size={16} />}
                onClick={() => {
                  setEditingResource(null);
                  setIsFormDrawerOpen(true);
                }}
              >
                Add Inventory
              </Button>
              <Button
                variant="outline"
                size="md"
                leftIcon={<Upload size={15} className="text-[#EA580C]" />}
                onClick={() => setIsImportDrawerOpen(true)}
              >
                Import Inventory
              </Button>
              <Button
                variant="secondary"
                size="md"
                leftIcon={<MapPin size={15} className="text-[#EA580C]" />}
                onClick={() => setIsLocationModalOpen(true)}
              >
                Add Physical Location
              </Button>
            </div>

            <div className="mt-8 pt-6 border-t border-[#E5E5E5] w-full grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
              <div className="p-3 rounded-lg bg-[#FAFAF9] border border-[#E5E5E5]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373] block">
                  1. Static Only
                </span>
                <span className="text-xs font-semibold text-[#171717] mt-0.5 block">
                  Physical Media Faces
                </span>
                <span className="text-[11px] text-[#737373] mt-1 block">
                  Hoardings, unipoles, gantries, bus shelters (no digital/DOOH).
                </span>
              </div>

              <div className="p-3 rounded-lg bg-[#FAFAF9] border border-[#E5E5E5]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373] block">
                  2. Locations
                </span>
                <span className="text-xs font-semibold text-[#171717] mt-0.5 block">
                  Supporting Metadata
                </span>
                <span className="text-[11px] text-[#737373] mt-1 block">
                  Sites host one or more resources without separate navigation.
                </span>
              </div>

              <div className="p-3 rounded-lg bg-[#FAFAF9] border border-[#E5E5E5]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373] block">
                  3. Pricing Control
                </span>
                <span className="text-xs font-semibold text-[#171717] mt-0.5 block">
                  Customer &amp; SODAARS Rates
                </span>
                <span className="text-[11px] text-[#737373] mt-1 block">
                  Settlement price provided directly; no hardcoded platform markup.
                </span>
              </div>
            </div>
          </div>
        ) : filteredResources.length === 0 ? (
          /* Filter zero matches state */
          <div className="bg-white rounded-xl border border-[#E5E5E5] p-10 text-center shadow-xs flex flex-col items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-[#FAFAF9] border border-[#E5E5E5] flex items-center justify-center text-[#737373] mb-3">
              <Search size={18} />
            </div>
            <h4 className="text-sm font-bold text-[#171717]">No matching inventory found</h4>
            <p className="text-xs text-[#525252] mt-1 max-w-sm">
              None of your registered inventory matches the currently active search or filter criteria.
            </p>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<RotateCcw size={13} />}
              onClick={resetFilters}
              className="mt-4"
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          /* High-density Stitch Data Table */
          <div className="bg-white rounded-xl border border-[#E5E5E5] shadow-xs overflow-hidden">
            <div className="p-4 border-b border-[#E5E5E5] flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-[#FAFAF9]/60">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#171717]">
                  Inventory Register
                </span>
                <span className="text-[11px] font-mono text-[#737373] bg-[#E5E5E5]/60 px-2 py-0.5 rounded">
                  {filteredResources.length} of {resources.length}
                </span>
              </div>
              <span className="text-[11px] text-[#737373]">
                Click any row to open the Resource Detail Drawer
              </span>
            </div>

            {/* Contained horizontal scroll container for responsive protection */}
            <div className="w-full overflow-x-auto">
              <Table className="min-w-[1150px]">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-14">Media</TableHead>
                    <TableHead>Resource Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Physical Location</TableHead>
                    <TableHead>Dimensions</TableHead>
                    <TableHead>Orientation &amp; Illum.</TableHead>
                    <TableHead>Occupation ({selectedTotalDays}d)</TableHead>
                    <TableHead>Customer Price</TableHead>
                    <TableHead>SODAARS Price</TableHead>
                    <TableHead className="text-center">Marketplace</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredResources.map((res) => (
                    <TableRow
                      key={res.id}
                      className="cursor-pointer group"
                      onClick={() => handleOpenDetail(res)}
                    >
                      {/* Media Thumbnail */}
                      <TableCell className="w-14">
                        <div className="w-10 h-10 rounded-md bg-[#FAFAF9] border border-[#E5E5E5] overflow-hidden flex items-center justify-center shrink-0">
                          {res.mediaUrl ? (
                            <img
                              src={res.mediaUrl}
                              alt={res.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            <Layers size={16} className="text-[#EA580C]" />
                          )}
                        </div>
                      </TableCell>

                      {/* Resource Name */}
                      <TableCell>
                        <span className="font-bold text-xs text-[#171717] group-hover:text-[#EA580C] transition-colors leading-tight">
                          {res.name}
                        </span>
                      </TableCell>

                      {/* Static Resource Type */}
                      <TableCell>
                        <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-[#FAFAF9] text-[#171717] border border-[#E5E5E5]">
                          {res.type}
                        </span>
                      </TableCell>

                      {/* Location (Supporting Metadata) */}
                      <TableCell>
                        <div className="flex flex-col text-xs leading-tight">
                          <span className="font-semibold text-[#171717]">
                            {res.location.name}
                          </span>
                          <span className="text-[11px] text-[#737373] flex items-center gap-1 mt-0.5">
                            <MapPin size={10} className="text-[#EA580C]" />
                            {res.location.city}
                            {res.location.landmark && ` • ${res.location.landmark}`}
                          </span>
                        </div>
                      </TableCell>

                      {/* Dimensions & Area */}
                      <TableCell>
                        <div className="flex flex-col font-mono text-xs leading-tight">
                          <span className="font-bold text-[#171717]">
                            {res.widthFt}′ × {res.heightFt}′
                          </span>
                          <span className="text-[11px] text-[#737373]">
                            {res.totalSqFt} sq.ft
                          </span>
                        </div>
                      </TableCell>

                      {/* Orientation & Illumination */}
                      <TableCell>
                        <div className="flex flex-col text-xs leading-tight">
                          <span className="font-medium text-[#171717]">
                            {res.visibilityFacing}
                          </span>
                          <span className="text-[11px] text-[#737373]">
                            {res.illumination}
                          </span>
                        </div>
                      </TableCell>

                      {/* Occupation & Availability (Period-specific) */}
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        {(() => {
                          const occ = resourceOccupationMap.get(res.id);
                          if (!occ) return <span className="text-xs text-[#737373]">—</span>;

                          return (
                            <div className="flex flex-col gap-1 min-w-[155px] max-w-[185px]">
                              <div className="flex items-center justify-between text-xs">
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${occ.colorConfig.bg} ${occ.colorConfig.text} ${occ.colorConfig.border}`}>
                                  {occ.status === 'AVAILABLE' ? '✓ Available' : occ.colorConfig.label}
                                </span>
                                <span className="font-mono text-[11px] text-[#737373]">
                                  {occ.bookedDays}/{occ.totalDays}d
                                </span>
                              </div>

                              {/* Visual Progress Bar with exact required colors */}
                              <div className="w-full bg-[#E5E5E5] h-1.5 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all duration-300 ${occ.colorConfig.barBg}`}
                                  style={{ width: `${occ.occupancyPercent}%` }}
                                />
                              </div>

                              <span className="text-[10px] text-[#737373] truncate" title={occ.freeSlotHint}>
                                {occ.freeSlotHint}
                              </span>
                            </div>
                          );
                        })()}
                      </TableCell>

                      {/* Customer Price */}
                      <TableCell>
                        <span className="font-mono font-semibold text-xs text-[#171717]">
                          {res.customerPrice !== null
                            ? `₹${res.customerPrice.toLocaleString('en-IN')}`
                            : '—'}
                        </span>
                      </TableCell>

                      {/* SODAARS Price */}
                      <TableCell>
                        <span className="font-mono font-semibold text-xs text-[#EA580C]">
                          {res.sodaarsPrice !== null
                            ? `₹${res.sodaarsPrice.toLocaleString('en-IN')}`
                            : '—'}
                        </span>
                      </TableCell>

                      {/* Marketplace Participation Toggle */}
                      <TableCell
                        className="text-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          onClick={() =>
                            handleToggleMarketplace(
                              res.id,
                              res.marketplaceParticipation
                            )
                          }
                          className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                            res.marketplaceParticipation
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                              : 'bg-stone-100 text-stone-500 border border-stone-200 hover:bg-stone-200'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              res.marketplaceParticipation
                                ? 'bg-emerald-500'
                                : 'bg-stone-400'
                            }`}
                          />
                          {res.marketplaceParticipation ? 'Active' : 'Off'}
                        </button>
                      </TableCell>

                      {/* Status */}
                      <TableCell>{renderStatusBadge(res.status)}</TableCell>

                      {/* Actions */}
                      <TableCell
                        className="text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="relative inline-block text-left">
                          <button
                            onClick={() =>
                              setActiveMenuId(
                                activeMenuId === res.id ? null : res.id
                              )
                            }
                            className="p-1 rounded text-[#737373] hover:text-[#171717] hover:bg-[#F5F5F4] transition-colors cursor-pointer"
                            aria-label="Actions"
                          >
                            <MoreVertical size={16} />
                          </button>

                          {activeMenuId === res.id && (
                            <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-lg border border-[#E5E5E5] shadow-lg py-1 z-30 text-xs">
                              <button
                                onClick={() => handleOpenDetail(res)}
                                className="w-full flex items-center gap-2 px-3 py-1.5 text-left hover:bg-[#FAFAF9] text-[#171717] cursor-pointer"
                              >
                                <Eye size={13} className="text-[#737373]" />
                                View Details
                              </button>

                              <button
                                onClick={() => handleOpenEdit(res)}
                                className="w-full flex items-center gap-2 px-3 py-1.5 text-left hover:bg-[#FAFAF9] text-[#171717] cursor-pointer"
                              >
                                <Edit size={13} className="text-[#737373]" />
                                Edit Resource
                              </button>

                              <Link
                                to="/panel/availability"
                                className="w-full flex items-center gap-2 px-3 py-1.5 text-left hover:bg-[#FAFAF9] text-[#171717]"
                              >
                                <Calendar size={13} className="text-[#737373]" />
                                View Availability
                              </Link>

                              <div className="border-t border-[#E5E5E5] my-1" />

                              <button
                                onClick={() =>
                                  handleToggleMarketplace(
                                    res.id,
                                    res.marketplaceParticipation
                                  )
                                }
                                className="w-full flex items-center gap-2 px-3 py-1.5 text-left hover:bg-[#FAFAF9] text-[#EA580C] cursor-pointer"
                              >
                                <ExternalLink size={13} />
                                {res.marketplaceParticipation
                                  ? 'Disable Marketplace'
                                  : 'Enable Marketplace'}
                              </button>
                            </div>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 4. MODALS & DRAWERS SUPPORTING INTERACTIONS                               */}
      {/* ========================================================================= */}

      {/* Resource Form Drawer (Create / Edit) */}
      <ResourceFormDrawer
        isOpen={isFormDrawerOpen}
        onClose={() => {
          setIsFormDrawerOpen(false);
          setEditingResource(null);
        }}
        onSave={handleSaveResource}
        initialResource={editingResource}
        savedLocations={locations}
        onAddNewLocation={handleAddNewLocation}
      />

      {/* Resource Detail Drawer */}
      <ResourceDetailDrawer
        isOpen={isDetailDrawerOpen}
        onClose={() => {
          setIsDetailDrawerOpen(false);
          setSelectedResource(null);
        }}
        resource={selectedResource}
        onEdit={(res) => {
          setIsDetailDrawerOpen(false);
          handleOpenEdit(res);
        }}
        onToggleMarketplace={handleToggleMarketplace}
      />

      {/* Location Inline Modal */}
      <LocationInlineModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        onSave={handleAddNewLocation}
      />

      {/* Import Inventory Drawer (Upload & Blank Template Download) */}
      <ImportInventoryDrawer
        isOpen={isImportDrawerOpen}
        onClose={() => setIsImportDrawerOpen(false)}
        onImport={handleImportResources}
      />
    </div>
  );
};

export default ResourcesPage;
