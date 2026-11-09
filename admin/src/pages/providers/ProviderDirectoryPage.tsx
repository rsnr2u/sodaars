import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  XCircle, 
  Layers, 
  Phone, 
  Mail, 
  MapPin, 
  ChevronRight, 
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  ExternalLink, 
  ShieldCheck, 
  FileCheck2, 
  Eye,
  Receipt,
  Download,
  SlidersHorizontal,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  RotateCcw
} from 'lucide-react';
import { mockProviders } from '../../data/mockAdminData';
import { ProviderItem } from '../../types';

type SortField = 'name' | 'city' | 'resourceCount' | 'kycStatus' | 'accountStatus' | 'joinedDate';
type SortDirection = 'asc' | 'desc';

export const ProviderDirectoryPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [providers, setProviders] = useState<ProviderItem[]>(mockProviders);
  
  // Filter states
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'probation' | 'suspended'>('all');
  const [tierFilter, setTierFilter] = useState<string>('all');
  const [kycFilter, setKycFilter] = useState<string>('all');
  const [stateFilter, setStateFilter] = useState<string>('all');
  const [cityFilter, setCityFilter] = useState<string>('all');

  // Unique States & Cities for cascading location filters
  const uniqueStates = useMemo(() => {
    return Array.from(new Set(mockProviders.map(p => p.state))).sort();
  }, []);

  const uniqueCities = useMemo(() => {
    const list = stateFilter === 'all' 
      ? mockProviders 
      : mockProviders.filter(p => p.state === stateFilter);
    return Array.from(new Set(list.map(p => p.city))).sort();
  }, [stateFilter]);

  // Reset city filter if state changes and city not valid for state
  const handleStateChange = (state: string) => {
    setStateFilter(state);
    setCityFilter('all');
  };

  // Sorting states
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(50);

  // If someone navigated with ?id= query param, direct them directly to the provider detail page
  useEffect(() => {
    const idFromUrl = searchParams.get('id');
    if (idFromUrl) {
      navigate(`/admin/providers/${idFromUrl}`, { replace: true });
    }
  }, [searchParams, navigate]);

  // Check if any filter is active
  const isFiltered = Boolean(
    search || 
    statusFilter !== 'all' || 
    tierFilter !== 'all' || 
    kycFilter !== 'all' ||
    stateFilter !== 'all' ||
    cityFilter !== 'all'
  );

  const handleResetFilters = () => {
    setSearch('');
    setStatusFilter('all');
    setTierFilter('all');
    setKycFilter('all');
    setStateFilter('all');
    setCityFilter('all');
    setCurrentPage(1);
  };

  // Reset to first page when search or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, tierFilter, kycFilter, stateFilter, cityFilter, pageSize]);

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
    const list = providers.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.legalEntity.toLowerCase().includes(search.toLowerCase()) ||
        p.gstin.toLowerCase().includes(search.toLowerCase()) ||
        p.pan.toLowerCase().includes(search.toLowerCase()) ||
        p.city.toLowerCase().includes(search.toLowerCase()) ||
        p.state.toLowerCase().includes(search.toLowerCase()) ||
        p.contactPerson.toLowerCase().includes(search.toLowerCase()) ||
        p.email.toLowerCase().includes(search.toLowerCase()) ||
        p.phone.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = statusFilter === 'all' || p.accountStatus === statusFilter;
      const matchesTier = tierFilter === 'all' || p.tier === tierFilter;
      const matchesKyc = kycFilter === 'all' || p.kycStatus === kycFilter;
      const matchesState = stateFilter === 'all' || p.state === stateFilter;
      const matchesCity = cityFilter === 'all' || p.city === cityFilter;

      return matchesSearch && matchesStatus && matchesTier && matchesKyc && matchesState && matchesCity;
    });

    list.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'city':
          comparison = `${a.city}, ${a.state}`.localeCompare(`${b.city}, ${b.state}`);
          break;
        case 'resourceCount':
          comparison = a.resourceCount - b.resourceCount;
          break;
        case 'kycStatus':
          comparison = a.kycStatus.localeCompare(b.kycStatus);
          break;
        case 'accountStatus':
          comparison = a.accountStatus.localeCompare(b.accountStatus);
          break;
        case 'joinedDate':
          comparison = new Date(a.joinedDate).getTime() - new Date(b.joinedDate).getTime();
          break;
        default:
          comparison = 0;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return list;
  }, [providers, search, statusFilter, tierFilter, kycFilter, sortField, sortDirection]);

  // Pagination computations
  const totalRecords = filteredAndSorted.length;
  const totalPages = Math.ceil(totalRecords / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalRecords);
  const paginatedProviders = filteredAndSorted.slice(startIndex, endIndex);

  const handleToggleStatus = (id: string, currentStatus: ProviderItem['accountStatus']) => {
    const nextStatus = currentStatus === 'active' ? 'suspended' : 'active';
    setProviders((prev) =>
      prev.map((p) => (p.id === id ? { ...p, accountStatus: nextStatus } : p))
    );
  };

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
    const headers = ['Provider ID,Provider Name,Legal Entity,GSTIN,PAN,City,State,Tier,Contact Person,Phone,Email,Resources,KYC Status,Account Status,Joined Date\n'];
    const rows = filteredAndSorted.map(p => 
      `"${p.id}","${p.name}","${p.legalEntity}","${p.gstin}","${p.pan}","${p.city}","${p.state}","${p.tier}","${p.contactPerson}","${p.phone}","${p.email}",${p.resourceCount},"${p.kycStatus}","${p.accountStatus}","${p.joinedDate}"`
    );
    const blob = new Blob([...headers, rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `SODAARS_Providers_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight font-sans">
              Providers
            </h1>
            <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800 border border-orange-300 font-semibold">
              {providers.length} REGISTERED
            </span>
          </div>
          <p className="text-sm text-zinc-500 mt-1">
            Directory and operations management for media-owning partners across all cities and tiers.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 text-xs font-semibold shadow-2xs transition-colors font-mono"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <Link
            to="/admin/providers/kyc"
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 text-xs font-semibold shadow-2xs transition-colors"
          >
            <FileCheck2 className="w-4 h-4 text-orange-600" />
            <span>KYC Verification Desk</span>
          </Link>

          <Link
            to="/admin/payments"
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Receipt className="w-4 h-4" />
            <span>Package Payments</span>
          </Link>
        </div>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-zinc-200/80 shadow-xs space-y-1">
          <span className="text-[10px] font-mono uppercase font-bold text-zinc-400">Total Media Providers</span>
          <div className="text-2xl font-extrabold text-zinc-950 font-sans">{providers.length} Enterprises</div>
          <p className="text-xs text-zinc-500 pt-0.5">Operating across 14 major metros</p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-zinc-200/80 shadow-xs space-y-1">
          <span className="text-[10px] font-mono uppercase font-bold text-zinc-400">KYC Verified & Live</span>
          <div className="text-2xl font-extrabold text-emerald-700 font-sans">
            {providers.filter((p) => p.kycStatus === 'verified').length} Verified
          </div>
          <p className="text-xs text-emerald-600 font-semibold pt-0.5">Full statutory compliance</p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-zinc-200/80 shadow-xs space-y-1">
          <span className="text-[10px] font-mono uppercase font-bold text-zinc-400">KYC Under Review</span>
          <div className="text-2xl font-extrabold text-amber-600 font-sans">
            {providers.filter((p) => p.kycStatus === 'under_review').length} Pending
          </div>
          <p className="text-xs text-zinc-500 pt-0.5">Municipal & trade license audits</p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-zinc-200/80 shadow-xs space-y-1">
          <span className="text-[10px] font-mono uppercase font-bold text-zinc-400">Total Network Resources</span>
          <div className="text-2xl font-extrabold text-zinc-950 font-sans">
            {providers.reduce((sum, p) => sum + p.resourceCount, 0)} Units
          </div>
          <p className="text-xs text-zinc-500 pt-0.5">Registered media assets</p>
        </div>
      </div>

      {/* Search, Filters & Data Table */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 p-5 sm:p-6 space-y-4 shadow-xs">
        <div className="space-y-3">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="relative w-full lg:w-96">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search provider name, GSTIN, legal entity, city..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-2 rounded-lg border border-zinc-200 focus:outline-none focus:border-orange-500 font-sans"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-zinc-400 font-mono">Status:</span>
              {(['all', 'active', 'probation', 'suspended'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono capitalize font-medium transition-colors ${
                    statusFilter === st
                      ? 'bg-zinc-900 text-white font-bold'
                      : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Secondary Filters Bar */}
          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-zinc-100">
            <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-mono">
              <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-400" />
              <span>Filters:</span>
            </div>

            {/* KYC Filter */}
            <select
              value={kycFilter}
              onChange={(e) => setKycFilter(e.target.value)}
              className="text-xs px-2.5 py-1.5 rounded-lg border border-zinc-200 bg-white font-mono text-zinc-700 focus:outline-none focus:border-orange-500"
            >
              <option value="all">All KYC Statuses</option>
              <option value="verified">Verified Only</option>
              <option value="under_review">Under Review</option>
              <option value="rejected">Rejected</option>
            </select>

            {/* Tier Filter */}
            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
              className="text-xs px-2.5 py-1.5 rounded-lg border border-zinc-200 bg-white font-mono text-zinc-700 focus:outline-none focus:border-orange-500"
            >
              <option value="all">All Tiers</option>
              <option value="Tier 1">Tier 1 Metros</option>
              <option value="Tier 2">Tier 2 Cities</option>
              <option value="Tier 3">Tier 3 Towns</option>
            </select>

            {/* State Filter */}
            <select
              value={stateFilter}
              onChange={(e) => handleStateChange(e.target.value)}
              className="text-xs px-2.5 py-1.5 rounded-lg border border-zinc-200 bg-white font-mono text-zinc-700 focus:outline-none focus:border-orange-500"
            >
              <option value="all">All States</option>
              {uniqueStates.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>

            {/* City Filter */}
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="text-xs px-2.5 py-1.5 rounded-lg border border-zinc-200 bg-white font-mono text-zinc-700 focus:outline-none focus:border-orange-500"
            >
              <option value="all">
                {stateFilter === 'all' ? 'All Cities' : `Cities in ${stateFilter}`}
              </option>
              {uniqueCities.map((ct) => (
                <option key={ct} value={ct}>
                  {ct}
                </option>
              ))}
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

        {/* Providers Data Table */}
        <div className="overflow-x-auto rounded-xl border border-zinc-200">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/75">
                {renderSortHeader('Provider', 'name')}
                {renderSortHeader('City & State', 'city')}
                <th className="py-3 px-3 text-[10px] font-mono uppercase tracking-wider font-bold text-zinc-500">
                  Contact Person
                </th>
                {renderSortHeader('Resources', 'resourceCount')}
                <th className="py-3 px-3 text-[10px] font-mono uppercase tracking-wider font-bold text-zinc-500">
                  GSTIN & PAN
                </th>
                {renderSortHeader('KYC Status', 'kycStatus')}
                {renderSortHeader('Account Status', 'accountStatus')}
                <th className="py-3 px-3 text-[10px] font-mono uppercase tracking-wider font-bold text-zinc-500 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 bg-white">
              {paginatedProviders.length > 0 ? (
                paginatedProviders.map((provider) => (
                  <tr key={provider.id} className="hover:bg-zinc-50/70 transition-colors">
                    <td className="py-3.5 px-3">
                      <Link
                        to={`/admin/providers/${provider.id}`}
                        className="flex items-center gap-3 group"
                      >
                        <div className="w-9 h-9 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-xs font-mono group-hover:scale-105 transition-transform">
                          {provider.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <span className="font-bold text-zinc-900 block text-xs group-hover:text-orange-600 transition-colors">
                            {provider.name}
                          </span>
                          <span className="text-[11px] text-zinc-500 block truncate max-w-[200px]">
                            {provider.legalEntity}
                          </span>
                        </div>
                      </Link>
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="font-medium text-zinc-800 block">{provider.city}, {provider.state}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-100 text-zinc-600">
                        {provider.tier}
                      </span>
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="font-medium text-zinc-900 block">{provider.contactPerson}</span>
                      <span className="text-[10px] font-mono text-zinc-500 block">{provider.phone}</span>
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-1.5 font-mono">
                        <Layers className="w-3.5 h-3.5 text-zinc-400" />
                        <strong className="text-zinc-900 text-sm">{provider.resourceCount}</strong>
                        <span className="text-zinc-500 text-[11px]">units</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-3 font-mono">
                      <span className="text-zinc-800 font-semibold block">{provider.gstin}</span>
                      <span className="text-[10px] text-zinc-400">PAN: {provider.pan}</span>
                    </td>

                    <td className="py-3.5 px-3">
                      {provider.kycStatus === 'verified' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono bg-emerald-100 text-emerald-800 font-bold">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> VERIFIED
                        </span>
                      )}
                      {provider.kycStatus === 'under_review' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono bg-amber-100 text-amber-800 font-bold">
                          <Clock className="w-3 h-3 text-amber-600" /> UNDER REVIEW
                        </span>
                      )}
                      {provider.kycStatus === 'rejected' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono bg-red-100 text-red-800 font-bold">
                          <XCircle className="w-3 h-3 text-red-600" /> REJECTED
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase ${
                          provider.accountStatus === 'active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : provider.accountStatus === 'probation'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}
                      >
                        {provider.accountStatus}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* PRIMARY ACTION: VIEW FULL PROVIDER DETAILS */}
                        <Link
                          to={`/admin/providers/${provider.id}`}
                          className="px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs inline-flex items-center gap-1.5 shadow-2xs transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </Link>

                        {/* QUICK STATUS TOGGLE */}
                        <button
                          onClick={() => handleToggleStatus(provider.id, provider.accountStatus)}
                          title={provider.accountStatus === 'active' ? 'Suspend Provider' : 'Activate Provider'}
                          className="p-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-100 text-zinc-500 hover:text-zinc-900 transition-colors"
                        >
                          {provider.accountStatus === 'active' ? (
                            <XCircle className="w-4 h-4 text-zinc-400 hover:text-red-600" />
                          ) : (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center">
                    <div className="max-w-xs mx-auto space-y-2">
                      <Building2 className="w-8 h-8 text-zinc-300 mx-auto" />
                      <p className="text-sm font-semibold text-zinc-700">No media providers found</p>
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
              <strong className="text-zinc-900">{totalRecords}</strong> providers
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
    </div>
  );
};
