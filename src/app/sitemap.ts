import type { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://sangkwon.pro';

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = ['ko', 'en'];
  const routes = [
    '',
    '/explore',
    '/analysis',
    '/recommend',
    '/feasibility',
    '/compare',
    '/search',
    '/login',
    '/signup',
  ];

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const route of routes) {
      entries.push({
        url: `${BASE_URL}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'weekly' : 'monthly',
        priority: route === '' ? 1.0 : route === '/explore' ? 0.9 : 0.7,
      });
    }
  }

  return entries;
}
