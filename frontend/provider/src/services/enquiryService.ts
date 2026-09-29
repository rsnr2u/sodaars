import apiClient from './api';
import type { ApiResponse, PaginatedResponseData } from '../types/common';
import type {
  Enquiry,
  EnquiryPayload,
  EnquiryListParams,
  EnquiryStatus,
  EnquiryAvailabilityResponse,
} from '../types/enquiry';
import type { ResourceSchedule } from '../types/availability';

export const enquiryService = {
  /**
   * List paginated enquiries for the active organization with filters.
   */
  getEnquiries: async (params?: EnquiryListParams): Promise<PaginatedResponseData<Enquiry>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponseData<Enquiry>>>(
      '/tenant/enquiries',
      { params }
    );
    return response.data.data;
  },

  /**
   * Retrieve single enquiry details with items, customer, and holds.
   */
  getEnquiry: async (uuid: string): Promise<Enquiry> => {
    const response = await apiClient.get<ApiResponse<Enquiry>>(`/tenant/enquiries/${uuid}`);
    return response.data.data;
  },

  /**
   * Create a new campaign enquiry with multi-item resource requests.
   */
  createEnquiry: async (payload: EnquiryPayload): Promise<Enquiry> => {
    const response = await apiClient.post<ApiResponse<Enquiry>>('/tenant/enquiries', payload);
    return response.data.data;
  },

  /**
   * Update an existing enquiry and its requested inventory items.
   */
  updateEnquiry: async (uuid: string, payload: EnquiryPayload): Promise<Enquiry> => {
    const response = await apiClient.put<ApiResponse<Enquiry>>(
      `/tenant/enquiries/${uuid}`,
      payload
    );
    return response.data.data;
  },

  /**
   * Delete an enquiry (soft delete; automatically releases attached holds).
   */
  deleteEnquiry: async (uuid: string): Promise<void> => {
    await apiClient.delete(`/tenant/enquiries/${uuid}`);
  },

  /**
   * Transition enquiry lifecycle status enforcing backend state machine.
   */
  transitionStatus: async (
    uuid: string,
    status: EnquiryStatus,
    lost_reason?: string,
    notes?: string
  ): Promise<Enquiry> => {
    const response = await apiClient.post<ApiResponse<Enquiry>>(
      `/tenant/enquiries/${uuid}/status`,
      {
        status,
        lost_reason,
        notes,
      }
    );
    return response.data.data;
  },

  /**
   * Evaluate live inventory availability for all items in this enquiry.
   */
  checkAvailability: async (uuid: string): Promise<EnquiryAvailabilityResponse> => {
    const response = await apiClient.post<ApiResponse<EnquiryAvailabilityResponse>>(
      `/tenant/enquiries/${uuid}/check-availability`
    );
    return response.data.data;
  },

  /**
   * Place an authoritative Stage 7 tentative hold on an enquiry item.
   * Owner and Manager only.
   */
  placeHold: async (
    enquiryUuid: string,
    itemUuid: string,
    payload?: { hold_duration_hours?: number; notes?: string }
  ): Promise<ResourceSchedule> => {
    const response = await apiClient.post<ApiResponse<ResourceSchedule>>(
      `/tenant/enquiries/${enquiryUuid}/items/${itemUuid}/hold`,
      payload || {}
    );
    return response.data.data;
  },
};

export default enquiryService;
