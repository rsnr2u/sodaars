import React, { useState } from 'react';
import {
  CreditCard,
  ArrowUpRight,
  Info,
  ShieldCheck,
  CheckCircle2,
  Download,
  Calendar,
  Sparkles,
  FileText,
  Check,
  HelpCircle,
} from 'lucide-react';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '../../../components/ui/Table';
import {
  CANONICAL_SUBSCRIPTION_DATA,
  SUBSCRIPTION_PLANS,
  SAMPLE_SUBSCRIPTION_INVOICES,
  SubscriptionInvoice,
} from '../../types/subscription';

export const SubscriptionPage: React.FC = () => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [invoices] = useState<SubscriptionInvoice[]>(SAMPLE_SUBSCRIPTION_INVOICES);

  const quota = CANONICAL_SUBSCRIPTION_DATA;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleDownloadInvoice = (invoiceNumber: string) => {
    showToast(`Downloading Tax Invoice ${invoiceNumber}.pdf...`);
  };

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
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#EA580C]">
            Organization Administration
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-[#171717] tracking-tight">
            Subscription & Inventory Quota
          </h1>
          <p className="text-xs text-[#525252] mt-0.5">
            Active SaaS subscription tier, registered inventory capacity quota, monthly billing schedule, and tax invoice ledger.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => showToast('Invoicing billing method is set to Auto-Debit.')}
            leftIcon={<CreditCard size={14} />}
          >
            Billing Settings
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsUpgradeModalOpen(true)}
            rightIcon={<ArrowUpRight size={14} />}
          >
            Upgrade Tier
          </Button>
        </div>
      </div>
        {/* Quota Accounting Rule Explainer Banner */}
        <div className="p-4 rounded-lg bg-orange-50/70 border border-orange-200/80 flex items-start gap-3 shadow-xs">
          <Info size={18} className="text-[#EA580C] shrink-0 mt-0.5" />
          <div className="text-xs text-[#525252] leading-relaxed">
            <strong className="text-[#171717]">Canonical Quota Accounting Rule:</strong> The Provider subscription tier is strictly anchored to <strong>TOTAL REGISTERED RESOURCES</strong> (Active + Inactive combined). Even when an advertising asset is undergoing maintenance, temporarily vacant, or seasonal, it counts toward your provider capacity quota.
          </div>
        </div>

        {/* Total Registered Resource Capacity Meter Card */}
        <div className="bg-white rounded-lg border border-[#E5E5E5] p-5 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#EA580C]">
                  Live Capacity Quota
                </span>
                <Badge variant="active" size="sm">
                  {quota.billingStatus} Subscription
                </Badge>
              </div>
              <h2 className="text-lg font-bold text-[#171717] mt-0.5">
                Registered Resource Capacity Meter
              </h2>
              <p className="text-xs text-[#737373]">
                Your current active plan ({quota.tierName}) permits up to {quota.tierLimit} physical static advertising resources.
              </p>
            </div>

            <div className="text-right sm:self-center shrink-0">
              <div className="text-2xl font-black text-[#171717]">
                {quota.totalRegistered} <span className="text-sm font-semibold text-[#737373]">/ {quota.tierLimit}</span>
              </div>
              <div className="text-xs font-semibold text-[#EA580C]">
                {quota.percentageUsed}% Capacity Utilized
              </div>
            </div>
          </div>

          {/* Segmented Progress Bar */}
          <div className="space-y-2">
            <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden flex shadow-inner">
              {/* Active portion */}
              <div
                style={{ width: `${(quota.activeCount / quota.tierLimit) * 100}%` }}
                className="bg-[#EA580C] h-full transition-all duration-500"
                title={`${quota.activeCount} Active Resources`}
              />
              {/* Inactive portion */}
              <div
                style={{ width: `${(quota.inactiveCount / quota.tierLimit) * 100}%` }}
                className="bg-amber-400 h-full transition-all duration-500"
                title={`${quota.inactiveCount} Inactive Resources`}
              />
            </div>

            {/* Threshold Indicators & Legend */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#EA580C]" />
                  <span className="text-[#171717] font-semibold">{quota.activeCount} Active Displays</span>
                  <span className="text-[11px] text-[#737373]">(Mounted or available)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span className="text-[#171717] font-semibold">{quota.inactiveCount} Inactive Displays</span>
                  <span className="text-[11px] text-[#737373]">(Vacant / maintenance)</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {quota.remainingSlots} Slots Available
                </span>
                <span className="text-[#737373]">before Tier 2 ceiling</span>
              </div>
            </div>
          </div>
        </div>

        {/* Current Active Plan Summary & Commercial Guarantees */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Plan Detail Card (Col span 2) */}
          <div className="lg:col-span-2 bg-white rounded-lg border border-[#E5E5E5] p-5 shadow-xs flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#EA580C]">
                      Active Subscription
                    </span>
                    <Badge variant="brand" size="sm">
                      Tier 2 Plan
                    </Badge>
                  </div>
                  <h3 className="text-base font-bold text-[#171717] mt-0.5">
                    Apex Media Networks — Operational SaaS License
                  </h3>
                  <p className="text-xs text-[#737373]">
                    Includes all 5 Core Solutions, double-booking prevention, work order dispatch, and marketplace syndication.
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xl font-bold text-[#EA580C]">₹8,999</div>
                  <div className="text-[11px] text-[#737373]">+ 18% GST / month</div>
                  <div className="text-[11px] font-medium text-[#171717] mt-0.5">₹10,618.82 Total</div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-[#E5E5E5] text-xs">
                <div className="p-3 bg-[#FAFAF9] rounded-md border border-[#E5E5E5]">
                  <div className="text-[10px] text-[#737373] uppercase font-bold">Billing Cycle</div>
                  <div className="font-semibold text-[#171717] mt-0.5">Monthly Auto-Renewal</div>
                  <div className="text-[10px] text-[#737373]">Renews 1st of every month</div>
                </div>

                <div className="p-3 bg-[#FAFAF9] rounded-md border border-[#E5E5E5]">
                  <div className="text-[10px] text-[#737373] uppercase font-bold flex items-center gap-1">
                    <Calendar size={11} /> Next Invoice Date
                  </div>
                  <div className="font-semibold text-[#171717] mt-0.5">
                    {new Date(quota.renewalDate).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </div>
                  <div className="text-[10px] text-emerald-600 font-medium">Auto-debit scheduled</div>
                </div>

                <div className="p-3 bg-[#FAFAF9] rounded-md border border-[#E5E5E5]">
                  <div className="text-[10px] text-[#737373] uppercase font-bold flex items-center gap-1">
                    <CreditCard size={11} /> Payment Method
                  </div>
                  <div className="font-semibold text-[#171717] mt-0.5">HDFC NetBanking</div>
                  <div className="text-[10px] text-[#737373]">Corp A/c ending in ••••4192</div>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-[#E5E5E5] flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="text-[#525252]">
                Need to register more than 100 advertising resources?
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsUpgradeModalOpen(true)}
                rightIcon={<ArrowUpRight size={13} />}
              >
                Inquire Enterprise (&gt;100 Assets)
              </Button>
            </div>
          </div>

          {/* Strict Commercial Guarantees Card (Col span 1) */}
          <div className="bg-white rounded-lg border border-[#E5E5E5] p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck size={18} className="text-[#EA580C]" />
                <h3 className="text-sm font-bold text-[#171717]">
                  Commercial Guarantees
                </h3>
              </div>
              <p className="text-xs text-[#737373] mb-4">
                SODAARS provides transparent SaaS licensing with strict fee protections:
              </p>

              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-2.5">
                  <Check size={14} className="text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <strong className="text-[#171717]">₹0 Setup & Onboarding Fees:</strong>
                    <p className="text-[#737373] text-[11px]">Zero charges for catalog migration or platform setup.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Check size={14} className="text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <strong className="text-[#171717]">0% Booking Commissions:</strong>
                    <p className="text-[#737373] text-[11px]">Keep 100% of revenue from your direct corporate client bookings.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Check size={14} className="text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <strong className="text-[#171717]">All 5 Solutions Included:</strong>
                    <p className="text-[#737373] text-[11px]">No feature gating on Resource, Availability, CRM, or POP execution.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Check size={14} className="text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <strong className="text-[#171717]">Marketplace Decoupled:</strong>
                    <p className="text-[#737373] text-[11px]">Listing on public marketplace incurs zero subscription tier increase.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#E5E5E5] text-[11px] text-[#737373] flex items-center gap-1.5">
              <HelpCircle size={13} className="shrink-0" />
              <span>Reference document: Specification 18 (Subscription & Billing).</span>
            </div>
          </div>
        </div>

        {/* Subscription Tier Comparison Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#171717]">
                SODAARS Fixed Monthly SaaS Tiers
              </h3>
              <p className="text-xs text-[#737373]">
                Transparent tiers scaled to your total registered physical display capacity.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {SUBSCRIPTION_PLANS.map((plan) => {
              const isCurrent = plan.id === 'tier_2';
              return (
                <div
                  key={plan.id}
                  className={`bg-white rounded-lg p-5 flex flex-col justify-between transition-all relative ${
                    isCurrent
                      ? 'border-2 border-[#EA580C] shadow-md ring-2 ring-[#EA580C]/10'
                      : 'border border-[#E5E5E5] shadow-xs'
                  }`}
                >
                  {isCurrent && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-[#EA580C] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full shadow-xs">
                        Current Active Plan
                      </span>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-base font-bold text-[#171717]">{plan.name}</h4>
                        <div className="text-xs font-semibold text-[#EA580C]">{plan.assetRange}</div>
                      </div>
                      <Badge variant={isCurrent ? 'brand' : 'inactive'} size="sm">
                        {plan.badge}
                      </Badge>
                    </div>

                    <div className="py-2 border-y border-[#E5E5E5]">
                      {plan.monthlyFee > 0 ? (
                        <div>
                          <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-black text-[#171717]">
                              ₹{plan.monthlyFee.toLocaleString('en-IN')}
                            </span>
                            <span className="text-xs text-[#737373]">/ month</span>
                          </div>
                          <div className="text-[11px] text-[#737373]">
                            + 18% GST (₹{plan.totalMonthly.toLocaleString('en-IN')} all inclusive)
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="text-2xl font-black text-[#171717]">Custom</div>
                          <div className="text-[11px] text-[#737373]">Dedicated Enterprise Agreement</div>
                        </div>
                      )}
                    </div>

                    <p className="text-xs text-[#525252] leading-relaxed">
                      {plan.description}
                    </p>

                    <ul className="space-y-2 text-xs text-[#171717]">
                      {plan.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check size={14} className="text-[#EA580C] mt-0.5 shrink-0" />
                          <span className="text-[#525252]">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-5 mt-5 border-t border-[#E5E5E5]">
                    {isCurrent ? (
                      <Button
                        variant="secondary"
                        size="sm"
                        disabled
                        className="w-full bg-[#FAFAF9] text-[#737373] cursor-default"
                      >
                        Active Plan
                      </Button>
                    ) : plan.monthlyFee < 8999 ? (
                      <Button
                        variant="secondary"
                        size="sm"
                        disabled
                        className="w-full text-[#737373] opacity-60"
                      >
                        Previous Tier
                      </Button>
                    ) : (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => setIsUpgradeModalOpen(true)}
                        className="w-full"
                        rightIcon={<ArrowUpRight size={14} />}
                      >
                        Contact Sales
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Invoice & Billing History Table */}
        <Card
          header={
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <FileText size={17} className="text-[#EA580C]" />
                <div>
                  <h3 className="text-sm font-bold text-[#171717]">
                    Tax Invoices & Billing Ledger
                  </h3>
                  <p className="text-[11px] text-[#737373]">
                    Monthly statutory Indian GST tax invoices generated automatically on the 1st of each month.
                  </p>
                </div>
              </div>
              <Badge variant="active" size="sm">
                4 Invoices Paid & Reconciled
              </Badge>
            </div>
          }
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Invoice Date</TableHead>
                <TableHead>Billing Period</TableHead>
                <TableHead>Plan / Description</TableHead>
                <TableHead className="text-right">Total (Incl. 18% GST)</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((inv) => (
                <TableRow key={inv.id}>
                  <TableCell className="font-mono font-semibold text-xs text-[#171717]">
                    {inv.invoiceNumber}
                  </TableCell>
                  <TableCell className="text-xs text-[#737373]">
                    {new Date(inv.invoiceDate).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </TableCell>
                  <TableCell className="text-xs text-[#525252]">
                    {inv.billingPeriod}
                  </TableCell>
                  <TableCell className="text-xs font-medium text-[#171717]">
                    {inv.planName}
                  </TableCell>
                  <TableCell className="text-right text-xs font-bold text-[#171717]">
                    ₹{inv.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="active" size="sm">
                      {inv.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownloadInvoice(inv.invoiceNumber)}
                      leftIcon={<Download size={13} />}
                      className="text-xs text-[#EA580C] hover:text-[#C2410C] hover:bg-orange-50"
                    >
                      PDF
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

      {/* Upgrade / Enterprise Modal */}
      <Modal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        title="Upgrade Subscription Tier"
        footer={
          <>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsUpgradeModalOpen(false)}
            >
              Close
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setIsUpgradeModalOpen(false);
                showToast('Your Enterprise upgrade request has been sent to the SODAARS account management team.');
              }}
            >
              Submit Upgrade Request
            </Button>
          </>
        }
      >
        <div className="space-y-4 text-xs">
          <div className="p-3 bg-stone-50 border border-stone-200 rounded-md space-y-1">
            <div className="font-bold text-[#171717] flex items-center gap-1.5">
              <Sparkles size={14} className="text-[#EA580C]" />
              Enterprise Tier (&gt;100 Registered Resources)
            </div>
            <p className="text-[#525252]">
              For outdoor media concessionaires operating statewide or national display networks exceeding 100 physical static displays.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-[#171717]">Enterprise Inclusions:</h4>
            <ul className="space-y-1.5 text-[#525252]">
              <li className="flex items-center gap-1.5">
                <Check size={13} className="text-emerald-600 shrink-0" />
                <span>Unlimited registered physical displays across multiple urban centers.</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Check size={13} className="text-emerald-600 shrink-0" />
                <span>Multi-region organizational hierarchy and regional manager access.</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Check size={13} className="text-emerald-600 shrink-0" />
                <span>Priority 24/7 technical operations SLA and dedicated accounts director.</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Check size={13} className="text-emerald-600 shrink-0" />
                <span>Dedicated ERP billing sync and automated webhook feeds.</span>
              </li>
            </ul>
          </div>

          <div className="p-3 bg-orange-50 border border-orange-200 rounded-md text-[11px] text-[#525252]">
            <strong className="text-[#171717]">Current Status:</strong> Your organization has registered <strong>70 resources</strong> against your Tier 2 allowance of <strong>100 resources</strong>. You still have <strong>30 slots</strong> before mandatory tier upgrade.
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SubscriptionPage;
