/**
 * Team and Staff Management Types
 * Matches Stage 5 OrganizationUserResource and OrganizationInvitationResource contracts.
 */

import type { User, ProviderRole } from './auth';

export type InvitationStatus = 'PENDING' | 'ACCEPTED' | 'REVOKED' | 'EXPIRED';

export interface OrganizationMember {
  id: number; // OrganizationUser membership ID
  organization_id: number;
  user_id: number;
  user: User;
  role: ProviderRole;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | string;
  is_default: boolean;
  joined_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface OrganizationInvitation {
  id: number;
  uuid: string;
  organization_id: number;
  email: string;
  name: string;
  phone?: string | null;
  role: ProviderRole;
  status: InvitationStatus;
  expires_at?: string | null;
  accepted_at?: string | null;
  revoked_at?: string | null;
  invited_by?: User | null;
  created_at?: string;
  updated_at?: string;
}

export interface InviteStaffPayload {
  name: string;
  email: string;
  phone?: string;
  role: 'PROVIDER_MANAGER' | 'PROVIDER_STAFF';
}

export interface AddMemberPayload {
  name: string;
  email: string;
  phone?: string;
  password?: string;
  role: ProviderRole;
}

export interface ChangeUserRolePayload {
  role: ProviderRole;
}
