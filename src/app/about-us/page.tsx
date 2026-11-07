import React from 'react';
import { getLiveTeamData, getLiveSiteSettings } from '@/lib/data-loaders';
import { generatePageMetadata } from '@/lib/seo';
import AboutUsEnhancedView from '@/components/about/AboutUsEnhancedView';

export const metadata = generatePageMetadata({
  title: 'درباره ما | هویت، دپارتمان‌های تخصصی و فناوری‌های اروم سیما',
  description:
    'آشنایی با آژانس دیجیتال مارکتینگ اروم سیما؛ پیشرو در مهندسی وب ۳ بعدی مدرن، سئو تکنیکال، استودیو تولید محتوا و بیلبورد با بیش از ۱۵ سال سابقه درخشان در ارومیه.',
  path: '/about-us/',
});

export default async function AboutUsPage() {
  const [{ settings, stats }, siteSettings] = await Promise.all([
    getLiveTeamData(),
    getLiveSiteSettings(),
  ]);

  return (
    <AboutUsEnhancedView
      settings={settings}
      stats={stats}
      siteSettings={siteSettings}
    />
  );
}
