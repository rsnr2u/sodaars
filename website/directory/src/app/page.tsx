import Link from 'next/link';
import { Compass, Users, Search, ShieldCheck, MapPin, Sparkles, Building, ArrowRight } from 'lucide-react';
import { getDirectoryOverview } from '@/lib/api';
import ResourceCard from '@/components/ResourceCard';
import ProviderCard from '@/components/ProviderCard';

export const revalidate = 60;

export default async function HomePage() {
  const overviewRes = await getDirectoryOverview();
  const overview = overviewRes.data;

  const counts = overview?.counts || {
    verified_providers: 0,
    active_resources: 0,
    active_locations: 0,
    covered_cities: 0,
  };

  const featuredResources = overview?.featured_resources || [];
  const recentProviders = overview?.recent_verified_providers || [];
  const featuredCities = overview?.featured_cities || [];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950 py-20 px-4 sm:px-6 lg:px-8 text-white">
        {/* Subtle grid backdrop */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e1b4b15_1px,transparent_1px),linear-gradient(to_bottom,#1e1b4b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="relative mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 border border-indigo-400/20 px-4 py-1.5 text-xs font-semibold text-indigo-300 backdrop-blur-md mb-6 animate-pulse">
            <ShieldCheck className="h-4 w-4 text-indigo-400" />
            <span>Public Provider Discovery Directory & Inventory Engine</span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-white">
            Discover Outdoor Advertising <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-sky-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent">
              Directly from Verified Providers
            </span>
          </h1>

          <p className="mt-5 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Search real hoardings, unipoles, billboards, and DOOH screens across cities. Inspect visual proofs, verified dimensions, and indicative rates with zero intermediary markups.
          </p>

          {/* Search Box */}
          <div className="mt-10 max-w-3xl mx-auto rounded-2xl bg-white/10 p-2.5 backdrop-blur-xl border border-white/15 shadow-2xl">
            <form action="/explore" method="GET" className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1 flex items-center">
                <Search className="absolute left-4 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  name="search"
                  placeholder="Search landmark, area, or resource code (e.g. Benz Circle, NH-16)..."
                  className="w-full rounded-xl bg-white px-4 py-3 pl-11 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-inner"
                />
              </div>

              <div className="flex gap-2">
                <select
                  name="city"
                  className="rounded-xl bg-white px-4 py-3 text-xs sm:text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                >
                  <option value="">All Cities</option>
                  {featuredCities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-indigo-500 transition active:scale-95 shrink-0"
                >
                  <Compass className="h-4 w-4" />
                  <span>Explore</span>
                </button>
              </div>
            </form>
          </div>

          {/* Quick Hub Badges */}
          {featuredCities.length > 0 && (
            <div className="mt-6 flex items-center justify-center gap-2 flex-wrap text-xs text-slate-400">
              <span className="font-semibold text-slate-300">Popular Hubs:</span>
              {featuredCities.map((city) => (
                <Link
                  key={city}
                  href={`/explore?city=${encodeURIComponent(city)}`}
                  className="rounded-full bg-white/5 px-3 py-1 text-slate-300 hover:bg-white/10 hover:text-white border border-white/10 transition"
                >
                  {city}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Network Metrics Strip */}
      <section className="border-y border-slate-200 bg-white py-8 px-4 sm:px-6 lg:px-8 shadow-xs">
        <div className="mx-auto max-w-7xl grid grid-cols-2 gap-6 sm:grid-cols-4 text-center divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
          <div className="pt-4 sm:pt-0">
            <span className="text-3xl font-black text-slate-900 block tracking-tight">
              {counts.verified_providers}
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 mt-1 block">
              Verified Providers
            </span>
          </div>

          <div className="pt-4 sm:pt-0">
            <span className="text-3xl font-black text-indigo-600 block tracking-tight">
              {counts.active_resources}
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 mt-1 block">
              Live Hoardings & Screens
            </span>
          </div>

          <div className="pt-4 sm:pt-0">
            <span className="text-3xl font-black text-slate-900 block tracking-tight">
              {counts.active_locations}
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 mt-1 block">
              Key Junctions & Spots
            </span>
          </div>

          <div className="pt-4 sm:pt-0">
            <span className="text-3xl font-black text-emerald-600 block tracking-tight">
              {counts.covered_cities}
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 mt-1 block">
              Operational Cities
            </span>
          </div>
        </div>
      </section>

      {/* Featured Outdoor Inventory */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">
              <Sparkles className="h-4 w-4" />
              <span>Real Inventory Showcase</span>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
              Featured Outdoor Media Assets
            </h2>
            <p className="mt-1 text-xs text-slate-500 max-w-xl">
              High-impact billboards, unipoles, and DOOH digital screens available directly from verified operators.
            </p>
          </div>

          <Link
            href="/explore"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition"
          >
            <span>View All Inventory</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {featuredResources.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center text-slate-500 bg-white">
            <Building className="h-10 w-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-medium">No verified public inventory available at this moment.</p>
            <p className="text-xs text-slate-400 mt-1">Providers are actively onboarding their hoardings and screens.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {featuredResources.map((resource) => (
              <ResourceCard key={resource.uuid} resource={resource} />
            ))}
          </div>
        )}
      </section>

      {/* Verified Providers Section */}
      <section className="bg-slate-100/60 py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">
                <Users className="h-4 w-4" />
                <span>Media Operators</span>
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
                Verified Outdoor Advertising Providers
              </h2>
              <p className="mt-1 text-xs text-slate-500 max-w-xl">
                Partner directly with verified owners of outdoor media infrastructure.
              </p>
            </div>

            <Link
              href="/providers"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition"
            >
              <span>View All Providers</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {recentProviders.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center text-slate-500 bg-white">
              <Users className="h-10 w-10 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-medium">No public verified providers registered yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {recentProviders.map((provider) => (
                <ProviderCard key={provider.slug} provider={provider} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How It Works Pillars */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
            A Transparent Outdoor Media Discovery Model
          </h2>
          <p className="mt-2 text-xs text-slate-500">
            SODAARS eliminates opaque brokerage networks by giving you direct visibility and direct contact with verified media owners.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 border border-slate-200/80 shadow-xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-sm mb-4 border border-indigo-100">
              1
            </div>
            <h3 className="font-bold text-slate-900 text-base">Explore Verified Inventory</h3>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              Filter hoardings by city, area, illumination type, and exact square footage. Inspect actual day/night site photos powered by the Stage 9 Media Engine.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 border border-slate-200/80 shadow-xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-sm mb-4 border border-indigo-100">
              2
            </div>
            <h3 className="font-bold text-slate-900 text-base">Review Indicative Rate Cards</h3>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              Assess realistic ballpark monthly rates directly from the provider. No surprises or disguised broker markups.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 border border-slate-200/80 shadow-xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-sm mb-4 border border-indigo-100">
              3
            </div>
            <h3 className="font-bold text-slate-900 text-base">Direct Provider Connection</h3>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              Send your campaign requirements directly to the provider&apos;s Lead Inbox. Receive direct quotes, negotiable terms, and contract directly with the operator.
            </p>
          </div>
        </div>
      </section>

      {/* Provider Call to Action */}
      <section className="bg-slate-900 text-white py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 block mb-1">
              For Outdoor Media Operators
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold">
              Run Your Outdoor Media Business with SODAARS
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-400 max-w-xl">
              Manage inventory, availability, visual proofs, and staff. Showcase your inventory to thousands of media planners on the SODAARS Public Directory.
            </p>
          </div>

          <a
            href="http://localhost:5173/register"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl bg-indigo-600 px-6 py-3.5 text-xs font-bold text-white shadow-lg hover:bg-indigo-500 transition active:scale-95 shrink-0"
          >
            Get Started as a Provider
          </a>
        </div>
      </section>

      {/* Structured Data: Schema.org WebSite */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'SODAARS Outdoor Advertising Discovery Directory',
            url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
            description: 'Public discovery directory connecting media planners directly with verified outdoor advertising providers across India.',
            potentialAction: {
              '@type': 'SearchAction',
              target: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/explore?search={search_term_string}`,
              'query-input': 'required name=search_term_string',
            },
          }),
        }}
      />
    </div>
  );
}
