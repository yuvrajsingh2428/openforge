import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://openforge.dev';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/debug/', '/api/health'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
