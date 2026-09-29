import apiClient from './api';
import type { ApiResponse } from '../types/common';
import type {
  CreateSubscriptionPlanPayload,
  SubscriptionPlan,
  UpdateSubscriptionPlanPayload,
} from '../types/subscription';

export const subscriptionService = {
  async getPlans(): Promise<SubscriptionPlan[]> {
    const response = await apiClient.get<ApiResponse<SubscriptionPlan[]>>('/admin/subscription-plans');
    return response.data.data;
  },

  async createPlan(payload: CreateSubscriptionPlanPayload): Promise<SubscriptionPlan> {
    const response = await apiClient.post<ApiResponse<SubscriptionPlan>>('/admin/subscription-plans', payload);
    return response.data.data;
  },

  async updatePlan(id: number, payload: UpdateSubscriptionPlanPayload): Promise<SubscriptionPlan> {
    const response = await apiClient.put<ApiResponse<SubscriptionPlan>>(`/admin/subscription-plans/${id}`, payload);
    return response.data.data;
  },
};

export default subscriptionService;
