import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  CreditCard, 
  Search, 
  Filter, 
  Download, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  XCircle, 
  FileText, 
  Building2, 
  ExternalLink, 
  Printer, 
  DollarSign, 
  Calendar,
  X,
  Receipt,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  RotateCcw,
  Sliders
} from 'lucide-react';
import { mockPackageInvoices } from '../../data/mockAdminData';
import { PackagePaymentInvoice } from '../../types';

type SortField = 'id' | 'providerName' | 'planName' | 'paymentDate' | 'totalAmount' | 'status';
type SortDirection = 'asc' | 'desc';

export const PaymentHistoryPage: React.FC = () => {
  const [invoices, setInvoices] = useState<PackagePaymentInvoice[]>(mockPackageInvoices);
  
  // Filter states
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'failed'>('all');
  const [billingCycleFilter, setBillingCycleFilter] = useState<string>('all');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>('all');

  // Sorting states
  const [sortField, setSortField] = useState<SortField>('paymentDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(50);

  // Modal invoice state
  const [selectedInvoice, setSelectedInvoice] = useState<PackagePaymentInvoice | null>(null);

  // Check if any filter is active
  const isFiltered = Boolean(
    search || 
    statusFilter !== 'all' || 
    billingCycleFilter !== 'all' || 
    paymentMethodFilter !== 'all'
  );

  const handleResetFilters = () => {
    setSearch('');
    setStatusFilter('all');
    setBillingCycleFilter('all');
    setPaymentMethodFilter('all');
    setCurrentPage(1);
  };

  // Reset to first page when search or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, billingCycleFilter, paymentMethodFilter, pageSize]);

  // Toggle sorting on column header click
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
    const list = invoices.filter((inv) => {
      const matchesSearch =
        inv.id.toLowerCase().includes(search.toLowerCase()) ||
        inv.providerName.toLowerCase().includes(search.toLowerCase()) ||
        inv.paymentRef.toLowerCase().includes(search.toLowerCase()) ||
        inv.planName.toLowerCase().includes(search.toLowerCase()) ||
        inv.gstin.toLowerCase().includes(search.toLowerCase()) ||
        (inv.city && inv.city.toLowerCase().includes(search.toLowerCase())) ||
        (inv.state && inv.state.toLowerCase().includes(search.toLowerCase()));

      const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
      const matchesCycle = billingCycleFilter === 'all' || inv.billingCycle === billingCycleFilter;
      const matchesMethod = paymentMethodFilter === 'all' || inv.paymentMethod === paymentMethodFilter;

      return matchesSearch && matchesStatus && matchesCycle && matchesMethod;
    });

    list.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'id':
          comparison = a.id.localeCompare(b.id);
          break;
        case 'providerName':
          comparison = a.providerName.localeCompare(b.providerName);
          break;
        case 'planName':
          comparison = a.planName.localeCompare(b.planName);
          break;
        case 'paymentDate':
          comparison = new Date(a.paymentDate).getTime() - new Date(b.paymentDate).getTime();
          break;
        case 'totalAmount':
          comparison = a.totalAmount - b.totalAmount;
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        default:
          comparison = 0;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return list;
  }, [invoices, search, statusFilter, billingCycleFilter, paymentMethodFilter, sortField, sortDirection]);

  // Pagination computations
  const totalRecords = filteredAndSorted.length;
  const totalPages = Math.ceil(totalRecords / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalRecords);
  const paginatedInvoices = filteredAndSorted.slice(startIndex, endIndex);

  // Financial KPIs
  const totalCollected = invoices
    .filter((inv) => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.totalAmount, 0);

  const totalGstCollected = invoices
    .filter((inv) => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.gstAmount, 0);

  const successfulCount = invoices.filter((inv) => inv.status === 'paid').length;
  const failedCount = invoices.filter((inv) => inv.status === 'failed').length;

  // Helper for rendering clickable sort headers
  const renderSortHeader = (label: string, field: SortField, align: 'left' | 'right' = 'left') => {
    const isActive = sortField === field;
    return (
      <th
        onClick={() => handleSort(field)}
        className={`py-3 px-3 cursor-pointer select-none group transition-colors hover:bg-zinc-100/80 ${
          align === 'right' ? 'text-right' : 'text-left'
        }`}
      >
        <div className={`inline-flex items-center gap-1.5 ${align === 'right' ? 'flex-row-reverse' : ''}`}>
          <span className={`text-[10px] font-mono uppercase tracking-wider font-bold transition-colors ${
            isActive ? 'text-orange-600' : 'text-zinc-500 group-hover:text-zinc-900'
          }`}>
            {label}
          </span>
          <span className="text-zinc-400 group-hover:text-zinc-700">
            {isActive ? (
              sortDirection === 'asc' ? (
                <ArrowUp className="w-3.5 h-3.5 text-orange-600 stroke-[2.5]" />
              ) : (
                <ArrowDown className="w-3.5 h-3.5 text-orange-600 stroke-[2.5]" />
              )
            ) : (
              <ArrowUpDown className="w-3 h-3 text-zinc-300 opacity-60 group-hover:opacity-100" />
            )}
          </span>
        </div>
      </th>
    );
  };

  // CSV Export
  const handleExportCsv = () => {
    const headers = ['Invoice ID,Provider Name,GSTIN,City,Plan Name,Billing Cycle,Base Amount,GST (18%),Total Paid,Payment Date,Payment Ref,Payment Method,Status\n'];
    const rows = filteredAndSorted.map(inv => 
      `"${inv.id}","${inv.providerName}","${inv.gstin}","${inv.city}","${inv.planName}","${inv.billingCycle}",${inv.baseAmount},${inv.gstAmount},${inv.totalAmount},"${inv.paymentDate}","${inv.paymentRef}","${inv.paymentMethod}","${inv.status}"`
    );
    const blob = new Blob([...headers, rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `SODAARS_GST_Invoices_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight font-sans">
              Payment History
            </h1>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-semibold">
              GST INVOICES
            </span>
          </div>
          <p className="text-sm text-zinc-500 mt-1">
            Complete transaction ledger of package payments made by media providers to platform admin.
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-semibold text-zinc-700 shadow-xs transition-colors self-start sm:self-auto font-mono"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export GST Invoices (CSV)</span>
        </button>
      </div>

      {/* Financial KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-zinc-200/80 shadow-xs space-y-1">
          <span className="text-[11px] font-mono uppercase font-bold text-zinc-400">Total Subscription Collections</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-zinc-950 font-sans tracking-tight">
            ₹{Math.round(totalCollected).toLocaleString('en-IN')}
          </div>
          <p className="text-xs text-zinc-500 pt-0.5">Includes 18% statutory GST</p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-zinc-200/80 shadow-xs space-y-1">
          <span className="text-[11px] font-mono uppercase font-bold text-zinc-400">Total GST Remitted (18%)</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700 font-sans tracking-tight">
            ₹{Math.round(totalGstCollected).toLocaleString('en-IN')}
          </div>
          <p className="text-xs text-zinc-500 pt-0.5">SAC Code 998315 (IT Services)</p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-zinc-200/80 shadow-xs space-y-1">
          <span className="text-[11px] font-mono uppercase font-bold text-zinc-400">Successful Transactions</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-zinc-950 font-sans tracking-tight">
            {successfulCount} Paid
          </div>
          <p className="text-xs text-emerald-600 font-semibold pt-0.5">100% captured via Gateway</p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-zinc-200/80 shadow-xs space-y-1">
          <span className="text-[11px] font-mono uppercase font-bold text-zinc-400">Failed / Retrying Renewals</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-red-600 font-sans tracking-tight">
            {failedCount} Overdue
          </div>
          <p className="text-xs text-zinc-500 pt-0.5">Grace period grace notice active</p>
        </div>
      </div>

      {/* Invoices Table & Filter Controls */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 p-5 sm:p-6 space-y-4">
        {/* Filter Controls Row */}
        <div className="space-y-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search invoice #, provider, GSTIN, city..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-2 rounded-lg border border-zinc-200 focus:outline-none focus:border-orange-500 font-sans"
              />
            </div>

            {/* Quick Status Buttons */}
            <div className="flex items-center gap-1.5 text-xs font-mono overflow-x-auto pb-1 md:pb-0">
              {(['all', 'paid', 'failed'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg capitalize transition-colors whitespace-nowrap ${
                    statusFilter === st
                      ? 'bg-zinc-900 text-white font-bold shadow-xs'
                      : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                  }`}
                >
                  {st === 'all' ? 'All Invoices' : st.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Secondary Filter Selects */}
          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-zinc-100">
            <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-mono">
              <Sliders className="w-3.5 h-3.5 text-zinc-400" />
              <span>Filters:</span>
            </div>

            {/* Billing Cycle Filter */}
            <select
              value={billingCycleFilter}
              onChange={(e) => setBillingCycleFilter(e.target.value)}
              className="text-xs px-2.5 py-1.5 rounded-lg border border-zinc-200 bg-white font-mono text-zinc-700 focus:outline-none focus:border-orange-500"
            >
              <option value="all">All Billing Cycles</option>
              <option value="Monthly">Monthly Cycle</option>
              <option value="Annual">Annual Cycle</option>
            </select>

            {/* Payment Method Filter */}
            <select
              value={paymentMethodFilter}
              onChange={(e) => setPaymentMethodFilter(e.target.value)}
              className="text-xs px-2.5 py-1.5 rounded-lg border border-zinc-200 bg-white font-mono text-zinc-700 focus:outline-none focus:border-orange-500"
            >
              <option value="all">All Payment Methods</option>
              <option value="UPI AutoPay">UPI AutoPay</option>
              <option value="NEFT / RTGS">NEFT / RTGS</option>
              <option value="Corporate Card">Corporate Card</option>
              <option value="Netbanking">Netbanking</option>
            </select>

            {/* Reset Filters Button */}
            {isFiltered && (
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100 font-mono font-medium transition-colors ml-auto"
                title="Reset all search and filter settings"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto rounded-xl border border-zinc-200">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/75">
                {renderSortHeader('Tax Invoice #', 'id')}
                {renderSortHeader('Media Provider & GSTIN', 'providerName')}
                {renderSortHeader('Package Tier & Cycle', 'planName')}
                {renderSortHeader('Payment Date', 'paymentDate')}
                {renderSortHeader('Total Paid', 'totalAmount')}
                <th className="py-3 px-3 text-[10px] font-mono uppercase tracking-wider font-bold text-zinc-500">
                  Gateway Ref ID
                </th>
                <th className="py-3 px-3 text-[10px] font-mono uppercase tracking-wider font-bold text-zinc-500">
                  Payment Method
                </th>
                {renderSortHeader('Status', 'status')}
                <th className="py-3 px-3 text-[10px] font-mono uppercase tracking-wider font-bold text-zinc-500 text-right">
                  Tax Receipt
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 bg-white">
              {paginatedInvoices.length > 0 ? (
                paginatedInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-zinc-50/70 transition-colors">
                    <td className="py-3.5 px-3">
                      <span className="font-mono font-bold text-orange-600 block">{inv.id}</span>
                      <span className="text-[10px] text-zinc-400 font-mono">{inv.paymentDate.split(' ')[0]}</span>
                    </td>

                    <td className="py-3.5 px-3">
                      <Link
                        to={`/admin/providers/${inv.providerId}`}
                        className="font-bold text-zinc-900 hover:text-orange-600 block transition-colors"
                        title="View Provider Details"
                      >
                        {inv.providerName}
                      </Link>
                      <span className="text-[10px] text-zinc-500 font-mono">
                        GSTIN: {inv.gstin} {inv.city ? `• ${inv.city}` : ''}
                      </span>
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="font-semibold text-zinc-800 block">{inv.planName}</span>
                      <span className="text-[10px] text-zinc-400 font-mono">
                        Period: {inv.periodStart} to {inv.periodEnd}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 font-mono text-zinc-600 whitespace-nowrap">
                      <div>{inv.paymentDate.split(' ')[0]}</div>
                      <span className="text-[10px] text-zinc-400">{inv.paymentDate.split(' ')[1] || ''}</span>
                    </td>

                    <td className="py-3.5 px-3 font-mono">
                      <span className="font-extrabold text-zinc-950 text-sm block">
                        ₹{inv.totalAmount.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-zinc-400">
                        (Base ₹{inv.baseAmount.toLocaleString('en-IN')} + GST)
                      </span>
                    </td>

                    <td className="py-3.5 px-3 font-mono text-zinc-500 text-[11px] whitespace-nowrap">
                      {inv.paymentRef}
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 text-[11px] font-mono whitespace-nowrap">
                        {inv.paymentMethod}
                      </span>
                    </td>

                    <td className="py-3.5 px-3">
                      {inv.status === 'paid' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono bg-emerald-100 text-emerald-800 font-bold">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> PAID
                        </span>
                      )}
                      {inv.status === 'failed' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono bg-red-100 text-red-800 font-bold">
                          <XCircle className="w-3 h-3 text-red-600" /> FAILED
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-3 text-right">
                      <button
                        onClick={() => setSelectedInvoice(inv)}
                        className="px-2.5 py-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-100 text-zinc-800 font-semibold text-xs flex items-center gap-1 ml-auto font-mono transition-colors"
                      >
                        <Receipt className="w-3.5 h-3.5 text-orange-600" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="py-12 text-center">
                    <div className="max-w-xs mx-auto space-y-2">
                      <FileText className="w-8 h-8 text-zinc-300 mx-auto" />
                      <p className="text-sm font-semibold text-zinc-700">No matching tax invoices found</p>
                      <p className="text-xs text-zinc-400">
                        Try modifying your search or clearing the active filters.
                      </p>
                      {isFiltered && (
                        <button
                          onClick={handleResetFilters}
                          className="mt-2 text-xs text-orange-600 font-semibold hover:underline inline-flex items-center gap-1"
                        >
                          <RotateCcw className="w-3 h-3" /> Reset all filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination & Summary Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-3 border-t border-zinc-100 text-xs text-zinc-600 font-mono">
          <div className="flex items-center gap-3">
            <span>
              Showing <strong className="text-zinc-900">{totalRecords > 0 ? startIndex + 1 : 0}</strong> to{' '}
              <strong className="text-zinc-900">{endIndex}</strong> of{' '}
              <strong className="text-zinc-900">{totalRecords}</strong> tax invoices
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

          {/* Page Navigation Buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="p-1.5 rounded border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="First Page"
            >
              <ChevronsLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Previous Page"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            {/* Numeric page pills */}
            <div className="flex items-center gap-1 px-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(page => {
                  if (totalPages <= 5) return true;
                  return Math.abs(page - currentPage) <= 1 || page === 1 || page === totalPages;
                })
                .map((page, index, arr) => {
                  const showEllipsis = index > 0 && page - arr[index - 1] > 1;
                  return (
                    <React.Fragment key={page}>
                      {showEllipsis && <span className="px-1 text-zinc-400">...</span>}
                      <button
                        onClick={() => setCurrentPage(page)}
                        className={`w-7 h-7 rounded text-xs font-mono font-bold transition-colors ${
                          currentPage === page
                            ? 'bg-zinc-900 text-white shadow-xs'
                            : 'bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-100'
                        }`}
                      >
                        {page}
                      </button>
                    </React.Fragment>
                  );
                })}
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages || totalRecords === 0}
              className="p-1.5 rounded border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Next Page"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages || totalRecords === 0}
              className="p-1.5 rounded border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Last Page"
            >
              <ChevronsRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Tax Invoice Modal Drawer */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8 shadow-2xl border border-zinc-200 space-y-6 max-h-[90vh] overflow-y-auto font-sans">
            {/* Modal Top Bar */}
            <div className="flex items-center justify-between pb-4 border-b border-zinc-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-orange-600 text-white flex items-center justify-center font-bold text-xs font-mono">
                  TAX
                </div>
                <div>
                  <h3 className="font-bold text-zinc-950 text-base">Original Tax Invoice</h3>
                  <p className="text-xs text-zinc-400 font-mono">Invoice #{selectedInvoice.id}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-100 text-zinc-700 text-xs font-semibold flex items-center gap-1 font-mono"
                >
                  <Printer className="w-3.5 h-3.5" /> Print Receipt
                </button>
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-zinc-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Invoice Printable Sheet */}
            <div className="p-6 rounded-xl border border-zinc-200 bg-zinc-50/50 space-y-6 text-xs">
              {/* Header: Company & Invoice Info */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <span className="font-extrabold text-lg text-zinc-950 font-mono tracking-tight">SODAARS TECHNOLOGIES INDIA PVT LTD</span>
                  <p className="text-zinc-600 mt-1">Level 7, OOH Tower, Bandra Kurla Complex (BKC)</p>
                  <p className="text-zinc-600">Mumbai, Maharashtra - 400051</p>
                  <p className="font-mono text-zinc-700 mt-1">GSTIN: <strong className="text-zinc-950">27AABCS9912Q1ZX</strong></p>
                  <p className="font-mono text-zinc-500 text-[11px]">CIN: U74300MH2025PTC399120</p>
                </div>

                <div className="text-left sm:text-right space-y-1 font-mono">
                  <div className="text-sm font-bold text-zinc-950">TAX INVOICE</div>
                  <div className="text-orange-600 font-bold">{selectedInvoice.id}</div>
                  <div className="text-zinc-500">Date: {selectedInvoice.paymentDate}</div>
                  <div className="text-zinc-500">SAC: {selectedInvoice.sacCode}</div>
                </div>
              </div>

              {/* Billed To */}
              <div className="p-3.5 rounded-lg bg-white border border-zinc-200 space-y-1">
                <span className="text-[10px] font-mono uppercase font-bold text-zinc-400">Billed To (Media Provider)</span>
                <p className="font-bold text-zinc-900 text-sm">{selectedInvoice.legalEntity}</p>
                <p className="text-zinc-600">{selectedInvoice.city}, {selectedInvoice.state}</p>
                <p className="font-mono text-zinc-700">GSTIN: <strong className="text-orange-600">{selectedInvoice.gstin}</strong></p>
              </div>

              {/* Items Breakdown */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-zinc-300 font-mono uppercase text-[10px] text-zinc-500">
                      <th className="py-2">Description / Package Service</th>
                      <th className="py-2">Billing Cycle</th>
                      <th className="py-2">SAC Code</th>
                      <th className="py-2 text-right">Taxable Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 font-mono">
                    <tr>
                      <td className="py-3 font-semibold text-zinc-900 font-sans">
                        {selectedInvoice.planName}
                        <span className="block text-[11px] text-zinc-500 font-normal">
                          Service Period: {selectedInvoice.periodStart} to {selectedInvoice.periodEnd}
                        </span>
                      </td>
                      <td className="py-3">{selectedInvoice.billingCycle}</td>
                      <td className="py-3">{selectedInvoice.sacCode}</td>
                      <td className="py-3 text-right">₹{selectedInvoice.baseAmount.toLocaleString('en-IN')}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Tax Computation */}
              <div className="pt-3 border-t border-zinc-300 flex justify-end">
                <div className="w-72 space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between text-zinc-600">
                    <span>Taxable Base Value:</span>
                    <span>₹{selectedInvoice.baseAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-zinc-600">
                    <span>CGST (9.0%):</span>
                    <span>₹{(selectedInvoice.gstAmount / 2).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-zinc-600">
                    <span>SGST (9.0%):</span>
                    <span>₹{(selectedInvoice.gstAmount / 2).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-zinc-300 text-sm font-bold text-zinc-950">
                    <span>Total Amount Paid:</span>
                    <span className="text-orange-600 font-sans font-extrabold">₹{selectedInvoice.totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Payment Receipt Seal */}
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-emerald-950 block">Payment Successfully Captured</span>
                  <span className="text-[11px] text-emerald-800 font-mono">
                    Gateway Ref: {selectedInvoice.paymentRef} • Method: {selectedInvoice.paymentMethod}
                  </span>
                </div>
                <span className="px-3 py-1 rounded bg-emerald-600 text-white font-mono font-bold text-xs">
                  PAID IN FULL
                </span>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedInvoice(null)}
                className="px-5 py-2 rounded-lg bg-zinc-900 text-white text-xs font-semibold"
              >
                Close Tax Invoice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
