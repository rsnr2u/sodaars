/**
 * Subscription and Plan Types
 * Matches Stage 4 SubscriptionResource and SubscriptionPlanResource contracts.
 * Non-commerce: Informational & Quota management only.
 */

export interface SubscriptionPlan {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  min_resources: number;
  max_resources: number;
  monthly_price: number;
  annual_price?: number | null;
  currency: string;
  features?: string[] | null;
  status: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED' | string;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface Subscription {
  id: number;
  organization_id: number;
  subscription_plan_id: number;
  plan?: SubscriptionPlan | null;
  status: 'ACTIVE' | 'TRIALING' | 'PAST_DUE' | 'CANCELLED' | 'EXPIRED' | string;
  billing_cycle: 'MONTHLY' | 'ANNUAL' | string;
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
