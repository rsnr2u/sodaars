export type PlanStatus = 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';

export interface SubscriptionPlan {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  min_resources: number;
  max_resources?: number | null;
  monthly_price: number;
  annual_price?: number | null;
  currency: string;
  features?: string[] | Record<string, any> | null;
  status: PlanStatus | string;
  sort_order?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Subscription {
  id: number;
  organization_id: number;
  subscription_plan_id: number;
  plan?: SubscriptionPlan | null;
  status: 'ACTIVE' | 'TRIAL' | 'CANCELLED' | 'EXPIRED' | string;
  billing_cycle?: 'MONTHLY' | 'ANNUAL' | string;
  resource_limit: number;
  price: number;
  currency: string;
  starts_at?: string | null;
  ends_at?: string | null;
  trial_ends_at?: string | null;
  cancelled_at?: string | null;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface CreateSubscriptionPlanPayload {
  name: string;
  slug?: string;
  description?: string;
  min_resources: number;
  max_resources?: number | null;
  monthly_price: number;
  annual_price?: number | null;
  currency?: string;
  features?: string[];
  status?: PlanStatus | string;
  sort_order?: number;
}

export interface UpdateSubscriptionPlanPayload {
  name?: string;
  slug?: string;
  description?: string;
  min_resources?: number;
  max_resources?: number | null;
  monthly_price?: number;
  annual_price?: number | null;
  currency?: string;
  features?: string[];
  status?: PlanStatus | string;
  sort_order?: number;
}
