import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  HelpCircle,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Search,
  ChevronDown,
  Layers,
  BookOpen,
  ShoppingBag,
} from 'lucide-react';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';

interface FAQItem {
  id: string;
  q: string;
  a: string;
}

interface FAQCategory {
  title: string;
  eyebrow: string;
  categoryKey: string;
  desc: string;
  items: FAQItem[];
}

export const FAQPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    'cat-1-q-1': true, // Open the first question by default
    'cat-2-q-1': true,
  });

  const toggleItem = (id: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const categories: FAQCategory[] = [
    {
      title: 'Understanding the Platform',
      eyebrow: 'CORE ARCHITECTURE',
      categoryKey: 'platform',
      desc: 'Core architectural concepts and ecosystem design.',
      items: [
        {
          id: 'cat-1-q-1',
          q: 'What is SODAARS?',
          a: 'SODAARS is an outdoor advertising operating system and inventory platform designed to connect advertising resource management, availability, bookings, customer relationships, campaign execution, and marketplace discovery into a single architectural network.',
        },
        {
          id: 'cat-1-q-2',
          q: 'Who is SODAARS for?',
          a: 'SODAARS is built specifically for physical outdoor media asset owners, concessionaires, and media operators who own or manage hoardings, unipoles, gantries, bus shelters, and other static OOH media faces.',
        },
        {
          id: 'cat-1-q-3',
          q: 'What does SODAARS help providers manage?',
          a: 'SODAARS provides complete end-to-end control across the 5 core operational domains: Resource Management (cataloging & pricing), Availability Engine (slot calendars & holds), Booking Pipeline (contracts & renewals), Customer CRM (agency accounts & contacts), and Campaign Execution (photo proof & audit trails).',
        },
        {
          id: 'cat-1-q-4',
          q: 'Is SODAARS a marketplace?',
          a: 'SODAARS is first and foremost an operating system (SaaS) for media asset owners to run their private operations. SODAARS also operates an optional, voluntary Marketplace discovery channel where providers can syndicate selected inventory to attract inbound agency and brand demand.',
        },
        {
          id: 'cat-1-q-5',
          q: 'Is the Marketplace the only way providers can get customers?',
          a: 'No. Providers retain 100% of their existing direct agency and corporate client relationships. Direct contracts and client renewals are managed privately within the provider’s dedicated panel with zero mandatory marketplace syndication.',
        },
      ],
    },
    {
      title: 'Managing Your Advertising Business',
      eyebrow: 'RESOURCE MANAGEMENT',
      categoryKey: 'resources',
      desc: 'How physical static assets and locations are structured.',
      items: [
        {
          id: 'cat-2-q-1',
          q: 'How are advertising resources represented in SODAARS?',
          a: 'Each advertising resource represents an individual sellable commercial face with structured parameters: exact physical dimensions (W×H, sq ft), illumination specifications (front-lit, back-lit, non-lit), traffic orientation, card rate, net price, and current availability status.',
        },
        {
          id: 'cat-2-q-2',
          q: "What's the difference between a Location and an Advertising Resource?",
          a: 'A Location represents the geographic site, intersection, highway milestone, or parcel (e.g. Bandra Western Express Highway). An Advertising Resource represents the actual physical display face mounted at that location (e.g. South-Facing 40×20 ft Unipole). One location can host multiple distinct advertising resources.',
        },
        {
          id: 'cat-2-q-3',
          q: 'Can one location contain multiple resources?',
          a: 'Yes. A single structural gantry or intersection property can host multiple commercial faces (e.g. Face A Northbound, Face B Southbound). Each face maintains its own calendar, rate card, and booking history.',
        },
        {
          id: 'cat-2-q-4',
          q: 'Can providers manage static outdoor advertising resources?',
          a: 'Yes. SODAARS V1 is exclusively purpose-built for physical static outdoor advertising formats: hoardings, unipoles, gantries, bus shelters, pole ads, wall mounts, rooftops, and bridge panels.',
        },
      ],
    },
    {
      title: 'How Marketplace Participation Works',
      eyebrow: 'MARKETPLACE DISCOVERY',
      categoryKey: 'marketplace',
      desc: 'Discovery mechanics, provider sovereignty, and net reservations.',
      items: [
        {
          id: 'cat-3-q-1',
          q: 'Can every provider resource appear on the Marketplace?',
          a: 'Every registered resource has an asset-level Marketplace Participation toggle. The provider decides asset by asset whether to syndicate the resource to the public marketplace or keep it direct-only.',
        },
        {
          id: 'cat-3-q-2',
          q: 'Is Marketplace participation the same as availability?',
          a: 'No. Marketplace Participation is an eligibility toggle determining whether an asset is listed for discovery. Availability is a date-level scheduling state (Available, Booked, Hold, Blocked, Maintenance) determining whether specific dates are open for reservation.',
        },
        {
          id: 'cat-3-q-3',
          q: 'Can providers keep some resources private?',
          a: 'Yes. Providers frequently keep prime long-term contract assets private while syndicating seasonal or high-turnover inventory to the marketplace.',
        },
        {
          id: 'cat-3-q-4',
          q: 'Does SODAARS guarantee bookings through the Marketplace?',
          a: 'No. SODAARS provides an authoritative discovery channel and standardized booking pipeline, but does not guarantee automated bookings or minimum revenue.',
        },
        {
          id: 'cat-3-q-5',
          q: 'Can customers discover outdoor advertising resources through the Marketplace?',
          a: 'Yes. Brand advertisers and media buying agencies can search participating static inventory by city, corridor, format, and available dates, submitting inquiries directly to the media owner.',
        },
      ],
    },
    {
      title: 'Questions About the Booking Workflow',
      eyebrow: 'BOOKING PIPELINE',
      categoryKey: 'bookings',
      desc: 'Schedules, holds, contracts, and availability transitions.',
      items: [
        {
          id: 'cat-4-q-1',
          q: 'Where can bookings come from?',
          a: 'Bookings enter the unified pipeline through three sources: Marketplace Inquiries (inbound advertisers), Admin-Assisted Bookings (platform operations), and Provider Direct Contracts (internal sales & renewals).',
        },
        {
          id: 'cat-4-q-2',
          q: 'How does a booking connect to an advertising resource?',
          a: 'Every booking binds one or more specific physical Advertising Resources to a defined date window. Once confirmed, the availability engine automatically marks those dates as Booked.',
        },
        {
          id: 'cat-4-q-3',
          q: 'Can direct provider bookings be managed?',
          a: 'Yes. Providers can log their own direct corporate and agency contracts with custom terms, rate cards, and payment schedules without paying marketplace fees.',
        },
        {
          id: 'cat-4-q-4',
          q: 'Can bookings affect resource availability?',
          a: 'Yes. When a booking is confirmed, the corresponding resource date range transitions to Booked. When in inquiry or negotiation, provisional dates can be held in Hold status.',
        },
        {
          id: 'cat-4-q-5',
          q: 'What happens if a resource is placed on hold?',
          a: 'A Hold temporarily reserves the slot during customer review. If the hold window expires without confirmation, the slot automatically returns to Available status.',
        },
      ],
    },
    {
      title: 'Keep Customer Relationships Connected',
      eyebrow: 'CUSTOMER CRM',
      categoryKey: 'customers',
      desc: 'Sovereign client records, multi-buyer accounts, and privacy.',
      items: [
        {
          id: 'cat-5-q-1',
          q: 'Who can be managed as a customer?',
          a: 'SODAARS supports four approved customer account types: Advertising Agencies, Direct Enterprise Buyers, Local Businesses, and Corporate Brand accounts.',
        },
        {
          id: 'cat-5-q-2',
          q: 'What customer information can be associated with a customer record?',
          a: 'Company legal name, contact officers, verified phone & email, billing address, GST credentials, active display count, and complete lifetime contract history.',
        },
        {
          id: 'cat-5-q-3',
          q: 'Can customers be connected to bookings?',
          a: 'Yes. Every booking explicitly references the client account record, establishing an auditable commercial link from client to contracted media assets.',
        },
        {
          id: 'cat-5-q-4',
          q: 'Can customers be connected to campaigns?',
          a: 'Yes. Operational campaigns link directly to the booking and its client record, allowing automated dispatch of Proof of Performance (POP) reports.',
        },
      ],
    },
    {
      title: 'From Booking to Campaign Execution',
      eyebrow: 'CAMPAIGN EXECUTION',
      categoryKey: 'campaigns',
      desc: 'Ground installation assets, verification photos, and audit trails.',
      items: [
        {
          id: 'cat-6-q-1',
          q: 'What is Campaign Execution?',
          a: 'Campaign Execution is the physical operational phase following booking confirmation. It coordinates printing dispatch, site mounting crew work orders, vinyl tension inspection, and photo proof collection.',
        },
        {
          id: 'cat-6-q-2',
          q: 'Can campaign execution include photo proof?',
          a: 'Yes. SODAARS provides dedicated photo proof documentation: high-resolution daytime approach angles and illuminated nighttime photos with embedded GPS coordinates and timestamps.',
        },
        {
          id: 'cat-6-q-3',
          q: 'Does Campaign Execution replace the booking process?',
          a: 'No. The Booking Pipeline governs commercial contracts, dates, and payments. Campaign Execution manages physical on-site mounting and field verification.',
        },
        {
          id: 'cat-6-q-4',
          q: 'Can campaign history remain connected to customers?',
          a: 'Yes. Completed campaigns remain permanently archived in the customer’s audit trail, providing historical proof of performance for future renewals.',
        },
      ],
    },
    {
      title: 'Questions About Pricing and Marketplace Commercials',
      eyebrow: 'PRICING & COMMERCIALS',
      categoryKey: 'pricing',
      desc: 'Dual-price operating models, card rates, and settlement.',
      items: [
        {
          id: 'cat-7-q-1',
          q: 'What is the Regular Customer Price?',
          a: 'The Regular Customer Price is the published street card rate set by the media owner for direct sales, agency proposals, and local retail bookings.',
        },
        {
          id: 'cat-7-q-2',
          q: 'What is the SODAARS Price?',
          a: 'The SODAARS Price is the agreed net settlement price provided by the media owner for marketplace catalog discovery and national brand bookings.',
        },
        {
          id: 'cat-7-q-3',
          q: 'How is the Marketplace customer price determined?',
          a: 'The marketplace price reflects the agreed net terms established directly between SODAARS and the media owner. There are no surprise markups.',
        },
        {
          id: 'cat-7-q-4',
          q: 'Is there a fixed marketplace markup?',
          a: 'No. SODAARS does not impose an arbitrary fixed percentage markup across all inventory. Pricing reflects transparent net-to-gross agreements.',
        },
        {
          id: 'cat-7-q-5',
          q: 'Does provider subscription pricing depend on net versus gross?',
          a: 'No. Provider SaaS subscription tiers (₹4,999 / ₹8,999) depend solely on total registered resource count (1–50 or 51–100), not on booking transaction volume.',
        },
      ],
    },
  ];

  const filterTabs = [
    { key: 'all', label: 'All Questions (28)' },
    { key: 'platform', label: 'SODAARS Platform' },
    { key: 'resources', label: 'Advertising Resources' },
    { key: 'marketplace', label: 'Marketplace' },
    { key: 'bookings', label: 'Bookings & Pipeline' },
    { key: 'customers', label: 'Customers & CRM' },
    { key: 'campaigns', label: 'Campaign Execution' },
    { key: 'pricing', label: 'Pricing & Terms' },
  ];

  const filteredCategories = categories.filter((cat) => {
    if (activeCategory !== 'all' && cat.categoryKey !== activeCategory) {
      return false;
    }
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const hasMatchingTitle = cat.title.toLowerCase().includes(query);
    const hasMatchingItems = cat.items.some(
      (item) => item.q.toLowerCase().includes(query) || item.a.toLowerCase().includes(query)
    );
    return hasMatchingTitle || hasMatchingItems;
  });

  return (
    <div className="w-full bg-[#FAFAF9] text-[#171717]">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION                                                           */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 border-b border-[#E5E5E5] bg-gradient-to-b from-white via-white to-[#FAFAF9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Hero Column */}
            <div className="lg:col-span-8 text-left">
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-200 bg-orange-50 text-[#F97316] text-xs font-semibold uppercase tracking-wider mb-6">
                <Sparkles size={13} className="text-[#F97316]" />
                HELP &amp; KNOWLEDGE BASE
              </div>

              {/* Headline */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-[#171717] leading-[1.12]">
                Questions About SODAARS? <span className="text-[#F97316] italic font-normal">Start Here.</span>
              </h1>

              {/* Supporting Copy */}
              <p className="mt-6 text-base sm:text-lg text-[#525252] max-w-2xl leading-relaxed font-normal">
                Find clear answers about SODAARS, outdoor advertising resources, provider operations, marketplace participation, bookings, customers, and campaign execution.
              </p>

              {/* Search Bar */}
              <div className="mt-8 max-w-xl">
                <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-[#E5E5E5] shadow-xs focus-within:border-[#F97316] transition-colors">
                  <Search size={18} className="text-[#737373] ml-2 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search answers (e.g., booking, holds, pricing...)"
                    className="w-full text-xs sm:text-sm text-[#171717] placeholder-[#A3A3A3] focus:outline-hidden bg-transparent"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="text-xs text-[#737373] hover:text-[#171717] px-2 py-1"
                    >
                      Clear
                    </button>
                  )}
                  <Button size="sm" className="shrink-0">
                    Search FAQs
                  </Button>
                </div>

                {/* Quick Search Pills */}
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-[#737373] text-[11px]">Popular:</span>
                  {[
                    'Location vs Resource',
                    'Resource Model',
                    'Marketplace Participation',
                    'Booking Holds',
                  ].map((pill) => (
                    <button
                      key={pill}
                      onClick={() => setSearchQuery(pill)}
                      className="px-2.5 py-0.5 rounded-full bg-white border border-[#E5E5E5] text-[#525252] hover:text-[#171717] hover:border-[#F97316] text-[11px] transition-colors"
                    >
                      {pill}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Hero Graphic Card */}
            <div className="lg:col-span-4 hidden lg:flex justify-center">
              <div className="w-64 h-64 rounded-2xl bg-gradient-to-br from-orange-50 via-white to-orange-100/40 border border-orange-200/80 p-8 flex flex-col items-center justify-center text-center shadow-xs relative">
                <div className="w-20 h-20 rounded-full bg-[#171717] text-[#F97316] flex items-center justify-center font-bold text-4xl shadow-md mb-4">
                  ?
                </div>
                <div className="text-sm font-bold text-[#171717]">Comprehensive FAQ</div>
                <p className="text-xs text-[#525252] mt-1">28 authoritative answers for media owners</p>
                <div className="mt-4 text-[10px] font-mono text-[#F97316] bg-white px-2 py-1 rounded border border-orange-200">
                  Verified SODAARS V1 Specs
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. FILTER TABS & FAQ ACCORDION LIST                                       */}
      {/* ========================================================================= */}
      <section className="py-16 md:py-24 border-b border-[#E5E5E5] bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filter Tabs Bar */}
          <div className="flex flex-wrap items-center gap-1.5 pb-8 mb-10 border-b border-[#E5E5E5]">
            {filterTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveCategory(tab.key)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  activeCategory === tab.key
                    ? 'bg-[#171717] text-white shadow-xs'
                    : 'text-[#525252] hover:text-[#171717] hover:bg-[#FAFAF9]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* FAQ Category Sections */}
          <div className="space-y-14">
            {filteredCategories.length === 0 ? (
              <div className="text-center py-16 bg-[#FAFAF9] rounded-xl border border-[#E5E5E5]">
                <HelpCircle size={32} className="text-[#A3A3A3] mx-auto mb-3" />
                <h3 className="text-base font-bold text-[#171717]">No answers match your search</h3>
                <p className="text-xs text-[#525252] mt-1">Try another keyword or browse all topics.</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('all');
                  }}
                  className="mt-4 text-xs font-semibold text-[#F97316] hover:underline"
                >
                  Reset all filters
                </button>
              </div>
            ) : (
              filteredCategories.map((cat, idx) => (
                <div key={idx} className="space-y-4">
                  {/* Category Header */}
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#F97316]">
                      {cat.eyebrow}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-[#171717] mt-0.5">
                      {cat.title}
                    </h3>
                    <p className="text-xs text-[#525252] mt-1">{cat.desc}</p>
                  </div>

                  {/* Accordion Items */}
                  <div className="space-y-2.5">
                    {cat.items.map((item) => {
                      const isOpen = expandedItems[item.id];
                      return (
                        <Card
                          key={item.id}
                          className={`p-0 bg-white border-[#E5E5E5] transition-all overflow-hidden ${
                            isOpen ? 'border-[#F97316]/50 shadow-xs' : 'hover:border-[#D4D4D8]'
                          }`}
                        >
                          <button
                            onClick={() => toggleItem(item.id)}
                            className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                          >
                            <span className="text-sm sm:text-base font-bold text-[#171717]">
                              {item.q}
                            </span>
                            <div className={`w-6 h-6 rounded-full border border-[#E5E5E5] flex items-center justify-center text-[#737373] shrink-0 transition-transform ${
                              isOpen ? 'rotate-180 bg-orange-50 text-[#F97316] border-orange-200' : ''
                            }`}>
                              <ChevronDown size={14} />
                            </div>
                          </button>

                          {isOpen && (
                            <div className="px-4 pb-5 sm:px-5 sm:pb-6 text-xs sm:text-sm text-[#525252] leading-relaxed border-t border-[#FAFAF9] pt-3">
                              {item.a}
                            </div>
                          )}
                        </Card>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. STILL HAVE A QUESTION? DARK CALLOUT BANNER                             */}
      {/* ========================================================================= */}
      <section className="py-14 border-b border-[#E5E5E5] bg-[#FAFAF9]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-[#171717] text-white p-8 sm:p-10 shadow-md">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="max-w-2xl">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#F97316]">
                  DEDICATED SUPPORT
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
                  Still Have a Question?
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-[#A3A3A3] leading-relaxed">
                  Explore the SODAARS documentation, talk to an infrastructure engineer, or get in touch with our technical support team for a dedicated walkthrough.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <Link to="/get-started">
                  <Button size="md" rightIcon={<ArrowRight size={14} />}>
                    Get Started →
                  </Button>
                </Link>
                <Link to="/resources/help-support">
                  <Button variant="secondary" size="md" rightIcon={<ExternalLink size={14} />}>
                    Contact Us ↗
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. LEARN MORE ABOUT SODAARS FOOTER CARDS                                  */}
      {/* ========================================================================= */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-10">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#F97316]">
              EXPLORE MORE
            </span>
            <h2 className="mt-1 text-2xl font-bold text-[#171717]">
              Learn More About SODAARS
            </h2>
            <p className="mt-2 text-xs text-[#525252]">
              Resource checklists, operational playbooks, and provider guidelines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link to="/resources" className="p-6 bg-[#FAFAF9] rounded-lg border border-[#E5E5E5] hover:border-[#F97316] transition-colors group">
              <div className="w-9 h-9 rounded bg-white border border-[#E5E5E5] flex items-center justify-center text-[#F97316] mb-3">
                <Layers size={18} />
              </div>
              <h3 className="text-sm font-bold text-[#171717] group-hover:text-[#F97316]">
                Outdoor Advertising Resources
              </h3>
              <p className="mt-2 text-xs text-[#525252] leading-relaxed">
                Understand the physical OOH taxonomy, specifications, and parameters across 10 static formats.
              </p>
              <div className="mt-4 pt-3 border-t border-[#E5E5E5] text-xs font-semibold text-[#F97316] flex items-center gap-1">
                Learn More <ArrowRight size={12} />
              </div>
            </Link>

            <Link to="/resources/guides-playbooks" className="p-6 bg-[#FAFAF9] rounded-lg border border-[#E5E5E5] hover:border-[#F97316] transition-colors group">
              <div className="w-9 h-9 rounded bg-white border border-[#E5E5E5] flex items-center justify-center text-[#F97316] mb-3">
                <BookOpen size={18} />
              </div>
              <h3 className="text-sm font-bold text-[#171717] group-hover:text-[#F97316]">
                Guides &amp; Playbooks
              </h3>
              <p className="mt-2 text-xs text-[#525252] leading-relaxed">
                Practical playbooks for running inventory, managing provisional holds, and coordinating proof.
              </p>
              <div className="mt-4 pt-3 border-t border-[#E5E5E5] text-xs font-semibold text-[#F97316] flex items-center gap-1">
                Explore Guides <ArrowRight size={12} />
              </div>
            </Link>

            <Link to="/marketplace" className="p-6 bg-[#FAFAF9] rounded-lg border border-[#E5E5E5] hover:border-[#F97316] transition-colors group">
              <div className="w-9 h-9 rounded bg-white border border-[#E5E5E5] flex items-center justify-center text-[#F97316] mb-3">
                <ShoppingBag size={18} />
              </div>
              <h3 className="text-sm font-bold text-[#171717] group-hover:text-[#F97316]">
                Marketplace Resources
              </h3>
              <p className="mt-2 text-xs text-[#525252] leading-relaxed">
                Understand how voluntary discovery syndication works alongside private provider operations.
              </p>
              <div className="mt-4 pt-3 border-t border-[#E5E5E5] text-xs font-semibold text-[#F97316] flex items-center gap-1">
                Explore Marketplace <ArrowRight size={12} />
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQPage;
