import React from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Layers,
  Calendar,
  Users,
  Camera,
  Clock,
  XCircle,
  AlertCircle,
  RotateCcw,
  Building2,
  Globe,
  ShieldCheck,
  Code2,
  Check,
  ChevronRight,
  Repeat,
} from 'lucide-react';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';

export const BookingPipelinePage: React.FC = () => {
  // The 8 Linear Approved Booking Lifecycle States
  const lifecycleStages = [
    {
      step: '01',
      name: 'NEW',
      title: 'Inquiry Received',
      badge: 'Stage 1',
      badgeVariant: 'brand' as const,
      desc: 'Inquiry or direct proposal enters the system from Marketplace, Admin, or Provider channels.',
      focus: 'Initial capture of requested static resources, target display dates, and advertiser account details.',
    },
    {
      step: '02',
      name: 'UNDER REVIEW',
      title: 'Terms Assessment',
      badge: 'Stage 2',
      badgeVariant: 'pending' as const,
      desc: 'Commercial terms, date ranges, and physical specifications are evaluated against availability.',
      focus: 'Validation of requested dates against operational availability and rate alignment.',
    },
    {
      step: '03',
      name: 'PROVIDER CONFIRMATION',
      title: 'Owner Approval',
      badge: 'Stage 3',
      badgeVariant: 'brand' as const,
      desc: 'Media owner reviews and confirms intent to allocate the physical static resource.',
      focus: 'Ensures media owners retain sovereignty over asset allocation without automated bookings.',
    },
    {
      step: '04',
      name: 'CUSTOMER CONFIRMATION',
      title: 'Client Sign-Off',
      badge: 'Stage 4',
      badgeVariant: 'pending' as const,
      desc: 'Advertiser or media buying agency confirms the proposal, terms, and placement schedule.',
      focus: 'Solidifies formal agreement between parties before financial commitments or contract execution.',
    },
    {
      step: '05',
      name: 'PAYMENT',
      title: 'Payment Status',
      badge: 'Stage 5',
      badgeVariant: 'pending' as const,
      desc: 'Payment status is tracked as part of the booking workflow.',
      focus: 'Tracking payment milestone status in accordance with agreed contract terms.',
    },
    {
      step: '06',
      name: 'CONFIRMED',
      title: 'Slot Committed',
      badge: 'Stage 6',
      badgeVariant: 'active' as const,
      desc: 'All confirmations are completed and the booking is formally scheduled.',
      focus: 'Resource dates transition to Booked status, committing the display window.',
    },
    {
      step: '07',
      name: 'ACTIVE',
      title: 'Active Campaign Period',
      badge: 'Stage 7',
      badgeVariant: 'active' as const,
      desc: 'The confirmed booking is currently in its active campaign period.',
      focus: 'Live display schedule active across contracted static media assets.',
    },
    {
      step: '08',
      name: 'COMPLETED',
      title: 'Lifecycle Concluded',
      badge: 'Stage 8',
      badgeVariant: 'inactive' as const,
      desc: 'The booking lifecycle has concluded.',
      focus: 'Display term ended and booking record finalized in historical archive.',
    },
  ];

  // The 4 Exception States
  const exceptionStates = [
    {
      name: 'CANCELLED',
      badge: 'Cancelled',
      badgeVariant: 'inactive' as const,
      icon: XCircle,
      desc: 'CANCELLED — Booking is cancelled and its status is recorded.',
      impact: 'Booking status is updated to Cancelled in the pipeline record.',
    },
    {
      name: 'DECLINED',
      badge: 'Declined',
      badgeVariant: 'error' as const,
      icon: AlertCircle,
      desc: 'DECLINED — Provider or SODAARS declines the booking or request.',
      impact: 'Inquiry or proposal is marked as Declined with record preserved.',
    },
    {
      name: 'EXPIRED',
      badge: 'Expired',
      badgeVariant: 'blocked' as const,
      icon: Clock,
      desc: 'EXPIRED — A booking or request reaches its applicable expiry condition and the status is recorded.',
      impact: 'Expiry condition reached and status is documented in the pipeline record.',
    },
    {
      name: 'REFUNDED',
      badge: 'Refunded',
      badgeVariant: 'inactive' as const,
      icon: RotateCcw,
      desc: 'REFUNDED — Commercial adjustment or refund is recorded for the booking.',
      impact: 'Financial adjustment status is documented in accordance with contract terms.',
    },
  ];

  // The 3 Booking Sources: Marketplace, Admin, Provider
  const bookingSources = [
    {
      source: 'Marketplace',
      title: 'Marketplace Channel',
      icon: Globe,
      badge: 'Inbound Inquiries',
      desc: 'Inbound booking requests originating from voluntary catalog presentation in the Marketplace.',
      features: [
        'Voluntary resource presentation',
        'Inbound client inquiries flow directly to provider review',
        'Requires explicit provider confirmation before commitment',
      ],
    },
    {
      source: 'Admin',
      title: 'Admin Channel',
      icon: ShieldCheck,
      badge: 'Platform Facilitated',
      desc: 'Administrative booking requests coordinated through SODAARS platform operations.',
      features: [
        'Platform-facilitated booking coordination',
        'Standardized operational recordkeeping',
        'Unified visibility across provider and admin teams',
      ],
    },
    {
      source: 'Provider',
      title: 'Provider Channel',
      icon: Building2,
      badge: 'Direct Bookings',
      desc: 'Direct corporate advertiser contracts and client renewals initiated by the provider.',
      features: [
        'Direct relationship management by the media owner',
        'Direct contracts and client renewals',
        'Full autonomy over terms and contract agreements',
      ],
    },
  ];

  // The 5 Architectural Connection Nodes
  const architecturalFlow = [
    {
      step: '1',
      name: 'Advertising Resource',
      icon: Layers,
      role: 'Physical Foundation',
      desc: 'Physical static media asset (hoarding, unipole, gantry) with precise dimensions, geo-coordinates, and specifications.',
    },
    {
      step: '2',
      name: 'Availability',
      icon: Calendar,
      role: 'Scheduling Ledger',
      desc: 'Date-level inventory model determining whether the resource is Available, Booked, Held, Blocked, or under Maintenance.',
    },
    {
      step: '3',
      name: 'Booking',
      icon: FileText,
      role: 'Commercial Transaction',
      desc: 'The central contract entity establishing agreed dates, terms, confirmed parties, and display conditions.',
    },
    {
      step: '4',
      name: 'Customer',
      icon: Users,
      role: 'Client Entity',
      desc: 'The CRM account record representing the direct advertiser or media agency holding the commercial relationship.',
    },
    {
      step: '5',
      name: 'Campaign',
      icon: Camera,
      role: 'Execution Workflow',
      desc: 'The operational phase for the booked display window, managed in Campaign Execution.',
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
              BOOKING PIPELINE
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-[#171717] leading-[1.12]">
              Keep Every Booking Moving.
            </h1>

            {/* Subtitle / Core Description */}
            <div className="mt-4 text-lg sm:text-xl font-semibold text-[#F97316]">
              Direct contracts & client renewals
            </div>

            {/* Supporting Copy */}
            <p className="mt-4 text-base sm:text-lg text-[#525252] max-w-3xl mx-auto leading-relaxed font-normal">
              Direct contracts and client renewals can be managed alongside marketplace and administrative bookings through a structured, auditable booking pipeline.
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
                8-Stage Approved Lifecycle
              </span>
              <span className="text-[#D4D4D8]">·</span>
              <span className="px-3 py-1 rounded-full bg-white border border-[#E5E5E5] text-[#171717] font-medium shadow-xs">
                Marketplace, Admin & Provider Sources
              </span>
              <span className="text-[#D4D4D8]">·</span>
              <span className="px-3 py-1 rounded-full bg-white border border-[#E5E5E5] text-[#171717] font-medium shadow-xs">
                Direct Contracts & Renewals
              </span>
              <span className="text-[#D4D4D8]">·</span>
              <span className="px-3 py-1 rounded-full bg-white border border-[#E5E5E5] text-[#171717] font-medium shadow-xs">
                Deterministic Exception Handling
              </span>
              <span className="text-[#D4D4D8]">·</span>
              <span className="px-3 py-1 rounded-full bg-white border border-[#E5E5E5] text-[#171717] font-medium shadow-xs">
                Static OOH Focus
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. THE 8 APPROVED BOOKING LIFECYCLE STATES                                */}
      {/* ========================================================================= */}
      <section className="py-16 md:py-24 border-b border-[#E5E5E5] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#F97316]">
              APPROVED LIFECYCLE
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-[#171717]">
              The Eight Stages of Outdoor Advertising Bookings.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#525252] leading-relaxed">
              Every media transaction follows an auditable, deterministic lifecycle. Clear stage definitions ensure providers, agencies, and operations maintain synchronized visibility at each step.
            </p>
          </div>

          {/* Stepper Chain Indicator */}
          <div className="mb-10 p-4 sm:p-5 rounded-xl bg-[#FAFAF9] border border-[#E5E5E5] overflow-x-auto">
            <div className="flex items-center min-w-[760px] justify-between text-xs font-mono font-medium">
              {lifecycleStages.map((stage, i) => (
                <React.Fragment key={stage.name}>
                  <div className="flex flex-col items-center gap-1.5 px-1 text-center shrink-0">
                    <span className="w-6 h-6 rounded-full bg-white border border-[#E5E5E5] text-[#171717] flex items-center justify-center text-[10px] font-bold shadow-xs">
                      {stage.step}
                    </span>
                    <span className="text-[11px] font-bold text-[#171717] tracking-tight whitespace-nowrap">
                      {stage.name}
                    </span>
                  </div>
                  {i < lifecycleStages.length - 1 && (
                    <ChevronRight size={14} className="text-[#A3A3A3] shrink-0" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* 8 Detailed Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {lifecycleStages.map((stage) => (
              <Card
                key={stage.name}
                className="p-5 bg-[#FAFAF9] border-[#E5E5E5] flex flex-col justify-between hover:border-[#F97316]/40 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E5]">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-[#F97316]">
                        {stage.step}
                      </span>
                      <h3 className="text-sm font-bold text-[#171717]">{stage.name}</h3>
                    </div>
                    <Badge variant={stage.badgeVariant}>{stage.badge}</Badge>
                  </div>
                  <div className="text-xs font-semibold text-[#171717] mt-3">
                    {stage.title}
                  </div>
                  <p className="mt-2 text-xs text-[#525252] leading-relaxed">
                    {stage.desc}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#E5E5E5] text-[11px] text-[#737373]">
                  <strong className="text-[#171717]">Operational Focus:</strong> {stage.focus}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. THE FOUR EXCEPTION STATES                                              */}
      {/* ========================================================================= */}
      <section className="py-16 md:py-24 border-b border-[#E5E5E5] bg-[#FAFAF9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#F97316]">
              EXCEPTION HANDLING
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-[#171717]">
              Deterministic Handling for Non-Linear Outcomes.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#525252] leading-relaxed">
              When negotiations change or deadlines lapse, bookings transition cleanly into defined exception states. Structured resolution ensures statuses are documented accurately.
            </p>
          </div>

          {/* Exception States Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {exceptionStates.map((exp) => {
              const Icon = exp.icon;
              return (
                <Card key={exp.name} className="p-5 bg-white border-[#E5E5E5] flex flex-col justify-between shadow-xs">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E5]">
                      <div className="flex items-center gap-2">
                        <Icon size={16} className="text-[#F97316]" />
                        <h3 className="text-sm font-bold text-[#171717]">{exp.name}</h3>
                      </div>
                      <Badge variant={exp.badgeVariant}>{exp.badge}</Badge>
                    </div>
                    <p className="mt-3 text-xs text-[#525252] leading-relaxed">
                      {exp.desc}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[#E5E5E5] text-[11px] text-[#737373]">
                    <strong className="text-[#171717]">Pipeline Status:</strong> {exp.impact}
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Operational Clarification Note */}
          <div className="mt-8 p-4 rounded-lg bg-white border border-[#E5E5E5] text-xs text-[#737373] text-center max-w-3xl mx-auto">
            Exception states provide structured recordkeeping when a booking does not complete the standard lifecycle.
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. THREE INGESTION SOURCES (MULTI-SOURCE PIPELINE)                        */}
      {/* ========================================================================= */}
      <section className="py-16 md:py-24 border-b border-[#E5E5E5] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-14">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#F97316]">
              MULTI-SOURCE INGESTION
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-[#171717]">
              Three Ingestion Channels. One Unified Pipeline.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#525252] leading-relaxed">
              Bookings can enter the workflow through Marketplace, Admin, or Provider channels.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {bookingSources.map((source) => {
              const Icon = source.icon;
              return (
                <Card
                  key={source.source}
                  className="p-6 bg-[#FAFAF9] border-[#E5E5E5] flex flex-col justify-between hover:border-[#F97316]/40 transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E5]">
                      <div className="flex items-center gap-2">
                        <Icon size={18} className="text-[#F97316]" />
                        <h3 className="text-base font-bold text-[#171717]">{source.source}</h3>
                      </div>
                      <Badge variant="brand">{source.badge}</Badge>
                    </div>
                    <div className="text-xs font-semibold text-[#171717] mt-3">
                      {source.title}
                    </div>
                    <p className="mt-2 text-xs text-[#525252] leading-relaxed">
                      {source.desc}
                    </p>

                    <div className="mt-5 space-y-2">
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-[#737373]">
                        Operational Governance
                      </div>
                      {source.features.map((feature, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-2 text-xs text-[#525252]">
                          <Check size={13} className="text-[#F97316] shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          <div className="mt-10 p-4 rounded-xl bg-[#FAFAF9] border border-[#E5E5E5] text-xs text-[#737373] text-center max-w-4xl mx-auto">
            All bookings follow the same operational lifecycle regardless of whether they originate from Marketplace, Admin, or Provider channels.
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. THE ARCHITECTURAL CONNECTION (CORE DATA CHAIN)                         */}
      {/* ========================================================================= */}
      <section className="py-16 md:py-24 border-b border-[#E5E5E5] bg-[#FAFAF9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-14">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#F97316]">
              SYSTEM ARCHITECTURE
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-[#171717]">
              The Core SODAARS Operational Chain.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#525252] leading-relaxed">
              A booking forms the central commercial connection between physical advertising assets, availability, client relationships, and campaign execution.
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <Card className="p-6 sm:p-8 bg-white border-[#E5E5E5] shadow-xs">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                {architecturalFlow.map((node) => {
                  const NodeIcon = node.icon;
                  return (
                    <React.Fragment key={node.name}>
                      <div className="p-4 rounded-lg bg-[#FAFAF9] border border-[#E5E5E5] flex flex-col justify-between text-center relative group hover:border-[#F97316]/50 transition-colors">
                        <div>
                          <div className="w-8 h-8 rounded-md bg-white border border-[#E5E5E5] text-[#F97316] flex items-center justify-center mx-auto mb-2 shadow-xs">
                            <NodeIcon size={16} />
                          </div>
                          <div className="text-[10px] font-mono text-[#F97316] font-semibold">
                            Tier {node.step}
                          </div>
                          <h4 className="text-xs font-bold text-[#171717] mt-0.5">
                            {node.name}
                          </h4>
                          <div className="text-[11px] font-medium text-[#737373] mt-0.5">
                            {node.role}
                          </div>
                          <p className="text-[11px] text-[#525252] leading-snug mt-2 text-left">
                            {node.desc}
                          </p>
                        </div>
                      </div>
                    </React.Fragment>
                  );
                })}
              </div>

              {/* Architectural Unidirectional Explanation */}
              <div className="mt-6 pt-4 border-t border-[#E5E5E5] text-xs text-[#737373] text-center max-w-3xl mx-auto">
                <strong>Conceptual Architecture:</strong> Advertising Resource → Availability → Booking → Customer → Campaign.
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. DIRECT CONTRACTS & CLIENT RENEWALS (CORE BUSINESS FOCUS)               */}
      {/* ========================================================================= */}
      <section className="py-16 md:py-24 border-b border-[#E5E5E5] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Narrative Column */}
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#F97316]">
                <Repeat size={14} className="text-[#F97316]" />
                DIRECT CONTRACTS & RENEWALS
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#171717]">
                Manage Direct Contracts and Client Renewals.
              </h2>
              <div className="space-y-3 text-sm text-[#525252] leading-relaxed">
                <p>
                  Direct contracts and client renewals can be managed alongside marketplace and administrative bookings.
                </p>
                <div className="p-4 rounded-md bg-[#FAFAF9] border border-[#E5E5E5] space-y-2 text-xs">
                  <div>
                    <strong className="text-[#171717]">Direct Contracts:</strong> Media owners maintain and manage their direct advertiser and agency agreements within the unified pipeline.
                  </div>
                  <div className="pt-2 border-t border-[#E5E5E5]">
                    <strong className="text-[#171717]">Client Renewals:</strong> Manage recurring client agreements and display term renewals with consistent pipeline visibility.
                  </div>
                </div>
                <p>
                  By tracking direct contracts within the same workflow, providers keep clear visibility over all resource schedules and upcoming term completions.
                </p>
              </div>
            </div>

            {/* Visual Renewal Operations Card */}
            <div className="lg:col-span-6 space-y-4">
              <Card className="p-6 bg-[#FAFAF9] border-[#E5E5E5] shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E5]">
                  <div className="flex items-center gap-2">
                    <FileText size={16} className="text-[#F97316]" />
                    <span className="text-xs font-bold text-[#171717] uppercase tracking-wider">
                      Direct Contracts & Renewals Overview
                    </span>
                  </div>
                  <Badge variant="brand">Pipeline Record</Badge>
                </div>

                <div className="mt-4 space-y-3">
                  {/* Sample Contract Row 1 */}
                  <div className="p-3.5 rounded-lg bg-white border border-[#E5E5E5] flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-[#171717]">
                        Direct Contract · Western Express Highway Unipole
                      </div>
                      <div className="text-[11px] text-[#737373] mt-0.5">
                        Direct Advertiser Agreement · Booking Stage: Active
                      </div>
                    </div>
                    <Badge variant="active">Active</Badge>
                  </div>

                  {/* Sample Contract Row 2 */}
                  <div className="p-3.5 rounded-lg bg-white border border-amber-200 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-[#171717]">
                        Client Renewal · MG Road Prime Hoarding
                      </div>
                      <div className="text-[11px] text-[#737373] mt-0.5">
                        Agency Renewal Agreement · Booking Stage: Under Review
                      </div>
                    </div>
                    <Badge variant="pending">Under Review</Badge>
                  </div>

                  {/* Sample Contract Row 3 */}
                  <div className="p-3.5 rounded-lg bg-white border border-[#E5E5E5] flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-[#171717]">
                        Direct Contract · Outer Ring Road Gantry
                      </div>
                      <div className="text-[11px] text-[#737373] mt-0.5">
                        Direct Client Agreement · Booking Stage: Confirmed
                      </div>
                    </div>
                    <Badge variant="brand">Confirmed</Badge>
                  </div>
                </div>

                <div className="mt-4 pt-3.5 border-t border-[#E5E5E5] text-[11px] text-[#737373] text-center">
                  Direct contracts and client renewals operate within the same structured booking pipeline.
                </div>
              </Card>
            </div>
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
                  Programmatic Booking Synchronization.
                </h2>
              </div>
              <span className="px-3 py-1 rounded-full bg-stone-200 border border-stone-300 text-xs font-semibold text-stone-700">
                PLANNED / FUTURE
              </span>
            </div>

            <p className="mt-6 text-sm text-[#525252] leading-relaxed">
              SODAARS is architected with a future API layer in mind, designed to enable programmatic booking lifecycle queries and status synchronization with external enterprise systems.
            </p>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#525252]">
              <div className="p-3.5 rounded bg-[#FAFAF9] border border-[#E5E5E5]">
                <div className="font-bold text-[#171717] mb-1">Standardized Booking Status Feeds</div>
                <div>Future programmatic endpoints planned to return stage progression across active bookings.</div>
              </div>
              <div className="p-3.5 rounded bg-[#FAFAF9] border border-[#E5E5E5]">
                <div className="font-bold text-[#171717] mb-1">Enterprise System Synchronization</div>
                <div>Architecture ready to interface with enterprise resource planning and operational software.</div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#E5E5E5] text-[11px] text-[#737373]">
              * Note: The API layer is a planned roadmap capability. No live endpoints or third-party booking integrations are operational in V1.
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
                READY TO STREAMLINE YOUR BOOKING OPERATIONS?
              </span>
              <h2 className="mt-3 text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
                Bring Structure and Clarity to Every Media Contract.
              </h2>
              <p className="mt-4 text-sm sm:text-base text-[#A3A3A3] leading-relaxed">
                Coordinate direct contracts, agency agreements, and client renewals through a clear, auditable booking pipeline.
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

export default BookingPipelinePage;
