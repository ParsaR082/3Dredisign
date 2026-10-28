import React from 'react';
import HomeView from '@/components/home/HomeView';
import { getLandingData, getLiveServices, getLiveProjects, getLiveSiteSettings } from '@/lib/data-loaders';
import { generatePageMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
  
  // Featured projects first (ordered), then fallback to other active projects to fill all 4 3D TV stations
  const featured = allProjects.filter((p) => p.featured);
  const nonFeatured = allProjects.filter((p) => !p.featured);
  const displayProjects = [...featured, ...nonFeatured].slice(0, 4);

  return (
    <HomeView
      landing={landing}
      services={services}
      projects={displayProjects}
      settings={settings}
    />
  );
}
