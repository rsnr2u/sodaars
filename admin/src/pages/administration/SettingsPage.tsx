import React, { useState } from 'react';
import { 
  Sliders, 
  Save, 
  CheckCircle2, 
  AlertTriangle, 
  Percent, 
  Lock, 
  Clock, 
  Building2, 
  Receipt, 
  CreditCard, 
  Mail, 
  ShieldCheck,
  Check
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [platformFee, setPlatformFee] = useState<string>('5.0');
  const [kycMandatory, setKycMandatory] = useState<boolean>(true);
  const [autoBlockDiscrepancy, setAutoBlockDiscrepancy] = useState<boolean>(true);
  const [sessionTimeoutHours, setSessionTimeoutHours] = useState<string>('8');
  
  // Platform entity settings
  const [companyName, setCompanyName] = useState('SODAARS TECHNOLOGIES INDIA PVT LTD');
  const [gstin, setGstin] = useState('27AABCS9912Q1ZX');
  const [cin, setCin] = useState('U74300MH2025PTC399120');
  const [supportEmail, setSupportEmail] = useState('support@sodaars.com');
  const [sacCode, setSacCode] = useState('998315');
  const [gstRate, setGstRate] = useState('18');

  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight font-sans">
            Settings
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Platform configuration, company legal details, commission fees, and tax settings.
          </p>
        </div>

        {saved && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Settings Saved Successfully</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">

        {/* Card 1: Platform Corporate & Tax Identity */}
        <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-3 pb-3 border-b border-zinc-100">
            <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-zinc-950 text-sm">Company Legal Profile & Statutory Tax Settings</h3>
              <p className="text-xs text-zinc-500">Legal entity information printed on official GST Tax Invoices issued to providers</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-zinc-700 mb-1">Company Legal Entity Name</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-zinc-300 focus:outline-none focus:border-orange-500 font-sans"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-700 mb-1">Platform Support / Billing Email</label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-zinc-300 focus:outline-none focus:border-orange-500 font-sans"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-700 mb-1">Goods & Services Tax (GSTIN)</label>
              <input
                type="text"
                value={gstin}
                onChange={(e) => setGstin(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-zinc-300 focus:outline-none focus:border-orange-500 font-mono font-bold"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-700 mb-1">Corporate Identification Number (CIN)</label>
              <input
                type="text"
                value={cin}
                onChange={(e) => setCin(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-zinc-300 focus:outline-none focus:border-orange-500 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-700 mb-1">Default SaaS SAC Code</label>
              <input
                type="text"
                value={sacCode}
                onChange={(e) => setSacCode(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-zinc-300 focus:outline-none focus:border-orange-500 font-mono"
              />
              <span className="text-[10px] text-zinc-400 mt-1 block">SAC 998315: Hosting and IT Infrastructure Services</span>
            </div>

            <div>
              <label className="block font-semibold text-zinc-700 mb-1">Standard GST Rate (%)</label>
              <div className="relative">
                <input
                  type="number"
                  value={gstRate}
                  onChange={(e) => setGstRate(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-zinc-300 focus:outline-none focus:border-orange-500 font-mono"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 font-mono">%</span>
              </div>
              <span className="text-[10px] text-zinc-400 mt-1 block">9.0% CGST + 9.0% SGST (or 18% IGST)</span>
            </div>
          </div>
        </div>

        {/* Card 2: Platform Commission & Settlement */}
        <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-3 pb-3 border-b border-zinc-100">
            <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
              <Percent className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-zinc-950 text-sm">Platform Commission Schedule</h3>
              <p className="text-xs text-zinc-500">Base take-rate applied to marketplace bookings and provider settlements</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-zinc-700 mb-1">Standard Take Rate (%)</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  value={platformFee}
                  onChange={(e) => setPlatformFee(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-zinc-300 focus:outline-none focus:border-orange-500 font-mono"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 font-mono">%</span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-1">Default 5.0% for Tier 1 and Tier 2 cities</p>
            </div>

            <div>
              <label className="block font-semibold text-zinc-700 mb-1">Escrow Release Grace Period</label>
              <input
                type="text"
                disabled
                value="48 Hours Post-Mounting Verification"
                className="w-full p-2.5 rounded-lg bg-zinc-50 border border-zinc-200 text-zinc-500 font-mono"
              />
              <p className="text-[11px] text-zinc-400 mt-1">Proof of installation required before disbursement</p>
            </div>
          </div>
        </div>

        {/* Card 3: Payment Gateway Status */}
        <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-zinc-950 text-sm">Payment Gateway Integrations</h3>
                <p className="text-xs text-zinc-500">Razorpay & Cashfree auto-debit webhooks for package billing</p>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
              GATEWAY CONNECTED
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/80 space-y-1">
              <span className="text-[10px] uppercase font-bold text-zinc-400 block">Primary Gateway</span>
              <strong className="text-zinc-900 block font-sans">Razorpay Payments India</strong>
              <span className="text-[11px] text-zinc-500">Key ID: rzp_live_99182****</span>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/80 space-y-1">
              <span className="text-[10px] uppercase font-bold text-zinc-400 block">Webhook Status</span>
              <strong className="text-emerald-700 block font-sans flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Live & Receiving Events
              </strong>
              <span className="text-[11px] text-zinc-500">Events: invoice.paid, sub.renewed</span>
            </div>
          </div>
        </div>

        {/* Card 4: Compliance & KYC Guardrails */}
        <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-3 pb-3 border-b border-zinc-100">
            <div className="w-8 h-8 rounded-lg bg-zinc-100 text-zinc-800 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-zinc-950 text-sm">Compliance & Verification Guardrails</h3>
              <p className="text-xs text-zinc-500">Rules enforced before a provider can publish inventory / resource listings</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-start gap-3 p-3 rounded-xl border border-zinc-200 hover:bg-zinc-50 cursor-pointer">
              <input
                type="checkbox"
                checked={kycMandatory}
                onChange={(e) => setKycMandatory(e.target.checked)}
                className="mt-0.5 rounded text-orange-600 focus:ring-orange-500"
              />
              <div>
                <span className="font-bold text-zinc-900 block">Strict GSTIN & PAN Mandate</span>
                <span className="text-zinc-500 text-[11px]">
                  Providers cannot make inventory discoverable until verified by a Compliance Officer.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 rounded-xl border border-zinc-200 hover:bg-zinc-50 cursor-pointer">
              <input
                type="checkbox"
                checked={autoBlockDiscrepancy}
                onChange={(e) => setAutoBlockDiscrepancy(e.target.checked)}
                className="mt-0.5 rounded text-orange-600 focus:ring-orange-500"
              />
              <div>
                <span className="font-bold text-zinc-900 block">Auto-Hold on GPS Discrepancy &gt; 150m</span>
                <span className="text-zinc-500 text-[11px]">
                  Automatically places administrative hold if uploaded hoarding photo EXIF coordinates deviate from declared location.
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Card 5: Security & Session */}
        <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-3 pb-3 border-b border-zinc-100">
            <div className="w-8 h-8 rounded-lg bg-zinc-100 text-zinc-800 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-zinc-950 text-sm">Security & Staff Sessions</h3>
              <p className="text-xs text-zinc-500">Session idle expiration and audit retention settings</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-zinc-700 mb-1">Admin Idle Session Timeout</label>
              <select
                value={sessionTimeoutHours}
                onChange={(e) => setSessionTimeoutHours(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-zinc-300 focus:outline-none focus:border-orange-500"
              >
                <option value="4">4 Hours (Strict Security)</option>
                <option value="8">8 Hours (Standard Operations Shift)</option>
                <option value="12">12 Hours (Extended Shift)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-zinc-700 mb-1">Audit Log Retention Policy</label>
              <input
                type="text"
                disabled
                value="7 Years (Statutory Indian IT Act Mandate)"
                className="w-full p-2.5 rounded-lg bg-zinc-50 border border-zinc-200 text-zinc-500 font-mono"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold shadow-sm transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
