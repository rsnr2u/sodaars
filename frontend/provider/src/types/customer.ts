export type CustomerType =
  | 'DIRECT_ADVERTISER'
  | 'AGENCY'
  | 'BRAND'
  | 'INDIVIDUAL'
  | 'GOVERNMENT';

export type CustomerStatus = 'ACTIVE' | 'INACTIVE' | 'BLOCKED';

export interface CustomerCreatedBy {
  id: number;
  uuid: string;
  name: string;
  email: string;
}

export interface Customer {
  id: number;
  uuid: string;
  organization_id: number;
  code: string;
  customer_type: CustomerType;
  company_name?: string | null;
  brand_name?: string | null;
  contact_person: string;
  email?: string | null;
  phone: string;
  alternate_phone?: string | null;
  website?: string | null;
  billing_address?: string | null;
  city?: string | null;
  state?: string | null;
  pincode?: string | null;
  country?: string | null;
  gstin?: string | null;
  pan_number?: string | null;
  credit_period_days: number;
  status: CustomerStatus;
  notes?: string | null;
  enquiries_count?: number;
  created_by?: CustomerCreatedBy | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface CustomerPayload {
  code?: string;
  customer_type: CustomerType;
  company_name?: string;
  brand_name?: string;
  contact_person: string;
  email?: string;
  phone: string;
  alternate_phone?: string;
  website?: string;
  billing_address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  country?: string;
  gstin?: string;
  pan_number?: string;
  credit_period_days?: number;
  status?: CustomerStatus;
  notes?: string;
}

export interface CustomerListParams {
  search?: string;
  status?: CustomerStatus | '';
  customer_type?: CustomerType | '';
  city?: string;
  state?: string;
  sort_by?: 'company_name' | 'code' | 'created_at' | 'status';
  sort_order?: 'asc' | 'desc';
  page?: number;
  per_page?: number;
}
