import React, { useState, useMemo } from 'react';
import {
  PieChart,
  Search,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { BookingChannelRecord } from '../../types/report';
import { getAllProviderBookings } from '../../data/sampleBookings';
import Button from '../../../components/ui/Button';

export interface BookingDistributionTabProps {
  channels: BookingChannelRecord[];
}

export const BookingDistributionTab: React.FC<BookingDistributionTabProps> = ({ channels }) => {
  const allBookings = useMemo(() => getAllProviderBookings(), []);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSource, setSelectedSource] = useState<string>('ALL');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const totalValue = channels.reduce((acc, c) => acc + c.totalAmount, 0);
  const totalCount = channels.reduce((acc, c) => acc + c.count, 0);

  // Filtered bookings
  const filteredBookings = useMemo(() => {
    return allBookings.filter((b) => {
      if (selectedSource !== 'ALL' && b.source !== selectedSource) return false;
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesId = b.id.toLowerCase().includes(q);
        const matchesCust = b.customerName.toLowerCase().includes(q);
        const matchesCompany = (b.companyName || '').toLowerCase().includes(q);
        const matchesResource = b.resourceName.toLowerCase().includes(q);
        return matchesId || matchesCust || matchesCompany || matchesResource;
      }
      return true;
    });
  }, [allBookings, selectedSource, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredBookings.length / pageSize));
  const paginatedBookings = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredBookings.slice(start, start + pageSize);
  }, [filteredBookings, currentPage, pageSize]);

  return (
    <div className="space-y-6">
      {/* 1. CHANNEL KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {channels.map((chan) => (
          <div
            key={chan.source}
            className="bg-white rounded-xl p-4 border border-[#E5E5E5] shadow-xs flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373]">
                {chan.label}
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${chan.badgeBg} ${chan.badgeText} ${chan.badgeBorder}`}
              >
                {chan.percentage}% Volume
              </span>
            </div>

            <div className="my-2.5">
              <div className="text-2xl font-black text-[#171717]">
                ₹{(chan.totalAmount / 100000).toFixed(2)} Lakhs
              </div>
              <div className="text-xs text-[#737373] mt-0.5">
                {chan.count} bookings • Avg deal ₹{Math.round(chan.avgDealSize / 1000)}k
              </div>
            </div>

            <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden border border-stone-200">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${chan.percentage}%`,
                  backgroundColor: chan.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* 2. CHANNEL RATIO BREAKDOWN STRIP */}
      <div className="bg-white rounded-xl border border-[#E5E5E5] p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3">
          <div className="flex items-center gap-2">
            <PieChart size={16} className="text-[#EA580C]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#171717]">
              Sales Channel Realization Matrix
            </h3>
          </div>
          <span className="text-[11px] text-[#737373]">
            Total Commercial Pipeline: <strong>₹{(totalValue / 100000).toFixed(2)} Lakhs</strong> ({totalCount} deals)
          </span>
        </div>

        {/* Stacked percentage bar */}
        <div className="space-y-2">
          <div className="w-full h-3 rounded-full overflow-hidden flex bg-stone-100">
            {channels.map((chan) => (
              <div
                key={chan.source}
                style={{
                  width: `${(chan.totalAmount / totalValue) * 100}%`,
                  backgroundColor: chan.color,
                }}
                className="h-full transition-all hover:opacity-90"
                title={`${chan.label}: ₹${chan.totalAmount.toLocaleString('en-IN')}`}
              />
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            {channels.map((chan) => (
              <div key={chan.source} className="p-3 rounded-lg bg-[#FAFAF9] border border-[#E5E5E5] text-xs">
                <div className="flex items-center gap-1.5 font-bold text-[#171717]">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: chan.color }} />
                  <span>{chan.label}</span>
                </div>
                <div className="mt-1.5 text-[11px] text-[#525252] space-y-0.5">
                  <div className="flex justify-between">
                    <span>Gross Value:</span>
                    <strong className="text-[#171717]">₹{chan.totalAmount.toLocaleString('en-IN')}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Revenue Share:</span>
                    <strong className="text-[#171717]">{((chan.totalAmount / totalValue) * 100).toFixed(1)}%</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Bookings Share:</span>
                    <strong className="text-[#171717]">{((chan.count / totalCount) * 100).toFixed(1)}%</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. BOOKINGS SOURCE AUDIT TABLE */}
      <div className="bg-white rounded-xl border border-[#E5E5E5] shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[#E5E5E5] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FAFAF9]">
          <div className="relative flex-1 max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#737373]" />
            <input
              type="text"
              placeholder="Search booking ID, customer, resource..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-[#E5E5E5] bg-white focus:outline-none focus:border-[#EA580C]"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#737373]">Channel:</span>
            <select
              value={selectedSource}
              onChange={(e) => {
                setSelectedSource(e.target.value);
                setCurrentPage(1);
              }}
              aria-label="Filter bookings by Channel"
              className="h-8 text-xs rounded-lg border border-[#E5E5E5] bg-white px-2.5 text-[#171717] focus:outline-none focus:border-[#EA580C]"
            >
              <option value="ALL">All Channels</option>
              <option value="Provider">Provider Direct</option>
              <option value="Admin">Admin Placed</option>
              <option value="Marketplace">Marketplace</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAFAF9] border-b border-[#E5E5E5] text-[10px] font-bold uppercase tracking-wider text-[#737373]">
                <th className="py-3 px-4">Booking Ref</th>
                <th className="py-3 px-4">Customer & Company</th>
                <th className="py-3 px-4">Booked Inventory</th>
                <th className="py-3 px-4">Origin Channel</th>
                <th className="py-3 px-4">Flight Dates</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Invoiced Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E5]">
              {paginatedBookings.map((b) => (
                <tr key={b.id} className="hover:bg-[#FAFAF9]">
                  <td className="py-3 px-4 font-mono font-bold text-[#171717]">{b.id}</td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-[#171717]">{b.customerName}</div>
                    <div className="text-[11px] text-[#737373]">{b.companyName}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-[#171717] truncate max-w-[200px]" title={b.resourceName}>
                      {b.resourceName}
                    </div>
                    <div className="text-[10px] text-[#737373]">{b.location}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                        b.source === 'Provider'
                          ? 'bg-orange-50 text-[#EA580C] border-orange-200'
                          : b.source === 'Admin'
                          ? 'bg-blue-50 text-blue-800 border-blue-200'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      }`}
                    >
                      {b.source}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[#525252] whitespace-nowrap">
                    {b.startDate} to {b.endDate}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-stone-100 text-stone-700 border border-stone-200">
                      {b.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-black text-[#171717]">
                    ₹{Number(b.pricing?.finalInvoicedAmount || b.pricing?.regularCustomerPrice || 150000).toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="bg-[#FAFAF9] px-4 py-3 border-t border-[#E5E5E5] flex items-center justify-between text-xs text-[#737373]">
          <span>
            Showing <strong>{(currentPage - 1) * pageSize + 1}</strong> to{' '}
            <strong>{Math.min(currentPage * pageSize, filteredBookings.length)}</strong> of{' '}
            <strong>{filteredBookings.length}</strong> bookings
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="h-7 px-2 text-xs disabled:opacity-40"
            >
              <ChevronLeft size={13} />
            </Button>
            <span className="px-2 font-semibold text-[#171717]">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="ghost"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="h-7 px-2 text-xs disabled:opacity-40"
            >
              <ChevronRight size={13} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDistributionTab;
