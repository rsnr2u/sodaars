'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { MarketplaceResource } from '@/types/marketplace';
import { ResourceCard } from '@/components/catalog/ResourceCard';
import { GuestBookingModal } from '@/components/booking/GuestBookingModal';

interface HomeFeaturedSectionProps {
  resources: MarketplaceResource[];
}

export const HomeFeaturedSection: React.FC<HomeFeaturedSectionProps> = ({ resources }) => {
  const [selectedResource, setSelectedResource] = useState<MarketplaceResource | null>(null);

  return (
    <section className="py-16 sm:py-20 px-4 sm:px-8 max-w-7xl mx-auto font-sans">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <h2 className="text-2xl sm:text-3xl font-semibold text-zinc-900 tracking-tight">
            Featured Hoardings & Digital Screens
          </h2>
          <p className="text-zinc-600 text-sm mt-1 max-w-2xl font-normal">
            Pre-audited high-impact billboard structures at major flyovers, junctions, and arterial corridors with certified traffic counts.
          </p>
        </div>

        <Link
          href="/explore"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold transition-all shadow-xs self-start md:self-auto shrink-0"
        >
          <span>Explore All 1,240+ Locations</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Grid of Resource Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.slice(0, 6).map((resource) => (
          <ResourceCard
            key={resource.id}
            resource={resource}
            onQuickBook={(item) => setSelectedResource(item)}
          />
        ))}
      </div>

      {/* Quick Booking Modal */}
      {selectedResource && (
        <GuestBookingModal
          resource={selectedResource}
          onClose={() => setSelectedResource(null)}
        />
      )}
    </section>
  );
};
