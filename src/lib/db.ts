import { prisma } from './prisma';
import type { SiteSettings, Service, Project, StatItem, ProjectKPI } from '@/types/content';
import siteSettingsFallback from '@/content/site-settings.json';
import servicesFallback from '@/content/services.json';
import projectsFallback from '@/content/projects.json';

const MEDIA_BASE = (process.env.NEXT_PUBLIC_MEDIA_URL || 'https://urumsima.ir/media').replace(/\/$/, '');

export function resolveMediaUrl(path: string | null | undefined): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${MEDIA_BASE}/${cleanPath}`;
}

/**
 * Fetch live SiteSettings from database, with fallback to local JSON
 */
export async function getLiveSiteSettings(): Promise<SiteSettings> {
  try {
    const row = await prisma.publicSitesettings.findFirst();
    if (!row) return siteSettingsFallback as SiteSettings;

    return {
      site_name: row.site_name,
      site_slogan: row.site_slogan,
      phone_display: row.phone_display,
      phone_e164: row.phone_e164,
      whatsapp_number: row.whatsapp_number,
      office_address: row.office_address,
      office_city: row.office_city,
      office_region: row.office_region,
      office_latitude: Number(row.office_latitude) || 37.5518,
      office_longitude: Number(row.office_longitude) || 45.0782,
      map_zoom: row.map_zoom || 15,
      show_contact_map: row.show_contact_map,
      instagram_url: row.instagram_url,
      telegram_url: row.telegram_url,
      rubika_url: row.rubika_url,
      linkedin_url: row.linkedin_url || undefined,
      footer_about_text: row.footer_about_text,
      footer_working_hours: row.footer_working_hours,
      footer_copyright_text: row.footer_copyright_text,
      meta_title_default: row.meta_title_default,
      meta_description_default: row.meta_description_default,
      default_robots: row.default_robots,
      default_og_image: resolveMediaUrl(row.default_og_image),
    };
  } catch (error) {
    console.warn('DB SiteSettings query failed, using static fallback:', error);
    return siteSettingsFallback as SiteSettings;
  }
}

/**
 * Fetch live Services from database with features and FAQs, with fallback
 */
export async function getLiveServices(): Promise<Service[]> {
  try {
    const rows = await prisma.serviceService.findMany({
      where: { is_active: true },
      orderBy: { order: 'asc' },
    });

    if (!rows || rows.length === 0) return servicesFallback as Service[];

    // Fetch related features and faqs
    const [features, faqs] = await Promise.all([
      prisma.serviceServicefeature.findMany({ orderBy: { order: 'asc' } }),
      prisma.serviceServicefaq.findMany({ orderBy: { order: 'asc' } }),
    ]);

    return rows.map((s) => {
      const serviceFeatures = features
        .filter((f) => f.service_id === s.id)
        .map((f) => ({
          text: f.text,
          icon: f.icon,
        }));

      const serviceFaqs = faqs
        .filter((f) => f.service_id === s.id)
        .map((f) => ({
          question: f.question,
          answer: f.answer,
        }));

      const whyBullets = s.why_us_bullets
        ? s.why_us_bullets
            .split('\n')
            .map((b) => b.trim())
            .filter(Boolean)
        : [];

      return {
        id: String(s.id),
        slug: s.slug,
        dedicated_url: s.canonical_url || `/${s.slug}/`,
        title: s.title,
        breadcrumb_label: s.breadcrumb_label || s.title,
        canonical_url: s.canonical_url || `/${s.slug}/`,
        short_description: s.short_description,
        description: s.description,
        icon: s.icon || '🚀',
        meta_title: s.meta_title || s.title,
        meta_description: s.meta_description || s.short_description,
        features_section_title: s.features_section_title || 'ویژگی‌های کلیدی',
        features_intro: s.features_intro || '',
        features: serviceFeatures,
        why_us_title: s.why_us_title || 'چرا اروم سیما؟',
        why_us_intro: s.why_us_intro || '',
        why_us_bullets: whyBullets,
        faq_section_title: s.faq_section_title || 'سوالات متداول',
        faqs: serviceFaqs,
      };
    });
  } catch (error) {
    console.warn('DB Services query failed, using static fallback:', error);
    return servicesFallback as Service[];
  }
}

/**
 * Fetch live Projects from database with gallery images, with fallback
 */
export async function getLiveProjects(): Promise<Project[]> {
  try {
    const rows = await prisma.portfolioProject.findMany({
      where: { is_active: true },
      orderBy: [{ featured: 'desc' }, { order: 'asc' }],
    });

    if (!rows || rows.length === 0) return projectsFallback as Project[];

    return rows.map((p) => {
      let parsedKpis: ProjectKPI[] = [];
      if (p.kpi_data) {
        try {
          const raw = JSON.parse(p.kpi_data);
          if (Array.isArray(raw)) {
            parsedKpis = raw.map((item) => ({
              label: item.label || item.title || '',
              value: item.value || '',
              detail: item.detail || '',
            }));
          }
        } catch (_) {}
      }

      return {
        id: String(p.id),
        title: p.title,
        subtitle: p.subtitle || undefined,
        slug: p.slug,
        category: 'طراحی و توسعه',
        category_slug: 'web',
        industry: 'تکنولوژی و کسب‌وکار',
        technologies: ['Next.js', 'React', 'TailwindCSS'],
        description: p.description,
        detailed_description: p.detailed_description || p.description,
        challenge: p.challenge || undefined,
        featured: p.featured,
        project_date: p.project_date,
        website_url: p.website_url || undefined,
        thumbnail_image: resolveMediaUrl(p.thumbnail_image),
        mockups: {
          desktop: resolveMediaUrl(p.desktop_mockup),
          mobile: resolveMediaUrl(p.mobile_mockup),
          tablet: resolveMediaUrl(p.tablet_mockup),
        },
        kpis: parsedKpis,
        location_zone: p.location_zone || undefined,
        latitude: p.latitude ? Number(p.latitude) : undefined,
        longitude: p.longitude ? Number(p.longitude) : undefined,
      };
    });
  } catch (error) {
    console.warn('DB Projects query failed, using static fallback:', error);
    return projectsFallback as Project[];
  }
}

/**
 * Fetch live statistics counters from database
 */
export async function getLiveCounters(): Promise<StatItem[]> {
  try {
    const counters = await prisma.publicLandingcounter.findMany({
      where: { is_active: true },
      orderBy: { order: 'asc' },
    });

    if (!counters || counters.length === 0) return [];

    return counters.map((c) => ({
      value: `${c.value}${c.suffix}`,
      label: c.label,
      detail: '',
    }));
  } catch (error) {
    console.warn('DB Counters query failed:', error);
    return [];
  }
}

/**
 * Save new Contact Message directly to Django table `contact_contactmessage`
 * Zero data loss, 100% compatible with Django admin.
 */
export async function saveContactMessage(data: {
  fullName: string;
  phone: string;
  email?: string;
  message: string;
  serviceId?: number;
}) {
  return await prisma.contactContactmessage.create({
    data: {
      full_name: data.fullName.trim(),
      phone: data.phone.trim(),
      email: data.email?.trim() || null,
      message: data.message.trim(),
      created_at: new Date(),
      is_seen: false,
      service_id: data.serviceId || null,
    },
  });
}
