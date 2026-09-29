/**
 * Organization Types
 * Matches Stage 2/5/10 OrganizationResource and tenant request contracts.
 */

import type { Subscription } from './subscription';

export interface OrganizationBranding {
  primary_color?: string;
  secondary_color?: string;
  accent_color?: string;
  favicon_url?: string;
}

export interface OrganizationSocialLinks {
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  instagram?: string;
}

export interface OrganizationSettings {
  branding?: OrganizationBranding;
  working_hours?: Record<string, string>;
  social_links?: OrganizationSocialLinks;
}

export interface Organization {
  id: number;
  uuid: string;
  name: string;
  slug: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  pincode?: string | null;
  country?: string | null;
  contact_person?: string | null;
  district?: string | null;
  website?: string | null;
  business_description?: string | null;
  gstin?: string | null;
  pan?: string | null;
  logo_url?: string | null;
  verification_status: 'PENDING' | 'VERIFIED' | 'REJECTED' | string;
  verified_at?: string | null;
  registration_source?: string | null;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | string;
  public_directory_visible: boolean;
  settings?: OrganizationSettings | null;
  active_subscription?: Subscription | null;
  members_count?: number | null;
  created_at?: string;
  updated_at?: string;
}

/**
 * Payload for PUT /tenant/organization (Update basic organization profile)
 */
export interface UpdateOrganizationPayload {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  country?: string;
  settings?: Record<string, unknown>;
}

/**
 * Payload for PUT /tenant/organization/settings (Update operational settings & branding)
 */
export interface UpdateOrganizationSettingsPayload {
  name?: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  district?: string;
  state?: string;
  pincode?: string;
  country?: string;
  website?: string;
  business_description?: string;
  gstin?: string;
  pan?: string;
  logo_url?: string;
  settings?: OrganizationSettings;
}

/**
 * Payload for PUT /tenant/organization/visibility (Toggle public directory visibility)
 */
export interface UpdateOrganizationVisibilityPayload {
  public_directory_visible: boolean;
}
