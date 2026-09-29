import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  MapPin,
  Maximize2,
  Compass,
  Zap,
  Sparkles,
  ShieldCheck,
  Phone,
  Mail,
  Globe,
  Building,
  ArrowLeft,
  Share2,
} from 'lucide-react';
import { getResourceDetail } from '@/lib/api';
import DetailClientWrapper from './DetailClientWrapper';

interface ResourceDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const revalidate = 30;

export async function generateMetadata({ params }: ResourceDetailPageProps) {
  const { slug } = await params;
  const res = await getResourceDetail(slug);
  if (!res.success || !res.data) {
    return { title: 'Resource Not Found' };
  }
  const item = res.data;
  return {
    title: `${item.name} (${item.code}) in ${item.location.city}`,
    description: item.description || `Outdoor advertising hoarding/screen in ${item.location.area}, ${item.location.city}. Dimensions: ${item.dimensions.width}ft x ${item.dimensions.height}ft.`,
  };
}

export default async function ResourceDetailPage({ params }: ResourceDetailPageProps) {
  const { slug } = await params;
  const res = await getResourceDetail(slug);

  if (!res.success || !res.data) {
    notFound();
  }

  const resource = res.data;
  const isDigital = resource.category === 'DIGITAL';

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Back breadcrumb */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/explore"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to All Inventory</span>
        </Link>

        <span className="text-xs font-mono font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
          SITE CODE: {resource.code}
        </span>
      </div>

      {/* Main Grid: Left Gallery & Specs; Right Provider & Rate Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header Title & Badges */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${
                isDigital ? 'bg-purple-600 text-white' : 'bg-slate-900 text-white'
              }`}>
                {isDigital && <Sparkles className="h-3.5 w-3.5" />}
                {resource.resource_type.replace('_', ' ')}
              </span>

              {resource.illumination_type && (
                <span className="rounded-full bg-slate-100 border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700">
                  {resource.illumination_type.replace('_', ' ')}
                </span>
              )}

              <span className="rounded-full bg-indigo-50 border border-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
                {resource.category}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {resource.name}
            </h1>

            <div className="mt-2 flex items-center gap-2 text-xs sm:text-sm text-slate-600">
              <MapPin className="h-4 w-4 text-indigo-600 shrink-0" />
              <span>{resource.location.area}, {resource.location.city}, {resource.location.state}</span>
              {resource.location.landmark && (
                <span className="text-slate-400">({resource.location.landmark})</span>
              )}
            </div>
          </div>

          {/* Client-Side Photo Gallery Interactive Component */}
          <DetailClientWrapper resource={resource} />

          {/* Technical Specifications */}
          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs">
            <h3 className="text-base font-extrabold text-slate-900 mb-6 flex items-center gap-2">
              <Maximize2 className="h-5 w-5 text-indigo-600" />
              <span>Physical & Technical Specifications</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-xs">
              <div>
                <span className="text-slate-400 font-medium block">Width × Height</span>
                <span className="font-extrabold text-slate-900 text-sm mt-0.5 block">
                  {resource.dimensions.width}′ × {resource.dimensions.height}′
                </span>
              </div>

              <div>
                <span className="text-slate-400 font-medium block">Total Calculated Area</span>
                <span className="font-extrabold text-indigo-600 text-sm mt-0.5 block">
                  {resource.dimensions.area_sqft} sq.ft
                </span>
              </div>

              <div>
                <span className="text-slate-400 font-medium block">Illumination</span>
                <span className="font-bold text-slate-800 text-sm mt-0.5 block">
                  {resource.illumination_type ? resource.illumination_type.replace('_', ' ') : 'Standard'}
                </span>
              </div>

              {resource.face_label && (
                <div>
                  <span className="text-slate-400 font-medium block">Face Placement</span>
                  <span className="font-bold text-slate-800 text-sm mt-0.5 block">
                    {resource.face_label}
                  </span>
                </div>
              )}

              {resource.direction && (
                <div>
                  <span className="text-slate-400 font-medium block">Facing Direction</span>
                  <span className="font-bold text-slate-800 text-sm mt-0.5 block">
                    {resource.direction}
                  </span>
                </div>
              )}

              {resource.traffic_flow && (
                <div>
                  <span className="text-slate-400 font-medium block">Traffic Characteristics</span>
                  <span className="font-bold text-slate-800 text-sm mt-0.5 block">
                    {resource.traffic_flow}
                  </span>
                </div>
              )}

              {resource.operating_hours?.from && (
                <div>
                  <span className="text-slate-400 font-medium block">Operating Hours</span>
                  <span className="font-bold text-slate-800 text-sm mt-0.5 block">
                    {resource.operating_hours.from} – {resource.operating_hours.to}
                  </span>
                </div>
              )}
            </div>

            {/* Digital Specs (if DOOH) */}
            {isDigital && resource.digital_specs && (
              <div className="mt-8 pt-6 border-t border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-purple-700 mb-4 flex items-center gap-1.5">
                  <Zap className="h-4 w-4" />
                  <span>DOOH Screen Hardware Specifications</span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-xs">
                  {resource.digital_specs.resolution && (
                    <div>
                      <span className="text-slate-400 font-medium block">Resolution</span>
                      <span className="font-bold text-slate-800 text-sm mt-0.5 block">
                        {resource.digital_specs.resolution}
                      </span>
                    </div>
                  )}
                  {resource.digital_specs.pixel_pitch && (
                    <div>
                      <span className="text-slate-400 font-medium block">Pixel Pitch</span>
                      <span className="font-bold text-slate-800 text-sm mt-0.5 block">
                        {resource.digital_specs.pixel_pitch}
                      </span>
                    </div>
                  )}
                  {resource.digital_specs.slot_duration_seconds && (
                    <div>
                      <span className="text-slate-400 font-medium block">Slot Duration</span>
                      <span className="font-bold text-slate-800 text-sm mt-0.5 block">
                        {resource.digital_specs.slot_duration_seconds} seconds
                      </span>
                    </div>
                  )}
                  {resource.digital_specs.total_slots && (
                    <div>
                      <span className="text-slate-400 font-medium block">Total Loop Slots</span>
                      <span className="font-bold text-slate-800 text-sm mt-0.5 block">
                        {resource.digital_specs.total_slots} Slots
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Description */}
            {resource.description && (
              <div className="mt-8 pt-6 border-t border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Site Description & Visibility Insights
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {resource.description}
                </p>
              </div>
            )}
          </div>

          {/* Location Map Pin */}
          {resource.location.latitude != null && resource.location.longitude != null && (
            <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs">
              <h3 className="text-base font-extrabold text-slate-900 mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-indigo-600" />
                <span>Geographical Site Location</span>
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Exact coordinates: {Number(resource.location.latitude).toFixed(4)}, {Number(resource.location.longitude).toFixed(4)}
              </p>
              <div className="h-[280px] w-full rounded-2xl overflow-hidden border border-slate-200">
                <iframe
                  title="Site Map Pin"
                  width="100%"
                  height="100%"
                  className="border-0 w-full h-full"
                  loading="lazy"
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${Number(resource.location.longitude) - 0.01}%2C${Number(resource.location.latitude) - 0.01}%2C${Number(resource.location.longitude) + 0.01}%2C${Number(resource.location.latitude) + 0.01}&layer=mapnik&marker=${Number(resource.location.latitude)}%2C${Number(resource.location.longitude)}`}
                />
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar: Indicative Rate Card & Provider Card */}
        <div className="space-y-6">
          {/* Indicative Rate Card Box */}
          <div className="sticky top-24 rounded-3xl border-2 border-indigo-100 bg-white p-6 sm:p-7 shadow-lg shadow-indigo-100/40">
            <div className="mb-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                {resource.indicative_rate.display_label}
              </span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {resource.indicative_rate.formatted}
                </span>
              </div>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                {resource.indicative_rate.disclaimer}
              </p>
            </div>

            {/* Direct Provider Inquiry CTA (Handled via Client Component wrapper) */}
            <div className="pt-2">
              <span className="text-[11px] text-slate-500 font-medium block text-center mb-3">
                Zero booking fees • Direct provider connectivity
              </span>
            </div>

            {/* Verified Provider Business Card */}
            <div className="mt-6 pt-6 border-t border-slate-100">
              <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 uppercase tracking-wider mb-2">
                <ShieldCheck className="h-4 w-4" />
                <span>Verified Inventory Owner</span>
              </div>

              <h4 className="font-extrabold text-slate-900 text-base">
                {resource.provider.name}
              </h4>

              {resource.provider.business_description && (
                <p className="mt-2 text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {resource.provider.business_description}
                </p>
              )}

              {/* Public Business Contact Info (Strictly public business details) */}
              <div className="mt-4 space-y-2 text-xs text-slate-700 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                {resource.provider.business_phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
                    <span className="font-semibold">{resource.provider.business_phone}</span>
                  </div>
                )}

                {resource.provider.business_email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
                    <span className="font-medium text-slate-600">{resource.provider.business_email}</span>
                  </div>
                )}

                {resource.provider.website && (
                  <div className="flex items-center gap-2">
                    <Globe className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
                    <a
                      href={resource.provider.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:underline line-clamp-1"
                    >
                      {resource.provider.website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                )}
              </div>

              <div className="mt-5">
                <Link
                  href={`/providers/${resource.provider.slug}`}
                  className="w-full inline-flex items-center justify-center rounded-xl bg-slate-100 px-4 py-2.5 text-xs font-bold text-slate-800 hover:bg-slate-200 transition"
                >
                  View All Sites by This Provider
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Structured Data: Schema.org Place (Physical Advertising Asset offered by Provider) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Place',
            name: `${resource.name} (${resource.code})`,
            description: resource.description || `Outdoor advertising hoarding/screen in ${resource.location.area}, ${resource.location.city}.`,
            address: {
              '@type': 'PostalAddress',
              streetAddress: resource.location.address || resource.location.area,
              addressLocality: resource.location.city,
              addressRegion: resource.location.state,
              postalCode: resource.location.pincode || undefined,
              addressCountry: 'India',
            },
            geo: resource.location.latitude && resource.location.longitude ? {
              '@type': 'GeoCoordinates',
              latitude: resource.location.latitude,
              longitude: resource.location.longitude,
            } : undefined,
            containedInPlace: {
              '@type': 'Organization',
              name: resource.provider.name,
              url: resource.provider.website || undefined,
            },
          }),
        }}
      />
    </div>
  );
}
