export type ProviderRole = 'PROVIDER_OWNER' | 'PROVIDER_MANAGER' | 'PROVIDER_STAFF';

export interface User {
  id: number;
  uuid: string;
  name: string;
  email: string;
  phone?: string | null;
  status: string;
  email_verified_at?: string | null;
  created_at: string;
}

export interface OrganizationSummary {
  id: number;
  uuid: string;
  name: string;
  slug: string;
  trading_name?: string | null;
  status: string;
  verification_status: string;
  public_directory_visible?: boolean;
}

export interface Membership {
  id: number;
  role: ProviderRole;
  is_default: boolean;
  status: string;
  organization: OrganizationSummary;
}

export interface AuthResponseData {
  token: string;
  token_type: string;
  user: User;
  platform_role?: string | null;
  provider_role?: ProviderRole;
  organization?: OrganizationSummary;
  memberships?: Membership[];
}

export interface MeResponseData {
  user: User;
  platform_role?: string | null;
  is_platform_user?: boolean;
  memberships: Membership[];
  current_organization: OrganizationSummary | null;
  provider_role: ProviderRole | null;
  status: string;
  email_verified: boolean;
}
