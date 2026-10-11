import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Building2,
  Briefcase,
  Store,
  Award,
  Layers,
  FileText,
  Camera,
  Globe,
  ShieldCheck,
  Code2,
  Check,
  History,
  Search,
  Filter,
  Calendar,
  ArrowUpRight,
} from 'lucide-react';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';

export const CustomerCRMPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'agency' | 'enterprise' | 'local' | 'brand'>('all');

  // The 4 Approved Customer Types
  const customerTypes = [
    {
      title: 'Advertising Agencies',
      category: 'Media Buying & Planning',
      icon: Briefcase,
      badge: 'Agency Accounts',
      badgeVariant: 'brand' as const,
      desc: 'Media planning and buying agencies contracting static outdoor inventory on behalf of diverse client brand portfolios.',
      operationalFocus: 'Centralizes agency media planners, multi-brand account relationships, and recurring campaign placements.',
    },
    {
      title: 'Direct Enterprise Buyers',
      category: 'Corporate Accounts',
      icon: Building2,
      badge: 'Enterprise',
      badgeVariant: 'active' as const,
      desc: 'National and multi-regional corporations contracting directly with the media owner for long-term prime asset visibility.',
      operationalFocus: 'Centralizes corporate purchasing entities, direct contract terms, and multi-city outdoor presence.',
    },
    {
      title: 'Local Businesses',
      category: 'Regional Commerce',
      icon: Store,
      badge: 'Regional Retail',
      badgeVariant: 'pending' as const,
      desc: 'Regional retail outlets, educational institutions, real estate promoters, and healthcare providers booking localized hoardings.',
      operationalFocus: 'Supports hyper-local display requirements, merchant relationships, and regional display schedules.',
    },
    {
      title: 'Brands / Corporate Clients',
      category: 'Direct Marketing',
      icon: Award,
      badge: 'Brand Accounts',
      badgeVariant: 'inactive' as const,
      desc: 'Direct consumer and B2B brand marketing divisions coordinating focused product launches and brand awareness campaigns.',
      operationalFocus: 'Links brand identity, verified business credentials, and dedicated display campaigns directly to media assets.',
    },
  ];

  // The 4 Relational Flow Steps (Customer -> Booking -> Advertising Resource -> Campaign)
  const customerRelationshipFlow = [
    {
      step: '1',
      title: 'Customer',
      subtitle: 'Client Account',
      icon: Users,
      desc: 'Account record for Advertising Agencies, Direct Enterprise Buyers, Local Businesses, or Corporate Brands.',
    },
    {
      step: '2',
      title: 'Booking',
      subtitle: 'Commercial Contract',
      icon: FileText,
      desc: 'The binding transaction establishing agreed display dates, terms, and confirmed parties.',
    },
    {
      step: '3',
      title: 'Advertising Resource',
      subtitle: 'Physical Media Asset',
      icon: Layers,
      desc: 'The physical static hoarding, unipole, or gantry allocated to fulfill the booking.',
    },
    {
      step: '4',
      title: 'Campaign',
      subtitle: 'Execution Workflow',
      icon: Camera,
      desc: 'The operational phase coordinating physical display execution during the contracted window.',
    },
  ];

  // Mock Directory Accounts for the Table Mockup
  const directoryAccounts = [
    {
      id: 'ACC-01',
      company: 'Ogilvy Media South Asia',
      typeKey: 'agency',
      type: 'Advertising Agency',
      typeBadge: 'brand' as const,
      contact: 'Rajesh Sharma',
      phone: '+91 98201 44821',
      email: 'rajesh.s@ogilvy.com',
      activeDisplays: '6 Active Units',
      lifetimeBookings: '18 Bookings',
      status: 'Active',
      statusVariant: 'active' as const,
    },
    {
      id: 'ACC-02',
      company: 'Tata Consumer Products',
      typeKey: 'enterprise',
      type: 'Direct Enterprise Buyer',
      typeBadge: 'active' as const,
      contact: 'Ananya Verma',
      phone: '+91 98110 33912',
      email: 'ananya.v@tataconsumer.com',
      activeDisplays: '2 Highway Unipoles',
      lifetimeBookings: '8 Bookings',
      status: 'Active',
      statusVariant: 'active' as const,
    },
    {
      id: 'ACC-03',
      company: 'Titan Eyeplus Regional',
      typeKey: 'local',
      type: 'Local Business',
      typeBadge: 'pending' as const,
      contact: 'Vikram Mehta',
      phone: '+91 98450 11204',
      email: 'vikram.m@titanretail.in',
      activeDisplays: '1 Prime Hoarding',
      lifetimeBookings: '4 Bookings',
      status: 'Active',
      statusVariant: 'active' as const,
    },
    {
      id: 'ACC-04',
      company: 'Samsung Electronics India',
      typeKey: 'brand',
      type: 'Brands / Corporate Clients',
      typeBadge: 'inactive' as const,
      contact: 'Neha Kapoor',
      phone: '+91 99300 77819',
      email: 'neha.k@samsung.com',
      activeDisplays: '3 Gantry Placements',
      lifetimeBookings: '11 Bookings',
      status: 'Active',
      statusVariant: 'active' as const,
    },
  ];

  const filteredAccounts = directoryAccounts.filter((acc) => {
    if (activeFilter === 'all') return true;
    return acc.typeKey === activeFilter;
  });

  // Customer Profile Field Groups
  const profilePillars = [
    {
      title: 'Master Contact & Entity Records',
      subtitle: 'Primary Communication',
      icon: Users,
      attributes: ['Company Legal Name', 'Primary Contact Person', 'Verified Phone Number', 'Official Invoicing Email'],
      desc: 'Core business communication channels for coordinating media proposals, contracts, and operational notices.',
    },
    {
      title: 'Commercial & Tax Profile',
      subtitle: 'Tax & Entity Verification',
      icon: FileText,
      attributes: ['Customer Classification', 'GSTIN Credentials', 'Registered Billing Address', 'Entity Verification Status'],
      desc: 'Commercial and tax recordkeeping to ensure accurate documentation, billing compliance, and legal auditability.',
    },
    {
      title: 'Operational Linkages',
      subtitle: 'Relational OOH Data',
      icon: Layers,
      attributes: ['Active Display Bookings', 'Lifetime Contract History', 'Assigned Media Resources', 'Campaign Proof Archives'],
      desc: 'Relational links connecting the client account directly to physical media assets, booking terms, and photo proofs.',
    },
    {
      title: 'Account Standing & Status',
      subtitle: 'Relationship Oversight',
      icon: ShieldCheck,
      attributes: ['Account Status (Active / Dormant)', 'Origination Source (Direct / Marketplace)', 'Assigned Account Owner', 'Operational Notes'],
      desc: 'Clear account standing indicators to maintain transparent relationship oversight and commercial integrity across teams.',
    },
  ];

  // Chronological Customer Activity Events
  const recentActivities = [
    {
      type: 'Booking Confirmed',
      company: 'Ogilvy Media South Asia',
      classification: 'Advertising Agency',
      detail: 'Western Express Highway Unipole (40×20 ft) · Confirmed for Nov 2026 – Apr 2027',
      time: 'Recently Updated',
      badgeVariant: 'brand' as const,
    },
    {
      type: 'Terms Under Review',
      company: 'Tata Consumer Products',
      classification: 'Direct Enterprise Buyer',
      detail: 'Bengaluru Outer Ring Road Hoarding · Direct contract proposal under review',
      time: 'In Progress',
      badgeVariant: 'pending' as const,
    },
    {
      type: 'Campaign Live',
      company: 'Titan Eyeplus Regional',
      classification: 'Local Business',
      detail: 'MG Road Trinity Circle Hoarding · Active display period underway',
      time: 'Active Display',
      badgeVariant: 'active' as const,
    },
    {
      type: 'Booking Concluded',
      company: 'Samsung Electronics India',
      classification: 'Brands / Corporate Clients',
      detail: 'Hyderabad Cyber Towers Gantry · Contract lifecycle completed',
      time: 'Concluded',
      badgeVariant: 'inactive' as const,
    },
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
              CUSTOMER RELATIONSHIP MANAGEMENT
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-[#171717] leading-[1.12]">
              Keep Every Customer Relationship Connected.
            </h1>

            {/* Subtitle / Core Description */}
            <div className="mt-4 text-lg sm:text-xl font-semibold text-[#F97316]">
              Agencies and direct enterprise buyers
            </div>

            {/* Supporting Copy */}
            <p className="mt-4 text-base sm:text-lg text-[#525252] max-w-3xl mx-auto leading-relaxed font-normal">
              Organize advertising agencies, direct corporate buyers, and local businesses, linking every client directly to active bookings, contracted resources, and campaign proof records.
            </p>

            {/* CTAs */}
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Link to="/get-started" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto" rightIcon={<ArrowRight size={16} />}>
                  Get Started →
                </Button>
              </Link>
              <Link to="/marketplace" className="w-full sm:w-auto">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto" rightIcon={<ExternalLink size={14} />}>
                  Explore Marketplace →
                </Button>
              </Link>
            </div>

            {/* Metric Pills */}
            <div className="mt-12 pt-8 border-t border-[#E5E5E5]/60 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs">
              <span className="px-3 py-1 rounded-full bg-white border border-[#E5E5E5] text-[#171717] font-medium shadow-xs">
                Unified Client Ledger
              </span>
              <span className="text-[#D4D4D8]">·</span>
              <span className="px-3 py-1 rounded-full bg-white border border-[#E5E5E5] text-[#171717] font-medium shadow-xs">
                Direct & Marketplace Accounts
              </span>
              <span className="text-[#D4D4D8]">·</span>
              <span className="px-3 py-1 rounded-full bg-white border border-[#E5E5E5] text-[#171717] font-medium shadow-xs">
                Connected Campaign Records
              </span>
              <span className="text-[#D4D4D8]">·</span>
              <span className="px-3 py-1 rounded-full bg-white border border-[#E5E5E5] text-[#171717] font-medium shadow-xs">
                Static OOH Architecture
              </span>
            </div>
          </div>

          {/* Hero Realistic Mockup Card */}
          <div className="mt-14 max-w-4xl mx-auto">
            <Card className="p-6 sm:p-7 bg-white border-[#E5E5E5] shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#E5E5E5]">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-[#F97316]" />
                  <span className="text-xs font-bold text-[#171717] uppercase tracking-wider">
                    Customer Directory Overview · Live Accounts
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="active">Directory Active</Badge>
                  <span className="text-xs text-[#737373] font-mono">48 Registered Accounts</span>
                </div>
              </div>

              {/* Top Metrics Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-5">
                <div className="p-3.5 rounded-lg bg-[#FAFAF9] border border-[#E5E5E5]">
                  <div className="text-[11px] font-medium text-[#737373]">Total Client Accounts</div>
                  <div className="text-xl font-bold text-[#171717] mt-0.5">48</div>
                  <div className="text-[10px] text-emerald-700 mt-0.5">Agencies, Enterprise & Local</div>
                </div>
                <div className="p-3.5 rounded-lg bg-[#FAFAF9] border border-[#E5E5E5]">
                  <div className="text-[11px] font-medium text-[#737373]">Active Display Bookings</div>
                  <div className="text-xl font-bold text-[#F97316] mt-0.5">14</div>
                  <div className="text-[10px] text-[#737373] mt-0.5">Linked to physical assets</div>
                </div>
                <div className="p-3.5 rounded-lg bg-[#FAFAF9] border border-[#E5E5E5]">
                  <div className="text-[11px] font-medium text-[#737373]">Origination Distribution</div>
                  <div className="text-xl font-bold text-[#171717] mt-0.5">72% Direct</div>
                  <div className="text-[10px] text-[#737373] mt-0.5">28% Marketplace discovered</div>
                </div>
              </div>

              {/* Sample Mini Table Row */}
              <div className="space-y-2">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-[#737373]">
                  Recent Client Directory Entries
                </div>
                <div className="divide-y divide-[#E5E5E5] border border-[#E5E5E5] rounded-lg overflow-hidden bg-white text-xs">
                  <div className="p-3 flex items-center justify-between hover:bg-[#FAFAF9] transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded bg-orange-100 text-[#F97316] font-bold flex items-center justify-center text-[10px]">
                        OM
                      </div>
                      <div>
                        <div className="font-bold text-[#171717]">Ogilvy Media South Asia</div>
                        <div className="text-[11px] text-[#737373]">Advertising Agency · 6 Active Units</div>
                      </div>
                    </div>
                    <Badge variant="brand">Agency</Badge>
                  </div>
                  <div className="p-3 flex items-center justify-between hover:bg-[#FAFAF9] transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-[10px]">
                        TC
                      </div>
                      <div>
                        <div className="font-bold text-[#171717]">Tata Consumer Products</div>
                        <div className="text-[11px] text-[#737373]">Direct Enterprise Buyer · 2 Highway Unipoles</div>
                      </div>
                    </div>
                    <Badge variant="active">Enterprise</Badge>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. UNIFIED ENTERPRISE ACCOUNT DIRECTORY (TABLE MOCKUP)                   */}
      {/* ========================================================================= */}
      <section className="py-16 md:py-24 border-b border-[#E5E5E5] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#F97316]">
              CENTRALIZED CLIENT DIRECTORY
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-[#171717]">
              Unified Enterprise Account Directory.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#525252] leading-relaxed">
              A single operational ledger for every media buyer account—linking client details, primary contacts, active inventory allocations, and lifetime booking history.
            </p>
          </div>

          {/* Directory Ledger Card */}
          <Card className="bg-[#FAFAF9] border-[#E5E5E5] shadow-xs overflow-hidden">
            {/* Filter and Action Bar */}
            <div className="p-4 sm:p-5 border-b border-[#E5E5E5] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white">
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#737373]" />
                  <input
                    type="text"
                    readOnly
                    value="Search accounts by company, contact, or GSTIN..."
                    className="pl-8 pr-3 py-1.5 text-xs rounded-md border border-[#E5E5E5] bg-[#FAFAF9] text-[#737373] w-64 sm:w-72 focus:outline-none cursor-default"
                  />
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setActiveFilter('all')}
                    className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
                      activeFilter === 'all'
                        ? 'bg-[#171717] text-white'
                        : 'bg-[#FAFAF9] text-[#525252] hover:bg-[#E5E5E5]'
                    }`}
                  >
                    All Accounts
                  </button>
                  <button
                    onClick={() => setActiveFilter('agency')}
                    className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
                      activeFilter === 'agency'
                        ? 'bg-[#171717] text-white'
                        : 'bg-[#FAFAF9] text-[#525252] hover:bg-[#E5E5E5]'
                    }`}
                  >
                    Agencies
                  </button>
                  <button
                    onClick={() => setActiveFilter('enterprise')}
                    className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
                      activeFilter === 'enterprise'
                        ? 'bg-[#171717] text-white'
                        : 'bg-[#FAFAF9] text-[#525252] hover:bg-[#E5E5E5]'
                    }`}
                  >
                    Enterprise
                  </button>
                  <button
                    onClick={() => setActiveFilter('local')}
                    className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
                      activeFilter === 'local'
                        ? 'bg-[#171717] text-white'
                        : 'bg-[#FAFAF9] text-[#525252] hover:bg-[#E5E5E5]'
                    }`}
                  >
                    Local
                  </button>
                  <button
                    onClick={() => setActiveFilter('brand')}
                    className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
                      activeFilter === 'brand'
                        ? 'bg-[#171717] text-white'
                        : 'bg-[#FAFAF9] text-[#525252] hover:bg-[#E5E5E5]'
                    }`}
                  >
                    Brands
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" leftIcon={<Filter size={13} />}>
                  Filter View
                </Button>
                <Button size="sm" rightIcon={<ArrowUpRight size={13} />}>
                  + Add Client Account
                </Button>
              </div>
            </div>

            {/* Table Container */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#FAFAF9] border-b border-[#E5E5E5] text-[#737373] uppercase tracking-wider text-[10px] font-semibold">
                    <th className="py-3 px-4">Account / Company</th>
                    <th className="py-3 px-4">Customer Type</th>
                    <th className="py-3 px-4">Primary Contact</th>
                    <th className="py-3 px-4">Active Displays</th>
                    <th className="py-3 px-4">Lifetime Bookings</th>
                    <th className="py-3 px-4">Account Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E5E5] bg-white">
                  {filteredAccounts.map((account) => (
                    <tr key={account.id} className="hover:bg-[#FAFAF9] transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-[#171717]">{account.company}</div>
                        <div className="text-[11px] font-mono text-[#737373] mt-0.5">{account.id}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge variant={account.typeBadge}>{account.type}</Badge>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="text-[#171717] font-medium">{account.contact}</div>
                        <div className="text-[11px] text-[#737373]">{account.phone}</div>
                        <div className="text-[11px] text-[#737373]">{account.email}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-medium text-[#171717]">{account.activeDisplays}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-[#525252]">{account.lifetimeBookings}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge variant={account.statusVariant}>{account.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-3.5 border-t border-[#E5E5E5] bg-white text-[11px] text-[#737373] text-center">
              All accounts link directly to their active bookings and contracted static media assets.
            </div>
          </Card>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. SEE THE FULL CUSTOMER RELATIONSHIP IN ONE PLACE                        */}
      {/* ========================================================================= */}
      <section className="py-16 md:py-24 border-b border-[#E5E5E5] bg-[#FAFAF9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Narrative Column */}
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#F97316]">
                <Users size={14} className="text-[#F97316]" />
                DEEP RELATIONAL PROFILE
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#171717]">
                See the Full Customer Relationship in One Place.
              </h2>
              <div className="space-y-3 text-sm text-[#525252] leading-relaxed">
                <p>
                  No more lost notes or scattered spreadsheets. SODAARS links client accounts directly to their physical hoardings, contract terms, billing status, and campaign proofs—so your sales and operations teams always share the same source of truth.
                </p>
                <div className="p-4 rounded-md bg-white border border-[#E5E5E5] space-y-2 text-xs">
                  <div>
                    <strong className="text-[#171717]">Client Custody:</strong> Customer accounts and contact records remain strictly confidential to the provider.
                  </div>
                  <div className="pt-2 border-t border-[#E5E5E5]">
                    <strong className="text-[#171717]">Relational Linkages:</strong> Instantly view all active hoardings, past bookings, and mounting records for any client.
                  </div>
                  <div className="pt-2 border-t border-[#E5E5E5]">
                    <strong className="text-[#171717]">Unified Commercial Record:</strong> Consolidates verified GSTIN, billing addresses, and authorized contacts.
                  </div>
                </div>
              </div>
            </div>

            {/* Right Detailed Customer Profile Card Mockup */}
            <div className="lg:col-span-6">
              <Card className="p-6 bg-white border-[#E5E5E5] shadow-xs">
                <div className="flex items-center justify-between pb-4 border-b border-[#E5E5E5]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-orange-100 text-[#F97316] font-bold flex items-center justify-center text-sm">
                      WM
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[#171717]">Wave Media Communications</h3>
                      <div className="text-[11px] text-[#737373]">GSTIN: 27AABCV1234F1Z8 · Mumbai Regional Office</div>
                    </div>
                  </div>
                  <Badge variant="brand">Advertising Agency</Badge>
                </div>

                {/* Contact and Account Strip */}
                <div className="grid grid-cols-2 gap-3 my-4 p-3 rounded-lg bg-[#FAFAF9] border border-[#E5E5E5] text-xs">
                  <div>
                    <span className="text-[10px] text-[#737373] uppercase font-semibold">Primary Contact</span>
                    <div className="font-bold text-[#171717] mt-0.5">Rajiv Nambiar</div>
                    <div className="text-[11px] text-[#737373]">VP Media Planning</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#737373] uppercase font-semibold">Communication</span>
                    <div className="font-medium text-[#171717] mt-0.5">+91 98201 55901</div>
                    <div className="text-[11px] text-[#737373]">rajiv@wavemedia.in</div>
                  </div>
                </div>

                {/* Quick Stats Strip */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs mb-4">
                  <div className="p-2.5 rounded bg-[#FAFAF9] border border-[#E5E5E5]">
                    <div className="text-[10px] text-[#737373]">Active Displays</div>
                    <div className="text-sm font-bold text-[#F97316] mt-0.5">6 Units</div>
                  </div>
                  <div className="p-2.5 rounded bg-[#FAFAF9] border border-[#E5E5E5]">
                    <div className="text-[10px] text-[#737373]">Total Bookings</div>
                    <div className="text-sm font-bold text-[#171717] mt-0.5">18 Completed</div>
                  </div>
                  <div className="p-2.5 rounded bg-[#FAFAF9] border border-[#E5E5E5]">
                    <div className="text-[10px] text-[#737373]">Account Status</div>
                    <div className="text-sm font-bold text-emerald-700 mt-0.5">Verified</div>
                  </div>
                </div>

                {/* Linked Active Display */}
                <div className="p-3 rounded-lg border border-orange-200 bg-orange-50/50 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#F97316]">
                      Current Linked Asset Allocation
                    </span>
                    <span className="text-[10px] font-mono text-emerald-700 font-bold">Active Contract</span>
                  </div>
                  <div className="font-bold text-[#171717] mt-1">
                    Western Express Highway Prime Unipole (40×20 ft)
                  </div>
                  <div className="text-[11px] text-[#737373] mt-0.5">
                    Term: Nov 1, 2026 – Apr 30, 2027 · Agency Brand: HDFC Bank
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#E5E5E5] text-[11px] text-[#737373] text-center">
                  Direct operational link: Customer Account → Booking Contract → Physical Static Asset.
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. THE FOUR APPROVED CUSTOMER TYPES                                       */}
      {/* ========================================================================= */}
      <section className="py-16 md:py-24 border-b border-[#E5E5E5] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#F97316]">
              CLIENT CLASSIFICATIONS
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-[#171717]">
              Built for Agencies and Direct Enterprise Buyers.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#525252] leading-relaxed">
              The SODAARS Customer CRM provides tailored categorization to accommodate the diverse operational realities of outdoor media buying.
            </p>
          </div>

          {/* 4 Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {customerTypes.map((cust) => {
              const Icon = cust.icon;
              return (
                <Card
                  key={cust.title}
                  className="p-6 bg-[#FAFAF9] border-[#E5E5E5] flex flex-col justify-between hover:border-[#F97316]/40 transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E5]">
                      <div className="w-8 h-8 rounded-md bg-white border border-[#E5E5E5] text-[#F97316] flex items-center justify-center shadow-xs">
                        <Icon size={16} />
                      </div>
                      <Badge variant={cust.badgeVariant}>{cust.badge}</Badge>
                    </div>
                    <div className="text-[11px] font-mono text-[#F97316] uppercase font-semibold mt-3">
                      {cust.category}
                    </div>
                    <h3 className="text-base font-bold text-[#171717] mt-0.5">
                      {cust.title}
                    </h3>
                    <p className="mt-2.5 text-xs text-[#525252] leading-relaxed">
                      {cust.desc}
                    </p>
                  </div>
                  <div className="mt-5 pt-3.5 border-t border-[#E5E5E5] text-[11px] text-[#737373]">
                    <strong className="text-[#171717]">Operational Focus:</strong> {cust.operationalFocus}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. EVERY CUSTOMER, EVERY BOOKING, CLEARLY CONNECTED (RELATIONAL FLOW)      */}
      {/* ========================================================================= */}
      <section className="py-16 md:py-24 border-b border-[#E5E5E5] bg-[#FAFAF9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-14">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#F97316]">
              RELATIONAL ARCHITECTURE
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-[#171717]">
              Every Customer, Every Booking, Clearly Connected.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#525252] leading-relaxed">
              SODAARS builds a direct operational link between who bought the display, which contract governs it, where the physical asset stands, and how the campaign is running.
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <Card className="p-6 sm:p-8 bg-white border-[#E5E5E5] shadow-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {customerRelationshipFlow.map((node) => {
                  const NodeIcon = node.icon;
                  return (
                    <div
                      key={node.title}
                      className="p-4 rounded-lg bg-[#FAFAF9] border border-[#E5E5E5] flex flex-col justify-between text-center hover:border-[#F97316]/50 transition-colors"
                    >
                      <div>
                        <div className="w-8 h-8 rounded-md bg-white border border-[#E5E5E5] text-[#F97316] flex items-center justify-center mx-auto mb-2 shadow-xs">
                          <NodeIcon size={16} />
                        </div>
                        <div className="text-[10px] font-mono text-[#F97316] font-semibold">
                          Step {node.step}
                        </div>
                        <h4 className="text-sm font-bold text-[#171717] mt-0.5">
                          {node.title}
                        </h4>
                        <div className="text-[11px] font-medium text-[#737373] mt-0.5">
                          {node.subtitle}
                        </div>
                        <p className="text-[11px] text-[#525252] leading-relaxed mt-2 text-left">
                          {node.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Architectural Unidirectional Explanation */}
              <div className="mt-6 pt-4 border-t border-[#E5E5E5] text-xs text-[#737373] text-center max-w-3xl mx-auto">
                <strong>Core Conceptual Chain:</strong> Customer → Booking → Advertising Resource → Campaign.
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. DUAL INGESTION CHANNELS (MARKETPLACE & DIRECT CUSTOMERS)               */}
      {/* ========================================================================= */}
      <section className="py-16 md:py-24 border-b border-[#E5E5E5] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-14">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#F97316]">
              RELATIONSHIP ORIGINATION
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-[#171717]">
              Supporting Direct Relationships and Marketplace Inbound Buyers.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#525252] leading-relaxed">
              Whether an advertiser is an existing direct client of the media owner or originates from the public SODAARS Marketplace, customer accounts seamlessly connect into the same operating ledger.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Flow A: Marketplace Flow */}
            <Card className="p-6 bg-[#FAFAF9] border-[#E5E5E5] shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E5]">
                  <div className="flex items-center gap-2">
                    <Globe size={18} className="text-[#F97316]" />
                    <h3 className="text-base font-bold text-[#171717]">
                      Marketplace Discovery Flow
                    </h3>
                  </div>
                  <Badge variant="brand">Inbound Inquiries</Badge>
                </div>

                <div className="mt-4 p-3 rounded-md bg-white border border-[#E5E5E5] text-xs font-mono text-[#171717] text-center font-medium">
                  Advertiser → Marketplace → Booking → Customer Record → Campaign
                </div>

                <p className="mt-4 text-xs text-[#525252] leading-relaxed">
                  When an advertiser discovers a participating static resource in the public Marketplace and submits an inquiry, confirming the booking automatically creates and links the customer record in the provider directory.
                </p>

                <div className="mt-4 space-y-2">
                  <div className="flex items-start gap-2 text-xs text-[#525252]">
                    <Check size={13} className="text-[#F97316] shrink-0 mt-0.5" />
                    <span>Inbound inquiries flow directly to media owner review</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-[#525252]">
                    <Check size={13} className="text-[#F97316] shrink-0 mt-0.5" />
                    <span>Customer details establish verified relationship history upon booking</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-[#525252]">
                    <Check size={13} className="text-[#F97316] shrink-0 mt-0.5" />
                    <span>Future direct interactions connect to the existing client record</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Flow B: Direct Provider Customer Flow */}
            <Card className="p-6 bg-[#FAFAF9] border-[#E5E5E5] shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E5]">
                  <div className="flex items-center gap-2">
                    <Building2 size={18} className="text-[#F97316]" />
                    <h3 className="text-base font-bold text-[#171717]">
                      Direct Provider Customer Flow
                    </h3>
                  </div>
                  <Badge variant="active">Direct Relationships</Badge>
                </div>

                <div className="mt-4 p-3 rounded-md bg-white border border-[#E5E5E5] text-xs font-mono text-[#171717] text-center font-medium">
                  Direct Customer → Provider Booking → Customer Record → Campaign
                </div>

                <p className="mt-4 text-xs text-[#525252] leading-relaxed">
                  Existing direct advertiser accounts, long-term agency relationships, and corporate renewals managed by the media owner are maintained with strict privacy and complete commercial autonomy.
                </p>

                <div className="mt-4 space-y-2">
                  <div className="flex items-start gap-2 text-xs text-[#525252]">
                    <Check size={13} className="text-[#F97316] shrink-0 mt-0.5" />
                    <span>Direct accounts remain confidential to the provider</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-[#525252]">
                    <Check size={13} className="text-[#F97316] shrink-0 mt-0.5" />
                    <span>Full autonomy over direct proposals and client agreements</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-[#525252]">
                    <Check size={13} className="text-[#F97316] shrink-0 mt-0.5" />
                    <span>Tracks lifetime booking histories and active resource allocations</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. KEEP IMPORTANT CUSTOMER INFORMATION ORGANIZED (PROFILE GROUPS)         */}
      {/* ========================================================================= */}
      <section className="py-16 md:py-24 border-b border-[#E5E5E5] bg-[#FAFAF9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#F97316]">
              COMPREHENSIVE ACCOUNT DATA
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-[#171717]">
              Keep Important Customer Information Organized.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#525252] leading-relaxed">
              Store everything needed to manage direct accounts, legal compliance, and mounting logistics without generic enterprise CRM clutter.
            </p>
          </div>

          {/* 4 Profile Pillar Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {profilePillars.map((pillar) => {
              const PillarIcon = pillar.icon;
              return (
                <Card
                  key={pillar.title}
                  className="p-6 bg-white border-[#E5E5E5] flex flex-col justify-between shadow-xs hover:border-[#F97316]/40 transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-2 pb-3 border-b border-[#E5E5E5]">
                      <PillarIcon size={16} className="text-[#F97316]" />
                      <h3 className="text-sm font-bold text-[#171717]">{pillar.title}</h3>
                    </div>
                    <div className="text-[11px] font-medium text-[#737373] mt-2">
                      {pillar.subtitle}
                    </div>
                    <p className="mt-2 text-xs text-[#525252] leading-relaxed">
                      {pillar.desc}
                    </p>

                    <div className="mt-4 pt-3 border-t border-[#E5E5E5] space-y-1.5">
                      <div className="text-[10px] uppercase font-semibold text-[#737373] tracking-wider">
                        Core Attributes
                      </div>
                      {pillar.attributes.map((attr, aIdx) => (
                        <div key={aIdx} className="text-[11px] text-[#171717] flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#F97316]" />
                          <span>{attr}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. CHRONOLOGICAL CUSTOMER ACTIVITY TRACKING                                */}
      {/* ========================================================================= */}
      <section className="py-16 md:py-24 border-b border-[#E5E5E5] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Narrative Column */}
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#F97316]">
                <History size={14} className="text-[#F97316]" />
                CHRONOLOGICAL AUDIT TRAIL
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#171717]">
                Keep a Clear Record of Customer Activity.
              </h2>
              <div className="space-y-3 text-sm text-[#525252] leading-relaxed">
                <p>
                  Maintain an auditable chronological record of every milestone across your customer accounts—from initial proposals and confirmations to campaign launches and term completions.
                </p>
                <div className="p-4 rounded-md bg-[#FAFAF9] border border-[#E5E5E5] space-y-2 text-xs">
                  <div>
                    <strong className="text-[#171717]">Booking Milestones:</strong> Track new booking requests, provider confirmations, and client sign-offs.
                  </div>
                  <div className="pt-2 border-t border-[#E5E5E5]">
                    <strong className="text-[#171717]">Operational Updates:</strong> Connect customer records directly to campaign display periods and completion records.
                  </div>
                </div>
                <p>
                  Centralized activity history keeps media owner sales teams, agency partners, and operational staff aligned on relationship status.
                </p>
              </div>
            </div>

            {/* Visual Activity Stream Card */}
            <div className="lg:col-span-6 space-y-4">
              <Card className="p-6 bg-[#FAFAF9] border-[#E5E5E5] shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E5]">
                  <div className="flex items-center gap-2">
                    <History size={16} className="text-[#F97316]" />
                    <span className="text-xs font-bold text-[#171717] uppercase tracking-wider">
                      Customer Activity Stream · Overview
                    </span>
                  </div>
                  <Badge variant="brand">Audit Trail</Badge>
                </div>

                <div className="mt-4 space-y-3">
                  {recentActivities.map((act, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-lg bg-white border border-[#E5E5E5] flex items-center justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#171717]">
                            {act.company}
                          </span>
                          <span className="text-[10px] text-[#737373] font-medium">
                            ({act.classification})
                          </span>
                        </div>
                        <div className="text-[11px] text-[#525252] mt-0.5">
                          {act.detail}
                        </div>
                      </div>
                      <Badge variant={act.badgeVariant}>{act.time}</Badge>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-3.5 border-t border-[#E5E5E5] text-[11px] text-[#737373] text-center">
                  All customer interactions link directly to the underlying booking and physical media asset.
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. THE SODAARS OPERATING SUITE (CONNECTED ARCHITECTURE)                    */}
      {/* ========================================================================= */}
      <section className="py-16 md:py-24 border-b border-[#E5E5E5] bg-[#FAFAF9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#F97316]">
              UNIFIED ARCHITECTURE
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-[#171717]">
              The SODAARS Operating Suite.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#525252] leading-relaxed">
              Customer CRM is an integrated pillar of the complete SODAARS operational platform for outdoor advertising media owners.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 max-w-5xl mx-auto">
            <Link to="/solutions/resource-management" className="p-3.5 rounded-lg bg-white border border-[#E5E5E5] hover:border-[#F97316] transition-colors text-center">
              <Layers size={18} className="text-[#737373] mx-auto mb-1.5" />
              <div className="text-xs font-bold text-[#171717]">Resource Management</div>
              <div className="text-[10px] text-[#737373] mt-0.5">Hoardings & gantries</div>
            </Link>
            <Link to="/solutions/availability-engine" className="p-3.5 rounded-lg bg-white border border-[#E5E5E5] hover:border-[#F97316] transition-colors text-center">
              <Calendar size={18} className="text-[#737373] mx-auto mb-1.5" />
              <div className="text-xs font-bold text-[#171717]">Availability Engine</div>
              <div className="text-[10px] text-[#737373] mt-0.5">Real-time slot manager</div>
            </Link>
            <Link to="/solutions/booking-pipeline" className="p-3.5 rounded-lg bg-white border border-[#E5E5E5] hover:border-[#F97316] transition-colors text-center">
              <FileText size={18} className="text-[#737373] mx-auto mb-1.5" />
              <div className="text-xs font-bold text-[#171717]">Booking Pipeline</div>
              <div className="text-[10px] text-[#737373] mt-0.5">Direct contracts & renewals</div>
            </Link>
            <div className="p-3.5 rounded-lg bg-orange-50 border-2 border-[#F97316] text-center shadow-xs">
              <Users size={18} className="text-[#F97316] mx-auto mb-1.5" />
              <div className="text-xs font-bold text-[#F97316]">Customer CRM</div>
              <div className="text-[10px] text-[#C2410C] mt-0.5 font-medium">Agencies & buyers</div>
            </div>
            <div className="p-3.5 rounded-lg bg-white border border-[#E5E5E5] text-center opacity-75">
              <Camera size={18} className="text-[#737373] mx-auto mb-1.5" />
              <div className="text-xs font-bold text-[#171717]">Campaign Execution</div>
              <div className="text-[10px] text-[#737373] mt-0.5">Mounting photo proof</div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 10. FUTURE API LAYER                                                      */}
      {/* ========================================================================= */}
      <section className="py-16 md:py-24 border-b border-[#E5E5E5] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto rounded-xl p-8 bg-[#FAFAF9] border border-[#E5E5E5]">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#E5E5E5]">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#F97316]">
                  <Code2 size={14} className="text-[#F97316]" />
                  FUTURE API LAYER
                </div>
                <h2 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-[#171717]">
                  Customer Data Designed for a Connected Future.
                </h2>
              </div>
              <span className="px-3 py-1 rounded-full bg-stone-200 border border-stone-300 text-xs font-semibold text-stone-700">
                PLANNED / FUTURE
              </span>
            </div>

            <p className="mt-6 text-sm text-[#525252] leading-relaxed">
              SODAARS is architected with a future API layer in mind, designed to enable programmatic customer directory queries, account status updates, and synchronization with enterprise resource planning and billing software.
            </p>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#525252]">
              <div className="p-3.5 rounded bg-white border border-[#E5E5E5]">
                <div className="font-bold text-[#171717] mb-1">Standardized Client Account Feeds</div>
                <div>Future programmatic endpoints planned to return customer profile details and active booking linkages.</div>
              </div>
              <div className="p-3.5 rounded bg-white border border-[#E5E5E5]">
                <div className="font-bold text-[#171717] mb-1">Enterprise ERP Synchronization</div>
                <div>Architecture ready to interface with enterprise resource planning systems and internal accounting software.</div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#E5E5E5] text-[11px] text-[#737373]">
              * Note: The API layer is a planned roadmap capability. No live endpoints or third-party CRM integrations are operational in V1.
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 11. CLOSING CTA BANNER                                                    */}
      {/* ========================================================================= */}
      <section className="py-20 md:py-24 bg-[#FAFAF9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-[#171717] text-white p-8 sm:p-12 md:p-16 relative overflow-hidden shadow-xl border border-[#262626]">
            {/* Subtle Saffron Glow */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-[#F97316]/10 blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-3xl">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#F97316]">
                READY TO CONNECT YOUR CLIENT RELATIONSHIPS?
              </span>
              <h2 className="mt-3 text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
                Connect Your Customer Accounts to Physical Media Assets.
              </h2>
              <p className="mt-4 text-sm sm:text-base text-[#A3A3A3] leading-relaxed">
                Manage advertising agencies, direct enterprise buyers, and brand accounts through a CRM engineered for outdoor media operations.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                <Link to="/get-started">
                  <Button size="lg" className="w-full sm:w-auto" rightIcon={<ArrowRight size={16} />}>
                    Get Started →
                  </Button>
                </Link>
                <Link to="/marketplace">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto text-white border-[#404040] hover:bg-[#262626] hover:text-white"
                    rightIcon={<ExternalLink size={14} />}
                  >
                    Explore Marketplace →
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CustomerCRMPage;
