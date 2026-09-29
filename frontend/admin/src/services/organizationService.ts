import apiClient from './api';
import type { ApiResponse, PaginatedResponse } from '../types/common';
import type {
  Organization,
  OrganizationFilterParams,
  StoreOrganizationPayload,
  UpdateOrganizationPayload,
  VerifyOrganizationPayload,
} from '../types/organization';

export const organizationService = {
  async getOrganizations(params?: OrganizationFilterParams): Promise<PaginatedResponse<Organization>> {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Organization>>>('/admin/organizations', {
      params,
    });
    return response.data.data;
  },

  async getOrganization(uuid: string): Promise<Organization> {
    const response = await apiClient.get<ApiResponse<Organization>>(`/admin/organizations/${uuid}`);
    return response.data.data;
  },

  async createOrganization(payload: StoreOrganizationPayload): Promise<Organization> {
    const response = await apiClient.post<ApiResponse<Organization>>('/admin/organizations', payload);
    return response.data.data;
  },

  async updateOrganization(uuid: string, payload: UpdateOrganizationPayload): Promise<Organization> {
    const response = await apiClient.put<ApiResponse<Organization>>(`/admin/organizations/${uuid}`, payload);
    return response.data.data;
  },

  async activateOrganization(uuid: string): Promise<Organization> {
    const response = await apiClient.post<ApiResponse<Organization>>(`/admin/organizations/${uuid}/activate`);
    return response.data.data;
  },

  async suspendOrganization(uuid: string): Promise<Organization> {
    const response = await apiClient.post<ApiResponse<Organization>>(`/admin/organizations/${uuid}/suspend`);
    return response.data.data;
  },

  async verifyOrganization(uuid: string, payload: VerifyOrganizationPayload): Promise<Organization> {
    const response = await apiClient.post<ApiResponse<Organization>>(`/admin/organizations/${uuid}/verify`, payload);
    return response.data.data;
  },
};

export default organizationService;
