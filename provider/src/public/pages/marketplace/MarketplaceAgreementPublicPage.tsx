import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Scale,
} from 'lucide-react';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';

export const MarketplaceAgreementPublicPage: React.FC = () => {
  const corePrinciples = [
    {
      number: '01',
      title: 'Voluntary Participation',
      desc: 'You choose whether your organization participates, and you select which individual static media faces are syndicated to the marketplace. Participation can be paused or modified at any time.',
    },
    {
      number: '02',
      title: 'Provider-Specified Net Pricing',
      desc: 'You establish the SODAARS Net Price for each participating asset. On every confirmed marketplace booking, you receive 100% of this agreed net settlement amount.',
    },
    {
      number: '03',
      title: 'Provider-Led Operational Fulfillment',
      desc: 'You retain full operational authority over your physical assets — structural maintenance, vinyl printing/mounting oversight, and photo proof verification.',
    },
  ];

  const responsibilities = [
    {
      title: 'Structural Maintenance',
      desc: 'Ensuring physical hoardings, unipoles, and structures remain structurally safe, compliant with local municipal codes, and well-maintained.',
    },
    {
      title: 'Timely Mounting Execution',
      desc: 'Fulfilling approved campaign work orders by printing and mounting client artwork within the agreed operational turnaround window.',
    },
    {
      title: 'Availability Governance',
      desc: 'Maintaining accurate operational schedules in the Availability Engine so that marketplace discovery reflects true commercial capacity.',
    },
    {
      title: 'Illumination Reliability',
      desc: 'Operating illumination floodlights reliably on front-lit and back-lit assets during standard evening hours (typically 6:30 PM - 11:30 PM).',
    },
    {
      title: 'Accurate Proof of Performance',
      desc: 'Capturing and uploading tamper-resistant daytime and illuminated nighttime approach photos with verified GPS coordinates and timestamps.',
    },
  ];

  const nonGuarantees = [
    {
      title: 'No Guaranteed Booking Volume',
      desc: 'Marketplace participation provides discovery and inquiry distribution. SODAARS does not guarantee specific occupancy rates or booking quantities.',
    },
    {
      title: 'Not Responsible for Direct Defaults',
      desc: 'SODAARS escrows payments on marketplace bookings prior to mounting dispatch, but is not liable for direct client disputes outside the marketplace.',
    },
    {
      title: 'No Automatic Price Reductions',
      desc: 'SODAARS will never discount or adjust your agreed SODAARS Net Price without your prior formal written consent inside the platform.',
    },
    {
      title: 'Non-Exclusive Relationship',
      desc: 'Media asset owners remain completely autonomous and free to market their inventory directly, through sales agents, or via other channels.',
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
                MARKETPLACE PARTICIPATION AGREEMENT
              </div>

              {/* Headline */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold tracking-tight text-[#171717] leading-[1.12]">
                Clear Terms for a Connected Marketplace Relationship.
              </h1>

              {/* Supporting Copy */}
              <p className="mt-6 text-base sm:text-lg text-[#525252] leading-relaxed font-normal max-w-2xl">
                Understand the operating principles, pricing model, and provider autonomy that define your participation in the SODAARS marketplace. No hidden commissions, no mandatory participation, and full control over which static assets you choose to syndicate.
              </p>

              {/* CTAs */}
              <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
                <a href="#principles" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto" rightIcon={<ArrowRight size={16} />}>
                    Read Agreement Principles →
                  </Button>
                </a>
                <Link to="/marketplace/how-it-works" className="w-full sm:w-auto">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto" rightIcon={<ExternalLink size={14} />}>
                    View Workflow ↗
                  </Button>
                </Link>
              </div>

              <div className="mt-8 pt-6 border-t border-[#E5E5E5]/70 text-xs text-[#737373]">
                Legal Governance: Executed digitally inside the Provider Panel prior to first marketplace listing.
              </div>
            </div>

            {/* Right Steps Card */}
            <div className="lg:col-span-5">
              <Card className="p-6 bg-white border-[#E5E5E5] shadow-lg">
                <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E5] mb-4">
                  <div className="flex items-center gap-2">
                    <Scale size={16} className="text-[#F97316]" />
                    <span className="text-xs font-mono font-bold uppercase text-[#737373]">
                      Agreement Framework
                    </span>
                  </div>
                  <Badge variant="brand" size="sm">Standard Terms</Badge>
                </div>

                <div className="space-y-3.5">
                  <div className="p-3 rounded bg-[#FAFAF9] border border-[#E5E5E5] flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-orange-100 text-[#F97316] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">1</span>
                    <div>
                      <div className="font-bold text-xs text-[#171717]">Identity &amp; Ownership Verification</div>
                      <div className="text-[11px] text-[#525252] mt-0.5">Verified organization KYC and media asset concessions.</div>
                    </div>
                  </div>

                  <div className="p-3 rounded bg-[#FAFAF9] border border-[#E5E5E5] flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-orange-100 text-[#F97316] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">2</span>
                    <div>
                      <div className="font-bold text-xs text-[#171717]">Specification Accuracy</div>
                      <div className="text-[11px] text-[#525252] mt-0.5">Truthful dimensions, facing, illumination, and photos.</div>
                    </div>
                  </div>

                  <div className="p-3 rounded bg-[#FAFAF9] border border-[#E5E5E5] flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-orange-100 text-[#F97316] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">3</span>
                    <div>
                      <div className="font-bold text-xs text-[#171717]">Net Settlement Agreement</div>
                      <div className="text-[11px] text-[#525252] mt-0.5">Provider receives 100% of agreed SODAARS net price.</div>
                    </div>
                  </div>

                  <div className="p-3 rounded bg-[#FAFAF9] border border-[#E5E5E5] flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-orange-100 text-[#F97316] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">4</span>
                    <div>
                      <div className="font-bold text-xs text-[#171717]">Mounting &amp; POP Compliance</div>
                      <div className="text-[11px] text-[#525252] mt-0.5">Timely installation with verified GPS photo evidence.</div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. THREE CORE PRINCIPLES                                                  */}
      {/* ========================================================================= */}
      <section id="principles" className="py-16 md:py-24 border-b border-[#E5E5E5] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#F97316]">
              FOUNDATIONAL PILLARS
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-[#171717]">
              The Marketplace Agreement Centers on Three Core Principles.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#525252] leading-relaxed">
              We believe a successful outdoor advertising network must place media asset owners in full control of their business, inventory, and rates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {corePrinciples.map((p) => (
              <Card key={p.number} className="p-6 bg-[#FAFAF9] border-[#E5E5E5] shadow-xs">
                <div className="w-8 h-8 rounded bg-orange-50 border border-orange-200 text-[#F97316] font-bold text-xs flex items-center justify-center mb-4">
                  {p.number}
                </div>
                <h3 className="font-bold text-base text-[#171717]">{p.title}</h3>
                <p className="mt-2 text-xs sm:text-sm text-[#525252] leading-relaxed">{p.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. RELATIONSHIP TRIANGLE: PROVIDER, SODAARS, CUSTOMER                     */}
      {/* ========================================================================= */}
      <section className="py-16 md:py-24 border-b border-[#E5E5E5] bg-[#FAFAF9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#F97316]">
              ROLES &amp; RESPONSIBILITIES
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-[#171717]">
              A Relationship Between Providers, SODAARS, and Customers.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#525252] leading-relaxed">
              Clear division of commercial roles ensures every participant knows their obligations from inquiry through campaign execution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 bg-white border-[#E5E5E5] shadow-xs">
              <span className="text-xs font-mono font-bold uppercase text-[#737373]">PARTY 01</span>
              <h3 className="text-lg font-bold text-[#171717] mt-1">The Media Provider</h3>
              <ul className="mt-4 space-y-2 text-xs text-[#525252] leading-relaxed">
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-[#F97316] shrink-0 mt-0.5" />
                  <span>Owns or manages physical advertising hardware.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-[#F97316] shrink-0 mt-0.5" />
                  <span>Defines SODAARS Net Price &amp; participation toggle.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-[#F97316] shrink-0 mt-0.5" />
                  <span>Fulfills printing, mounting, and photo proof.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-[#F97316] shrink-0 mt-0.5" />
                  <span>Receives 100% of agreed net settlement amount.</span>
                </li>
              </ul>
            </Card>

            <Card className="p-6 bg-orange-50/40 border-orange-200 shadow-xs">
              <span className="text-xs font-mono font-bold uppercase text-[#F97316]">COORDINATION LAYER</span>
              <h3 className="text-lg font-bold text-[#171717] mt-1">SODAARS Platform</h3>
              <ul className="mt-4 space-y-2 text-xs text-[#525252] leading-relaxed">
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-[#F97316] shrink-0 mt-0.5" />
                  <span>Maintains searchable catalog &amp; availability lock.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-[#F97316] shrink-0 mt-0.5" />
                  <span>Coordinates buyer inquiry &amp; payment escrow.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-[#F97316] shrink-0 mt-0.5" />
                  <span>Enforces standard SLA &amp; photo audit integrity.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-[#F97316] shrink-0 mt-0.5" />
                  <span>Settles agreed net funds to provider promptly.</span>
                </li>
              </ul>
            </Card>

            <Card className="p-6 bg-white border-[#E5E5E5] shadow-xs">
              <span className="text-xs font-mono font-bold uppercase text-[#737373]">PARTY 02</span>
              <h3 className="text-lg font-bold text-[#171717] mt-1">The Customer / Buyer</h3>
              <ul className="mt-4 space-y-2 text-xs text-[#525252] leading-relaxed">
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-[#F97316] shrink-0 mt-0.5" />
                  <span>Searches verified inventory &amp; submits booking order.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-[#F97316] shrink-0 mt-0.5" />
                  <span>Provides high-resolution print creative.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-[#F97316] shrink-0 mt-0.5" />
                  <span>Completes total invoice payment via secure escrow.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-[#F97316] shrink-0 mt-0.5" />
                  <span>Reviews and accepts verified mounting proof.</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. PROVIDERS REMAIN RESPONSIBLE FOR THEIR RESOURCES                      */}
      {/* ========================================================================= */}
      <section className="py-16 md:py-24 border-b border-[#E5E5E5] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#F97316]">
              OPERATIONAL FIDELITY
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-[#171717]">
              Providers Remain Responsible for Their Advertising Resources.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#525252] leading-relaxed">
              Listing an asset on the marketplace is an operational commitment to fulfill campaigns with professionalism, accurate specifications, and verified photo proof.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {responsibilities.map((r, i) => (
              <Card key={i} className="p-6 bg-[#FAFAF9] border-[#E5E5E5] shadow-xs">
                <span className="text-xs font-mono font-bold text-[#F97316]">OBLIGATION 0{i + 1}</span>
                <h3 className="font-bold text-sm text-[#171717] mt-1">{r.title}</h3>
                <p className="mt-2 text-xs text-[#525252] leading-relaxed">{r.desc}</p>
              </Card>
            ))}

            <Card className="p-6 bg-orange-50/50 border-orange-200 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-[#F97316]">OPERATIONAL TRUST</span>
                <h3 className="font-bold text-sm text-[#171717] mt-1">Proof of Performance (POP)</h3>
                <p className="mt-2 text-xs text-[#525252] leading-relaxed">
                  Both daytime and nighttime illuminated approach shots with embedded metadata protect media owners from client disputes and confirm fulfillment.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-orange-200 text-xs font-semibold text-[#F97316]">
                Built into SODAARS Campaign Execution
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. WHAT IS NOT GUARANTEED                                                 */}
      {/* ========================================================================= */}
      <section className="py-16 md:py-24 border-b border-[#E5E5E5] bg-[#FAFAF9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#F97316]">
              HONEST BOUNDARIES
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-[#171717]">
              What Is Not Guaranteed.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#525252] leading-relaxed">
              We maintain strict transparency. SODAARS provides an enterprise software operating system and discovery channel, but makes no unrealistic promises.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {nonGuarantees.map((item, idx) => (
              <Card key={idx} className="p-6 bg-white border-[#E5E5E5] shadow-xs">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle size={16} className="text-[#F97316]" />
                  <span className="text-xs font-mono font-bold text-[#737373]">BOUNDARY 0{idx + 1}</span>
                </div>
                <h3 className="font-bold text-sm text-[#171717]">{item.title}</h3>
                <p className="mt-2 text-xs text-[#525252] leading-relaxed">{item.desc}</p>
              </Card>
            ))}
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
            TRANSPARENT PARTICIPATION
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white">
            Connect Your Resources With SODAARS Marketplace.
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#A3A3A3] max-w-2xl mx-auto leading-relaxed">
            Review the complete digital agreement inside your organization profile, configure your net settlement prices, and start receiving qualified inbound inquiries.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link to="/get-started" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto" rightIcon={<ArrowRight size={16} />}>
                Get Started →
              </Button>
            </Link>
            <Link to="/marketplace/how-it-works" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto" rightIcon={<ExternalLink size={14} />}>
                How It Works ↗
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MarketplaceAgreementPublicPage;
