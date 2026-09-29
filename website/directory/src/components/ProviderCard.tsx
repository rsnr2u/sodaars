import Link from 'next/link';
import { ShieldCheck, MapPin, Layers, ArrowRight } from 'lucide-react';
import type { PublicProvider } from '@/lib/api';

interface ProviderCardProps {
  provider: PublicProvider;
}

export default function ProviderCard({ provider }: ProviderCardProps) {
  const cities = provider.operational_cities || [];

  return (
    <article className="group flex flex-col rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all duration-300">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3.5">
          {provider.logo_url ? (
            <img
              src={provider.logo_url}
              alt={provider.name}
              className="h-12 w-12 rounded-xl object-cover border border-slate-200"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-sky-500 font-extrabold text-white text-lg shadow-sm">
              {provider.name.charAt(0)}
            </div>
          )}
          <div>
            <Link href={`/providers/${provider.slug}`}>
              <h3 className="font-bold text-slate-900 text-base group-hover:text-indigo-600 transition-colors line-clamp-1">
                {provider.name}
              </h3>
            </Link>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Verified Outdoor Media Provider</span>
            </span>
          </div>
        </div>

        {typeof provider.active_resources_count === 'number' && (
          <div className="rounded-lg bg-slate-50 px-2.5 py-1 text-center border border-slate-200/60 shrink-0">
            <span className="text-xs font-black text-slate-900 block leading-tight">
              {provider.active_resources_count}
            </span>
            <span className="text-[10px] text-slate-500 font-medium">
              Sites
            </span>
          </div>
        )}
      </div>

      {provider.business_description && (
        <p className="mt-4 text-xs text-slate-600 line-clamp-2 leading-relaxed">
          {provider.business_description}
        </p>
      )}

      {/* Operational Cities */}
      {cities.length > 0 && (
        <div className="mt-4 flex items-center gap-1.5 flex-wrap">
          <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <span className="text-xs text-slate-500 font-medium">Coverage:</span>
          {cities.slice(0, 3).map((city) => (
            <span
              key={city}
              className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700"
            >
              {city}
            </span>
          ))}
          {cities.length > 3 && (
            <span className="text-[11px] text-slate-400 font-medium">
              +{cities.length - 3} more
            </span>
          )}
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
        <Link
          href={`/providers/${provider.slug}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 group-hover:text-indigo-700 transition"
        >
          <span>View Profile & Inventory</span>
          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </article>
  );
}
