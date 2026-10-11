export interface MarketplaceAgreementDetails {
  agreementCode: string;
  version: string;
  status: 'Active & Executed' | 'Pending Signature' | 'Under Review';
  effectiveDate: string;
  lastReviewedDate: string;
  providerLegalName: string;
  providerTradeName: string;
  providerGstin: string;
  platformLegalName: string;
  platformGstin: string;
  signatoryName: string;
  signatoryDesignation: string;
  signatoryEmail: string;
  signatureTimestamp: string;
  signatureIpAddress: string;
  verificationHash: string;
}

export const CANONICAL_MARKETPLACE_AGREEMENT: MarketplaceAgreementDetails = {
  agreementCode: 'AGR-SODAARS-2026-0042',
  version: 'v2.4 (Enterprise Standard)',
  status: 'Active & Executed',
  effectiveDate: '2026-01-15',
  lastReviewedDate: '2026-09-01',
  providerLegalName: 'Apex Media Networks Private Limited',
  providerTradeName: 'Apex Outdoor Media',
  providerGstin: '27AABCA1234F1Z5',
  platformLegalName: 'SODAARS Media Technologies Private Limited',
  platformGstin: '27AAACS9876Q1Z2',
  signatoryName: 'Rajesh Kumar',
  signatoryDesignation: 'Director & Authorized Commercial Officer',
  signatoryEmail: 'rajesh@apexoutdoor.com',
  signatureTimestamp: '2026-01-15T11:42:19+05:30',
  signatureIpAddress: '115.240.18.92 (Mumbai, Maharashtra)',
  verificationHash: 'SHA256: 9e8a71c8f420b9e831d10459a939f88c30e261f92e3a158b02da449e7b233b49',
};
