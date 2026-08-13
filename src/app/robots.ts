import { MetadataRoute } from 'next'

const SITE_URL = 'https://nord-laundry.ru'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // /test-og-tags.html — служебная страница с дублем title/description
        disallow: ['/api/', '/test-og-tags.html'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
