import apiClient from './api';
import type { ApiResponse } from '../types/common';
import type { Subscription, SubscriptionPlan } from '../types/subscription';

export const subscriptionService = {
  /**
   * Get active subscription details for the current tenant.
   */
  getActiveSubscription: async (): Promise<Subscription> => {
    const response = await apiClient.get<ApiResponse<Subscription>>('/tenant/subscription');
    return response.data.data;
  },

  /**
   * List all active subscription plans available on the platform.
   * Public / Authenticated route.
   */
  getSubscriptionPlans: async (): Promise<SubscriptionPlan[]> => {
    const response = await apiClient.get<ApiResponse<SubscriptionPlan[]>>('/subscription-plans');
    return response.data.data;
  },
};

export default subscriptionService;
