import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  FileText,
  Plus,
  Search,
  RotateCcw,
  CheckCircle2,
  Clock,
  MapPin,
  Eye,
  Receipt,
  Sparkles,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List,
  Calendar,
  Truck,
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Button from '../../components/ui/Button';
import {
  BookingRecord,
  BookingPipelineTab,
  APPROVED_BOOKING_SOURCES,
  BOOKING_SOURCE_CONFIG,
  BOOKING_STATUS_CONFIG,
  PIPELINE_TABS,
} from '../types/booking';
import { getAllProviderBookings } from '../data/sampleBookings';
import { getAllCampaigns, saveCampaignsToStorage } from '../data/sampleCampaigns';
import { CampaignRecord } from '../types/campaign';
import { InvoiceRecord } from '../types/finance';
import { getInvoiceForBooking } from '../utils/bookingInvoiceBridge';
import BookingDetailDrawer from '../components/bookings/BookingDetailDrawer';
import ConfirmBookingModal from '../components/bookings/ConfirmBookingModal';
import DeclineBookingModal from '../components/bookings/DeclineBookingModal';
import CreateDirectBookingModal from '../components/bookings/CreateDirectBookingModal';
import QuotationViewerModal from '../components/bookings/QuotationViewerModal';
import PushToCampaignModal from '../components/bookings/PushToCampaignModal';
import InvoiceViewerModal from '../components/finance/InvoiceViewerModal';

type SortField = 'id' | 'customerName' | 'startDate' | 'pricing' | 'status';
type SortDirection = 'asc' | 'desc';

export const BookingsPage: React.FC = () => {
  const navigate = useNavigate();

  // Load saved provider bookings or initialize with pre-seeded rich OOH bookings
  const [bookings, setBookings] = useState<BookingRecord[]>(() => getAllProviderBookings());

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSource, setSelectedSource] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [activeTab, setActiveTab] = useState<BookingPipelineTab>('All');
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');

  // View Mode: Table vs. Kanban Pipeline
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');

  // Sorting state
  const [sortField, setSortField] = useState<SortField>('startDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modals & Drawer state
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<BookingRecord | null>(null);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isDeclineModalOpen, setIsDeclineModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Quotation & Invoice Modals
  const [selectedQuotationBooking, setSelectedQuotationBooking] = useState<BookingRecord | null>(null);
  const [isQuotationModalOpen, setIsQuotationModalOpen] = useState(false);

  const [selectedInvoiceRecord, setSelectedInvoiceRecord] = useState<InvoiceRecord | null>(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  // Push to Campaign Modal
  const [selectedPushBooking, setSelectedPushBooking] = useState<BookingRecord | null>(null);
  const [isPushModalOpen, setIsPushModalOpen] = useState(false);

  // Toast message
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Persist bookings to localStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem('sodaars_provider_bookings', JSON.stringify(bookings));
    } catch (e) {
      console.error('Failed to save bookings:', e);
    }
  }, [bookings]);

  // Reset pagination on filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeTab, selectedSource, selectedStatus, startDateFilter, endDateFilter, pageSize]);

  // Parse numerical amount helper
  const getBookingAmount = (b: BookingRecord): number => {
    return parseInt(
      b.pricing.finalInvoicedAmount ||
        b.pricing.regularCustomerPrice ||
        b.pricing.sodaarsPrice ||
        '0',
      10
    );
  };

  // Dynamic Live Summary Metrics
  const summaryMetrics = useMemo(() => {
    const total = bookings.length;
    const totalPipelineValue = bookings.reduce((sum, b) => sum + getBookingAmount(b), 0);
    const underReview = bookings.filter(
      (b) =>
        b.status === 'UNDER REVIEW' ||
        b.status === 'NEW' ||
        b.status === 'PROVIDER CONFIRMATION' ||
        b.status === 'CUSTOMER CONFIRMATION'
    ).length;
    const confirmed = bookings.filter((b) => b.status === 'CONFIRMED' || b.status === 'PAYMENT').length;
    const active = bookings.filter((b) => b.status === 'ACTIVE').length;
    const completed = bookings.filter((b) => b.status === 'COMPLETED').length;

    return { total, totalPipelineValue, underReview, confirmed, active, completed };
  }, [bookings]);

  // Tab filter matcher
  const matchesTab = (booking: BookingRecord, tab: BookingPipelineTab): boolean => {
    switch (tab) {
      case 'All':
        return true;
      case 'Under Review':
        return (
          booking.status === 'UNDER REVIEW' ||
          booking.status === 'NEW' ||
          booking.status === 'PROVIDER CONFIRMATION' ||
          booking.status === 'CUSTOMER CONFIRMATION'
        );
      case 'Confirmed':
        return booking.status === 'CONFIRMED' || booking.status === 'PAYMENT';
      case 'Active':
        return booking.status === 'ACTIVE';
      case 'Completed':
        return booking.status === 'COMPLETED';
      case 'Cancelled':
        return (
          booking.status === 'CANCELLED' ||
          booking.status === 'DECLINED' ||
          booking.status === 'EXPIRED' ||
          booking.status === 'REFUNDED'
        );
      default:
        return true;
    }
  };

  // Filtered bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      if (!matchesTab(booking, activeTab)) return false;
      if (selectedSource !== 'ALL' && booking.source !== selectedSource) return false;
      if (selectedStatus !== 'ALL' && booking.status !== selectedStatus) return false;
      if (startDateFilter && booking.startDate < startDateFilter) return false;
      if (endDateFilter && booking.endDate > endDateFilter) return false;

      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesId = booking.id.toLowerCase().includes(query);
        const matchesCustomer = booking.customerName.toLowerCase().includes(query);
        const matchesCompany = booking.companyName.toLowerCase().includes(query);
        const matchesResource = booking.resourceName.toLowerCase().includes(query);
        const matchesLocation = booking.location.toLowerCase().includes(query);
        return matchesId || matchesCustomer || matchesCompany || matchesResource || matchesLocation;
      }

      return true;
    });
  }, [bookings, activeTab, selectedSource, selectedStatus, startDateFilter, endDateFilter, searchQuery]);

  // Sorted bookings
  const sortedBookings = useMemo(() => {
    return [...filteredBookings].sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'id':
          comparison = a.id.localeCompare(b.id);
          break;
        case 'customerName':
          comparison = a.customerName.localeCompare(b.customerName);
          break;
        case 'startDate':
          comparison = a.startDate.localeCompare(b.startDate);
          break;
        case 'pricing':
          comparison = getBookingAmount(a) - getBookingAmount(b);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        default:
          comparison = 0;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [filteredBookings, sortField, sortDirection]);

  // Paginated bookings
  const paginatedBookings = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedBookings.slice(startIndex, startIndex + pageSize);
  }, [sortedBookings, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedBookings.length / pageSize) || 1;

  // Sorting handler
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Handlers
  const handleOpenDetail = (booking: BookingRecord) => {
    setSelectedBooking(booking);
    setIsDetailDrawerOpen(true);
  };

  const handleOpenConfirm = (booking: BookingRecord) => {
    setSelectedBooking(booking);
    setIsConfirmModalOpen(true);
  };

  const handleOpenDecline = (booking: BookingRecord) => {
    setSelectedBooking(booking);
    setIsDeclineModalOpen(true);
  };

  const handleOpenQuotation = (booking: BookingRecord) => {
    setSelectedQuotationBooking(booking);
    setIsQuotationModalOpen(true);
  };

  const handleOpenInvoice = (booking: BookingRecord) => {
    const inv = getInvoiceForBooking(booking);
    setSelectedInvoiceRecord(inv);
    setIsInvoiceModalOpen(true);
  };

  const handleOpenPushModal = (booking: BookingRecord) => {
    setSelectedPushBooking(booking);
    setIsPushModalOpen(true);
  };

  const handleConfirmAction = (booking: BookingRecord) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === booking.id ? { ...b, status: 'CONFIRMED' } : b))
    );
    if (selectedBooking && selectedBooking.id === booking.id) {
      setSelectedBooking((prev) => (prev ? { ...prev, status: 'CONFIRMED' } : null));
    }
    showToast(`Booking ${booking.id} confirmed.`);
  };

  const handleDeclineAction = (booking: BookingRecord, declineReason: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === booking.id ? { ...b, status: 'DECLINED', declineReason } : b))
    );
    if (selectedBooking && selectedBooking.id === booking.id) {
      setSelectedBooking((prev) => (prev ? { ...prev, status: 'DECLINED', declineReason } : null));
    }
    showToast(`Booking ${booking.id} declined.`);
  };

  const handleCreateDirectBooking = (newBooking: BookingRecord) => {
    setBookings((prev) => [newBooking, ...prev]);
    showToast(`Booking ${newBooking.id} created successfully.`);
  };

  // Push to Campaign Execution Handler
  const handleConfirmPushToCampaign = (
    booking: BookingRecord,
    campaignDetails: {
      campaignName: string;
      mountingTeam: string;
      flexSpec: string;
      notes: string;
      startDate: string;
      endDate: string;
    }
  ) => {
    const currentCampaigns = getAllCampaigns();
    const newCampaignId = `CMP-2026-${String(currentCampaigns.length + 1).padStart(3, '0')}`;

    const newCampaign: CampaignRecord = {
      id: newCampaignId,
      campaignName: campaignDetails.campaignName,
      customerId: booking.customerId || 'CUST-2026-001',
      customerName: booking.customerName,
      companyName: booking.companyName,
      bookingReference: booking.id,
      bookingSource: booking.source,
      resourceId: booking.resourceId,
      resourceName: booking.resourceName,
      resourceType: booking.resourceType,
      location: booking.location,
      bookedAmount: String(getBookingAmount(booking)),
      startDate: campaignDetails.startDate || booking.startDate,
      endDate: campaignDetails.endDate || booking.endDate,
      executionStatus: 'Planned',
      mountingTeam: campaignDetails.mountingTeam,
      activeCreative: {
        id: `CRV-2026-${String(Date.now()).slice(-3)}`,
        title: `${booking.companyName} Artwork v1`,
        imageUrl: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=1000&auto=format&fit=crop&q=80',
        format: campaignDetails.flexSpec,
        dimensions: '40ft × 20ft',
        uploadedAt: new Date().toISOString().split('T')[0],
        version: 1,
        notes: campaignDetails.notes,
      },
      notes: campaignDetails.notes,
      createdAt: new Date().toISOString().split('T')[0],
    };

    // Save to campaigns storage
    saveCampaignsToStorage([newCampaign, ...currentCampaigns]);

    // Update booking state
    setBookings((prev) =>
      prev.map((b) =>
        b.id === booking.id
          ? {
              ...b,
              campaignId: newCampaignId,
              campaignStatus: 'Planned',
              status: b.status === 'UNDER REVIEW' ? 'CONFIRMED' : b.status,
            }
          : b
      )
    );

    showToast(
      `Booking ${booking.id} pushed to Campaign Execution as "${newCampaignId}" (Status: Planned). Ready for mounting schedule!`
    );
  };

  const hasActiveFilters =
    searchQuery !== '' ||
    selectedSource !== 'ALL' ||
    selectedStatus !== 'ALL' ||
    activeTab !== 'All' ||
    startDateFilter !== '' ||
    endDateFilter !== '';

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedSource('ALL');
    setSelectedStatus('ALL');
    setActiveTab('All');
    setStartDateFilter('');
    setEndDateFilter('');
  };

  const formatCurrency = (amt: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amt);
  };

  // Payment badge helper
  const getPaymentBadge = (b: BookingRecord) => {
    if (b.paymentStatus === 'PAID' || b.status === 'ACTIVE' || b.status === 'COMPLETED') {
      return (
        <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[9px] font-bold uppercase bg-emerald-50 text-emerald-800 border border-emerald-200">
          Paid in Full
        </span>
      );
    }
    if (b.source === 'Marketplace') {
      return (
        <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[9px] font-bold uppercase bg-orange-50 text-[#EA580C] border border-orange-200">
          Escrow Secured
        </span>
      );
    }
    if (b.status === 'CONFIRMED' || b.status === 'PAYMENT') {
      return (
        <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[9px] font-bold uppercase bg-blue-50 text-blue-800 border border-blue-200">
          50% Advance
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[9px] font-bold uppercase bg-amber-50 text-amber-800 border border-amber-200">
        Payment Pending
      </span>
    );
  };

  return (
    <div className="flex-1 flex flex-col w-full pb-10">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-[#171717] text-white text-xs font-semibold shadow-2xl flex items-center gap-2.5 border border-stone-800 transition-all animate-in fade-in slide-in-from-bottom-2 max-w-md">
          <span className="w-2.5 h-2.5 rounded-full bg-[#EA580C] shrink-0" />
          <div className="flex-1">{toastMessage}</div>
          <Link
            to="/panel/campaigns"
            className="text-orange-400 hover:underline shrink-0 text-[11px] font-bold ml-2"
          >
            Go to Campaigns →
          </Link>
        </div>
      )}

      {/* Page Header */}
      <PageHeader
        eyebrow="BOOKING PIPELINE & ORDERS"
        title="Keep Every Booking Moving."
        description="Manage multi-channel client reservations, inspect rate quotations, generate GST tax invoices, and push confirmed bookings directly into campaign mounting execution."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Plus size={14} />}
              onClick={() => setIsCreateModalOpen(true)}
              className="text-xs border-[#E5E5E5] text-[#171717] hover:bg-stone-50"
            >
              Quick Booking
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Sparkles size={14} className="text-white" />}
              onClick={() => navigate('/panel/bookings/create')}
              className="text-xs bg-[#EA580C] hover:bg-[#C2410C] text-white font-semibold shadow-xs"
            >
              + Create Booking Wizard
            </Button>
          </div>
        }
      />

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* ========================================================================= */}
        {/* 1. DYNAMIC SUMMARY METRICS STRIP                                          */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {/* TOTAL PIPELINE VALUE */}
          <div className="bg-white rounded-xl p-4 border border-[#E5E5E5] shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373]">
                Total Bookings
              </span>
              <FileText size={14} className="text-[#EA580C]" />
            </div>
            <div className="my-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-[#171717] leading-none">
                {summaryMetrics.total}
              </span>
              <span className="text-xs font-bold text-emerald-700 font-mono">
                {formatCurrency(summaryMetrics.totalPipelineValue)}
              </span>
            </div>
            <span className="text-[11px] text-[#737373]">
              Active contract pipeline yield
            </span>
          </div>

          {/* UNDER REVIEW / HOLD */}
          <div
            onClick={() => setActiveTab('Under Review')}
            className={`bg-white rounded-xl p-4 border transition-all cursor-pointer shadow-xs flex flex-col justify-between hover:border-amber-500 ${
              activeTab === 'Under Review' ? 'ring-2 ring-amber-500/20 border-amber-500' : 'border-[#E5E5E5]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373]">
                Under Review
              </span>
              <Clock size={14} className="text-amber-600" />
            </div>
            <div className="my-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-amber-700 leading-none">
                {summaryMetrics.underReview}
              </span>
              <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                Action Req
              </span>
            </div>
            <span className="text-[11px] text-[#737373]">
              Awaiting provider sign-off
            </span>
          </div>

          {/* CONFIRMED / PAYMENT */}
          <div
            onClick={() => setActiveTab('Confirmed')}
            className={`bg-white rounded-xl p-4 border transition-all cursor-pointer shadow-xs flex flex-col justify-between hover:border-emerald-500 ${
              activeTab === 'Confirmed' ? 'ring-2 ring-emerald-500/20 border-emerald-500' : 'border-[#E5E5E5]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373]">
                Confirmed &amp; Paid
              </span>
              <CheckCircle2 size={14} className="text-emerald-600" />
            </div>
            <div className="my-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-emerald-800 leading-none">
                {summaryMetrics.confirmed}
              </span>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                Push Ready
              </span>
            </div>
            <span className="text-[11px] text-[#737373]">
              Binding contract &amp; payment locked
            </span>
          </div>

          {/* ACTIVE IN-RUN */}
          <div
            onClick={() => setActiveTab('Active')}
            className={`bg-white rounded-xl p-4 border transition-all cursor-pointer shadow-xs flex flex-col justify-between hover:border-emerald-600 ${
              activeTab === 'Active' ? 'ring-2 ring-emerald-600/20 border-emerald-600' : 'border-[#E5E5E5]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373]">
                Live in Flight
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div className="my-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-[#171717] leading-none">
                {summaryMetrics.active}
              </span>
            </div>
            <span className="text-[11px] text-[#737373]">
              Media active on display
            </span>
          </div>

          {/* COMPLETED */}
          <div
            onClick={() => setActiveTab('Completed')}
            className={`bg-white rounded-xl p-4 border transition-all cursor-pointer shadow-xs flex flex-col justify-between col-span-2 sm:col-span-1 hover:border-stone-400 ${
              activeTab === 'Completed' ? 'ring-2 ring-stone-400/20 border-stone-400' : 'border-[#E5E5E5]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373]">
                Completed
              </span>
              <span className="w-2 h-2 rounded-full bg-stone-400" />
            </div>
            <div className="my-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-stone-700 leading-none">
                {summaryMetrics.completed}
              </span>
            </div>
            <span className="text-[11px] text-[#737373]">
              Campaign concluded &amp; settled
            </span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. PIPELINE TABS, VIEW SWITCHER & SEARCH CONTROLS                         */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-xl border border-[#E5E5E5] shadow-xs p-4 space-y-4">
          {/* Top row: Pipeline Tabs, Source Selector & View Mode Switcher */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-[#E5E5E5] pb-4">
            {/* Pipeline Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
              {PIPELINE_TABS.map((tab) => {
                const isActive = activeTab === tab;
                const tabCount = bookings.filter((b) => matchesTab(b, tab)).length;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-[#171717] text-white shadow-xs'
                        : 'text-[#525252] hover:text-[#171717] hover:bg-[#F5F5F4]'
                    }`}
                  >
                    <span>{tab}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        isActive ? 'bg-stone-800 text-stone-200 font-mono' : 'bg-stone-100 text-stone-600'
                      }`}
                    >
                      {tabCount}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Right: Source Pills & View Switcher */}
            <div className="flex items-center justify-between sm:justify-end gap-3 flex-wrap">
              {/* Approved Booking Source Filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-[#737373] hidden sm:inline">
                  Source:
                </span>
                <div className="inline-flex rounded-lg border border-[#E5E5E5] p-0.5 bg-[#FAFAF9]">
                  <button
                    onClick={() => setSelectedSource('ALL')}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                      selectedSource === 'ALL'
                        ? 'bg-white text-[#171717] shadow-xs font-bold'
                        : 'text-[#737373] hover:text-[#171717]'
                    }`}
                  >
                    All
                  </button>
                  {APPROVED_BOOKING_SOURCES.map((source) => {
                    const isSelected = selectedSource === source;
                    return (
                      <button
                        key={source}
                        onClick={() => setSelectedSource(source)}
                        className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                          isSelected
                            ? 'bg-white text-[#EA580C] shadow-xs font-bold'
                            : 'text-[#737373] hover:text-[#171717]'
                        }`}
                      >
                        {source}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* View Mode Toggle: Table vs Kanban */}
              <div className="inline-flex rounded-lg border border-[#E5E5E5] p-0.5 bg-[#FAFAF9]">
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-1.5 rounded-md text-xs font-semibold transition-colors flex items-center gap-1 ${
                    viewMode === 'table'
                      ? 'bg-white text-[#171717] shadow-xs'
                      : 'text-[#737373] hover:text-[#171717]'
                  }`}
                  title="Table Ledger View"
                >
                  <List size={14} />
                  <span className="hidden sm:inline">Table</span>
                </button>
                <button
                  onClick={() => setViewMode('kanban')}
                  className={`p-1.5 rounded-md text-xs font-semibold transition-colors flex items-center gap-1 ${
                    viewMode === 'kanban'
                      ? 'bg-white text-[#EA580C] shadow-xs'
                      : 'text-[#737373] hover:text-[#171717]'
                  }`}
                  title="Visual Pipeline Kanban Board"
                >
                  <LayoutGrid size={14} />
                  <span className="hidden sm:inline">Pipeline Board</span>
                </button>
              </div>
            </div>
          </div>

          {/* Search & Secondary Filter controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#737373]"
              />
              <input
                type="text"
                placeholder="Search by Booking ID (e.g. BKG-2026-001), Customer, Company, Resource, Location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-[#E5E5E5] focus:outline-none focus:border-[#EA580C] bg-white transition-colors"
              />
            </div>

            {/* Status Dropdown */}
            <div className="shrink-0">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full sm:w-auto h-9 text-xs rounded-lg border border-[#E5E5E5] bg-white px-3 text-[#171717] focus:outline-none focus:border-[#EA580C]"
              >
                <option value="ALL">All Statuses</option>
                <option value="NEW">New</option>
                <option value="UNDER REVIEW">Under Review</option>
                <option value="PROVIDER CONFIRMATION">Provider Confirmation</option>
                <option value="CUSTOMER CONFIRMATION">Customer Confirmation</option>
                <option value="PAYMENT">Payment</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="ACTIVE">Active</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="DECLINED">Declined</option>
              </select>
            </div>

            {/* Date Filters */}
            <div className="flex items-center gap-1.5 shrink-0">
              <input
                type="date"
                value={startDateFilter}
                onChange={(e) => setStartDateFilter(e.target.value)}
                title="Start date filter"
                className="h-9 text-xs rounded-lg border border-[#E5E5E5] bg-white px-2.5 text-[#171717] focus:outline-none focus:border-[#EA580C]"
              />
              <span className="text-xs text-[#737373]">to</span>
              <input
                type="date"
                value={endDateFilter}
                onChange={(e) => setEndDateFilter(e.target.value)}
                title="End date filter"
                className="h-9 text-xs rounded-lg border border-[#E5E5E5] bg-white px-2.5 text-[#171717] focus:outline-none focus:border-[#EA580C]"
              />
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
                Reset
              </Button>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. CONTENT: TABLE LEDGER VIEW OR KANBAN PIPELINE BOARD                    */}
        {/* ========================================================================= */}
        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#E5E5E5] shadow-xs p-10 flex flex-col items-center justify-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#EA580C] mb-4 shadow-xs">
              <FileText size={26} />
            </div>
            <h3 className="text-base font-bold text-[#171717] mb-1">
              No bookings match your active filters.
            </h3>
            <p className="text-xs text-[#737373] max-w-md mb-4 leading-relaxed">
              Try adjusting your search query, clearing the date range, or switching pipeline tabs.
            </p>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<RotateCcw size={13} />}
              onClick={resetFilters}
            >
              Reset All Active Filters
            </Button>
          </div>
        ) : viewMode === 'kanban' ? (
          /* ======================================================================= */
          /* 3A. VISUAL KANBAN PIPELINE BOARD                                        */
          /* ======================================================================= */
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {/* COLUMN 1: UNDER REVIEW & HOLD */}
            <div className="bg-[#FAFAF9] rounded-xl border border-[#E5E5E5] p-3 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#E5E5E5]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="text-xs font-bold text-[#171717] uppercase tracking-wider">
                    Under Review &amp; Hold
                  </span>
                </div>
                <span className="text-[10px] font-bold font-mono bg-white px-2 py-0.5 rounded border border-[#E5E5E5] text-[#171717]">
                  {sortedBookings.filter((b) => matchesTab(b, 'Under Review')).length}
                </span>
              </div>

              <div className="space-y-3">
                {sortedBookings
                  .filter((b) => matchesTab(b, 'Under Review'))
                  .map((b) => {
                    const price = getBookingAmount(b);
                    return (
                      <div
                        key={b.id}
                        className="bg-white rounded-lg p-3.5 border border-[#E5E5E5] shadow-2xs hover:shadow-sm transition-all space-y-2.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[11px] font-bold text-[#171717]">
                            {b.id}
                          </span>
                          <span className="text-[10px] font-bold font-mono text-emerald-700">
                            {formatCurrency(price)}
                          </span>
                        </div>

                        <div>
                          <h4 className="text-xs font-bold text-[#171717]">{b.companyName}</h4>
                          <p className="text-[11px] text-[#525252] truncate mt-0.5">
                            {b.resourceName}
                          </p>
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-[#737373] pt-1 border-t border-stone-100">
                          <span className="flex items-center gap-1">
                            <MapPin size={10} className="text-[#EA580C]" /> {b.location}
                          </span>
                          <span>{b.startDate}</span>
                        </div>

                        {/* Kanban Actions */}
                        <div className="flex items-center justify-between gap-1 pt-2 border-t border-stone-100">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-1.5 text-[10px] text-[#525252] hover:text-[#EA580C]"
                            onClick={() => handleOpenQuotation(b)}
                          >
                            <FileText size={11} className="mr-1" />
                            Quotation
                          </Button>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-6 px-2 text-[10px] border-emerald-300 text-emerald-800 hover:bg-emerald-50"
                              onClick={() => handleOpenConfirm(b)}
                            >
                              Confirm
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-1.5 text-[10px] text-[#737373]"
                              onClick={() => handleOpenDetail(b)}
                            >
                              <Eye size={11} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* COLUMN 2: CONFIRMED & PAID (READY TO PUSH) */}
            <div className="bg-[#FAFAF9] rounded-xl border border-[#E5E5E5] p-3 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#E5E5E5]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <span className="text-xs font-bold text-[#171717] uppercase tracking-wider">
                    Confirmed &amp; Paid
                  </span>
                </div>
                <span className="text-[10px] font-bold font-mono bg-white px-2 py-0.5 rounded border border-[#E5E5E5] text-[#171717]">
                  {sortedBookings.filter((b) => matchesTab(b, 'Confirmed')).length}
                </span>
              </div>

              <div className="space-y-3">
                {sortedBookings
                  .filter((b) => matchesTab(b, 'Confirmed'))
                  .map((b) => {
                    const price = getBookingAmount(b);
                    return (
                      <div
                        key={b.id}
                        className="bg-white rounded-lg p-3.5 border border-[#E5E5E5] shadow-2xs hover:shadow-sm transition-all space-y-2.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[11px] font-bold text-[#171717]">
                            {b.id}
                          </span>
                          {getPaymentBadge(b)}
                        </div>

                        <div>
                          <h4 className="text-xs font-bold text-[#171717]">{b.companyName}</h4>
                          <p className="text-[11px] text-[#525252] truncate mt-0.5">
                            {b.resourceName}
                          </p>
                          <div className="text-[11px] font-mono font-bold text-emerald-800 mt-1">
                            {formatCurrency(price)}
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-[#737373] pt-1 border-t border-stone-100">
                          <span className="flex items-center gap-1">
                            <Calendar size={10} /> {b.startDate} → {b.endDate}
                          </span>
                        </div>

                        {/* Kanban Actions: Push to Campaign & Invoices */}
                        <div className="flex items-center justify-between gap-1 pt-2 border-t border-stone-100">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-1.5 text-[10px] text-[#525252] hover:text-[#EA580C]"
                            onClick={() => handleOpenInvoice(b)}
                          >
                            <Receipt size={11} className="mr-1 text-emerald-600" />
                            Invoice
                          </Button>

                          {b.campaignId ? (
                            <Link
                              to="/panel/campaigns"
                              className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded flex items-center gap-1 hover:underline"
                            >
                              In Campaign →
                            </Link>
                          ) : (
                            <Button
                              variant="primary"
                              size="sm"
                              className="h-6 px-2 text-[10px] bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold"
                              onClick={() => handleOpenPushModal(b)}
                            >
                              <Truck size={10} className="mr-1" />
                              Push to Campaign
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* COLUMN 3: IN EXECUTION / LIVE */}
            <div className="bg-[#FAFAF9] rounded-xl border border-[#E5E5E5] p-3 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#E5E5E5]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-[#171717] uppercase tracking-wider">
                    In Flight (Live)
                  </span>
                </div>
                <span className="text-[10px] font-bold font-mono bg-white px-2 py-0.5 rounded border border-[#E5E5E5] text-[#171717]">
                  {sortedBookings.filter((b) => matchesTab(b, 'Active')).length}
                </span>
              </div>

              <div className="space-y-3">
                {sortedBookings
                  .filter((b) => matchesTab(b, 'Active'))
                  .map((b) => {
                    const price = getBookingAmount(b);
                    return (
                      <div
                        key={b.id}
                        className="bg-white rounded-lg p-3.5 border border-[#E5E5E5] shadow-2xs hover:shadow-sm transition-all space-y-2.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[11px] font-bold text-[#171717]">
                            {b.id}
                          </span>
                          <span className="text-[9px] font-bold uppercase bg-emerald-100/70 text-emerald-900 border border-emerald-300 px-1.5 py-0.2 rounded">
                            Live Display
                          </span>
                        </div>

                        <div>
                          <h4 className="text-xs font-bold text-[#171717]">{b.companyName}</h4>
                          <p className="text-[11px] text-[#525252] truncate mt-0.5">
                            {b.resourceName}
                          </p>
                          <div className="text-[11px] font-mono font-bold text-emerald-800 mt-1">
                            {formatCurrency(price)}
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-[#737373] pt-1 border-t border-stone-100">
                          <span>Ends: {b.endDate}</span>
                          <span className="text-emerald-700 font-semibold">POP Verified</span>
                        </div>

                        <div className="flex items-center justify-between gap-1 pt-2 border-t border-stone-100">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-1.5 text-[10px] text-[#525252] hover:text-[#EA580C]"
                            onClick={() => handleOpenInvoice(b)}
                          >
                            <Receipt size={11} className="mr-1" />
                            Tax Invoice
                          </Button>
                          <Link
                            to="/panel/campaigns"
                            className="text-[10px] font-bold text-[#EA580C] hover:underline flex items-center gap-0.5"
                          >
                            Inspect POP →
                          </Link>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* COLUMN 4: COMPLETED / SETTLED */}
            <div className="bg-[#FAFAF9] rounded-xl border border-[#E5E5E5] p-3 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#E5E5E5]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-stone-400" />
                  <span className="text-xs font-bold text-[#171717] uppercase tracking-wider">
                    Completed &amp; Settled
                  </span>
                </div>
                <span className="text-[10px] font-bold font-mono bg-white px-2 py-0.5 rounded border border-[#E5E5E5] text-[#171717]">
                  {sortedBookings.filter((b) => matchesTab(b, 'Completed')).length}
                </span>
              </div>

              <div className="space-y-3">
                {sortedBookings
                  .filter((b) => matchesTab(b, 'Completed'))
                  .map((b) => {
                    const price = getBookingAmount(b);
                    return (
                      <div
                        key={b.id}
                        className="bg-white rounded-lg p-3.5 border border-[#E5E5E5] shadow-2xs space-y-2.5 opacity-90"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[11px] font-bold text-[#171717]">
                            {b.id}
                          </span>
                          <span className="text-[9px] font-bold uppercase bg-stone-100 text-stone-600 border border-stone-200 px-1.5 py-0.2 rounded">
                            Concluded
                          </span>
                        </div>

                        <div>
                          <h4 className="text-xs font-bold text-[#171717]">{b.companyName}</h4>
                          <p className="text-[11px] text-[#525252] truncate mt-0.5">
                            {b.resourceName}
                          </p>
                          <div className="text-[11px] font-mono font-semibold text-stone-700 mt-1">
                            {formatCurrency(price)}
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-1 pt-2 border-t border-stone-100">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-1.5 text-[10px] text-[#525252]"
                            onClick={() => handleOpenInvoice(b)}
                          >
                            <Receipt size={11} className="mr-1" />
                            Tax Invoice
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-1.5 text-[10px] text-[#737373]"
                            onClick={() => handleOpenDetail(b)}
                          >
                            <Eye size={11} className="mr-1" /> View
                          </Button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        ) : (
          /* ======================================================================= */
          /* 3B. ENTERPRISE DATA TABLE VIEW (WITH SORTING & PAGINATION)              */
          /* ======================================================================= */
          <div className="bg-white rounded-xl border border-[#E5E5E5] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#FAFAF9] border-b border-[#E5E5E5] text-[10px] font-bold uppercase tracking-wider text-[#737373]">
                    <th
                      className="py-3 px-4 cursor-pointer hover:bg-stone-100 transition-colors"
                      onClick={() => handleSort('id')}
                    >
                      <div className="flex items-center gap-1">
                        <span>Booking ID</span>
                        <ArrowUpDown size={11} className={sortField === 'id' ? 'text-[#EA580C]' : ''} />
                      </div>
                    </th>
                    <th
                      className="py-3 px-4 cursor-pointer hover:bg-stone-100 transition-colors"
                      onClick={() => handleSort('customerName')}
                    >
                      <div className="flex items-center gap-1">
                        <span>Agency / Client</span>
                        <ArrowUpDown size={11} className={sortField === 'customerName' ? 'text-[#EA580C]' : ''} />
                      </div>
                    </th>
                    <th className="py-3 px-4">Media Resource</th>
                    <th className="py-3 px-4">Location</th>
                    <th
                      className="py-3 px-4 cursor-pointer hover:bg-stone-100 transition-colors"
                      onClick={() => handleSort('startDate')}
                    >
                      <div className="flex items-center gap-1">
                        <span>Flight Schedule</span>
                        <ArrowUpDown size={11} className={sortField === 'startDate' ? 'text-[#EA580C]' : ''} />
                      </div>
                    </th>
                    <th className="py-3 px-4">Channel</th>
                    <th
                      className="py-3 px-4 cursor-pointer hover:bg-stone-100 transition-colors text-right"
                      onClick={() => handleSort('pricing')}
                    >
                      <div className="flex items-center justify-end gap-1">
                        <span>Rate &amp; Payment</span>
                        <ArrowUpDown size={11} className={sortField === 'pricing' ? 'text-[#EA580C]' : ''} />
                      </div>
                    </th>
                    <th
                      className="py-3 px-4 cursor-pointer hover:bg-stone-100 transition-colors"
                      onClick={() => handleSort('status')}
                    >
                      <div className="flex items-center gap-1">
                        <span>Status</span>
                        <ArrowUpDown size={11} className={sortField === 'status' ? 'text-[#EA580C]' : ''} />
                      </div>
                    </th>
                    <th className="py-3 px-4 text-right">Operations &amp; Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E5E5]">
                  {paginatedBookings.map((b) => {
                    const sourceMeta = BOOKING_SOURCE_CONFIG[b.source];
                    const statusMeta = BOOKING_STATUS_CONFIG[b.status];
                    const price = getBookingAmount(b);
                    const canConfirm =
                      b.status === 'PROVIDER CONFIRMATION' || b.status === 'UNDER REVIEW';
                    const canDecline =
                      b.status === 'PROVIDER CONFIRMATION' ||
                      b.status === 'UNDER REVIEW' ||
                      b.status === 'NEW';
                    const isConfirmedOrActive =
                      b.status === 'CONFIRMED' || b.status === 'ACTIVE' || b.status === 'PAYMENT';

                    return (
                      <tr
                        key={b.id}
                        className="hover:bg-[#FAFAF9]/90 transition-colors cursor-pointer group"
                        onClick={() => handleOpenDetail(b)}
                      >
                        {/* 1. BOOKING ID */}
                        <td className="py-3.5 px-4 font-mono font-bold text-[#171717] whitespace-nowrap">
                          {b.id}
                        </td>

                        {/* 2. CUSTOMER & AGENCY */}
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-[#171717] group-hover:text-[#EA580C] transition-colors">
                            {b.companyName}
                          </div>
                          <div className="text-[11px] text-[#737373]">
                            Contact: {b.customerName}
                          </div>
                        </td>

                        {/* 3. MEDIA RESOURCE */}
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-[#171717] truncate max-w-[180px]" title={b.resourceName}>
                            {b.resourceName}
                          </div>
                          <span className="inline-block mt-0.5 px-1.5 py-0.2 rounded bg-stone-100 text-stone-700 font-semibold text-[9px] uppercase border border-stone-200">
                            {b.resourceType}
                          </span>
                        </td>

                        {/* 4. LOCATION */}
                        <td className="py-3.5 px-4 text-[#525252] whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            <MapPin size={11} className="text-[#EA580C] shrink-0" />
                            <span>{b.location}</span>
                          </div>
                        </td>

                        {/* 5. FLIGHT SCHEDULE */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="font-medium text-[#171717]">{b.startDate}</div>
                          <div className="text-[10px] text-[#737373]">to {b.endDate}</div>
                        </td>

                        {/* 6. CHANNEL SOURCE */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-extrabold uppercase border ${sourceMeta.badgeBg} ${sourceMeta.badgeText} ${sourceMeta.badgeBorder}`}
                          >
                            {sourceMeta.badge}
                          </span>
                        </td>

                        {/* 7. PRICING & PAYMENT STATUS */}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="font-mono font-black text-[#171717]">
                            {formatCurrency(price)}
                          </div>
                          <div className="mt-0.5">{getPaymentBadge(b)}</div>
                        </td>

                        {/* 8. STATUS */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${statusMeta.badgeBg} ${statusMeta.badgeText} ${statusMeta.badgeBorder}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${statusMeta.indicatorBg} mr-1.5`} />
                            {statusMeta.label}
                          </span>
                        </td>

                        {/* 9. ACTIONS: QUOTATION, INVOICE, PUSH TO CAMPAIGN, CONFIRM, VIEW */}
                        <td
                          className="py-3.5 px-4 text-right whitespace-nowrap"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center justify-end gap-1.5">
                            {/* QUOTATION / RO VIEWER BUTTON */}
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 px-2 text-[11px] border-stone-200 text-[#171717] hover:bg-stone-50 hover:border-orange-300 font-semibold"
                              onClick={() => handleOpenQuotation(b)}
                              title="View Quotation / Release Order (RO) Memo"
                            >
                              <FileText size={11} className="mr-1 text-[#EA580C]" />
                              Quotation
                            </Button>

                            {/* GST TAX INVOICE BUTTON (When Confirmed / In Run) */}
                            {isConfirmedOrActive && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 px-2 text-[11px] border-stone-200 text-[#171717] hover:bg-stone-50 hover:border-emerald-300 font-semibold"
                                onClick={() => handleOpenInvoice(b)}
                                title="View Official GST Tax Invoice"
                              >
                                <Receipt size={11} className="mr-1 text-emerald-600" />
                                Invoice
                              </Button>
                            )}

                            {/* PUSH TO CAMPAIGN ACTION BUTTON */}
                            {b.campaignId ? (
                              <Link
                                to="/panel/campaigns"
                                className="h-7 px-2 text-[11px] rounded bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 flex items-center font-bold transition-colors"
                                title="View in Campaigns Execution Schedule"
                              >
                                <Truck size={11} className="mr-1" />
                                In Campaign →
                              </Link>
                            ) : isConfirmedOrActive ? (
                              <Button
                                variant="primary"
                                size="sm"
                                className="h-7 px-2 text-[11px] bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold shadow-2xs"
                                onClick={() => handleOpenPushModal(b)}
                                title="Push booking to Campaign Execution (Scheduled as Planned)"
                              >
                                <Truck size={11} className="mr-1" />
                                Push to Campaign
                              </Button>
                            ) : null}

                            {/* CONFIRM ACTION (For Under Review / New) */}
                            {canConfirm && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 px-2 text-[11px] border-emerald-300 text-emerald-800 hover:bg-emerald-50 font-semibold"
                                onClick={() => handleOpenConfirm(b)}
                              >
                                Confirm
                              </Button>
                            )}

                            {/* DECLINE ACTION */}
                            {canDecline && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 px-1.5 text-[11px] border-rose-200 text-rose-700 hover:bg-rose-50"
                                onClick={() => handleOpenDecline(b)}
                                title="Decline Reservation"
                              >
                                Decline
                              </Button>
                            )}

                            {/* VIEW DETAILS DRAWER */}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 px-1.5 text-[11px] text-[#737373] hover:text-[#171717]"
                              onClick={() => handleOpenDetail(b)}
                              title="View Full Booking Details"
                            >
                              <Eye size={13} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="bg-[#FAFAF9] px-4 py-3 border-t border-[#E5E5E5] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#737373]">
              <div className="flex items-center gap-3">
                <span>
                  Showing{' '}
                  <strong className="text-[#171717]">
                    {sortedBookings.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}
                  </strong>{' '}
                  to{' '}
                  <strong className="text-[#171717]">
                    {Math.min(currentPage * pageSize, sortedBookings.length)}
                  </strong>{' '}
                  of <strong className="text-[#171717]">{sortedBookings.length}</strong> bookings
                </span>

                <div className="flex items-center gap-1.5 pl-3 border-l border-[#E5E5E5]">
                  <span>Rows:</span>
                  <select
                    value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                    className="h-7 text-xs rounded border border-[#E5E5E5] bg-white px-2 text-[#171717] focus:outline-none"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                  </select>
                </div>
              </div>

              {/* Prev / Next Pagination Controls */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 px-2 text-xs"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  leftIcon={<ChevronLeft size={13} />}
                >
                  Prev
                </Button>
                <span className="font-semibold text-[#171717] px-1">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 px-2 text-xs"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  rightIcon={<ChevronRight size={13} />}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 4. MODALS & SUBORDINATE DRAWERS                                           */}
      {/* ========================================================================= */}
      {/* Booking Detail Drawer */}
      <BookingDetailDrawer
        isOpen={isDetailDrawerOpen}
        onClose={() => {
          setIsDetailDrawerOpen(false);
          setSelectedBooking(null);
        }}
        booking={selectedBooking}
        onConfirm={(booking) => {
          setIsDetailDrawerOpen(false);
          handleOpenConfirm(booking);
        }}
        onDecline={(booking) => {
          setIsDetailDrawerOpen(false);
          handleOpenDecline(booking);
        }}
      />

      {/* Confirm Booking Modal */}
      <ConfirmBookingModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        booking={selectedBooking}
        onConfirm={handleConfirmAction}
      />

      {/* Decline Booking Modal */}
      <DeclineBookingModal
        isOpen={isDeclineModalOpen}
        onClose={() => setIsDeclineModalOpen(false)}
        booking={selectedBooking}
        onDecline={handleDeclineAction}
      />

      {/* Create Direct Booking Modal */}
      <CreateDirectBookingModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateDirectBooking}
      />

      {/* Official Quotation & Release Order Viewer Modal */}
      <QuotationViewerModal
        isOpen={isQuotationModalOpen}
        onClose={() => {
          setIsQuotationModalOpen(false);
          setSelectedQuotationBooking(null);
        }}
        booking={selectedQuotationBooking}
        onConfirmBooking={handleConfirmAction}
      />

      {/* Official GST Tax Invoice Viewer Modal */}
      <InvoiceViewerModal
        isOpen={isInvoiceModalOpen}
        onClose={() => {
          setIsInvoiceModalOpen(false);
          setSelectedInvoiceRecord(null);
        }}
        invoice={selectedInvoiceRecord}
      />

      {/* Push to Campaign Execution Modal */}
      <PushToCampaignModal
        isOpen={isPushModalOpen}
        onClose={() => {
          setIsPushModalOpen(false);
          setSelectedPushBooking(null);
        }}
        booking={selectedPushBooking}
        onConfirmPush={handleConfirmPushToCampaign}
      />
    </div>
  );
};

export default BookingsPage;
