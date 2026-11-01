import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Syncing Demo Websites into SQLite ---');

  // 1. Ensure categories exist
  let cafeCat = await prisma.websitesWebsitecategory.findFirst({
    where: { slug: 'cafe-restaurant' }
  });
  if (!cafeCat) {
    cafeCat = await prisma.websitesWebsitecategory.create({
      data: {
        name: 'کافه و رستوران',
        slug: 'cafe-restaurant',
        description: 'وبسایت‌ها و پلتفرم‌های تخصصی کافه، رستوران و سفارش آنلاین',
        order: 4,
        is_active: true,
      }
    });
    console.log('Created Cafe Category with ID:', cafeCat.id);
  }

  let finCat = await prisma.websitesWebsitecategory.findFirst({
    where: { slug: 'fintech-dashboards' }
  });
  if (!finCat) {
    finCat = await prisma.websitesWebsitecategory.create({
      data: {
        name: 'سامانه‌ها و داشبوردها',
        slug: 'fintech-dashboards',
        description: 'داشبوردهای مدیریتی، وب‌اپلیکیشن‌ها و سامانه‌های فین‌تک و معاملاتی',
        order: 5,
        is_active: true,
      }
    });
    console.log('Created FinTech Category with ID:', finCat.id);
  }

  const now = new Date();

  // 2. Neo Cafe
  const cafeData = {
    title: 'کافه رستری نئو (Neo Cafe)',
    slug: 'neo-cafe',
    subtitle: 'پلتفرم جامع کافه رستری، فروشگاه تخصصی قهوه و سفارش آنلاین',
    excerpt: 'پلتفرم یکپارچه نئو کافه شامل معرفی برند، فروشگاه قهوه تازه رست، ابزارهای تخصصی باریستا، منوی سفارش آنلاین و سیستم رزرواسیون VIP.',
    body: 'پلتفرم یکپارچه نئو کافه (Neo Cafe) با سبک طراحی سینمایی و دارک‌مود فاخر، تجربه‌ای منحصربه‌فرد برای شیفتگان قهوه و مشتریان وفادار خلق کرده است. این سامانه با تلفیق فروشگاه اینترنتی دانه‌های قهوه تک‌خاستگاه، منوی آنلاین بار گرم و سرد با جزئیات کاپینگ، و سیستم رزرواسیون میزها و رویدادهای اختصاصی، ارائه‌دهنده راه‌حلی نوین در صنعت کافه و رستری مدرن است.',
    cover_image: '/media/websites/covers/neo-cafe.jpg',
    mobile_preview: '/media/websites/covers/neo-cafe.jpg',
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
    meta_title: 'طراحی سایت کافه رستری نئو | نمونه کار طراحی سایت اروم سیما',
    meta_description: 'مشاهده دمو زنده و ویژگی‌های فنی وب‌سایت کافه رستری تخصصی نئو کافه توسعه داده شده توسط تیم فنی اروم سیما.',
    canonical_url: '/websites/neo-cafe/',
    meta_robots: 'index, follow',
    category_id: cafeCat.id,
    published_at: now,
    updated_at: now,
  };

  let cafeSite = await prisma.websitesWebsite.findFirst({ where: { slug: 'neo-cafe' } });
  if (cafeSite) {
    cafeSite = await prisma.websitesWebsite.update({
      where: { id: cafeSite.id },
      data: cafeData,
    });
    console.log('Updated existing Neo Cafe website ID:', cafeSite.id);
  } else {
    cafeSite = await prisma.websitesWebsite.create({
      data: {
        ...cafeData,
        created_at: now,
      },
    });
    console.log('Created Neo Cafe website ID:', cafeSite.id);
  }

  // Features for Neo Cafe
  await prisma.websitesWebsitefeature.deleteMany({ where: { website_id: cafeSite.id } });
  await prisma.websitesWebsitefeature.createMany({
    data: [
      {
        title: 'روایت سینمایی برند و هویت بصری دارک',
        description: 'طراحی اختصاصی با پالت رنگی گرم و افکت‌های مینیمال برای بازتاب حس اصالت قهوه اسپشالتی',
        icon_label: 'sparkles',
        order: 1,
        website_id: cafeSite.id,
      },
      {
        title: 'فروشگاه قهوه تازه رست و ابزارهای دم‌آوری',
        description: 'انتخاب درجه آسیاب، پروفایل رست دانه‌ها و سیستم خرید سریع با درگاه بانکی',
        icon_label: 'coffee',
        order: 2,
        website_id: cafeSite.id,
      },
      {
        title: 'منوی آنلاین تعاملی سرو در سالن و بیرون‌بر',
        description: 'لیست کامل نوشیدنی‌ها، ماکتل‌ها و دسرهای روز همراه با شاخص طعمی و کالری',
        icon_label: 'menu',
        order: 3,
        website_id: cafeSite.id,
      },
      {
        title: 'رزرواسیون آنلاین میز و پکیج‌های VIP',
        description: 'انتخاب موقعیت میز، ثبت مناسبت‌های خاص و رزرو زمان به همراه تایید پیامکی',
        icon_label: 'calendar',
        order: 4,
        website_id: cafeSite.id,
      },
      {
        title: 'سبد خرید تعاملی و پرفورمنس بهینه',
        description: 'استفاده از آخرین استاندارد Next.js 15 و انیمیشن‌های روان فریمور با لود زیر ۱ ثانیه',
        icon_label: 'zap',
        order: 5,
        website_id: cafeSite.id,
      },
    ],
  });

  // Screenshots for Neo Cafe
  await prisma.websitesWebsitescreenshot.deleteMany({ where: { website_id: cafeSite.id } });
  await prisma.websitesWebsitescreenshot.createMany({
    data: [
      {
        image: '/media/websites/covers/neo-cafe-barista.jpg',
        caption: 'میز باریستا و تجهیزات تخصصی دم‌آوری قهوه',
        device: 'desktop',
        order: 1,
        website_id: cafeSite.id,
      },
      {
        image: '/media/websites/covers/neo-cafe-interior.jpg',
        caption: 'معماری و دکوراسیون سالن اصلی نئو کافه',
        device: 'desktop',
        order: 2,
        website_id: cafeSite.id,
      },
    ],
  });

  // 3. FinMatrix (Digital Dashboard)
  const finData = {
    title: 'داشبورد مدیریتی فین‌ماتریکس (FinMatrix)',
    slug: 'digital-dashboard',
    subtitle: 'پرتال سازمانی تسویه ارزی، مدیریت نقدینگی و خزانه‌داری بین‌المللی',
    excerpt: 'داشبورد تحلیلی و معاملاتی فین‌ماتریکس با قابلیت مانیتورینگ زنده نقدینگی، عمق بازار اوردربوک، تسویه برون‌مرزی و پشتیبانی کامل از چینش دوطرفه RTL و LTR.',
    body: 'سامانه و داشبورد مدیریتی فین‌ماتریکس (FinMatrix) با استفاده از به‌روزترین معماری مدرن وب در Next.js 16 و React 19 پیاده‌سازی شده است. این پلتفرم با ارائه چارت‌های بلادرنگ توازن نقدینگی، ماتریس رزرو ارزی چندگانه، ره‌گیری آنی دفتر کل تراکنش‌ها و ماژول ممیزی قانونی (Compliance Audit)، بستری در کلاس جهانی برای کنترل دارایی‌های مالی نهادی فراهم می‌آورد.',
    cover_image: '/media/websites/covers/finmatrix-dashboard.jpg',
    mobile_preview: '/media/websites/covers/finmatrix-dashboard.jpg',
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
    meta_title: 'طراحی داشبورد سازمانی فین‌ماتریکس | نمونه کار طراحی سایت اروم سیما',
    meta_description: 'مشاهده دمو زنده و تحلیل امکانات داشبورد معاملاتی و مدیریت خزانه‌داری FinMatrix پیاده‌سازی شده توسط اروم سیما.',
    canonical_url: '/websites/digital-dashboard/',
    meta_robots: 'index, follow',
    category_id: finCat.id,
    published_at: now,
    updated_at: now,
  };

  let finSite = await prisma.websitesWebsite.findFirst({ where: { slug: 'digital-dashboard' } });
  if (finSite) {
    finSite = await prisma.websitesWebsite.update({
      where: { id: finSite.id },
      data: finData,
    });
    console.log('Updated existing FinMatrix website ID:', finSite.id);
  } else {
    finSite = await prisma.websitesWebsite.create({
      data: {
        ...finData,
        created_at: now,
      },
    });
    console.log('Created FinMatrix website ID:', finSite.id);
  }

  // Features for FinMatrix
  await prisma.websitesWebsitefeature.deleteMany({ where: { website_id: finSite.id } });
  await prisma.websitesWebsitefeature.createMany({
    data: [
      {
        title: 'مانیتورینگ بلادرنگ و توازن نقدینگی چندارزی',
        description: 'چارت‌های زنده Liquidity Rebalancing با محاسبه هوشمند جریان نقدی و شاخص ریسک لحظه‌ای',
        icon_label: 'activity',
        order: 1,
        website_id: finSite.id,
      },
      {
        title: 'اوردربوک پیشرفته و مصورسازی عمق بازار',
        description: 'نمودار شمعی ژاپنی (Candlestick) تعاملی به همراه حجم معاملات Bid و Ask به صورت زنده',
        icon_label: 'bar-chart-3',
        order: 2,
        website_id: finSite.id,
      },
      {
        title: 'دفتر کل تسویه برون‌مرزی (Bilateral Settlement Ledger)',
        description: 'فهرست تراکنش‌های تسویه شده و در انتظار با تفکیک طرفین معامله و نرخ کارمزد',
        icon_label: 'layers',
        order: 3,
        website_id: finSite.id,
      },
      {
        title: 'معماری دوطرفه قرینه‌ای RTL و LTR',
        description: 'تغییر بدون تاخیر جهت رابط کاربری و بازچیدمان گریدها متناسب با زبان انگلیسی و فارسی',
        icon_label: 'globe',
        order: 4,
        website_id: finSite.id,
      },
      {
        title: 'سیستم ممیزی انطباق و امنیت سازمانی (Compliance Engine)',
        description: 'پایش خودکار سقف مجاز مبادلات مالی و صدور هشدارهای انحراف از پروتکل‌های امنیتی',
        icon_label: 'shield-check',
        order: 5,
        website_id: finSite.id,
      },
    ],
  });

  console.log('Successfully inserted both showcase websites and features!');
}

main()
  .catch((e) => {
    console.error('Error inserting sites:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
