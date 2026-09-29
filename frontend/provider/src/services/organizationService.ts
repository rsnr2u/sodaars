import apiClient from './api';
import type { ApiResponse } from '../types/common';
import type {
  Organization,
  UpdateOrganizationPayload,
  UpdateOrganizationSettingsPayload,
} from '../types/organization';

export const organizationService = {
  /**
   * Fetch active tenant organization details with active subscription loaded.
   */
  getProfile: async (): Promise<Organization> => {
    const response = await apiClient.get<ApiResponse<Organization>>('/tenant/organization');
    return response.data.data;
  },

  /**
   * Update active tenant organization basic profile (PUT /tenant/organization).
   * Restricted strictly to PROVIDER_OWNER by backend policy.
   */
  updateProfile: async (payload: UpdateOrganizationPayload): Promise<Organization> => {
    const response = await apiClient.put<ApiResponse<Organization>>('/tenant/organization', payload);
    return response.data.data;
  },

  /**
   * Update active tenant organization operational settings, branding, and tax credentials (PUT /tenant/organization/settings).
   * Restricted strictly to PROVIDER_OWNER by backend policy.
   */
  updateSettings: async (payload: UpdateOrganizationSettingsPayload): Promise<Organization> => {
    const response = await apiClient.put<ApiResponse<Organization>>('/tenant/organization/settings', payload);
    return response.data.data;
  },

  /**
   * Toggle public directory visibility (PUT /tenant/organization/visibility).
   * Restricted strictly to PROVIDER_OWNER by backend policy (Manager/Staff receive 403).
   */
  updateVisibility: async (public_directory_visible: boolean): Promise<Organization> => {
    const response = await apiClient.put<ApiResponse<Organization>>('/tenant/organization/visibility', {
      public_directory_visible,
    });
    return response.data.data;
  },
};

export default organizationService;
