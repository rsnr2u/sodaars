import type { Subscription } from './subscription';
import type { User } from './auth';

export type OrganizationStatus = 'ACTIVE' | 'SUSPENDED' | 'INACTIVE';
export type VerificationStatus = 'UNVERIFIED' | 'PENDING' | 'VERIFIED' | 'REJECTED';
export type RegistrationSource = 'PUBLIC' | 'ADMIN' | 'INVITATION';

export interface OrganizationUserMembership {
  id: number;
  user_id: number;
  organization_id: number;
  role: 'OWNER' | 'MANAGER' | 'STAFF' | string;
  status: 'ACTIVE' | 'INVITED' | 'SUSPENDED' | string;
  user?: User;
  joined_at?: string;
  created_at?: string;
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
  verification_status: VerificationStatus | string;
  verified_at?: string | null;
  registration_source: RegistrationSource | string;
  status: OrganizationStatus | string;
  public_directory_visible: boolean;
  settings?: Record<string, any> | null;
  active_subscription?: Subscription | null;
  members_count?: number;
  users?: User[];
  organization_users?: OrganizationUserMembership[];
  created_at?: string;
  updated_at?: string;
}

export interface OrganizationFilterParams {
  status?: string;
  registration_source?: string;
  search?: string;
  page?: number;
  per_page?: number;
}

export interface StoreOrganizationPayload {
  name: string;
  slug?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  country?: string;
  subscription_plan_id: number;
  billing_cycle?: 'MONTHLY' | 'ANNUAL';
  owner_name?: string;
  owner_email?: string;
  owner_phone?: string;
  owner_password?: string;
}

export interface UpdateOrganizationPayload {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  country?: string;
  status?: OrganizationStatus;
  settings?: Record<string, any>;
}

export interface VerifyOrganizationPayload {
  verification_status: VerificationStatus;
  notes?: string;
}
