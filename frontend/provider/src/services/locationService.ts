import apiClient from './api';
import type { ApiResponse, PaginatedResponseData } from '../types/common';
import type { Location, LocationPayload, LocationFilterParams } from '../types/location';
import type { LocationMedia, MediaUploadPayload, MediaUpdatePayload } from '../types/media';

export const locationService = {
  /**
   * List paginated locations with optional search and filters
   */
  getLocations: async (params?: LocationFilterParams): Promise<PaginatedResponseData<Location>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponseData<Location>>>('/tenant/locations', {
      params,
    });
    return response.data.data;
  },

  /**
   * Get single location details by UUID
   */
  getLocation: async (uuid: string): Promise<Location> => {
    const response = await apiClient.get<ApiResponse<Location>>(`/tenant/locations/${uuid}`);
    return response.data.data;
  },

  /**
   * Create a new location for the active tenant
   */
  createLocation: async (payload: LocationPayload): Promise<Location> => {
    const response = await apiClient.post<ApiResponse<Location>>('/tenant/locations', payload);
    return response.data.data;
  },

  /**
   * Update an existing location by UUID
   */
  updateLocation: async (uuid: string, payload: LocationPayload): Promise<Location> => {
    const response = await apiClient.put<ApiResponse<Location>>(`/tenant/locations/${uuid}`, payload);
    return response.data.data;
  },

  /**
   * Soft delete a location by UUID
   */
  deleteLocation: async (uuid: string): Promise<void> => {
    await apiClient.delete(`/tenant/locations/${uuid}`);
  },

  /**
   * List all media assets for a location
   */
  getLocationMedia: async (locationUuid: string, mediaType?: string): Promise<LocationMedia[]> => {
    const response = await apiClient.get<ApiResponse<LocationMedia[]> | { data: LocationMedia[] }>(
      `/tenant/locations/${locationUuid}/media`,
      { params: mediaType ? { media_type: mediaType } : undefined }
    );
    // Handles both ApiResponse wrapped and AnonymousResourceCollection { data: [...] }
    return (response.data as any).data ?? [];
  },

  /**
   * Upload a new media asset for a location using multipart/form-data
   */
  uploadLocationMedia: async (locationUuid: string, payload: MediaUploadPayload): Promise<LocationMedia> => {
    const formData = new FormData();
    formData.append('file', payload.file);
    formData.append('media_type', payload.media_type);
    if (payload.alt_text) formData.append('alt_text', payload.alt_text);
    if (payload.caption) formData.append('caption', payload.caption);
    if (payload.is_primary !== undefined) formData.append('is_primary', payload.is_primary ? '1' : '0');

    const response = await apiClient.post<ApiResponse<LocationMedia> | { data: LocationMedia }>(
      `/tenant/locations/${locationUuid}/media`,
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
   * Update metadata, primary flag, or sort order for a media asset
   */
  updateLocationMedia: async (
    locationUuid: string,
    mediaUuid: string,
    payload: MediaUpdatePayload
  ): Promise<LocationMedia> => {
    const response = await apiClient.put<ApiResponse<LocationMedia> | { data: LocationMedia }>(
      `/tenant/locations/${locationUuid}/media/${mediaUuid}`,
      payload
    );
    return (response.data as any).data;
  },

  /**
   * Reorder media gallery order
   */
  reorderLocationMedia: async (locationUuid: string, mediaUuids: string[]): Promise<void> => {
    await apiClient.put(`/tenant/locations/${locationUuid}/media/reorder`, {
      media_uuids: mediaUuids,
    });
  },

  /**
   * Delete a location media asset
   */
  deleteLocationMedia: async (locationUuid: string, mediaUuid: string): Promise<void> => {
    await apiClient.delete(`/tenant/locations/${locationUuid}/media/${mediaUuid}`);
  },
};

export default locationService;
