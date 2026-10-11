import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  Wrench,
  Search,
} from 'lucide-react';
import { OperationalIncidentRecord } from '../../types/report';

export interface OperationalHealthTabProps {
  incidents: OperationalIncidentRecord[];
}

export const OperationalHealthTab: React.FC<OperationalHealthTabProps> = ({ incidents }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');

  const totalIncidents = incidents.length;
  const resolvedCount = incidents.filter((i) => i.status === 'Resolved').length;
  const inProgressCount = incidents.filter((i) => i.status === 'In Progress').length;
  const totalDowntime = incidents.reduce((acc, i) => acc + i.downtimeHours, 0);
  const totalCost = incidents.reduce((acc, i) => acc + i.costIncurred, 0);

  // Uptime: assume 10 assets * 31 days * 24 hrs = 7,440 asset hours.
  // Uptime = (7440 - totalDowntime) / 7440 * 100
  const totalAssetHours = 7440;
  const uptimePercent = Math.max(0, ((totalAssetHours - totalDowntime) / totalAssetHours) * 100).toFixed(2);

  const filteredIncidents = incidents.filter((inc) => {
    if (typeFilter !== 'ALL' && inc.issueType !== typeFilter) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchesId = inc.incidentId.toLowerCase().includes(q);
      const matchesResource = inc.resourceName.toLowerCase().includes(q);
      const matchesCity = inc.city.toLowerCase().includes(q);
      const matchesCrew = inc.assignedCrew.toLowerCase().includes(q);
      return matchesId || matchesResource || matchesCity || matchesCrew;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* 1. HEALTH KPI STRIP */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        {/* OPERATIONAL UPTIME % */}
        <div className="bg-white rounded-xl p-4 border border-[#E5E5E5] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373]">
              Portfolio Display Uptime
            </span>
            <CheckCircle2 size={15} className="text-emerald-600" />
          </div>
          <div className="my-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#171717] leading-none">
              {uptimePercent}%
            </span>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
              High Reliability
            </span>
          </div>
          <span className="text-[11px] text-[#737373]">
            Across all 10 active outdoor media locations
          </span>
        </div>

        {/* TOTAL DOWNTIME */}
        <div className="bg-white rounded-xl p-4 border border-[#E5E5E5] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373]">
              Cumulative Downtime
            </span>
            <Clock size={15} className="text-[#EA580C]" />
          </div>
          <div className="my-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#EA580C] leading-none">
              {totalDowntime.toFixed(1)}h
            </span>
            <span className="text-xs text-stone-500">Total</span>
          </div>
          <span className="text-[11px] text-[#737373]">
            Repairs and electrical outages logged
          </span>
        </div>

        {/* RESOLVED TICKETS */}
        <div className="bg-white rounded-xl p-4 border border-[#E5E5E5] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373]">
              Maintenance Tickets
            </span>
            <Wrench size={15} className="text-blue-600" />
          </div>
          <div className="my-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#171717] leading-none">
              {resolvedCount}/{totalIncidents}
            </span>
            {inProgressCount > 0 && (
              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                {inProgressCount} In-Progress
              </span>
            )}
          </div>
          <span className="text-[11px] text-[#737373]">
            Field maintenance issues resolved
          </span>
        </div>

        {/* MAINTENANCE EXPENSE */}
        <div className="bg-white rounded-xl p-4 border border-[#E5E5E5] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373]">
              Maintenance Cost
            </span>
            <span className="text-xs font-bold text-stone-500">₹ (INR)</span>
          </div>
          <div className="my-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-stone-800 leading-none">
              ₹{totalCost.toLocaleString('en-IN')}
            </span>
          </div>
          <span className="text-[11px] text-[#737373]">
            Rigging, electrical, and structural upkeep
          </span>
        </div>
      </div>

      {/* 2. MAINTENANCE LOG TABLE */}
      <div className="bg-white rounded-xl border border-[#E5E5E5] shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[#E5E5E5] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FAFAF9]">
          <div className="relative flex-1 max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#737373]" />
            <input
              type="text"
              placeholder="Search incident ID, asset, city, crew..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-[#E5E5E5] bg-white focus:outline-none focus:border-[#EA580C]"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#737373]">Issue Type:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              aria-label="Filter incidents by Issue Type"
              className="h-8 text-xs rounded-lg border border-[#E5E5E5] bg-white px-2.5 text-[#171717] focus:outline-none focus:border-[#EA580C]"
            >
              <option value="ALL">All Maintenance Types</option>
              <option value="Electrical / Lighting">Electrical / Lighting</option>
              <option value="Vinyl Tear / Damage">Vinyl Tear / Damage</option>
              <option value="Structural Inspection">Structural Inspection</option>
              <option value="Digital LED Glitch">Digital LED Glitch</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAFAF9] border-b border-[#E5E5E5] text-[10px] font-bold uppercase tracking-wider text-[#737373]">
                <th className="py-3 px-4">Ticket ID</th>
                <th className="py-3 px-4">Asset & Location</th>
                <th className="py-3 px-4">Issue Classification</th>
                <th className="py-3 px-4">Logged / Resolved</th>
                <th className="py-3 px-4">Downtime (hrs)</th>
                <th className="py-3 px-4">Field Crew Assigned</th>
                <th className="py-3 px-4">Repair Cost</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E5]">
              {filteredIncidents.map((inc) => (
                <tr key={inc.incidentId} className="hover:bg-[#FAFAF9]">
                  {/* TICKET ID */}
                  <td className="py-3 px-4 font-mono font-bold text-[#171717]">
                    {inc.incidentId}
                  </td>

                  {/* ASSET */}
                  <td className="py-3 px-4">
                    <div className="font-semibold text-[#171717]">{inc.resourceName}</div>
                    <div className="text-[10px] text-[#737373]">{inc.city}</div>
                  </td>

                  {/* ISSUE TYPE */}
                  <td className="py-3 px-4">
                    <span className="font-medium text-[#171717] block">{inc.issueType}</span>
                    <span className="text-[10px] text-[#737373] block truncate max-w-[220px]" title={inc.notes}>
                      {inc.notes}
                    </span>
                  </td>

                  {/* DATES */}
                  <td className="py-3 px-4 text-[#525252] whitespace-nowrap">
                    <div>{inc.loggedDate}</div>
                    <div className="text-[10px] text-[#737373]">
                      {inc.resolvedDate ? `Resolved: ${inc.resolvedDate}` : 'Under Attention'}
                    </div>
                  </td>

                  {/* DOWNTIME */}
                  <td className="py-3 px-4 font-mono font-bold text-[#171717]">
                    {inc.downtimeHours > 0 ? `${inc.downtimeHours}h` : '0h (Routine)'}
                  </td>

                  {/* CREW */}
                  <td className="py-3 px-4 text-[#525252]">
                    {inc.assignedCrew}
                  </td>

                  {/* COST */}
                  <td className="py-3 px-4 font-bold text-[#171717]">
                    ₹{inc.costIncurred.toLocaleString('en-IN')}
                  </td>

                  {/* STATUS */}
                  <td className="py-3 px-4 text-right">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                        inc.status === 'Resolved'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : inc.status === 'In Progress'
                          ? 'bg-amber-50 text-amber-800 border-amber-200 animate-pulse'
                          : 'bg-stone-100 text-stone-700 border-stone-200'
                      }`}
                    >
                      {inc.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OperationalHealthTab;
