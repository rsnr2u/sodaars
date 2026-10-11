import React, { useState, useMemo } from 'react';
import {
  BarChart2,
  AlertTriangle,
  CheckCircle2,
  MapPin,
  ArrowUpDown,
  Search,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { OccupancyMetricRecord } from '../../types/report';
import Button from '../../../components/ui/Button';

export interface OccupancyReportTabProps {
  metrics: OccupancyMetricRecord[];
}

type SortField = 'resourceName' | 'city' | 'sqftArea' | 'occupiedDays' | 'utilizationPercent' | 'revenueGenerated';
type SortDirection = 'asc' | 'desc';

export const OccupancyReportTab: React.FC<OccupancyReportTabProps> = ({ metrics }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('ALL');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  // Sorting
  const [sortField, setSortField] = useState<SortField>('utilizationPercent');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Calculated summary
  const summary = useMemo(() => {
    const totalAssets = metrics.length;
    const totalDays = metrics.reduce((acc, m) => acc + m.totalDays, 0);
    const occupiedDays = metrics.reduce((acc, m) => acc + m.occupiedDays, 0);
    const vacantDays = metrics.reduce((acc, m) => acc + m.vacantDays, 0);
    const portfolioOccupancy = totalDays > 0 ? (occupiedDays / totalDays) * 100 : 0;
    const idleCount = metrics.filter((m) => m.utilizationPercent === 0).length;
    const highPerformingCount = metrics.filter((m) => m.utilizationPercent >= 85).length;
    const totalAreaSqft = metrics.reduce((acc, m) => acc + m.sqftArea, 0);

    return {
      totalAssets,
      occupiedDays,
      vacantDays,
      portfolioOccupancy,
      idleCount,
      highPerformingCount,
      totalAreaSqft,
    };
  }, [metrics]);

  // Unique cities & types
  const cities = useMemo(() => Array.from(new Set(metrics.map((m) => m.city))), [metrics]);
  const types = useMemo(() => Array.from(new Set(metrics.map((m) => m.resourceType))), [metrics]);

  // Filtering
  const filteredMetrics = useMemo(() => {
    return metrics.filter((m) => {
      if (selectedCity !== 'ALL' && m.city !== selectedCity) return false;
      if (selectedType !== 'ALL' && m.resourceType !== selectedType) return false;
      if (selectedStatus !== 'ALL') {
        if (selectedStatus === 'VACANT' && m.utilizationPercent > 0) return false;
        if (selectedStatus === 'OCCUPIED' && m.utilizationPercent === 0) return false;
      }
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesName = m.resourceName.toLowerCase().includes(q);
        const matchesCity = m.city.toLowerCase().includes(q);
        const matchesArea = m.area.toLowerCase().includes(q);
        const matchesLandmark = m.landmark.toLowerCase().includes(q);
        return matchesName || matchesCity || matchesArea || matchesLandmark;
      }
      return true;
    });
  }, [metrics, selectedCity, selectedType, selectedStatus, searchQuery]);

  // Sorting
  const sortedMetrics = useMemo(() => {
    return [...filteredMetrics].sort((a, b) => {
      let valA: string | number = a[sortField];
      let valB: string | number = b[sortField];

      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredMetrics, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sortedMetrics.length / pageSize));
  const paginatedMetrics = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedMetrics.slice(startIndex, startIndex + pageSize);
  }, [sortedMetrics, currentPage, pageSize]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. KPI STRIP */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        {/* PORTFOLIO OCCUPANCY */}
        <div className="bg-white rounded-xl p-4 border border-[#E5E5E5] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373]">
              Portfolio Occupancy
            </span>
            <BarChart2 size={15} className="text-[#EA580C]" />
          </div>
          <div className="my-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#171717] leading-none">
              {summary.portfolioOccupancy.toFixed(1)}%
            </span>
            <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
              Target: 75%
            </span>
          </div>
          <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-[#EA580C] h-full rounded-full"
              style={{ width: `${summary.portfolioOccupancy}%` }}
            />
          </div>
        </div>

        {/* BOOKED DISPLAY DAYS */}
        <div className="bg-white rounded-xl p-4 border border-[#E5E5E5] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373]">
              Booked Display Days
            </span>
            <CheckCircle2 size={15} className="text-emerald-600" />
          </div>
          <div className="my-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-800 leading-none">
              {summary.occupiedDays}
            </span>
            <span className="text-xs text-[#737373]">/ {summary.occupiedDays + summary.vacantDays} days</span>
          </div>
          <span className="text-[11px] text-[#737373]">
            Active customer flight days
          </span>
        </div>

        {/* PRIME YIELD ASSETS */}
        <div className="bg-white rounded-xl p-4 border border-[#E5E5E5] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373]">
              High-Yield Assets (&ge;85%)
            </span>
            <TrendingUp size={15} className="text-blue-600" />
          </div>
          <div className="my-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-blue-900 leading-none">
              {summary.highPerformingCount}
            </span>
            <span className="text-xs text-[#737373]">of {summary.totalAssets} inventory</span>
          </div>
          <span className="text-[11px] text-[#737373]">
            Near full capacity this period
          </span>
        </div>

        {/* DEAD / IDLE INVENTORY */}
        <div className="bg-white rounded-xl p-4 border border-[#E5E5E5] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373]">
              Idle / Vacant Assets
            </span>
            <AlertTriangle size={15} className="text-amber-500" />
          </div>
          <div className="my-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-700 leading-none">
              {summary.idleCount}
            </span>
            <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
              Dead Stock
            </span>
          </div>
          <span className="text-[11px] text-[#737373]">
            0 display bookings recorded
          </span>
        </div>
      </div>

      {/* 2. FILTER & SEARCH STRIP */}
      <div className="bg-white rounded-xl border border-[#E5E5E5] p-3.5 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center gap-3 justify-between">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#737373]" />
          <input
            type="text"
            placeholder="Search outdoor media assets by name, city, landmark..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-[#E5E5E5] bg-white focus:outline-none focus:border-[#EA580C]"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={selectedCity}
            onChange={(e) => {
              setSelectedCity(e.target.value);
              setCurrentPage(1);
            }}
            aria-label="Filter by City"
            className="h-8 text-xs rounded-lg border border-[#E5E5E5] bg-white px-2.5 text-[#171717] focus:outline-none focus:border-[#EA580C]"
          >
            <option value="ALL">All Cities</option>
            {cities.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select
            value={selectedType}
            onChange={(e) => {
              setSelectedType(e.target.value);
              setCurrentPage(1);
            }}
            aria-label="Filter by Media Format"
            className="h-8 text-xs rounded-lg border border-[#E5E5E5] bg-white px-2.5 text-[#171717] focus:outline-none focus:border-[#EA580C]"
          >
            <option value="ALL">All Media Formats</option>
            {types.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setCurrentPage(1);
            }}
            aria-label="Filter by Occupancy Status"
            className="h-8 text-xs rounded-lg border border-[#E5E5E5] bg-white px-2.5 text-[#171717] focus:outline-none focus:border-[#EA580C]"
          >
            <option value="ALL">All Occupancy States</option>
            <option value="OCCUPIED">Occupied (&gt;0%)</option>
            <option value="VACANT">Vacant / Idle (0%)</option>
          </select>
        </div>
      </div>

      {/* 3. ASSET OCCUPANCY DATA TABLE */}
      <div className="bg-white rounded-xl border border-[#E5E5E5] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAFAF9] border-b border-[#E5E5E5] text-[10px] font-bold uppercase tracking-wider text-[#737373]">
                <th
                  className="py-3 px-4 cursor-pointer hover:text-[#171717]"
                  onClick={() => handleSort('resourceName')}
                >
                  <div className="flex items-center gap-1">
                    <span>Advertising Resource</span>
                    <ArrowUpDown size={11} />
                  </div>
                </th>
                <th
                  className="py-3 px-4 cursor-pointer hover:text-[#171717]"
                  onClick={() => handleSort('city')}
                >
                  <div className="flex items-center gap-1">
                    <span>Location & City</span>
                    <ArrowUpDown size={11} />
                  </div>
                </th>
                <th
                  className="py-3 px-4 cursor-pointer hover:text-[#171717]"
                  onClick={() => handleSort('sqftArea')}
                >
                  <div className="flex items-center gap-1">
                    <span>Dimensions / Sq.Ft</span>
                    <ArrowUpDown size={11} />
                  </div>
                </th>
                <th
                  className="py-3 px-4 cursor-pointer hover:text-[#171717]"
                  onClick={() => handleSort('occupiedDays')}
                >
                  <div className="flex items-center gap-1">
                    <span>Occupied / Vacant Days</span>
                    <ArrowUpDown size={11} />
                  </div>
                </th>
                <th
                  className="py-3 px-4 cursor-pointer hover:text-[#171717]"
                  onClick={() => handleSort('utilizationPercent')}
                >
                  <div className="flex items-center gap-1">
                    <span>Utilization Rate</span>
                    <ArrowUpDown size={11} />
                  </div>
                </th>
                <th
                  className="py-3 px-4 cursor-pointer hover:text-[#171717]"
                  onClick={() => handleSort('revenueGenerated')}
                >
                  <div className="flex items-center gap-1">
                    <span>Revenue Realized</span>
                    <ArrowUpDown size={11} />
                  </div>
                </th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E5]">
              {paginatedMetrics.map((item) => {
                const isIdle = item.utilizationPercent === 0;
                return (
                  <tr key={item.resourceId} className="hover:bg-[#FAFAF9] transition-colors">
                    {/* RESOURCE NAME */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-[#171717]">{item.resourceName}</div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="font-mono text-[10px] text-[#737373]">{item.resourceId}</span>
                        <span className="px-1.5 py-0.2 rounded bg-stone-100 text-stone-700 text-[9px] font-semibold border border-stone-200">
                          {item.resourceType}
                        </span>
                      </div>
                    </td>

                    {/* LOCATION */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1 font-semibold text-[#171717]">
                        <MapPin size={12} className="text-[#EA580C] shrink-0" />
                        <span>{item.city} • {item.area}</span>
                      </div>
                      <div className="text-[11px] text-[#737373] truncate max-w-[200px]" title={item.landmark}>
                        {item.landmark}
                      </div>
                    </td>

                    {/* DIMENSIONS */}
                    <td className="py-3 px-4">
                      <div className="font-medium text-[#171717]">{item.dimensions}</div>
                      <div className="text-[10px] text-[#737373]">{item.sqftArea.toLocaleString()} sq.ft</div>
                    </td>

                    {/* OCCUPIED / VACANT DAYS */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-emerald-800">
                        {item.occupiedDays} days occupied
                      </div>
                      <div className="text-[10px] text-[#737373]">
                        {item.vacantDays} days vacant
                      </div>
                    </td>

                    {/* UTILIZATION % */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className={`font-black text-xs ${isIdle ? 'text-amber-700' : 'text-[#171717]'}`}>
                          {item.utilizationPercent.toFixed(1)}%
                        </span>
                        <div className="w-16 bg-stone-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              isIdle
                                ? 'bg-amber-400'
                                : item.utilizationPercent >= 80
                                ? 'bg-emerald-500'
                                : 'bg-[#EA580C]'
                            }`}
                            style={{ width: `${Math.max(4, item.utilizationPercent)}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* REVENUE */}
                    <td className="py-3 px-4 font-bold text-[#171717]">
                      {item.revenueGenerated > 0 ? (
                        <>
                          <div>₹{item.revenueGenerated.toLocaleString('en-IN')}</div>
                          <div className="text-[10px] text-[#737373] font-normal">
                            ₹{item.ratePerSqFt.toFixed(2)}/sq.ft
                          </div>
                        </>
                      ) : (
                        <span className="text-[#737373] font-normal">—</span>
                      )}
                    </td>

                    {/* STATUS */}
                    <td className="py-3 px-4 text-right">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                          isIdle
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : item.currentStatus.includes('Occupied')
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-stone-100 text-stone-700 border-stone-200'
                        }`}
                      >
                        {item.currentStatus}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* FOOTER PAGINATION */}
        <div className="bg-[#FAFAF9] px-4 py-3 border-t border-[#E5E5E5] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#737373]">
          <div className="flex items-center gap-3">
            <span>
              Showing <strong>{(currentPage - 1) * pageSize + 1}</strong> to{' '}
              <strong>{Math.min(currentPage * pageSize, sortedMetrics.length)}</strong> of{' '}
              <strong>{sortedMetrics.length}</strong> resources
            </span>
            <div className="flex items-center gap-1.5 pl-3 border-l border-[#E5E5E5]">
              <span>Rows:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="h-7 text-xs rounded border border-[#E5E5E5] bg-white px-1.5"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="h-7 px-2 text-xs disabled:opacity-40"
            >
              <ChevronLeft size={13} className="mr-0.5" />
              Prev
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
              <button
                key={pg}
                onClick={() => setCurrentPage(pg)}
                className={`h-7 w-7 rounded text-xs font-semibold ${
                  pg === currentPage ? 'bg-[#171717] text-white' : 'text-[#525252] hover:bg-stone-200'
                }`}
              >
                {pg}
              </button>
            ))}
            <Button
              variant="ghost"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="h-7 px-2 text-xs disabled:opacity-40"
            >
              Next
              <ChevronRight size={13} className="ml-0.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OccupancyReportTab;
