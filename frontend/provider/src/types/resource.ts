import type { ResourceMedia } from './resourceMedia';

export type ResourceType =
  | 'HOARDING'
  | 'BILLBOARD'
  | 'UNIPOLE'
  | 'GANTRY'
  | 'LED_SCREEN'
  | 'DIGITAL_SCREEN'
  | 'BUS_SHELTER'
  | 'POLE_AD'
  | 'WALL_MOUNT'
  | 'ROOFTOP'
  | 'BRIDGE_PANEL'
  | 'OTHER';

export type ResourceCategory = 'STATIC' | 'DIGITAL';

export type ResourceStatus = 'ACTIVE' | 'INACTIVE' | 'UNDER_MAINTENANCE' | 'UNDER_REVIEW';

export type IlluminationType =
  | 'FRONT_LIT'
  | 'BACK_LIT'
  | 'NON_LIT'
  | 'DIGITAL_LED'
  | 'SOLAR_LIT'
  | 'OTHER';

export type DimensionUnit = 'FEET' | 'METERS' | 'INCHES';

export interface ResourceLocationSummary {
  id: number;
  uuid: string;
  name: string;
  code: string;
  city: string;
  state: string;
  latitude?: number | null;
  longitude?: number | null;
}

export interface ResourceUserSummary {
  id: number;
  uuid: string;
  name: string;
  email: string;
}

export interface AdvertisingResource {
  id: number;
  uuid: string;
  organization_id: number;
  location_id: number;
  name: string;
  code: string;
  slug?: string | null;
  resource_type: ResourceType;
  category: ResourceCategory;
  face_number?: number | null;
  face_label?: string | null;
  direction?: string | null;
  traffic_flow?: string | null;
  width: number;
  height: number;
  dimension_unit: DimensionUnit;
  area?: number | null;
  illumination_type: IlluminationType;
  operating_hours_from?: string | null;
  operating_hours_to?: string | null;
  resolution?: string | null;
  pixel_pitch?: string | null;
  slot_duration_seconds?: number | null;
  daily_impressions_estimate?: number | null;
  base_price_monthly?: number | null;
  currency?: string | null;
  status: ResourceStatus;
  description?: string | null;
  installation_details?: string | null;
  notes?: string | null;
  location?: ResourceLocationSummary | null;
  created_by?: ResourceUserSummary | null;
  media?: ResourceMedia[];
  created_at?: string | null;
  updated_at?: string | null;
}

export interface AdvertisingResourcePayload {
  location_uuid: string;
  name: string;
  code: string;
  resource_type: ResourceType;
  category: ResourceCategory;
  face_number?: number | null;
  face_label?: string | null;
  direction?: string | null;
  traffic_flow?: string | null;
  width: number;
  height: number;
  dimension_unit?: DimensionUnit;
  illumination_type: IlluminationType;
  operating_hours_from?: string | null;
  operating_hours_to?: string | null;
  resolution?: string | null;
  pixel_pitch?: string | null;
  slot_duration_seconds?: number | null;
  daily_impressions_estimate?: number | null;
  base_price_monthly?: number | null;
  currency?: string | null;
  status?: ResourceStatus;
  description?: string | null;
  installation_details?: string | null;
  notes?: string | null;
}

export interface AdvertisingResourceFilterParams {
  page?: number;
  per_page?: number;
  search?: string;
  location_uuid?: string;
  resource_type?: string;
  category?: string;
  status?: string;
  illumination_type?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface SubscriptionPlanSummary {
  id: number;
  name: string;
  slug: string;
  min_resources: number;
  max_resources: number;
  monthly_price: number;
}

export interface TenantSubscription {
  id: number;
  organization_id: number;
  subscription_plan_id: number;
  plan?: SubscriptionPlanSummary | null;
  status: string;
  billing_cycle: string;
  resource_limit: number;
  price: number;
  currency: string;
  starts_at?: string | null;
  ends_at?: string | null;
}
