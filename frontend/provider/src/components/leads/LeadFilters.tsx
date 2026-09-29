import React, { useState, useEffect } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { Search, X, Sparkles, PhoneCall, CheckCircle, Archive, Inbox } from 'lucide-react';

export interface ResourceOption {
  uuid: string;
  name: string;
  code: string;
}

export interface LeadFiltersProps {
  status: string; // '' for ALL or specific LeadStatus
  search: string;
  resourceUuid: string;
  resources?: ResourceOption[];
  totalCount?: number;
  onStatusChange: (status: string) => void;
  onSearchChange: (search: string) => void;
  onResourceChange: (resourceUuid: string) => void;
  onReset: () => void;
}

const STATUS_TABS: { label: string; value: string; icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }> }[] = [
  { label: 'All Inquiries', value: '', icon: Inbox },
  { label: 'New', value: 'NEW', icon: Sparkles },
  { label: 'Contacted', value: 'CONTACTED', icon: PhoneCall },
  { label: 'Converted', value: 'CONVERTED', icon: CheckCircle },
  { label: 'Archived', value: 'ARCHIVED', icon: Archive },
];

export const LeadFilters: React.FC<LeadFiltersProps> = ({
  status,
  search,
  resourceUuid,
  resources = [],
  totalCount,
  onStatusChange,
  onSearchChange,
  onResourceChange,
  onReset,
}) => {
  const [localSearch, setLocalSearch] = useState(search);

  // Sync local search when external search changes
  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  // Debounce search input by 350ms
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== search) {
        onSearchChange(localSearch);
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [localSearch, search, onSearchChange]);

  const hasActiveFilters = Boolean(status || search || resourceUuid);

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid var(--border-color)',
        borderRadius: '10px',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)',
        marginBottom: '1.25rem',
      }}
    >
      {/* Top Status Tabs */}
      <div
        style={{
          display: 'flex',
          borderBottom: '1px solid var(--border-color)',
          overflowX: 'auto',
          backgroundColor: '#f8fafc',
          padding: '0.25rem 0.5rem 0',
        }}
      >
        {STATUS_TABS.map((tab) => {
          const isActive = status === tab.value;
          const Icon = tab.icon;
          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => onStatusChange(tab.value)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.65rem 1.1rem',
                border: 'none',
                borderBottom: isActive ? '2px solid #2563eb' : '2px solid transparent',
                backgroundColor: isActive ? '#ffffff' : 'transparent',
                color: isActive ? '#0f172a' : '#64748b',
                fontWeight: isActive ? 600 : 500,
                fontSize: '0.85rem',
                cursor: 'pointer',
                borderRadius: '6px 6px 0 0',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap',
              }}
            >
              <Icon
                size={15}
                style={{
                  color: isActive ? '#2563eb' : '#94a3b8',
                }}
              />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Filter inputs & Search */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.85rem 1rem',
        }}
      >
        {/* Search input */}
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
            placeholder="Search visitor, company, email, phone..."
            style={{ paddingLeft: '2.25rem' }}
          />
        </div>

        {/* Resource dropdown filter */}
        {resources.length > 0 && (
          <div style={{ flex: '0 1 240px', minWidth: '180px' }}>
            <select
              value={resourceUuid}
              onChange={(e) => onResourceChange(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem',
                fontSize: '0.875rem',
                borderRadius: '6px',
                border: '1px solid var(--border-color)',
                backgroundColor: '#ffffff',
                color: resourceUuid ? '#0f172a' : '#64748b',
                outline: 'none',
              }}
            >
              <option value="">All Inventory Units</option>
              {resources.map((res) => (
                <option key={res.uuid} value={res.uuid}>
                  {res.code} - {res.name}
                </option>
              ))}
            </select>
          </div>
        )}

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

        {/* Result Counter (Derived directly from actual backend pagination data) */}
        {totalCount !== undefined && (
          <div
            style={{
              marginLeft: 'auto',
              fontSize: '0.82rem',
              color: '#64748b',
              fontWeight: 500,
            }}
          >
            {totalCount} {totalCount === 1 ? 'lead' : 'leads'} found
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadFilters;
