import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Plus,
  Calendar,
  Layers,
  Camera,
  BarChart3,
  Receipt,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Landmark,
  TrendingUp,
  MapPin,
  ExternalLink,
  ChevronRight,
  IndianRupee,
  FileText,
} from 'lucide-react';
import { SAMPLE_RESOURCES } from '../data/sampleInventory';
import { SAMPLE_BOOKINGS } from '../data/sampleBookings';
import { SAMPLE_CAMPAIGNS } from '../data/sampleCampaigns';
import { SAMPLE_INVOICE_RECORDS } from '../data/sampleFinance';
import {
  BOOKING_SOURCE_CONFIG,
  BOOKING_STATUS_CONFIG,
} from '../types/booking';
import { AdvertisingResource } from '../types/resource';

export const DashboardPage: React.FC = () => {
  // 1. DYNAMIC INVENTORY & OCCUPANCY METRICS
  const totalAssets = SAMPLE_RESOURCES.length; // 450
  const activeAssets = SAMPLE_RESOURCES.filter((res: AdvertisingResource) => res.status === 'Active').length;
  const maintenanceCount = totalAssets - activeAssets;
  const bookedCount = Math.round(activeAssets * 0.65);
  const holdCount = Math.round(activeAssets * 0.10);
  const availableCount = Math.max(0, activeAssets - bookedCount - holdCount);
  const occupancyPercentage = Math.round(((bookedCount + holdCount) / totalAssets) * 100);

  // 2. DYNAMIC BOOKINGS & CAMPAIGNS
  const recentBookings = SAMPLE_BOOKINGS.slice(0, 5);
  const activeCampaigns = SAMPLE_CAMPAIGNS.slice(0, 4);

  // 3. DYNAMIC FINANCE SUMMARY
  const totalInvoicedMtd = SAMPLE_INVOICE_RECORDS.reduce((sum, inv) => sum + inv.totalAmount, 0);
  const totalPaidMtd = SAMPLE_INVOICE_RECORDS.reduce((sum, inv) => sum + inv.paidAmount, 0);
  const totalPendingAr = SAMPLE_INVOICE_RECORDS.reduce((sum, inv) => sum + inv.balanceDue, 0);
  const collectionPercentage = Math.round((totalPaidMtd / totalInvoicedMtd) * 100);

  // Heatmap week toggle & monthly hover
  const [occupancyPeriod, setOccupancyPeriod] = useState<'last12' | 'next12'>('last12');
  const [hoveredMonth, setHoveredMonth] = useState<number | null>(9); // Default Oct (index 9)

  // Monthly Confirmed Revenue (in Lakhs) for 2026
  const monthlyRevenue = [
    { month: 'Jan', revenue: 26.5, label: '₹26.5L' },
    { month: 'Feb', revenue: 29.2, label: '₹29.2L' },
    { month: 'Mar', revenue: 34.8, label: '₹34.8L' },
    { month: 'Apr', revenue: 31.4, label: '₹31.4L' },
    { month: 'May', revenue: 37.9, label: '₹37.9L' },
    { month: 'Jun', revenue: 41.2, label: '₹41.2L' },
    { month: 'Jul', revenue: 39.5, label: '₹39.5L' },
    { month: 'Aug', revenue: 43.8, label: '₹43.8L' },
    { month: 'Sep', revenue: 46.1, label: '₹46.1L' },
    { month: 'Oct', revenue: 48.6, label: '₹48.6L', current: true },
    { month: 'Nov', revenue: 52.0, label: '₹52.0L', projected: true },
    { month: 'Dec', revenue: 58.4, label: '₹58.4L', projected: true },
  ];

  // 12 Weeks Utilization Data
  const last12WeeksData = [
    { week: 'W32', percent: 62 },
    { week: 'W33', percent: 64 },
    { week: 'W34', percent: 65 },
    { week: 'W35', percent: 67 },
    { week: 'W36', percent: 66 },
    { week: 'W37', percent: 68 },
    { week: 'W38', percent: 70 },
    { week: 'W39', percent: 69 },
    { week: 'W40', percent: 71 },
    { week: 'W41', percent: 70 },
    { week: 'W42', percent: 72 },
    { week: 'W43', percent: 74 },
  ];

  const next12WeeksData = [
    { week: 'W44', percent: 75 },
    { week: 'W45', percent: 73 },
    { week: 'W46', percent: 70 },
    { week: 'W47', percent: 68 },
    { week: 'W48', percent: 66 },
    { week: 'W49', percent: 69 },
    { week: 'W50', percent: 74 },
    { week: 'W51', percent: 78 },
    { week: 'W52', percent: 82 },
    { week: 'W01', percent: 67 },
    { week: 'W02', percent: 65 },
    { week: 'W03', percent: 63 },
  ];

  // 4. ACTION REQUIRED COUNTERS
  const actionItems = [
    {
      id: 'act-1',
      title: '1 Booking Awaiting Confirmation',
      desc: 'BKG-2026-006 (Publicis Media) waiting for provider confirmation sign-off.',
      urgency: 'HIGH',
      badge: 'Immediate Action',
      icon: AlertCircle,
      iconColor: 'text-[#EA580C]',
      bgColor: 'bg-orange-50/70 border-orange-200',
      actionText: 'Review Booking',
      link: '/panel/bookings',
    },
    {
      id: 'act-2',
      title: '1 Campaign Missing POP Night Proof',
      desc: 'CMP-2026-002 (Samsung Electronics) flex mounted today. Awaiting night illumination photos.',
      urgency: 'MEDIUM',
      badge: 'Escrow Lock',
      icon: Camera,
      iconColor: 'text-amber-600',
      bgColor: 'bg-amber-50/70 border-amber-200',
      actionText: 'Upload Proof',
      link: '/panel/campaigns',
    },
    {
      id: 'act-3',
      title: '3 Client Invoices Overdue',
      desc: '₹14,08,900 pending from Titan Retail, Kalyan Jewellers & BYJU’S beyond credit period.',
      urgency: 'MEDIUM',
      badge: 'A/R Alert',
      icon: Receipt,
      iconColor: 'text-rose-600',
      bgColor: 'bg-rose-50/70 border-rose-200',
      actionText: 'View Invoices',
      link: '/panel/finance',
    },
    {
      id: 'act-4',
      title: '2 Media Assets Freeing Up in 7 Days',
      desc: 'Western Express Highway & Juhu Unipoles expiring on 17 Oct 2026. Ready for renewal pitch.',
      urgency: 'INFO',
      badge: 'Upcoming Expiry',
      icon: Calendar,
      iconColor: 'text-indigo-600',
      bgColor: 'bg-indigo-50/70 border-indigo-200',
      actionText: 'Check Calendar',
      link: '/panel/availability',
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 space-y-7">
      {/* ========================================================================= */}
      {/* 1. DASHBOARD HEADER & WELCOME STRIP                                       */}
      {/* ========================================================================= */}
      <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-5 border-b border-[#E2E8F0]">
        <div className="flex flex-col gap-1 max-w-3xl">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#E11D2E] bg-red-50 px-2 py-0.5 rounded border border-red-200">
              OPERATING SYSTEM • PROVIDER CONSOLE
            </span>
            <span className="text-xs text-[#64748B]">Live Network Status: Normal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1A2435] tracking-tight">
            Executive Operations Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-[#475569]">
            Real-time capacity utilization, booking requests, campaign proof verification, and financial realization.
          </p>
        </div>

        {/* Quick Top Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          <Link to="/panel/bookings/create">
            <button className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white border border-[#CBD5E1] text-[#1A2435] hover:bg-[#F4F6F8] transition-colors shadow-2xs text-xs font-semibold cursor-pointer">
              <Plus size={14} className="text-[#E11D2E]" />
              <span>Create Booking</span>
            </button>
          </Link>
          <Link to="/panel/resources">
            <button className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#E11D2E] text-white hover:bg-[#C51323] transition-colors shadow-xs text-xs font-semibold cursor-pointer">
              <Plus size={14} />
              <span>Add Resource</span>
            </button>
          </Link>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. REFINED 5 MINIMALIST KPI CARDS (CLEAN HOARDSPACE STYLE)                */}
      {/* ========================================================================= */}
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* 1. Confirmed Revenue */}
        <div className="bg-white rounded-xl p-4 border border-[#E5E5E5] shadow-xs flex flex-col justify-between hover:border-stone-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373]">
              REVENUE (MTD)
            </span>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
              <IndianRupee size={14} />
            </div>
          </div>
          <div className="my-2.5">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#171717] leading-none">
              ₹48.6L
            </div>
            <div className="text-[11px] text-emerald-600 mt-1 font-semibold flex items-center gap-1">
              <span>+8.4% MoM</span>
              <span className="text-[#A3A3A3] font-normal">• 257 Bookings</span>
            </div>
          </div>
          <Link
            to="/panel/finance"
            className="text-[11px] font-semibold text-[#EA580C] hover:underline flex items-center gap-1"
          >
            <span>Finance &amp; Ledger</span>
            <ArrowRight size={11} />
          </Link>
        </div>

        {/* 2. Active Hoardings */}
        <div className="bg-white rounded-xl p-4 border border-[#E5E5E5] shadow-xs flex flex-col justify-between hover:border-stone-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373]">
              ACTIVE HOARDINGS
            </span>
            <div className="p-1.5 rounded-lg bg-stone-100 text-[#171717] border border-stone-200">
              <Layers size={14} />
            </div>
          </div>
          <div className="my-2.5">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#171717] leading-none">
              {activeAssets}
            </div>
            <div className="text-[11px] text-[#737373] mt-1 font-medium">
              88% of {totalAssets} Total Fleet
            </div>
          </div>
          <Link
            to="/panel/resources"
            className="text-[11px] font-semibold text-[#EA580C] hover:underline flex items-center gap-1"
          >
            <span>My Inventory</span>
            <ArrowRight size={11} />
          </Link>
        </div>

        {/* 3. Confirmed Occupancy */}
        <div className="bg-white rounded-xl p-4 border border-[#E5E5E5] shadow-xs flex flex-col justify-between hover:border-stone-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373]">
              FLEET OCCUPANCY
            </span>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
              <TrendingUp size={14} />
            </div>
          </div>
          <div className="my-2.5">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#171717] leading-none">
              {occupancyPercentage}%
            </div>
            <div className="text-[11px] text-emerald-600 mt-1 font-semibold flex items-center gap-1">
              <span>{bookedCount + holdCount} Units</span>
              <span className="text-[#A3A3A3] font-normal">• {availableCount} Vacant</span>
            </div>
          </div>
          <Link
            to="/panel/availability"
            className="text-[11px] font-semibold text-[#EA580C] hover:underline flex items-center gap-1"
          >
            <span>Availability Engine</span>
            <ArrowRight size={11} />
          </Link>
        </div>

        {/* 4. Quotations in Pipeline */}
        <div className="bg-white rounded-xl p-4 border border-[#E5E5E5] shadow-xs flex flex-col justify-between hover:border-stone-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373]">
              QUOTATIONS
            </span>
            <div className="p-1.5 rounded-lg bg-orange-50 text-[#EA580C] border border-orange-200">
              <FileText size={14} />
            </div>
          </div>
          <div className="my-2.5">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#171717] leading-none">
              14
            </div>
            <div className="text-[11px] text-[#EA580C] mt-1 font-semibold flex items-center gap-1">
              <span>₹24.8L Pipeline</span>
              <span className="text-[#A3A3A3] font-normal">• Soft Holds</span>
            </div>
          </div>
          <Link
            to="/panel/bookings?view=quotations"
            className="text-[11px] font-semibold text-[#EA580C] hover:underline flex items-center gap-1"
          >
            <span>Quotations Ledger</span>
            <ArrowRight size={11} />
          </Link>
        </div>

        {/* 5. Invoices & Pending AR */}
        <div className="bg-white rounded-xl p-4 border border-[#E5E5E5] shadow-xs flex flex-col justify-between hover:border-stone-300 transition-all col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373]">
              PENDING INVOICES
            </span>
            <div className="p-1.5 rounded-lg bg-rose-50 text-rose-700 border border-rose-200">
              <Receipt size={14} />
            </div>
          </div>
          <div className="my-2.5">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#171717] leading-none">
              ₹{(totalPendingAr / 100000).toFixed(1)}L
            </div>
            <div className="text-[11px] text-rose-600 mt-1 font-semibold">
              3 Invoices Overdue
            </div>
          </div>
          <Link
            to="/panel/finance"
            className="text-[11px] font-semibold text-[#EA580C] hover:underline flex items-center gap-1"
          >
            <span>View Invoices</span>
            <ArrowRight size={11} />
          </Link>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. METRICS COMPARISON (MONTHLY REVENUE CURVE) + QUICK ACTIONS & BOOKINGS  */}
      {/* ========================================================================= */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Monthly Confirmed Revenue Trend (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-xl p-5 border border-[#E5E5E5] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E5]">
              <div>
                <h3 className="text-sm font-bold text-[#171717]">
                  Metrics Comparison
                </h3>
                <p className="text-xs text-[#737373] mt-0.5">
                  Confirmed revenue by month (2026)
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-stone-100 text-[#171717] border border-stone-200">
                  Total Confirmed: ₹4.28 Cr YTD
                </span>
              </div>
            </div>

            {/* Interactive SVG Revenue Curve */}
            <div className="pt-4 pb-2">
              <div className="h-44 w-full relative">
                <svg
                  viewBox="0 0 650 160"
                  className="w-full h-full overflow-visible"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#E11D2E" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#E11D2E" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal grid lines */}
                  <line x1="30" y1="20" x2="620" y2="20" stroke="#F4F6F8" strokeDasharray="3 3" />
                  <line x1="30" y1="65" x2="620" y2="65" stroke="#F4F6F8" strokeDasharray="3 3" />
                  <line x1="30" y1="110" x2="620" y2="110" stroke="#F4F6F8" strokeDasharray="3 3" />
                  <line x1="30" y1="145" x2="620" y2="145" stroke="#E2E8F0" />

                  {/* SVG Area & Smooth Curve */}
                  {(() => {
                    const points = monthlyRevenue.map((d, i) => {
                      const x = 40 + i * 51.5;
                      const y = 140 - ((d.revenue - 20) / 45) * 115;
                      return { x, y, ...d };
                    });

                    const lineD = points.reduce((acc, p, idx) => {
                      return idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
                    }, '');

                    const areaD = `${lineD} L ${points[points.length - 1].x} 145 L ${points[0].x} 145 Z`;

                    return (
                      <>
                        {/* Shaded Area */}
                        <path d={areaD} fill="url(#revenueGradient)" />

                        {/* Stroke Line */}
                        <path
                          d={lineD}
                          fill="none"
                          stroke="#E11D2E"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />

                        {/* Interactive Data Dots */}
                        {points.map((p, idx) => {
                          const isHovered = hoveredMonth === idx;
                          const isCurrent = p.current;
                          return (
                            <g
                              key={p.month}
                              onMouseEnter={() => setHoveredMonth(idx)}
                              className="cursor-pointer"
                            >
                              <circle
                                cx={p.x}
                                cy={p.y}
                                r={isHovered ? 6 : isCurrent ? 5 : 3.5}
                                fill={isCurrent ? '#E11D2E' : '#FFFFFF'}
                                stroke={isCurrent ? '#FFFFFF' : '#E11D2E'}
                                strokeWidth={isHovered ? 2.5 : 2}
                                className="transition-all duration-150"
                              />
                            </g>
                          );
                        })}
                      </>
                    );
                  })()}
                </svg>
              </div>

              {/* Month X-Axis Labels */}
              <div className="flex justify-between text-[11px] font-mono text-[#737373] px-2 pt-1">
                {monthlyRevenue.map((m, idx) => (
                  <button
                    key={m.month}
                    onClick={() => setHoveredMonth(idx)}
                    className={`px-1 py-0.5 rounded transition-colors ${
                      hoveredMonth === idx
                        ? 'text-[#EA580C] font-bold bg-orange-50'
                        : 'hover:text-[#171717]'
                    }`}
                  >
                    {m.month}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Active Month Readout Banner */}
          {hoveredMonth !== null && (
            <div className="mt-3 pt-3 border-t border-[#E5E5E5] flex items-center justify-between text-xs">
              <span className="text-[#525252]">
                Selected Month:{' '}
                <strong className="text-[#171717]">
                  {monthlyRevenue[hoveredMonth].month} 2026
                </strong>
                {monthlyRevenue[hoveredMonth].current && (
                  <span className="ml-2 text-[10px] bg-orange-100 text-[#EA580C] px-1.5 py-0.2 rounded font-bold">
                    Active Flight
                  </span>
                )}
              </span>
              <span className="font-mono font-bold text-[#EA580C] text-sm">
                Confirmed: {monthlyRevenue[hoveredMonth].label}
              </span>
            </div>
          )}
        </div>

        {/* Right: Quick Actions & Recent Bookings (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-xl p-5 border border-[#E5E5E5] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E5]">
              <h3 className="text-sm font-bold text-[#171717]">
                Quick Actions
              </h3>
              <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-stone-100 text-[#525252] border border-stone-200">
                MD ARTS
              </span>
            </div>

            {/* Action Buttons Strip */}
            <div className="grid grid-cols-2 gap-2 mt-3 mb-4">
              <Link
                to="/panel/bookings/create?type=quotation"
                className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-red-50 hover:bg-red-100 text-[#E11D2E] border border-red-200 font-bold text-xs transition-colors"
              >
                <FileText size={13} />
                <span>+ Quotation</span>
              </Link>
              <Link
                to="/panel/bookings/create"
                className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-[#E11D2E] hover:bg-[#C51323] text-white font-bold text-xs transition-colors shadow-2xs"
              >
                <Plus size={13} />
                <span>+ Booking</span>
              </Link>
            </div>

            {/* Recent Bookings Mini List */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373] block">
                Recent Bookings Pipeline
              </span>
              <div className="divide-y divide-[#F5F5F4]">
                {recentBookings.slice(0, 3).map((b) => (
                  <div key={b.id} className="py-2 flex items-center justify-between gap-2">
                    <div className="truncate">
                      <div className="font-bold text-xs text-[#171717] truncate">
                        {b.companyName}
                      </div>
                      <div className="text-[10px] text-[#737373] flex items-center gap-1">
                        <MapPin size={9} className="text-[#EA580C]" />
                        <span className="truncate">{b.resourceName}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-mono font-bold text-xs text-[#171717]">
                        ₹{(parseInt(b.pricing.finalInvoicedAmount || '150000', 10) / 100000).toFixed(1)}L
                      </div>
                      <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                        {b.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#E5E5E5] mt-3">
            <Link
              to="/panel/bookings"
              className="text-xs font-bold text-[#EA580C] hover:underline flex items-center justify-between"
            >
              <span>View All Bookings Console</span>
              <ChevronRight size={13} />
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. OCCUPANCY HEATMAP (CLEAN 12-WEEK BAR CHART LIKE HOARDSPACE)            */}
      {/* ========================================================================= */}
      <section className="bg-white rounded-xl p-5 border border-[#E5E5E5] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E5E5E5]">
          <div>
            <h3 className="text-sm font-bold text-[#171717]">
              Occupancy Heatmap
            </h3>
            <p className="text-xs text-[#737373] mt-0.5">
              Utilization across all {totalAssets} active listings
            </p>
          </div>

          {/* Average Badge and 12-Week Toggle */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold font-mono px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
              Avg {occupancyPercentage}%
            </span>
            <div className="inline-flex rounded-lg border border-[#E5E5E5] p-0.5 bg-[#FAFAF9]">
              <button
                type="button"
                onClick={() => setOccupancyPeriod('last12')}
                className={`px-2.5 py-1 text-xs font-bold rounded-md transition-colors ${
                  occupancyPeriod === 'last12'
                    ? 'bg-[#171717] text-white shadow-xs'
                    : 'text-[#737373] hover:text-[#171717]'
                }`}
              >
                Last 12 Weeks
              </button>
              <button
                type="button"
                onClick={() => setOccupancyPeriod('next12')}
                className={`px-2.5 py-1 text-xs font-bold rounded-md transition-colors ${
                  occupancyPeriod === 'next12'
                    ? 'bg-[#171717] text-white shadow-xs'
                    : 'text-[#737373] hover:text-[#171717]'
                }`}
              >
                Next 12 Weeks
              </button>
            </div>
          </div>
        </div>

        {/* 12-Week Bars */}
        <div className="pt-5 pb-1">
          <div className="grid grid-cols-12 gap-2 sm:gap-3 items-end h-32">
            {(occupancyPeriod === 'last12' ? last12WeeksData : next12WeeksData).map((item) => (
              <div key={item.week} className="flex flex-col items-center h-full justify-end group">
                {/* Percentage label */}
                <span className="text-[10px] font-mono font-bold text-[#737373] group-hover:text-[#EA580C] mb-1 transition-colors">
                  {item.percent}%
                </span>
                {/* Bar */}
                <div className="w-full bg-[#F5F5F4] rounded-t-md h-24 flex items-end overflow-hidden p-0.5">
                  <div
                    style={{ height: `${item.percent}%` }}
                    className="w-full bg-[#EA580C] hover:bg-[#C2410C] rounded-t transition-all duration-300"
                    title={`${item.week}: ${item.percent}% Occupied`}
                  />
                </div>
                {/* Week text */}
                <span className="text-[10px] font-mono text-[#737373] mt-1.5 font-medium">
                  {item.week}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. CAPACITY DISTRIBUTION TRACK & ACTION REQUIRED CENTER                   */}
      {/* ========================================================================= */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Urgent Attention Center (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl p-5 border border-[#E5E5E5] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3.5 border-b border-[#E5E5E5]">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#EA580C] animate-pulse" />
                <h2 className="text-sm font-bold text-[#171717]">
                  Action Required • Operational Attention Center
                </h2>
              </div>
              <span className="text-[11px] font-mono text-[#737373] bg-[#F5F5F4] px-2 py-0.5 rounded border border-[#E5E5E5]">
                {actionItems.length} Urgent Tasks
              </span>
            </div>

            <div className="divide-y divide-[#E5E5E5] mt-1">
              {actionItems.map((act) => {
                const Icon = act.icon;
                return (
                  <div
                    key={act.id}
                    className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 hover:bg-[#FAFAF9]/60 px-2 rounded-lg transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg shrink-0 border mt-0.5 sm:mt-0 ${act.bgColor}`}>
                        <Icon size={15} className={act.iconColor} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-[#171717]">{act.title}</h4>
                          <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-stone-100 text-[#525252] border border-stone-200">
                            {act.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#525252] mt-0.5 leading-relaxed">
                          {act.desc}
                        </p>
                      </div>
                    </div>

                    <Link to={act.link} className="shrink-0 pl-11 sm:pl-0">
                      <button className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-[#EA580C] hover:text-[#C2410C] hover:bg-orange-50 rounded transition-colors cursor-pointer border border-orange-200">
                        <span>{act.actionText}</span>
                        <ChevronRight size={13} />
                      </button>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-[#E5E5E5] flex items-center justify-between text-[11px] text-[#737373]">
            <span>Automated checks active across bookings, campaigns &amp; finance</span>
            <span className="font-mono text-[#171717] font-semibold">100% Up to date</span>
          </div>
        </div>

        {/* Right: Capacity Track & Breakdown (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl p-5 border border-[#E5E5E5] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3.5 border-b border-[#E5E5E5]">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373]">
                  INVENTORY STATUS
                </span>
                <h3 className="text-sm font-bold text-[#171717] mt-0.5">
                  Capacity Distribution ({totalAssets} Units)
                </h3>
              </div>
              <Link
                to="/panel/availability"
                className="text-[11px] font-semibold text-[#EA580C] hover:underline flex items-center gap-1"
              >
                <span>Calendar View</span>
                <ArrowRight size={11} />
              </Link>
            </div>

            {/* Segmented Color Track Bar */}
            <div className="my-4">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-[#525252] font-medium">Fleet Distribution</span>
                <span className="font-mono font-bold text-[#171717]">{totalAssets} Units Registered</span>
              </div>
              <div className="w-full h-3 rounded-full bg-[#F5F5F4] overflow-hidden flex shadow-inner">
                {/* Booked (Dark) */}
                <div
                  style={{ width: `${(bookedCount / totalAssets) * 100}%` }}
                  className="bg-[#171717] h-full"
                  title={`Booked: ${bookedCount} Units`}
                />
                {/* Hold (Amber) */}
                <div
                  style={{ width: `${(holdCount / totalAssets) * 100}%` }}
                  className="bg-amber-500 h-full"
                  title={`On Hold: ${holdCount} Units`}
                />
                {/* Maintenance (Orange) */}
                <div
                  style={{ width: `${(maintenanceCount / totalAssets) * 100}%` }}
                  className="bg-orange-500 h-full"
                  title={`Maintenance: ${maintenanceCount} Units`}
                />
                {/* Available (Emerald) */}
                <div
                  style={{ width: `${(availableCount / totalAssets) * 100}%` }}
                  className="bg-emerald-500 h-full"
                  title={`Available: ${availableCount} Units`}
                />
              </div>
            </div>

            {/* 4 State Breakdown Tiles */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <div className="p-2.5 rounded-lg bg-[#FAFAF9] border border-[#E5E5E5] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                  <span className="text-xs font-semibold text-[#171717]">Available</span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-xs text-emerald-700">{availableCount} Units</span>
                  <div className="text-[10px] text-[#737373]">Ready to Book</div>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-[#FAFAF9] border border-[#E5E5E5] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#171717] shrink-0" />
                  <span className="text-xs font-semibold text-[#171717]">Booked</span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-xs text-[#171717]">{bookedCount} Units</span>
                  <div className="text-[10px] text-[#737373]">Live Revenue</div>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-[#FAFAF9] border border-[#E5E5E5] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                  <span className="text-xs font-semibold text-[#171717]">Client Hold</span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-xs text-amber-700">{holdCount} Units</span>
                  <div className="text-[10px] text-[#737373]">Under Offer</div>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-[#FAFAF9] border border-[#E5E5E5] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shrink-0" />
                  <span className="text-xs font-semibold text-[#171717]">Maintenance</span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-xs text-orange-700">{maintenanceCount} Units</span>
                  <div className="text-[10px] text-[#737373]">Repair/Audit</div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#E5E5E5] mt-4 flex items-center justify-between text-[11px] text-[#737373]">
            <span>Asset utilization: High (Tier-1 Metro Hubs)</span>
            <Link
              to="/panel/resources"
              className="text-[#EA580C] font-semibold hover:underline"
            >
              Manage Assets →
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. BLOCK 4: LIVE OPERATIONS STREAM (BOOKING PIPELINE + CAMPAIGNS)         */}
      {/* ========================================================================= */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column (7 cols): Recent Bookings Pipeline */}
        <div className="lg:col-span-7 bg-white rounded-xl p-5 border border-[#E5E5E5] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3.5 border-b border-[#E5E5E5]">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373]">
                  OPERATIONAL LEDGER
                </span>
                <h3 className="text-sm font-bold text-[#171717] mt-0.5">
                  Recent Booking Pipeline
                </h3>
              </div>
              <Link
                to="/panel/bookings"
                className="text-xs font-semibold text-[#EA580C] hover:underline flex items-center gap-1"
              >
                <span>View All Bookings</span>
                <ArrowRight size={12} />
              </Link>
            </div>

            {/* Table */}
            <div className="overflow-x-auto w-full mt-3">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#F5F5F4] text-[#525252] text-[10px] font-bold uppercase tracking-wider border-b border-[#E5E5E5]">
                    <th className="py-2.5 px-3">Booking ID</th>
                    <th className="py-2.5 px-3">Customer / Agency</th>
                    <th className="py-2.5 px-3">Resource Location</th>
                    <th className="py-2.5 px-3">Channel</th>
                    <th className="py-2.5 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E5E5]">
                  {recentBookings.map((bkg) => {
                    const sourceMeta = BOOKING_SOURCE_CONFIG[bkg.source];
                    const statusMeta = BOOKING_STATUS_CONFIG[bkg.status] || {
                      label: bkg.status,
                      badgeBg: 'bg-stone-100',
                      badgeText: 'text-stone-700',
                      badgeBorder: 'border-stone-200',
                    };

                    return (
                      <tr key={bkg.id} className="hover:bg-[#FAFAF9] transition-colors">
                        <td className="py-2.5 px-3 font-mono font-bold text-[#EA580C]">
                          <Link to="/panel/bookings" className="hover:underline">
                            {bkg.id}
                          </Link>
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="font-semibold text-[#171717]">{bkg.companyName}</div>
                          <div className="text-[10px] text-[#737373]">{bkg.customerName}</div>
                        </td>
                        <td className="py-2.5 px-3 text-[#525252]">
                          <div className="truncate max-w-[170px]">{bkg.resourceName}</div>
                          <span className="text-[10px] text-[#A3A3A3]">{bkg.location}</span>
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          <span
                            className={`inline-block text-[9px] uppercase font-mono font-bold px-2 py-0.5 rounded border ${sourceMeta.badgeBg} ${sourceMeta.badgeText} ${sourceMeta.badgeBorder}`}
                          >
                            {sourceMeta.label}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right whitespace-nowrap">
                          <span
                            className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border ${statusMeta.badgeBg} ${statusMeta.badgeText} ${statusMeta.badgeBorder}`}
                          >
                            {statusMeta.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="pt-3 border-t border-[#E5E5E5] mt-4 flex items-center justify-between text-[11px] text-[#737373]">
            <span>Multi-channel routing: SODAARS Marketplace • Admin • Provider Desk</span>
            <Link to="/panel/bookings/create" className="text-[#EA580C] font-semibold hover:underline">
              + New Reservation
            </Link>
          </div>
        </div>

        {/* Right Column (5 cols): Live Campaigns & Mounting POP Tracker */}
        <div className="lg:col-span-5 bg-white rounded-xl p-5 border border-[#E5E5E5] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3.5 border-b border-[#E5E5E5]">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373]">
                  EXECUTION &amp; AUDIT
                </span>
                <h3 className="text-sm font-bold text-[#171717] mt-0.5">
                  Live Campaigns &amp; POP Proof
                </h3>
              </div>
              <Link
                to="/panel/campaigns"
                className="text-xs font-semibold text-[#EA580C] hover:underline flex items-center gap-1"
              >
                <span>All Campaigns</span>
                <ArrowRight size={12} />
              </Link>
            </div>

            <div className="space-y-3 mt-3">
              {activeCampaigns.map((cmp) => {
                const hasProof = cmp.photoProof && cmp.photoProof.length > 0;
                return (
                  <div
                    key={cmp.id}
                    className="p-3 rounded-lg border border-[#E5E5E5] bg-[#FAFAF9]/50 hover:bg-[#FAFAF9] transition-all flex items-start gap-3"
                  >
                    {/* Creative Thumbnail */}
                    <div className="w-12 h-12 rounded-md overflow-hidden bg-stone-200 border border-[#E5E5E5] shrink-0 relative">
                      {cmp.activeCreative?.imageUrl ? (
                        <img
                          src={cmp.activeCreative.imageUrl}
                          alt={cmp.campaignName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-stone-400">
                          <Camera size={16} />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="text-xs font-bold text-[#171717] truncate">
                          {cmp.campaignName}
                        </h4>
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold shrink-0">
                          {cmp.executionStatus}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#525252] truncate mt-0.5">
                        {cmp.companyName} • {cmp.resourceName}
                      </p>

                      <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-stone-200/60 text-[10px]">
                        <span className="text-[#737373] flex items-center gap-1">
                          <MapPin size={10} />
                          {cmp.location}
                        </span>
                        {hasProof ? (
                          <span className="text-emerald-700 font-semibold flex items-center gap-1">
                            <CheckCircle2 size={11} /> {cmp.photoProof?.length || 0} POP Photos
                          </span>
                        ) : (
                          <span className="text-amber-700 font-semibold flex items-center gap-1">
                            <AlertTriangle size={11} /> Proof Pending
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-[#E5E5E5] mt-4 flex items-center justify-between text-[11px] text-[#737373]">
            <span>Proof of Performance certified via geotagged timestamp</span>
            <Link to="/panel/campaigns" className="text-[#EA580C] font-semibold hover:underline">
              Upload Photos →
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. BLOCK 5 & BLOCK 6: COMMERCIAL/FINANCIAL PULSE + QUICK COMMANDS         */}
      {/* ========================================================================= */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Commercial & Cash Realization Snapshot (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl p-5 border border-[#E5E5E5] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3.5 border-b border-[#E5E5E5]">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373]">
                  COMMERCIAL REALIZATION
                </span>
                <h3 className="text-sm font-bold text-[#171717] mt-0.5">
                  Financial Pulse &amp; SODAARS Settlements
                </h3>
              </div>
              <Link
                to="/panel/finance"
                className="text-xs font-semibold text-[#EA580C] hover:underline flex items-center gap-1"
              >
                <span>Full Finance Ledger</span>
                <ArrowRight size={12} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 my-4">
              <div className="p-3.5 rounded-xl border border-[#E5E5E5] bg-[#FAFAF9]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373]">
                  Invoiced MTD
                </span>
                <div className="text-lg font-bold text-[#171717] mt-1">
                  ₹{totalInvoicedMtd.toLocaleString('en-IN')}
                </div>
                <div className="text-[10px] text-[#737373] mt-0.5">SAC 998361 (18% GST)</div>
              </div>

              <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/40">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                  Realized Cash
                </span>
                <div className="text-lg font-bold text-emerald-900 mt-1">
                  ₹{totalPaidMtd.toLocaleString('en-IN')}
                </div>
                <div className="text-[10px] text-emerald-700 mt-0.5">
                  {collectionPercentage}% Collection Rate
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/40">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                  Pending Receivables
                </span>
                <div className="text-lg font-bold text-amber-900 mt-1">
                  ₹{totalPendingAr.toLocaleString('en-IN')}
                </div>
                <div className="text-[10px] text-amber-700 mt-0.5">Under Agency Credit Terms</div>
              </div>
            </div>

            {/* SODAARS Platform Escrow Release Alert */}
            <div className="p-3.5 rounded-lg border border-indigo-200 bg-indigo-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-indigo-100 text-indigo-700 shrink-0">
                  <Landmark size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-indigo-950">
                    SODAARS Marketplace Escrow Release: ₹4,00,950
                  </h4>
                  <p className="text-[11px] text-indigo-800 mt-0.5">
                    Cadbury Celebrations WEH Gantry POP approved. Auto-disbursement scheduled for Net 15 cycle.
                  </p>
                </div>
              </div>
              <Link to="/panel/finance" className="shrink-0">
                <button className="px-3 py-1.5 text-xs font-semibold bg-white border border-indigo-300 text-indigo-900 hover:bg-indigo-50 rounded-lg transition-colors shadow-2xs">
                  View Escrow
                </button>
              </Link>
            </div>
          </div>

          <div className="pt-3 border-t border-[#E5E5E5] mt-4 flex items-center justify-between text-[11px] text-[#737373]">
            <span>Automated TDS u/s 194C &amp; GSTR-1 outward supply tracking</span>
            <span className="font-mono text-emerald-600 font-semibold">TDS Matched 26AS</span>
          </div>
        </div>

        {/* Right: Quick Action Command Center (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl p-5 border border-[#E5E5E5] shadow-xs flex flex-col justify-between">
          <div>
            <div className="pb-3.5 border-b border-[#E5E5E5]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373]">
                OPERATIONS CONSOLE
              </span>
              <h3 className="text-sm font-bold text-[#171717] mt-0.5">
                Quick Action Command Center
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-4">
              <Link
                to="/panel/resources"
                className="p-3 rounded-lg border border-[#E5E5E5] bg-[#FAFAF9] hover:bg-orange-50/50 hover:border-orange-200 transition-all flex items-center gap-3 group"
              >
                <div className="w-8 h-8 rounded-lg bg-orange-50 text-[#EA580C] flex items-center justify-center shrink-0 border border-orange-200 group-hover:scale-105 transition-transform">
                  <Plus size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#171717] group-hover:text-[#EA580C] transition-colors">
                    Add Resource
                  </h4>
                  <p className="text-[10px] text-[#737373]">Register new inventory / resource</p>
                </div>
              </Link>

              <Link
                to="/panel/bookings/create"
                className="p-3 rounded-lg border border-[#E5E5E5] bg-[#FAFAF9] hover:bg-orange-50/50 hover:border-orange-200 transition-all flex items-center gap-3 group"
              >
                <div className="w-8 h-8 rounded-lg bg-orange-50 text-[#EA580C] flex items-center justify-center shrink-0 border border-orange-200 group-hover:scale-105 transition-transform">
                  <Calendar size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#171717] group-hover:text-[#EA580C] transition-colors">
                    Create Booking
                  </h4>
                  <p className="text-[10px] text-[#737373]">Book client campaign</p>
                </div>
              </Link>

              <Link
                to="/panel/finance"
                className="p-3 rounded-lg border border-[#E5E5E5] bg-[#FAFAF9] hover:bg-orange-50/50 hover:border-orange-200 transition-all flex items-center gap-3 group"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200 group-hover:scale-105 transition-transform">
                  <Receipt size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#171717] group-hover:text-emerald-700 transition-colors">
                    Create Tax Invoice
                  </h4>
                  <p className="text-[10px] text-[#737373]">GST SAC 998361 bill</p>
                </div>
              </Link>

              <Link
                to="/panel/campaigns"
                className="p-3 rounded-lg border border-[#E5E5E5] bg-[#FAFAF9] hover:bg-orange-50/50 hover:border-orange-200 transition-all flex items-center gap-3 group"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0 border border-indigo-200 group-hover:scale-105 transition-transform">
                  <Camera size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#171717] group-hover:text-indigo-700 transition-colors">
                    Upload POP Proof
                  </h4>
                  <p className="text-[10px] text-[#737373]">Submit night/day photos</p>
                </div>
              </Link>
            </div>

            <Link
              to="/panel/reports"
              className="mt-3 p-3 rounded-lg border border-dashed border-[#D4D4D4] bg-[#FAFAF9] hover:bg-white transition-all flex items-center justify-between group block"
            >
              <div className="flex items-center gap-2.5">
                <BarChart3 size={16} className="text-[#EA580C]" />
                <div>
                  <h5 className="text-xs font-bold text-[#171717]">Download Executive MIS Report</h5>
                  <p className="text-[10px] text-[#737373]">Occupancy trends, revenue yield &amp; compliance</p>
                </div>
              </div>
              <ExternalLink size={13} className="text-[#737373] group-hover:text-[#EA580C] transition-colors" />
            </Link>
          </div>

          <div className="pt-3 border-t border-[#E5E5E5] mt-4 flex items-center justify-between text-[11px] text-[#737373]">
            <span>Fast navigation to core system engines</span>
            <span className="font-mono text-[#171717]">5 Actions Live</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
