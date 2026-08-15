import type { MetadataRoute } from 'next';
import { CURATED_REPOSITORIES } from '@openforge/config';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://openforge.dev';

  const staticRoutes = [
    '',
    '/repositories',
    '/issues',
    '/recommendations',
    '/mentor',
    '/search',
    '/about',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  const repoRoutes = CURATED_REPOSITORIES.map((repo) => ({
    url: `${baseUrl}/repositories/${repo.owner}/${repo.name}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...repoRoutes];
}
