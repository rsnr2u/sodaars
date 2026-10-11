export type InvoiceStatus = 'PAID' | 'PARTIAL' | 'OVERDUE' | 'DRAFT';

export interface InvoiceLineItem {
  id: string;
  description: string;
  mediaType: string;
  location: string;
  sacCode: string;
  period: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface InvoiceBankDetails {
  bankName: string;
  accountNumber: string;
  ifsc: string;
  branch: string;
  accountType: string;
  upiId?: string;
}

export interface InvoiceRecord {
  id: string;
  bookingRef: string;
  client: string;
  clientGstin: string;
  clientPan: string;
  clientAddress: string;
  clientContactPerson: string;
  clientEmail: string;
  clientPhone: string;
  
  providerName: string;
  providerGstin: string;
  providerPan: string;
  providerAddress: string;
  providerStateCode: string;
  providerBank: InvoiceBankDetails;

  campaignName: string;
  issueDate: string;
  dueDate: string;
  paymentTerms: string;
  placeOfSupply: string;
  
  items: InvoiceLineItem[];
  subtotal: number;
  cgstRate: number;
  cgstAmount: number;
  sgstRate: number;
  sgstAmount: number;
  igstRate: number;
  igstAmount: number;
  totalTax: number;
  totalAmount: number;
  
  paidAmount: number;
  balanceDue: number;
  status: InvoiceStatus;
  paymentMode: string;
  lastPaymentDate?: string;
  notes?: string;
  termsAndConditions?: string[];
}
