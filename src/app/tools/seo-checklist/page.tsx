import type { Metadata } from 'next';
import SeoChecklistView from '@/components/tools/SeoChecklistView';
import { generatePageMetadata } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata({
  title: 'چک‌لیست سئو رایگان و عملی سایت | اروم سیما',
  description: 'چک‌لیست جامع بهینه‌سازی فنی، محتوایی و سئو محلی سایت برای کسب‌وکارهای ارومیه و سراسر کشور همراه با قابلیت چاپ و ذخیره PDF.',
  path: '/tools/seo-checklist/',
});

export default function SeoChecklistPage() {
  return <SeoChecklistView />;
}
