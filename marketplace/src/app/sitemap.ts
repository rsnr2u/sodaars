import { MetadataRoute } from 'next';
import { MOCK_MARKETPLACE_RESOURCES, POPULAR_CITIES } from '@/data/mockMarketplaceData';
import { slugify } from '@/lib/utils';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'http://localhost:3000';

  // Static core routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/explore`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/track`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
  ];

  // City landing routes (e.g. /hoardings-in-mumbai)
  const cityRoutes: MetadataRoute.Sitemap = POPULAR_CITIES.map((c) => ({
    url: `${baseUrl}/hoardings-in-${slugify(c.name)}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.85,
  }));

  // Individual hoarding detail routes (e.g. /resources/bkc-diamond-bourse-premium-unipole-mumbai)
  const resourceRoutes: MetadataRoute.Sitemap = MOCK_MARKETPLACE_RESOURCES.map((r) => ({
    url: `${baseUrl}/resources/${r.slug}`,
    lastModified: new Date(r.updatedAt || new Date()),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticRoutes, ...cityRoutes, ...resourceRoutes];
}

