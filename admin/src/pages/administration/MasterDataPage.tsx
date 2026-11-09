import React, { useState } from 'react';
import { 
  Database, 
  Layers, 
  Sun, 
  Building2, 
  MapPin, 
  Tag, 
  Scissors, 
  Plus, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight,
  ExternalLink,
  Edit2,
  Trash2,
  X
} from 'lucide-react';

type MasterCategory = 'formats' | 'illumination' | 'authorities' | 'cities' | 'tax' | 'materials';

export const MasterDataPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<MasterCategory>('formats');
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // 1. Asset Formats
  const [assetFormats, setAssetFormats] = useState([
    { code: 'FMT-BLB', name: 'Traditional Billboard / Hoarding', standardDimensions: '40ft x 20ft, 20ft x 10ft', unit: 'Sq Ft', activeCount: 640, status: 'Active' },
    { code: 'FMT-UNI', name: 'Unipole Highway Display', standardDimensions: '30ft x 15ft, 40ft x 20ft', unit: 'Sq Ft', activeCount: 312, status: 'Active' },
    { code: 'FMT-DOH', name: 'DOOH Digital LED Screen', standardDimensions: '16ft x 9ft, 32ft x 18ft', unit: 'Pixel / Slots', activeCount: 148, status: 'Active' },
    { code: 'FMT-GAN', name: 'Overhead Road Gantry', standardDimensions: '60ft x 10ft, 80ft x 12ft', unit: 'Span Width', activeCount: 84, status: 'Active' },
    { code: 'FMT-BQS', name: 'Bus Queue Shelter (BQS)', standardDimensions: '20ft x 6ft', unit: 'Panels', activeCount: 100, status: 'Active' },
    { code: 'FMT-FOB', name: 'Foot Overbridge (FOB) Wrap', standardDimensions: '50ft x 8ft', unit: 'Span / Faces', activeCount: 42, status: 'Active' },
    { code: 'FMT-APT', name: 'Airport Arrival/Departure Totem', standardDimensions: '10ft x 4ft (Digital LED)', unit: 'Totem Units', activeCount: 28, status: 'Active' },
  ]);

  // 2. Illumination Standards
  const [illuminationTypes, setIlluminationTypes] = useState([
    { code: 'ILM-FL', name: 'Front Lit', description: 'Illuminated by external metal-halide or high-lumen floodlights mounted at top/bottom.', powerReq: '1.5 kW - 3.0 kW', activeCount: 780 },
    { code: 'ILM-BL', name: 'Back Lit', description: 'Internal fluorescent tube or LED backlight array inside enclosed box frame.', powerReq: '2.0 kW - 4.5 kW', activeCount: 290 },
    { code: 'ILM-LED', name: 'Digital / Direct LED', description: 'Self-emitting high-brightness outdoor P4/P6 LED modular tile cluster.', powerReq: '5.0 kW - 12.0 kW', activeCount: 148 },
    { code: 'ILM-NL', name: 'Non Lit', description: 'Reflective daytime vinyl without artificial evening electrical lighting.', powerReq: 'None (Zero kW)', activeCount: 46 },
    { code: 'ILM-SOL', name: 'Solar Hybrid Lit', description: 'Rooftop photovoltaic solar panel array with battery storage for overnight front lighting.', powerReq: 'Off-Grid Solar', activeCount: 20 },
  ]);

  // 3. Municipal Authorities & By-Laws
  const [municipalAuthorities, setMunicipalAuthorities] = useState([
    { code: 'MUM-BMC', city: 'Mumbai', authority: 'Brihanmumbai Municipal Corporation (BMC)', regulation: 'Policy 2024 (Sky-Sign & Advertisements Dept)', licenseCycle: 'Annual Renewal', taxRate: 'Standard Municipal License Fee', contact: 'sky-sign@mcgm.gov.in' },
    { code: 'BLR-BBMP', city: 'Bengaluru', authority: 'Bruhat Bengaluru Mahanagara Palike (BBMP)', regulation: 'Outdoor Advertisement By-Law 2018 (Strict Clearance)', licenseCycle: 'Single Site Permit', taxRate: 'By-Law Schedule B', contact: 'advt.bbmp@karnataka.gov.in' },
    { code: 'DEL-MCD', city: 'Delhi NCR', authority: 'Municipal Corporation of Delhi (MCD)', regulation: 'Delhi Outdoor Advertisement Policy (OAP) 2017', licenseCycle: 'Tender Concession / Annual', taxRate: 'Zonal MCD Fee Structure', contact: 'advertisement@mcd.nic.in' },
    { code: 'HYD-GHMC', city: 'Hyderabad', authority: 'Greater Hyderabad Municipal Corporation (GHMC)', regulation: 'GHMC Central Advertisement Enforcement Wing', licenseCycle: 'Annual Online Renewal', taxRate: 'Category-A / Category-B rates', contact: 'advt@ghmc.gov.in' },
    { code: 'PUN-PMC', city: 'Pune', authority: 'Pune Municipal Corporation (PMC)', regulation: 'PMC Sky-Sign Licensing Dept Guidelines', licenseCycle: 'Financial Year Renewal', taxRate: 'Per Sq. Metre Schedule', contact: 'skysign@punecorporation.org' },
    { code: 'KOL-KMC', city: 'Kolkata', authority: 'Kolkata Municipal Corporation (KMC)', regulation: 'KMC Advertisement & Hoarding Control Regulations', licenseCycle: 'Bi-Annual Renewal', taxRate: 'Borough-wise Sky-Sign Tax', contact: 'advt@kmcgov.in' },
  ]);

  // 4. Cities & Geographic Tiers
  const [geoCities, setGeoCities] = useState([
    { code: 'CITY-BOM', name: 'Mumbai', state: 'Maharashtra', tier: 'Tier 1 Metro', population: '2.1 Cr', gmvShare: '34%' },
    { code: 'CITY-BLR', name: 'Bengaluru', state: 'Karnataka', tier: 'Tier 1 Metro', population: '1.3 Cr', gmvShare: '22%' },
    { code: 'CITY-DEL', name: 'Delhi NCR', state: 'Delhi', tier: 'Tier 1 Metro', population: '3.0 Cr', gmvShare: '26%' },
    { code: 'CITY-HYD', name: 'Hyderabad', state: 'Telangana', tier: 'Tier 1 Metro', population: '1.0 Cr', gmvShare: '12%' },
    { code: 'CITY-PUN', name: 'Pune', state: 'Maharashtra', tier: 'Tier 2 High Growth', population: '72 Lakhs', gmvShare: '4%' },
    { code: 'CITY-AHM', name: 'Ahmedabad', state: 'Gujarat', tier: 'Tier 2 High Growth', population: '84 Lakhs', gmvShare: '2%' },
  ]);

  // 5. Taxation & GST SAC Codes
  const [taxCodes, setTaxCodes] = useState([
    { sac: '998361', title: 'Sale of Advertising Space in Outdoor Media', description: 'Traditional hoardings, unipoles, gantries, street furniture space rentals.', gstRate: '18.00% (9% CGST + 9% SGST)', igstRate: '18.00% IGST', rcmStatus: 'Forward Charge (Media Owner Invoices)' },
    { sac: '998363', title: 'Sale of Digital Screen & DOOH Time Slots', description: 'Digital screen loop slots, electronic totem rotation schedules.', gstRate: '18.00% (9% CGST + 9% SGST)', igstRate: '18.00% IGST', rcmStatus: 'Forward Charge (Platform Cleared)' },
    { sac: '998365', title: 'Preparation of Advertising Copy & Creative Artwork', description: 'Flex artwork design, graphic adaptions, mounting photography proofing.', gstRate: '18.00% GST', igstRate: '18.00% IGST', rcmStatus: 'Standard Service Tax' },
  ]);

  // 6. Fabrication & Material Substrates
  const [materialSubstrates, setMaterialSubstrates] = useState([
    { code: 'MAT-FX440', name: 'Star Flex (Heavy Duty)', gsm: '440 GSM', durability: '12 - 24 Months', bestFor: 'Long-term National Brand Highway Unipoles' },
    { code: 'MAT-FL280', name: 'Standard Frontlit Vinyl', gsm: '280 - 320 GSM', durability: '3 - 6 Months', bestFor: 'Short-burst 30-day Promotional Retail Campaigns' },
    { code: 'MAT-BK500', name: 'Backlit Translucent Fabric', gsm: '500 GSM', durability: '6 - 12 Months', bestFor: 'Airport Lightboxes & Backlit Gantries' },
    { code: 'MAT-BLKO', name: 'Blackout Double-Side Vinyl', gsm: '510 GSM', durability: '12 - 18 Months', bestFor: 'Center Median Kiosks & Dual-facing Billboards' },
    { code: 'MAT-LED-P4', name: 'Digital LED SMD P4 Outdoor', gsm: 'P4 (4mm Pitch)', durability: '100,000 Hours', bestFor: 'Premium High-resolution DOOH Video Displays' },
  ]);

  // Left Sidebar Category Menu Items
  const categoriesList = [
    { id: 'formats' as MasterCategory, label: 'Asset Formats & Types', icon: Layers, count: assetFormats.length, description: 'Billboards, unipoles, DOOH screens' },
    { id: 'illumination' as MasterCategory, label: 'Illumination Standards', icon: Sun, count: illuminationTypes.length, description: 'Front-lit, back-lit, LED clusters' },
    { id: 'authorities' as MasterCategory, label: 'Municipal Authorities', icon: Building2, count: municipalAuthorities.length, description: 'BMC, BBMP, GHMC by-laws' },
    { id: 'cities' as MasterCategory, label: 'Cities & Geo Tiers', icon: MapPin, count: geoCities.length, description: 'Tier 1/2/3 market mappings' },
    { id: 'tax' as MasterCategory, label: 'GST SAC Codes & Tax', icon: Tag, count: taxCodes.length, description: 'SAC 998361, 18% GST mandates' },
    { id: 'materials' as MasterCategory, label: 'Fabrication Materials', icon: Scissors, count: materialSubstrates.length, description: 'Star flex 440 GSM, vinyl grades' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight font-sans">
              Master Data
            </h1>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-zinc-200 text-zinc-800 font-semibold">
              PLATFORM TAXONOMY
            </span>
          </div>
          <p className="text-sm text-zinc-500 mt-1">
            Manage central classifications and dropdown values: media types, illumination, dimensions, and cities.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold shadow-sm transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Entry</span>
        </button>
      </div>

      {/* Main 2-Column Content Layout with Left Sidebar Menu inside Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column (3.5 spans): Master Data Category Sidebar Menu */}
        <div className="lg:col-span-4 xl:col-span-3 bg-white rounded-2xl border border-zinc-200/80 p-3 space-y-1 shadow-xs">
          <div className="px-3 py-2 border-b border-zinc-100 mb-2">
            <span className="text-[10px] uppercase font-bold text-zinc-400 font-mono tracking-wider">
              DATA CATEGORIES
            </span>
            <p className="text-xs text-zinc-500 mt-0.5">Select category to manage</p>
          </div>

          <div className="space-y-1">
            {categoriesList.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all ${
                    isActive
                      ? 'bg-orange-50/80 text-orange-950 font-semibold border border-orange-200 shadow-xs ring-1 ring-orange-500/20'
                      : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      isActive ? 'bg-orange-600 text-white shadow-xs' : 'bg-zinc-100 text-zinc-600'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold block leading-tight">{cat.label}</span>
                      <span className="text-[10px] text-zinc-400 block font-normal mt-0.5">{cat.description}</span>
                    </div>
                  </div>

                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                    isActive ? 'bg-orange-200/60 text-orange-800' : 'bg-zinc-100 text-zinc-600'
                  }`}>
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="pt-4 mt-3 border-t border-zinc-100 px-3 pb-2 text-[11px] text-zinc-400 leading-normal">
            All dictionary records are synchronized with rate card calculators and statutory compliance checkers.
          </div>
        </div>

        {/* Right Column (8.5 spans): Master Data Management Console for Active Category */}
        <div className="lg:col-span-8 xl:col-span-9 bg-white rounded-2xl border border-zinc-200/80 p-6 shadow-xs space-y-6">

          {/* Category 1: Asset Formats & Types */}
          {activeCategory === 'formats' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                <div>
                  <h3 className="font-bold text-zinc-950 text-base">Standard Outdoor Media Formats</h3>
                  <p className="text-xs text-zinc-500">Universal display structures and standardized billing measurement units</p>
                </div>
                <span className="text-xs font-mono font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-200">
                  {assetFormats.length} Registered Formats
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-zinc-200 text-zinc-400 uppercase font-mono text-[10px]">
                      <th className="py-2.5 font-bold">System Code</th>
                      <th className="py-2.5 font-bold">Media Format Name</th>
                      <th className="py-2.5 font-bold">Industry Dimensions</th>
                      <th className="py-2.5 font-bold">Billing Unit</th>
                      <th className="py-2.5 font-bold text-right">Active Inventory</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {assetFormats.map((f) => (
                      <tr key={f.code} className="hover:bg-zinc-50/70 transition-colors">
                        <td className="py-3.5 font-mono font-bold text-orange-600">{f.code}</td>
                        <td className="py-3.5 font-semibold text-zinc-900">{f.name}</td>
                        <td className="py-3.5 text-zinc-600 font-mono text-[11px]">{f.standardDimensions}</td>
                        <td className="py-3.5 font-mono text-zinc-500">{f.unit}</td>
                        <td className="py-3.5 text-right font-mono font-bold text-zinc-900">{f.activeCount} sites</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Category 2: Illumination Standards */}
          {activeCategory === 'illumination' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                <div>
                  <h3 className="font-bold text-zinc-950 text-base">Illumination Standards & Power Ratings</h3>
                  <p className="text-xs text-zinc-500">Lighting profiles and electrical load specifications for evening visibility</p>
                </div>
                <span className="text-xs font-mono font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-200">
                  {illuminationTypes.length} Standards
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-zinc-200 text-zinc-400 uppercase font-mono text-[10px]">
                      <th className="py-2.5 font-bold">Code</th>
                      <th className="py-2.5 font-bold">Illumination Mode</th>
                      <th className="py-2.5 font-bold">Technical Description</th>
                      <th className="py-2.5 font-bold">Electrical Load</th>
                      <th className="py-2.5 font-bold text-right">Registered Count</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {illuminationTypes.map((itm) => (
                      <tr key={itm.code} className="hover:bg-zinc-50/70 transition-colors">
                        <td className="py-3.5 font-mono font-bold text-orange-600">{itm.code}</td>
                        <td className="py-3.5 font-semibold text-zinc-900">{itm.name}</td>
                        <td className="py-3.5 text-zinc-600 max-w-sm">{itm.description}</td>
                        <td className="py-3.5 font-mono text-zinc-500">{itm.powerReq}</td>
                        <td className="py-3.5 text-right font-mono font-bold text-zinc-900">{itm.activeCount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Category 3: Municipal Authorities & By-Laws */}
          {activeCategory === 'authorities' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                <div>
                  <h3 className="font-bold text-zinc-950 text-base">Indian Municipal Authorities & Sky-Sign Regulations</h3>
                  <p className="text-xs text-zinc-500">Local municipal corporation rules governing legal hoarding licenses</p>
                </div>
                <span className="text-xs font-mono font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-200">
                  {municipalAuthorities.length} Authorities
                </span>
              </div>

              <div className="divide-y divide-zinc-100">
                {municipalAuthorities.map((auth) => (
                  <div key={auth.code} className="py-4 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-orange-600 text-xs">{auth.code}</span>
                          <h4 className="font-bold text-zinc-900 text-sm">{auth.authority}</h4>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-100 text-zinc-700">
                            {auth.city}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-600 mt-1">{auth.regulation}</p>
                      </div>
                      <span className="text-xs font-mono text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                        {auth.licenseCycle}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-zinc-500 font-mono pt-1">
                      <span>Official Fee Schedule: <strong className="text-zinc-700">{auth.taxRate}</strong></span>
                      <span>Enforcement Desk: <a href={`mailto:${auth.contact}`} className="text-orange-600 hover:underline">{auth.contact}</a></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Category 4: Cities & Geographic Tiers */}
          {activeCategory === 'cities' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                <div>
                  <h3 className="font-bold text-zinc-950 text-base">Cities & Advertising Tiers</h3>
                  <p className="text-xs text-zinc-500">Tier definitions mapped to platform base commission and audience valuations</p>
                </div>
                <span className="text-xs font-mono font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-200">
                  {geoCities.length} Markets
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-zinc-200 text-zinc-400 uppercase font-mono text-[10px]">
                      <th className="py-2.5 font-bold">City Code</th>
                      <th className="py-2.5 font-bold">City / Market</th>
                      <th className="py-2.5 font-bold">State</th>
                      <th className="py-2.5 font-bold">Classification Tier</th>
                      <th className="py-2.5 font-bold">Population Base</th>
                      <th className="py-2.5 font-bold text-right">Network GMV Share</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {geoCities.map((c) => (
                      <tr key={c.code} className="hover:bg-zinc-50/70 transition-colors">
                        <td className="py-3.5 font-mono font-bold text-zinc-900">{c.code}</td>
                        <td className="py-3.5 font-bold text-zinc-900">{c.name}</td>
                        <td className="py-3.5 text-zinc-600">{c.state}</td>
                        <td className="py-3.5">
                          <span className="px-2 py-0.5 rounded bg-orange-100 text-orange-800 font-mono font-bold text-[10px]">
                            {c.tier}
                          </span>
                        </td>
                        <td className="py-3.5 font-mono text-zinc-500">{c.population}</td>
                        <td className="py-3.5 text-right font-mono font-bold text-emerald-700">{c.gmvShare}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Category 5: GST SAC Codes & Taxation */}
          {activeCategory === 'tax' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                <div>
                  <h3 className="font-bold text-zinc-950 text-base">Indian Goods & Services Tax (GST) SAC Classification</h3>
                  <p className="text-xs text-zinc-500">Statutory Service Accounting Codes (SAC) for outdoor and digital inventory / resource billing</p>
                </div>
                <span className="text-xs font-mono font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-200">
                  SAC Standards
                </span>
              </div>

              <div className="p-4 rounded-xl bg-orange-50 border border-orange-200 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                <div className="text-xs text-orange-950">
                  <p className="font-bold">Indian GST Mandate for Outdoor Advertising</p>
                  <p className="mt-0.5 leading-relaxed">
                    All media space bookings on SODAARS are cataloged under <strong>SAC 998361 (Advertising Services)</strong> with standard <strong>18% GST</strong> (9% CGST + 9% SGST for intrastate bookings, 18% IGST for interstate bookings). Quotation engines automatically compute these rates.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {taxCodes.map((tc) => (
                  <div key={tc.sac} className="p-4 rounded-xl border border-zinc-200 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-mono uppercase font-bold text-zinc-400">SAC Code</span>
                        <h4 className="text-lg font-bold text-zinc-950 font-mono mt-0.5">{tc.sac} — {tc.title}</h4>
                      </div>
                      <span className="px-2.5 py-1 rounded bg-zinc-100 text-zinc-800 font-mono text-xs font-bold">
                        {tc.gstRate}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-600">{tc.description}</p>
                    <div className="pt-1 text-[11px] font-mono text-zinc-500">
                      Tax Mechanism: <strong className="text-zinc-800">{tc.rcmStatus}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Category 6: Fabrication & Material Substrates */}
          {activeCategory === 'materials' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                <div>
                  <h3 className="font-bold text-zinc-950 text-base">Fabrication Materials & Printing Standards</h3>
                  <p className="text-xs text-zinc-500">Flex GSM weights, vinyl grades, and LED resolution specifications</p>
                </div>
                <span className="text-xs font-mono font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-200">
                  {materialSubstrates.length} Material Standards
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-zinc-200 text-zinc-400 uppercase font-mono text-[10px]">
                      <th className="py-2.5 font-bold">Material Code</th>
                      <th className="py-2.5 font-bold">Substrate Name</th>
                      <th className="py-2.5 font-bold">GSM Weight / Spec</th>
                      <th className="py-2.5 font-bold">Weather Durability</th>
                      <th className="py-2.5 font-bold text-right">Ideal Media Deployment</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {materialSubstrates.map((m) => (
                      <tr key={m.code} className="hover:bg-zinc-50/70 transition-colors">
                        <td className="py-3.5 font-mono font-bold text-orange-600">{m.code}</td>
                        <td className="py-3.5 font-bold text-zinc-900">{m.name}</td>
                        <td className="py-3.5 font-mono text-zinc-600">{m.gsm}</td>
                        <td className="py-3.5 text-zinc-600">{m.durability}</td>
                        <td className="py-3.5 text-right text-zinc-700 font-medium">{m.bestFor}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Add Master Data Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-zinc-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <h3 className="font-bold text-zinc-950 text-base">Add New Master Data Entry</h3>
              <button onClick={() => setShowAddModal(false)} className="text-zinc-400 hover:text-zinc-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-zinc-700 mb-1">Target Category</label>
                <select
                  value={activeCategory}
                  onChange={(e) => setActiveCategory(e.target.value as MasterCategory)}
                  className="w-full p-2.5 rounded-lg border border-zinc-300 focus:outline-none focus:border-orange-500 font-medium"
                >
                  <option value="formats">Asset Formats & Media Types</option>
                  <option value="illumination">Illumination Standards</option>
                  <option value="authorities">Municipal Authorities & By-Laws</option>
                  <option value="cities">Cities & Geo Tiers</option>
                  <option value="tax">GST SAC Codes</option>
                  <option value="materials">Fabrication Materials</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 mb-1">Entry Title / Name</label>
                <input
                  type="text"
                  placeholder="e.g. Center Median Kiosk"
                  className="w-full p-2.5 rounded-lg border border-zinc-300 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 mb-1">System Code</label>
                <input
                  type="text"
                  placeholder="e.g. FMT-KSK"
                  className="w-full p-2.5 rounded-lg border border-zinc-300 focus:outline-none focus:border-orange-500 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 mb-1">Technical Specification / Rule</label>
                <textarea
                  rows={2}
                  placeholder="Standard dimensions, regulatory clause or electrical requirements..."
                  className="w-full p-2.5 rounded-lg border border-zinc-300 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-zinc-100">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-2 rounded-lg text-zinc-600 hover:bg-zinc-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    alert('Entry saved to master data registry.');
                    setShowAddModal(false);
                  }}
                  className="px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-semibold"
                >
                  Save Master Record
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
