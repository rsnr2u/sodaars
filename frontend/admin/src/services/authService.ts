import apiClient from './api';
import type { ApiResponse } from '../types/common';
import type { AdminAuthData, AdminLoginCredentials, AuthMeData } from '../types/auth';

export const authService = {
  async login(credentials: AdminLoginCredentials): Promise<AdminAuthData> {
    const response = await apiClient.post<ApiResponse<AdminAuthData>>('/auth/admin/login', {
      ...credentials,
      device_name: credentials.device_name || 'admin-portal-web',
    });
    const authData = response.data.data;
    if (authData?.token) {
      localStorage.setItem('sodaars_admin_token', authData.token);
    }
    return authData;
  },

  async me(): Promise<AuthMeData> {
    const response = await apiClient.get<ApiResponse<AuthMeData>>('/auth/me');
    return response.data.data;
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post<ApiResponse<null>>('/auth/logout');
    } finally {
      localStorage.removeItem('sodaars_admin_token');
    }
  },

  getToken(): string | null {
    return localStorage.getItem('sodaars_admin_token');
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('sodaars_admin_token');
  },
};

export default authService;
