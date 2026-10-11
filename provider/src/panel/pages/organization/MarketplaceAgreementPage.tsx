import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileSignature,
  ShieldCheck,
  CheckCircle2,
  Download,
  Scale,
  FileText,
  Check,
  Lock,
  Building2,
  ArrowLeft,
  Info,
  ChevronDown,
  Eye,
} from 'lucide-react';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import {
  CANONICAL_MARKETPLACE_AGREEMENT,
  MarketplaceAgreementDetails,
} from '../../types/marketplaceAgreement';

export const MarketplaceAgreementPage: React.FC = () => {
  const [agreement] = useState<MarketplaceAgreementDetails>(CANONICAL_MARKETPLACE_AGREEMENT);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
  const [expandedClause, setExpandedClause] = useState<string | null>('clause-2');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleDownloadPdf = () => {
    showToast(`Downloading executed agreement ${agreement.agreementCode}.pdf...`);
  };

  const toggleClause = (id: string) => {
    setExpandedClause(expandedClause === id ? null : id);
  };

  const agreementClauses = [
    {
      id: 'clause-1',
      number: '1.0',
      title: 'Scope of Marketplace Syndication & Non-Exclusivity',
      summary: 'Voluntary discovery representation without restricting direct offline client relationships.',
      body: `1.1 The Media Provider grants SODAARS a non-exclusive, revocable right to digitally display, market, and syndicate selected advertising resources on the SODAARS public marketplace catalog.\n1.2 The Media Provider retains 100% operational authority and ownership of all physical static outdoor assets.\n1.3 Nothing in this Agreement restricts the Media Provider from directly marketing, negotiating, or contracting its advertising displays with offline advertisers, agencies, or municipal entities outside the SODAARS marketplace.`,
    },
    {
      id: 'clause-2',
      number: '2.0',
      title: 'Dual-Price Framework & Guaranteed Net Settlement Protection',
      summary: 'Provider establishes the SODAARS Net Price; provider payout is 100% protected against platform discounts.',
      body: `2.1 Dual-Price Principle: For each syndicated asset, the Media Provider specifies both a Regular Customer Retail Price and a contracted SODAARS Net Price.\n2.2 Settlement Anchor: On any confirmed marketplace transaction, the Media Provider's financial entitlement is strictly anchored to the SODAARS Net Price.\n2.3 Concession Absorption: Any customer discounts, promotional vouchers, or negotiated platform concessions granted to media buyers are absorbed entirely by SODAARS. The Media Provider's net payout shall never be diminished below the contracted SODAARS Net Price.\n2.4 Zero Deductions: SODAARS shall assess zero listing charges, zero payment processing subtractions, and zero administrative transaction commissions against the provider net settlement amount.`,
    },
    {
      id: 'clause-3',
      number: '3.0',
      title: 'Dynamic Marketplace Markup Architecture',
      summary: 'Marketplace pricing dynamically combines provider net price and platform markup without rigid percentages.',
      body: `3.1 Dynamic Markup: The public listing price on the marketplace is computed as: Marketplace Price = SODAARS Net Price + Agreed Marketplace Markup.\n3.2 Variable Pricing: The markup framework is flexible and agreement-driven, allowing asset-specific calibration to local market dynamics without rigid fixed percentage limits.\n3.3 Rate Card Parity: The resulting public marketplace price typically remains at or below the Media Provider's submitted Regular Customer Price, protecting public rate card integrity.`,
    },
    {
      id: 'clause-4',
      number: '4.0',
      title: 'Operational Fulfillment, Mounting & Proof of Performance (POP)',
      summary: 'Provider executes physical flex printing and mounting, certified by GPS timestamped daytime and nighttime photos.',
      body: `4.1 Turnaround Window: Following booking confirmation and artwork approval, the Media Provider shall execute flex printing, delivery, and physical mounting within the agreed operational lead time (typically 2–3 business days).\n4.2 Proof of Performance (POP): The Media Provider shall upload tamper-resistant daytime photo proof and illuminated nighttime photo proof (for lit/back-lit hoardings) with verified GPS coordinates and timestamp logs into the Campaign Execution module.\n4.3 Settlement Release: The submission and verification of compliant POP logs constitutes the formal condition precedent triggering provider payout clearance.`,
    },
    {
      id: 'clause-5',
      number: '5.0',
      title: 'Structural Safety, Illumination & Municipal Regulatory Compliance',
      summary: 'Provider ensures municipal permits, structural stability, and nighttime lighting operability.',
      body: `5.1 Municipal Compliance: The Media Provider warrants that all registered advertising faces hold valid municipal licenses, statutory display permits, and structural stability certifications required by local governing bodies.\n5.2 Municipal Display Taxes: All local municipal taxes, concession fees, and advertising site ground rents remain the sole responsibility of the Media Provider.\n5.3 Illumination Standards: For front-lit and back-lit displays, illumination floodlights must operate continuously during standard commercial evening hours (6:30 PM to 11:30 PM).`,
    },
    {
      id: 'clause-6',
      number: '6.0',
      title: 'Financial Settlement Cycle & Tax Invoicing',
      summary: 'Payouts processed on Net 15 terms following POP verification; Indian GST (18%) compliant.',
      body: `6.1 Settlement Timeline: Approved provider payouts are disbursed on Net 15 business days following POP verification sign-off via automated electronic bank transfer.\n6.2 Tax Invoicing: The Media Provider invoices SODAARS (or designated billing entity) for the SODAARS Net Price plus applicable statutory GST (18%) under SAC Code 998361.\n6.3 Reversal & Default: In the event of documented structural failure or non-mounting caused solely by provider default, provisional amounts remain subject to rectification procedures.`,
    },
    {
      id: 'clause-7',
      number: '7.0',
      title: 'Term, Modification & Unilateral Opt-Out Rights',
      summary: 'Agreement renews annually; provider can toggle off marketplace syndication at any time.',
      body: `7.1 Term & Renewal: This Agreement takes effect upon digital execution and remains active for a period of twelve (12) months, automatically renewing for successive annual terms.\n7.2 Voluntary Opt-Out: The Media Provider may enable, pause, or disable marketplace participation on any individual asset or all assets at any time via the Provider Panel without incurring financial penalties.\n7.3 Contractual Continuity: Opt-out shall not affect previously confirmed, ongoing campaigns currently active on physical display faces until their contractual completion.`,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-lg bg-[#171717] text-white text-xs font-medium shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 size={16} className="text-[#F97316] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & Primary Actions Card */}
      <div className="bg-white rounded-lg border border-[#E5E5E5] p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#EA580C] flex items-center gap-1">
            <Scale size={12} /> Organization Administration
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-[#171717] tracking-tight">
            Marketplace Commercial Agreement
          </h1>
          <p className="text-xs text-[#525252] mt-0.5">
            Contractual reference governing commercial terms, SODAARS Net Settlement basis, and voluntary discovery participation.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Link to="/panel/organization/marketplace">
            <Button variant="secondary" size="sm" leftIcon={<ArrowLeft size={14} />}>
              Back to Marketplace
            </Button>
          </Link>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleDownloadPdf}
            leftIcon={<Download size={14} />}
          >
            Download PDF Copy
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsLegalModalOpen(true)}
            leftIcon={<Eye size={14} />}
          >
            Review Terms Modal
          </Button>
        </div>
      </div>

      {/* Agreement Status & Credentials Banner */}
      <div className="bg-white rounded-lg border border-[#E5E5E5] p-5 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#E5E5E5]">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center shrink-0 shadow-xs">
              <FileSignature size={24} />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base font-bold text-[#171717]">
                  {agreement.agreementCode}
                </h2>
                <Badge variant="active" size="sm" className="gap-1 flex items-center">
                  <CheckCircle2 size={12} className="text-emerald-600" />
                  {agreement.status}
                </Badge>
                <span className="text-[11px] font-mono text-[#737373] bg-[#FAFAF9] px-2 py-0.5 rounded border border-[#E5E5E5]">
                  {agreement.version}
                </span>
              </div>
              <p className="text-xs text-[#525252] mt-0.5">
                Bilateral Digital Commercial Agreement between SODAARS and {agreement.providerLegalName}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-[#737373] lg:self-center">
            <div className="bg-[#FAFAF9] px-3 py-1.5 rounded-md border border-[#E5E5E5]">
              <span className="text-[10px] text-[#737373] block uppercase font-bold">Effective Date</span>
              <span className="font-semibold text-[#171717]">
                {new Date(agreement.effectiveDate).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            </div>
            <div className="bg-[#FAFAF9] px-3 py-1.5 rounded-md border border-[#E5E5E5]">
              <span className="text-[10px] text-[#737373] block uppercase font-bold">Signatory</span>
              <span className="font-semibold text-[#171717]">{agreement.signatoryName}</span>
            </div>
          </div>
        </div>

        {/* Contracting Parties & Legal Audit Strip */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
          <div className="p-3 bg-[#FAFAF9] rounded-lg border border-[#E5E5E5] space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#EA580C] flex items-center gap-1">
              <Building2 size={12} /> Media Asset Provider (Party A)
            </div>
            <div className="font-bold text-[#171717]">{agreement.providerLegalName}</div>
            <div className="text-[11px] text-[#525252]">Trade Brand: {agreement.providerTradeName}</div>
            <div className="text-[11px] font-mono text-[#737373]">GSTIN: {agreement.providerGstin}</div>
          </div>

          <div className="p-3 bg-[#FAFAF9] rounded-lg border border-[#E5E5E5] space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#EA580C] flex items-center gap-1">
              <Building2 size={12} /> Marketplace Facilitator (Party B)
            </div>
            <div className="font-bold text-[#171717]">{agreement.platformLegalName}</div>
            <div className="text-[11px] text-[#525252]">Platform: SODAARS Outdoor Marketplace Engine</div>
            <div className="text-[11px] font-mono text-[#737373]">GSTIN: {agreement.platformGstin}</div>
          </div>
        </div>
      </div>

      {/* Commercial Reconciliation Architecture (Specification 19 Anchor) */}
      <Card
        header={
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Scale size={17} className="text-[#EA580C]" />
              <div>
                <h3 className="text-sm font-bold text-[#171717]">
                  Commercial Settlement & Reconciliation Architecture
                </h3>
                <p className="text-[11px] text-[#737373]">
                  Mathematical model enforcing provider net payout protection on all marketplace transactions.
                </p>
              </div>
            </div>
            <Badge variant="brand" size="sm">
              Specification 19
            </Badge>
          </div>
        }
      >
        <div className="space-y-5 text-xs">
          <div className="p-4 rounded-lg bg-orange-50/70 border border-orange-200/80 flex items-start gap-3">
            <Info size={18} className="text-[#EA580C] shrink-0 mt-0.5" />
            <div className="text-[#525252] leading-relaxed">
              <strong className="text-[#171717]">The Dual-Price Principle:</strong> Every marketplace asset has both a <strong>Regular Customer Price</strong> (retail public anchor) and a <strong>SODAARS Net Price</strong> (the contracted amount paid to you). SODAARS applies dynamic markups to the public price. When SODAARS offers discounts to buyers, <strong>SODAARS absorbs 100% of the discount</strong>; your net settlement remains completely untouched.
            </div>
          </div>

          {/* Canonical 8-Step Financial Reconciliation Walkthrough */}
          <div className="bg-[#FAFAF9] rounded-lg border border-[#E5E5E5] p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-2">
              <span className="font-bold text-xs text-[#171717] uppercase tracking-wider">
                Canonical Transaction Reconciliation Example
              </span>
              <span className="text-[11px] text-[#737373]">Specification 19 Model</span>
            </div>

            <div className="space-y-2 font-mono text-xs">
              <div className="flex justify-between items-center py-1 border-b border-stone-200/60">
                <span className="text-[#525252]">Step 1: Provider Regular Customer Retail Benchmark</span>
                <span className="font-semibold text-[#171717]">₹1,00,000</span>
              </div>

              <div className="flex justify-between items-center py-1 bg-orange-50/80 px-2 rounded text-[#EA580C] font-bold">
                <span>Step 2: Provider SODAARS Net Settlement Basis (Your Payout)</span>
                <span>₹75,000</span>
              </div>

              <div className="flex justify-between items-center py-1 text-[#737373]">
                <span>Step 3: Agreed Dynamic Marketplace Markup (Agreement-Driven)</span>
                <span>+ ₹22,500</span>
              </div>

              <div className="flex justify-between items-center py-1 text-[#171717] border-t border-stone-200">
                <span>Step 4: Initial Listed Marketplace Price</span>
                <span className="font-semibold">₹97,500</span>
              </div>

              <div className="flex justify-between items-center py-1 text-emerald-700 bg-emerald-50 px-2 rounded">
                <span>Step 5: Buyer Commercial Concession (100% Absorbed by SODAARS)</span>
                <span>- ₹5,000</span>
              </div>

              <div className="flex justify-between items-center py-1 text-[#171717] font-semibold">
                <span>Step 6: Final Customer Invoiced Amount</span>
                <span>₹92,500</span>
              </div>

              <div className="flex justify-between items-center py-2 bg-emerald-100/70 border border-emerald-300 px-3 rounded-md text-emerald-900 font-extrabold text-sm mt-2">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={16} className="text-emerald-700" />
                  Step 7: Guaranteed Provider Net Payout (100% Intact)
                </span>
                <span>₹75,000</span>
              </div>

              <div className="flex justify-between items-center py-1 text-[11px] text-[#737373] px-2">
                <span>Step 8: SODAARS Gross Margin Realization (₹92,500 - ₹75,000)</span>
                <span>₹17,500</span>
              </div>
            </div>
          </div>

          {/* 4 Pillars Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
            <div className="p-3 bg-white rounded-lg border border-[#E5E5E5] space-y-1">
              <div className="font-bold text-[#171717] flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-[#EA580C]" /> Guaranteed Net
              </div>
              <p className="text-[11px] text-[#737373]">
                Your net settlement price is contractually guaranteed and shielded from client discounts.
              </p>
            </div>

            <div className="p-3 bg-white rounded-lg border border-[#E5E5E5] space-y-1">
              <div className="font-bold text-[#171717] flex items-center gap-1.5">
                <Check size={14} className="text-emerald-600" /> Zero Deductions
              </div>
              <p className="text-[11px] text-[#737373]">
                Zero listing fees, zero payment gateway fees, and zero hidden cuts deducted from your payout.
              </p>
            </div>

            <div className="p-3 bg-white rounded-lg border border-[#E5E5E5] space-y-1">
              <div className="font-bold text-[#171717] flex items-center gap-1.5">
                <FileText size={14} className="text-[#EA580C]" /> POP Release
              </div>
              <p className="text-[11px] text-[#737373]">
                Payout clears automatically upon GPS daytime and nighttime photo proof approval.
              </p>
            </div>

            <div className="p-3 bg-white rounded-lg border border-[#E5E5E5] space-y-1">
              <div className="font-bold text-[#171717] flex items-center gap-1.5">
                <Lock size={14} className="text-[#EA580C]" /> Voluntary
              </div>
              <p className="text-[11px] text-[#737373]">
                You decide which assets participate; pause, toggle, or withdraw assets at any time.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Embedded Agreement Clauses Viewer */}
      <Card
        header={
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText size={17} className="text-[#EA580C]" />
              <div>
                <h3 className="text-sm font-bold text-[#171717]">
                  Executed Agreement Terms & Statutory Clauses
                </h3>
                <p className="text-[11px] text-[#737373]">
                  Complete legal clauses governing marketplace transactions under Indian Commercial Law.
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setExpandedClause(expandedClause ? null : 'clause-1');
              }}
            >
              {expandedClause ? 'Collapse Sections' : 'Expand All'}
            </Button>
          </div>
        }
      >
        <div className="space-y-3 text-xs">
          {agreementClauses.map((clause) => {
            const isExpanded = expandedClause === clause.id;
            return (
              <div
                key={clause.id}
                className={`rounded-lg border transition-all ${
                  isExpanded ? 'border-[#EA580C]/40 bg-[#FAFAF9]' : 'border-[#E5E5E5] bg-white'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleClause(clause.id)}
                  className="w-full p-3.5 flex items-center justify-between text-left gap-3 focus:outline-none"
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <span className="font-mono font-bold text-[#EA580C] shrink-0">
                      {clause.number}
                    </span>
                    <div>
                      <div className="font-bold text-[#171717]">{clause.title}</div>
                      <div className="text-[11px] text-[#737373] mt-0.5 font-normal">
                        {clause.summary}
                      </div>
                    </div>
                  </div>
                  <ChevronDown
                    size={16}
                    className={`text-[#737373] shrink-0 transition-transform duration-200 ${
                      isExpanded ? 'rotate-180 text-[#EA580C]' : ''
                    }`}
                  />
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 pt-1 text-xs text-[#525252] border-t border-[#E5E5E5] space-y-2 whitespace-pre-line leading-relaxed">
                    {clause.body}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Digital Execution & Cryptographic Verification Audit Card */}
      <div className="bg-white rounded-lg border border-[#E5E5E5] p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck size={18} className="text-emerald-600" />
          <div>
            <h3 className="text-sm font-bold text-[#171717]">
              Digital Signature & Legal Execution Audit Trail
            </h3>
            <p className="text-[11px] text-[#737373]">
              Legally binding electronic signature pursuant to Section 10A of the Information Technology Act, 2000.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-[#FAFAF9] rounded-md border border-[#E5E5E5]">
            <div className="text-[10px] text-[#737373] uppercase font-bold">Authorized Signatory</div>
            <div className="font-semibold text-[#171717] mt-0.5">{agreement.signatoryName}</div>
            <div className="text-[10px] text-[#737373]">{agreement.signatoryDesignation}</div>
          </div>

          <div className="p-3 bg-[#FAFAF9] rounded-md border border-[#E5E5E5]">
            <div className="text-[10px] text-[#737373] uppercase font-bold">Execution Timestamp</div>
            <div className="font-semibold text-[#171717] mt-0.5">
              {new Date(agreement.signatureTimestamp).toLocaleString('en-IN', {
                dateStyle: 'medium',
                timeStyle: 'short',
              })}
            </div>
            <div className="text-[10px] text-emerald-600 font-medium">Verified via Secure Session</div>
          </div>

          <div className="p-3 bg-[#FAFAF9] rounded-md border border-[#E5E5E5]">
            <div className="text-[10px] text-[#737373] uppercase font-bold">Signatory Network IP</div>
            <div className="font-semibold text-[#171717] mt-0.5 font-mono text-[11px]">
              {agreement.signatureIpAddress}
            </div>
            <div className="text-[10px] text-[#737373]">Geotargeted Audit Logged</div>
          </div>
        </div>

        <div className="p-3 bg-stone-50 border border-stone-200 rounded-md text-[11px] space-y-1">
          <div className="font-mono text-[#737373] break-all">
            <strong className="text-[#171717]">Cryptographic Signature Hash:</strong> {agreement.verificationHash}
          </div>
          <div className="text-[10px] text-[#737373]">
            This cryptographic hash serves as non-repudiation proof certifying that terms have not been altered post-signature.
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs border-t border-[#E5E5E5]">
          <span className="text-[#525252]">
            Need to update company legal representation or signatories?
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleDownloadPdf}
              leftIcon={<Download size={13} />}
            >
              Export Signed PDF
            </Button>
            <Link to="/panel/organization/profile">
              <Button variant="outline" size="sm">
                Update Corporate Profile
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Legal Text Modal */}
      <Modal
        isOpen={isLegalModalOpen}
        onClose={() => setIsLegalModalOpen(false)}
        title="Marketplace Commercial Agreement — Complete Legal Text"
        maxWidth="max-w-3xl"
        footer={
          <div className="flex items-center justify-between w-full">
            <span className="text-[11px] text-[#737373] font-mono">
              Ref: {agreement.agreementCode}
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleDownloadPdf}
                leftIcon={<Download size={13} />}
              >
                Download PDF
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsLegalModalOpen(false)}
              >
                Close Viewer
              </Button>
            </div>
          </div>
        }
      >
        <div className="space-y-4 text-xs text-[#262626] leading-relaxed">
          <div className="p-3 bg-stone-50 border border-stone-200 rounded-md">
            <div className="font-bold text-[#171717]">{agreement.agreementCode}</div>
            <div className="text-[11px] text-[#525252]">
              Parties: {agreement.platformLegalName} &amp; {agreement.providerLegalName}
            </div>
          </div>

          {agreementClauses.map((clause) => (
            <div key={clause.id} className="space-y-1.5 border-b border-[#E5E5E5] pb-3">
              <div className="font-bold text-[#171717]">
                {clause.number} {clause.title}
              </div>
              <p className="whitespace-pre-line text-[#525252]">{clause.body}</p>
            </div>
          ))}

          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-md text-[11px] text-emerald-900 space-y-0.5">
            <strong>Digitally Executed:</strong> Signed by {agreement.signatoryName} ({agreement.signatoryDesignation}) on {new Date(agreement.signatureTimestamp).toLocaleDateString('en-IN')}.
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MarketplaceAgreementPage;
