import React, { useState, useMemo } from 'react';
import {
  Search,
  Layers,
  Calendar,
  User,
  SlidersHorizontal,
  RotateCcw,
} from 'lucide-react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { AdvertisingResource, APPROVED_RESOURCE_TYPES } from '../../types/resource';
import { CustomerRecord } from '../../types/customer';
import InventoryCard from './InventoryCard';
import SelectedInventoryPanel from './SelectedInventoryPanel';

export interface BookingInventoryStepProps {
  customer: CustomerRecord | null;
  startDate: string;
  endDate: string;
  availableResources: AdvertisingResource[];
  selectedResources: AdvertisingResource[];
  onToggleResource: (resource: AdvertisingResource) => void;
  onRemoveResource: (resourceId: string) => void;
  onBack: () => void;
  onContinue: () => void;
}

export const BookingInventoryStep: React.FC<BookingInventoryStepProps> = ({
  customer,
  startDate,
  endDate,
  availableResources,
  selectedResources,
  onToggleResource,
  onRemoveResource,
  onBack,
  onContinue,
}) => {
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedCity, setSelectedCity] = useState('ALL');
  const [selectedArea, setSelectedArea] = useState('ALL');

  // Available Cities
  const availableCities = useMemo(() => {
    const set = new Set<string>();
    availableResources.forEach((r) => {
      if (r.location?.city) set.add(r.location.city);
    });
    return Array.from(set).sort();
  }, [availableResources]);

  // Available Areas (filtered by selected city)
  const availableAreas = useMemo(() => {
    const set = new Set<string>();
    availableResources.forEach((r) => {
      if (
        r.location?.area &&
        (selectedCity === 'ALL' || r.location.city.toLowerCase() === selectedCity.toLowerCase())
      ) {
        set.add(r.location.area);
      }
    });
    return Array.from(set).sort();
  }, [availableResources, selectedCity]);

  // Filtered inventory list
  const filteredAvailable = useMemo(() => {
    return availableResources.filter((r) => {
      // Search
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === '' ||
        r.name.toLowerCase().includes(q) ||
        r.type.toLowerCase().includes(q) ||
        r.location.name.toLowerCase().includes(q) ||
        r.location.city.toLowerCase().includes(q) ||
        r.location.area.toLowerCase().includes(q) ||
        (r.location.landmark && r.location.landmark.toLowerCase().includes(q));

      // Type
      const matchesType = selectedType === 'ALL' || r.type === selectedType;

      // City
      const matchesCity =
        selectedCity === 'ALL' ||
        r.location.city.toLowerCase() === selectedCity.toLowerCase();

      // Area
      const matchesArea =
        selectedArea === 'ALL' ||
        r.location.area.toLowerCase() === selectedArea.toLowerCase();

      return matchesSearch && matchesType && matchesCity && matchesArea;
    });
  }, [availableResources, searchQuery, selectedType, selectedCity, selectedArea]);

  const hasActiveFilters =
    searchQuery !== '' ||
    selectedType !== 'ALL' ||
    selectedCity !== 'ALL' ||
    selectedArea !== 'ALL';

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedType('ALL');
    setSelectedCity('ALL');
    setSelectedArea('ALL');
  };

  const selectedIds = useMemo(() => {
    return new Set(selectedResources.map((r) => r.id));
  }, [selectedResources]);

  const formatDateDisplay = (dateStr: string): string => {
    if (!dateStr) return '—';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-5">
      {/* Top Booking Context Strip */}
      <div className="rounded-xl border border-[#E5E5E5] bg-[#FAFAF9] p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5">
            <User size={13} className="text-[#EA580C]" />
            <span className="text-[#737373]">Customer:</span>
            <strong className="text-[#171717]">{customer?.companyName || 'Not Selected'}</strong>
            {customer && (
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-white border border-[#E5E5E5] text-[#525252]">
                {customer.customerType}
              </span>
            )}
          </div>

          <span className="hidden md:inline text-[#D4D4D4]">•</span>

          <div className="flex items-center gap-1.5">
            <Calendar size={13} className="text-[#EA580C]" />
            <span className="text-[#737373]">Booking Period:</span>
            <strong className="text-[#171717]">
              {formatDateDisplay(startDate)} &nbsp;→&nbsp; {formatDateDisplay(endDate)}
            </strong>
          </div>
        </div>

        <div className="text-[11px] text-emerald-800 font-medium bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 self-start md:self-auto">
          Active Available Inventory Checked
        </div>
      </div>

      {/* Main Two-Panel Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ========================================================================= */}
        {/* LEFT PANEL — AVAILABLE INVENTORY                                         */}
        {/* ========================================================================= */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-4">
          <div className="border-b border-[#E5E5E5] pb-3 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#EA580C]">
                Inventory Ledger
              </span>
              <h3 className="text-sm font-bold text-[#171717]">
                AVAILABLE INVENTORY
              </h3>
            </div>
            <span className="text-xs text-[#737373]">
              Showing {filteredAvailable.length} displays
            </span>
          </div>

          {/* Search & Compact Filters Bar */}
          <div className="bg-white rounded-xl p-3.5 border border-[#E5E5E5] shadow-xs space-y-2.5">
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#737373]"
              />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search inventory by name, location, type..."
                className="w-full pl-9 pr-3 text-xs h-9"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#F5F5F4] text-xs">
              <span className="text-[11px] font-semibold text-[#737373] flex items-center gap-1">
                <SlidersHorizontal size={12} />
                Filters:
              </span>

              {/* Type Filter */}
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="text-xs h-8 px-2 py-0.5 rounded-md bg-[#FAFAF9] border border-[#E5E5E5] text-[#171717] focus:outline-none focus:border-[#EA580C]"
              >
                <option value="ALL">All Asset Types</option>
                {APPROVED_RESOURCE_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>

              {/* City Filter */}
              <select
                value={selectedCity}
                onChange={(e) => {
                  setSelectedCity(e.target.value);
                  setSelectedArea('ALL');
                }}
                className="text-xs h-8 px-2 py-0.5 rounded-md bg-[#FAFAF9] border border-[#E5E5E5] text-[#171717] focus:outline-none focus:border-[#EA580C]"
              >
                <option value="ALL">All Cities ({availableCities.length})</option>
                {availableCities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              {/* Area Filter */}
              <select
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="text-xs h-8 px-2 py-0.5 rounded-md bg-[#FAFAF9] border border-[#E5E5E5] text-[#171717] focus:outline-none focus:border-[#EA580C]"
              >
                <option value="ALL">
                  {selectedCity !== 'ALL'
                    ? `All Areas in ${selectedCity} (${availableAreas.length})`
                    : `All Areas (${availableAreas.length})`}
                </option>
                {availableAreas.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>

              {hasActiveFilters && (
                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon={<RotateCcw size={11} />}
                  onClick={resetFilters}
                  className="h-8 text-xs py-0 px-2"
                >
                  Reset
                </Button>
              )}
            </div>
          </div>

          {/* Inventory Cards Grid */}
          {filteredAvailable.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#E5E5E5] bg-white p-8 text-center space-y-2">
              <Layers size={26} className="mx-auto text-[#737373]" />
              <p className="text-xs font-bold text-[#171717]">
                No available inventory found
              </p>
              <p className="text-[11px] text-[#737373]">
                Try adjusting your search query or clear the active filters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filteredAvailable.map((resource) => (
                <InventoryCard
                  key={resource.id}
                  resource={resource}
                  isSelected={selectedIds.has(resource.id)}
                  onToggle={onToggleResource}
                />
              ))}
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* RIGHT PANEL — SELECTED INVENTORY CART                                    */}
        {/* ========================================================================= */}
        <div className="lg:col-span-5 xl:col-span-4">
          <SelectedInventoryPanel
            selectedResources={selectedResources}
            onRemoveResource={onRemoveResource}
            onContinue={onContinue}
            onBack={onBack}
          />
        </div>
      </div>
    </div>
  );
};

export default BookingInventoryStep;
