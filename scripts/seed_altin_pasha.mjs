import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding / Updating Altin Pasha project in SQLite...');
  const now = new Date();

  // 1. Ensure or get Category "خدمات دیجیتال مارکتینگ یکپارچه"
  let mainCat = await prisma.portfolioProjectcategory.findFirst({
    where: { name: 'خدمات دیجیتال مارکتینگ یکپارچه' },
  });
  if (!mainCat) {
    mainCat = await prisma.portfolioProjectcategory.create({
      data: {
        name: 'خدمات دیجیتال مارکتینگ یکپارچه',
        slug: 'integrated-digital-marketing-services',
        order: 1,
        is_active: true,
        is_featured: true,
        icon: 'trending-up',
        cover_image: '',
        meta_title: 'خدمات دیجیتال مارکتینگ یکپارچه',
        meta_description: 'خدمات بازاریابی دیجیتال 360 درجه و برندسازی سازمانی',
        description: 'خدمات بازاریابی دیجیتال 360 درجه',
        created_at: now,
        updated_at: now,
      },
    });
  }

  // 2. Ensure or get Industry "واردات و فروش خودرو"
  let industry = await prisma.portfolioIndustry.findFirst({
    where: { name: 'واردات و فروش خودرو' },
  });
  if (!industry) {
    industry = await prisma.portfolioIndustry.create({
      data: {
        name: 'واردات و فروش خودرو',
        slug: 'car-import-and-sales',
      },
    });
  }

  // 3. Ensure Technologies exist
  const techNames = ['AfterEffect', 'Ai', 'django', 'next.js', 'TypeScript'];
  const allExistingTechs = await prisma.portfolioTechnology.findMany();
  const techRecords = [];
  for (const name of techNames) {
    let tech = allExistingTechs.find(
      (t) => t.name.toLowerCase() === name.toLowerCase() || t.slug.toLowerCase() === name.toLowerCase()
    );
    if (!tech) {
      tech = await prisma.portfolioTechnology.create({
        data: {
          name,
          slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        },
      });
    }
    techRecords.push(tech);
  }

  // 4. Ensure Additional Categories exist
  const addCatNames = [
    'برندسازی و طراحی گرافیک',
    'صنعت /ساختمان',
    'طراحی و توسعه وبسایت و فروشگاه های اینترنتی',
    'مدیریت شبکه‌های اجتماعی و تولید محتوا',
    'طراحی لوگو و هویت بصری',
    'تیزرهای تبلیغاتی و ویدئو',
    'سئو و بهینه‌سازی موتور جستجو',
    'طراحی بیلبورد و تبلیغات محیطی',
    'تولید محتوا و مدیریت شبکه‌های اجتماعی',
  ];
  const addCatRecords = [];
  for (const name of addCatNames) {
    let cat = await prisma.portfolioProjectcategory.findFirst({
      where: { name: { equals: name } },
    });
    if (!cat) {
      cat = await prisma.portfolioProjectcategory.create({
        data: {
          name,
          slug: Buffer.from(name).toString('hex').slice(0, 16),
          order: 1,
          is_active: true,
          is_featured: false,
          icon: 'layers',
          cover_image: '',
          meta_title: name,
          meta_description: name,
          description: name,
          created_at: now,
          updated_at: now,
        },
      });
    }
    addCatRecords.push(cat);
  }

  const kpiData = [
    { label: 'افزایش ترافیک ارگانیک', value: '+240%', detail: 'ورودی مستقیم خریداران کشنده‌ها و خودروهای وارداتی' },
    { label: 'رتبه کلمات کلیدی حوزه واردات', value: 'صفحه اول گوگل', detail: 'رتبه‌بندی در کلمات تخصصی اسکانیا و رنو' },
    { label: 'نرخ تبدیل سرنخ (Lead Rate)', value: '18.5%', detail: 'افزایش ثبت درخواست مشاوره خرید و استعلام قیمت' },
  ];

  const timelineSteps = [
    { date: 'فاز ۱', title: 'تحقیقات بازار و برندینگ', description: 'بررسی هویت بصری رقبا در حوزه خودروهای سنگین و تدوین پرسونای مخاطبان هدف' },
    { date: 'فاز ۲', title: 'طراحی UI/UX و معماری وبسایت', description: 'طراحی اختصاصی صفحات خودروها و کاتالوگ آنلاین در فیگما با رویکرد ریسپانسیو و موکاپ سه گانه' },
    { date: 'فاز ۳', title: 'توسعه فرانت‌اند و بک‌اند', description: 'پیاده‌سازی با فریمورک پیشرفته Next.js و معماری مدرن جهت سرعت فوق‌العاده لود اطلاعات' },
    { date: 'فاز ۴', title: 'تولید محتوا و سئو تخصصی', description: 'عکاسی صنعتی، ضبط ویدیوهای معرفی و تدوین استراتژی ارگانیک موتورهای جستجو' },
  ];

  const projectPayload = {
    title: 'طراحی وبسایت و تولید محتوای Altin Pasha | برند تخصصی واردات خودروهای سواری و سنگین',
    subtitle: 'برند تخصصی واردات خودروهای سواری و سنگین',
    slug: 'altin-pasha-website-design',
    description: 'طراحی وبسایت مدرن و پرسرعت، تدوین استراتژی بازاریابی دیجیتال، برندینگ اختصاصی و سئو تخصصی برای مجموعه بین‌المللی آلتین پاشا در ارومیه.',
    detailed_description: 'پروژه برند آلتین پاشا شامل طراحی وبسایت دو زبانه با معماری فرانت‌اند Next.js و بک‌اند اختصاصی، همراه با عکاسی و فیلم‌برداری صنعتی از کشنده‌ها و خودروهای سنگین وارداتی، هویت بصری یکپارچه و بهینه‌سازی کلمات کلیدی رقابتی حوزه خودرو در موتورهای جستجو می‌باشد.',
    challenge: 'چالش اصلی در این پروژه، سرعت لود کاتالوگ‌های سنگین با رزولوشن بالا و نمایش مشخصات فنی خودروها در انواع دستگاه‌ها (موبایل، تبلت و دسکتاپ) بود که با استفاده از تکنولوژی Next.js، ساختار کشینگ پیشرفته و فشرده‌سازی خودکار رسانه‌ها حل شد.',
    featured: true,
    recent: true,
    popular: true,
    featured_order: 1,
    order: 1,
    is_active: true,
    category_id: mainCat.id,
    industry_id: industry.id,
    project_date: '2024-05-15',
    website_url: 'https://altinpasha.ir/',
    pdf_url: '',
    thumbnail_image: 'portfolio/thumbnails/Black_leather_cardholder_silver_key_202607111724.jpeg',
    thumbnail_video_url: '',
    desktop_mockup: 'portfolio/mockups/desktop/Screenshot_2026-10-14_144606.webp',
    tablet_mockup: 'portfolio/mockups/tablet/Screenshot_2026-10-14_144641.webp',
    mobile_mockup: 'portfolio/mockups/mobile/Screenshot_2026-10-14_144621.webp',
    kpi_data: JSON.stringify(kpiData),
    timeline_steps: JSON.stringify(timelineSteps),
    roi_cost: 120000000,
    roi_revenue: 480000000,
    roi_percentage: 300,
    location_zone: 'شهرک صنعتی',
    latitude: 37.55,
    longitude: 45.07,
    show_on_map: true,
    canonical_url: 'https://urumsima.ir/portfolio/altin-pasha-website-design/',
    meta_title: 'طراحی وبسایت و تولید محتوای Altin Pasha | برند تخصصی واردات خودرو',
    meta_description: 'طراحی پورتال جامع و تولید محتوای تخصصی برند بین‌المللی آلتین پاشا، واردات کشنده‌ها و خودروهای لوکس در ارومیه',
    meta_robots: 'index, follow',
    og_image: 'portfolio/thumbnails/Black_leather_cardholder_silver_key_202607111724.jpeg',
  };

  // Check if exists
  let existing = await prisma.portfolioProject.findFirst({
    where: { slug: 'altin-pasha-website-design' },
  });

  let project;
  if (existing) {
    project = await prisma.portfolioProject.update({
      where: { id: existing.id },
      data: projectPayload,
    });
    console.log('Updated existing Altin Pasha project:', project.id);
  } else {
    project = await prisma.portfolioProject.create({
      data: projectPayload,
    });
    console.log('Created Altin Pasha project with id:', project.id);
  }

  // 5. Link technologies
  await prisma.portfolioProjectTechnologies.deleteMany({
    where: { project_id: project.id },
  });
  for (const tech of techRecords) {
    await prisma.portfolioProjectTechnologies.create({
      data: {
        project_id: project.id,
        technology_id: tech.id,
      },
    });
  }

  // 6. Link additional categories
  await prisma.portfolioProjectAdditionalCategories.deleteMany({
    where: { project_id: project.id },
  });
  for (const ac of addCatRecords) {
    await prisma.portfolioProjectAdditionalCategories.create({
      data: {
        project_id: project.id,
        projectcategory_id: ac.id,
      },
    });
  }

  // 7. Videos
  await prisma.portfolioProjectvideo.deleteMany({
    where: { project_id: project.id },
  });
  await prisma.portfolioProjectvideo.createMany({
    data: [
      {
        project_id: project.id,
        title: 'تیزر ویدیویی عمودی معرفی پاشا',
        video_file: 'portfolio/videos/001-Pasha-V1.mp4',
        optimized_file: 'portfolio/videos/optimized/opt_001-Pasha-V1.mp4',
        orientation: 'portrait',
        width: 1080,
        height: 1920,
        order: 1,
        embed_url: '',
        thumbnail: '',
      },
      {
        project_id: project.id,
        title: 'ویدیوی افقی با کیفیت بالا و معرفی مجموعه خودروهای سنگین',
        video_file: 'portfolio/videos/upscaled-video.mp4',
        optimized_file: 'portfolio/videos/optimized/opt_upscaled-video.mp4',
        orientation: 'landscape',
        width: 2560,
        height: 1440,
        order: 2,
        embed_url: '',
        thumbnail: '',
      },
    ],
  });

  // 8. Gallery Images
  const galleryItems = [
    { image: 'portfolio/gallery/scania-r-450-2018.jpg', caption: 'کشنده اسکانیا R450 مدل ۲۰۱۸' },
    { image: 'portfolio/gallery/scania-r-450-2019.jpg', caption: 'کشنده اسکانیا R450 مدل ۲۰۱۹' },
    { image: 'portfolio/gallery/c06bfb12-3bf1-4b01-b863-7d35ba08eb90.jpg', caption: 'نمای روبروی کشنده و سیستم رانندگی هوشمند' },
    { image: 'portfolio/gallery/scania_s_520.jpg', caption: 'اسکانیا سری S520 هایکب' },
    { image: 'portfolio/gallery/rena_t_520-high.jpg', caption: 'رنو سری T520 سقف بلند وارداتی' },
    { image: 'portfolio/gallery/rena_t_520.jpg', caption: 'کشنده رنو T520' },
    { image: 'portfolio/gallery/rena480.jpg', caption: 'رنو T480 جاده‌ای' },
    { image: 'portfolio/gallery/rena520.jpg', caption: 'کشنده رنو ۵۲۰ توربوشارژ' },
    { image: 'portfolio/gallery/daf530.jpg', caption: 'کشنده داف XF530 اروپایی' },
    { image: 'portfolio/gallery/Renault_T480.jpg', caption: 'رنو تراکس T480 فول آپشن' },
    { image: 'portfolio/gallery/rena.jpg', caption: 'نمای جانبی رنو' },
    { image: 'portfolio/gallery/volvo_FH_500.jpg', caption: 'کشنده ولوو FH500 استاندارد جهانی' },
  ];

  await prisma.portfolioProjectimage.deleteMany({
    where: { project_id: project.id },
  });
  await prisma.portfolioProjectimage.createMany({
    data: galleryItems.map((item, index) => ({
      project_id: project.id,
      image: item.image,
      caption: item.caption,
      orientation: 'landscape',
      width: 1448,
      height: 1086,
      order: index + 1,
    })),
  });

  console.log('Successfully seeded Altin Pasha project, videos, gallery, technologies, and categories!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
