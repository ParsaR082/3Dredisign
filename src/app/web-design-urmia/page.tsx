import React from 'react';
import { notFound } from 'next/navigation';
import ServiceDetailView from '@/components/ui/ServiceDetailView';
import { getServiceBySlug } from '@/lib/data-loaders';
import { generatePageMetadata, generateServiceJsonLd, generateFaqJsonLd } from '@/lib/seo';

export async function generateMetadata() {
  const service = getServiceBySlug('web-design');
  if (!service) return {};

  return generatePageMetadata({
    title: service.meta_title || service.title,
    description: service.meta_description || service.short_description,
    path: '/web-design-urmia/',
  });
}

export default function DedicatedLandingPage() {
  const service = getServiceBySlug('web-design');
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
