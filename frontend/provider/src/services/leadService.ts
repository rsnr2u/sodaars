import apiClient from './api';
import type { ApiResponse, PaginatedResponseData } from '../types/common';
import type { DirectoryLead, LeadListParams, LeadStatus } from '../types/lead';

export const leadService = {
  /**
   * List paginated directory leads with optional search and status filtering
   */
  getLeads: async (params?: LeadListParams): Promise<PaginatedResponseData<DirectoryLead>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponseData<DirectoryLead>>>(
      '/tenant/leads',
      { params }
    );
    return response.data.data;
  },

  /**
   * Get single lead details by UUID including snapshots
   */
  getLead: async (uuid: string): Promise<DirectoryLead> => {
    const response = await apiClient.get<ApiResponse<DirectoryLead>>(`/tenant/leads/${uuid}`);
    return response.data.data;
  },

  /**
   * Update lead lifecycle status enforcing valid state transitions
   */
  updateLeadStatus: async (uuid: string, status: LeadStatus): Promise<DirectoryLead> => {
    const response = await apiClient.put<ApiResponse<DirectoryLead>>(
      `/tenant/leads/${uuid}/status`,
      { status }
    );
    return response.data.data;
  },

  /**
   * Update internal operational notes on a lead
   */
  updateLeadNotes: async (uuid: string, internal_notes: string): Promise<DirectoryLead> => {
    const response = await apiClient.put<ApiResponse<DirectoryLead>>(
      `/tenant/leads/${uuid}/notes`,
      { internal_notes }
    );
    return response.data.data;
  },

  /**
   * Soft delete / archive a lead (Owner and Manager only)
   */
  deleteLead: async (uuid: string): Promise<void> => {
    await apiClient.delete(`/tenant/leads/${uuid}`);
  },
};

export default leadService;
