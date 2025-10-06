import { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/auth/', '/_next/', '/admin/'],
      },
      {
        userAgent: ['Googlebot', 'Bingbot', 'Baiduspider'],
        allow: '/',
        disallow: ['/api/', '/auth/'],
        crawlDelay: 1,
      },
    ],
    sitemap: 'https://pv-testing-system.netlify.app/sitemap.xml',
  };
}
