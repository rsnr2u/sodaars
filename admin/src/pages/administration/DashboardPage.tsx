import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  Layers, 
  ShieldAlert, 
  TrendingUp, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  MapPin, 
  ChevronRight,
  ShieldCheck,
  FileCheck2,
  Ban
} from 'lucide-react';
import { mockSystemMetrics, mockProviders, mockResources, mockAuditLogs } from '../../data/mockAdminData';

export const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Top Header / Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight font-sans">
              Dashboard
            </h1>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-semibold">
              LIVE SYSTEM
            </span>
          </div>
          <p className="text-sm text-zinc-500 mt-1">
            Platform overview, media network metrics, subscriptions revenue, and operations summary.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/providers/kyc"
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold shadow-sm shadow-orange-600/30 transition-colors"
          >
            <FileCheck2 className="w-4 h-4" />
            <span>KYC Verification Desk</span>
          </Link>
          <Link
            to="/admin/resources/blocks"
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold transition-colors"
          >
            <Ban className="w-4 h-4 text-red-400" />
            <span>Admin Holds Desk</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Metric 1: Providers */}
        <div className="p-5 bg-white rounded-2xl border border-zinc-200/80 shadow-xs hover:border-zinc-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider font-mono">
              Registered Providers
            </span>
            <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-zinc-950 font-sans tracking-tight">
              {mockSystemMetrics.totalProviders}
            </span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" /> +4 this mo
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500">
            <span>Active: <strong className="text-zinc-800">{mockSystemMetrics.activeProviders}</strong></span>
            <span className="text-amber-600 font-medium">Pending KYC: {mockSystemMetrics.pendingKyc}</span>
          </div>
        </div>

        {/* Metric 2: Live Hoardings */}
        <div className="p-5 bg-white rounded-2xl border border-zinc-200/80 shadow-xs hover:border-zinc-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider font-mono">
              Total Inventory / Resources
            </span>
            <div className="w-8 h-8 rounded-lg bg-zinc-100 text-zinc-800 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-zinc-950 font-sans tracking-tight">
              {mockSystemMetrics.totalBillboards.toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-zinc-500">across 14 cities</span>
          </div>
          <div className="mt-3 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500">
            <span>Verified: <strong className="text-emerald-700">{mockSystemMetrics.activeBillboards}</strong></span>
            <span className="text-red-600 font-medium">{mockSystemMetrics.adminBlockedBillboards} Holds</span>
          </div>
        </div>

        {/* Metric 3: Network GMV */}
        <div className="p-5 bg-white rounded-2xl border border-zinc-200/80 shadow-xs hover:border-zinc-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider font-mono">
              Network Booking Value
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-zinc-950 font-sans tracking-tight">
              ₹4.85 Cr
            </span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" /> +18.4%
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500">
            <span>Annual Run-Rate</span>
            <span className="text-zinc-700 font-mono font-medium">₹58.2 Cr</span>
          </div>
        </div>

        {/* Metric 4: Municipal Compliance */}
        <div className="p-5 bg-white rounded-2xl border border-zinc-200/80 shadow-xs hover:border-zinc-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider font-mono">
              Compliance Rating
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-zinc-950 font-sans tracking-tight">
              98.6%
            </span>
            <span className="text-xs text-emerald-600 font-semibold">Tier-A</span>
          </div>
          <div className="mt-3 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500">
            <span>Municipal Audits</span>
            <span className="text-emerald-700 font-medium">100% Up to Date</span>
          </div>
        </div>
      </div>

      {/* Middle Grid: Attention Required & Quick Audits */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 spans): KYC Pending Review Desk */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-zinc-200/80 p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                <FileCheck2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-zinc-950 text-base">KYC & GSTIN Verification Queue</h3>
                <p className="text-xs text-zinc-500">Media owners awaiting license validation before entering the network</p>
              </div>
            </div>
            <Link
              to="/admin/providers/kyc"
              className="text-xs font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1"
            >
              View Full Queue <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-zinc-100">
            {mockProviders
              .filter((p) => p.kycStatus === 'under_review')
              .map((provider) => (
                <div key={provider.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-zinc-900 text-sm">{provider.name}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-100 text-zinc-600 font-medium">
                        {provider.tier}
                      </span>
                      <span className="text-xs text-zinc-400 font-mono">• {provider.city}</span>
                    </div>
                    <div className="text-xs text-zinc-500 flex items-center gap-3">
                      <span>GSTIN: <code className="text-zinc-700 font-mono">{provider.gstin}</code></span>
                      <span>Inventory: <strong className="text-zinc-800">{provider.resourceCount} sites</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      to={`/admin/providers/kyc?id=${provider.id}`}
                      className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold transition-colors"
                    >
                      Audit Documents
                    </Link>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Right Column (1 span): Active Administrative Holds */}
        <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-red-50 text-red-700 flex items-center justify-center">
                <Ban className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-zinc-950 text-base">Active Admin Holds</h3>
                <p className="text-xs text-zinc-500">Flagged inventory restricted from booking</p>
              </div>
            </div>
            <Link
              to="/admin/resources/blocks"
              className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1"
            >
              All Holds <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {mockResources
              .filter((r) => r.adminBlockStatus !== 'none')
              .map((res) => (
                <div key={res.id} className="p-3.5 rounded-xl bg-red-50/50 border border-red-200/60 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-bold text-zinc-900">{res.title}</span>
                      <p className="text-[11px] text-zinc-500 font-mono mt-0.5">{res.code} • {res.city}</p>
                    </div>
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-red-100 text-red-800 font-mono">
                      {res.adminBlockStatus.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-red-900/80 leading-relaxed bg-white/70 p-2 rounded border border-red-100">
                    {res.blockReason}
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-1">
                    <span>By: {res.blockedBy?.split('(')[0]}</span>
                    <Link
                      to="/admin/resources/blocks"
                      className="text-orange-600 hover:text-orange-700 font-semibold"
                    >
                      Manage Hold →
                    </Link>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Bottom Row: Recent Audit Trail Feed */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
          <div>
            <h3 className="font-bold text-zinc-950 text-base">Immutable Security & Governance Audit Trail</h3>
            <p className="text-xs text-zinc-500">Real-time log of administrative actions, compliance changes, and platform overrides</p>
          </div>
          <Link
            to="/admin/audit-logs"
            className="text-xs font-semibold text-zinc-700 hover:text-zinc-950 flex items-center gap-1 font-mono"
          >
            Full Audit Stream →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-200 text-zinc-400 uppercase font-mono text-[10px]">
                <th className="py-2.5 font-bold">Timestamp</th>
                <th className="py-2.5 font-bold">Staff Actor</th>
                <th className="py-2.5 font-bold">Action</th>
                <th className="py-2.5 font-bold">Target</th>
                <th className="py-2.5 font-bold">Audit Details</th>
                <th className="py-2.5 font-bold text-right">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-zinc-700">
              {mockAuditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-zinc-50/60 transition-colors">
                  <td className="py-3 font-mono text-zinc-500 whitespace-nowrap">{log.timestamp}</td>
                  <td className="py-3 font-medium text-zinc-900">
                    <div>{log.actor}</div>
                    <span className="text-[10px] text-zinc-400 font-mono">{log.actorRole}</span>
                  </td>
                  <td className="py-3">
                    <span className="font-mono px-2 py-0.5 rounded bg-zinc-100 text-zinc-800 text-[10px] font-bold">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 font-mono text-zinc-600">
                    <span className="px-1.5 py-0.5 rounded bg-orange-50 text-orange-700 text-[10px] font-bold">
                      {log.targetType}
                    </span>{' '}
                    {log.targetId}
                  </td>
                  <td className="py-3 max-w-md truncate text-zinc-600">{log.details}</td>
                  <td className="py-3 text-right font-mono text-zinc-400">{log.ipAddress}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
