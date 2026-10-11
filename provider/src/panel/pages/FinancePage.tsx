import React, { useState, useMemo } from 'react';
import {
  Receipt,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Download,
  Filter,
  Search,
  Plus,
  Landmark,
  Building2,
  FileCheck,
  Percent,
  Calendar,
  TrendingUp,
  Eye,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  RotateCcw,
  X,
  FileText,
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Button from '../../components/ui/Button';
import { InvoiceRecord } from '../types/finance';
import { SAMPLE_INVOICE_RECORDS } from '../data/sampleFinance';
import InvoiceViewerModal from '../components/finance/InvoiceViewerModal';

export type FinanceTab = 'invoices' | 'settlements' | 'receivables' | 'expenses' | 'tax_compliance';
export type InvoiceSortField = 'id' | 'client' | 'dueDate' | 'subtotal' | 'totalAmount' | 'status';
export type SortDirection = 'asc' | 'desc';
export type InvoiceStatusFilter = 'ALL' | 'PAID' | 'PARTIAL' | 'OVERDUE' | 'DRAFT';
export type InvoicePeriodFilter = 'ALL' | 'OCT_2026' | 'SEP_2026' | 'AUG_2026';

interface FinanceSummaryMetric {
  title: string;
  amount: string;
  change: string;
  isPositive: boolean;
  subtext: string;
  icon: React.ElementType;
  accentColor: string;
}

const FINANCE_METRICS: FinanceSummaryMetric[] = [
  {
    title: 'Gross Invoiced (MTD)',
    amount: '₹34,80,000',
    change: '+14.2%',
    isPositive: true,
    subtext: 'Across 18 direct & agency bookings',
    icon: Receipt,
    accentColor: 'text-[#EA580C] bg-orange-50 border-orange-200',
  },
  {
    title: 'Accounts Receivable (A/R)',
    amount: '₹8,45,000',
    change: '4 Overdue',
    isPositive: false,
    subtext: 'Pending collection from agencies',
    icon: Clock,
    accentColor: 'text-amber-600 bg-amber-50 border-amber-200',
  },
  {
    title: 'SODAARS Net Payouts',
    amount: '₹12,65,400',
    change: '₹3.2L in Escrow',
    isPositive: true,
    subtext: 'Disbursed via automated bank transfer',
    icon: Landmark,
    accentColor: 'text-emerald-600 bg-emerald-50 border-emerald-200',
  },
  {
    title: 'Statutory GST Liability',
    amount: '₹6,26,400',
    change: 'SAC 998361 (18%)',
    isPositive: true,
    subtext: 'Filing period: Oct 2026 GSTR-1',
    icon: Percent,
    accentColor: 'text-indigo-600 bg-indigo-50 border-indigo-200',
  },
];

// Sample SODAARS Marketplace Settlements
const SAMPLE_SETTLEMENTS = [
  {
    payoutId: 'PAY-SO-8921',
    bookingRef: 'BK-2026-0891',
    advertiser: 'Cadbury Celebrations (Publicis)',
    mediaUnit: 'Western Express Highway Gantry #03',
    popSignoff: '28 Sep 2026',
    grossContract: '₹4,50,000',
    platformCommission: '₹45,000 (10%)',
    tdsDeduction: '₹4,050 (1% u/s 194C)',
    netDisbursed: '₹4,00,950',
    status: 'DISBURSED',
    disbursedDate: '05 Oct 2026',
    bankRef: 'HDFC-N98721644',
  },
  {
    payoutId: 'PAY-SO-8935',
    bookingRef: 'BK-2026-0904',
    advertiser: 'Amazon Great Indian Festival',
    mediaUnit: 'Bandra Reclamation DOOH Digital Wall',
    popSignoff: '04 Oct 2026',
    grossContract: '₹8,20,000',
    platformCommission: '₹82,000 (10%)',
    tdsDeduction: '₹7,380 (1% u/s 194C)',
    netDisbursed: '₹7,30,620',
    status: 'PROCESSING',
    disbursedDate: 'Scheduled 12 Oct 2026',
    bankRef: 'Escrow Released to Gateway',
  },
  {
    payoutId: 'PAY-SO-8948',
    bookingRef: 'BK-2026-0919',
    advertiser: 'Samsung Galaxy Z Fold Promo',
    mediaUnit: 'Aerocity Flyover Unipole Cluster',
    popSignoff: 'In Progress (POP pending)',
    grossContract: '₹3,60,000',
    platformCommission: '₹36,000 (10%)',
    tdsDeduction: '₹3,240 (1% u/s 194C)',
    netDisbursed: '₹3,20,760',
    status: 'IN_ESCROW',
    disbursedDate: 'Awaiting Audit Signoff',
    bankRef: 'SODAARS Escrow Locked',
  },
];

export const FinancePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<FinanceTab>('invoices');

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<InvoiceStatusFilter>('ALL');
  const [periodFilter, setPeriodFilter] = useState<InvoicePeriodFilter>('ALL');
  const [clientFilter, setClientFilter] = useState<string>('ALL');

  // Sorting state
  const [sortField, setSortField] = useState<InvoiceSortField>('id');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Modal & Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceRecord | null>(null);
  const [isInvoiceViewerOpen, setIsInvoiceViewerOpen] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleViewInvoice = (inv: InvoiceRecord) => {
    setSelectedInvoice(inv);
    setIsInvoiceViewerOpen(true);
  };

  const handleCloseInvoiceViewer = () => {
    setIsInvoiceViewerOpen(false);
    setSelectedInvoice(null);
  };

  const handleDownloadPdf = (invoiceId: string) => {
    showToast(`Downloading Tax Invoice ${invoiceId}.pdf...`);
  };

  // Distinct clients list
  const clientOptions = useMemo(() => {
    const set = new Set<string>();
    SAMPLE_INVOICE_RECORDS.forEach((inv) => set.add(inv.client));
    return Array.from(set).sort();
  }, []);

  // Status counts across all sample invoices
  const statusCounts = useMemo(() => {
    return {
      all: SAMPLE_INVOICE_RECORDS.length,
      paid: SAMPLE_INVOICE_RECORDS.filter((i) => i.status === 'PAID').length,
      partial: SAMPLE_INVOICE_RECORDS.filter((i) => i.status === 'PARTIAL').length,
      overdue: SAMPLE_INVOICE_RECORDS.filter((i) => i.status === 'OVERDUE').length,
      draft: SAMPLE_INVOICE_RECORDS.filter((i) => i.status === 'DRAFT').length,
    };
  }, []);

  // Sorting handler
  const handleSort = (field: InvoiceSortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  // Reset filters handler
  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('ALL');
    setPeriodFilter('ALL');
    setClientFilter('ALL');
    setCurrentPage(1);
    showToast('Filters reset to default');
  };

  const isFiltered =
    searchQuery !== '' || statusFilter !== 'ALL' || periodFilter !== 'ALL' || clientFilter !== 'ALL';

  // Filter and sort pipeline
  const filteredAndSortedInvoices = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    const filtered = SAMPLE_INVOICE_RECORDS.filter((inv) => {
      // 1. Text Search
      if (q) {
        const matchId = inv.id.toLowerCase().includes(q);
        const matchClient = inv.client.toLowerCase().includes(q);
        const matchCampaign = inv.campaignName.toLowerCase().includes(q);
        const matchGstin = inv.clientGstin.toLowerCase().includes(q);
        if (!matchId && !matchClient && !matchCampaign && !matchGstin) return false;
      }

      // 2. Status Filter
      if (statusFilter !== 'ALL' && inv.status !== statusFilter) {
        return false;
      }

      // 3. Period Filter
      if (periodFilter === 'OCT_2026' && !inv.issueDate.includes('Oct 2026')) {
        return false;
      }
      if (periodFilter === 'SEP_2026' && !inv.issueDate.includes('Sep 2026')) {
        return false;
      }
      if (periodFilter === 'AUG_2026' && !inv.issueDate.includes('Aug 2026')) {
        return false;
      }

      // 4. Client Filter
      if (clientFilter !== 'ALL' && inv.client !== clientFilter) {
        return false;
      }

      return true;
    });

    // Sorting
    return [...filtered].sort((a, b) => {
      let cmp = 0;
      if (sortField === 'id') {
        cmp = a.id.localeCompare(b.id);
      } else if (sortField === 'client') {
        cmp = a.client.localeCompare(b.client);
      } else if (sortField === 'dueDate') {
        cmp = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      } else if (sortField === 'subtotal') {
        cmp = a.subtotal - b.subtotal;
      } else if (sortField === 'totalAmount') {
        cmp = a.totalAmount - b.totalAmount;
      } else if (sortField === 'status') {
        cmp = a.status.localeCompare(b.status);
      }
      return sortDirection === 'asc' ? cmp : -cmp;
    });
  }, [searchQuery, statusFilter, periodFilter, clientFilter, sortField, sortDirection]);

  // Aggregate sums for current filtered view
  const filteredSummary = useMemo(() => {
    const totalAmount = filteredAndSortedInvoices.reduce((acc, curr) => acc + curr.totalAmount, 0);
    const paidAmount = filteredAndSortedInvoices.reduce((acc, curr) => acc + curr.paidAmount, 0);
    const balanceDue = filteredAndSortedInvoices.reduce((acc, curr) => acc + curr.balanceDue, 0);
    return { totalAmount, paidAmount, balanceDue };
  }, [filteredAndSortedInvoices]);

  // Pagination calculation
  const totalItems = filteredAndSortedInvoices.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const paginatedInvoices = filteredAndSortedInvoices.slice(startIndex, endIndex);

  // Pagination page numbers generator
  const paginationPages = useMemo(() => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (safeCurrentPage > 3) pages.push('...');
      const start = Math.max(2, safeCurrentPage - 1);
      const end = Math.min(totalPages - 1, safeCurrentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (safeCurrentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  }, [totalPages, safeCurrentPage]);

  return (
    <div className="flex-1 flex flex-col w-full pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-3.5 rounded-lg bg-[#171717] text-white text-xs font-semibold shadow-2xl flex items-center gap-2.5 border border-stone-800 transition-all animate-in fade-in slide-in-from-bottom-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#EA580C] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <PageHeader
        eyebrow="Media Owner Financials"
        title="Finance & Revenue Management"
        description="Manage client GST tax invoicing, SODAARS marketplace settlements, accounts receivable, and municipal license fee schedules."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => showToast('Exporting Financial Ledger (CSV/Excel)...')}
              className="flex items-center gap-1.5"
            >
              <Download size={14} />
              Export Ledger
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => showToast('Opening Create New Tax Invoice dialog...')}
              className="flex items-center gap-1.5"
            >
              <Plus size={14} />
              Create Invoice
            </Button>
          </div>
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-6 space-y-6">
        {/* KPI Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FINANCE_METRICS.map((metric) => {
            const Icon = metric.icon;
            return (
              <div
                key={metric.title}
                className="bg-white rounded-xl border border-[#E5E5E5] p-4.5 shadow-xs hover:border-[#D4D4D4] transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#737373] tracking-wide uppercase">
                    {metric.title}
                  </span>
                  <div className={`p-2 rounded-lg border ${metric.accentColor}`}>
                    <Icon size={16} />
                  </div>
                </div>
                <div className="mt-3">
                  <div className="text-2xl font-bold tracking-tight text-[#171717]">
                    {metric.amount}
                  </div>
                  <div className="flex items-center gap-2 mt-1.5 text-xs">
                    <span
                      className={`inline-flex items-center font-semibold ${
                        metric.isPositive ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {metric.isPositive ? (
                        <ArrowUpRight size={13} className="mr-0.5" />
                      ) : (
                        <ArrowDownRight size={13} className="mr-0.5" />
                      )}
                      {metric.change}
                    </span>
                    <span className="text-[#A3A3A3] truncate">• {metric.subtext}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl border border-[#E5E5E5] shadow-xs overflow-hidden">
          <div className="flex items-center gap-2 px-4 border-b border-[#E5E5E5] overflow-x-auto no-scrollbar">
            {[
              { id: 'invoices', label: 'Client Invoices & Billing', icon: Receipt },
              { id: 'settlements', label: 'Marketplace Settlements (SODAARS)', icon: Landmark },
              { id: 'receivables', label: 'Accounts Receivable (Aging)', icon: Clock },
              { id: 'expenses', label: 'Site Leases & Municipal Fees', icon: Building2 },
              { id: 'tax_compliance', label: 'GST & TDS Compliance', icon: FileCheck },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as FinanceTab)}
                  className={`flex items-center gap-2 py-3.5 px-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors ${
                    isActive
                      ? 'border-[#EA580C] text-[#EA580C]'
                      : 'border-transparent text-[#525252] hover:text-[#171717] hover:border-stone-300'
                  }`}
                >
                  <Icon size={15} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab 1: Client Invoices Data Table */}
          {activeTab === 'invoices' && (
            <div className="p-5 space-y-4">
              {/* 1. STATUS FILTER PILLS */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                {[
                  { id: 'ALL' as InvoiceStatusFilter, label: 'All Invoices', count: statusCounts.all },
                  { id: 'PAID' as InvoiceStatusFilter, label: 'Paid & Reconciled', count: statusCounts.paid },
                  { id: 'PARTIAL' as InvoiceStatusFilter, label: 'Partially Paid', count: statusCounts.partial },
                  { id: 'OVERDUE' as InvoiceStatusFilter, label: 'Payment Overdue', count: statusCounts.overdue },
                  { id: 'DRAFT' as InvoiceStatusFilter, label: 'Draft / Unsent', count: statusCounts.draft },
                ].map((st) => {
                  const isSelected = statusFilter === st.id;
                  return (
                    <button
                      key={st.id}
                      onClick={() => {
                        setStatusFilter(st.id);
                        setCurrentPage(1);
                      }}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border ${
                        isSelected
                          ? 'bg-[#171717] text-white border-[#171717] shadow-xs'
                          : 'bg-white text-[#525252] border-[#E5E5E5] hover:bg-[#F5F5F4] hover:text-[#171717]'
                      }`}
                    >
                      <span>{st.label}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                          isSelected ? 'bg-stone-700 text-stone-200' : 'bg-stone-100 text-[#737373]'
                        }`}
                      >
                        {st.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* 2. SEARCH & ADVANCED FILTER CONTROLS */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-[#FAFAF9] p-3 rounded-lg border border-[#E5E5E5]">
                {/* Search Bar */}
                <div className="relative flex-1 max-w-md">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#737373]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Search invoice #, client, campaign, GSTIN..."
                    className="w-full pl-9 pr-8 py-1.5 text-xs rounded-lg border border-[#E5E5E5] bg-white text-[#171717] placeholder:text-[#A3A3A3] focus:outline-none focus:ring-1 focus:ring-[#F97316] focus:border-[#F97316]"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setCurrentPage(1);
                      }}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-0.5 rounded"
                      title="Clear search"
                    >
                      <X size={13} />
                    </button>
                  )}
                </div>

                {/* Dropdown Filters */}
                <div className="flex flex-wrap items-center gap-2">
                  {/* Period Filter */}
                  <div className="flex items-center gap-1.5">
                    <Calendar size={13} className="text-[#737373]" />
                    <select
                      value={periodFilter}
                      onChange={(e) => {
                        setPeriodFilter(e.target.value as InvoicePeriodFilter);
                        setCurrentPage(1);
                      }}
                      className="h-8 px-2.5 rounded-lg border border-[#E5E5E5] bg-white text-xs font-medium text-[#171717] focus:outline-none focus:border-[#EA580C]"
                    >
                      <option value="ALL">All Periods</option>
                      <option value="OCT_2026">October 2026</option>
                      <option value="SEP_2026">September 2026</option>
                      <option value="AUG_2026">August 2026</option>
                    </select>
                  </div>

                  {/* Client Filter */}
                  <div className="flex items-center gap-1.5">
                    <Filter size={13} className="text-[#737373]" />
                    <select
                      value={clientFilter}
                      onChange={(e) => {
                        setClientFilter(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="h-8 px-2.5 rounded-lg border border-[#E5E5E5] bg-white text-xs font-medium text-[#171717] focus:outline-none focus:border-[#EA580C] max-w-[200px] truncate"
                    >
                      <option value="ALL">All Clients & Agencies</option>
                      {clientOptions.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Reset Filters Button */}
                  {isFiltered && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleResetFilters}
                      className="flex items-center gap-1.5 text-xs text-rose-700 border-rose-200 hover:bg-rose-50 h-8 px-2.5"
                      title="Reset all active filters"
                    >
                      <RotateCcw size={12} />
                      Reset
                    </Button>
                  )}
                </div>
              </div>

              {/* 3. FILTER SUMMARY STRIP */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs px-1 text-[#525252]">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[#171717]">
                    {totalItems} {totalItems === 1 ? 'Invoice' : 'Invoices'} Found
                  </span>
                  {isFiltered && (
                    <span className="text-[11px] text-[#737373]">
                      (filtered from {SAMPLE_INVOICE_RECORDS.length} total)
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 sm:gap-4 font-mono text-[11px]">
                  <div>
                    <span className="text-[#737373]">Total Value: </span>
                    <strong className="text-[#171717]">
                      ₹{filteredSummary.totalAmount.toLocaleString('en-IN')}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[#737373]">Collected: </span>
                    <strong className="text-emerald-700">
                      ₹{filteredSummary.paidAmount.toLocaleString('en-IN')}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[#737373]">Pending: </span>
                    <strong className={filteredSummary.balanceDue > 0 ? 'text-rose-700' : 'text-stone-700'}>
                      ₹{filteredSummary.balanceDue.toLocaleString('en-IN')}
                    </strong>
                  </div>
                </div>
              </div>

              {/* 4. SORTABLE DATA TABLE */}
              <div className="overflow-x-auto rounded-lg border border-[#E5E5E5] bg-white">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F5F5F4] text-[#525252] font-semibold border-b border-[#E5E5E5]">
                    <tr>
                      {/* Invoice # (Sortable) */}
                      <th
                        onClick={() => handleSort('id')}
                        className="py-2.5 px-3.5 cursor-pointer hover:bg-stone-200/60 transition-colors select-none"
                        title="Sort by Invoice Number"
                      >
                        <div className="flex items-center gap-1.5">
                          <span>Invoice #</span>
                          {sortField === 'id' ? (
                            sortDirection === 'asc' ? (
                              <ArrowUp size={12} className="text-[#EA580C]" />
                            ) : (
                              <ArrowDown size={12} className="text-[#EA580C]" />
                            )
                          ) : (
                            <ArrowUpDown size={12} className="text-stone-400 opacity-60" />
                          )}
                        </div>
                      </th>

                      {/* Client / Agency (Sortable) */}
                      <th
                        onClick={() => handleSort('client')}
                        className="py-2.5 px-3.5 cursor-pointer hover:bg-stone-200/60 transition-colors select-none"
                        title="Sort by Client / Agency"
                      >
                        <div className="flex items-center gap-1.5">
                          <span>Client / Agency</span>
                          {sortField === 'client' ? (
                            sortDirection === 'asc' ? (
                              <ArrowUp size={12} className="text-[#EA580C]" />
                            ) : (
                              <ArrowDown size={12} className="text-[#EA580C]" />
                            )
                          ) : (
                            <ArrowUpDown size={12} className="text-stone-400 opacity-60" />
                          )}
                        </div>
                      </th>

                      {/* Campaign */}
                      <th className="py-2.5 px-3.5">Campaign & Units</th>

                      {/* Due Date (Sortable) */}
                      <th
                        onClick={() => handleSort('dueDate')}
                        className="py-2.5 px-3.5 cursor-pointer hover:bg-stone-200/60 transition-colors select-none"
                        title="Sort by Payment Due Date"
                      >
                        <div className="flex items-center gap-1.5">
                          <span>Due Date</span>
                          {sortField === 'dueDate' ? (
                            sortDirection === 'asc' ? (
                              <ArrowUp size={12} className="text-[#EA580C]" />
                            ) : (
                              <ArrowDown size={12} className="text-[#EA580C]" />
                            )
                          ) : (
                            <ArrowUpDown size={12} className="text-stone-400 opacity-60" />
                          )}
                        </div>
                      </th>

                      {/* Base + GST (Sortable) */}
                      <th
                        onClick={() => handleSort('subtotal')}
                        className="py-2.5 px-3.5 cursor-pointer hover:bg-stone-200/60 transition-colors select-none"
                        title="Sort by Taxable Subtotal"
                      >
                        <div className="flex items-center gap-1.5">
                          <span>Base + GST</span>
                          {sortField === 'subtotal' ? (
                            sortDirection === 'asc' ? (
                              <ArrowUp size={12} className="text-[#EA580C]" />
                            ) : (
                              <ArrowDown size={12} className="text-[#EA580C]" />
                            )
                          ) : (
                            <ArrowUpDown size={12} className="text-stone-400 opacity-60" />
                          )}
                        </div>
                      </th>

                      {/* Total Invoiced (Sortable) */}
                      <th
                        onClick={() => handleSort('totalAmount')}
                        className="py-2.5 px-3.5 cursor-pointer hover:bg-stone-200/60 transition-colors select-none"
                        title="Sort by Total Invoiced Value"
                      >
                        <div className="flex items-center gap-1.5">
                          <span>Total Invoiced</span>
                          {sortField === 'totalAmount' ? (
                            sortDirection === 'asc' ? (
                              <ArrowUp size={12} className="text-[#EA580C]" />
                            ) : (
                              <ArrowDown size={12} className="text-[#EA580C]" />
                            )
                          ) : (
                            <ArrowUpDown size={12} className="text-stone-400 opacity-60" />
                          )}
                        </div>
                      </th>

                      {/* Status (Sortable) */}
                      <th
                        onClick={() => handleSort('status')}
                        className="py-2.5 px-3.5 cursor-pointer hover:bg-stone-200/60 transition-colors select-none"
                        title="Sort by Status"
                      >
                        <div className="flex items-center gap-1.5">
                          <span>Status</span>
                          {sortField === 'status' ? (
                            sortDirection === 'asc' ? (
                              <ArrowUp size={12} className="text-[#EA580C]" />
                            ) : (
                              <ArrowDown size={12} className="text-[#EA580C]" />
                            )
                          ) : (
                            <ArrowUpDown size={12} className="text-stone-400 opacity-60" />
                          )}
                        </div>
                      </th>

                      {/* Actions */}
                      <th className="py-2.5 px-3.5 text-right">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[#E5E5E5] text-[#171717]">
                    {paginatedInvoices.length > 0 ? (
                      paginatedInvoices.map((inv) => (
                        <tr key={inv.id} className="hover:bg-[#FAFAF9] transition-colors">
                          <td className="py-3 px-3.5 font-mono font-bold text-[#EA580C]">
                            <button
                              onClick={() => handleViewInvoice(inv)}
                              className="hover:underline text-left cursor-pointer transition-colors"
                              title="Click to check invoice"
                            >
                              {inv.id}
                            </button>
                          </td>
                          <td className="py-3 px-3.5">
                            <button
                              onClick={() => handleViewInvoice(inv)}
                              className="font-semibold text-[#171717] hover:text-[#EA580C] text-left cursor-pointer transition-colors block"
                            >
                              {inv.client}
                            </button>
                            <div className="text-[11px] text-[#737373]">{inv.paymentMode}</div>
                          </td>
                          <td className="py-3 px-3.5 text-[#525252]">
                            <div>{inv.campaignName}</div>
                            <span className="text-[10px] text-[#A3A3A3]">{inv.items.length} Site Units / Services</span>
                          </td>
                          <td className="py-3 px-3.5 text-[#525252] whitespace-nowrap">
                            {inv.dueDate}
                          </td>
                          <td className="py-3 px-3.5 text-[#525252]">
                            <div>₹{inv.subtotal.toLocaleString('en-IN')}</div>
                            <div className="text-[10px] text-[#737373]">+18% Tax ₹{inv.totalTax.toLocaleString('en-IN')}</div>
                          </td>
                          <td className="py-3 px-3.5 font-bold text-[#171717] whitespace-nowrap">
                            ₹{inv.totalAmount.toLocaleString('en-IN')}
                          </td>
                          <td className="py-3 px-3.5 whitespace-nowrap">
                            {inv.status === 'PAID' && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <CheckCircle2 size={11} /> Paid
                              </span>
                            )}
                            {inv.status === 'PARTIAL' && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                                <Clock size={11} /> Partial
                              </span>
                            )}
                            {inv.status === 'OVERDUE' && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                                <AlertCircle size={11} /> Overdue
                              </span>
                            )}
                            {inv.status === 'DRAFT' && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-stone-100 text-stone-700 border border-stone-200">
                                <FileText size={11} /> Draft
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-3.5 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleViewInvoice(inv)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-[#EA580C] bg-orange-50 hover:bg-orange-100 rounded transition-colors border border-orange-200 cursor-pointer shadow-2xs"
                                title="Check Invoice Details"
                              >
                                <Eye size={13} />
                                View
                              </button>
                              <button
                                onClick={() => handleDownloadPdf(inv.id)}
                                className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold text-[#525252] hover:text-[#171717] hover:bg-[#F5F5F4] rounded transition-colors border border-[#E5E5E5] cursor-pointer"
                                title="Download PDF"
                              >
                                <Download size={13} />
                                PDF
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      /* Empty State */
                      <tr>
                        <td colSpan={8} className="py-12 px-4 text-center">
                          <div className="max-w-sm mx-auto flex flex-col items-center">
                            <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mb-3">
                              <FileText size={20} />
                            </div>
                            <h4 className="text-sm font-bold text-[#171717]">No Invoices Found</h4>
                            <p className="text-xs text-[#737373] mt-1">
                              No tax invoices match the applied filters or search criteria.
                            </p>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleResetFilters}
                              className="mt-4 flex items-center gap-1.5 text-xs"
                            >
                              <RotateCcw size={12} />
                              Reset All Filters
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* 5. DATA TABLE PAGINATION FOOTER */}
              <div className="bg-[#FAFAF9] px-4 py-3 rounded-lg border border-[#E5E5E5] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#737373]">
                <div className="flex items-center gap-4">
                  <span>
                    Showing <strong className="text-[#171717]">{totalItems > 0 ? startIndex + 1 : 0}</strong> to{' '}
                    <strong className="text-[#171717]">{endIndex}</strong> of{' '}
                    <strong className="text-[#171717]">{totalItems}</strong> invoices
                  </span>

                  {/* Page Size Selector */}
                  <div className="flex items-center gap-1.5 pl-3 border-l border-[#E5E5E5]">
                    <span className="text-[11px]">Rows per page:</span>
                    <select
                      value={pageSize}
                      onChange={(e) => {
                        setPageSize(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      className="h-7 px-2 rounded-md border border-[#E5E5E5] bg-white text-xs text-[#171717] focus:outline-none focus:border-[#EA580C]"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                    </select>
                  </div>
                </div>

                {/* Page Navigation Buttons */}
                <div className="flex items-center gap-1">
                  {/* First Page */}
                  <button
                    type="button"
                    onClick={() => setCurrentPage(1)}
                    disabled={safeCurrentPage === 1}
                    className="p-1.5 rounded-md text-stone-600 hover:text-black hover:bg-stone-200 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                    title="First Page"
                  >
                    <ChevronsLeft size={14} />
                  </button>

                  {/* Previous Page */}
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={safeCurrentPage === 1}
                    className="p-1.5 rounded-md text-stone-600 hover:text-black hover:bg-stone-200 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                    title="Previous Page"
                  >
                    <ChevronLeft size={14} />
                  </button>

                  {/* Numbered Page Buttons */}
                  <div className="flex items-center gap-1 mx-1">
                    {paginationPages.map((page, idx) => {
                      if (page === '...') {
                        return (
                          <span key={`dots-${idx}`} className="px-1 text-stone-400 select-none">
                            ...
                          </span>
                        );
                      }
                      const pageNum = Number(page);
                      const isCurrent = pageNum === safeCurrentPage;
                      return (
                        <button
                          key={pageNum}
                          type="button"
                          onClick={() => setCurrentPage(pageNum)}
                          className={`min-w-[28px] h-7 px-1.5 rounded-md text-xs font-semibold transition-colors ${
                            isCurrent
                              ? 'bg-[#EA580C] text-white'
                              : 'text-stone-700 hover:bg-stone-200/80 hover:text-black'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  {/* Next Page */}
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={safeCurrentPage === totalPages || totalPages === 0}
                    className="p-1.5 rounded-md text-stone-600 hover:text-black hover:bg-stone-200 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                    title="Next Page"
                  >
                    <ChevronRight size={14} />
                  </button>

                  {/* Last Page */}
                  <button
                    type="button"
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={safeCurrentPage === totalPages || totalPages === 0}
                    className="p-1.5 rounded-md text-stone-600 hover:text-black hover:bg-stone-200 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                    title="Last Page"
                  >
                    <ChevronsRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: SODAARS Marketplace Settlements */}
          {activeTab === 'settlements' && (
            <div className="p-5 space-y-4">
              <div className="bg-[#FAFAF9] border border-[#E5E5E5] rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-bold text-[#171717] uppercase tracking-wide flex items-center gap-2">
                    <Landmark size={15} className="text-[#EA580C]" />
                    SODAARS Marketplace Escrow & Payout Policy
                  </h4>
                  <p className="text-xs text-[#525252] mt-1">
                    Settlements are automatically scheduled upon verification of mounting Proof-of-Performance (POP).
                    Platform fee (10%) and Section 194C TDS (1%) are reconciled automatically.
                  </p>
                </div>
                <div className="shrink-0 flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                    Auto-Disbursement: Net 15
                  </span>
                </div>
              </div>

              {/* Settlement Table */}
              <div className="overflow-x-auto rounded-lg border border-[#E5E5E5]">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F5F5F4] text-[#525252] font-semibold border-b border-[#E5E5E5]">
                    <tr>
                      <th className="py-2.5 px-3.5">Payout ID</th>
                      <th className="py-2.5 px-3.5">Advertiser / Brand</th>
                      <th className="py-2.5 px-3.5">Allocated Media Unit</th>
                      <th className="py-2.5 px-3.5">Gross Booking</th>
                      <th className="py-2.5 px-3.5">SODAARS Fee & TDS</th>
                      <th className="py-2.5 px-3.5">Net Payout to Bank</th>
                      <th className="py-2.5 px-3.5">Disbursement Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E5E5] text-[#171717]">
                    {SAMPLE_SETTLEMENTS.map((set) => (
                      <tr key={set.payoutId} className="hover:bg-[#FAFAF9] transition-colors">
                        <td className="py-3 px-3.5 font-mono font-bold text-[#171717]">
                          {set.payoutId}
                          <div className="text-[10px] text-[#737373]">{set.bookingRef}</div>
                        </td>
                        <td className="py-3 px-3.5 font-semibold text-[#171717]">
                          {set.advertiser}
                        </td>
                        <td className="py-3 px-3.5 text-[#525252]">
                          {set.mediaUnit}
                        </td>
                        <td className="py-3 px-3.5 font-semibold text-[#171717]">
                          {set.grossContract}
                        </td>
                        <td className="py-3 px-3.5 text-[#737373]">
                          <div>-{set.platformCommission}</div>
                          <div className="text-[10px] text-stone-500">-{set.tdsDeduction}</div>
                        </td>
                        <td className="py-3 px-3.5 font-bold text-emerald-600 whitespace-nowrap">
                          {set.netDisbursed}
                          <div className="text-[10px] text-[#737373] font-normal">{set.bankRef}</div>
                        </td>
                        <td className="py-3 px-3.5 whitespace-nowrap">
                          {set.status === 'DISBURSED' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <CheckCircle2 size={11} /> Disbursed
                            </span>
                          )}
                          {set.status === 'PROCESSING' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                              <Clock size={11} /> In Transit
                            </span>
                          )}
                          {set.status === 'IN_ESCROW' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                              <AlertCircle size={11} /> Escrow Lock
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 3: Accounts Receivable (Aging) */}
          {activeTab === 'receivables' && (
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-emerald-50/50 border border-emerald-200 rounded-lg">
                  <div className="text-[11px] font-semibold text-emerald-800">Current (0–15 Days)</div>
                  <div className="text-lg font-bold text-emerald-900 mt-1">₹4,20,000</div>
                  <div className="text-[10px] text-emerald-700 mt-0.5">3 Invoices within terms</div>
                </div>
                <div className="p-3 bg-amber-50/50 border border-amber-200 rounded-lg">
                  <div className="text-[11px] font-semibold text-amber-800">16–30 Days Past Due</div>
                  <div className="text-lg font-bold text-amber-900 mt-1">₹2,80,000</div>
                  <div className="text-[10px] text-amber-700 mt-0.5">1 Reminder notice issued</div>
                </div>
                <div className="p-3 bg-rose-50/50 border border-rose-200 rounded-lg">
                  <div className="text-[11px] font-semibold text-rose-800">31–60 Days Overdue</div>
                  <div className="text-lg font-bold text-rose-900 mt-1">₹1,45,000</div>
                  <div className="text-[10px] text-rose-700 mt-0.5">Escalated to sales director</div>
                </div>
                <div className="p-3 bg-stone-50 border border-stone-200 rounded-lg">
                  <div className="text-[11px] font-semibold text-[#525252]">60+ Days (Critical)</div>
                  <div className="text-lg font-bold text-[#171717] mt-1">₹0.00</div>
                  <div className="text-[10px] text-emerald-600 mt-0.5 font-semibold">Zero bad debt write-offs</div>
                </div>
              </div>

              <div className="bg-[#FAFAF9] rounded-lg border border-[#E5E5E5] p-4 text-xs text-[#525252]">
                <h5 className="font-bold text-[#171717] mb-1">Aging Analysis & Credit Control Policy</h5>
                <p>
                  SODAARS provides automated payment link dispatch, WhatsApp payment reminders for finance heads,
                  and booking-hold triggers if agency dues exceed 45 days.
                </p>
              </div>
            </div>
          )}

          {/* Tab 4: Site Leases & Municipal Fees */}
          {activeTab === 'expenses' && (
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-[#171717] uppercase tracking-wide">
                    Outdoor Media Outflows & Hoarding License Registry
                  </h4>
                  <p className="text-xs text-[#525252] mt-0.5">
                    Track recurring ground lease agreements with private landlords, municipal corporation ad tax, and DOOH electricity.
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => showToast('Adding New Site Expense Agreement...')}
                  className="flex items-center gap-1.5 text-xs"
                >
                  <Plus size={13} />
                  Add Site Expense
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-white border border-[#E5E5E5] rounded-xl shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#171717]">Private Ground Leases</span>
                    <Building2 size={16} className="text-[#EA580C]" />
                  </div>
                  <div className="text-xl font-bold text-[#171717] mt-2">₹4,85,000 / mo</div>
                  <p className="text-[11px] text-[#737373] mt-1">Paid to 14 property & rooftop owners</p>
                  <div className="mt-3 pt-3 border-t border-[#E5E5E5] flex justify-between text-[11px]">
                    <span className="text-[#737373]">Next renewal:</span>
                    <span className="font-semibold text-[#171717]">15 Nov 2026</span>
                  </div>
                </div>

                <div className="p-4 bg-white border border-[#E5E5E5] rounded-xl shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#171717]">Municipal Hoarding Tax</span>
                    <Landmark size={16} className="text-indigo-600" />
                  </div>
                  <div className="text-xl font-bold text-[#171717] mt-2">₹1,90,000 / qtr</div>
                  <p className="text-[11px] text-[#737373] mt-1">Municipal Corp Ad License clearance</p>
                  <div className="mt-3 pt-3 border-t border-[#E5E5E5] flex justify-between text-[11px]">
                    <span className="text-[#737373]">Compliance Status:</span>
                    <span className="font-semibold text-emerald-600">100% Licensed</span>
                  </div>
                </div>

                <div className="p-4 bg-white border border-[#E5E5E5] rounded-xl shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#171717]">DOOH Electricity & Power</span>
                    <TrendingUp size={16} className="text-amber-600" />
                  </div>
                  <div className="text-xl font-bold text-[#171717] mt-2">₹82,400 / mo</div>
                  <p className="text-[11px] text-[#737373] mt-1">Commercial tariff meters (14 sites)</p>
                  <div className="mt-3 pt-3 border-t border-[#E5E5E5] flex justify-between text-[11px]">
                    <span className="text-[#737373]">Avg unit cost:</span>
                    <span className="font-semibold text-[#171717]">₹11.20 / kWh</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 5: GST & TDS Compliance */}
          {activeTab === 'tax_compliance' && (
            <div className="p-5 space-y-4">
              <div className="bg-[#FAFAF9] border border-[#E5E5E5] rounded-lg p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-xs font-bold text-[#171717] uppercase tracking-wide">
                      Statutory GST & Direct Tax (TDS 194C) Summary
                    </h4>
                    <p className="text-xs text-[#525252] mt-0.5">
                      Export GSTR-1 outward supply JSON and Form 16A TDS reconciliation ledgers for direct CA upload.
                    </p>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => showToast('Generating GSTR-1 Outward Supplies JSON export...')}
                    className="flex items-center gap-1.5 text-xs shrink-0"
                  >
                    <Download size={13} />
                    Download GSTR-1 JSON
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-[#E5E5E5] rounded-lg p-4 bg-white">
                  <h5 className="font-semibold text-xs text-[#171717] flex items-center justify-between">
                    <span>GST Breakdown (SAC 998361 - Ad Space)</span>
                    <span className="text-[11px] font-mono text-[#EA580C]">18% Standard Rate</span>
                  </h5>
                  <div className="space-y-2 mt-3 text-xs">
                    <div className="flex justify-between py-1.5 border-b border-[#F5F5F4]">
                      <span className="text-[#737373]">CGST Output (9% Intra-state):</span>
                      <span className="font-semibold text-[#171717]">₹2,84,200</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-[#F5F5F4]">
                      <span className="text-[#737373]">SGST Output (9% Intra-state):</span>
                      <span className="font-semibold text-[#171717]">₹2,84,200</span>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span className="text-[#737373]">IGST Output (18% Inter-state):</span>
                      <span className="font-semibold text-[#171717]">₹58,000</span>
                    </div>
                  </div>
                </div>

                <div className="border border-[#E5E5E5] rounded-lg p-4 bg-white">
                  <h5 className="font-semibold text-xs text-[#171717] flex items-center justify-between">
                    <span>TDS Deductions (Section 194C - Hoarding Contracts)</span>
                    <span className="text-[11px] font-mono text-emerald-600">1% Individual / 2% Co.</span>
                  </h5>
                  <div className="space-y-2 mt-3 text-xs">
                    <div className="flex justify-between py-1.5 border-b border-[#F5F5F4]">
                      <span className="text-[#737373]">Total TDS Deducted by Clients:</span>
                      <span className="font-semibold text-[#171717]">₹34,800</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-[#F5F5F4]">
                      <span className="text-[#737373]">Form 26AS Matched:</span>
                      <span className="font-semibold text-emerald-600">₹34,800 (100% Reconciled)</span>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span className="text-[#737373]">Pending Form 16A Certificates:</span>
                      <span className="font-semibold text-amber-600">0 Pending</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Invoice Viewer Modal */}
      <InvoiceViewerModal
        isOpen={isInvoiceViewerOpen}
        onClose={handleCloseInvoiceViewer}
        invoice={selectedInvoice}
        onDownloadPdf={handleDownloadPdf}
      />
    </div>
  );
};

export default FinancePage;
