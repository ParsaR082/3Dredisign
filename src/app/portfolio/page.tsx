import React from 'react';
import PortfolioView from '@/components/portfolio/PortfolioView';
import { getLiveProjects, getLiveCategories } from '@/lib/db';
import { generatePageMetadata } from '@/lib/seo';

export const metadata = generatePageMetadata({
  title: 'نمونه کارهای دیجیتال مارکتینگ و طراحی سایت در ارومیه',
  description: 'آرشیو نمونه‌کارهای شاخص و پروژه‌های طراحی وب‌سایت، سئو، هویت بصری و تیزر تبلیغاتی آژانس دیجیتال مارکتینگ اروم سیما در ارومیه.',
  path: '/portfolio/',
});

export default async function PortfolioPage() {
  const [allProjects, categories] = await Promise.all([
    getLiveProjects(),
    getLiveCategories(),
  ]);

  return <PortfolioView allProjects={allProjects} initialCategories={categories} />;
}
