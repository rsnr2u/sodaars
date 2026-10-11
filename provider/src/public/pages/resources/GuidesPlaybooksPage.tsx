import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ExternalLink,
  Sparkles,
  Layers,
  Calendar,
  FileText,
  Camera,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';

export const GuidesPlaybooksPage: React.FC = () => {
  const [topicFilter, setTopicFilter] = useState<string>('all');

  const topics = [
    { key: 'all', label: 'All Guides (12)' },
    { key: 'resource', label: 'Resource Management' },
    { key: 'availability', label: 'Availability' },
    { key: 'booking', label: 'Bookings' },
    { key: 'operations', label: 'Operations' },
    { key: 'marketplace', label: 'Marketplace' },
    { key: 'legal', label: 'Legal & Compliance' },
  ];

  const guideCards = [
    {
      id: 'G-01',
      title: 'Standardizing Static Inventory Specs',
      category: 'Resource Management',
      filterKey: 'resource',
      readTime: '6 min read',
      badge: 'Resource Ops',
      badgeVariant: 'brand' as const,
      summary: 'Practical guide to cataloging physical hoardings, unipoles, and gantries with exact facing, square footage, and illumination specs.',
    },
    {
      id: 'G-02',
      title: 'Managing Multi-Agency Client Holds',
      category: 'Availability',
      filterKey: 'availability',
      readTime: '8 min read',
      badge: 'Scheduling',
      badgeVariant: 'pending' as const,
      summary: 'How to manage provisional client holds without creating availability confusion or locking inventory indefinitely.',
    },
    {
      id: 'G-03',
      title: 'Direct Contract & Ledger Accounting',
      category: 'Bookings',
      filterKey: 'booking',
      readTime: '10 min read',
      badge: 'Commercial',
      badgeVariant: 'active' as const,
      summary: 'Coordinating direct advertiser contracts alongside marketplace inquiries while preserving media owner rate card sovereignty.',
    },
    {
      id: 'G-04',
      title: 'Client Proof: Photo & Mounting Verification',
      category: 'Operations',
      filterKey: 'operations',
      readTime: '7 min read',
      badge: 'Field Ops',
      badgeVariant: 'brand' as const,
      summary: 'Standardized operational procedures for daytime and illuminated nighttime photo evidence with tamper-resistant GPS metadata.',
    },
    {
      id: 'G-05',
      title: 'Static vs Digital OOH: Operational Realities',
      category: 'Marketplace',
      filterKey: 'marketplace',
      readTime: '9 min read',
      badge: 'Industry',
      badgeVariant: 'inactive' as const,
      summary: 'Understanding why physical static media operates on different contractual, mounting, and verification realities than programmatic screens.',
    },
    {
      id: 'G-06',
      title: 'Municipal Permits & Structural Lighting Audits',
      category: 'Legal & Compliance',
      filterKey: 'legal',
      readTime: '11 min read',
      badge: 'Compliance',
      badgeVariant: 'pending' as const,
      summary: 'Best practices for organizing municipal display licenses, structural stability certifications, and floodlight safety documentation.',
    },
  ];

  const filteredGuides = guideCards.filter(
    (g) => topicFilter === 'all' || g.filterKey === topicFilter
  );

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
              GUIDES &amp; PLAYBOOKS
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-[#171717] leading-[1.12]">
              Practical Guidance for Outdoor Advertising Operations.
            </h1>

            {/* Supporting Copy */}
            <p className="mt-6 text-base sm:text-lg lg:text-xl text-[#525252] max-w-3xl mx-auto leading-relaxed font-normal">
              Explore our collection of practical playbooks, operational frameworks, and best practices designed to help media owners streamline outdoor advertising workflows.
            </p>

            {/* CTAs */}
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Link to="/get-started" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto" rightIcon={<ArrowRight size={16} />}>
                  Explore Playbooks →
                </Button>
              </Link>
              <Link to="/resources/faq" className="w-full sm:w-auto">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto" rightIcon={<ExternalLink size={14} />}>
                  View All FAQs ↗
                </Button>
              </Link>
            </div>

            {/* Status Metrics Strip */}
            <div className="mt-12 pt-8 border-t border-[#E5E5E5]/60 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-base text-[#171717]">12</span>
                <span className="text-[#525252]">Practical Playbooks</span>
              </div>
              <span className="text-[#D4D4D8]">·</span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base text-[#171717]">100+</span>
                <span className="text-[#525252]">Best Practices</span>
              </div>
              <span className="text-[#D4D4D8]">·</span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base text-[#F97316]">Pan-India</span>
                <span className="text-[#525252]">Operational Coverage</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. FEATURED PLAYBOOK & WORKFLOW                                           */}
      {/* ========================================================================= */}
      <section className="py-16 md:py-24 border-b border-[#E5E5E5] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#F97316]">
              OPERATIONAL BLUEPRINT
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-[#171717]">
              Build a Better Outdoor Advertising Workflow
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#525252] leading-relaxed">
              Standardize how your media enterprise manages physical static assets, evaluates booking requests, and delivers verified campaign proof.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Visual Workflow Architecture Diagram */}
            <div className="lg:col-span-6">
              <Card className="p-6 bg-[#FAFAF9] border-[#E5E5E5] shadow-xs">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#737373] block mb-4">
                  The End-to-End Operational Lifecycle
                </span>
                <div className="space-y-3 font-mono text-xs">
                  <div className="p-3 bg-white rounded border border-[#E5E5E5] flex items-center justify-between">
                    <span className="font-bold text-[#171717]">01. REGISTER ASSETS</span>
                    <span className="text-[11px] text-[#737373]">Hoardings, Unipoles, Gantries</span>
                  </div>
                  <div className="p-3 bg-white rounded border border-[#E5E5E5] flex items-center justify-between">
                    <span className="font-bold text-[#171717]">02. CALENDAR SCHEDULE</span>
                    <span className="text-[11px] text-emerald-600">6 Operational States</span>
                  </div>
                  <div className="p-3 bg-white rounded border border-[#E5E5E5] flex items-center justify-between">
                    <span className="font-bold text-[#171717]">03. BOOKING PIPELINE</span>
                    <span className="text-[11px] text-[#F97316]">Direct + Marketplace</span>
                  </div>
                  <div className="p-3 bg-white rounded border border-[#E5E5E5] flex items-center justify-between">
                    <span className="font-bold text-[#171717]">04. MOUNTING PROOF</span>
                    <span className="text-[11px] text-[#262626]">GPS Verified Photos</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Featured Playbook Card */}
            <div className="lg:col-span-6">
              <Card className="p-8 bg-gradient-to-br from-orange-50/50 via-white to-white border-orange-200 shadow-sm">
                <Badge variant="brand" size="sm">Featured Framework</Badge>
                <h3 className="text-xl font-bold text-[#171717] mt-3">
                  The OOH Provider Operating Playbook
                </h3>
                <p className="mt-3 text-xs sm:text-sm text-[#525252] leading-relaxed">
                  A definitive guide for Indian outdoor media owners to eliminate double bookings, protect direct agency relationships, and participate profitably in digital marketplace demand.
                </p>
                <div className="mt-5 space-y-2 text-xs text-[#525252]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                    <span>How to maintain separate customer card rates and net settlement rates</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                    <span>Handling multi-agency provisional holds with defined expiry windows</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                    <span>Compiling agency-grade Proof of Performance (POP) dossiers</span>
                  </div>
                </div>
                <div className="mt-6 pt-5 border-t border-orange-100 flex items-center justify-between">
                  <span className="text-xs text-[#737373] font-mono">14 Pages · Complete PDF Guide</span>
                  <Link to="/get-started">
                    <Button size="sm" rightIcon={<ArrowRight size={14} />}>
                      Read Playbook →
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. OPERATIONAL PLAYBOOKS GRID (4 PLAYBOOKS)                               */}
      {/* ========================================================================= */}
      <section className="py-16 md:py-24 border-b border-[#E5E5E5] bg-[#FAFAF9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#F97316]">
              CORE PLAYBOOKS
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-[#171717]">
              Playbooks for Running Outdoor Advertising Operations
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#525252] leading-relaxed">
              Step-by-step operating procedures aligned directly to the five core operational disciplines of static outdoor advertising.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 bg-white border-[#E5E5E5] shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded bg-orange-50 border border-orange-200 flex items-center justify-center text-[#F97316] mb-4">
                  <Layers size={18} />
                </div>
                <Badge variant="brand" size="sm">Playbook 01</Badge>
                <h3 className="text-base font-bold text-[#171717] mt-2">Resource Management Playbook</h3>
                <p className="mt-2 text-xs text-[#525252] leading-relaxed">
                  How to accurately structure static OOH formats, catalog orientation and illumination specs, and manage asset rate cards.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-[#E5E5E5] flex items-center justify-between text-xs">
                <span className="text-[#737373]">8 Modules</span>
                <Link to="/solutions/resource-management" className="text-[#F97316] font-semibold flex items-center gap-1 hover:underline">
                  Read Playbook <ArrowRight size={12} />
                </Link>
              </div>
            </Card>

            <Card className="p-6 bg-white border-[#E5E5E5] shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded bg-orange-50 border border-orange-200 flex items-center justify-center text-[#F97316] mb-4">
                  <Calendar size={18} />
                </div>
                <Badge variant="active" size="sm">Playbook 02</Badge>
                <h3 className="text-base font-bold text-[#171717] mt-2">Availability Management Playbook</h3>
                <p className="mt-2 text-xs text-[#525252] leading-relaxed">
                  Coordinating date-range availability, managing provisional client holds, and scheduling physical maintenance windows.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-[#E5E5E5] flex items-center justify-between text-xs">
                <span className="text-[#737373]">6 Modules</span>
                <Link to="/solutions/availability-engine" className="text-[#F97316] font-semibold flex items-center gap-1 hover:underline">
                  Read Playbook <ArrowRight size={12} />
                </Link>
              </div>
            </Card>

            <Card className="p-6 bg-white border-[#E5E5E5] shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded bg-orange-50 border border-orange-200 flex items-center justify-center text-[#F97316] mb-4">
                  <FileText size={18} />
                </div>
                <Badge variant="pending" size="sm">Playbook 03</Badge>
                <h3 className="text-base font-bold text-[#171717] mt-2">Booking Operations Playbook</h3>
                <p className="mt-2 text-xs text-[#525252] leading-relaxed">
                  Standard operating procedures for managing direct client contracts, rate proposals, client confirmations, and contract renewals.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-[#E5E5E5] flex items-center justify-between text-xs">
                <span className="text-[#737373]">10 Modules</span>
                <Link to="/solutions/booking-pipeline" className="text-[#F97316] font-semibold flex items-center gap-1 hover:underline">
                  Read Playbook <ArrowRight size={12} />
                </Link>
              </div>
            </Card>

            <Card className="p-6 bg-white border-[#E5E5E5] shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded bg-orange-50 border border-orange-200 flex items-center justify-center text-[#F97316] mb-4">
                  <Camera size={18} />
                </div>
                <Badge variant="brand" size="sm">Playbook 04</Badge>
                <h3 className="text-base font-bold text-[#171717] mt-2">Campaign Execution Playbook</h3>
                <p className="mt-2 text-xs text-[#525252] leading-relaxed">
                  Field mounting work order dispatch, vinyl tension inspection, and capturing verifiable geotagged photo proof for agency billing.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-[#E5E5E5] flex items-center justify-between text-xs">
                <span className="text-[#737373]">7 Modules</span>
                <Link to="/solutions/campaign-execution" className="text-[#F97316] font-semibold flex items-center gap-1 hover:underline">
                  Read Playbook <ArrowRight size={12} />
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. EXPLORE GUIDES BY TOPIC (FILTERABLE)                                   */}
      {/* ========================================================================= */}
      <section className="py-16 md:py-24 border-b border-[#E5E5E5] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#F97316]">
                KNOWLEDGE REPOSITORY
              </span>
              <h2 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-[#171717]">
                Explore Guides by Topic
              </h2>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 bg-[#FAFAF9] p-1.5 rounded-lg border border-[#E5E5E5]">
              {topics.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTopicFilter(t.key)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    topicFilter === t.key
                      ? 'bg-[#171717] text-white shadow-xs'
                      : 'text-[#525252] hover:text-[#171717] hover:bg-white'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGuides.map((guide) => (
              <Card key={guide.id} className="p-6 bg-[#FAFAF9] border-[#E5E5E5] shadow-xs flex flex-col justify-between hover:border-[#F97316]/50 transition-colors">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant={guide.badgeVariant} size="sm">
                      {guide.badge}
                    </Badge>
                    <span className="text-[11px] text-[#737373] flex items-center gap-1">
                      <Clock size={11} /> {guide.readTime}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[#171717] mt-1">{guide.title}</h3>
                  <p className="mt-2 text-xs text-[#525252] leading-relaxed">{guide.summary}</p>
                </div>
                <div className="mt-5 pt-3 border-t border-[#E5E5E5] flex items-center justify-between text-xs">
                  <span className="text-[#737373] font-medium">{guide.category}</span>
                  <span className="text-[#F97316] font-semibold flex items-center gap-1 hover:underline cursor-pointer">
                    Read Guide <ArrowRight size={12} />
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. CONNECTED OPERATING MODEL                                              */}
      {/* ========================================================================= */}
      <section className="py-16 md:py-24 border-b border-[#E5E5E5] bg-[#FAFAF9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#F97316]">
              CONNECTED ECOSYSTEM
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-[#171717]">
              Learn the Platform Through One Connected Operating Model
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#525252] leading-relaxed">
              Every playbook connects directly to one of the five core solutions that power SODAARS.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <Link to="/solutions/resource-management" className="p-4 bg-white rounded-lg border border-[#E5E5E5] hover:border-[#F97316] transition-colors group">
              <span className="text-[10px] font-mono text-[#F97316] font-bold">MODULE 01</span>
              <h4 className="text-xs font-bold text-[#171717] mt-1 group-hover:text-[#F97316]">Resource Management</h4>
              <p className="mt-1 text-[11px] text-[#525252]">Asset cataloging and pricing</p>
            </Link>

            <Link to="/solutions/availability-engine" className="p-4 bg-white rounded-lg border border-[#E5E5E5] hover:border-[#F97316] transition-colors group">
              <span className="text-[10px] font-mono text-[#F97316] font-bold">MODULE 02</span>
              <h4 className="text-xs font-bold text-[#171717] mt-1 group-hover:text-[#F97316]">Availability Engine</h4>
              <p className="mt-1 text-[11px] text-[#525252]">Schedule ledger and slots</p>
            </Link>

            <Link to="/solutions/booking-pipeline" className="p-4 bg-white rounded-lg border border-[#E5E5E5] hover:border-[#F97316] transition-colors group">
              <span className="text-[10px] font-mono text-[#F97316] font-bold">MODULE 03</span>
              <h4 className="text-xs font-bold text-[#171717] mt-1 group-hover:text-[#F97316]">Booking Pipeline</h4>
              <p className="mt-1 text-[11px] text-[#525252]">Contracts, holds &amp; renewals</p>
            </Link>

            <Link to="/solutions/customer-crm" className="p-4 bg-white rounded-lg border border-[#E5E5E5] hover:border-[#F97316] transition-colors group">
              <span className="text-[10px] font-mono text-[#F97316] font-bold">MODULE 04</span>
              <h4 className="text-xs font-bold text-[#171717] mt-1 group-hover:text-[#F97316]">Customer CRM</h4>
              <p className="mt-1 text-[11px] text-[#525252]">Agencies &amp; corporate buyers</p>
            </Link>

            <Link to="/solutions/campaign-execution" className="p-4 bg-white rounded-lg border border-[#E5E5E5] hover:border-[#F97316] transition-colors group">
              <span className="text-[10px] font-mono text-[#F97316] font-bold">MODULE 05</span>
              <h4 className="text-xs font-bold text-[#171717] mt-1 group-hover:text-[#F97316]">Campaign Execution</h4>
              <p className="mt-1 text-[11px] text-[#525252]">Mounting proof &amp; POP</p>
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. DARK BOTTOM CTA                                                        */}
      {/* ========================================================================= */}
      <section className="py-16 md:py-24 bg-[#171717] text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#F97316]">
            READY TO IMPLEMENT BEST PRACTICES?
          </span>
          <h2 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-white">
            Ready to Put the Playbooks into Practice?
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#A3A3A3] max-w-2xl mx-auto leading-relaxed">
            Register your media enterprise and deploy structured operational workflows across your billboard and hoarding inventory.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link to="/get-started" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto" rightIcon={<ArrowRight size={16} />}>
                Get Started Today →
              </Button>
            </Link>
            <Link to="/resources/faq" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto" rightIcon={<ExternalLink size={14} />}>
                View All FAQs ↗
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GuidesPlaybooksPage;
