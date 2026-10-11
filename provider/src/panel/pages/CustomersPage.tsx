import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Plus,
  Search,
  RotateCcw,
  Building,
  Eye,
  Edit,
  UserCheck,
  Briefcase,
  Calendar,
  MapPin,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ExternalLink,
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Button from '../../components/ui/Button';
import {
  CustomerRecord,
  APPROVED_CUSTOMER_TYPES,
  APPROVED_CUSTOMER_STATUSES,
  CUSTOMER_TYPE_CONFIG,
  CUSTOMER_STATUS_CONFIG,
} from '../types/customer';
import { BookingRecord } from '../types/booking';
import CustomerFormDrawer from '../components/customers/CustomerFormDrawer';
import CustomerProfileDrawer from '../components/customers/CustomerProfileDrawer';
import CustomerBookingsDrawer from '../components/customers/CustomerBookingsDrawer';
import BookingDetailDrawer from '../components/bookings/BookingDetailDrawer';
import { SAMPLE_CUSTOMERS } from '../data/sampleCustomers';
import { getAllProviderBookings, getBookingsForCustomer } from '../data/sampleBookings';

type CustomerSortField =
  | 'companyName'
  | 'contactPerson'
  | 'customerType'
  | 'city'
  | 'activeBookings'
  | 'totalBookings'
  | 'status'
  | 'createdAt';

type SortDirection = 'asc' | 'desc';

export const CustomersPage: React.FC = () => {
  // Load customers from storage or initialize with sample customers
  const [customers, setCustomers] = useState<CustomerRecord[]>(() => {
    try {
      const stored = localStorage.getItem('sodaars_provider_customers');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Storage error:', e);
    }
    return SAMPLE_CUSTOMERS;
  });

  // Keep all provider bookings in state for live counters
  const [allBookings] = useState<BookingRecord[]>(() => getAllProviderBookings());

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  // Sorting state
  const [sortField, setSortField] = useState<CustomerSortField>('companyName');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Sliding Window (Drawer) for Customer Bookings
  const [isBookingsDrawerOpen, setIsBookingsDrawerOpen] = useState(false);
  const [bookingsDrawerCustomer, setBookingsDrawerCustomer] = useState<CustomerRecord | null>(null);

  // Selected booking for BookingDetailDrawer inspector
  const [selectedBookingForDetail, setSelectedBookingForDetail] = useState<BookingRecord | null>(
    null
  );
  const [isBookingDetailOpen, setIsBookingDetailOpen] = useState(false);

  // Drawers state for Profile & Form
  const [isFormDrawerOpen, setIsFormDrawerOpen] = useState(false);
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerRecord | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<CustomerRecord | null>(null);

  // Toast message
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Map customer IDs/company names to their booking stats
  const customerBookingStats = useMemo(() => {
    const stats: Record<string, { total: number; active: number; completed: number }> = {};
    customers.forEach((cust) => {
      const list = getBookingsForCustomer(cust.id, cust.companyName, allBookings);
      const active = list.filter((b) => b.status === 'ACTIVE' || b.status === 'CONFIRMED').length;
      const completed = list.filter((b) => b.status === 'COMPLETED').length;
      stats[cust.id] = {
        total: list.length,
        active,
        completed,
      };
    });
    return stats;
  }, [customers, allBookings]);

  // Summary Metrics: Dynamic from customer records
  const summaryMetrics = useMemo(() => {
    return {
      total: customers.length,
      active: customers.filter((c) => c.status === 'Active').length,
      agencies: customers.filter((c) => c.customerType === 'Advertising Agency').length,
      directBuyers: customers.filter((c) => c.customerType === 'Direct Enterprise Buyer').length,
    };
  }, [customers]);

  // Filtered customers
  const filteredCustomers = useMemo(() => {
    return customers.filter((cust) => {
      // Customer Type filter
      if (selectedType !== 'ALL' && cust.customerType !== selectedType) return false;

      // Status filter
      if (selectedStatus !== 'ALL' && cust.status !== selectedStatus) return false;

      // Search query (Company, Brand, Contact Person, Email, Phone, City, State, GSTIN, Customer ID)
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesCompany = cust.companyName.toLowerCase().includes(query);
        const matchesBrand = cust.brandName?.toLowerCase().includes(query) ?? false;
        const matchesContact = cust.contactPerson.toLowerCase().includes(query);
        const matchesEmail = cust.email.toLowerCase().includes(query);
        const matchesPhone = cust.phone.toLowerCase().includes(query);
        const matchesCity = cust.city?.toLowerCase().includes(query) ?? false;
        const matchesState = cust.state?.toLowerCase().includes(query) ?? false;
        const matchesGstin = cust.gstin?.toLowerCase().includes(query) ?? false;
        const matchesId = cust.id.toLowerCase().includes(query);

        return (
          matchesCompany ||
          matchesBrand ||
          matchesContact ||
          matchesEmail ||
          matchesPhone ||
          matchesCity ||
          matchesState ||
          matchesGstin ||
          matchesId
        );
      }

      return true;
    });
  }, [customers, selectedType, selectedStatus, searchQuery]);

  // Sorted customers
  const sortedCustomers = useMemo(() => {
    const list = [...filteredCustomers];
    list.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'companyName':
          comparison = a.companyName.localeCompare(b.companyName);
          break;
        case 'contactPerson':
          comparison = a.contactPerson.localeCompare(b.contactPerson);
          break;
        case 'customerType':
          comparison = a.customerType.localeCompare(b.customerType);
          break;
        case 'city':
          comparison = (a.city || '').localeCompare(b.city || '');
          break;
        case 'activeBookings': {
          const aCount = customerBookingStats[a.id]?.active || 0;
          const bCount = customerBookingStats[b.id]?.active || 0;
          comparison = aCount - bCount;
          break;
        }
        case 'totalBookings': {
          const aCount = customerBookingStats[a.id]?.total || 0;
          const bCount = customerBookingStats[b.id]?.total || 0;
          comparison = aCount - bCount;
          break;
        }
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        case 'createdAt': {
          const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          comparison = timeA - timeB;
          break;
        }
        default:
          comparison = 0;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });
    return list;
  }, [filteredCustomers, sortField, sortDirection, customerBookingStats]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(sortedCustomers.length / pageSize));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, sortedCustomers.length);
  const paginatedCustomers = sortedCustomers.slice(startIndex, endIndex);

  // Sorting handler
  const handleSort = (field: CustomerSortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Handlers for Drawer & Actions
  const handleOpenCreate = () => {
    setEditingCustomer(null);
    setIsFormDrawerOpen(true);
  };

  const handleOpenEdit = (customer: CustomerRecord) => {
    setEditingCustomer(customer);
    setIsFormDrawerOpen(true);
  };

  const handleOpenProfile = (customer: CustomerRecord) => {
    setSelectedCustomer(customer);
    setIsProfileDrawerOpen(true);
  };

  // Action: Open sliding window (Drawer) for customer bookings
  const handleOpenBookingsDrawer = (customer: CustomerRecord) => {
    setBookingsDrawerCustomer(customer);
    setIsBookingsDrawerOpen(true);
  };

  // Action: View booking detail in inspector
  const handleViewBookingDetail = (booking: BookingRecord) => {
    setSelectedBookingForDetail(booking);
    setIsBookingDetailOpen(true);
  };

  const handleSaveCustomer = (savedRecord: CustomerRecord) => {
    setCustomers((prev) => {
      const exists = prev.some((c) => c.id === savedRecord.id);
      const updated = exists
        ? prev.map((c) => (c.id === savedRecord.id ? savedRecord : c))
        : [savedRecord, ...prev];

      try {
        localStorage.setItem('sodaars_provider_customers', JSON.stringify(updated));
      } catch (e) {
        console.error('Storage error:', e);
      }
      return updated;
    });

    if (selectedCustomer && selectedCustomer.id === savedRecord.id) {
      setSelectedCustomer(savedRecord);
    }
    if (bookingsDrawerCustomer && bookingsDrawerCustomer.id === savedRecord.id) {
      setBookingsDrawerCustomer(savedRecord);
    }

    showToast(`Customer ${savedRecord.companyName} saved successfully.`);
  };

  const hasActiveFilters = searchQuery !== '' || selectedType !== 'ALL' || selectedStatus !== 'ALL';

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedType('ALL');
    setSelectedStatus('ALL');
    setCurrentPage(1);
  };

  return (
    <div className="flex-1 flex flex-col w-full">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-3.5 rounded-lg bg-[#171717] text-white text-xs font-semibold shadow-lg flex items-center gap-2 border border-stone-800 transition-all animate-in fade-in slide-in-from-bottom-2">
          <span className="w-2 h-2 rounded-full bg-[#EA580C]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <PageHeader
        eyebrow="CUSTOMER CRM"
        title="Keep Every Customer Relationship Connected."
        description="Manage agencies and direct enterprise buyers alongside local businesses and brands in one connected customer record."
        actions={
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus size={14} />}
            onClick={handleOpenCreate}
            className="shadow-xs font-semibold"
          >
            Add Customer
          </Button>
        }
      />

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* ========================================================================= */}
        {/* 1. SUMMARY METRICS STRIP                                                  */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* TOTAL CUSTOMERS */}
          <div className="bg-white rounded-xl p-4 border border-[#E5E5E5] shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373]">
                Total Customers
              </span>
              <Users size={14} className="text-[#EA580C]" />
            </div>
            <div className="my-2 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-[#171717] leading-none">
                {summaryMetrics.total}
              </span>
            </div>
            <span className="text-[11px] text-[#737373]">
              Connected client relationships
            </span>
          </div>

          {/* ACTIVE CUSTOMERS */}
          <div className="bg-white rounded-xl p-4 border border-[#E5E5E5] shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373]">
                Active Customers
              </span>
              <UserCheck size={14} className="text-emerald-600" />
            </div>
            <div className="my-2 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-emerald-800 leading-none">
                {summaryMetrics.active}
              </span>
            </div>
            <span className="text-[11px] text-[#737373]">
              Operational account standing
            </span>
          </div>

          {/* ADVERTISING AGENCIES */}
          <div className="bg-white rounded-xl p-4 border border-[#E5E5E5] shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373]">
                Advertising Agencies
              </span>
              <Briefcase size={14} className="text-amber-600" />
            </div>
            <div className="my-2 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-amber-700 leading-none">
                {summaryMetrics.agencies}
              </span>
            </div>
            <span className="text-[11px] text-[#737373]">
              Multi-brand agency buyers
            </span>
          </div>

          {/* DIRECT ENTERPRISE BUYERS */}
          <div className="bg-white rounded-xl p-4 border border-[#E5E5E5] shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373]">
                Direct Enterprise Buyers
              </span>
              <Building size={14} className="text-[#171717]" />
            </div>
            <div className="my-2 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-stone-800 leading-none">
                {summaryMetrics.directBuyers}
              </span>
            </div>
            <span className="text-[11px] text-[#737373]">
              National enterprise accounts
            </span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. SEARCH & FILTER BAR                                                    */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-xl border border-[#E5E5E5] shadow-xs p-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#737373]"
            />
            <input
              type="text"
              placeholder="Search by company, brand, contact person, email, phone, city, GSTIN..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-[#E5E5E5] focus:outline-none focus:border-[#EA580C] bg-white transition-colors"
            />
          </div>

          {/* Customer Type Filter */}
          <div className="shrink-0">
            <select
              value={selectedType}
              onChange={(e) => {
                setSelectedType(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full sm:w-auto h-9 text-xs rounded-lg border border-[#E5E5E5] bg-white px-3 text-[#171717] focus:outline-none focus:border-[#EA580C]"
            >
              <option value="ALL">All Types ({customers.length})</option>
              {APPROVED_CUSTOMER_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="shrink-0">
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full sm:w-auto h-9 text-xs rounded-lg border border-[#E5E5E5] bg-white px-3 text-[#171717] focus:outline-none focus:border-[#EA580C]"
            >
              <option value="ALL">All Statuses</option>
              {APPROVED_CUSTOMER_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              leftIcon={<RotateCcw size={12} />}
              className="text-xs text-[#737373] hover:text-[#171717]"
            >
              Reset Filters
            </Button>
          )}
        </div>

        {/* ========================================================================= */}
        {/* 3. CUSTOMER DATA TABLE WITH SEARCHING, SORTING, PAGINATION                */}
        {/* ========================================================================= */}
        {paginatedCustomers.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#E5E5E5] shadow-xs p-10 flex flex-col items-center justify-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#EA580C] mb-4 shadow-xs">
              <Users size={26} />
            </div>

            {customers.length === 0 ? (
              <>
                <h3 className="text-base font-bold text-[#171717] mb-1">
                  No customers to display.
                </h3>
                <p className="text-xs text-[#737373] max-w-md mb-6 leading-relaxed">
                  Customer records for agencies, enterprise buyers, local businesses, and brands will appear here.
                </p>
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<Plus size={14} />}
                  onClick={handleOpenCreate}
                >
                  Add Customer
                </Button>
              </>
            ) : (
              <>
                <h3 className="text-base font-bold text-[#171717] mb-1">
                  No customers match your active filters.
                </h3>
                <p className="text-xs text-[#737373] max-w-md mb-4 leading-relaxed">
                  Try clearing your search query or customer type and status filters.
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon={<RotateCcw size={13} />}
                  onClick={resetFilters}
                >
                  Reset Active Filters
                </Button>
              </>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-[#E5E5E5] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#FAFAF9] border-b border-[#E5E5E5] text-[10px] font-bold uppercase tracking-wider text-[#737373]">
                    {/* 1. CUSTOMER / COMPANY */}
                    <th
                      className="py-3 px-4 cursor-pointer hover:bg-stone-100 transition-colors select-none"
                      onClick={() => handleSort('companyName')}
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Customer / Company</span>
                        {sortField === 'companyName' ? (
                          sortDirection === 'asc' ? (
                            <ArrowUp size={12} className="text-[#EA580C]" />
                          ) : (
                            <ArrowDown size={12} className="text-[#EA580C]" />
                          )
                        ) : (
                          <ArrowUpDown size={12} className="text-stone-400" />
                        )}
                      </div>
                    </th>

                    {/* 2. CONTACT PERSON */}
                    <th
                      className="py-3 px-4 cursor-pointer hover:bg-stone-100 transition-colors select-none"
                      onClick={() => handleSort('contactPerson')}
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Contact</span>
                        {sortField === 'contactPerson' ? (
                          sortDirection === 'asc' ? (
                            <ArrowUp size={12} className="text-[#EA580C]" />
                          ) : (
                            <ArrowDown size={12} className="text-[#EA580C]" />
                          )
                        ) : (
                          <ArrowUpDown size={12} className="text-stone-400" />
                        )}
                      </div>
                    </th>

                    {/* 3. CUSTOMER TYPE */}
                    <th
                      className="py-3 px-4 cursor-pointer hover:bg-stone-100 transition-colors select-none"
                      onClick={() => handleSort('customerType')}
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Customer Type</span>
                        {sortField === 'customerType' ? (
                          sortDirection === 'asc' ? (
                            <ArrowUp size={12} className="text-[#EA580C]" />
                          ) : (
                            <ArrowDown size={12} className="text-[#EA580C]" />
                          )
                        ) : (
                          <ArrowUpDown size={12} className="text-stone-400" />
                        )}
                      </div>
                    </th>

                    {/* 4. LOCATION */}
                    <th
                      className="py-3 px-4 cursor-pointer hover:bg-stone-100 transition-colors select-none"
                      onClick={() => handleSort('city')}
                    >
                      <div className="flex items-center gap-1.5">
                        <span>City / Region</span>
                        {sortField === 'city' ? (
                          sortDirection === 'asc' ? (
                            <ArrowUp size={12} className="text-[#EA580C]" />
                          ) : (
                            <ArrowDown size={12} className="text-[#EA580C]" />
                          )
                        ) : (
                          <ArrowUpDown size={12} className="text-stone-400" />
                        )}
                      </div>
                    </th>

                    {/* 5. ACTIVE BOOKINGS */}
                    <th
                      className="py-3 px-4 text-center cursor-pointer hover:bg-stone-100 transition-colors select-none"
                      onClick={() => handleSort('activeBookings')}
                    >
                      <div className="flex items-center justify-center gap-1.5">
                        <span>Active Bookings</span>
                        {sortField === 'activeBookings' ? (
                          sortDirection === 'asc' ? (
                            <ArrowUp size={12} className="text-[#EA580C]" />
                          ) : (
                            <ArrowDown size={12} className="text-[#EA580C]" />
                          )
                        ) : (
                          <ArrowUpDown size={12} className="text-stone-400" />
                        )}
                      </div>
                    </th>

                    {/* 6. TOTAL BOOKINGS */}
                    <th
                      className="py-3 px-4 text-center cursor-pointer hover:bg-stone-100 transition-colors select-none"
                      onClick={() => handleSort('totalBookings')}
                    >
                      <div className="flex items-center justify-center gap-1.5">
                        <span>Total Bookings</span>
                        {sortField === 'totalBookings' ? (
                          sortDirection === 'asc' ? (
                            <ArrowUp size={12} className="text-[#EA580C]" />
                          ) : (
                            <ArrowDown size={12} className="text-[#EA580C]" />
                          )
                        ) : (
                          <ArrowUpDown size={12} className="text-stone-400" />
                        )}
                      </div>
                    </th>

                    {/* 7. STATUS */}
                    <th
                      className="py-3 px-4 cursor-pointer hover:bg-stone-100 transition-colors select-none"
                      onClick={() => handleSort('status')}
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
                          <ArrowUpDown size={12} className="text-stone-400" />
                        )}
                      </div>
                    </th>

                    {/* 8. ACTIONS */}
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#E5E5E5]">
                  {paginatedCustomers.map((cust) => {
                    const typeMeta = CUSTOMER_TYPE_CONFIG[cust.customerType];
                    const statusMeta = CUSTOMER_STATUS_CONFIG[cust.status];
                    const stats = customerBookingStats[cust.id] || { total: 0, active: 0, completed: 0 };
                    const isSelectedInDrawer = bookingsDrawerCustomer?.id === cust.id && isBookingsDrawerOpen;

                    return (
                      <tr
                        key={cust.id}
                        className={`transition-colors cursor-pointer group ${
                          isSelectedInDrawer
                            ? 'bg-orange-50/50 ring-1 ring-inset ring-orange-200'
                            : 'hover:bg-[#FAFAF9]/90'
                        }`}
                        onClick={() => handleOpenProfile(cust)}
                      >
                        {/* 1. CUSTOMER / COMPANY */}
                        <td className="py-3 px-4">
                          <div className="font-semibold text-[#171717] flex items-center gap-2">
                            <span>{cust.companyName}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-0.5 text-[11px] text-[#737373]">
                            <span className="font-mono text-[10px]">{cust.id}</span>
                            {cust.brandName && (
                              <>
                                <span>•</span>
                                <span>Brand: {cust.brandName}</span>
                              </>
                            )}
                          </div>
                        </td>

                        {/* 2. CONTACT */}
                        <td className="py-3 px-4">
                          <div className="font-medium text-[#171717]">{cust.contactPerson}</div>
                          <div className="text-[11px] text-[#737373]">{cust.email}</div>
                          <div className="text-[11px] text-[#737373]">{cust.phone}</div>
                        </td>

                        {/* 3. CUSTOMER TYPE */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${typeMeta.badgeBg} ${typeMeta.badgeText} ${typeMeta.badgeBorder}`}
                          >
                            {typeMeta.label}
                          </span>
                        </td>

                        {/* 4. CITY / LOCATION */}
                        <td className="py-3 px-4 whitespace-nowrap text-[#525252]">
                          {cust.city ? (
                            <div className="flex items-center gap-1">
                              <MapPin size={11} className="text-[#EA580C] shrink-0" />
                              <span>{cust.city}</span>
                              {cust.state && <span className="text-[#737373]">, {cust.state}</span>}
                            </div>
                          ) : (
                            <span className="text-stone-400">—</span>
                          )}
                        </td>

                        {/* 5. ACTIVE BOOKINGS */}
                        <td className="py-3 px-4 text-center">
                          {stats.active > 0 ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200">
                              {stats.active} Active
                            </span>
                          ) : (
                            <span className="text-stone-400 font-medium">0</span>
                          )}
                        </td>

                        {/* 6. TOTAL BOOKINGS */}
                        <td className="py-3 px-4 text-center">
                          {stats.total > 0 ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-800 border border-stone-200">
                              {stats.total} Total
                            </span>
                          ) : (
                            <span className="text-stone-400 font-medium">0</span>
                          )}
                        </td>

                        {/* 7. STATUS */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${statusMeta.badgeBg} ${statusMeta.badgeText} ${statusMeta.badgeBorder}`}
                          >
                            {statusMeta.label}
                          </span>
                        </td>

                        {/* 8. ACTIONS: PROFILE MANAGEMENT ACTION ICONS + BOOKINGS SLIDING WINDOW / SEPARATE PAGE */}
                        <td
                          className="py-3 px-4 text-right whitespace-nowrap"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center justify-end gap-1.5">
                            {/* View Profile Action Icon */}
                            <button
                              type="button"
                              onClick={() => handleOpenProfile(cust)}
                              className="h-7 w-7 rounded-md inline-flex items-center justify-center text-stone-600 hover:text-[#171717] hover:bg-stone-100 transition-colors border border-transparent hover:border-stone-200"
                              title="View Customer Profile"
                            >
                              <Eye size={14} />
                            </button>

                            {/* Edit Customer Action Icon */}
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(cust)}
                              className="h-7 w-7 rounded-md inline-flex items-center justify-center text-stone-600 hover:text-[#171717] hover:bg-stone-100 transition-colors border border-transparent hover:border-stone-200"
                              title="Edit Customer Details"
                            >
                              <Edit size={13} />
                            </button>

                            {/* Customer Bookings Action: Slides Open Window */}
                            <Button
                              variant="outline"
                              size="sm"
                              className={`h-7 px-2.5 text-[11px] font-semibold transition-all ${
                                isSelectedInDrawer
                                  ? 'bg-[#EA580C] text-white border-[#EA580C] shadow-xs'
                                  : 'border-orange-200 text-[#EA580C] hover:bg-orange-50'
                              }`}
                              onClick={() => handleOpenBookingsDrawer(cust)}
                              title={`Slide open bookings window for ${cust.companyName}`}
                            >
                              <Calendar size={12} className="mr-1" />
                              Bookings
                              {stats.total > 0 && (
                                <span
                                  className={`ml-1 px-1.5 py-0.2 rounded-full text-[9px] font-extrabold ${
                                    isSelectedInDrawer
                                      ? 'bg-white text-[#EA580C]'
                                      : 'bg-orange-100 text-[#EA580C]'
                                  }`}
                                >
                                  {stats.total}
                                </span>
                              )}
                            </Button>

                            {/* Direct Separate Page Link */}
                            <Link
                              to={`/panel/customers/${cust.id}/bookings`}
                              className="h-7 w-7 rounded-md inline-flex items-center justify-center text-stone-500 hover:text-[#EA580C] hover:bg-orange-50 transition-colors border border-stone-200 hover:border-orange-200"
                              title={`Open ${cust.companyName} bookings in separate page`}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <ExternalLink size={12} />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* ========================================================================= */}
            {/* PAGINATION CONTROLS (PAGE NUMBER, PAGE SIZE)                               */}
            {/* ========================================================================= */}
            <div className="bg-[#FAFAF9] px-4 py-3 border-t border-[#E5E5E5] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#737373]">
              <div className="flex items-center gap-4">
                <span>
                  Showing <strong className="text-[#171717]">{startIndex + 1}</strong> to{' '}
                  <strong className="text-[#171717]">{endIndex}</strong> of{' '}
                  <strong className="text-[#171717]">{sortedCustomers.length}</strong> customers
                  {customers.length !== sortedCustomers.length && (
                    <span className="text-[11px] text-[#737373] ml-1">
                      (filtered from {customers.length} total)
                    </span>
                  )}
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
                <button
                  type="button"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-md text-stone-600 hover:text-black hover:bg-stone-200 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                  title="First Page"
                >
                  <ChevronsLeft size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-md text-stone-600 hover:text-black hover:bg-stone-200 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                  title="Previous Page"
                >
                  <ChevronLeft size={14} />
                </button>

                {/* Page Number Buttons */}
                <div className="flex items-center gap-1 px-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-7 h-7 rounded-md text-xs font-bold transition-colors ${
                        currentPage === pageNum
                          ? 'bg-[#EA580C] text-white shadow-xs'
                          : 'text-stone-700 hover:bg-stone-200'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded-md text-stone-600 hover:text-black hover:bg-stone-200 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                  title="Next Page"
                >
                  <ChevronRight size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded-md text-stone-600 hover:text-black hover:bg-stone-200 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                  title="Last Page"
                >
                  <ChevronsRight size={14} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 4. SLIDING WINDOW (DRAWER) FOR CUSTOMER BOOKINGS                          */}
      {/* ========================================================================= */}
      <CustomerBookingsDrawer
        isOpen={isBookingsDrawerOpen}
        onClose={() => {
          setIsBookingsDrawerOpen(false);
          setBookingsDrawerCustomer(null);
        }}
        customer={bookingsDrawerCustomer}
        onViewBooking={handleViewBookingDetail}
      />

      {/* ========================================================================= */}
      {/* 5. DRAWERS & MODALS                                                       */}
      {/* ========================================================================= */}
      {/* Customer Form Drawer (Create / Edit) */}
      <CustomerFormDrawer
        isOpen={isFormDrawerOpen}
        onClose={() => {
          setIsFormDrawerOpen(false);
          setEditingCustomer(null);
        }}
        customer={editingCustomer}
        onSave={handleSaveCustomer}
      />

      {/* Customer Profile Drawer (Inspector) */}
      <CustomerProfileDrawer
        isOpen={isProfileDrawerOpen}
        onClose={() => {
          setIsProfileDrawerOpen(false);
          setSelectedCustomer(null);
        }}
        customer={selectedCustomer}
        onEdit={(cust) => {
          setIsProfileDrawerOpen(false);
          handleOpenEdit(cust);
        }}
        onViewBookings={(cust) => {
          handleOpenBookingsDrawer(cust);
        }}
      />

      {/* Booking Detail Drawer (Inspector for any individual booking clicked) */}
      <BookingDetailDrawer
        isOpen={isBookingDetailOpen}
        onClose={() => {
          setIsBookingDetailOpen(false);
          setSelectedBookingForDetail(null);
        }}
        booking={selectedBookingForDetail}
      />
    </div>
  );
};

export default CustomersPage;
