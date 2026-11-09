import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  ShieldCheck, 
  Layers, 
  Receipt, 
  Activity, 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  XCircle, 
  Phone, 
  Mail, 
  MapPin, 
  ExternalLink, 
  Download, 
  Printer, 
  FileText, 
  Search, 
  Filter, 
  CreditCard, 
  Calendar, 
  Check, 
  X, 
  Eye, 
  ChevronRight,
  Sparkles,
  Lock,
  Unlock,
  AlertCircle,
  ShoppingBag,
  Radio,
  Camera,
  CheckCheck,
  TrendingUp,
  SlidersHorizontal,
  RotateCcw,
  Tag,
  ArrowUpRight
} from 'lucide-react';
import { 
  mockProviders, 
  mockResources, 
  mockPackageInvoices, 
  mockSubscribers, 
  mockAuditLogs,
  mockProviderKycDocs,
  mockProviderBookings,
  mockHoardingCampaigns
} from '../../data/mockAdminData';
import { 
  ProviderItem, 
  ResourceItem, 
  PackagePaymentInvoice, 
  SubscriberRecord, 
  ProviderKycDocument,
  ProviderBookingRecord,
  HoardingCampaignItem
} from '../../types';

export const ProviderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Find provider
  const [provider, setProvider] = useState<ProviderItem | null>(() => {
    return mockProviders.find((p) => p.id === id) || mockProviders[0];
  });

  // Vertical Navigation State: 6 core modules requested by user + audit
  const [activeSection, setActiveSection] = useState<
    'profile' | 'documents' | 'inventory' | 'payments' | 'bookings' | 'campaigns' | 'audit'
  >('profile');

  // Related KYC documents data
  const [kycDocs, setKycDocs] = useState<ProviderKycDocument[]>(() => {
    if (provider && mockProviderKycDocs[provider.id]) {
      return mockProviderKycDocs[provider.id];
    }
    return [
      {
        id: 'DOC-GEN-01',
        name: 'GST Registration Certificate (REG-06)',
        docType: 'gst',
        documentNumber: provider?.gstin || '27AABCA1234F1Z5',
        fileName: `${provider?.id?.toLowerCase() || 'prv'}_gst_certificate.pdf`,
        fileSize: '1.2 MB',
        uploadedAt: provider?.joinedDate || '2025-04-12',
        status: provider?.kycStatus === 'verified' ? 'verified' : 'under_review',
      },
      {
        id: 'DOC-GEN-02',
        name: 'Permanent Account Number (PAN) Card',
        docType: 'pan',
        documentNumber: provider?.pan || 'AABCA1234F',
        fileName: `${provider?.id?.toLowerCase() || 'prv'}_pan_card.pdf`,
        fileSize: '750 KB',
        uploadedAt: provider?.joinedDate || '2025-04-12',
        status: 'verified',
      },
      {
        id: 'DOC-GEN-03',
        name: 'Municipal Hoarding & Advertising License',
        docType: 'trade_license',
        documentNumber: 'MUN/LIC/2026/091',
        fileName: `${provider?.id?.toLowerCase() || 'prv'}_trade_license.pdf`,
        fileSize: '2.8 MB',
        uploadedAt: provider?.joinedDate || '2025-04-12',
        status: provider?.kycStatus === 'verified' ? 'verified' : 'under_review',
      },
      {
        id: 'DOC-GEN-04',
        name: 'Bank Cancelled Cheque / Mandate',
        docType: 'bank_cheque',
        documentNumber: 'Settlement Account Verified',
        fileName: `${provider?.id?.toLowerCase() || 'prv'}_cancelled_cheque.pdf`,
        fileSize: '890 KB',
        uploadedAt: provider?.joinedDate || '2025-04-12',
        status: provider?.kycStatus === 'verified' ? 'verified' : 'missing',
      },
    ];
  });

  // Resources / Inventory State
  const [resources, setResources] = useState<ResourceItem[]>(() => {
    return mockResources.filter((r) => r.providerId === (provider?.id || 'PRV-1001'));
  });

  // SaaS Package Payments Invoices
  const [invoices, setInvoices] = useState<PackagePaymentInvoice[]>(() => {
    return mockPackageInvoices.filter((inv) => inv.providerId === (provider?.id || 'PRV-1001'));
  });

  // Bookings (Marketplace vs Provider Direct) State
  const [bookings, setBookings] = useState<ProviderBookingRecord[]>(() => {
    const provId = provider?.id || 'PRV-1001';
    const matches = mockProviderBookings.filter((b) => b.providerId === provId);
    if (matches.length > 0) return matches;
    // Contextual fallback for demo
    return [
      {
        id: `BKG-${provId}-01`,
        providerId: provId,
        resourceId: 'res-gen-01',
        resourceName: `${provider?.city || 'Metro'} Prime Arterial Media Display`,
        resourceType: 'Billboard',
        location: `${provider?.city || 'City'} • Central Commercial Corridor`,
        customerName: 'Aditya Birla Group',
        companyName: 'UltraTech Cement Brand Push',
        contactPhone: '+91 98200 44556',
        contactEmail: 'media@ultratech.com',
        source: 'Marketplace',
        startDate: '2026-10-01',
        endDate: '2026-10-31',
        contractValue: 195000,
        sodaarsNetPayout: 165000,
        markupAmount: 30000,
        paymentStatus: 'Paid in Full',
        status: 'Active',
        createdAt: '2026-09-20',
      },
      {
        id: `BKG-${provId}-02`,
        providerId: provId,
        resourceId: 'res-gen-02',
        resourceName: `${provider?.city || 'Metro'} Ring Road Unipole`,
        resourceType: 'Unipole',
        location: `${provider?.city || 'City'} • Airport Expressway`,
        customerName: 'Sanjay Deshmukh',
        companyName: 'Hyundai Creta EV Festive Booking',
        contactPhone: '+91 98111 22334',
        contactEmail: 'sanjay@hyundai-dealer.in',
        source: 'Provider Direct',
        startDate: '2026-11-01',
        endDate: '2026-11-30',
        contractValue: 220000,
        sodaarsNetPayout: 220000,
        paymentStatus: '50% Advance',
        status: 'Confirmed',
        createdAt: '2026-10-15',
      }
    ];
  });

  // Hoarding Campaigns & Operational Status State
  const [campaigns, setCampaigns] = useState<HoardingCampaignItem[]>(() => {
    const provId = provider?.id || 'PRV-1001';
    const matches = mockHoardingCampaigns.filter((c) => c.providerId === provId);
    if (matches.length > 0) return matches;
    return [
      {
        id: `CMP-${provId}-01`,
        providerId: provId,
        resourceId: 'res-gen-01',
        resourceCode: `${(provider?.city || 'MET').slice(0, 3).toUpperCase()}-CBD-BB-01`,
        resourceName: `${provider?.city || 'Metro'} Prime Arterial Media Display`,
        resourceType: 'Billboard',
        location: `${provider?.city || 'City'} Central Commercial Corridor`,
        city: provider?.city || 'City',
        dimensions: '40ft × 20ft (800 sq.ft)',
        advertiserName: 'UltraTech Cement Brand Push',
        campaignTitle: 'India No.1 Cement Construction Mega Drive',
        startDate: '2026-10-01',
        endDate: '2026-10-31',
        operationalStatus: 'Running',
        mountingProofStatus: 'Verified',
        dayPhotoUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=900&auto=format&fit=crop&q=80',
        nightPhotoUrl: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=900&auto=format&fit=crop&q=80',
        proofTimestamp: '2026-10-02 18:25:00 IST',
        proofGpsCoordinates: '18.9220° N, 72.8346° E',
        verifiedBy: 'Admin - Compliance Officer',
        verifiedAt: '2026-10-02',
        invoiceStatus: 'Invoice Raised',
        invoiceNumber: `INV-2026-${provId.replace('PRV-', '')}01`,
        invoiceAmount: 165000,
        settlementStatus: 'Settlement Released',
        settlementAmount: 165000,
      },
      {
        id: `CMP-${provId}-02`,
        providerId: provId,
        resourceId: 'res-gen-02',
        resourceCode: `${(provider?.city || 'MET').slice(0, 3).toUpperCase()}-EXP-UP-02`,
        resourceName: `${provider?.city || 'Metro'} Ring Road Unipole`,
        resourceType: 'Unipole',
        location: `${provider?.city || 'City'} Airport Expressway`,
        city: provider?.city || 'City',
        dimensions: '50ft × 25ft (1250 sq.ft)',
        advertiserName: 'Hyundai Creta EV Festive Booking',
        campaignTitle: 'Next-Gen Electric SUV Showcase',
        startDate: '2026-11-01',
        endDate: '2026-11-30',
        operationalStatus: 'Moved to Campaign',
        mountingProofStatus: 'Pending Upload',
        invoiceStatus: 'Awaiting Invoice',
        settlementStatus: 'Locked (Pending Proof)',
        settlementAmount: 220000,
      }
    ];
  });

  const subscriberInfo: SubscriberRecord | undefined = mockSubscribers.find(
    (s) => s.providerId === provider?.id
  );

  // Modals state
  const [selectedInvoice, setSelectedInvoice] = useState<PackagePaymentInvoice | null>(null);
  const [viewingDoc, setViewingDoc] = useState<ProviderKycDocument | null>(null);
  const [rejectReasonModalDoc, setRejectReasonModalDoc] = useState<ProviderKycDocument | null>(null);
  const [rejectionReasonText, setRejectionReasonText] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<ProviderBookingRecord | null>(null);
  const [inspectingProofCampaign, setInspectingProofCampaign] = useState<HoardingCampaignItem | null>(null);

  // Inventory filters
  const [inventorySearch, setInventorySearch] = useState('');
  const [inventoryTypeFilter, setInventoryTypeFilter] = useState<string>('all');

  // Bookings filters
  const [bookingSourceFilter, setBookingSourceFilter] = useState<'all' | 'Marketplace' | 'Provider Direct'>('all');
  const [bookingSearch, setBookingSearch] = useState('');
  const [bookingStatusFilter, setBookingStatusFilter] = useState<string>('all');

  // Campaign filters
  const [campaignStageFilter, setCampaignStageFilter] = useState<string>('all');
  const [campaignSearch, setCampaignSearch] = useState('');

  // Sync state when ID param changes
  useEffect(() => {
    if (id) {
      const match = mockProviders.find((p) => p.id === id);
      if (match) {
        setProvider(match);
        if (mockProviderKycDocs[match.id]) {
          setKycDocs(mockProviderKycDocs[match.id]);
        }
        setResources(mockResources.filter((r) => r.providerId === match.id));
        setInvoices(mockPackageInvoices.filter((inv) => inv.providerId === match.id));
        
        const bkgMatches = mockProviderBookings.filter((b) => b.providerId === match.id);
        if (bkgMatches.length > 0) {
          setBookings(bkgMatches);
        }

        const cmpMatches = mockHoardingCampaigns.filter((c) => c.providerId === match.id);
        if (cmpMatches.length > 0) {
          setCampaigns(cmpMatches);
        }
      }
    }
  }, [id]);

  if (!provider) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-zinc-200">
        <h2 className="text-xl font-bold text-zinc-900">Provider Not Found</h2>
        <p className="text-sm text-zinc-500 mt-2">The requested provider ID does not exist in the system.</p>
        <Link to="/admin/providers" className="inline-block mt-4 px-4 py-2 bg-orange-600 text-white rounded-lg text-xs font-semibold">
          Return to Providers List
        </Link>
      </div>
    );
  }

  // Handle KYC Document Approval / Rejection
  const handleApproveDoc = (docId: string) => {
    setKycDocs((prev) =>
      prev.map((doc) =>
        doc.id === docId
          ? { ...doc, status: 'verified', verifiedBy: 'Admin - Current Session', verifiedAt: new Date().toISOString().split('T')[0] }
          : doc
      )
    );
  };

  const handleConfirmRejectDoc = () => {
    if (!rejectReasonModalDoc) return;
    setKycDocs((prev) =>
      prev.map((doc) =>
        doc.id === rejectReasonModalDoc.id
          ? { ...doc, status: 'rejected', rejectionReason: rejectionReasonText || 'Document not readable or missing official stamp.' }
          : doc
      )
    );
    setRejectReasonModalDoc(null);
    setRejectionReasonText('');
  };

  // Filtered inventory
  const filteredResources = useMemo(() => {
    return resources.filter((r) => {
      const matchesSearch =
        r.title.toLowerCase().includes(inventorySearch.toLowerCase()) ||
        r.code.toLowerCase().includes(inventorySearch.toLowerCase()) ||
        r.locationArea.toLowerCase().includes(inventorySearch.toLowerCase());
      const matchesType = inventoryTypeFilter === 'all' || r.type === inventoryTypeFilter;
      return matchesSearch && matchesType;
    });
  }, [resources, inventorySearch, inventoryTypeFilter]);

  // Filtered Bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchesSource = bookingSourceFilter === 'all' || b.source === bookingSourceFilter;
      const matchesStatus = bookingStatusFilter === 'all' || b.status === bookingStatusFilter;
      const matchesSearch =
        b.id.toLowerCase().includes(bookingSearch.toLowerCase()) ||
        b.customerName.toLowerCase().includes(bookingSearch.toLowerCase()) ||
        b.companyName.toLowerCase().includes(bookingSearch.toLowerCase()) ||
        b.resourceName.toLowerCase().includes(bookingSearch.toLowerCase()) ||
        b.location.toLowerCase().includes(bookingSearch.toLowerCase());
      return matchesSource && matchesStatus && matchesSearch;
    });
  }, [bookings, bookingSourceFilter, bookingStatusFilter, bookingSearch]);

  // Filtered Campaigns
  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((c) => {
      const matchesStage = campaignStageFilter === 'all' || c.operationalStatus === campaignStageFilter;
      const matchesSearch =
        c.campaignTitle.toLowerCase().includes(campaignSearch.toLowerCase()) ||
        c.advertiserName.toLowerCase().includes(campaignSearch.toLowerCase()) ||
        c.resourceCode.toLowerCase().includes(campaignSearch.toLowerCase()) ||
        c.resourceName.toLowerCase().includes(campaignSearch.toLowerCase()) ||
        c.location.toLowerCase().includes(campaignSearch.toLowerCase()) ||
        (c.invoiceNumber && c.invoiceNumber.toLowerCase().includes(campaignSearch.toLowerCase()));
      return matchesStage && matchesSearch;
    });
  }, [campaigns, campaignStageFilter, campaignSearch]);

  // Action: Advance Hoarding Lifecycle Status
  const handleAdvanceCampaignStatus = (campaignId: string) => {
    setCampaigns((prev) =>
      prev.map((c) => {
        if (c.id !== campaignId) return c;
        if (c.operationalStatus === 'Booking Confirmed') {
          return { ...c, operationalStatus: 'Moved to Campaign', mountingProofStatus: 'Pending Upload' };
        }
        if (c.operationalStatus === 'Moved to Campaign') {
          return {
            ...c,
            operationalStatus: 'Running',
            mountingProofStatus: 'Verified',
            proofTimestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' IST',
            verifiedBy: 'Admin - In-flight Operations',
            verifiedAt: new Date().toISOString().split('T')[0]
          };
        }
        if (c.operationalStatus === 'Running') {
          return {
            ...c,
            operationalStatus: 'Completed',
            settlementStatus: 'Settlement Released'
          };
        }
        return c;
      })
    );
  };

  // Action: Approve Proofs inside Modal
  const handleApproveProofModal = (campaignId: string) => {
    setCampaigns((prev) =>
      prev.map((c) =>
        c.id === campaignId
          ? {
              ...c,
              mountingProofStatus: 'Verified',
              operationalStatus: 'Running',
              verifiedBy: 'Admin - GeoProof Audit Desk',
              verifiedAt: new Date().toISOString().split('T')[0],
              settlementStatus: c.settlementStatus === 'Locked (Pending Proof)' ? 'Settlement Processing' : c.settlementStatus
            }
          : c
      )
    );
    if (inspectingProofCampaign && inspectingProofCampaign.id === campaignId) {
      setInspectingProofCampaign({
        ...inspectingProofCampaign,
        mountingProofStatus: 'Verified',
        operationalStatus: 'Running',
        verifiedBy: 'Admin - GeoProof Audit Desk',
        verifiedAt: new Date().toISOString().split('T')[0]
      });
    }
  };

  // Action: Release Escrow Settlement
  const handleReleaseSettlement = (campaignId: string) => {
    setCampaigns((prev) =>
      prev.map((c) =>
        c.id === campaignId ? { ...c, settlementStatus: 'Settlement Released' } : c
      )
    );
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Breadcrumb & Action Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/admin/providers"
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-600 hover:text-orange-600 transition-colors bg-white px-3 py-1.5 rounded-lg border border-zinc-200 shadow-2xs font-mono"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Providers Directory</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-semibold text-zinc-700 font-mono shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5 text-zinc-500" />
            <span>Print Dossier</span>
          </button>
        </div>
      </div>

      {/* Provider Header Banner */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-2xl font-mono shadow-inner shrink-0">
              {provider.name.slice(0, 2).toUpperCase()}
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl font-extrabold text-zinc-950 font-sans tracking-tight">
                  {provider.name}
                </h1>
                <span className="font-mono text-xs px-2.5 py-0.5 rounded-md bg-zinc-100 text-zinc-700 font-bold border border-zinc-200">
                  {provider.id}
                </span>

                {/* Account Status Badge */}
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                    provider.accountStatus === 'active'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : provider.accountStatus === 'probation'
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : 'bg-red-100 text-red-800 border border-red-300'
                  }`}
                >
                  {provider.accountStatus}
                </span>

                {/* KYC Badge */}
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                    provider.kycStatus === 'verified'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : provider.kycStatus === 'under_review'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}
                >
                  {provider.kycStatus === 'verified' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                  {provider.kycStatus === 'under_review' && <Clock className="w-3 h-3 text-amber-600" />}
                  {provider.kycStatus === 'rejected' && <XCircle className="w-3 h-3 text-red-600" />}
                  KYC {provider.kycStatus.replace('_', ' ')}
                </span>
              </div>

              <p className="text-xs text-zinc-600 font-medium">
                Legal Entity: <strong className="text-zinc-900">{provider.legalEntity}</strong>
              </p>

              <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-zinc-500 pt-1 font-mono">
                <span className="inline-flex items-center gap-1 text-zinc-700">
                  <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                  {provider.city}, {provider.state} ({provider.tier})
                </span>
                <span className="inline-flex items-center gap-1 text-zinc-700">
                  <Phone className="w-3.5 h-3.5 text-zinc-400" />
                  {provider.phone}
                </span>
                <span className="inline-flex items-center gap-1 text-zinc-700">
                  <Mail className="w-3.5 h-3.5 text-zinc-400" />
                  {provider.email}
                </span>
                <span className="text-zinc-400">
                  Member since {provider.joinedDate}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Stats Pill Cards */}
          <div className="flex items-center gap-3 shrink-0 self-start md:self-auto">
            <div className="px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200/80 text-center">
              <span className="text-[10px] font-mono uppercase font-bold text-zinc-400 block">Total Resources</span>
              <span className="text-lg font-extrabold text-zinc-950 font-sans">{provider.resourceCount} Units</span>
            </div>
            <div className="px-4 py-2.5 rounded-xl bg-orange-50/50 border border-orange-200/60 text-center">
              <span className="text-[10px] font-mono uppercase font-bold text-orange-700 block">Active Plan</span>
              <span className="text-sm font-bold text-orange-900 font-sans block truncate max-w-[140px]">
                {subscriberInfo?.planName || 'Enterprise Plan'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Dedicated Provider Sidebar on Left, Workspaces on Right */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        
        {/* ========================================================= */}
        {/* INNER VERTICAL LEFT SIDEBAR MENU (THE REQUESTED 6 MENUS)  */}
        {/* ========================================================= */}
        <aside className="w-full lg:w-64 shrink-0 bg-white rounded-2xl border border-zinc-200/80 p-2.5 shadow-xs space-y-1 sticky top-24">
          <div className="px-3 py-2 text-[10px] font-mono uppercase font-bold text-zinc-400 tracking-wider">
            Provider Operations
          </div>

          {/* 1. Profile & Business */}
          <button
            onClick={() => setActiveSection('profile')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
              activeSection === 'profile'
                ? 'bg-zinc-950 text-white shadow-xs'
                : 'text-zinc-700 hover:bg-zinc-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Building2 className={`w-4 h-4 ${activeSection === 'profile' ? 'text-orange-400' : 'text-zinc-400'}`} />
              <span>Profile & Business</span>
            </div>
            <ChevronRight className={`w-3.5 h-3.5 ${activeSection === 'profile' ? 'text-white' : 'text-zinc-300'}`} />
          </button>

          {/* 2. KYC Documents */}
          <button
            onClick={() => setActiveSection('documents')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
              activeSection === 'documents'
                ? 'bg-zinc-950 text-white shadow-xs'
                : 'text-zinc-700 hover:bg-zinc-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <ShieldCheck className={`w-4 h-4 ${activeSection === 'documents' ? 'text-orange-400' : 'text-zinc-400'}`} />
              <span>KYC Documents</span>
            </div>
            <ChevronRight className={`w-3.5 h-3.5 ${activeSection === 'documents' ? 'text-white' : 'text-zinc-300'}`} />
          </button>

          {/* 3. Inventory / Resources */}
          <button
            onClick={() => setActiveSection('inventory')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
              activeSection === 'inventory'
                ? 'bg-zinc-950 text-white shadow-xs'
                : 'text-zinc-700 hover:bg-zinc-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Layers className={`w-4 h-4 ${activeSection === 'inventory' ? 'text-orange-400' : 'text-zinc-400'}`} />
              <span>Inventory Resources</span>
            </div>
            <ChevronRight className={`w-3.5 h-3.5 ${activeSection === 'inventory' ? 'text-white' : 'text-zinc-300'}`} />
          </button>

          {/* 4. Package & Payments */}
          <button
            onClick={() => setActiveSection('payments')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
              activeSection === 'payments'
                ? 'bg-zinc-950 text-white shadow-xs'
                : 'text-zinc-700 hover:bg-zinc-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Receipt className={`w-4 h-4 ${activeSection === 'payments' ? 'text-orange-400' : 'text-zinc-400'}`} />
              <span>Package & Payments</span>
            </div>
            <ChevronRight className={`w-3.5 h-3.5 ${activeSection === 'payments' ? 'text-white' : 'text-zinc-300'}`} />
          </button>

          {/* 5. Bookings (Marketplace & Provider Direct) */}
          <button
            onClick={() => setActiveSection('bookings')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
              activeSection === 'bookings'
                ? 'bg-zinc-950 text-white shadow-xs'
                : 'text-zinc-700 hover:bg-zinc-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Calendar className={`w-4 h-4 ${activeSection === 'bookings' ? 'text-orange-400' : 'text-zinc-400'}`} />
              <span>Bookings</span>
            </div>
            <ChevronRight className={`w-3.5 h-3.5 ${activeSection === 'bookings' ? 'text-white' : 'text-zinc-300'}`} />
          </button>

          {/* 6. Campaigns & Hoarding Operational Status */}
          <button
            onClick={() => setActiveSection('campaigns')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
              activeSection === 'campaigns'
                ? 'bg-zinc-950 text-white shadow-xs'
                : 'text-zinc-700 hover:bg-zinc-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Radio className={`w-4 h-4 ${activeSection === 'campaigns' ? 'text-orange-400' : 'text-zinc-400'}`} />
              <span>Campaigns & Hoardings</span>
            </div>
            <ChevronRight className={`w-3.5 h-3.5 ${activeSection === 'campaigns' ? 'text-white' : 'text-zinc-300'}`} />
          </button>

          {/* 7. Activity & Audit Trail */}
          <button
            onClick={() => setActiveSection('audit')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
              activeSection === 'audit'
                ? 'bg-zinc-950 text-white shadow-xs'
                : 'text-zinc-700 hover:bg-zinc-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Activity className={`w-4 h-4 ${activeSection === 'audit' ? 'text-orange-400' : 'text-zinc-400'}`} />
              <span>Activity & Logs</span>
            </div>
            <ChevronRight className={`w-3.5 h-3.5 ${activeSection === 'audit' ? 'text-white' : 'text-zinc-300'}`} />
          </button>

          {/* Bottom Quick Context */}
          <div className="pt-3 border-t border-zinc-100 px-2 space-y-2">
            <span className="text-[10px] font-mono uppercase font-bold text-zinc-400 block">Fast Actions</span>
            <Link
              to={`/admin/subscribers?search=${provider.name}`}
              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-600 hover:bg-zinc-100 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
              <span>SaaS Subscription</span>
            </Link>
          </div>
        </aside>

        {/* ========================================================= */}
        {/* RIGHT CONTENT WORKSPACE                                  */}
        {/* ========================================================= */}
        <main className="flex-1 min-w-0 space-y-6">

          {/* ========================================================= */}
          {/* 1. PROFILE & BUSINESS INFO SECTION                        */}
          {/* ========================================================= */}
          {activeSection === 'profile' && (
            <div className="space-y-6">
              {/* Card 1: Statutory & Corporate Profile */}
              <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 space-y-4 shadow-xs">
                <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-orange-600" />
                    <h3 className="text-base font-bold text-zinc-950">Corporate & Statutory Identity</h3>
                  </div>
                  <span className="text-[11px] font-mono text-zinc-400">Incorporated in India</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/60 space-y-1">
                    <span className="text-[10px] font-mono uppercase font-bold text-zinc-400">Trade / Brand Name</span>
                    <p className="font-bold text-zinc-900 text-sm">{provider.name}</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/60 space-y-1">
                    <span className="text-[10px] font-mono uppercase font-bold text-zinc-400">Registered Legal Entity</span>
                    <p className="font-bold text-zinc-900 text-sm">{provider.legalEntity}</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/60 space-y-1">
                    <span className="text-[10px] font-mono uppercase font-bold text-zinc-400">Goods & Services Tax (GSTIN)</span>
                    <p className="font-mono font-bold text-zinc-900 text-sm">{provider.gstin}</p>
                    <span className="text-[10px] text-emerald-600 font-semibold block">GST State: {provider.state}</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/60 space-y-1">
                    <span className="text-[10px] font-mono uppercase font-bold text-zinc-400">Permanent Account Number (PAN)</span>
                    <p className="font-mono font-bold text-zinc-900 text-sm">{provider.pan}</p>
                    <span className="text-[10px] text-zinc-500 block">Verified against NSDL</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/60 space-y-1">
                    <span className="text-[10px] font-mono uppercase font-bold text-zinc-400">Corporate Identity Number (CIN)</span>
                    <p className="font-mono font-bold text-zinc-900 text-sm">U74300MH2021PTC318902</p>
                    <span className="text-[10px] text-zinc-500 block">Ministry of Corporate Affairs</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/60 space-y-1">
                    <span className="text-[10px] font-mono uppercase font-bold text-zinc-400">Market Operational Tier</span>
                    <p className="font-bold text-zinc-900 text-sm">{provider.tier} Metro Hub</p>
                    <span className="text-[10px] text-zinc-500 block">Primary Base: {provider.city}</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Registered Business Office & Contacts */}
              <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 space-y-4 shadow-xs">
                <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-orange-600" />
                    <h3 className="text-base font-bold text-zinc-950">Registered Business Office & Communications</h3>
                  </div>
                  <span className="text-[11px] font-mono text-zinc-400">Official Communication Channel</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/60 space-y-1 md:col-span-2">
                    <span className="text-[10px] font-mono uppercase font-bold text-zinc-400">Registered Office Address</span>
                    <p className="font-medium text-zinc-900">
                      Suite 401, Apex Media Heights, Commercial Business District, {provider.city}, {provider.state} - 400051
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/60 space-y-1">
                    <span className="text-[10px] font-mono uppercase font-bold text-zinc-400">Primary Contact Officer</span>
                    <p className="font-bold text-zinc-900 text-sm">{provider.contactPerson}</p>
                    <span className="text-[11px] text-zinc-500">Authorized Signatory / Managing Partner</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/60 space-y-1">
                    <span className="text-[10px] font-mono uppercase font-bold text-zinc-400">Direct Phone / WhatsApp</span>
                    <p className="font-mono font-bold text-zinc-900 text-sm">{provider.phone}</p>
                    <span className="text-[11px] text-emerald-600 font-semibold">Verified Mobile OTP</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/60 space-y-1">
                    <span className="text-[10px] font-mono uppercase font-bold text-zinc-400">Official Billing & Invoicing Email</span>
                    <p className="font-mono font-bold text-zinc-900 text-sm">{provider.email}</p>
                    <span className="text-[11px] text-zinc-500">Automated invoices dispatched here</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/60 space-y-1">
                    <span className="text-[10px] font-mono uppercase font-bold text-zinc-400">Operations Field Escalation Desk</span>
                    <p className="font-mono font-bold text-zinc-900 text-sm">+91 22 6789 4000</p>
                    <span className="text-[11px] text-zinc-500">24×7 Rapid Mounting Escalation</span>
                  </div>
                </div>
              </div>

              {/* Card 3: Bank Settlement Details */}
              <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 space-y-4 shadow-xs">
                <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-emerald-600" />
                    <h3 className="text-base font-bold text-zinc-950">Bank Account & Payout Settlement</h3>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                    ESCROW VERIFIED
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
                  <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/60 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-zinc-400 block">Beneficiary Legal Entity</span>
                    <strong className="text-zinc-900 block font-sans">{provider.legalEntity}</strong>
                  </div>

                  <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/60 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-zinc-400 block">Bank & Account Number</span>
                    <strong className="text-zinc-900 block font-sans">HDFC Bank Ltd • ****4491</strong>
                  </div>

                  <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/60 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-zinc-400 block">IFSC Code & Branch</span>
                    <strong className="text-zinc-900 block">HDFC0000084 (BKC Branch)</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 2. KYC DOCUMENTS SECTION                                  */}
          {/* ========================================================= */}
          {activeSection === 'documents' && (
            <div className="space-y-6">
              {/* KYC Status Banner */}
              <div className={`p-5 rounded-2xl border ${
                provider.kycStatus === 'verified'
                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                  : provider.kycStatus === 'under_review'
                  ? 'bg-amber-50/70 border-amber-200 text-amber-950'
                  : 'bg-red-50/70 border-red-200 text-red-950'
              } flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs`}>
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-white shadow-xs">
                    <ShieldCheck className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold font-sans">
                      KYC Compliance Status: {provider.kycStatus.replace('_', ' ').toUpperCase()}
                    </h3>
                    <p className="text-xs opacity-80 mt-0.5">
                      Statutory municipal licenses, GST registration certificates, and banking mandates.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setProvider({ ...provider, kycStatus: 'verified' })}
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors shadow-2xs"
                  >
                    Mark Verified
                  </button>
                  <button
                    onClick={() => setProvider({ ...provider, kycStatus: 'under_review' })}
                    className="px-3.5 py-1.5 rounded-lg bg-white border border-zinc-300 text-zinc-700 font-semibold text-xs hover:bg-zinc-50 transition-colors"
                  >
                    Flag Review
                  </button>
                </div>
              </div>

              {/* Documents List */}
              <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 space-y-4 shadow-xs">
                <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-zinc-950">Statutory & Verification Documents</h3>
                    <p className="text-xs text-zinc-500 mt-0.5">Review uploaded compliance files or approve/reject individual proofs.</p>
                  </div>
                  <span className="text-xs font-mono text-zinc-400">{kycDocs.length} Total Documents</span>
                </div>

                <div className="divide-y divide-zinc-100">
                  {kycDocs.map((doc) => (
                    <div key={doc.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-zinc-50/60 p-3 rounded-xl transition-colors">
                      <div className="flex items-start gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-zinc-100 text-zinc-700 flex items-center justify-center shrink-0">
                          <FileText className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-zinc-950 text-xs sm:text-sm">{doc.name}</span>
                            {doc.status === 'verified' && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-100 text-emerald-800 font-bold">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> VERIFIED
                              </span>
                            )}
                            {doc.status === 'under_review' && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-amber-100 text-amber-800 font-bold">
                                <Clock className="w-3 h-3 text-amber-600" /> UNDER REVIEW
                              </span>
                            )}
                            {doc.status === 'rejected' && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-red-100 text-red-800 font-bold">
                                <XCircle className="w-3 h-3 text-red-600" /> REJECTED
                              </span>
                            )}
                            {doc.status === 'missing' && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-zinc-100 text-zinc-600 font-bold">
                                MISSING / ACTION REQUIRED
                              </span>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-x-3 text-xs text-zinc-500 mt-1 font-mono">
                            <span>File: <strong className="text-zinc-700">{doc.fileName}</strong></span>
                            <span>•</span>
                            <span>Size: {doc.fileSize}</span>
                            <span>•</span>
                            <span>Uploaded: {doc.uploadedAt}</span>
                            {doc.documentNumber && (
                              <>
                                <span>•</span>
                                <span className="text-zinc-700 font-semibold">{doc.documentNumber}</span>
                              </>
                            )}
                          </div>

                          {doc.rejectionReason && (
                            <p className="mt-1.5 text-xs text-red-700 bg-red-50 p-2 rounded-lg border border-red-200">
                              <strong>Rejection Reason:</strong> {doc.rejectionReason}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Document Actions */}
                      <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
                        <button
                          onClick={() => setViewingDoc(doc)}
                          className="px-3 py-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-100 text-zinc-700 font-semibold text-xs flex items-center gap-1.5 shadow-2xs"
                        >
                          <Eye className="w-3.5 h-3.5 text-zinc-500" />
                          <span>View Doc</span>
                        </button>

                        {doc.status !== 'verified' && (
                          <button
                            onClick={() => handleApproveDoc(doc.id)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1 shadow-2xs"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Approve</span>
                          </button>
                        )}

                        {doc.status !== 'rejected' && (
                          <button
                            onClick={() => {
                              setRejectReasonModalDoc(doc);
                              setRejectionReasonText('');
                            }}
                            className="px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-semibold text-xs flex items-center gap-1"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 3. INVENTORY / RESOURCES SECTION                          */}
          {/* ========================================================= */}
          {activeSection === 'inventory' && (
            <div className="space-y-6">
              {/* Inventory Header & KPI */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 bg-white rounded-2xl border border-zinc-200/80 shadow-xs space-y-1">
                  <span className="text-[10px] font-mono uppercase font-bold text-zinc-400">Total Registered Media</span>
                  <div className="text-2xl font-extrabold text-zinc-950 font-sans">{resources.length} Resources</div>
                  <p className="text-xs text-zinc-500 pt-0.5">Under {provider.name}</p>
                </div>

                <div className="p-5 bg-white rounded-2xl border border-zinc-200/80 shadow-xs space-y-1">
                  <span className="text-[10px] font-mono uppercase font-bold text-zinc-400">Approved & Live</span>
                  <div className="text-2xl font-extrabold text-emerald-700 font-sans">
                    {resources.filter(r => r.verificationStatus === 'approved').length} Active
                  </div>
                  <p className="text-xs text-zinc-500 pt-0.5">Audited by Platform Admin</p>
                </div>

                <div className="p-5 bg-white rounded-2xl border border-zinc-200/80 shadow-xs space-y-1">
                  <span className="text-[10px] font-mono uppercase font-bold text-zinc-400">Admin Blocked / Dispute</span>
                  <div className="text-2xl font-extrabold text-red-600 font-sans">
                    {resources.filter(r => r.adminBlockStatus !== 'none').length} Holds
                  </div>
                  <p className="text-xs text-zinc-500 pt-0.5">Regulatory / Municipal checks</p>
                </div>
              </div>

              {/* Inventory Table Card */}
              <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 space-y-4 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="relative w-full sm:w-80">
                    <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search resource code, location, title..."
                      value={inventorySearch}
                      onChange={(e) => setInventorySearch(e.target.value)}
                      className="w-full text-xs pl-8 pr-3 py-2 rounded-lg border border-zinc-200 focus:outline-none focus:border-orange-500 font-sans"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-xs font-mono text-zinc-400">Type:</span>
                    {['all', 'Billboard', 'Unipole', 'DOOH Digital Screen', 'Gantry'].map((tp) => (
                      <button
                        key={tp}
                        onClick={() => setInventoryTypeFilter(tp)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${
                          inventoryTypeFilter === tp
                            ? 'bg-zinc-950 text-white font-bold'
                            : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                        }`}
                      >
                        {tp === 'all' ? 'All Types' : tp}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-zinc-200 text-zinc-400 uppercase font-mono text-[10px]">
                        <th className="py-2.5 font-bold">Media Code & Title</th>
                        <th className="py-2.5 font-bold">Type & Illumination</th>
                        <th className="py-2.5 font-bold">Dimensions & Area</th>
                        <th className="py-2.5 font-bold">Monthly Base Price</th>
                        <th className="py-2.5 font-bold">Audit Status</th>
                        <th className="py-2.5 font-bold text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                      {filteredResources.map((res) => (
                        <tr key={res.id} className="hover:bg-zinc-50/70 transition-colors">
                          <td className="py-3">
                            <span className="font-mono font-bold text-orange-600 block">{res.code}</span>
                            <span className="font-bold text-zinc-900 block text-xs">{res.title}</span>
                            <span className="text-[11px] text-zinc-500 block truncate max-w-[220px]">{res.locationArea}</span>
                          </td>

                          <td className="py-3">
                            <span className="font-medium text-zinc-900 block">{res.type}</span>
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600">
                              {res.illumination}
                            </span>
                          </td>

                          <td className="py-3 font-mono">
                            <span className="text-zinc-800 font-semibold block">{res.dimensions}</span>
                            <span className="text-[10px] text-zinc-400">{res.city}</span>
                          </td>

                          <td className="py-3 font-mono">
                            <span className="text-zinc-950 font-bold block text-sm">
                              ₹{res.monthlyRate.toLocaleString('en-IN')}
                            </span>
                            <span className="text-[10px] text-zinc-400">/ calendar month</span>
                          </td>

                          <td className="py-3">
                            {res.verificationStatus === 'approved' && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-100 text-emerald-800 font-bold">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> APPROVED
                              </span>
                            )}
                            {res.verificationStatus === 'pending_audit' && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-amber-100 text-amber-800 font-bold">
                                <Clock className="w-3 h-3 text-amber-600" /> PENDING AUDIT
                              </span>
                            )}
                            {res.verificationStatus === 'flagged' && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-red-100 text-red-800 font-bold">
                                <AlertTriangle className="w-3 h-3 text-red-600" /> FLAGGED
                              </span>
                            )}
                          </td>

                          <td className="py-3 text-right">
                            <Link
                              to={`/admin/resources?code=${res.code}`}
                              className="px-2.5 py-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-100 text-zinc-700 font-semibold text-xs inline-flex items-center gap-1"
                            >
                              <span>Inspect</span>
                              <ExternalLink className="w-3 h-3 text-zinc-400" />
                            </Link>
                          </td>
                        </tr>
                      ))}
                      {filteredResources.length === 0 && (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-zinc-400 font-mono text-xs">
                            No resources matching current search or filters.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 4. PACKAGE & PAYMENTS SECTION (PAID TO ADMIN)             */}
          {/* ========================================================= */}
          {activeSection === 'payments' && (
            <div className="space-y-6">
              {/* Active Subscription Summary Card */}
              <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-orange-100 text-orange-700">
                      <Receipt className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase font-bold text-orange-600">ACTIVE SAAS PLAN</span>
                      <h3 className="text-xl font-extrabold text-zinc-950 font-sans">
                        {subscriberInfo?.planName || 'Enterprise Plan'}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase bg-emerald-100 text-emerald-800 border border-emerald-300">
                      {subscriberInfo?.status || 'ACTIVE'}
                    </span>
                    <Link
                      to={`/admin/subscribers?search=${provider.name}`}
                      className="px-3.5 py-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-50 text-xs font-semibold text-zinc-700 font-mono"
                    >
                      Manage Plan
                    </Link>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                  <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/60 space-y-1">
                    <span className="text-[10px] font-mono uppercase font-bold text-zinc-400">Billing Cycle</span>
                    <p className="font-bold text-zinc-900 text-sm">{subscriberInfo?.billingCycle || 'Annual'}</p>
                    <span className="text-[11px] text-zinc-500">Next renewal: {subscriberInfo?.nextRenewal || '2027-04-12'}</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/60 space-y-1">
                    <span className="text-[10px] font-mono uppercase font-bold text-zinc-400">Subscription Fee</span>
                    <p className="font-bold text-zinc-950 text-sm font-sans">
                      ₹{subscriberInfo?.amount ? subscriberInfo.amount.toLocaleString('en-IN') : '4,99,990'}
                    </p>
                    <span className="text-[11px] text-zinc-500">+ 18% GST (SAC 998315)</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/60 space-y-1">
                    <span className="text-[10px] font-mono uppercase font-bold text-zinc-400">Inventory / Resource Quota</span>
                    <p className="font-bold text-zinc-900 text-sm">
                      {subscriberInfo?.billboardUsage || provider.resourceCount} / {subscriberInfo?.quotaLimit || 500}
                    </p>
                    <div className="w-full bg-zinc-200 h-1.5 rounded-full overflow-hidden mt-1">
                      <div 
                        className="bg-orange-600 h-full rounded-full" 
                        style={{ width: `${Math.min(100, ((subscriberInfo?.billboardUsage || provider.resourceCount) / (subscriberInfo?.quotaLimit || 500)) * 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/60 space-y-1">
                    <span className="text-[10px] font-mono uppercase font-bold text-zinc-400">Last Payment Captured</span>
                    <p className="font-bold text-emerald-700 text-sm font-mono">
                      {subscriberInfo?.lastPaymentDate || '2026-04-12'}
                    </p>
                    <span className="text-[11px] text-emerald-600 font-medium">Auto-renew active</span>
                  </div>
                </div>
              </div>

              {/* Package Payment History Table (Paid to Admin) */}
              <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-zinc-950 font-sans">
                      Package Payment Invoices (Paid to Admin)
                    </h3>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      Statutory GST tax invoices issued by SODAARS to {provider.name} for platform SaaS subscriptions.
                    </p>
                  </div>

                  <Link
                    to="/admin/payments"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-600 hover:text-orange-700 font-mono"
                  >
                    <span>View All Platform Invoices</span>
                    <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
                  </Link>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-zinc-200 text-zinc-400 uppercase font-mono text-[10px]">
                        <th className="py-2.5 font-bold">Invoice & Date</th>
                        <th className="py-2.5 font-bold">Package & Service Period</th>
                        <th className="py-2.5 font-bold">Payment Method & Ref</th>
                        <th className="py-2.5 font-bold text-right">Taxable Base</th>
                        <th className="py-2.5 font-bold text-right">18% GST</th>
                        <th className="py-2.5 font-bold text-right">Total Paid</th>
                        <th className="py-2.5 font-bold">Status</th>
                        <th className="py-2.5 font-bold text-right">Receipt</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 font-mono">
                      {invoices.map((inv) => (
                        <tr key={inv.id} className="hover:bg-zinc-50/70 transition-colors">
                          <td className="py-3.5">
                            <span className="font-bold text-orange-600 block">{inv.id}</span>
                            <span className="text-[11px] text-zinc-500">{inv.paymentDate.split(' ')[0]}</span>
                          </td>

                          <td className="py-3.5 font-sans">
                            <span className="font-bold text-zinc-900 block text-xs">{inv.planName}</span>
                            <span className="text-[11px] text-zinc-500 font-mono">
                              {inv.periodStart} to {inv.periodEnd}
                            </span>
                          </td>

                          <td className="py-3.5 font-sans">
                            <span className="font-semibold text-zinc-800 block text-xs">{inv.paymentMethod}</span>
                            <span className="text-[11px] text-zinc-400 font-mono">{inv.paymentRef}</span>
                          </td>

                          <td className="py-3.5 text-right font-medium text-zinc-700">
                            ₹{inv.baseAmount.toLocaleString('en-IN')}
                          </td>

                          <td className="py-3.5 text-right font-medium text-zinc-500">
                            ₹{inv.gstAmount.toLocaleString('en-IN')}
                          </td>

                          <td className="py-3.5 text-right font-bold text-zinc-950 font-sans text-sm">
                            ₹{inv.totalAmount.toLocaleString('en-IN')}
                          </td>

                          <td className="py-3.5">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              inv.status === 'paid'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {inv.status}
                            </span>
                          </td>

                          <td className="py-3.5 text-right">
                            <button
                              onClick={() => setSelectedInvoice(inv)}
                              className="px-3 py-1.5 rounded-lg border border-zinc-200 hover:bg-orange-50 hover:border-orange-200 hover:text-orange-700 text-zinc-700 font-semibold text-xs inline-flex items-center gap-1 font-sans shadow-2xs"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>Tax Invoice</span>
                            </button>
                          </td>
                        </tr>
                      ))}

                      {invoices.length === 0 && (
                        <tr>
                          <td colSpan={8} className="py-8 text-center text-zinc-400 font-mono text-xs">
                            No billing invoices recorded yet for this provider.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 5. BOOKINGS SECTION (MARKETPLACE & PROVIDER DIRECT)       */}
          {/* ========================================================= */}
          {activeSection === 'bookings' && (
            <div className="space-y-6">
              {/* High-Level Booking KPI Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 bg-white rounded-2xl border border-zinc-200/80 shadow-xs space-y-1">
                  <span className="text-[10px] font-mono uppercase font-bold text-zinc-400">Total Bookings</span>
                  <div className="text-2xl font-extrabold text-zinc-950 font-sans">{bookings.length} Orders</div>
                  <p className="text-xs text-zinc-500 pt-0.5">Marketplace & Direct</p>
                </div>

                <div className="p-5 bg-white rounded-2xl border border-zinc-200/80 shadow-xs space-y-1">
                  <span className="text-[10px] font-mono uppercase font-bold text-blue-600">Marketplace Bookings</span>
                  <div className="text-2xl font-extrabold text-blue-700 font-sans">
                    {bookings.filter(b => b.source === 'Marketplace').length} Bookings
                  </div>
                  <p className="text-xs text-zinc-500 pt-0.5">Escrow & SODAARS Billed</p>
                </div>

                <div className="p-5 bg-white rounded-2xl border border-zinc-200/80 shadow-xs space-y-1">
                  <span className="text-[10px] font-mono uppercase font-bold text-emerald-600">Provider Direct</span>
                  <div className="text-2xl font-extrabold text-emerald-700 font-sans">
                    {bookings.filter(b => b.source === 'Provider Direct').length} Bookings
                  </div>
                  <p className="text-xs text-zinc-500 pt-0.5">Self-managed Client Direct</p>
                </div>

                <div className="p-5 bg-white rounded-2xl border border-zinc-200/80 shadow-xs space-y-1">
                  <span className="text-[10px] font-mono uppercase font-bold text-zinc-400">Total Gross Contract Value</span>
                  <div className="text-2xl font-extrabold text-zinc-950 font-sans">
                    ₹{bookings.reduce((sum, b) => sum + b.contractValue, 0).toLocaleString('en-IN')}
                  </div>
                  <p className="text-xs text-emerald-600 font-semibold pt-0.5">Provider Net: ₹{bookings.reduce((sum, b) => sum + (b.sodaarsNetPayout || b.contractValue), 0).toLocaleString('en-IN')}</p>
                </div>
              </div>

              {/* Bookings Card & Table */}
              <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 space-y-4 shadow-xs">
                {/* Source Filter Tabs & Search */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Source Tabs */}
                  <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-xl">
                    <button
                      onClick={() => setBookingSourceFilter('all')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        bookingSourceFilter === 'all'
                          ? 'bg-white text-zinc-900 shadow-2xs font-bold'
                          : 'text-zinc-600 hover:text-zinc-900'
                      }`}
                    >
                      All Bookings ({bookings.length})
                    </button>
                    <button
                      onClick={() => setBookingSourceFilter('Marketplace')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        bookingSourceFilter === 'Marketplace'
                          ? 'bg-blue-600 text-white shadow-2xs font-bold'
                          : 'text-zinc-600 hover:text-blue-700'
                      }`}
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Marketplace ({bookings.filter(b => b.source === 'Marketplace').length})</span>
                    </button>
                    <button
                      onClick={() => setBookingSourceFilter('Provider Direct')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        bookingSourceFilter === 'Provider Direct'
                          ? 'bg-emerald-600 text-white shadow-2xs font-bold'
                          : 'text-zinc-600 hover:text-emerald-700'
                      }`}
                    >
                      <Building2 className="w-3.5 h-3.5" />
                      <span>Provider Direct ({bookings.filter(b => b.source === 'Provider Direct').length})</span>
                    </button>
                  </div>

                  {/* Search and Status Dropdown */}
                  <div className="flex items-center gap-3">
                    <div className="relative w-full sm:w-64">
                      <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search client, brand, booking ID..."
                        value={bookingSearch}
                        onChange={(e) => setBookingSearch(e.target.value)}
                        className="w-full text-xs pl-8 pr-3 py-2 rounded-lg border border-zinc-200 focus:outline-none focus:border-orange-500 font-sans"
                      />
                    </div>

                    <select
                      value={bookingStatusFilter}
                      onChange={(e) => setBookingStatusFilter(e.target.value)}
                      className="text-xs px-2.5 py-2 rounded-lg border border-zinc-200 bg-white font-mono text-zinc-700 focus:outline-none focus:border-orange-500"
                    >
                      <option value="all">All Statuses</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Active">Active / Running</option>
                      <option value="Under Review">Under Review</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </div>

                {/* Bookings Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-zinc-200 text-zinc-400 uppercase font-mono text-[10px]">
                        <th className="py-2.5 font-bold">Booking ID & Date</th>
                        <th className="py-2.5 font-bold">Source Channel</th>
                        <th className="py-2.5 font-bold">Client & Brand</th>
                        <th className="py-2.5 font-bold">Hoarding / Media Asset</th>
                        <th className="py-2.5 font-bold">Flight Dates</th>
                        <th className="py-2.5 font-bold text-right">Contract Value</th>
                        <th className="py-2.5 font-bold text-right">Net Payout</th>
                        <th className="py-2.5 font-bold">Status</th>
                        <th className="py-2.5 font-bold text-right">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                      {filteredBookings.map((b) => (
                        <tr key={b.id} className="hover:bg-zinc-50/70 transition-colors">
                          <td className="py-3.5 font-mono">
                            <span className="font-bold text-orange-600 block">{b.id}</span>
                            <span className="text-[10px] text-zinc-400">{b.createdAt}</span>
                          </td>

                          <td className="py-3.5">
                            {b.source === 'Marketplace' ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200">
                                <ShoppingBag className="w-3 h-3" />
                                Marketplace
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <Building2 className="w-3 h-3" />
                                Direct Client
                              </span>
                            )}
                          </td>

                          <td className="py-3.5">
                            <span className="font-bold text-zinc-900 block text-xs">{b.companyName}</span>
                            <span className="text-[11px] text-zinc-500 block">{b.customerName}</span>
                            <span className="text-[10px] font-mono text-zinc-400 block">{b.contactPhone}</span>
                          </td>

                          <td className="py-3.5">
                            <span className="font-semibold text-zinc-900 block text-xs">{b.resourceName}</span>
                            <span className="text-[11px] text-zinc-500 font-mono block">{b.location}</span>
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-100 text-zinc-600">
                              {b.resourceType}
                            </span>
                          </td>

                          <td className="py-3.5 font-mono">
                            <span className="text-zinc-800 block font-semibold">{b.startDate}</span>
                            <span className="text-zinc-500 text-[11px] block">to {b.endDate}</span>
                          </td>

                          <td className="py-3.5 text-right font-mono">
                            <span className="font-bold text-zinc-950 block text-sm">
                              ₹{b.contractValue.toLocaleString('en-IN')}
                            </span>
                            <span className="text-[10px] text-zinc-400">
                              {b.paymentStatus}
                            </span>
                          </td>

                          <td className="py-3.5 text-right font-mono">
                            <span className="font-bold text-emerald-700 block text-sm">
                              ₹{(b.sodaarsNetPayout || b.contractValue).toLocaleString('en-IN')}
                            </span>
                            {b.markupAmount ? (
                              <span className="text-[10px] text-blue-600 block">Fee: ₹{b.markupAmount.toLocaleString('en-IN')}</span>
                            ) : (
                              <span className="text-[10px] text-zinc-400 block">Direct (No fee)</span>
                            )}
                          </td>

                          <td className="py-3.5">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                              b.status === 'Active'
                                ? 'bg-emerald-100 text-emerald-800'
                                : b.status === 'Confirmed'
                                ? 'bg-blue-100 text-blue-800'
                                : b.status === 'Under Review'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-zinc-100 text-zinc-700'
                            }`}>
                              {b.status}
                            </span>
                          </td>

                          <td className="py-3.5 text-right">
                            <button
                              onClick={() => setSelectedBooking(b)}
                              className="px-2.5 py-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-100 text-zinc-700 font-semibold text-xs inline-flex items-center gap-1 shadow-2xs"
                            >
                              <Eye className="w-3.5 h-3.5 text-zinc-500" />
                              <span>Inspect</span>
                            </button>
                          </td>
                        </tr>
                      ))}

                      {filteredBookings.length === 0 && (
                        <tr>
                          <td colSpan={9} className="py-10 text-center text-zinc-400 font-mono text-xs">
                            No bookings match the selected channel or search criteria.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 6. CAMPAIGNS & HOARDING OPERATIONAL STATUS (CRITICAL FLOW) */}
          {/* ========================================================= */}
          {activeSection === 'campaigns' && (
            <div className="space-y-6">
              {/* Operational Flow Notice Banner */}
              <div className="bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 border border-orange-200 p-5 rounded-2xl shadow-2xs space-y-2">
                <div className="flex items-center gap-2.5 text-orange-950 font-bold text-sm">
                  <Radio className="w-4 h-4 text-orange-600" />
                  <span>Hoarding Execution & Proof Lifecycle Tracker</span>
                </div>
                <p className="text-xs text-orange-900 leading-relaxed">
                  Track physical billboard lifecycle from <strong>Booking Confirmed</strong> ➔ <strong>Moved to Campaign (Prep / Printing)</strong> ➔ <strong>Running (Live in Flight with Day & Night Geotagged Proofs)</strong> ➔ <strong>Settlement Release</strong>. Review mounting verification before releasing escrow disbursements.
                </p>
              </div>

              {/* Status Filter Stepper Tabs */}
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { key: 'all', label: 'All Hoardings', count: campaigns.length },
                  { key: 'Booking Confirmed', label: '1. Booking Confirmed', count: campaigns.filter(c => c.operationalStatus === 'Booking Confirmed').length },
                  { key: 'Moved to Campaign', label: '2. Moved to Campaign', count: campaigns.filter(c => c.operationalStatus === 'Moved to Campaign').length },
                  { key: 'Running', label: '3. Running / Live', count: campaigns.filter(c => c.operationalStatus === 'Running').length },
                  { key: 'Completed', label: '4. Completed', count: campaigns.filter(c => c.operationalStatus === 'Completed').length },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setCampaignStageFilter(tab.key)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-mono font-semibold transition-all flex items-center gap-2 ${
                      campaignStageFilter === tab.key
                        ? 'bg-zinc-950 text-white shadow-xs'
                        : 'bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-100'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                      campaignStageFilter === tab.key ? 'bg-zinc-800 text-orange-400' : 'bg-zinc-100 text-zinc-600'
                    }`}>
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Search within campaigns */}
              <div className="relative w-full sm:w-80">
                <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search campaign, advertiser, hoarding code..."
                  value={campaignSearch}
                  onChange={(e) => setCampaignSearch(e.target.value)}
                  className="w-full text-xs pl-8 pr-3 py-2 rounded-lg border border-zinc-200 focus:outline-none focus:border-orange-500 font-sans bg-white"
                />
              </div>

              {/* Hoardings Operational Cards List */}
              <div className="space-y-4">
                {filteredCampaigns.map((camp) => (
                  <div
                    key={camp.id}
                    className="bg-white rounded-2xl border border-zinc-200/80 p-5 sm:p-6 shadow-xs space-y-5 transition-all hover:border-zinc-300"
                  >
                    {/* Top Row: Hoarding Asset Info & Badges */}
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs px-2.5 py-0.5 rounded-md bg-orange-100 text-orange-800 font-bold border border-orange-200">
                            {camp.resourceCode}
                          </span>
                          <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-700 font-semibold">
                            {camp.resourceType}
                          </span>
                          <span className="text-xs text-zinc-400 font-mono">• {camp.dimensions}</span>

                          {/* Live Running Pulsing Pill */}
                          {camp.operationalStatus === 'Running' && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                              RUNNING (LIVE IN FLIGHT)
                            </span>
                          )}

                          {camp.operationalStatus === 'Moved to Campaign' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-100 text-blue-800 border border-blue-300">
                              <Clock className="w-3 h-3 text-blue-600" />
                              MOVED TO CAMPAIGN (PREP)
                            </span>
                          )}

                          {camp.operationalStatus === 'Booking Confirmed' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-100 text-amber-800 border border-amber-300">
                              <CheckCircle2 className="w-3 h-3 text-amber-600" />
                              BOOKING CONFIRMED
                            </span>
                          )}

                          {camp.operationalStatus === 'Completed' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-zinc-100 text-zinc-800 border border-zinc-300">
                              <CheckCheck className="w-3 h-3 text-zinc-600" />
                              COMPLETED & DISMANTLED
                            </span>
                          )}
                        </div>

                        <h4 className="text-base font-extrabold text-zinc-950 font-sans pt-1">
                          {camp.campaignTitle}
                        </h4>
                        <p className="text-xs text-zinc-600">
                          Advertiser: <strong className="text-zinc-900">{camp.advertiserName}</strong> • {camp.resourceName} ({camp.location})
                        </p>
                      </div>

                      {/* Flight Dates & Duration */}
                      <div className="flex items-center gap-3 shrink-0 self-start lg:self-auto text-xs font-mono bg-zinc-50 p-2.5 rounded-xl border border-zinc-200/60">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-zinc-400 block">Flight Period</span>
                          <span className="font-semibold text-zinc-900">{camp.startDate} to {camp.endDate}</span>
                        </div>
                      </div>
                    </div>

                    {/* Operational Lifecycle Stepper Progress */}
                    <div className="bg-zinc-50 p-3.5 rounded-xl border border-zinc-200/60 space-y-2">
                      <div className="text-[10px] font-mono uppercase font-bold text-zinc-400 tracking-wider">
                        Operational Execution Lifecycle
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                        {/* Step 1: Booking Confirmed */}
                        <div className={`p-2.5 rounded-lg border ${
                          camp.operationalStatus === 'Booking Confirmed' || camp.operationalStatus === 'Moved to Campaign' || camp.operationalStatus === 'Running' || camp.operationalStatus === 'Completed'
                            ? 'bg-white border-emerald-300 text-emerald-950 font-bold'
                            : 'bg-zinc-100 border-zinc-200 text-zinc-400'
                        } flex items-center gap-2`}>
                          <CheckCircle2 className={`w-4 h-4 shrink-0 ${
                            camp.operationalStatus === 'Booking Confirmed' || camp.operationalStatus === 'Moved to Campaign' || camp.operationalStatus === 'Running' || camp.operationalStatus === 'Completed'
                              ? 'text-emerald-600' : 'text-zinc-300'
                          }`} />
                          <span className="text-[11px] leading-tight">1. Booking Confirmed</span>
                        </div>

                        {/* Step 2: Moved to Campaign */}
                        <div className={`p-2.5 rounded-lg border ${
                          camp.operationalStatus === 'Moved to Campaign' || camp.operationalStatus === 'Running' || camp.operationalStatus === 'Completed'
                            ? 'bg-white border-blue-300 text-blue-950 font-bold'
                            : 'bg-zinc-100 border-zinc-200 text-zinc-400'
                        } flex items-center gap-2`}>
                          <Clock className={`w-4 h-4 shrink-0 ${
                            camp.operationalStatus === 'Moved to Campaign' || camp.operationalStatus === 'Running' || camp.operationalStatus === 'Completed'
                              ? 'text-blue-600' : 'text-zinc-300'
                          }`} />
                          <span className="text-[11px] leading-tight">2. Moved to Campaign</span>
                        </div>

                        {/* Step 3: Running (Live) */}
                        <div className={`p-2.5 rounded-lg border ${
                          camp.operationalStatus === 'Running' || camp.operationalStatus === 'Completed'
                            ? 'bg-white border-emerald-400 text-emerald-950 font-bold ring-1 ring-emerald-300'
                            : 'bg-zinc-100 border-zinc-200 text-zinc-400'
                        } flex items-center gap-2`}>
                          <Radio className={`w-4 h-4 shrink-0 ${
                            camp.operationalStatus === 'Running' || camp.operationalStatus === 'Completed'
                              ? 'text-emerald-600' : 'text-zinc-300'
                          }`} />
                          <span className="text-[11px] leading-tight">3. Running / Live</span>
                        </div>

                        {/* Step 4: Completed */}
                        <div className={`p-2.5 rounded-lg border ${
                          camp.operationalStatus === 'Completed'
                            ? 'bg-white border-zinc-400 text-zinc-950 font-bold'
                            : 'bg-zinc-100 border-zinc-200 text-zinc-400'
                        } flex items-center gap-2`}>
                          <CheckCheck className={`w-4 h-4 shrink-0 ${
                            camp.operationalStatus === 'Completed'
                              ? 'text-zinc-800' : 'text-zinc-300'
                          }`} />
                          <span className="text-[11px] leading-tight">4. Completed</span>
                        </div>
                      </div>
                    </div>

                    {/* Operational Details Grid: Mounting Proofs & Invoice/Settlement */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                      
                      {/* Left Box: Mounting Photo Proofs Status */}
                      <div className="p-3.5 rounded-xl border border-zinc-200 bg-white space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-zinc-400 uppercase">Mounting Photo Proofs</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            camp.mountingProofStatus === 'Verified'
                              ? 'bg-emerald-100 text-emerald-800'
                              : camp.mountingProofStatus === 'Under Audit'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-zinc-100 text-zinc-600'
                          }`}>
                            {camp.mountingProofStatus}
                          </span>
                        </div>

                        {camp.dayPhotoUrl ? (
                          <div className="flex items-center gap-3 pt-1">
                            {/* Day Shot Thumbnail */}
                            <div className="relative group cursor-pointer" onClick={() => setInspectingProofCampaign(camp)}>
                              <img
                                src={camp.dayPhotoUrl}
                                alt="Day Shot"
                                className="w-16 h-12 object-cover rounded-lg border border-zinc-200"
                              />
                              <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[8px] text-center rounded-b-lg font-bold">
                                DAY SHOT
                              </span>
                            </div>

                            {/* Night Shot Thumbnail */}
                            {camp.nightPhotoUrl && (
                              <div className="relative group cursor-pointer" onClick={() => setInspectingProofCampaign(camp)}>
                                <img
                                  src={camp.nightPhotoUrl}
                                  alt="Night Lit Shot"
                                  className="w-16 h-12 object-cover rounded-lg border border-zinc-200"
                                />
                                <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[8px] text-center rounded-b-lg font-bold">
                                  NIGHT LIT
                                </span>
                              </div>
                            )}

                            <div className="space-y-0.5 text-[11px]">
                              <p className="text-zinc-700 font-semibold truncate max-w-[200px]">
                                GPS: {camp.proofGpsCoordinates || 'Geo-verified'}
                              </p>
                              <p className="text-zinc-400 text-[10px]">
                                {camp.proofTimestamp || 'Timestamp attached'}
                              </p>
                              <button
                                onClick={() => setInspectingProofCampaign(camp)}
                                className="text-orange-600 hover:underline font-bold text-[10px] inline-flex items-center gap-0.5"
                              >
                                <Camera className="w-3 h-3" /> Inspect Geo-Proofs
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="py-2 text-zinc-400 text-[11px] italic">
                            Awaiting field crew physical mounting photos (Day & Night illumination).
                          </div>
                        )}
                      </div>

                      {/* Right Box: Invoice Raised & Settlement Status */}
                      <div className="p-3.5 rounded-xl border border-zinc-200 bg-white space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-zinc-400 uppercase">Billing & Escrow Settlement</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            camp.invoiceStatus === 'Invoice Raised'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {camp.invoiceStatus}
                          </span>
                        </div>

                        <div className="space-y-1 pt-1">
                          <div className="flex justify-between items-center">
                            <span className="text-zinc-500">Provider Invoice:</span>
                            <strong className="text-zinc-900">{camp.invoiceNumber || 'Pending Submission'}</strong>
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-zinc-500">Invoice Amount:</span>
                            <strong className="text-zinc-950 font-sans text-sm">
                              {camp.invoiceAmount ? `₹${camp.invoiceAmount.toLocaleString('en-IN')}` : '—'}
                            </strong>
                          </div>

                          <div className="flex justify-between items-center pt-1 border-t border-zinc-100">
                            <span className="text-zinc-500">Escrow Payout:</span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              camp.settlementStatus === 'Settlement Released'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}>
                              {camp.settlementStatus}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Operational Action Controls Footer */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-zinc-100">
                      <div className="text-xs text-zinc-500 font-mono">
                        Provider ID: <strong>{camp.providerId}</strong> • Contract Ref: <strong>{camp.id}</strong>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Step Advance Action */}
                        {camp.operationalStatus === 'Booking Confirmed' && (
                          <button
                            onClick={() => handleAdvanceCampaignStatus(camp.id)}
                            className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-2xs font-sans"
                          >
                            <Clock className="w-3.5 h-3.5" />
                            <span>Move to Campaign</span>
                          </button>
                        )}

                        {camp.operationalStatus === 'Moved to Campaign' && (
                          <button
                            onClick={() => handleAdvanceCampaignStatus(camp.id)}
                            className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-2xs font-sans"
                          >
                            <Radio className="w-3.5 h-3.5" />
                            <span>Verify Proofs & Mark Running</span>
                          </button>
                        )}

                        {camp.operationalStatus === 'Running' && (
                          <button
                            onClick={() => handleAdvanceCampaignStatus(camp.id)}
                            className="px-3.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-black text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-2xs font-sans"
                          >
                            <CheckCheck className="w-3.5 h-3.5" />
                            <span>Mark Completed / Dismantled</span>
                          </button>
                        )}

                        {/* Release Settlement Payout */}
                        {camp.settlementStatus !== 'Settlement Released' && camp.invoiceStatus === 'Invoice Raised' && (
                          <button
                            onClick={() => handleReleaseSettlement(camp.id)}
                            className="px-3 py-1.5 rounded-lg border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-xs transition-colors flex items-center gap-1 font-sans"
                          >
                            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Release Escrow (₹{camp.settlementAmount.toLocaleString('en-IN')})</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {filteredCampaigns.length === 0 && (
                  <div className="p-8 text-center bg-white rounded-2xl border border-zinc-200">
                    <Radio className="w-8 h-8 text-zinc-300 mx-auto" />
                    <p className="text-sm font-semibold text-zinc-700 mt-2">No hoarding campaigns found</p>
                    <p className="text-xs text-zinc-400">
                      No campaigns match the selected operational stage or search query.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 7. ACTIVITY & AUDIT LOGS SECTION                          */}
          {/* ========================================================= */}
          {activeSection === 'audit' && (
            <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <div>
                  <h3 className="text-base font-bold text-zinc-950">Provider Activity & Audit Trail</h3>
                  <p className="text-xs text-zinc-500 mt-0.5">Chronological log of administrative actions, compliance changes, and billing.</p>
                </div>
                <span className="text-xs font-mono text-zinc-400">Immutable Log</span>
              </div>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-zinc-200">
                <div className="relative space-y-1">
                  <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-white" />
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-zinc-900">Subscription Renewed & Paid</span>
                    <span className="text-[10px] font-mono text-zinc-400">2026-04-12 11:24</span>
                  </div>
                  <p className="text-xs text-zinc-600">
                    Annual payment captured via Gateway (₹5,89,988.20 including 18% GST). Invoice INV-2026-0891 generated.
                  </p>
                </div>

                <div className="relative space-y-1">
                  <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-orange-500 ring-4 ring-white" />
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-zinc-900">KYC Documents Audited</span>
                    <span className="text-[10px] font-mono text-zinc-400">2025-04-13 15:40</span>
                  </div>
                  <p className="text-xs text-zinc-600">
                    Admin Compliance Officer approved GST Certificate REG-06 and Bank Mandate.
                  </p>
                </div>

                <div className="relative space-y-1">
                  <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-zinc-400 ring-4 ring-white" />
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-zinc-900">Enterprise Onboarding Initiated</span>
                    <span className="text-[10px] font-mono text-zinc-400">{provider.joinedDate}</span>
                  </div>
                  <p className="text-xs text-zinc-600">
                    Provider entity account registered under {provider.legalEntity}.
                  </p>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ========================================================= */}
      {/* MODAL: OFFICIAL INDIAN GST TAX INVOICE (SAC 998315)       */}
      {/* ========================================================= */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-orange-600" />
                <h3 className="text-lg font-bold text-zinc-950 font-mono">
                  TAX INVOICE — {selectedInvoice.id}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-100 text-zinc-700 font-semibold text-xs flex items-center gap-1.5 font-mono"
                >
                  <Printer className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Print Receipt</span>
                </button>
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-zinc-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Invoice Printable Sheet */}
            <div className="p-6 rounded-xl border border-zinc-200 bg-zinc-50/50 space-y-6 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <span className="font-extrabold text-base text-zinc-950 font-mono tracking-tight">
                    SODAARS TECHNOLOGIES INDIA PVT LTD
                  </span>
                  <p className="text-zinc-600 mt-1">Level 7, OOH Tower, Bandra Kurla Complex (BKC)</p>
                  <p className="text-zinc-600">Mumbai, Maharashtra - 400051</p>
                  <p className="font-mono text-zinc-700 mt-1">
                    GSTIN: <strong className="text-zinc-950">27AABCS9912Q1ZX</strong>
                  </p>
                  <p className="font-mono text-zinc-500 text-[11px]">CIN: U74300MH2025PTC399120</p>
                </div>

                <div className="text-left sm:text-right space-y-1 font-mono">
                  <div className="text-sm font-bold text-zinc-950">TAX INVOICE</div>
                  <div className="text-orange-600 font-bold">{selectedInvoice.id}</div>
                  <div className="text-zinc-500">Date: {selectedInvoice.paymentDate}</div>
                  <div className="text-zinc-500">SAC: {selectedInvoice.sacCode}</div>
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-white border border-zinc-200 space-y-1">
                <span className="text-[10px] font-mono uppercase font-bold text-zinc-400">Billed To (Media Provider)</span>
                <p className="font-bold text-zinc-900 text-sm">{selectedInvoice.legalEntity}</p>
                <p className="text-zinc-600">{selectedInvoice.city}, {selectedInvoice.state}</p>
                <p className="font-mono text-zinc-700">GSTIN: <strong className="text-orange-600">{selectedInvoice.gstin}</strong></p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-zinc-300 font-mono uppercase text-[10px] text-zinc-500">
                      <th className="py-2">Description / Package Service</th>
                      <th className="py-2">Billing Cycle</th>
                      <th className="py-2">SAC Code</th>
                      <th className="py-2 text-right">Taxable Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 font-mono">
                    <tr>
                      <td className="py-3 font-semibold text-zinc-900 font-sans">
                        {selectedInvoice.planName}
                        <span className="block text-[11px] text-zinc-500 font-normal">
                          Service Period: {selectedInvoice.periodStart} to {selectedInvoice.periodEnd}
                        </span>
                      </td>
                      <td className="py-3">{selectedInvoice.billingCycle}</td>
                      <td className="py-3">{selectedInvoice.sacCode}</td>
                      <td className="py-3 text-right">₹{selectedInvoice.baseAmount.toLocaleString('en-IN')}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="pt-3 border-t border-zinc-300 flex justify-end">
                <div className="w-72 space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between text-zinc-600">
                    <span>Taxable Base Value:</span>
                    <span>₹{selectedInvoice.baseAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-zinc-600">
                    <span>CGST (9.0%):</span>
                    <span>₹{(selectedInvoice.gstAmount / 2).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-zinc-600">
                    <span>SGST (9.0%):</span>
                    <span>₹{(selectedInvoice.gstAmount / 2).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-zinc-300 text-sm font-bold text-zinc-950">
                    <span>Total Amount Paid:</span>
                    <span className="text-orange-600 font-sans font-extrabold">
                      ₹{selectedInvoice.totalAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-emerald-950 block">Payment Captured</span>
                  <span className="text-[11px] text-emerald-800 font-mono">
                    Ref: {selectedInvoice.paymentRef} • Method: {selectedInvoice.paymentMethod}
                  </span>
                </div>
                <span className="px-3 py-1 rounded bg-emerald-600 text-white font-mono font-bold text-xs">
                  PAID IN FULL
                </span>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedInvoice(null)}
                className="px-5 py-2 rounded-lg bg-zinc-900 text-white text-xs font-semibold"
              >
                Close Tax Invoice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: DOCUMENT PREVIEW                                   */}
      {/* ========================================================= */}
      {viewingDoc && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-orange-600" />
                <h3 className="text-base font-bold text-zinc-950">{viewingDoc.name}</h3>
              </div>
              <button
                onClick={() => setViewingDoc(null)}
                className="p-1 rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-zinc-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 rounded-xl bg-zinc-100 border border-dashed border-zinc-300 text-center space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-white shadow-xs mx-auto flex items-center justify-center text-orange-600">
                <FileText className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-bold text-zinc-900 text-sm">{viewingDoc.fileName}</h4>
                <p className="text-xs text-zinc-500 font-mono mt-0.5">Size: {viewingDoc.fileSize} • Uploaded: {viewingDoc.uploadedAt}</p>
              </div>
              <div className="inline-block px-3 py-1 rounded bg-zinc-200 text-zinc-700 font-mono text-[11px] font-semibold">
                Status: {viewingDoc.status.toUpperCase()}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-zinc-500 font-mono">Government Statutory Compliance Document</span>
              <button
                onClick={() => setViewingDoc(null)}
                className="px-4 py-2 rounded-lg bg-zinc-900 text-white text-xs font-semibold"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: REJECT KYC DOCUMENT WITH REASON                    */}
      {/* ========================================================= */}
      {rejectReasonModalDoc && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <h3 className="text-base font-bold text-zinc-950">Reject KYC Document</h3>
              </div>
              <button
                onClick={() => setRejectReasonModalDoc(null)}
                className="p-1 rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-zinc-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-zinc-600">
              Specify the reason for rejecting <strong>{rejectReasonModalDoc.name}</strong>. The provider will receive an automated notification to re-upload.
            </p>

            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-700">Rejection Reason</label>
              <textarea
                value={rejectionReasonText}
                onChange={(e) => setRejectionReasonText(e.target.value)}
                placeholder="e.g. Municipal seal is blurry; address does not match registered GSTIN..."
                rows={3}
                className="w-full text-xs p-3 rounded-lg border border-zinc-300 focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setRejectReasonModalDoc(null)}
                className="px-4 py-2 rounded-lg border border-zinc-200 hover:bg-zinc-50 text-xs font-semibold text-zinc-700"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRejectDoc}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: INSPECT BOOKING DETAILS                            */}
      {/* ========================================================= */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-orange-600" />
                <h3 className="text-base font-bold text-zinc-950 font-sans">
                  Booking Contract: {selectedBooking.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-1 rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-zinc-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono uppercase font-bold text-zinc-400">Booking Channel</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                    selectedBooking.source === 'Marketplace' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {selectedBooking.source}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-zinc-950 font-sans pt-1">{selectedBooking.companyName}</h4>
                <p className="text-zinc-600">Client: {selectedBooking.customerName} • {selectedBooking.contactPhone}</p>
                <p className="text-zinc-500 font-mono">{selectedBooking.contactEmail}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 font-mono">
                <div className="p-3 rounded-lg border border-zinc-200">
                  <span className="text-[10px] uppercase font-bold text-zinc-400 block">Flight Start Date</span>
                  <strong className="text-zinc-900 block">{selectedBooking.startDate}</strong>
                </div>
                <div className="p-3 rounded-lg border border-zinc-200">
                  <span className="text-[10px] uppercase font-bold text-zinc-400 block">Flight End Date</span>
                  <strong className="text-zinc-900 block">{selectedBooking.endDate}</strong>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 space-y-1.5 font-mono">
                <div className="flex justify-between text-zinc-600">
                  <span>Gross Contract Value:</span>
                  <strong className="text-zinc-950 font-sans">₹{selectedBooking.contractValue.toLocaleString('en-IN')}</strong>
                </div>
                {selectedBooking.markupAmount && (
                  <div className="flex justify-between text-blue-600">
                    <span>SODAARS Platform Commission:</span>
                    <span>₹{selectedBooking.markupAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between pt-1 border-t border-zinc-200 text-emerald-700 font-bold">
                  <span>Net Provider Payout:</span>
                  <span className="font-sans text-sm">₹{(selectedBooking.sodaarsNetPayout || selectedBooking.contractValue).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedBooking(null)}
                className="px-4 py-2 rounded-lg bg-zinc-900 text-white text-xs font-semibold"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: INSPECT GEOTAGGED MOUNTING PHOTO PROOFS             */}
      {/* ========================================================= */}
      {inspectingProofCampaign && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-orange-600" />
                <div>
                  <h3 className="text-base font-bold text-zinc-950 font-sans">
                    Mounting Verification Proof — {inspectingProofCampaign.resourceCode}
                  </h3>
                  <p className="text-xs text-zinc-500">{inspectingProofCampaign.campaignTitle}</p>
                </div>
              </div>
              <button
                onClick={() => setInspectingProofCampaign(null)}
                className="p-1 rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-zinc-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Side-by-Side Day and Night Proof Photos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Day Shot */}
              <div className="space-y-2">
                <div className="relative rounded-xl overflow-hidden border border-zinc-300 aspect-video bg-zinc-900">
                  {inspectingProofCampaign.dayPhotoUrl ? (
                    <img
                      src={inspectingProofCampaign.dayPhotoUrl}
                      alt="Day Shot Verification"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-500 text-xs">
                      No Day Shot Uploaded
                    </div>
                  )}
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 text-white font-mono text-[10px] font-bold">
                    DAY SHOT PROOF
                  </span>
                </div>
                <p className="text-[11px] font-mono text-zinc-500">
                  Clarity inspection: Flex tension, border alignment, banner clean.
                </p>
              </div>

              {/* Night Lit Shot */}
              <div className="space-y-2">
                <div className="relative rounded-xl overflow-hidden border border-zinc-300 aspect-video bg-zinc-900">
                  {inspectingProofCampaign.nightPhotoUrl ? (
                    <img
                      src={inspectingProofCampaign.nightPhotoUrl}
                      alt="Night Lit Shot Verification"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-500 text-xs">
                      No Night Lit Shot Uploaded
                    </div>
                  )}
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 text-white font-mono text-[10px] font-bold">
                    NIGHT ILLUMINATION SHOT
                  </span>
                </div>
                <p className="text-[11px] font-mono text-zinc-500">
                  Lighting check: Floodlight / backlight active, zero dark spots.
                </p>
              </div>
            </div>

            {/* Geotag Metadata & Audit Checklist */}
            <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-2 text-xs font-mono">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-zinc-700">
                <div>
                  <span className="text-[10px] uppercase font-bold text-zinc-400 block">GPS Coordinates</span>
                  <strong>{inspectingProofCampaign.proofGpsCoordinates || '19.0657° N, 72.8687° E (Mumbai)'}</strong>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-zinc-400 block">Capture Timestamp</span>
                  <strong>{inspectingProofCampaign.proofTimestamp || '2026-10-01 19:42:10 IST'}</strong>
                </div>
              </div>

              {inspectingProofCampaign.verifiedBy && (
                <div className="pt-2 border-t border-zinc-200 text-emerald-700 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Audited & Approved by {inspectingProofCampaign.verifiedBy} on {inspectingProofCampaign.verifiedAt}</span>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-zinc-500 font-mono">Proof status: <strong>{inspectingProofCampaign.mountingProofStatus}</strong></span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setInspectingProofCampaign(null)}
                  className="px-4 py-2 rounded-lg border border-zinc-200 text-zinc-700 text-xs font-semibold hover:bg-zinc-50"
                >
                  Close
                </button>

                {inspectingProofCampaign.mountingProofStatus !== 'Verified' && (
                  <button
                    onClick={() => handleApproveProofModal(inspectingProofCampaign.id)}
                    className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
                  >
                    <Check className="w-4 h-4" />
                    <span>Approve Mounting & Mark Running</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
