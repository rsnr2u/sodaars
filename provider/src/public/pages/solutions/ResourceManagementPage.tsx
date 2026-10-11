import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Layers,
  ArrowRight,
  ExternalLink,
  Sparkles,
  MapPin,
  Maximize2,
  Compass,
  Sun,
  Eye,
  Tag,
  DollarSign,
  ToggleRight,
  ToggleLeft,
  CheckCircle2,
  Calendar,
  FileText,
  Camera,
  Code2,
  Shield,
  Building,
  Image,
} from 'lucide-react';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';

export const ResourceManagementPage: React.FC = () => {
  const [resourceFilter, setResourceFilter] = useState<'all' | 'unipole' | 'gantry' | 'hoarding' | 'bridge'>('all');
  const [selectedAssetId, setSelectedAssetId] = useState<string>('RES-MUM-01');

  const mockResources = [
    {
      id: 'RES-MUM-01',
      name: 'Bandra Reclamation Prime Unipole',
      type: 'Unipole',
      typeKey: 'unipole',
      location: 'Western Express Highway, Bandra (W), Mumbai',
      dimensions: '40 × 20 ft',
      sqft: '800 sq ft',
      illumination: 'Front-lit',
      orientation: 'South-Facing',
      customerPrice: '₹1,85,000',
      sodaarsPrice: '₹1,65,000',
      marketplace: true,
      status: 'Available',
      statusVariant: 'active' as const,
      facing: 'Heavy outbound traffic toward Bandra-Worli Sea Link',
    },
    {
      id: 'RES-DEL-02',
      name: 'Aerocity Overhead Highway Gantry',
      type: 'Gantry',
      typeKey: 'gantry',
      location: 'NH-48 Airport Express Corridor, New Delhi',
      dimensions: '60 × 15 ft',
      sqft: '900 sq ft',
      illumination: 'Back-lit',
      orientation: 'Bi-directional',
      customerPrice: '₹2,40,000',
      sodaarsPrice: '₹2,15,000',
      marketplace: true,
      status: 'Booked',
      statusVariant: 'inactive' as const,
      facing: 'Dual-carriageway direct sightline towards IGI Airport',
    },
    {
      id: 'RES-BLR-03',
      name: 'Trinity Circle Commercial Billboard',
      type: 'Hoarding',
      typeKey: 'hoarding',
      location: 'MG Road Junction, Bangalore',
      dimensions: '30 × 20 ft',
      sqft: '600 sq ft',
      illumination: 'Front-lit',
      orientation: 'East-Facing',
      customerPrice: '₹1,40,000',
      sodaarsPrice: '₹1,25,000',
      marketplace: false,
      status: 'Hold',
      statusVariant: 'pending' as const,
      facing: 'CBD Central Traffic Concourse with high vehicular dwell',
    },
    {
      id: 'RES-PUN-04',
      name: 'Hinjawadi Flyover Bridge Panel',
      type: 'Bridge Panel',
      typeKey: 'bridge',
      location: 'Hinjawadi Phase 1 Overbridge, Pune',
      dimensions: '50 × 12 ft',
      sqft: '600 sq ft',
      illumination: 'Front-lit',
      orientation: 'West-Facing',
      customerPrice: '₹1,15,000',
      sodaarsPrice: '₹1,00,000',
      marketplace: true,
      status: 'Available',
      statusVariant: 'active' as const,
      facing: 'Tech park commuter artery with continuous day visibility',
    },
  ];

  const filteredResources = mockResources.filter(
    (item) => resourceFilter === 'all' || item.typeKey === resourceFilter
  );

  const selectedAsset =
    mockResources.find((item) => item.id === selectedAssetId) || mockResources[0];
  const resourceTypes = [
    { name: 'Hoardings', desc: 'Large format static street and roadside billboard displays mounted along urban corridors.' },
    { name: 'Billboards', desc: 'High-visibility structural static displays positioned along major vehicular transit routes.' },
    { name: 'Unipoles', desc: 'Single-pillar elevated static advertising structures offering prominent long-distance sightlines.' },
    { name: 'Gantries', desc: 'Overhead static structures spanning across highway carriageways with directional visibility.' },
    { name: 'Bus Shelters', desc: 'Pedestrian-level static transit shelter panels positioned across high-density urban transit nodes.' },
    { name: 'Pole Ads', desc: 'Standardized vertical static pole kiosk displays mounted along central medians and streetlights.' },
    { name: 'Wall Mounts', desc: 'Direct-facade static banners and vinyl wraps affixed to exterior building elevations.' },
    { name: 'Rooftops', desc: 'Elevated static structural frames installed on urban building rooftops for panoramic exposure.' },
    { name: 'Bridge Panels', desc: 'Static horizontal displays installed on foot overbridges and railway overpasses.' },
    { name: 'Other Static Assets', desc: 'Custom structural static outdoor advertising media faces adhering to physical OOH standards.' },
  ];

  const resourceFields = [
    { field: 'Resource Name', icon: Tag, desc: 'Unique asset identifier and descriptive internal commercial name.' },
    { field: 'Type', icon: Layers, desc: 'Static physical format category (e.g., Unipole, Gantry, Hoarding).' },
    { field: 'Location', icon: MapPin, desc: 'Associated spatial site record containing city, zone, and landmark details.' },
    { field: 'Dimensions', icon: Maximize2, desc: 'Exact physical width, height, and display square footage.' },
    { field: 'Orientation', icon: Compass, desc: 'Display facing (e.g., North-Facing, South-Facing, Cardinal alignment).' },
    { field: 'Illumination', icon: Sun, desc: 'Physical lighting specification (Front-lit, Back-lit, Non-lit).' },
    { field: 'Visibility / Facing', icon: Eye, desc: 'Traffic flow alignment, approach visibility distance, and line-of-sight.' },
    { field: 'Customer Price', icon: DollarSign, desc: 'Reference street card rate / retail customer price for direct sales.' },
    { field: 'SODAARS Price', icon: Tag, desc: 'Agreed net price provided for marketplace discovery and settlement.' },
    { field: 'Marketplace Participation', icon: ToggleRight, desc: 'Asset-level toggle determining eligibility in SODAARS Marketplace.' },
    { field: 'Status', icon: CheckCircle2, desc: 'Operational state of the asset within the provider inventory.' },
    { field: 'Media', icon: Image, desc: 'High-resolution physical asset photos and situational presentation frames.' },
    { field: 'Description', icon: FileText, desc: 'Detailed commercial overview, structural notes, and positioning summary.' },
  ];

  const availabilityStates = [
    { name: 'Available', color: 'bg-emerald-500', desc: 'Open slot eligible for direct or marketplace reservation.' },
    { name: 'Booked', color: 'bg-stone-900', desc: 'Confirmed booking reservation with execution schedule.' },
    { name: 'Hold', color: 'bg-amber-400', desc: 'Tentative client hold reserved for a defined evaluation window.' },
    { name: 'Provider Block', color: 'bg-[#F97316]', desc: 'Reserved or blocked by the provider for operational purposes.' },
    { name: 'Admin Block', color: 'bg-stone-700', desc: 'Administrative freeze applied during operational review.' },
    { name: 'Maintenance', color: 'bg-stone-400', desc: 'Scheduled structural repairs, vinyl skin replacement, or lighting work.' },
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
              RESOURCE MANAGEMENT
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-[#171717] leading-[1.12]">
              Manage Every Advertising Resource From One Place.
            </h1>

            {/* Subtitle / Core Description */}
            <div className="mt-4 text-lg sm:text-xl font-semibold text-[#F97316]">
              Hoardings, unipoles &amp; gantries
            </div>

            {/* Supporting Copy */}
            <p className="mt-4 text-base sm:text-lg text-[#525252] max-w-3xl mx-auto leading-relaxed font-normal">
              Organize physical outdoor advertising assets with structured resource information, pricing, media, marketplace participation, and availability connections.
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

            {/* Conceptual Dimension Indicator Strip */}
            <div className="mt-12 pt-8 border-t border-[#E5E5E5]/60 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs">
              <span className="px-3 py-1 rounded-full bg-white border border-[#E5E5E5] text-[#171717] font-medium shadow-xs">
                Physical Specifications
              </span>
              <span className="text-[#D4D4D8]">·</span>
              <span className="px-3 py-1 rounded-full bg-white border border-[#E5E5E5] text-[#171717] font-medium shadow-xs">
                Commercial Pricing
              </span>
              <span className="text-[#D4D4D8]">·</span>
              <span className="px-3 py-1 rounded-full bg-white border border-[#E5E5E5] text-[#171717] font-medium shadow-xs">
                Visual Media Identity
              </span>
              <span className="text-[#D4D4D8]">·</span>
              <span className="px-3 py-1 rounded-full bg-white border border-[#E5E5E5] text-[#171717] font-medium shadow-xs">
                Marketplace Participation
              </span>
              <span className="text-[#D4D4D8]">·</span>
              <span className="px-3 py-1 rounded-full bg-white border border-[#E5E5E5] text-[#171717] font-medium shadow-xs">
                Availability Scheduling
              </span>
            </div>

            {/* Interactive Advertising Resources Table & Inspection Card Mockup */}
            <div className="mt-14 max-w-6xl mx-auto text-left">
              <Card className="bg-white border-[#E5E5E5] shadow-sm overflow-hidden p-0">
                {/* Mockup Header Toolbar */}
                <div className="p-4 sm:p-5 border-b border-[#E5E5E5] bg-[#FAFAF9] flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#F97316]">
                        Inventory Control Center
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                        Live Ledger
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-[#171717] mt-0.5">
                      Advertising Resources Directory
                    </h3>
                  </div>

                  {/* Filter Tabs */}
                  <div className="flex flex-wrap items-center gap-1.5 bg-white p-1 rounded-md border border-[#E5E5E5]">
                    {[
                      { key: 'all', label: 'All Formats (24)' },
                      { key: 'unipole', label: 'Unipoles' },
                      { key: 'gantry', label: 'Gantries' },
                      { key: 'hoarding', label: 'Hoardings' },
                      { key: 'bridge', label: 'Bridge Panels' },
                    ].map((tab) => (
                      <button
                        key={tab.key}
                        onClick={() => setResourceFilter(tab.key as any)}
                        className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                          resourceFilter === tab.key
                            ? 'bg-[#171717] text-white shadow-xs'
                            : 'text-[#525252] hover:text-[#171717] hover:bg-[#F5F5F4]'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Table & Selected Asset Split View */}
                <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#E5E5E5]">
                  {/* Table Column */}
                  <div className="lg:col-span-7 overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-[#FAFAF9]/80 border-b border-[#E5E5E5] text-[11px] font-semibold text-[#737373] uppercase tracking-wider">
                          <th className="py-3 px-4">Asset Code / Format</th>
                          <th className="py-3 px-4">Location &amp; Specs</th>
                          <th className="py-3 px-4">Card / Net Price</th>
                          <th className="py-3 px-4 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E5E5E5]">
                        {filteredResources.map((res) => (
                          <tr
                            key={res.id}
                            onClick={() => setSelectedAssetId(res.id)}
                            className={`cursor-pointer transition-colors ${
                              selectedAssetId === res.id
                                ? 'bg-orange-50/70 border-l-4 border-l-[#F97316]'
                                : 'hover:bg-[#FAFAF9]'
                            }`}
                          >
                            <td className="py-3 px-4 align-top">
                              <div className="font-mono font-bold text-[#171717]">{res.id}</div>
                              <div className="text-[11px] font-medium text-[#F97316] mt-0.5">{res.type}</div>
                              <div className="text-[11px] text-[#525252] mt-1 line-clamp-1">{res.name}</div>
                            </td>
                            <td className="py-3 px-4 align-top">
                              <div className="text-[11px] font-medium text-[#171717] flex items-center gap-1">
                                <MapPin size={11} className="text-[#737373] shrink-0" />
                                <span className="line-clamp-1">{res.location}</span>
                              </div>
                              <div className="text-[11px] text-[#737373] mt-1 flex items-center gap-2">
                                <span>{res.dimensions}</span>
                                <span>·</span>
                                <span>{res.illumination}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 align-top whitespace-nowrap">
                              <div className="font-semibold text-[#171717]">{res.customerPrice}</div>
                              <div className="text-[10px] text-[#737373] mt-0.5">
                                Net: <span className="text-[#EA580C] font-medium">{res.sodaarsPrice}</span>
                              </div>
                              <div className="mt-1">
                                {res.marketplace ? (
                                  <span className="inline-flex items-center text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                                    Marketplace ON
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center text-[10px] px-1.5 py-0.5 rounded bg-stone-100 text-stone-600 border border-stone-200">
                                    Direct Only
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-4 align-top text-center">
                              <Badge variant={res.statusVariant} size="sm">
                                {res.status}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Selected Asset Inspection Drawer Card */}
                  <div className="lg:col-span-5 p-5 bg-[#FAFAF9] flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E5]">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#737373]">
                          Asset Specification View
                        </span>
                        <Badge variant={selectedAsset.statusVariant} size="sm">
                          {selectedAsset.status}
                        </Badge>
                      </div>

                      {/* Title & Code */}
                      <div className="mt-3">
                        <div className="text-xs font-mono font-bold text-[#F97316]">{selectedAsset.id}</div>
                        <h4 className="text-sm font-bold text-[#171717] mt-0.5">{selectedAsset.name}</h4>
                        <p className="text-xs text-[#525252] mt-1 flex items-start gap-1">
                          <MapPin size={12} className="text-[#F97316] shrink-0 mt-0.5" />
                          <span>{selectedAsset.location}</span>
                        </p>
                      </div>

                      {/* Structured Parameters Grid */}
                      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2.5 rounded bg-white border border-[#E5E5E5]">
                          <span className="text-[10px] text-[#737373] block uppercase font-medium">Format &amp; Size</span>
                          <span className="font-semibold text-[#171717] mt-0.5 block">{selectedAsset.type}</span>
                          <span className="text-[11px] text-[#525252]">{selectedAsset.dimensions} ({selectedAsset.sqft})</span>
                        </div>
                        <div className="p-2.5 rounded bg-white border border-[#E5E5E5]">
                          <span className="text-[10px] text-[#737373] block uppercase font-medium">Illumination &amp; Facing</span>
                          <span className="font-semibold text-[#171717] mt-0.5 block">{selectedAsset.illumination}</span>
                          <span className="text-[11px] text-[#525252]">{selectedAsset.orientation}</span>
                        </div>
                      </div>

                      {/* Pricing Comparison */}
                      <div className="mt-3 p-3 rounded bg-white border border-[#E5E5E5]">
                        <div className="text-[10px] text-[#737373] uppercase font-semibold mb-2">Commercial Terms</div>
                        <div className="flex items-center justify-between text-xs">
                          <div>
                            <span className="text-[#737373] block text-[11px]">Regular Customer Price</span>
                            <span className="text-sm font-bold text-[#171717]">{selectedAsset.customerPrice}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-[#737373] block text-[11px]">SODAARS Net Price</span>
                            <span className="text-sm font-bold text-[#EA580C]">{selectedAsset.sodaarsPrice}</span>
                          </div>
                        </div>
                      </div>

                      {/* Traffic & Facing Note */}
                      <div className="mt-3 p-2.5 rounded bg-white border border-[#E5E5E5] text-[11px] text-[#525252]">
                        <span className="font-semibold text-[#171717] block mb-0.5">Visibility Corridor:</span>
                        {selectedAsset.facing}
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-[#E5E5E5] flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-[#525252]">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span>Connected to Availability Engine</span>
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
      {/* 2. STATIC RESOURCE TYPES (V1 ONLY)                                        */}
      {/* ========================================================================= */}
      <section className="py-16 md:py-24 border-b border-[#E5E5E5] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#F97316]">
              STATIC MEDIA TAXONOMY
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-[#171717]">
              Supported Static Advertising Resource Types
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#525252] leading-relaxed">
              SODAARS V1 is exclusively engineered for physical, static outdoor advertising assets. Every asset category is cataloged with structured physical parameters tailored to real-world operational workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {resourceTypes.map((type, idx) => (
              <Card key={idx} className="p-4 bg-[#FAFAF9] border-[#E5E5E5] flex flex-col justify-between hover:border-[#F97316]/40 transition-colors">
                <div>
                  <div className="w-8 h-8 rounded bg-white border border-[#E5E5E5] flex items-center justify-center text-[#F97316] font-bold text-xs mb-3">
                    0{idx + 1}
                  </div>
                  <h3 className="text-sm font-bold text-[#171717]">{type.name}</h3>
                  <p className="mt-1 text-xs text-[#525252] leading-relaxed">{type.desc}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#E5E5E5]/60 flex items-center gap-1.5 text-[11px] font-medium text-[#737373]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F97316]" />
                  <span>Static Format</span>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-8 p-4 rounded-lg bg-[#FAFAF9] border border-[#E5E5E5] flex items-center justify-between text-xs text-[#525252]">
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-[#F97316] shrink-0" />
              <span>
                <strong>Static OOH Scope:</strong> V1 focuses purely on physical static formats. Digital displays, LED screens, and pDOOH systems are strictly outside V1 scope.
              </span>
            </div>
            <Badge variant="inactive">Static OOH Only</Badge>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. LOCATION VS ADVERTISING RESOURCE                                       */}
      {/* ========================================================================= */}
      <section className="py-16 md:py-24 border-b border-[#E5E5E5] bg-[#FAFAF9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Narrative Column */}
            <div className="lg:col-span-5 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#F97316]">
                <MapPin size={14} className="text-[#F97316]" />
                LOCATION + RESOURCE
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#171717]">
                A Location Is Not the Advertising Resource.
              </h2>
              <div className="space-y-3 text-sm text-[#525252] leading-relaxed">
                <p>
                  In outdoor advertising, mixing geographic locations with sellable media faces creates operational confusion. SODAARS enforces a clean architectural separation:
                </p>
                <div className="p-3.5 rounded-md bg-white border border-[#E5E5E5] space-y-2">
                  <div>
                    <strong className="text-[#171717]">Location:</strong> The physical site, landmark, intersection, or geospatial coordinates where structures exist.
                  </div>
                  <div className="pt-2 border-t border-[#E5E5E5]">
                    <strong className="text-[#171717]">Advertising Resource:</strong> The actual commercial advertising asset or face that can be managed, priced, made available, and connected to bookings.
                  </div>
                </div>
                <p>
                  A single physical location may host multiple independent commercial faces, each having its own dimensions, illumination, rate card, and booking calendar.
                </p>
              </div>
            </div>

            {/* Conceptual Schema Diagram */}
            <div className="lg:col-span-7">
              <Card className="bg-white border-[#E5E5E5] p-6 shadow-xs">
                <div className="flex items-center justify-between pb-4 border-b border-[#E5E5E5]">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#737373]">
                    Structural Hierarchy Model
                  </span>
                  <Badge variant="brand">Spatial Separation</Badge>
                </div>

                {/* Tree Diagram Container */}
                <div className="mt-6 space-y-4">
                  {/* Location Node */}
                  <div className="p-4 rounded-lg bg-[#FAFAF9] border border-[#E5E5E5] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-md bg-orange-100 text-[#F97316] flex items-center justify-center font-bold">
                        <MapPin size={18} />
                      </div>
                      <div>
                        <div className="text-[11px] font-semibold uppercase tracking-wider text-[#737373]">
                          Physical Location (Site)
                        </div>
                        <div className="text-sm font-bold text-[#171717]">
                          Benz Circle Junction
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-[#737373]">Geographic Reference</span>
                  </div>

                  {/* Connecting Stem */}
                  <div className="pl-6 border-l-2 border-dashed border-[#D4D4D8] ml-4 space-y-3">
                    {/* Resource Node A */}
                    <div className="p-3.5 rounded-md bg-white border border-[#E5E5E5] flex flex-wrap items-center justify-between gap-3 shadow-xs">
                      <div className="flex items-center gap-2.5">
                        <Layers size={16} className="text-[#F97316]" />
                        <div>
                          <span className="text-xs font-bold text-[#171717]">Unipole A (East Face)</span>
                          <div className="text-[11px] text-[#737373]">40 × 20 ft · Front-lit · Traffic to Highway</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-medium text-[#171717]">₹85,000 / mo</span>
                        <Badge variant="active">Available</Badge>
                      </div>
                    </div>

                    {/* Resource Node B */}
                    <div className="p-3.5 rounded-md bg-white border border-[#E5E5E5] flex flex-wrap items-center justify-between gap-3 shadow-xs">
                      <div className="flex items-center gap-2.5">
                        <Layers size={16} className="text-[#F97316]" />
                        <div>
                          <span className="text-xs font-bold text-[#171717]">Unipole B (West Face)</span>
                          <div className="text-[11px] text-[#737373]">40 × 20 ft · Front-lit · Traffic to City Center</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-medium text-[#171717]">₹80,000 / mo</span>
                        <Badge variant="blocked">Booked</Badge>
                      </div>
                    </div>

                    {/* Resource Node C */}
                    <div className="p-3.5 rounded-md bg-white border border-[#E5E5E5] flex flex-wrap items-center justify-between gap-3 shadow-xs">
                      <div className="flex items-center gap-2.5">
                        <Layers size={16} className="text-[#F97316]" />
                        <div>
                          <span className="text-xs font-bold text-[#171717]">Billboard C (Flyover Left)</span>
                          <div className="text-[11px] text-[#737373]">30 × 15 ft · Non-lit · Approaching Ramp</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-medium text-[#171717]">₹45,000 / mo</span>
                        <Badge variant="pending">Hold</Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3.5 border-t border-[#E5E5E5] text-[11px] text-[#737373] text-center">
                  Hierarchical rule: Bookings, rate cards, and availability calendars bind strictly to <strong>Advertising Resources</strong>, not to Location points.
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. STRUCTURED RESOURCE DATA                                               */}
      {/* ========================================================================= */}
      <section className="py-16 md:py-24 border-b border-[#E5E5E5] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-14">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#F97316]">
              STRUCTURED RESOURCE DATA
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-[#171717]">
              Keep Every Advertising Resource Clearly Defined.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#525252] leading-relaxed">
              Every advertising resource in SODAARS is structured with essential technical and commercial attributes used consistently across scheduling, contracts, operations, and partner distribution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
            {resourceFields.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="p-4 rounded-lg bg-[#FAFAF9] border border-[#E5E5E5] flex items-start gap-3">
                  <div className="p-2 rounded bg-white border border-[#E5E5E5] text-[#F97316] shrink-0 mt-0.5">
                    <Icon size={16} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-[#171717]">{item.field}</h3>
                    <p className="mt-1 text-xs text-[#525252] leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Polished Conceptual Specification Card */}
          <div className="mt-12 max-w-4xl mx-auto">
            <Card className="p-6 bg-[#FAFAF9] border-[#E5E5E5] shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#E5E5E5]">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#F97316]" />
                  <span className="text-xs font-bold text-[#171717] uppercase tracking-wider">
                    Asset Specification Model · HYD-GCH-001
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="active">Active</Badge>
                  <Badge variant="brand">Marketplace Enabled</Badge>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <div className="text-[10px] uppercase font-semibold text-[#737373]">Asset Type</div>
                  <div className="mt-1 font-semibold text-[#171717]">Unipole (Front-lit)</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-semibold text-[#737373]">Physical Dimensions</div>
                  <div className="mt-1 font-semibold text-[#171717]">40 × 20 ft (800 sq ft)</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-semibold text-[#737373]">Illumination</div>
                  <div className="mt-1 font-semibold text-[#171717]">External LED Floodlights</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-semibold text-[#737373]">Visibility & Facing</div>
                  <div className="mt-1 font-semibold text-[#171717]">South-Facing · 250m Sightline</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-semibold text-[#737373]">Regular Customer Price</div>
                  <div className="mt-1 font-semibold text-[#171717]">₹1,20,000 / month</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-semibold text-[#737373]">SODAARS Net Price</div>
                  <div className="mt-1 font-semibold text-emerald-700">₹95,000 / month</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-semibold text-[#737373]">Associated Location</div>
                  <div className="mt-1 font-semibold text-[#171717]">Gachibowli Outer Ring Rd</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-semibold text-[#737373]">Operational State</div>
                  <div className="mt-1 font-semibold text-[#171717]">Live in Availability Engine</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. RESOURCE MEDIA                                                         */}
      {/* ========================================================================= */}
      <section className="py-16 md:py-24 border-b border-[#E5E5E5] bg-[#FAFAF9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Narrative Column */}
            <div className="lg:col-span-5 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#F97316]">
                <Image size={14} className="text-[#F97316]" />
                RESOURCE MEDIA IDENTITY
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#171717]">
                Give Every Resource a Clear Visual Identity.
              </h2>
              <p className="text-sm sm:text-base text-[#525252] leading-relaxed">
                Use resource media to help customers and providers understand the physical advertising asset before a booking or campaign decision.
              </p>
              <div className="space-y-2 pt-2 text-xs text-[#525252]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-[#F97316] shrink-0" />
                  <span>Situational approach shots capturing vehicular sightlines</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-[#F97316] shrink-0" />
                  <span>Structural frame closeups detailing mounting apparatus</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-[#F97316] shrink-0" />
                  <span>Illumination reference imagery showing fixture alignment</span>
                </div>
              </div>
            </div>

            {/* Right Visual Representation */}
            <div className="lg:col-span-7">
              <Card className="bg-white border-[#E5E5E5] p-6 shadow-xs">
                <div className="flex items-center justify-between pb-4 border-b border-[#E5E5E5]">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#737373]">
                    Conceptual Resource Media Frame
                  </span>
                  <span className="text-xs text-[#737373]">Asset Visual Portfolio</span>
                </div>

                {/* Conceptual Media Frames Grid */}
                <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="rounded-lg bg-[#FAFAF9] border border-[#E5E5E5] p-4 flex flex-col items-center justify-center text-center h-40">
                    <Building size={24} className="text-[#A3A3A3] mb-2" />
                    <span className="text-xs font-bold text-[#171717]">Approach Sightline</span>
                    <span className="text-[10px] text-[#737373] mt-0.5">Vehicular Corridor View</span>
                    <span className="mt-3 px-2 py-0.5 rounded bg-white border border-[#E5E5E5] text-[10px] text-[#525252]">
                      Primary Media Frame
                    </span>
                  </div>

                  <div className="rounded-lg bg-[#FAFAF9] border border-[#E5E5E5] p-4 flex flex-col items-center justify-center text-center h-40">
                    <Maximize2 size={24} className="text-[#A3A3A3] mb-2" />
                    <span className="text-xs font-bold text-[#171717]">Face Direct Angle</span>
                    <span className="text-[10px] text-[#737373] mt-0.5">Perpendicular Elevation</span>
                    <span className="mt-3 px-2 py-0.5 rounded bg-white border border-[#E5E5E5] text-[10px] text-[#525252]">
                      Mounting Frame
                    </span>
                  </div>

                  <div className="rounded-lg bg-[#FAFAF9] border border-[#E5E5E5] p-4 flex flex-col items-center justify-center text-center h-40">
                    <Sun size={24} className="text-[#A3A3A3] mb-2" />
                    <span className="text-xs font-bold text-[#171717]">Evening Lighting</span>
                    <span className="text-[10px] text-[#737373] mt-0.5">Illumination Context</span>
                    <span className="mt-3 px-2 py-0.5 rounded bg-white border border-[#E5E5E5] text-[10px] text-[#525252]">
                      Lighting Frame
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3.5 border-t border-[#E5E5E5] text-[11px] text-[#737373]">
                  * Conceptual asset presentation. Helps media buyers confirm structural suitability and physical surroundings prior to proposal creation.
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. COMMERCIAL PRICING MODEL                                               */}
      {/* ========================================================================= */}
      <section className="py-16 md:py-24 border-b border-[#E5E5E5] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#F97316]">
              COMMERCIAL PRICING
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-[#171717]">
              Separate Your Reference Price From Your Marketplace Net Price.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#525252] leading-relaxed">
              SODAARS enables clear dual-price governance for every registered asset, keeping your direct commercial rate card distinct from marketplace net terms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Price Definition 1 */}
            <Card className="p-6 bg-[#FAFAF9] border-[#E5E5E5] flex flex-col justify-between">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-[#737373]">
                  Direct Commercial Rate Card
                </div>
                <h3 className="text-lg font-bold text-[#171717] mt-1">
                  Regular Customer Price
                </h3>
                <p className="mt-2 text-xs text-[#525252] leading-relaxed">
                  The provider’s reference/retail customer price for the advertising resource. Used as the benchmark rate card for direct client agreements, renewals, and offline media quotes.
                </p>

                <div className="mt-6 p-4 rounded-lg bg-white border border-[#E5E5E5]">
                  <div className="text-[10px] uppercase font-semibold text-[#737373]">
                    Illustrative Reference Price
                  </div>
                  <div className="text-3xl font-extrabold text-[#171717] mt-1">
                    ₹1,00,000
                  </div>
                  <div className="text-[11px] text-[#737373] mt-0.5">Per Month · Direct Card Rate</div>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-[#E5E5E5] text-[11px] text-[#737373]">
                Managed directly by provider for offline and proprietary customer relationships.
              </div>
            </Card>

            {/* Price Definition 2 */}
            <Card className="p-6 bg-[#FAFAF9] border-[#E5E5E5] flex flex-col justify-between">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-[#F97316]">
                  Marketplace Settlement Basis
                </div>
                <h3 className="text-lg font-bold text-[#171717] mt-1">
                  SODAARS Price
                </h3>
                <p className="mt-2 text-xs text-[#525252] leading-relaxed">
                  The agreed net price provided by the provider for marketplace discovery and settlement purposes. This represents the provider’s net expectation for voluntary marketplace distribution.
                </p>

                <div className="mt-6 p-4 rounded-lg bg-white border border-[#E5E5E5]">
                  <div className="text-[10px] uppercase font-semibold text-[#F97316]">
                    Illustrative SODAARS Net Price
                  </div>
                  <div className="text-3xl font-extrabold text-emerald-700 mt-1">
                    ₹75,000
                  </div>
                  <div className="text-[11px] text-[#737373] mt-0.5">Per Month · Agreed Net Settlement</div>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-[#E5E5E5] text-[11px] text-[#737373]">
                Figures above are illustrative only. Providers retain full autonomy on pricing figures.
              </div>
            </Card>
          </div>

          {/* Marketplace Price Construction Explanation */}
          <div className="mt-10 max-w-4xl mx-auto p-5 rounded-lg bg-[#FAFAF9] border border-[#E5E5E5] space-y-3">
            <div className="text-xs font-bold text-[#171717] uppercase tracking-wider">
              Marketplace Customer Price Construction Flow
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
              <span className="px-2.5 py-1 rounded bg-white border border-[#E5E5E5] font-semibold text-[#171717]">
                Provider SODAARS Price
              </span>
              <span className="text-[#737373]">→</span>
              <span className="px-2.5 py-1 rounded bg-white border border-[#E5E5E5] font-semibold text-[#171717]">
                Agreed Marketplace Markup
              </span>
              <span className="text-[#737373]">→</span>
              <span className="px-2.5 py-1 rounded bg-white border border-[#E5E5E5] font-semibold text-[#171717]">
                Customer Price
              </span>
              <span className="text-[#737373]">→</span>
              <span className="px-2.5 py-1 rounded bg-white border border-[#E5E5E5] font-semibold text-[#F97316]">
                Applicable Customer Adjustment
              </span>
            </div>
            <p className="text-xs text-[#525252] leading-relaxed pt-2 border-t border-[#E5E5E5]">
              Marketplace commercial terms, including any markup or customer adjustment, are based on the applicable provider agreement. There is no fixed markup defined on this page.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. MARKETPLACE PARTICIPATION                                              */}
      {/* ========================================================================= */}
      <section className="py-16 md:py-24 border-b border-[#E5E5E5] bg-[#FAFAF9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Narrative Column */}
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#F97316]">
                <ToggleRight size={14} className="text-[#F97316]" />
                MARKETPLACE CONTROL
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#171717]">
                Choose Which Resources Participate.
              </h2>
              <div className="space-y-3 text-sm text-[#525252] leading-relaxed">
                <p>
                  Marketplace participation is controlled strictly at the advertising-resource level. A provider can decide whether an individual resource participates in SODAARS Marketplace.
                </p>
                <p>
                  <strong>Participation and availability are separate concepts:</strong> A resource can participate in Marketplace while its availability is managed independently through the Availability Engine.
                </p>
                <div className="p-3.5 rounded-md bg-white border border-[#E5E5E5] text-xs text-[#525252] space-y-1">
                  <div>• Toggling participation ON makes the asset discoverable when open dates exist.</div>
                  <div>• If dates are blocked or booked, the Marketplace respects availability locks.</div>
                  <div>• SODAARS does not claim guaranteed marketplace demand, bookings, or revenue.</div>
                </div>
              </div>
            </div>

            {/* Right Conceptual Control Cards */}
            <div className="lg:col-span-6 space-y-4">
              {/* Asset 1: Participation ON */}
              <Card className="p-5 bg-white border-[#E5E5E5] shadow-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-[#171717]">HYD-GCH-001 (Unipole South)</div>
                    <div className="text-[11px] text-[#737373]">Gachibowli Junction · 40 × 20 ft</div>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-700">
                    <ToggleRight size={16} className="text-emerald-600" />
                    <span>Participation [ ON ]</span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-[#E5E5E5] flex items-center justify-between text-[11px] text-[#737373]">
                  <span>Discoverable on Marketplace</span>
                  <span className="font-medium text-[#171717]">Net: ₹95,000 / mo</span>
                </div>
              </Card>

              {/* Asset 2: Participation OFF */}
              <Card className="p-5 bg-white border-[#E5E5E5] shadow-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-[#171717]">MUM-WEH-004 (Gantry Face B)</div>
                    <div className="text-[11px] text-[#737373]">Western Express Highway · 60 × 15 ft</div>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-stone-100 border border-stone-200 text-xs font-semibold text-stone-600">
                    <ToggleLeft size={16} className="text-stone-400" />
                    <span>Participation [ OFF ]</span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-[#E5E5E5] flex items-center justify-between text-[11px] text-[#737373]">
                  <span>Private Direct Channel Only</span>
                  <span className="font-medium text-[#171717]">Card Rate: ₹1,50,000 / mo</span>
                </div>
              </Card>

              <div className="p-3 rounded bg-white border border-[#E5E5E5] text-[11px] text-[#737373] text-center">
                Provider retains complete autonomy over which assets are syndicated to Marketplace.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. AVAILABILITY CONNECTION                                                */}
      {/* ========================================================================= */}
      <section className="py-16 md:py-24 border-b border-[#E5E5E5] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#F97316]">
              CONNECTED AVAILABILITY
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-[#171717]">
              Connect Resources to Real Availability.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#525252] leading-relaxed">
              Advertising resources connect to SODAARS availability so dates, holds, bookings, provider blocks, admin blocks, and maintenance states can be managed against the underlying resource.
            </p>
          </div>

          {/* Unified Availability Flow */}
          <div className="max-w-4xl mx-auto">
            <Card className="p-6 bg-[#FAFAF9] border-[#E5E5E5] shadow-xs">
              <div className="text-xs font-semibold uppercase tracking-wider text-[#737373] mb-4">
                Availability Dispatch Flow
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                <div className="p-4 rounded-lg bg-white border border-[#E5E5E5]">
                  <Layers size={20} className="text-[#F97316] mx-auto mb-1.5" />
                  <div className="text-xs font-bold text-[#171717]">Advertising Resource</div>
                  <div className="text-[11px] text-[#737373] mt-0.5">Underlying Physical Media Asset</div>
                </div>
                <div className="p-4 rounded-lg bg-white border border-[#E5E5E5]">
                  <Calendar size={20} className="text-[#F97316] mx-auto mb-1.5" />
                  <div className="text-xs font-bold text-[#171717]">Availability Engine</div>
                  <div className="text-[11px] text-[#737373] mt-0.5">Real-Time Slot & Date Matrix</div>
                </div>
                <div className="p-4 rounded-lg bg-white border border-[#E5E5E5]">
                  <FileText size={20} className="text-[#F97316] mx-auto mb-1.5" />
                  <div className="text-xs font-bold text-[#171717]">Booking Channels</div>
                  <div className="text-[11px] text-[#737373] mt-0.5">Marketplace · Admin · Direct</div>
                </div>
              </div>

              {/* Supported State Grid */}
              <div className="mt-8 pt-6 border-t border-[#E5E5E5]">
                <div className="text-xs font-bold text-[#171717] uppercase tracking-wider mb-3">
                  Approved Availability States
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {availabilityStates.map((state, idx) => (
                    <div key={idx} className="p-3 rounded bg-white border border-[#E5E5E5] flex items-start gap-2.5 text-xs">
                      <div className={`w-3 h-3 rounded-xs ${state.color} shrink-0 mt-0.5`} />
                      <div>
                        <span className="font-bold text-[#171717]">{state.name}</span>
                        <p className="text-[11px] text-[#525252] mt-0.5">{state.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 pt-3.5 border-t border-[#E5E5E5] text-[11px] text-[#737373] text-center">
                The same underlying resource availability supports all incoming requests. SODAARS prevents double-booking across direct and marketplace channels without automated availability claims.
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. RESOURCE → BOOKING → CAMPAIGN LIFECYCLE                                */}
      {/* ========================================================================= */}
      <section className="py-16 md:py-24 border-b border-[#E5E5E5] bg-[#FAFAF9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-14">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#F97316]">
              OPERATIONAL LIFECYCLE
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-[#171717]">
              One Resource. Connected Across the Operating Lifecycle.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#525252] leading-relaxed">
              The resource becomes the operational foundation connecting inventory information, availability, bookings, customers, and campaign execution.
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <Card className="p-6 sm:p-8 bg-white border-[#E5E5E5] shadow-xs">
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
                <div className="p-3 rounded-lg bg-[#FAFAF9] border border-[#E5E5E5]">
                  <Layers size={18} className="text-[#F97316] mx-auto mb-1.5" />
                  <div className="text-xs font-bold text-[#171717]">Advertising Resource</div>
                  <div className="text-[10px] text-[#737373] mt-0.5">Asset Registration</div>
                </div>
                <div className="p-3 rounded-lg bg-[#FAFAF9] border border-[#E5E5E5]">
                  <Calendar size={18} className="text-[#F97316] mx-auto mb-1.5" />
                  <div className="text-xs font-bold text-[#171717]">Availability</div>
                  <div className="text-[10px] text-[#737373] mt-0.5">Slot Scheduling</div>
                </div>
                <div className="p-3 rounded-lg bg-[#FAFAF9] border border-[#E5E5E5]">
                  <FileText size={18} className="text-[#F97316] mx-auto mb-1.5" />
                  <div className="text-xs font-bold text-[#171717]">Booking</div>
                  <div className="text-[10px] text-[#737373] mt-0.5">Contract Lifecycle</div>
                </div>
                <div className="p-3 rounded-lg bg-[#FAFAF9] border border-[#E5E5E5]">
                  <Camera size={18} className="text-[#F97316] mx-auto mb-1.5" />
                  <div className="text-xs font-bold text-[#171717]">Campaign</div>
                  <div className="text-[10px] text-[#737373] mt-0.5">Mounting Operations</div>
                </div>
                <div className="p-3 rounded-lg bg-orange-50 border border-orange-200">
                  <CheckCircle2 size={18} className="text-[#F97316] mx-auto mb-1.5" />
                  <div className="text-xs font-bold text-[#F97316]">Execution</div>
                  <div className="text-[10px] text-[#F97316] mt-0.5">Proof Confirmed</div>
                </div>
              </div>
            </Card>
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
                  Connect Inventory Programmatically.
                </h2>
              </div>
              <span className="px-3 py-1 rounded-full bg-stone-200 border border-stone-300 text-xs font-semibold text-stone-700">
                PLANNED / FUTURE
              </span>
            </div>

            <p className="mt-6 text-sm text-[#525252] leading-relaxed">
              SODAARS is designed with a future API layer in mind, allowing advertising resource information and availability to connect with partner platforms and other systems.
            </p>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#525252]">
              <div className="p-3.5 rounded bg-white border border-[#E5E5E5]">
                <div className="font-bold text-[#171717] mb-1">Programmatic Resource Syndication</div>
                <div>Future API endpoints planned for automated catalog synchronization with external media planning systems.</div>
              </div>
              <div className="p-3.5 rounded bg-white border border-[#E5E5E5]">
                <div className="font-bold text-[#171717] mb-1">Unified Availability Feeds</div>
                <div>Standardized slot availability schema designed to interface with partner ERP and CRM architectures.</div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#E5E5E5] text-[11px] text-[#737373]">
              * Note: The API layer is a planned roadmap capability. No live endpoints or third-party integrations are operational in V1.
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
            {/* Warm Radial Glow */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-[#F97316]/10 blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-3xl">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#F97316]">
                READY TO STRUCTURE YOUR INVENTORY?
              </span>
              <h2 className="mt-3 text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
                Bring Your Advertising Resources Into One Connected Platform.
              </h2>
              <p className="mt-4 text-sm sm:text-base text-[#A3A3A3] leading-relaxed">
                Organize resource information, pricing, marketplace participation, and availability connections in one place.
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

export default ResourceManagementPage;
