import React from 'react';
import { Link } from 'react-router-dom';
import {
  Layers,
  Calendar,
  FileText,
  Users,
  Camera,
  ArrowRight,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  Shield,
  Building2,
  Store,
  Briefcase,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

export const SolutionsPage: React.FC = () => {
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
              SOLUTIONS
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-[#171717] leading-[1.12]">
              Everything You Need to Run Outdoor Advertising.
            </h1>

            {/* Supporting Copy */}
            <p className="mt-6 text-base sm:text-lg lg:text-xl text-[#525252] max-w-3xl mx-auto leading-relaxed font-normal">
              SODAARS connects advertising resources, availability, bookings, customers, and campaign execution in one operating platform for outdoor media providers.
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

            {/* System Interconnection Bar */}
            <div className="mt-12 pt-8 border-t border-[#E5E5E5]/60 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs">
              <span className="px-3 py-1 rounded-full bg-white border border-[#E5E5E5] text-[#171717] font-medium shadow-xs">
                01 Resource Management
              </span>
              <span className="text-[#D4D4D8]">·</span>
              <span className="px-3 py-1 rounded-full bg-white border border-[#E5E5E5] text-[#171717] font-medium shadow-xs">
                02 Availability Engine
              </span>
              <span className="text-[#D4D4D8]">·</span>
              <span className="px-3 py-1 rounded-full bg-white border border-[#E5E5E5] text-[#171717] font-medium shadow-xs">
                03 Booking Pipeline
              </span>
              <span className="text-[#D4D4D8]">·</span>
              <span className="px-3 py-1 rounded-full bg-white border border-[#E5E5E5] text-[#171717] font-medium shadow-xs">
                04 Customer CRM
              </span>
              <span className="text-[#D4D4D8]">·</span>
              <span className="px-3 py-1 rounded-full bg-white border border-[#E5E5E5] text-[#171717] font-medium shadow-xs">
                05 Campaign Execution
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. FIVE SOLUTIONS (01 to 05)                                               */}
      {/* ========================================================================= */}
      <div className="divide-y divide-[#E5E5E5]">
        {/* ----------------------------------------------------------------------- */}
        {/* 01 — RESOURCE MANAGEMENT                                                */}
        {/* ----------------------------------------------------------------------- */}
        <section id="resource-management" className="py-16 md:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              {/* Left Column: Narrative */}
              <div className="lg:col-span-5 space-y-4">
                <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#F97316]">
                  <Layers size={14} className="text-[#F97316]" />
                  01 / RESOURCE MANAGEMENT
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#171717]">
                  Manage Every Advertising Resource.
                </h2>
                <div className="text-sm font-semibold text-[#F97316]">
                  Hoardings, unipoles & gantries
                </div>
                <p className="text-sm sm:text-base text-[#525252] leading-relaxed">
                  Maintain a structured inventory of outdoor advertising resources with resource details, locations, dimensions, orientation, pricing, media, marketplace participation, and status.
                </p>
                <div className="pt-2">
                  <Link
                    to="/solutions/resource-management"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#F97316] hover:text-[#EA580C] transition-colors"
                  >
                    Learn more →
                  </Link>
                </div>
              </div>

              {/* Right Column: Visual Schema Representation */}
              <div className="lg:col-span-7">
                <Card className="bg-[#FAFAF9] border-[#E5E5E5] p-6 shadow-xs">
                  <div className="flex items-center justify-between pb-4 border-b border-[#E5E5E5]">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#F97316]" />
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#737373]">
                        Structured Asset Record
                      </span>
                    </div>
                    <Badge variant="active">Active</Badge>
                  </div>

                  <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-3.5 rounded-md bg-white border border-[#E5E5E5]">
                      <div className="text-[11px] font-medium text-[#737373] uppercase tracking-wider">
                        Location
                      </div>
                      <div className="mt-1 text-xs font-semibold text-[#171717]">
                        Western Express Highway, Andheri East
                      </div>
                      <div className="text-[11px] text-[#737373]">Mumbai, Maharashtra</div>
                    </div>

                    <div className="p-3.5 rounded-md bg-white border border-[#E5E5E5]">
                      <div className="text-[11px] font-medium text-[#737373] uppercase tracking-wider">
                        Resource
                      </div>
                      <div className="mt-1 text-xs font-semibold text-[#171717]">
                        WEH-AND-001 (South Face)
                      </div>
                      <div className="text-[11px] text-[#737373]">Direction: South-Facing Traffic</div>
                    </div>

                    <div className="p-3.5 rounded-md bg-white border border-[#E5E5E5]">
                      <div className="text-[11px] font-medium text-[#737373] uppercase tracking-wider">
                        Type & Dimensions
                      </div>
                      <div className="mt-1 text-xs font-semibold text-[#171717]">
                        Unipole (Front-lit)
                      </div>
                      <div className="text-[11px] font-mono text-[#525252]">40 × 20 ft (800 sq ft)</div>
                    </div>

                    <div className="p-3.5 rounded-md bg-white border border-[#E5E5E5]">
                      <div className="text-[11px] font-medium text-[#737373] uppercase tracking-wider">
                        Pricing & Marketplace
                      </div>
                      <div className="mt-1 text-xs font-semibold text-[#171717]">
                        Card Rate: ₹1,20,000 / mo
                      </div>
                      <div className="text-[11px] text-emerald-700 font-medium">
                        Marketplace Participation: Enabled
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3.5 border-t border-[#E5E5E5] flex flex-wrap items-center justify-between text-[11px] text-[#737373]">
                    <span>Attribute Ledger: Dimensions · Orientation · Illumination · Status</span>
                    <span className="font-medium text-[#171717]">Static Media Specification</span>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* ----------------------------------------------------------------------- */}
        {/* 02 — AVAILABILITY ENGINE                                                */}
        {/* ----------------------------------------------------------------------- */}
        <section id="availability-engine" className="py-16 md:py-24 bg-[#FAFAF9]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              {/* Left Column (Desktop Order 2 on large screens for alternating rhythm) */}
              <div className="lg:col-span-7 order-2 lg:order-1">
                <Card className="bg-white border-[#E5E5E5] p-6 shadow-xs">
                  <div className="flex items-center justify-between pb-4 border-b border-[#E5E5E5]">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#737373]">
                      Horizontal Slot Scheduling Matrix
                    </span>
                    <span className="text-xs font-mono text-[#737373]">October 2026</span>
                  </div>

                  {/* Visual Calendar Slot Schedule */}
                  <div className="mt-5 space-y-3">
                    {/* Row 1: Unipole WEH-AND-001 */}
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="font-semibold text-[#171717]">WEH-AND-001</span>
                        <span className="text-[11px] text-[#737373]">Unipole 40×20</span>
                      </div>
                      <div className="grid grid-cols-6 gap-1 h-7 text-[10px] font-medium text-center">
                        <div className="bg-stone-900 text-white rounded flex items-center justify-center col-span-2">
                          Booked (Oct 1–10)
                        </div>
                        <div className="bg-amber-100 text-amber-800 border border-amber-300 rounded flex items-center justify-center col-span-1">
                          Hold
                        </div>
                        <div className="bg-emerald-50 text-emerald-700 border border-emerald-200 rounded flex items-center justify-center col-span-2">
                          Available
                        </div>
                        <div className="bg-stone-200 text-stone-700 rounded flex items-center justify-center col-span-1">
                          Maintenance
                        </div>
                      </div>
                    </div>

                    {/* Row 2: Gantry BLR-MG-002 */}
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="font-semibold text-[#171717]">BLR-MG-002</span>
                        <span className="text-[11px] text-[#737373]">Gantry 60×12</span>
                      </div>
                      <div className="grid grid-cols-6 gap-1 h-7 text-[10px] font-medium text-center">
                        <div className="bg-orange-100 text-orange-800 border border-orange-300 rounded flex items-center justify-center col-span-1">
                          Provider Block
                        </div>
                        <div className="bg-emerald-50 text-emerald-700 border border-emerald-200 rounded flex items-center justify-center col-span-3">
                          Available (Oct 6–20)
                        </div>
                        <div className="bg-stone-700 text-white rounded flex items-center justify-center col-span-1">
                          Admin Block
                        </div>
                        <div className="bg-stone-900 text-white rounded flex items-center justify-center col-span-1">
                          Booked
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Slot States Legend */}
                  <div className="mt-6 pt-4 border-t border-[#E5E5E5] flex flex-wrap items-center gap-3 sm:gap-4 text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-xs bg-emerald-500" />
                      <span className="text-[#525252]">Available</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-xs bg-stone-900" />
                      <span className="text-[#525252]">Booked</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-xs bg-amber-400" />
                      <span className="text-[#525252]">Hold</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-xs bg-[#F97316]" />
                      <span className="text-[#525252]">Provider Block</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-xs bg-stone-700" />
                      <span className="text-[#525252]">Admin Block</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-xs bg-stone-400" />
                      <span className="text-[#525252]">Maintenance</span>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Right Column: Narrative */}
              <div className="lg:col-span-5 space-y-4 order-1 lg:order-2">
                <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#F97316]">
                  <Calendar size={14} className="text-[#F97316]" />
                  02 / AVAILABILITY ENGINE
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#171717]">
                  Know What’s Available. Control Every Slot.
                </h2>
                <div className="text-sm font-semibold text-[#F97316]">
                  Real-time slot & hold manager
                </div>
                <p className="text-sm sm:text-base text-[#525252] leading-relaxed">
                  Manage resource availability across dates, holds, bookings, provider blocks, admin blocks, and maintenance while keeping marketplace availability connected to the underlying resource.
                </p>
                <div className="pt-2">
                  <Link
                    to="/solutions/availability-engine"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#F97316] hover:text-[#EA580C] transition-colors"
                  >
                    Learn more →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ----------------------------------------------------------------------- */}
        {/* 03 — BOOKING PIPELINE                                                   */}
        {/* ----------------------------------------------------------------------- */}
        <section id="booking-pipeline" className="py-16 md:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              {/* Left Column: Narrative */}
              <div className="lg:col-span-5 space-y-4">
                <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#F97316]">
                  <FileText size={14} className="text-[#F97316]" />
                  03 / BOOKING PIPELINE
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#171717]">
                  Keep Every Booking Moving.
                </h2>
                <div className="text-sm font-semibold text-[#F97316]">
                  Direct contracts & client renewals
                </div>
                <p className="text-sm sm:text-base text-[#525252] leading-relaxed">
                  Bring marketplace requests, admin-created bookings, and direct provider bookings into one structured booking workflow from review through confirmation and completion.
                </p>
                <div className="pt-2">
                  <Link
                    to="/solutions/booking-pipeline"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#F97316] hover:text-[#EA580C] transition-colors"
                  >
                    Learn more →
                  </Link>
                </div>
              </div>

              {/* Right Column: Visual Lifecycle Progression */}
              <div className="lg:col-span-7">
                <Card className="bg-[#FAFAF9] border-[#E5E5E5] p-6 shadow-xs">
                  <div className="flex items-center justify-between pb-4 border-b border-[#E5E5E5]">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#737373]">
                      Structured Booking Lifecycle
                    </span>
                    <span className="text-xs text-[#525252]">Multi-Source Ingestion</span>
                  </div>

                  {/* Sequential Process Chain */}
                  <div className="mt-5 space-y-2.5">
                    <div className="text-[11px] font-semibold text-[#737373] uppercase tracking-wider mb-2">
                      Standard Workflow Progression
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <div className="p-2.5 rounded bg-white border border-[#E5E5E5] text-center">
                        <div className="text-[10px] text-[#737373] font-mono">01</div>
                        <div className="text-xs font-bold text-[#171717] mt-0.5">NEW</div>
                      </div>
                      <div className="p-2.5 rounded bg-white border border-[#E5E5E5] text-center">
                        <div className="text-[10px] text-[#737373] font-mono">02</div>
                        <div className="text-xs font-bold text-[#171717] mt-0.5">UNDER REVIEW</div>
                      </div>
                      <div className="p-2.5 rounded bg-white border border-[#E5E5E5] text-center">
                        <div className="text-[10px] text-[#737373] font-mono">03</div>
                        <div className="text-xs font-bold text-[#171717] mt-0.5">PROVIDER CONF.</div>
                      </div>
                      <div className="p-2.5 rounded bg-white border border-[#E5E5E5] text-center">
                        <div className="text-[10px] text-[#737373] font-mono">04</div>
                        <div className="text-xs font-bold text-[#171717] mt-0.5">CUSTOMER CONF.</div>
                      </div>
                      <div className="p-2.5 rounded bg-white border border-[#E5E5E5] text-center">
                        <div className="text-[10px] text-[#737373] font-mono">05</div>
                        <div className="text-xs font-bold text-[#171717] mt-0.5">PAYMENT</div>
                      </div>
                      <div className="p-2.5 rounded bg-orange-50 border border-orange-200 text-center">
                        <div className="text-[10px] text-[#F97316] font-mono">06</div>
                        <div className="text-xs font-bold text-[#F97316] mt-0.5">CONFIRMED</div>
                      </div>
                      <div className="p-2.5 rounded bg-white border border-[#E5E5E5] text-center">
                        <div className="text-[10px] text-[#737373] font-mono">07</div>
                        <div className="text-xs font-bold text-[#171717] mt-0.5">ACTIVE</div>
                      </div>
                      <div className="p-2.5 rounded bg-white border border-[#E5E5E5] text-center">
                        <div className="text-[10px] text-[#737373] font-mono">08</div>
                        <div className="text-xs font-bold text-[#171717] mt-0.5">COMPLETED</div>
                      </div>
                    </div>
                  </div>

                  {/* Exception States */}
                  <div className="mt-5 pt-4 border-t border-[#E5E5E5]">
                    <div className="text-[11px] font-semibold text-[#737373] uppercase tracking-wider mb-2">
                      Handled Exception States
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-1 rounded bg-stone-100 text-stone-700 text-xs font-mono">
                        CANCELLED
                      </span>
                      <span className="px-2.5 py-1 rounded bg-stone-100 text-stone-700 text-xs font-mono">
                        DECLINED
                      </span>
                      <span className="px-2.5 py-1 rounded bg-stone-100 text-stone-700 text-xs font-mono">
                        EXPIRED
                      </span>
                      <span className="px-2.5 py-1 rounded bg-stone-100 text-stone-700 text-xs font-mono">
                        REFUNDED
                      </span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* ----------------------------------------------------------------------- */}
        {/* 04 — CUSTOMER CRM                                                       */}
        {/* ----------------------------------------------------------------------- */}
        <section id="customer-crm" className="py-16 md:py-24 bg-[#FAFAF9]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              {/* Left Column (Visual on desktop order 1) */}
              <div className="lg:col-span-7 order-2 lg:order-1">
                <Card className="bg-white border-[#E5E5E5] p-6 shadow-xs">
                  <div className="flex items-center justify-between pb-4 border-b border-[#E5E5E5]">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#737373]">
                      Connected Relationship Graph
                    </span>
                    <span className="text-xs text-[#525252]">Directory Entities</span>
                  </div>

                  {/* Relationship Flow Schema */}
                  <div className="mt-5 grid grid-cols-1 sm:grid-cols-4 gap-3 text-center">
                    <div className="p-3 rounded-md bg-[#FAFAF9] border border-[#E5E5E5]">
                      <Users size={16} className="text-[#F97316] mx-auto mb-1" />
                      <div className="text-xs font-bold text-[#171717]">Customer</div>
                      <div className="text-[10px] text-[#737373]">Agency / Buyer</div>
                    </div>
                    <div className="p-3 rounded-md bg-[#FAFAF9] border border-[#E5E5E5]">
                      <FileText size={16} className="text-[#F97316] mx-auto mb-1" />
                      <div className="text-xs font-bold text-[#171717]">Booking</div>
                      <div className="text-[10px] text-[#737373]">Contract Terms</div>
                    </div>
                    <div className="p-3 rounded-md bg-[#FAFAF9] border border-[#E5E5E5]">
                      <Layers size={16} className="text-[#F97316] mx-auto mb-1" />
                      <div className="text-xs font-bold text-[#171717]">Resource</div>
                      <div className="text-[10px] text-[#737373]">Physical Asset</div>
                    </div>
                    <div className="p-3 rounded-md bg-[#FAFAF9] border border-[#E5E5E5]">
                      <Camera size={16} className="text-[#F97316] mx-auto mb-1" />
                      <div className="text-xs font-bold text-[#171717]">Campaign</div>
                      <div className="text-[10px] text-[#737373]">Execution Proof</div>
                    </div>
                  </div>

                  {/* Supported Customer Types */}
                  <div className="mt-6 pt-4 border-t border-[#E5E5E5]">
                    <div className="text-[11px] font-semibold text-[#737373] uppercase tracking-wider mb-2.5">
                      Supported Customer Profiles
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-2 p-2 rounded bg-[#FAFAF9] border border-[#E5E5E5]/60">
                        <Briefcase size={14} className="text-[#F97316] shrink-0" />
                        <span className="font-medium text-[#171717]">Advertising Agencies</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 rounded bg-[#FAFAF9] border border-[#E5E5E5]/60">
                        <Building2 size={14} className="text-[#F97316] shrink-0" />
                        <span className="font-medium text-[#171717]">Direct Enterprise Buyers</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 rounded bg-[#FAFAF9] border border-[#E5E5E5]/60">
                        <Store size={14} className="text-[#F97316] shrink-0" />
                        <span className="font-medium text-[#171717]">Local Businesses</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 rounded bg-[#FAFAF9] border border-[#E5E5E5]/60">
                        <Shield size={14} className="text-[#F97316] shrink-0" />
                        <span className="font-medium text-[#171717]">Brands / Corporate Clients</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Right Column: Narrative */}
              <div className="lg:col-span-5 space-y-4 order-1 lg:order-2">
                <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#F97316]">
                  <Users size={14} className="text-[#F97316]" />
                  04 / CUSTOMER CRM
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#171717]">
                  Keep Every Customer Relationship Connected.
                </h2>
                <div className="text-sm font-semibold text-[#F97316]">
                  Agencies and direct enterprise buyers
                </div>
                <p className="text-sm sm:text-base text-[#525252] leading-relaxed">
                  Keep customer records connected to bookings, advertising resources, campaigns, and activity history across marketplace and direct provider relationships.
                </p>
                <div className="pt-2">
                  <Link
                    to="/solutions/customer-crm"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#F97316] hover:text-[#EA580C] transition-colors"
                  >
                    Learn more →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ----------------------------------------------------------------------- */}
        {/* 05 — CAMPAIGN EXECUTION                                                 */}
        {/* ----------------------------------------------------------------------- */}
        <section id="campaign-execution" className="py-16 md:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              {/* Left Column: Narrative */}
              <div className="lg:col-span-5 space-y-4">
                <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#F97316]">
                  <Camera size={14} className="text-[#F97316]" />
                  05 / CAMPAIGN EXECUTION
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#171717]">
                  Turn Bookings Into Verified Campaign Execution.
                </h2>
                <div className="text-sm font-semibold text-[#F97316]">
                  Mounting photo proof & audit trails
                </div>
                <p className="text-sm sm:text-base text-[#525252] leading-relaxed">
                  Connect campaigns to booked resources and record mounting or installation progress, execution records, notes, and photo proof.
                </p>
                <div className="pt-2">
                  <Link
                    to="/solutions/campaign-execution"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#F97316] hover:text-[#EA580C] transition-colors"
                  >
                    Learn more →
                  </Link>
                </div>
              </div>

              {/* Right Column: Execution Progression Schema */}
              <div className="lg:col-span-7">
                <Card className="bg-[#FAFAF9] border-[#E5E5E5] p-6 shadow-xs">
                  <div className="flex items-center justify-between pb-4 border-b border-[#E5E5E5]">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#737373]">
                      Operational Execution Sequence
                    </span>
                    <span className="text-xs text-[#525252]">Manual Review Audit Trail</span>
                  </div>

                  {/* Flow Stages */}
                  <div className="mt-5 space-y-3">
                    <div className="text-[11px] font-semibold text-[#737373] uppercase tracking-wider">
                      Execution Progression Chain
                    </div>
                    <div className="p-3 rounded-md bg-white border border-[#E5E5E5] font-mono text-[11px] text-[#262626] leading-relaxed">
                      Campaign → Booked Resource → Mounting / Installation → Photo Proof → Execution Record → Completed
                    </div>
                  </div>

                  {/* Execution Status States */}
                  <div className="mt-5 pt-4 border-t border-[#E5E5E5]">
                    <div className="text-[11px] font-semibold text-[#737373] uppercase tracking-wider mb-2.5">
                      Execution Statuses
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                      <div className="p-2.5 rounded bg-white border border-[#E5E5E5]">
                        <div className="text-[10px] text-[#737373] font-mono">STATUS 01</div>
                        <div className="font-semibold text-[#171717] mt-0.5">Planned</div>
                      </div>
                      <div className="p-2.5 rounded bg-white border border-[#E5E5E5]">
                        <div className="text-[10px] text-[#737373] font-mono">STATUS 02</div>
                        <div className="font-semibold text-amber-700 mt-0.5">In Execution</div>
                      </div>
                      <div className="p-2.5 rounded bg-white border border-[#E5E5E5]">
                        <div className="text-[10px] text-[#737373] font-mono">STATUS 03</div>
                        <div className="font-semibold text-[#F97316] mt-0.5">Proof Submitted</div>
                      </div>
                      <div className="p-2.5 rounded bg-white border border-[#E5E5E5]">
                        <div className="text-[10px] text-[#737373] font-mono">STATUS 04</div>
                        <div className="font-semibold text-emerald-700 mt-0.5">Completed</div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ========================================================================= */}
      {/* 3. HOW THE SOLUTIONS CONNECT                                              */}
      {/* ========================================================================= */}
      <section className="py-20 md:py-28 border-b border-[#E5E5E5] bg-[#FAFAF9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-14">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#F97316]">
              ONE CONNECTED PLATFORM
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-[#171717]">
              From Advertising Resource to Campaign Execution.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#525252] leading-relaxed">
              SODAARS connects the operational lifecycle of outdoor advertising so providers can manage resources, availability, bookings, customers, and campaign execution within one platform.
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            {/* Primary Unified Flow */}
            <Card className="bg-white border-[#E5E5E5] p-6 sm:p-8 shadow-xs">
              <div className="text-xs font-semibold uppercase tracking-wider text-[#737373] mb-4">
                Core Operating Flow
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center">
                <div className="p-3 rounded-md bg-[#FAFAF9] border border-[#E5E5E5]">
                  <Layers size={16} className="text-[#F97316] mx-auto mb-1" />
                  <div className="text-xs font-bold text-[#171717]">Resource</div>
                  <div className="text-[10px] text-[#737373]">Physical Asset</div>
                </div>
                <div className="p-3 rounded-md bg-[#FAFAF9] border border-[#E5E5E5]">
                  <Calendar size={16} className="text-[#F97316] mx-auto mb-1" />
                  <div className="text-xs font-bold text-[#171717]">Availability</div>
                  <div className="text-[10px] text-[#737373]">Date Schedules</div>
                </div>
                <div className="p-3 rounded-md bg-[#FAFAF9] border border-[#E5E5E5]">
                  <FileText size={16} className="text-[#F97316] mx-auto mb-1" />
                  <div className="text-xs font-bold text-[#171717]">Booking</div>
                  <div className="text-[10px] text-[#737373]">Agreed Terms</div>
                </div>
                <div className="p-3 rounded-md bg-[#FAFAF9] border border-[#E5E5E5]">
                  <Users size={16} className="text-[#F97316] mx-auto mb-1" />
                  <div className="text-xs font-bold text-[#171717]">Customer</div>
                  <div className="text-[10px] text-[#737373]">Account Profile</div>
                </div>
                <div className="p-3 rounded-md bg-[#FAFAF9] border border-[#E5E5E5]">
                  <Camera size={16} className="text-[#F97316] mx-auto mb-1" />
                  <div className="text-xs font-bold text-[#171717]">Campaign</div>
                  <div className="text-[10px] text-[#737373]">Mounting Work</div>
                </div>
                <div className="p-3 rounded-md bg-orange-50 border border-orange-200">
                  <CheckCircle2 size={16} className="text-[#F97316] mx-auto mb-1" />
                  <div className="text-xs font-bold text-[#F97316]">Execution</div>
                  <div className="text-[10px] text-[#F97316]">Proof Confirmed</div>
                </div>
              </div>

              {/* Secondary Representation: Marketplace Channel */}
              <div className="mt-8 pt-6 border-t border-[#E5E5E5]">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <div className="text-xs font-semibold text-[#171717]">
                      Marketplace Discovery Channel Integration
                    </div>
                    <div className="text-xs text-[#525252] mt-0.5">
                      Marketplace serves as an additional booking channel without altering direct provider operations.
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono bg-[#FAFAF9] px-3 py-1.5 rounded border border-[#E5E5E5]">
                    <span className="font-semibold text-[#171717]">Marketplace</span>
                    <span className="text-[#737373]">→</span>
                    <span className="font-semibold text-[#171717]">Booking</span>
                    <span className="text-[#737373]">→</span>
                    <span className="font-semibold text-[#F97316]">Provider Operations</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. PLATFORM WORKFLOW                                                      */}
      {/* ========================================================================= */}
      <section className="py-20 md:py-28 border-b border-[#E5E5E5] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#F97316]">
              OPERATIONAL PROGRESSION
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-[#171717]">
              End-to-End Platform Workflow
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#525252] leading-relaxed">
              Marketplace provides an additional discovery and booking channel while providers continue managing their existing direct customers and operations.
            </p>
          </div>

          {/* Workflow Sequence Badges */}
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-center text-xs">
              <div className="p-3 rounded-lg bg-[#FAFAF9] border border-[#E5E5E5]">
                <div className="text-[10px] font-mono text-[#737373]">STEP 01</div>
                <div className="font-bold text-[#171717] mt-1">DISCOVER</div>
              </div>
              <div className="p-3 rounded-lg bg-[#FAFAF9] border border-[#E5E5E5]">
                <div className="text-[10px] font-mono text-[#737373]">STEP 02</div>
                <div className="font-bold text-[#171717] mt-1">REVIEW</div>
              </div>
              <div className="p-3 rounded-lg bg-[#FAFAF9] border border-[#E5E5E5]">
                <div className="text-[10px] font-mono text-[#737373]">STEP 03</div>
                <div className="font-bold text-[#171717] mt-1">SELECT</div>
              </div>
              <div className="p-3 rounded-lg bg-[#FAFAF9] border border-[#E5E5E5]">
                <div className="text-[10px] font-mono text-[#737373]">STEP 04</div>
                <div className="font-bold text-[#171717] mt-1">BOOK</div>
              </div>
              <div className="p-3 rounded-lg bg-orange-50 border border-orange-200">
                <div className="text-[10px] font-mono text-[#F97316]">STEP 05</div>
                <div className="font-bold text-[#F97316] mt-1">PROVIDER CONF.</div>
              </div>
              <div className="p-3 rounded-lg bg-[#FAFAF9] border border-[#E5E5E5]">
                <div className="text-[10px] font-mono text-[#737373]">STEP 06</div>
                <div className="font-bold text-[#171717] mt-1">CAMPAIGN</div>
              </div>
              <div className="p-3 rounded-lg bg-[#FAFAF9] border border-[#E5E5E5]">
                <div className="text-[10px] font-mono text-[#737373]">STEP 07</div>
                <div className="font-bold text-[#171717] mt-1">EXECUTION</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. CLOSING CTA BANNER                                                     */}
      {/* ========================================================================= */}
      <section className="py-20 md:py-24 bg-[#FAFAF9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-[#171717] text-white p-8 sm:p-12 md:p-16 relative overflow-hidden shadow-xl border border-[#262626]">
            {/* Subtle Warm Glow Behind CTA */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-[#F97316]/10 blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-3xl">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#F97316]">
                READY TO BUILD A CONNECTED OOH OPERATION?
              </span>
              <h2 className="mt-3 text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
                Bring Your Outdoor Advertising Operations Together.
              </h2>
              <p className="mt-4 text-sm sm:text-base text-[#A3A3A3] leading-relaxed">
                Manage resources, availability, bookings, customers, and campaign execution from one connected platform.
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

export default SolutionsPage;
