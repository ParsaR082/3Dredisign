import type { Metadata } from 'next';
import { getSiteSettings } from './data-loaders';
import type { Service, Project, BlogPost } from '@/types/content';

const BASE_URL = 'https://urumsima.ir';

export function generatePageMetadata({
  title,
  description,
  path = '',
  ogImage,
  noIndex = false,
}: {
  title?: string;
  description?: string;
  path?: string;
  ogImage?: string;
  noIndex?: boolean;
}): Metadata {
  const settings = getSiteSettings();
  const pageTitle = title
    ? (title.includes(settings.site_name) ? title : `${title} | ${settings.site_name}`)
    : settings.meta_title_default;
  const pageDescription = description || settings.meta_description_default;

  let formattedPath = path.trim();
  if (!formattedPath.startsWith('/')) {
    formattedPath = '/' + formattedPath;
  }
  if (!formattedPath.endsWith('/') && !formattedPath.includes('.')) {
    formattedPath = formattedPath + '/';
  }
  const canonicalUrl = `${BASE_URL}${formattedPath}`;
  const image = ogImage || settings.default_og_image || '/images/urumsima3.jpg';

  return {
    title: pageTitle,
    description: pageDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          'max-image-preview': 'large',
          'max-snippet': -1,
          'max-video-preview': -1,
        },
    openGraph: {
      type: 'website',
      locale: 'fa_IR',
      url: canonicalUrl,
      title: pageTitle,
      description: pageDescription,
      siteName: settings.site_name,
      images: [
        {
          url: image.startsWith('http') ? image : `${BASE_URL}${image}`,
          width: 1200,
          height: 630,
          alt: pageTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDescription,
      images: [image.startsWith('http') ? image : `${BASE_URL}${image}`],
    },
  };
}

export function generateOrganizationJsonLd() {
  const settings = getSiteSettings();
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${BASE_URL}/#organization`,
    name: settings.site_name,
    url: BASE_URL,
    logo: `${BASE_URL}/favicon.png`,
    image: `${BASE_URL}/images/urumsima3.jpg`,
    telephone: settings.phone_e164,
    priceRange: '$$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings.office_address,
      addressLocality: settings.office_city,
      addressRegion: settings.office_region,
      addressCountry: 'IR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: settings.office_latitude,
      longitude: settings.office_longitude,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Saturday',
          'Sunday',
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
        ],
        opens: '09:00',
        closes: '18:00',
      },
    ],
    sameAs: [
      settings.instagram_url,
      settings.telegram_url,
      settings.rubika_url,
      settings.linkedin_url,
    ].filter(Boolean),
  };
}

export function generateServiceJsonLd(service: Service) {
  const settings = getSiteSettings();
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: service.title,
    provider: {
      '@type': 'LocalBusiness',
      name: settings.site_name,
      url: BASE_URL,
    },
    areaServed: {
      '@type': 'AdministrativeArea',
      name: 'آذربایجان غربی، ارومیه',
    },
    description: service.short_description || service.description,
    url: service.canonical_url,
  };
}

export function generateFaqJsonLd(faqs: { question: string; answer: string }[]) {
  if (!faqs || faqs.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  };
}
