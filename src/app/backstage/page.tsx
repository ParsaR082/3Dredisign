import type { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';
import {
  getLiveBackstageItems,
  getLiveBackstageCategories,
  getLiveBackstagePageSettings,
} from '@/lib/db';
import BackstageDirectorView from '@/components/backstage/BackstageDirectorView';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const pageSettings = await getLiveBackstagePageSettings();
  return generatePageMetadata({
    title: pageSettings.meta_title || 'پشت صحنه فیلمبرداری، عکاسی صنعتی و تیزر تبلیغاتی | اروم سیما',
    description:
      pageSettings.meta_description ||
      'مانیتور کارگردانی و ویدیوهای عمودی پشت‌صحنه ساخت تیزرهای تبلیغاتی، سناریونویسی و پروژه‌های برندهای معتبر در استودیو اروم‌سیما.',
    path: '/backstage/',
  });
}

export default async function BackstageListPage() {
  const [items, categories, pageSettings] = await Promise.all([
    getLiveBackstageItems(),
    getLiveBackstageCategories(),
    getLiveBackstagePageSettings(),
  ]);

  return (
    <main className="min-h-screen py-8 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <BackstageDirectorView
        items={items}
        categories={categories}
        settings={pageSettings}
      />
    </main>
  );
}
