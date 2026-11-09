export type SettingsTabId =
  | 'general'
  | 'operations'
  | 'finance'
  | 'subscription'
  | 'team'
  | 'marketplace'
  | 'security'
  | 'notifications';

export interface ProviderSystemSettings {
  // 1. General & Corporate Profile + Branding
  legalEntityName: string;
  brandTradeName: string;
  cinNumber: string;
  incorporationDate: string;
  corporateEmail: string;
  corporatePhone: string;
  websiteUrl: string;
  registeredAddress: string;
  city: string;
  state: string;
  pincode: string;
  dispatchYardAddress: string;
  defaultTimezone: string;
  defaultCurrency: string;
  // Branding & Signatory
  companyLogoUrl: string;
  brandIconUrl: string;
  primarySignatoryName: string;
  primarySignatoryDesignation: string;
  primarySignatoryPhone: string;
  primarySignatoryEmail: string;

  // 2. Operational & Mounting Policies
  holdDurationHours: number; // 24 | 48 | 72
  autoReleaseExpiredHolds: boolean;
  holdGracePeriodHours: number;
  minimumBookingDays: number;
  mountingLeadTimeDays: number;
  changeoverBufferDays: number;
  requireGpsTimestampPhoto: boolean;
  requireNightIlluminatedPhoto: boolean;
  defaultCalendarView: 'monthly' | 'gantt';
  weekStartDay: 'monday' | 'sunday';
  dateFormat: 'DD/MM/YYYY' | 'YYYY-MM-DD';

  // 3. Billing, GST, Statutory & Banking Details
  gstin: string;
  pan: string;
  hsnSacCode: string;
  bankBeneficiary: string;
  bankName: string;
  bankAccountNumber: string;
  bankIfsc: string;
  bankBranch: string;
  upiId: string;
  bookingPrefix: string;
  proposalPrefix: string;
  invoicePrefix: string;
  proposalValidityDays: number;
  defaultCreditTerms: string;
  defaultGstRate: number; // e.g. 18
  // Statutory compliance & digital stamp
  tanNumber: string;
  msmeNumber: string;
  reverseChargeMechanism: boolean;
  tdsRate: number;
  authorizedSignatureUrl: string;
  companyStampUrl: string;
  autoAffixStampSignature: boolean;
  invoiceTermsAndConditions: string;

  // Production, Mounting & Creative Rate Cards (Default Pricing)
  defaultPrintingRatePerSqFt: number; // e.g. 12 (₹/sq.ft)
  defaultMountingRatePerSqFt: number; // e.g. 5 (₹/sq.ft)
  defaultCreativeDesignFee: number; // e.g. 3000 (₹ per campaign concept)
  defaultCreativeDiscountMode: 'COMPLIMENTARY_WAIVER' | 'BILLABLE' | 'CLIENT_PROVIDED';
  maxCommercialDiscountPercent: number; // e.g. 20% max discount

  // 4. Subscription & Platform Capacity Quotas
  subscriptionPlan: 'Growth' | 'Professional' | 'Enterprise';
  assetQuotaLimit: number;
  assetQuotaUsed: number;
  subscriptionRenewalDate: string;
  billingCycle: 'Annual' | 'Monthly';

  // 5. Team & Staff Access
  defaultNewUserRole: 'Operations' | 'Rigger' | 'Finance' | 'Sales';
  enforceMfa: boolean;
  sessionTimeoutHours: number;

  // 6. Marketplace & Commercial Terms
  enableMarketplaceDiscovery: boolean;
  bookingAcceptanceMode: 'AUTO_ACCEPT' | 'MANUAL_APPROVAL';
  maxAgencyDiscountPercent: number;
  standardAgencyCommissionPercent: number;
  showPublicRateCards: boolean;

  // 7. Security & Authentication
  twoFactorEnabled: boolean;
  twoFactorMethod: 'app' | 'sms' | 'email';
  sessionTimeoutMinutes: number;
  apiKeyMasked: string;
  webhookUrl: string;
  ipWhitelist: string;

  // 8. Automated Alerts & Multi-Channel Notifications
  whatsappAlertsEnabled: boolean;
  whatsappNumber: string;
  smsAlertsEnabled: boolean;
  smsSenderId: string;
  notificationEmail: string;
  notifyBookingRequest: boolean;
  notifyHoldExpirationWarning: boolean;
  notifyFlightStartSoon: boolean;
  notifyProofUploads: boolean;
  notifyPaymentReceived: boolean;
  notifyDailyMorningBriefing: boolean;

  // Backwards compatibility
  notifyMarketplaceInquiries?: boolean;
  notifyBookingStatusChanges?: boolean;
}

export type OperationalSettings = ProviderSystemSettings;

export const DEFAULT_SYSTEM_SETTINGS: ProviderSystemSettings = {
  // 1. General & Corporate Profile + Branding
  legalEntityName: 'MD Arts Outdoor Media Network Pvt Ltd',
  brandTradeName: 'MD ARTS',
  cinNumber: 'U74999MH2021PTC368412',
  incorporationDate: '2021-04-15',
  corporateEmail: 'contact@mdarts.com',
  corporatePhone: '+91 98201 12345',
  websiteUrl: 'https://mdarts.example.com',
  registeredAddress: 'Unit 402, 4th Floor, Times Tower, Kamala Mills Compound, Lower Parel',
  city: 'Mumbai',
  state: 'Maharashtra',
  pincode: '400013',
  dispatchYardAddress: 'Plot 18-B, TTC Industrial Area, MIDC Pawane, Turbhe, Navi Mumbai 400705',
  defaultTimezone: 'Asia/Kolkata (IST +05:30)',
  defaultCurrency: 'INR (₹)',
  companyLogoUrl: '',
  brandIconUrl: '',
  primarySignatoryName: 'Rajesh V. Merchant',
  primarySignatoryDesignation: 'Managing Director & Authorized Signatory',
  primarySignatoryPhone: '+91 98201 12345',
  primarySignatoryEmail: 'signatory@mdarts.com',

  // 2. Operational & Mounting Policies
  holdDurationHours: 48,
  autoReleaseExpiredHolds: true,
  holdGracePeriodHours: 12,
  minimumBookingDays: 15,
  mountingLeadTimeDays: 3,
  changeoverBufferDays: 1,
  requireGpsTimestampPhoto: true,
  requireNightIlluminatedPhoto: true,
  defaultCalendarView: 'monthly',
  weekStartDay: 'monday',
  dateFormat: 'DD/MM/YYYY',

  // 3. Billing, GST, Statutory & Banking Details
  gstin: '27AABCA1234F1Z5',
  pan: 'AABCA1234F',
  hsnSacCode: '998361 (Advertising Services)',
  bankBeneficiary: 'MD Arts Outdoor Media Network Pvt Ltd',
  bankName: 'HDFC Bank Ltd',
  bankAccountNumber: '50200048912384',
  bankIfsc: 'HDFC0000060',
  bankBranch: 'Fort Branch, Mumbai',
  upiId: 'mdarts@hdfcbank',
  bookingPrefix: 'MD-BK-',
  proposalPrefix: 'MD-EST-',
  invoicePrefix: 'MD-INV-2026-',
  proposalValidityDays: 14,
  defaultCreditTerms: '50% Advance, 50% Post-Mounting Proof',
  defaultGstRate: 18,
  tanNumber: 'MUMA01234E',
  msmeNumber: 'UDYAM-MH-03-0098412',
  reverseChargeMechanism: false,
  tdsRate: 2,
  authorizedSignatureUrl: '',
  companyStampUrl: '',
  autoAffixStampSignature: true,
  invoiceTermsAndConditions: `1. All disputes are subject to the exclusive jurisdiction of the competent courts in Mumbai.\n2. Invoices are strictly payable according to agreed credit terms. Delayed payments attract interest @ 18% per annum.\n3. Mounting proof of performance (POP) with GPS coordinates and verified timestamp will be submitted within 24 hours of flight commencement.\n4. Force majeure conditions apply in instances of civic authority notices, extreme meteorological phenomena, or statutory municipal directives.`,
  defaultPrintingRatePerSqFt: 12,
  defaultMountingRatePerSqFt: 5,
  defaultCreativeDesignFee: 3000,
  defaultCreativeDiscountMode: 'COMPLIMENTARY_WAIVER',
  maxCommercialDiscountPercent: 20,

  // 4. Subscription & Platform Capacity Quotas
  subscriptionPlan: 'Professional',
  assetQuotaLimit: 100,
  assetQuotaUsed: 84,
  subscriptionRenewalDate: '2026-12-31',
  billingCycle: 'Annual',

  // 5. Team & Staff Access
  defaultNewUserRole: 'Operations',
  enforceMfa: false,
  sessionTimeoutHours: 24,

  // 6. Marketplace & Commercial Terms
  enableMarketplaceDiscovery: true,
  bookingAcceptanceMode: 'MANUAL_APPROVAL',
  maxAgencyDiscountPercent: 20,
  standardAgencyCommissionPercent: 15,
  showPublicRateCards: true,

  // 7. Security & Authentication
  twoFactorEnabled: true,
  twoFactorMethod: 'app',
  sessionTimeoutMinutes: 60,
  apiKeyMasked: 'sk_live_9a8f************3e21',
  webhookUrl: 'https://api.mdarts.com/webhooks/sodaars-events',
  ipWhitelist: '203.192.241.10, 115.112.44.82',

  // 8. Automated Alerts & Multi-Channel Notifications
  whatsappAlertsEnabled: true,
  whatsappNumber: '+91 98201 12345',
  smsAlertsEnabled: true,
  smsSenderId: 'SODAAR',
  notificationEmail: 'operations@mdarts.com',
  notifyBookingRequest: true,
  notifyHoldExpirationWarning: true,
  notifyFlightStartSoon: true,
  notifyProofUploads: true,
  notifyPaymentReceived: true,
  notifyDailyMorningBriefing: false,
  notifyMarketplaceInquiries: true,
  notifyBookingStatusChanges: true,
};

export const DEFAULT_OPERATIONAL_SETTINGS: OperationalSettings = DEFAULT_SYSTEM_SETTINGS;

