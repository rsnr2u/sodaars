import { StaticResourceType, LocationMetadata } from './resource';

export type AvailabilityState =
  | 'Available'
  | 'Booked'
  | 'Hold'
  | 'Provider Block'
  | 'Admin Block'
  | 'Maintenance';

export const APPROVED_AVAILABILITY_STATES: AvailabilityState[] = [
  'Available',
  'Booked',
  'Hold',
  'Provider Block',
  'Admin Block',
  'Maintenance',
];

export interface AvailabilityStateMeta {
  state: AvailabilityState;
  meaning: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  cellBg: string;
  cellText: string;
  cellBorder: string;
  indicatorBg: string;
}

export const AVAILABILITY_STATE_CONFIG: Record<AvailabilityState, AvailabilityStateMeta> = {
  Available: {
    state: 'Available',
    meaning: 'Resource date is available.',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-700',
    badgeBorder: 'border-emerald-200',
    cellBg: 'bg-emerald-50/70',
    cellText: 'text-emerald-800',
    cellBorder: 'border-emerald-200',
    indicatorBg: 'bg-emerald-500',
  },
  Booked: {
    state: 'Booked',
    meaning: 'Resource date is booked.',
    badgeBg: 'bg-stone-100',
    badgeText: 'text-stone-700',
    badgeBorder: 'border-stone-300',
    cellBg: 'bg-stone-100',
    cellText: 'text-stone-800',
    cellBorder: 'border-stone-300',
    indicatorBg: 'bg-stone-500',
  },
  Hold: {
    state: 'Hold',
    meaning: 'Resource date is provisionally held.',
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-800',
    badgeBorder: 'border-amber-200',
    cellBg: 'bg-amber-50/80',
    cellText: 'text-amber-900',
    cellBorder: 'border-amber-200',
    indicatorBg: 'bg-amber-500',
  },
  'Provider Block': {
    state: 'Provider Block',
    meaning: 'Provider has blocked the resource/date.',
    badgeBg: 'bg-orange-50',
    badgeText: 'text-[#EA580C]',
    badgeBorder: 'border-orange-200',
    cellBg: 'bg-orange-50/80',
    cellText: 'text-orange-900',
    cellBorder: 'border-orange-200',
    indicatorBg: 'bg-[#EA580C]',
  },
  'Admin Block': {
    state: 'Admin Block',
    meaning: 'SODAARS administration has blocked the resource/date.',
    badgeBg: 'bg-rose-50',
    badgeText: 'text-rose-700',
    badgeBorder: 'border-rose-200',
    cellBg: 'bg-rose-50/80',
    cellText: 'text-rose-900',
    cellBorder: 'border-rose-200',
    indicatorBg: 'bg-rose-500',
  },
  Maintenance: {
    state: 'Maintenance',
    meaning: 'Resource date is unavailable for maintenance.',
    badgeBg: 'bg-stone-200/70',
    badgeText: 'text-stone-700',
    badgeBorder: 'border-stone-300',
    cellBg: 'bg-stone-200/50',
    cellText: 'text-stone-700',
    cellBorder: 'border-stone-300',
    indicatorBg: 'bg-stone-400',
  },
};

export interface AvailabilityInterval {
  id: string;
  resourceId: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  state: AvailabilityState;
  bookingRef?: string;
  holdRef?: string;
}

export interface ResourceAvailabilityItem {
  id: string;
  name: string;
  type: StaticResourceType;
  location: LocationMetadata;
  marketplaceParticipation: boolean;
}
