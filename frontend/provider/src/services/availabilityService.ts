import apiClient from './api';
import type { ApiResponse, PaginatedResponseData } from '../types/common';
import type {
  MonthlyCalendarResponse,
  AvailabilityCheckPayload,
  AvailabilityCheckResult,
  ResourceSchedule,
  ResourceSchedulePayload,
  ResourceScheduleFilterParams,
} from '../types/availability';

export const availabilityService = {
  /**
   * Retrieve monthly calendar matrix for an advertising resource face
   */
  getMonthlyCalendar: async (
    resourceUuid: string,
    year?: number,
    month?: number
  ): Promise<MonthlyCalendarResponse> => {
    const response = await apiClient.get<ApiResponse<MonthlyCalendarResponse>>(
      `/tenant/advertising-resources/${resourceUuid}/calendar`,
      {
        params: { year, month },
      }
    );
    return response.data.data;
  },

  /**
   * Check availability and slot capacity for a requested date range
   */
  checkAvailability: async (
    payload: AvailabilityCheckPayload
  ): Promise<AvailabilityCheckResult> => {
    const response = await apiClient.post<ApiResponse<AvailabilityCheckResult>>(
      '/tenant/availability/check',
      payload
    );
    return response.data.data;
  },

  /**
   * List paginated resource schedules with filtering
   */
  getSchedules: async (
    params?: ResourceScheduleFilterParams
  ): Promise<PaginatedResponseData<ResourceSchedule>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponseData<ResourceSchedule>>>(
      '/tenant/resource-schedules',
      { params }
    );
    return response.data.data;
  },

  /**
   * Get single schedule block details by UUID
   */
  getSchedule: async (uuid: string): Promise<ResourceSchedule> => {
    const response = await apiClient.get<ApiResponse<ResourceSchedule>>(
      `/tenant/resource-schedules/${uuid}`
    );
    return response.data.data;
  },

  /**
   * Create a new inventory schedule block or reservation
   */
  createSchedule: async (
    payload: ResourceSchedulePayload
  ): Promise<ResourceSchedule> => {
    const response = await apiClient.post<ApiResponse<ResourceSchedule>>(
      '/tenant/resource-schedules',
      payload
    );
    return response.data.data;
  },

  /**
   * Update an existing schedule block
   */
  updateSchedule: async (
    uuid: string,
    payload: Partial<ResourceSchedulePayload>
  ): Promise<ResourceSchedule> => {
    const response = await apiClient.put<ApiResponse<ResourceSchedule>>(
      `/tenant/resource-schedules/${uuid}`,
      payload
    );
    return response.data.data;
  },

  /**
   * Delete / remove a schedule block
   */
  deleteSchedule: async (uuid: string): Promise<void> => {
    await apiClient.delete(`/tenant/resource-schedules/${uuid}`);
  },

  /**
   * Release a schedule block or hold early
   */
  releaseSchedule: async (uuid: string, reason?: string): Promise<ResourceSchedule> => {
    const response = await apiClient.post<ApiResponse<ResourceSchedule>>(
      `/tenant/resource-schedules/${uuid}/release`,
      { reason }
    );
    return response.data.data;
  },

  /**
   * Extend a tentative hold's expiration date
   */
  extendHold: async (
    uuid: string,
    hold_expires_at: string
  ): Promise<ResourceSchedule> => {
    const response = await apiClient.post<ApiResponse<ResourceSchedule>>(
      `/tenant/resource-schedules/${uuid}/extend`,
      { hold_expires_at }
    );
    return response.data.data;
  },
};

export default availabilityService;
