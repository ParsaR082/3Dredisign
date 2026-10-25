import React from 'react';
import { notFound } from 'next/navigation';
import ServiceDetailView from '@/components/ui/ServiceDetailView';
import { getServices, getServiceBySlug } from '@/lib/data-loaders';
import { generatePageMetadata, generateServiceJsonLd, generateFaqJsonLd } from '@/lib/seo';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const services = getServices();
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};

  return generatePageMetadata({
    title: service.meta_title || service.title,
    description: service.meta_description || service.short_description,
    path: '/services/' + service.slug + '/',
  });
}

export default async function ServiceSlugPage({ params }: Props) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
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
