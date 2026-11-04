import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/images/',
          '/media/',
          '/fonts/',
        ],
        disallow: [
          '/api/',
          '/admin/',
          '/_next/',
          '/tools/health-check/',
        ],
      },
      {
        userAgent: [
          'Googlebot',
          'Bingbot',
          'YandexBot',
          'Baiduspider',
          'DuckDuckBot',
          'Twitterbot',
          'facebookexternalhit',
          'WhatsApp',
          'TelegramBot',
        ],
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
        ],
      },
      {
        userAgent: ['GPTBot', 'Google-Extended', 'PerplexityBot', 'ClaudeBot', 'Applebot-Extended'],
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
    ],
    sitemap: 'https://urumsima.ir/sitemap.xml',
    host: 'https://urumsima.ir',
  };
}
