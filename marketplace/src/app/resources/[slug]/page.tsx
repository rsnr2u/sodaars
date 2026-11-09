import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MOCK_MARKETPLACE_RESOURCES } from '@/data/mockMarketplaceData';
import { ResourceDetailView } from '@/components/catalog/ResourceDetailView';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return MOCK_MARKETPLACE_RESOURCES.map((resource) => ({
    slug: resource.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const resource = MOCK_MARKETPLACE_RESOURCES.find((r) => r.slug === slug);

  if (!resource) {
    return {
      title: 'Hoarding Not Found',
    };
  }

  const title = `${resource.name} - ${resource.location.city} | SODAARS OOH Marketplace`;
  const description = `Book ${resource.name} at ${resource.location.landmark}, ${resource.location.area}, ${resource.location.city}. Size: ${resource.widthFt}x${resource.heightFt} ft (${resource.totalSqFt} sq.ft), ${resource.illumination}. Daily traffic: ${resource.trafficDwellDaily}. Verified Partner.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: resource.primaryPhotoUrl,
          width: 1200,
          height: 630,
          alt: resource.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [resource.primaryPhotoUrl],
    },
  };
}

export default async function ResourceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const resource = MOCK_MARKETPLACE_RESOURCES.find((r) => r.slug === slug);

  if (!resource) {
    notFound();
  }

  const related = MOCK_MARKETPLACE_RESOURCES.filter(
    (r) => r.location.city === resource.location.city && r.id !== resource.id
  ).slice(0, 3);

  // Schema.org Structured Data for Google Rich Snippets
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: resource.name,
    image: [resource.primaryPhotoUrl, ...(resource.nightPhotoUrl ? [resource.nightPhotoUrl] : [])],
    description: resource.description,
    sku: resource.id,
    brand: {
      '@type': 'Brand',
      name: 'SODAARS Network',
    },
    offers: {
      '@type': 'Offer',
      url: `http://localhost:3000/resources/${resource.slug}`,
      priceCurrency: 'INR',
      price: resource.marketplacePrice,
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'Verified Partner',
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: resource.rating,
      reviewCount: resource.reviewCount,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: resource.location.latitude,
      longitude: resource.location.longitude,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ResourceDetailView resource={resource} relatedResources={related} />
    </>
  );
}

