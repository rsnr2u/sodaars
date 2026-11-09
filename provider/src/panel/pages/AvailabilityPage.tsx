import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  RotateCcw,
  Layers,
  Clock,
  CheckCircle2,
  CalendarDays,
  List,
  MapPin,
  Wrench,
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Button from '../../components/ui/Button';
import {
  AvailabilityState,
  AvailabilityInterval,
  ResourceAvailabilityItem,
  AVAILABILITY_STATE_CONFIG,
} from '../types/availability';
import { APPROVED_RESOURCE_TYPES, AdvertisingResource } from '../types/resource';
import { SAMPLE_RESOURCES, SAMPLE_LOCATIONS } from '../data/sampleInventory';
import { BASELINE_RESOURCE_BOOKINGS } from '../data/sampleResourceBookings';
import { SAMPLE_BOOKINGS } from '../data/sampleBookings';
import AvailabilityLegend from '../components/availability/AvailabilityLegend';
import CreateBlockModal from '../components/availability/CreateBlockModal';
import HoldDetailPopover from '../components/availability/HoldDetailPopover';
import AvailabilityDetailDrawer, {
  SelectedAvailabilityCell,
} from '../components/availability/AvailabilityDetailDrawer';

export const AvailabilityPage: React.FC = () => {
  const navigate = useNavigate();

  // 1. Current calendar view date cursor (Defaults to October 2026 baseline)
  const [currentDate, setCurrentDate] = useState<Date>(() => new Date(2026, 9, 1)); // October 2026

  // 2. View mode: 'matrix' (Days grid) or 'ledger' (List of scheduled intervals)
  const [viewMode, setViewMode] = useState<'matrix' | 'ledger'>('matrix');

  // 3. Resources: loaded from SAMPLE_RESOURCES + custom provider resources in localStorage
  const [resources] = useState<ResourceAvailabilityItem[]>(() => {
    try {
      const custom = localStorage.getItem('sodaars_custom_resources');
      const parsedCustom: AdvertisingResource[] = custom ? JSON.parse(custom) : [];
      const all = [...SAMPLE_RESOURCES, ...parsedCustom];
      return all.map((r) => ({
        id: r.id,
        name: r.name,
        code: (r as any).code || r.id,
        type: r.type,
        location: r.location,
        marketplaceParticipation: r.marketplaceParticipation ?? true,
        dailyRate: r.customerPrice
          ? Math.round(Number(r.customerPrice) / 30)
          : 2500,
      }));
    } catch {
      return SAMPLE_RESOURCES.map((r) => ({
        id: r.id,
        name: r.name,
        code: (r as any).code || r.id,
        type: r.type,
        location: r.location,
        marketplaceParticipation: r.marketplaceParticipation ?? true,
        dailyRate: r.customerPrice
          ? Math.round(Number(r.customerPrice) / 30)
          : 2500,
      }));
    }
  });

  // 4. Scheduled Intervals: combined from baseline resource bookings, sample bookings, custom bookings, and custom blocks
  const [intervals, setIntervals] = useState<AvailabilityInterval[]>(() => {
    const list: AvailabilityInterval[] = [];

    // A. Baseline bookings
    BASELINE_RESOURCE_BOOKINGS.forEach((b) => {
      list.push({
        id: b.id,
        resourceId: b.resourceId,
        startDate: b.startDate,
        endDate: b.endDate,
        state: 'Booked',
        clientName: b.clientName,
        bookingRef: b.id.toUpperCase(),
      });
    });

    // B. Sample bookings (confirmed, active, or hold)
    SAMPLE_BOOKINGS.forEach((b) => {
      const isHold = b.status === 'UNDER REVIEW' || (b.status as string) === 'HOLD';
      const isBooked = b.status === 'CONFIRMED' || b.status === 'ACTIVE' || b.status === 'COMPLETED';
      if (isBooked || isHold) {
        list.push({
          id: b.id,
          resourceId: b.resourceId,
          startDate: b.startDate,
          endDate: b.endDate,
          state: isHold ? 'Hold' : 'Booked',
          clientName: b.companyName || b.customerName,
          bookingRef: b.id,
          holdRef: isHold ? `HOLD-${b.id}` : undefined,
        });
      }
    });

    // C. User created bookings from localStorage
    try {
      const storedBookings = localStorage.getItem('sodaars_provider_bookings');
      if (storedBookings) {
        const parsed = JSON.parse(storedBookings);
        parsed.forEach((b: any) => {
          const isHold = b.status === 'UNDER_REVIEW' || b.status === 'HOLD' || b.status === 'hold';
          const isBooked = b.status === 'CONFIRMED' || b.status === 'ACTIVE';
          if (isBooked || isHold) {
            list.push({
              id: b.id,
              resourceId: b.resourceId,
              startDate: b.startDate,
              endDate: b.endDate,
              state: isHold ? 'Hold' : 'Booked',
              clientName: b.companyName || b.customerName,
              bookingRef: b.id,
              holdRef: isHold ? `HOLD-${b.id}` : undefined,
            });
          }
        });
      }
    } catch {}

    // D. User created blocks from localStorage
    try {
      const storedBlocks = localStorage.getItem('sodaars_availability_blocks');
      if (storedBlocks) {
        const parsed = JSON.parse(storedBlocks);
        parsed.forEach((blk: any) => {
          list.push(blk);
        });
      }
    } catch {}

    return list;
  });

  // 5. Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedStateFilter, setSelectedStateFilter] = useState('ALL'); // Legend filter (Available, Booked, Hold, etc.)
  const [occupancyPresetFilter, setOccupancyPresetFilter] = useState<'ALL' | 'OCCUPIED' | 'AVAILABLE' | 'HIGH_DEMAND'>('ALL');

  // Location Hierarchy Filters
  const [selectedState, setSelectedState] = useState('ALL');
  const [selectedCity, setSelectedCity] = useState('ALL');
  const [selectedArea, setSelectedArea] = useState('ALL');
  const [selectedRoute, setSelectedRoute] = useState('ALL');

  // 6. Modals & Drawers state
  const [isCreateBlockOpen, setIsCreateBlockOpen] = useState(false);
  const [preselectedResourceId, setPreselectedResourceId] = useState<string | undefined>(undefined);
  const [preselectedDate, setPreselectedDate] = useState<string | undefined>(undefined);

  const [selectedCell, setSelectedCell] = useState<SelectedAvailabilityCell | null>(null);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);

  const [holdDetailData, setHoldDetailData] = useState<{
    isOpen: boolean;
    resourceName: string;
    resourceType: string;
    locationName: string;
    dateRange: string;
    holdRef?: string;
  }>({
    isOpen: false,
    resourceName: '',
    resourceType: '',
    locationName: '',
    dateRange: '',
  });

  // Toast message
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Month navigation helpers
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleGoToToday = () => {
    setCurrentDate(new Date(2026, 9, 1)); // Jump to active baseline Oct 2026
  };

  // Generate days array for current month
  const daysArray = useMemo(() => {
    const days: { dayNumber: number; dateString: string; dayName: string; isToday: boolean; isWeekend: boolean }[] = [];
    const today = new Date();
    const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(
      today.getDate()
    ).padStart(2, '0')}`;

    for (let d = 1; d <= daysInMonth; d++) {
      const dateObj = new Date(year, month, d);
      const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
      const dayOfWeek = dateObj.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

      days.push({
        dayNumber: d,
        dateString,
        dayName,
        isToday: dateString === todayString || (year === 2026 && month === 9 && d === 22),
        isWeekend,
      });
    }
    return days;
  }, [year, month, daysInMonth]);

  // Derived Location Options based on all resources and locations
  const availableStates = useMemo(() => {
    const states = new Set<string>();
    resources.forEach((r) => {
      if (r.location?.state) states.add(r.location.state);
    });
    SAMPLE_LOCATIONS.forEach((l) => {
      if (l.state) states.add(l.state);
    });
    return Array.from(states).sort();
  }, [resources]);

  const availableCities = useMemo(() => {
    const cities = new Set<string>();
    resources.forEach((r) => {
      const matchState =
        selectedState === 'ALL' || (r.location?.state || '').toLowerCase() === selectedState.toLowerCase();
      if (r.location?.city && matchState) cities.add(r.location.city);
    });
    SAMPLE_LOCATIONS.forEach((l) => {
      const matchState =
        selectedState === 'ALL' || (l.state || '').toLowerCase() === selectedState.toLowerCase();
      if (l.city && matchState) cities.add(l.city);
    });
    return Array.from(cities).sort();
  }, [resources, selectedState]);

  const availableAreas = useMemo(() => {
    const areas = new Set<string>();
    resources.forEach((r) => {
      const matchState =
        selectedState === 'ALL' || (r.location?.state || '').toLowerCase() === selectedState.toLowerCase();
      const matchCity =
        selectedCity === 'ALL' || (r.location?.city || '').toLowerCase() === selectedCity.toLowerCase();
      if (r.location?.area && matchState && matchCity) areas.add(r.location.area);
    });
    SAMPLE_LOCATIONS.forEach((l) => {
      const matchState =
        selectedState === 'ALL' || (l.state || '').toLowerCase() === selectedState.toLowerCase();
      const matchCity =
        selectedCity === 'ALL' || (l.city || '').toLowerCase() === selectedCity.toLowerCase();
      if (l.area && matchState && matchCity) areas.add(l.area);
    });
    return Array.from(areas).sort();
  }, [resources, selectedState, selectedCity]);

  const availableRoutes = useMemo(() => {
    const routes = new Set<string>();
    resources.forEach((r) => {
      const matchState =
        selectedState === 'ALL' || (r.location?.state || '').toLowerCase() === selectedState.toLowerCase();
      const matchCity =
        selectedCity === 'ALL' || (r.location?.city || '').toLowerCase() === selectedCity.toLowerCase();
      const matchArea =
        selectedArea === 'ALL' || (r.location?.area || '').toLowerCase() === selectedArea.toLowerCase();
      if (r.location?.routeName && matchState && matchCity && matchArea) routes.add(r.location.routeName);
    });
    SAMPLE_LOCATIONS.forEach((l) => {
      const matchState =
        selectedState === 'ALL' || (l.state || '').toLowerCase() === selectedState.toLowerCase();
      const matchCity =
        selectedCity === 'ALL' || (l.city || '').toLowerCase() === selectedCity.toLowerCase();
      const matchArea =
        selectedArea === 'ALL' || (l.area || '').toLowerCase() === selectedArea.toLowerCase();
      if (l.routeName && matchState && matchCity && matchArea) routes.add(l.routeName);
    });
    return Array.from(routes).sort();
  }, [resources, selectedState, selectedCity, selectedArea]);

  // Precedence-based Availability State Resolver
  // Order: Admin Block > Maintenance > Booked > Provider Block > Hold > Available
  const getResourceDateState = (
    resourceId: string,
    dateString: string
  ): { state: AvailabilityState; interval?: AvailabilityInterval } => {
    const matches = intervals.filter(
      (int) => int.resourceId === resourceId && dateString >= int.startDate && dateString <= int.endDate
    );

    if (matches.length === 0) {
      return { state: 'Available' };
    }

    const precedence: Record<AvailabilityState, number> = {
      'Admin Block': 6,
      Maintenance: 5,
      Booked: 4,
      'Provider Block': 3,
      Hold: 2,
      Available: 1,
    };

    matches.sort((a, b) => (precedence[b.state] || 0) - (precedence[a.state] || 0));
    return { state: matches[0].state, interval: matches[0] };
  };

  // Calculate monthly utilization stats for each resource
  const resourceMonthUtilization = useMemo(() => {
    const map = new Map<string, { bookedCount: number; holdCount: number; blockedCount: number; percent: number }>();
    resources.forEach((res) => {
      let booked = 0;
      let hold = 0;
      let blocked = 0;
      daysArray.forEach((d) => {
        const { state } = getResourceDateState(res.id, d.dateString);
        if (state === 'Booked') booked++;
        else if (state === 'Hold') hold++;
        else if (state === 'Provider Block' || state === 'Maintenance' || state === 'Admin Block') blocked++;
      });
      const occupied = booked + hold + blocked;
      const percent = Math.round((occupied / daysInMonth) * 100);
      map.set(res.id, { bookedCount: booked, holdCount: hold, blockedCount: blocked, percent });
    });
    return map;
  }, [resources, daysArray, intervals, daysInMonth]);

  // Filtered resources
  const filteredResources = useMemo(() => {
    return resources.filter((r) => {
      // 1. Text Search
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesName = r.name.toLowerCase().includes(q);
        const matchesCode = (r.code || '').toLowerCase().includes(q);
        const matchesLocationName = (r.location?.name || '').toLowerCase().includes(q);
        const matchesCity = (r.location?.city || '').toLowerCase().includes(q);
        const matchesArea = (r.location?.area || '').toLowerCase().includes(q);
        const matchesRoute = (r.location?.routeName || '').toLowerCase().includes(q);
        if (!matchesName && !matchesCode && !matchesLocationName && !matchesCity && !matchesArea && !matchesRoute) {
          return false;
        }
      }

      // 2. Asset Type Filter
      if (selectedType !== 'ALL' && r.type !== selectedType) {
        return false;
      }

      // 3. Location Filters
      if (selectedState !== 'ALL') {
        if ((r.location?.state || '').toLowerCase() !== selectedState.toLowerCase()) return false;
      }
      if (selectedCity !== 'ALL') {
        if ((r.location?.city || '').toLowerCase() !== selectedCity.toLowerCase()) return false;
      }
      if (selectedArea !== 'ALL') {
        if ((r.location?.area || '').toLowerCase() !== selectedArea.toLowerCase()) return false;
      }
      if (selectedRoute !== 'ALL') {
        if ((r.location?.routeName || '').toLowerCase() !== selectedRoute.toLowerCase()) return false;
      }

      // 4. Occupancy Presets Filter
      if (occupancyPresetFilter !== 'ALL') {
        const util = resourceMonthUtilization.get(r.id);
        const p = util?.percent || 0;
        if (occupancyPresetFilter === 'OCCUPIED' && p === 0) return false;
        if (occupancyPresetFilter === 'AVAILABLE' && p > 0) return false;
        if (occupancyPresetFilter === 'HIGH_DEMAND' && p < 70) return false;
      }

      // 5. State filter from legend (e.g. only show resources that have at least one day of that state this month)
      if (selectedStateFilter !== 'ALL') {
        const hasDayWithState = daysArray.some((d) => {
          const { state } = getResourceDateState(r.id, d.dateString);
          return state === selectedStateFilter;
        });
        if (!hasDayWithState) return false;
      }

      return true;
    });
  }, [
    resources,
    searchQuery,
    selectedType,
    selectedState,
    selectedCity,
    selectedArea,
    selectedRoute,
    occupancyPresetFilter,
    selectedStateFilter,
    resourceMonthUtilization,
    daysArray,
  ]);

  // Summary counts for current month across all registered resources
  const summaryMetrics = useMemo(() => {
    let availableCount = 0;
    let bookedCount = 0;
    let holdCount = 0;
    let providerBlockCount = 0;
    let maintenanceCount = 0;

    resources.forEach((res) => {
      daysArray.forEach((d) => {
        const { state } = getResourceDateState(res.id, d.dateString);
        if (state === 'Available') availableCount++;
        else if (state === 'Booked') bookedCount++;
        else if (state === 'Hold') holdCount++;
        else if (state === 'Provider Block') providerBlockCount++;
        else if (state === 'Maintenance' || state === 'Admin Block') maintenanceCount++;
      });
    });

    const totalSlots = resources.length * daysInMonth;
    const occupiedSlots = bookedCount + holdCount + providerBlockCount + maintenanceCount;
    const occupancyRate = totalSlots > 0 ? Math.round((occupiedSlots / totalSlots) * 100) : 0;

    return {
      availableCount,
      bookedCount,
      holdCount,
      providerBlockCount,
      maintenanceCount,
      occupancyRate,
      totalSlots,
    };
  }, [resources, daysArray, intervals, daysInMonth]);

  // Handlers
  const handleSaveBlock = (block: {
    resourceId: string;
    startDate: string;
    endDate: string;
    state: 'Provider Block' | 'Maintenance';
    reason?: string;
    notes?: string;
  }) => {
    const newInterval: AvailabilityInterval = {
      id: `blk-${Date.now()}`,
      resourceId: block.resourceId,
      startDate: block.startDate,
      endDate: block.endDate,
      state: block.state,
      reason: block.reason,
      notes: block.notes,
      createdAt: new Date().toISOString().split('T')[0],
    };

    const updated = [newInterval, ...intervals];
    setIntervals(updated);

    try {
      const stored = localStorage.getItem('sodaars_availability_blocks');
      const parsed = stored ? JSON.parse(stored) : [];
      localStorage.setItem('sodaars_availability_blocks', JSON.stringify([newInterval, ...parsed]));
    } catch {}

    showToast(`${block.state} applied successfully for ${block.startDate} → ${block.endDate}.`);
  };

  const handleReleaseBlock = (intervalId: string) => {
    const updated = intervals.filter((i) => i.id !== intervalId);
    setIntervals(updated);

    try {
      const stored = localStorage.getItem('sodaars_availability_blocks');
      if (stored) {
        const parsed = JSON.parse(stored);
        const filtered = parsed.filter((b: any) => b.id !== intervalId);
        localStorage.setItem('sodaars_availability_blocks', JSON.stringify(filtered));
      }
    } catch {}

    showToast('Block released successfully. Dates restored to Available.');
  };

  const handleCellClick = (resource: ResourceAvailabilityItem, day: (typeof daysArray)[0]) => {
    const { state, interval } = getResourceDateState(resource.id, day.dateString);
    const formatted = `${day.dayNumber} ${monthNames[month]} ${year} (${day.dayName})`;

    setSelectedCell({
      resource,
      date: day.dateString,
      formattedDate: formatted,
      state,
      intervalId: interval?.id,
      bookingRef: interval?.bookingRef,
      holdRef: interval?.holdRef,
    });

    setIsDetailDrawerOpen(true);
  };

  const hasActiveFilters =
    searchQuery !== '' ||
    selectedType !== 'ALL' ||
    selectedStateFilter !== 'ALL' ||
    occupancyPresetFilter !== 'ALL' ||
    selectedState !== 'ALL' ||
    selectedCity !== 'ALL' ||
    selectedArea !== 'ALL' ||
    selectedRoute !== 'ALL';

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedType('ALL');
    setSelectedStateFilter('ALL');
    setOccupancyPresetFilter('ALL');
    setSelectedState('ALL');
    setSelectedCity('ALL');
    setSelectedArea('ALL');
    setSelectedRoute('ALL');
  };

  return (
    <div className="flex-1 flex flex-col w-full bg-[#F8FAFC] min-h-[calc(100vh-4rem)]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-3.5 rounded-xl bg-[#1A2435] text-white text-xs font-semibold shadow-xl flex items-center gap-2.5 border border-slate-700 animate-slide-up">
          <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <PageHeader
        eyebrow="Core Solution • Availability Engine"
        title="Availability & Slot Manager"
        description="Authoritative resource-level scheduling ledger. Track real-time confirmed flights, provisional client holds, provider offline blocks, and structural maintenance."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/panel/bookings/create')}
              leftIcon={<Layers size={14} className="text-[#E11D2E]" />}
              className="border-[#E2E8F0] text-[#1A2435] hover:bg-white text-xs font-semibold"
            >
              + Create Booking
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus size={14} />}
              onClick={() => {
                setPreselectedResourceId(undefined);
                setPreselectedDate(undefined);
                setIsCreateBlockOpen(true);
              }}
              className="bg-[#E11D2E] hover:bg-[#c81926] text-white text-xs font-bold"
            >
              + Place Block
            </Button>
          </div>
        }
      />

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-5">
        {/* ========================================================================= */}
        {/* 1. OPERATIONAL SUMMARY STRIP                                              */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
          {/* TOTAL MONITORED ASSETS */}
          <div className="bg-white rounded-xl p-4 border border-[#E2E8F0] shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                Registered Assets
              </span>
              <Layers size={14} className="text-[#1A2435]" />
            </div>
            <div className="my-1.5 flex items-baseline gap-2">
              <span className="text-2xl font-black text-[#1A2435] leading-none">
                {resources.length}
              </span>
              <span className="text-xs text-[#64748B]">units</span>
            </div>
            <div className="text-[11px] text-[#64748B] flex items-center justify-between">
              <span>{monthNames[month]} {year}</span>
              <span className="font-bold text-[#E11D2E]">{summaryMetrics.occupancyRate}% Occupied</span>
            </div>
          </div>

          {/* AVAILABLE DAYS */}
          <div className="bg-white rounded-xl p-4 border border-[#E2E8F0] shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                Available Days
              </span>
              <CheckCircle2 size={14} className="text-emerald-600" />
            </div>
            <div className="my-1.5 flex items-baseline gap-2">
              <span className="text-2xl font-black text-emerald-700 leading-none">
                {summaryMetrics.availableCount}
              </span>
              <span className="text-xs text-[#64748B]">days open</span>
            </div>
            <span className="text-[11px] text-emerald-800 font-medium">
              Immediate direct sale ready
            </span>
          </div>

          {/* BOOKED CONTRACTS */}
          <div className="bg-white rounded-xl p-4 border border-[#E2E8F0] shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                Confirmed Flights
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#1A2435]" />
            </div>
            <div className="my-1.5 flex items-baseline gap-2">
              <span className="text-2xl font-black text-[#1A2435] leading-none">
                {summaryMetrics.bookedCount}
              </span>
              <span className="text-xs text-[#64748B]">days locked</span>
            </div>
            <span className="text-[11px] text-[#64748B]">
              Legally binding contracts
            </span>
          </div>

          {/* PROVISIONAL HOLDS */}
          <div className="bg-white rounded-xl p-4 border border-[#E2E8F0] shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                Client Soft Holds
              </span>
              <Clock size={14} className="text-amber-600" />
            </div>
            <div className="my-1.5 flex items-baseline gap-2">
              <span className="text-2xl font-black text-amber-700 leading-none">
                {summaryMetrics.holdCount}
              </span>
              <span className="text-xs text-[#64748B]">days tentative</span>
            </div>
            <span className="text-[11px] text-amber-800 font-medium">
              48–72h quote holds
            </span>
          </div>

          {/* PROVIDER BLOCKS & MAINTENANCE */}
          <div className="bg-white rounded-xl p-4 border border-[#E2E8F0] shadow-xs flex flex-col justify-between col-span-2 md:col-span-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                Blocks &amp; Maintenance
              </span>
              <Wrench size={14} className="text-[#E11D2E]" />
            </div>
            <div className="my-1.5 flex items-baseline gap-2">
              <span className="text-2xl font-black text-[#E11D2E] leading-none">
                {summaryMetrics.providerBlockCount + summaryMetrics.maintenanceCount}
              </span>
              <span className="text-xs text-[#64748B]">days frozen</span>
            </div>
            <span className="text-[11px] text-[#64748B]">
              Internal reserve / structural
            </span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. AVAILABILITY LEGEND BAR                                                */}
        {/* ========================================================================= */}
        <AvailabilityLegend
          selectedStateFilter={selectedStateFilter}
          onSelectStateFilter={(st) => setSelectedStateFilter(st)}
        />

        {/* ========================================================================= */}
        {/* 3. CONTROLS, SEARCH, FILTERS & LOCATION BAR                               */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs p-4 space-y-3.5">
          {/* Top Row: Date Navigator, Search, Asset Type & View Toggle */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            {/* Left: Date Month Navigator */}
            <div className="flex items-center gap-1.5 shrink-0">
              <div className="inline-flex items-center border border-[#E2E8F0] rounded-lg bg-white p-1 shadow-2xs">
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  className="p-1 rounded hover:bg-[#F4F6F8] text-[#1A2435] transition-colors cursor-pointer"
                  title="Previous month"
                >
                  <ChevronLeft size={16} />
                </button>
                <div className="px-3 text-xs font-bold text-[#1A2435] min-w-[125px] text-center">
                  {monthNames[month]} {year}
                </div>
                <button
                  type="button"
                  onClick={handleNextMonth}
                  className="p-1 rounded hover:bg-[#F4F6F8] text-[#1A2435] transition-colors cursor-pointer"
                  title="Next month"
                >
                  <ChevronRight size={16} />
                </button>
              </div>

              <button
                type="button"
                onClick={handleGoToToday}
                className="px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-[#E2E8F0] bg-white text-[#1A2435] hover:bg-[#F4F6F8] transition-colors cursor-pointer shadow-2xs"
              >
                Today
              </button>
            </div>

            {/* Center: Search Query */}
            <div className="flex-1 relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#94A3B8]"
              />
              <input
                type="text"
                placeholder="Search resources by code, landmark, route name, corridor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs h-9 pl-9 pr-3 rounded-lg border border-[#E2E8F0] text-[#1A2435] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#E11D2E] bg-white"
              />
            </div>

            {/* Right: Asset Type Dropdown & View Mode Switcher */}
            <div className="flex items-center gap-2 shrink-0">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="text-xs h-9 px-3 rounded-lg border border-[#E2E8F0] bg-white text-[#1A2435] focus:outline-none focus:border-[#E11D2E]"
              >
                <option value="ALL">All Asset Types</option>
                {APPROVED_RESOURCE_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>

              {/* View Mode Toggle: Matrix vs Ledger */}
              <div className="flex items-center border border-[#E2E8F0] rounded-lg bg-[#F8FAFC] p-0.5">
                <button
                  type="button"
                  onClick={() => setViewMode('matrix')}
                  className={`px-2.5 py-1.5 rounded-md flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer ${
                    viewMode === 'matrix'
                      ? 'bg-white text-[#E11D2E] shadow-xs'
                      : 'text-[#64748B] hover:text-[#1A2435]'
                  }`}
                  title="Timeline Matrix"
                >
                  <CalendarDays size={14} />
                  <span className="hidden sm:inline">Matrix</span>
                </button>

                <button
                  type="button"
                  onClick={() => setViewMode('ledger')}
                  className={`px-2.5 py-1.5 rounded-md flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer ${
                    viewMode === 'ledger'
                      ? 'bg-white text-[#E11D2E] shadow-xs'
                      : 'text-[#64748B] hover:text-[#1A2435]'
                  }`}
                  title="Interval Ledger"
                >
                  <List size={14} />
                  <span className="hidden sm:inline">Ledger</span>
                </button>
              </div>

              {/* Reset Button */}
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={<RotateCcw size={13} />}
                  onClick={resetFilters}
                  className="text-xs text-[#64748B] hover:text-[#1A2435]"
                >
                  Reset
                </Button>
              )}
            </div>
          </div>

          {/* Bottom Row: Multi-Tier Geographic & Corridor Filter Row */}
          <div className="flex flex-wrap items-center gap-2 pt-2.5 border-t border-[#E2E8F0]">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#1A2435] pr-1">
              <MapPin size={13} className="text-[#E11D2E]" />
              <span>Location:</span>
            </div>

            {/* State Filter */}
            <select
              value={selectedState}
              onChange={(e) => {
                setSelectedState(e.target.value);
                setSelectedCity('ALL');
                setSelectedArea('ALL');
                setSelectedRoute('ALL');
              }}
              className={`text-xs h-8 px-2.5 py-1 rounded-md border text-[#1A2435] focus:outline-none focus:border-[#E11D2E] transition-colors ${
                selectedState !== 'ALL'
                  ? 'border-[#E11D2E] bg-red-50/50 font-bold text-[#E11D2E]'
                  : 'border-[#E2E8F0] bg-white'
              }`}
            >
              <option value="ALL">All States ({availableStates.length})</option>
              {availableStates.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>

            {/* City Filter */}
            <select
              value={selectedCity}
              onChange={(e) => {
                setSelectedCity(e.target.value);
                setSelectedArea('ALL');
                setSelectedRoute('ALL');
              }}
              className={`text-xs h-8 px-2.5 py-1 rounded-md border text-[#1A2435] focus:outline-none focus:border-[#E11D2E] transition-colors ${
                selectedCity !== 'ALL'
                  ? 'border-[#E11D2E] bg-red-50/50 font-bold text-[#E11D2E]'
                  : 'border-[#E2E8F0] bg-white'
              }`}
            >
              <option value="ALL">All Cities ({availableCities.length})</option>
              {availableCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>

            {/* Area Filter */}
            <select
              value={selectedArea}
              onChange={(e) => {
                setSelectedArea(e.target.value);
                setSelectedRoute('ALL');
              }}
              className={`text-xs h-8 px-2.5 py-1 rounded-md border text-[#1A2435] focus:outline-none focus:border-[#E11D2E] transition-colors ${
                selectedArea !== 'ALL'
                  ? 'border-[#E11D2E] bg-red-50/50 font-bold text-[#E11D2E]'
                  : 'border-[#E2E8F0] bg-white'
              }`}
            >
              <option value="ALL">All Areas ({availableAreas.length})</option>
              {availableAreas.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>

            {/* Route / Arterial Corridor Filter */}
            <select
              value={selectedRoute}
              onChange={(e) => setSelectedRoute(e.target.value)}
              className={`text-xs h-8 px-2.5 py-1 rounded-md border text-[#1A2435] focus:outline-none focus:border-[#E11D2E] transition-colors ${
                selectedRoute !== 'ALL'
                  ? 'border-[#E11D2E] bg-red-50/50 font-bold text-[#E11D2E]'
                  : 'border-[#E2E8F0] bg-white'
              }`}
            >
              <option value="ALL">All Routes / Corridors ({availableRoutes.length})</option>
              {availableRoutes.map((route) => (
                <option key={route} value={route}>
                  {route}
                </option>
              ))}
            </select>

            {/* Quick Utilization Preset Chips */}
            <div className="ml-auto flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] text-[#64748B] hidden sm:inline">Utilization:</span>
              <button
                type="button"
                onClick={() => setOccupancyPresetFilter('ALL')}
                className={`text-[10px] px-2 py-0.5 rounded-full font-bold cursor-pointer transition-colors ${
                  occupancyPresetFilter === 'ALL'
                    ? 'bg-[#1A2435] text-white'
                    : 'bg-[#F1F5F9] text-[#64748B] hover:text-[#1A2435]'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setOccupancyPresetFilter('OCCUPIED')}
                className={`text-[10px] px-2 py-0.5 rounded-full font-bold cursor-pointer transition-colors ${
                  occupancyPresetFilter === 'OCCUPIED'
                    ? 'bg-[#1A2435] text-white'
                    : 'bg-[#F1F5F9] text-[#64748B] hover:text-[#1A2435]'
                }`}
              >
                Occupied (&gt;0%)
              </button>
              <button
                type="button"
                onClick={() => setOccupancyPresetFilter('HIGH_DEMAND')}
                className={`text-[10px] px-2 py-0.5 rounded-full font-bold cursor-pointer transition-colors ${
                  occupancyPresetFilter === 'HIGH_DEMAND'
                    ? 'bg-[#E11D2E] text-white'
                    : 'bg-red-50 text-[#E11D2E] hover:bg-red-100'
                }`}
              >
                🔥 High Demand (&gt;70%)
              </button>
              <button
                type="button"
                onClick={() => setOccupancyPresetFilter('AVAILABLE')}
                className={`text-[10px] px-2 py-0.5 rounded-full font-bold cursor-pointer transition-colors ${
                  occupancyPresetFilter === 'AVAILABLE'
                    ? 'bg-emerald-700 text-white'
                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                }`}
              >
                100% Free
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4. MAIN AVAILABILITY WORKSPACE (MATRIX OR LEDGER)                         */}
        {/* ========================================================================= */}
        {resources.length === 0 ? (
          /* Empty Registered Resources State */
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-12 text-center shadow-xs flex flex-col items-center justify-center max-w-lg mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-red-50 text-[#E11D2E] flex items-center justify-center mb-4 border border-red-100 shadow-2xs">
              <CalendarIcon size={28} />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-[#1A2435]">
              No advertising resources registered
            </h3>
            <p className="text-xs sm:text-sm text-[#64748B] max-w-md mt-1.5 leading-relaxed">
              Register advertising resources to inspect and manage scheduling, holds, and provider blocks.
            </p>
            <div className="mt-6 flex items-center justify-center">
              <Link to="/panel/resources">
                <Button variant="primary" size="md" leftIcon={<Layers size={15} />} className="bg-[#E11D2E] text-white">
                  Go to Advertising Resources
                </Button>
              </Link>
            </div>
          </div>
        ) : filteredResources.length === 0 ? (
          /* Zero Results for Filters */
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-10 text-center shadow-xs flex flex-col items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-[#64748B] mb-3">
              <Search size={18} />
            </div>
            <h4 className="text-sm font-bold text-[#1A2435]">No matching resources found</h4>
            <p className="text-xs text-[#64748B] mt-1 max-w-sm">
              None of your registered advertising resources match the currently active search or location filters.
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
        ) : viewMode === 'matrix' ? (
          /* ========================================================================= */
          /* 4A. TIMELINE MATRIX VIEW (Interactive Horizontal Grid)                    */
          /* ========================================================================= */
          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs overflow-hidden">
            {/* Header info bar */}
            <div className="p-3.5 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#1A2435]">
                  Monthly Slot Matrix
                </span>
                <span className="text-[11px] font-mono text-[#64748B] bg-white border border-[#E2E8F0] px-2 py-0.5 rounded">
                  {monthNames[month]} {year} • Showing {filteredResources.length} of {resources.length} Assets
                </span>
              </div>
              <span className="text-[11px] text-[#64748B] hidden sm:inline">
                💡 Click any cell to inspect reservation, place provider block, or create direct booking
              </span>
            </div>

            {/* Contained Horizontal Scroll Container */}
            <div className="w-full overflow-x-auto scrollbar-thin">
              <table className="w-full border-collapse text-left min-w-[980px]">
                <thead>
                  <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
                    {/* Sticky Left Column: Resource Identity */}
                    <th className="sticky left-0 z-20 bg-[#F8FAFC] px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-[#64748B] border-r border-[#E2E8F0] min-w-[240px] max-w-[240px]">
                      Advertising Resource
                    </th>

                    {/* Day Columns */}
                    {daysArray.map((d) => (
                      <th
                        key={d.dayNumber}
                        className={`px-1.5 py-2 text-center border-r border-[#E2E8F0] min-w-[34px] transition-colors ${
                          d.isToday
                            ? 'bg-red-50 text-[#E11D2E] font-bold'
                            : d.isWeekend
                            ? 'bg-[#F1F5F9]/60 text-[#64748B]'
                            : 'text-[#64748B]'
                        }`}
                      >
                        <span className="text-[9px] uppercase font-semibold block leading-tight">
                          {d.dayName.slice(0, 2)}
                        </span>
                        <span className="text-[11px] font-mono font-bold block mt-0.5 leading-tight">
                          {d.dayNumber}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#E2E8F0]">
                  {filteredResources.map((res) => {
                    const util = resourceMonthUtilization.get(res.id);
                    const utilPercent = util?.percent || 0;

                    return (
                      <tr key={res.id} className="hover:bg-[#F8FAFC]/60 transition-colors group">
                        {/* Sticky Resource Info Cell */}
                        <td className="sticky left-0 z-10 bg-white group-hover:bg-[#F8FAFC] px-4 py-2 border-r border-[#E2E8F0] min-w-[240px] max-w-[240px]">
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-[#1A2435] truncate" title={res.name}>
                              {res.name}
                            </span>
                            <div className="flex items-center gap-1.5 text-[10px] text-[#64748B] mt-0.5">
                              <span className="px-1.5 py-0.2 rounded bg-[#F1F5F9] border border-[#E2E8F0] font-semibold text-[9px] text-[#1A2435]">
                                {res.type}
                              </span>
                              <span className="truncate">{res.location.city}</span>
                              <span className="font-mono text-[9px] text-slate-400">#{res.code || res.id.slice(-4)}</span>
                            </div>
                            <div className="mt-1 flex items-center gap-1.5">
                              <span
                                className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
                                  utilPercent === 100
                                    ? 'bg-slate-900 text-white'
                                    : utilPercent >= 70
                                    ? 'bg-amber-100 text-amber-900'
                                    : utilPercent > 0
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-slate-100 text-slate-500'
                                }`}
                              >
                                {utilPercent === 0 ? 'Free' : `${utilPercent}% Booked`}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Day Matrix Cells */}
                        {daysArray.map((day) => {
                          const { state, interval } = getResourceDateState(res.id, day.dateString);
                          const stateCfg = AVAILABILITY_STATE_CONFIG[state];

                          return (
                            <td
                              key={day.dayNumber}
                              onClick={() => handleCellClick(res, day)}
                              title={`${res.name} — ${day.dayNumber} ${monthNames[month]} ${year}: ${state} (${stateCfg.meaning}) ${
                                interval?.clientName ? `• Client: ${interval.clientName}` : ''
                              }`}
                              className={`p-1 text-center border-r border-[#E2E8F0] cursor-pointer transition-all hover:scale-105 hover:z-20 ${
                                day.isToday ? 'ring-1 ring-inset ring-[#E11D2E]' : ''
                              } ${
                                day.isWeekend && state === 'Available' ? 'bg-[#F8FAFC]' : stateCfg.cellBg
                              }`}
                            >
                              <div className="w-full h-8 rounded flex items-center justify-center">
                                <span
                                  className={`w-2.5 h-2.5 rounded-full transition-transform ${stateCfg.indicatorBg}`}
                                />
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* 4B. INTERVAL LEDGER VIEW (Tabular breakdown of active schedules)          */
          /* ========================================================================= */
          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs overflow-hidden">
            <div className="p-3.5 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
              <div>
                <span className="text-xs font-bold text-[#1A2435]">
                  Active Schedules &amp; Blocks Ledger
                </span>
                <span className="text-[11px] text-[#64748B] block mt-0.5">
                  Complete schedule records matching currently selected filters
                </span>
              </div>
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Plus size={13} />}
                onClick={() => setIsCreateBlockOpen(true)}
                className="bg-[#E11D2E] hover:bg-[#c81926] text-white text-xs font-bold"
              >
                + New Block
              </Button>
            </div>

            {intervals.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#64748B]">
                No operational blocks or holds scheduled. All resource dates are currently Available.
              </div>
            ) : (
              <div className="w-full overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#F8FAFC] text-[10px] font-bold uppercase tracking-wider text-[#64748B] border-b border-[#E2E8F0]">
                    <tr>
                      <th className="px-4 py-3">Resource</th>
                      <th className="px-4 py-3">Location &amp; Route</th>
                      <th className="px-4 py-3">State</th>
                      <th className="px-4 py-3">Flight Interval</th>
                      <th className="px-4 py-3">Client / Operational Reason</th>
                      <th className="px-4 py-3">Reference</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0]">
                    {intervals.map((int) => {
                      const res = resources.find((r) => r.id === int.resourceId);
                      const stateCfg = AVAILABILITY_STATE_CONFIG[int.state];

                      // Calculate duration in days
                      const start = new Date(int.startDate);
                      const end = new Date(int.endDate);
                      const duration = Math.max(
                        1,
                        Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
                      );

                      return (
                        <tr key={int.id} className="hover:bg-[#F8FAFC] transition-colors">
                          <td className="px-4 py-3">
                            <div className="font-bold text-[#1A2435]">
                              {res?.name || int.resourceId}
                            </div>
                            <div className="text-[10px] text-[#64748B] mt-0.5">
                              {res?.type || 'Static OOH'} • #{res?.code || int.resourceId.slice(-4)}
                            </div>
                          </td>

                          <td className="px-4 py-3">
                            <div className="text-xs font-medium text-[#1A2435]">
                              {res?.location?.city || 'Mumbai'}
                            </div>
                            <div className="text-[10px] text-[#64748B] truncate max-w-[180px]">
                              {res?.location?.name || 'Prime Corridor'}
                            </div>
                          </td>

                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-bold border ${stateCfg.badgeBg} ${stateCfg.badgeText} ${stateCfg.badgeBorder}`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${stateCfg.indicatorBg}`} />
                              {int.state}
                            </span>
                          </td>

                          <td className="px-4 py-3 font-mono text-[11px]">
                            <div className="font-semibold text-[#1A2435]">
                              {int.startDate} → {int.endDate}
                            </div>
                            <div className="text-[10px] text-[#64748B] font-sans">
                              {duration} days
                            </div>
                          </td>

                          <td className="px-4 py-3 text-[#1A2435]">
                            <div className="font-semibold">
                              {int.clientName || int.reason || 'General Block'}
                            </div>
                            {int.notes && (
                              <div className="text-[10px] text-[#64748B] truncate max-w-[200px]">
                                {int.notes}
                              </div>
                            )}
                          </td>

                          <td className="px-4 py-3 font-mono text-[#64748B]">
                            {int.bookingRef || int.holdRef || int.id}
                          </td>

                          <td className="px-4 py-3 text-right">
                            {int.state === 'Provider Block' || int.state === 'Maintenance' ? (
                              <button
                                type="button"
                                onClick={() => handleReleaseBlock(int.id)}
                                className="px-2.5 py-1 rounded border border-red-200 text-[#E11D2E] hover:bg-red-50 text-[11px] font-bold cursor-pointer transition-colors"
                              >
                                Release
                              </button>
                            ) : int.state === 'Booked' ? (
                              <Link
                                to="/panel/bookings"
                                className="px-2.5 py-1 rounded border border-[#E2E8F0] text-[#1A2435] hover:bg-[#F1F5F9] text-[11px] font-semibold transition-colors inline-block"
                              >
                                View Booking →
                              </Link>
                            ) : int.state === 'Hold' ? (
                              <Link
                                to="/panel/bookings?view=quotations&status=hold"
                                className="px-2.5 py-1 rounded border border-amber-200 text-amber-800 hover:bg-amber-50 text-[11px] font-bold transition-colors inline-block"
                              >
                                Inspect Hold →
                              </Link>
                            ) : (
                              <span className="text-[#94A3B8]">—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 5. SUPPORTING MODALS & DRAWERS                                            */}
      {/* ========================================================================= */}

      {/* Create Block Modal */}
      <CreateBlockModal
        isOpen={isCreateBlockOpen}
        onClose={() => setIsCreateBlockOpen(false)}
        onSaveBlock={handleSaveBlock}
        resources={resources}
        preselectedResourceId={preselectedResourceId}
        preselectedDate={preselectedDate}
      />

      {/* Hold Detail Popover / Modal */}
      <HoldDetailPopover
        isOpen={holdDetailData.isOpen}
        onClose={() => setHoldDetailData((prev) => ({ ...prev, isOpen: false }))}
        resourceName={holdDetailData.resourceName}
        resourceType={holdDetailData.resourceType}
        locationName={holdDetailData.locationName}
        dateRange={holdDetailData.dateRange}
        holdRef={holdDetailData.holdRef}
      />

      {/* Cell Availability Detail Drawer */}
      <AvailabilityDetailDrawer
        isOpen={isDetailDrawerOpen}
        onClose={() => {
          setIsDetailDrawerOpen(false);
          setSelectedCell(null);
        }}
        selectedCell={selectedCell}
        onOpenCreateBlock={(resId, dt) => {
          setPreselectedResourceId(resId);
          setPreselectedDate(dt);
          setIsCreateBlockOpen(true);
        }}
        onReleaseBlock={handleReleaseBlock}
        onOpenHoldDetail={(info) => {
          setHoldDetailData({
            isOpen: true,
            ...info,
          });
        }}
      />
    </div>
  );
};

export default AvailabilityPage;
