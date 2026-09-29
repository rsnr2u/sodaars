import type { Customer } from './customer';

export type EnquiryStatus =
  | 'NEW'
  | 'UNDER_REVIEW'
  | 'QUOTED'
  | 'NEGOTIATING'
  | 'CONVERTED'
  | 'LOST'
  | 'CANCELLED';

export type EnquiryPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export type EnquirySource =
  | 'DIRECT_VISIT'
  | 'PHONE'
  | 'EMAIL'
  | 'WEBSITE'
  | 'AGENCY_RFQ'
  | 'REFERRAL'
  | 'OTHER';

export interface EnquiryUserSummary {
  id: number;
  uuid: string;
  name: string;
  email: string;
}

export interface EnquiryItemResourceRef {
  id: number;
  uuid: string;
  name: string;
  code: string;
  resource_type: string;
  category: string;
  base_price_monthly?: number | null;
}

export interface EnquiryItemLocationRef {
  id: number;
  uuid: string;
  name: string;
  code: string;
  city: string;
  state: string;
  area?: string | null;
}

export interface EnquiryItem {
  id: number;
  uuid: string;
  enquiry_id: number;
  advertising_resource_id?: number | null;
  location_id?: number | null;
  item_type: 'RESOURCE' | 'LOCATION';
  start_date?: string | null;
  end_date?: string | null;
  effective_start_date?: string | null;
  effective_end_date?: string | null;
  slots_count: number;
  proposed_rate?: number | null;
  notes?: string | null;
  advertising_resource?: EnquiryItemResourceRef | null;
  location?: EnquiryItemLocationRef | null;
}

export interface Enquiry {
  id: number;
  uuid: string;
  organization_id: number;
  enquiry_number: string;
  customer_id: number;
  campaign_title: string;
  status: EnquiryStatus;
  priority: EnquiryPriority;
  source: EnquirySource;
  start_date?: string | null;
  end_date?: string | null;
  estimated_budget?: number | null;
  currency?: string | null;
  assigned_to_user_id?: number | null;
  lost_reason?: string | null;
  requirements?: string | null;
  internal_notes?: string | null;
  customer?: Customer | null;
  assigned_to?: EnquiryUserSummary | null;
  created_by?: EnquiryUserSummary | null;
  items: EnquiryItem[];
  active_holds_count?: number;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface EnquiryItemPayload {
  resource_uuid?: string;
  advertising_resource_id?: number;
  location_uuid?: string;
  location_id?: number;
  start_date?: string;
  end_date?: string;
  slots_count?: number;
  proposed_rate?: number;
  notes?: string;
}

export interface EnquiryPayload {
  customer_uuid?: string;
  customer_id?: number;
  campaign_title: string;
  enquiry_number?: string;
  priority?: EnquiryPriority;
  source?: EnquirySource;
  start_date?: string;
  end_date?: string;
  estimated_budget?: number;
  currency?: string;
  assigned_to_user_id?: number;
  requirements?: string;
  internal_notes?: string;
  items?: EnquiryItemPayload[];
}

export interface EnquiryAvailabilityItemResult {
  item_uuid: string;
  type: string;
  resource_uuid: string;
  resource_name: string;
  start_date?: string;
  end_date?: string;
  slots_count?: number;
  is_available: boolean | null;
  message?: string;
  total_slots?: number;
  available_slots?: number;
  requested_slots?: number;
  conflicts?: Array<{
    date: string;
    available_slots: number;
    requested_slots: number;
    total_slots: number;
  }>;
}

export interface EnquiryAvailabilityResponse {
  enquiry_uuid: string;
  enquiry_number: string;
  items_count: number;
  items: EnquiryAvailabilityItemResult[];
}

export interface EnquiryListParams {
  search?: string;
  status?: EnquiryStatus | '';
  priority?: EnquiryPriority | '';
  source?: EnquirySource | '';
  customer_id?: number;
  start_date?: string;
  end_date?: string;
  sort_by?: 'enquiry_number' | 'campaign_title' | 'created_at' | 'status' | 'start_date';
  sort_order?: 'asc' | 'desc';
  page?: number;
  per_page?: number;
}
