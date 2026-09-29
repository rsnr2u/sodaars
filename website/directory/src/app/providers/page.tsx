import Link from 'next/link';
import { Search, Users, ShieldCheck, ArrowLeft } from 'lucide-react';
import { getProviders } from '@/lib/api';
import ProviderCard from '@/components/ProviderCard';

interface ProvidersPageProps {
  searchParams: Promise<{
    search?: string;
    city?: string;
    page?: string;
  }>;
}

export const revalidate = 60;

export const metadata = {
  title: 'Verified Outdoor Advertising Providers',
  description: 'Browse verified outdoor advertising providers, hoarding operators, and media agencies across India.',
};

export default async function ProvidersPage({ searchParams }: ProvidersPageProps) {
  const resolvedParams = await searchParams;
  const currentSearch = resolvedParams.search || '';
  const currentCity = resolvedParams.city || '';
  const currentPage = resolvedParams.page || '1';

  const apiParams: Record<string, string> = { page: currentPage };
  if (currentSearch) apiParams.search = currentSearch;
  if (currentCity) apiParams.city = currentCity;

  const res = await getProviders(apiParams);
  const providers = res.data?.items || [];
  const pagination = res.data?.pagination || { total: 0, per_page: 12, current_page: 1, last_page: 1 };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Breadcrumb / Top Bar */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Home</span>
        </Link>
      </div>

      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">
          <ShieldCheck className="h-4 w-4" />
          <span>Verified Network Directory</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Verified Outdoor Advertising Providers
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-2xl">
          Connect directly with verified operators of outdoor advertising assets. Every provider listed in this directory has undergone verification by the SODAARS platform.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="rounded-2xl bg-white p-4 border border-slate-200/80 shadow-xs mb-8">
        <form action="/providers" method="GET" className="grid grid-cols-1 gap-3 sm:grid-cols-12">
          <div className="relative sm:col-span-7">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              name="search"
              defaultValue={currentSearch}
              placeholder="Search provider business name or operational area..."
              className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-4 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
            />
          </div>

          <div className="sm:col-span-3">
            <input
              type="text"
              name="city"
              defaultValue={currentCity}
              placeholder="City filter (e.g. Vijayawada)"
              className="w-full rounded-xl border border-slate-300 py-2.5 px-3.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
            />
          </div>

          <div className="sm:col-span-2">
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center rounded-xl bg-indigo-600 py-2.5 px-4 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 transition active:scale-95"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      {/* Providers Grid */}
      {providers.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 p-16 text-center bg-white my-8">
          <Users className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-base font-bold text-slate-900">No Providers Found</h3>
          <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
            No verified providers matched your search criteria. Try removing filters to view all operators.
          </p>
          <div className="mt-6">
            <Link
              href="/providers"
              className="rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 transition"
            >
              Reset Filters
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {providers.map((provider) => (
            <ProviderCard key={provider.slug} provider={provider} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.last_page > 1 && (
        <div className="mt-12 flex items-center justify-center gap-2">
          {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map((pageNum) => {
            const isActive = pageNum === pagination.current_page;
            return (
              <Link
                key={pageNum}
                href={{
                  pathname: '/providers',
                  query: { ...resolvedParams, page: pageNum.toString() },
                }}
                className={`h-9 w-9 rounded-xl flex items-center justify-center text-xs font-bold transition ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {pageNum}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
