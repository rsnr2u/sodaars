import React, { useState, useEffect } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { Search, X } from 'lucide-react';
import type { CustomerType, CustomerStatus } from '../../types/customer';

export interface CustomerFiltersProps {
  search: string;
  customerType: CustomerType | '';
  status: CustomerStatus | '';
  totalCount?: number;
  onSearchChange: (val: string) => void;
  onTypeChange: (val: CustomerType | '') => void;
  onStatusChange: (val: CustomerStatus | '') => void;
  onReset: () => void;
}

const CUSTOMER_TYPE_OPTIONS: { label: string; value: CustomerType }[] = [
  { label: 'Direct Advertiser', value: 'DIRECT_ADVERTISER' },
  { label: 'Advertising Agency', value: 'AGENCY' },
  { label: 'Corporate Brand', value: 'BRAND' },
  { label: 'Individual / Local', value: 'INDIVIDUAL' },
  { label: 'Government / Civic', value: 'GOVERNMENT' },
];

export const CustomerFilters: React.FC<CustomerFiltersProps> = ({
  search,
  customerType,
  status,
  totalCount,
  onSearchChange,
  onTypeChange,
  onStatusChange,
  onReset,
}) => {
  const [localSearch, setLocalSearch] = useState(search);

  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== search) {
        onSearchChange(localSearch);
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [localSearch, search, onSearchChange]);

  const hasActiveFilters = Boolean(search || customerType || status);

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid var(--border-color)',
        borderRadius: '10px',
        padding: '0.85rem 1rem',
        boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '0.75rem',
      }}
    >
      {/* Search Input */}
      <div style={{ flex: '1 1 280px', minWidth: '220px', position: 'relative' }}>
        <Search
          size={16}
          style={{
            position: 'absolute',
            left: '0.75rem',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#94a3b8',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />
        <Input
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          placeholder="Search by company, contact person, phone, email, or code..."
          style={{ paddingLeft: '2.25rem' }}
        />
      </div>

      {/* Customer Type Dropdown */}
      <div style={{ flex: '0 1 200px', minWidth: '160px' }}>
        <select
          value={customerType}
          onChange={(e) => onTypeChange(e.target.value as CustomerType | '')}
          style={{
            width: '100%',
            padding: '0.5rem 0.75rem',
            fontSize: '0.875rem',
            borderRadius: '6px',
            border: '1px solid var(--border-color)',
            backgroundColor: '#ffffff',
            color: customerType ? '#0f172a' : '#64748b',
            outline: 'none',
          }}
        >
          <option value="">All Client Types</option>
          {CUSTOMER_TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Status Dropdown */}
      <div style={{ flex: '0 1 160px', minWidth: '130px' }}>
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value as CustomerStatus | '')}
          style={{
            width: '100%',
            padding: '0.5rem 0.75rem',
            fontSize: '0.875rem',
            borderRadius: '6px',
            border: '1px solid var(--border-color)',
            backgroundColor: '#ffffff',
            color: status ? '#0f172a' : '#64748b',
            outline: 'none',
          }}
        >
          <option value="">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
          <option value="BLOCKED">Blocked</option>
        </select>
      </div>

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          style={{
            color: '#64748b',
            fontSize: '0.82rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
          }}
        >
          <X size={14} />
          Clear
        </Button>
      )}

      {/* Total Count Indicator */}
      {totalCount !== undefined && (
        <div
          style={{
            marginLeft: 'auto',
            fontSize: '0.82rem',
            color: '#64748b',
            fontWeight: 500,
          }}
        >
          {totalCount} {totalCount === 1 ? 'client' : 'clients'} found
        </div>
      )}
    </div>
  );
};

export default CustomerFilters;
