import React from 'react';
import type { Metadata } from 'next';
import ContactUsView from '@/components/ui/ContactUsView';
import { getLiveSiteSettings, getLiveServices } from '@/lib/data-loaders';
import { prisma } from '@/lib/prisma';
import { generatePageMetadata } from '@/lib/seo';

export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const [settings, contactPage] = await Promise.all([
    getLiveSiteSettings(),
    prisma.contactContactpagesettings.findFirst().catch(() => null),
  ]);

  return generatePageMetadata({
    title: contactPage?.meta_title || 'تماس با آژانس دیجیتال مارکتینگ اروم سیما در ارومیه',
    description:
      contactPage?.meta_description ||
      `ارتباط مستقیم و ثبت سفارش طراحی سایت، خدمات سئو، تولید تیزر و مشاوره مارکتینگ با آژانس اروم سیما در ارومیه. تلفن: ${settings.phone_display}.`,
    path: '/contact-us/',
  });
}

export default async function ContactUsPage() {
  const [settings, services, contactPage] = await Promise.all([
    getLiveSiteSettings(),
    getLiveServices(),
    prisma.contactContactpagesettings.findFirst().catch(() => null),
  ]);

  return <ContactUsView settings={settings} services={services} contactPage={contactPage} />;
}
