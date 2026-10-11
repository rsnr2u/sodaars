import React, { useState } from 'react';
import {
  BarChart2,
  TrendingUp,
  PieChart,
  CheckCircle2,
  ShieldAlert,
  Download,
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Button from '../../components/ui/Button';
import {
  ReportTabId,
  REPORT_TABS,
  ReportDateRangePreset,
} from '../types/report';
import {
  DATE_RANGE_PRESETS,
  SAMPLE_EXECUTIVE_SUMMARY,
  SAMPLE_OCCUPANCY_METRICS,
  SAMPLE_REVENUE_TRENDS,
  SAMPLE_TOP_REVENUE_LOCATIONS,
  SAMPLE_BOOKING_CHANNELS,
  SAMPLE_CAMPAIGN_COMPLIANCE,
  SAMPLE_OPERATIONAL_INCIDENTS,
} from '../data/sampleReports';
import OccupancyReportTab from '../components/reports/OccupancyReportTab';
import RevenueReportTab from '../components/reports/RevenueReportTab';
import BookingDistributionTab from '../components/reports/BookingDistributionTab';
import CampaignComplianceTab from '../components/reports/CampaignComplianceTab';
import OperationalHealthTab from '../components/reports/OperationalHealthTab';
import ReportExportModal from '../components/reports/ReportExportModal';

export const ReportsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ReportTabId>('occupancy');
  const [selectedPreset, setSelectedPreset] = useState<ReportDateRangePreset>('THIS_MONTH');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const activeTabMeta = REPORT_TABS.find((t) => t.id === activeTab) || REPORT_TABS[0];
  const activePresetConfig = DATE_RANGE_PRESETS.find((p) => p.preset === selectedPreset) || DATE_RANGE_PRESETS[0];

  const handlePresetChange = (preset: ReportDateRangePreset) => {
    setSelectedPreset(preset);
    const found = DATE_RANGE_PRESETS.find((p) => p.preset === preset);
    showToast(`Reporting window updated to: ${found?.label || preset}`);
  };

  return (
    <div className="flex-1 flex flex-col w-full pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-3.5 rounded-lg bg-[#171717] text-white text-xs font-semibold shadow-2xl flex items-center gap-2.5 border border-stone-800 transition-all animate-in fade-in slide-in-from-bottom-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#EA580C] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <PageHeader
        eyebrow="REPORTING & BUSINESS INTELLIGENCE"
        title="Operational Reports & Analytics"
        description="Comprehensive intelligence across outdoor media occupancy, commercial revenue realization, booking channel mix, POP compliance, and maintenance uptime."
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            {/* Quick Date Range Preset Selector */}
            <div className="relative">
              <select
                value={selectedPreset}
                onChange={(e) => handlePresetChange(e.target.value as ReportDateRangePreset)}
                aria-label="Select Reporting Period"
                className="h-8.5 text-xs rounded-lg border border-[#E5E5E5] bg-white px-3 pr-7 text-[#171717] focus:outline-none focus:border-[#EA580C] font-semibold cursor-pointer shadow-2xs"
              >
                {DATE_RANGE_PRESETS.map((p) => (
                  <option key={p.preset} value={p.preset}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Export Action */}
            <Button
              variant="primary"
              size="sm"
              className="text-xs bg-[#171717] hover:bg-stone-800 text-white font-bold h-8.5"
              leftIcon={<Download size={13} />}
              onClick={() => setIsExportModalOpen(true)}
            >
              Export Report
            </Button>
          </div>
        }
      />

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* ========================================================================= */}
        {/* 1. GLOBAL EXECUTIVE SUMMARY STRIP                                         */}
        {/* ========================================================================= */}
        <div className="bg-gradient-to-r from-orange-50/60 via-stone-50 to-white rounded-xl p-4 sm:p-5 border border-orange-200/60 shadow-xs">
          <div className="flex items-center justify-between mb-3.5 border-b border-orange-100 pb-2.5 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#EA580C]" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#171717]">
                Executive Performance Summary — {activePresetConfig.label}
              </h2>
            </div>
            <span className="text-[11px] text-[#737373] font-mono">
              Window: {activePresetConfig.startDate} &rarr; {activePresetConfig.endDate}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-xs">
            {/* OCCUPANCY */}
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#737373] tracking-wider block">
                Portfolio Occupancy
              </span>
              <div className="text-xl sm:text-2xl font-black text-[#171717]">
                {SAMPLE_EXECUTIVE_SUMMARY.portfolioOccupancyRate}%
              </div>
              <span className="text-[10px] text-emerald-600 font-semibold block">
                +4.2% vs last month
              </span>
            </div>

            {/* REVENUE */}
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#737373] tracking-wider block">
                Invoiced Revenue
              </span>
              <div className="text-xl sm:text-2xl font-black text-[#EA580C]">
                ₹{(SAMPLE_EXECUTIVE_SUMMARY.totalBookedRevenue / 100000).toFixed(2)}L
              </div>
              <span className="text-[10px] text-stone-500 font-medium block">
                Gross realized value
              </span>
            </div>

            {/* DISPLAY DAYS */}
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#737373] tracking-wider block">
                Booked Display Days
              </span>
              <div className="text-xl sm:text-2xl font-black text-stone-800">
                {SAMPLE_EXECUTIVE_SUMMARY.totalDisplayDaysBooked}
              </div>
              <span className="text-[10px] text-stone-500 font-medium block">
                Days active flighting
              </span>
            </div>

            {/* POP SLA */}
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#737373] tracking-wider block">
                Proof Compliance
              </span>
              <div className="text-xl sm:text-2xl font-black text-emerald-800">
                {SAMPLE_EXECUTIVE_SUMMARY.popComplianceRate}%
              </div>
              <span className="text-[10px] text-emerald-600 font-semibold block">
                SLA &le;24 hrs met
              </span>
            </div>

            {/* UPTIME */}
            <div className="space-y-1 col-span-2 sm:col-span-1">
              <span className="text-[10px] uppercase font-bold text-[#737373] tracking-wider block">
                Operational Uptime
              </span>
              <div className="text-xl sm:text-2xl font-black text-stone-800">
                {SAMPLE_EXECUTIVE_SUMMARY.operationalUptimePercent}%
              </div>
              <span className="text-[10px] text-stone-500 font-medium block">
                Zero critical outages
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. REPORT MODULE SELECTOR TABS                                            */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-xl border border-[#E5E5E5] p-2 shadow-xs">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
            {REPORT_TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`p-2.5 rounded-lg text-left transition-all flex flex-col justify-between ${
                    isActive
                      ? 'bg-[#171717] text-white shadow-xs'
                      : 'hover:bg-[#FAFAF9] text-[#525252] hover:text-[#171717]'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    {tab.id === 'occupancy' && <BarChart2 size={13} className={isActive ? 'text-[#EA580C]' : 'text-stone-400'} />}
                    {tab.id === 'revenue' && <TrendingUp size={13} className={isActive ? 'text-[#EA580C]' : 'text-stone-400'} />}
                    {tab.id === 'bookings' && <PieChart size={13} className={isActive ? 'text-[#EA580C]' : 'text-stone-400'} />}
                    {tab.id === 'campaigns' && <CheckCircle2 size={13} className={isActive ? 'text-[#EA580C]' : 'text-stone-400'} />}
                    {tab.id === 'operations' && <ShieldAlert size={13} className={isActive ? 'text-[#EA580C]' : 'text-stone-400'} />}
                    <span className="text-xs font-bold tracking-tight truncate">
                      {tab.shortLabel}
                    </span>
                  </div>
                  <span className={`text-[10px] leading-tight line-clamp-1 ${isActive ? 'text-stone-300' : 'text-stone-400'}`}>
                    {tab.id === 'occupancy' && 'Asset utilization & dead stock'}
                    {tab.id === 'revenue' && 'GMV & yield per sq.ft'}
                    {tab.id === 'bookings' && 'Channel split & deal size'}
                    {tab.id === 'campaigns' && 'POP audit & turnaround'}
                    {tab.id === 'operations' && 'Uptime & incident logs'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. ACTIVE REPORT TAB CONTENT                                              */}
        {/* ========================================================================= */}
        <div>
          {activeTab === 'occupancy' && (
            <OccupancyReportTab metrics={SAMPLE_OCCUPANCY_METRICS} />
          )}

          {activeTab === 'revenue' && (
            <RevenueReportTab
              monthlyTrends={SAMPLE_REVENUE_TRENDS}
              topLocations={SAMPLE_TOP_REVENUE_LOCATIONS}
            />
          )}

          {activeTab === 'bookings' && (
            <BookingDistributionTab channels={SAMPLE_BOOKING_CHANNELS} />
          )}

          {activeTab === 'campaigns' && (
            <CampaignComplianceTab campaigns={SAMPLE_CAMPAIGN_COMPLIANCE} />
          )}

          {activeTab === 'operations' && (
            <OperationalHealthTab incidents={SAMPLE_OPERATIONAL_INCIDENTS} />
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. REPORT EXPORT MODAL                                                    */}
      {/* ========================================================================= */}
      <ReportExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        activeTabLabel={activeTabMeta.label}
        selectedPreset={selectedPreset}
      />
    </div>
  );
};

export default ReportsPage;
