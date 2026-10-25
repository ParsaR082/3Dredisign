import React from 'react';
import PortfolioView from '@/components/portfolio/PortfolioView';
import { getProjects } from '@/lib/data-loaders';
import { generatePageMetadata } from '@/lib/seo';

export const metadata = generatePageMetadata({
  title: 'نمونه کارهای دیجیتال مارکتینگ و طراحی سایت در ارومیه',
  description: 'آرشیو نمونه‌کارهای شاخص و پروژه‌های طراحی وب‌سایت، سئو، هویت بصری و تیزر تبلیغاتی آژانس دیجیتال مارکتینگ اروم سیما در ارومیه.',
  path: '/portfolio/',
});

export default function PortfolioPage() {
  const allProjects = getProjects();
  return <PortfolioView allProjects={allProjects} />;
}
