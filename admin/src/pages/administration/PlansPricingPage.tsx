import React, { useState, useMemo } from 'react';
import { 
  CreditCard, 
  Plus, 
  CheckCircle2, 
  Layers, 
  TrendingUp, 
  Users, 
  ShieldCheck, 
  Zap, 
  Edit3, 
  Trash2, 
  Sparkles,
  ToggleLeft,
  ToggleRight,
  X,
  Sliders,
  Check,
  Search,
  ArrowRight
} from 'lucide-react';

export interface SaaSPlan {
  id: string;
  code: string;
  name: string;
  description: string;
  monthlyPrice: number;
  annualPrice: number;
  quotaMin: number;
  quotaMax: number | 'Unlimited';
  userSeats: number;
  isPopular?: boolean;
  isActive: boolean;
  subscribersCount: number;
  features: string[];
}


export const ANNUAL_DISCOUNT_PRESETS = [
  { label: '0% (None)', value: 0 },
  { label: '10% OFF', value: 10 },
  { label: '15% OFF', value: 15 },
  { label: '2 Months Free (16.7%)', value: 16.7, isMonthsFree: true },
  { label: '20% OFF', value: 20 },
  { label: '25% OFF', value: 25 },
];

export const formatQuotaDisplay = (min: number, max: number | 'Unlimited') => {
  if (max === 'Unlimited' || max === null || Number(max) >= 99999) {
    return `${min}+ Resources`;
  }
  return `${min} - ${max} Resources`;
};

export const calculateAnnualDiscount = (monthly: number, annual: number) => {
  if (monthly <= 0 || annual <= 0) return { percent: 0, savings: 0, isTwoMonthsFree: false };
  const nominalAnnual = monthly * 12;
  const savings = nominalAnnual - annual;
  if (savings <= 0) return { percent: 0, savings: 0, isTwoMonthsFree: false };

  const percent = (savings / nominalAnnual) * 100;
  // If annual == monthly * 10, that is exactly 2 months free (10 months paid)
  const isTwoMonthsFree = annual === monthly * 10;
  return {
    percent: Number(percent.toFixed(1)),
    savings,
    isTwoMonthsFree,
  };
};

export const formatDiscountBadge = (monthly: number, annual: number) => {
  const { percent, savings, isTwoMonthsFree } = calculateAnnualDiscount(monthly, annual);
  if (savings <= 0 || percent <= 0) return null;
  if (isTwoMonthsFree) {
    return 'Save 16.7% (2 Months Free)';
  }
  if (percent % 1 === 0) {
    return `Save ${percent.toFixed(0)}% (₹${savings.toLocaleString('en-IN')})`;
  }
  return `Save ${percent.toFixed(1)}% (₹${savings.toLocaleString('en-IN')})`;
};

export const PlansPricingPage: React.FC = () => {
  const [plans, setPlans] = useState<SaaSPlan[]>([
    {
      id: 'PLN-01',
      code: 'STARTER',
      name: 'Starter OOH',
      description: 'Essential operating tools for independent media owners managing portfolios of up to 50 inventory resources.',
      monthlyPrice: 0,
      annualPrice: 0,
      quotaMin: 0,
      quotaMax: 50,
      userSeats: 2,
      isActive: true,
      subscribersCount: 14,
      features: [
        'Quota Range: 0 - 50 Inventory / Resources',
        'Direct Quotation & Invoice Generator',
        'Standard KYC Document Verification',
        'Mobile Web Responsive Access',
        'Email Support (48h SLA)',
      ],
    },
    {
      id: 'PLN-02',
      code: 'GROWTH',
      name: 'Growth Network',
      description: 'Workflow automation, digital booking engine, and GST billing for networks managing 51 to 100 inventory resources.',
      monthlyPrice: 9999,
      annualPrice: 99990,
      quotaMin: 51,
      quotaMax: 100,
      userSeats: 5,
      isActive: true,
      subscribersCount: 18,
      features: [
        'Quota Range: 51 - 100 Inventory / Resources',
        'Live WhatsApp Status & Mounting Alerts',
        'Automated GST Invoicing & Tax Ledgers',
        'Staff Permission Sub-Accounts (5 Seats)',
        'Standard Municipal Compliance Tracking',
      ],
    },
    {
      id: 'PLN-03',
      code: 'PRO_NETWORK',
      name: 'Professional Network',
      description: 'Comprehensive multi-city management, priority KYC audit, and team permissions for 101 to 150 inventory resources.',
      monthlyPrice: 16999,
      annualPrice: 169990,
      quotaMin: 101,
      quotaMax: 150,
      userSeats: 8,
      isPopular: true,
      isActive: true,
      subscribersCount: 26,
      features: [
        'Quota Range: 101 - 150 Inventory / Resources',
        'Priority KYC Audit (Same-day clearance)',
        'Interactive Availability Calendar Export',
        'Staff Permission Sub-Accounts (8 Seats)',
        'Direct Agency Shareable Ratecards',
        'Custom Invoicing Rules & Client CRM',
      ],
    },
    {
      id: 'PLN-04',
      code: 'REGIONAL',
      name: 'Regional Scale',
      description: 'Advanced capacity management, municipal compliance tracking, and direct ratecards for 151 to 200 inventory resources.',
      monthlyPrice: 24999,
      annualPrice: 249990,
      quotaMin: 151,
      quotaMax: 200,
      userSeats: 12,
      isActive: true,
      subscribersCount: 7,
      features: [
        'Quota Range: 151 - 200 Inventory / Resources',
        'Municipal Regulatory Notice Tracker',
        'Advanced Revenue & Occupancy Reports',
        '12 Team Seats with Audit Trails',
        'Bulk CSV / Excel Inventory Sync',
      ],
    },
    {
      id: 'PLN-05',
      code: 'ENTERPRISE',
      name: 'Enterprise Conglomerate',
      description: 'High-volume infrastructure for large regional media firms and DOOH networks managing 201+ inventory resources.',
      monthlyPrice: 49999,
      annualPrice: 499990,
      quotaMin: 201,
      quotaMax: 'Unlimited',
      userSeats: 25,
      isActive: true,
      subscribersCount: 8,
      features: [
        'Quota Range: 201+ Inventory / Resources (Unlimited)',
        'Hardware CMS Bridge & Screen Heartbeat API',
        'Dedicated SLA & Named Account Manager',
        'Custom Tri-party Escrow Settlement Terms',
        'Bulk CSV / Excel Inventory Synchronization',
        '25 Operational Staff Team Seats',
      ],
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SaaSPlan | null>(null);
  const [discountPercent, setDiscountPercent] = useState<number>(16.7);

  // Range filter state
  const [quotaFilter, setQuotaFilter] = useState<string>('all');
  const [search, setSearch] = useState<string>('');

  const [formData, setFormData] = useState<{
    code: string;
    name: string;
    description: string;
    monthlyPrice: number;
    annualPrice: number;
    quotaMin: number;
    quotaMax: number | 'Unlimited';
    isUnlimited: boolean;
    userSeats: number;
    features: string;
  }>({
    code: '',
    name: '',
    description: '',
    monthlyPrice: 9999,
    annualPrice: 99990,
    quotaMin: 0,
    quotaMax: 50,
    isUnlimited: false,
    userSeats: 3,
    features: 'Quota Range: 0 - 50 Inventory / Resources\nDirect Quotation Engine\nAutomated Invoicing\nWhatsApp Alerts',
  });

  const totalMRR = plans.reduce((acc, p) => acc + (p.monthlyPrice * p.subscribersCount), 0);
  const totalSubscribers = plans.reduce((acc, p) => acc + p.subscribersCount, 0);

  const handleOpenAddModal = () => {
    setEditingPlan(null);
    setDiscountPercent(16.7);
    setFormData({
      code: '',
      name: '',
      description: '',
      monthlyPrice: 9999,
      annualPrice: 99990,
      quotaMin: 0,
      quotaMax: 50,
      isUnlimited: false,
      userSeats: 3,
      features: 'Quota Range: 0 - 50 Inventory / Resources\nDirect Quotation Engine\nAutomated Invoicing\nWhatsApp Alerts',
    });
    setShowModal(true);
  };

  const handleMonthlyChange = (newMonthly: number) => {
    const safeMonthly = Math.max(0, newMonthly);
    let newAnnual = safeMonthly * 12;
    if (discountPercent > 0) {
      if (Math.abs(discountPercent - 16.7) < 0.1 || Math.abs(discountPercent - 16.6667) < 0.2) {
        newAnnual = safeMonthly * 10;
      } else {
        newAnnual = Math.round(safeMonthly * 12 * (1 - discountPercent / 100));
      }
    }
    setFormData((prev) => ({
      ...prev,
      monthlyPrice: safeMonthly,
      annualPrice: newAnnual,
    }));
  };

  const handleDiscountPercentChange = (newPercent: number) => {
    const safePercent = Math.min(100, Math.max(0, newPercent));
    setDiscountPercent(safePercent);
    const safeMonthly = formData.monthlyPrice;
    let newAnnual = safeMonthly * 12;
    if (safePercent > 0) {
      if (Math.abs(safePercent - 16.7) < 0.1 || Math.abs(safePercent - 16.6667) < 0.2) {
        newAnnual = safeMonthly * 10;
      } else {
        newAnnual = Math.round(safeMonthly * 12 * (1 - safePercent / 100));
      }
    }
    setFormData((prev) => ({
      ...prev,
      annualPrice: newAnnual,
    }));
  };

  const handleAnnualChange = (newAnnual: number) => {
    const safeAnnual = Math.max(0, newAnnual);
    const safeMonthly = formData.monthlyPrice;
    let computedDisc = 0;
    if (safeMonthly > 0) {
      const nominal = safeMonthly * 12;
      if (safeAnnual < nominal) {
        if (safeAnnual === safeMonthly * 10) {
          computedDisc = 16.7;
        } else {
          computedDisc = Number((((nominal - safeAnnual) / nominal) * 100).toFixed(1));
        }
      }
    }
    setDiscountPercent(computedDisc);
    setFormData((prev) => ({
      ...prev,
      annualPrice: safeAnnual,
    }));
  };

  const applyDiscountPreset = (preset: typeof ANNUAL_DISCOUNT_PRESETS[0]) => {
    setDiscountPercent(preset.value);
    const safeMonthly = formData.monthlyPrice;
    let newAnnual = safeMonthly * 12;
    if (preset.isMonthsFree) {
      newAnnual = safeMonthly * 10;
    } else {
      newAnnual = Math.round(safeMonthly * 12 * (1 - preset.value / 100));
    }
    setFormData((prev) => ({
      ...prev,
      annualPrice: newAnnual,
    }));
  };


  const handleSavePlan = (e: React.FormEvent) => {
    e.preventDefault();
    const finalQuotaMax = formData.isUnlimited ? 'Unlimited' : Number(formData.quotaMax);
    const featureList = formData.features.split('\n').filter((f) => f.trim().length > 0);

    if (editingPlan) {
      setPlans(plans.map((p) => p.id === editingPlan.id ? {
        ...p,
        name: formData.name,
        code: formData.code.toUpperCase(),
        description: formData.description,
        monthlyPrice: Number(formData.monthlyPrice),
        annualPrice: Number(formData.annualPrice),
        quotaMin: Number(formData.quotaMin),
        quotaMax: finalQuotaMax,
        userSeats: Number(formData.userSeats),
        features: featureList,
      } : p));
    } else {
      const newPlan: SaaSPlan = {
        id: `PLN-0${plans.length + 1}`,
        code: formData.code.toUpperCase() || `TIER_${plans.length + 1}`,
        name: formData.name,
        description: formData.description,
        monthlyPrice: Number(formData.monthlyPrice),
        annualPrice: Number(formData.annualPrice),
        quotaMin: Number(formData.quotaMin),
        quotaMax: finalQuotaMax,
        userSeats: Number(formData.userSeats),
        isActive: true,
        subscribersCount: 0,
        features: featureList,
      };
      setPlans([...plans, newPlan]);
    }
    setShowModal(false);
  };

  const handleTogglePlanStatus = (planId: string) => {
    setPlans(plans.map((p) => p.id === planId ? { ...p, isActive: !p.isActive } : p));
  };

  // Dynamically extract distinct quota ranges from configured packages
  const availableQuotaRanges = useMemo(() => {
    const seen = new Set<string>();
    const list: { id: string; label: string; min: number; max: number | 'Unlimited' }[] = [];
    
    plans.forEach((p) => {
      const key = `${p.quotaMin}-${p.quotaMax}`;
      if (!seen.has(key)) {
        seen.add(key);
        list.push({
          id: key,
          label: formatQuotaDisplay(p.quotaMin, p.quotaMax),
          min: p.quotaMin,
          max: p.quotaMax,
        });
      }
    });

    list.sort((a, b) => a.min - b.min);

    return [
      { id: 'all', label: 'All Packages', min: 0, max: 'Unlimited' as const },
      ...list,
    ];
  }, [plans]);

  // Filter plans based on search & quota range
  const filteredPlans = plans.filter((plan) => {
    const matchesSearch = 
      plan.name.toLowerCase().includes(search.toLowerCase()) ||
      plan.code.toLowerCase().includes(search.toLowerCase()) ||
      plan.description.toLowerCase().includes(search.toLowerCase());

    let matchesQuota = true;
    if (quotaFilter !== 'all') {
      const selected = availableQuotaRanges.find((r) => r.id === quotaFilter);
      if (selected) {
        matchesQuota = plan.quotaMin === selected.min && plan.quotaMax === selected.max;
      }
    }

    return matchesSearch && matchesQuota;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight font-sans">
              Packages & Plans
            </h1>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-semibold">
              {plans.length} ACTIVE PLANS
            </span>
          </div>
          <p className="text-sm text-zinc-500 mt-1">
            Configure platform SaaS subscription packages with custom manual inventory & resource quota ranges for each tier.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold shadow-sm transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Package</span>
        </button>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-5 bg-white rounded-2xl border border-zinc-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-zinc-400 uppercase font-mono">
            <span>Monthly Recurring Revenue (MRR)</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-zinc-950 font-sans tracking-tight">
            ₹{(totalMRR / 100000).toFixed(2)} Lakhs
          </div>
          <p className="text-xs text-zinc-500 pt-1">
            ARR Run-Rate: <strong className="text-zinc-800 font-mono">₹{((totalMRR * 12) / 100000).toFixed(2)} Lakhs / year</strong>
          </p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-zinc-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-zinc-400 uppercase font-mono">
            <span>Active Subscribers</span>
            <Users className="w-4 h-4 text-orange-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-zinc-950 font-sans tracking-tight">
            {totalSubscribers} Media Owners
          </div>
          <p className="text-xs text-zinc-500 pt-1">
            Highest tier: <strong className="text-zinc-800">Professional (101-150 Resources)</strong>
          </p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-zinc-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-zinc-400 uppercase font-mono">
            <span>Average Revenue Per Provider (ARPU)</span>
            <Zap className="w-4 h-4 text-orange-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-zinc-950 font-sans tracking-tight">
            ₹{Math.round(totalMRR / (totalSubscribers || 1)).toLocaleString('en-IN')}
          </div>
          <p className="text-xs text-zinc-500 pt-1">
            Manual quota tiers configured across <strong className="text-zinc-800 font-mono">{plans.length} packages</strong>
          </p>
        </div>
      </div>

      {/* Quota Range Filter & Search Bar */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 p-4 shadow-xs space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-wider">
              Inventory / Resource Quota:
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {availableQuotaRanges.map((q) => (
                <button
                  key={q.id}
                  onClick={() => setQuotaFilter(q.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-colors ${
                    quotaFilter === q.id
                      ? 'bg-zinc-950 text-white shadow-xs'
                      : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                  }`}
                >
                  {q.label}
                </button>
              ))}
            </div>
          </div>

          <div className="relative w-full lg:w-72">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search package name, code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-1.5 rounded-lg border border-zinc-200 focus:outline-none focus:border-orange-500 font-sans"
            />
          </div>
        </div>
      </div>

      {/* Package Tier Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredPlans.map((plan) => (
          <div
            key={plan.id}
            className={`bg-white rounded-2xl border transition-all flex flex-col justify-between p-6 relative ${
              plan.isPopular
                ? 'border-orange-500 shadow-md ring-1 ring-orange-500/50'
                : 'border-zinc-200 hover:border-zinc-300 shadow-xs'
            }`}
          >
            {plan.isPopular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-600 text-white text-[10px] uppercase font-bold tracking-wider px-3 py-0.5 rounded-full shadow-sm font-mono">
                Most Popular Tier
              </span>
            )}

            <div className="space-y-4">
              {/* Header: Code & Name */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-mono text-zinc-400 uppercase font-bold">{plan.code}</span>
                  <h3 className="text-lg font-bold text-zinc-950 mt-0.5">{plan.name}</h3>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-800">
                    {plan.subscribersCount} Subscribers
                  </span>
                </div>
              </div>

              {/* Inventory / Resource Quota Range Highlight Banner */}
              <div className="p-2.5 rounded-xl bg-orange-50/70 border border-orange-200/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-orange-600" />
                  <span className="text-xs font-mono font-bold text-orange-950">
                    Inventory / Resources:
                  </span>
                </div>
                <span className="px-2.5 py-0.5 rounded-md bg-white text-orange-700 font-mono font-extrabold text-xs border border-orange-200 shadow-2xs">
                  {formatQuotaDisplay(plan.quotaMin, plan.quotaMax)}
                </span>
              </div>

              <p className="text-xs text-zinc-600 min-h-[36px] leading-relaxed">
                {plan.description}
              </p>

              {/* Pricing */}
              <div className="pt-2 border-t border-zinc-100">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-extrabold text-zinc-950 font-sans">
                    {plan.monthlyPrice === 0 ? 'Free' : `₹${plan.monthlyPrice.toLocaleString('en-IN')}`}
                  </span>
                  <span className="text-xs text-zinc-400 font-mono">/ month</span>
                </div>
                {plan.annualPrice > 0 ? (
                  <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] text-zinc-600 font-mono">
                      ₹{plan.annualPrice.toLocaleString('en-IN')} billed annually
                    </span>
                    {formatDiscountBadge(plan.monthlyPrice, plan.annualPrice) && (
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
                        {formatDiscountBadge(plan.monthlyPrice, plan.annualPrice)}
                      </span>
                    )}
                  </div>
                ) : (
                  <p className="text-[11px] text-zinc-400 font-mono mt-0.5">
                    Free for independent media owners
                  </p>
                )}
              </div>

              {/* Core Limits Box */}
              <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-100 grid grid-cols-2 gap-2 text-xs font-mono">
                <div>
                  <span className="text-zinc-400 text-[10px] block uppercase font-bold">Inventory / Resources</span>
                  <strong className="text-orange-600 block font-sans text-xs font-extrabold">
                    {formatQuotaDisplay(plan.quotaMin, plan.quotaMax)}
                  </strong>
                </div>
                <div>
                  <span className="text-zinc-400 text-[10px] block uppercase font-bold">Staff Seats</span>
                  <strong className="text-zinc-900 block font-sans text-xs font-bold">{plan.userSeats} Users</strong>
                </div>
              </div>

              {/* Feature Checklist */}
              <div className="space-y-2 text-xs pt-2">
                <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider font-mono">
                  Included Features
                </span>
                {plan.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-zinc-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-orange-600 shrink-0 mt-0.5" />
                    <span className="leading-tight">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-5 border-t border-zinc-100 flex items-center justify-between text-xs mt-6">
              <button
                onClick={() => handleTogglePlanStatus(plan.id)}
                className={`text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded transition-colors ${
                  plan.isActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-zinc-100 text-zinc-500'
                }`}
              >
                {plan.isActive ? 'Active on Portal' : 'Archived'}
              </button>

              <button
                onClick={() => {
                  setEditingPlan(plan);
                  const discInfo = calculateAnnualDiscount(plan.monthlyPrice, plan.annualPrice);
                  setDiscountPercent(discInfo.percent);
                  setFormData({
                    code: plan.code,
                    name: plan.name,
                    description: plan.description,
                    monthlyPrice: plan.monthlyPrice,
                    annualPrice: plan.annualPrice,
                    quotaMin: plan.quotaMin,
                    quotaMax: plan.quotaMax,
                    isUnlimited: plan.quotaMax === 'Unlimited',
                    userSeats: plan.userSeats,
                    features: plan.features.join('\n'),
                  });
                  setShowModal(true);
                }}
                className="px-3 py-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-100 text-zinc-700 font-semibold flex items-center gap-1 shadow-2xs"
              >
                <Edit3 className="w-3 h-3 text-zinc-500" />
                <span>Edit Package</span>
              </button>
            </div>
          </div>
        ))}

        {filteredPlans.length === 0 && (
          <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-zinc-200 text-zinc-400 font-mono text-xs">
            No packages found matching the selected inventory/resource quota range.
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* PLAN BUILDER / EDIT MODAL                                 */}
      {/* ========================================================= */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-zinc-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-orange-600 block">
                  PACKAGE CONFIGURATION
                </span>
                <h3 className="font-bold text-zinc-950 text-base">
                  {editingPlan ? `Edit Package: ${editingPlan.name}` : 'Create New Subscription Package'}
                </h3>
              </div>
              <button onClick={() => setShowModal(false)} className="text-zinc-400 hover:text-zinc-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePlan} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-zinc-700 mb-1">Package Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Growth Network"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-zinc-300 focus:outline-none focus:border-orange-500 font-sans"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-zinc-700 mb-1">System Tier Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. GROWTH"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-zinc-300 focus:outline-none focus:border-orange-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Target audience, capacity scope, and benefits..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-zinc-300 focus:outline-none focus:border-orange-500 font-sans"
                />
              </div>

              {/* ========================================================= */}
              {/* MANUAL INVENTORY / RESOURCE QUOTA RANGE                   */}
              {/* ========================================================= */}
              <div className="p-4 rounded-xl bg-orange-50/50 border border-orange-200/80 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-orange-600" />
                    <label className="block font-bold text-zinc-950 text-xs">
                      Inventory / Resource Quota Range (Manual)
                    </label>
                  </div>
                  <span className="font-mono text-xs font-extrabold text-orange-700 bg-white px-2.5 py-0.5 rounded-md border border-orange-200 shadow-2xs">
                    {formData.isUnlimited 
                      ? `${formData.quotaMin}+ Resources (Unlimited)` 
                      : `${formData.quotaMin} - ${formData.quotaMax || 0} Resources`}
                  </span>
                </div>

                <p className="text-[11px] text-zinc-500">
                  Set the custom minimum and maximum active inventory / resources allowed for this subscription tier.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono">
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                      Min Resources
                    </label>
                    <input
                      type="number"
                      min={0}
                      required
                      placeholder="e.g. 0"
                      value={formData.quotaMin}
                      onChange={(e) => setFormData({ ...formData, quotaMin: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-lg border border-zinc-300 bg-white focus:outline-none focus:border-orange-500 text-sm font-mono"
                    />
                    <span className="text-[10px] text-zinc-400 font-sans mt-1 block">
                      Starting resource count (e.g. 0, 51, 101)
                    </span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                      Max Resources
                    </label>
                    <input
                      type="number"
                      min={formData.quotaMin || 0}
                      disabled={formData.isUnlimited}
                      value={formData.isUnlimited ? '' : (formData.quotaMax as number)}
                      placeholder={formData.isUnlimited ? 'Unlimited (No Max)' : 'e.g. 50'}
                      onChange={(e) => setFormData({ ...formData, quotaMax: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-lg border border-zinc-300 bg-white focus:outline-none focus:border-orange-500 disabled:bg-zinc-100 disabled:text-zinc-400 text-sm font-mono"
                    />
                    <span className="text-[10px] text-zinc-400 font-sans mt-1 block">
                      {formData.isUnlimited ? 'No upper limit applied' : 'Upper resource quota cap'}
                    </span>
                  </div>
                </div>

                {/* Unlimited Toggle */}
                <label className="flex items-center gap-2 cursor-pointer pt-1 font-mono bg-white p-2.5 rounded-lg border border-orange-200/60">
                  <input
                    type="checkbox"
                    checked={formData.isUnlimited}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      isUnlimited: e.target.checked,
                      quotaMax: e.target.checked ? 'Unlimited' : (formData.quotaMin ? formData.quotaMin + 50 : 50)
                    })}
                    className="rounded text-orange-600 focus:ring-orange-500 h-4 w-4"
                  />
                  <span className="text-xs text-zinc-900 font-semibold font-sans">
                    No Upper Limit / Unlimited Resources (e.g. {formData.quotaMin}+)
                  </span>
                </label>
              </div>

              {/* Pricing & Annual Discount Calculator */}
              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/80 space-y-3.5">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-emerald-600" />
                    <label className="block font-bold text-zinc-950 text-xs">
                      Pricing & Annual Discount Calculator
                    </label>
                  </div>
                  {formData.monthlyPrice > 0 && formData.annualPrice > 0 && formData.annualPrice < formData.monthlyPrice * 12 && (
                    <span className="font-mono text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                      Annual Savings: ₹{((formData.monthlyPrice * 12) - formData.annualPrice).toLocaleString('en-IN')} ({discountPercent}% OFF)
                    </span>
                  )}
                </div>

                {/* 3 Interconnected Input Columns */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                      Monthly Fee (₹)
                    </label>
                    <input
                      type="number"
                      min={0}
                      required
                      value={formData.monthlyPrice}
                      onChange={(e) => handleMonthlyChange(Number(e.target.value))}
                      className="w-full p-2.5 rounded-lg border border-zinc-300 bg-white focus:outline-none focus:border-orange-500 font-mono text-sm"
                    />
                    <span className="text-[10px] text-zinc-400 font-mono mt-1 block">
                      12 Months = ₹{(formData.monthlyPrice * 12).toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                      Annual Discount (%)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        step="0.1"
                        value={discountPercent}
                        onChange={(e) => handleDiscountPercentChange(Number(e.target.value))}
                        className="w-full p-2.5 pr-8 rounded-lg border border-zinc-300 bg-white focus:outline-none focus:border-orange-500 font-mono text-sm"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 font-mono font-bold text-xs">
                        %
                      </span>
                    </div>
                    <span className="text-[10px] text-zinc-400 font-mono mt-1 block">
                      Auto-computes Annual Fee
                    </span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                      Annual Fee (₹)
                    </label>
                    <input
                      type="number"
                      min={0}
                      required
                      value={formData.annualPrice}
                      onChange={(e) => handleAnnualChange(Number(e.target.value))}
                      className="w-full p-2.5 rounded-lg border border-zinc-300 bg-white focus:outline-none focus:border-orange-500 font-mono text-sm"
                    />
                    <span className="text-[10px] text-emerald-600 font-mono font-semibold mt-1 block">
                      {formData.annualPrice < formData.monthlyPrice * 12
                        ? `₹${((formData.monthlyPrice * 12) - formData.annualPrice).toLocaleString('en-IN')} saved / yr`
                        : 'No annual discount'}
                    </span>
                  </div>
                </div>

                {/* Quick Discount Presets */}
                <div>
                  <span className="text-[10px] font-mono text-zinc-500 uppercase font-bold block mb-1.5">
                    Click Quick Discount Preset:
                  </span>
                  <div className="flex flex-wrap items-center gap-1.5 font-mono">
                    {ANNUAL_DISCOUNT_PRESETS.map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => applyDiscountPreset(preset)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors ${
                          Math.abs(discountPercent - preset.value) < 0.2
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                            : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-100'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Staff Team Seats */}
              <div>
                <label className="block font-semibold text-zinc-700 mb-1">Staff Team Seats</label>
                <input
                  type="number"
                  min={1}
                  required
                  value={formData.userSeats}
                  onChange={(e) => setFormData({ ...formData, userSeats: Number(e.target.value) })}
                  className="w-full p-2.5 rounded-lg border border-zinc-300 focus:outline-none focus:border-orange-500 font-mono"
                />
              </div>

              {/* Features List */}
              <div>
                <label className="block font-semibold text-zinc-700 mb-1">
                  Feature Highlights (One item per line)
                </label>
                <textarea
                  rows={4}
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-zinc-300 focus:outline-none focus:border-orange-500 font-mono text-xs leading-relaxed"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3 py-2 rounded-lg text-zinc-600 hover:bg-zinc-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-semibold"
                >
                  {editingPlan ? 'Save Package Changes' : 'Publish Package Tier'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
