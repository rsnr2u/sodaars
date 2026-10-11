import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  HelpCircle,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Search,
  CheckCircle2,
  ChevronDown,
  Layers,
  Calendar,
  FileText,
  Users,
  Camera,
  ShoppingBag,
  BookOpen,
  MessageSquare,
  Send,
} from 'lucide-react';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';

export const HelpSupportPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<string | null>('faq-1');

  // Contact Form State
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formTopic, setFormTopic] = useState('Resource Inventory');
  const [formMessage, setFormMessage] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formEmail.trim() || !formMessage.trim()) return;
    setFormSubmitted(true);
  };

  const supportFaqs = [
    {
      id: 'faq-1',
      q: 'How do I get started with SODAARS?',
      a: 'Register your media organization via the Get Started portal. After initial account verification, you can configure your organization profile, invite team members, and begin registering physical static advertising resources.',
    },
    {
      id: 'faq-2',
      q: 'How do I add or manage advertising resources?',
      a: 'From the Provider Panel, navigate to Advertising Resources. Click "Add Resource" to input physical parameters: format type, city, location landmark, dimensions (W×H, sq ft), illumination, traffic facing, and commercial pricing.',
    },
    {
      id: 'faq-3',
      q: 'How does Marketplace participation work?',
      a: 'Marketplace participation is 100% voluntary per asset. In your resource profile, toggle "Marketplace Participation" on or off. Participating assets are syndicated to the public marketplace at your agreed SODAARS net settlement price.',
    },
    {
      id: 'faq-4',
      q: 'How do holds work in availability grids?',
      a: 'A hold provisionally reserves a resource date range for an evaluating client without committing it permanently. Holds prevent conflicting booking inquiries and can be confirmed or released at any time.',
    },
    {
      id: 'faq-5',
      q: 'How are direct client bookings processed?',
      a: 'Direct bookings can be initiated directly by the provider in the Bookings module. You retain full autonomy over pricing, credit terms, and contract agreements with zero marketplace commissions.',
    },
    {
      id: 'faq-6',
      q: 'How are photo mounting proofs verified?',
      a: 'Field supervisors capture daytime approach photos and illuminated nighttime shots. Each image contains embedded GPS coordinates and timestamps, generating a tamper-resistant Proof of Performance (POP) record.',
    },
    {
      id: 'faq-7',
      q: 'How does Campaign Execution work?',
      a: 'Once a booking is confirmed, a corresponding campaign instance is created. It tracks work order dispatch to mounting crews, vinyl tension checks, mounting verification, and final teardown.',
    },
    {
      id: 'faq-8',
      q: 'Who can access the provider platform dashboard?',
      a: 'Access is restricted to authorized team members of your verified organization. Role-based permissions allow assigning Admin, Manager, and Field Supervisor access levels.',
    },
    {
      id: 'faq-9',
      q: 'How do I contact SODAARS support?',
      a: 'You can submit a ticket using the contact form below, reach out to our dedicated operations desk via email at support@sodaars.com, or request an assisted onboarding walkthrough.',
    },
  ];

  return (
    <div className="w-full bg-[#FAFAF9] text-[#171717]">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION                                                           */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 border-b border-[#E5E5E5] bg-gradient-to-b from-white via-white to-[#FAFAF9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column */}
            <div className="lg:col-span-7 text-left">
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-200 bg-orange-50 text-[#F97316] text-xs font-semibold uppercase tracking-wider mb-6">
                <Sparkles size={13} className="text-[#F97316]" />
                HELP CENTER &amp; SUPPORT
              </div>

              {/* Headline */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-[#171717] leading-[1.12]">
                Need Help With SODAARS? <span className="text-[#F97316] italic font-normal">Start Here.</span>
              </h1>

              {/* Supporting Copy */}
              <p className="mt-6 text-base sm:text-lg text-[#525252] max-w-2xl leading-relaxed font-normal">
                Find answers, guides, documentation, and support resources for SODAARS providers, customers, and platform partners across India's static outdoor advertising landscape.
              </p>

              {/* Search Bar */}
              <div className="mt-8 max-w-xl">
                <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-[#E5E5E5] shadow-xs focus-within:border-[#F97316] transition-colors">
                  <Search size={18} className="text-[#737373] ml-2 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search documentation..."
                    className="w-full text-xs sm:text-sm text-[#171717] placeholder-[#A3A3A3] focus:outline-hidden bg-transparent"
                  />
                  <Button size="sm" className="shrink-0">
                    Search
                  </Button>
                </div>

                {/* Quick Tags */}
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-[#737373] text-[11px]">Quick search:</span>
                  {[
                    'Resource Inventory',
                    'Booking Holds',
                    'Marketplace Control',
                    'POP Proof Uploads',
                    'Rate Cards',
                  ].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSearchQuery(tag)}
                      className="px-2 py-0.5 rounded-full bg-white border border-[#E5E5E5] text-[#525252] hover:text-[#171717] text-[11px] transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Live Operational Status / System Health Card */}
            <div className="lg:col-span-5">
              <Card className="p-6 bg-white border-[#E5E5E5] shadow-sm">
                <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E5]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-700">
                      ALL SYSTEMS OPERATIONAL
                    </span>
                  </div>
                  <Badge variant="active" size="sm">v1.0 Live</Badge>
                </div>

                <div className="mt-4 space-y-2.5 text-xs">
                  <div className="p-2.5 rounded bg-[#FAFAF9] border border-[#E5E5E5] flex items-center justify-between">
                    <div>
                      <strong className="text-[#171717] block">Advertising Resources Engine</strong>
                      <span className="text-[11px] text-[#737373]">Physical format specs &amp; pricing registry</span>
                    </div>
                    <span className="text-emerald-700 font-medium text-[11px]">Active</span>
                  </div>

                  <div className="p-2.5 rounded bg-[#FAFAF9] border border-[#E5E5E5] flex items-center justify-between">
                    <div>
                      <strong className="text-[#171717] block">Availability Grid &amp; Calendar</strong>
                      <span className="text-[11px] text-[#737373]">Date-level slot locking &amp; hold manager</span>
                    </div>
                    <span className="text-emerald-700 font-medium text-[11px]">Active</span>
                  </div>

                  <div className="p-2.5 rounded bg-[#FAFAF9] border border-[#E5E5E5] flex items-center justify-between">
                    <div>
                      <strong className="text-[#171717] block">Booking Pipeline &amp; CRM</strong>
                      <span className="text-[11px] text-[#737373]">Multi-source contracts &amp; client records</span>
                    </div>
                    <span className="text-emerald-700 font-medium text-[11px]">Active</span>
                  </div>

                  <div className="p-2.5 rounded bg-[#FAFAF9] border border-[#E5E5E5] flex items-center justify-between">
                    <div>
                      <strong className="text-[#171717] block">Campaign Photo Proof &amp; POP</strong>
                      <span className="text-[11px] text-[#737373]">Mounting audit trails &amp; GPS timestamps</span>
                    </div>
                    <span className="text-emerald-700 font-medium text-[11px]">Active</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#E5E5E5] flex items-center justify-between text-[11px] text-[#737373]">
                  <span>Operational Status</span>
                  <span>99.9% Uptime Tracked</span>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. FIND THE RIGHT PLACE TO START (4 CARDS)                                */}
      {/* ========================================================================= */}
      <section className="py-16 border-b border-[#E5E5E5] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-10">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#F97316]">
              NAVIGATION HUBS
            </span>
            <h2 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-[#171717]">
              Find the Right Place to Start
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-lg bg-[#FAFAF9] border border-[#E5E5E5] hover:border-[#F97316] transition-colors">
              <div className="w-10 h-10 rounded bg-white border border-[#E5E5E5] flex items-center justify-center text-[#F97316] mb-4">
                <HelpCircle size={20} />
              </div>
              <h3 className="text-base font-bold text-[#171717]">Help Center</h3>
              <p className="mt-2 text-xs text-[#525252] leading-relaxed">
                Step-by-step documentation and tutorials covering setup, resource registration, and team settings.
              </p>
              <div className="mt-4 pt-3 border-t border-[#E5E5E5] text-xs font-semibold text-[#F97316] flex items-center gap-1">
                Explore Help <ArrowRight size={12} />
              </div>
            </div>

            <Link to="/resources/guides-playbooks" className="p-6 rounded-lg bg-[#FAFAF9] border border-[#E5E5E5] hover:border-[#F97316] transition-colors group">
              <div className="w-10 h-10 rounded bg-white border border-[#E5E5E5] flex items-center justify-center text-[#F97316] mb-4">
                <BookOpen size={20} />
              </div>
              <h3 className="text-base font-bold text-[#171717] group-hover:text-[#F97316]">
                Guides &amp; Playbooks
              </h3>
              <p className="mt-2 text-xs text-[#525252] leading-relaxed">
                Best practices for inventory occupancy, rate negotiation, client holds, and Proof of Performance.
              </p>
              <div className="mt-4 pt-3 border-t border-[#E5E5E5] text-xs font-semibold text-[#F97316] flex items-center gap-1">
                Explore Guides <ArrowRight size={12} />
              </div>
            </Link>

            <Link to="/resources/faq" className="p-6 rounded-lg bg-[#FAFAF9] border border-[#E5E5E5] hover:border-[#F97316] transition-colors group">
              <div className="w-10 h-10 rounded bg-white border border-[#E5E5E5] flex items-center justify-center text-[#F97316] mb-4">
                <HelpCircle size={20} />
              </div>
              <h3 className="text-base font-bold text-[#171717] group-hover:text-[#F97316]">
                FAQ
              </h3>
              <p className="mt-2 text-xs text-[#525252] leading-relaxed">
                Frequently asked questions about subscription pricing, marketplace net rates, and data security.
              </p>
              <div className="mt-4 pt-3 border-t border-[#E5E5E5] text-xs font-semibold text-[#F97316] flex items-center gap-1">
                View FAQ <ArrowRight size={12} />
              </div>
            </Link>

            <a href="#contact-support" className="p-6 rounded-lg bg-[#FAFAF9] border border-[#E5E5E5] hover:border-[#F97316] transition-colors group">
              <div className="w-10 h-10 rounded bg-white border border-[#E5E5E5] flex items-center justify-center text-[#F97316] mb-4">
                <MessageSquare size={20} />
              </div>
              <h3 className="text-base font-bold text-[#171717] group-hover:text-[#F97316]">
                Contact Support
              </h3>
              <p className="mt-2 text-xs text-[#525252] leading-relaxed">
                Direct assistance from our dedicated operations team for onboarding and technical questions.
              </p>
              <div className="mt-4 pt-3 border-t border-[#E5E5E5] text-xs font-semibold text-[#F97316] flex items-center gap-1">
                Contact Support <ArrowRight size={12} />
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. WORKFLOW SUPPORT (6 MODULE CARDS)                                      */}
      {/* ========================================================================= */}
      <section className="py-16 md:py-24 border-b border-[#E5E5E5] bg-[#FAFAF9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#F97316]">
              WORKFLOW GUIDES
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-[#171717]">
              Find Support for Every Part of the Workflow
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#525252] leading-relaxed">
              Explore step-by-step guidance tailored to each core operational module of the SODAARS operating system.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link to="/solutions/resource-management" className="p-6 bg-white rounded-lg border border-[#E5E5E5] hover:border-[#F97316] transition-colors group shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <Badge variant="brand" size="sm">Module 01</Badge>
                <Layers size={18} className="text-[#F97316]" />
              </div>
              <h3 className="text-base font-bold text-[#171717] group-hover:text-[#F97316]">Advertising Resources</h3>
              <p className="mt-2 text-xs text-[#525252] leading-relaxed">
                Guidance on cataloging hoardings, unipoles, and gantries; managing dimensions, facing, and illumination specs.
              </p>
              <div className="mt-4 pt-3 border-t border-[#E5E5E5] text-xs font-semibold text-[#F97316] flex items-center gap-1">
                Learn More <ArrowRight size={12} />
              </div>
            </Link>

            <Link to="/solutions/availability-engine" className="p-6 bg-white rounded-lg border border-[#E5E5E5] hover:border-[#F97316] transition-colors group shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <Badge variant="active" size="sm">Module 02</Badge>
                <Calendar size={18} className="text-[#F97316]" />
              </div>
              <h3 className="text-base font-bold text-[#171717] group-hover:text-[#F97316]">Availability</h3>
              <p className="mt-2 text-xs text-[#525252] leading-relaxed">
                How to coordinate the 6 availability states, resolve conflicting dates, and place provisional holds.
              </p>
              <div className="mt-4 pt-3 border-t border-[#E5E5E5] text-xs font-semibold text-[#F97316] flex items-center gap-1">
                Learn More <ArrowRight size={12} />
              </div>
            </Link>

            <Link to="/solutions/booking-pipeline" className="p-6 bg-white rounded-lg border border-[#E5E5E5] hover:border-[#F97316] transition-colors group shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <Badge variant="pending" size="sm">Module 03</Badge>
                <FileText size={18} className="text-[#F97316]" />
              </div>
              <h3 className="text-base font-bold text-[#171717] group-hover:text-[#F97316]">Bookings</h3>
              <p className="mt-2 text-xs text-[#525252] leading-relaxed">
                Managing multi-source bookings from direct agency contracts, renewals, and incoming marketplace inquiries.
              </p>
              <div className="mt-4 pt-3 border-t border-[#E5E5E5] text-xs font-semibold text-[#F97316] flex items-center gap-1">
                Learn More <ArrowRight size={12} />
              </div>
            </Link>

            <Link to="/solutions/customer-crm" className="p-6 bg-white rounded-lg border border-[#E5E5E5] hover:border-[#F97316] transition-colors group shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <Badge variant="brand" size="sm">Module 04</Badge>
                <Users size={18} className="text-[#F97316]" />
              </div>
              <h3 className="text-base font-bold text-[#171717] group-hover:text-[#F97316]">Customers</h3>
              <p className="mt-2 text-xs text-[#525252] leading-relaxed">
                Centralizing agency client records, corporate accounts, contacts, and contract histories with zero data leakage.
              </p>
              <div className="mt-4 pt-3 border-t border-[#E5E5E5] text-xs font-semibold text-[#F97316] flex items-center gap-1">
                Learn More <ArrowRight size={12} />
              </div>
            </Link>

            <Link to="/solutions/campaign-execution" className="p-6 bg-white rounded-lg border border-[#E5E5E5] hover:border-[#F97316] transition-colors group shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <Badge variant="brand" size="sm">Module 05</Badge>
                <Camera size={18} className="text-[#F97316]" />
              </div>
              <h3 className="text-base font-bold text-[#171717] group-hover:text-[#F97316]">Campaigns</h3>
              <p className="mt-2 text-xs text-[#525252] leading-relaxed">
                Dispatching mounting work orders, collecting geotagged photo proof, and generating agency-ready POP packets.
              </p>
              <div className="mt-4 pt-3 border-t border-[#E5E5E5] text-xs font-semibold text-[#F97316] flex items-center gap-1">
                Learn More <ArrowRight size={12} />
              </div>
            </Link>

            <Link to="/marketplace" className="p-6 bg-white rounded-lg border border-[#E5E5E5] hover:border-[#F97316] transition-colors group shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <Badge variant="inactive" size="sm">Channel</Badge>
                <ShoppingBag size={18} className="text-[#F97316]" />
              </div>
              <h3 className="text-base font-bold text-[#171717] group-hover:text-[#F97316]">Marketplace</h3>
              <p className="mt-2 text-xs text-[#525252] leading-relaxed">
                Voluntary catalog syndication, setting agreed net rates, and receiving verified advertiser inquiries.
              </p>
              <div className="mt-4 pt-3 border-t border-[#E5E5E5] text-xs font-semibold text-[#F97316] flex items-center gap-1">
                Learn More <ArrowRight size={12} />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. WHAT DO YOU NEED HELP WITH? (FAQ ACCORDION)                            */}
      {/* ========================================================================= */}
      <section className="py-16 md:py-24 border-b border-[#E5E5E5] bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#F97316]">
              COMMON QUESTIONS
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-[#171717]">
              What Do You Need Help With?
            </h2>
            <p className="mt-3 text-sm text-[#525252]">
              Quick answers to the most frequent onboarding, inventory, and workflow queries.
            </p>
          </div>

          <div className="space-y-3">
            {supportFaqs.map((faq) => {
              const isOpen = expandedFaq === faq.id;
              return (
                <Card
                  key={faq.id}
                  className={`p-0 bg-[#FAFAF9] border-[#E5E5E5] transition-all overflow-hidden ${
                    isOpen ? 'border-[#F97316]/50 bg-white shadow-xs' : 'hover:border-[#D4D4D8]'
                  }`}
                >
                  <button
                    onClick={() => setExpandedFaq(isOpen ? null : faq.id)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <span className="text-sm sm:text-base font-bold text-[#171717]">
                      {faq.q}
                    </span>
                    <div className={`w-6 h-6 rounded-full border border-[#E5E5E5] flex items-center justify-center text-[#737373] shrink-0 transition-transform ${
                      isOpen ? 'rotate-180 bg-orange-50 text-[#F97316] border-orange-200' : ''
                    }`}>
                      <ChevronDown size={14} />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-5 sm:px-5 sm:pb-6 text-xs sm:text-sm text-[#525252] leading-relaxed border-t border-[#F5F5F4] pt-3">
                      {faq.a}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. INTERACTIVE SUPPORT FORM                                               */}
      {/* ========================================================================= */}
      <section id="contact-support" className="py-16 md:py-24 border-b border-[#E5E5E5] bg-[#FAFAF9]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-white border-[#E5E5E5] p-6 sm:p-10 shadow-xs">
            <div className="text-center max-w-xl mx-auto mb-8">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#F97316]">
                CONTACT SUPPORT
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-[#171717] mt-1">
                Can't Find What You're Looking For?
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-[#525252] leading-relaxed">
                Fill out the form below and a member of our operations team will assist you with your SODAARS queries.
              </p>
            </div>

            {formSubmitted ? (
              <div className="p-6 rounded-lg bg-emerald-50 border border-emerald-200 text-center">
                <CheckCircle2 size={36} className="text-emerald-600 mx-auto mb-2" />
                <h4 className="text-base font-bold text-emerald-900">Support Request Received</h4>
                <p className="mt-1 text-xs text-emerald-700">
                  Thank you, <strong>{formName}</strong>. Our dedicated operations team will respond to <strong>{formEmail}</strong> within 1 business day.
                </p>
                <button
                  onClick={() => {
                    setFormSubmitted(false);
                    setFormMessage('');
                  }}
                  className="mt-4 text-xs font-semibold text-[#F97316] hover:underline"
                >
                  Submit another request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-[#171717] mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="e.g. Rajesh Sharma"
                      className="w-full px-3 py-2 rounded-md border border-[#E5E5E5] text-[#171717] focus:border-[#F97316] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#171717] mb-1">Work Email</label>
                    <input
                      type="email"
                      required
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      placeholder="e.g. rajesh@mediaowner.com"
                      className="w-full px-3 py-2 rounded-md border border-[#E5E5E5] text-[#171717] focus:border-[#F97316] focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[#171717] mb-1">Topic</label>
                  <select
                    value={formTopic}
                    onChange={(e) => setFormTopic(e.target.value)}
                    className="w-full px-3 py-2 rounded-md border border-[#E5E5E5] text-[#171717] focus:border-[#F97316] focus:outline-hidden bg-white"
                  >
                    <option value="Resource Inventory">Resource Inventory (Hoardings, Unipoles, Gantries)</option>
                    <option value="Availability Engine">Availability Scheduling &amp; Calendar Holds</option>
                    <option value="Booking Workflow">Booking Pipeline &amp; Direct Contracts</option>
                    <option value="Marketplace Participation">Marketplace Participation &amp; Net Pricing</option>
                    <option value="Campaign Proof">Campaign Photo Proof &amp; POP Documentation</option>
                    <option value="Account Support">Technical &amp; Account Support</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#171717] mb-1">Message</label>
                  <textarea
                    required
                    rows={4}
                    value={formMessage}
                    onChange={(e) => setFormMessage(e.target.value)}
                    placeholder="Describe your question or issue in detail..."
                    className="w-full px-3 py-2 rounded-md border border-[#E5E5E5] text-[#171717] focus:border-[#F97316] focus:outline-hidden"
                  />
                </div>

                <Button type="submit" size="md" className="w-full justify-center" rightIcon={<Send size={14} />}>
                  Submit Support Request →
                </Button>
              </form>
            )}
          </Card>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. DUAL ROLE SUPPORT & DARK FOOTER CTA                                     */}
      {/* ========================================================================= */}
      <section className="py-16 md:py-24 bg-[#171717] text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#F97316]">
            WE'RE HERE TO HELP
          </span>
          <h2 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-white">
            We're Here to Help You Navigate SODAARS.
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#A3A3A3] max-w-2xl mx-auto leading-relaxed">
            Explore our help center, learn from online guides, or contact SODAARS support when you need assistance operating outdoor advertising inventory.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link to="/get-started" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto" rightIcon={<ArrowRight size={16} />}>
                Get Started →
              </Button>
            </Link>
            <a href="#contact-support" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto" rightIcon={<ExternalLink size={14} />}>
                Contact Support ↗
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HelpSupportPage;
