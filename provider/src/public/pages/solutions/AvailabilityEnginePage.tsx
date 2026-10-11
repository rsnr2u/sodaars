import React from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Layers,
  FileText,
  Camera,
  CheckCircle2,
  Clock,
  ToggleRight,
  ToggleLeft,
  Lock,
  GitMerge,
  Code2,
  Check,
} from 'lucide-react';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';

export const AvailabilityEnginePage: React.FC = () => {
  const availabilityStates = [
    {
      name: 'Available',
      badge: 'Open',
      color: 'bg-emerald-500',
      badgeVariant: 'active' as const,
      desc: 'Resource date is available.',
    },
    {
      name: 'Booked',
      badge: 'Booked',
      color: 'bg-stone-900',
      badgeVariant: 'inactive' as const,
      desc: 'Resource date is booked.',
    },
    {
      name: 'Hold',
      badge: 'Held',
      color: 'bg-amber-400',
      badgeVariant: 'pending' as const,
      desc: 'Resource date is provisionally held.',
    },
    {
      name: 'Provider Block',
      badge: 'Blocked',
      color: 'bg-[#F97316]',
      badgeVariant: 'blocked' as const,
      desc: 'Provider has blocked the resource/date.',
    },
    {
      name: 'Admin Block',
      badge: 'Admin Lock',
      color: 'bg-stone-700',
      badgeVariant: 'inactive' as const,
      desc: 'SODAARS administration has blocked the resource/date.',
    },
    {
      name: 'Maintenance',
      badge: 'Maintenance',
      color: 'bg-stone-400',
      badgeVariant: 'inactive' as const,
      desc: 'Resource/date is unavailable for maintenance.',
    },
  ];

  return (
    <div className="w-full bg-[#FAFAF9] text-[#171717]">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION                                                           */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 border-b border-[#E5E5E5] bg-gradient-to-b from-white via-white to-[#FAFAF9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-200 bg-orange-50 text-[#F97316] text-xs font-semibold uppercase tracking-wider mb-6">
              <Sparkles size={13} className="text-[#F97316]" />
              AVAILABILITY ENGINE
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-[#171717] leading-[1.12]">
              Know What’s Available. Control Every Slot.
            </h1>

            {/* Subtitle / Core Description */}
            <div className="mt-4 text-lg sm:text-xl font-semibold text-[#F97316]">
              Real-time slot &amp; hold manager
            </div>

            {/* Supporting Copy */}
            <p className="mt-4 text-base sm:text-lg text-[#525252] max-w-3xl mx-auto leading-relaxed font-normal">
              Manage resource availability across dates, holds, bookings, provider blocks, admin blocks, and maintenance while keeping marketplace availability connected to the underlying resource.
            </p>

            {/* CTAs */}
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Link to="/get-started" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto" rightIcon={<ArrowRight size={16} />}>
                  Get Started →
                </Button>
              </Link>
              <Link to="/marketplace" className="w-full sm:w-auto">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto" rightIcon={<ExternalLink size={14} />}>
                  Explore Marketplace →
                </Button>
              </Link>
            </div>

            {/* System Pillars Indicator Strip */}
            <div className="mt-12 pt-8 border-t border-[#E5E5E5]/60 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs">
              <span className="px-3 py-1 rounded-full bg-white border border-[#E5E5E5] text-[#171717] font-medium shadow-xs">
                Date-Level Slot Granularity
              </span>
              <span className="text-[#D4D4D8]">·</span>
              <span className="px-3 py-1 rounded-full bg-white border border-[#E5E5E5] text-[#171717] font-medium shadow-xs">
                Unified Schedule Core
              </span>
              <span className="text-[#D4D4D8]">·</span>
              <span className="px-3 py-1 rounded-full bg-white border border-[#E5E5E5] text-[#171717] font-medium shadow-xs">
                Multi-Source Coordination
              </span>
              <span className="text-[#D4D4D8]">·</span>
              <span className="px-3 py-1 rounded-full bg-white border border-[#E5E5E5] text-[#171717] font-medium shadow-xs">
                Operational States
              </span>
              <span className="text-[#D4D4D8]">·</span>
              <span className="px-3 py-1 rounded-full bg-white border border-[#E5E5E5] text-[#171717] font-medium shadow-xs">
                Availability Coordination
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. AVAILABILITY STATES                                                    */}
      {/* ========================================================================= */}
      <section className="py-16 md:py-24 border-b border-[#E5E5E5] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#F97316]">
              AVAILABILITY STATES
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-[#171717]">
              Understand the Status of Every Resource Date.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#525252] leading-relaxed">
              SODAARS represents advertising-resource availability using clear operational states so providers and booking channels can understand whether a resource is available, reserved, held, blocked, or under maintenance.
            </p>
          </div>

          {/* Six States Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availabilityStates.map((state, idx) => (
              <Card key={idx} className="p-6 bg-[#FAFAF9] border-[#E5E5E5] flex flex-col justify-between hover:border-[#F97316]/40 transition-colors">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E5]">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-xs ${state.color}`} />
                      <h3 className="text-sm font-bold text-[#171717]">{state.name}</h3>
                    </div>
                    <Badge variant={state.badgeVariant}>{state.badge}</Badge>
                  </div>
                  <p className="mt-4 text-xs text-[#525252] leading-relaxed">
                    {state.desc}
                  </p>
                </div>
              </Card>
            ))}
          </div>

          {/* Conceptual Horizontal Matrix Visual */}
          <div className="mt-14 max-w-5xl mx-auto">
            <Card className="p-6 bg-[#FAFAF9] border-[#E5E5E5] shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#E5E5E5]">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#F97316]" />
                  <span className="text-xs font-bold text-[#171717] uppercase tracking-wider">
                    Conceptual Slot Scheduling Matrix · October 2026
                  </span>
                </div>
                <span className="text-xs font-mono text-[#737373]">Multi-Asset Visual Ledger</span>
              </div>

              {/* Matrix Asset Rows */}
              <div className="mt-6 space-y-4">
                {/* Asset Row 1: Unipole HYD-GCH-001 */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-[#171717]">HYD-GCH-001 · Unipole Outer Ring Road</span>
                    <span className="text-[11px] text-[#737373]">40 × 20 ft · Front-lit</span>
                  </div>
                  <div className="grid grid-cols-12 gap-1 h-8 text-[10px] font-medium text-center">
                    <div className="bg-stone-900 text-white rounded flex items-center justify-center col-span-4 shadow-xs">
                      Booked (Oct 1–10)
                    </div>
                    <div className="bg-amber-100 text-amber-800 border border-amber-300 rounded flex items-center justify-center col-span-2">
                      Hold (Oct 11–15)
                    </div>
                    <div className="bg-emerald-50 text-emerald-700 border border-emerald-200 rounded flex items-center justify-center col-span-4">
                      Available (Oct 16–25)
                    </div>
                    <div className="bg-stone-200 text-stone-700 rounded flex items-center justify-center col-span-2">
                      Maintenance
                    </div>
                  </div>
                </div>

                {/* Asset Row 2: Gantry MUM-WEH-002 */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-[#171717]">MUM-WEH-002 · Highway Gantry North</span>
                    <span className="text-[11px] text-[#737373]">60 × 15 ft · Back-lit</span>
                  </div>
                  <div className="grid grid-cols-12 gap-1 h-8 text-[10px] font-medium text-center">
                    <div className="bg-orange-100 text-orange-800 border border-orange-300 rounded flex items-center justify-center col-span-3">
                      Provider Block (Oct 1–7)
                    </div>
                    <div className="bg-emerald-50 text-emerald-700 border border-emerald-200 rounded flex items-center justify-center col-span-5">
                      Available (Oct 8–20)
                    </div>
                    <div className="bg-stone-700 text-white rounded flex items-center justify-center col-span-2">
                      Admin Block
                    </div>
                    <div className="bg-stone-900 text-white rounded flex items-center justify-center col-span-2">
                      Booked
                    </div>
                  </div>
                </div>

                {/* Asset Row 3: Billboard BLR-MG-005 */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-[#171717]">BLR-MG-005 · Trinity Circle Hoarding</span>
                    <span className="text-[11px] text-[#737373]">30 × 20 ft · Front-lit</span>
                  </div>
                  <div className="grid grid-cols-12 gap-1 h-8 text-[10px] font-medium text-center">
                    <div className="bg-emerald-50 text-emerald-700 border border-emerald-200 rounded flex items-center justify-center col-span-6">
                      Available (Oct 1–15)
                    </div>
                    <div className="bg-stone-900 text-white rounded flex items-center justify-center col-span-4">
                      Booked (Oct 16–25)
                    </div>
                    <div className="bg-amber-100 text-amber-800 border border-amber-300 rounded flex items-center justify-center col-span-2">
                      Hold
                    </div>
                  </div>
                </div>
              </div>

              {/* State Key Legend */}
              <div className="mt-6 pt-4 border-t border-[#E5E5E5] flex flex-wrap items-center justify-between gap-4 text-[11px]">
                <div className="flex flex-wrap items-center gap-3 sm:gap-5">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-xs bg-emerald-500" />
                    <span className="text-[#525252]">Available</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-xs bg-stone-900" />
                    <span className="text-[#525252]">Booked</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-xs bg-amber-400" />
                    <span className="text-[#525252]">Hold</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-xs bg-[#F97316]" />
                    <span className="text-[#525252]">Provider Block</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-xs bg-stone-700" />
                    <span className="text-[#525252]">Admin Block</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-xs bg-stone-400" />
                    <span className="text-[#525252]">Maintenance</span>
                  </div>
                </div>
                <span className="text-[#737373] text-[10px]">Operational States</span>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. MARKETPLACE PARTICIPATION ≠ AVAILABILITY (CRITICAL RULE)               */}
      {/* ========================================================================= */}
      <section className="py-16 md:py-24 border-b border-[#E5E5E5] bg-[#FAFAF9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Narrative Column */}
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#F97316]">
                <GitMerge size={14} className="text-[#F97316]" />
                CRITICAL INVARIANT
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#171717]">
                Marketplace Participation Is Not Availability.
              </h2>
              <div className="space-y-3 text-sm text-[#525252] leading-relaxed">
                <p>
                  Marketplace participation determines whether a resource can be presented through the Marketplace. Availability determines whether that resource can be considered for a particular date or date range.
                </p>
                <div className="p-3.5 rounded-md bg-white border border-[#E5E5E5] space-y-2 text-xs">
                  <div>
                    <strong className="text-[#171717]">Marketplace Participation:</strong> Controls whether the resource is eligible to be presented through the Marketplace discovery channel.
                  </div>
                  <div className="pt-2 border-t border-[#E5E5E5]">
                    <strong className="text-[#171717]">Availability Engine:</strong> Determines whether the underlying resource can be considered for a particular date or date range across all channels.
                  </div>
                </div>
                <p>
                  Even if a resource is participating in the Marketplace, inquiries and reservations can only proceed if the queried dates are in an Available state. Participation never overrides underlying resource availability.
                </p>
                <p className="text-xs text-[#737373] pt-1">
                  * Note: SODAARS does not claim guaranteed marketplace demand, bookings, or revenue.
                </p>
              </div>
            </div>

            {/* Conceptual Comparison Card */}
            <div className="lg:col-span-6 space-y-4">
              <Card className="p-6 bg-white border-[#E5E5E5] shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E5]">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#737373]">
                    Decoupled Governance Architecture
                  </span>
                  <Badge variant="brand">Dual-Layer Rule</Badge>
                </div>

                <div className="mt-5 space-y-4">
                  {/* Scenario 1: Participating but Booked */}
                  <div className="p-4 rounded-lg bg-[#FAFAF9] border border-[#E5E5E5]">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-bold text-[#171717]">Scenario A: Participating & Booked</div>
                      <Badge variant="blocked">Unavailable on Queried Dates</Badge>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs text-[#525252]">
                      <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                        <ToggleRight size={16} />
                        <span>Participation: [ ON ]</span>
                      </div>
                      <span className="text-[#737373]">＋</span>
                      <div className="flex items-center gap-1.5 text-stone-900 font-medium">
                        <Lock size={14} />
                        <span>Schedule: Booked (Oct 1–15)</span>
                      </div>
                    </div>
                    <div className="mt-2.5 pt-2 border-t border-[#E5E5E5] text-[11px] text-[#737373]">
                      Result: Asset appears in catalog, but requested dates are locked. Overlapping requests cannot proceed.
                    </div>
                  </div>

                  {/* Scenario 2: Participating and Available */}
                  <div className="p-4 rounded-lg bg-[#FAFAF9] border border-[#E5E5E5]">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-bold text-[#171717]">Scenario B: Participating & Available</div>
                      <Badge variant="active">Open for Inquiries</Badge>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs text-[#525252]">
                      <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                        <ToggleRight size={16} />
                        <span>Participation: [ ON ]</span>
                      </div>
                      <span className="text-[#737373]">＋</span>
                      <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                        <CheckCircle2 size={14} />
                        <span>Schedule: Available (Nov 1–30)</span>
                      </div>
                    </div>
                    <div className="mt-2.5 pt-2 border-t border-[#E5E5E5] text-[11px] text-[#737373]">
                      Result: Open window available for direct quotes or incoming marketplace inquiries.
                    </div>
                  </div>

                  {/* Scenario 3: Non-Participating */}
                  <div className="p-4 rounded-lg bg-[#FAFAF9] border border-[#E5E5E5]">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-bold text-[#171717]">Scenario C: Non-Participating Asset</div>
                      <Badge variant="inactive">Direct Channel Only</Badge>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs text-[#525252]">
                      <div className="flex items-center gap-1.5 text-stone-600 font-medium">
                        <ToggleLeft size={16} />
                        <span>Participation: [ OFF ]</span>
                      </div>
                      <span className="text-[#737373]">＋</span>
                      <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                        <CheckCircle2 size={14} />
                        <span>Schedule: Available</span>
                      </div>
                    </div>
                    <div className="mt-2.5 pt-2 border-t border-[#E5E5E5] text-[11px] text-[#737373]">
                      Result: Hidden from public marketplace. Managed exclusively for direct client sales.
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. UNIFIED MULTI-SOURCE SCHEDULING CORE                                   */}
      {/* ========================================================================= */}
      <section className="py-16 md:py-24 border-b border-[#E5E5E5] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-14">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#F97316]">
              UNIFIED INVENTORY CORE
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-[#171717]">
              One Single Source of Truth for All Booking Channels.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#525252] leading-relaxed">
              A unified availability model helps coordinate date-range availability across booking sources.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="p-6 sm:p-8 bg-[#FAFAF9] border-[#E5E5E5] shadow-xs">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                {/* Ingestion Sources */}
                <div className="space-y-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-[#737373] mb-2">
                    Ingestion Channels
                  </div>
                  <div className="p-3 rounded-md bg-white border border-[#E5E5E5] text-xs">
                    <strong className="text-[#171717]">Direct Bookings</strong>
                    <div className="text-[11px] text-[#737373]">Offline agency sales & renewals</div>
                  </div>
                  <div className="p-3 rounded-md bg-white border border-[#E5E5E5] text-xs">
                    <strong className="text-[#171717]">Marketplace Channel</strong>
                    <div className="text-[11px] text-[#737373]">Voluntary digital discovery</div>
                  </div>
                  <div className="p-3 rounded-md bg-white border border-[#E5E5E5] text-xs">
                    <strong className="text-[#171717]">Administrative Blocks</strong>
                    <div className="text-[11px] text-[#737373]">Operations, safety & maintenance</div>
                  </div>
                </div>

                {/* Central Engine Node */}
                <div className="p-6 rounded-xl bg-white border-2 border-[#F97316]/30 text-center shadow-sm my-2 md:my-0">
                  <Calendar size={28} className="text-[#F97316] mx-auto mb-2" />
                  <div className="text-sm font-bold text-[#171717]">
                    Availability Engine
                  </div>
                  <div className="text-[11px] text-[#737373] mt-1">
                    Canonical Slot Ledger
                  </div>
                  <div className="mt-3 px-2 py-1 rounded bg-orange-50 border border-orange-200 text-[10px] font-medium text-[#C2410C]">
                    Unified Availability Model
                  </div>
                </div>

                {/* Unified Output Schedule */}
                <div className="space-y-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-[#737373] mb-2">
                    Unified Output
                  </div>
                  <div className="p-3 rounded-md bg-white border border-[#E5E5E5] text-xs space-y-1.5">
                    <div className="flex items-center gap-2">
                      <Check size={14} className="text-[#F97316] shrink-0" />
                      <span className="text-[#171717] font-medium">Coordinated date-range scheduling</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check size={14} className="text-[#F97316] shrink-0" />
                      <span className="text-[#171717] font-medium">Cross-channel visibility</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check size={14} className="text-[#F97316] shrink-0" />
                      <span className="text-[#171717] font-medium">Consistent calendar records</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#E5E5E5] text-[11px] text-[#737373] text-center">
                Whether a contract originates from a direct corporate agency or a marketplace inquiry, all operations coordinate through the same underlying availability model.
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. TENTATIVE HOLDS & PIPELINE PROTECTION                                  */}
      {/* ========================================================================= */}
      <section className="py-16 md:py-24 border-b border-[#E5E5E5] bg-[#FAFAF9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Narrative Column */}
            <div className="lg:col-span-5 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#F97316]">
                <Clock size={14} className="text-[#F97316]" />
                PROPOSAL PROTECTION
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#171717]">
                Protect Client Proposals with Structured Holds.
              </h2>
              <div className="space-y-3 text-sm text-[#525252] leading-relaxed">
                <p>
                  In outdoor advertising, closing direct enterprise contracts requires pitching media plans with provisionally reserved dates.
                </p>
                <p>
                  SODAARS provides provisional <strong>Holds</strong> that temporarily reserve dates while client proposals are evaluated, helping coordinate availability across channels.
                </p>
                <div className="p-3.5 rounded-md bg-white border border-[#E5E5E5] text-xs text-[#525252] space-y-1">
                  <div>• Holds provisionally hold dates during proposal evaluation.</div>
                  <div>• Once confirmed with commercial agreement, the hold converts to <strong>Booked</strong>.</div>
                  <div>• If the client declines or the window passes, the hold releases cleanly to <strong>Available</strong>.</div>
                </div>
              </div>
            </div>

            {/* Right Visual Lifecycle Flow */}
            <div className="lg:col-span-7">
              <Card className="p-6 bg-white border-[#E5E5E5] shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E5]">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#737373]">
                    Provisional Hold Lifecycle
                  </span>
                  <Badge variant="pending">Time-Bound Window</Badge>
                </div>

                <div className="mt-5 space-y-3">
                  <div className="p-3.5 rounded-lg bg-[#FAFAF9] border border-[#E5E5E5] flex items-center justify-between">
                    <div>
                      <div className="text-[10px] uppercase font-semibold text-[#737373]">Stage 1</div>
                      <div className="text-xs font-bold text-[#171717]">Provisional Hold Created</div>
                    </div>
                    <span className="text-xs font-mono text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      State: Hold
                    </span>
                  </div>

                  <div className="pl-6 border-l-2 border-dashed border-[#D4D4D8] ml-4 py-2 space-y-2 text-xs text-[#525252]">
                    <div>Proposal sent to corporate client; asset dates temporarily held during decision period.</div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-lg bg-[#FAFAF9] border border-emerald-200">
                      <div className="text-[10px] uppercase font-semibold text-emerald-700">Outcome A (Confirmed)</div>
                      <div className="text-xs font-bold text-[#171717] mt-0.5">Agreement Executed</div>
                      <div className="text-[11px] text-[#525252] mt-1">Converts to <strong>Booked</strong> state</div>
                    </div>

                    <div className="p-3.5 rounded-lg bg-[#FAFAF9] border border-stone-200">
                      <div className="text-[10px] uppercase font-semibold text-[#737373]">Outcome B (Declined/Expired)</div>
                      <div className="text-xs font-bold text-[#171717] mt-0.5">Proposal Withdrawn</div>
                      <div className="text-[11px] text-[#525252] mt-1">Releases to <strong>Available</strong> state</div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3.5 border-t border-[#E5E5E5] text-[11px] text-[#737373] text-center">
                  Structured holds help sales teams coordinate date windows and maintain clear visibility.
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. CONNECTED OPERATIONAL LIFECYCLE                                        */}
      {/* ========================================================================= */}
      <section className="py-16 md:py-24 border-b border-[#E5E5E5] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-14">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#F97316]">
              OPERATING LIFECYCLE
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-[#171717]">
              Connecting Availability to Campaign Execution.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#525252] leading-relaxed">
              Availability is not an isolated calendar tool—it is the operational pivot connecting asset inventory to contracts, field mounting, and campaign verification.
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <Card className="p-6 sm:p-8 bg-[#FAFAF9] border-[#E5E5E5] shadow-xs">
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
                <div className="p-3 rounded-lg bg-white border border-[#E5E5E5]">
                  <Layers size={18} className="text-[#F97316] mx-auto mb-1.5" />
                  <div className="text-xs font-bold text-[#171717]">Resource</div>
                  <div className="text-[10px] text-[#737373] mt-0.5">Asset Attributes</div>
                </div>
                <div className="p-3 rounded-lg bg-orange-50 border border-orange-200">
                  <Calendar size={18} className="text-[#F97316] mx-auto mb-1.5" />
                  <div className="text-xs font-bold text-[#F97316]">Availability</div>
                  <div className="text-[10px] text-[#F97316] mt-0.5">Slot Validation</div>
                </div>
                <div className="p-3 rounded-lg bg-white border border-[#E5E5E5]">
                  <FileText size={18} className="text-[#F97316] mx-auto mb-1.5" />
                  <div className="text-xs font-bold text-[#171717]">Booking</div>
                  <div className="text-[10px] text-[#737373] mt-0.5">Contract Agreement</div>
                </div>
                <div className="p-3 rounded-lg bg-white border border-[#E5E5E5]">
                  <Camera size={18} className="text-[#F97316] mx-auto mb-1.5" />
                  <div className="text-xs font-bold text-[#171717]">Campaign</div>
                  <div className="text-[10px] text-[#737373] mt-0.5">Mounting Operations</div>
                </div>
                <div className="p-3 rounded-lg bg-white border border-[#E5E5E5]">
                  <CheckCircle2 size={18} className="text-[#F97316] mx-auto mb-1.5" />
                  <div className="text-xs font-bold text-[#171717]">Execution</div>
                  <div className="text-[10px] text-[#737373] mt-0.5">Proof Confirmed</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. FUTURE API LAYER                                                       */}
      {/* ========================================================================= */}
      <section className="py-16 md:py-24 border-b border-[#E5E5E5] bg-[#FAFAF9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto rounded-xl p-8 bg-white border border-[#E5E5E5]">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#E5E5E5]">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#F97316]">
                  <Code2 size={14} className="text-[#F97316]" />
                  FUTURE API LAYER
                </div>
                <h2 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-[#171717]">
                  Programmatic Availability Feeds.
                </h2>
              </div>
              <span className="px-3 py-1 rounded-full bg-stone-200 border border-stone-300 text-xs font-semibold text-stone-700">
                PLANNED / FUTURE
              </span>
            </div>

            <p className="mt-6 text-sm text-[#525252] leading-relaxed">
              SODAARS is architected with a future API layer in mind, designed to enable programmatic availability queries and synchronization with external enterprise scheduling platforms and media agency software.
            </p>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#525252]">
              <div className="p-3.5 rounded bg-[#FAFAF9] border border-[#E5E5E5]">
                <div className="font-bold text-[#171717] mb-1">Standardized Availability Queries</div>
                <div>Future programmatic endpoints planned to return slot states for specified date ranges.</div>
              </div>
              <div className="p-3.5 rounded bg-[#FAFAF9] border border-[#E5E5E5]">
                <div className="font-bold text-[#171717] mb-1">ERP & Calendar Coordination</div>
                <div>Architecture ready to interface with enterprise resource planning systems and internal operations.</div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#E5E5E5] text-[11px] text-[#737373]">
              * Note: The API layer is a planned roadmap capability. No live endpoints or third-party integrations are operational in V1.
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. CLOSING CTA BANNER                                                     */}
      {/* ========================================================================= */}
      <section className="py-20 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-[#171717] text-white p-8 sm:p-12 md:p-16 relative overflow-hidden shadow-xl border border-[#262626]">
            {/* Subtle Saffron Glow */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-[#F97316]/10 blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-3xl">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#F97316]">
                READY TO CONTROL YOUR MEDIA SLOTS?
              </span>
              <h2 className="mt-3 text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
                Bring Your Availability Into One Coordinated Engine.
              </h2>
              <p className="mt-4 text-sm sm:text-base text-[#A3A3A3] leading-relaxed">
                Manage slots, tentative holds, confirmed bookings, and maintenance blocks from one unified scheduling platform.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                <Link to="/get-started">
                  <Button size="lg" className="w-full sm:w-auto" rightIcon={<ArrowRight size={16} />}>
                    Get Started →
                  </Button>
                </Link>
                <Link to="/marketplace">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto text-white border-[#404040] hover:bg-[#262626] hover:text-white"
                    rightIcon={<ExternalLink size={14} />}
                  >
                    Explore Marketplace →
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AvailabilityEnginePage;
