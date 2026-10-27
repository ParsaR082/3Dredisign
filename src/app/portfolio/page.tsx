import React from 'react';
import PortfolioView from '@/components/portfolio/PortfolioView';
import { getLiveProjects } from '@/lib/db';
import { generatePageMetadata } from '@/lib/seo';

export const metadata = generatePageMetadata({
  title: 'نمونه کارهای دیجیتال مارکتینگ و طراحی سایت در ارومیه',
  description: 'آرشیو نمونه‌کارهای شاخص و پروژه‌های طراحی وب‌سایت، سئو، هویت بصری و تیزر تبلیغاتی آژانس دیجیتال مارکتینگ اروم سیما در ارومیه.',
  path: '/portfolio/',
});

export default async function PortfolioPage() {
  const allProjects = await getLiveProjects();
  return <PortfolioView allProjects={allProjects} />;
}
