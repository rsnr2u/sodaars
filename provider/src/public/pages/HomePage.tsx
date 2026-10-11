import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Layers,
  Calendar,
  FileText,
  Users,
  Camera,
  Check,
  ChevronDown,
  ChevronUp,
  MapPin,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Info,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

export const HomePage: React.FC = () => {
  // FAQ accordion state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const solutions = [
    {
      id: 'resources',
      title: 'Resource Management',
      subtitle: 'Hoardings, unipoles & gantries',
      description:
        'Master physical inventory ledger for static outdoor media faces. Manage structures, dimensions, illumination types, and geographic location records.',
      icon: Layers,
    },
    {
      id: 'availability',
      title: 'Availability Engine',
      subtitle: 'Real-time slot & hold manager',
      description:
        'Real-time scheduling matrix and calendar view. Manage confirmed reservations, tentative client holds, and operational maintenance blocks without scheduling conflicts.',
      icon: Calendar,
    },
    {
      id: 'bookings',
      title: 'Booking Pipeline',
      subtitle: 'Direct contracts & client renewals',
      description:
        'Unified booking lifecycle for direct client agreements, ongoing contract renewals, and incoming marketplace reservations.',
      icon: FileText,
    },
    {
      id: 'crm',
      title: 'Customer CRM',
      subtitle: 'Agencies and direct enterprise buyers',
      description:
        'Centralized relationship directory for outdoor advertising buyers. Organize agency contacts, direct advertiser accounts, and client relationship records.',
      icon: Users,
    },
    {
      id: 'campaigns',
      title: 'Campaign Execution',
      subtitle: 'Mounting photo proof & audit trails',
      description:
        'Operational campaign tracking from booked resource to mounting and installation. Photo proof uploads associated with campaign execution can be manually reviewed to confirm records.',
      icon: Camera,
      workflow: 'Campaign → Booked Resource → Mounting / Installation → Photo Proof → Execution Record → Completed',
    },
  ];

  const faqs = [
    {
      question: 'How is the Provider subscription quota calculated?',
      answer:
        'The Provider subscription tier is based on TOTAL REGISTERED RESOURCES. Active and inactive resources both count toward your quota. Tier 1 covers 1–50 registered resources (₹4,999/month), and Tier 2 covers 51–100 registered resources (₹8,999/month). Pricing for inventory above 100 resources remains to be determined.',
    },
    {
      question: 'What is the role of the SODAARS Marketplace?',
      answer:
        'The Marketplace is an additional customer discovery and booking channel. Participation is completely voluntary. Providers retain full control over their resource information, pricing, availability, direct customers, and provider operations. SODAARS does not guarantee bookings or revenue.',
    },
    {
      question: 'What types of outdoor media assets are supported in V1?',
      answer:
        'SODAARS V1 is exclusively designed for static physical outdoor media: Hoardings, Billboards, Unipoles, Highway Gantries, Bus Shelters, Foot Over Bridge (FOB) panels, Pole Kiosks, and Wall Wraps. Digital screens and pDOOH are not included.',
    },
    {
      question: 'How does campaign execution and photo proof work?',
      answer:
        'Campaign execution follows an operational lifecycle: Campaign → Booked Resource → Mounting / Installation → Photo Proof → Execution Record → Completed. Photo proof uploads are associated with campaign execution and can be manually reviewed to confirm installation records.',
    },
    {
      question: 'Can providers manage team members and permissions?',
      answer:
        'Yes. Organizations can invite staff members, assign appropriate organizational roles (such as Owner, Manager, or Staff), and collaborate across inventory, scheduling, and customer records.',
    },
  ];

  return (
    <div className="w-full bg-[#FAFAF9] text-[#171717]">
      {/* ========================================================================= */}
      {/* 1. EDITORIAL HERO SECTION                                                  */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 border-b border-[#E5E5E5] bg-gradient-to-b from-white via-white to-[#FAFAF9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            {/* Operational Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-200 bg-orange-50 text-[#F97316] text-xs font-semibold uppercase tracking-wider mb-6">
              <Sparkles size={13} className="text-[#F97316]" />
              Enterprise Platform for Outdoor Media Providers
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-[#171717] leading-[1.12]">
              Enterprise Outdoor Advertising Platform for Media Providers
            </h1>

            {/* Sub-headline */}
            <p className="mt-6 text-base sm:text-lg lg:text-xl text-[#525252] max-w-3xl mx-auto leading-relaxed font-normal">
              An enterprise outdoor advertising platform for providers to manage advertising
              resources, availability, bookings, customers and campaign execution across static physical media.
            </p>

            {/* CTA Group */}
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Link to="/get-started" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto" rightIcon={<ArrowRight size={16} />}>
                  Register Organization
                </Button>
              </Link>
              <Link to="/marketplace" className="w-full sm:w-auto">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto" rightIcon={<ExternalLink size={14} />}>
                  Explore Marketplace Channel
                </Button>
              </Link>
            </div>

            {/* Supporting Micro Indicators */}
            <div className="mt-10 pt-8 border-t border-[#E5E5E5]/60 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-[#737373]">
              <div className="flex items-center gap-2">
                <Check size={14} className="text-[#F97316]" />
                <span>Static media inventory control</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={14} className="text-[#F97316]" />
                <span>Real-time availability scheduling</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={14} className="text-[#F97316]" />
                <span>Voluntary marketplace discovery</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. CORE SOLUTIONS SHOWCASE (5 Core Solutions)                              */}
      {/* ========================================================================= */}
      <section className="py-20 md:py-28 border-b border-[#E5E5E5] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#F97316]">
              End-to-End Workflow Architecture
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-[#171717]">
              The 5 Core Solutions for Media Operations
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#525252] leading-relaxed">
              Every stage of your physical media operations—from asset onboarding to mounting photo proof—is
              connected within one unified, high-density platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {solutions.map((item, idx) => {
              const Icon = item.icon;
              return (
                <Card
                  key={item.id}
                  className={`flex flex-col justify-between hover:border-[#F97316]/40 transition-all ${
                    idx === 4 ? 'md:col-span-2 lg:col-span-2' : ''
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-md bg-orange-50 text-[#F97316] flex items-center justify-center">
                        <Icon size={20} />
                      </div>
                      <span className="text-[11px] font-mono text-[#A3A3A3]">0{idx + 1}</span>
                    </div>

                    <div className="text-[11px] font-semibold uppercase tracking-wider text-[#F97316]">
                      {item.subtitle}
                    </div>
                    <h3 className="text-lg font-bold text-[#171717] mt-1 mb-2">{item.title}</h3>
                    <p className="text-xs text-[#525252] leading-relaxed">{item.description}</p>

                    {item.workflow && (
                      <div className="mt-4 pt-4 border-t border-[#E5E5E5]">
                        <div className="text-[10px] font-semibold uppercase tracking-wider text-[#737373] mb-1.5">
                          Execution Workflow Progression
                        </div>
                        <div className="p-2.5 rounded-md bg-[#FAFAF9] border border-[#E5E5E5] text-[11px] font-mono text-[#262626] leading-relaxed">
                          {item.workflow}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#E5E5E5]">
                    <Link
                      to="/solutions"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#F97316] hover:text-[#EA580C] transition-colors"
                    >
                      Learn more about {item.title}
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. OPERATIONAL PLATFORM PREVIEW                                            */}
      {/* ========================================================================= */}
      <section className="py-20 md:py-28 border-b border-[#E5E5E5] bg-[#FAFAF9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-14">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#F97316]">
              Visual Interface Benchmark
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-[#171717]">
              High-Density Desktop Command Interface
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#525252] leading-relaxed">
              Designed for daily operational execution. Topbar navigation only, zero sidebars, high data
              density, and immediate access to inventory schedules.
            </p>
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-200/70 border border-stone-300 text-[11px] font-medium text-[#525252]">
              <Info size={12} className="text-[#F97316]" />
              <span>Illustrative interface preview — Sample data</span>
            </div>
          </div>

          {/* High-Fidelity Platform UI Mockup Frame */}
          <div className="max-w-5xl mx-auto rounded-xl border border-[#D4D4D8] bg-white shadow-md overflow-hidden">
            {/* Mockup Tier 1: Top Header */}
            <div className="h-11 bg-[#171717] px-4 flex items-center justify-between border-b border-[#262626]">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-xs bg-[#F97316] flex items-center justify-center font-bold text-white text-[10px]">
                    S
                  </div>
                  <span className="text-xs font-bold text-white tracking-tight">SODAARS</span>
                </div>
                <span className="hidden sm:inline text-[10px] text-[#A3A3A3] pl-2 border-l border-[#333333]">
                  Apex Media Networks (Sample Organization)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-6 px-2.5 rounded-sm bg-[#262626] border border-[#333333] text-[10px] text-[#A3A3A3] flex items-center gap-1">
                  <span>Search assets (Ctrl+K)...</span>
                </div>
                <div className="w-5 h-5 rounded-full bg-[#262626] border border-[#404040] flex items-center justify-center text-[10px] text-white">
                  RK
                </div>
              </div>
            </div>

            {/* Mockup Tier 2: Top Navigation */}
            <div className="h-10 bg-white border-b border-[#E5E5E5] px-4 flex items-center gap-4 text-xs overflow-x-auto">
              <span className="text-[#737373] hover:text-[#171717]">Dashboard</span>
              <span className="font-semibold text-[#F97316] border-b-2 border-[#F97316] py-2">
                Advertising Resources
              </span>
              <span className="text-[#737373] hover:text-[#171717]">Availability</span>
              <span className="text-[#737373] hover:text-[#171717]">Bookings</span>
              <span className="text-[#737373] hover:text-[#171717]">Customers</span>
              <span className="text-[#737373] hover:text-[#171717]">Campaigns</span>
              <span className="text-[#737373] hover:text-[#171717]">Reports</span>
              <span className="text-[#737373] hover:text-[#171717]">Organization</span>
            </div>

            {/* Mockup Tier 3: Page Header */}
            <div className="px-6 py-4 bg-white border-b border-[#E5E5E5] flex items-center justify-between">
              <div>
                <div className="text-[11px] text-[#737373]">Home / Operations / Advertising Resources</div>
                <div className="text-base font-bold text-[#171717]">Physical Inventory Ledger</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2.5 py-1 rounded-md border border-[#E5E5E5] text-[#262626] font-medium bg-white">
                  Export CSV
                </span>
                <span className="text-xs px-2.5 py-1 rounded-md bg-[#F97316] text-white font-medium shadow-xs">
                  + Register Resource
                </span>
              </div>
            </div>

            {/* Mockup Tier 4: Content Data Table */}
            <div className="p-6 bg-[#FAFAF9]">
              <div className="bg-white rounded-lg border border-[#E5E5E5] overflow-hidden shadow-xs">
                <div className="px-4 py-3 border-b border-[#E5E5E5] flex flex-wrap items-center justify-between gap-3 text-xs bg-[#FAFAF9]/50">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-[#171717]">Registered Resources (34/50)</span>
                    <Badge variant="brand">Tier 1 Active</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-[#737373]">Quota: 68% utilized</span>
                  </div>
                </div>

                {/* Mobile scroll hint */}
                <div className="block sm:hidden px-4 py-1.5 bg-[#F5F5F4] border-b border-[#E5E5E5] text-[11px] text-[#737373] text-center font-medium">
                  ← Swipe table to inspect columns →
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-[#E5E5E5] bg-[#FAFAF9] text-[11px] font-semibold uppercase text-[#737373]">
                        <th className="px-4 py-2.5">Code / Asset Name</th>
                        <th className="px-4 py-2.5">Format</th>
                        <th className="px-4 py-2.5">Dimensions</th>
                        <th className="px-4 py-2.5">Location</th>
                        <th className="px-4 py-2.5">Status</th>
                        <th className="px-4 py-2.5">Marketplace</th>
                        <th className="px-4 py-2.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E5E5]">
                      <tr className="hover:bg-[#FAFAF9]/60">
                        <td className="px-4 py-3 font-semibold text-[#171717]">
                          HYD-GCH-001
                          <div className="text-[11px] font-normal text-[#737373]">Gachibowli Outer Ring Junction</div>
                        </td>
                        <td className="px-4 py-3 text-[#525252]">Unipole (Front-lit)</td>
                        <td className="px-4 py-3 font-mono text-[#262626]">40 × 20 ft</td>
                        <td className="px-4 py-3 text-[#525252]">
                          <div className="flex items-center gap-1">
                            <MapPin size={11} className="text-[#F97316]" />
                            Hyderabad
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="active">Active</Badge>
                        </td>
                        <td className="px-4 py-3 text-emerald-700 font-medium">Enabled (₹85,000 Net)</td>
                        <td className="px-4 py-3 text-right text-[#F97316] font-medium cursor-pointer">
                          Edit →
                        </td>
                      </tr>
                      <tr className="hover:bg-[#FAFAF9]/60">
                        <td className="px-4 py-3 font-semibold text-[#171717]">
                          HYD-HMD-004
                          <div className="text-[11px] font-normal text-[#737373]">Hitec City Cyber Towers Bridge</div>
                        </td>
                        <td className="px-4 py-3 text-[#525252]">Gantry (Back-lit)</td>
                        <td className="px-4 py-3 font-mono text-[#262626]">60 × 12 ft</td>
                        <td className="px-4 py-3 text-[#525252]">
                          <div className="flex items-center gap-1">
                            <MapPin size={11} className="text-[#F97316]" />
                            Hyderabad
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="active">Active</Badge>
                        </td>
                        <td className="px-4 py-3 text-[#737373]">Paused</td>
                        <td className="px-4 py-3 text-right text-[#F97316] font-medium cursor-pointer">
                          Edit →
                        </td>
                      </tr>
                      <tr className="hover:bg-[#FAFAF9]/60">
                        <td className="px-4 py-3 font-semibold text-[#171717]">
                          BLR-MG-009
                          <div className="text-[11px] font-normal text-[#737373]">MG Road Trinity Circle Face A</div>
                        </td>
                        <td className="px-4 py-3 text-[#525252]">Hoarding (Front-lit)</td>
                        <td className="px-4 py-3 font-mono text-[#262626]">30 × 20 ft</td>
                        <td className="px-4 py-3 text-[#525252]">
                          <div className="flex items-center gap-1">
                            <MapPin size={11} className="text-[#F97316]" />
                            Bengaluru
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="pending">Under Review</Badge>
                        </td>
                        <td className="px-4 py-3 text-[#737373]">Not Listed</td>
                        <td className="px-4 py-3 text-right text-[#F97316] font-medium cursor-pointer">
                          Edit →
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 text-center">
            <span className="text-[11px] text-[#737373]">
              * Illustrative interface preview. Displayed organization name, resource codes, and locations are sample data for visualization purposes only and do not represent real customers or actual SODAARS inventory.
            </span>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. PRICING SNAPSHOT                                                        */}
      {/* ========================================================================= */}
      <section className="py-20 md:py-28 border-b border-[#E5E5E5] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-14">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#F97316]">
              Predictable Commercial Model
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-[#171717]">
              Simple SaaS Tiers Based on Total Inventory
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#525252] leading-relaxed">
              Transparent monthly subscription tiers based on registered physical media asset capacity.
            </p>

            <div className="mt-5 inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-stone-100 border border-stone-200 text-xs text-[#525252]">
              <ShieldCheck size={14} className="text-[#F97316] shrink-0" />
              <span>
                Calculation Rule: Subscription tier is calculated based on <strong>TOTAL REGISTERED RESOURCES</strong> (Active + Inactive combined).
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Tier 1 Card */}
            <Card className="flex flex-col justify-between border-[#E5E5E5] hover:border-[#F97316]/40 transition-all p-6 sm:p-8">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-[#171717]">Tier 1</h3>
                  <Badge variant="brand">1–50 Resources</Badge>
                </div>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-[#171717]">₹4,999</span>
                  <span className="text-xs font-medium text-[#737373]">/ month</span>
                </div>
                <p className="mt-2 text-xs text-[#525252] leading-relaxed">
                  For outdoor advertising operators managing up to 50 total registered resources.
                </p>

                <div className="mt-6 pt-6 border-t border-[#E5E5E5] space-y-3 text-xs text-[#262626]">
                  <div className="flex items-center gap-2.5">
                    <Check size={14} className="text-[#F97316] shrink-0" />
                    <span>Up to 50 total registered resources (Active + Inactive)</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check size={14} className="text-[#F97316] shrink-0" />
                    <span>All 5 Core Solutions included</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check size={14} className="text-[#F97316] shrink-0" />
                    <span>Real-time availability schedule & hold calendar</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check size={14} className="text-[#F97316] shrink-0" />
                    <span>Optional Marketplace discovery channel</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-[#E5E5E5]">
                <Link to="/get-started?tier=1">
                  <Button variant="secondary" className="w-full">
                    Choose Tier 1 Plan
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Tier 2 Card */}
            <Card className="flex flex-col justify-between border-[#F97316]/50 shadow-sm relative bg-white p-6 sm:p-8">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#F97316] text-white text-[10px] font-bold uppercase tracking-wider shadow-xs">
                Recommended for Scale
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-[#171717]">Tier 2</h3>
                  <Badge variant="brand">51–100 Resources</Badge>
                </div>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-[#171717]">₹8,999</span>
                  <span className="text-xs font-medium text-[#737373]">/ month</span>
                </div>
                <p className="mt-2 text-xs text-[#525252] leading-relaxed">
                  For regional outdoor networks operating up to 100 total registered resources.
                </p>

                <div className="mt-6 pt-6 border-t border-[#E5E5E5] space-y-3 text-xs text-[#262626]">
                  <div className="flex items-center gap-2.5">
                    <Check size={14} className="text-[#F97316] shrink-0" />
                    <span>Up to 100 total registered resources (Active + Inactive)</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check size={14} className="text-[#F97316] shrink-0" />
                    <span>All 5 Core Solutions included</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check size={14} className="text-[#F97316] shrink-0" />
                    <span>Multi-staff team role management</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check size={14} className="text-[#F97316] shrink-0" />
                    <span>Campaign execution & photo proof uploads</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-[#E5E5E5]">
                <Link to="/get-started?tier=2">
                  <Button variant="primary" className="w-full">
                    Choose Tier 2 Plan
                  </Button>
                </Link>
              </div>
            </Card>
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/pricing"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#F97316] hover:text-[#EA580C] transition-colors"
            >
              View detailed pricing information
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. FREQUENTLY ASKED QUESTIONS TEASER                                      */}
      {/* ========================================================================= */}
      <section className="py-20 md:py-28 border-b border-[#E5E5E5] bg-[#FAFAF9]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#F97316]">
              Clear Operational Answers
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-[#171717]">
              Frequently Asked Questions
            </h2>
            <p className="mt-3 text-sm text-[#525252]">
              Operational guidelines and answers supported by official SODAARS documentation.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-lg border border-[#E5E5E5] bg-white overflow-hidden shadow-xs transition-colors"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 hover:bg-[#FAFAF9] transition-colors"
                  >
                    <span className="text-sm font-semibold text-[#171717]">{faq.question}</span>
                    <span className="text-[#737373] shrink-0">
                      {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs text-[#525252] leading-relaxed border-t border-[#E5E5E5]/60">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-8 text-center">
            <Link
              to="/resources"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#F97316] hover:text-[#EA580C] transition-colors"
            >
              Explore all industry resources &amp; support documentation
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. CALL TO ACTION BANNER                                                  */}
      {/* ========================================================================= */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-[#E5E5E5] bg-gradient-to-br from-[#FAFAF9] to-white p-8 sm:p-12 lg:p-16 text-center max-w-4xl mx-auto shadow-xs">
            <div className="w-12 h-12 rounded-lg bg-[#171717] text-white flex items-center justify-center font-bold text-xl mx-auto mb-4">
              <span className="text-[#F97316]">S</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#171717]">
              Ready to Upgrade Your Outdoor Media Operations?
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#525252] max-w-2xl mx-auto leading-relaxed">
              Register your organization today to manage your advertising resources, availability
              schedules, booking records, and campaign photo proofs in one platform.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/get-started" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto" rightIcon={<ArrowRight size={16} />}>
                  Register Organization Now
                </Button>
              </Link>
              <Link to="/signin" className="w-full sm:w-auto">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  Sign In to Panel
                </Button>
              </Link>
            </div>

            <p className="mt-5 text-[11px] text-[#737373]">
              Simple monthly subscription tiers • Instant workspace access
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
