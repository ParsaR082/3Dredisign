import type { Metadata } from 'next';
import HealthCheckView from '@/components/tools/HealthCheckView';
import { generatePageMetadata } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata({
  title: 'تست سلامت دیجیتال برند و سایت | اروم سیما',
  description: 'بررسی آنلاین و رایگان سلامت فنی وبسایت، امنیت SSL، بهینه‌سازی نسخه موبایل و ساختار متادیتای سئو توسط اروم سیما.',
  path: '/tools/health-check/',
});

export default function HealthCheckPage() {
  return <HealthCheckView />;
}
