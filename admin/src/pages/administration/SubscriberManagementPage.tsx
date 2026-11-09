import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Search, 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Layers, 
  ArrowUpRight, 
  Sliders, 
  Download, 
  Calendar, 
  X, 
  ExternalLink, 
  Receipt,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  RotateCcw,
  Filter,
  DollarSign
} from 'lucide-react';

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
  city?: string;
}

type SortField = 'providerName' | 'amount' | 'billingCycle' | 'nextRenewal' | 'usage' | 'status';
type SortDirection = 'asc' | 'desc';

export const SubscriberManagementPage: React.FC = () => {
  // Rich mock dataset representing 20 media providers across India
  const [subscribers, setSubscribers] = useState<SubscriberRecord[]>([
    {
      id: 'SUB-201',
      providerId: 'PRV-1001',
      providerName: 'Apex Outdoor Media LLP',
      planName: 'Enterprise Conglomerate',
      planCode: 'ENTERPRISE',
      billingCycle: 'Annual',
      amount: 499990,
      status: 'active',
      billboardUsage: 142,
      quotaLimit: 500,
      nextRenewal: '2027-04-12',
      lastPaymentDate: '2026-04-12',
      overrideBonus: 0,
      city: 'Mumbai',
    },
    {
      id: 'SUB-202',
      providerId: 'PRV-1002',
      providerName: 'Skyline Hoardings Pvt Ltd',
      planName: 'Professional Network',
      planCode: 'PRO_NETWORK',
      billingCycle: 'Monthly',
      amount: 16999,
      status: 'active',
      billboardUsage: 88,
      quotaLimit: 150,
      nextRenewal: '2026-11-01',
      lastPaymentDate: '2026-10-01',
      overrideBonus: 10,
      city: 'Bengaluru',
    },
    {
      id: 'SUB-203',
      providerId: 'PRV-1003',
      providerName: 'National Transit & City Ads',
      planName: 'Enterprise Conglomerate',
      planCode: 'ENTERPRISE',
      billingCycle: 'Annual',
      amount: 499990,
      status: 'active',
      billboardUsage: 195,
      quotaLimit: 500,
      nextRenewal: '2027-01-10',
      lastPaymentDate: '2026-01-10',
      overrideBonus: 0,
      city: 'Delhi NCR',
    },
    {
      id: 'SUB-204',
      providerId: 'PRV-1004',
      providerName: 'Deccan Media Networks',
      planName: 'Professional Network',
      planCode: 'PRO_NETWORK',
      billingCycle: 'Monthly',
      amount: 16999,
      status: 'grace_period',
      billboardUsage: 64,
      quotaLimit: 150,
      nextRenewal: '2026-10-15',
      lastPaymentDate: '2026-09-15',
      overrideBonus: 0,
      city: 'Hyderabad',
    },
    {
      id: 'SUB-205',
      providerId: 'PRV-1005',
      providerName: 'Kalinga Highway Billboards',
      planName: 'Starter OOH',
      planCode: 'STARTER',
      billingCycle: 'Monthly',
      amount: 0,
      status: 'active',
      billboardUsage: 26,
      quotaLimit: 50,
      nextRenewal: 'Free Tier',
      lastPaymentDate: 'N/A',
      overrideBonus: 20,
      city: 'Bhubaneswar',
    },
    {
      id: 'SUB-206',
      providerId: 'PRV-1006',
      providerName: 'Gujarat Vista Displays',
      planName: 'Growth Network',
      planCode: 'GROWTH',
      billingCycle: 'Monthly',
      amount: 9999,
      status: 'suspended',
      billboardUsage: 52,
      quotaLimit: 100,
      nextRenewal: 'Account Suspended',
      lastPaymentDate: '2026-08-14',
      overrideBonus: 0,
      city: 'Ahmedabad',
    },
    {
      id: 'SUB-207',
      providerId: 'PRV-1007',
      providerName: 'Chennai Metro Prime Media',
      planName: 'Growth Network',
      planCode: 'GROWTH',
      billingCycle: 'Monthly',
      amount: 9999,
      status: 'active',
      billboardUsage: 96,
      quotaLimit: 100,
      nextRenewal: '2026-11-18',
      lastPaymentDate: '2026-10-18',
      overrideBonus: 0,
      city: 'Chennai',
    },
    {
      id: 'SUB-208',
      providerId: 'PRV-1008',
      providerName: 'Kolkata Hoardings & Transit',
      planName: 'Enterprise Conglomerate',
      planCode: 'ENTERPRISE',
      billingCycle: 'Annual',
      amount: 499990,
      status: 'active',
      billboardUsage: 310,
      quotaLimit: 500,
      nextRenewal: '2027-02-28',
      lastPaymentDate: '2026-02-28',
      overrideBonus: 50,
      city: 'Kolkata',
    },
    {
      id: 'SUB-209',
      providerId: 'PRV-1009',
      providerName: 'Malabar Outdoor Solutions',
      planName: 'Growth Network',
      planCode: 'GROWTH',
      billingCycle: 'Annual',
      amount: 99990,
      status: 'payment_due',
      billboardUsage: 48,
      quotaLimit: 100,
      nextRenewal: '2026-10-20',
      lastPaymentDate: '2025-10-20',
      overrideBonus: 0,
      city: 'Kochi',
    },
    {
      id: 'SUB-210',
      providerId: 'PRV-1010',
      providerName: 'Punjab Highway Displays',
      planName: 'Professional Network',
      planCode: 'PRO_NETWORK',
      billingCycle: 'Annual',
      amount: 169990,
      status: 'active',
      billboardUsage: 142,
      quotaLimit: 150,
      nextRenewal: '2027-03-15',
      lastPaymentDate: '2026-03-15',
      overrideBonus: 0,
      city: 'Chandigarh',
    },
    {
      id: 'SUB-211',
      providerId: 'PRV-1011',
      providerName: 'Rajasthan Heritage OOH',
      planName: 'Starter OOH',
      planCode: 'STARTER',
      billingCycle: 'Monthly',
      amount: 0,
      status: 'active',
      billboardUsage: 14,
      quotaLimit: 50,
      nextRenewal: 'Free Tier',
      lastPaymentDate: 'N/A',
      overrideBonus: 0,
      city: 'Jaipur',
    },
    {
      id: 'SUB-212',
      providerId: 'PRV-1012',
      providerName: 'Central India Media Works',
      planName: 'Growth Network',
      planCode: 'GROWTH',
      billingCycle: 'Monthly',
      amount: 9999,
      status: 'active',
      billboardUsage: 72,
      quotaLimit: 100,
      nextRenewal: '2026-11-05',
      lastPaymentDate: '2026-10-05',
      overrideBonus: 0,
      city: 'Indore',
    },
    {
      id: 'SUB-213',
      providerId: 'PRV-1013',
      providerName: 'Goa Coastal Billboards',
      planName: 'Starter OOH',
      planCode: 'STARTER',
      billingCycle: 'Monthly',
      amount: 0,
      status: 'active',
      billboardUsage: 35,
      quotaLimit: 50,
      nextRenewal: 'Free Tier',
      lastPaymentDate: 'N/A',
      overrideBonus: 5,
      city: 'Panaji',
    },
    {
      id: 'SUB-214',
      providerId: 'PRV-1014',
      providerName: 'Assam Valley Media Group',
      planName: 'Growth Network',
      planCode: 'GROWTH',
      billingCycle: 'Annual',
      amount: 99990,
      status: 'active',
      billboardUsage: 61,
      quotaLimit: 100,
      nextRenewal: '2027-05-22',
      lastPaymentDate: '2026-05-22',
      overrideBonus: 0,
      city: 'Guwahati',
    },
    {
      id: 'SUB-215',
      providerId: 'PRV-1015',
      providerName: 'Pune Metropolitan Ads',
      planName: 'Enterprise Conglomerate',
      planCode: 'ENTERPRISE',
      billingCycle: 'Monthly',
      amount: 49999,
      status: 'active',
      billboardUsage: 228,
      quotaLimit: 500,
      nextRenewal: '2026-11-12',
      lastPaymentDate: '2026-10-12',
      overrideBonus: 0,
      city: 'Pune',
    },
    {
      id: 'SUB-216',
      providerId: 'PRV-1016',
      providerName: 'Lucknow City Lights',
      planName: 'Professional Network',
      planCode: 'PRO_NETWORK',
      billingCycle: 'Annual',
      amount: 169990,
      status: 'active',
      billboardUsage: 148,
      quotaLimit: 150,
      nextRenewal: '2027-06-30',
      lastPaymentDate: '2026-06-30',
      overrideBonus: 15,
      city: 'Lucknow',
    },
    {
      id: 'SUB-217',
      providerId: 'PRV-1017',
      providerName: 'Coimbatore Transit Media',
      planName: 'Growth Network',
      planCode: 'GROWTH',
      billingCycle: 'Monthly',
      amount: 9999,
      status: 'grace_period',
      billboardUsage: 89,
      quotaLimit: 100,
      nextRenewal: '2026-10-18',
      lastPaymentDate: '2026-09-18',
      overrideBonus: 0,
      city: 'Coimbatore',
    },
    {
      id: 'SUB-218',
      providerId: 'PRV-1018',
      providerName: 'Nagpur Central OOH',
      planName: 'Starter OOH',
      planCode: 'STARTER',
      billingCycle: 'Monthly',
      amount: 0,
      status: 'active',
      billboardUsage: 19,
      quotaLimit: 50,
      nextRenewal: 'Free Tier',
      lastPaymentDate: 'N/A',
      overrideBonus: 0,
      city: 'Nagpur',
    },
    {
      id: 'SUB-219',
      providerId: 'PRV-1019',
      providerName: 'Surat Citywide Digital Screens',
      planName: 'Professional Network',
      planCode: 'PRO_NETWORK',
      billingCycle: 'Monthly',
      amount: 16999,
      status: 'active',
      billboardUsage: 112,
      quotaLimit: 150,
      nextRenewal: '2026-11-25',
      lastPaymentDate: '2026-10-25',
      overrideBonus: 0,
      city: 'Surat',
    },
    {
      id: 'SUB-220',
      providerId: 'PRV-1020',
      providerName: 'Bhopal Urban Billboards',
      planName: 'Starter OOH',
      planCode: 'STARTER',
      billingCycle: 'Monthly',
      amount: 0,
      status: 'suspended',
      billboardUsage: 45,
      quotaLimit: 50,
      nextRenewal: 'Account Suspended',
      lastPaymentDate: 'N/A',
      overrideBonus: 0,
      city: 'Bhopal',
    },
  ]);

  // Filtering states
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [planFilter, setPlanFilter] = useState<string>('all');
  const [billingCycleFilter, setBillingCycleFilter] = useState<string>('all');
  const [quotaFilter, setQuotaFilter] = useState<string>('all');

  // Sorting states
  const [sortField, setSortField] = useState<SortField>('providerName');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(50);

  // Modal states
  const [overrideModal, setOverrideModal] = useState<SubscriberRecord | null>(null);
  const [bonusInput, setBonusInput] = useState<number>(10);
  const [overrideReason, setOverrideReason] = useState<string>('Festival season promotional allowance');

  // Check if any filter is active
  const isFiltered = Boolean(
    search || 
    statusFilter !== 'all' || 
    planFilter !== 'all' || 
    billingCycleFilter !== 'all' || 
    quotaFilter !== 'all'
  );

  const handleResetFilters = () => {
    setSearch('');
    setStatusFilter('all');
    setPlanFilter('all');
    setBillingCycleFilter('all');
    setQuotaFilter('all');
    setCurrentPage(1);
  };

  // Reset to first page when search or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, planFilter, billingCycleFilter, quotaFilter, pageSize]);

  // Toggle sorting on column click
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filter & Sort Pipeline
  const filteredAndSorted = useMemo(() => {
    const list = subscribers.filter((sub) => {
      const matchesSearch =
        sub.providerName.toLowerCase().includes(search.toLowerCase()) ||
        sub.planName.toLowerCase().includes(search.toLowerCase()) ||
        sub.providerId.toLowerCase().includes(search.toLowerCase()) ||
        (sub.city && sub.city.toLowerCase().includes(search.toLowerCase()));

      const matchesStatus = statusFilter === 'all' || sub.status === statusFilter;
      const matchesPlan = planFilter === 'all' || sub.planCode === planFilter;
      const matchesCycle = billingCycleFilter === 'all' || sub.billingCycle === billingCycleFilter;

      const effectiveQuota = sub.quotaLimit + sub.overrideBonus;
      const percent = Math.min(100, Math.round((sub.billboardUsage / effectiveQuota) * 100));
      let matchesQuota = true;
      if (quotaFilter === 'normal') matchesQuota = percent < 80;
      else if (quotaFilter === 'high') matchesQuota = percent >= 80 && percent < 100;
      else if (quotaFilter === 'maxed') matchesQuota = percent >= 100;

      return matchesSearch && matchesStatus && matchesPlan && matchesCycle && matchesQuota;
    });

    list.sort((a, b) => {
      let comparison = 0;
      if (sortField === 'providerName') {
        comparison = a.providerName.localeCompare(b.providerName);
      } else if (sortField === 'amount') {
        comparison = a.amount - b.amount;
      } else if (sortField === 'billingCycle') {
        comparison = a.billingCycle.localeCompare(b.billingCycle);
      } else if (sortField === 'nextRenewal') {
        comparison = a.nextRenewal.localeCompare(b.nextRenewal);
      } else if (sortField === 'usage') {
        const percentA = a.billboardUsage / (a.quotaLimit + a.overrideBonus);
        const percentB = b.billboardUsage / (b.quotaLimit + b.overrideBonus);
        comparison = percentA - percentB;
      } else if (sortField === 'status') {
        comparison = a.status.localeCompare(b.status);
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return list;
  }, [subscribers, search, statusFilter, planFilter, billingCycleFilter, quotaFilter, sortField, sortDirection]);

  // Pagination calculation
  const totalRecords = filteredAndSorted.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAndSorted.slice(start, start + pageSize);
  }, [filteredAndSorted, currentPage, pageSize]);

  // Quota Override Submit Handler
  const handleApplyOverride = (e: React.FormEvent) => {
    e.preventDefault();
    if (!overrideModal) return;
    setSubscribers(subscribers.map((s) => s.id === overrideModal.id ? {
      ...s,
      overrideBonus: Number(bonusInput),
    } : s));
    setOverrideModal(null);
  };

  // Helper for rendering clickable sortable table headers
  const renderSortHeader = (label: string, field: SortField, className = '') => {
    const isActive = sortField === field;
    return (
      <th
        onClick={() => handleSort(field)}
        className={`py-3 font-bold cursor-pointer select-none group transition-colors hover:text-zinc-950 ${className}`}
        title={`Sort by ${label}`}
      >
        <div className="flex items-center gap-1.5">
          <span>{label}</span>
          {isActive ? (
            sortDirection === 'asc' ? (
              <ArrowUp className="w-3.5 h-3.5 text-orange-600 shrink-0" />
            ) : (
              <ArrowDown className="w-3.5 h-3.5 text-orange-600 shrink-0" />
            )
          ) : (
            <ArrowUpDown className="w-3 h-3 text-zinc-300 group-hover:text-zinc-500 opacity-60 group-hover:opacity-100 transition-opacity shrink-0" />
          )}
        </div>
      </th>
    );
  };

  // Summary Metrics
  const activeSubscribersCount = subscribers.filter(s => s.status === 'active').length;
  const highQuotaCount = subscribers.filter(s => {
    const effective = s.quotaLimit + s.overrideBonus;
    return (s.billboardUsage / effective) >= 0.8;
  }).length;
  const overdueCount = subscribers.filter(s => s.status === 'grace_period' || s.status === 'payment_due').length;

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight font-sans">
              Subscribers
            </h1>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 border border-orange-300 font-semibold">
              {subscribers.length} SUBSCRIBERS
            </span>
          </div>
          <p className="text-sm text-zinc-500 mt-1">
            Monitor provider subscription plans, renewal cycles, inventory / resource quota usage, and concessions.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Link
            to="/admin/payments"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>Payment History</span>
          </Link>
          <button className="flex items-center gap-2 px-3.5 py-2 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-semibold text-zinc-700 shadow-xs transition-colors font-mono">
            <Download className="w-3.5 h-3.5" />
            <span>Export Billing</span>
          </button>
        </div>
      </div>

      {/* KPI Overview Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-zinc-200/80 shadow-xs space-y-1">
          <span className="text-[10px] font-mono uppercase font-bold text-zinc-400">Active Paid Contracts</span>
          <div className="text-2xl font-extrabold text-zinc-950 font-sans">
            {activeSubscribersCount} / {subscribers.length}
          </div>
          <p className="text-xs text-emerald-600 font-medium pt-0.5">Verified OOH media partners</p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-zinc-200/80 shadow-xs space-y-1">
          <span className="text-[10px] font-mono uppercase font-bold text-zinc-400">High Quota Utilization (&gt;80%)</span>
          <div className="text-2xl font-extrabold text-amber-600 font-sans">
            {highQuotaCount} Providers
          </div>
          <p className="text-xs text-zinc-500 pt-0.5">Prime candidates for plan tier upgrades</p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-zinc-200/80 shadow-xs space-y-1">
          <span className="text-[10px] font-mono uppercase font-bold text-zinc-400">Payment Due / Grace Notice</span>
          <div className="text-2xl font-extrabold text-red-600 font-sans">
            {overdueCount} Accounts
          </div>
          <p className="text-xs text-zinc-500 pt-0.5">Automated WhatsApp & email sent</p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-zinc-200/80 shadow-xs space-y-1">
          <span className="text-[10px] font-mono uppercase font-bold text-zinc-400">Suspended Contracts</span>
          <div className="text-2xl font-extrabold text-zinc-700 font-sans">
            {subscribers.filter(s => s.status === 'suspended').length} Suspended
          </div>
          <p className="text-xs text-zinc-500 pt-0.5">Publishing restricted on marketplace</p>
        </div>
      </div>

      {/* Main Filter & Search Control Panel */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 p-5 shadow-xs space-y-4">
        {/* Row 1: Search & Status Pills */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="relative w-full lg:w-96">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search subscriber name, ID, city, or plan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-2 rounded-lg border border-zinc-200 focus:outline-none focus:border-orange-500 font-sans"
            />
            {search && (
              <button 
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
            {[
              { id: 'all', label: 'All Status' },
              { id: 'active', label: 'Active' },
              { id: 'grace_period', label: 'Grace Period' },
              { id: 'payment_due', label: 'Payment Due' },
              { id: 'suspended', label: 'Suspended' }
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setStatusFilter(st.id)}
                className={`px-3 py-1.5 rounded-lg capitalize transition-colors font-medium text-xs ${
                  statusFilter === st.id
                    ? 'bg-zinc-950 text-white font-bold shadow-xs'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        {/* Row 2: Secondary Dropdown Filters & Reset Button */}
        <div className="pt-3 border-t border-zinc-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-1 text-zinc-400 font-mono text-[11px]">
              <Filter className="w-3.5 h-3.5 text-zinc-500" />
              <span>Filters:</span>
            </div>

            {/* Plan Tier Filter */}
            <select
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
              className="p-1.5 rounded-lg border border-zinc-200 bg-white font-mono text-zinc-700 text-xs focus:outline-none focus:border-orange-500"
            >
              <option value="all">All Plan Tiers</option>
              <option value="ENTERPRISE">Enterprise Conglomerate</option>
              <option value="PRO_NETWORK">Professional Network</option>
              <option value="GROWTH">Growth Network</option>
              <option value="STARTER">Starter OOH</option>
            </select>

            {/* Billing Cycle Filter */}
            <select
              value={billingCycleFilter}
              onChange={(e) => setBillingCycleFilter(e.target.value)}
              className="p-1.5 rounded-lg border border-zinc-200 bg-white font-mono text-zinc-700 text-xs focus:outline-none focus:border-orange-500"
            >
              <option value="all">All Billing Cycles</option>
              <option value="Monthly">Monthly</option>
              <option value="Annual">Annual</option>
            </select>

            {/* Quota Usage Filter */}
            <select
              value={quotaFilter}
              onChange={(e) => setQuotaFilter(e.target.value)}
              className="p-1.5 rounded-lg border border-zinc-200 bg-white font-mono text-zinc-700 text-xs focus:outline-none focus:border-orange-500"
            >
              <option value="all">All Quota Levels</option>
              <option value="normal">Normal Usage (&lt;80%)</option>
              <option value="high">High Usage (80% - 99%)</option>
              <option value="maxed">Maxed Out (100%+)</option>
            </select>

            {/* Reset Filters Action */}
            {isFiltered && (
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-orange-50 text-orange-700 hover:bg-orange-100 font-mono text-xs font-semibold transition-colors border border-orange-200"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-zinc-500">
            <span>Rows:</span>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="p-1.5 rounded-lg border border-zinc-200 bg-white font-mono text-zinc-700 text-xs focus:outline-none focus:border-orange-500"
            >
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
              <option value={50}>50 per page</option>
            </select>
          </div>
        </div>

        {/* Subscribers Data Table */}
        <div className="overflow-x-auto border-t border-zinc-100 pt-2">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-200 text-zinc-400 uppercase font-mono text-[10px]">
                {renderSortHeader('Media Provider', 'providerName')}
                {renderSortHeader('Subscribed Tier', 'amount')}
                {renderSortHeader('Billing Cycle', 'billingCycle')}
                {renderSortHeader('Next Renewal', 'nextRenewal')}
                {renderSortHeader('Quota Consumption', 'usage', 'w-56')}
                {renderSortHeader('Contract State', 'status')}
                <th className="py-3 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {paginatedData.map((sub) => {
                const effectiveQuota = sub.quotaLimit + sub.overrideBonus;
                const percent = Math.min(100, Math.round((sub.billboardUsage / effectiveQuota) * 100));

                return (
                  <tr key={sub.id} className="hover:bg-zinc-50/80 transition-colors">
                    <td className="py-3.5">
                      <Link
                        to={`/admin/providers/${sub.providerId}`}
                        className="group inline-flex flex-col text-left hover:text-orange-600 transition-colors cursor-pointer"
                        title={`View ${sub.providerName} in Provider Details`}
                      >
                        <span className="font-bold text-zinc-900 group-hover:text-orange-600 flex items-center gap-1.5">
                          {sub.providerName}
                          <ExternalLink className="w-3.5 h-3.5 text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </span>
                        <span className="text-[11px] text-zinc-400 font-mono group-hover:text-orange-500/80">
                          {sub.providerId} {sub.city ? `• ${sub.city}` : ''}
                        </span>
                      </Link>
                    </td>

                    <td className="py-3.5">
                      <span className="font-semibold text-zinc-800 block">{sub.planName}</span>
                      <span className="text-[10px] text-zinc-500 font-mono">
                        {sub.amount === 0 ? 'Free Tier' : `₹${sub.amount.toLocaleString('en-IN')}`}
                      </span>
                    </td>

                    <td className="py-3.5 font-mono text-zinc-600">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                        sub.billingCycle === 'Annual' 
                          ? 'bg-purple-50 text-purple-700 border border-purple-200' 
                          : 'bg-zinc-100 text-zinc-700'
                      }`}>
                        {sub.billingCycle}
                      </span>
                    </td>

                    <td className="py-3.5 font-mono text-zinc-600 text-[11px]">
                      {sub.nextRenewal}
                    </td>

                    <td className="py-3.5 w-56">
                      <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                        <span className="font-bold text-zinc-800">
                          {sub.billboardUsage} / {effectiveQuota} Resources
                        </span>
                        {sub.overrideBonus > 0 && (
                          <span className="text-orange-600 font-semibold text-[10px]">
                            +{sub.overrideBonus} bonus
                          </span>
                        )}
                      </div>
                      <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            percent >= 100 
                              ? 'bg-red-500' 
                              : percent >= 80 
                                ? 'bg-amber-500' 
                                : 'bg-emerald-500'
                          }`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-mono text-zinc-400 mt-0.5 block text-right">
                        {percent}% utilized
                      </span>
                    </td>

                    <td className="py-3.5">
                      {sub.status === 'active' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> ACTIVE
                        </span>
                      )}
                      {sub.status === 'grace_period' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-amber-100 text-amber-800 font-bold border border-amber-300">
                          <Clock className="w-3 h-3 text-amber-600" /> GRACE PERIOD
                        </span>
                      )}
                      {sub.status === 'payment_due' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-orange-100 text-orange-800 font-bold border border-orange-300">
                          <AlertTriangle className="w-3 h-3 text-orange-600" /> PAYMENT DUE
                        </span>
                      )}
                      {sub.status === 'suspended' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-red-100 text-red-800 font-bold border border-red-300">
                          SUSPENDED
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/admin/providers/${sub.providerId}`}
                          className="px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs flex items-center gap-1 transition-colors shadow-2xs"
                          title={`Navigate to ${sub.providerName} detail`}
                        >
                          <span>View</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                        <button
                          onClick={() => {
                            setOverrideModal(sub);
                            setBonusInput(sub.overrideBonus || 10);
                          }}
                          className="px-2.5 py-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-100 text-zinc-700 font-semibold text-xs font-mono"
                          title="Grant promotional or temporary quota allowance"
                        >
                          Quota Override
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {paginatedData.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <AlertTriangle className="w-8 h-8 text-zinc-300" />
                      <p className="text-zinc-600 font-semibold text-sm">No subscribers match your search or filter criteria.</p>
                      <p className="text-xs text-zinc-400">Try clearing active filters or adjusting your search term.</p>
                      <button
                        onClick={handleResetFilters}
                        className="mt-2 px-3.5 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold"
                      >
                        Reset All Filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Robust Pagination Controls */}
        <div className="pt-4 border-t border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-3">
            <span className="text-zinc-500">
              Showing <strong className="text-zinc-900">{totalRecords > 0 ? (currentPage - 1) * pageSize + 1 : 0}</strong> to{' '}
              <strong className="text-zinc-900">{Math.min(currentPage * pageSize, totalRecords)}</strong> of{' '}
              <strong className="text-zinc-900">{totalRecords}</strong> subscribers
              {isFiltered && <span className="text-orange-600 ml-1.5">(filtered from {subscribers.length} total)</span>}
            </span>

            <div className="flex items-center gap-1.5 pl-3 border-l border-zinc-200">
              <span className="text-zinc-400">Per page:</span>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="px-2 py-1 rounded border border-zinc-200 bg-white font-mono text-zinc-700 text-xs focus:outline-none focus:border-orange-500"
              >
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={200}>200</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-1 self-center sm:self-auto">
            {/* First Page */}
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="First Page"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>

            {/* Previous Page */}
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Numbered Page Buttons */}
            <div className="flex items-center gap-1 mx-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                // Show first, last, current, and pages around current
                if (
                  totalPages <= 7 ||
                  page === 1 ||
                  page === totalPages ||
                  Math.abs(page - currentPage) <= 1
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`min-w-[32px] h-8 px-2 rounded-lg font-bold transition-colors ${
                        currentPage === page
                          ? 'bg-zinc-950 text-white shadow-xs'
                          : 'bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-100'
                      }`}
                    >
                      {page}
                    </button>
                  );
                } else if (
                  page === currentPage - 2 ||
                  page === currentPage + 2
                ) {
                  return (
                    <span key={page} className="px-1 text-zinc-400">
                      ...
                    </span>
                  );
                }
                return null;
              })}
            </div>

            {/* Next Page */}
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Last Page */}
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Last Page"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Quota Override Modal */}
      {overrideModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-zinc-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <h3 className="font-bold text-zinc-950 text-base">Grant Manual Quota Override</h3>
              <button onClick={() => setOverrideModal(null)} className="text-zinc-400 hover:text-zinc-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-orange-50 border border-orange-200 text-xs text-orange-950 space-y-1">
              <p className="font-bold">{overrideModal.providerName}</p>
              <p className="text-[11px] text-orange-900/80">
                Base Plan Quota: <strong>{overrideModal.quotaLimit} Resources</strong>. Any bonus added here is in addition to their subscription plan limit.
              </p>
            </div>

            <form onSubmit={handleApplyOverride} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-zinc-700 mb-1">Additional Bonus Resource Slots</label>
                <input
                  type="number"
                  min={0}
                  max={500}
                  value={bonusInput}
                  onChange={(e) => setBonusInput(Number(e.target.value))}
                  className="w-full p-2.5 rounded-lg border border-zinc-300 focus:outline-none focus:border-orange-500 font-mono text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 mb-1">Administrative Justification</label>
                <input
                  type="text"
                  required
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-zinc-300 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setOverrideModal(null)}
                  className="px-3 py-2 rounded-lg text-zinc-600 hover:bg-zinc-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-semibold"
                >
                  Apply Quota Allowance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
