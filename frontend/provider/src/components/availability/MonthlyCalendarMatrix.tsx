import React, { useState } from 'react';
import type {
  MonthlyCalendarResponse,
  CalendarDay,
  CalendarDaySchedule,
} from '../../types/availability';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Spinner from '../ui/Spinner';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
} from 'lucide-react';

export interface MonthlyCalendarMatrixProps {
  calendar: MonthlyCalendarResponse | null;
  isLoading: boolean;
  year: number;
  month: number;
  onMonthChange: (year: number, month: number) => void;
  onSelectDaySchedule?: (schedule: CalendarDaySchedule) => void;
}

export const MonthlyCalendarMatrix: React.FC<MonthlyCalendarMatrixProps> = ({
  calendar,
  isLoading,
  year,
  month,
  onMonthChange,
  onSelectDaySchedule,
}) => {
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const handlePrevMonth = () => {
    if (month === 1) {
      onMonthChange(year - 1, 12);
    } else {
      onMonthChange(year, month - 1);
    }
    setSelectedDay(null);
  };

  const handleNextMonth = () => {
    if (month === 12) {
      onMonthChange(year + 1, 1);
    } else {
      onMonthChange(year, month + 1);
    }
    setSelectedDay(null);
  };

  const handleToday = () => {
    const now = new Date();
    onMonthChange(now.getFullYear(), now.getMonth() + 1);
    setSelectedDay(null);
  };

  // Compute blank padding days before the 1st of the month
  const firstDayOfWeek = new Date(year, month - 1, 1).getDay(); // 0 = Sunday
  const paddingDays = Array.from({ length: firstDayOfWeek }, (_, i) => i);

  // Derived real stats from calendar matrix
  const days = calendar?.days || [];
  const totalDays = days.length;
  const availableDays = days.filter((d) => d.status === 'AVAILABLE').length;
  const partiallyAvailableDays = days.filter((d) => d.status === 'PARTIALLY_AVAILABLE').length;
  const bookedOrBlockedDays = days.filter(
    (d) => d.status !== 'AVAILABLE' && d.status !== 'PARTIALLY_AVAILABLE'
  ).length;

  const occupancyRate = totalDays > 0 ? Math.round((bookedOrBlockedDays / totalDays) * 100) : 0;

  const getStatusStyle = (day: CalendarDay) => {
    switch (day.status) {
      case 'AVAILABLE':
        return {
          bg: 'var(--emerald-50)',
          border: 'var(--emerald-200)',
          text: 'var(--emerald-700)',
          pillBg: 'var(--emerald-100)',
          label: 'Available',
        };
      case 'PARTIALLY_AVAILABLE':
        return {
          bg: 'var(--orange-50)',
          border: 'var(--orange-200)',
          text: 'var(--orange-700)',
          pillBg: 'var(--orange-100)',
          label: `${day.available_slots}/${day.total_slots} left`,
        };
      case 'BOOKED':
        return {
          bg: 'var(--rose-50)',
          border: 'var(--rose-200)',
          text: 'var(--rose-700)',
          pillBg: 'var(--rose-100)',
          label: 'Booked',
        };
      case 'MAINTENANCE':
        return {
          bg: '#f1f5f9',
          border: '#cbd5e1',
          text: '#475569',
          pillBg: '#e2e8f0',
          label: 'Maintenance',
        };
      case 'CIVIC_HOLD':
        return {
          bg: 'var(--blue-50)',
          border: 'var(--blue-200)',
          text: 'var(--blue-700)',
          pillBg: 'var(--blue-100)',
          label: 'Civic Hold',
        };
      case 'TENTATIVE_HOLD':
        return {
          bg: '#fffbeb',
          border: '#fde68a',
          text: '#b45309',
          pillBg: '#fef3c7',
          label: 'Hold',
        };
      case 'INTERNAL_BLOCK':
      default:
        return {
          bg: '#f8fafc',
          border: '#e2e8f0',
          text: '#64748b',
          pillBg: '#f1f5f9',
          label: 'Blocked',
        };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Calendar Navigation & Month Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#ffffff',
          padding: '0.85rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-xs)',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-xs)',
              backgroundColor: 'var(--blue-50)',
              color: 'var(--blue-600)',
            }}
          >
            <CalendarIcon size={18} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: 'var(--text-heading)' }}>
              {monthNames[month - 1]} {year}
            </h2>
            {calendar?.resource && (
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Viewing: <strong>{calendar.resource.name}</strong> ({calendar.resource.code}) •{' '}
                {calendar.resource.category === 'DIGITAL' ? `${calendar.resource.total_slots} Digital Slots` : 'Static Face'}
              </span>
            )}
          </div>
        </div>

        {/* Real Derived Month Metrics */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontSize: '0.8rem' }}>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Available: </span>
            <strong style={{ color: 'var(--emerald-600)' }}>{availableDays} days</strong>
          </div>
          {partiallyAvailableDays > 0 && (
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Partial: </span>
              <strong style={{ color: 'var(--orange-600)' }}>{partiallyAvailableDays} days</strong>
            </div>
          )}
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Booked/Hold: </span>
            <strong style={{ color: 'var(--rose-600)' }}>{bookedOrBlockedDays} days</strong>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Occupancy: </span>
            <strong>{occupancyRate}%</strong>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Button variant="secondary" size="sm" onClick={handlePrevMonth} leftIcon={<ChevronLeft size={14} />}>
            Prev
          </Button>
          <Button variant="outline" size="sm" onClick={handleToday}>
            Today
          </Button>
          <Button variant="secondary" size="sm" onClick={handleNextMonth} rightIcon={<ChevronRight size={14} />}>
            Next
          </Button>
        </div>
      </div>

      {/* Main Calendar Grid Card */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-xs)',
          overflow: 'hidden',
        }}
      >
        {/* Days of Week Header */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            backgroundColor: 'var(--canvas-bg)',
            borderBottom: '1px solid var(--border-color)',
            textAlign: 'center',
            fontSize: '0.78rem',
            fontWeight: 600,
            color: 'var(--text-secondary)',
            padding: '0.6rem 0',
          }}
        >
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>

        {/* Calendar Day Cells */}
        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '5rem 0' }}>
            <Spinner size={32} />
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gridAutoRows: 'minmax(90px, auto)',
              gap: '1px',
              backgroundColor: 'var(--border-subtle)',
            }}
          >
            {/* Blank padding cells before 1st of month */}
            {paddingDays.map((pad) => (
              <div key={`pad-${pad}`} style={{ backgroundColor: '#fafbfc' }} />
            ))}

            {/* Actual Days */}
            {days.map((day) => {
              const style = getStatusStyle(day);
              const isSelected = selectedDay?.date === day.date;
              const hasSchedules = day.schedules && day.schedules.length > 0;

              return (
                <div
                  key={day.date}
                  onClick={() => setSelectedDay(day)}
                  style={{
                    backgroundColor: isSelected ? 'var(--blue-50)' : '#ffffff',
                    padding: '0.5rem',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    outline: isSelected ? '2px solid var(--blue-600)' : 'none',
                    outlineOffset: '-2px',
                    transition: 'background-color 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span
                      style={{
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        color: isSelected ? 'var(--blue-700)' : 'var(--text-heading)',
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      {day.day}
                    </span>

                    {/* Slot Count info for Digital */}
                    {calendar?.resource?.category === 'DIGITAL' && (
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        {day.available_slots} / {day.total_slots}
                      </span>
                    )}
                  </div>

                  {/* Day Status Pill */}
                  <div style={{ marginTop: '0.35rem' }}>
                    <div
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        padding: '2px 6px',
                        borderRadius: 'var(--radius-xs)',
                        backgroundColor: style.pillBg,
                        color: style.text,
                        textAlign: 'center',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {style.label}
                    </div>

                    {hasSchedules && day.schedules.length > 1 && (
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '2px' }}>
                        +{day.schedules.length - 1} more block
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Selected Day Inspector Pane */}
      {selectedDay && (
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
            padding: '1rem 1.25rem',
            boxShadow: 'var(--shadow-xs)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={16} style={{ color: 'var(--blue-600)' }} />
              <h4 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-heading)' }}>
                Day Details: {selectedDay.date}
              </h4>
              <Badge
                variant={
                  selectedDay.status === 'AVAILABLE'
                    ? 'success'
                    : selectedDay.status === 'PARTIALLY_AVAILABLE'
                    ? 'warning'
                    : 'danger'
                }
              >
                {selectedDay.status.replace('_', ' ')}
              </Badge>
            </div>

            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Slots: <strong>{selectedDay.available_slots}</strong> available / {selectedDay.total_slots} total
            </div>
          </div>

          {selectedDay.schedules && selectedDay.schedules.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {selectedDay.schedules.map((s) => (
                <div
                  key={s.uuid}
                  onClick={() => onSelectDaySchedule?.(s)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.6rem 0.85rem',
                    backgroundColor: 'var(--canvas-bg)',
                    borderRadius: 'var(--radius-xs)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.82rem',
                    cursor: onSelectDaySchedule ? 'pointer' : 'default',
                  }}
                >
                  <div>
                    <strong style={{ color: 'var(--text-heading)' }}>
                      {s.title || 'Reserved Schedule Block'}
                    </strong>
                    {s.slots_count > 1 && (
                      <span style={{ marginLeft: '0.5rem', color: 'var(--text-muted)' }}>
                        ({s.slots_count} slots)
                      </span>
                    )}
                    {s.hold_expires_at && (
                      <div style={{ fontSize: '0.72rem', color: 'var(--orange-700)', marginTop: '2px' }}>
                        Hold expires: {new Date(s.hold_expires_at).toLocaleString()}
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Badge variant="neutral">{s.block_type.replace('_', ' ')}</Badge>
                    <Badge variant={s.status === 'CONFIRMED' ? 'success' : 'warning'}>
                      {s.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              No scheduled blocks or holds on this day. The resource is 100% available.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MonthlyCalendarMatrix;
