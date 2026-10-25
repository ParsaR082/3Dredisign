import type { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';
import PricingView from '@/components/pricing/PricingView';

export const metadata: Metadata = generatePageMetadata({
  title: 'تعرفه‌ها و پکیج‌های دیجیتال مارکتینگ و طراحی سایت در ارومیه | اروم سیما',
  description: 'تعرفه‌ها و پکیج‌های شفاف طراحی سایت، سئو، مدیریت اینستاگرام و کمپین‌های دیجیتال مارکتینگ در ارومیه.',
  path: '/pricing/',
});

export default function PricingPage() {
  return <PricingView />;
}
