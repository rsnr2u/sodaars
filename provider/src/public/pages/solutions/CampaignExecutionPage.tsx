import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Camera,
  ArrowRight,
  ExternalLink,
  Sparkles,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  Code2,
  Check,
  Sun,
  Eye,
  Maximize2,
  Compass,
} from 'lucide-react';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';

export const CampaignExecutionPage: React.FC = () => {
  const [opFilter, setOpFilter] = useState<'all' | 'active' | 'scheduled' | 'verified' | 'completed'>('all');
  const [selectedOpId, setSelectedOpId] = useState<string>('CMP-MUM-2026-081');

  // The 5 Approved Linear Campaign Execution Stages
  const executionStages = [
    {
      step: '01',
      name: 'CAMPAIGN CREATED',
      title: 'Booking Bound',
      badge: 'Stage 1',
      badgeVariant: 'brand' as const,
      desc: 'Campaign instance is initialized upon booking confirmation, binding contracted display dates, advertiser creative specs, and target resources.',
      focus: 'Establishes the operational master record connecting the approved commercial booking to field execution workflows.',
    },
    {
      step: '02',
      name: 'MOUNT SCHEDULED',
      title: 'Work Order Dispatched',
      badge: 'Stage 2',
      badgeVariant: 'pending' as const,
      desc: 'Field mounting work order is assigned to local installation crews with structural specifications, vinyl dimensions, and site access permissions.',
      focus: 'Coordinates printing coordination, vinyl delivery verification, and structural mounting crew scheduling.',
    },
    {
      step: '03',
      name: 'SPOT & MOUNTING OPS',
      title: 'Field Installation',
      badge: 'Stage 3',
      badgeVariant: 'brand' as const,
      desc: 'Installation team removes existing display flex, tensions new high-gauge static vinyl skin, and verifies structural mounting fasteners.',
      focus: 'Physical on-site execution adhering to municipal safety standards and rigid structural tension requirements.',
    },
    {
      step: '04',
      name: 'PHOTO PROOF CAPTURED',
      title: 'Evidence Recorded',
      badge: 'Stage 4',
      badgeVariant: 'active' as const,
      desc: 'High-resolution daytime approach and illuminated night photos are captured with embedded GPS coordinates, direction, and exact timestamps.',
      focus: 'Creates tamper-resistant proof-of-performance records confirming physical presence and display illumination quality.',
    },
    {
      step: '05',
      name: 'CAMPAIGN COMPLETED',
      title: 'Lifecycle Concluded',
      badge: 'Stage 5',
      badgeVariant: 'inactive' as const,
      desc: 'Display window concludes, removal or renewal work orders are generated, and a verified Proof of Performance (POP) dossier is compiled.',
      focus: 'Closes operational tracking, finalizes historical performance logs, and releases resource slots for subsequent schedules.',
    },
  ];

  // Mock Operational Campaigns for Interactive Table
  const operationalCampaigns = [
    {
      id: 'CMP-MUM-2026-081',
      advertiser: 'Tata Motors Passenger Vehicles',
      agency: 'Ogilvy Media South Asia',
      resourceCode: 'UNIP-MUM-01',
      resourceName: 'Bandra Reclamation Prime Unipole',
      location: 'Western Express Highway, Bandra (W), Mumbai',
      format: 'Unipole (40×20 ft)',
      displayDates: 'Nov 01, 2026 – Nov 30, 2026',
      crew: 'Apex Ops Crew #4',
      status: 'Active Display',
      filterKey: 'active',
      statusVariant: 'active' as const,
      proofStatus: 'Verified (2 Angles)',
      proofVariant: 'brand' as const,
      gpsCoords: '19.0596° N, 72.8295° E',
      timestamp: '2026-10-02 09:42:18 IST',
      supervisor: 'R. Kulkarni (SUP-8812)',
      illumination: 'Front-lit (Operational)',
      sightline: '150m Clear Approach Sightline',
    },
    {
      id: 'CMP-DEL-2026-094',
      advertiser: 'HDFC Bank Ltd.',
      agency: 'GroupM Delhi Central',
      resourceCode: 'GANT-DEL-02',
      resourceName: 'Aerocity Airport Express Gantry',
      location: 'NH-48 Airport Express, New Delhi',
      format: 'Gantry (60×15 ft)',
      displayDates: 'Nov 05, 2026 – Dec 05, 2026',
      crew: 'Capital Mounts Team A',
      status: 'Mounting Scheduled',
      filterKey: 'scheduled',
      statusVariant: 'pending' as const,
      proofStatus: 'Pending Mount',
      proofVariant: 'pending' as const,
      gpsCoords: '28.5562° N, 77.1000° E',
      timestamp: 'Scheduled for Nov 04',
      supervisor: 'A. Mehra (SUP-4401)',
      illumination: 'Back-lit (Inspection Pending)',
      sightline: '300m Bi-directional Highway',
    },
    {
      id: 'CMP-BLR-2026-112',
      advertiser: 'Spotify India Entertainment',
      agency: 'Madison World Bengaluru',
      resourceCode: 'HOARD-BLR-03',
      resourceName: 'Trinity Circle Commercial Billboard',
      location: 'MG Road Junction, Bangalore',
      format: 'Hoarding (30×20 ft)',
      displayDates: 'Oct 15, 2026 – Nov 14, 2026',
      crew: 'Southern Vinyl Techs',
      status: 'Active Display',
      filterKey: 'active',
      statusVariant: 'active' as const,
      proofStatus: 'Verified (3 Angles)',
      proofVariant: 'brand' as const,
      gpsCoords: '12.9716° N, 77.5946° E',
      timestamp: '2026-10-15 14:10:04 IST',
      supervisor: 'V. Swaminathan (SUP-1980)',
      illumination: 'Front-lit (Operational)',
      sightline: '100m High Dwell Intersection',
    },
    {
      id: 'CMP-PUN-2026-073',
      advertiser: 'Titan Eyeplus Regional',
      agency: 'Direct Retail Advertiser',
      resourceCode: 'WALL-PUN-04',
      resourceName: 'Hinjawadi Flyover Bridge Panel',
      location: 'Hinjawadi Phase 1 Overbridge, Pune',
      format: 'Bridge Panel (50×12 ft)',
      displayDates: 'Oct 01, 2026 – Oct 31, 2026',
      crew: 'Deccan Signs Crew #2',
      status: 'Completed',
      filterKey: 'completed',
      statusVariant: 'inactive' as const,
      proofStatus: 'Archived (POP Signed)',
      proofVariant: 'active' as const,
      gpsCoords: '18.5913° N, 73.7389° E',
      timestamp: '2026-10-01 11:25:30 IST',
      supervisor: 'S. Patil (SUP-3392)',
      illumination: 'Front-lit (Inspected)',
      sightline: 'Commuter Artery Approach',
    },
  ];

  const filteredCampaigns = operationalCampaigns.filter(
    (item) => opFilter === 'all' || item.filterKey === opFilter || (opFilter === 'verified' && item.proofStatus.includes('Verified'))
  );

  const selectedOp =
    operationalCampaigns.find((item) => item.id === selectedOpId) || operationalCampaigns[0];

  // The 4 Core Verification Dimensions
  const verificationDimensions = [
    {
      title: 'Daytime Approach Sightline',
      icon: Eye,
      spec: 'Wide-Angle Road Corridor View',
      desc: 'Captures vehicular traffic perspective at 100m–200m approach distance to prove clear line of sight without tree, utility pole, or construction foliage obstruction.',
    },
    {
      title: 'Nighttime Illumination Check',
      icon: Sun,
      spec: 'Peak Evening Lighting Verification',
      desc: 'Documents front-lit or back-lit luminaire uniformity during night traffic hours, ensuring halogen/LED floodlights are fully operational and evenly distributed.',
    },
    {
      title: 'Flex Tension & Alignment',
      icon: Maximize2,
      spec: 'Close-Up Corner Inspection',
      desc: 'Inspects perimeter cable tensioning, corner eyelets, and wrinkle-free stretch to ensure the physical printed vinyl meets enterprise commercial standards.',
    },
    {
      title: 'Tamper-Resistant GPS Metadata',
      icon: Compass,
      spec: 'Cryptographic EXIF Geotagging',
      desc: 'Validates spatial coordinates against the registered Advertising Resource location to prevent reused archival photographs or off-site proof fabrication.',
    },
  ];

  // Operational Chain
  const operationalChain = [
    { step: '1', name: 'Customer', role: 'Commercial Client', desc: 'Advertising Agency or Direct Enterprise Buyer contracting outdoor media.' },
    { step: '2', name: 'Booking', role: 'Committed Contract', desc: 'Legally confirmed reservation committing exact display dates and commercial rates.' },
    { step: '3', name: 'Advertising Resource', role: 'Physical Asset Face', desc: 'The specific hoarding, unipole, or gantry registered in the provider catalog.' },
    { step: '4', name: 'Campaign', role: 'Operational Instance', desc: 'Active display schedule tracking mounting execution, live window, and teardown.' },
    { step: '5', name: 'Photo Proof', role: 'Verified Delivery', desc: 'Timestamped geotagged evidence verifying physical mounting delivery on site.' },
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
              CAMPAIGN EXECUTION
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-[#171717] leading-[1.12]">
              Turn Bookings Into Verified Campaign Execution.
            </h1>

            {/* Subtitle / Core Description */}
            <div className="mt-4 text-lg sm:text-xl font-semibold text-[#F97316]">
              Mounting photo proof &amp; audit trails
            </div>

            {/* Supporting Copy */}
            <p className="mt-4 text-base sm:text-lg text-[#525252] max-w-3xl mx-auto leading-relaxed font-normal">
              Coordinate mounting operations, capture timestamped geotagged photo proof, and maintain complete operational audit trails for every confirmed static outdoor display.
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

            {/* System Pillars Indicator Strip */}
            <div className="mt-12 pt-8 border-t border-[#E5E5E5]/60 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs">
              <span className="px-3 py-1 rounded-full bg-white border border-[#E5E5E5] text-[#171717] font-medium shadow-xs">
                5-Stage Execution Path
              </span>
              <span className="text-[#D4D4D8]">·</span>
              <span className="px-3 py-1 rounded-full bg-white border border-[#E5E5E5] text-[#171717] font-medium shadow-xs">
                Geotagged Photo Proof
              </span>
              <span className="text-[#D4D4D8]">·</span>
              <span className="px-3 py-1 rounded-full bg-white border border-[#E5E5E5] text-[#171717] font-medium shadow-xs">
                Mounting Inspection Audit
              </span>
              <span className="text-[#D4D4D8]">·</span>
              <span className="px-3 py-1 rounded-full bg-white border border-[#E5E5E5] text-[#171717] font-medium shadow-xs">
                Multi-Resource Tracking
              </span>
              <span className="text-[#D4D4D8]">·</span>
              <span className="px-3 py-1 rounded-full bg-white border border-[#E5E5E5] text-[#171717] font-medium shadow-xs">
                Proof of Performance (POP)
              </span>
              <span className="text-[#D4D4D8]">·</span>
              <span className="px-3 py-1 rounded-full bg-white border border-[#E5E5E5] text-[#171717] font-medium shadow-xs">
                Static OOH Only
              </span>
            </div>

            {/* ========================================================================= */}
            {/* HERO MOCKUP: CAMPAIGN EXECUTION LEDGER & GEOTAGGED PHOTO PROOF INSPECTION */}
            {/* ========================================================================= */}
            <div className="mt-14 max-w-6xl mx-auto text-left">
              <Card className="bg-white border-[#E5E5E5] shadow-sm overflow-hidden p-0">
                {/* Mockup Header Toolbar */}
                <div className="p-4 sm:p-5 border-b border-[#E5E5E5] bg-[#FAFAF9] flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#F97316]">
                        Field Operations &amp; Verification Center
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                        Live Tracking
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-[#171717] mt-0.5">
                      Campaign Execution Tracker
                    </h3>
                  </div>

                  {/* Filter Tabs */}
                  <div className="flex flex-wrap items-center gap-1.5 bg-white p-1 rounded-md border border-[#E5E5E5]">
                    {[
                      { key: 'all', label: 'All Operations (4)' },
                      { key: 'active', label: 'Active Displays (2)' },
                      { key: 'scheduled', label: 'Scheduled (1)' },
                      { key: 'completed', label: 'Completed (1)' },
                    ].map((tab) => (
                      <button
                        key={tab.key}
                        onClick={() => setOpFilter(tab.key as any)}
                        className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                          opFilter === tab.key
                            ? 'bg-[#171717] text-white shadow-xs'
                            : 'text-[#525252] hover:text-[#171717] hover:bg-[#F5F5F4]'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Table & Selected Operation Split View */}
                <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#E5E5E5]">
                  {/* Table Column */}
                  <div className="lg:col-span-7 overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-[#FAFAF9]/80 border-b border-[#E5E5E5] text-[11px] font-semibold text-[#737373] uppercase tracking-wider">
                          <th className="py-3 px-4">Campaign &amp; Advertiser</th>
                          <th className="py-3 px-4">Resource &amp; Location</th>
                          <th className="py-3 px-4">Schedule / Crew</th>
                          <th className="py-3 px-4 text-center">Mount Proof</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E5E5E5]">
                        {filteredCampaigns.map((camp) => (
                          <tr
                            key={camp.id}
                            onClick={() => setSelectedOpId(camp.id)}
                            className={`cursor-pointer transition-colors ${
                              selectedOpId === camp.id
                                ? 'bg-orange-50/70 border-l-4 border-l-[#F97316]'
                                : 'hover:bg-[#FAFAF9]'
                            }`}
                          >
                            <td className="py-3 px-4 align-top">
                              <div className="font-mono font-bold text-[#171717]">{camp.id}</div>
                              <div className="text-[11px] font-semibold text-[#F97316] mt-0.5">{camp.advertiser}</div>
                              <div className="text-[10px] text-[#737373] mt-0.5">Agency: {camp.agency}</div>
                            </td>
                            <td className="py-3 px-4 align-top">
                              <div className="text-[11px] font-bold text-[#171717]">{camp.resourceCode}</div>
                              <div className="text-[11px] text-[#525252] line-clamp-1">{camp.resourceName}</div>
                              <div className="text-[10px] text-[#737373] mt-0.5 flex items-center gap-1">
                                <MapPin size={10} className="text-[#F97316] shrink-0" />
                                <span className="line-clamp-1">{camp.location}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 align-top whitespace-nowrap">
                              <div className="font-medium text-[#171717]">{camp.displayDates}</div>
                              <div className="text-[10px] text-[#737373] mt-0.5">
                                Crew: <span className="text-[#171717] font-medium">{camp.crew}</span>
                              </div>
                              <div className="mt-1">
                                <Badge variant={camp.statusVariant} size="sm">
                                  {camp.status}
                                </Badge>
                              </div>
                            </td>
                            <td className="py-3 px-4 align-top text-center whitespace-nowrap">
                              <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded border font-medium ${
                                camp.proofStatus.includes('Verified')
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : camp.proofStatus.includes('Pending')
                                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                                  : 'bg-stone-100 text-stone-700 border-stone-200'
                              }`}>
                                <Camera size={10} />
                                {camp.proofStatus}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Selected Campaign Geotagged Proof Card */}
                  <div className="lg:col-span-5 p-5 bg-[#FAFAF9] flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E5]">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#737373]">
                          Field Photo Proof Record
                        </span>
                        <Badge variant={selectedOp.proofVariant} size="sm">
                          {selectedOp.proofStatus}
                        </Badge>
                      </div>

                      {/* Header Specs */}
                      <div className="mt-3">
                        <div className="text-xs font-mono font-bold text-[#F97316]">{selectedOp.id}</div>
                        <h4 className="text-sm font-bold text-[#171717] mt-0.5">{selectedOp.advertiser}</h4>
                        <p className="text-xs text-[#525252] mt-1 flex items-start gap-1">
                          <MapPin size={12} className="text-[#F97316] shrink-0 mt-0.5" />
                          <span>{selectedOp.location}</span>
                        </p>
                      </div>

                      {/* Simulated Geotagged Billboard Photo Frame */}
                      <div className="mt-4 rounded-lg border border-[#E5E5E5] bg-stone-900 text-white p-3.5 relative overflow-hidden shadow-xs">
                        <div className="flex items-center justify-between text-[10px] text-stone-400 pb-2 border-b border-stone-800">
                          <div className="flex items-center gap-1.5 text-emerald-400 font-mono">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            GPS AUDIT VERIFIED
                          </div>
                          <span className="font-mono">{selectedOp.timestamp}</span>
                        </div>

                        {/* Graphic Billboard Representation */}
                        <div className="py-5 px-3 text-center my-2 rounded bg-gradient-to-br from-stone-800 to-stone-950 border border-stone-800">
                          <div className="text-[10px] uppercase tracking-widest text-[#F97316] font-bold">
                            STATIC VINYL DISPLAY MOUNTED
                          </div>
                          <div className="text-sm font-bold text-white mt-1">
                            {selectedOp.advertiser}
                          </div>
                          <div className="text-[10px] text-stone-400 mt-0.5">
                            {selectedOp.format} · High-Tension Frontlit Flex
                          </div>
                        </div>

                        {/* EXIF Metadata Overlays */}
                        <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-stone-300 pt-2 border-t border-stone-800">
                          <div>
                            <span className="text-stone-500 block">Coordinates</span>
                            {selectedOp.gpsCoords}
                          </div>
                          <div className="text-right">
                            <span className="text-stone-500 block">Supervisor</span>
                            {selectedOp.supervisor}
                          </div>
                        </div>
                      </div>

                      {/* Operational Verification Attributes */}
                      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2.5 rounded bg-white border border-[#E5E5E5]">
                          <span className="text-[10px] text-[#737373] block uppercase font-medium">Illumination</span>
                          <span className="font-semibold text-[#171717] mt-0.5 block">{selectedOp.illumination}</span>
                          <span className="text-[10px] text-emerald-600 flex items-center gap-0.5 mt-0.5">
                            <Check size={10} /> Night Inspection Passed
                          </span>
                        </div>
                        <div className="p-2.5 rounded bg-white border border-[#E5E5E5]">
                          <span className="text-[10px] text-[#737373] block uppercase font-medium">Corridor Sightline</span>
                          <span className="font-semibold text-[#171717] mt-0.5 block">{selectedOp.sightline}</span>
                          <span className="text-[10px] text-[#525252] mt-0.5">Zero Obstruction</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-[#E5E5E5] flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-[#525252]">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span>Proof of Performance (POP) Archived</span>
                      </div>
                      <span className="font-mono text-[11px] text-[#737373]">100% Static OOH</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. 5-STAGE OPERATIONAL EXECUTION LIFECYCLE                                */}
      {/* ========================================================================= */}
      <section className="py-16 md:py-24 border-b border-[#E5E5E5] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#F97316]">
              OPERATIONAL WORKFLOW
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-[#171717]">
              The 5-Stage Execution Path
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#525252] leading-relaxed">
              Every confirmed static booking progresses through a disciplined five-stage execution path, ensuring accountability from initial work order dispatch through on-site mounting and permanent POP archival.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {executionStages.map((stage) => (
              <Card
                key={stage.step}
                className="p-5 bg-[#FAFAF9] border-[#E5E5E5] flex flex-col justify-between hover:border-[#F97316]/50 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs font-bold text-[#F97316] bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                      STAGE {stage.step}
                    </span>
                    <Badge variant={stage.badgeVariant} size="sm">
                      {stage.title}
                    </Badge>
                  </div>
                  <h3 className="text-sm font-bold text-[#171717]">{stage.name}</h3>
                  <p className="mt-2 text-xs text-[#525252] leading-relaxed">{stage.desc}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#E5E5E5] text-[11px] text-[#737373]">
                  <strong className="text-[#171717] block mb-0.5">Operational Focus:</strong>
                  {stage.focus}
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-8 p-4 rounded-lg bg-[#FAFAF9] border border-[#E5E5E5] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#525252]">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-[#F97316] shrink-0" />
              <span>
                <strong>Operational Invariant:</strong> Campaigns exist strictly to manage physical on-site mounting and performance verification. Commercial contract terms and rates remain governed by the Booking Pipeline.
              </span>
            </div>
            <Badge variant="brand" size="sm">Fixed Separation</Badge>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. WHY STATIC OOH REQUIRES PHYSICAL PHOTO PROOF                           */}
      {/* ========================================================================= */}
      <section className="py-16 md:py-24 border-b border-[#E5E5E5] bg-[#FAFAF9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#F97316]">
              VERIFICATION STANDARDS
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-[#171717]">
              Why Static Outdoor Media Demands Verified Physical Evidence
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#525252] leading-relaxed">
              Unlike online impressions, static outdoor advertising relies on physical reality. Media owners must provide undeniable physical evidence to corporate brands and media agencies. SODAARS standardizes four core verification dimensions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {verificationDimensions.map((dim, idx) => {
              const Icon = dim.icon;
              return (
                <Card key={idx} className="p-6 bg-white border-[#E5E5E5] flex flex-col justify-between shadow-xs">
                  <div>
                    <div className="w-10 h-10 rounded-md bg-orange-50 border border-orange-200 flex items-center justify-center text-[#F97316] mb-4">
                      <Icon size={20} />
                    </div>
                    <span className="text-[11px] font-mono font-semibold text-[#F97316] uppercase">
                      {dim.spec}
                    </span>
                    <h3 className="text-base font-bold text-[#171717] mt-1">{dim.title}</h3>
                    <p className="mt-2 text-xs text-[#525252] leading-relaxed">{dim.desc}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[#E5E5E5] flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                    <CheckCircle2 size={13} />
                    <span>POP Compliant</span>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. THE CORE SODAARS OPERATIONAL CHAIN (POST-BOOKING VISIBILITY)           */}
      {/* ========================================================================= */}
      <section className="py-16 md:py-24 border-b border-[#E5E5E5] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#F97316]">
              CONNECTED SYSTEM ARCHITECTURE
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-[#171717]">
              The Core SODAARS Operational Chain
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#525252] leading-relaxed">
              In SODAARS, campaign execution is never an isolated silo. It represents the crucial physical delivery phase completing the relational chain across customer, contract, resource, and audit proof.
            </p>
          </div>

          {/* Stepper Card */}
          <div className="max-w-5xl mx-auto">
            <Card className="bg-[#FAFAF9] border-[#E5E5E5] p-6 sm:p-8">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
                {operationalChain.map((node, idx) => (
                  <div key={node.step} className="bg-white p-4 rounded-lg border border-[#E5E5E5] flex flex-col justify-between shadow-xs">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="w-6 h-6 rounded-full bg-[#171717] text-white text-[11px] font-bold flex items-center justify-center">
                          {node.step}
                        </span>
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-[#F97316]">
                          {node.role}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-[#171717]">{node.name}</h4>
                      <p className="mt-1 text-[11px] text-[#525252] leading-relaxed">{node.desc}</p>
                    </div>
                    {idx < 4 && (
                      <div className="hidden md:block text-right mt-3 text-stone-300">
                        →
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-5 border-t border-[#E5E5E5] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#525252]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                  <span>
                    <strong>End-to-End Traceability:</strong> Every uploaded photo proof record links back to the specific Booking, Advertising Resource, and CRM Client Account.
                  </span>
                </div>
                <Badge variant="active" size="sm">Auditable V1</Badge>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. ENTERPRISE OPERATIONAL BOUNDARIES & INVARIANTS                         */}
      {/* ========================================================================= */}
      <section className="py-16 md:py-24 border-b border-[#E5E5E5] bg-[#FAFAF9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#F97316]">
              SYSTEM INTEGRITY &amp; BOUNDARIES
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-[#171717]">
              SODAARS Operational Principles for Campaign Execution
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#525252] leading-relaxed">
              We uphold clear, realistic operating boundaries. SODAARS V1 focuses strictly on static outdoor media with human supervisor verification, eliminating inflated claims of automated drone AI or digital screen switching.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 bg-white border-[#E5E5E5] shadow-xs">
              <div className="w-9 h-9 rounded bg-orange-50 border border-orange-200 flex items-center justify-center text-[#F97316] font-bold text-xs mb-4">
                01
              </div>
              <h3 className="text-base font-bold text-[#171717]">Strictly Static OOH Focus</h3>
              <p className="mt-2 text-xs text-[#525252] leading-relaxed">
                V1 exclusively manages physical static displays—hoardings, unipoles, gantries, bus shelters, and wall mounts. Digital LED displays and programmatic DOOH are outside V1 scope.
              </p>
              <div className="mt-4 pt-3 border-t border-[#E5E5E5] text-[11px] font-semibold text-[#737373]">
                Physical Vinyl Flex Mounting
              </div>
            </Card>

            <Card className="p-6 bg-white border-[#E5E5E5] shadow-xs">
              <div className="w-9 h-9 rounded bg-orange-50 border border-orange-200 flex items-center justify-center text-[#F97316] font-bold text-xs mb-4">
                02
              </div>
              <h3 className="text-base font-bold text-[#171717]">Human Supervisor Verification</h3>
              <p className="mt-2 text-xs text-[#525252] leading-relaxed">
                No automated or synthetic computer vision claims. Field supervisors inspect vinyl tension, daytime sightline clearance, and nighttime illumination before formal POP sign-off.
              </p>
              <div className="mt-4 pt-3 border-t border-[#E5E5E5] text-[11px] font-semibold text-[#737373]">
                Verified Field Sign-Off
              </div>
            </Card>

            <Card className="p-6 bg-white border-[#E5E5E5] shadow-xs">
              <div className="w-9 h-9 rounded bg-orange-50 border border-orange-200 flex items-center justify-center text-[#F97316] font-bold text-xs mb-4">
                03
              </div>
              <h3 className="text-base font-bold text-[#171717]">Immutable Audit Dossier</h3>
              <p className="mt-2 text-xs text-[#525252] leading-relaxed">
                All uploaded photo proof records, supervisor notes, and timestamps are permanently bound to the campaign record, providing agency-ready Proof of Performance reports.
              </p>
              <div className="mt-4 pt-3 border-t border-[#E5E5E5] text-[11px] font-semibold text-[#737373]">
                Permanent POP Archive
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. SODAARS OPERATING SUITE                                                */}
      {/* ========================================================================= */}
      <section className="py-14 border-b border-[#E5E5E5] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#F97316]">
              THE SODAARS PLATFORM
            </span>
            <h3 className="mt-1 text-xl sm:text-2xl font-bold text-[#171717]">
              Explore the Connected SODAARS Operating Suite
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/solutions/resource-management"
              className="p-4 rounded-lg bg-[#FAFAF9] border border-[#E5E5E5] hover:border-[#F97316] transition-colors group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#171717] group-hover:text-[#F97316]">
                  Resource Management
                </span>
                <ArrowRight size={14} className="text-[#737373] group-hover:text-[#F97316] group-hover:translate-x-0.5 transition-transform" />
              </div>
              <p className="text-xs text-[#525252]">Hoardings, unipoles &amp; gantries with structured attributes.</p>
            </Link>

            <Link
              to="/solutions/availability-engine"
              className="p-4 rounded-lg bg-[#FAFAF9] border border-[#E5E5E5] hover:border-[#F97316] transition-colors group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#171717] group-hover:text-[#F97316]">
                  Availability Engine
                </span>
                <ArrowRight size={14} className="text-[#737373] group-hover:text-[#F97316] group-hover:translate-x-0.5 transition-transform" />
              </div>
              <p className="text-xs text-[#525252]">Real-time slot manager coordinating bookings and holds.</p>
            </Link>

            <Link
              to="/solutions/booking-pipeline"
              className="p-4 rounded-lg bg-[#FAFAF9] border border-[#E5E5E5] hover:border-[#F97316] transition-colors group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#171717] group-hover:text-[#F97316]">
                  Booking Pipeline
                </span>
                <ArrowRight size={14} className="text-[#737373] group-hover:text-[#F97316] group-hover:translate-x-0.5 transition-transform" />
              </div>
              <p className="text-xs text-[#525252]">Direct contracts, renewals, and marketplace inquiries.</p>
            </Link>

            <Link
              to="/solutions/customer-crm"
              className="p-4 rounded-lg bg-[#FAFAF9] border border-[#E5E5E5] hover:border-[#F97316] transition-colors group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#171717] group-hover:text-[#F97316]">
                  Customer CRM
                </span>
                <ArrowRight size={14} className="text-[#737373] group-hover:text-[#F97316] group-hover:translate-x-0.5 transition-transform" />
              </div>
              <p className="text-xs text-[#525252]">Agencies and direct enterprise buyers with full client records.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. FUTURE API CARD                                                        */}
      {/* ========================================================================= */}
      <section className="py-14 border-b border-[#E5E5E5] bg-[#FAFAF9]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-white border-[#E5E5E5] p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E5E5]">
              <div className="flex items-center gap-2">
                <Code2 size={18} className="text-[#F97316]" />
                <h4 className="text-base font-bold text-[#171717]">
                  Future API Layer — Programmatic Campaign Integration
                </h4>
              </div>
              <Badge variant="inactive">Roadmap / Planned</Badge>
            </div>
            <div className="mt-4 space-y-3 text-xs text-[#525252] leading-relaxed">
              <p>
                <strong>Planned Developer Interface:</strong> SODAARS will offer programmatic REST endpoints and webhooks for campaign operational updates, geotagged photo proof ingestion from field mobile applications, and Proof of Performance (POP) syndication into advertiser ERPs.
              </p>
              <p className="text-[11px] text-[#737373] bg-[#FAFAF9] p-3 rounded border border-[#E5E5E5]">
                Note: In the current release, all campaign status transitions, mounting dispatches, and photo proof records are managed natively within the Provider Panel interface.
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. BOTTOM CTA BANNER                                                      */}
      {/* ========================================================================= */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#F97316]">
            READY FOR VERIFIED FIELD EXECUTION?
          </span>
          <h2 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-[#171717]">
            Empower Your Field Operations with Proof-Backed Accuracy
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#525252] max-w-2xl mx-auto leading-relaxed">
            Eliminate operational disputes, coordinate mounting schedules seamlessly, and deliver tamper-resistant Proof of Performance to your advertising clients.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link to="/get-started" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto" rightIcon={<ArrowRight size={16} />}>
                Get Started Today →
              </Button>
            </Link>
            <Link to="/marketplace" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto" rightIcon={<ExternalLink size={14} />}>
                Explore Marketplace →
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CampaignExecutionPage;
