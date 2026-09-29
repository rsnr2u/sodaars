import React, { useState, useEffect } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { Search, X, Inbox, Clock, FileCheck, Award, ThumbsDown, Ban, Sparkles, MessageSquare } from 'lucide-react';
import type { EnquiryStatus, EnquiryPriority, EnquirySource } from '../../types/enquiry';

export interface EnquiryFiltersProps {
  search: string;
  status: EnquiryStatus | '';
  priority: EnquiryPriority | '';
  source: EnquirySource | '';
  totalCount?: number;
  onSearchChange: (val: string) => void;
  onStatusChange: (val: EnquiryStatus | '') => void;
  onPriorityChange: (val: EnquiryPriority | '') => void;
  onSourceChange: (val: EnquirySource | '') => void;
  onReset: () => void;
}

const STATUS_TABS: { label: string; value: EnquiryStatus | ''; icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }> }[] = [
  { label: 'All Enquiries', value: '', icon: Inbox },
  { label: 'New', value: 'NEW', icon: Sparkles },
  { label: 'Under Review', value: 'UNDER_REVIEW', icon: Clock },
  { label: 'Quoted', value: 'QUOTED', icon: FileCheck },
  { label: 'Negotiating', value: 'NEGOTIATING', icon: MessageSquare },
  { label: 'Converted', value: 'CONVERTED', icon: Award },
  { label: 'Lost', value: 'LOST', icon: ThumbsDown },
  { label: 'Cancelled', value: 'CANCELLED', icon: Ban },
];

export const EnquiryFilters: React.FC<EnquiryFiltersProps> = ({
  search,
  status,
  priority,
  source,
  totalCount,
  onSearchChange,
  onStatusChange,
  onPriorityChange,
  onSourceChange,
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

  const hasActiveFilters = Boolean(search || status || priority || source);

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid var(--border-color)',
        borderRadius: '10px',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)',
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
              key={tab.value || 'all'}
              type="button"
              onClick={() => onStatusChange(tab.value)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.65rem 1rem',
                border: 'none',
                borderBottom: isActive ? '2px solid #2563eb' : '2px solid transparent',
                backgroundColor: isActive ? '#ffffff' : 'transparent',
                color: isActive ? '#0f172a' : '#64748b',
                fontWeight: isActive ? 600 : 500,
                fontSize: '0.82rem',
                cursor: 'pointer',
                borderRadius: '6px 6px 0 0',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap',
              }}
            >
              <Icon
                size={14}
                style={{
                  color: isActive ? '#2563eb' : '#94a3b8',
                }}
              />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Filter Inputs Row */}
      <div
        style={{
          padding: '0.85rem 1rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '0.75rem',
        }}
      >
        {/* Search */}
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
            placeholder="Search by enquiry #, campaign title, client name..."
            style={{ paddingLeft: '2.25rem' }}
          />
        </div>

        {/* Priority Filter */}
        <div style={{ flex: '0 1 160px', minWidth: '130px' }}>
          <select
            value={priority}
            onChange={(e) => onPriorityChange(e.target.value as EnquiryPriority | '')}
            style={{
              width: '100%',
              padding: '0.5rem 0.75rem',
              fontSize: '0.875rem',
              borderRadius: '6px',
              border: '1px solid var(--border-color)',
              backgroundColor: '#ffffff',
              color: priority ? '#0f172a' : '#64748b',
              outline: 'none',
            }}
          >
            <option value="">All Priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>
        </div>

        {/* Source Filter */}
        <div style={{ flex: '0 1 180px', minWidth: '140px' }}>
          <select
            value={source}
            onChange={(e) => onSourceChange(e.target.value as EnquirySource | '')}
            style={{
              width: '100%',
              padding: '0.5rem 0.75rem',
              fontSize: '0.875rem',
              borderRadius: '6px',
              border: '1px solid var(--border-color)',
              backgroundColor: '#ffffff',
              color: source ? '#0f172a' : '#64748b',
              outline: 'none',
            }}
          >
            <option value="">All Sources</option>
            <option value="DIRECT_VISIT">Direct Visit</option>
            <option value="PHONE">Phone Inquiry</option>
            <option value="EMAIL">Email Inquiry</option>
            <option value="WEBSITE">Website Form</option>
            <option value="AGENCY_RFQ">Agency RFQ</option>
            <option value="REFERRAL">Referral</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        {/* Clear */}
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

        {/* Total count */}
        {totalCount !== undefined && (
          <div
            style={{
              marginLeft: 'auto',
              fontSize: '0.82rem',
              color: '#64748b',
              fontWeight: 500,
            }}
          >
            {totalCount} {totalCount === 1 ? 'enquiry' : 'enquiries'} found
          </div>
        )}
      </div>
    </div>
  );
};

export default EnquiryFilters;
