export type SettingsTabId =
  | 'general'
  | 'operations'
  | 'finance'
  | 'team'
  | 'marketplace'
  | 'notifications';

export interface ProviderSystemSettings {
  // 1. General & Corporate Profile
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

  // 3. Billing, GST & Banking Details
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

  // 4. Team & Staff Access
  defaultNewUserRole: 'Operations' | 'Rigger' | 'Finance' | 'Sales';
  enforceMfa: boolean;
  sessionTimeoutHours: number;

  // 5. Marketplace & Commercial Terms
  enableMarketplaceDiscovery: boolean;
  bookingAcceptanceMode: 'AUTO_ACCEPT' | 'MANUAL_APPROVAL';
  maxAgencyDiscountPercent: number;
  standardAgencyCommissionPercent: number;
  showPublicRateCards: boolean;

  // 6. Automated Alerts & Multi-Channel Notifications
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
  // 1. General & Corporate Profile
  legalEntityName: 'Apex Media Networks Private Limited',
  brandTradeName: 'Apex Outdoor Media',
  cinNumber: 'U74999MH2021PTC368412',
  incorporationDate: '2021-04-15',
  corporateEmail: 'contact@apexoutdoor.com',
  corporatePhone: '+91 98201 12345',
  websiteUrl: 'https://apexoutdoor.example.com',
  registeredAddress: 'Unit 402, 4th Floor, Times Tower, Kamala Mills Compound, Lower Parel',
  city: 'Mumbai',
  state: 'Maharashtra',
  pincode: '400013',
  dispatchYardAddress: 'Plot 18-B, TTC Industrial Area, MIDC Pawane, Turbhe, Navi Mumbai 400705',
  defaultTimezone: 'Asia/Kolkata (IST +05:30)',
  defaultCurrency: 'INR (₹)',

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

  // 3. Billing, GST & Banking Details
  gstin: '27AABCA1234F1Z5',
  pan: 'AABCA1234F',
  hsnSacCode: '998361 (Advertising Services)',
  bankBeneficiary: 'Apex Media Networks Private Limited',
  bankName: 'HDFC Bank Ltd',
  bankAccountNumber: '50200048912384',
  bankIfsc: 'HDFC0000060',
  bankBranch: 'Fort Branch, Mumbai',
  upiId: 'apexoutdoor@hdfcbank',
  bookingPrefix: 'APEX-BK-',
  proposalPrefix: 'APEX-EST-',
  invoicePrefix: 'APEX-INV-2026-',
  proposalValidityDays: 14,
  defaultCreditTerms: '50% Advance, 50% Post-Mounting Proof',
  defaultGstRate: 18,

  // 4. Team & Staff Access
  defaultNewUserRole: 'Operations',
  enforceMfa: false,
  sessionTimeoutHours: 24,

  // 5. Marketplace & Commercial Terms
  enableMarketplaceDiscovery: true,
  bookingAcceptanceMode: 'MANUAL_APPROVAL',
  maxAgencyDiscountPercent: 20,
  standardAgencyCommissionPercent: 15,
  showPublicRateCards: true,

  // 6. Automated Alerts & Multi-Channel Notifications
  whatsappAlertsEnabled: true,
  whatsappNumber: '+91 98201 12345',
  smsAlertsEnabled: true,
  smsSenderId: 'SODAAR',
  notificationEmail: 'operations@apexoutdoor.com',
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
