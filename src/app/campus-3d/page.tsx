import React from 'react';
import HomeView from '@/components/home/HomeView';
import { getLiveLandingData, getLiveServices, getLiveProjects, getLiveSiteSettings } from '@/lib/data-loaders';
import { generatePageMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = generatePageMetadata({
  title: 'پردیس ۳ بعدی و تعاملی اروم سیما | ارومیه',
  description: 'تجربه تعاملی و پردیس سه‌بعدی اروم‌سیما؛ معماری وب ۳D، ایستگاه‌های تعاملی پروژه‌ها، خدمات و مشاوره در ارومیه.',
  path: '/campus-3d',
});

export default async function Campus3DPage() {
  const [landing, services, allProjects, settings] = await Promise.all([
    getLiveLandingData(),
    getLiveServices(),
    getLiveProjects(),
    getLiveSiteSettings(),
  ]);
  
  const featured = allProjects.filter((p) => p.featured);
  const nonFeatured = allProjects.filter((p) => !p.featured);
  const displayProjects = [...featured, ...nonFeatured].slice(0, 4);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#050B14]">
      <HomeView
        landing={landing}
        services={services}
        projects={displayProjects}
        settings={settings}
      />
    </main>
  );
}
