import type { MetadataRoute } from 'next';
import {
  getLiveServices,
  getLiveProjects,
  getLiveBlogData,
  getLiveWebsites,
  getLiveBackstageItems,
} from '@/lib/db';

const BASE_URL = 'https://urumsima.ir';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/web-design-urmia/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.95 },
    { url: `${BASE_URL}/content-production-urmia/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.95 },
    { url: `${BASE_URL}/video-teaser-urmia/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.95 },
    { url: `${BASE_URL}/billboard-urmia/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.95 },
    { url: `${BASE_URL}/services/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/portfolio/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/portfolio/projects-map/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE_URL}/websites/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/backstage/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE_URL}/pricing/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE_URL}/abner/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/about-us/`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/contact-us/`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/blog/`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE_URL}/tools/seo-checklist/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/tools/health-check/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/privacy-policy/`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ];

  // Portfolio Categories
  const portfolioCategories = [
    'branding-graphic-design',
    'integrated-digital-marketing-services',
    'sanat-va-sakhteman',
    'ecommerce-website-design-development',
    'social-media-management-content-production',
  ];
  const portfolioCategoryRoutes: MetadataRoute.Sitemap = portfolioCategories.map((slug) => ({
    url: `${BASE_URL}/portfolio/category/${slug}/`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Blog Categories
  const blogCategories = ['digital-marketing', 'website-design', 'tolid-mohtava'];
  const blogCategoryRoutes: MetadataRoute.Sitemap = blogCategories.map((slug) => ({
    url: `${BASE_URL}/blog/category/${slug}/`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Dedicated services
  const services = await getLiveServices();
  const serviceRoutes: MetadataRoute.Sitemap = services.map((s) => ({
    url: `${BASE_URL}${s.dedicated_url || `/services/${s.slug}/`}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  // Portfolio items
  const projects = await getLiveProjects();
  const projectRoutes: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${BASE_URL}/portfolio/${p.slug}/`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.75,
  }));

  // Blog posts
  const blogData = await getLiveBlogData();
  const blogRoutes: MetadataRoute.Sitemap = blogData.articles.map((a) => ({
    url: `${BASE_URL}/blog/${a.slug}/`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  // Showcase websites
  const websites = await getLiveWebsites();
  const websiteRoutes: MetadataRoute.Sitemap = websites.map((w) => ({
    url: `${BASE_URL}/websites/${w.slug}/`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Backstage items
  const backstage = await getLiveBackstageItems();
  const backstageRoutes: MetadataRoute.Sitemap = backstage.map((b) => ({
    url: `${BASE_URL}/backstage/${encodeURIComponent(b.slug)}/`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.75,
  }));

  return [
    ...staticRoutes,
    ...portfolioCategoryRoutes,
    ...blogCategoryRoutes,
    ...serviceRoutes,
    ...projectRoutes,
    ...blogRoutes,
    ...websiteRoutes,
    ...backstageRoutes,
  ];
}
