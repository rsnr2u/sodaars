export type BookingSource = 'Marketplace' | 'Admin' | 'Provider';

export const APPROVED_BOOKING_SOURCES: BookingSource[] = [
  'Marketplace',
  'Admin',
  'Provider',
];

export interface BookingSourceMeta {
  source: BookingSource;
  label: string;
  badge: 'MARKETPLACE' | 'ADMIN' | 'PROVIDER';
  description: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
}

export const BOOKING_SOURCE_CONFIG: Record<BookingSource, BookingSourceMeta> = {
  Marketplace: {
    source: 'Marketplace',
    label: 'Marketplace',
    badge: 'MARKETPLACE',
    description: 'Booking originating through the SODAARS Marketplace.',
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-800',
    badgeBorder: 'border-amber-200',
  },
  Admin: {
    source: 'Admin',
    label: 'Admin',
    badge: 'ADMIN',
    description: 'Booking created or managed through SODAARS administration.',
    badgeBg: 'bg-stone-100',
    badgeText: 'text-stone-800',
    badgeBorder: 'border-stone-300',
  },
  Provider: {
    source: 'Provider',
    label: 'Provider',
    badge: 'PROVIDER',
    description: 'Booking created or managed directly by the provider.',
    badgeBg: 'bg-orange-50',
    badgeText: 'text-[#EA580C]',
    badgeBorder: 'border-orange-200',
  },
};

export type PrimaryBookingStatus =
  | 'NEW'
  | 'UNDER REVIEW'
  | 'PROVIDER CONFIRMATION'
  | 'CUSTOMER CONFIRMATION'
  | 'PAYMENT'
  | 'CONFIRMED'
  | 'ACTIVE'
  | 'COMPLETED';

export type ExceptionBookingStatus =
  | 'CANCELLED'
  | 'DECLINED'
  | 'EXPIRED'
  | 'REFUNDED';

export type BookingStatus = PrimaryBookingStatus | ExceptionBookingStatus;

export interface BookingStatusMeta {
  status: BookingStatus;
  label: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  indicatorBg: string;
  isException?: boolean;
}

export const BOOKING_STATUS_CONFIG: Record<BookingStatus, BookingStatusMeta> = {
  NEW: {
    status: 'NEW',
    label: 'New',
    badgeBg: 'bg-stone-100',
    badgeText: 'text-stone-700',
    badgeBorder: 'border-stone-200',
    indicatorBg: 'bg-stone-400',
  },
  'UNDER REVIEW': {
    status: 'UNDER REVIEW',
    label: 'Under Review',
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-800',
    badgeBorder: 'border-amber-200',
    indicatorBg: 'bg-amber-500',
  },
  'PROVIDER CONFIRMATION': {
    status: 'PROVIDER CONFIRMATION',
    label: 'Provider Confirmation',
    badgeBg: 'bg-orange-50',
    badgeText: 'text-[#EA580C]',
    badgeBorder: 'border-orange-200',
    indicatorBg: 'bg-[#EA580C]',
  },
  'CUSTOMER CONFIRMATION': {
    status: 'CUSTOMER CONFIRMATION',
    label: 'Customer Confirmation',
    badgeBg: 'bg-amber-50/80',
    badgeText: 'text-amber-900',
    badgeBorder: 'border-amber-300',
    indicatorBg: 'bg-amber-600',
  },
  PAYMENT: {
    status: 'PAYMENT',
    label: 'Payment',
    badgeBg: 'bg-stone-100',
    badgeText: 'text-stone-800',
    badgeBorder: 'border-stone-300',
    indicatorBg: 'bg-stone-500',
  },
  CONFIRMED: {
    status: 'CONFIRMED',
    label: 'Confirmed',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-800',
    badgeBorder: 'border-emerald-200',
    indicatorBg: 'bg-emerald-500',
  },
  ACTIVE: {
    status: 'ACTIVE',
    label: 'Active',
    badgeBg: 'bg-emerald-100/70',
    badgeText: 'text-emerald-900',
    badgeBorder: 'border-emerald-300',
    indicatorBg: 'bg-emerald-600',
  },
  COMPLETED: {
    status: 'COMPLETED',
    label: 'Completed',
    badgeBg: 'bg-stone-50',
    badgeText: 'text-stone-600',
    badgeBorder: 'border-stone-200',
    indicatorBg: 'bg-stone-400',
  },
  CANCELLED: {
    status: 'CANCELLED',
    label: 'Cancelled',
    badgeBg: 'bg-stone-100',
    badgeText: 'text-stone-500',
    badgeBorder: 'border-stone-200',
    indicatorBg: 'bg-stone-400',
    isException: true,
  },
  DECLINED: {
    status: 'DECLINED',
    label: 'Declined',
    badgeBg: 'bg-rose-50',
    badgeText: 'text-rose-700',
    badgeBorder: 'border-rose-200',
    indicatorBg: 'bg-rose-500',
    isException: true,
  },
  EXPIRED: {
    status: 'EXPIRED',
    label: 'Expired',
    badgeBg: 'bg-stone-100',
    badgeText: 'text-stone-500',
    badgeBorder: 'border-stone-200',
    indicatorBg: 'bg-stone-400',
    isException: true,
  },
  REFUNDED: {
    status: 'REFUNDED',
    label: 'Refunded',
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-700',
    badgeBorder: 'border-amber-200',
    indicatorBg: 'bg-amber-500',
    isException: true,
  },
};

export type BookingPipelineTab =
  | 'All'
  | 'Under Review'
  | 'Confirmed'
  | 'Active'
  | 'Completed'
  | 'Cancelled';

export const PIPELINE_TABS: BookingPipelineTab[] = [
  'All',
  'Under Review',
  'Confirmed',
  'Active',
  'Completed',
  'Cancelled',
];

export interface BookingPricing {
  regularCustomerPrice?: string;
  sodaarsPrice?: string; // SODAARS Price / Provider Marketplace Net Price
  agreedMarkupAmount?: string;
  customerAdjustmentAmount?: string;
  finalInvoicedAmount?: string;
}

export interface BookingRecord {
  id: string; // Booking ID / Code e.g. "BKG-2026-001"
  customerId?: string; // Connected Customer ID e.g. "CUST-2026-001"
  customerName: string;
  companyName: string;
  contactEmail?: string;
  contactPhone?: string;
  resourceId: string;
  resourceName: string;
  resourceType: string;
  location: string;
  startDate: string;
  endDate: string;
  source: BookingSource;
  status: BookingStatus;
  pricing: BookingPricing;
  notes?: string;
  declineReason?: string;
  createdAt?: string;
  paymentStatus?: 'UNPAID' | 'PARTIALLY_PAID' | 'PAID' | 'ESCROW_LOCKED';
  campaignId?: string;
  campaignStatus?: 'Planned' | 'In Execution' | 'Proof Submitted' | 'Completed';
  quotationId?: string;
  invoiceId?: string;
}
