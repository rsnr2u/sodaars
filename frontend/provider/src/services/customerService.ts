import apiClient from './api';
import type { ApiResponse, PaginatedResponseData } from '../types/common';
import type { Customer, CustomerPayload, CustomerListParams } from '../types/customer';

export const customerService = {
  /**
   * List paginated customers for the active organization with filters.
   */
  getCustomers: async (params?: CustomerListParams): Promise<PaginatedResponseData<Customer>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponseData<Customer>>>(
      '/tenant/customers',
      { params }
    );
    return response.data.data;
  },

  /**
   * Retrieve single customer details by UUID.
   */
  getCustomer: async (uuid: string): Promise<Customer> => {
    const response = await apiClient.get<ApiResponse<Customer>>(`/tenant/customers/${uuid}`);
    return response.data.data;
  },

  /**
   * Create a new customer in the active organization.
   */
  createCustomer: async (payload: CustomerPayload): Promise<Customer> => {
    const response = await apiClient.post<ApiResponse<Customer>>('/tenant/customers', payload);
    return response.data.data;
  },

  /**
   * Update an existing customer's business details and contact credentials.
   */
  updateCustomer: async (uuid: string, payload: CustomerPayload): Promise<Customer> => {
    const response = await apiClient.put<ApiResponse<Customer>>(
      `/tenant/customers/${uuid}`,
      payload
    );
    return response.data.data;
  },

  /**
   * Soft delete a customer (Owner and Manager only).
   */
  deleteCustomer: async (uuid: string): Promise<void> => {
    await apiClient.delete(`/tenant/customers/${uuid}`);
  },
};

export default customerService;
