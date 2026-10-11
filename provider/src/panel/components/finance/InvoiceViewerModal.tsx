import React from 'react';
import {
  X,
  Printer,
  Download,
  CheckCircle2,
  Clock,
  AlertCircle,
  Copy,
  Building,
  Landmark,
  Share2,
} from 'lucide-react';
import { InvoiceRecord } from '../../types/finance';
import Button from '../../../components/ui/Button';

export interface InvoiceViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: InvoiceRecord | null;
  onDownloadPdf?: (invoiceId: string) => void;
}

export const InvoiceViewerModal: React.FC<InvoiceViewerModalProps> = ({
  isOpen,
  onClose,
  invoice,
  onDownloadPdf,
}) => {
  if (!isOpen || !invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyId = () => {
    navigator.clipboard?.writeText(invoice.id);
  };

  const formatCurrency = (amt: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amt);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/50 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl bg-white rounded-xl border border-[#E5E5E5] shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Top Bar (Toolbar) */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#E5E5E5] bg-[#FAFAF9]">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#EA580C] bg-orange-50 px-2.5 py-1 rounded-md border border-orange-200">
              Tax Invoice
            </span>
            <span className="font-mono text-sm font-bold text-[#171717]">{invoice.id}</span>
            <button
              onClick={handleCopyId}
              title="Copy Invoice ID"
              className="text-[#737373] hover:text-[#171717] p-1 rounded hover:bg-[#E5E5E5] transition-colors"
            >
              <Copy size={13} />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="hidden sm:inline-flex items-center gap-1.5 text-xs text-[#525252]"
            >
              <Printer size={13} />
              Print
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDownloadPdf && onDownloadPdf(invoice.id)}
              className="inline-flex items-center gap-1.5 text-xs text-[#525252]"
            >
              <Download size={13} />
              Download PDF
            </Button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#737373] hover:text-[#171717] hover:bg-[#E5E5E5] transition-colors ml-1"
              aria-label="Close invoice viewer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable Document Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-xs text-[#171717] bg-white print:p-0">
          {/* Document Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-[#E5E5E5]">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-[#EA580C] text-white flex items-center justify-center font-bold text-sm tracking-tighter">
                  SD
                </span>
                <div>
                  <h2 className="text-base font-bold text-[#171717] leading-tight">
                    {invoice.providerName}
                  </h2>
                  <p className="text-[11px] text-[#737373]">Outdoor Advertising &amp; DOOH Media Operating System</p>
                </div>
              </div>
              <div className="mt-3 text-[11px] text-[#525252] space-y-0.5 leading-relaxed">
                <p>{invoice.providerAddress}</p>
                <p className="font-medium">
                  GSTIN: <span className="font-mono text-[#171717] font-bold">{invoice.providerGstin}</span> • PAN:{' '}
                  <span className="font-mono text-[#171717]">{invoice.providerPan}</span>
                </p>
                <p>State: Maharashtra • State Code: <span className="font-mono">{invoice.providerStateCode}</span></p>
              </div>
            </div>

            <div className="sm:text-right shrink-0">
              <div className="text-xl font-extrabold tracking-tight text-[#171717] uppercase">
                GST TAX INVOICE
              </div>
              <div className="text-[11px] text-[#737373] mt-0.5">Original for Recipient</div>

              <div className="mt-3 inline-block">
                {invoice.status === 'PAID' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-300">
                    <CheckCircle2 size={13} /> PAID &amp; RECONCILED
                  </span>
                )}
                {invoice.status === 'PARTIAL' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-300">
                    <Clock size={13} /> PARTIALLY PAID
                  </span>
                )}
                {invoice.status === 'OVERDUE' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-300">
                    <AlertCircle size={13} /> PAYMENT OVERDUE
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Invoice Meta Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#FAFAF9] p-3.5 rounded-lg border border-[#E5E5E5]">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#737373] tracking-wider block">
                Invoice Number
              </span>
              <span className="font-mono font-bold text-xs text-[#EA580C] mt-0.5 block">
                {invoice.id}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[#737373] tracking-wider block">
                Date of Issue
              </span>
              <span className="font-semibold text-xs text-[#171717] mt-0.5 block">
                {invoice.issueDate}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[#737373] tracking-wider block">
                Payment Due Date
              </span>
              <span className="font-semibold text-xs text-[#171717] mt-0.5 block">
                {invoice.dueDate}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[#737373] tracking-wider block">
                Booking Reference
              </span>
              <span className="font-mono font-semibold text-xs text-[#171717] mt-0.5 block">
                {invoice.bookingRef}
              </span>
            </div>
          </div>

          {/* Bill To & Campaign Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Billed To */}
            <div className="p-4 rounded-lg border border-[#E5E5E5] bg-white">
              <span className="text-[10px] uppercase font-bold text-[#737373] tracking-wider flex items-center gap-1.5 mb-2">
                <Building size={13} className="text-[#EA580C]" />
                Billed To (Client / Agency)
              </span>
              <h4 className="font-bold text-sm text-[#171717]">{invoice.client}</h4>
              <p className="text-[11px] text-[#525252] mt-1 leading-relaxed">
                {invoice.clientAddress}
              </p>
              <div className="mt-2.5 pt-2 border-t border-[#F5F5F4] text-[11px] space-y-1">
                <p>
                  <span className="text-[#737373]">GSTIN:</span>{' '}
                  <span className="font-mono font-semibold text-[#171717]">{invoice.clientGstin}</span>
                </p>
                <p>
                  <span className="text-[#737373]">Contact:</span> {invoice.clientContactPerson} • {invoice.clientPhone}
                </p>
                <p>
                  <span className="text-[#737373]">Email:</span> {invoice.clientEmail}
                </p>
              </div>
            </div>

            {/* Campaign & Dispatch */}
            <div className="p-4 rounded-lg border border-[#E5E5E5] bg-white">
              <span className="text-[10px] uppercase font-bold text-[#737373] tracking-wider flex items-center gap-1.5 mb-2">
                <Share2 size={13} className="text-indigo-600" />
                Campaign &amp; Terms
              </span>
              <h4 className="font-bold text-sm text-[#171717]">{invoice.campaignName}</h4>
              <div className="mt-2 text-[11px] space-y-1.5 leading-relaxed">
                <div className="flex justify-between">
                  <span className="text-[#737373]">Place of Supply:</span>
                  <span className="font-semibold text-[#171717]">{invoice.placeOfSupply}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#737373]">Payment Terms:</span>
                  <span className="font-semibold text-[#171717]">{invoice.paymentTerms}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#737373]">Payment Mode / Ref:</span>
                  <span className="font-semibold text-emerald-700">{invoice.paymentMode}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="overflow-x-auto rounded-lg border border-[#E5E5E5]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F5F5F4] text-[#525252] font-semibold border-b border-[#E5E5E5]">
                <tr>
                  <th className="py-2.5 px-3 w-8">#</th>
                  <th className="py-2.5 px-3">Description &amp; Media Asset Location</th>
                  <th className="py-2.5 px-3">SAC Code</th>
                  <th className="py-2.5 px-3">Display Duration</th>
                  <th className="py-2.5 px-3 text-center">Qty</th>
                  <th className="py-2.5 px-3 text-right">Rate</th>
                  <th className="py-2.5 px-3 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E5E5]">
                {invoice.items.map((item, index) => (
                  <tr key={item.id} className="hover:bg-[#FAFAF9]/50">
                    <td className="py-3 px-3 text-[#737373] font-mono">{index + 1}</td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-[#171717]">{item.description}</div>
                      <div className="text-[11px] text-[#737373]">{item.location} • {item.mediaType}</div>
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-[#525252]">
                      {item.sacCode}
                    </td>
                    <td className="py-3 px-3 text-[#525252] text-[11px] whitespace-nowrap">
                      {item.period}
                    </td>
                    <td className="py-3 px-3 text-center font-medium">{item.quantity}</td>
                    <td className="py-3 px-3 text-right font-mono text-[#525252]">
                      {formatCurrency(item.rate)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-semibold text-[#171717]">
                      {formatCurrency(item.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Tax Calculation & Totals Block */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Bank Details & Notes */}
            <div className="space-y-3">
              <div className="p-3.5 rounded-lg border border-[#E5E5E5] bg-[#FAFAF9]">
                <h5 className="font-bold text-[11px] uppercase tracking-wide text-[#171717] flex items-center gap-1.5 mb-2">
                  <Landmark size={14} className="text-[#EA580C]" />
                  Remittance &amp; Bank Details
                </h5>
                <div className="text-[11px] space-y-1 text-[#525252]">
                  <p>
                    <span className="text-[#737373]">Bank Name:</span> {invoice.providerBank.bankName}
                  </p>
                  <p>
                    <span className="text-[#737373]">Account Name:</span> {invoice.providerName}
                  </p>
                  <p>
                    <span className="text-[#737373]">A/C Number:</span>{' '}
                    <span className="font-mono font-bold text-[#171717]">{invoice.providerBank.accountNumber}</span>
                  </p>
                  <p>
                    <span className="text-[#737373]">IFSC Code:</span>{' '}
                    <span className="font-mono font-bold text-[#171717]">{invoice.providerBank.ifsc}</span>
                  </p>
                  {invoice.providerBank.upiId && (
                    <p>
                      <span className="text-[#737373]">UPI VPA:</span>{' '}
                      <span className="font-mono text-[#EA580C] font-semibold">{invoice.providerBank.upiId}</span>
                    </p>
                  )}
                </div>
              </div>

              {invoice.notes && (
                <div className="text-[11px] text-[#737373] italic">
                  <strong>Notes:</strong> {invoice.notes}
                </div>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="bg-[#FAFAF9] p-4 rounded-lg border border-[#E5E5E5] space-y-2">
              <div className="flex justify-between py-1 text-xs">
                <span className="text-[#525252]">Taxable Subtotal:</span>
                <span className="font-mono font-semibold text-[#171717]">{formatCurrency(invoice.subtotal)}</span>
              </div>
              
              {invoice.cgstAmount > 0 && (
                <div className="flex justify-between py-1 text-xs">
                  <span className="text-[#737373]">CGST Output ({invoice.cgstRate}%):</span>
                  <span className="font-mono text-[#525252]">{formatCurrency(invoice.cgstAmount)}</span>
                </div>
              )}

              {invoice.sgstAmount > 0 && (
                <div className="flex justify-between py-1 text-xs">
                  <span className="text-[#737373]">SGST Output ({invoice.sgstRate}%):</span>
                  <span className="font-mono text-[#525252]">{formatCurrency(invoice.sgstAmount)}</span>
                </div>
              )}

              {invoice.igstAmount > 0 && (
                <div className="flex justify-between py-1 text-xs">
                  <span className="text-[#737373]">IGST Output ({invoice.igstRate}%):</span>
                  <span className="font-mono text-[#525252]">{formatCurrency(invoice.igstAmount)}</span>
                </div>
              )}

              <div className="border-t border-[#E5E5E5] pt-2 flex justify-between items-baseline">
                <span className="text-sm font-bold text-[#171717]">Total Invoice Value:</span>
                <span className="text-lg font-bold font-mono text-[#EA580C]">
                  {formatCurrency(invoice.totalAmount)}
                </span>
              </div>

              <div className="border-t border-dashed border-[#E5E5E5] pt-2 text-[11px] space-y-1">
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Amount Received / Paid:</span>
                  <span className="font-mono font-bold">{formatCurrency(invoice.paidAmount)}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span className={invoice.balanceDue > 0 ? 'text-rose-700' : 'text-stone-700'}>
                    Net Balance Payable:
                  </span>
                  <span className={`font-mono text-xs ${invoice.balanceDue > 0 ? 'text-rose-700 font-extrabold' : 'text-emerald-700'}`}>
                    {formatCurrency(invoice.balanceDue)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Statutory Signatory */}
          <div className="pt-6 border-t border-[#E5E5E5] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[11px] text-[#737373]">
            <div className="max-w-md">
              <p className="font-semibold text-[#171717]">Declaration &amp; Statutory Notes:</p>
              <p className="mt-0.5">
                We declare that this invoice shows the actual price of the services described and that all particulars are true and correct.
                All disputes subject to Mumbai Jurisdiction.
              </p>
            </div>
            <div className="text-right sm:text-right shrink-0">
              <p className="font-bold text-[#171717]">For {invoice.providerName}</p>
              <div className="h-10 my-1 flex items-center justify-end">
                <span className="text-[10px] text-[#A3A3A3] italic border border-dashed border-[#D4D4D4] px-3 py-1 rounded">
                  [Authorized Electronic Signatory]
                </span>
              </div>
              <p className="text-[10px] text-[#737373]">Director of Finance &amp; Operations</p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-[#E5E5E5] bg-[#FAFAF9]">
          <div className="text-xs text-[#737373]">
            Status:{' '}
            <span className="font-semibold text-[#171717]">
              {invoice.status} • {invoice.paymentMode}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => onDownloadPdf && onDownloadPdf(invoice.id)}
              className="flex items-center gap-1.5"
            >
              <Download size={14} />
              Download Tax Invoice
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceViewerModal;
