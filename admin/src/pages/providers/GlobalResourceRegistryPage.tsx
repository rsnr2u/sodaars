import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Layers, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertTriangle, 
  Ban, 
  MapPin, 
  Building2, 
  Eye, 
  SlidersHorizontal,
  X,
  FileCheck2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  RotateCcw,
  Download
} from 'lucide-react';
import { mockResources, mockProviders } from '../../data/mockAdminData';
import { ResourceItem } from '../../types';

type SortField = 'code' | 'providerName' | 'type' | 'city' | 'monthlyRate' | 'adminBlockStatus';
type SortDirection = 'asc' | 'desc';

export const GlobalResourceRegistryPage: React.FC = () => {
  const [resources, setResources] = useState<ResourceItem[]>(mockResources);
  
  // Filter states
  const [search, setSearch] = useState('');
  const [cityFilter, setCityFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [blockFilter, setBlockFilter] = useState('all');

  // Sorting states
  const [sortField, setSortField] = useState<SortField>('code');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(50);

  // Modal / Drawer state
  const [selectedResource, setSelectedResource] = useState<ResourceItem | null>(null);

  // Check if any filter is active
  const isFiltered = Boolean(
    search || 
    cityFilter !== 'all' || 
    typeFilter !== 'all' || 
    blockFilter !== 'all'
  );

  const handleResetFilters = () => {
    setSearch('');
    setCityFilter('all');
    setTypeFilter('all');
    setBlockFilter('all');
    setCurrentPage(1);
  };

  // Reset to first page when search or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, cityFilter, typeFilter, blockFilter, pageSize]);

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
    const list = resources.filter((r) => {
      const matchesSearch =
        r.title.toLowerCase().includes(search.toLowerCase()) ||
        r.code.toLowerCase().includes(search.toLowerCase()) ||
        r.providerName.toLowerCase().includes(search.toLowerCase()) ||
        r.locationArea.toLowerCase().includes(search.toLowerCase()) ||
        r.city.toLowerCase().includes(search.toLowerCase());

      const matchesCity = cityFilter === 'all' || r.city === cityFilter;
      const matchesType = typeFilter === 'all' || r.type === typeFilter;
      const matchesBlock =
        blockFilter === 'all'
          ? true
          : blockFilter === 'blocked'
          ? r.adminBlockStatus !== 'none'
          : r.adminBlockStatus === 'none';

      return matchesSearch && matchesCity && matchesType && matchesBlock;
    });

    list.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'code':
          comparison = a.code.localeCompare(b.code);
          break;
        case 'providerName':
          comparison = a.providerName.localeCompare(b.providerName);
          break;
        case 'type':
          comparison = a.type.localeCompare(b.type);
          break;
        case 'city':
          comparison = a.city.localeCompare(b.city);
          break;
        case 'monthlyRate':
          comparison = a.monthlyRate - b.monthlyRate;
          break;
        case 'adminBlockStatus':
          comparison = a.adminBlockStatus.localeCompare(b.adminBlockStatus);
          break;
        default:
          comparison = 0;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return list;
  }, [resources, search, cityFilter, typeFilter, blockFilter, sortField, sortDirection]);

  // Pagination computations
  const totalRecords = filteredAndSorted.length;
  const totalPages = Math.ceil(totalRecords / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalRecords);
  const paginatedResources = filteredAndSorted.slice(startIndex, endIndex);

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
    const headers = ['Resource Code,Title,Provider Name,Type,Dimensions,Illumination,City,Location Area,Monthly Rate (INR),Hold Status\n'];
    const rows = filteredAndSorted.map(r => 
      `"${r.code}","${r.title}","${r.providerName}","${r.type}","${r.dimensions}","${r.illumination}","${r.city}","${r.locationArea}",${r.monthlyRate},"${r.adminBlockStatus}"`
    );
    const blob = new Blob([...headers, rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `SODAARS_Resources_${new Date().toISOString().split('T')[0]}.csv`);
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
              Global Resource Registry
            </h1>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-zinc-200 text-zinc-800 font-semibold">
              {resources.length} INVENTORY / RESOURCES
            </span>
          </div>
          <p className="text-sm text-zinc-500 mt-1">
            Universal inventory catalog across all registered media providers, municipal regions, and display formats.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 text-xs font-semibold shadow-2xs transition-colors font-mono"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <Link
            to="/admin/resources/blocks"
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold shadow-sm transition-colors"
          >
            <Ban className="w-4 h-4 text-red-400" />
            <span>Admin Holds Desk (2 Blocked)</span>
          </Link>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 p-5 sm:p-6 space-y-4">
        <div className="space-y-3">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="relative w-full lg:w-96">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search resource code, title, provider, or area..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-2 rounded-lg border border-zinc-200 focus:outline-none focus:border-orange-500 font-sans"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              {/* City Filter */}
              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-zinc-200 text-zinc-700 font-sans focus:outline-none focus:border-orange-500 text-xs"
              >
                <option value="all">All Cities</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Bengaluru">Bengaluru</option>
                <option value="Delhi NCR">Delhi NCR</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Chennai">Chennai</option>
                <option value="Kolkata">Kolkata</option>
                <option value="Chandigarh">Chandigarh</option>
                <option value="Jaipur">Jaipur</option>
                <option value="Indore">Indore</option>
                <option value="Pune">Pune</option>
              </select>

              {/* Type Filter */}
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-zinc-200 text-zinc-700 font-sans focus:outline-none focus:border-orange-500 text-xs"
              >
                <option value="all">All Formats</option>
                <option value="Billboard">Billboard</option>
                <option value="Unipole">Unipole</option>
                <option value="DOOH Digital Screen">DOOH Digital Screen</option>
                <option value="Gantry">Gantry</option>
              </select>

              {/* Block Filter */}
              <select
                value={blockFilter}
                onChange={(e) => setBlockFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-zinc-200 text-zinc-700 font-sans focus:outline-none focus:border-orange-500 font-mono text-[11px]"
              >
                <option value="all">All Hold Status</option>
                <option value="blocked">⚠️ Under Admin Hold</option>
                <option value="unblocked">✓ Active / Unrestricted</option>
              </select>
            </div>
          </div>

          {/* Reset Filters Option if any active */}
          {isFiltered && (
            <div className="flex justify-end pt-2 border-t border-zinc-100">
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100 font-mono font-medium transition-colors"
                title="Reset all search and filter settings"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Filters</span>
              </button>
            </div>
          )}
        </div>

        {/* Resources Table */}
        <div className="overflow-x-auto rounded-xl border border-zinc-200">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/75">
                {renderSortHeader('Code & Site Title', 'code')}
                {renderSortHeader('Media Provider', 'providerName')}
                {renderSortHeader('Format & Specs', 'type')}
                {renderSortHeader('Location & Area', 'city')}
                {renderSortHeader('Monthly Base Card', 'monthlyRate')}
                {renderSortHeader('Hold Status', 'adminBlockStatus')}
                <th className="py-3 px-3 text-[10px] font-mono uppercase tracking-wider font-bold text-zinc-500 text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 bg-white">
              {paginatedResources.length > 0 ? (
                paginatedResources.map((item) => (
                  <tr key={item.id} className="hover:bg-zinc-50/70 transition-colors">
                    <td className="py-3.5 px-3">
                      <div>
                        <span className="font-mono font-bold text-orange-600 block text-xs">{item.code}</span>
                        <span className="font-semibold text-zinc-900 block max-w-xs truncate">{item.title}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="font-medium text-zinc-800 block">{item.providerName}</span>
                      <span className="text-[10px] text-zinc-400 font-mono">{item.providerId}</span>
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="font-semibold text-zinc-800 block">{item.type}</span>
                      <span className="text-[11px] text-zinc-500 font-mono">{item.dimensions} • {item.illumination}</span>
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="font-medium text-zinc-900 block">{item.city}</span>
                      <span className="text-[11px] text-zinc-500 block truncate max-w-[200px]">{item.locationArea}</span>
                    </td>

                    <td className="py-3.5 px-3 font-mono">
                      <span className="font-bold text-zinc-900 block text-sm">
                        ₹{item.monthlyRate.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-zinc-400">per month</span>
                    </td>

                    <td className="py-3.5 px-3">
                      {item.adminBlockStatus === 'none' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono bg-emerald-100 text-emerald-800 font-bold">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> LIVE
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono bg-red-100 text-red-800 font-bold">
                          <Ban className="w-3 h-3 text-red-600" /> {item.adminBlockStatus.toUpperCase().replace('_', ' ')}
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-3 text-right">
                      <button
                        onClick={() => setSelectedResource(item)}
                        className="px-3 py-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-100 text-zinc-700 font-semibold text-xs transition-colors"
                      >
                        Audit Site
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center">
                    <div className="max-w-xs mx-auto space-y-2">
                      <Layers className="w-8 h-8 text-zinc-300 mx-auto" />
                      <p className="text-sm font-semibold text-zinc-700">No resources found</p>
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
              <strong className="text-zinc-900">{totalRecords}</strong> inventory / resources
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

      {/* Drawer: Resource Details */}
      {selectedResource && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end">
          <div className="bg-white w-full max-w-lg h-full shadow-2xl overflow-y-auto p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-200">
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-orange-600">
                  SITE AUDIT • {selectedResource.code}
                </span>
                <h3 className="text-xl font-bold text-zinc-950 mt-0.5">{selectedResource.title}</h3>
              </div>
              <button
                onClick={() => setSelectedResource(null)}
                className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-zinc-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Status */}
            <div className={`p-4 rounded-xl border flex items-center justify-between ${
              selectedResource.adminBlockStatus === 'none'
                ? 'bg-emerald-50/50 border-emerald-200'
                : 'bg-red-50 border-red-200'
            }`}>
              <div>
                <span className="text-xs text-zinc-500 font-mono">Administrative Restriction</span>
                <div className="font-bold text-zinc-900 text-sm uppercase font-mono mt-0.5">
                  {selectedResource.adminBlockStatus === 'none' ? 'No Active Holds (Live on Network)' : selectedResource.adminBlockStatus.replace('_', ' ')}
                </div>
              </div>
              <Link
                to={`/admin/resources/blocks?id=${selectedResource.id}`}
                className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold"
              >
                Manage Hold
              </Link>
            </div>

            {/* Site Specs */}
            <div className="space-y-3 text-xs">
              <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider font-mono">Site Attributes & Coordinates</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg border border-zinc-200">
                  <span className="text-zinc-400 text-[11px] block">Media Provider</span>
                  <span className="font-semibold text-zinc-900 mt-0.5 block">{selectedResource.providerName}</span>
                </div>
                <div className="p-3 rounded-lg border border-zinc-200">
                  <span className="text-zinc-400 text-[11px] block">Display Format</span>
                  <span className="font-semibold text-zinc-900 mt-0.5 block">{selectedResource.type}</span>
                </div>
                <div className="p-3 rounded-lg border border-zinc-200">
                  <span className="text-zinc-400 text-[11px] block">Dimensions</span>
                  <span className="font-semibold text-zinc-900 mt-0.5 block font-mono">{selectedResource.dimensions}</span>
                </div>
                <div className="p-3 rounded-lg border border-zinc-200">
                  <span className="text-zinc-400 text-[11px] block">Illumination</span>
                  <span className="font-semibold text-zinc-900 mt-0.5 block">{selectedResource.illumination}</span>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="p-4 rounded-xl border border-zinc-200 space-y-2 text-xs">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider font-mono">Geographic Location</span>
              <p className="font-bold text-zinc-900 text-sm">{selectedResource.locationArea}, {selectedResource.city}</p>
              <p className="text-zinc-500 font-mono text-[11px]">
                Latitude: {selectedResource.latitude} | Longitude: {selectedResource.longitude}
              </p>
            </div>

            {/* Block details if present */}
            {selectedResource.adminBlockStatus !== 'none' && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-red-900 font-bold">
                  <Ban className="w-4 h-4 text-red-600" />
                  <span>Administrative Hold Notice</span>
                </div>
                <p className="text-red-900/80 leading-relaxed bg-white p-2.5 rounded border border-red-200">
                  {selectedResource.blockReason}
                </p>
                <div className="text-[11px] text-zinc-500 font-mono pt-1">
                  Placed by: {selectedResource.blockedBy} on {selectedResource.blockTimestamp}
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-zinc-200 flex justify-end">
              <button
                onClick={() => setSelectedResource(null)}
                className="px-4 py-2 rounded-lg bg-zinc-900 text-white text-xs font-semibold"
              >
                Close Audit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
