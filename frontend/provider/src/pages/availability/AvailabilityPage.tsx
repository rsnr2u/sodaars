import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import resourceService from '../../services/resourceService';
import availabilityService from '../../services/availabilityService';
import { getApiErrorMessage } from '../../services/api';
import type { MonthlyCalendarResponse } from '../../types/availability';
import type { ResourceOption } from '../../components/availability/AvailabilityCheckerModal';
import MonthlyCalendarMatrix from '../../components/availability/MonthlyCalendarMatrix';
import AvailabilityCheckerModal from '../../components/availability/AvailabilityCheckerModal';
import ScheduleBlockDrawer from '../../components/availability/ScheduleBlockDrawer';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';
import {
  Calendar as CalendarIcon,
  Search,
  Lock,
  ShieldCheck,
  ShieldAlert,
  Tv,
  Image,
} from 'lucide-react';

export const AvailabilityPage: React.FC = () => {
  const { role } = useAuth();
  const { error: showError } = useToast();

  const canManageSchedules =
    role === 'PROVIDER_OWNER' ||
    role === 'PROVIDER_MANAGER' ||
    (role as any) === 'OWNER' ||
    (role as any) === 'MANAGER';

  // Resource Selection State
  const [resources, setResources] = useState<ResourceOption[]>([]);
  const [selectedResourceUuid, setSelectedResourceUuid] = useState<string>('');
  const [isLoadingResources, setIsLoadingResources] = useState<boolean>(true);

  // Calendar State
  const currentDate = new Date();
  const [year, setYear] = useState<number>(currentDate.getFullYear());
  const [month, setMonth] = useState<number>(currentDate.getMonth() + 1);
  const [calendarData, setCalendarData] = useState<MonthlyCalendarResponse | null>(null);
  const [isCalendarLoading, setIsCalendarLoading] = useState<boolean>(false);

  // Modals & Drawers
  const [isCheckerOpen, setIsCheckerOpen] = useState<boolean>(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  // Fetch tenant resources for dropdown
  const fetchResources = useCallback(async () => {
    try {
      setIsLoadingResources(true);
      const res = await resourceService.getResources({ per_page: 100 });
      const options: ResourceOption[] = (res.items || []).map((r) => ({
        uuid: r.uuid,
        name: r.name,
        code: r.code,
        category: r.category as 'STATIC' | 'DIGITAL',
        total_slots: (r as any).total_slots || (r.category === 'DIGITAL' ? 10 : 1),
      }));
      setResources(options);
      if (options.length > 0 && !selectedResourceUuid) {
        setSelectedResourceUuid(options[0].uuid);
      }
    } catch (err: any) {
      showError(getApiErrorMessage(err));
    } finally {
      setIsLoadingResources(false);
    }
  }, [showError, selectedResourceUuid]);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  // Fetch monthly calendar matrix when selected resource, year, or month changes
  const fetchCalendar = useCallback(async () => {
    if (!selectedResourceUuid) {
      setCalendarData(null);
      return;
    }

    try {
      setIsCalendarLoading(true);
      const data = await availabilityService.getMonthlyCalendar(
        selectedResourceUuid,
        year,
        month
      );
      setCalendarData(data);
    } catch (err: any) {
      showError(getApiErrorMessage(err));
      setCalendarData(null);
    } finally {
      setIsCalendarLoading(false);
    }
  }, [selectedResourceUuid, year, month, showError]);

  useEffect(() => {
    fetchCalendar();
  }, [fetchCalendar]);

  const handleMonthChange = (newYear: number, newMonth: number) => {
    setYear(newYear);
    setMonth(newMonth);
  };

  const selectedResource = resources.find((r) => r.uuid === selectedResourceUuid);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Page Header */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          backgroundColor: '#ffffff',
          padding: '1.25rem 1.5rem',
          borderRadius: '10px',
          border: '1px solid var(--border-color)',
          boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <CalendarIcon size={22} style={{ color: '#2563eb' }} />
            <h1
              style={{
                fontSize: '1.35rem',
                fontWeight: 700,
                color: '#0f172a',
                margin: 0,
              }}
            >
              Inventory Availability & Schedules
            </h1>
          </div>
          <p
            style={{
              fontSize: '0.85rem',
              color: '#64748b',
              marginTop: '0.35rem',
              marginBottom: 0,
            }}
          >
            Live monthly occupancy matrix, schedule holds, maintenance blocks, and date range availability tester.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsCheckerOpen(true)}
            disabled={resources.length === 0}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              fontSize: '0.875rem',
            }}
          >
            <Search size={16} />
            Check Range Availability
          </Button>

          {canManageSchedules ? (
            <Button
              variant="primary"
              size="md"
              onClick={() => setIsDrawerOpen(true)}
              disabled={resources.length === 0}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                fontSize: '0.875rem',
              }}
            >
              <Lock size={16} />
              Manage Schedule Blocks
            </Button>
          ) : (
            <Button
              variant="secondary"
              size="md"
              onClick={() => setIsDrawerOpen(true)}
              disabled={resources.length === 0}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                fontSize: '0.875rem',
              }}
            >
              <CalendarIcon size={16} />
              View Schedule Records
            </Button>
          )}
        </div>
      </div>

      {/* Role Notice & Resource Selector Bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          backgroundColor: '#ffffff',
          padding: '1rem 1.25rem',
          borderRadius: '10px',
          border: '1px solid var(--border-color)',
          boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)',
        }}
      >
        {/* Resource Picker */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: '1 1 350px' }}>
          <label
            htmlFor="resource-selector"
            style={{
              fontSize: '0.85rem',
              fontWeight: 600,
              color: '#0f172a',
              whiteSpace: 'nowrap',
            }}
          >
            Select Advertising Unit:
          </label>
          <div style={{ flex: 1, maxWidth: '420px' }}>
            <select
              id="resource-selector"
              value={selectedResourceUuid}
              onChange={(e) => setSelectedResourceUuid(e.target.value)}
              disabled={isLoadingResources || resources.length === 0}
              style={{
                width: '100%',
                padding: '0.55rem 0.85rem',
                fontSize: '0.875rem',
                borderRadius: '6px',
                border: '1px solid var(--border-color)',
                backgroundColor: '#ffffff',
                color: '#0f172a',
                fontWeight: 500,
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              {resources.map((res) => (
                <option key={res.uuid} value={res.uuid}>
                  [{res.code}] {res.name} ({res.category})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Selected Unit Meta Indicators */}
        {selectedResource && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.8rem',
                backgroundColor: '#f1f5f9',
                color: '#334155',
                padding: '0.35rem 0.65rem',
                borderRadius: '6px',
                fontWeight: 500,
              }}
            >
              {selectedResource.category === 'DIGITAL' ? (
                <>
                  <Tv size={14} style={{ color: '#2563eb' }} />
                  Digital Screen ({selectedResource.total_slots || 1} Loop Slots)
                </>
              ) : (
                <>
                  <Image size={14} style={{ color: '#64748b' }} />
                  Static Display (Exclusive Unit)
                </>
              )}
            </span>

            {/* RBAC Notice */}
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.78rem',
                color: canManageSchedules ? '#0f766e' : '#64748b',
                backgroundColor: canManageSchedules ? '#f0fdf4' : '#f8fafc',
                border: `1px solid ${canManageSchedules ? '#bbf7d0' : '#e2e8f0'}`,
                padding: '0.35rem 0.65rem',
                borderRadius: '6px',
              }}
            >
              {canManageSchedules ? (
                <>
                  <ShieldCheck size={13} />
                  Full Schedule Management
                </>
              ) : (
                <>
                  <ShieldAlert size={13} />
                  Read-Only Schedule View
                </>
              )}
            </span>
          </div>
        )}
      </div>

      {/* Main Calendar View */}
      {isLoadingResources ? (
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '10px',
            border: '1px solid var(--border-color)',
            padding: '4rem 2rem',
            textAlign: 'center',
          }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', color: '#64748b' }}>
            <Spinner size={22} />
            <span>Loading inventory units...</span>
          </div>
        </div>
      ) : resources.length === 0 ? (
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '10px',
            border: '1px solid var(--border-color)',
            padding: '3rem 2rem',
          }}
        >
          <EmptyState
            icon={<CalendarIcon size={32} />}
            title="No Advertising Units Available"
            description="You need to create at least one advertising resource in the Inventory module before viewing availability schedules and booking blocks."
          />
        </div>
      ) : (
        <MonthlyCalendarMatrix
          calendar={calendarData}
          isLoading={isCalendarLoading}
          year={year}
          month={month}
          onMonthChange={handleMonthChange}
        />
      )}

      {/* Availability Checker Modal */}
      {isCheckerOpen && (
        <AvailabilityCheckerModal
          isOpen={isCheckerOpen}
          onClose={() => setIsCheckerOpen(false)}
          resources={resources}
          initialResourceUuid={selectedResourceUuid}
        />
      )}

      {/* Schedule Block Drawer (Holds, Bookings, Maintenance) */}
      {isDrawerOpen && (
        <ScheduleBlockDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          resources={resources}
          initialResourceUuid={selectedResourceUuid}
          onScheduleChanged={fetchCalendar}
        />
      )}
    </div>
  );
};

export default AvailabilityPage;
