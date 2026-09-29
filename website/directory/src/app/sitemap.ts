import { MetadataRoute } from 'next';
import { getProviders, getResources } from '@/lib/api';

export const revalidate = 3600; // Revalidate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  // 1. Static Core Discovery Routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${siteUrl}/explore`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/providers`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ];

  // 2. Verified Providers Permalinks
  let providerRoutes: MetadataRoute.Sitemap = [];
  try {
    const providersRes = await getProviders({ per_page: '100' });
    if (providersRes.success && providersRes.data?.items) {
      providerRoutes = providersRes.data.items.map((provider) => ({
        url: `${siteUrl}/providers/${provider.slug}`,
        lastModified: provider.verified_at ? new Date(provider.verified_at) : new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      }));
    }
  } catch (e) {
    // Fail gracefully
  }

  // 3. Active Outdoor Resources Permalinks
  let resourceRoutes: MetadataRoute.Sitemap = [];
  try {
    const resourcesRes = await getResources({ per_page: '100' });
    if (resourcesRes.success && resourcesRes.data?.items) {
      resourceRoutes = resourcesRes.data.items.map((resource) => ({
        url: `${siteUrl}/resources/${resource.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      }));
    }
  } catch (e) {
    // Fail gracefully
  }

  return [...staticRoutes, ...providerRoutes, ...resourceRoutes];
}
