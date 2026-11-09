export type DomainType = 'administration' | 'provider' | 'marketplace';

export interface ProviderItem {
  id: string;
  name: string;
  legalEntity: string;
  pan: string;
  gstin: string;
  city: string;
  state: string;
  tier: 'Tier 1' | 'Tier 2' | 'Tier 3';
  contactPerson: string;
  email: string;
  phone: string;
  resourceCount: number;
  kycStatus: 'verified' | 'under_review' | 'rejected' | 'pending_resubmission';
  accountStatus: 'active' | 'suspended' | 'probation';
  joinedDate: string;
  lastActive: string;
  docs: {
    gstCertificate: boolean;
    panCard: boolean;
    tradeLicense: boolean;
    bankMandate: boolean;
  };
}

export interface ResourceItem {
  id: string;
  code: string;
  providerId: string;
  providerName: string;
  title: string;
  type: 'Billboard' | 'Unipole' | 'DOOH Digital Screen' | 'Gantry' | 'Bus Shelter';
  illumination: 'Front Lit' | 'Back Lit' | 'Digital / LED' | 'Non Lit';
  dimensions: string;
  city: string;
  locationArea: string;
  latitude: number;
  longitude: number;
  monthlyRate: number;
  verificationStatus: 'approved' | 'pending_audit' | 'flagged';
  adminBlockStatus: 'none' | 'municipal_hold' | 'legal_dispute' | 'compliance_hold';
  blockReason?: string;
  blockTimestamp?: string;
  blockedBy?: string;
  photosCount: number;
}

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'Compliance Officer' | 'Inventory Auditor' | 'Support Agent';
  status: 'active' | 'inactive';
  lastLogin: string;
  twoFactorEnabled: boolean;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: string;
  action: string;
  targetType: 'PROVIDER' | 'RESOURCE' | 'MASTER_DATA' | 'STAFF' | 'SYSTEM';
  targetId: string;
  details: string;
  ipAddress: string;
}

export interface SystemMetric {
  totalProviders: number;
  activeProviders: number;
  pendingKyc: number;
  totalBillboards: number;
  activeBillboards: number;
  adminBlockedBillboards: number;
  totalNetworkGmv: number;
  citiesCovered: number;
}

export interface PackagePaymentInvoice {
  id: string;
  paymentRef: string;
  providerId: string;
  providerName: string;
  legalEntity: string;
  gstin: string;
  city: string;
  state: string;
  planName: string;
  planCode: string;
  billingCycle: 'Monthly' | 'Annual';
  periodStart: string;
  periodEnd: string;
  baseAmount: number;
  gstAmount: number;
  totalAmount: number;
  paymentDate: string;
  paymentMethod: 'UPI AutoPay' | 'NEFT / RTGS' | 'Corporate Card' | 'Netbanking';
  status: 'paid' | 'pending' | 'failed' | 'refunded';
  sacCode: string;
}

export interface SubscriberRecord {
  id: string;
  providerId: string;
  providerName: string;
  planName: string;
  planCode: string;
  billingCycle: 'Monthly' | 'Annual';
  amount: number;
  status: 'active' | 'payment_due' | 'grace_period' | 'suspended';
  billboardUsage: number;
  quotaLimit: number;
  nextRenewal: string;
  lastPaymentDate: string;
  overrideBonus: number;
}

export interface ProviderKycDocument {
  id: string;
  name: string;
  docType: 'gst' | 'pan' | 'trade_license' | 'bank_cheque' | 'incorporation';
  fileName: string;
  fileSize: string;
  uploadedAt: string;
  status: 'verified' | 'under_review' | 'rejected' | 'missing';
  rejectionReason?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  documentNumber?: string;
}

export interface ProviderBookingRecord {
  id: string;
  providerId: string;
  resourceId: string;
  resourceName: string;
  resourceType: string;
  location: string;
  customerName: string;
  companyName: string;
  contactPhone: string;
  contactEmail: string;
  source: 'Marketplace' | 'Provider Direct';
  startDate: string;
  endDate: string;
  contractValue: number;
  sodaarsNetPayout?: number;
  markupAmount?: number;
  paymentStatus: 'Paid in Full' | '50% Advance' | 'Pending Payment';
  status: 'Under Review' | 'Confirmed' | 'Active' | 'Completed' | 'Cancelled';
  createdAt: string;
}

export interface HoardingCampaignItem {
  id: string;
  providerId: string;
  resourceId: string;
  resourceCode: string;
  resourceName: string;
  resourceType: string;
  location: string;
  city: string;
  dimensions: string;
  advertiserName: string;
  campaignTitle: string;
  startDate: string;
  endDate: string;
  operationalStatus: 'Booking Confirmed' | 'Moved to Campaign' | 'Running' | 'Completed';
  mountingProofStatus: 'Pending Upload' | 'Under Audit' | 'Verified' | 'Rejected';
  dayPhotoUrl?: string;
  nightPhotoUrl?: string;
  proofTimestamp?: string;
  proofGpsCoordinates?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  rejectionReason?: string;
  invoiceStatus: 'Invoice Raised' | 'Awaiting Invoice';
  invoiceNumber?: string;
  invoiceAmount?: number;
  settlementStatus: 'Settlement Released' | 'Locked (Pending Proof)' | 'Settlement Processing';
  settlementAmount: number;
}


