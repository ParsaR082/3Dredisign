import React from 'react';
import { notFound } from 'next/navigation';
import ServiceDetailView from '@/components/ui/ServiceDetailView';
import { getLiveServiceBySlug } from '@/lib/db';
import { generatePageMetadata, generateServiceJsonLd, generateFaqJsonLd, generateVideoJsonLd } from '@/lib/seo';

export async function generateMetadata() {
  const service = await getLiveServiceBySlug('video-teaser');
  if (!service) return {};

  return generatePageMetadata({
    title: service.meta_title || service.title,
    description: service.meta_description || service.short_description,
    path: '/video-teaser-urmia/',
  });
}

export default async function DedicatedLandingPage() {
  const service = await getLiveServiceBySlug('video-teaser');
  if (!service) notFound();

  const serviceJsonLd = generateServiceJsonLd(service);
  const faqJsonLd = generateFaqJsonLd(service.faqs);
  const videoJsonLd = generateVideoJsonLd({
    name: service.meta_title || 'ساخت تیزر تبلیغاتی و فیلمبرداری صنعتی در ارومیه | اروم سیما',
    description: service.meta_description || service.short_description || service.description,
    thumbnailUrl: '/images/urumsima3.webp',
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(videoJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      <ServiceDetailView service={service} />
    </>
  );
}
