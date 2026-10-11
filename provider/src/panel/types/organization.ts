export interface OrganizationProfile {
  id: string;
  legalName: string;
  tradeName: string;
  registrationNumber: string; // CIN or LLPIN
  dateOfIncorporation: string;
  corporateEmail: string;
  corporatePhone: string;
  websiteUrl: string;

  // Tax & Compliance
  gstin: string;
  pan: string;
  entityType: 'Private Limited' | 'Public Limited' | 'LLP' | 'Partnership' | 'Sole Proprietorship';
  gstStatus: 'Active & Verified' | 'Pending Verification' | 'Exempt';
  hsnSacCode: string;

  // Registered Office
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  country: string;

  // Billing & Accounts
  billingContactName: string;
  billingContactDesignation: string;
  billingEmail: string;
  billingPhone: string;
  defaultPaymentTerms: string;

  // Metadata & System Info
  slug: string;
  status: 'active' | 'pending' | 'suspended';
  verifiedAt: string;
  registeredResourceCount: number;
}

export const DEFAULT_ORGANIZATION_PROFILE: OrganizationProfile = {
  id: 'org_sodaars_001',
  legalName: 'Apex Media Networks Private Limited',
  tradeName: 'Apex Outdoor Media',
  registrationNumber: 'U74999MH2021PTC368412',
  dateOfIncorporation: '2021-04-15',
  corporateEmail: 'contact@apexoutdoor.com',
  corporatePhone: '+91 98201 12345',
  websiteUrl: 'https://apexoutdoor.example.com',

  // Tax & Compliance
  gstin: '27AABCA1234F1Z5',
  pan: 'AABCA1234F',
  entityType: 'Private Limited',
  gstStatus: 'Active & Verified',
  hsnSacCode: '998361 (Advertising Services)',

  // Registered Office
  addressLine1: 'Unit 402, 4th Floor, Times Tower',
  addressLine2: 'Kamala Mills Compound, Senapati Bapat Marg, Lower Parel',
  city: 'Mumbai',
  state: 'Maharashtra',
  pincode: '400013',
  country: 'India',

  // Billing & Accounts
  billingContactName: 'Rajesh Kumar',
  billingContactDesignation: 'Director of Finance & Operations',
  billingEmail: 'accounts@apexoutdoor.com',
  billingPhone: '+91 98201 54321',
  defaultPaymentTerms: 'Net 15 Days from Campaign Commencement',

  // System & Verification
  slug: 'apex-media-networks',
  status: 'active',
  verifiedAt: '2023-01-10',
  registeredResourceCount: 70,
};
