import type { MetadataRoute } from 'next';
import {
  getLiveServices,
  getLiveProjects,
  getLiveCategories,
  getLiveBlogData,
  getLiveWebsites,
  getLiveBackstageItems,
  getLiveBackstageCategories,
} from '@/lib/db';
import { prisma } from '@/lib/prisma';

const BASE_URL = 'https://urumsima.ir';

export const revalidate = 3600; // Revalidate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Core High-Priority Static & Dedicated Landing Routes
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/services/`, lastModified: now, changeFrequency: 'weekly', priority: 0.95 },
    { url: `${BASE_URL}/web-design-urmia/`, lastModified: now, changeFrequency: 'weekly', priority: 0.95 },
    { url: `${BASE_URL}/video-teaser-urmia/`, lastModified: now, changeFrequency: 'weekly', priority: 0.95 },
    { url: `${BASE_URL}/content-production-urmia/`, lastModified: now, changeFrequency: 'weekly', priority: 0.95 },
    { url: `${BASE_URL}/billboard-urmia/`, lastModified: now, changeFrequency: 'weekly', priority: 0.95 },
    { url: `${BASE_URL}/portfolio/`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/portfolio/projects-map/`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE_URL}/websites/`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/backstage/`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE_URL}/pricing/`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE_URL}/about-us/`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/contact-us/`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/blog/`, lastModified: now, changeFrequency: 'daily', priority: 0.85 },
    { url: `${BASE_URL}/abner/`, lastModified: now, changeFrequency: 'weekly', priority: 0.75 },
    { url: `${BASE_URL}/tools/seo-checklist/`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/privacy-policy/`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
  ];

  // Fetch all dynamic entities from database in parallel
  const [
    services,
    projects,
    portfolioCategories,
    blogData,
    websites,
    backstageItems,
    blogCategoriesFromDb,
  ] = await Promise.all([
    getLiveServices().catch(() => []),
    getLiveProjects().catch(() => []),
    getLiveCategories().catch(() => []),
    getLiveBlogData().catch(() => ({ settings: {} as any, articles: [] })),
    getLiveWebsites().catch(() => []),
    getLiveBackstageItems().catch(() => []),
    prisma.blogBlogcategory.findMany().catch(() => []),
  ]);

  // Dedicated Service Routes
  const serviceRoutes: MetadataRoute.Sitemap = services
    .filter((s) => s.slug)
    .map((s) => {
      const urlPath = s.dedicated_url ? s.dedicated_url : `/services/${s.slug}/`;
      const fullUrl = urlPath.startsWith('http') ? urlPath : `${BASE_URL}${urlPath.startsWith('/') ? '' : '/'}${urlPath}`;
      const normalizedUrl = fullUrl.endsWith('/') ? fullUrl : `${fullUrl}/`;

      return {
        url: normalizedUrl,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.9,
      };
    });

  // Portfolio Categories
  const portfolioCategoryRoutes: MetadataRoute.Sitemap = portfolioCategories
    .filter((c) => c.slug)
    .map((c) => ({
      url: `${BASE_URL}/portfolio/category/${c.slug}/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

  // Individual Projects
  const projectRoutes: MetadataRoute.Sitemap = projects
    .filter((p) => p.slug)
    .map((p) => ({
      url: `${BASE_URL}/portfolio/${p.slug}/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

  // Blog Categories
  const blogCategoryRoutes: MetadataRoute.Sitemap = (
    blogCategoriesFromDb.length > 0
      ? blogCategoriesFromDb.map((c) => c.slug)
      : ['digital-marketing', 'website-design', 'tolid-mohtava']
  ).map((slug) => ({
    url: `${BASE_URL}/blog/category/${slug}/`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.75,
  }));

  // Blog Articles
  const blogRoutes: MetadataRoute.Sitemap = blogData.articles
    .filter((a) => a.slug)
    .map((a) => ({
      url: `${BASE_URL}/blog/${a.slug}/`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.75,
    }));

  // Showcase Pre-built Websites
  const websiteRoutes: MetadataRoute.Sitemap = websites
    .filter((w) => w.slug)
    .map((w) => ({
      url: `${BASE_URL}/websites/${w.slug}/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

  // Backstage Videos & Items
  const backstageRoutes: MetadataRoute.Sitemap = backstageItems
    .filter((b) => b.slug)
    .map((b) => ({
      url: `${BASE_URL}/backstage/${encodeURIComponent(b.slug)}/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.75,
    }));

  // Deduplicate URLs to guarantee 100% valid XML sitemap
  const urlMap = new Map<string, MetadataRoute.Sitemap[number]>();
  const allEntries = [
    ...staticRoutes,
    ...serviceRoutes,
    ...portfolioCategoryRoutes,
    ...projectRoutes,
    ...blogCategoryRoutes,
    ...blogRoutes,
    ...websiteRoutes,
    ...backstageRoutes,
  ];

  for (const entry of allEntries) {
    if (!urlMap.has(entry.url)) {
      urlMap.set(entry.url, entry);
    }
  }

  return Array.from(urlMap.values());
}
