import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MOCK_MARKETPLACE_RESOURCES, POPULAR_CITIES } from '@/data/mockMarketplaceData';
import { CityLandingView } from '@/components/catalog/CityLandingView';
import { slugify } from '@/lib/utils';

interface PageProps {
  params: Promise<{ city: string }>;
}

function resolveCityFromSlug(cityParam: string) {
  if (!cityParam) return null;
  // Support both "hoardings-in-mumbai" and "mumbai"
  const clean = cityParam.toLowerCase().replace(/^hoardings-in-/, '');
  return (
    POPULAR_CITIES.find(
      (c) => slugify(c.name) === clean || c.name.toLowerCase() === clean
    ) || null
  );
}

export async function generateStaticParams() {
  return POPULAR_CITIES.map((c) => ({
    city: `hoardings-in-${slugify(c.name)}`,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { city } = await params;
  const matchedCity = resolveCityFromSlug(city);

  if (!matchedCity) {
    return {
      title: 'City Hoardings | SODAARS Marketplace',
    };
  }

  const title = `Hoardings & Billboards in ${matchedCity.name} | SODAARS Marketplace`;
  const description = `Discover and book prime outdoor advertising hoardings, unipoles, bridge gantries, and digital LED screens across ${matchedCity.name}, ${matchedCity.state}. Direct from Verified Partners with transparent pricing.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [matchedCity.image],
    },
  };
}

export default async function CityLandingPage({ params }: PageProps) {
  const { city } = await params;
  const matchedCity = resolveCityFromSlug(city);

  if (!matchedCity) {
    notFound();
  }

  const cityResources = MOCK_MARKETPLACE_RESOURCES.filter(
    (r) => r.location.city.toLowerCase() === matchedCity.name.toLowerCase()
  );

  return (
    <CityLandingView
      cityName={matchedCity.name}
      stateName={matchedCity.state}
      resources={cityResources}
      averagePriceText={matchedCity.avgPrice}
    />
  );
}

