import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('Setting Altin Pasha as the first project across DB and fallback content...');

  // 1. Shift all other projects' orders so Altin Pasha is 0
  await prisma.portfolioProject.updateMany({
    where: {
      slug: { not: 'altin-pasha-website-design' },
      order: { lte: 0 },
    },
    data: {
      order: 1,
      featured_order: 1,
    },
  });

  const kpiData = [
    { label: 'افزایش ترافیک ارگانیک خریداران کشنده', value: '+۲۴۰٪', detail: 'ورودی مستقیم خریداران کشنده‌های اسکانیا و رنو' },
    { label: 'رتبه ۱ کلمات کلیدی واردات خودرو', value: 'صفحه اول گوگل', detail: 'رتبه‌بندی در کلمات تخصصی ترخیص و خرید کشنده' },
    { label: 'نرخ تبدیل سرنخ (Lead Rate)', value: '۱۸.۵٪', detail: 'افزایش تماس‌های مشاوره خرید و استعلام سفارشات' },
  ];

  const timelineSteps = [
    { date: 'فاز ۱', title: 'تحقیقات بازار خودروهای سنگین و برندینگ', description: 'بررسی هویت بصری رقبا در حوزه خودروهای سنگین و تدوین پرسونای مخاطبان تجاری' },
    { date: 'فاز ۲', title: 'طراحی UI/UX ریسپانسیو و موکاپ‌های سه‌گانه', description: 'طراحی اختصاصی صفحات خودروها و کاتالوگ آنلاین در فیگما با رویکرد تعاملی' },
    { date: 'فاز ۳', title: 'توسعه فرانت‌اند با Next.js و بک‌اند اختصاصی', description: 'پیاده‌سازی با فریمورک پیشرفته Next.js و معماری مدرن جهت سرعت فوق‌العاده لود اطلاعات' },
    { date: 'فاز ۴', title: 'تولید محتوا، عکاسی صنعتی و سئو تخصصی', description: 'عکاسی صنعتی کشنده‌ها، ضبط ویدیوهای معرفی و تدوین استراتژی ارگانیک موتورهای جستجو' },
  ];

  const altinData = {
    title: 'طراحی وب‌سایت و تولید محتوای بین‌المللی Altin Pasha',
    subtitle: 'آینده‌ی حرکت، امروز | اتوگالری و پرتال واردات کشنده‌ها و خودروهای لوکس',
    slug: 'altin-pasha-website-design',
    website_url: 'http://altinpasha.ir/',
    description: 'طراحی پرتال تخصصی دو زبانه با فریمورک Next.js و بک‌اند اختصاصی، تولید محتوای ویدیویی صنعتی، عکاسی و سئو ارگانیک برند بین‌المللی آلتین پاشا در زمینه واردات کشنده‌های اسکانیا، رنو، داف و خودروهای سنگین در ارومیه.',
    detailed_description: 'مجموعه بین‌المللی آلتین پاشا (Altin Pasha) به عنوان یکی از پیشگامان واردات مستقیم خودروهای سنگین اروپایی (کشنده‌های اسکانیا R450، رنو T520، داف XF و ولوو FH) و اتوگالری خودروهای سواری لوکس در ارومیه، نیازمند یک پلتفرم دیجیتال با پرفورمنس جهانی بود. تیم اروم‌سیما با تدوین هویت بصری یکپارچه، عکاسی صنعتی از محصولات در محوطه ترخیص و گمرک، تصویربرداری و ضبط تیزرهای ویدیویی سینمایی عمودی و افقی، و پیاده‌سازی معماری مدرن بر بستر Next.js، بستری فوق‌سریع برای کاتالوگ آنلاین مشخصات فنی و استعلام سفارشات واردات ایجاد نمود.',
    challenge: 'اصلی‌ترین چالش این پروژه، بهینه‌سازی بارگذاری کاتالوگ‌های سنگین با رزولوشن بالای 4K برای کشنده‌ها، سرعت لود زیر ۱ ثانیه در اینترنت همراه، و طراحی رابط کاربری تعاملی برای خریداران کشنده‌های تجاری بود که با تکنولوژی کشینگ هوشمند و فشرده‌سازی چندلایه‌ای تصاویر حل شد.',
    order: 0,
    featured: true,
    featured_order: 0,
    recent: true,
    popular: true,
    is_active: true,
    thumbnail_image: 'portfolio/thumbnails/Black_leather_cardholder_silver_key_202607111724.jpeg',
    desktop_mockup: 'portfolio/mockups/desktop/Screenshot_2026-10-14_144606.webp',
    tablet_mockup: 'portfolio/mockups/tablet/Screenshot_2026-10-14_144641.webp',
    mobile_mockup: 'portfolio/mockups/mobile/Screenshot_2026-10-14_144621.webp',
    kpi_data: JSON.stringify(kpiData),
    timeline_steps: JSON.stringify(timelineSteps),
    roi_cost: 120000000,
    roi_revenue: 480000000,
    roi_percentage: 300,
    location_zone: 'شهرک صنعتی فاز ۲ ارومیه',
    latitude: 37.55,
    longitude: 45.07,
    show_on_map: true,
    meta_title: 'طراحی وبسایت و تولید محتوای Altin Pasha | برند تخصصی واردات خودرو',
    meta_description: 'طراحی پورتال جامع و تولید محتوای تخصصی برند بین‌المللی آلتین پاشا، واردات کشنده‌ها و خودروهای لوکس در ارومیه',
    canonical_url: 'https://urumsima.ir/portfolio/altin-pasha-website-design/',
  };

  const updatedAltin = await prisma.portfolioProject.updateMany({
    where: { slug: 'altin-pasha-website-design' },
    data: altinData,
  });

  console.log('Updated Altin Pasha in SQLite:', updatedAltin.count);

  // 2. Update projects.json so Altin Pasha is the FIRST entry
  const projectsJsonPath = path.join(process.cwd(), 'src', 'content', 'projects.json');
  let projectsList = [];
  try {
    projectsList = JSON.parse(fs.readFileSync(projectsJsonPath, 'utf8'));
  } catch (e) {
    projectsList = [];
  }

  // Remove existing altin if present
  projectsList = projectsList.filter((p) => p.slug !== 'altin-pasha-website-design');

  // Insert Altin as #1
  const altinJsonObject = {
    id: 'proj-altin-pasha',
    title: altinData.title,
    subtitle: altinData.subtitle,
    slug: altinData.slug,
    category: 'طراحی و توسعه وبسایت',
    category_slug: 'web-design',
    additional_categories: [
      'برندسازی و طراحی گرافیک',
      'خدمات دیجیتال مارکتینگ یکپارچه',
      'تیزرهای تبلیغاتی و ویدئو',
      'سئو و بهینه‌سازی موتور جستجو',
    ],
    industry: 'واردات و فروش خودرو',
    technologies: ['Next.js', 'Django', 'TypeScript', 'AfterEffect', 'Ai'],
    description: altinData.description,
    detailed_description: altinData.detailed_description,
    challenge: altinData.challenge,
    featured: true,
    project_date: '۱۴۰۳/۰۲/۱۵',
    website_url: 'http://altinpasha.ir/',
    thumbnail_image: '/media/portfolio/thumbnails/Black_leather_cardholder_silver_key_202607111724.jpeg',
    mockups: {
      desktop: '/media/portfolio/mockups/desktop/Screenshot_2026-10-14_144606.webp',
      tablet: '/media/portfolio/mockups/tablet/Screenshot_2026-10-14_144641.webp',
      mobile: '/media/portfolio/mockups/mobile/Screenshot_2026-10-14_144621.webp',
    },
    kpis: kpiData,
    timeline_steps: timelineSteps,
    roi: {
      cost: 120000000,
      revenue: 480000000,
      percentage: 300,
    },
    location_zone: 'شهرک صنعتی فاز ۲ ارومیه',
    latitude: 37.55,
    longitude: 45.07,
  };

  projectsList.unshift(altinJsonObject);
  fs.writeFileSync(projectsJsonPath, JSON.stringify(projectsList, null, 2), 'utf8');
  console.log('Updated src/content/projects.json with Altin Pasha as the first project!');

  // Check top 3 projects from DB now
  const topProjects = await prisma.portfolioProject.findMany({
    where: { is_active: true },
    orderBy: [{ featured: 'desc' }, { order: 'asc' }],
    take: 3,
  });
  console.log('\nTop 3 DB projects now:');
  topProjects.forEach((p, i) => console.log(`${i + 1}. [${p.id}] ${p.title} (slug: ${p.slug}, order: ${p.order}, featured: ${p.featured})`));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
