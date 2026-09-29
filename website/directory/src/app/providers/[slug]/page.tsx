import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  ShieldCheck,
  MapPin,
  Phone,
  Mail,
  Globe,
  Building2,
  ArrowLeft,
  Layers,
} from 'lucide-react';
import { getProviderProfile, getProviderInventory } from '@/lib/api';
import ResourceCard from '@/components/ResourceCard';
import ProviderClientWrapper from './ProviderClientWrapper';

interface ProviderProfilePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const revalidate = 60;

export async function generateMetadata({ params }: ProviderProfilePageProps) {
  const { slug } = await params;
  const res = await getProviderProfile(slug);
  if (!res.success || !res.data) {
    return { title: 'Provider Not Found' };
  }
  const provider = res.data;
  return {
    title: `${provider.name} | Verified Outdoor Advertising Provider`,
    description: provider.business_description || `Verified outdoor advertising provider operating in ${provider.operational_cities.join(', ')}.`,
  };
}

export default async function ProviderProfilePage({ params }: ProviderProfilePageProps) {
  const { slug } = await params;
  const [profileRes, inventoryRes] = await Promise.all([
    getProviderProfile(slug),
    getProviderInventory(slug),
  ]);

  if (!profileRes.success || !profileRes.data) {
    notFound();
  }

  const provider = profileRes.data;
  const inventory = inventoryRes.data?.items || [];
  const totalSites = inventoryRes.data?.pagination?.total || inventory.length;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Back button */}
      <div className="mb-6">
        <Link
          href="/providers"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Verified Providers</span>
        </Link>
      </div>

      {/* Provider Hero Card */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-10 shadow-xs mb-10">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex items-start gap-5">
            {provider.logo_url ? (
              <img
                src={provider.logo_url}
                alt={provider.name}
                className="h-20 w-20 rounded-2xl object-cover border border-slate-200 shadow-sm"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-sky-500 font-extrabold text-white text-3xl shadow-sm">
                {provider.name.charAt(0)}
              </div>
            )}

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Verified Media Operator</span>
                </span>
                {provider.verified_at && (
                  <span className="text-[11px] text-slate-400">
                    Verified {new Date(provider.verified_at).toLocaleDateString()}
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {provider.name}
              </h1>

              {/* Operational Cities */}
              {provider.operational_cities?.length > 0 && (
                <div className="mt-2 flex items-center gap-1.5 flex-wrap text-xs text-slate-600">
                  <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span className="font-semibold text-slate-700">Operational Hubs:</span>
                  {provider.operational_cities.map((city) => (
                    <span key={city} className="rounded-md bg-slate-100 px-2 py-0.5 font-medium text-slate-700">
                      {city}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Client Wrapper with Contact Trigger */}
          <ProviderClientWrapper provider={provider} />
        </div>

        {/* Bio */}
        {provider.business_description && (
          <div className="mt-6 pt-6 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              About the Media Company
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-4xl">
              {provider.business_description}
            </p>
          </div>
        )}

        {/* Public Business Details */}
        <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          {provider.business_phone && (
            <div className="flex items-center gap-2.5 rounded-xl bg-slate-50 p-3 border border-slate-100">
              <Phone className="h-4 w-4 text-indigo-600 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">Business Phone</span>
                <span className="font-bold text-slate-800">{provider.business_phone}</span>
              </div>
            </div>
          )}

          {provider.business_email && (
            <div className="flex items-center gap-2.5 rounded-xl bg-slate-50 p-3 border border-slate-100">
              <Mail className="h-4 w-4 text-indigo-600 shrink-0" />
              <div className="overflow-hidden">
                <span className="text-[10px] text-slate-400 block font-medium">Business Email</span>
                <span className="font-bold text-slate-800 truncate block">{provider.business_email}</span>
              </div>
            </div>
          )}

          {provider.website && (
            <div className="flex items-center gap-2.5 rounded-xl bg-slate-50 p-3 border border-slate-100">
              <Globe className="h-4 w-4 text-indigo-600 shrink-0" />
              <div className="overflow-hidden">
                <span className="text-[10px] text-slate-400 block font-medium">Official Website</span>
                <a
                  href={provider.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-indigo-600 hover:underline truncate block"
                >
                  {provider.website.replace(/^https?:\/\//, '')}
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Inventory Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <Layers className="h-5 w-5 text-indigo-600" />
              <span>Advertising Inventory ({totalSites})</span>
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Explore active hoardings, billboards, and digital screens managed by {provider.name}.
            </p>
          </div>
        </div>

        {inventory.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 p-12 text-center bg-white my-6">
            <Layers className="h-10 w-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-medium text-slate-600">No active inventory listed publicly at this time.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {inventory.map((resource) => (
              <ResourceCard key={resource.uuid} resource={resource} />
            ))}
          </div>
        )}
      </div>

      {/* Structured Data: Schema.org Organization */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: provider.name,
            description: provider.business_description || undefined,
            url: provider.website || undefined,
            telephone: provider.business_phone || undefined,
            email: provider.business_email || undefined,
            address: provider.business_address ? {
              '@type': 'PostalAddress',
              streetAddress: provider.business_address.address || undefined,
              addressLocality: provider.business_address.city || undefined,
              addressRegion: provider.business_address.state || undefined,
              postalCode: provider.business_address.pincode || undefined,
              addressCountry: provider.business_address.country || 'India',
            } : undefined,
          }),
        }}
      />
    </div>
  );
}
