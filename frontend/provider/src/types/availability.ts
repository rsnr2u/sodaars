export type ScheduleBlockType =
  | 'BOOKING'
  | 'MAINTENANCE'
  | 'CIVIC_HOLD'
  | 'INTERNAL_BLOCK'
  | 'TENTATIVE_HOLD';

export type ScheduleStatus = 'CONFIRMED' | 'TENTATIVE' | 'CANCELLED';

export type DayAvailabilityStatus =
  | 'AVAILABLE'
  | 'PARTIALLY_AVAILABLE'
  | 'BOOKED'
  | 'MAINTENANCE'
  | 'CIVIC_HOLD'
  | 'INTERNAL_BLOCK'
  | 'TENTATIVE_HOLD';

export interface CalendarDaySchedule {
  uuid: string;
  title?: string | null;
  block_type: ScheduleBlockType;
  status: ScheduleStatus;
  slots_count: number;
  hold_expires_at?: string | null;
}

export interface CalendarDay {
  date: string;
  day: number;
  status: DayAvailabilityStatus;
  total_slots: number;
  booked_slots: number;
  available_slots: number;
  schedules: CalendarDaySchedule[];
}

export interface MonthlyCalendarResource {
  id: number;
  uuid: string;
  name: string;
  code: string;
  category: 'STATIC' | 'DIGITAL';
  total_slots: number;
}

export interface MonthlyCalendarResponse {
  year: number;
  month: number;
  resource: MonthlyCalendarResource;
  days: CalendarDay[];
}

export interface AvailabilityCheckPayload {
  resource_uuid: string;
  start_date: string;
  end_date: string;
  slots_count?: number;
}

export interface AvailabilityConflict {
  uuid: string;
  title?: string | null;
  block_type: string;
  status: string;
  start_date: string;
  end_date: string;
}

export interface AvailabilityBottleneck {
  date: string;
  available_slots: number;
  requested_slots: number;
  total_slots: number;
}

export interface AvailabilityCheckResult {
  is_available: boolean;
  resource_category: 'STATIC' | 'DIGITAL';
  total_slots: number;
  available_slots: number;
  requested_slots: number;
  conflicts: AvailabilityConflict[];
  bottlenecks?: AvailabilityBottleneck[];
}

export interface ResourceScheduleLocationSummary {
  id: number;
  uuid: string;
  name: string;
  code: string;
  city: string;
}

export interface ResourceScheduleResourceSummary {
  id: number;
  uuid: string;
  name: string;
  code: string;
  category: string;
  location?: ResourceScheduleLocationSummary | null;
}

export interface ResourceScheduleUserSummary {
  id: number;
  name: string;
  email: string;
}

export interface ResourceSchedule {
  id: number;
  uuid: string;
  organization_id: number;
  advertising_resource_id: number;
  title?: string | null;
  block_type: ScheduleBlockType;
  status: ScheduleStatus;
  start_date: string;
  end_date: string;
  slots_count: number;
  hold_expires_at?: string | null;
  is_hold_expired?: boolean;
  reference_type?: string | null;
  reference_id?: number | null;
  notes?: string | null;
  advertising_resource?: ResourceScheduleResourceSummary | null;
  created_by?: ResourceScheduleUserSummary | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface ResourceSchedulePayload {
  advertising_resource_uuid: string;
  title?: string;
  block_type: ScheduleBlockType;
  start_date: string;
  end_date: string;
  slots_count?: number;
  hold_expires_at?: string;
  notes?: string;
}

export interface ResourceScheduleFilterParams {
  resource_uuid?: string;
  block_type?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
  search?: string;
  page?: number;
  per_page?: number;
}
