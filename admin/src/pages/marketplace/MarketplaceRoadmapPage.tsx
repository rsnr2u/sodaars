import React from 'react';
import { 
  ShoppingBag, 
  Store, 
  Wallet, 
  ShieldCheck, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  Layers, 
  FileCheck2,
  Lock
} from 'lucide-react';

export const MarketplaceRoadmapPage: React.FC = () => {
  const roadmapMilestones = [
    {
      phase: 'Phase 1 (CURRENT)',
      title: 'Provider Platform & Admin Governance Tower',
      status: 'Active Development',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      items: [
        'Provider Operations Dashboard & Resource Catalog',
        'Direct Booking Quotation & Invoice Generation engine',
        'Campaign Workflow (Planned / Live / Completed)',
        'Admin Control Tower with 3-Domain Topbar Architecture',
        'Provider KYC & Statutory GSTIN Verification Desk',
        'Global Resource Registry & Admin Block Management',
      ],
    },
    {
      phase: 'Phase 2 (NEXT UP)',
      title: 'Marketplace Buyer Portal & Admin Commercial Desk',
      status: 'Queued after Admin Panel Completion',
      badgeColor: 'bg-orange-100 text-orange-800 border-orange-300',
      items: [
        'Agency & Brand Buyer Marketplace Portal (Search, Cart, Multi-site RFP)',
        'Automated Tri-party Escrow Settlement Engine',
        'Digital Proof-of-Play (PoP) & Geotagged Installation Auditing Desk',
        'Admin Dispute Resolution & Mediation Console',
        'Automated Platform Commission & Tax Invoicing',
      ],
    },
    {
      phase: 'Phase 3 (FUTURE)',
      title: 'Programmatic DOOH & Hardware Bridge',
      status: 'Roadmap Target',
      badgeColor: 'bg-zinc-100 text-zinc-700 border-zinc-200',
      items: [
        'OpenRTB 2.5 Connector for programmatic DOOH bidding',
        'Live Screen Heartbeat & Hardware Failure Alerter',
        'Camera-based Footfall & Impression Analytics Integration',
      ],
    },
  ];

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Notice Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-orange-950 via-zinc-950 to-zinc-900 border border-orange-500/30 text-white shadow-xl space-y-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse" />
          <span className="text-xs font-mono font-bold tracking-widest uppercase text-orange-400">
            MARKETPLACE BLUEPRINT • PHASE 2 ROADMAP
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-sans">
          Marketplace Commercial Architecture
        </h1>
        <p className="text-sm text-zinc-300 leading-relaxed max-w-3xl">
          As per our development plan, the complete <strong>Marketplace Buyer Portal</strong> and <strong>Admin Commercial Desk</strong> will be developed immediately after finishing the comprehensive Admin Panel and Provider workflows.
        </p>
      </div>

      {/* 3 Pillars of Marketplace to be developed */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-2xl border border-zinc-200/80 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
            <Store className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-zinc-950 text-base">Agency & Buyer Discovery</h3>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Allow advertising agencies, media planners, and direct brands to browse verified hoardings, view live availability calendars, and book multi-city campaigns with a single click.
          </p>
          <div className="pt-2 text-[11px] font-mono text-orange-600 font-semibold flex items-center gap-1">
            <Lock className="w-3 h-3" /> Scheduled in Phase 2
          </div>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-zinc-200/80 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Wallet className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-zinc-950 text-base">Escrow & Milestone Payouts</h3>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Buyers deposit campaign funds into a regulated platform escrow account. Funds are released to the media provider only after mounting geotag photos are verified by our audit desk.
          </p>
          <div className="pt-2 text-[11px] font-mono text-orange-600 font-semibold flex items-center gap-1">
            <Lock className="w-3 h-3" /> Scheduled in Phase 2
          </div>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-zinc-200/80 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <FileCheck2 className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-zinc-950 text-base">Admin Mediation Desk</h3>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Internal arbitration desk to settle disputes (e.g. illumination failure, delayed mounting, printing tears) with automated compensation adjustments and SLA penalties.
          </p>
          <div className="pt-2 text-[11px] font-mono text-orange-600 font-semibold flex items-center gap-1">
            <Lock className="w-3 h-3" /> Scheduled in Phase 2
          </div>
        </div>
      </div>

      {/* Execution Roadmap */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 space-y-6">
        <div className="pb-3 border-b border-zinc-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-zinc-950 text-base">SODAARS Release Cadence</h3>
            <p className="text-xs text-zinc-500">Phased rollout strategy ensuring solid platform foundations first</p>
          </div>
          <span className="text-xs font-mono text-zinc-400">Release Track v1.4</span>
        </div>

        <div className="space-y-6">
          {roadmapMilestones.map((m, idx) => (
            <div key={idx} className="p-5 rounded-xl border border-zinc-200 bg-zinc-50/50 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-bold text-zinc-400">{m.phase}</span>
                  <h4 className="font-bold text-zinc-950 text-sm">{m.title}</h4>
                </div>
                <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border ${m.badgeColor} self-start sm:self-auto`}>
                  {m.status}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                {m.items.map((item, iIdx) => (
                  <div key={iIdx} className="flex items-center gap-2 text-zinc-600">
                    <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${idx === 0 ? 'text-emerald-600' : 'text-zinc-400'}`} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
