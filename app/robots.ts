import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://million-platform.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/dashboard/',
          '/student/',
          '/teacher/',
          '/parent/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
