const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1';

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  errors?: Record<string, string[]>;
}

export interface PaginatedData<T> {
  items: T[];
  pagination: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
}

export interface IndicativeRate {
  amount: number | null;
  currency: string;
  period: string | null;
  display_label: string;
  formatted: string;
  disclaimer: string;
}

export interface MediaAsset {
  uuid: string;
  media_type: string;
  display_url: string;
  thumbnail_url: string;
  alt_text: string;
  caption: string | null;
  is_primary: boolean;
  sort_order?: number;
}

export interface PublicProvider {
  name: string;
  slug: string;
  logo_url: string | null;
  business_description: string | null;
  website: string | null;
  business_phone: string | null;
  business_email: string | null;
  business_address?: {
    address: string | null;
    city: string | null;
    state: string | null;
    pincode: string | null;
    country: string;
  };
  operational_cities: string[];
  verification_status: string;
  verified_at?: string;
  active_resources_count?: number;
}

export interface PublicResourceItem {
  uuid: string;
  slug: string;
  name: string;
  code: string;
  resource_type: string;
  category: 'STATIC' | 'DIGITAL' | string;
  dimensions: {
    width: number;
    height: number;
    unit: string;
    area_sqft: number;
  };
  illumination_type: string | null;
  indicative_rate: IndicativeRate;
  primary_media: MediaAsset | null;
  location: {
    city: string;
    district: string | null;
    state: string;
    area: string;
    landmark: string | null;
    latitude: number | null;
    longitude: number | null;
  };
  provider: {
    name: string;
    slug: string;
    logo_url: string | null;
    verification_status: string;
  };
}

export interface PublicResourceDetail extends Omit<PublicResourceItem, 'location' | 'provider'> {
  face_number: number | null;
  face_label: string | null;
  direction: string | null;
  traffic_flow: string | null;
  operating_hours: {
    from: string | null;
    to: string | null;
  };
  digital_specs: {
    resolution: string | null;
    pixel_pitch: string | null;
    slot_duration_seconds: number | null;
    total_slots: number | null;
    daily_impressions_estimate: number | null;
  } | null;
  description: string | null;
  media: MediaAsset[];
  location: {
    uuid?: string;
    name?: string;
    city: string;
    district: string | null;
    state: string;
    area: string;
    landmark: string | null;
    address?: string | null;
    pincode?: string | null;
    latitude: number | null;
    longitude: number | null;
    location_type?: string | null;
  };
  provider: PublicProvider;
}

export interface PublicMapPoint {
  uuid: string;
  slug: string;
  name: string;
  resource_type: string;
  category: string;
  latitude: number;
  longitude: number;
  city: string;
  area: string;
  thumbnail_url: string | null;
  indicative_rate: string;
  provider_name: string;
}

export interface DirectoryOverview {
  counts: {
    verified_providers: number;
    active_resources: number;
    active_locations: number;
    covered_cities: number;
  };
  featured_cities: string[];
  featured_categories: string[];
  recent_verified_providers: PublicProvider[];
  featured_resources: PublicResourceItem[];
}

export interface LeadPayload {
  name: string;
  company_name?: string;
  email: string;
  phone: string;
  campaign_start_date?: string;
  campaign_end_date?: string;
  estimated_budget?: number;
  message: string;
  hp_field?: string;
}

export async function fetchFromApi<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return {
      success: false,
      message: 'Failed to connect to directory API service.',
      data: null as unknown as T,
    };
  }
}

export async function getDirectoryOverview(): Promise<ApiResponse<DirectoryOverview>> {
  return fetchFromApi<DirectoryOverview>('/public/directory/overview', { next: { revalidate: 60 } });
}

export async function getProviders(params?: Record<string, string>): Promise<ApiResponse<PaginatedData<PublicProvider>>> {
  const query = params ? `?${new URLSearchParams(params).toString()}` : '';
  return fetchFromApi<PaginatedData<PublicProvider>>(`/public/providers${query}`, { next: { revalidate: 60 } });
}

export async function getProviderProfile(slug: string): Promise<ApiResponse<PublicProvider>> {
  return fetchFromApi<PublicProvider>(`/public/providers/${slug}`, { next: { revalidate: 60 } });
}

export async function getProviderInventory(slug: string, params?: Record<string, string>): Promise<ApiResponse<PaginatedData<PublicResourceItem>>> {
  const query = params ? `?${new URLSearchParams(params).toString()}` : '';
  return fetchFromApi<PaginatedData<PublicResourceItem>>(`/public/providers/${slug}/inventory${query}`, { next: { revalidate: 60 } });
}

export async function getResources(params?: Record<string, string>): Promise<ApiResponse<PaginatedData<PublicResourceItem>>> {
  const query = params ? `?${new URLSearchParams(params).toString()}` : '';
  return fetchFromApi<PaginatedData<PublicResourceItem>>(`/public/resources${query}`, { next: { revalidate: 30 } });
}

export async function getResourceMap(params?: Record<string, string>): Promise<ApiResponse<PublicMapPoint[]>> {
  const query = params ? `?${new URLSearchParams(params).toString()}` : '';
  return fetchFromApi<PublicMapPoint[]>(`/public/resources/map${query}`, { next: { revalidate: 60 } });
}

export async function getResourceDetail(slugOrUuid: string): Promise<ApiResponse<PublicResourceDetail>> {
  return fetchFromApi<PublicResourceDetail>(`/public/resources/${slugOrUuid}`, { next: { revalidate: 30 } });
}

export async function submitResourceLead(slugOrUuid: string, payload: LeadPayload): Promise<ApiResponse<{ lead_uuid: string; resource_name: string; provider_name: string }>> {
  return fetchFromApi<{ lead_uuid: string; resource_name: string; provider_name: string }>(`/public/resources/${slugOrUuid}/contact`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function submitProviderLead(slug: string, payload: LeadPayload): Promise<ApiResponse<{ lead_uuid: string; provider_name: string }>> {
  return fetchFromApi<{ lead_uuid: string; provider_name: string }>(`/public/providers/${slug}/contact`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
