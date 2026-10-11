import React from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  ArrowRight,
  ExternalLink,
  Sparkles,
  MapPin,
  Calendar,
  Layers,
  CheckCircle2,
  Eye,
  ChevronRight,
} from 'lucide-react';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';

export const MarketplaceDiscoverPage: React.FC = () => {
  const selectedCity = 'Mumbai';

  const discoveryPillars = [
    {
      title: 'Discovery',
      desc: 'Browse physical static media faces across arterial commercial centers and high-dwell vehicular expressways.',
    },
    {
      title: 'Marketplace',
      desc: 'Transparent pricing with standardized card rates and straightforward commercial agreements.',
    },
    {
      title: 'Advertising Assets',
      desc: 'Complete structural dimensions, illumination specifications, high-res photos, and geographic coordinates.',
    },
    {
      title: 'Provider Control',
      desc: 'Every listing is directly managed and verified by authenticated physical media asset owners across India.',
    },
  ];

  const searchCriteria = [
    {
      icon: MapPin,
      title: 'Location & Landmarks',
      desc: 'Filter by city, municipal zone, arterial expressway corridor, or prominent commercial landmark radius.',
    },
    {
      icon: Layers,
      title: 'Resource Type',
      desc: 'Choose from 10 physical static formats including street hoardings, highway unipoles, gantries, and transit shelters.',
    },
    {
      icon: Calendar,
      title: 'Campaign Dates',
      desc: 'Instant availability verification against real-time provider calendars. Zero phantom inventory or conflicting dates.',
    },
    {
      icon: Eye,
      title: 'Resource Illumination',
      desc: 'Examine front-lit, back-lit, or non-lit specifications with verified evening lighting operating schedules.',
    },
  ];

  const staticFormats = [
    { name: 'Hoardings', desc: 'Prominent roadside and urban intersection large-format billboards.' },
    { name: 'Billboards', desc: 'Highway and expressway structural displays with extended vehicular sightlines.' },
    { name: 'Unipoles', desc: 'Single-pillar elevated displays with exceptional long-range visibility.' },
    { name: 'Gantries', desc: 'Overhead highway spans capturing 100% of lane traffic attention.' },
    { name: 'Bus Shelters', desc: 'Pedestrian and commuter transit panels at street level.' },
    { name: 'Pole Ads', desc: 'Sequential central median kiosks creating repeated brand impressions.' },
    { name: 'Wall Mounts', desc: 'High-impact building elevation banners and commercial facade displays.' },
    { name: 'Rooftops', desc: 'Elevated urban skyline static frames visible across metropolitan hubs.' },
    { name: 'Bridge Panels', desc: 'Overpass and foot overbridge displays capturing continuous commuter flow.' },
  ];

  const buyerSteps = [
    { step: '01', title: 'Search', desc: 'Input target city, preferred static format, and campaign timeline.' },
    { step: '02', title: 'Discover', desc: 'Explore verified physical inventory with transparent dimensions and pricing.' },
    { step: '03', title: 'Review', desc: 'Examine facing, traffic run, and daytime/nighttime approach photos.' },
    { step: '04', title: 'Select', desc: 'Lock campaign dates and submit formal reservation inquiry.' },
    { step: '05', title: 'Confirm & Booking', desc: 'Provider confirms, commercial escrow verified, campaign enters execution.' },
  ];

  const sampleInventory = [
    {
      code: 'HRD-MUM-88',
      name: 'West Express Highway Hoarding — Bandra',
      city: 'Mumbai',
      format: 'Large Hoarding',
      specs: '40 × 20 ft · Front-lit',
      rate: '₹1,85,000 / mo',
      availability: 'Available Oct 15',
    },
    {
      code: 'UNIP-BLR-12',
      name: 'Outer Ring Road Unipole — Bellandur',
      city: 'Bengaluru',
      format: 'Elevated Unipole',
      specs: '30 × 15 ft · Front-lit',
      rate: '₹1,45,000 / mo',
      availability: 'Available Now',
    },
    {
      code: 'GNT-MUM-03',
      name: 'Reclamation Cantilever Gantry — Worli Exit',
      city: 'Mumbai',
      format: 'Highway Gantry',
      specs: '60 × 12 ft · Front-lit',
      rate: '₹2,30,000 / mo',
      availability: 'Available Nov 01',
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
                FOR ADVERTISERS &amp; BUYERS
              </div>

              {/* Headline */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold tracking-tight text-[#171717] leading-[1.12]">
                Discover Outdoor Advertising Resources in One Place.
              </h1>

              {/* Supporting Copy */}
              <p className="mt-6 text-base sm:text-lg text-[#525252] leading-relaxed font-normal max-w-2xl">
                Explore, search, and discover verified physical outdoor media assets across India. Find static hoardings, unipoles, gantries, and bus shelters by location, format, campaign dates, and commercial pricing transparency.
              </p>

              {/* CTAs */}
              <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
                <a href="#inventory" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto" rightIcon={<ArrowRight size={16} />}>
                    Explore Inventory →
                  </Button>
                </a>
                <Link to="/marketplace/how-it-works" className="w-full sm:w-auto">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto" rightIcon={<ExternalLink size={14} />}>
                    How Discovery Works ↗
                  </Button>
                </Link>
              </div>

              <div className="mt-8 pt-6 border-t border-[#E5E5E5]/70 flex flex-wrap items-center gap-4 text-xs text-[#525252]">
                <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-emerald-600" /> 100% Static OOH</span>
                <span>·</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-emerald-600" /> Direct Media Owners</span>
                <span>·</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-emerald-600" /> Verified POP Proof</span>
              </div>
            </div>

            {/* Right Search Mock Box */}
            <div className="lg:col-span-5">
              <Card className="p-6 bg-white border-[#E5E5E5] shadow-lg">
                <div className="pb-3 border-b border-[#E5E5E5] mb-4 flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase text-[#737373]">
                    DISCOVERY SEARCH ENGINE
                  </span>
                  <Badge variant="active" size="sm">LIVE CATALOG</Badge>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] font-semibold text-[#525252] block mb-1">Target Market / City</label>
                    <div className="p-2.5 rounded bg-[#FAFAF9] border border-[#E5E5E5] flex items-center justify-between text-xs">
                      <span className="font-medium text-[#171717]">{selectedCity}, Maharashtra</span>
                      <MapPin size={14} className="text-[#F97316]" />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-[#525252] block mb-1">Static Asset Format</label>
                    <div className="p-2.5 rounded bg-[#FAFAF9] border border-[#E5E5E5] flex items-center justify-between text-xs">
                      <span className="font-medium text-[#171717]">Unipoles &amp; Arterial Hoardings</span>
                      <Layers size={14} className="text-[#F97316]" />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-[#525252] block mb-1">Campaign Period</label>
                    <div className="p-2.5 rounded bg-[#FAFAF9] border border-[#E5E5E5] flex items-center justify-between text-xs">
                      <span className="font-medium text-[#171717]">Oct 15, 2026 – Nov 14, 2026 (30 Days)</span>
                      <Calendar size={14} className="text-[#F97316]" />
                    </div>
                  </div>

                  <Button className="w-full mt-2" size="sm" rightIcon={<Search size={14} />}>
                    Search 450+ Verified Resources →
                  </Button>
                </div>

                {/* Sample result snippets */}
                <div className="mt-4 pt-3 border-t border-[#E5E5E5] space-y-2">
                  <div className="text-[10px] uppercase font-bold text-[#737373]">Featured Opportunities</div>
                  {sampleInventory.map((item) => (
                    <div key={item.code} className="p-2 rounded bg-[#FAFAF9] border border-[#E5E5E5] flex items-center justify-between text-xs">
                      <div>
                        <div className="font-semibold text-[#171717] text-[11px]">{item.name}</div>
                        <div className="text-[10px] text-[#737373]">{item.specs}</div>
                      </div>
                      <span className="font-bold text-[#F97316] text-[11px]">{item.rate}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. A DISCOVERY LAYER FOR OUTDOOR ADVERTISING                              */}
      {/* ========================================================================= */}
      <section className="py-16 md:py-24 border-b border-[#E5E5E5] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#F97316]">
              NETWORK ECOSYSTEM
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-[#171717]">
              A Discovery Layer for Outdoor Advertising.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#525252] leading-relaxed">
              Find static hoardings, unipoles, gantries, and bus shelters across premier transit nodes and commercial corridors with full specification transparency.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {discoveryPillars.map((dp, i) => (
              <Card key={i} className="p-6 bg-[#FAFAF9] border-[#E5E5E5] shadow-xs">
                <span className="text-xs font-mono font-bold text-[#F97316]">PILLAR 0{i + 1}</span>
                <h3 className="font-bold text-base text-[#171717] mt-1">{dp.title}</h3>
                <p className="mt-2 text-xs sm:text-sm text-[#525252] leading-relaxed">{dp.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. SEARCH BY WHAT MATTERS TO YOUR CAMPAIGN                                */}
      {/* ========================================================================= */}
      <section className="py-16 md:py-24 border-b border-[#E5E5E5] bg-[#FAFAF9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#F97316]">
              PRECISION FILTERING
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-[#171717]">
              Search by What Matters to Your Campaign.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#525252] leading-relaxed">
              Eliminate back-and-forth phone calls and stale PDF rate cards. Filter inventory by precise geographical, physical, and availability parameters.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {searchCriteria.map((sc, i) => {
              const Icon = sc.icon;
              return (
                <Card key={i} className="p-6 bg-white border-[#E5E5E5] shadow-xs">
                  <div className="w-9 h-9 rounded bg-orange-50 border border-orange-200 text-[#F97316] flex items-center justify-center mb-3">
                    <Icon size={18} />
                  </div>
                  <h3 className="font-bold text-sm text-[#171717]">{sc.title}</h3>
                  <p className="mt-2 text-xs text-[#525252] leading-relaxed">{sc.desc}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. EXPLORE STATIC OUTDOOR ADVERTISING OPPORTUNITIES                       */}
      {/* ========================================================================= */}
      <section id="inventory" className="py-16 md:py-24 border-b border-[#E5E5E5] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#F97316]">
              STATIC MEDIA FORMATS
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-[#171717]">
              Explore Static Outdoor Advertising Opportunities.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#525252] leading-relaxed">
              Every physical static format serves distinct campaign objectives — from brand stature on expressway unipoles to pedestrian frequency on transit shelters.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {staticFormats.map((sf, idx) => (
              <Card key={idx} className="p-5 bg-[#FAFAF9] border-[#E5E5E5] flex flex-col justify-between shadow-xs hover:border-orange-300 transition-colors">
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-[#E5E5E5] mb-2">
                    <span className="text-xs font-mono font-bold text-[#F97316]">FORMAT 0{idx + 1}</span>
                    <Badge variant="inactive" size="sm">Static OOH</Badge>
                  </div>
                  <h3 className="font-bold text-base text-[#171717]">{sf.name}</h3>
                  <p className="mt-2 text-xs text-[#525252] leading-relaxed">{sf.desc}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#E5E5E5] flex items-center justify-between text-xs">
                  <span className="text-[#737373] text-[11px]">Physical display face</span>
                  <span className="text-[#F97316] font-medium flex items-center gap-0.5">
                    Browse Assets <ChevronRight size={12} />
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. BUYER JOURNEY: FROM SEARCH TO ADVERTISING OPPORTUNITY                  */}
      {/* ========================================================================= */}
      <section className="py-16 md:py-24 border-b border-[#E5E5E5] bg-[#FAFAF9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#F97316]">
              BUYER JOURNEY
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-[#171717]">
              From Search to Advertising Opportunity.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#525252] leading-relaxed">
              A transparent 5-step process designed for media planners, brands, and agencies to contract verified physical outdoor space with complete confidence.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {buyerSteps.map((b) => (
              <Card key={b.step} className="p-4 bg-white border-[#E5E5E5] flex flex-col justify-between shadow-xs">
                <div>
                  <div className="text-xs font-mono font-bold text-[#F97316] mb-1">
                    STEP {b.step}
                  </div>
                  <h3 className="text-sm font-bold text-[#171717]">{b.title}</h3>
                  <p className="mt-2 text-xs text-[#525252] leading-relaxed">{b.desc}</p>
                </div>
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
            VERIFIED OUTDOOR INVENTORY
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white">
            Ready to Explore Outdoor Advertising?
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#A3A3A3] max-w-2xl mx-auto leading-relaxed">
            Search static inventory across India, review verified specifications, and connect with direct media owners through the SODAARS operating system.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link to="/get-started" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto" rightIcon={<ArrowRight size={16} />}>
                Explore All Opportunities →
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

export default MarketplaceDiscoverPage;
