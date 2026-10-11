import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Check,
  CheckCircle2,
  Info,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Layers,
  Calendar,
  FileText,
  Users,
  Camera,
  ChevronDown,
  AlertCircle,
  Scale,
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

export const PricingPage: React.FC = () => {
  const [expandedFaq, setExpandedFaq] = useState<string | null>('faq-1');

  const toggleFaq = (id: string) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  const resourceFormats = [
    { number: '01', name: 'Hoardings', desc: 'Large format static street and roadside billboard displays.' },
    { number: '02', name: 'Billboards', desc: 'High-visibility structural static displays on expressways.' },
    { number: '03', name: 'Unipoles', desc: 'Single-pillar elevated static advertising structures.' },
    { number: '04', name: 'Gantries', desc: 'Overhead static structures spanning highway carriageways.' },
    { number: '05', name: 'Bus Shelters', desc: 'Pedestrian-level static transit shelter panels.' },
    { number: '06', name: 'Pole Ads', desc: 'Vertical static pole kiosk displays on central medians.' },
    { number: '07', name: 'Wall Mounts', desc: 'Direct-facade static banners affixed to elevations.' },
    { number: '08', name: 'Rooftops', desc: 'Elevated static structural frames installed on urban rooftops.' },
    { number: '09', name: 'Bridge Panels', desc: 'Static horizontal displays installed on foot overbridges.' },
    { number: '10', name: 'Other Static Assets', desc: 'Custom structural static outdoor advertising media faces.' },
  ];

  const solutions = [
    {
      icon: Layers,
      title: 'RESOURCE MANAGEMENT',
      desc: 'Catalog physical hoardings, unipoles, dimensions, illumination, and pricing card rates.',
    },
    {
      icon: Calendar,
      title: 'AVAILABILITY ENGINE',
      desc: 'Real-time calendar grid, hold management, and double-booking conflict coordination.',
    },
    {
      icon: FileText,
      title: 'BOOKING PIPELINE',
      desc: 'Manage direct client proposals, contracts, client renewals, and invoicing milestones.',
    },
    {
      icon: Users,
      title: 'CUSTOMER CRM',
      desc: 'Account records for advertising agencies, direct corporate clients, and contact directories.',
    },
    {
      icon: Camera,
      title: 'CAMPAIGN EXECUTION',
      desc: 'Work order assignment, mounting crew dispatch, and tamper-resistant photo proof verification.',
    },
  ];

  const workflowConnections = [
    { title: 'Asset Specification Standardization', desc: 'Catalog exact dimensions, facing, illumination, and photos.' },
    { title: 'Real-time Availability Engine & Holds', desc: 'Manage holds and dates with unified conflict detection.' },
    { title: 'Booking Pipeline & Renewals', desc: 'Track proposals, contracts, and renewal agreements in one view.' },
    { title: 'Customer & Agency CRM', desc: 'Organize agency directories, brand contacts, and billing records.' },
    { title: 'Campaign Execution & Work Orders', desc: 'Dispatch work orders to field crews for physical mounting.' },
    { title: 'Proof of Performance (POP) Ledger', desc: 'Store daytime and illuminated nighttime photo evidence with GPS.' },
  ];

  const separateCommercials = [
    {
      title: 'Printing & Mounting Costs',
      desc: 'Borne directly by the client or provider according to standard trade agreements. SODAARS does not levy printing surcharges.',
    },
    {
      title: 'Municipal Display Taxes',
      desc: 'Direct responsibility of the concessionaire/media asset owner to local municipal corporations and authorities.',
    },
    {
      title: 'Direct Client Invoicing',
      desc: 'Media owners invoice direct corporate clients under their own organization GST and payment credit schedules.',
    },
    {
      title: 'Agency Credit Terms',
      desc: 'Credit periods, settlement timelines, and commission arrangements with direct agencies remain under provider discretion.',
    },
  ];

  const pricingFaqs = [
    {
      id: 'faq-1',
      q: 'How is "Total Registered Resources" defined?',
      a: 'Total Registered Resources is the total sum of all physical static advertising media faces registered in your SODAARS account — combining Active, Inactive, Draft, Under Maintenance, On Hold, and Booked assets. Each sellable display face represents an asset record with dedicated specifications, photo storage, calendar availability, and audit trails.',
    },
    {
      id: 'faq-2',
      q: 'What happens if I have fewer than 20 resources?',
      a: 'Tier 1 is our base operational tier and supports anywhere from 1 up to 50 total registered resources at ₹4,999 / month. You receive all 5 core operational engines regardless of how boutique your initial footprint is.',
    },
    {
      id: 'faq-3',
      q: 'What happens when my network grows from 50 to 51 resources?',
      a: 'When your total registered resources exceed 50, your subscription automatically transitions to Tier 2 (51–100 resources at ₹8,999 / month) starting on your next monthly billing renewal. You maintain uninterrupted operational access across all tools.',
    },
    {
      id: 'faq-4',
      q: 'Do I pay transaction fees on direct client bookings?',
      a: 'Zero. SODAARS charges 0% commission on direct client contracts, regular agency bookings, and client renewals. You retain 100% of revenue from your direct business.',
    },
    {
      id: 'faq-5',
      q: 'Is Marketplace participation included in my subscription?',
      a: 'Yes. Every SODAARS subscription includes the ability to optionally syndicate selected assets to the SODAARS Marketplace. You decide asset by asset whether to participate, and you establish your SODAARS Net Price. You receive 100% of your agreed net amount on confirmed marketplace bookings.',
    },
    {
      id: 'faq-6',
      q: 'Can I manage multiple team users on my plan?',
      a: 'Yes. Both Tier 1 and Tier 2 include multi-user organization access with role-based permissions (Admin, Manager, and Field Supervisor) so your sales, operations, and field mounting teams can collaborate seamlessly.',
    },
    {
      id: 'faq-7',
      q: 'What happens if an advertising resource is temporarily inactive?',
      a: 'Inactive resources continue to count toward your registered capacity threshold because their structural specifications, historical booking records, photo documentation, and geospatial anchor remain actively indexed in your system.',
    },
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
                SUBSCRIPTION PRICING MODEL
              </div>

              {/* Headline */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold tracking-tight text-[#171717] leading-[1.12]">
                Simple Provider Pricing Built Around Your Resource Network.
              </h1>

              {/* Supporting Copy */}
              <p className="mt-6 text-base sm:text-lg text-[#525252] leading-relaxed font-normal max-w-2xl">
                Choose the monthly plan that aligns with the total number of advertising resources registered in SODAARS. Predictable monthly fees based strictly on your inventory capacity.
              </p>

              {/* CTAs */}
              <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
                <a href="#plans" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto" rightIcon={<ArrowRight size={16} />}>
                    Explore Plans →
                  </Button>
                </a>
                <a href="#capacity-rule" className="w-full sm:w-auto">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto" rightIcon={<ExternalLink size={14} />}>
                    Why This Model ↗
                  </Button>
                </a>
              </div>

              {/* Trust Badge */}
              <div className="mt-8 pt-6 border-t border-[#E5E5E5]/70 flex items-center gap-2 text-xs text-[#525252]">
                <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                <span>Provider pricing is strictly separate from marketplace transaction pricing.</span>
              </div>
            </div>

            {/* Right Calculation Rule Graphic */}
            <div className="lg:col-span-5">
              <Card className="p-6 bg-white border-[#E5E5E5] shadow-lg">
                <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E5] mb-4">
                  <div className="flex items-center gap-2">
                    <Scale size={16} className="text-[#F97316]" />
                    <span className="text-xs font-mono font-bold uppercase text-[#737373]">
                      Subscription Calculation Rule
                    </span>
                  </div>
                  <Badge variant="active" size="sm">ACTIVE CALCULATION</Badge>
                </div>

                <div className="space-y-3.5">
                  <div className="p-3.5 rounded-lg bg-[#FAFAF9] border border-[#E5E5E5] flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-orange-100 text-[#F97316] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">1</span>
                    <div>
                      <div className="font-bold text-xs text-[#171717]">Total Registered Resources</div>
                      <div className="text-[11px] text-[#525252] mt-0.5">Hoardings, unipoles, gantries, bus shelters, rooftops &amp; bridge panels.</div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-lg bg-[#FAFAF9] border border-[#E5E5E5] flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-orange-100 text-[#F97316] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">2</span>
                    <div>
                      <div className="font-bold text-xs text-[#171717]">Active + Inactive Resources Combined</div>
                      <div className="text-[11px] text-[#525252] mt-0.5">Drafts, maintenance, booked, and active assets all count toward capacity.</div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-lg bg-[#171717] text-white border border-[#262626] flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#F97316] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">3</span>
                    <div>
                      <div className="font-bold text-xs text-white">Monthly Subscription Tier Applied</div>
                      <div className="text-[11px] text-[#A3A3A3] mt-0.5">1–50 Resources: ₹4,999 / mo · 51–100 Resources: ₹8,999 / mo.</div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#E5E5E5] text-[11px] text-[#737373]">
                  Calculated per calendar month based on total registered inventory.
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. CHOOSE THE PLAN THAT FITS YOUR RESOURCE NETWORK (TIERS)                */}
      {/* ========================================================================= */}
      <section id="plans" className="py-16 md:py-24 border-b border-[#E5E5E5] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#F97316]">
              TIER 1 &amp; TIER 2 PLANS
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-[#171717]">
              Choose the Plan That Fits Your Resource Network.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#525252] leading-relaxed">
              Both plans include the complete SODAARS operational platform. Pricing scales strictly with your physical inventory footprint.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Tier 1 Card */}
            <Card className="p-8 bg-[#FAFAF9] border-[#E5E5E5] flex flex-col justify-between shadow-xs hover:border-[#F97316]/50 transition-colors">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E5]">
                  <span className="text-xs font-mono font-bold text-[#F97316] uppercase">TIER 01</span>
                  <Badge variant="brand" size="sm">1–50 Resources</Badge>
                </div>

                <div className="mt-5">
                  <div className="text-xs font-semibold uppercase tracking-wider text-[#737373]">Entry Network</div>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-4xl sm:text-5xl font-extrabold text-[#171717]">₹4,999</span>
                    <span className="text-xs text-[#737373]">/ month</span>
                  </div>
                  <p className="mt-3 text-xs text-[#525252] leading-relaxed">
                    Ideal for boutique media owners and growing regional outdoor advertising operators.
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-[#E5E5E5]">
                  <div className="text-xs font-semibold text-[#171717] mb-3">Includes All Core Capabilities:</div>
                  <ul className="space-y-2.5 text-xs text-[#525252]">
                    <li className="flex items-start gap-2.5">
                      <Check size={14} className="text-[#F97316] shrink-0 mt-0.5" />
                      <span>Up to 50 total registered resources</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check size={14} className="text-[#F97316] shrink-0 mt-0.5" />
                      <span>All 5 Core Operational Solutions</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check size={14} className="text-[#F97316] shrink-0 mt-0.5" />
                      <span>Resource Management &amp; Specifications</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check size={14} className="text-[#F97316] shrink-0 mt-0.5" />
                      <span>Real-Time Availability Engine &amp; Calendar</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check size={14} className="text-[#F97316] shrink-0 mt-0.5" />
                      <span>Booking Pipeline, Contracts &amp; Renewals</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check size={14} className="text-[#F97316] shrink-0 mt-0.5" />
                      <span>Customer &amp; Agency CRM Management</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check size={14} className="text-[#F97316] shrink-0 mt-0.5" />
                      <span>Campaign Execution &amp; Photo Proof Verification</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check size={14} className="text-[#F97316] shrink-0 mt-0.5" />
                      <span>Voluntary Marketplace Discovery Syndication</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-[#E5E5E5]">
                <Link to="/get-started?tier=1" className="w-full block">
                  <Button className="w-full" size="lg" rightIcon={<ArrowRight size={14} />}>
                    Start With Tier 1 →
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Tier 2 Card */}
            <Card className="p-8 bg-white border-orange-300 shadow-md flex flex-col justify-between relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#F97316] text-white text-[10px] font-bold uppercase tracking-wider">
                High Capacity
              </div>

              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E5]">
                  <span className="text-xs font-mono font-bold text-[#F97316] uppercase">TIER 02</span>
                  <Badge variant="active" size="sm">51–100 Resources</Badge>
                </div>

                <div className="mt-5">
                  <div className="text-xs font-semibold uppercase tracking-wider text-[#737373]">Established Network</div>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-4xl sm:text-5xl font-extrabold text-[#171717]">₹8,999</span>
                    <span className="text-xs text-[#737373]">/ month</span>
                  </div>
                  <p className="mt-3 text-xs text-[#525252] leading-relaxed">
                    Engineered for established media networks with large physical footprints across regions.
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-[#E5E5E5]">
                  <div className="text-xs font-semibold text-[#171717] mb-3">Includes All Core Capabilities:</div>
                  <ul className="space-y-2.5 text-xs text-[#525252]">
                    <li className="flex items-start gap-2.5">
                      <Check size={14} className="text-[#F97316] shrink-0 mt-0.5" />
                      <span>Up to 100 total registered resources</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check size={14} className="text-[#F97316] shrink-0 mt-0.5" />
                      <span>All 5 Core Operational Solutions</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check size={14} className="text-[#F97316] shrink-0 mt-0.5" />
                      <span>Resource Management &amp; Specifications</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check size={14} className="text-[#F97316] shrink-0 mt-0.5" />
                      <span>Real-Time Availability Engine &amp; Calendar</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check size={14} className="text-[#F97316] shrink-0 mt-0.5" />
                      <span>Booking Pipeline, Contracts &amp; Renewals</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check size={14} className="text-[#F97316] shrink-0 mt-0.5" />
                      <span>Customer &amp; Agency CRM Management</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check size={14} className="text-[#F97316] shrink-0 mt-0.5" />
                      <span>Campaign Execution &amp; Photo Proof Verification</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check size={14} className="text-[#F97316] shrink-0 mt-0.5" />
                      <span>Voluntary Marketplace Discovery Syndication</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-[#E5E5E5]">
                <Link to="/get-started?tier=2" className="w-full block">
                  <Button className="w-full" size="lg" rightIcon={<ArrowRight size={14} />}>
                    Start With Tier 2 →
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. PRICING IS BASED ON REGISTERED RESOURCES                               */}
      {/* ========================================================================= */}
      <section id="capacity-rule" className="py-16 md:py-24 border-b border-[#E5E5E5] bg-[#FAFAF9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#F97316]">
              CAPACITY MODEL
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-[#171717]">
              Pricing Is Based on Registered Resources.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#525252] leading-relaxed">
              A transparent calculation methodology where subscription tiers are scaled directly by the volume of physical media faces registered in SODAARS.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Tier Capacity Box */}
            <Card className="p-6 md:p-8 bg-white border-[#E5E5E5] shadow-xs flex flex-col justify-between">
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-[#FAFAF9] border border-[#E5E5E5] flex items-center justify-between">
                  <div>
                    <div className="font-bold text-sm text-[#171717]">1–50 Registered Resources</div>
                    <div className="text-xs text-[#525252]">Up to 50 physical static media faces</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-[#171717]">₹4,999</div>
                    <div className="text-[10px] text-[#737373]">per month</div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-[#FAFAF9] border border-[#E5E5E5] flex items-center justify-between">
                  <div>
                    <div className="font-bold text-sm text-[#171717]">51–100 Registered Resources</div>
                    <div className="text-xs text-[#525252]">51 to 100 physical static media faces</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-[#F97316]">₹8,999</div>
                    <div className="text-[10px] text-[#737373]">per month</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 rounded-lg bg-orange-50/60 border border-orange-200 text-xs text-[#525252] flex items-start gap-2.5">
                <AlertCircle size={16} className="text-[#F97316] shrink-0 mt-0.5" />
                <span>
                  <strong>CAPACITY RULE:</strong> Tier pricing applies to total registered inventory. Inactive and maintenance resources are counted toward the subscription threshold.
                </span>
              </div>
            </Card>

            {/* Right Example Calculation */}
            <Card className="p-6 md:p-8 bg-white border-[#E5E5E5] shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E5] mb-4">
                <span className="text-xs font-mono font-bold uppercase text-[#737373]">HOW CAPACITY IS CALCULATED</span>
                <span className="text-xs font-semibold text-[#F97316]">Example: 38 Assets</span>
              </div>
              <p className="text-xs text-[#525252] leading-relaxed mb-4">
                Example: A regional outdoor media network manages 38 total physical static displays across Mumbai and Thane:
              </p>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded bg-[#FAFAF9] border border-[#E5E5E5]">
                  <span>20 Hoardings (16 active, 4 under maintenance)</span>
                  <span className="font-mono font-bold text-[#171717]">20 assets</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-[#FAFAF9] border border-[#E5E5E5]">
                  <span>12 Unipoles (10 active, 2 on hold)</span>
                  <span className="font-mono font-bold text-[#171717]">12 assets</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-[#FAFAF9] border border-[#E5E5E5]">
                  <span>6 Overhead Gantries (6 active)</span>
                  <span className="font-mono font-bold text-[#171717]">6 assets</span>
                </div>
              </div>

              <div className="mt-4 p-3.5 rounded-lg bg-orange-50 border border-orange-200 text-xs text-[#525252] leading-relaxed">
                <div className="font-bold text-[#171717]">Total Registered = 38 Resources $\rightarrow$ Tier 1 (₹4,999 / mo)</div>
                <div className="text-[11px] text-[#737373] mt-1">
                  Because 38 is within 1–50, the provider is billed at Tier 1. Should the network register its 51st asset, the account automatically adjusts to Tier 2 on the next monthly renewal.
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. YOUR RESOURCE NETWORK DEFINES YOUR SUBSCRIPTION TIER (10 FORMATS)      */}
      {/* ========================================================================= */}
      <section className="py-16 md:py-24 border-b border-[#E5E5E5] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#F97316]">
              SUPPORTED ASSET FORMATS
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-[#171717]">
              Your Resource Network Defines Your Subscription Tier.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#525252] leading-relaxed">
              Both plans cover all 10 physical static advertising formats supported by SODAARS. Every registered face counts toward your organization capacity threshold.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {resourceFormats.map((format) => (
              <Card key={format.number} className="p-4 bg-[#FAFAF9] border-[#E5E5E5] flex flex-col justify-between shadow-xs">
                <div>
                  <div className="w-7 h-7 rounded bg-orange-50 border border-orange-200 text-[#F97316] font-bold text-xs flex items-center justify-center mb-2">
                    {format.number}
                  </div>
                  <h3 className="font-bold text-sm text-[#171717]">{format.name}</h3>
                  <p className="mt-1.5 text-xs text-[#525252] leading-relaxed">{format.desc}</p>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-[#E5E5E5] text-xs text-[#737373] flex items-center gap-2">
            <Info size={14} className="text-[#F97316] shrink-0" />
            <span>Counted as individual display faces. One physical structural location can hold multiple resources (e.g. 2 unipole faces count as 2 resources).</span>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. REGISTERED RESOURCES MATTER — NOT JUST ACTIVE RESOURCES               */}
      {/* ========================================================================= */}
      <section className="py-16 md:py-24 border-b border-[#E5E5E5] bg-[#FAFAF9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#F97316]">
              INVENTORY SCOPE
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-[#171717]">
              Registered Resources Matter — Not Just Active Resources.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#525252] leading-relaxed">
              Understand the architectural reasoning behind counting all registered assets in SODAARS — whether active, on hold, or under maintenance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-6 md:p-8 bg-white border-[#E5E5E5] shadow-xs">
              <span className="text-xs font-mono font-bold text-[#F97316]">CAPACITY COUNT</span>
              <h3 className="text-lg font-bold text-[#171717] mt-1">Total Registered Resources</h3>
              <p className="mt-2 text-xs sm:text-sm text-[#525252] leading-relaxed">
                All advertising resources registered in the system (Active, Inactive, Draft, Under Maintenance, On Hold, or Booked).
              </p>
              <div className="mt-4 p-3.5 rounded bg-[#FAFAF9] border border-[#E5E5E5] text-xs text-[#525252] leading-relaxed">
                Even when an asset is undergoing maintenance or temporarily vacant, it requires database indexing, photo proof storage, map coordinates, and availability engine processing.
              </div>
            </Card>

            <Card className="p-6 md:p-8 bg-white border-[#E5E5E5] shadow-xs">
              <span className="text-xs font-mono font-bold text-[#737373]">COMMERCIAL STATE</span>
              <h3 className="text-lg font-bold text-[#171717] mt-1">Active Resources</h3>
              <p className="mt-2 text-xs sm:text-sm text-[#525252] leading-relaxed">
                Resources currently active in operational schedules or commercial display runs.
              </p>
              <div className="mt-4 p-3.5 rounded bg-[#FAFAF9] border border-[#E5E5E5] text-xs text-[#525252] leading-relaxed">
                Represents your currently revenue-generating physical media faces. Active state determines public marketplace indexing, but not software subscription tiering.
              </div>
            </Card>
          </div>

          <div className="mt-8 p-4 rounded-lg bg-white border border-[#E5E5E5] text-xs text-[#525252] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span>
              <strong>Formula:</strong> Active + Inactive + Under Maintenance + On Hold = <strong>Total Registered Resources</strong>
            </span>
            <span className="text-[#737373]">Subscription tiers are calibrated to total indexed capacity.</span>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. ONE PLATFORM FOR YOUR OUTDOOR ADVERTISING OPERATIONS                  */}
      {/* ========================================================================= */}
      <section className="py-16 md:py-24 border-b border-[#E5E5E5] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#F97316]">
              ALL 5 SOLUTIONS INCLUDED
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-[#171717]">
              One Platform for Your Outdoor Advertising Operations.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#525252] leading-relaxed">
              Both subscription tiers include complete access to all 5 core operational engines. Zero feature paywalls, zero add-on charges.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {solutions.map((sol, i) => {
              const Icon = sol.icon;
              return (
                <Card key={i} className="p-6 bg-[#FAFAF9] border-[#E5E5E5] shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="w-8 h-8 rounded bg-orange-50 border border-orange-200 text-[#F97316] flex items-center justify-center mb-3">
                      <Icon size={16} />
                    </div>
                    <h3 className="font-bold text-xs sm:text-sm text-[#171717]">{sol.title}</h3>
                    <p className="mt-2 text-xs text-[#525252] leading-relaxed">{sol.desc}</p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. PROVIDER SUBSCRIPTION AND MARKETPLACE ARE SEPARATE (DARK CONTAINER)    */}
      {/* ========================================================================= */}
      <section className="py-16 md:py-24 bg-[#171717] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#F97316]">
              COMMERCIAL SEPARATION
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-white">
              Provider Subscription and Marketplace Commercials Are Separate.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#A3A3A3] leading-relaxed">
              A fundamental boundary in SODAARS: Monthly subscription fees cover private operational software. Marketplace transactions follow separate, transparent commercial terms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 md:p-8 rounded-lg bg-[#262626] border border-[#333333] space-y-3">
              <span className="text-xs font-mono font-bold uppercase text-[#F97316]">Software Tooling</span>
              <h3 className="font-bold text-lg text-white">Provider Subscription</h3>
              <p className="text-xs text-[#A3A3A3] leading-relaxed">
                Monthly SaaS subscription fee (₹4,999 or ₹8,999). Covers access to the 5 core operational software modules, team user accounts, private CRM, and digital availability management.
              </p>
              <div className="pt-2 text-xs font-semibold text-emerald-400">
                0% commission on direct client contracts.
              </div>
            </div>

            <div className="p-6 md:p-8 rounded-lg bg-[#262626] border border-[#333333] space-y-3">
              <span className="text-xs font-mono font-bold uppercase text-[#F97316]">Voluntary Discovery</span>
              <h3 className="font-bold text-lg text-white">Marketplace Participation</h3>
              <p className="text-xs text-[#A3A3A3] leading-relaxed">
                Completely voluntary per-resource discovery channel. Media provider receives 100% of agreed SODAARS Net Price. Discovery markup is applied transparently on the customer checkout.
              </p>
              <div className="pt-2 text-xs font-semibold text-emerald-400">
                100% full net settlement to provider.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. MARKETPLACE PRICING STARTS WITH THE AGREED SODAARS PRICE               */}
      {/* ========================================================================= */}
      <section className="py-16 md:py-24 border-b border-[#E5E5E5] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#F97316]">
              TRANSPARENT SETTLEMENT
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-[#171717]">
              Marketplace Pricing Starts With the Agreed SODAARS Price.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#525252] leading-relaxed">
              The provider's agreed SODAARS net price is the non-negotiable financial benchmark. Marketplace commercial markups or buyer-side commissions never erode provider net revenue.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-5 bg-[#FAFAF9] border-[#E5E5E5] text-center shadow-xs">
              <span className="text-[11px] font-mono text-[#737373]">CARD RATE</span>
              <div className="text-xl font-bold text-[#171717] mt-1">₹1,00,000</div>
              <div className="text-xs text-[#525252] mt-0.5">Regular Customer Price</div>
            </Card>

            <Card className="p-5 bg-orange-50 border-orange-200 text-center shadow-xs">
              <span className="text-[11px] font-mono font-bold text-[#F97316]">AGREED NET</span>
              <div className="text-xl font-bold text-[#F97316] mt-1">₹75,000</div>
              <div className="text-xs text-[#171717] mt-0.5 font-medium">SODAARS Net Price</div>
            </Card>

            <Card className="p-5 bg-[#FAFAF9] border-[#E5E5E5] text-center shadow-xs">
              <span className="text-[11px] font-mono text-[#737373]">BUYER SIDE</span>
              <div className="text-xl font-bold text-[#171717] mt-1">Transparent</div>
              <div className="text-xs text-[#525252] mt-0.5">Marketplace Commercials</div>
            </Card>

            <Card className="p-5 bg-[#FAFAF9] border-[#E5E5E5] text-center shadow-xs">
              <span className="text-[11px] font-mono text-[#737373]">INVOICE TOTAL</span>
              <div className="text-xl font-bold text-[#171717] mt-1">Customer Total</div>
              <div className="text-xs text-[#525252] mt-0.5">Formal GST Tax Invoice</div>
            </Card>
          </div>

          <div className="mt-6 pt-4 border-t border-[#E5E5E5] text-xs text-[#737373]">
            SODAARS does not claim fixed percentage markups. Provider net settlement terms are governed by your executed digital Marketplace Participation Agreement.
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. YOUR SUBSCRIPTION CONNECTS THE CORE PROVIDER WORKFLOW                  */}
      {/* ========================================================================= */}
      <section className="py-16 md:py-24 border-b border-[#E5E5E5] bg-[#FAFAF9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#F97316]">
              CONNECTED VALUE
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-[#171717]">
              Your Subscription Connects the Core Provider Workflow.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#525252] leading-relaxed">
              Everything needed to operate a professional outdoor advertising media business in one unified system.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {workflowConnections.map((wc, i) => (
              <Card key={i} className="p-6 bg-white border-[#E5E5E5] shadow-xs">
                <span className="text-xs font-mono font-bold text-[#F97316]">WORKFLOW 0{i + 1}</span>
                <h3 className="font-bold text-sm text-[#171717] mt-1">{wc.title}</h3>
                <p className="mt-2 text-xs text-[#525252] leading-relaxed">{wc.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 10. SOME COMMERCIAL RELATIONSHIPS ARE MANAGED SEPARATELY                  */}
      {/* ========================================================================= */}
      <section className="py-16 md:py-24 border-b border-[#E5E5E5] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#F97316]">
              OPERATIONAL INDEPENDENCE
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-[#171717]">
              Some Commercial Relationships Are Managed Separately.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#525252] leading-relaxed">
              SODAARS does not interfere in external physical printing, fabrication, municipal taxes, or direct client agreements.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {separateCommercials.map((item, idx) => (
              <Card key={idx} className="p-6 bg-[#FAFAF9] border-[#E5E5E5] shadow-xs">
                <span className="text-xs font-mono font-bold text-[#737373]">BOUNDARY 0{idx + 1}</span>
                <h3 className="font-bold text-sm text-[#171717] mt-1">{item.title}</h3>
                <p className="mt-2 text-xs text-[#525252] leading-relaxed">{item.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 11. YOUR SUBSCRIPTION TIER FOLLOWS YOUR REGISTERED NETWORK                */}
      {/* ========================================================================= */}
      <section className="py-16 md:py-24 border-b border-[#E5E5E5] bg-[#FAFAF9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#F97316]">
              AUTOMATIC CAPACITY ALIGNMENT
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-[#171717]">
              Your Subscription Tier Follows Your Registered Network.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#525252] leading-relaxed">
              Your monthly plan aligns seamlessly with your operational scale. As your network grows, tier adjustments reflect real hardware footprint.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-4xl mx-auto">
            <Card className="p-6 bg-white border-[#E5E5E5] shadow-xs text-center">
              <span className="text-xs font-mono font-bold text-[#737373]">TIER 1 (UP TO 50 ASSETS)</span>
              <div className="text-3xl font-bold text-[#171717] mt-2">1–50 Resources</div>
              <div className="text-sm font-semibold text-[#F97316] mt-1">₹4,999 / month</div>
              <p className="mt-2 text-xs text-[#525252]">Ideal for growing local and boutique media operators.</p>
            </Card>

            <Card className="p-6 bg-white border-orange-300 shadow-md text-center">
              <span className="text-xs font-mono font-bold text-[#F97316]">TIER 2 (51 TO 100 ASSETS)</span>
              <div className="text-3xl font-bold text-[#171717] mt-2">51–100 Resources</div>
              <div className="text-sm font-semibold text-[#F97316] mt-1">₹8,999 / month</div>
              <p className="mt-2 text-xs text-[#525252]">Scalable capacity for prominent regional media networks.</p>
            </Card>
          </div>

          <div className="mt-8 text-center text-xs text-[#737373]">
            If your network exceeds 100 resources, customized enterprise capacity tiers and dedicated database infrastructure are configured via enterprise support.
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 12. COMMON QUESTIONS ABOUT SODAARS PRICING (FAQ ACCORDION)                */}
      {/* ========================================================================= */}
      <section className="py-16 md:py-24 border-b border-[#E5E5E5] bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#F97316]">
              PRICING FAQ
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-[#171717]">
              Common Questions About SODAARS Pricing.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#525252] leading-relaxed">
              Direct answers to common questions about subscription fees, resource counting, and marketplace commercials.
            </p>
          </div>

          <div className="space-y-3">
            {pricingFaqs.map((faq) => {
              const isOpen = expandedFaq === faq.id;
              return (
                <div key={faq.id} className="border border-[#E5E5E5] rounded-lg bg-[#FAFAF9] overflow-hidden">
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full p-4 sm:p-5 flex items-center justify-between text-left text-sm sm:text-base font-bold text-[#171717] hover:bg-stone-50 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      size={18}
                      className={`text-[#737373] shrink-0 ml-3 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#F97316]' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-5 sm:px-5 sm:pb-6 text-xs sm:text-sm text-[#525252] leading-relaxed border-t border-[#E5E5E5]/60 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 13. KNOW WHAT YOU'RE PAYING FOR — AND WHY                                */}
      {/* ========================================================================= */}
      <section className="py-16 md:py-24 border-b border-[#E5E5E5] bg-[#FAFAF9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#F97316]">
              TRANSPARENT VALUE ALLOCATION
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-[#171717]">
              Know What You're Paying For — and Why.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#525252] leading-relaxed">
              Clear delineation between SaaS platform tooling, voluntary discovery syndication, and private media revenue.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 bg-white border-[#E5E5E5] shadow-xs">
              <span className="text-xs font-mono font-bold text-[#F97316]">SaaS SUBSCRIPTION</span>
              <h3 className="font-bold text-base text-[#171717] mt-1">Provider Platform</h3>
              <p className="mt-2 text-xs text-[#525252] leading-relaxed">
                Enterprise software subscription covering all 5 core tools, secure asset hosting, availability locks, and private CRM.
              </p>
            </Card>

            <Card className="p-6 bg-white border-[#E5E5E5] shadow-xs">
              <span className="text-xs font-mono font-bold text-[#F97316]">OPTIONAL SYNDICATION</span>
              <h3 className="font-bold text-base text-[#171717] mt-1">Marketplace</h3>
              <p className="mt-2 text-xs text-[#525252] leading-relaxed">
                Optional, voluntary demand generation. Zero listing fees, zero mandatory syndication, full pricing autonomy.
              </p>
            </Card>

            <Card className="p-6 bg-white border-[#E5E5E5] shadow-xs">
              <span className="text-xs font-mono font-bold text-[#F97316]">MEDIA INCOME</span>
              <h3 className="font-bold text-base text-[#171717] mt-1">Resource Advertising Revenue</h3>
              <p className="mt-2 text-xs text-[#525252] leading-relaxed">
                100% of revenue from direct client bookings, plus full 100% of agreed net price on confirmed marketplace reservations.
              </p>
            </Card>
          </div>

          <div className="mt-6 pt-4 border-t border-[#E5E5E5] text-xs text-[#737373] flex items-center gap-2">
            <Info size={14} className="text-[#F97316] shrink-0" />
            <span>Predictable subscription overhead ensures media owners can accurately plan software expenditure without commission volatility.</span>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 14. BOTTOM DARK CTA                                                       */}
      {/* ========================================================================= */}
      <section className="py-16 md:py-20 bg-[#171717] border-t border-[#262626] text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-500/30 bg-orange-500/10 text-[#F97316] text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles size={13} />
            GET STARTED WITH SODAARS
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white">
            Ready to Bring Your Resource Network Into SODAARS?
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#A3A3A3] max-w-2xl mx-auto leading-relaxed">
            Select your subscription tier, register your inventory, and streamline your physical static outdoor media operations.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link to="/get-started" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto" rightIcon={<ArrowRight size={16} />}>
                Get Started →
              </Button>
            </Link>
            <a href="#plans" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto" rightIcon={<ExternalLink size={14} />}>
                Explore Plans ↗
              </Button>
            </a>
          </div>

          <div className="mt-12 pt-6 border-t border-[#262626] flex flex-wrap items-center justify-center gap-6 text-xs text-[#737373]">
            <span>Dedicated enterprise onboarding support</span>
            <span>·</span>
            <span>Zero hidden platform fees</span>
            <span>·</span>
            <span>Pan-India media infrastructure</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PricingPage;
