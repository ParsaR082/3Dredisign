import React from 'react';
import { getLiveServices } from '@/lib/db';
import { generatePageMetadata } from '@/lib/seo';
import { ServicesEnhancedView } from '@/components/services/ServicesEnhancedView';

export const metadata = generatePageMetadata({
  title: 'خدمات تخصصی دیجیتال مارکتینگ و طراحی سایت در ارومیه',
  description:
    'معرفی خدمات ۵ گانه آژانس اروم سیما: طراحی سایت مدرن، سئو تکنیکال، تولید محتوای اینستاگرام، تیزر صنعتی و رسانه‌های محیطی در ارومیه.',
  path: '/services/',
});

export default async function ServicesPage() {
  const services = await getLiveServices();
  return <ServicesEnhancedView services={services} />;
}
