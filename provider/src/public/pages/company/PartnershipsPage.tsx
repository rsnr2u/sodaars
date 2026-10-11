import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  Send,
} from 'lucide-react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';

export const PartnershipsPage: React.FC = () => {
  // Partnership Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [orgName, setOrgName] = useState('');
  const [phone, setPhone] = useState('');
  const [partnerType, setPartnerType] = useState('Media Concessionaire / Asset Owner');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !message.trim()) return;
    setSubmitted(true);
  };

  const partnerPillars = [
    {
      step: '01',
      title: 'Outdoor Advertising Providers',
      badge: 'Media Asset Owners',
      badgeVariant: 'brand' as const,
      desc: 'Manage physical outdoor advertising resources, availability calendars, direct client campaigns, customer records, and proof-of-performance execution through dedicated SODAARS tooling.',
    },
    {
      step: '02',
      title: 'Marketplace Participants',
      badge: 'Demand Syndication',
      badgeVariant: 'active' as const,
      desc: 'Make eligible physical static assets discoverable to brand advertisers and regional agencies through the curated SODAARS Marketplace while preserving complete rate control.',
    },
    {
      step: '03',
      title: 'Business Partners',
      badge: 'Operational Synergy',
      badgeVariant: 'pending' as const,
      desc: 'Explore opportunities to work with SODAARS across regional operational workflows, enterprise campaign execution, municipal alignments, and specialized OOH industry services.',
    },
    {
      step: '04',
      title: 'Platform & Tech Partners',
      badge: 'Future Ecosystem',
      badgeVariant: 'inactive' as const,
      desc: 'Future platform capabilities are being planned to allow external platforms, enterprise ERPs, and media software to connect directly with SODAARS through standardized REST APIs.',
    },
  ];

  const whyPartner = [
    {
      number: '01',
      title: 'Connected Resources',
      desc: 'Bring structured outdoor advertising resource information — dimensions, geographic coordinates, illumination, and municipal permits — into a unified operating environment.',
    },
    {
      number: '02',
      title: 'Operational Workflows',
      desc: 'Connect static resource availability calendars, direct customer proposals, confirmed booking pipelines, and on-ground campaign mounting verification effortlessly.',
    },
    {
      number: '03',
      title: 'Marketplace Access',
      desc: 'Participate in open customer discovery and execution channel where applicable, expanding visibility to regional and national advertisers seeking verified static inventory.',
    },
    {
      number: '04',
      title: 'Future Connectivity',
      desc: 'Build toward an expansive ecosystem of certified third-party agency systems, programmatic planning tools, and business operations platforms via standalone REST APIs.',
    },
  ];

  const partnershipSteps = [
    {
      step: '1',
      title: '01 Tell Us',
      desc: 'Share your company profile, geographical presence, inventory footprint, and initial partnering interest through the enquiry desk.',
    },
    {
      step: '2',
      title: '02 Explore',
      desc: 'Engage in an exploratory operational walkthrough to assess requirements, licensing characteristics, and operating parameters.',
    },
    {
      step: '3',
      title: '03 Align',
      desc: 'Define the applicable commercial framework, SLA parameters, operational boundaries, and data governance safeguards.',
    },
    {
      step: '4',
      title: '04 Connect',
      desc: 'Complete catalog ingestion, configure access privileges, activate operational tooling, or advance prototype integrations.',
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
                OOH ECOSYSTEM &amp; PARTNERSHIPS
              </div>

              {/* Headline */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold tracking-tight text-[#171717] leading-[1.12]">
                Build With SODAARS.
              </h1>

              {/* Supporting Copy */}
              <p className="mt-6 text-base sm:text-lg text-[#525252] leading-relaxed font-normal max-w-2xl">
                Partner with SODAARS to connect outdoor advertising resources, provider operations, marketplace discovery, and future platform capabilities.
              </p>

              {/* CTAs */}
              <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
                <a href="#partner-form" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto" rightIcon={<ArrowRight size={16} />}>
                    Start a Partnership Conversation →
                  </Button>
                </a>
                <Link to="/company" className="w-full sm:w-auto">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto" rightIcon={<ExternalLink size={14} />}>
                    Explore SODAARS ↗
                  </Button>
                </Link>
              </div>

              <div className="mt-8 pt-6 border-t border-[#E5E5E5]/70 flex flex-wrap items-center gap-4 text-xs text-[#525252]">
                <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-emerald-600" /> Static OOH Dedicated</span>
                <span>·</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-emerald-600" /> Provider Sovereignty</span>
              </div>
            </div>

            {/* Right Topology Mock */}
            <div className="lg:col-span-5">
              <Card className="p-6 bg-white border-[#E5E5E5] shadow-lg">
                <div className="pb-3 border-b border-[#E5E5E5] mb-4 flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase text-[#737373]">
                    NETWORK TOPOLOGY
                  </span>
                  <Badge variant="brand" size="sm">OOH CORE ENGINE</Badge>
                </div>

                <div className="space-y-3">
                  <div className="p-3 rounded bg-[#FAFAF9] border border-[#E5E5E5]">
                    <div className="text-[10px] font-mono uppercase text-[#737373]">Layer 1</div>
                    <div className="font-bold text-xs text-[#171717] mt-0.5">Physical Advertising Resources</div>
                    <div className="text-[11px] text-[#525252]">Hoardings, Gantries, Unipoles, Bus Shelters</div>
                  </div>

                  <div className="p-3 rounded bg-[#FAFAF9] border border-[#E5E5E5]">
                    <div className="text-[10px] font-mono uppercase text-[#737373]">Layer 2</div>
                    <div className="font-bold text-xs text-[#171717] mt-0.5">Provider Control Layer</div>
                    <div className="text-[11px] text-[#525252]">Private Operations, Scheduling &amp; Rate Governance</div>
                  </div>

                  <div className="p-3.5 rounded bg-[#171717] text-white border border-[#262626]">
                    <div className="text-[10px] font-mono uppercase text-[#F97316]">Core Hub</div>
                    <div className="font-bold text-xs text-white mt-0.5">SODAARS Unified Core Engine</div>
                    <div className="text-[11px] text-[#A3A3A3]">Master OOH Resource Model &amp; Canonical Metadata</div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded bg-orange-50 border border-orange-200">
                      <div className="font-bold text-[11px] text-[#171717]">SODAARS Marketplace</div>
                      <div className="text-[10px] text-[#737373]">Discovery &amp; booking pipeline</div>
                    </div>
                    <div className="p-2.5 rounded bg-[#FAFAF9] border border-[#E5E5E5]">
                      <div className="font-bold text-[11px] text-[#171717]">Partner Platforms</div>
                      <div className="text-[10px] text-[#737373]">API partners &amp; ERP integrations</div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. DIFFERENT PARTNERS, ONE CONNECTED ECOSYSTEM                            */}
      {/* ========================================================================= */}
      <section className="py-16 md:py-24 border-b border-[#E5E5E5] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#F97316]">
              PARTNERSHIP PILLARS
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-[#171717]">
              Different Partners. One Connected Ecosystem.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#525252] leading-relaxed">
              SODAARS is designed to connect the people, physical resources, and platforms involved in outdoor advertising across India.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {partnerPillars.map((p) => (
              <Card key={p.step} className="p-6 bg-[#FAFAF9] border-[#E5E5E5] shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E5] mb-3">
                    <span className="text-xs font-mono font-bold text-[#F97316]">CATEGORY {p.step}</span>
                    <Badge variant={p.badgeVariant} size="sm">{p.badge}</Badge>
                  </div>
                  <h3 className="font-bold text-base text-[#171717]">{p.title}</h3>
                  <p className="mt-2 text-xs sm:text-sm text-[#525252] leading-relaxed">{p.desc}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#E5E5E5] text-[11px] font-semibold text-[#F97316]">
                  Partner Alignment →
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. WHY PARTNER: CONNECT INTO THE OOH INFRASTRUCTURE                       */}
      {/* ========================================================================= */}
      <section className="py-16 md:py-24 border-b border-[#E5E5E5] bg-[#FAFAF9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#F97316]">
              WHY PARTNER
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-[#171717]">
              Connect Into the Outdoor Advertising Infrastructure.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#525252] leading-relaxed">
              A dependable technological foundation built around the actual structural realities of static OOH operations.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyPartner.map((item) => (
              <Card key={item.number} className="p-6 bg-white border-[#E5E5E5] shadow-xs">
                <span className="text-xs font-mono font-bold text-[#F97316]">{item.number}</span>
                <h3 className="font-bold text-base text-[#171717] mt-1">{item.title}</h3>
                <p className="mt-2 text-xs sm:text-sm text-[#525252] leading-relaxed">{item.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. PARTNERSHIP DIALOGUE FORM                                              */}
      {/* ========================================================================= */}
      <section id="partner-form" className="py-16 md:py-24 border-b border-[#E5E5E5] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Context */}
            <div className="lg:col-span-5">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#F97316]">
                PARTNERSHIP DIALOGUE
              </span>
              <h2 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-[#171717]">
                Tell Us How You Want to Work Together.
              </h2>
              <p className="mt-3 text-xs sm:text-sm text-[#525252] leading-relaxed">
                We review every partnership enquiry with careful operational consideration. Share your current operational context and what you want to achieve with the SODAARS platform.
              </p>

              <div className="mt-6 space-y-3 text-xs text-[#525252]">
                <div className="p-3 rounded bg-[#FAFAF9] border border-[#E5E5E5]">
                  <strong className="text-[#171717]">Resource Synchronization:</strong> Connect dynamic catalog inventory to centralized availability.
                </div>
                <div className="p-3 rounded bg-[#FAFAF9] border border-[#E5E5E5]">
                  <strong className="text-[#171717]">Commercial Integration:</strong> Scalable settlement protocols and custom commercial terms.
                </div>
                <div className="p-3 rounded bg-[#FAFAF9] border border-[#E5E5E5]">
                  <strong className="text-[#171717]">Workflow Deployment:</strong> Standardized print flex, mounting proof, and vacancy management.
                </div>
                <div className="p-3 rounded bg-[#FAFAF9] border border-[#E5E5E5]">
                  <strong className="text-[#171717]">Enterprise Onboarding:</strong> Tailored database onboarding for multi-city network providers.
                </div>
              </div>
            </div>

            {/* Right Form Card */}
            <div className="lg:col-span-7">
              <Card className="p-6 sm:p-8 bg-[#FAFAF9] border-[#E5E5E5] shadow-md">
                {submitted ? (
                  <div className="p-8 text-center space-y-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                      <CheckCircle2 size={28} />
                    </div>
                    <h3 className="text-xl font-bold text-[#171717]">Partnership Inquiry Received</h3>
                    <p className="text-xs sm:text-sm text-[#525252] max-w-md mx-auto leading-relaxed">
                      Thank you, <strong>{fullName}</strong>. Your proposal for <strong>{orgName || 'your organization'}</strong> has been routed to our Ecosystem Partnerships team. We will review your operational context and follow up at <strong>{email}</strong> within 24–48 business hours.
                    </p>
                    <div className="pt-4">
                      <Button variant="outline" size="sm" onClick={() => setSubmitted(false)}>
                        Submit Another Inquiry
                      </Button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="text-xs font-bold uppercase tracking-wider text-[#171717] pb-2 border-b border-[#E5E5E5]">
                      Start the Partnership Dialogue
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#171717] mb-1">Full Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Sameer Verma"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded border border-[#E5E5E5] focus:outline-none focus:border-[#F97316] bg-white text-[#171717]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#171717] mb-1">Work Email *</label>
                        <input
                          type="email"
                          required
                          placeholder="name@company.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded border border-[#E5E5E5] focus:outline-none focus:border-[#F97316] bg-white text-[#171717]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#171717] mb-1">Company / Organization *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Apex Media Networks"
                          value={orgName}
                          onChange={(e) => setOrgName(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded border border-[#E5E5E5] focus:outline-none focus:border-[#F97316] bg-white text-[#171717]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#171717] mb-1">Phone Number</label>
                        <input
                          type="tel"
                          placeholder="+91 98XXX XXXXX"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded border border-[#E5E5E5] focus:outline-none focus:border-[#F97316] bg-white text-[#171717]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#171717] mb-1">Partnership Type</label>
                      <select
                        value={partnerType}
                        onChange={(e) => setPartnerType(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded border border-[#E5E5E5] focus:outline-none focus:border-[#F97316] bg-white text-[#171717]"
                      >
                        <option>Media Concessionaire / Asset Owner</option>
                        <option>Advertising Agency / Media Planner</option>
                        <option>Operations / Mounting Agency</option>
                        <option>Technology / ERP Platform</option>
                        <option>Other Business Collaboration</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#171717] mb-1">How can we work together? *</label>
                      <textarea
                        required
                        rows={4}
                        placeholder="Describe your current static inventory footprint, operating regions, or proposed collaboration scope..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded border border-[#E5E5E5] focus:outline-none focus:border-[#F97316] bg-white text-[#171717]"
                      ></textarea>
                    </div>

                    <div>
                      <Button type="submit" size="lg" className="w-full" rightIcon={<Send size={15} />}>
                        Submit Partnership Inquiry →
                      </Button>
                    </div>
                  </form>
                )}
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. A SIMPLE PATH TO PARTNERSHIP                                            */}
      {/* ========================================================================= */}
      <section className="py-16 md:py-24 border-b border-[#E5E5E5] bg-[#FAFAF9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#F97316]">
              ADAPTIVE STEPS
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-[#171717]">
              A Simple Path to Partnership.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#525252] leading-relaxed">
              A systematic 4-stage engagement framework designed for operational clarity and zero ambiguity.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {partnershipSteps.map((step) => (
              <Card key={step.step} className="p-6 bg-white border-[#E5E5E5] shadow-xs">
                <div className="w-7 h-7 rounded bg-orange-50 border border-orange-200 text-[#F97316] font-bold text-xs flex items-center justify-center mb-3">
                  {step.step}
                </div>
                <h3 className="font-bold text-base text-[#171717]">{step.title}</h3>
                <p className="mt-2 text-xs text-[#525252] leading-relaxed">{step.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. BUILT FOR THE NEXT LAYER OF OUTDOOR ADVERTISING (ARCHITECTURE TIERS)   */}
      {/* ========================================================================= */}
      <section className="py-16 md:py-24 border-b border-[#E5E5E5] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#F97316]">
                ARCHITECTURE
              </span>
              <h2 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-[#171717]">
                Built for the Next Layer of Outdoor Advertising.
              </h2>
              <p className="mt-3 text-xs sm:text-sm text-[#525252] leading-relaxed">
                SODAARS is being designed as more than a provider management platform. Its long-term direction connects Provider SaaS, Marketplace discovery, and a future API layer that can support partner platforms.
              </p>
              <div className="mt-4 space-y-2 text-xs text-[#525252]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-[#F97316]" />
                  <span>Canonical Data Schema for Physical Assets</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-[#F97316]" />
                  <span>Tamper-proof Availability Proof Records</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-[#F97316]" />
                  <span>Future Gateway for External Aggregators</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="space-y-3">
                <Card className="p-4 bg-[#FAFAF9] border-[#E5E5E5]">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#171717]">Tier 4: Partner Platforms</span>
                    <Badge variant="inactive" size="sm">External Integrations</Badge>
                  </div>
                  <div className="text-xs text-[#525252] mt-1">Commercial Media Agencies, Custom ERP Systems &amp; Corporate Planning Consoles.</div>
                </Card>

                <Card className="p-4 bg-orange-50/50 border-orange-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#171717]">Tier 3: API Gateway &amp; Integration Layer</span>
                    <Badge variant="brand" size="sm">Future Roadmap</Badge>
                  </div>
                  <div className="text-xs text-[#525252] mt-1">Standardized RESTful endpoints and webhook listeners for inventory sync &amp; reservations.</div>
                </Card>

                <Card className="p-4 bg-[#FAFAF9] border-[#E5E5E5]">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#171717]">Tier 2: SODAARS Marketplace</span>
                    <Badge variant="active" size="sm">Discovery Channel</Badge>
                  </div>
                  <div className="text-xs text-[#525252] mt-1">Voluntary discovery surface for brand advertisers &amp; national media planners.</div>
                </Card>

                <Card className="p-4 bg-[#171717] text-white border border-[#262626]">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Tier 1: SODAARS Provider Core SaaS</span>
                    <Badge variant="active" size="sm">Provider Foundation</Badge>
                  </div>
                  <div className="text-xs text-[#A3A3A3] mt-1">Private resource database, Availability Engine, Bookings CRM &amp; Campaign Execution.</div>
                </Card>
              </div>
            </div>
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
            LET'S BUILD TOGETHER
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white">
            Have a Partnership Idea?
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#A3A3A3] max-w-2xl mx-auto leading-relaxed">
            Tell the SODAARS team what you are building, operating, or looking to connect in the Indian outdoor advertising network.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <a href="#partner-form" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto" rightIcon={<ArrowRight size={16} />}>
                Start a Partnership Conversation →
              </Button>
            </a>
            <Link to="/company/contact" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto" rightIcon={<ExternalLink size={14} />}>
                Contact Team ↗
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PartnershipsPage;
