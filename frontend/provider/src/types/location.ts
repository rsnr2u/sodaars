export type LocationStatus = 'ACTIVE' | 'INACTIVE' | 'UNDER_REVIEW';

export interface LocationUserSummary {
  id: number;
  uuid: string;
  name: string;
  email: string;
}

export interface Location {
  id: number;
  uuid: string;
  organization_id: number;
  name: string;
  code: string;
  address?: string | null;
  area?: string | null;
  locality?: string | null;
  city: string;
  district?: string | null;
  state: string;
  pincode?: string | null;
  country?: string | null;
  landmark?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  description?: string | null;
  status: LocationStatus;
  notes?: string | null;
  created_by?: LocationUserSummary | null;
  media?: any[];
  created_at?: string | null;
  updated_at?: string | null;
}

export interface LocationPayload {
  name: string;
  code: string;
  address?: string;
  area?: string;
  locality?: string;
  city: string;
  district?: string;
  state: string;
  pincode?: string;
  country?: string;
  landmark?: string;
  latitude?: number | null;
  longitude?: number | null;
  description?: string;
  status?: LocationStatus;
  notes?: string;
}

export interface LocationFilterParams {
  page?: number;
  per_page?: number;
  search?: string;
  status?: string;
  city?: string;
  district?: string;
  state?: string;
}
