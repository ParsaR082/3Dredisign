import React from 'react';
import HomeView from '@/components/home/HomeView';
import { getLandingData, getServices, getFeaturedProjects, getSiteSettings } from '@/lib/data-loaders';
import { generatePageMetadata } from '@/lib/seo';

export const metadata = generatePageMetadata({
  title: 'آژانس دیجیتال مارکتینگ و معماری وب ۳D اروم سیما | ارومیه',
  description: 'تجربه تعاملی و سه‌بعدی اروم‌سیما؛ طراحی سایت اختصاصی، سئو تکنیکال رتبه یک، تولید محتوای ویدیویی صنعتی و تبلیغات محیطی در ارومیه.',
  path: '/',
});

export default function HomePage() {
  const landing = getLandingData();
  const services = getServices();
  const projects = getFeaturedProjects();
  const settings = getSiteSettings();

  return (
    <HomeView
      landing={landing}
      services={services}
      projects={projects}
      settings={settings}
    />
  );
}
