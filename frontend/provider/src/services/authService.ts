import apiClient from './api';
import type { ApiResponse } from '../types/common';
import type { AuthResponseData, MeResponseData } from '../types/auth';

export interface LoginPayload {
  email: string;
  password: string;
  organization_id?: number | string;
  device_name?: string;
}

export interface RegisterPayload {
  company_name: string;
  contact_name: string;
  email: string;
  phone?: string;
  mobile?: string;
  password: string;
  password_confirmation: string;
  terms: boolean;
  subscription_plan_id?: number;
}

export const authService = {
  /**
   * Authenticate provider user and return Sanctum token and active memberships
   */
  login: async (payload: LoginPayload): Promise<AuthResponseData> => {
    const response = await apiClient.post<ApiResponse<AuthResponseData>>('/auth/provider/login', {
      ...payload,
      device_name: payload.device_name || 'provider-web',
    });
    return response.data.data;
  },

  /**
   * Register a new outdoor advertising provider company and owner account
   */
  register: async (payload: RegisterPayload): Promise<AuthResponseData> => {
    const response = await apiClient.post<ApiResponse<AuthResponseData>>('/auth/provider/register', {
      ...payload,
      device_name: 'provider-web',
    });
    return response.data.data;
  },

  /**
   * Fetch authenticated user details and active organization memberships
   */
  me: async (): Promise<MeResponseData> => {
    const response = await apiClient.get<ApiResponse<MeResponseData>>('/auth/me');
    return response.data.data;
  },

  /**
   * Terminate current session token
   */
  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      localStorage.removeItem('sodaars_provider_token');
      localStorage.removeItem('sodaars_active_org_id');
    }
  },
};

export default authService;
