export type SubscriptionTierType = 'tier_1' | 'tier_2' | 'enterprise';

export interface SubscriptionPlan {
  id: SubscriptionTierType;
  name: string;
  badge: string;
  assetRange: string;
  monthlyFee: number;
  monthlyTax: number;
  totalMonthly: number;
  capacityMax: number;
  description: string;
  features: string[];
  isCurrent: boolean;
}

export interface SubscriptionInvoice {
  id: string;
  invoiceNumber: string;
  invoiceDate: string;
  billingPeriod: string;
  planName: string;
  baseAmount: number;
  taxAmount: number;
  totalAmount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
  paymentMethod: string;
}

export interface SubscriptionQuotaData {
  totalRegistered: number;
  activeCount: number;
  inactiveCount: number;
  tierLimit: number;
  remainingSlots: number;
  percentageUsed: number;
  tierName: string;
  renewalDate: string;
  billingStatus: 'Active' | 'Past Due';
}

export const CANONICAL_SUBSCRIPTION_DATA: SubscriptionQuotaData = {
  totalRegistered: 70,
  activeCount: 45,
  inactiveCount: 25,
  tierLimit: 100,
  remainingSlots: 30,
  percentageUsed: 70,
  tierName: 'Tier 2 (51–100 Registered Resources)',
  renewalDate: '2026-11-01',
  billingStatus: 'Active',
};

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'tier_1',
    name: 'Tier 1',
    badge: '1–50 Displays',
    assetRange: '1 to 50 Registered Assets',
    monthlyFee: 4999,
    monthlyTax: 899.82,
    totalMonthly: 5898.82,
    capacityMax: 50,
    description: 'Designed for boutique and emerging regional media asset concessionaires.',
    features: [
      'Up to 50 total registered static media displays',
      'All 5 core provider modules included',
      'Unified calendar & hold availability engine',
      'Direct customer booking & proposal generator',
      'Zero setup or data-migration charges',
      '0% SaaS booking transaction commissions',
    ],
    isCurrent: false,
  },
  {
    id: 'tier_2',
    name: 'Tier 2',
    badge: '51–100 Displays',
    assetRange: '51 to 100 Registered Assets',
    monthlyFee: 8999,
    monthlyTax: 1619.82,
    totalMonthly: 10618.82,
    capacityMax: 100,
    description: 'Standard plan for established multi-format outdoor media networks.',
    features: [
      'Up to 100 total registered static media displays',
      'All 5 core provider modules included',
      'Unified calendar & hold availability engine',
      'Direct customer booking & proposal generator',
      'Mounting work order & POP proof verification',
      'Marketplace syndication with 0% extra fee',
      'Multi-user team roster & role permissions',
    ],
    isCurrent: true,
  },
  {
    id: 'tier_3' as unknown as SubscriptionTierType,
    name: 'Enterprise Tier',
    badge: '>100 Displays',
    assetRange: '101+ Registered Assets',
    monthlyFee: 0,
    monthlyTax: 0,
    totalMonthly: 0,
    capacityMax: 9999,
    description: 'Custom corporate arrangement for statewide and national concession portfolios.',
    features: [
      'Unlimited registered static advertising displays',
      'All core solutions + dedicated multi-tenant clusters',
      'Custom ERP & accounting webhook integrations',
      'Dedicated SLA, priority support, and migration support',
      'High-volume mounting team work order pipelines',
    ],
    isCurrent: false,
  },
];

export const SAMPLE_SUBSCRIPTION_INVOICES: SubscriptionInvoice[] = [
  {
    id: 'inv_10_2026',
    invoiceNumber: 'INV-2026-10-0089',
    invoiceDate: '2026-10-01',
    billingPeriod: '01 Oct 2026 – 31 Oct 2026',
    planName: 'SODAARS Provider SaaS — Tier 2 (51–100 Displays)',
    baseAmount: 8999,
    taxAmount: 1619.82,
    totalAmount: 10618.82,
    status: 'Paid',
    paymentMethod: 'Auto-Debit (NetBanking HDFC ••••4192)',
  },
  {
    id: 'inv_09_2026',
    invoiceNumber: 'INV-2026-09-0074',
    invoiceDate: '2026-09-01',
    billingPeriod: '01 Sep 2026 – 30 Sep 2026',
    planName: 'SODAARS Provider SaaS — Tier 2 (51–100 Displays)',
    baseAmount: 8999,
    taxAmount: 1619.82,
    totalAmount: 10618.82,
    status: 'Paid',
    paymentMethod: 'Auto-Debit (NetBanking HDFC ••••4192)',
  },
  {
    id: 'inv_08_2026',
    invoiceNumber: 'INV-2026-08-0056',
    invoiceDate: '2026-08-01',
    billingPeriod: '01 Aug 2026 – 31 Aug 2026',
    planName: 'SODAARS Provider SaaS — Tier 2 (51–100 Displays)',
    baseAmount: 8999,
    taxAmount: 1619.82,
    totalAmount: 10618.82,
    status: 'Paid',
    paymentMethod: 'Auto-Debit (NetBanking HDFC ••••4192)',
  },
  {
    id: 'inv_07_2026',
    invoiceNumber: 'INV-2026-07-0038',
    invoiceDate: '2026-07-01',
    billingPeriod: '01 Jul 2026 – 31 Jul 2026',
    planName: 'SODAARS Provider SaaS — Tier 1 (1–50 Displays)',
    baseAmount: 4999,
    taxAmount: 899.82,
    totalAmount: 5898.82,
    status: 'Paid',
    paymentMethod: 'Auto-Debit (NetBanking HDFC ••••4192)',
  },
];
