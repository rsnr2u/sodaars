import React, { useState, useEffect } from 'react';
import { Search, RotateCcw } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';

export interface LocationFiltersProps {
  search: string;
  status: string;
  city: string;
  onSearchChange: (search: string) => void;
  onStatusChange: (status: string) => void;
  onCityChange: (city: string) => void;
  onReset: () => void;
}

export const LocationFilters: React.FC<LocationFiltersProps> = ({
  search,
  status,
  city,
  onSearchChange,
  onStatusChange,
  onCityChange,
  onReset,
}) => {
  const [searchInput, setSearchInput] = useState(search);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(searchInput);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchInput, onSearchChange]);

  // Sync external search prop if cleared
  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  const hasActiveFilters = search !== '' || status !== '' || city !== '';

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'ACTIVE', label: 'Active' },
    { value: 'INACTIVE', label: 'Inactive' },
    { value: 'UNDER_REVIEW', label: 'Under Review' },
  ];

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.25rem',
        padding: '0.85rem 1rem',
        backgroundColor: 'var(--surface-white)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-xs)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', flex: 1, minWidth: '280px' }}>
        {/* Search Input */}
        <div style={{ minWidth: '240px', flex: 1, marginBottom: 0 }} className="form-group">
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by name, code, road, or landmark..."
            leftIcon={<Search size={16} />}
            style={{ height: '38px', padding: '0.4rem 0.75rem 0.4rem 2.2rem' }}
          />
        </div>

        {/* Status Dropdown */}
        <div style={{ minWidth: '150px' }}>
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="form-select"
            style={{ height: '38px', padding: '0.4rem 0.75rem' }}
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* City Filter */}
        <div style={{ minWidth: '150px' }}>
          <input
            type="text"
            value={city}
            onChange={(e) => onCityChange(e.target.value)}
            placeholder="Filter by city..."
            className="form-input"
            style={{ height: '38px', padding: '0.4rem 0.75rem' }}
          />
        </div>
      </div>

      {/* Reset Button */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          leftIcon={<RotateCcw size={14} />}
        >
          Reset Filters
        </Button>
      )}
    </div>
  );
};

export default LocationFilters;
