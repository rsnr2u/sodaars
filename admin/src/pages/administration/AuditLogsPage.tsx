import React, { useState, useMemo, useEffect } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  Download, 
  ShieldCheck, 
  Calendar,
  User,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  RotateCcw
} from 'lucide-react';
import { mockAuditLogs } from '../../data/mockAdminData';
import { AuditLogEntry } from '../../types';

type SortField = 'id' | 'timestamp' | 'actor' | 'action' | 'targetType' | 'ipAddress';
type SortDirection = 'asc' | 'desc';

export const AuditLogsPage: React.FC = () => {
  const [logs] = useState<AuditLogEntry[]>(mockAuditLogs);
  
  // Filter states
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');

  // Sorting states
  const [sortField, setSortField] = useState<SortField>('timestamp');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(50);

  // Check if any filter is active
  const isFiltered = Boolean(search || filterType !== 'ALL');

  const handleResetFilters = () => {
    setSearch('');
    setFilterType('ALL');
    setCurrentPage(1);
  };

  // Reset to first page when search or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, filterType, pageSize]);

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
    const list = logs.filter((l) => {
      const matchesSearch =
        l.actor.toLowerCase().includes(search.toLowerCase()) ||
        l.actorRole.toLowerCase().includes(search.toLowerCase()) ||
        l.details.toLowerCase().includes(search.toLowerCase()) ||
        l.action.toLowerCase().includes(search.toLowerCase()) ||
        l.targetId.toLowerCase().includes(search.toLowerCase()) ||
        l.ipAddress.toLowerCase().includes(search.toLowerCase());

      const matchesType = filterType === 'ALL' || l.targetType === filterType;
      return matchesSearch && matchesType;
    });

    list.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'id':
          comparison = a.id.localeCompare(b.id);
          break;
        case 'timestamp':
          comparison = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
          break;
        case 'actor':
          comparison = a.actor.localeCompare(b.actor);
          break;
        case 'action':
          comparison = a.action.localeCompare(b.action);
          break;
        case 'targetType':
          comparison = a.targetType.localeCompare(b.targetType);
          break;
        case 'ipAddress':
          comparison = a.ipAddress.localeCompare(b.ipAddress);
          break;
        default:
          comparison = 0;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return list;
  }, [logs, search, filterType, sortField, sortDirection]);

  // Pagination computations
  const totalRecords = filteredAndSorted.length;
  const totalPages = Math.ceil(totalRecords / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalRecords);
  const paginatedLogs = filteredAndSorted.slice(startIndex, endIndex);

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
    const headers = ['Log ID,Timestamp,Actor,Actor Role,Action Code,Target Type,Target ID,Details,Client IP\n'];
    const rows = filteredAndSorted.map(l => 
      `"${l.id}","${l.timestamp}","${l.actor}","${l.actorRole}","${l.action}","${l.targetType}","${l.targetId}","${l.details.replace(/"/g, '""')}","${l.ipAddress}"`
    );
    const blob = new Blob([...headers, rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `SODAARS_Activity_Logs_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight font-sans">
            Activity Logs
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Chronological audit trail of all platform administrative actions, approvals, and security events.
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-semibold text-zinc-700 shadow-xs transition-colors self-start sm:self-auto font-mono"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Logs (CSV)</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by actor, action, target, IP..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-2 rounded-lg border border-zinc-200 focus:outline-none focus:border-orange-500 font-sans"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-zinc-400 font-mono">Category:</span>
            {['ALL', 'STAFF', 'RESOURCE', 'PROVIDER', 'SYSTEM'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterType(cat)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-colors ${
                  filterType === cat
                    ? 'bg-zinc-900 text-white font-bold shadow-xs'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                }`}
              >
                {cat}
              </button>
            ))}

            {isFiltered && (
              <button
                onClick={handleResetFilters}
                className="p-1.5 rounded-lg border border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100 transition-colors ml-1"
                title="Reset Filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="overflow-x-auto rounded-xl border border-zinc-200">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/75">
                {renderSortHeader('Event Log ID', 'id')}
                {renderSortHeader('Timestamp (IST)', 'timestamp')}
                {renderSortHeader('Operator & Role', 'actor')}
                {renderSortHeader('Action Code', 'action')}
                {renderSortHeader('Target Type & ID', 'targetType')}
                <th className="py-3 px-3 text-[10px] font-mono uppercase tracking-wider font-bold text-zinc-500">
                  Audit Description
                </th>
                {renderSortHeader('Client IP', 'ipAddress', 'right')}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 bg-white">
              {paginatedLogs.length > 0 ? (
                paginatedLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-zinc-50/70 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-orange-600 whitespace-nowrap">{log.id}</td>
                    <td className="py-3 px-3 font-mono text-zinc-500 whitespace-nowrap">{log.timestamp}</td>
                    <td className="py-3 px-3">
                      <span className="font-semibold text-zinc-900 block">{log.actor}</span>
                      <span className="text-[10px] text-zinc-400 font-mono">{log.actorRole}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-mono px-2 py-0.5 rounded bg-zinc-100 text-zinc-800 text-[10px] font-bold whitespace-nowrap">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-zinc-700 whitespace-nowrap">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold mr-1 border ${
                        log.targetType === 'STAFF'
                          ? 'bg-amber-100 text-amber-900 border-amber-300'
                          : 'bg-zinc-100 text-zinc-800 border-zinc-200'
                      }`}>
                        {log.targetType}
                      </span>{' '}
                      <span className="font-semibold">{log.targetId}</span>
                    </td>
                    <td className="py-3 px-3 max-w-md text-zinc-600">{log.details}</td>
                    <td className="py-3 px-3 text-right font-mono text-zinc-400 whitespace-nowrap">{log.ipAddress}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center">
                    <div className="max-w-xs mx-auto space-y-2">
                      <FileText className="w-8 h-8 text-zinc-300 mx-auto" />
                      <p className="text-sm font-semibold text-zinc-700">No activity logs found</p>
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
              <strong className="text-zinc-900">{totalRecords}</strong> events
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
