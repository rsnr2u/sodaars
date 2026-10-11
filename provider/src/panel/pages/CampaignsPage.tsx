import React, { useState, useMemo, useEffect } from 'react';
import {
  Camera,
  Plus,
  Search,
  RotateCcw,
  MapPin,
  Eye,
  Edit,
  Clock,
  CheckCircle2,
  Image as ImageIcon,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Layers,
  Play,
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Button from '../../components/ui/Button';
import {
  CampaignRecord,
  CampaignExecutionStatus,
  CampaignExecutionTab,
  CAMPAIGN_EXECUTION_TABS,
  APPROVED_EXECUTION_STATUSES,
  EXECUTION_STATUS_CONFIG,
  PhotoProofRecord,
  CreativeAssetRecord,
} from '../types/campaign';
import { BOOKING_SOURCE_CONFIG } from '../types/booking';
import { getAllCampaigns, saveCampaignsToStorage } from '../data/sampleCampaigns';
import CampaignFormDrawer from '../components/campaigns/CampaignFormDrawer';
import BookedInventoryDetailDrawer from '../components/campaigns/BookedInventoryDetailDrawer';
import PhotoProofUploadModal from '../components/campaigns/PhotoProofUploadModal';
import UpdateCreativeModal from '../components/campaigns/UpdateCreativeModal';
import UpdateBookingToCampaignModal from '../components/campaigns/UpdateBookingToCampaignModal';

type SortField = 'campaignName' | 'customerName' | 'startDate' | 'endDate' | 'bookedAmount' | 'executionStatus';
type SortDirection = 'asc' | 'desc';

export const CampaignsPage: React.FC = () => {
  // Initialize campaigns from storage / sample data
  const [campaigns, setCampaigns] = useState<CampaignRecord[]>(() => getAllCampaigns());

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<CampaignExecutionTab>('All');
  const [selectedExecutionStatus, setSelectedExecutionStatus] = useState<string>('ALL');
  const [selectedSourceFilter, setSelectedSourceFilter] = useState<string>('ALL');
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');

  // Sorting state
  const [sortField, setSortField] = useState<SortField>('startDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Drawers and Modal state
  const [isUpdateBookingModalOpen, setIsUpdateBookingModalOpen] = useState(false);
  const [isUpdateCreativeModalOpen, setIsUpdateCreativeModalOpen] = useState(false);
  const [isFormDrawerOpen, setIsFormDrawerOpen] = useState(false);
  const [isInventoryDetailDrawerOpen, setIsInventoryDetailDrawerOpen] = useState(false);
  const [isProofModalOpen, setIsProofModalOpen] = useState(false);

  const [selectedCampaign, setSelectedCampaign] = useState<CampaignRecord | null>(null);
  const [editingCampaign, setEditingCampaign] = useState<CampaignRecord | null>(null);

  // Toast message
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3800);
  };

  // Persist campaigns whenever modified
  useEffect(() => {
    saveCampaignsToStorage(campaigns);
  }, [campaigns]);

  // Reset pagination to page 1 on search or filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeTab, selectedExecutionStatus, selectedSourceFilter, startDateFilter, endDateFilter, pageSize]);

  // Dynamic Live Summary Metrics
  const summaryMetrics = useMemo(() => {
    const total = campaigns.length;
    const running = campaigns.filter((c) => c.executionStatus === 'In Execution').length;
    const completed = campaigns.filter((c) => c.executionStatus === 'Completed').length;
    const proofSubmitted = campaigns.filter((c) => c.executionStatus === 'Proof Submitted').length;
    const planned = campaigns.filter((c) => c.executionStatus === 'Planned').length;

    return { total, running, completed, proofSubmitted, planned };
  }, [campaigns]);

  // Tab counts
  const tabCounts = useMemo(() => {
    return {
      All: campaigns.length,
      'In Execution': campaigns.filter((c) => c.executionStatus === 'In Execution').length,
      Completed: campaigns.filter((c) => c.executionStatus === 'Completed').length,
      'Proof Submitted': campaigns.filter((c) => c.executionStatus === 'Proof Submitted').length,
      Planned: campaigns.filter((c) => c.executionStatus === 'Planned').length,
    };
  }, [campaigns]);

  // Filter matcher for tabs
  const matchesTab = (campaign: CampaignRecord, tab: CampaignExecutionTab): boolean => {
    if (tab === 'All') return true;
    return campaign.executionStatus === tab;
  };

  // Filtered campaigns
  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((camp) => {
      // Primary Execution Tab check
      if (!matchesTab(camp, activeTab)) return false;

      // Secondary Execution Status filter
      if (selectedExecutionStatus !== 'ALL' && camp.executionStatus !== selectedExecutionStatus) {
        return false;
      }

      // Booking Source filter (Provider vs Admin vs Marketplace)
      if (selectedSourceFilter !== 'ALL' && camp.bookingSource !== selectedSourceFilter) {
        return false;
      }

      // Date Range filter
      if (startDateFilter && camp.startDate < startDateFilter) return false;
      if (endDateFilter && camp.endDate > endDateFilter) return false;

      // Search query
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesName = camp.campaignName.toLowerCase().includes(query);
        const matchesCustomer = camp.customerName.toLowerCase().includes(query);
        const matchesCompany = (camp.companyName || '').toLowerCase().includes(query);
        const matchesBooking = camp.bookingReference.toLowerCase().includes(query);
        const matchesResource = camp.resourceName.toLowerCase().includes(query);
        const matchesLocation = camp.location.toLowerCase().includes(query);
        const matchesLandmark = (camp.landmark || '').toLowerCase().includes(query);
        const matchesCreative = (camp.activeCreative?.title || '').toLowerCase().includes(query);
        return (
          matchesName ||
          matchesCustomer ||
          matchesCompany ||
          matchesBooking ||
          matchesResource ||
          matchesLocation ||
          matchesLandmark ||
          matchesCreative
        );
      }

      return true;
    });
  }, [
    campaigns,
    activeTab,
    selectedExecutionStatus,
    selectedSourceFilter,
    startDateFilter,
    endDateFilter,
    searchQuery,
  ]);

  // Sorted campaigns
  const sortedCampaigns = useMemo(() => {
    return [...filteredCampaigns].sort((a, b) => {
      let valA: string | number = '';
      let valB: string | number = '';

      switch (sortField) {
        case 'campaignName':
          valA = a.campaignName.toLowerCase();
          valB = b.campaignName.toLowerCase();
          break;
        case 'customerName':
          valA = a.customerName.toLowerCase();
          valB = b.customerName.toLowerCase();
          break;
        case 'startDate':
          valA = a.startDate;
          valB = b.startDate;
          break;
        case 'endDate':
          valA = a.endDate;
          valB = b.endDate;
          break;
        case 'bookedAmount':
          valA = Number(a.bookedAmount || 0);
          valB = Number(b.bookedAmount || 0);
          break;
        case 'executionStatus':
          valA = a.executionStatus;
          valB = b.executionStatus;
          break;
      }

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredCampaigns, sortField, sortDirection]);

  // Paginated campaigns
  const totalPages = Math.max(1, Math.ceil(sortedCampaigns.length / pageSize));
  const paginatedCampaigns = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedCampaigns.slice(startIndex, startIndex + pageSize);
  }, [sortedCampaigns, currentPage, pageSize]);

  // Sorting toggle
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Handlers for Modals & Drawers
  const handleOpenUpdateBookingModal = () => {
    setIsUpdateBookingModalOpen(true);
  };

  const handleOpenCreate = () => {
    setEditingCampaign(null);
    setIsFormDrawerOpen(true);
  };

  const handleOpenEdit = (campaign: CampaignRecord) => {
    setEditingCampaign(campaign);
    setIsFormDrawerOpen(true);
  };

  // Prominent VIEW button handler for Booked Inventory Details
  const handleOpenInventoryDetail = (campaign: CampaignRecord) => {
    setSelectedCampaign(campaign);
    setIsInventoryDetailDrawerOpen(true);
  };

  const handleOpenCreativeModal = (campaign: CampaignRecord) => {
    setSelectedCampaign(campaign);
    setIsUpdateCreativeModalOpen(true);
  };

  const handleOpenProofModal = (campaign: CampaignRecord) => {
    setSelectedCampaign(campaign);
    setIsProofModalOpen(true);
  };

  // Save new/promoted campaign from booking
  const handleSaveCampaignFromBooking = (savedRecord: CampaignRecord) => {
    setCampaigns((prev) => {
      const exists = prev.some((c) => c.id === savedRecord.id);
      if (exists) {
        return prev.map((c) => (c.id === savedRecord.id ? savedRecord : c));
      }
      return [savedRecord, ...prev];
    });

    showToast(`Booking ${savedRecord.bookingReference} successfully updated to live Campaign: ${savedRecord.campaignName}`);
  };

  // Save generic campaign edit/create
  const handleSaveCampaign = (savedRecord: CampaignRecord) => {
    setCampaigns((prev) => {
      const exists = prev.some((c) => c.id === savedRecord.id);
      if (exists) {
        return prev.map((c) => (c.id === savedRecord.id ? savedRecord : c));
      }
      return [savedRecord, ...prev];
    });

    if (selectedCampaign && selectedCampaign.id === savedRecord.id) {
      setSelectedCampaign(savedRecord);
    }

    showToast(`Campaign ${savedRecord.campaignName} saved successfully.`);
  };

  // Save creative updates (Changing images / artwork)
  const handleSaveCreative = (campaignId: string, updatedCreative: CreativeAssetRecord) => {
    setCampaigns((prev) =>
      prev.map((c) => {
        if (c.id === campaignId) {
          const existingList = c.creatives || [];
          return {
            ...c,
            activeCreative: updatedCreative,
            creatives: [updatedCreative, ...existingList],
          };
        }
        return c;
      })
    );

    if (selectedCampaign && selectedCampaign.id === campaignId) {
      setSelectedCampaign((prev) =>
        prev
          ? {
              ...prev,
              activeCreative: updatedCreative,
              creatives: [updatedCreative, ...(prev.creatives || [])],
            }
          : null
      );
    }

    showToast(`Creative artwork updated for campaign ${campaignId} (Version ${updatedCreative.version})`);
  };

  // Handle status quick change
  const handleStatusChange = (campaignId: string, newStatus: CampaignExecutionStatus) => {
    setCampaigns((prev) =>
      prev.map((c) => (c.id === campaignId ? { ...c, executionStatus: newStatus } : c))
    );

    if (selectedCampaign && selectedCampaign.id === campaignId) {
      setSelectedCampaign((prev) => (prev ? { ...prev, executionStatus: newStatus } : null));
    }

    if (newStatus === 'In Execution') {
      showToast(`Campaign ${campaignId} is now LIVE & In Execution! You can now record Day and Night POP photo proof.`);
    } else {
      showToast(`Campaign status updated to "${newStatus}".`);
    }
  };

  // Photo proof upload
  const handleUploadProof = (campaignId: string, proof: PhotoProofRecord) => {
    setCampaigns((prev) =>
      prev.map((c) => {
        if (c.id === campaignId) {
          const updatedProofs = [proof, ...(c.photoProof || [])];
          return {
            ...c,
            photoProof: updatedProofs,
            executionStatus: 'Proof Submitted',
          };
        }
        return c;
      })
    );

    if (selectedCampaign && selectedCampaign.id === campaignId) {
      setSelectedCampaign((prev) =>
        prev
          ? {
              ...prev,
              photoProof: [proof, ...(prev.photoProof || [])],
              executionStatus: 'Proof Submitted',
            }
          : null
      );
    }

    showToast(`Photo proof recorded for ${campaignId}.`);
  };

  const hasActiveFilters =
    searchQuery !== '' ||
    activeTab !== 'All' ||
    selectedExecutionStatus !== 'ALL' ||
    selectedSourceFilter !== 'ALL' ||
    startDateFilter !== '' ||
    endDateFilter !== '';

  const resetFilters = () => {
    setSearchQuery('');
    setActiveTab('All');
    setSelectedExecutionStatus('ALL');
    setSelectedSourceFilter('ALL');
    setStartDateFilter('');
    setEndDateFilter('');
  };

  return (
    <div className="flex-1 flex flex-col w-full pb-10">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-3.5 rounded-lg bg-[#171717] text-white text-xs font-semibold shadow-2xl flex items-center gap-2.5 border border-stone-800 transition-all animate-in fade-in slide-in-from-bottom-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#EA580C] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header with Action to Update Booking to Campaign */}
      <PageHeader
        eyebrow="CAMPAIGN MANAGEMENT & CREATIVES"
        title="Campaigns & Media Flights"
        description="Convert customer bookings (done by provider or by admin) to campaigns. Update creative artwork images, monitor running and completed flights, and view booked outdoor inventory details."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Plus size={14} />}
              onClick={handleOpenCreate}
              className="text-xs border-[#E5E5E5] text-[#171717] hover:bg-stone-50"
            >
              Create Campaign
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Sparkles size={14} className="text-white" />}
              onClick={handleOpenUpdateBookingModal}
              className="text-xs bg-[#EA580C] hover:bg-[#C2410C] text-white font-semibold shadow-xs"
            >
              + Update Booking to Campaign
            </Button>
          </div>
        }
      />

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* ========================================================================= */}
        {/* 1. DYNAMIC SUMMARY METRICS STRIP                                          */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {/* TOTAL CAMPAIGNS */}
          <div
            onClick={() => setActiveTab('All')}
            className={`bg-white rounded-xl p-4 border transition-all cursor-pointer shadow-xs flex flex-col justify-between hover:border-[#EA580C] ${
              activeTab === 'All' ? 'ring-2 ring-[#EA580C]/20 border-[#EA580C]' : 'border-[#E5E5E5]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373]">
                Total Campaigns
              </span>
              <Layers size={14} className="text-[#EA580C]" />
            </div>
            <div className="my-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-[#171717] leading-none">
                {summaryMetrics.total}
              </span>
            </div>
            <span className="text-[11px] text-[#737373]">
              All registered media flights
            </span>
          </div>

          {/* RUNNING CAMPAIGNS (IN EXECUTION) */}
          <div
            onClick={() => setActiveTab('In Execution')}
            className={`bg-white rounded-xl p-4 border transition-all cursor-pointer shadow-xs flex flex-col justify-between hover:border-emerald-500 ${
              activeTab === 'In Execution' ? 'ring-2 ring-emerald-500/20 border-emerald-500 bg-emerald-50/20' : 'border-[#E5E5E5]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                Running Campaigns
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div className="my-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-emerald-800 leading-none">
                {summaryMetrics.running}
              </span>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-1.5 py-0.2 rounded">
                Live
              </span>
            </div>
            <span className="text-[11px] text-emerald-700/80">
              Active on outdoor display
            </span>
          </div>

          {/* COMPLETED CAMPAIGNS */}
          <div
            onClick={() => setActiveTab('Completed')}
            className={`bg-white rounded-xl p-4 border transition-all cursor-pointer shadow-xs flex flex-col justify-between hover:border-stone-500 ${
              activeTab === 'Completed' ? 'ring-2 ring-stone-500/20 border-stone-500 bg-stone-50/50' : 'border-[#E5E5E5]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373]">
                Completed
              </span>
              <CheckCircle2 size={14} className="text-stone-600" />
            </div>
            <div className="my-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-stone-700 leading-none">
                {summaryMetrics.completed}
              </span>
            </div>
            <span className="text-[11px] text-[#737373]">
              Concluded flight durations
            </span>
          </div>

          {/* PROOF SUBMITTED */}
          <div
            onClick={() => setActiveTab('Proof Submitted')}
            className={`bg-white rounded-xl p-4 border transition-all cursor-pointer shadow-xs flex flex-col justify-between hover:border-orange-500 ${
              activeTab === 'Proof Submitted' ? 'ring-2 ring-orange-500/20 border-orange-500 bg-orange-50/20' : 'border-[#E5E5E5]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#EA580C]">
                Proof Submitted
              </span>
              <Camera size={14} className="text-[#EA580C]" />
            </div>
            <div className="my-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-[#EA580C] leading-none">
                {summaryMetrics.proofSubmitted}
              </span>
            </div>
            <span className="text-[11px] text-[#737373]">
              Photo proof submitted for client
            </span>
          </div>

          {/* PLANNED CAMPAIGNS */}
          <div
            onClick={() => setActiveTab('Planned')}
            className={`bg-white rounded-xl p-4 border transition-all cursor-pointer shadow-xs flex flex-col justify-between col-span-2 sm:col-span-1 hover:border-amber-500 ${
              activeTab === 'Planned' ? 'ring-2 ring-amber-500/20 border-amber-500 bg-amber-50/20' : 'border-[#E5E5E5]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373]">
                Planned
              </span>
              <Clock size={14} className="text-amber-600" />
            </div>
            <div className="my-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-[#171717] leading-none">
                {summaryMetrics.planned}
              </span>
            </div>
            <span className="text-[11px] text-[#737373]">
              Upcoming scheduled mounting
            </span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. PIPELINE TABS & LIVE FILTER BAR                                        */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-xl border border-[#E5E5E5] shadow-xs p-4 space-y-4">
          {/* Top row: Execution Status Tabs with counts */}
          <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-2 flex-wrap gap-2">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
              {CAMPAIGN_EXECUTION_TABS.map((tab) => {
                const isActive = activeTab === tab;
                const count = tabCounts[tab];
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                      isActive
                        ? 'bg-[#171717] text-white shadow-xs'
                        : 'text-[#525252] hover:text-[#171717] hover:bg-[#F5F5F4]'
                    }`}
                  >
                    <span>{tab === 'In Execution' ? 'Running Campaigns' : tab === 'Completed' ? 'Completed Campaigns' : tab}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-stone-100 text-stone-600'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="text-[11px] text-[#737373] hidden sm:block">
              Found <strong>{filteredCampaigns.length}</strong> matching campaigns
            </div>
          </div>

          {/* Search & Multiple Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
            {/* Search Input */}
            <div className="lg:col-span-5 relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#737373]"
              />
              <input
                type="text"
                placeholder="Search campaigns, customers, booking ref, inventory, creative artwork..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-[#E5E5E5] focus:outline-none focus:border-[#EA580C] bg-white transition-colors placeholder:text-stone-400"
              />
            </div>

            {/* Booking Origin Filter */}
            <div className="lg:col-span-2">
              <select
                value={selectedSourceFilter}
                onChange={(e) => setSelectedSourceFilter(e.target.value)}
                aria-label="Filter by Booking Origin"
                className="w-full h-9 text-xs rounded-lg border border-[#E5E5E5] bg-white px-2.5 text-[#171717] focus:outline-none focus:border-[#EA580C]"
              >
                <option value="ALL">All Booking Origins</option>
                <option value="Provider">Provider Bookings</option>
                <option value="Admin">Admin Bookings</option>
                <option value="Marketplace">Marketplace Bookings</option>
              </select>
            </div>

            {/* Execution Status Dropdown */}
            <div className="lg:col-span-2">
              <select
                value={selectedExecutionStatus}
                onChange={(e) => setSelectedExecutionStatus(e.target.value)}
                aria-label="Filter by Execution Status"
                className="w-full h-9 text-xs rounded-lg border border-[#E5E5E5] bg-white px-2.5 text-[#171717] focus:outline-none focus:border-[#EA580C]"
              >
                <option value="ALL">All Execution Stages</option>
                {APPROVED_EXECUTION_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Filters & Reset */}
            <div className="lg:col-span-3 flex items-center gap-1.5">
              <input
                type="date"
                value={startDateFilter}
                onChange={(e) => setStartDateFilter(e.target.value)}
                title="Start date filter"
                className="h-9 w-full text-xs rounded-lg border border-[#E5E5E5] bg-white px-2 text-[#171717] focus:outline-none focus:border-[#EA580C]"
              />
              <span className="text-xs text-[#737373] shrink-0">to</span>
              <input
                type="date"
                value={endDateFilter}
                onChange={(e) => setEndDateFilter(e.target.value)}
                title="End date filter"
                className="h-9 w-full text-xs rounded-lg border border-[#E5E5E5] bg-white px-2 text-[#171717] focus:outline-none focus:border-[#EA580C]"
              />

              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetFilters}
                  title="Reset all filters"
                  className="h-9 px-2 text-xs text-[#737373] hover:text-[#171717] shrink-0"
                >
                  <RotateCcw size={13} />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. CAMPAIGN DATA TABLE WITH VIEW INVENTORY DETAILS ACTION                  */}
        {/* ========================================================================= */}
        {paginatedCampaigns.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#E5E5E5] shadow-xs p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center text-[#EA580C] mb-4 shadow-xs">
              <Camera size={30} />
            </div>

            {campaigns.length === 0 ? (
              <>
                <h3 className="text-base font-bold text-[#171717] mb-1">
                  No campaigns registered yet.
                </h3>
                <p className="text-xs text-[#737373] max-w-md mb-6 leading-relaxed">
                  Start by converting a customer booking (created by provider or admin) into an active campaign with creative artwork.
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    leftIcon={<Sparkles size={14} />}
                    onClick={handleOpenUpdateBookingModal}
                  >
                    Update Booking to Campaign
                  </Button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-base font-bold text-[#171717] mb-1">
                  No campaigns match your active search or filters.
                </h3>
                <p className="text-xs text-[#737373] max-w-md mb-4 leading-relaxed">
                  Try clearing your search query, status tab, booking origin filter, or date range.
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
          <div className="space-y-4">
            {activeTab === 'Planned' && (
              <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-950 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 border border-amber-200">
                    <Clock size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-amber-950 text-xs sm:text-sm">Planned &amp; Upcoming Campaign Flights</h4>
                    <p className="text-[11px] text-amber-800 mt-0.5">
                      Campaigns mobilized from confirmed bookings awaiting flex delivery and physical installation. Click &quot;Mark Live&quot; when the rigger squad mounts the display.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-amber-800 bg-amber-100 px-2.5 py-1 rounded border border-amber-300">
                    Rigger Prep Stage
                  </span>
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl border border-[#E5E5E5] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#FAFAF9] border-b border-[#E5E5E5] text-[10px] font-bold uppercase tracking-wider text-[#737373]">
                    <th className="py-3 px-4">Creative & Campaign</th>
                    <th
                      className="py-3 px-4 cursor-pointer hover:text-[#171717]"
                      onClick={() => handleSort('customerName')}
                    >
                      <div className="flex items-center gap-1">
                        <span>Customer & Company</span>
                        <ArrowUpDown size={11} />
                      </div>
                    </th>
                    <th className="py-3 px-4">Booking Ref & Origin</th>
                    <th className="py-3 px-4">Booked Inventory</th>
                    <th className="py-3 px-4">Location & Specs</th>
                    <th
                      className="py-3 px-4 cursor-pointer hover:text-[#171717]"
                      onClick={() => handleSort('startDate')}
                    >
                      <div className="flex items-center gap-1">
                        <span>Flight Schedule</span>
                        <ArrowUpDown size={11} />
                      </div>
                    </th>
                    <th
                      className="py-3 px-4 cursor-pointer hover:text-[#171717]"
                      onClick={() => handleSort('bookedAmount')}
                    >
                      <div className="flex items-center gap-1">
                        <span>Amount</span>
                        <ArrowUpDown size={11} />
                      </div>
                    </th>
                    <th className="py-3 px-4">Execution Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E5E5]">
                  {paginatedCampaigns.map((camp) => {
                    const executionMeta = EXECUTION_STATUS_CONFIG[camp.executionStatus];
                    const sourceConfig = camp.bookingSource ? BOOKING_SOURCE_CONFIG[camp.bookingSource] : null;
                    const creative = camp.activeCreative;

                    return (
                      <tr
                        key={camp.id}
                        className="hover:bg-[#FAFAF9]/90 transition-colors group"
                      >
                        {/* 1. CREATIVE & CAMPAIGN (WITH IMAGE THUMBNAIL) */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            {/* Creative Artwork thumbnail */}
                            <div
                              onClick={() => handleOpenCreativeModal(camp)}
                              title="Click to change/update creative"
                              className="w-12 h-12 rounded-lg border border-stone-200 overflow-hidden bg-stone-100 shrink-0 relative group/img cursor-pointer shadow-2xs"
                            >
                              {creative?.imageUrl ? (
                                <>
                                  <img
                                    src={creative.imageUrl}
                                    alt={creative.title}
                                    className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-200"
                                  />
                                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-white">
                                    <ImageIcon size={14} />
                                  </div>
                                </>
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-stone-400">
                                  <ImageIcon size={18} />
                                </div>
                              )}
                            </div>

                            <div className="min-w-0">
                              <div
                                onClick={() => handleOpenInventoryDetail(camp)}
                                className="font-bold text-[#171717] hover:text-[#EA580C] cursor-pointer transition-colors truncate max-w-[200px]"
                                title={camp.campaignName}
                              >
                                {camp.campaignName}
                              </div>
                              <div className="flex items-center gap-1 text-[10px] text-[#737373] mt-0.5 font-mono">
                                <span>{camp.id}</span>
                                {creative?.version && (
                                  <span className="bg-stone-100 text-stone-600 px-1 rounded text-[9px] font-sans font-semibold">
                                    v{creative.version}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* 2. CUSTOMER & COMPANY */}
                        <td className="py-3 px-4">
                          <div className="font-semibold text-[#171717]">{camp.customerName}</div>
                          <div className="text-[11px] text-[#737373] truncate max-w-[140px]">
                            {camp.companyName || 'Corporate Client'}
                          </div>
                        </td>

                        {/* 3. BOOKING REF & ORIGIN */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="font-mono font-bold text-[#171717] text-[11px]">
                            {camp.bookingReference}
                          </div>
                          {sourceConfig ? (
                            <span
                              className={`inline-flex items-center px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider border mt-0.5 ${sourceConfig.badgeBg} ${sourceConfig.badgeText} ${sourceConfig.badgeBorder}`}
                            >
                              {sourceConfig.label}
                            </span>
                          ) : (
                            <span className="text-[10px] text-stone-500">Provider</span>
                          )}
                        </td>

                        {/* 4. BOOKED INVENTORY */}
                        <td className="py-3 px-4">
                          <div className="font-bold text-[#171717] truncate max-w-[170px]" title={camp.resourceName}>
                            {camp.resourceName}
                          </div>
                          {camp.resourceType && (
                            <span className="inline-block mt-0.5 px-1.5 py-0.2 rounded bg-stone-100 text-stone-700 font-semibold text-[9px] uppercase border border-stone-200">
                              {camp.resourceType}
                            </span>
                          )}
                        </td>

                        {/* 5. LOCATION & SPECS */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1 text-[#171717] font-medium truncate max-w-[150px]">
                            <MapPin size={11} className="text-[#EA580C] shrink-0" />
                            <span>{camp.location}</span>
                          </div>
                          <div className="text-[10px] text-[#737373] mt-0.5 truncate max-w-[150px]">
                            {camp.dimensions || '40ft × 20ft'}
                          </div>
                        </td>

                        {/* 6. FLIGHT SCHEDULE */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="font-medium text-[#171717]">{camp.startDate}</div>
                          <div className="text-[10px] text-[#737373]">to {camp.endDate}</div>
                        </td>

                        {/* 7. AMOUNT */}
                        <td className="py-3 px-4 whitespace-nowrap font-bold text-[#171717]">
                          ₹{Number(camp.bookedAmount || 150000).toLocaleString('en-IN')}
                        </td>

                        {/* 8. EXECUTION STATUS */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${executionMeta.badgeBg} ${executionMeta.badgeText} ${executionMeta.badgeBorder}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${executionMeta.indicatorBg} mr-1.5 ${camp.executionStatus === 'In Execution' ? 'animate-pulse' : ''}`} />
                            {camp.executionStatus === 'In Execution' ? 'Running' : executionMeta.label}
                          </span>
                          {camp.executionStatus === 'Planned' && (
                            <div className="text-[10px] text-amber-700 font-medium mt-0.5 flex items-center gap-1">
                              <span className="font-semibold text-amber-800">Upcoming</span>
                              <span>• Starts {camp.startDate}</span>
                            </div>
                          )}
                        </td>

                        {/* 9. ACTION BUTTONS: VIEW BOOKED INVENTORY, CREATIVES, PROOF, EDIT */}
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1">
                            {/* MARK LIVE BUTTON FOR PLANNED CAMPAIGNS */}
                            {camp.executionStatus === 'Planned' && (
                              <Button
                                variant="primary"
                                size="sm"
                                className="h-7 px-2.5 text-[11px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-2xs"
                                onClick={() => handleStatusChange(camp.id, 'In Execution')}
                                title="Start Execution - Mark Live & Begin Mounting"
                              >
                                <Play size={11} className="mr-1 fill-white" />
                                Mark Live
                              </Button>
                            )}

                            {/* PROMINENT VIEW BUTTON FOR BOOKED INVENTORY DETAILS */}
                            <Button
                              variant="primary"
                              size="sm"
                              className="h-7 px-2.5 text-[11px] bg-[#171717] hover:bg-stone-800 text-white font-bold shadow-2xs"
                              onClick={() => handleOpenInventoryDetail(camp)}
                              title="View Booked Inventory Details & Specifications"
                            >
                              <Eye size={12} className="mr-1 text-orange-400" />
                              VIEW
                            </Button>

                            {/* CREATIVES BUTTON: UPDATE IMAGES & ARTWORK */}
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 px-2 text-[11px] border-stone-200 text-[#171717] hover:bg-stone-50 hover:border-orange-300 font-semibold"
                              onClick={() => handleOpenCreativeModal(camp)}
                              title="Update Artwork Image / Creatives"
                            >
                              <ImageIcon size={12} className="mr-1 text-[#EA580C]" />
                              Creatives
                            </Button>

                            {/* PHOTO PROOF BUTTON */}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2 text-[11px] text-stone-600 hover:text-[#EA580C] hover:bg-orange-50"
                              onClick={() => handleOpenProofModal(camp)}
                              title="Record POP Photo Proof"
                            >
                              <Camera size={12} className="mr-1" />
                              Proof
                            </Button>

                            {/* EDIT BUTTON */}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 text-stone-500 hover:text-[#171717]"
                              onClick={() => handleOpenEdit(camp)}
                              title="Edit Campaign Details"
                            >
                              <Edit size={12} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* ========================================================================= */}
            {/* 4. PAGINATION FOOTER BAR                                                  */}
            {/* ========================================================================= */}
            <div className="bg-[#FAFAF9] px-4 py-3 border-t border-[#E5E5E5] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#737373]">
              <div className="flex items-center gap-3">
                <span>
                  Showing{' '}
                  <strong className="text-[#171717]">
                    {sortedCampaigns.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}
                  </strong>{' '}
                  to{' '}
                  <strong className="text-[#171717]">
                    {Math.min(currentPage * pageSize, sortedCampaigns.length)}
                  </strong>{' '}
                  of <strong className="text-[#171717]">{sortedCampaigns.length}</strong> campaigns
                </span>

                {/* Page Size Selector */}
                <div className="flex items-center gap-1.5 pl-3 border-l border-[#E5E5E5]">
                  <span>Rows:</span>
                  <select
                    value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                    aria-label="Rows per page"
                    className="h-7 text-xs rounded border border-[#E5E5E5] bg-white px-1.5 text-[#171717] focus:outline-none focus:border-[#EA580C]"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                </div>
              </div>

              {/* Numbered Page Navigation */}
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="h-7 px-2 text-xs text-stone-600 disabled:opacity-40"
                  aria-label="Previous Page"
                >
                  <ChevronLeft size={13} className="mr-0.5" />
                  Prev
                </Button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => {
                  const isCurrent = pg === currentPage;
                  return (
                    <button
                      key={pg}
                      onClick={() => setCurrentPage(pg)}
                      className={`h-7 w-7 rounded text-xs font-semibold transition-colors ${
                        isCurrent
                          ? 'bg-[#171717] text-white'
                          : 'text-[#525252] hover:bg-stone-200'
                      }`}
                    >
                      {pg}
                    </button>
                  );
                })}

                <Button
                  variant="ghost"
                  size="sm"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="h-7 px-2 text-xs text-stone-600 disabled:opacity-40"
                  aria-label="Next Page"
                >
                  Next
                  <ChevronRight size={13} className="ml-0.5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>

      {/* ========================================================================= */}
      {/* 5. DRAWERS & MODALS                                                       */}
      {/* ========================================================================= */}
      {/* Modal 1: Update Booking to Campaign */}
      <UpdateBookingToCampaignModal
        isOpen={isUpdateBookingModalOpen}
        onClose={() => setIsUpdateBookingModalOpen(false)}
        onSaveCampaign={handleSaveCampaignFromBooking}
      />

      {/* Modal 2: Update / Change Creative Artwork Images */}
      <UpdateCreativeModal
        isOpen={isUpdateCreativeModalOpen}
        onClose={() => {
          setIsUpdateCreativeModalOpen(false);
        }}
        campaign={selectedCampaign}
        onSaveCreative={handleSaveCreative}
      />

      {/* Drawer 1: Booked Inventory Details Drawer (Opened by VIEW button) */}
      <BookedInventoryDetailDrawer
        isOpen={isInventoryDetailDrawerOpen}
        onClose={() => {
          setIsInventoryDetailDrawerOpen(false);
          setSelectedCampaign(null);
        }}
        campaign={selectedCampaign}
        onOpenUpdateCreative={(camp) => {
          setIsInventoryDetailDrawerOpen(false);
          handleOpenCreativeModal(camp);
        }}
        onOpenProofModal={(camp) => {
          setIsInventoryDetailDrawerOpen(false);
          handleOpenProofModal(camp);
        }}
        onStatusChange={handleStatusChange}
      />

      {/* Drawer 2: Campaign Form Drawer (Create / Edit) */}
      <CampaignFormDrawer
        isOpen={isFormDrawerOpen}
        onClose={() => {
          setIsFormDrawerOpen(false);
          setEditingCampaign(null);
        }}
        campaign={editingCampaign}
        onSave={handleSaveCampaign}
      />

      {/* Modal 3: Photo Proof Upload Modal */}
      <PhotoProofUploadModal
        isOpen={isProofModalOpen}
        onClose={() => {
          setIsProofModalOpen(false);
        }}
        campaign={selectedCampaign}
        onUploadProof={handleUploadProof}
      />
    </div>
  );
};

export default CampaignsPage;
