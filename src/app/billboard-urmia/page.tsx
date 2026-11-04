import React from 'react';
import { notFound } from 'next/navigation';
import ServiceDetailView from '@/components/ui/ServiceDetailView';
import { getLiveServiceBySlug } from '@/lib/db';
import { generatePageMetadata, generateServiceJsonLd, generateFaqJsonLd } from '@/lib/seo';

export async function generateMetadata() {
  const service = await getLiveServiceBySlug('billboard-advertising') || await getLiveServiceBySlug('billboard');
  if (!service) return {};

  return generatePageMetadata({
    title: service.meta_title || service.title,
    description: service.meta_description || service.short_description,
    path: '/billboard-urmia/',
  });
}

export default async function DedicatedLandingPage() {
  const service = await getLiveServiceBySlug('billboard-advertising') || await getLiveServiceBySlug('billboard');
  if (!service) notFound();

  const serviceJsonLd = generateServiceJsonLd(service);
  const faqJsonLd = generateFaqJsonLd(service.faqs);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
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
