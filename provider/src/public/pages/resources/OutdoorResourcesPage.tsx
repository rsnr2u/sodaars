import React from 'react';
import { Link } from 'react-router-dom';
import {
  Layers,
  ArrowRight,
  ExternalLink,
  Sparkles,
  MapPin,
  Shield,
  CheckCircle2,
  Code2,
} from 'lucide-react';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';

export const OutdoorResourcesPage: React.FC = () => {
  const resourceTypes = [
    { number: '01', name: 'Hoardings', desc: 'Large format static street and roadside billboard displays mounted along urban corridors and primary commercial thoroughfares.' },
    { number: '02', name: 'Billboards', desc: 'High-visibility structural static displays positioned along major vehicular transit routes, bypasses, and expressways.' },
    { number: '03', name: 'Unipoles', desc: 'Single-pillar elevated static advertising structures offering prominent long-distance sightlines and high vehicular dwell.' },
    { number: '04', name: 'Gantries', desc: 'Overhead static structures spanning across highway carriageways with dual traffic visibility and high impact.' },
    { number: '05', name: 'Bus Shelters', desc: 'Pedestrian-level static transit shelter panels positioned across high-density urban transit nodes and residential belts.' },
    { number: '06', name: 'Pole Ads', desc: 'Standardized vertical static pole kiosk displays mounted along central medians, streetlights, and traffic avenues.' },
    { number: '07', name: 'Wall Mounts', desc: 'Direct-facade static banners and vinyl wraps affixed to exterior building elevations with prominent frontage.' },
    { number: '08', name: 'Rooftops', desc: 'Elevated static structural frames installed on urban building rooftops for panoramic skyline exposure.' },
    { number: '09', name: 'Bridge Panels', desc: 'Static horizontal displays installed on foot overbridges, flyovers, and railway overpasses.' },
    { number: '10', name: 'Other Static Assets', desc: 'Custom structural static outdoor advertising media faces adhering to physical OOH standards.' },
  ];

  const workflowSteps = [
    { step: '01', title: 'Resource Creation', desc: 'Register asset with physical format and location.' },
    { step: '02', title: 'Specs & Photos', desc: 'Document dimensions, illumination, and photos.' },
    { step: '03', title: 'Pricing Setup', desc: 'Define customer card rate and SODAARS net price.' },
    { step: '04', title: 'Availability Sync', desc: 'Set operational dates and booking slots.' },
    { step: '05', title: 'Marketplace Option', desc: 'Toggle voluntary discovery participation.' },
    { step: '06', title: 'Booking Ingestion', desc: 'Receive inquiries and direct contracts.' },
    { step: '07', title: 'Photo Proof', desc: 'Upload verified mounting evidence.' },
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
              OUTDOOR ADVERTISING RESOURCES
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-[#171717] leading-[1.12]">
              Explore the Resources of Outdoor Advertising.
            </h1>

            {/* Supporting Copy */}
            <p className="mt-6 text-base sm:text-lg lg:text-xl text-[#525252] max-w-3xl mx-auto leading-relaxed font-normal">
              Understand the structures, formats, and operational specifications of static outdoor advertising — from hoardings and unipoles to gantries, bus shelters, rooftops, and bridge panels across India.
            </p>

            {/* CTAs */}
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Link to="/get-started" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto" rightIcon={<ArrowRight size={16} />}>
                  Explore Resources →
                </Button>
              </Link>
              <Link to="/resources/guides-playbooks" className="w-full sm:w-auto">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto" rightIcon={<ExternalLink size={14} />}>
                  View Playbooks ↗
                </Button>
              </Link>
            </div>

            {/* Status Metrics Strip */}
            <div className="mt-12 pt-8 border-t border-[#E5E5E5]/60 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-base text-[#171717]">10+</span>
                <span className="text-[#525252]">Standard Asset Formats</span>
              </div>
              <span className="text-[#D4D4D8]">·</span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base text-[#171717]">100%</span>
                <span className="text-[#525252]">Physical Static OOH</span>
              </div>
              <span className="text-[#D4D4D8]">·</span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base text-[#F97316]">Pan-India</span>
                <span className="text-[#525252]">Coverage Architecture</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. LOCATION VS ADVERTISING RESOURCE                                       */}
      {/* ========================================================================= */}
      <section className="py-16 md:py-24 border-b border-[#E5E5E5] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#F97316]">
              SPATIAL MODEL
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-[#171717]">
              An Advertising Resource Is More Than a Location.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#525252] leading-relaxed">
              Location and Advertising Resource are distinct architectural concepts in SODAARS. A physical location hosts the physical media structures that hold the actual commercial advertising assets.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 bg-[#FAFAF9] border-[#E5E5E5] shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E5] mb-4">
                <span className="text-xs font-mono uppercase font-bold text-[#737373]">Spatial Anchor</span>
                <MapPin size={18} className="text-[#F97316]" />
              </div>
              <h3 className="text-lg font-bold text-[#171717]">PHYSICAL LOCATION</h3>
              <p className="mt-2 text-xs sm:text-sm text-[#525252] leading-relaxed">
                The physical parcel, intersection, highway milestone, or geospatial coordinates where structural media hardware is installed.
              </p>
              <div className="mt-4 p-3 rounded bg-white border border-[#E5E5E5] text-xs space-y-1 text-[#525252]">
                <div><strong className="text-[#171717]">Coordinates:</strong> 19.0596° N, 72.8295° E</div>
                <div><strong className="text-[#171717]">City &amp; Zone:</strong> Bandra West, Mumbai, Western Suburban Corridor</div>
                <div><strong className="text-[#171717]">Landmark:</strong> Bandstand / Reclamation Express Highway Flyover</div>
              </div>
            </Card>

            <Card className="p-6 bg-[#FAFAF9] border-[#E5E5E5] shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E5] mb-4">
                <span className="text-xs font-mono uppercase font-bold text-[#737373]">Commercial Entity</span>
                <Layers size={18} className="text-[#F97316]" />
              </div>
              <h3 className="text-lg font-bold text-[#171717]">ADVERTISING RESOURCE</h3>
              <p className="mt-2 text-xs sm:text-sm text-[#525252] leading-relaxed">
                The actual commercial advertising face that is priced, scheduled, made available, and contracted for brand visibility.
              </p>
              <div className="mt-4 p-3 rounded bg-white border border-[#E5E5E5] text-xs space-y-1 text-[#525252]">
                <div><strong className="text-[#171717]">Code &amp; Face:</strong> UNIP-MUM-01 (South-Facing Traffic)</div>
                <div><strong className="text-[#171717]">Dimensions:</strong> 40 × 20 ft (800 sq ft) · Front-lit</div>
                <div><strong className="text-[#171717]">Commercial Rate:</strong> ₹1,85,000 / mo · SODAARS Net: ₹1,65,000 / mo</div>
              </div>
            </Card>
          </div>

          {/* Conceptual Model Connection Card */}
          <div className="mt-8">
            <Card className="p-6 bg-white border-[#E5E5E5] shadow-xs">
              <div className="text-xs font-semibold uppercase tracking-wider text-[#737373] mb-4">
                Spatial Relationship: One Location → Multiple Resources
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                <div className="p-4 rounded-lg bg-orange-50/60 border border-orange-200">
                  <div className="text-[11px] font-mono font-bold text-[#F97316]">LOCATION</div>
                  <div className="font-bold text-sm text-[#171717] mt-0.5">Bandra Reclamation Corridor</div>
                  <div className="text-xs text-[#525252] mt-1">Western Express Highway, Mumbai</div>
                </div>

                <div className="p-4 rounded-lg bg-[#FAFAF9] border border-[#E5E5E5]">
                  <div className="text-[10px] font-mono text-[#737373]">RESOURCE A</div>
                  <div className="font-bold text-xs text-[#171717] mt-0.5">South Face Unipole</div>
                  <div className="text-[11px] text-[#525252]">40×20 ft · Front-lit</div>
                  <Badge variant="active" size="sm" className="mt-2">Available</Badge>
                </div>

                <div className="p-4 rounded-lg bg-[#FAFAF9] border border-[#E5E5E5]">
                  <div className="text-[10px] font-mono text-[#737373]">RESOURCE B</div>
                  <div className="font-bold text-xs text-[#171717] mt-0.5">North Face Unipole</div>
                  <div className="text-[11px] text-[#525252]">40×20 ft · Front-lit</div>
                  <Badge variant="inactive" size="sm" className="mt-2">Booked</Badge>
                </div>

                <div className="p-4 rounded-lg bg-[#FAFAF9] border border-[#E5E5E5]">
                  <div className="text-[10px] font-mono text-[#737373]">RESOURCE C</div>
                  <div className="font-bold text-xs text-[#171717] mt-0.5">Flyover Cantilever Hoarding</div>
                  <div className="text-[11px] text-[#525252]">30×15 ft · Non-lit</div>
                  <Badge variant="pending" size="sm" className="mt-2">Hold</Badge>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. CORE STATIC RESOURCE TYPES                                             */}
      {/* ========================================================================= */}
      <section className="py-16 md:py-24 border-b border-[#E5E5E5] bg-[#FAFAF9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#F97316]">
              STATIC MEDIA FORMATS
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-[#171717]">
              Explore the Core Types of Outdoor Advertising Resources
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#525252] leading-relaxed">
              Every format in physical OOH operates with unique operational parameters, mounting requirements, and visibility dynamics.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {resourceTypes.map((type) => (
              <Card
                key={type.number}
                className="p-5 bg-white border-[#E5E5E5] flex flex-col justify-between hover:border-[#F97316]/50 transition-colors shadow-xs"
              >
                <div>
                  <div className="w-8 h-8 rounded bg-orange-50 border border-orange-200 flex items-center justify-center text-[#F97316] font-bold text-xs mb-3">
                    {type.number}
                  </div>
                  <h3 className="text-sm font-bold text-[#171717]">{type.name}</h3>
                  <p className="mt-2 text-xs text-[#525252] leading-relaxed">{type.desc}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#E5E5E5] flex items-center justify-between text-[11px] text-[#737373]">
                  <span>Static Format</span>
                  <span className="text-[#F97316] font-medium flex items-center gap-0.5">
                    Explore <ArrowRight size={11} />
                  </span>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-8 p-4 rounded-lg bg-white border border-[#E5E5E5] flex items-center justify-between text-xs text-[#525252]">
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-[#F97316] shrink-0" />
              <span>
                <strong>Static OOH Boundary:</strong> SODAARS V1 exclusively manages physical static displays. LED screens, digital displays, and programmatic DOOH are outside V1 scope.
              </span>
            </div>
            <Badge variant="inactive">Static Media Only</Badge>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. MASTER RESOURCE SPECIFICATION CARD                                     */}
      {/* ========================================================================= */}
      <section className="py-16 md:py-24 border-b border-[#E5E5E5] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#F97316]">
              STRUCTURED METADATA
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-[#171717]">
              Every Resource Carries the Information Needed to Manage It
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#525252] leading-relaxed">
              In SODAARS, every static outdoor advertising asset incorporates structured operational metadata: dimensions, facing, illumination, rate cards, marketplace status, and availability.
            </p>
          </div>

          <Card className="bg-[#FAFAF9] border-[#E5E5E5] p-6 sm:p-8 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E5E5E5] gap-3">
              <div>
                <span className="font-mono text-xs font-bold text-[#F97316]">RES-MUM-001</span>
                <h3 className="text-lg font-bold text-[#171717] mt-0.5">Bandra Reclamation Prime Unipole</h3>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="active">Available</Badge>
                <Badge variant="brand">Marketplace Enabled</Badge>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="p-3.5 bg-white rounded border border-[#E5E5E5]">
                <span className="text-[#737373] text-[10px] uppercase font-semibold block">Dimensions &amp; Area</span>
                <span className="font-bold text-sm text-[#171717] mt-0.5 block">40 × 20 ft</span>
                <span className="text-[11px] text-[#525252]">800 sq ft Display Face</span>
              </div>

              <div className="p-3.5 bg-white rounded border border-[#E5E5E5]">
                <span className="text-[#737373] text-[10px] uppercase font-semibold block">Illumination</span>
                <span className="font-bold text-sm text-[#171717] mt-0.5 block">Front-lit</span>
                <span className="text-[11px] text-[#525252]">High-Output Halogen Array</span>
              </div>

              <div className="p-3.5 bg-white rounded border border-[#E5E5E5]">
                <span className="text-[#737373] text-[10px] uppercase font-semibold block">Traffic Facing</span>
                <span className="font-bold text-sm text-[#171717] mt-0.5 block">South-Facing</span>
                <span className="text-[11px] text-[#525252]">Inbound to Bandra-Worli Sea Link</span>
              </div>

              <div className="p-3.5 bg-white rounded border border-[#E5E5E5]">
                <span className="text-[#737373] text-[10px] uppercase font-semibold block">Commercial Rate</span>
                <span className="font-bold text-sm text-[#171717] mt-0.5 block">₹1,85,000 / mo</span>
                <span className="text-[11px] text-[#EA580C]">Net Price: ₹1,65,000 / mo</span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-white rounded border border-[#E5E5E5] text-xs text-[#525252] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-[#F97316] shrink-0" />
                <span>Western Express Highway, Bandra (W), Mumbai, Maharashtra · Lat 19.0596° N, Long 72.8295° E</span>
              </div>
              <span className="font-mono text-[11px] text-[#737373]">Status: Verified Static Asset</span>
            </div>
          </Card>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. PRICING SEPARATION & MARKETPLACE SYNDICATION                           */}
      {/* ========================================================================= */}
      <section className="py-16 md:py-24 border-b border-[#E5E5E5] bg-[#FAFAF9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#F97316]">
                COMMERCIAL SOVEREIGNTY
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#171717]">
                Keep Customer Pricing and Marketplace Pricing Connected
              </h2>
              <p className="text-sm text-[#525252] leading-relaxed">
                SODAARS eliminates rate confusion by clearly separating the provider’s direct street rate from the marketplace net settlement price. Providers maintain 100% control over pricing decisions.
              </p>
              <div className="space-y-2 pt-2">
                <div className="flex items-start gap-2 text-xs text-[#525252]">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Zero Mandatory Markups:</strong> Providers define their own commercial rates without automated pricing overrides.</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-[#525252]">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Asset-Level Toggle:</strong> Choose which assets participate in Marketplace discovery and which remain private.</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="p-6 bg-white border-[#E5E5E5] shadow-xs">
                <span className="text-[11px] font-mono uppercase text-[#737373] block mb-1">Direct Street Card Rate</span>
                <div className="text-2xl font-bold text-[#171717]">₹1,00,000</div>
                <div className="text-xs text-[#525252] mt-1">Per calendar month</div>
                <p className="mt-4 text-xs text-[#737373] leading-relaxed">
                  Published retail rate card used for direct customer proposals, local agency negotiations, and repeat corporate advertisers.
                </p>
                <div className="mt-4 pt-3 border-t border-[#E5E5E5] text-[11px] font-semibold text-[#171717]">
                  Direct Provider Sales
                </div>
              </Card>

              <Card className="p-6 bg-white border-[#E5E5E5] shadow-xs">
                <span className="text-[11px] font-mono uppercase text-[#F97316] block mb-1">SODAARS Net Price</span>
                <div className="text-2xl font-bold text-[#EA580C]">₹75,000</div>
                <div className="text-xs text-[#525252] mt-1">Agreed platform net rate</div>
                <p className="mt-4 text-xs text-[#737373] leading-relaxed">
                  Agreed net settlement price provided for marketplace catalog discovery, national brand inquiries, and programmatic matching.
                </p>
                <div className="mt-4 pt-3 border-t border-[#E5E5E5] text-[11px] font-semibold text-[#EA580C]">
                  Marketplace Discovery
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. HORIZONTAL WORKFLOW STRIP                                              */}
      {/* ========================================================================= */}
      <section className="py-16 md:py-24 border-b border-[#E5E5E5] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#F97316]">
              OPERATIONAL PROGRESSION
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-[#171717]">
              From Registration to Marketplace Availability
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#525252] leading-relaxed">
              A standardized 7-step process ensures every physical advertising resource enters the operational lifecycle with verified specifications.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
            {workflowSteps.map((step) => (
              <Card key={step.step} className="p-4 bg-[#FAFAF9] border-[#E5E5E5] text-xs flex flex-col justify-between">
                <div>
                  <span className="font-mono text-xs font-bold text-[#F97316] bg-orange-50 px-1.5 py-0.5 rounded border border-orange-200">
                    {step.step}
                  </span>
                  <h4 className="font-bold text-[#171717] mt-2">{step.title}</h4>
                  <p className="mt-1 text-[11px] text-[#525252] leading-relaxed">{step.desc}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. THREE PILLARS & FUTURE API CARD                                        */}
      {/* ========================================================================= */}
      <section className="py-16 md:py-24 border-b border-[#E5E5E5] bg-[#FAFAF9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#F97316]">
              VALUE PROPOSITION
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-[#171717]">
              A Clear Resource Structure Creates a Cleaner Advertising Workflow
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 bg-white border-[#E5E5E5] shadow-xs">
              <span className="text-[11px] font-mono text-[#F97316] font-semibold uppercase">Advertisers</span>
              <h3 className="text-base font-bold text-[#171717] mt-1">Value for Advertisers</h3>
              <p className="mt-2 text-xs text-[#525252] leading-relaxed">
                Eliminates opaque street pricing with standardized physical specifications, verified location landmarks, illumination transparency, and accurate display dimensions.
              </p>
            </Card>

            <Card className="p-6 bg-white border-[#E5E5E5] shadow-xs">
              <span className="text-[11px] font-mono text-[#F97316] font-semibold uppercase">Asset Owners</span>
              <h3 className="text-base font-bold text-[#171717] mt-1">Foundation for Providers</h3>
              <p className="mt-2 text-xs text-[#525252] leading-relaxed">
                Provides a structured master catalog preserving proprietary rates, coordinating availability calendars, and enabling voluntary marketplace participation.
              </p>
            </Card>

            <Card className="p-6 bg-white border-[#E5E5E5] shadow-xs">
              <span className="text-[11px] font-mono text-[#F97316] font-semibold uppercase">Operations</span>
              <h3 className="text-base font-bold text-[#171717] mt-1">Unified Media Execution</h3>
              <p className="mt-2 text-xs text-[#525252] leading-relaxed">
                Connects registered media faces directly to booking workflows, customer accounts, field mounting crews, and geotagged photo proof documentation.
              </p>
            </Card>
          </div>

          {/* Future API Card */}
          <div className="mt-12">
            <Card className="bg-white border-[#E5E5E5] p-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E5E5E5] gap-3">
                <div className="flex items-center gap-2">
                  <Code2 size={18} className="text-[#F97316]" />
                  <h4 className="text-base font-bold text-[#171717]">
                    A Structured Resource Model Built for a Larger Ecosystem
                  </h4>
                </div>
                <Badge variant="inactive">Roadmap / Planned API</Badge>
              </div>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-[#525252]">
                <div className="p-3 bg-[#FAFAF9] rounded border border-[#E5E5E5]">
                  <strong className="text-[#171717] block mb-1">Catalog Synchronization</strong>
                  <span>Programmatic sync with third-party ERPs and enterprise inventory management platforms.</span>
                </div>
                <div className="p-3 bg-[#FAFAF9] rounded border border-[#E5E5E5]">
                  <strong className="text-[#171717] block mb-1">Live Availability Feeds</strong>
                  <span>Webhooks notifying partner platforms of date-range availability transitions.</span>
                </div>
                <div className="p-3 bg-[#FAFAF9] rounded border border-[#E5E5E5]">
                  <strong className="text-[#171717] block mb-1">Enterprise Media Query</strong>
                  <span>Programmatic search by physical format, city corridor, illumination, and dimensional area.</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. DARK CALLOUT BANNER                                                    */}
      {/* ========================================================================= */}
      <section className="py-16 md:py-24 bg-[#171717] text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#F97316]">
            READY TO ORGANIZE YOUR OUTDOOR INVENTORY?
          </span>
          <h2 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-white">
            Find the Right Outdoor Advertising Resource.
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#A3A3A3] max-w-2xl mx-auto leading-relaxed">
            Eliminate operational fragmentation. Register your physical static inventory and connect your assets to verified bookings and marketplace demand.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link to="/get-started" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto" rightIcon={<ArrowRight size={16} />}>
                Explore Resources →
              </Button>
            </Link>
            <Link to="/resources/guides-playbooks" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto" rightIcon={<ExternalLink size={14} />}>
                View Guides ↗
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OutdoorResourcesPage;
