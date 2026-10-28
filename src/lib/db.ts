import { prisma } from './prisma';
import type { SiteSettings, Service, Project, StatItem, ProjectKPI } from '@/types/content';
import siteSettingsFallback from '@/content/site-settings.json';
import servicesFallback from '@/content/services.json';
import projectsFallback from '@/content/projects.json';

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
];

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
      published_at: b.published_at,
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

