import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ExternalLink,
  Layers,
  Calendar,
  FileText,
  Users,
  Camera,
  CheckCircle2,
  Info,
  ChevronRight,
} from 'lucide-react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';

export const AboutCompanyPage: React.FC = () => {
  const threeLayers = [
    {
      layer: 'LAYER 01',
      title: 'Provider Operations',
      badge: 'Private Core Platform',
      badgeVariant: 'brand' as const,
      desc: 'The private operating system where media owners manage physical inventory, configure pricing rate cards, govern real-time availability calendars, manage direct client contracts, and dispatch mounting crews with photo proof.',
      modules: ['Resource Management', 'Availability Engine', 'Booking Pipeline', 'Customer CRM', 'Campaign Execution'],
    },
    {
      layer: 'LAYER 02',
      title: 'SODAARS Exchange Layer',
      badge: 'Governance & Escrow',
      badgeVariant: 'pending' as const,
      desc: 'The coordination infrastructure connecting inventory availability to buyer inquiries, executing commercial escrow, preventing date conflicts, and enforcing tamper-resistant Proof of Performance (POP) audit standards.',
      modules: ['Date-Range Locking', 'Commercial Escrow', 'Dual-Rate Invoicing', 'Dispute Resolution'],
    },
    {
      layer: 'LAYER 03',
      title: 'Marketplace & Inbound Demand',
      badge: 'Optional Syndication',
      badgeVariant: 'active' as const,
      desc: 'The voluntary discovery surface where agencies, national brands, and regional media planners browse verified physical inventory and initiate campaign reservations at provider-specified net rates.',
      modules: ['Public Catalog Indexing', 'Precision Search Filters', 'Consolidated Invoicing', 'Agency Planning Tools'],
    },
  ];

  const solutions = [
    {
      icon: Layers,
      title: 'Resource Management',
      desc: 'Catalog physical hoardings, unipoles, and gantries with exact dimensions, illumination, and facing.',
    },
    {
      icon: Calendar,
      title: 'Availability Engine',
      desc: 'Real-time calendar grid coordinating 6 operational states with conflict-free date locking.',
    },
    {
      icon: FileText,
      title: 'Booking Pipeline',
      desc: 'Manage direct client agreements, marketplace inquiries, and annual renewal schedules.',
    },
    {
      icon: Users,
      title: 'Customer CRM',
      desc: 'Organize agency accounts, direct corporate brand contacts, and billing records.',
    },
    {
      icon: Camera,
      title: 'Campaign Execution',
      desc: 'Dispatch field mounting crews, track vinyl status, and upload verified GPS photo evidence.',
    },
  ];

  const beliefs = [
    {
      title: 'More Than a Directory',
      desc: 'A simple listing site cannot solve outdoor operational chaos. SODAARS provides an operational operating system that manages the actual asset lifecycle.',
    },
    {
      title: 'Not Just an Ad Exchange',
      desc: 'Physical static media does not operate like automated digital programmatic ad banners. It requires physical fabrication, mounting crews, and verified field audit trails.',
    },
    {
      title: 'Not Just a Generic CRM',
      desc: 'Generic CRMs lack spatial geographic awareness, date-overlap validation, and billboard face specifications built specifically for physical media owners.',
    },
    {
      title: 'Not Just a Booking Tool',
      desc: 'Booking without underlying availability governance creates double-booking risks. SODAARS connects booking directly to the underlying physical calendar engine.',
    },
  ];

  const values = [
    {
      title: 'Clarity',
      desc: 'Eliminating guesswork from physical OOH operations through structured specifications, transparent pricing, and real-time availability.',
    },
    {
      title: 'Autonomy',
      desc: 'Media asset owners maintain total sovereignty over their rate cards, direct client relationships, and marketplace participation.',
    },
    {
      title: 'Coordination',
      desc: 'Synchronizing media owners, advertisers, and field operations through a unified operational architecture.',
    },
    {
      title: 'Foundation',
      desc: 'Building robust, long-term digital infrastructure for India’s static outdoor advertising industry with zero shortcuts.',
    },
  ];

  const staticFormats = [
    'Hoardings',
    'Billboards',
    'Unipoles',
    'Gantries',
    'Bus Shelters',
    'Pole Ads',
    'Wall Mounts',
    'Rooftops',
    'Bridge Panels',
    'Other Static Assets',
  ];

  return (
    <div className="w-full bg-[#FAFAF9] text-[#171717]">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION                                                           */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 border-b border-[#E5E5E5] bg-gradient-to-b from-white via-white to-[#FAFAF9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 text-left">
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-200 bg-orange-50 text-[#F97316] text-xs font-semibold uppercase tracking-wider mb-6">
                <Sparkles size={13} className="text-[#F97316]" />
                ABOUT SODAARS
              </div>

              {/* Headline */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold tracking-tight text-[#171717] leading-[1.12]">
                Building the Infrastructure Behind Outdoor Advertising.
              </h1>

              {/* Supporting Copy */}
              <p className="mt-6 text-base sm:text-lg text-[#525252] leading-relaxed font-normal max-w-2xl">
                SODAARS is the outdoor advertising operating system and inventory platform built to connect physical outdoor media assets, provider operations, bookings, customers, campaigns, and marketplace discovery into one unified architectural network.
              </p>

              {/* CTAs */}
              <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
                <Link to="/solutions" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto" rightIcon={<ArrowRight size={16} />}>
                    Explore Solutions →
                  </Button>
                </Link>
                <Link to="/marketplace" className="w-full sm:w-auto">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto" rightIcon={<ExternalLink size={14} />}>
                    Discover Marketplace ↗
                  </Button>
                </Link>
              </div>

              <div className="mt-8 pt-6 border-t border-[#E5E5E5]/70 flex flex-wrap items-center gap-4 text-xs text-[#525252]">
                <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-emerald-600" /> Pan-India Infrastructure</span>
                <span>·</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-emerald-600" /> Media Owner Sovereignty</span>
                <span>·</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-emerald-600" /> 100% Static OOH</span>
              </div>
            </div>

            {/* Right Ecosystem Stack Mock */}
            <div className="lg:col-span-5">
              <Card className="p-6 bg-white border-[#E5E5E5] shadow-lg">
                <div className="pb-3 border-b border-[#E5E5E5] mb-4 flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase text-[#737373]">
                    OPERATING ECOSYSTEM
                  </span>
                  <Badge variant="brand" size="sm">Core Architecture</Badge>
                </div>

                <div className="space-y-3">
                  <div className="p-3 rounded bg-[#FAFAF9] border border-[#E5E5E5] flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-orange-100 text-[#F97316] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">01</span>
                    <div>
                      <div className="font-bold text-xs text-[#171717]">Physical Advertising Assets</div>
                      <div className="text-[11px] text-[#525252] mt-0.5">Hoardings, unipoles, gantries, bus shelters &amp; rooftops.</div>
                    </div>
                  </div>

                  <div className="p-3 rounded bg-[#FAFAF9] border border-[#E5E5E5] flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-orange-100 text-[#F97316] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">02</span>
                    <div>
                      <div className="font-bold text-xs text-[#171717]">Provider Operational Engines</div>
                      <div className="text-[11px] text-[#525252] mt-0.5">Resource management, availability, bookings, CRM &amp; execution.</div>
                    </div>
                  </div>

                  <div className="p-3 rounded bg-[#FAFAF9] border border-[#E5E5E5] flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-orange-100 text-[#F97316] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">03</span>
                    <div>
                      <div className="font-bold text-xs text-[#171717]">Marketplace Discovery Layer</div>
                      <div className="text-[11px] text-[#525252] mt-0.5">Voluntary syndication for agencies, planners, and national brands.</div>
                    </div>
                  </div>

                  <div className="p-3 rounded bg-[#171717] text-white border border-[#262626] flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#F97316] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">04</span>
                    <div>
                      <div className="font-bold text-xs text-white">Connected Future Network</div>
                      <div className="text-[11px] text-[#A3A3A3] mt-0.5">Standardized specifications, API integrations &amp; enterprise ERP sync.</div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. THE FOUNDATIONAL PROBLEM: PHYSICAL VS CONNECTED                        */}
      {/* ========================================================================= */}
      <section className="py-16 md:py-24 border-b border-[#E5E5E5] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#F97316]">
              THE FOUNDATIONAL PROBLEM
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-[#171717]">
              Outdoor Advertising Is Physical. Its Operations Should Be Connected.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#525252] leading-relaxed">
              Outdoor advertising happens across physical steel structures, busy highway milestones, and high-density urban street corners. Yet its everyday management has been trapped in disconnected manual tools.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-6 md:p-8 bg-[#FAFAF9] border-[#E5E5E5] shadow-xs">
              <span className="text-xs font-mono font-bold text-[#737373]">BEFORE SODAARS</span>
              <h3 className="text-lg font-bold text-[#171717] mt-1">Fragmented Traditional Operations</h3>
              <ul className="mt-4 space-y-3 text-xs sm:text-sm text-[#525252] leading-relaxed">
                <li className="flex items-start gap-2.5">
                  <span className="text-red-500 font-bold shrink-0">✕</span>
                  <span>Spreadsheets tracking hundreds of display locations with outdated formulas.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-red-500 font-bold shrink-0">✕</span>
                  <span>Informal WhatsApp messages and phone calls trying to confirm calendar holds.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-red-500 font-bold shrink-0">✕</span>
                  <span>Double-booking clashes when direct sales and agency proposals overlap.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-red-500 font-bold shrink-0">✕</span>
                  <span>Disputed mounting proof with unverified photos and missing GPS timestamps.</span>
                </li>
              </ul>
            </Card>

            <Card className="p-6 md:p-8 bg-orange-50/40 border-orange-200 shadow-xs">
              <span className="text-xs font-mono font-bold text-[#F97316]">WITH SODAARS</span>
              <h3 className="text-lg font-bold text-[#171717] mt-1">The Connected Operational Reality</h3>
              <ul className="mt-4 space-y-3 text-xs sm:text-sm text-[#525252] leading-relaxed">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-[#F97316] shrink-0 mt-0.5" />
                  <span>Structured digital asset catalog with exact dimensions, illumination, and facing.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-[#F97316] shrink-0 mt-0.5" />
                  <span>Real-time availability engine enforcing slot holds and date conflict prevention.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-[#F97316] shrink-0 mt-0.5" />
                  <span>Centralized booking pipeline coordinating direct contracts and client renewals.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-[#F97316] shrink-0 mt-0.5" />
                  <span>Tamper-resistant daytime and nighttime mounting proof with embedded GPS data.</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. THREE LAYERS, ONE CONNECTED ECOSYSTEM                                  */}
      {/* ========================================================================= */}
      <section className="py-16 md:py-24 border-b border-[#E5E5E5] bg-[#FAFAF9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#F97316]">
              ARCHITECTURE OVERVIEW
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-[#171717]">
              Three Layers, One Connected Ecosystem.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#525252] leading-relaxed">
              SODAARS is structured into three integrated tiers that protect provider privacy while opening structured discovery.
            </p>
          </div>

          <div className="space-y-6">
            {threeLayers.map((layer) => (
              <Card key={layer.layer} className="p-6 md:p-8 bg-white border-[#E5E5E5] shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#E5E5E5] gap-2 mb-4">
                  <span className="text-xs font-mono font-bold text-[#F97316]">{layer.layer}</span>
                  <Badge variant={layer.badgeVariant}>{layer.badge}</Badge>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-[#171717]">{layer.title}</h3>
                <p className="mt-2 text-xs sm:text-sm text-[#525252] leading-relaxed">{layer.desc}</p>
                <div className="mt-4 pt-4 border-t border-[#E5E5E5] flex flex-wrap gap-2">
                  {layer.modules.map((mod, i) => (
                    <span key={i} className="px-2.5 py-1 rounded bg-[#FAFAF9] border border-[#E5E5E5] text-[11px] font-medium text-[#171717]">
                      {mod}
                    </span>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. FIVE CONNECTED SOLUTIONS FOR THE OOH WORKFLOW                          */}
      {/* ========================================================================= */}
      <section className="py-16 md:py-24 border-b border-[#E5E5E5] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#F97316]">
              FIVE CORE ENGINES
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-[#171717]">
              Five Connected Solutions for the OOH Workflow.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#525252] leading-relaxed">
              Each solution solves a critical phase of physical outdoor media management, designed to work as a unified operating system.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {solutions.map((s, i) => {
              const Icon = s.icon;
              return (
                <Card key={i} className="p-6 bg-[#FAFAF9] border-[#E5E5E5] shadow-xs flex flex-col justify-between hover:border-orange-300 transition-colors">
                  <div>
                    <div className="w-8 h-8 rounded bg-orange-50 border border-orange-200 text-[#F97316] flex items-center justify-center mb-3">
                      <Icon size={16} />
                    </div>
                    <h3 className="font-bold text-sm text-[#171717]">{s.title}</h3>
                    <p className="mt-2 text-xs text-[#525252] leading-relaxed">{s.desc}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[#E5E5E5] text-[11px] text-[#F97316] font-semibold flex items-center gap-1">
                    Explore Solution <ChevronRight size={12} />
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. STARTING WITH THE PHYSICAL ADVERTISING NETWORK (STATIC FORMATS)        */}
      {/* ========================================================================= */}
      <section className="py-16 md:py-24 border-b border-[#E5E5E5] bg-[#FAFAF9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#F97316]">
              STATIC MEDIA SCOPE
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-[#171717]">
              Starting With the Physical Advertising Network.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#525252] leading-relaxed">
              SODAARS V1 is exclusively dedicated to physical static outdoor advertising assets. All 10 industry formats are fully supported.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {staticFormats.map((format, i) => (
              <div key={i} className="p-3 rounded-lg bg-white border border-[#E5E5E5] text-center shadow-xs">
                <span className="text-xs font-bold text-[#171717]">{format}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 rounded-lg bg-white border border-[#E5E5E5] text-xs text-[#525252] flex items-center gap-2">
            <Info size={14} className="text-[#F97316] shrink-0" />
            <span>Digital displays, LED screens, and programmatic DOOH are outside V1 scope to ensure complete focus on static OOH operational ground truth.</span>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5.5 OPERATIONAL REALITY                                                   */}
      {/* ========================================================================= */}
      <section className="py-16 md:py-24 border-b border-[#E5E5E5] bg-[#FAFAF9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#F97316]">
              OUR PERSPECTIVE
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-[#171717]">
              Focused on the Operational Reality of Outdoor Advertising.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#525252] leading-relaxed">
              We understand how physical outdoor media operates on the ground — and we design specifically for its operational truth.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {beliefs.map((b, i) => (
              <Card key={i} className="p-6 bg-white border-[#E5E5E5] shadow-xs">
                <span className="text-xs font-mono font-bold text-[#F97316]">PERSPECTIVE 0{i + 1}</span>
                <h3 className="font-bold text-base text-[#171717] mt-1">{b.title}</h3>
                <p className="mt-2 text-xs text-[#525252] leading-relaxed">{b.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. FOUNDING VALUES                                                        */}
      {/* ========================================================================= */}
      <section className="py-16 md:py-24 border-b border-[#E5E5E5] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#F97316]">
              FOUNDING VALUES
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-[#171717]">
              How We Think About Building SODAARS.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#525252] leading-relaxed">
              Our principles define how we build software, how we treat media owners, and how we protect operational integrity.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <Card key={i} className="p-6 bg-[#FAFAF9] border-[#E5E5E5] shadow-xs">
                <span className="text-xs font-mono font-bold text-[#F97316]">VALUE 0{i + 1}</span>
                <h3 className="font-bold text-base text-[#171717] mt-1">{v.title}</h3>
                <p className="mt-2 text-xs text-[#525252] leading-relaxed">{v.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. BOTTOM CTA                                                             */}
      {/* ========================================================================= */}
      <section className="py-16 md:py-20 bg-[#171717] border-t border-[#262626] text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-500/30 bg-orange-500/10 text-[#F97316] text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles size={13} />
            OUTDOOR MEDIA OPERATING SYSTEM
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white">
            See How the Platform Connects Outdoor Advertising.
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#A3A3A3] max-w-2xl mx-auto leading-relaxed">
            Experience the dedicated software suite purpose-built for physical static media owners across India.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link to="/get-started" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto" rightIcon={<ArrowRight size={16} />}>
                Get Started →
              </Button>
            </Link>
            <Link to="/solutions" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto" rightIcon={<ExternalLink size={14} />}>
                Explore Solutions ↗
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutCompanyPage;
