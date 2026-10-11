import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Search,
  RotateCcw,
  Plus,
  Eye,
  MapPin,
  X,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Maximize2,
  Minimize2,
  CreditCard,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import Button from '../../../components/ui/Button';
import { CustomerRecord, CUSTOMER_TYPE_CONFIG, CUSTOMER_STATUS_CONFIG } from '../../types/customer';
import {
  BookingRecord,
  BOOKING_SOURCE_CONFIG,
  BOOKING_STATUS_CONFIG,
} from '../../types/booking';
import { getAllProviderBookings, getBookingsForCustomer } from '../../data/sampleBookings';

export interface CustomerBookingsTableProps {
  customer: CustomerRecord;
  onClose?: () => void;
  onViewBooking?: (booking: BookingRecord) => void;
  isModalView?: boolean;
  onToggleExpand?: () => void;
}

type SortField = 'id' | 'resourceName' | 'startDate' | 'amount' | 'status';
type SortDirection = 'asc' | 'desc';

export const CustomerBookingsTable: React.FC<CustomerBookingsTableProps> = ({
  customer,
  onClose,
  onViewBooking,
  isModalView = false,
  onToggleExpand,
}) => {
  const navigate = useNavigate();

  // Load bookings for this customer
  const allCustomerBookings = useMemo(() => {
    return getBookingsForCustomer(customer.id, customer.companyName, getAllProviderBookings());
  }, [customer.id, customer.companyName]);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedSource, setSelectedSource] = useState<string>('ALL');

  // Sorting state
  const [sortField, setSortField] = useState<SortField>('startDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const typeMeta = CUSTOMER_TYPE_CONFIG[customer.customerType];
  const statusMeta = CUSTOMER_STATUS_CONFIG[customer.status];

  // Financial & count calculations
  const totalInvoiced = useMemo(() => {
    return allCustomerBookings.reduce((sum, b) => {
      const val = parseFloat(b.pricing?.finalInvoicedAmount || b.pricing?.regularCustomerPrice || '0');
      return sum + (isNaN(val) ? 0 : val);
    }, 0);
  }, [allCustomerBookings]);

  const activeCount = useMemo(() => {
    return allCustomerBookings.filter((b) => b.status === 'ACTIVE' || b.status === 'CONFIRMED').length;
  }, [allCustomerBookings]);

  const completedCount = useMemo(() => {
    return allCustomerBookings.filter((b) => b.status === 'COMPLETED').length;
  }, [allCustomerBookings]);

  const underReviewCount = useMemo(() => {
    return allCustomerBookings.filter(
      (b) =>
        b.status === 'UNDER REVIEW' ||
        b.status === 'NEW' ||
        b.status === 'PROVIDER CONFIRMATION' ||
        b.status === 'CUSTOMER CONFIRMATION'
    ).length;
  }, [allCustomerBookings]);

  // Filtering
  const filteredBookings = useMemo(() => {
    return allCustomerBookings.filter((b) => {
      if (selectedStatus !== 'ALL' && b.status !== selectedStatus) return false;
      if (selectedSource !== 'ALL' && b.source !== selectedSource) return false;

      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesId = b.id.toLowerCase().includes(q);
        const matchesResource = b.resourceName.toLowerCase().includes(q);
        const matchesType = b.resourceType.toLowerCase().includes(q);
        const matchesLoc = b.location.toLowerCase().includes(q);
        return matchesId || matchesResource || matchesType || matchesLoc;
      }
      return true;
    });
  }, [allCustomerBookings, selectedStatus, selectedSource, searchQuery]);

  // Sorting
  const sortedBookings = useMemo(() => {
    const list = [...filteredBookings];
    list.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'id':
          comparison = a.id.localeCompare(b.id);
          break;
        case 'resourceName':
          comparison = a.resourceName.localeCompare(b.resourceName);
          break;
        case 'startDate':
          comparison = new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
          break;
        case 'amount': {
          const valA = parseFloat(a.pricing?.finalInvoicedAmount || a.pricing?.regularCustomerPrice || '0');
          const valB = parseFloat(b.pricing?.finalInvoicedAmount || b.pricing?.regularCustomerPrice || '0');
          comparison = valA - valB;
          break;
        }
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        default:
          comparison = 0;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });
    return list;
  }, [filteredBookings, sortField, sortDirection]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(sortedBookings.length / pageSize));

  // Reset page if out of bounds
  React.useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, sortedBookings.length);
  const paginatedBookings = sortedBookings.slice(startIndex, endIndex);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedStatus('ALL');
    setSelectedSource('ALL');
    setCurrentPage(1);
  };

  const hasActiveFilters = searchQuery !== '' || selectedStatus !== 'ALL' || selectedSource !== 'ALL';

  const formatCurrency = (val: number | string) => {
    const num = typeof val === 'string' ? parseFloat(val) : val;
    if (isNaN(num)) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  const calculateDays = (start: string, end: string) => {
    const s = new Date(start);
    const e = new Date(end);
    const diff = e.getTime() - s.getTime();
    return Math.max(1, Math.round(diff / (1000 * 60 * 60 * 24)) + 1);
  };

  const handleCreateNewBooking = () => {
    navigate('/panel/bookings/create');
  };

  return (
    <div className="bg-white rounded-xl border border-orange-200 shadow-sm overflow-hidden transition-all animate-in fade-in slide-in-from-top-2">
      {/* ========================================================================= */}
      {/* 1. TOP HEADER BANNER: CUSTOMER IDENTITY & STATS STRIP                      */}
      {/* ========================================================================= */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-orange-50/70 via-stone-50/50 to-white border-b border-orange-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="w-6 h-6 rounded-md bg-[#EA580C] text-white flex items-center justify-center font-bold text-xs shadow-xs">
              <Calendar size={13} />
            </span>
            <h3 className="text-base font-bold text-[#171717] flex items-center gap-2">
              <span>Customer Bookings:</span>
              <span className="text-[#EA580C] underline decoration-orange-300 decoration-2 underline-offset-4">
                {customer.companyName}
              </span>
            </h3>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${typeMeta.badgeBg} ${typeMeta.badgeText} ${typeMeta.badgeBorder}`}
            >
              {typeMeta.label}
            </span>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${statusMeta.badgeBg} ${statusMeta.badgeText} ${statusMeta.badgeBorder}`}
            >
              {statusMeta.label}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs text-[#737373] flex-wrap">
            <span>
              Customer ID: <strong className="font-mono text-[#171717]">{customer.id}</strong>
            </span>
            <span>•</span>
            <span>
              Contact: <strong className="text-[#171717]">{customer.contactPerson}</strong>
            </span>
            <span>•</span>
            <span>{customer.email}</span>
            <span>•</span>
            <span>{customer.phone}</span>
            {customer.city && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1 text-[#171717]">
                  <MapPin size={11} className="text-[#EA580C]" />
                  {customer.city}, {customer.state}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Quick action buttons & Close */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus size={13} />}
            onClick={handleCreateNewBooking}
            className="text-xs font-semibold shadow-xs"
          >
            New Booking
          </Button>

          {onToggleExpand && (
            <Button
              variant="outline"
              size="sm"
              onClick={onToggleExpand}
              className="text-xs h-8 px-2.5 border-[#E5E5E5] text-[#525252] hover:text-[#171717]"
              title={isModalView ? 'Dock to Page' : 'Expand View'}
            >
              {isModalView ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
            </Button>
          )}

          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-xs h-8 px-2.5 text-[#737373] hover:text-[#171717] hover:bg-stone-100"
              title="Close Bookings Table"
            >
              <X size={15} />
            </Button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. SUMMARY METRICS TILES                                                  */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-[#FAFAF9]/60 border-b border-[#E5E5E5] text-xs">
        <div className="bg-white p-3 rounded-lg border border-[#E5E5E5] shadow-2xs">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#737373]">
            Total Bookings
          </div>
          <div className="text-xl font-extrabold text-[#171717] mt-1">
            {allCustomerBookings.length}
          </div>
          <div className="text-[10px] text-[#737373] mt-0.5">All lifecycle statuses</div>
        </div>

        <div className="bg-white p-3 rounded-lg border border-emerald-100 shadow-2xs">
          <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 flex items-center justify-between">
            <span>Active / Confirmed</span>
            <CheckCircle2 size={12} className="text-emerald-600" />
          </div>
          <div className="text-xl font-extrabold text-emerald-800 mt-1">{activeCount}</div>
          <div className="text-[10px] text-emerald-600 mt-0.5">Flighting on media</div>
        </div>

        <div className="bg-white p-3 rounded-lg border border-amber-100 shadow-2xs">
          <div className="text-[10px] font-bold uppercase tracking-wider text-amber-700 flex items-center justify-between">
            <span>Under Review</span>
            <Clock size={12} className="text-amber-600" />
          </div>
          <div className="text-xl font-extrabold text-amber-800 mt-1">{underReviewCount}</div>
          <div className="text-[10px] text-amber-600 mt-0.5">Pending confirmation</div>
        </div>

        <div className="bg-white p-3 rounded-lg border border-[#E5E5E5] shadow-2xs">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#737373] flex items-center justify-between">
            <span>Total Value Booked</span>
            <CreditCard size={12} className="text-[#EA580C]" />
          </div>
          <div className="text-xl font-extrabold text-[#171717] mt-1">
            {formatCurrency(totalInvoiced)}
          </div>
          <div className="text-[10px] text-[#737373] mt-0.5">
            {completedCount} completed bookings
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. SEARCH & FILTER CONTROLS FOR CUSTOMER BOOKINGS                         */}
      {/* ========================================================================= */}
      <div className="p-3.5 sm:p-4 bg-white border-b border-[#E5E5E5] flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        <div className="relative flex-1">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#737373]" />
          <input
            type="text"
            placeholder="Search booking ID, media asset name, type, location..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-[#E5E5E5] focus:outline-none focus:border-[#EA580C] bg-white transition-colors"
          />
        </div>

        {/* Status Filter */}
        <div className="shrink-0">
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full sm:w-auto h-8 text-xs rounded-lg border border-[#E5E5E5] bg-white px-2.5 text-[#171717] focus:outline-none focus:border-[#EA580C]"
          >
            <option value="ALL">All Statuses ({allCustomerBookings.length})</option>
            <option value="ACTIVE">Active</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="UNDER REVIEW">Under Review</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        {/* Source Filter */}
        <div className="shrink-0">
          <select
            value={selectedSource}
            onChange={(e) => {
              setSelectedSource(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full sm:w-auto h-8 text-xs rounded-lg border border-[#E5E5E5] bg-white px-2.5 text-[#171717] focus:outline-none focus:border-[#EA580C]"
          >
            <option value="ALL">All Sources</option>
            <option value="Provider">Provider Direct</option>
            <option value="Marketplace">Marketplace</option>
            <option value="Admin">Admin</option>
          </select>
        </div>

        {/* Reset Filter Button */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            leftIcon={<RotateCcw size={11} />}
            className="h-8 px-2 text-xs text-[#737373] hover:text-[#171717]"
          >
            Reset
          </Button>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 4. DATA TABLE: PROVIDER -> CUSTOMER BOOKINGS                              */}
      {/* ========================================================================= */}
      {paginatedBookings.length === 0 ? (
        <div className="p-8 text-center bg-white flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#EA580C] mb-3">
            <Calendar size={22} />
          </div>
          {allCustomerBookings.length === 0 ? (
            <>
              <h4 className="text-sm font-bold text-[#171717] mb-1">
                No Bookings Yet for {customer.companyName}
              </h4>
              <p className="text-xs text-[#737373] max-w-md mb-4">
                This customer currently has no media bookings recorded with your organization. You
                can schedule a direct booking or await marketplace campaigns.
              </p>
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Plus size={13} />}
                onClick={handleCreateNewBooking}
                className="text-xs"
              >
                Create Booking for {customer.companyName}
              </Button>
            </>
          ) : (
            <>
              <h4 className="text-sm font-bold text-[#171717] mb-1">
                No bookings match your active filters
              </h4>
              <p className="text-xs text-[#737373] max-w-md mb-3">
                Try searching with a different term or clearing status and source filters.
              </p>
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<RotateCcw size={12} />}
                onClick={resetFilters}
                className="text-xs"
              >
                Reset Filters
              </Button>
            </>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAFAF9] border-b border-[#E5E5E5] text-[10px] font-bold uppercase tracking-wider text-[#737373]">
                {/* 1. BOOKING ID */}
                <th
                  className="py-2.5 px-3.5 cursor-pointer hover:bg-stone-100/70 transition-colors select-none"
                  onClick={() => handleSort('id')}
                >
                  <div className="flex items-center gap-1">
                    <span>Booking ID</span>
                    {sortField === 'id' ? (
                      sortDirection === 'asc' ? (
                        <ArrowUp size={11} className="text-[#EA580C]" />
                      ) : (
                        <ArrowDown size={11} className="text-[#EA580C]" />
                      )
                    ) : (
                      <ArrowUpDown size={11} className="text-stone-400" />
                    )}
                  </div>
                </th>

                {/* 2. RESOURCE / ASSET */}
                <th
                  className="py-2.5 px-3.5 cursor-pointer hover:bg-stone-100/70 transition-colors select-none"
                  onClick={() => handleSort('resourceName')}
                >
                  <div className="flex items-center gap-1">
                    <span>Media Resource</span>
                    {sortField === 'resourceName' ? (
                      sortDirection === 'asc' ? (
                        <ArrowUp size={11} className="text-[#EA580C]" />
                      ) : (
                        <ArrowDown size={11} className="text-[#EA580C]" />
                      )
                    ) : (
                      <ArrowUpDown size={11} className="text-stone-400" />
                    )}
                  </div>
                </th>

                {/* 3. LOCATION */}
                <th className="py-2.5 px-3.5">Location</th>

                {/* 4. DURATION & DATES */}
                <th
                  className="py-2.5 px-3.5 cursor-pointer hover:bg-stone-100/70 transition-colors select-none"
                  onClick={() => handleSort('startDate')}
                >
                  <div className="flex items-center gap-1">
                    <span>Flighting Period</span>
                    {sortField === 'startDate' ? (
                      sortDirection === 'asc' ? (
                        <ArrowUp size={11} className="text-[#EA580C]" />
                      ) : (
                        <ArrowDown size={11} className="text-[#EA580C]" />
                      )
                    ) : (
                      <ArrowUpDown size={11} className="text-stone-400" />
                    )}
                  </div>
                </th>

                {/* 5. SOURCE */}
                <th className="py-2.5 px-3.5">Source</th>

                {/* 6. PRICING / GROSS AMOUNT */}
                <th
                  className="py-2.5 px-3.5 text-right cursor-pointer hover:bg-stone-100/70 transition-colors select-none"
                  onClick={() => handleSort('amount')}
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Contract Value</span>
                    {sortField === 'amount' ? (
                      sortDirection === 'asc' ? (
                        <ArrowUp size={11} className="text-[#EA580C]" />
                      ) : (
                        <ArrowDown size={11} className="text-[#EA580C]" />
                      )
                    ) : (
                      <ArrowUpDown size={11} className="text-stone-400" />
                    )}
                  </div>
                </th>

                {/* 7. STATUS */}
                <th
                  className="py-2.5 px-3.5 cursor-pointer hover:bg-stone-100/70 transition-colors select-none"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center gap-1">
                    <span>Status</span>
                    {sortField === 'status' ? (
                      sortDirection === 'asc' ? (
                        <ArrowUp size={11} className="text-[#EA580C]" />
                      ) : (
                        <ArrowDown size={11} className="text-[#EA580C]" />
                      )
                    ) : (
                      <ArrowUpDown size={11} className="text-stone-400" />
                    )}
                  </div>
                </th>

                {/* 8. ACTIONS */}
                <th className="py-2.5 px-3.5 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#E5E5E5]">
              {paginatedBookings.map((booking) => {
                const sourceMeta = BOOKING_SOURCE_CONFIG[booking.source];
                const bookingStatusMeta = BOOKING_STATUS_CONFIG[booking.status];
                const days = calculateDays(booking.startDate, booking.endDate);
                const price = booking.pricing?.finalInvoicedAmount || booking.pricing?.regularCustomerPrice || '0';

                return (
                  <tr
                    key={booking.id}
                    className="hover:bg-orange-50/20 transition-colors group cursor-pointer"
                    onClick={() => onViewBooking && onViewBooking(booking)}
                  >
                    {/* 1. BOOKING ID */}
                    <td className="py-2.5 px-3.5 whitespace-nowrap">
                      <div className="font-mono font-bold text-[#171717]">{booking.id}</div>
                      <span className="text-[10px] text-[#737373]">
                        {booking.createdAt ? `Booked ${booking.createdAt}` : 'Direct Booking'}
                      </span>
                    </td>

                    {/* 2. MEDIA RESOURCE */}
                    <td className="py-2.5 px-3.5 max-w-xs">
                      <div className="font-semibold text-[#171717] truncate" title={booking.resourceName}>
                        {booking.resourceName}
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase bg-stone-100 text-stone-700 border border-stone-200">
                          {booking.resourceType}
                        </span>
                        <span className="text-[10px] text-[#737373] font-mono">
                          {booking.resourceId}
                        </span>
                      </div>
                    </td>

                    {/* 3. LOCATION */}
                    <td className="py-2.5 px-3.5 whitespace-nowrap text-[11px] text-[#525252]">
                      <div className="flex items-center gap-1">
                        <MapPin size={11} className="text-[#EA580C] shrink-0" />
                        <span className="truncate max-w-[180px]">{booking.location}</span>
                      </div>
                    </td>

                    {/* 4. DURATION & DATES */}
                    <td className="py-2.5 px-3.5 whitespace-nowrap">
                      <div className="font-medium text-[#171717]">
                        {new Date(booking.startDate).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}{' '}
                        –{' '}
                        {new Date(booking.endDate).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </div>
                      <div className="text-[10px] text-[#737373]">
                        Duration: <strong className="text-[#171717]">{days} days</strong>
                      </div>
                    </td>

                    {/* 5. SOURCE */}
                    <td className="py-2.5 px-3.5 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase border ${sourceMeta.badgeBg} ${sourceMeta.badgeText} ${sourceMeta.badgeBorder}`}
                      >
                        {sourceMeta.badge}
                      </span>
                    </td>

                    {/* 6. CONTRACT VALUE */}
                    <td className="py-2.5 px-3.5 text-right whitespace-nowrap">
                      <div className="font-bold text-[#171717]">{formatCurrency(price)}</div>
                      {booking.pricing?.sodaarsPrice && booking.source === 'Marketplace' && (
                        <div className="text-[10px] text-[#737373]">
                          Net: {formatCurrency(booking.pricing.sodaarsPrice)}
                        </div>
                      )}
                    </td>

                    {/* 7. STATUS */}
                    <td className="py-2.5 px-3.5 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${bookingStatusMeta.badgeBg} ${bookingStatusMeta.badgeText} ${bookingStatusMeta.badgeBorder}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${bookingStatusMeta.indicatorBg}`} />
                        {bookingStatusMeta.label}
                      </span>
                    </td>

                    {/* 8. ACTION */}
                    <td
                      className="py-2.5 px-3.5 text-right whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewBooking && onViewBooking(booking)}
                        className="h-7 px-2 text-[11px] text-[#737373] hover:text-[#171717] hover:bg-stone-100"
                        title="View Booking Inspector"
                      >
                        <Eye size={12} className="mr-1 text-[#EA580C]" />
                        Inspect
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. PAGINATION CONTROLS                                                     */}
      {/* ========================================================================= */}
      {sortedBookings.length > 0 && (
        <div className="p-3 bg-[#FAFAF9] border-t border-[#E5E5E5] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#737373]">
          <div className="flex items-center gap-3">
            <span>
              Showing <strong className="text-[#171717]">{startIndex + 1}</strong> to{' '}
              <strong className="text-[#171717]">{endIndex}</strong> of{' '}
              <strong className="text-[#171717]">{sortedBookings.length}</strong> bookings for{' '}
              <strong className="text-[#171717]">{customer.companyName}</strong>
            </span>

            {/* Page Size Selector */}
            <div className="flex items-center gap-1 pl-2 border-l border-[#E5E5E5]">
              <span className="text-[11px]">Rows:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="h-6 px-1.5 rounded border border-[#E5E5E5] bg-white text-[11px] text-[#171717] focus:outline-none focus:border-[#EA580C]"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>
          </div>

          {/* Page numbers navigation */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="p-1 rounded text-stone-600 hover:text-black hover:bg-stone-200 disabled:opacity-30 disabled:hover:bg-transparent"
              title="First Page"
            >
              <ChevronsLeft size={14} />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1 rounded text-stone-600 hover:text-black hover:bg-stone-200 disabled:opacity-30 disabled:hover:bg-transparent"
              title="Previous Page"
            >
              <ChevronLeft size={14} />
            </button>

            <div className="flex items-center gap-1 px-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                <button
                  key={num}
                  onClick={() => setCurrentPage(num)}
                  className={`w-6 h-6 rounded text-[11px] font-bold transition-colors ${
                    currentPage === num
                      ? 'bg-[#EA580C] text-white shadow-xs'
                      : 'text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1 rounded text-stone-600 hover:text-black hover:bg-stone-200 disabled:opacity-30 disabled:hover:bg-transparent"
              title="Next Page"
            >
              <ChevronRight size={14} />
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="p-1 rounded text-stone-600 hover:text-black hover:bg-stone-200 disabled:opacity-30 disabled:hover:bg-transparent"
              title="Last Page"
            >
              <ChevronsRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerBookingsTable;
