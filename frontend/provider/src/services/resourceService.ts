import apiClient from './api';
import type { ApiResponse, PaginatedResponseData } from '../types/common';
import type {
  AdvertisingResource,
  AdvertisingResourcePayload,
  AdvertisingResourceFilterParams,
  TenantSubscription,
} from '../types/resource';
import type {
  ResourceMedia,
  ResourceMediaUploadPayload,
  ResourceMediaUpdatePayload,
} from '../types/resourceMedia';

export const resourceService = {
  /**
   * List paginated advertising resources with optional search, filters, and sorting
   */
  getResources: async (
    params?: AdvertisingResourceFilterParams
  ): Promise<PaginatedResponseData<AdvertisingResource>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponseData<AdvertisingResource>>>(
      '/tenant/advertising-resources',
      { params }
    );
    return response.data.data;
  },

  /**
   * Get single advertising resource details by UUID
   */
  getResource: async (uuid: string): Promise<AdvertisingResource> => {
    const response = await apiClient.get<ApiResponse<AdvertisingResource>>(
      `/tenant/advertising-resources/${uuid}`
    );
    return response.data.data;
  },

  /**
   * Create a new advertising resource face for the active tenant
   */
  createResource: async (payload: AdvertisingResourcePayload): Promise<AdvertisingResource> => {
    const response = await apiClient.post<ApiResponse<AdvertisingResource>>(
      '/tenant/advertising-resources',
      payload
    );
    return response.data.data;
  },

  /**
   * Update an existing advertising resource by UUID
   */
  updateResource: async (
    uuid: string,
    payload: Partial<AdvertisingResourcePayload>
  ): Promise<AdvertisingResource> => {
    const response = await apiClient.put<ApiResponse<AdvertisingResource>>(
      `/tenant/advertising-resources/${uuid}`,
      payload
    );
    return response.data.data;
  },

  /**
   * Soft delete an advertising resource by UUID
   */
  deleteResource: async (uuid: string): Promise<void> => {
    await apiClient.delete(`/tenant/advertising-resources/${uuid}`);
  },

  /**
   * Get active subscription details and resource quota for current tenant
   */
  getSubscription: async (): Promise<TenantSubscription | null> => {
    try {
      const response = await apiClient.get<ApiResponse<TenantSubscription>>('/tenant/subscription');
      return response.data.data;
    } catch {
      return null;
    }
  },

  /**
   * List all media assets for an advertising resource
   */
  getResourceMedia: async (
    resourceUuid: string,
    mediaType?: string
  ): Promise<ResourceMedia[]> => {
    const response = await apiClient.get<ApiResponse<ResourceMedia[]> | { data: ResourceMedia[] }>(
      `/tenant/advertising-resources/${resourceUuid}/media`,
      { params: mediaType ? { media_type: mediaType } : undefined }
    );
    return (response.data as any).data ?? [];
  },

  /**
   * Upload a new media asset for an advertising resource using multipart/form-data
   */
  uploadResourceMedia: async (
    resourceUuid: string,
    payload: ResourceMediaUploadPayload
  ): Promise<ResourceMedia> => {
    const formData = new FormData();
    formData.append('file', payload.file);
    if (payload.media_type) formData.append('media_type', payload.media_type);
    if (payload.alt_text) formData.append('alt_text', payload.alt_text);
    if (payload.caption) formData.append('caption', payload.caption);
    if (payload.is_primary !== undefined) formData.append('is_primary', payload.is_primary ? '1' : '0');

    const response = await apiClient.post<ApiResponse<ResourceMedia> | { data: ResourceMedia }>(
      `/tenant/advertising-resources/${resourceUuid}/media`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return (response.data as any).data;
  },

  /**
   * Update metadata, primary flag, or sort order for a resource media asset
   */
  updateResourceMedia: async (
    resourceUuid: string,
    mediaUuid: string,
    payload: ResourceMediaUpdatePayload
  ): Promise<ResourceMedia> => {
    const response = await apiClient.put<ApiResponse<ResourceMedia> | { data: ResourceMedia }>(
      `/tenant/advertising-resources/${resourceUuid}/media/${mediaUuid}`,
      payload
    );
    return (response.data as any).data;
  },

  /**
   * Batch reorder gallery images for an advertising resource
   */
  reorderResourceMedia: async (
    resourceUuid: string,
    items: { uuid: string; sort_order: number }[]
  ): Promise<ResourceMedia[]> => {
    const response = await apiClient.put<ApiResponse<ResourceMedia[]>>(
      `/tenant/advertising-resources/${resourceUuid}/media/reorder`,
      { items }
    );
    return response.data.data;
  },

  /**
   * Soft delete a resource media asset
   */
  deleteResourceMedia: async (resourceUuid: string, mediaUuid: string): Promise<void> => {
    await apiClient.delete(`/tenant/advertising-resources/${resourceUuid}/media/${mediaUuid}`);
  },
};

export default resourceService;
