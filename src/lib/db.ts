import { prisma } from './prisma';
import type {
  SiteSettings,
  Service,
  Project,
  ProjectCategory,
  StatItem,
  ProjectKPI,
  ProjectTimelineStep,
  ProjectROI,
  ProjectVideo,
  ProjectImage,
  BlogPost,
  PricingPlan,
  PricingSettings,
  LandingData,
  LiveLandingFullData,
  TechLead,
  AboutSettings,
} from '@/types/content';
import siteSettingsFallback from '@/content/site-settings.json';
import servicesFallback from '@/content/services.json';
import projectsFallback from '@/content/projects.json';
import blogFallback from '@/content/blog.json';
import pricingFallback from '@/content/pricing.json';
import landingFallback from '@/content/landing.json';
import teamDataRaw from '@/content/team.json';
import abnerFallback from '@/content/abner.json';

export function resolveMediaUrl(path: string | null | undefined): string {
  if (!path) return '';
  // 1. External absolute URLs
  if (path.startsWith('http://') || path.startsWith('https://')) return path;

  // 2. Already starts with /media/ (e.g. /media/uploads/... or /media/portfolio/...)
  if (path.startsWith('/media/')) return path;

  // 3. Starts with media/ without leading slash
  if (path.startsWith('media/')) return `/${path}`;

  // 4. Starts with /uploads/ or uploads/
  if (path.startsWith('/uploads/')) return `/media${path}`;
  if (path.startsWith('uploads/')) return `/media/${path}`;

  // 5. Starts with any leading slash
  if (path.startsWith('/')) return path;

  // 6. All media files (both uploaded and seed files) exist in public/media/
  // Serving them locally via /media/... guarantees same-origin access with 0 CORS issues in WebGL textures
  return `/media/${path}`;
}

function formatSocialUrl(url: string | null | undefined, type: 'telegram' | 'instagram' | 'rubika', fallback: string): string {
  if (!url || !url.trim()) return fallback;
  const trimmed = url.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  const handle = trimmed.replace(/^@/, '').trim();
  if (type === 'telegram') return `https://t.me/${handle}`;
  if (type === 'instagram') return `https://instagram.com/${handle}`;
  if (type === 'rubika') return `https://rubika.ir/${handle}`;
  return trimmed;
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
      instagram_url: formatSocialUrl(row.instagram_url, 'instagram', siteSettingsFallback.instagram_url || 'https://instagram.com/urum_sima'),
      telegram_url: formatSocialUrl(row.telegram_url, 'telegram', siteSettingsFallback.telegram_url || 'https://t.me/Urumsimaa'),
      rubika_url: formatSocialUrl(row.rubika_url, 'rubika', siteSettingsFallback.rubika_url || 'https://rubika.ir/urumsima'),
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
      select: {
        id: true,
        title: true,
        slug: true,
        short_description: true,
        description: true,
        icon: true,
        image: true,
        price_start: true,
        duration: true,
        difficulty: true,
        is_popular: true,
        is_featured: true,
        is_active: true,
        order: true,
        breadcrumb_label: true,
        canonical_url: true,
        meta_title: true,
        meta_description: true,
        features_section_title: true,
        features_intro: true,
        why_us_title: true,
        why_us_intro: true,
        why_us_bullets: true,
        faq_section_title: true,
      },
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

      // Ensure dedicated_url is strictly an internal relative path (never https://urumsima.ir)
      let cleanDedicatedUrl = `/services/${s.slug}/`;
      const slugLower = (s.slug || '').toLowerCase();
      if (slugLower === 'web-design' || slugLower === 'corporate-industrial-web-design') {
        cleanDedicatedUrl = '/web-design-urmia/';
      } else if (slugLower === 'content-production' || slugLower === 'instagram-content-creation-management') {
        cleanDedicatedUrl = '/content-production-urmia/';
      } else if (slugLower === 'video-teaser' || slugLower === 'industrial-commercial-video-production') {
        cleanDedicatedUrl = '/video-teaser-urmia/';
      } else if (slugLower === 'billboard' || slugLower === 'billboard-outdoor-advertising-design') {
        cleanDedicatedUrl = '/billboard-urmia/';
      } else if (s.canonical_url) {
        try {
          const pathOnly = s.canonical_url.replace(/^https?:\/\/[^\/]+/, '');
          if (pathOnly && pathOnly.startsWith('/')) {
            cleanDedicatedUrl = pathOnly;
          }
        } catch (_) {}
      }

      return {
        id: String(s.id),
        slug: s.slug,
        dedicated_url: cleanDedicatedUrl,
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
 * Fetch a single Service by slug or id, with fallback
 */
export async function getLiveServiceBySlug(slug: string): Promise<Service | null> {
  const all = await getLiveServices();
  const decoded = decodeURIComponent(slug).toLowerCase().trim();

  // 1. Match from live services
  const found = all.find(
    (s) =>
      s.slug.toLowerCase().trim() === decoded ||
      encodeURIComponent(s.slug).toLowerCase() === decoded ||
      s.id.toLowerCase() === decoded ||
      (s.dedicated_url && s.dedicated_url.replace(/^\/|\/$/g, '').toLowerCase() === decoded)
  );
  if (found) return found;

  // 2. Fallback to servicesFallback
  const fallbackFound = (servicesFallback as Service[]).find(
    (s) =>
      s.slug.toLowerCase().trim() === decoded ||
      encodeURIComponent(s.slug).toLowerCase() === decoded ||
      s.id.toLowerCase() === decoded ||
      (s.dedicated_url && s.dedicated_url.replace(/^\/|\/$/g, '').toLowerCase() === decoded)
  );
  return fallbackFound || null;
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

    const [
      categories,
      industries,
      projectTechs,
      technologies,
      additionalCats,
      videos,
      images,
    ] = await Promise.all([
      prisma.portfolioProjectcategory.findMany().catch(() => []),
      prisma.portfolioIndustry.findMany().catch(() => []),
      prisma.portfolioProjectTechnologies.findMany().catch(() => []),
      prisma.portfolioTechnology.findMany().catch(() => []),
      prisma.portfolioProjectAdditionalCategories.findMany().catch(() => []),
      prisma.portfolioProjectvideo.findMany({ orderBy: { order: 'asc' } }).catch(() => []),
      prisma.portfolioProjectimage.findMany({ orderBy: { order: 'asc' } }).catch(() => []),
    ]);

    const catMap = new Map(categories.map((c) => [c.id, c]));
    const indMap = new Map(industries.map((i) => [i.id, i.name]));
    const techMap = new Map(technologies.map((t) => [t.id, t.name]));

    const projectTechMap = new Map<number, string[]>();
    for (const pt of projectTechs) {
      const techName = techMap.get(pt.technology_id);
      if (techName) {
        const existing = projectTechMap.get(pt.project_id) || [];
        existing.push(techName);
        projectTechMap.set(pt.project_id, existing);
      }
    }

    const projectAddCatsMap = new Map<number, string[]>();
    const projectAddCatSlugsMap = new Map<number, string[]>();
    for (const ac of additionalCats) {
      const catObj = catMap.get(ac.projectcategory_id);
      if (catObj) {
        const existingNames = projectAddCatsMap.get(ac.project_id) || [];
        existingNames.push(catObj.name);
        projectAddCatsMap.set(ac.project_id, existingNames);

        const existingSlugs = projectAddCatSlugsMap.get(ac.project_id) || [];
        existingSlugs.push(catObj.slug);
        projectAddCatSlugsMap.set(ac.project_id, existingSlugs);
      }
    }

    const projectVideosMap = new Map<number, ProjectVideo[]>();
    for (const v of videos) {
      const existing = projectVideosMap.get(v.project_id) || [];
      existing.push({
        id: v.id,
        title: v.title,
        video_file: resolveMediaUrl(v.video_file) || null,
        optimized_file: resolveMediaUrl(v.optimized_file) || null,
        embed_url: v.embed_url || null,
        thumbnail: resolveMediaUrl(v.thumbnail) || null,
        orientation: v.orientation || 'Landscape',
        width: v.width || null,
        height: v.height || null,
        order: v.order,
      });
      projectVideosMap.set(v.project_id, existing);
    }

    const projectImagesMap = new Map<number, ProjectImage[]>();
    for (const img of images) {
      const existing = projectImagesMap.get(img.project_id) || [];
      existing.push({
        id: img.id,
        image: resolveMediaUrl(img.image),
        caption: img.caption || '',
        orientation: img.orientation || 'Landscape',
        width: img.width || null,
        height: img.height || null,
        order: img.order,
      });
      projectImagesMap.set(img.project_id, existing);
    }

    return rows.map((p) => {
      let parsedKpis: ProjectKPI[] = [];
      if (p.kpi_data) {
        try {
          const raw = JSON.parse(p.kpi_data);
          if (Array.isArray(raw)) {
            parsedKpis = raw
              .map((item) => ({
                label: item.label || item.title || '',
                value: item.value || '',
                detail: item.detail || '',
              }))
              .filter((k) => k.label || k.value);
          }
        } catch (_) {}
      }

      let parsedTimeline: ProjectTimelineStep[] = [];
      if (p.timeline_steps) {
        try {
          const raw = JSON.parse(p.timeline_steps);
          if (Array.isArray(raw)) {
            parsedTimeline = raw
              .map((item) => ({
                date: item.date || '',
                title: item.title || '',
                description: item.description || '',
              }))
              .filter((step) => step.title || step.description);
          }
        } catch (_) {}
      }

      const hasRoi = p.roi_cost != null || p.roi_revenue != null || p.roi_percentage != null;
      const roiData: ProjectROI | undefined = hasRoi
        ? {
            cost: p.roi_cost ?? undefined,
            revenue: p.roi_revenue ?? undefined,
            percentage: p.roi_percentage ?? undefined,
          }
        : undefined;

      const cat = catMap.get(p.category_id);
      const industryName = indMap.get(p.industry_id) || 'تکنولوژی و کسب‌وکار';
      const techs = projectTechMap.get(p.id) || [];
      const addCats = projectAddCatsMap.get(p.id) || [];
      const addCatSlugs = projectAddCatSlugsMap.get(p.id) || [];
      const pVideos = projectVideosMap.get(p.id) || [];
      const pGallery = projectImagesMap.get(p.id) || [];

      const cleanWebsiteUrl =
        p.website_url?.trim() &&
        p.website_url.trim() !== 'null' &&
        p.website_url.trim() !== 'undefined'
          ? p.website_url.trim()
          : undefined;

      const hasRealDesktop = Boolean(
        p.desktop_mockup?.trim() &&
        !p.desktop_mockup.includes('thumbnails/') &&
        p.desktop_mockup.trim() !== 'null'
      );
      const hasRealMobile = Boolean(
        p.mobile_mockup?.trim() &&
        !p.mobile_mockup.includes('thumbnails/') &&
        p.mobile_mockup.trim() !== 'null'
      );
      const hasRealTablet = Boolean(
        p.tablet_mockup?.trim() &&
        !p.tablet_mockup.includes('thumbnails/') &&
        p.tablet_mockup.trim() !== 'null'
      );

      const desktopMockup = hasRealDesktop ? resolveMediaUrl(p.desktop_mockup) : undefined;
      const mobileMockup = hasRealMobile ? resolveMediaUrl(p.mobile_mockup) : undefined;
      const tabletMockup = hasRealTablet ? resolveMediaUrl(p.tablet_mockup) : undefined;

      const hasAnyMockup = Boolean(desktopMockup || mobileMockup || tabletMockup);

      return {
        id: String(p.id),
        title: p.title,
        subtitle: p.subtitle?.trim() || undefined,
        slug: p.slug,
        category: cat?.name || 'طراحی و توسعه',
        category_slug: cat?.slug || 'web',
        additional_categories: addCats.length > 0 ? addCats : undefined,
        additional_category_slugs: addCatSlugs.length > 0 ? addCatSlugs : undefined,
        industry: industryName,
        technologies: techs,
        description: p.description?.trim() || '',
        detailed_description: p.detailed_description?.trim() || p.description?.trim() || '',
        challenge: p.challenge?.trim() || undefined,
        featured: p.featured,
        recent: p.recent,
        popular: p.popular,
        project_date: p.project_date?.trim() || '',
        website_url: cleanWebsiteUrl,
        pdf_url: p.pdf_url?.trim() && p.pdf_url.trim() !== 'null' ? resolveMediaUrl(p.pdf_url) : undefined,
        thumbnail_image: resolveMediaUrl(p.thumbnail_image) || '/images/urumsima3.webp',
        thumbnail_video_url: p.thumbnail_video_url ? resolveMediaUrl(p.thumbnail_video_url) : undefined,
        mockups: hasAnyMockup
          ? {
              desktop: desktopMockup,
              mobile: mobileMockup,
              tablet: tabletMockup,
            }
          : undefined,
        kpis: parsedKpis,
        timeline_steps: parsedTimeline.length > 0 ? parsedTimeline : undefined,
        roi: roiData,
        videos: pVideos.length > 0 ? pVideos : undefined,
        gallery: pGallery.length > 0 ? pGallery : undefined,
        location_zone: p.location_zone?.trim() || undefined,
        latitude: p.latitude ? Number(p.latitude) : undefined,
        longitude: p.longitude ? Number(p.longitude) : undefined,
        show_on_map: p.show_on_map,
        meta_title: p.meta_title?.trim() || undefined,
        meta_description: p.meta_description?.trim() || undefined,
        canonical_url: p.canonical_url?.trim() || undefined,
      };
    });
  } catch (error) {
    console.warn('DB Projects query failed, using static fallback:', error);
    return projectsFallback as Project[];
  }
}

/**
 * Fetch a single Project by slug, id, or decoded slug, with fallback
 */
export async function getLiveProjectBySlug(slug: string): Promise<Project | null> {
  const all = await getLiveProjects();
  const decoded = decodeURIComponent(slug).toLowerCase().trim();

  // 1. Try matching database projects
  const found = all.find(
    (p) =>
      p.slug.toLowerCase().trim() === decoded ||
      encodeURIComponent(p.slug).toLowerCase() === decoded ||
      p.id.toLowerCase() === decoded
  );
  if (found) return found;

  // 2. Fallback to projectsFallback
  const fallbackFound = (projectsFallback as Project[]).find(
    (p) =>
      p.slug.toLowerCase().trim() === decoded ||
      encodeURIComponent(p.slug).toLowerCase() === decoded ||
      p.id.toLowerCase() === decoded
  );
  return fallbackFound || null;
}

/**
 * Fetch related projects for a given project.
 * Checks manual relation table first (portfolio_project_related).
 * If no manual relations are defined, falls back to automatic category / industry match.
 */
export async function getLiveRelatedProjects(
  projectId: string | number,
  categorySlug?: string,
  industry?: string
): Promise<Project[]> {
  const allProjects = await getLiveProjects();
  const numId = Number(projectId);

  if (!isNaN(numId) && numId > 0) {
    try {
      const relatedRows = await prisma.portfolioProjectRelated.findMany({
        where: { project_id: numId },
        orderBy: { order: 'asc' },
      });

      if (relatedRows.length > 0) {
        const manualProjects: Project[] = [];
        for (const rel of relatedRows) {
          const match = allProjects.find((p) => Number(p.id) === rel.related_project_id);
          if (match && !manualProjects.some((m) => m.id === match.id)) {
            manualProjects.push(match);
          }
        }
        if (manualProjects.length > 0) {
          return manualProjects;
        }
      }
    } catch (e) {
      console.warn('Error fetching manual related projects from DB:', e);
    }
  }

  // Fallback to automatic category / industry match
  return allProjects
    .filter(
      (p) =>
        String(p.id) !== String(projectId) &&
        ((categorySlug && p.category_slug === categorySlug) || (industry && p.industry === industry))
    )
    .slice(0, 3);
}

/**
 * Fetch live project categories from database
 */
export async function getLiveCategories(): Promise<ProjectCategory[]> {
  try {
    const rows = await prisma.portfolioProjectcategory.findMany({
      where: { is_active: true },
      orderBy: { order: 'asc' },
    });
    if (!rows || rows.length === 0) return [];
    return rows.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      cover_image: resolveMediaUrl(c.cover_image) || null,
      description: c.description,
      icon: c.icon,
      order: c.order,
      is_active: c.is_active,
      is_featured: c.is_featured,
    }));
  } catch (error) {
    console.warn('DB Categories query failed:', error);
    return [];
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

// ── Showcase Websites (Pre-built & Templates) ────────────────

export interface ShowcaseWebsite {
  id: number;
  title: string;
  slug: string;
  subtitle: string;
  excerpt: string;
  body: string;
  cover_image: string;
  mobile_preview?: string | null;
  live_url: string;
  client_name: string;
  industry: string;
  year?: number | null;
  is_one_page: boolean;
  accent_color: string;
  tech_stack_csv: string;
  pages_label: string;
  status: string;
  is_featured: boolean;
  order: number;
  category_name?: string;
  features?: { title: string; description: string; icon_label: string }[];
  screenshots?: { image: string; caption: string; device_type: string }[];
}

const fallbackWebsites: ShowcaseWebsite[] = [
  {
    id: 1,
    title: 'فروشگاه تخصصی کفش و پوشاک ورزشی',
    slug: 'shoes-website',
    subtitle: 'طراحی مینیمال و فروشگاه مدرن آنلاین',
    excerpt: 'طراحی وب‌سایت مدرن فروشگاهی با بالاترین سرعت لود، سیستم فیلتر پیشرفته محصولات و سبد خرید واکنش‌گرا.',
    body: 'این پروژه یک وبسایت فروشگاهی حرفه‌ای برای عرضه انواع کفش‌های ورزشی و چرمی است که با استفاده از رابط کاربری فوق‌العاده سریع و درگاه‌های پرداخت متصل توسعه یافته است.',
    cover_image: '/images/websites/shoes.jpg',
    live_url: 'https://urumsima.ir/websites/shoes-website/',
    client_name: 'برند کفش مدرن',
    industry: 'فروشگاهی و پوشاک',
    year: 1403,
    is_one_page: false,
    accent_color: '#0E946E',
    tech_stack_csv: 'Next.js, Tailwind CSS, TypeScript, PostgreSQL',
    pages_label: '۵ صفحه اختصاصی',
    status: 'published',
    is_featured: true,
    order: 1,
    category_name: 'فروشگاهی',
    features: [
      { title: 'سیستم فیلتر هوشمند سایز و رنگ', description: 'انتخاب آسان مشخصات محصول بدون تاخیر', icon_label: 'filter' },
      { title: 'سرعت لود زیر ۱.۲ ثانیه', description: 'بهینه‌سازی تصاویر نسل جدید WebP', icon_label: 'zap' },
      { title: 'درگاه‌های پرداخت بانکی شاپرک', description: 'اتصال امن به زرین‌پال و بانک ملت', icon_label: 'shield' },
    ],
  },
  {
    id: 2,
    title: 'وب‌سایت لوکس گالری طلا و جواهرات',
    slug: 'jewelry-website',
    subtitle: 'ویترین آنلاین طلا و جواهرات فاخر',
    excerpt: 'طراحی بسیار شیک و چشم‌نواز با رنگ‌بندی طلایی و تیره، نمایش نرخ لحظه‌ای طلا و کاتالوگ تصویری لوکس.',
    body: 'پلتفرم معرفی و رزرو آنلاین جواهرات سفارشی با طراحی اختصاصی متناسب با سلیقه مشتریان لوکس‌پسند.',
    cover_image: '/images/websites/jewelry.jpg',
    live_url: 'https://urumsima.ir/websites/jewelry-website/',
    client_name: 'گالری طلا و جواهر پرنسس',
    industry: 'طلا، جواهر و اکسسوری',
    year: 1403,
    is_one_page: false,
    accent_color: '#D4AF37',
    tech_stack_csv: 'React, Three.js, Tailwind CSS',
    pages_label: '۶ صفحه لوکس',
    status: 'published',
    is_featured: true,
    order: 2,
    category_name: 'طلا و جواهرات',
    features: [
      { title: 'ماشین‌حساب قیمت طلا لحظه‌ای', description: 'محاسبه کارمزد و وزن طلا بر اساس مظنه زنده', icon_label: 'calculator' },
      { title: 'گالری تصاویر زوم ماکرو', description: 'مشاهده بافت و درخشش سنگ‌های قیمتی با رزولوشن بالا', icon_label: 'camera' },
      { title: 'فرم مشاوره و رزرو اختصاصی', description: 'سیستم نوبت‌دهی جلسات حضوری در ارومیه', icon_label: 'calendar' },
    ],
  },
  {
    id: 3,
    title: 'وب‌سایت گلاسیا - اپتیک و شیشه مدرن',
    slug: 'glassia-website',
    subtitle: 'طراحی مدرن اپتیک و فریم‌های مدرن',
    excerpt: 'طراحی ویژه برندهای اپتیک، عینک و شیشه‌های ساختمانی با سبک مینیمال و اروپایی.',
    body: 'سایت شرکتی مدرن با تمرکز بر تصویربرداری اختصاصی و هویت سازمانی متمایز.',
    cover_image: '/images/websites/glassia.jpg',
    live_url: 'https://urumsima.ir/websites/glassia-website/',
    client_name: 'صنایع اپتیک گلاسیا',
    industry: 'پزشکی و اپتیک',
    year: 1403,
    is_one_page: false,
    accent_color: '#0284C7',
    tech_stack_csv: 'Next.js, Framer Motion, Tailwind CSS',
    pages_label: '۴ صفحه شرکتی',
    status: 'published',
    is_featured: true,
    order: 3,
    category_name: 'شرکتی',
    features: [
      { title: 'تست فرم صورت و فریم', description: 'راهنمای هوشمند انتخاب سایز عینک', icon_label: 'smile' },
      { title: 'کاتالوگ تعاملی PDF', description: 'دانلود فوری جدیدترین کالکشن فصلی', icon_label: 'file-text' },
    ],
  },
  {
    id: 4,
    title: 'فروشگاه لوازم خانگی و آشپزخانه مدرن',
    slug: 'Home-Appliances-website',
    subtitle: 'پلتفرم جامع تجهیزات خانه و آشپزخانه',
    excerpt: 'سایت فروشگاهی با مقایسه مشخصات فنی، گارانتی آنلاین و ارسال سریع محصولات سنگین و سبک خانگی.',
    body: 'طراحی ساختاریافته با دسته‌بندی عمیق برای هزاران کالای خانگی با سیستم فیلتر بر اساس برند و توان مصرفی.',
    cover_image: '/images/websites/appliances.jpg',
    live_url: 'https://urumsima.ir/websites/Home-Appliances-website/',
    client_name: 'فروشگاه هوم کالا',
    industry: 'لوازم خانگی',
    year: 1403,
    is_one_page: false,
    accent_color: '#EA580C',
    tech_stack_csv: 'Next.js, Prisma, PostgreSQL',
    pages_label: '۷ صفحه جامع',
    status: 'published',
    is_featured: false,
    order: 4,
    category_name: 'فروشگاهی',
    features: [
      { title: 'مقایسه مشخصات کالاها', description: 'بررسی رو در روی محصولات مشابه', icon_label: 'columns' },
      { title: 'سیستم استعلام گارانتی معتبر', description: 'ثبت سریال دستگاه برای خدمات پس از فروش', icon_label: 'check-circle' },
    ],
  },
  {
    id: 5,
    title: 'گالری آنلاین ساعت‌های مچی لوکس',
    slug: 'Watch-website',
    subtitle: 'تجربه خرید ساعت‌های برند و کلاسیک',
    excerpt: 'وبسایت تخصصی ساعت با جزئیات فنی موتور سوئیسی، جعبه هدیه و ضمانت اصالت کالا.',
    body: 'طراحی شیک با پس‌زمینه دارک و تایپوگرافی ویژه برای خریداران کالاهای کلکسیونی و شیک.',
    cover_image: '/images/websites/watch.jpg',
    live_url: 'https://urumsima.ir/websites/Watch-website/',
    client_name: 'ساعت پرستیژ',
    industry: 'ساعت و کالای لوکس',
    year: 1403,
    is_one_page: false,
    accent_color: '#3B82F6',
    tech_stack_csv: 'React, Tailwind CSS',
    pages_label: '۵ صفحه شیک',
    status: 'published',
    is_featured: false,
    order: 5,
    category_name: 'اکسسوری',
    features: [
      { title: 'مشخصات کامل موتور و ضدآب', description: 'نمایش گرافیکی مقاومت آب بر اساس ATM', icon_label: 'watch' },
      { title: 'بسته‌بندی هدیه لوکس', description: 'امکان انتخاب کارت تبریک و جعبه نفیس', icon_label: 'gift' },
    ],
  },
  {
    id: 6,
    title: 'کافه رستری نئو (Neo Cafe)',
    slug: 'neo-cafe',
    subtitle: 'پلتفرم جامع کافه رستری، فروشگاه تخصصی قهوه و سفارش آنلاین',
    excerpt: 'پلتفرم یکپارچه نئو کافه شامل معرفی برند، فروشگاه قهوه تازه رست، ابزارهای تخصصی باریستا، منوی سفارش آنلاین و سیستم رزرواسیون VIP.',
    body: 'پلتفرم یکپارچه نئو کافه (Neo Cafe) با سبک طراحی سینمایی و دارک‌مود فاخر، تجربه‌ای منحصربه‌فرد برای شیفتگان قهوه و مشتریان وفادار خلق کرده است. این سامانه با تلفیق فروشگاه اینترنتی دانه‌های قهوه تک‌خاستگاه، منوی آنلاین بار گرم و سرد با جزئیات کاپینگ، و سیستم رزرواسیون میزها و رویدادهای اختصاصی، ارائه‌دهنده راه‌حلی نوین در صنعت کافه و رستری مدرن است.',
    cover_image: '/media/websites/covers/neo-cafe.webp',
    live_url: 'https://neo-cafe.vercel.app/',
    client_name: 'مجموعه کافه رستری نئو',
    industry: 'کافه، رستوران و فروشگاهی',
    year: 1403,
    is_one_page: false,
    accent_color: '#d97706',
    tech_stack_csv: 'Next.js 15, Tailwind CSS, TypeScript, Framer Motion, Django REST',
    pages_label: 'چند صفحه‌ای و فروشگاه تخصصی',
    status: 'published',
    is_featured: true,
    order: 6,
    category_name: 'کافه و رستوران',
    features: [
      { title: 'روایت سینمایی برند و هویت بصری دارک', description: 'طراحی اختصاصی با پالت رنگی گرم و افکت‌های مینیمال برای بازتاب حس اصالت قهوه اسپشالتی', icon_label: 'sparkles' },
      { title: 'فروشگاه قهوه تازه رست و ابزارهای دم‌آوری', description: 'انتخاب درجه آسیاب، پروفایل رست دانه‌ها و سیستم خرید سریع با درگاه بانکی', icon_label: 'coffee' },
      { title: 'منوی آنلاین تعاملی سرو در سالن و بیرون‌بر', description: 'لیست کامل نوشیدنی‌ها، ماکتل‌ها و دسرهای روز همراه با شاخص طعمی و کالری', icon_label: 'menu' },
      { title: 'رزرواسیون آنلاین میز و پکیج‌های VIP', description: 'انتخاب موقعیت میز، ثبت مناسبت‌های خاص و رزرو زمان به همراه تایید پیامکی', icon_label: 'calendar' },
      { title: 'سبد خرید تعاملی و پرفورمنس بهینه', description: 'استفاده از آخرین استاندارد Next.js 15 و انیمیشن‌های روان فریمور با لود زیر ۱ ثانیه', icon_label: 'zap' },
    ],
  },
  {
    id: 7,
    title: 'داشبورد مدیریتی فین‌ماتریکس (FinMatrix)',
    slug: 'digital-dashboard',
    subtitle: 'پرتال سازمانی تسویه ارزی، مدیریت نقدینگی و خزانه‌داری بین‌المللی',
    excerpt: 'داشبورد تحلیلی و معاملاتی فین‌ماتریکس با قابلیت مانیتورینگ زنده نقدینگی، عمق بازار اوردربوک، تسویه برون‌مرزی و پشتیبانی کامل از چینش دوطرفه RTL و LTR.',
    body: 'سامانه و داشبورد مدیریتی فین‌ماتریکس (FinMatrix) با استفاده از به‌روزترین معماری مدرن وب در Next.js 16 و React 19 پیاده‌سازی شده است. این پلتفرم با ارائه چارت‌های بلادرنگ توازن نقدینگی، ماتریس رزرو ارزی چندگانه، ره‌گیری آنی دفتر کل تراکنش‌ها و ماژول ممیزی قانونی (Compliance Audit)، بستری در کلاس جهانی برای کنترل دارایی‌های مالی نهادی فراهم می‌آورد.',
    cover_image: '/media/websites/covers/finmatrix-dashboard.webp',
    live_url: 'https://digital-dashboard-beta.vercel.app/',
    client_name: 'هلدینگ فین‌تک فین‌ماتریکس',
    industry: 'فین‌تک و داشبورد سازمانی',
    year: 1403,
    is_one_page: false,
    accent_color: '#0ea5e9',
    tech_stack_csv: 'Next.js 16, React 19, Tailwind CSS, NumberFlow, Framer Motion, TypeScript',
    pages_label: 'داشبورد چندبخشی و سیستم معاملاتی',
    status: 'published',
    is_featured: true,
    order: 7,
    category_name: 'سامانه‌ها و داشبوردها',
    features: [
      { title: 'مانیتورینگ بلادرنگ و توازن نقدینگی چندارزی', description: 'چارت‌های زنده Liquidity Rebalancing با محاسبه هوشمند جریان نقدی و شاخص ریسک لحظه‌ای', icon_label: 'activity' },
      { title: 'اوردربوک پیشرفته و مصورسازی عمق بازار', description: 'نمودار شمعی ژاپنی (Candlestick) تعاملی به همراه حجم معاملات Bid و Ask به صورت زنده', icon_label: 'bar-chart-3' },
      { title: 'دفتر کل تسویه برون‌مرزی (Bilateral Settlement Ledger)', description: 'فهرست تراکنش‌های تسویه شده و در انتظار با تفکیک طرفین معامله و نرخ کارمزد', icon_label: 'layers' },
      { title: 'معماری دوطرفه قرینه‌ای RTL و LTR', description: 'تغییر بدون تاخیر جهت رابط کاربری و بازچیدمان گریدها متناسب با زبان انگلیسی و فارسی', icon_label: 'globe' },
      { title: 'سیستم ممیزی انطباق و امنیت سازمانی (Compliance Engine)', description: 'پایش خودکار سقف مجاز مبادلات مالی و صدور هشدارهای انحراف از پروتکل‌های امنیتی', icon_label: 'shield-check' },
    ],
  },
];

export async function getLiveWebsitesPageSettings(): Promise<any> {
  try {
    const row = await prisma.websitesWebsitepagesettings.findFirst();
    if (row) {
      return {
        hero_badge: 'ویترین وبسایت‌های آماده و اختصاصی',
        hero_title: row.hero_title || 'برترین وبسایت‌های نمونه و پیش‌ساخته',
        hero_description: row.hero_subtitle || 'مجموعه‌ای منتخب از طراحی‌های وب واکنش‌گرا، سریع و بهینه‌سازی‌شده برای سئو.',
        meta_title: row.meta_title || 'وبسایت‌های نمونه و قالب‌های آماده مدرن | اروم سیما',
        meta_description: row.meta_description || 'مجموعه وبسایت‌های مدرن، قالب‌های آماده و نمونه‌کارهای توسعه وب در ارومیه.',
        cta_title: row.cta_title,
        cta_text: row.cta_text,
        cta_button_text: row.cta_button_text,
        cta_url: row.cta_url,
      };
    }
  } catch (e) {
    console.warn('DB WebsitesPageSettings failed:', e);
  }
  return {
    hero_badge: 'ویترین وبسایت‌های آماده و اختصاصی',
    hero_title: 'برترین وبسایت‌های نمونه و پیش‌ساخته',
    hero_description: 'مجموعه‌ای منتخب از طراحی‌های وب واکنش‌گرا، سریع و بهینه‌سازی‌شده برای سئو در اصناف مختلف از فروشگاهی تا شرکتی و لوکس.',
    meta_title: 'وبسایت‌های نمونه و قالب‌های آماده مدرن | اروم سیما',
    meta_description: 'مجموعه وبسایت‌های مدرن، قالب‌های آماده و نمونه‌کارهای توسعه وب در ارومیه با استانداردهای جهانی UI/UX و سئو.',
  };
}

export async function getLiveBackstagePageSettings(): Promise<any> {
  try {
    const row = await prisma.backstageBackstagepagesettings.findFirst();
    if (row) {
      return {
        hero_badge: 'روایت خلق محتوا و تولیدات میدانی',
        hero_title: row.hero_title || 'پشت‌صحنه پروژه‌ها و استودیو تولید محتوا',
        hero_description: row.hero_subtitle || 'نگاهی بی‌پرده به نحوه کارگردانی، فیلمبرداری هوایی، طراحی صحنه و چالش‌های ضبط ویدیوهای تبلیغاتی.',
        meta_title: row.meta_title || 'پشت‌صحنه پروژه‌ها و استودیو تولید محتوا | اروم سیما',
        meta_description: row.meta_description || 'روایت مستند و تصویری از پشت‌صحنه تولید تیزرهای تبلیغاتی، ساخت استند و مراحل اجرایی پروژه‌ها.',
        cta_title: row.cta_title,
        cta_text: row.cta_text,
        cta_url: row.cta_url,
      };
    }
  } catch (e) {
    console.warn('DB BackstagePageSettings failed:', e);
  }
  return {
    hero_badge: 'روایت خلق محتوا و تولیدات میدانی',
    hero_title: 'پشت‌صحنه پروژه‌ها و استودیو تولید محتوا',
    hero_description: 'نگاهی بی‌پرده به نحوه کارگردانی، فیلمبرداری هوایی، طراحی صحنه و چالش‌های ضبط ویدیوهای تبلیغاتی و تیزرهای صنعتی اروم سیما.',
    meta_title: 'پشت‌صحنه پروژه‌ها و استودیو تولید محتوا | اروم سیما',
    meta_description: 'روایت مستند و تصویری از پشت‌صحنه تولید تیزرهای تبلیغاتی، ساخت استند و مراحل اجرایی پروژه‌ها در ارومیه.',
  };
}

export async function getLiveWebsites(): Promise<ShowcaseWebsite[]> {
  try {
    const rows = await prisma.websitesWebsite.findMany({
      orderBy: { order: 'asc' },
    });
    if (!rows || rows.length === 0) return fallbackWebsites;

    const [categories, features, screenshots] = await Promise.all([
      prisma.websitesWebsitecategory.findMany().catch(() => []),
      prisma.websitesWebsitefeature.findMany({ orderBy: { order: 'asc' } }).catch(() => []),
      prisma.websitesWebsitescreenshot.findMany({ orderBy: { order: 'asc' } }).catch(() => []),
    ]);

    const catMap = new Map(categories.map((c) => [c.id, c.name]));

    return rows.map((w) => ({
      id: w.id,
      title: w.title,
      slug: w.slug,
      subtitle: w.subtitle,
      excerpt: w.excerpt,
      body: w.body,
      cover_image: resolveMediaUrl(w.cover_image) || '/favicon.png',
      mobile_preview: resolveMediaUrl(w.mobile_preview),
      live_url: w.live_url || `/websites/${w.slug}/`,
      client_name: w.client_name,
      industry: w.industry,
      year: w.year,
      is_one_page: w.is_one_page,
      accent_color: w.accent_color || '#0E946E',
      tech_stack_csv: w.tech_stack_csv,
      pages_label: w.pages_label || 'چند صفحه‌ای',
      status: w.status,
      is_featured: w.is_featured,
      order: w.order,
      category_name: w.category_id ? catMap.get(w.category_id) : undefined,
      features: features.filter((f) => f.website_id === w.id).map((f) => ({
        title: f.title,
        description: f.description,
        icon_label: f.icon_label,
      })),
      screenshots: screenshots.filter((s) => s.website_id === w.id).map((s) => ({
        image: resolveMediaUrl(s.image),
        caption: s.caption,
        device_type: s.device || 'desktop',
      })),
    }));
  } catch (error) {
    console.warn('DB Websites query failed, using fallback:', error);
    return fallbackWebsites;
  }
}

export async function getLiveWebsiteBySlug(slug: string): Promise<ShowcaseWebsite | null> {
  const all = await getLiveWebsites();
  const decoded = decodeURIComponent(slug).toLowerCase().trim();
  return (
    all.find(
      (w) =>
        w.slug.toLowerCase().trim() === decoded ||
        encodeURIComponent(w.slug).toLowerCase() === decoded
    ) || null
  );
}

// ── Backstage Items (Behind the Scenes) ──────────────────────

export interface BackstageItem {
  id: number;
  title: string;
  slug: string;
  subtitle: string;
  excerpt: string;
  body: string;
  cover_image: string;
  cover_video?: string | null;
  embed_url: string;
  location: string;
  duration_label: string;
  status: string;
  is_featured: boolean;
  order: number;
  published_at?: string | null;
}

const fallbackBackstage: BackstageItem[] = [
  {
    id: 1,
    title: 'پشت صحنه فیلمبرداری تیزر تبلیغاتی سپید بام گستر',
    slug: 'پشت-صحنه-فیلمبرداری-سپید-بام-گستر',
    subtitle: 'روایتی از تلاش تیم تصویربرداری و جلوه‌های ویژه اروم‌سیما در کارخانجات صنعتی سپید بام گستر',
    excerpt: 'نگاهی از نزدیک به مراحل ضبط صحنه‌های صنعتی، نورپردازی کارخانه با تجهیزات سینمایی و هماهنگی خط تولید.',
    body: 'در این پروژه تیم تولید فیلم و تیزر تبلیغاتی اروم‌سیما با بهره‌گیری از دوربین‌های سینمایی Red و تجهیزات حرفه‌ای نورپردازی، فرآیند ساخت عایق‌های رطوبتی در کارخانه سپید بام گستر را با استانداردهای بین‌المللی به تصویر کشیدند.',
    cover_image: '/images/bts/sepid-bam.jpg',
    cover_video: '/media/bts/sepidbam-teaser.mp4',
    embed_url: 'https://aparat.com/v/sepidbam',
    location: 'ارومیه، شهرک صنعتی فاز ۲',
    duration_label: '۴ دقیقه پشت صحنه',
    status: 'published',
    is_featured: true,
    order: 1,
    published_at: '1403/06/15',
  },
];

export async function getLiveBackstageItems(): Promise<BackstageItem[]> {
  try {
    const rows = await prisma.backstageBackstageitem.findMany({
      orderBy: { order: 'asc' },
    });
    if (!rows || rows.length === 0) return fallbackBackstage;

    return rows.map((b) => ({
      id: b.id,
      title: b.title,
      slug: b.slug,
      subtitle: b.subtitle,
      excerpt: b.excerpt,
      body: b.body,
      cover_image: resolveMediaUrl(b.cover_image) || '/favicon.png',
      cover_video: resolveMediaUrl(b.cover_video),
      embed_url: b.embed_url,
      location: b.location || 'ارومیه',
      duration_label: b.duration_label || 'ویدیو کوتاه',
      status: b.status,
      is_featured: b.is_featured,
      order: b.order,
      published_at: b.published_at ? (b.published_at instanceof Date ? b.published_at.toISOString().split('T')[0] : String(b.published_at)) : null,
    }));
  } catch (error) {
    console.warn('DB Backstage query failed, using fallback:', error);
    return fallbackBackstage;
  }
}

export async function getLiveBackstageBySlug(slug: string): Promise<BackstageItem | null> {
  const all = await getLiveBackstageItems();
  const decoded = decodeURIComponent(slug).toLowerCase().trim();
  return (
    all.find(
      (b) =>
        b.slug.toLowerCase().trim() === decoded ||
        encodeURIComponent(b.slug).toLowerCase() === decoded
    ) || null
  );
}

// ── Blog Data & Posts ────────────────────────────────────────

export async function getLiveBlogData(): Promise<{
  settings: { title: string; subtitle: string; meta_title: string; meta_description: string };
  articles: BlogPost[];
}> {
  try {
    const [settingsRow, rows, categories, authors, postTags, allTags] = await Promise.all([
      prisma.blogBlogsettings.findFirst().catch(() => null),
      prisma.blogPost.findMany({
        where: { status: 'published' },
        orderBy: { created_at: 'desc' },
      }).catch(() => []),
      prisma.blogBlogcategory.findMany().catch(() => []),
      prisma.blogBlogauthor.findMany().catch(() => []),
      prisma.blogPostTags.findMany().catch(() => []),
      prisma.blogBlogtag.findMany().catch(() => []),
    ]);

    const catMap = new Map(categories.map((c) => [c.id, c.name]));
    const authorMap = new Map(authors.map((a) => [a.id, a.name]));
    const tagMap = new Map(allTags.map((t) => [t.id, t.name]));

    const postTagMap = new Map<number, string[]>();
    for (const pt of postTags) {
      const tagName = tagMap.get(pt.blogtag_id);
      if (tagName) {
        const existing = postTagMap.get(pt.post_id) || [];
        existing.push(tagName);
        postTagMap.set(pt.post_id, existing);
      }
    }

    const liveArticles: BlogPost[] = rows.map((b) => {
      const catName = (b.category_id && catMap.get(b.category_id)) || 'فناوری و کسب‌وکار دیجیتال';
      const authorName = (b.author_id && authorMap.get(b.author_id)) || 'تیم تحریریه اروم سیما';
      const tags = postTagMap.get(b.id) || ['اروم سیما', 'دیجیتال مارکتینگ'];
      const publishedStr = b.published_at
        ? (b.published_at instanceof Date ? b.published_at.toISOString().split('T')[0] : String(b.published_at))
        : '۱۴۰۳/۰۹/۰۱';

      return {
        id: String(b.id),
        title: b.title,
        slug: b.slug,
        excerpt: b.excerpt,
        content: b.body || b.body_html || b.excerpt,
        author: authorName,
        category: catName,
        published_at: publishedStr,
        reading_time: `${b.read_time || 5} دقیقه`,
        cover_image: resolveMediaUrl(b.cover_image) || '/images/urumsima3.webp',
        tags,
      };
    });

    const fallbackArticles = ((blogFallback as any).articles || []) as BlogPost[];
    const liveSlugs = new Set(liveArticles.map((a) => a.slug.toLowerCase()));
    const combined = [
      ...liveArticles,
      ...fallbackArticles.filter((fa) => !liveSlugs.has(fa.slug.toLowerCase())),
    ];

    const settings = settingsRow
      ? {
          title: settingsRow.list_title || blogFallback.settings.title,
          subtitle: settingsRow.list_subtitle || blogFallback.settings.subtitle,
          meta_title: settingsRow.meta_title || blogFallback.settings.meta_title,
          meta_description: settingsRow.meta_description || blogFallback.settings.meta_description,
        }
      : blogFallback.settings;

    return {
      settings,
      articles: combined.length > 0 ? combined : fallbackArticles,
    };
  } catch (error) {
    console.warn('DB Blog query failed, using static fallback:', error);
    return blogFallback as any;
  }
}

export async function getLiveBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const { articles } = await getLiveBlogData();
  const decoded = decodeURIComponent(slug).toLowerCase().trim();

  return (
    articles.find(
      (a) =>
        a.slug.toLowerCase().trim() === decoded ||
        encodeURIComponent(a.slug).toLowerCase() === decoded ||
        a.id.toLowerCase() === decoded
    ) || null
  );
}

/**
 * Fetch live Pricing Plans and Settings from database, with fallback to local JSON
 */
export async function getLivePricing(): Promise<{ settings: PricingSettings; plans: PricingPlan[] }> {
  try {
    const [dbPlans, dbFeatures, dbSettings] = await Promise.all([
      prisma.pricingPricingplan.findMany({
        orderBy: { order: 'asc' },
      }),
      prisma.pricingPricingfeature.findMany({
        orderBy: { order: 'asc' },
      }),
      prisma.pricingPricingpagesettings.findFirst(),
    ]);

    const fallback = pricingFallback as { settings: PricingSettings; plans: PricingPlan[] };

    const settings: PricingSettings = {
      meta_title: dbSettings?.meta_title || fallback.settings.meta_title,
      meta_description: dbSettings?.meta_description || fallback.settings.meta_description,
      canonical_url: '/pricing/',
      hero_badge: dbSettings?.hero_badge || fallback.settings.hero_badge,
      hero_title: dbSettings?.hero_title || fallback.settings.hero_title,
      hero_description: dbSettings?.hero_description || fallback.settings.hero_description,
      stat_1_value: dbSettings?.stat_1_value || fallback.settings.stat_1_value,
      stat_1_label: dbSettings?.stat_1_label || fallback.settings.stat_1_label,
      stat_2_value: dbSettings?.stat_2_value || fallback.settings.stat_2_value,
      stat_2_label: dbSettings?.stat_2_label || fallback.settings.stat_2_label,
      stat_3_value: dbSettings?.stat_3_value || fallback.settings.stat_3_value,
      stat_3_label: dbSettings?.stat_3_label || fallback.settings.stat_3_label,
      plans_section_title: dbSettings?.plans_section_title || fallback.settings.plans_section_title,
      plans_section_subtitle: dbSettings?.plans_section_subtitle || fallback.settings.plans_section_subtitle,
    };

    if (!dbPlans || dbPlans.length === 0) {
      return { settings, plans: fallback.plans };
    }

    const plans: PricingPlan[] = dbPlans.map((p) => {
      const planFeatures = dbFeatures
        .filter((f) => f.plan_id === p.id)
        .map((f) => f.title);

      return {
        id: p.id,
        name: p.name,
        description: p.description || '',
        monthly_price: Number(p.monthly_price) || 0,
        yearly_price: Number(p.yearly_price) || 0,
        billing_period: p.billing_period || 'ماهانه',
        custom_price_text: p.custom_price_text || '',
        is_popular: Boolean(p.is_popular),
        order: p.order || 1,
        features: planFeatures,
      };
    });

    return { settings, plans };
  } catch (error) {
    console.warn('DB Pricing query failed, using static fallback:', error);
    return pricingFallback as { settings: PricingSettings; plans: PricingPlan[] };
  }
}

/**
 * Fetch live Landing Page Elements and Texts from database, with fallback to landing.json
 */
export async function getLiveLandingData(): Promise<LandingData> {
  const fallback = landingFallback as LandingData;
  try {
    const [pageRow, processSteps, whyItems, tickerItems, growthStats, counters] = await Promise.all([
      prisma.publicLandingpage.findFirst().catch(() => null),
      prisma.publicLandingprocessstep.findMany({ where: { is_active: true }, orderBy: { order: 'asc' } }).catch(() => []),
      prisma.publicLandingwhyitem.findMany({ where: { is_active: true }, orderBy: { order: 'asc' } }).catch(() => []),
      prisma.publicLandingtickeritem.findMany({ where: { is_active: true }, orderBy: { order: 'asc' } }).catch(() => []),
      prisma.publicLandinggrowthstat.findMany({ where: { is_active: true }, orderBy: { order: 'asc' } }).catch(() => []),
      prisma.publicLandingcounter.findMany({ where: { is_active: true }, orderBy: { order: 'asc' } }).catch(() => []),
    ]);

    // Build Process Steps
    const mappedProcessSteps = processSteps.length > 0
      ? processSteps.map((s, idx) => ({
          step: s.step_number || `۰${idx + 1}`,
          title: s.title,
          description: s.description,
          duration: `گام ${s.step_number || idx + 1}`,
        }))
      : fallback.process_steps;

    // Build Why Items
    const iconNames = ['Cpu', 'TrendingUp', 'Video', 'Radio', 'Sparkles'];
    const mappedWhyItems = whyItems.length > 0
      ? whyItems.map((w, idx) => ({
          title: w.title,
          description: w.description,
          icon: iconNames[idx % iconNames.length],
        }))
      : fallback.why_us_items;

    // Build Trust Tickers
    const mappedTickers = tickerItems.length > 0
      ? tickerItems.map((t) => t.text)
      : fallback.trust_tickers;

    // Build Stats
    let mappedStats = fallback.stats;
    if (counters.length > 0) {
      mappedStats = counters.map((c) => ({
        value: `${c.value}${c.suffix || ''}`,
        label: c.label,
        detail: 'پروژه‌ها و دستاوردها',
      }));
    } else if (growthStats.length > 0) {
      mappedStats = growthStats.map((g) => ({
        value: g.value,
        label: g.label,
        detail: 'رشد پایدار مشتریان',
      }));
    }

    return {
      hero: {
        badge: pageRow?.hero_badge || fallback.hero.badge,
        title_line1: pageRow?.hero_title ? pageRow.hero_title.slice(0, 30) : fallback.hero.title_line1,
        title_highlight: fallback.hero.title_highlight,
        title_line2: fallback.hero.title_line2,
        subtitle: pageRow?.hero_description || fallback.hero.subtitle,
        cta_primary_text: pageRow?.primary_cta_text || fallback.hero.cta_primary_text,
        cta_primary_url: pageRow?.primary_cta_url ? resolveMediaUrl(pageRow.primary_cta_url) : fallback.hero.cta_primary_url,
        cta_secondary_text: pageRow?.secondary_cta_text || fallback.hero.cta_secondary_text,
        cta_secondary_url: pageRow?.secondary_cta_url || fallback.hero.cta_secondary_url,
        badge_reviews: fallback.hero.badge_reviews,
        experience_years: fallback.hero.experience_years,
      },
      stats: mappedStats,
      why_us_title: pageRow?.why_section_title || fallback.why_us_title,
      why_us_subtitle: pageRow?.why_section_subtitle || fallback.why_us_subtitle,
      why_us_items: mappedWhyItems,
      process_title: pageRow?.process_section_title || fallback.process_title,
      process_subtitle: pageRow?.process_section_subtitle || fallback.process_subtitle,
      process_steps: mappedProcessSteps,
      testimonials: fallback.testimonials,
      trust_tickers: mappedTickers,
    };
  } catch (error) {
    console.warn('DB Landing query failed, using static fallback:', error);
    return fallback;
  }
}

/**
 * Fetch live Team/About data from database, with fallback to team.json
 */
export async function getLiveTeamData(): Promise<{ settings: AboutSettings; leads: TechLead[]; coreValues: any[] }> {
  const fallback = teamDataRaw as { settings: AboutSettings; leads: TechLead[] };
  try {
    const [settingsRow, members, coreValues] = await Promise.all([
      prisma.aboutAboutpagesettings.findFirst().catch(() => null),
      prisma.aboutTechlead.findMany({ where: { is_active: true }, orderBy: { order: 'asc' } }).catch(() => []),
      prisma.aboutCorevalue.findMany({ orderBy: { order: 'asc' } }).catch(() => []),
    ]);

    const settings: AboutSettings = {
      title: settingsRow?.hero_title?.trim() || fallback.settings.title,
      subtitle: settingsRow?.hero_subtitle?.trim() || fallback.settings.subtitle,
      vision: settingsRow?.vision_text?.trim() || fallback.settings.vision,
      mission: settingsRow?.mission_text?.trim() || fallback.settings.mission,
      stats: fallback.settings.stats || [],
    };

    const leads: TechLead[] =
      members && members.length > 0
        ? members.map((m) => ({
            name: m.name,
            role: m.role,
            skills: m.skills_csv ? m.skills_csv.split(',').map((s) => s.trim()) : [],
            years_experience: m.years_experience || 3,
            total_projects: m.total_projects || 10,
            accent_color: m.accent_color || '#10B981',
            planet_type: (m.planet_type as any) || 'crystal',
            tagline: m.tagline || '',
            poster_image: resolveMediaUrl(m.poster_image) || '/images/team-hero.webp',
            order: m.order || 1,
          }))
        : fallback.leads;

    return { settings, leads, coreValues };
  } catch (error) {
    console.warn('DB Team query failed, using static fallback:', error);
    return { ...fallback, coreValues: [] };
  }
}

/**
 * Fetch full live landing data for the classic landing page template
 */
export async function getLiveLandingFull(): Promise<LiveLandingFullData> {
  const [
    landingRow,
    tickerItems,
    whyItems,
    counters,
    growthStats,
    processSteps,
    roiConfigRow,
    reelsConfigRow,
    reels,
    testimonials,
    services,
    allProjects,
    pricing,
  ] = await Promise.all([
    prisma.publicLandingpage.findFirst({ where: { is_active: true } }).catch(() => null),
    prisma.publicLandingtickeritem.findMany({ where: { is_active: true }, orderBy: { order: 'asc' } }).catch(() => []),
    prisma.publicLandingwhyitem.findMany({ where: { is_active: true }, orderBy: { order: 'asc' } }).catch(() => []),
    prisma.publicLandingcounter.findMany({ where: { is_active: true }, orderBy: { order: 'asc' } }).catch(() => []),
    prisma.publicLandinggrowthstat.findMany({ where: { is_active: true }, orderBy: { order: 'asc' } }).catch(() => []),
    prisma.publicLandingprocessstep.findMany({ where: { is_active: true }, orderBy: { order: 'asc' } }).catch(() => []),
    prisma.publicLandingroiconfig.findFirst({ where: { is_active: true } }).catch(() => null),
    prisma.publicInstagramreelsconfig.findFirst().catch(() => null),
    prisma.publicInstagramreel.findMany({ where: { is_active: true }, orderBy: { order: 'asc' }, take: 8 }).catch(() => []),
    prisma.publicLandingtestimonial.findMany({ where: { is_active: true }, orderBy: { order: 'asc' } }).catch(() => []),
    getLiveServices(),
    getLiveProjects(),
    getLivePricing(),
  ]);

  // Featured projects
  const featuredProjects = allProjects.filter((p) => p.featured).slice(0, 6);

  // Map projects
  const mapProjects = allProjects
    .filter((p) => p.latitude && p.longitude)
    .map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      lat: p.latitude!,
      lng: p.longitude!,
      category: p.category,
    }));

  // Before/After candidate
  let beforeAfterProject: { title: string; slug: string; before_url: string; after_url: string } | null = null;
  const baCandidate = allProjects.find(
    (p) => p.featured && p.thumbnail_image && p.mockups?.desktop && p.thumbnail_image !== p.mockups.desktop
  );
  if (baCandidate) {
    beforeAfterProject = {
      title: baCandidate.title,
      slug: baCandidate.slug,
      before_url: baCandidate.thumbnail_image,
      after_url: baCandidate.mockups!.desktop!,
    };
  }

  // Fallbacks if tables are empty
  const landingFallback = {
    site_title: 'اروم سیما',
    hero_badge: 'آژانس دیجیتال مارکتینگ و معماری وب',
    hero_title: 'اروم سیما؛ آژانس دیجیتال مارکتینگ در ارومیه',
    hero_highlight: 'طراحی سایت، سئو و تولید محتوا',
    hero_description:
      'تیمی از متخصصان طراحی سایت، سئو و تولید محتوا در ارومیه؛ از ایده تا اجرا، با خلاقیت و شناخت عمیق بازار کنار شما هستیم تا برندتان دیده شود.',
    primary_cta_text: 'دریافت مشاوره رایگان',
    primary_cta_url: '/contact/',
    secondary_cta_text: 'مشاهده خدمات',
    secondary_cta_url: '/services/',
    services_section_title: 'خدمات دیجیتال مارکتینگ اروم سیما',
    services_section_subtitle: 'راهکارهای جامع برای طراحی سایت، سئو، برندینگ و بازاریابی دیجیتال در ارومیه',
    services_section_desc: 'از طراحی تا اجرا، تمام نیازهای دیجیتال کسب‌وکار شما را پوشش می‌دهیم',
    why_section_title: 'چرا اروم سیما؟',
    why_section_subtitle: 'تفاوت ما در تعهد، تخصص محلی و نتایج measurable',
    portfolio_section_title: 'نمونه کارهای موفق ما',
    portfolio_section_subtitle: 'پروژه‌هایی که واقعاً فروش و برند شما را رشد دادند',
    portfolio_section_desc: 'نگاهی به برخی از پروژه‌های برجسته‌ای که با موفقیت اجرا کرده‌ایم',
    process_section_title: 'روند همکاری با اروم سیما',
    process_section_subtitle: 'از مشاوره اولیه تا تحویل پروژه و پشتیبانی مداوم — در ۵ مرحله ساده',
    process_section_desc: 'از مشاوره اولیه تا اجرا و پشتیبانی، در کنار شما هستیم',
    testimonial_section_title: 'نظرات مشتریان ما',
    testimonial_section_subtitle: 'آنچه کسب‌وکارهای ارومیه و آذربایجان غربی درباره ما می‌گویند',
    pricing_section_title: 'آماده رشد هستید؟',
    pricing_section_subtitle: 'مشاوره رایگان بگیرید و پکیج مناسب کسب‌وکارتان را دریافت کنید',
    pricing_section_desc: 'پکیج‌های متنوع برای هر نوع کسب‌وکاری، از استارتاپ تا شرکت‌های بزرگ',
    growth_section_badge: 'رشد و موفقیت',
    growth_section_title: 'مسیر رشد مشتریان اروم سیما',
    growth_section_desc: 'نمودار واقعی رشد کسب و کار مشتریان پس از دریافت خدمات سئو، طراحی سایت و تبلیغات',
    bottom_cta_badge: 'مشاوره رایگان',
    bottom_cta_title: 'آماده رشد کسب‌وکارتان هستید؟',
    bottom_cta_text: 'برای مشاوره رایگان دیجیتال مارکتینگ، طراحی سایت، سئو و تولید محتوا با کارشناسان اروم سیما تماس بگیرید.',
    bottom_cta_primary_label: 'دریافت مشاوره رایگان',
    bottom_cta_primary_url: '/contact/',
    bottom_cta_secondary_label: 'مشاهده نمونه‌کارها',
    bottom_cta_secondary_url: '/portfolio/',
    hero_service_1_title: 'طراحی سایت',
    hero_service_2_title: 'سئو حرفه‌ای',
    hero_service_3_title: 'تبلیغات دیجیتال',
    hero_service_4_title: 'تولید محتوا',
    hero_trust_1: 'پشتیبانی ۲۴/۷',
    hero_trust_2: 'تحویل به‌موقع',
    hero_trust_3: 'ضمانت کیفیت',
    hero_trust_4: 'مشاوره رایگان',
    show_ticker: true,
    show_services: true,
    show_why: true,
    show_counters: true,
    show_portfolio: true,
    show_growth: true,
    show_process: true,
    show_testimonials: true,
    show_pricing: true,
  };

  return {
    landingPage: {
      site_title: landingRow?.site_title || landingFallback.site_title,
      meta_title: landingRow?.meta_description ? undefined : landingRow?.site_title,
      meta_description: landingRow?.meta_description || undefined,
      og_title: landingRow?.og_title || undefined,
      og_description: landingRow?.og_description || undefined,
      canonical_url: landingRow?.canonical_url || undefined,
      meta_robots: landingRow?.meta_robots || undefined,
      og_image: resolveMediaUrl(landingRow?.og_image) || undefined,
      hero_badge: landingRow?.hero_badge || landingFallback.hero_badge,
      hero_title: landingRow?.hero_title || landingFallback.hero_title,
      hero_highlight: landingRow?.hero_highlight || landingFallback.hero_highlight,
      hero_description: landingRow?.hero_description || landingFallback.hero_description,
      primary_cta_text: landingRow?.primary_cta_text || landingFallback.primary_cta_text,
      primary_cta_url: landingRow?.primary_cta_url ? resolveMediaUrl(landingRow.primary_cta_url) : landingFallback.primary_cta_url,
      secondary_cta_text: landingRow?.secondary_cta_text || landingFallback.secondary_cta_text,
      secondary_cta_url: landingRow?.secondary_cta_url || landingFallback.secondary_cta_url,
      services_section_title: landingRow?.services_section_title || landingFallback.services_section_title,
      services_section_subtitle: landingRow?.services_section_subtitle || landingFallback.services_section_subtitle,
      services_section_desc: landingRow?.services_section_desc || landingFallback.services_section_desc,
      why_section_title: landingRow?.why_section_title || landingFallback.why_section_title,
      why_section_subtitle: landingRow?.why_section_subtitle || landingFallback.why_section_subtitle,
      why_side_image: resolveMediaUrl(landingRow?.why_side_image) || '/images/team-photo.webp',
      why_side_image_alt: landingRow?.why_side_image_alt || 'تیم اروم سیما',
      why_side_image_link: landingRow?.why_side_image_link || '',
      portfolio_section_title: landingRow?.portfolio_section_title || landingFallback.portfolio_section_title,
      portfolio_section_subtitle: landingRow?.portfolio_section_subtitle || landingFallback.portfolio_section_subtitle,
      portfolio_section_desc: landingRow?.portfolio_section_desc || landingFallback.portfolio_section_desc,
      process_section_title: landingRow?.process_section_title || landingFallback.process_section_title,
      process_section_subtitle: landingRow?.process_section_subtitle || landingFallback.process_section_subtitle,
      process_section_desc: landingRow?.process_section_desc || landingFallback.process_section_desc,
      testimonial_section_title: landingRow?.testimonial_section_title || landingFallback.testimonial_section_title,
      testimonial_section_subtitle: landingRow?.testimonial_section_subtitle || landingFallback.testimonial_section_subtitle,
      pricing_section_title: landingRow?.pricing_section_title || landingFallback.pricing_section_title,
      pricing_section_subtitle: landingRow?.pricing_section_subtitle || landingFallback.pricing_section_subtitle,
      pricing_section_desc: landingRow?.pricing_section_desc || landingFallback.pricing_section_desc,
      growth_section_badge: landingRow?.growth_section_badge || landingFallback.growth_section_badge,
      growth_section_title: landingRow?.growth_section_title || landingFallback.growth_section_title,
      growth_section_desc: landingRow?.growth_section_desc || landingFallback.growth_section_desc,
      bottom_cta_badge: landingRow?.bottom_cta_badge || landingFallback.bottom_cta_badge,
      bottom_cta_title: landingRow?.bottom_cta_title || landingFallback.bottom_cta_title,
      bottom_cta_text: landingRow?.bottom_cta_text || landingFallback.bottom_cta_text,
      bottom_cta_primary_label: landingRow?.bottom_cta_primary_label || landingFallback.bottom_cta_primary_label,
      bottom_cta_primary_url: landingRow?.bottom_cta_primary_url || landingFallback.bottom_cta_primary_url,
      bottom_cta_secondary_label: landingRow?.bottom_cta_secondary_label || landingFallback.bottom_cta_secondary_label,
      bottom_cta_secondary_url: landingRow?.bottom_cta_secondary_url || landingFallback.bottom_cta_secondary_url,
      hero_service_1_title: landingRow?.hero_service_1_title || landingFallback.hero_service_1_title,
      hero_service_2_title: landingRow?.hero_service_2_title || landingFallback.hero_service_2_title,
      hero_service_3_title: landingRow?.hero_service_3_title || landingFallback.hero_service_3_title,
      hero_service_4_title: landingRow?.hero_service_4_title || landingFallback.hero_service_4_title,
      hero_trust_1: landingRow?.hero_trust_1 || landingFallback.hero_trust_1,
      hero_trust_2: landingRow?.hero_trust_2 || landingFallback.hero_trust_2,
      hero_trust_3: landingRow?.hero_trust_3 || landingFallback.hero_trust_3,
      hero_trust_4: landingRow?.hero_trust_4 || landingFallback.hero_trust_4,
      show_ticker: landingRow?.show_ticker ?? true,
      show_services: landingRow?.show_services ?? true,
      show_why: landingRow?.show_why ?? true,
      show_counters: landingRow?.show_counters ?? true,
      show_portfolio: landingRow?.show_portfolio ?? true,
      show_growth: landingRow?.show_growth ?? true,
      show_process: landingRow?.show_process ?? true,
      show_testimonials: landingRow?.show_testimonials ?? true,
      show_pricing: landingRow?.show_pricing ?? true,
    },
    tickerItems: tickerItems.length > 0
      ? tickerItems.map((t) => ({ id: t.id, text: t.text }))
      : ((landingFallback as any).ticker_items || [
          { id: 1, text: '🚀 رشد ۳۰۰٪ ترافیک سایت در ۳ ماه' },
          { id: 2, text: '💡 طراحی مدرن و ریسپانسیو' },
          { id: 3, text: '🎯 استراتژی محتوای هدفمند' },
          { id: 4, text: '📈 رتبه اول گوگل برای کلمات کلیدی' },
          { id: 5, text: '🤝 پشتیبانی ۲۴/۷' },
        ]),
    whyItems: whyItems.map((w, idx) => ({
      id: w.id,
      number: w.number || String(idx + 1),
      title: w.title,
      description: w.description,
    })),
    counters: counters.map((c) => ({
      id: c.id,
      icon: c.icon || '🏆',
      value: c.value,
      suffix: c.suffix || '',
      label: c.label,
    })),
    growthStats: growthStats.map((g) => ({
      id: g.id,
      icon: g.icon || '📈',
      value: g.value,
      label: g.label,
    })),
    processSteps: processSteps.map((p) => ({
      id: p.id,
      step_number: p.step_number,
      title: p.title,
      description: p.description,
    })),
    testimonials: testimonials.map((t) => ({
      id: t.id,
      name: t.name,
      role: t.role || '',
      company: t.company || '',
      text: t.text || '',
      stars: t.stars || 5,
      is_video: t.media_type === 'video' || Boolean(t.video_file || t.embed_url),
      video_url: t.video_file ? resolveMediaUrl(t.video_file) : (t.embed_url || undefined),
      video_thumbnail: resolveMediaUrl(t.video_thumbnail) || undefined,
      avatar_text: t.avatar_text || undefined,
    })),
    roiConfig: {
      is_active: roiConfigRow ? Boolean(roiConfigRow.is_active) : true,
      title: roiConfigRow?.title || 'رشد کسب‌وکار شما با دیجیتال مارکتینگ',
      subtitle: roiConfigRow?.subtitle || 'در ۴ مرحله ساده، برآورد تقریبی رشد را ببینید',
      disclaimer: roiConfigRow?.disclaimer || 'برآورد تقریبی بر اساس میانگین پروژه‌های مشابه — برای تحلیل دقیق‌تر مشاوره رایگان بگیرید.',
      web_seo_min: roiConfigRow?.web_seo_min || 15,
      web_seo_max: roiConfigRow?.web_seo_max || 35,
      content_min: roiConfigRow?.content_min || 20,
      content_max: roiConfigRow?.content_max || 50,
      ads_min: roiConfigRow?.ads_min || 10,
      ads_max: roiConfigRow?.ads_max || 25,
      sales_min: roiConfigRow?.sales_slider_min || 50000000,
      sales_max: roiConfigRow?.sales_slider_max || 5000000000,
    },
    reelsConfig: {
      is_active: reelsConfigRow ? Boolean(reelsConfigRow.is_active) : true,
      title: reelsConfigRow?.title || 'آخرین Reels ما',
      subtitle: reelsConfigRow?.subtitle || 'محتوای کوتاه و کاربردی از اینستاگرام اروم سیما',
      placeholder_text: reelsConfigRow?.placeholder_text || 'به‌زودی',
      follow_cta_text: reelsConfigRow?.follow_cta_text || 'ما را در اینستاگرام دنبال کنید',
    },
    reels: reels.map((r) => ({
      id: r.id,
      reel_url: r.reel_url,
      thumbnail: resolveMediaUrl(r.thumbnail) || '/images/urumsima3.webp',
      caption: r.caption || '',
    })),
    mapProjectsCount: mapProjects.length,
    mapProjects,
    beforeAfterProject,
    featuredProjects,
    services: services.slice(0, 6),
    pricingPlans: pricing.plans,
  };
}

/**
 * Fetch live Abner page and model data from database, with fallback to abner.json
 */
export async function getLiveAbnerData(): Promise<any> {
  const fallback = abnerFallback;
  try {
    const [page, features, cityTvModels, standModels] = await Promise.all([
      prisma.abnerAbnerpage.findFirst().catch(() => null),
      prisma.abnerAbnerfeature.findMany({ orderBy: { order: 'asc' } }).catch(() => []),
      prisma.abnerAbnercitytvmodel.findMany({ orderBy: { order: 'asc' } }).catch(() => []),
      prisma.abnerAbnerstandmodel.findMany({ orderBy: { order: 'asc' } }).catch(() => []),
    ]);

    return {
      title: page?.hero_title || fallback.title,
      subtitle: page?.hero_tagline || fallback.subtitle,
      meta_title: page?.meta_title || fallback.meta_title,
      meta_description: page?.meta_description || fallback.meta_description,
      features:
        features.length > 0
          ? features.map((f) => ({
              title: f.title,
              description: f.description,
              icon: f.icon || 'ShieldCheck',
            }))
          : fallback.features,
      city_tv_models:
        cityTvModels.length > 0
          ? cityTvModels.map((m) => ({
              model: m.name,
              pixel_pitch: m.pixel_pitch,
              brightness: m.brightness,
              viewing_distance: 'استاندارد شهری',
              ip_rating: m.ip_rating || 'IP65',
              refresh_rate: m.refresh_rate || '3840 Hz',
              application:
                m.environment === 'Outdoor'
                  ? 'فضای باز، میادین و بلوارها'
                  : 'فضای بسته، تالارها و کنفرانس',
            }))
          : fallback.city_tv_models,
      stands:
        standModels.length > 0
          ? standModels.map((s) => ({
              model: s.name,
              size: s.width && s.height ? `${s.width} × ${s.height}` : '55 inch',
              os: s.wifi ? `WiFi: ${s.wifi}` : 'Android 11 / Windows 10',
              resolution: s.resolution || '4K UHD',
              touch_type: s.bezel || 'Capacitive 10-Point Touch',
              body: s.body_material || 'آلومینیوم صنعتی',
              application: 'مراکز خرید، هتل‌ها، بیمارستان‌ها، شعب بانکی',
            }))
          : fallback.stands,
    };
  } catch (e) {
    console.warn('DB Abner query failed, using static fallback:', e);
    return fallback;
  }
}




