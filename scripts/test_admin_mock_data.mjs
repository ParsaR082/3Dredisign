// scripts/test_admin_mock_data.mjs
// Comprehensive Admin API verification script
// NOTE: PER USER CONSTRAINT, DO NOT DELETE CREATED RECORDS!

const BASE_URL = 'http://localhost:3000';

async function main() {
  console.log('--- Starting Admin API Mock Creation Verification ---');

  // 1. Authenticate
  console.log('\n[1/12] Authenticating as admin...');
  const loginRes = await fetch(`${BASE_URL}/api/admin/auth/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'admin123' }),
  });

  if (!loginRes.ok) {
    throw new Error(`Login failed: ${loginRes.status} ${await loginRes.text()}`);
  }

  const setCookie = loginRes.headers.get('set-cookie');
  const sessionCookie = setCookie ? setCookie.split(';')[0] : '';
  console.log('✓ Successfully authenticated! Session cookie established.');

  const headers = {
    'Content-Type': 'application/json',
    'Cookie': sessionCookie,
  };

  const results = [];

  // Helper for admin POST
  async function adminPost(endpoint, body, label) {
    try {
      const res = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        console.error(`✗ Failed ${label}:`, data.error || res.statusText);
        results.push({ label, status: 'FAILED', error: data.error });
      } else {
        console.log(`✓ Created ${label}:`, data.item?.id || data.project?.id || data.post?.id || data.website?.id || data.member?.id || data.category?.id || data.plan?.id || data.counter?.id || 'SUCCESS');
        results.push({ label, status: 'SUCCESS', data });
      }
      return data;
    } catch (e) {
      console.error(`✗ Error ${label}:`, e.message);
      results.push({ label, status: 'ERROR', error: e.message });
    }
  }

  // 2. Services
  console.log('\n[2/12] Testing Services & Categories...');
  await adminPost('/api/admin/services/', {
    type: 'category',
    name: 'تست دسته‌بندی خدمات ادمین',
    slug: 'admin-test-service-cat-' + Date.now(),
    icon: 'sparkles',
    description: 'تست سیستمی دسته‌بندی خدمات ایجاد شده از پنل',
  }, 'Service Category');

  await adminPost('/api/admin/services/', {
    title: 'تست خدمت دیجیتال ادمین',
    slug: 'admin-test-service-' + Date.now(),
    category_id: 1,
    short_description: 'توضیحات کوتاه خدمت تستی ثبت شده از ادمین',
    description: 'توضیحات تفصیلی خدمت تستی ثبت شده از پنل مدیریت اروم سیما',
    price_start: 15000000,
    duration: '۲ هفته',
    difficulty: 'پیشرفته',
    icon: 'cpu',
  }, 'Service');

  // 3. Projects
  console.log('\n[3/12] Testing Projects, Categories, & Industries...');
  await adminPost('/api/admin/projects/', {
    type: 'category',
    name: 'تست دسته‌بندی پروژه ادمین ' + Date.now(),
    slug: 'admin-test-proj-cat-' + Date.now(),
    description: 'دسته‌بندی نمونه پروژه‌ها',
  }, 'Project Category');

  await adminPost('/api/admin/projects/', {
    type: 'industry',
    name: 'تست صنعت پروژه ادمین ' + Date.now(),
    slug: 'admin-test-industry-' + Date.now(),
  }, 'Project Industry');

  await adminPost('/api/admin/projects/', {
    title: 'تست پروژه نمونه ادمین',
    slug: 'admin-test-project-' + Date.now(),
    subtitle: 'پروژه دیجیتال ثبت شده از پنل ادمین',
    description: 'شرح فرآیند توسعه پروژه تستی توسط ادمین بدون خطای پریزما',
    featured: true,
  }, 'Project');

  // 4. Blog
  console.log('\n[4/12] Testing Blog Category, Author, & Post...');
  await adminPost('/api/admin/blog/', {
    type: 'category',
    name: 'تست موضوع بلاگ ادمین ' + Date.now(),
    slug: 'admin-test-blog-cat-' + Date.now(),
    description: 'موضوع جدید بلاگ ثبت‌شده از پنل',
  }, 'Blog Category');

  await adminPost('/api/admin/blog/', {
    type: 'author',
    name: 'نویسنده تست ادمین ' + Date.now(),
    role: 'کارشناس تولید محتوا',
  }, 'Blog Author');

  await adminPost('/api/admin/blog/', {
    title: 'مقاله تست ادمین در وبلاگ اروم سیما',
    slug: 'admin-test-blog-post-' + Date.now(),
    excerpt: 'خلاصه مقاله آزمایشی تایید صحت فرآیند ثبت و ذخیره داده‌ها',
    content: '<p>این یک محتوای تستی برای تایید ذخیره‌سازی مقالات در وبلاگ است.</p>',
    status: 'published',
  }, 'Blog Post');

  // 5. Websites
  console.log('\n[5/12] Testing Websites & Category...');
  await adminPost('/api/admin/websites/', {
    type: 'category',
    name: 'تست دسته وبسایت ادمین',
    slug: 'admin-test-web-cat-' + Date.now(),
    description: 'دسته‌بندی پرتال‌های وب',
  }, 'Website Category');

  await adminPost('/api/admin/websites/', {
    title: 'پرتال اختصاصی تست ادمین',
    slug: 'admin-test-website-' + Date.now(),
    subtitle: 'سامانه ابری و طراحی وبسایت مدرن',
    excerpt: 'توضیحات نمونه سایت تستی اضافه شده از پنل مدیریت اروم سیما',
    client_name: 'شرکت نمونه پارسا',
    industry: 'فناوری اطلاعات و نرم‌افزار',
    year: 1403,
    status: 'completed',
    is_featured: true,
  }, 'Website Item');

  // 6. Team & Core Values & Timeline
  console.log('\n[6/12] Testing Team, Core Values, & Timeline...');
  await adminPost('/api/admin/team/', {
    name: 'مهندس تست ادمین',
    role: 'توسعه‌دهنده سیستم‌های ارشد ۳D',
    tagline: 'متخصص رندرینگ وب و تجربه کاربری پویا',
    skills_csv: 'React, Three.js, Prisma, Next.js',
    total_projects: 24,
    years_experience: 5,
  }, 'Team Member');

  await adminPost('/api/admin/team/', {
    type: 'corevalue',
    title: 'ارزش بنیادین تست ادمین',
    description: 'تعهد به بالاترین کیفیت فنی، نوآوری مداوم و جلب رضایت کارفرما',
    icon_label: 'shield',
    order: 9,
  }, 'Core Value');

  await adminPost('/api/admin/team/', {
    type: 'timemachine',
    year: '۱۴۰۴',
    title: 'گسترش استودیو سه‌بعدی اروم‌سیما',
    description: 'راه‌اندازی کامل زیرساخت پردیس سه‌بعدی و یکپارچه‌سازی پلتفرم دیجیتال',
    order: 10,
  }, 'Timeline Step');

  // 7. Counters
  console.log('\n[7/12] Testing Counters...');
  await adminPost('/api/admin/counters/', {
    value: 777,
    suffix: '+',
    label: 'پروژه‌های موفق تست ادمین',
    icon: '🎯',
    order: 5,
  }, 'Counter');

  // 8. Pricing Plans
  console.log('\n[8/12] Testing Pricing Plan...');
  await adminPost('/api/admin/pricing/', {
    name: 'پلن تستی ادمین VIP',
    description: 'پکیج کامل خدمات دیجیتال مارکتینگ و طراحی اختصاصی',
    monthly_price: 35000000,
    yearly_price: 350000000,
    billing_period: 'ماهانه',
    is_popular: true,
    features: ['طراحی وبسایت اختصاصی ۳D', 'بهینه‌سازی سئو حرفه‌ای', 'پشتیبانی ۲۴ ساعته'],
  }, 'Pricing Plan');

  // 9. Abner Products & Models
  console.log('\n[9/12] Testing Abner Items...');
  await adminPost('/api/admin/abner/', {
    type: 'product',
    name: 'نمایشگر شهری تستی ادمین',
    slug: 'admin-test-abner-prod-' + Date.now(),
    short_description: 'محصول تستی تلویزیون شهری ال‌ای‌دی آبنر',
  }, 'Abner Product');

  await adminPost('/api/admin/abner/', {
    type: 'citytv',
    name: 'تلویزیون اوتدور تست ادمین P5',
    environment: 'Outdoor',
    pixel_pitch: 'P5',
    brightness: '6000 nits',
  }, 'Abner CityTV Model');

  await adminPost('/api/admin/abner/', {
    type: 'stand',
    name: 'استند لمسی تست ادمین ۵۵ اینچ',
    resolution: '4K Ultra HD',
    body_material: 'آلومینیوم صنعتی آنودایز',
  }, 'Abner Stand Model');

  // 10. Backstage Items
  console.log('\n[10/12] Testing Backstage Items...');
  await adminPost('/api/admin/backstage/', {
    type: 'category',
    name: 'تست دسته پشت صحنه ادمین',
    slug: 'admin-test-backstage-cat-' + Date.now(),
  }, 'Backstage Category');

  await adminPost('/api/admin/backstage/', {
    title: 'تست ویدیوی پشت صحنه اروم سیما',
    slug: 'admin-test-backstage-item-' + Date.now(),
    location: 'استودیو بلک‌باکس اروم سیما',
    duration_label: '۴ روز فیلمبرداری',
    status: 'published',
  }, 'Backstage Item');

  // 11. Landing Elements
  console.log('\n[11/12] Testing Landing Elements...');
  await adminPost('/api/admin/landing-elements/', {
    type: 'step',
    step_number: '۰۵',
    title: 'مرحله تست ادمین: پشتیبانی و توسعه مداوم',
    description: 'همراهی گام به گام مشتری پس از دیپلوی و رشد درآمد',
  }, 'Landing Process Step');

  await adminPost('/api/admin/landing-elements/', {
    type: 'why',
    step_number: '۰۴',
    title: 'تست مزیت رقابتی ادمین',
    description: 'فناوری منحصربفرد رندرینگ تعاملی سه‌بعدی و هوش مصنوعی',
  }, 'Landing Why Item');

  await adminPost('/api/admin/landing-elements/', {
    type: 'growth',
    icon: '⚡',
    value: '۹۹.۹٪',
    title: 'شاخص رشد رضایت تست ادمین',
  }, 'Landing Growth Stat');

  await adminPost('/api/admin/landing-elements/', {
    type: 'ticker',
    title: 'تست نوار متحرک: خلاقیت بی‌مرز در آژانس اروم سیما',
  }, 'Landing Ticker Item');

  // 12. Testimonials
  console.log('\n[12/12] Testing Testimonials...');
  await adminPost('/api/admin/testimonials/', {
    name: 'مهندس پارسا رضایی',
    role: 'مدیرعامل هلدینگ پارسا',
    company: 'هلدینگ پارسا',
    text: 'همکاری با اروم سیما یکی از بهترین تجارب تیم ما در بازطراحی هویت دیجیتال بود.',
    stars: 5,
    is_active: true,
  }, 'Testimonial');

  console.log('\n=============================================');
  console.log('RESULTS SUMMARY:');
  const failed = results.filter(r => r.status !== 'SUCCESS');
  console.log(`Total Tested: ${results.length} | Success: ${results.length - failed.length} | Failed: ${failed.length}`);
  if (failed.length > 0) {
    console.error('Failed items:', failed);
  } else {
    console.log('🎉 ALL ENTITIES CREATED VIA ADMIN API WITHOUT ERRORS!');
    console.log('REMINDER: Records were KEPT in the database per user instruction.');
  }
  console.log('=============================================\n');
}

main().catch(console.error);
