import { BookingRecord } from '../types/booking';
import { InvoiceRecord } from '../types/finance';
import { SAMPLE_INVOICE_RECORDS, SAMPLE_PROVIDER_PROFILE } from '../data/sampleFinance';

/**
 * Finds an existing invoice for a booking, or constructs a realistic GST-compliant
 * InvoiceRecord based on the booking's commercial data.
 */
export function getInvoiceForBooking(booking: BookingRecord): InvoiceRecord {
  // Check if there is an exact matching invoice by bookingRef
  const existing = SAMPLE_INVOICE_RECORDS.find(
    (inv) => inv.bookingRef.toLowerCase() === booking.id.toLowerCase()
  );
  if (existing) {
    return existing;
  }

  // Parse amount
  const rawPrice = parseInt(
    booking.pricing.finalInvoicedAmount ||
      booking.pricing.regularCustomerPrice ||
      booking.pricing.sodaarsPrice ||
      '180000',
    10
  );

  const subtotal = rawPrice;
  const isInterstate = !booking.location.toLowerCase().includes('mumbai');
  const cgstRate = isInterstate ? 0 : 9;
  const sgstRate = isInterstate ? 0 : 9;
  const igstRate = isInterstate ? 18 : 0;

  const cgstAmount = Math.round((subtotal * cgstRate) / 100);
  const sgstAmount = Math.round((subtotal * sgstRate) / 100);
  const igstAmount = Math.round((subtotal * igstRate) / 100);
  const totalTax = cgstAmount + sgstAmount + igstAmount;
  const totalAmount = subtotal + totalTax;

  const isConfirmed = booking.status === 'CONFIRMED' || booking.status === 'ACTIVE' || booking.status === 'COMPLETED';
  const paidAmount = isConfirmed ? totalAmount : Math.round(totalAmount * 0.5);
  const balanceDue = totalAmount - paidAmount;

  return {
    id: `INV-2026-${booking.id.replace('BKG-', '10-0')}`,
    bookingRef: booking.id,
    client: booking.companyName,
    clientGstin: '27AAACT2819M1Z8',
    clientPan: 'AAACT2819M',
    clientAddress: `${booking.location}, Commercial Hub Corridor, India`,
    clientContactPerson: booking.customerName,
    clientEmail: booking.contactEmail || 'accounts.billing@agency.in',
    clientPhone: booking.contactPhone || '+91 98200 44521',
    providerName: SAMPLE_PROVIDER_PROFILE.name,
    providerGstin: SAMPLE_PROVIDER_PROFILE.gstin,
    providerPan: SAMPLE_PROVIDER_PROFILE.pan,
    providerAddress: SAMPLE_PROVIDER_PROFILE.address,
    providerStateCode: SAMPLE_PROVIDER_PROFILE.stateCode,
    providerBank: SAMPLE_PROVIDER_PROFILE.bank,
    campaignName: `${booking.companyName} — ${booking.resourceName}`,
    issueDate: booking.createdAt || '01 Oct 2026',
    dueDate: '16 Oct 2026',
    paymentTerms: 'Net 15 Days',
    placeOfSupply: isInterstate ? '36 - Telangana / Other' : '27 - Maharashtra',
    items: [
      {
        id: 'item-1',
        description: `${booking.resourceName} (${booking.resourceType})`,
        mediaType: `${booking.resourceType} Billboard Display`,
        location: booking.location,
        sacCode: '998361',
        period: `${booking.startDate} – ${booking.endDate}`,
        quantity: 1,
        rate: subtotal,
        amount: subtotal,
      },
    ],
    subtotal,
    cgstRate,
    cgstAmount,
    sgstRate,
    sgstAmount,
    igstRate,
    igstAmount,
    totalTax,
    totalAmount,
    paidAmount,
    balanceDue,
    status: balanceDue === 0 ? 'PAID' : paidAmount > 0 ? 'PARTIAL' : 'DRAFT',
    paymentMode: booking.source === 'Marketplace' ? 'SODAARS Escrow Auto-Release' : 'RTGS / Bank Transfer',
    notes: `Tax invoice issued against Booking Order ${booking.id}. Dual geotagged photo proof protocol applies.`,
  };
}
