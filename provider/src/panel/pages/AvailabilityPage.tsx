import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  RotateCcw,
  Layers,
  ShieldAlert,
  Clock,
  CheckCircle2,
  CalendarDays,
  List,
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import {
  AvailabilityState,
  AvailabilityInterval,
  ResourceAvailabilityItem,
  AVAILABILITY_STATE_CONFIG,
} from '../types/availability';
import { APPROVED_RESOURCE_TYPES } from '../types/resource';
import AvailabilityLegend from '../components/availability/AvailabilityLegend';
import CreateBlockModal from '../components/availability/CreateBlockModal';
import HoldDetailPopover from '../components/availability/HoldDetailPopover';
import AvailabilityDetailDrawer, {
  SelectedAvailabilityCell,
} from '../components/availability/AvailabilityDetailDrawer';

export const AvailabilityPage: React.FC = () => {
  // Empty state by default (No fabricated data per instructions)
  const [resources] = useState<ResourceAvailabilityItem[]>([]);
  const [intervals, setIntervals] = useState<AvailabilityInterval[]>([]);

  // Current calendar view date cursor
  const [currentDate, setCurrentDate] = useState<Date>(() => new Date(2026, 9, 1)); // October 2026

  // View mode: 'matrix' (Days grid) or 'ledger' (List of scheduled intervals)
  const [viewMode, setViewMode] = useState<'matrix' | 'ledger'>('matrix');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedStateFilter, setSelectedStateFilter] = useState('ALL');

  // Modals & Drawers state
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
    note?: string;
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
    setCurrentDate(new Date());
  };

  // Generate days array for current month
  const daysArray = useMemo(() => {
    const days: { dayNumber: number; dateString: string; dayName: string; isToday: boolean }[] = [];
    const today = new Date();
    const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(
      today.getDate()
    ).padStart(2, '0')}`;

    for (let d = 1; d <= daysInMonth; d++) {
      const dateObj = new Date(year, month, d);
      const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
      days.push({
        dayNumber: d,
        dateString,
        dayName,
        isToday: dateString === todayString,
      });
    }
    return days;
  }, [year, month, daysInMonth]);

  // Filtered resources
  const filteredResources = useMemo(() => {
    return resources.filter((r) => {
      const matchesSearch =
        searchQuery === '' ||
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.location.city.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = selectedType === 'ALL' || r.type === selectedType;

      return matchesSearch && matchesType;
    });
  }, [resources, searchQuery, selectedType]);

  // Resolve state of a resource on a specific day
  const getResourceDateState = (resourceId: string, dateString: string): { state: AvailabilityState; interval?: AvailabilityInterval } => {
    const matchingInterval = intervals.find((int) => {
      return int.resourceId === resourceId && dateString >= int.startDate && dateString <= int.endDate;
    });

    if (matchingInterval) {
      return { state: matchingInterval.state, interval: matchingInterval };
    }

    return { state: 'Available' };
  };

  // Summary counts for current month (computed strictly from actual data, 0 when empty)
  const summaryMetrics = useMemo(() => {
    if (resources.length === 0) {
      return { availableCount: 0, bookedCount: 0, holdCount: 0, providerBlockCount: 0 };
    }

    let availableCount = 0;
    let bookedCount = 0;
    let holdCount = 0;
    let providerBlockCount = 0;

    filteredResources.forEach((res) => {
      daysArray.forEach((d) => {
        const { state } = getResourceDateState(res.id, d.dateString);
        if (state === 'Available') availableCount++;
        else if (state === 'Booked') bookedCount++;
        else if (state === 'Hold') holdCount++;
        else if (state === 'Provider Block') providerBlockCount++;
      });
    });

    return { availableCount, bookedCount, holdCount, providerBlockCount };
  }, [filteredResources, daysArray, intervals, resources.length]);

  // Handlers
  const handleSaveBlock = (block: {
    resourceId: string;
    startDate: string;
    endDate: string;
    state: 'Provider Block';
  }) => {
    const newInterval: AvailabilityInterval = {
      id: `block-${Date.now()}`,
      resourceId: block.resourceId,
      startDate: block.startDate,
      endDate: block.endDate,
      state: 'Provider Block',
    };

    setIntervals((prev) => [newInterval, ...prev]);
    showToast(`Provider Block applied for ${block.startDate} to ${block.endDate}.`);
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

  const hasActiveFilters = searchQuery !== '' || selectedType !== 'ALL' || selectedStateFilter !== 'ALL';

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedType('ALL');
    setSelectedStateFilter('ALL');
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

      {/* Page Header */}
      <PageHeader
        title="Availability"
        description="Resource-level scheduling ledger for tracking date availability, reservations, provider blocks, admin blocks, and maintenance."
        actions={
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus size={14} />}
            onClick={() => {
              setPreselectedResourceId(undefined);
              setPreselectedDate(undefined);
              setIsCreateBlockOpen(true);
            }}
          >
            Create Block
          </Button>
        }
      />

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* ========================================================================= */}
        {/* 1. AVAILABILITY OVERVIEW SUMMARY STRIP                                    */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          <div className="bg-white rounded-xl p-4 border border-[#E5E5E5] shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373]">
                Available Dates
              </span>
              <CheckCircle2 size={13} className="text-emerald-600" />
            </div>
            <div className="my-2 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-[#171717] leading-none">
                {summaryMetrics.availableCount}
              </span>
              <span className="text-xs text-[#737373]">slots</span>
            </div>
            <span className="text-[11px] text-[#737373]">
              Resource date is available
            </span>
          </div>

          <div className="bg-white rounded-xl p-4 border border-[#E5E5E5] shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373]">
                Booked Dates
              </span>
              <span className="w-2 h-2 rounded-full bg-stone-500" />
            </div>
            <div className="my-2 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-stone-800 leading-none">
                {summaryMetrics.bookedCount}
              </span>
              <span className="text-xs text-[#737373]">slots</span>
            </div>
            <span className="text-[11px] text-[#737373]">
              Resource date is booked
            </span>
          </div>

          <div className="bg-white rounded-xl p-4 border border-[#E5E5E5] shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373]">
                Provisional Holds
              </span>
              <Clock size={13} className="text-amber-600" />
            </div>
            <div className="my-2 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-amber-700 leading-none">
                {summaryMetrics.holdCount}
              </span>
              <span className="text-xs text-[#737373]">holds</span>
            </div>
            <span className="text-[11px] text-[#737373]">
              Resource date is provisionally held
            </span>
          </div>

          <div className="bg-white rounded-xl p-4 border border-[#E5E5E5] shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373]">
                Provider Blocks
              </span>
              <ShieldAlert size={13} className="text-[#EA580C]" />
            </div>
            <div className="my-2 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-[#EA580C] leading-none">
                {summaryMetrics.providerBlockCount}
              </span>
              <span className="text-xs text-[#737373]">active</span>
            </div>
            <span className="text-[11px] text-[#737373]">
              Provider has blocked the resource/date
            </span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. APPROVED AVAILABILITY STATE LEGEND                                     */}
        {/* ========================================================================= */}
        <AvailabilityLegend
          selectedStateFilter={selectedStateFilter}
          onSelectStateFilter={setSelectedStateFilter}
        />

        {/* ========================================================================= */}
        {/* 3. DATE NAVIGATION & FILTER CONTROLS BAR                                 */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-xl p-4 border border-[#E5E5E5] shadow-xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Left: Date controls */}
          <div className="flex items-center gap-2">
            <div className="flex items-center border border-[#E5E5E5] rounded-lg bg-[#FAFAF9] p-0.5">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-1.5 rounded text-[#737373] hover:text-[#171717] hover:bg-white transition-colors cursor-pointer"
                title="Previous Month"
              >
                <ChevronLeft size={16} />
              </button>
              <div className="px-3 py-1 text-xs font-bold text-[#171717] min-w-[140px] text-center">
                {monthNames[month]} {year}
              </div>
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1.5 rounded text-[#737373] hover:text-[#171717] hover:bg-white transition-colors cursor-pointer"
                title="Next Month"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            <Button variant="secondary" size="sm" onClick={handleGoToToday}>
              Today
            </Button>
          </div>

          {/* Right: Search, Asset Type & View Switcher */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search */}
            <div className="relative w-full sm:w-56">
              <Search
                size={14}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#737373]"
              />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search resources, location..."
                className="w-full pl-8 pr-2.5 text-xs h-9"
              />
            </div>

            {/* Asset Type Filter */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="text-xs h-9 px-2.5 py-1 rounded-md bg-[#FAFAF9] border border-[#E5E5E5] text-[#171717] focus:outline-none focus:border-[#EA580C]"
            >
              <option value="ALL">All Asset Types</option>
              {APPROVED_RESOURCE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center border border-[#E5E5E5] rounded-md bg-[#FAFAF9] p-0.5">
              <button
                type="button"
                onClick={() => setViewMode('matrix')}
                className={`p-1.5 rounded flex items-center gap-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                  viewMode === 'matrix'
                    ? 'bg-white text-[#EA580C] shadow-2xs'
                    : 'text-[#737373] hover:text-[#171717]'
                }`}
                title="Timeline Matrix"
              >
                <CalendarDays size={14} />
                <span className="hidden sm:inline">Matrix</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('ledger')}
                className={`p-1.5 rounded flex items-center gap-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                  viewMode === 'ledger'
                    ? 'bg-white text-[#EA580C] shadow-2xs'
                    : 'text-[#737373] hover:text-[#171717]'
                }`}
                title="Interval Ledger"
              >
                <List size={14} />
                <span className="hidden sm:inline">Ledger</span>
              </button>
            </div>

            {/* Reset */}
            {hasActiveFilters && (
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<RotateCcw size={13} />}
                onClick={resetFilters}
              >
                Reset
              </Button>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4. MAIN AVAILABILITY WORKSPACE & EMPTY STATE                              */}
        {/* ========================================================================= */}
        {resources.length === 0 ? (
          /* Clean Neutral Empty State */
          <div className="bg-white rounded-xl border border-[#E5E5E5] p-12 text-center shadow-xs flex flex-col items-center justify-center max-w-lg mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-orange-50 text-[#EA580C] flex items-center justify-center mb-4 border border-orange-100 shadow-2xs">
              <CalendarIcon size={28} />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-[#171717]">
              No advertising resources are available to display
            </h3>
            <p className="text-xs sm:text-sm text-[#525252] max-w-md mt-1.5 leading-relaxed">
              Register advertising resources to inspect and manage scheduling, holds, and provider blocks.
            </p>

            <div className="mt-6 flex items-center justify-center">
              <Link to="/panel/resources">
                <Button variant="primary" size="md" leftIcon={<Layers size={15} />}>
                  Go to Advertising Resources
                </Button>
              </Link>
            </div>
          </div>
        ) : filteredResources.length === 0 ? (
          /* Filter Zero Results State */
          <div className="bg-white rounded-xl border border-[#E5E5E5] p-10 text-center shadow-xs flex flex-col items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-[#FAFAF9] border border-[#E5E5E5] flex items-center justify-center text-[#737373] mb-3">
              <Search size={18} />
            </div>
            <h4 className="text-sm font-bold text-[#171717]">No matching resources found</h4>
            <p className="text-xs text-[#525252] mt-1 max-w-sm">
              None of your registered advertising resources match the currently active search or filter criteria.
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
          /* 4A. TIMELINE MATRIX VIEW (Contained Scroll Container)                      */
          /* ========================================================================= */
          <div className="bg-white rounded-xl border border-[#E5E5E5] shadow-xs overflow-hidden">
            <div className="p-3.5 border-b border-[#E5E5E5] flex items-center justify-between bg-[#FAFAF9]/60">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#171717]">
                  Monthly Availability Matrix
                </span>
                <span className="text-[11px] font-mono text-[#737373] bg-[#E5E5E5]/60 px-2 py-0.5 rounded">
                  {monthNames[month]} {year} • {filteredResources.length} Resources
                </span>
              </div>
              <span className="text-[11px] text-[#737373] hidden sm:inline">
                Click any cell to inspect or manage availability
              </span>
            </div>

            {/* Contained Horizontal Scroll Container (Zero page overflow) */}
            <div className="w-full overflow-x-auto">
              <table className="w-full border-collapse text-left min-w-[900px]">
                <thead>
                  <tr className="border-b border-[#E5E5E5] bg-[#FAFAF9]">
                    {/* Fixed Resource Column */}
                    <th className="sticky left-0 z-20 bg-[#FAFAF9] px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-[#737373] border-r border-[#E5E5E5] min-w-[220px] max-w-[220px]">
                      Advertising Resource
                    </th>

                    {/* Day Columns */}
                    {daysArray.map((d) => (
                      <th
                        key={d.dayNumber}
                        className={`px-1.5 py-2 text-center border-r border-[#E5E5E5] min-w-[34px] ${
                          d.isToday ? 'bg-orange-50/80 text-[#EA580C]' : 'text-[#737373]'
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

                <tbody className="divide-y divide-[#E5E5E5]">
                  {filteredResources.map((res) => (
                    <tr key={res.id} className="hover:bg-[#FAFAF9]/40 transition-colors">
                      {/* Fixed Resource Info Cell */}
                      <td className="sticky left-0 z-10 bg-white px-4 py-2.5 border-r border-[#E5E5E5] min-w-[220px] max-w-[220px]">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-[#171717] truncate" title={res.name}>
                            {res.name}
                          </span>
                          <div className="flex items-center gap-1.5 text-[10px] text-[#737373] mt-0.5">
                            <span className="px-1.5 py-0.2 rounded bg-[#FAFAF9] border border-[#E5E5E5] font-semibold text-[9px]">
                              {res.type}
                            </span>
                            <span className="truncate">{res.location.city}</span>
                          </div>
                        </div>
                      </td>

                      {/* Day Matrix Cells */}
                      {daysArray.map((day) => {
                        const { state } = getResourceDateState(res.id, day.dateString);
                        const stateCfg = AVAILABILITY_STATE_CONFIG[state];

                        return (
                          <td
                            key={day.dayNumber}
                            onClick={() => handleCellClick(res, day)}
                            title={`${res.name} — ${day.dayNumber} ${monthNames[month]} ${year}: ${state} (${stateCfg.meaning})`}
                            className={`p-1 text-center border-r border-[#E5E5E5] cursor-pointer transition-colors hover:brightness-95 ${
                              day.isToday ? 'ring-1 ring-inset ring-orange-300' : ''
                            } ${stateCfg.cellBg}`}
                          >
                            <div className="w-full h-8 rounded flex items-center justify-center">
                              <span
                                className={`w-2.5 h-2.5 rounded-full ${stateCfg.indicatorBg}`}
                              />
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* 4B. INTERVAL LEDGER VIEW (List of all scheduled blocks)                   */
          /* ========================================================================= */
          <div className="bg-white rounded-xl border border-[#E5E5E5] shadow-xs overflow-hidden">
            <div className="p-3.5 border-b border-[#E5E5E5] flex items-center justify-between bg-[#FAFAF9]/60">
              <span className="text-xs font-bold text-[#171717]">
                Operational Interval Ledger ({intervals.length} scheduled)
              </span>
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<Plus size={13} />}
                onClick={() => setIsCreateBlockOpen(true)}
              >
                New Block
              </Button>
            </div>

            {intervals.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#525252]">
                No operational blocks or holds scheduled. All resource dates are currently Available.
              </div>
            ) : (
              <div className="w-full overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#FAFAF9] text-[10px] font-bold uppercase tracking-wider text-[#737373] border-b border-[#E5E5E5]">
                    <tr>
                      <th className="px-4 py-2.5">Resource</th>
                      <th className="px-4 py-2.5">State</th>
                      <th className="px-4 py-2.5">Date Range</th>
                      <th className="px-4 py-2.5">Reference</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E5E5]">
                    {intervals.map((int) => {
                      const res = resources.find((r) => r.id === int.resourceId);
                      const stateCfg = AVAILABILITY_STATE_CONFIG[int.state];

                      return (
                        <tr key={int.id} className="hover:bg-[#FAFAF9]">
                          <td className="px-4 py-2.5 font-bold text-[#171717]">
                            {res?.name || int.resourceId}
                          </td>
                          <td className="px-4 py-2.5">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold border ${stateCfg.badgeBg} ${stateCfg.badgeText} ${stateCfg.badgeBorder}`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${stateCfg.indicatorBg}`} />
                              {int.state}
                            </span>
                          </td>
                          <td className="px-4 py-2.5 font-mono text-[11px]">
                            {int.startDate} → {int.endDate}
                          </td>
                          <td className="px-4 py-2.5 text-[#525252]">
                            {int.bookingRef || int.holdRef || '—'}
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
      {/* 5. SUPPORTING INTERACTIONS                                                */}
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
