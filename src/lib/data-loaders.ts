import siteSettingsData from '@/content/site-settings.json';
import landingDataRaw from '@/content/landing.json';
import servicesDataRaw from '@/content/services.json';
import projectsDataRaw from '@/content/projects.json';
import pricingDataRaw from '@/content/pricing.json';
import teamDataRaw from '@/content/team.json';
import abnerDataRaw from '@/content/abner.json';
import blogDataRaw from '@/content/blog.json';

import type {
  SiteSettings,
  LandingData,
  Service,
  Project,
  PricingPlan,
  PricingSettings,
  TechLead,
  AboutSettings,
  BlogPost,
} from '@/types/content';

export {
  getLiveSiteSettings,
  getLiveServices,
  getLiveServiceBySlug,
  getLiveProjects,
  getLiveProjectBySlug,
  getLiveCounters,
  getLiveBlogData,
  getLiveBlogPostBySlug,
  getLiveLandingData,
  getLiveLandingFull,
  getLiveTeamData,
  getLiveAbnerData,
} from './db';

export function getSiteSettings(): SiteSettings {
  return siteSettingsData as unknown as SiteSettings;
}

export function getLandingData(): LandingData {
  return landingDataRaw as unknown as LandingData;
}

export function getServices(): Service[] {
  return servicesDataRaw as unknown as Service[];
}

export function getServiceBySlug(slug: string): Service | undefined {
  const services = getServices();
  return services.find(
    (s) => s.slug === slug || s.id === slug || s.dedicated_url === `/${slug}/`
  );
}

export function getProjects(): Project[] {
  return projectsDataRaw as unknown as Project[];
}

export function getFeaturedProjects(): Project[] {
  return getProjects().filter((p) => p.featured);
}

export function getProjectBySlug(slug: string): Project | undefined {
  return getProjects().find((p) => p.slug === slug || p.id === slug);
}

export function getPricingData(): { settings: PricingSettings; plans: PricingPlan[] } {
  return pricingDataRaw as unknown as { settings: PricingSettings; plans: PricingPlan[] };
}

export function getTeamData(): { settings: AboutSettings; leads: TechLead[] } {
  return teamDataRaw as unknown as { settings: AboutSettings; leads: TechLead[] };
}

export function getAbnerData() {
  return abnerDataRaw;
}

export function getBlogData(): { settings: { title: string; subtitle: string; meta_title: string; meta_description: string }; articles: BlogPost[] } {
  return blogDataRaw as any;
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return getBlogData().articles.find((a) => a.slug === slug || a.id === slug);
}
