import React, { useState, useEffect } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { Search, X } from 'lucide-react';

export interface LocationOption {
  uuid: string;
  name: string;
  code: string;
}

export interface ResourceFiltersProps {
  search: string;
  locationUuid: string;
  resourceType: string;
  category: string;
  status: string;
  illuminationType: string;
  locations: LocationOption[];
  onSearchChange: (val: string) => void;
  onLocationChange: (val: string) => void;
  onResourceTypeChange: (val: string) => void;
  onCategoryChange: (val: string) => void;
  onStatusChange: (val: string) => void;
  onIlluminationChange: (val: string) => void;
  onReset: () => void;
}

export const ResourceFilters: React.FC<ResourceFiltersProps> = ({
  search,
  locationUuid,
  resourceType,
  category,
  status,
  illuminationType,
  locations,
  onSearchChange,
  onLocationChange,
  onResourceTypeChange,
  onCategoryChange,
  onStatusChange,
  onIlluminationChange,
  onReset,
}) => {
  const [localSearch, setLocalSearch] = useState(search);

  // Debounce search input by 350ms
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== search) {
        onSearchChange(localSearch);
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [localSearch, search, onSearchChange]);

  const hasActiveFilters = Boolean(
    search ||
      locationUuid ||
      resourceType ||
      category ||
      status ||
      illuminationType
  );

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-md)',
        padding: '1rem',
        marginBottom: '1rem',
        boxShadow: 'var(--shadow-xs)',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '0.75rem',
          alignItems: 'flex-end',
        }}
      >
        {/* Search */}
        <div style={{ minWidth: '220px' }}>
          <Input
            label="Search Inventory"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Name, code, location..."
            leftIcon={<Search size={16} />}
          />
        </div>

        {/* Location Dropdown */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label" style={{ fontSize: '0.8rem' }}>Location</label>
          <select
            value={locationUuid}
            onChange={(e) => onLocationChange(e.target.value)}
            className="form-select"
            style={{ height: '38px', fontSize: '0.85rem' }}
          >
            <option value="">All Locations</option>
            {locations.map((loc) => (
              <option key={loc.uuid} value={loc.uuid}>
                {loc.name} ({loc.code})
              </option>
            ))}
          </select>
        </div>

        {/* Resource Type */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label" style={{ fontSize: '0.8rem' }}>Resource Type</label>
          <select
            value={resourceType}
            onChange={(e) => onResourceTypeChange(e.target.value)}
            className="form-select"
            style={{ height: '38px', fontSize: '0.85rem' }}
          >
            <option value="">All Types</option>
            <option value="HOARDING">Hoarding</option>
            <option value="BILLBOARD">Billboard</option>
            <option value="UNIPOLE">Unipole</option>
            <option value="GANTRY">Gantry</option>
            <option value="LED_SCREEN">LED Screen</option>
            <option value="DIGITAL_SCREEN">Digital Screen</option>
            <option value="BUS_SHELTER">Bus Shelter</option>
            <option value="POLE_AD">Pole Ad</option>
            <option value="WALL_MOUNT">Wall Mount</option>
            <option value="ROOFTOP">Rooftop</option>
            <option value="BRIDGE_PANEL">Bridge Panel</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        {/* Category (Static / Digital) */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label" style={{ fontSize: '0.8rem' }}>Category</label>
          <select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="form-select"
            style={{ height: '38px', fontSize: '0.85rem' }}
          >
            <option value="">All Categories</option>
            <option value="STATIC">Static</option>
            <option value="DIGITAL">Digital</option>
          </select>
        </div>

        {/* Status */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label" style={{ fontSize: '0.8rem' }}>Status</label>
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="form-select"
            style={{ height: '38px', fontSize: '0.85rem' }}
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="UNDER_MAINTENANCE">Under Maintenance</option>
            <option value="UNDER_REVIEW">Under Review</option>
          </select>
        </div>

        {/* Illumination */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label" style={{ fontSize: '0.8rem' }}>Illumination</label>
          <select
            value={illuminationType}
            onChange={(e) => onIlluminationChange(e.target.value)}
            className="form-select"
            style={{ height: '38px', fontSize: '0.85rem' }}
          >
            <option value="">All Illumination</option>
            <option value="FRONT_LIT">Front Lit</option>
            <option value="BACK_LIT">Back Lit</option>
            <option value="NON_LIT">Non Lit</option>
            <option value="DIGITAL_LED">Digital LED</option>
            <option value="SOLAR_LIT">Solar Lit</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        {/* Reset Filter Button */}
        {hasActiveFilters && (
          <div style={{ display: 'flex', alignItems: 'flex-end', height: '100%' }}>
            <Button
              variant="secondary"
              onClick={() => {
                setLocalSearch('');
                onReset();
              }}
              leftIcon={<X size={14} />}
              style={{ width: '100%', height: '38px', fontSize: '0.85rem' }}
            >
              Reset
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourceFilters;
