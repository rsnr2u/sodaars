export type CustomerType =
  | 'Advertising Agency'
  | 'Direct Enterprise Buyer'
  | 'Local Business'
  | 'Brand / Corporate Client';

export const APPROVED_CUSTOMER_TYPES: CustomerType[] = [
  'Advertising Agency',
  'Direct Enterprise Buyer',
  'Local Business',
  'Brand / Corporate Client',
];

export interface CustomerTypeMeta {
  type: CustomerType;
  label: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  description: string;
}

export const CUSTOMER_TYPE_CONFIG: Record<CustomerType, CustomerTypeMeta> = {
  'Advertising Agency': {
    type: 'Advertising Agency',
    label: 'Advertising Agency',
    badgeBg: 'bg-orange-50',
    badgeText: 'text-[#EA580C]',
    badgeBorder: 'border-orange-200',
    description: 'Media planning and buying agencies booking on behalf of multiple client brands.',
  },
  'Direct Enterprise Buyer': {
    type: 'Direct Enterprise Buyer',
    label: 'Direct Enterprise Buyer',
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-800',
    badgeBorder: 'border-amber-200',
    description: 'National or multi-regional corporations contracting directly with the asset owner.',
  },
  'Local Business': {
    type: 'Local Business',
    label: 'Local Business',
    badgeBg: 'bg-stone-100',
    badgeText: 'text-stone-800',
    badgeBorder: 'border-stone-300',
    description: 'Regional retail outlets, promoters, and local merchants.',
  },
  'Brand / Corporate Client': {
    type: 'Brand / Corporate Client',
    label: 'Brand / Corporate Client',
    badgeBg: 'bg-amber-50/80',
    badgeText: 'text-amber-900',
    badgeBorder: 'border-amber-300',
    description: 'Direct consumer and B2B brand marketing divisions.',
  },
};

export type CustomerStatus = 'Active' | 'Inactive' | 'Blocked';

export const APPROVED_CUSTOMER_STATUSES: CustomerStatus[] = [
  'Active',
  'Inactive',
  'Blocked',
];

export interface CustomerStatusMeta {
  status: CustomerStatus;
  label: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
}

export const CUSTOMER_STATUS_CONFIG: Record<CustomerStatus, CustomerStatusMeta> = {
  Active: {
    status: 'Active',
    label: 'Active',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-800',
    badgeBorder: 'border-emerald-200',
  },
  Inactive: {
    status: 'Inactive',
    label: 'Inactive',
    badgeBg: 'bg-stone-100',
    badgeText: 'text-stone-700',
    badgeBorder: 'border-stone-200',
  },
  Blocked: {
    status: 'Blocked',
    label: 'Blocked',
    badgeBg: 'bg-rose-50',
    badgeText: 'text-rose-700',
    badgeBorder: 'border-rose-200',
  },
};

export interface CustomerRecord {
  id: string; // e.g. "CUST-2026-001"
  customerType: CustomerType;
  companyName: string;
  brandName?: string;
  contactPerson: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  gstin?: string;
  pan?: string;
  billingAddress?: string;
  city?: string;
  state?: string;
  pincode?: string;
  country: string; // Defaults to "India"
  status: CustomerStatus;
  notes?: string;
  createdAt?: string;
}
