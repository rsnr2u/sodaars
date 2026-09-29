export type LeadStatus = 'NEW' | 'CONTACTED' | 'CONVERTED' | 'ARCHIVED';

export interface LeadVisitor {
  name: string;
  company_name?: string | null;
  email: string;
  phone: string;
}

export interface LeadCampaign {
  start_date?: string | null;
  end_date?: string | null;
  estimated_budget?: number | null;
  message: string;
}

export interface LeadSnapshots {
  resource_name?: string | null;
  resource_code?: string | null;
  resource_uuid?: string | null;
  location_name?: string | null;
  location_area?: string | null;
  location_uuid?: string | null;
}

export interface LeadReferencedResource {
  uuid: string;
  slug?: string | null;
  name: string;
  code: string;
}

export interface LeadReferencedLocation {
  uuid: string;
  name: string;
  city: string;
  area?: string | null;
}

export interface DirectoryLead {
  uuid: string;
  status: LeadStatus;
  source: string;
  visitor: LeadVisitor;
  campaign: LeadCampaign;
  snapshots: LeadSnapshots;
  referenced_resource?: LeadReferencedResource | null;
  referenced_location?: LeadReferencedLocation | null;
  internal_notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface LeadListParams {
  status?: string;
  search?: string;
  resource_uuid?: string;
  page?: number;
  per_page?: number;
}
