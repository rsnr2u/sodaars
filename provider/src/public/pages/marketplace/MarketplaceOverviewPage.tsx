import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  Calendar,
  ToggleRight,
  Info,
  ChevronRight,
  Store,
} from 'lucide-react';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';

export const MarketplaceOverviewPage: React.FC = () => {
  const sampleResources = [
    {
      code: 'HRD-MUM-01',
      name: 'Hoarding 01 - Prime Junction',
      city: 'Mumbai',
      format: 'Large Hoarding',
      specs: '30 × 15 ft · Front-lit',
      cardRate: '₹1,20,000 / mo',
      sodaarsPrice: '₹1,05,000 / mo',
      status: 'ACTIVE',
      statusLabel: 'Marketplace Active',
      active: true,
    },
    {
      code: 'UNIP-BLR-04',
      name: 'Unipole 04 - Express Avenue',
      city: 'Bengaluru',
      format: 'Elevated Unipole',
      specs: '40 × 20 ft · Front-lit',
      cardRate: '₹1,85,000 / mo',
      sodaarsPrice: '₹1,65,000 / mo',
      status: 'ACTIVE',
      statusLabel: 'Marketplace Active',
      active: true,
    },
    {
      code: 'GNT-PUN-02',
      name: 'Gantry 02 - Highway Exit Flyover',
      city: 'Pune',
      format: 'Overhead Gantry',
      specs: '60 × 12 ft · Front-lit',
      cardRate: '₹2,10,000 / mo',
      sodaarsPrice: '₹1,90,000 / mo',
      status: 'PRIVATE',
      statusLabel: 'Private / Not Listed',
      active: false,
    },
  ];

  const workflowSteps = [
    { step: '01', title: 'Inquiry / Order', desc: 'Inbound buyer reservation request received from marketplace.' },
    { step: '02', title: 'Provider Review', desc: 'Provider reviews schedule & approves inquiry.' },
    { step: '03', title: 'Booking Ingestion', desc: 'Converts directly into the standard booking pipeline.' },
    { step: '04', title: 'Payment Status', desc: 'Commercial checkout verified prior to mounting dispatch.' },
    { step: '05', title: 'Campaign Active', desc: 'Work order assigned to mounting field crew.' },
    { step: '06', title: 'Photo Proof', desc: 'Timestamped GPS mounting photos uploaded to POP ledger.' },
  ];

  const pillarCards = [
    {
      step: '01',
      title: 'Asset-Level Autonomy',
      desc: 'You decide asset by asset which resources participate in the marketplace and which remain completely private.',
    },
    {
      step: '02',
      title: 'Net Price Sovereignty',
      desc: 'You define your agreed SODAARS net price. You receive 100% of this agreed amount on every confirmed reservation.',
    },
    {
      step: '03',
      title: 'Unified Availability',
      desc: 'Marketplace discovery checks against your unified calendar engine. When direct clients book dates, marketplace closes automatically.',
    },
    {
      step: '04',
      title: 'Standardized Verification',
      desc: 'Daytime and illuminated nighttime mounting photos protect media owners and reassure advertisers with verified POP.',
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
                HOW MARKETPLACE WORKS · FOR MEDIA PROVIDERS
              </div>

              {/* Headline */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold tracking-tight text-[#171717] leading-[1.12]">
                Bring Your Advertising Resources to More Buyers — Without Losing Control.
              </h1>

              {/* Supporting Copy */}
              <p className="mt-6 text-base sm:text-lg text-[#525252] leading-relaxed font-normal max-w-2xl">
                A voluntary marketplace layer for physical outdoor media asset owners. List selected resources at your agreed price, retain direct client bookings, and participate in growing agency, brand, and regional media demand without losing operational autonomy.
              </p>

              {/* CTAs */}
              <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
                <Link to="/marketplace/how-it-works" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto" rightIcon={<ArrowRight size={16} />}>
                    Explore Marketplace →
                  </Button>
                </Link>
                <Link to="/marketplace/agreement" className="w-full sm:w-auto">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto" rightIcon={<ExternalLink size={14} />}>
                    How Participation Works ↗
                  </Button>
                </Link>
              </div>

              {/* Value Pill Strip */}
              <div className="mt-8 pt-6 border-t border-[#E5E5E5]/70 flex flex-wrap items-center gap-4 text-xs text-[#525252]">
                <div className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 size={14} className="text-emerald-600" />
                  <span>Zero Mandatory Participation</span>
                </div>
                <span className="text-[#D4D4D8]">·</span>
                <div className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 size={14} className="text-emerald-600" />
                  <span>Retain Existing Customers</span>
                </div>
                <span className="text-[#D4D4D8]">·</span>
                <div className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 size={14} className="text-emerald-600" />
                  <span>Full Pricing Autonomy</span>
                </div>
              </div>
            </div>

            {/* Right Interactive Mock Card */}
            <div className="lg:col-span-5">
              <Card className="p-6 bg-white border-[#E5E5E5] shadow-lg relative overflow-hidden">
                <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E5] mb-4">
                  <div className="flex items-center gap-2">
                    <ToggleRight size={16} className="text-[#F97316]" />
                    <span className="text-xs font-mono font-bold uppercase text-[#737373]">
                      Marketplace Participation Toggle
                    </span>
                  </div>
                  <Badge variant="active" size="sm">LIVE: ACTIVE</Badge>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="text-[11px] font-mono text-[#737373] uppercase">Physical Static Resource</div>
                    <div className="font-bold text-base text-[#171717] mt-0.5">Unipole 04 — Express Avenue</div>
                    <div className="text-xs text-[#525252] mt-0.5">40 × 20 ft (800 sq ft) · Front-lit · South-Facing Corridor</div>
                  </div>

                  <div className="p-3.5 rounded-lg bg-[#FAFAF9] border border-[#E5E5E5] grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <div className="text-[#737373] text-[11px]">Regular Customer Price:</div>
                      <div className="font-bold text-sm text-[#171717] mt-0.5">₹1,85,000 / mo</div>
                      <div className="text-[10px] text-[#737373]">Retail card rate</div>
                    </div>
                    <div>
                      <div className="text-[#F97316] font-semibold text-[11px]">SODAARS Net Price:</div>
                      <div className="font-bold text-sm text-[#F97316] mt-0.5">₹1,65,000 / mo</div>
                      <div className="text-[10px] text-[#737373]">Agreed net settlement</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg border border-orange-200 bg-orange-50/70 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-[#171717]">Marketplace Participation</div>
                      <div className="text-[11px] text-[#525252]">Asset discoverable to media agencies</div>
                    </div>
                    <div className="px-2.5 py-1 rounded bg-[#F97316] text-white font-bold text-[11px] flex items-center gap-1">
                      <span>ENABLED</span>
                    </div>
                  </div>

                  <div className="pt-2 text-[11px] text-[#737373] flex items-center justify-between border-t border-[#E5E5E5]">
                    <span>Availability Status:</span>
                    <span className="font-semibold text-emerald-700">Available from 15th Oct</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. COMPLEMENTARY DISCOVERY: ADDS A CHANNEL, DOESN'T REPLACE BUSINESS     */}
      {/* ========================================================================= */}
      <section className="py-16 md:py-24 border-b border-[#E5E5E5] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#F97316]">
              COMPLEMENTARY DISCOVERY
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-[#171717]">
              Marketplace Adds a Channel, It Doesn't Replace Your Business.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#525252] leading-relaxed">
              SODAARS Marketplace serves as an inbound discovery channel for regional and national advertisers, media agencies, and brand media planners while leaving your existing direct-booking workflow, customer relationships, and pricing intact.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Existing Business */}
            <Card className="p-6 md:p-8 bg-[#FAFAF9] border-[#E5E5E5] shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E5] mb-5">
                <span className="text-xs font-mono uppercase font-bold text-[#737373]">
                  Direct Operations
                </span>
                <Badge variant="inactive">Private &amp; Proprietary</Badge>
              </div>
              <h3 className="text-lg font-bold text-[#171717]">Your Existing Business</h3>
              <ul className="mt-4 space-y-3 text-xs sm:text-sm text-[#525252] leading-relaxed">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-[#737373] shrink-0 mt-0.5" />
                  <span>Maintain direct relationships with local advertisers, brands, and regular agencies.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-[#737373] shrink-0 mt-0.5" />
                  <span>Retain 100% of revenue on direct contracts with zero commission deductions.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-[#737373] shrink-0 mt-0.5" />
                  <span>Set custom credit terms, private rate card discounts, and direct invoicing schedules.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-[#737373] shrink-0 mt-0.5" />
                  <span>Complete autonomy over which physical media faces are shown publicly and which remain private.</span>
                </li>
              </ul>
            </Card>

            {/* SODAARS Marketplace */}
            <Card className="p-6 md:p-8 bg-orange-50/40 border-orange-200 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-orange-200/80 mb-5">
                <span className="text-xs font-mono uppercase font-bold text-[#F97316]">
                  Inbound Discovery
                </span>
                <Badge variant="brand">Voluntary Inbound Demand</Badge>
              </div>
              <h3 className="text-lg font-bold text-[#171717]">SODAARS Marketplace</h3>
              <ul className="mt-4 space-y-3 text-xs sm:text-sm text-[#525252] leading-relaxed">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-[#F97316] shrink-0 mt-0.5" />
                  <span>Receive verified booking inquiries from brands, agencies, and planners browsing the network.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-[#F97316] shrink-0 mt-0.5" />
                  <span>You receive your agreed SODAARS net price on every confirmed reservation with zero hidden markdowns.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-[#F97316] shrink-0 mt-0.5" />
                  <span>Retain full autonomy: toggle individual asset participation ON or OFF at any time without penalty.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-[#F97316] shrink-0 mt-0.5" />
                  <span>Marketplace bookings enter your unified booking and campaign execution pipeline seamlessly.</span>
                </li>
              </ul>
            </Card>
          </div>

          <div className="mt-8 p-4 rounded-lg bg-[#FAFAF9] border border-[#E5E5E5] flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[#525252] gap-3">
            <div className="flex items-center gap-2">
              <Info size={16} className="text-[#F97316] shrink-0" />
              <span>
                <strong>Zero Mandatory Syndication:</strong> SODAARS is your private operating platform. Marketplace is an optional, voluntary demand layer.
              </span>
            </div>
            <Link to="/marketplace/agreement" className="text-[#F97316] font-semibold hover:underline shrink-0">
              Read Participation Agreement →
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. CHOOSE WHICH RESOURCES PARTICIPATE                                     */}
      {/* ========================================================================= */}
      <section className="py-16 md:py-24 border-b border-[#E5E5E5] bg-[#FAFAF9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#F97316]">
              PROVIDER AUTONOMY
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-[#171717]">
              Choose Which Resources Participate in the Marketplace.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#525252] leading-relaxed">
              Every static outdoor advertising resource has its own independent marketplace participation setting. You decide asset by asset — list premium arterial displays, keep sensitive direct locations private, or adjust participation based on seasonal occupancy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sampleResources.map((res) => (
              <Card
                key={res.code}
                className={`p-6 bg-white border-[#E5E5E5] flex flex-col justify-between shadow-xs transition-colors ${
                  res.active ? 'hover:border-orange-300' : 'opacity-90'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E5] mb-3">
                    <span className="text-[11px] font-mono text-[#737373]">{res.code}</span>
                    <Badge variant={res.active ? 'active' : 'inactive'} size="sm">
                      {res.statusLabel}
                    </Badge>
                  </div>
                  <h3 className="font-bold text-base text-[#171717]">{res.name}</h3>
                  <div className="text-xs text-[#525252] mt-1">{res.city} · {res.format}</div>
                  <div className="text-xs text-[#737373] mt-0.5">{res.specs}</div>

                  <div className="mt-4 p-3 rounded bg-[#FAFAF9] border border-[#E5E5E5] space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[#737373]">Regular Card Rate:</span>
                      <span className="font-semibold text-[#171717]">{res.cardRate}</span>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-[#E5E5E5]">
                      <span className="text-[#F97316] font-medium">SODAARS Net Price:</span>
                      <span className="font-bold text-[#F97316]">{res.sodaarsPrice}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-[#E5E5E5] flex items-center justify-between text-xs">
                  <span className="text-[11px] text-[#737373]">
                    {res.active ? 'Discoverable to buyers' : 'Private internal inventory'}
                  </span>
                  <span className="text-[#F97316] font-medium flex items-center gap-0.5">
                    Configure <ChevronRight size={12} />
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. MARKETPLACE PARTICIPATION AND AVAILABILITY ARE NOT THE SAME            */}
      {/* ========================================================================= */}
      <section className="py-16 md:py-24 border-b border-[#E5E5E5] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#F97316]">
              INDEPENDENT ARCHITECTURE
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-[#171717]">
              Marketplace Participation and Availability Are Not the Same.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#525252] leading-relaxed">
              A fundamental architectural rule of SODAARS: Participation controls whether an advertising face is discoverable in the marketplace; Availability controls whether that face is free to be scheduled for specific calendar dates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-6 md:p-8 bg-[#FAFAF9] border-[#E5E5E5] shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E5] mb-4">
                <span className="text-xs font-mono uppercase font-bold text-[#737373]">Discovery Setting</span>
                <Store size={18} className="text-[#F97316]" />
              </div>
              <h3 className="text-lg font-bold text-[#171717]">Marketplace Participation</h3>
              <p className="mt-2 text-xs sm:text-sm text-[#525252] leading-relaxed">
                Determines whether an advertising resource is listed on the public SODAARS marketplace discovery catalog.
              </p>
              <div className="mt-4 p-4 rounded bg-white border border-[#E5E5E5] space-y-2 text-xs text-[#525252]">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  <span><strong>Enabled:</strong> Asset is indexed and searchable by agencies and brands.</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                  <span><strong>Disabled:</strong> Asset is 100% private. Managed strictly for direct clients.</span>
                </div>
                <div className="text-[11px] text-[#737373] pt-2 border-t border-[#E5E5E5]">
                  Can be toggled instantaneously per asset inside the Provider Panel.
                </div>
              </div>
            </Card>

            <Card className="p-6 md:p-8 bg-[#FAFAF9] border-[#E5E5E5] shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E5] mb-4">
                <span className="text-xs font-mono uppercase font-bold text-[#737373]">Calendar Engine</span>
                <Calendar size={18} className="text-[#F97316]" />
              </div>
              <h3 className="text-lg font-bold text-[#171717]">Resource Availability</h3>
              <p className="mt-2 text-xs sm:text-sm text-[#525252] leading-relaxed">
                Determines the operational schedule and reservation state of the resource across calendar date ranges.
              </p>
              <div className="mt-4 p-4 rounded bg-white border border-[#E5E5E5] space-y-2 text-xs text-[#525252]">
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <span className="p-1.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium">Available</span>
                  <span className="p-1.5 rounded bg-[#FAFAF9] text-[#171717] border border-[#E5E5E5] font-medium">Booked</span>
                  <span className="p-1.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-medium">Hold</span>
                  <span className="p-1.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-medium">Maintenance</span>
                  <span className="p-1.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-medium">Provider Block</span>
                  <span className="p-1.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-medium">Admin Block</span>
                </div>
                <div className="text-[11px] text-[#737373] pt-2 border-t border-[#E5E5E5]">
                  Marketplace automatically respects underlying calendar states to prevent date conflicts.
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. YOUR MARKETPLACE ECONOMICS START WITH THE SODAARS PRICE                */}
      {/* ========================================================================= */}
      <section className="py-16 md:py-24 border-b border-[#E5E5E5] bg-[#FAFAF9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#F97316]">
              TRANSPARENT PRICING MODEL
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-[#171717]">
              Your Marketplace Economics Start With the SODAARS Price.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#525252] leading-relaxed">
              No hidden platform deductions, ambiguous revenue shares, or forced discount cuts. You set your standard card rate and your agreed net SODAARS price. What you agree is what you receive.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 bg-white border-[#E5E5E5] shadow-xs">
              <span className="text-xs font-mono font-bold text-[#737373]">01 · BASE RATE</span>
              <div className="mt-3 text-2xl font-bold text-[#171717]">₹1,85,000</div>
              <div className="text-xs font-semibold text-[#525252] mt-0.5">Regular Customer Price</div>
              <p className="mt-3 text-xs text-[#737373] leading-relaxed">
                The standard public card rate established by the media provider for direct walking corporate buyers.
              </p>
            </Card>

            <Card className="p-6 bg-orange-50/50 border-orange-200 shadow-xs">
              <span className="text-xs font-mono font-bold text-[#F97316]">02 · SETTLEMENT</span>
              <div className="mt-3 text-2xl font-bold text-[#F97316]">₹1,65,000</div>
              <div className="text-xs font-semibold text-[#171717] mt-0.5">SODAARS Net Price</div>
              <p className="mt-3 text-xs text-[#525252] leading-relaxed">
                The agreed net payout to the provider. The media provider receives 100% of this amount on confirmed bookings.
              </p>
            </Card>

            <Card className="p-6 bg-white border-[#E5E5E5] shadow-xs">
              <span className="text-xs font-mono font-bold text-[#737373]">03 · BUYER COMMERCIALS</span>
              <div className="mt-3 text-xl font-bold text-[#171717]">Transparent</div>
              <div className="text-xs font-semibold text-[#525252] mt-0.5">Marketplace Markup</div>
              <p className="mt-3 text-xs text-[#737373] leading-relaxed">
                Applied transparently on the buyer checkout invoice to cover marketplace discovery, escrow, and platform coordination.
              </p>
            </Card>

            <Card className="p-6 bg-white border-[#E5E5E5] shadow-xs">
              <span className="text-xs font-mono font-bold text-[#737373]">04 · CHECKOUT</span>
              <div className="mt-3 text-xl font-bold text-[#171717]">All-Inclusive</div>
              <div className="text-xs font-semibold text-[#525252] mt-0.5">Customer Total Invoice</div>
              <p className="mt-3 text-xs text-[#737373] leading-relaxed">
                Advertisers receive a formal GST tax invoice with full line-item clarity. Zero unexpected settlement surprises.
              </p>
            </Card>
          </div>

          <div className="mt-8 p-4 rounded-lg bg-white border border-[#E5E5E5] text-xs text-[#525252] leading-relaxed">
            <strong>Commercial Boundary Notice:</strong> SODAARS does not claim fixed percentage markups or guaranteed platform commissions. Specific commercial settlement terms are governed by your signed digital Marketplace Participation Agreement.
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. PRESENT THE INFORMATION CUSTOMERS NEED TO DECIDE                       */}
      {/* ========================================================================= */}
      <section className="py-16 md:py-24 border-b border-[#E5E5E5] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#F97316]">
              STRUCTURED PRESENTATION
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-[#171717]">
              Present the Information Customers Need to Decide.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#525252] leading-relaxed">
              Every static outdoor advertising resource in the marketplace displays verified physical specifications — dimensions, facing, illumination, geographic landmark, and high-resolution approach photos.
            </p>
          </div>

          <Card className="p-6 md:p-8 bg-[#FAFAF9] border-[#E5E5E5] shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-[#E5E5E5] gap-3">
              <div>
                <span className="text-xs font-mono text-[#F97316] font-bold">ASSET CODE: UNIP-MUM-04</span>
                <h3 className="text-lg md:text-xl font-bold text-[#171717] mt-0.5">
                  Bandra Reclamation Express Highway — South Face
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="active">Available</Badge>
                <Badge variant="brand">Marketplace Listed</Badge>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
              <div className="p-3.5 rounded bg-white border border-[#E5E5E5]">
                <div className="text-[#737373] text-[11px] font-mono">PHYSICAL SPECIFICATIONS</div>
                <div className="font-bold text-sm text-[#171717] mt-1">40 × 20 ft</div>
                <div className="text-[#525252] mt-0.5">800 sq ft structural display face</div>
                <div className="text-[#737373] text-[11px] mt-2">Format: Elevated Unipole</div>
              </div>

              <div className="p-3.5 rounded bg-white border border-[#E5E5E5]">
                <div className="text-[#737373] text-[11px] font-mono">ILLUMINATION &amp; FACING</div>
                <div className="font-bold text-sm text-[#171717] mt-1">Front-lit (4× 400W LED)</div>
                <div className="text-[#525252] mt-0.5">Operating: 6:30 PM – 11:30 PM</div>
                <div className="text-[#737373] text-[11px] mt-2">Facing: Southbound arterial flow</div>
              </div>

              <div className="p-3.5 rounded bg-white border border-[#E5E5E5]">
                <div className="text-[#737373] text-[11px] font-mono">LOCATION &amp; RUN</div>
                <div className="font-bold text-sm text-[#171717] mt-1">Western Express Highway</div>
                <div className="text-[#525252] mt-0.5">Bandra West, Mumbai (19.0596° N)</div>
                <div className="text-[#737373] text-[11px] mt-2">Run: High dwell commuter artery</div>
              </div>

              <div className="p-3.5 rounded bg-white border border-[#E5E5E5]">
                <div className="text-[#737373] text-[11px] font-mono">COMMERCIAL NET SETTLEMENT</div>
                <div className="font-bold text-sm text-[#F97316] mt-1">₹1,65,000 / mo</div>
                <div className="text-[#525252] mt-0.5">Agreed SODAARS Net Payout</div>
                <div className="text-[#737373] text-[11px] mt-2">Card Rate: ₹1,85,000 / mo</div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#E5E5E5] flex items-center justify-between text-xs text-[#737373]">
              <span>Verified asset record with GPS coordinates and municipal permit documentation.</span>
              <span className="font-mono text-[11px]">Audit ID: SODAARS-AST-8821</span>
            </div>
          </Card>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. KEEP MARKETPLACE DISCOVERY CONNECTED TO AVAILABILITY                   */}
      {/* ========================================================================= */}
      <section className="py-16 md:py-24 border-b border-[#E5E5E5] bg-[#FAFAF9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#F97316]">
              REAL-TIME SYNCHRONIZATION
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-[#171717]">
              Keep Marketplace Discovery Connected to Resource Availability.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#525252] leading-relaxed">
              Because marketplace discovery is directly wired into the SODAARS Availability Engine, buyers only see true availability. No double bookings, no outdated PDF availability lists.
            </p>
          </div>

          <Card className="p-6 bg-white border-[#E5E5E5] shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E5E5E5] gap-2">
              <div>
                <span className="text-xs font-mono font-bold text-[#737373]">SCHEDULE PREVIEW: OCTOBER 2026</span>
                <div className="text-sm font-bold text-[#171717]">Unipole 04 — Express Avenue Availability Timeline</div>
              </div>
              <div className="flex items-center gap-3 text-xs text-[#737373]">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Available</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#171717]"></span> Booked</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Hold</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div className="p-3 rounded border border-emerald-200 bg-emerald-50/60 text-center">
                <div className="text-[10px] font-mono text-emerald-800">OCT 01 - OCT 10</div>
                <div className="font-bold text-xs text-emerald-900 mt-1">Available</div>
                <div className="text-[10px] text-emerald-700 mt-0.5">Open for marketplace</div>
              </div>

              <div className="p-3 rounded border border-[#262626] bg-[#171717] text-white text-center">
                <div className="text-[10px] font-mono text-[#A3A3A3]">OCT 11 - OCT 18</div>
                <div className="font-bold text-xs text-white mt-1">Booked</div>
                <div className="text-[10px] text-[#A3A3A3] mt-0.5">Direct Client Contract</div>
              </div>

              <div className="p-3 rounded border border-emerald-200 bg-emerald-50/60 text-center">
                <div className="text-[10px] font-mono text-emerald-800">OCT 19 - OCT 24</div>
                <div className="font-bold text-xs text-emerald-900 mt-1">Available</div>
                <div className="text-[10px] text-emerald-700 mt-0.5">Open for marketplace</div>
              </div>

              <div className="p-3 rounded border border-amber-200 bg-amber-50/70 text-center">
                <div className="text-[10px] font-mono text-amber-800">OCT 25 - OCT 28</div>
                <div className="font-bold text-xs text-amber-900 mt-1">Client Hold</div>
                <div className="text-[10px] text-amber-700 mt-0.5">Agency Proposal Evaluation</div>
              </div>

              <div className="p-3 rounded border border-emerald-200 bg-emerald-50/60 text-center">
                <div className="text-[10px] font-mono text-emerald-800">OCT 29 - OCT 31</div>
                <div className="font-bold text-xs text-emerald-900 mt-1">Available</div>
                <div className="text-[10px] text-emerald-700 mt-0.5">Open for marketplace</div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#E5E5E5] text-[11px] text-[#737373]">
              Synchronized in real time. Direct contracts locked in the provider panel automatically close marketplace availability.
            </div>
          </Card>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. MARKETPLACE BOOKINGS ENTER THE SAME OPERATIONAL WORKFLOW               */}
      {/* ========================================================================= */}
      <section className="py-16 md:py-24 border-b border-[#E5E5E5] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#F97316]">
              UNIFIED OPERATIONS
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-[#171717]">
              Marketplace Bookings Enter the Same Operational Workflow.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#525252] leading-relaxed">
              When an advertiser books through the marketplace, the transaction does not live in an isolated silo. It enters your standard SODAARS operational pipeline.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            {workflowSteps.map((w) => (
              <Card key={w.step} className="p-4 bg-[#FAFAF9] border-[#E5E5E5] flex flex-col justify-between shadow-xs">
                <div>
                  <div className="text-xs font-mono font-bold text-[#F97316] mb-1">
                    STAGE {w.step}
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-[#171717]">{w.title}</h3>
                  <p className="mt-2 text-[11px] text-[#525252] leading-relaxed">{w.desc}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. A MARKETPLACE DESIGNED AROUND PROVIDER OPERATIONS                       */}
      {/* ========================================================================= */}
      <section className="py-16 md:py-24 border-b border-[#E5E5E5] bg-[#FAFAF9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#F97316]">
              BUILT FOR MEDIA OWNERS
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-[#171717]">
              A Marketplace Designed Around Provider Operations.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#525252] leading-relaxed">
              Every feature of the SODAARS marketplace is built to protect provider sovereignty while connecting verified static supply to qualified agency demand.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillarCards.map((p) => (
              <Card key={p.step} className="p-6 bg-white border-[#E5E5E5] shadow-xs">
                <div className="w-8 h-8 rounded bg-orange-50 border border-orange-200 text-[#F97316] font-bold text-xs flex items-center justify-center mb-3">
                  {p.step}
                </div>
                <h3 className="font-bold text-sm text-[#171717]">{p.title}</h3>
                <p className="mt-2 text-xs text-[#525252] leading-relaxed">{p.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 10. YOU CONTROL THE SUPPLY, SODAARS CONNECTS THE DEMAND (DARK CONTAINER) */}
      {/* ========================================================================= */}
      <section className="py-16 md:py-24 bg-[#171717] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#F97316]">
              ECOSYSTEM GOVERNANCE
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-white">
              You Control the Supply; SODAARS Connects the Demand.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#A3A3A3] leading-relaxed">
              A balanced operating architecture where media providers retain complete operational and commercial control, and SODAARS coordinates discovery and buyer workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-lg bg-[#262626] border border-[#333333] space-y-3">
              <div className="text-xs font-mono font-bold uppercase text-[#F97316]">Provider Control</div>
              <h3 className="font-bold text-base text-white">What You Control</h3>
              <ul className="text-xs text-[#A3A3A3] space-y-2 leading-relaxed">
                <li>• Which assets participate in marketplace</li>
                <li>• Minimum SODAARS net settlement price</li>
                <li>• Booking review &amp; confirmation acceptance</li>
                <li>• Mounting crew dispatch &amp; print specifications</li>
                <li>• 100% of direct client relationships &amp; rates</li>
              </ul>
            </div>

            <div className="p-6 rounded-lg bg-[#262626] border border-[#333333] space-y-3">
              <div className="text-xs font-mono font-bold uppercase text-[#F97316]">SODAARS Role</div>
              <h3 className="font-bold text-base text-white">What SODAARS Coordinates</h3>
              <ul className="text-xs text-[#A3A3A3] space-y-2 leading-relaxed">
                <li>• Buyer discovery catalog &amp; search filters</li>
                <li>• Date range availability synchronization</li>
                <li>• Buyer escrow &amp; payment confirmation</li>
                <li>• Tamper-resistant photo proof audit trail</li>
                <li>• Centralized dispute resolution governance</li>
              </ul>
            </div>

            <div className="p-6 rounded-lg bg-[#262626] border border-[#333333] space-y-3">
              <div className="text-xs font-mono font-bold uppercase text-[#F97316]">Customer Value</div>
              <h3 className="font-bold text-base text-white">What Buyers Receive</h3>
              <ul className="text-xs text-[#A3A3A3] space-y-2 leading-relaxed">
                <li>• Verified physical static inventory data</li>
                <li>• Transparent pricing &amp; real-time availability</li>
                <li>• Structured booking inquiry processing</li>
                <li>• Verified daytime &amp; nighttime mounting proof</li>
                <li>• Single consolidated GST tax invoices</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 11. BOTTOM CTA                                                           */}
      {/* ========================================================================= */}
      <section className="py-16 md:py-20 bg-[#171717] border-t border-[#262626] text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-500/30 bg-orange-500/10 text-[#F97316] text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles size={13} />
            OPEN A NEW DEMAND CHANNEL
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white">
            Ready to Connect Your Resources to SODAARS?
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#A3A3A3] max-w-2xl mx-auto leading-relaxed">
            Register your media organization, catalog your physical static inventory, and optionally enable marketplace discovery on selected assets.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link to="/get-started" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto" rightIcon={<ArrowRight size={16} />}>
                Get Started →
              </Button>
            </Link>
            <Link to="/marketplace/agreement" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto" rightIcon={<ExternalLink size={14} />}>
                Read Agreement ↗
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MarketplaceOverviewPage;
