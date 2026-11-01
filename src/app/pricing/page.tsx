import type { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';
import PricingView from '@/components/pricing/PricingView';
import { getLivePricing } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getLivePricing();
  return generatePageMetadata({
    title: settings.meta_title || 'تعرفه‌ها و پکیج‌های دیجیتال مارکتینگ و طراحی سایت در ارومیه | اروم سیما',
    description: settings.meta_description || 'تعرفه‌ها و پکیج‌های شفاف طراحی سایت، سئو، مدیریت اینستاگرام و کمپین‌های دیجیتال مارکتینگ در ارومیه.',
    path: '/pricing/',
  });
}

export default async function PricingPage() {
  const { settings, plans } = await getLivePricing();
  return <PricingView initialSettings={settings} initialPlans={plans} />;
}
