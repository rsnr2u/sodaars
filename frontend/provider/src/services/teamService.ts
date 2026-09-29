import apiClient from './api';
import type { ApiResponse } from '../types/common';
import type {
  OrganizationMember,
  OrganizationInvitation,
  InviteStaffPayload,
  AddMemberPayload,
} from '../types/team';
import type { ProviderRole } from '../types/auth';

export const teamService = {
  /**
   * List all members belonging to the active organization.
   * Allowed for Owner and Manager.
   */
  getMembers: async (): Promise<OrganizationMember[]> => {
    const response = await apiClient.get<ApiResponse<OrganizationMember[]>>('/tenant/users');
    return response.data.data;
  },

  /**
   * Directly add a user to the organization.
   * Allowed for Owner (any role) and Manager (Staff only).
   */
  addMember: async (payload: AddMemberPayload): Promise<OrganizationMember> => {
    const response = await apiClient.post<ApiResponse<OrganizationMember>>('/tenant/users', payload);
    return response.data.data;
  },

  /**
   * Update an organization member's role.
   * Allowed for Owner (any role) and Manager (Staff only).
   * Note: id is the OrganizationUser membership ID.
   */
  updateMemberRole: async (membershipId: number, role: ProviderRole): Promise<OrganizationMember> => {
    const response = await apiClient.put<ApiResponse<OrganizationMember>>(`/tenant/users/${membershipId}/role`, {
      role,
    });
    return response.data.data;
  },

  /**
   * Remove a member from the active organization.
   * Allowed for Owner (Manager/Staff) and Manager (Staff only).
   * Backend prevents removing the last active Owner.
   */
  removeMember: async (membershipId: number): Promise<void> => {
    await apiClient.delete<ApiResponse<null>>(`/tenant/users/${membershipId}`);
  },

  /**
   * List all staff invitations for the active organization.
   * Allowed for Owner and Manager.
   */
  getInvitations: async (): Promise<OrganizationInvitation[]> => {
    const response = await apiClient.get<ApiResponse<OrganizationInvitation[]>>('/tenant/invitations');
    return response.data.data;
  },

  /**
   * Send a new staff invitation.
   * Allowed for Owner (Manager or Staff) and Manager (Staff only).
   */
  sendInvitation: async (payload: InviteStaffPayload): Promise<OrganizationInvitation> => {
    const response = await apiClient.post<ApiResponse<OrganizationInvitation>>('/tenant/invitations', payload);
    return response.data.data;
  },

  /**
   * Revoke a staff invitation by UUID.
   * Allowed for Owner and Manager.
   */
  revokeInvitation: async (uuid: string): Promise<void> => {
    await apiClient.delete<ApiResponse<null>>(`/tenant/invitations/${uuid}`);
  },
};

export default teamService;
