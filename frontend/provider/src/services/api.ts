import axios, { AxiosError } from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
});

// Event listener mechanism for 401 unauthorized handling across React context
type UnauthorizedCallback = () => void;
let unauthorizedHandler: UnauthorizedCallback | null = null;

export const setUnauthorizedHandler = (handler: UnauthorizedCallback) => {
  unauthorizedHandler = handler;
};

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('sodaars_provider_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  const orgId = localStorage.getItem('sodaars_active_org_id');
  if (orgId) {
    config.headers['X-Organization-Id'] = orgId;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<any>) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('sodaars_provider_token');
      localStorage.removeItem('sodaars_active_org_id');
      if (unauthorizedHandler) {
        unauthorizedHandler();
      }
    }
    return Promise.reject(error);
  }
);

export const getApiErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    if (data?.message) return data.message;
    if (data?.error) return data.error;
    if (error.message) return error.message;
  }
  return 'An unexpected error occurred. Please try again.';
};

export const getApiFieldErrors = (error: unknown): Record<string, string[]> | undefined => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.errors;
  }
  return undefined;
};

export default apiClient;
