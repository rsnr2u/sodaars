import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';

export const MarketplaceHowItWorksPage: React.FC = () => {
  const participants = [
    {
      role: 'THE BUYER / CUSTOMER',
      title: 'The Customer',
      desc: 'Media planners, brands, and agencies looking to book physical static OOH media.',
      points: [
        'Discovers verified inventory across India',
        'Submits campaign dates and reservation requests',
        'Provides high-res production creative',
        'Fulfills total invoice payment through secure escrow',
      ],
    },
    {
      role: 'COORDINATION PLATFORM',
      title: 'SODAARS Marketplace',
      desc: 'The operating layer coordinating inventory discovery, availability, and transactions.',
      points: [
        'Indexes verified physical static media faces',
        'Maintains real-time calendar synchronization',
        'Processes escrow payments and commercial invoicing',
        'Enforces Proof of Performance audit compliance',
      ],
    },
    {
      role: 'ASSET CONCESSIONAIRE',
      title: 'The Media Provider',
      desc: 'Physical static media asset owners who manage hoardings, unipoles, and structures.',
      points: [
        'Decides which assets participate in marketplace',
        'Sets agreed SODAARS Net Price per resource',
        'Validates and confirms incoming booking orders',
        'Prints, mounts, and uploads verified photo proof',
      ],
    },
  ];

  const opportunities = [
    {
      title: 'Highway Hoarding',
      location: 'Western Express Highway, Mumbai',
      format: 'Large Hoarding · 40 × 20 ft',
      rate: '₹1,85,000 / mo',
      desc: 'Arterial high-dwell vehicular route connecting commercial districts.',
      status: 'Available',
    },
    {
      title: 'Suburban Unipole',
      location: 'Outer Ring Road, Bengaluru',
      format: 'Elevated Unipole · 30 × 15 ft',
      rate: '₹1,45,000 / mo',
      desc: 'Single-pillar elevated static structure with extended sightline.',
      status: 'Available',
    },
    {
      title: 'Expressway Gantry',
      location: 'Pune-Mumbai Expressway, Pune',
      format: 'Overhead Gantry · 60 × 12 ft',
      rate: '₹2,30,000 / mo',
      desc: 'Overhead static structure spanning multiple traffic lanes.',
      status: 'Available',
    },
  ];

  const bookingSources = [
    {
      source: 'Marketplace',
      desc: 'Inbound verified requests from agencies and advertisers discovering inventory online.',
    },
    {
      source: 'Direct Client Inquiries',
      desc: 'Walk-in corporate advertisers and regular local businesses managed privately.',
    },
    {
      source: 'Direct Renewals',
      desc: 'Existing annual client contracts and repeat campaign extensions.',
    },
  ];

  const journeySteps = [
    { step: '01', title: 'Inquiry Submitted', desc: 'Buyer selects date range and submits campaign inquiry.' },
    { step: '02', title: 'Provider Confirmation', desc: 'Asset owner reviews schedule and accepts order.' },
    { step: '03', title: 'Commercial Escrow', desc: 'Buyer fulfills payment into SODAARS secure escrow.' },
    { step: '04', title: 'Vinyl Printing & Mounting', desc: 'Provider mounting crew executes installation.' },
    { step: '05', title: 'Photo Proof Upload', desc: 'Daytime and nighttime illuminated photos captured.' },
    { step: '06', title: 'Payout Settlement', desc: 'Provider receives 100% of agreed net price.' },
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
                END-TO-END MARKETPLACE WORKFLOW
              </div>

              {/* Headline */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold tracking-tight text-[#171717] leading-[1.12]">
                From Discovery to Booking, One Connected Marketplace Journey.
              </h1>

              {/* Supporting Copy */}
              <p className="mt-6 text-base sm:text-lg text-[#525252] leading-relaxed font-normal max-w-2xl">
                Follow the full lifecycle of outdoor media discovery, inquiry processing, provider confirmation, payment processing, campaign execution, and photo proof verification — all coordinated seamlessly within the SODAARS operating system.
              </p>

              {/* CTAs */}
              <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
                <Link to="/marketplace/discover" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto" rightIcon={<ArrowRight size={16} />}>
                    Explore Marketplace →
                  </Button>
                </Link>
                <a href="#participants" className="w-full sm:w-auto">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto" rightIcon={<ExternalLink size={14} />}>
                    View Workflow ↗
                  </Button>
                </a>
              </div>

              <div className="mt-8 pt-6 border-t border-[#E5E5E5]/70 flex flex-wrap items-center gap-4 text-xs text-[#525252]">
                <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-emerald-600" /> Tri-Party Trust</span>
                <span>·</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-emerald-600" /> Escrow Protected</span>
                <span>·</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-emerald-600" /> Integrated Pipeline</span>
              </div>
            </div>

            {/* Right Journey Milestones Card */}
            <div className="lg:col-span-5">
              <Card className="p-6 bg-white border-[#E5E5E5] shadow-lg">
                <div className="pb-3 border-b border-[#E5E5E5] mb-4 flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase text-[#737373]">
                    JOURNEY MILESTONES
                  </span>
                  <Badge variant="brand" size="sm">End-to-End</Badge>
                </div>

                <div className="space-y-3.5">
                  <div className="p-3 rounded bg-[#FAFAF9] border border-[#E5E5E5] flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-orange-100 text-[#F97316] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">1</span>
                    <div>
                      <div className="font-bold text-xs text-[#171717]">Discovery &amp; Search</div>
                      <div className="text-[11px] text-[#525252] mt-0.5">Filter verified static inventory by city, dates, and dimensions.</div>
                    </div>
                  </div>

                  <div className="p-3 rounded bg-[#FAFAF9] border border-[#E5E5E5] flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-orange-100 text-[#F97316] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">2</span>
                    <div>
                      <div className="font-bold text-xs text-[#171717]">Booking Inquiry Submission</div>
                      <div className="text-[11px] text-[#525252] mt-0.5">Buyer locks requested dates and submits campaign reservation.</div>
                    </div>
                  </div>

                  <div className="p-3 rounded bg-[#FAFAF9] border border-[#E5E5E5] flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-orange-100 text-[#F97316] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">3</span>
                    <div>
                      <div className="font-bold text-xs text-[#171717]">Provider Review &amp; Confirmation</div>
                      <div className="text-[11px] text-[#525252] mt-0.5">Asset owner verifies calendar availability and accepts order.</div>
                    </div>
                  </div>

                  <div className="p-3 rounded bg-[#FAFAF9] border border-[#E5E5E5] flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-orange-100 text-[#F97316] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">4</span>
                    <div>
                      <div className="font-bold text-xs text-[#171717]">Execution &amp; Photo Proof</div>
                      <div className="text-[11px] text-[#525252] mt-0.5">Mounting dispatch with verified daytime &amp; night POP audit.</div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. THREE PARTICIPANTS, ONE CONNECTED WORKFLOW                             */}
      {/* ========================================================================= */}
      <section id="participants" className="py-16 md:py-24 border-b border-[#E5E5E5] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#F97316]">
              TRI-PARTY COORDINATION
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-[#171717]">
              Three Participants, One Connected Workflow.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#525252] leading-relaxed">
              SODAARS acts as the operational bridge between advertisers seeking reach and media owners maintaining physical outdoor assets.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {participants.map((p, idx) => (
              <Card key={idx} className="p-6 bg-[#FAFAF9] border-[#E5E5E5] shadow-xs flex flex-col justify-between">
                <div>
                  <span className="text-xs font-mono font-bold text-[#F97316]">{p.role}</span>
                  <h3 className="text-lg font-bold text-[#171717] mt-1">{p.title}</h3>
                  <p className="mt-2 text-xs text-[#525252] leading-relaxed">{p.desc}</p>

                  <ul className="mt-4 space-y-2 text-xs text-[#525252]">
                    {p.points.map((pt, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 size={13} className="text-[#F97316] shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. CHOOSE AN OPPORTUNITY THAT FITS THE CAMPAIGN                           */}
      {/* ========================================================================= */}
      <section className="py-16 md:py-24 border-b border-[#E5E5E5] bg-[#FAFAF9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#F97316]">
              OPPORTUNITY SELECTION
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-[#171717]">
              Choose an Opportunity That Fits the Campaign.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#525252] leading-relaxed">
              Transparent specifications allow advertisers to evaluate exact dimensions, traffic orientation, and illumination before requesting dates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {opportunities.map((opp, idx) => (
              <Card key={idx} className="p-6 bg-white border-[#E5E5E5] shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E5] mb-3">
                    <span className="text-xs font-mono font-bold text-[#737373]">OPPORTUNITY 0{idx + 1}</span>
                    <Badge variant="active" size="sm">{opp.status}</Badge>
                  </div>
                  <h3 className="font-bold text-base text-[#171717]">{opp.title}</h3>
                  <div className="text-xs text-[#525252] mt-1">{opp.location}</div>
                  <div className="text-xs text-[#737373] mt-0.5">{opp.format}</div>
                  <p className="mt-3 text-xs text-[#525252] leading-relaxed">{opp.desc}</p>
                </div>
                <div className="mt-5 pt-3 border-t border-[#E5E5E5] flex items-center justify-between text-xs">
                  <span className="font-bold text-[#F97316] text-sm">{opp.rate}</span>
                  <span className="text-[#F97316] font-medium flex items-center gap-0.5">
                    View Details <ChevronRight size={12} />
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. THE MARKETPLACE JOURNEY CONTINUES INTO OPERATIONS                      */}
      {/* ========================================================================= */}
      <section className="py-16 md:py-24 border-b border-[#E5E5E5] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#F97316]">
              OPERATIONS &amp; PROOF
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-[#171717]">
              The Marketplace Journey Continues Into Operations.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#525252] leading-relaxed">
              From the moment an order is confirmed, campaign execution manages work orders, field mounting, and tamper-resistant proof of performance.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            {journeySteps.map((s) => (
              <Card key={s.step} className="p-4 bg-[#FAFAF9] border-[#E5E5E5] flex flex-col justify-between shadow-xs">
                <div>
                  <div className="text-xs font-mono font-bold text-[#F97316] mb-1">
                    STEP {s.step}
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-[#171717]">{s.title}</h3>
                  <p className="mt-2 text-[11px] text-[#525252] leading-relaxed">{s.desc}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. MARKETPLACE IS ONE BOOKING SOURCE WITHIN SODAARS                       */}
      {/* ========================================================================= */}
      <section className="py-16 md:py-24 border-b border-[#E5E5E5] bg-[#FAFAF9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#F97316]">
              MULTI-CHANNEL INGESTION
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-[#171717]">
              Marketplace Is One Booking Source Within SODAARS.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#525252] leading-relaxed">
              Your media business runs on diverse client channels. SODAARS coordinates marketplace orders alongside direct corporate inquiries and annual contract renewals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {bookingSources.map((bs, idx) => (
              <Card key={idx} className="p-6 bg-white border-[#E5E5E5] shadow-xs">
                <span className="text-xs font-mono font-bold text-[#F97316]">CHANNEL 0{idx + 1}</span>
                <h3 className="font-bold text-base text-[#171717] mt-1">{bs.source}</h3>
                <p className="mt-2 text-xs text-[#525252] leading-relaxed">{bs.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. PRICING CONNECTS TO PROVIDER TERMS                                     */}
      {/* ========================================================================= */}
      <section className="py-16 md:py-24 border-b border-[#E5E5E5] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#F97316]">
              CLEAR SETTLEMENT
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-[#171717]">
              Marketplace Pricing Connects to Provider Terms.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#525252] leading-relaxed">
              How a ₹75,000 agreed SODAARS Net Price connects to buyer checkout with complete transparency and zero deductions from provider revenue.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <Card className="p-6 bg-white border-[#E5E5E5] shadow-xs text-center">
              <span className="text-xs font-mono font-bold text-[#F97316]">PROVIDER NET SETTLEMENT</span>
              <div className="text-3xl font-bold text-[#171717] mt-2">₹75,000</div>
              <div className="text-xs text-[#525252] mt-1 font-medium">SODAARS Net Price</div>
              <p className="mt-3 text-xs text-[#737373] leading-relaxed">
                The minimum guaranteed net settlement amount agreed by the media provider. Paid 100% in full.
              </p>
            </Card>

            <div className="p-4 rounded-lg bg-orange-50 border border-orange-200 text-center text-xs text-[#525252]">
              <div className="font-bold text-[#F97316] mb-1">Transparent Buyer Commercials</div>
              <span>Platform discovery fee, commercial escrow, and GST applied transparently on customer checkout.</span>
            </div>

            <Card className="p-6 bg-white border-[#E5E5E5] shadow-xs text-center">
              <span className="text-xs font-mono font-bold text-[#737373]">BUYER CHECKOUT TOTAL</span>
              <div className="text-3xl font-bold text-[#171717] mt-2">₹82,500</div>
              <div className="text-xs text-[#525252] mt-1 font-medium">Customer Total Invoice</div>
              <p className="mt-3 text-xs text-[#737373] leading-relaxed">
                All-inclusive total paid by the advertiser. Clear line-item invoice with zero hidden deductions.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. BOTTOM CTA                                                             */}
      {/* ========================================================================= */}
      <section className="py-16 md:py-20 bg-[#171717] border-t border-[#262626] text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-500/30 bg-orange-500/10 text-[#F97316] text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles size={13} />
            ONE CONNECTED JOURNEY
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white">
            Ready to Explore the Marketplace?
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#A3A3A3] max-w-2xl mx-auto leading-relaxed">
            Whether you are a media asset owner expanding your reach or an advertiser seeking verified static inventory, SODAARS connects the entire journey.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link to="/get-started" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto" rightIcon={<ArrowRight size={16} />}>
                Get Started →
              </Button>
            </Link>
            <Link to="/marketplace/discover" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto" rightIcon={<ExternalLink size={14} />}>
                Discover Inventory ↗
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MarketplaceHowItWorksPage;
