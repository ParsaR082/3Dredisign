import React from 'react';
import ContactUsView from '@/components/ui/ContactUsView';
import { getSiteSettings, getServices } from '@/lib/data-loaders';
import { generatePageMetadata } from '@/lib/seo';

export const metadata = generatePageMetadata({
  title: 'تماس با آژانس دیجیتال مارکتینگ اروم سیما در ارومیه',
  description: 'ارتباط مستقیم و ثبت سفارش طراحی سایت، خدمات سئو، تولید تیزر و مشاوره مارکتینگ با آژانس اروم سیما در ارومیه. تلفن: ۰۹۱۴۱۴۰۶۴۵۰.',
  path: '/contact-us/',
});

export default function ContactUsPage() {
  const settings = getSiteSettings();
  const services = getServices();
  return <ContactUsView settings={settings} services={services} />;
}
