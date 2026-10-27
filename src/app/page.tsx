import React from 'react';
import HomeView from '@/components/home/HomeView';
import { getLandingData, getLiveServices, getLiveProjects, getLiveSiteSettings } from '@/lib/data-loaders';
import { generatePageMetadata } from '@/lib/seo';

export const metadata = generatePageMetadata({
  title: 'آژانس دیجیتال مارکتینگ و معماری وب ۳D اروم سیما | ارومیه',
  description: 'تجربه تعاملی و سه‌بعدی اروم‌سیما؛ طراحی سایت اختصاصی، سئو تکنیکال رتبه یک، تولید محتوای ویدیویی صنعتی و تبلیغات محیطی در ارومیه.',
  path: '/',
});

export default async function HomePage() {
  const landing = getLandingData();
  const [services, allProjects, settings] = await Promise.all([
    getLiveServices(),
    getLiveProjects(),
    getLiveSiteSettings(),
  ]);
  const featuredProjects = allProjects.filter((p) => p.featured);

  return (
    <HomeView
      landing={landing}
      services={services}
      projects={featuredProjects}
      settings={settings}
    />
  );
}
