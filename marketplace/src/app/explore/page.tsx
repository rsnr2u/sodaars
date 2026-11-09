import { Suspense } from 'react';
import type { Metadata } from 'next';
import { ExploreCatalogClient } from '@/components/catalog/ExploreCatalogClient';

export const metadata: Metadata = {
  title: 'Explore All Hoardings & Outdoor Media Inventory | BOOKHOARDINGS.COM',
  description:
    'Search and filter 1,240+ verified billboards, unipoles, bridge gantries, and digital screens across Mumbai, Bengaluru, Delhi NCR, Hyderabad, and Pune. Compare rates, daily traffic, and Day/Night visibility.',
  openGraph: {
    title: 'Explore All Hoardings & Outdoor Media | BOOKHOARDINGS.COM',
    description:
      'Filter prime billboard inventory by city, format, illumination, and monthly budget. Instant guest booking inquiry.',
  },
};

export default function ExplorePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#fafafc] flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-3 border-[#B00020] border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-sans text-zinc-500 font-semibold">
              Loading verified BOOKHOARDINGS inventory...
            </p>
          </div>
        </div>
      }
    >
      <div className="min-h-screen bg-[#fafafc]">
        <ExploreCatalogClient showHeroHeader={true} />
      </div>
    </Suspense>
  );
}
