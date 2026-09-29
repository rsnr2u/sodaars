import Link from 'next/link';
import { MapPin, Maximize2, ShieldCheck, Sparkles, Building2 } from 'lucide-react';
import type { PublicResourceItem } from '@/lib/api';

interface ResourceCardProps {
  resource: PublicResourceItem;
}

export default function ResourceCard({ resource }: ResourceCardProps) {
  // Use Stage 9 thumbnail or display URL with safe fallback
  const imageUrl = resource.primary_media?.thumbnail_url || resource.primary_media?.display_url || '/placeholder-hoarding.svg';
  const altText = resource.primary_media?.alt_text || resource.name;

  const isDigital = resource.category === 'DIGITAL';

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all duration-300">
      {/* Media Image Container */}
      <Link href={`/resources/${resource.slug}`} className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 block">
        <img
          src={imageUrl}
          alt={altText}
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Badges on Top of Image */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold tracking-wide shadow-sm backdrop-blur-md ${
            isDigital
              ? 'bg-purple-600/90 text-white'
              : 'bg-slate-900/80 text-white'
          }`}>
            {isDigital && <Sparkles className="h-3 w-3" />}
            {resource.resource_type.replace('_', ' ')}
          </span>

          {resource.illumination_type && (
            <span className="inline-flex items-center rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-slate-700 backdrop-blur-md shadow-sm">
              {resource.illumination_type.replace('_', ' ')}
            </span>
          )}
        </div>

        {/* Dimensions Pill Bottom Right */}
        <div className="absolute bottom-3 right-3 rounded-lg bg-slate-900/80 px-2 py-1 text-[11px] font-semibold text-white backdrop-blur-md shadow-sm flex items-center gap-1">
          <Maximize2 className="h-3 w-3 text-slate-300" />
          <span>{resource.dimensions.width}′ × {resource.dimensions.height}′ ({resource.dimensions.area_sqft} sq.ft)</span>
        </div>
      </Link>

      {/* Card Body */}
      <div className="flex flex-1 flex-col p-5">
        {/* Location & Title */}
        <div className="mb-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 mb-1.5">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span>{resource.location.area}, {resource.location.city}</span>
          </div>

          <Link href={`/resources/${resource.slug}`}>
            <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-indigo-600 transition-colors line-clamp-2">
              {resource.name}
            </h3>
          </Link>
          <span className="text-[11px] font-mono font-medium text-slate-500 mt-0.5 block">
            ID: {resource.code}
          </span>
        </div>

        {/* Provider Info */}
        <div className="mt-auto border-t border-slate-100 pt-3.5 mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-600 uppercase border border-slate-200">
              {resource.provider.name.charAt(0)}
            </div>
            <span className="text-xs font-medium text-slate-700 line-clamp-1 max-w-[170px]">
              {resource.provider.name}
            </span>
          </div>
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
            <ShieldCheck className="h-3 w-3" />
            <span>Verified</span>
          </span>
        </div>

        {/* Indicative Rate Box */}
        <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
          <div className="flex items-baseline justify-between">
            <span className="text-[10px] font-bold tracking-wider uppercase text-slate-500">
              {resource.indicative_rate.display_label}
            </span>
            <span className="text-sm font-extrabold text-slate-900">
              {resource.indicative_rate.formatted}
            </span>
          </div>
          <p className="mt-1 text-[10px] text-slate-600 leading-tight">
            {resource.indicative_rate.disclaimer}
          </p>
        </div>

        {/* Action Button */}
        <div className="mt-4">
          <Link
            href={`/resources/${resource.slug}`}
            className="w-full inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 transition active:scale-[0.98]"
          >
            Inspect Inventory & Specs
          </Link>
        </div>
      </div>
    </article>
  );
}
