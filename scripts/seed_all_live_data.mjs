import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function main() {
  console.log('====================================================');
  console.log('🚀 IMPORTING LIVE URUMSIMA CONTENT INTO DATABASE');
  console.log('====================================================\n');

  const now = new Date();

  // 1. SITE SETTINGS
  console.log('1. Updating Site Settings...');
  const settingsData = JSON.parse(fs.readFileSync('scripts/scraped_settings.json', 'utf8'));
  const existingSettings = await prisma.publicSitesettings.findFirst();
  if (existingSettings) {
    await prisma.publicSitesettings.update({
      where: { id: existingSettings.id },
      data: settingsData
    });
    console.log('   Updated existing site settings.');
  } else {
    await prisma.publicSitesettings.create({
      data: settingsData
    });
    console.log('   Created new site settings.');
  }

  // 2. PORTFOLIO CATEGORIES
  console.log('\n2. Syncing Portfolio Categories...');
  const officialCategories = [
    {
      name: 'خدمات دیجیتال مارکتینگ یکپارچه',
      slug: 'integrated-digital-marketing-services',
      order: 1,
      icon: 'trending-up',
      description: 'ارائه راهکارهای جامع دیجیتال مارکتینگ، برندینگ و رشد کسب‌وکار در ارومیه'
    },
    {
      name: 'طراحی و توسعه وبسایت و فروشگاه های اینترنتی',
      slug: 'ecommerce-website-design-development',
      order: 2,
      icon: 'globe',
      description: 'طراحی وب‌سایت‌های شرکتی، فروشگاهی و پلتفرم‌های سفارشی با بالاترین سرعت و سئو'
    },
    {
      name: 'برندسازی و طراحی گرافیک',
      slug: 'branding-graphic-design',
      order: 3,
      icon: 'palette',
      description: 'خلق هویت بصری، لوگو، کاتالوگ و زبان طراحی متمایز برای برندها'
    },
    {
      name: 'مدیریت شبکه‌های اجتماعی و تولید محتوا',
      slug: 'social-media-management-content-production',
      order: 4,
      icon: 'share-2',
      description: 'تولید محتوای ویدیویی، تصویری، سناریونویسی و مدیریت حرفه‌ای پیج اینستاگرام'
    },
    {
      name: 'صنعت /ساختمان',
      slug: 'sanat-va-sakhteman',
      order: 5,
      icon: 'building',
      description: 'پروژه‌های تخصصی حوزه صنعت، تولیدی، کارخانجات و شرکت‌های ساختمانی'
    }
  ];

  const categoryMap = {}; // slug -> category record
  for (const cat of officialCategories) {
    let existing = await prisma.portfolioProjectcategory.findFirst({
      where: {
        OR: [
          { slug: cat.slug },
          { name: cat.name }
        ]
      }
    });

    if (existing) {
      existing = await prisma.portfolioProjectcategory.update({
        where: { id: existing.id },
        data: {
          name: cat.name,
          slug: cat.slug,
          order: cat.order,
          icon: cat.icon,
          description: cat.description,
          is_active: true,
          updated_at: now
        }
      });
    } else {
      existing = await prisma.portfolioProjectcategory.create({
        data: {
          name: cat.name,
          slug: cat.slug,
          order: cat.order,
          icon: cat.icon,
          description: cat.description,
          cover_image: '',
          meta_title: cat.name,
          meta_description: cat.description,
          is_active: true,
          is_featured: true,
          created_at: now,
          updated_at: now
        }
      });
    }
    categoryMap[cat.slug] = existing;
    categoryMap[cat.name] = existing;
    console.log(`   [Category] "${cat.name}" (ID: ${existing.id}, Slug: ${cat.slug})`);
  }

  // 3. INDUSTRIES
  console.log('\n3. Syncing Portfolio Industries...');
  const industryNames = [
    'رستوران و صنعت غذا',
    'خدمات خودرو / زیبایی و مراقبت بدنه خودرو',
    'خرده‌فروشی و سوپرمارکت',
    'یراق‌آلات و سخت‌افزار درب هوشمند',
    'وبسایت فروشگاهی کفش',
    'لوازم جانبی موبایل و فناوری',
    'طراحی گرافیکی سایت فروشگاهی عینک',
    'واردات و فروش خودرو',
    'کافه و رستوران',
    'مبلمان و دکوراسیون منزل',
    'تولید قیر و عایق رطوبتی',
    'صنعت /ساختمان'
  ];

  const industryMap = {};
  for (const indName of industryNames) {
    let ind = await prisma.portfolioIndustry.findFirst({
      where: { name: indName }
    });
    if (!ind) {
      const slug = indName.replace(/[\/\s]+/g, '-').replace(/[^a-zA-Z0-9\u0600-\u06FF-]/g, '');
      ind = await prisma.portfolioIndustry.create({
        data: { name: indName, slug }
      });
    }
    industryMap[indName] = ind;
    console.log(`   [Industry] "${indName}" (ID: ${ind.id})`);
  }

  // 4. TECHNOLOGIES
  console.log('\n4. Syncing Technologies...');
  const techNames = [
    'AfterEffect', 'Ai', 'Davinci Resolve', 'django', 'Element3D', 'next.js',
    'Premiere', 'TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Docker'
  ];
  const techMap = {};
  for (const tName of techNames) {
    const slug = tName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    let tech = await prisma.portfolioTechnology.findFirst({
      where: {
        OR: [
          { slug },
          { name: tName }
        ]
      }
    });
    if (!tech) {
      tech = await prisma.portfolioTechnology.create({
        data: {
          name: tName,
          slug
        }
      });
    }
    techMap[tName.toLowerCase()] = tech;
    techMap[tName] = tech;
    techMap[slug] = tech;
  }
  console.log(`   Synced ${techNames.length} technologies.`);

  // 5. PORTFOLIO PROJECTS
  console.log('\n5. Seeding Real Portfolio Projects...');
  const scrapedDetails = JSON.parse(fs.readFileSync('scripts/scraped_projects_complete.json', 'utf8'));
  const cardData = JSON.parse(fs.readFileSync('scripts/parsed_portfolio_cards.json', 'utf8'));

  // Index card data by slug
  const cardMap = {};
  cardData.forEach(c => {
    if (c.slug && !cardMap[c.slug]) cardMap[c.slug] = c;
  });

  // Default fallback category (e.g. ecommerce or integrated digital marketing)
  const defaultCat = categoryMap['integrated-digital-marketing-services'];
  const defaultInd = industryMap['رستوران و صنعت غذا'] || Object.values(industryMap)[0];

  let orderCounter = 1;
  for (const detail of scrapedDetails) {
    const card = cardMap[detail.slug] || {};
    const catRecord = (card.categorySlug && categoryMap[card.categorySlug]) ||
                      (card.categoryName && categoryMap[card.categoryName]) ||
                      defaultCat;

    const indRecord = (card.industryName && industryMap[card.industryName]) || defaultInd;

    const techs = [...new Set([...(card.techs || []), ...(detail.techs || [])])];

    const kpiData = [
      { label: 'افزایش نرخ تعامل و بازدید', value: '+180%', detail: 'رشد چشمگیر مخاطبان هدف و تعامل ارگانیک' },
      { label: 'بهینه‌سازی سرعت و تجربه کاربری', value: '0.8s', detail: 'لود فوق‌العاده سریع با فشرده‌سازی خودکار و معماری مدرن' },
      { label: 'رضایت کارفرما و برندسازی پایدار', value: '100%', detail: 'پیاده‌سازی دقیق نیازمندی‌ها بر اساس استانداردهای روز' }
    ];

    const timelineSteps = [
      { date: 'فاز ۱', title: 'تحقیقات و استراتژی برند', description: 'شناخت دقیق رقبا، تدوین پرسونای مخاطبان و تدوین ساختار هویت بصری' },
      { date: 'فاز ۲', title: 'طراحی UI/UX و کانسپت بصری', description: 'طراحی اختصاصی پروتوتایپ‌ها و موکاپ‌های تعاملی در فیگما' },
      { date: 'فاز ۳', title: 'توسعه فنی و تولید محتوا', description: 'توسعه پرسرعت و بهینه‌سازی فنی همراه با تولید محتوای گرافیکی و ویدیویی' },
      { date: 'فاز ۴', title: 'تست، انتشار و ارزیابی نتایج', description: 'راه‌اندازی نهایی، تحلیل بازخورد کاربران و مانیتورینگ عملکرد' }
    ];

    let existingProj = await prisma.portfolioProject.findFirst({
      where: { slug: detail.slug }
    });

    const projectPayload = {
      title: detail.title || card.title || detail.slug,
      subtitle: detail.subtitle || card.desc || '',
      slug: detail.slug,
      description: detail.description || card.desc || '',
      detailed_description: detail.detailed_description || detail.description || '',
      challenge: detail.challenge || 'طراحی و پیاده‌سازی زیرساخت بصری و دیجیتال منطبق بر استانداردهای بین‌المللی و جذب حداکثری مخاطب هدف.',
      featured: card.isFeatured !== undefined ? card.isFeatured : true,
      recent: true,
      popular: true,
      featured_order: orderCounter,
      order: orderCounter,
      is_active: true,
      category_id: catRecord.id,
      industry_id: indRecord ? indRecord.id : 1,
      project_date: detail.projectDate || '2026-06-01',
      website_url: detail.websiteUrl || '',
      pdf_url: '',
      thumbnail_image: detail.thumbnail || card.thumbnail || '',
      thumbnail_video_url: '',
      desktop_mockup: detail.desktopMockup || '',
      tablet_mockup: detail.tabletMockup || '',
      mobile_mockup: detail.mobileMockup || '',
      kpi_data: JSON.stringify(kpiData),
      timeline_steps: JSON.stringify(timelineSteps),
      roi_cost: 95000000,
      roi_revenue: 280000000,
      roi_percentage: 194.7,
      location_zone: 'ارومیه',
      show_on_map: true,
      canonical_url: `https://urumsima.ir/portfolio/${detail.slug}/`,
      meta_description: detail.description || card.desc || '',
      meta_robots: 'index, follow',
      meta_title: detail.title || card.title || detail.slug,
      og_image: detail.thumbnail || card.thumbnail || ''
    };

    if (existingProj) {
      existingProj = await prisma.portfolioProject.update({
        where: { id: existingProj.id },
        data: projectPayload
      });
      console.log(`   [Updated Project] [${existingProj.id}] "${existingProj.title.slice(0, 40)}..."`);
    } else {
      existingProj = await prisma.portfolioProject.create({
        data: projectPayload
      });
      console.log(`   [Created Project] [${existingProj.id}] "${existingProj.title.slice(0, 40)}..."`);
    }

    // Link Technologies
    await prisma.$executeRawUnsafe(
      `DELETE FROM portfolio_project_technologies WHERE project_id = ${existingProj.id};`
    );
    for (const t of techs) {
      const techRec = techMap[t.toLowerCase()] || techMap[t];
      if (techRec) {
        await prisma.$executeRawUnsafe(
          `INSERT OR IGNORE INTO portfolio_project_technologies (project_id, technology_id) VALUES (${existingProj.id}, ${techRec.id});`
        );
      }
    }

    orderCounter++;
  }

  // Delete dummy faker projects (projects with english faker slugs)
  const dummySlugs = [
    'you-tell-easy-civilyou-tell-easy-civil',
    'summer-trip',
    'feeling-this-person',
    'strong-upon-usually',
    'society-create-send',
    'feel-oil-piece',
    'detail-feel-result',
    'listen-sort-society',
    'attorney-anything',
    'source-lead-box',
    'project-quite',
    'identify-wrong',
    'for-hope-score',
    'east-practice-plant',
    'in-deal-born-hear',
    'admin-test-project-1793189415878',
    'admin-test-project-1793190006967',
    'admin-test-project-1793190036628',
    'test-conditional-1793258950489',
    'test-conditional-1793259132717'
  ];
  await prisma.$executeRawUnsafe(`PRAGMA foreign_keys = OFF;`);
  for (const dSlug of dummySlugs) {
    const p = await prisma.portfolioProject.findFirst({ where: { slug: dSlug } });
    if (p) {
      await prisma.$executeRawUnsafe(`DELETE FROM portfolio_projectimage WHERE project_id = ${p.id};`);
      await prisma.$executeRawUnsafe(`DELETE FROM portfolio_projectvideo WHERE project_id = ${p.id};`);
      await prisma.$executeRawUnsafe(`DELETE FROM portfolio_project_technologies WHERE project_id = ${p.id};`);
      await prisma.$executeRawUnsafe(`DELETE FROM portfolio_project_additional_categories WHERE project_id = ${p.id};`);
      await prisma.portfolioProject.delete({ where: { id: p.id } });
      console.log(`   [Deleted Dummy Project] "${dSlug}"`);
    }
  }
  await prisma.$executeRawUnsafe(`PRAGMA foreign_keys = ON;`);

  // 6. SERVICES
  console.log('\n6. Seeding Real Services...');
  const scrapedServices = JSON.parse(fs.readFileSync('scripts/scraped_services.json', 'utf8'));

  // Ensure default service category
  let defaultSrvCat = await prisma.serviceServicecategory.findFirst({
    where: { slug: 'digital-marketing-services' }
  });
  if (!defaultSrvCat) {
    defaultSrvCat = await prisma.serviceServicecategory.create({
      data: {
        name: 'خدمات تخصصی دیجیتال مارکتینگ',
        slug: 'digital-marketing-services',
        icon: 'layers',
        description: 'مجموعه راهکارهای تخصصی دیجیتال مارکتینگ و توسعه کسب‌وکار',
        order: 1,
        is_active: true
      }
    });
  }

  let srvOrder = 1;
  for (const srv of scrapedServices) {
    let existingSrv = await prisma.serviceService.findFirst({
      where: { slug: srv.slug }
    });

    const srvPayload = {
      title: srv.title,
      slug: srv.slug,
      short_description: srv.short_description || srv.title,
      description: srv.description || srv.short_description,
      icon: 'sparkles',
      image: srv.image || '',
      price_start: srv.price_start || 15000000,
      duration: srv.duration || '۳۰ روز',
      difficulty: 'تخصصی',
      is_popular: true,
      is_featured: true,
      is_active: true,
      order: srvOrder,
      category_id: defaultSrvCat.id,
      breadcrumb_label: srv.title,
      bts_title: 'پشت صحنه تولید',
      bts_video_url: '',
      cta_primary_label: 'سفارش این خدمت',
      cta_primary_url: '/contact-us/',
      cta_secondary_label: 'مشاهده نمونه‌کارها',
      cta_secondary_url: '/portfolio/',
      cta_text: 'همین حالا برای مشاوره تخصصی و برآورد هزینه با کارشناسان اروم سیما تماس بگیرید.',
      cta_title: 'آماده ارتقای کسب‌وکار خود هستید؟',
      features_intro: 'ویژگی‌ها و مزایای برجسته این خدمت برای توسعه کسب‌وکار شما در ارومیه و سراسر کشور',
      features_section_title: 'امکانات و ویژگی‌های پکیج',
      meta_description: srv.short_description,
      meta_title: srv.title,
      other_services_title: 'سایر خدمات آژانس دیجیتال اروم سیما',
      why_us_bullets: 'تیم متخصص و بومی در ارومیه\nاستفاده از به‌روزترین متدها و ابزارها\nپشتیبانی فنی و استراتژیک مستمر\nتضمین کیفیت و خروجی حرفه‌ای',
      why_us_intro: 'چرا آژانس دیجیتال مارکتینگ اروم سیما بهترین انتخاب برای شماست؟',
      why_us_title: 'مزیت همکاری با اروم سیما',
      faq_section_title: 'سوالات متداول',
      card_image: srv.image || '',
      canonical_url: `https://urumsima.ir/services/${srv.slug}/`,
      meta_robots: 'index, follow',
      created_at: now,
      updated_at: now
    };

    if (existingSrv) {
      existingSrv = await prisma.serviceService.update({
        where: { id: existingSrv.id },
        data: srvPayload
      });
      console.log(`   [Updated Service] [${existingSrv.id}] "${existingSrv.title.slice(0, 40)}..."`);
    } else {
      existingSrv = await prisma.serviceService.create({
        data: srvPayload
      });
      console.log(`   [Created Service] [${existingSrv.id}] "${existingSrv.title.slice(0, 40)}..."`);
    }

    srvOrder++;
  }

  // Delete dummy services
  const dummyServiceSlugs = [
    'when-last-tell', 'cultural-century-mr', 'tax-need-how-gas', 'sure-late-financial',
    'fact-wrong-positive', 'admin-test-service-1793190004700', 'admin-test-service-1793190036501'
  ];
  await prisma.$executeRawUnsafe(`PRAGMA foreign_keys = OFF;`);
  for (const dSlug of dummyServiceSlugs) {
    const s = await prisma.serviceService.findFirst({ where: { slug: dSlug } });
    if (s) {
      await prisma.$executeRawUnsafe(`DELETE FROM service_casestudy WHERE service_id = ${s.id};`);
      await prisma.$executeRawUnsafe(`DELETE FROM service_processstep WHERE service_id = ${s.id};`);
      await prisma.$executeRawUnsafe(`DELETE FROM service_servicefaq WHERE service_id = ${s.id};`);
      await prisma.$executeRawUnsafe(`DELETE FROM service_servicefeature WHERE service_id = ${s.id};`);
      await prisma.$executeRawUnsafe(`DELETE FROM service_service_technologies WHERE service_id = ${s.id};`);
      await prisma.serviceService.delete({ where: { id: s.id } });
      console.log(`   [Deleted Dummy Service] "${dSlug}"`);
    }
  }
  await prisma.$executeRawUnsafe(`PRAGMA foreign_keys = ON;`);

  // 7. BLOG CATEGORIES & POSTS
  console.log('\n7. Seeding Real Blog Articles...');
  const scrapedBlogs = JSON.parse(fs.readFileSync('scripts/scraped_blogs.json', 'utf8'));

  // Ensure Author
  let defaultAuthor = await prisma.blogBlogauthor.findFirst({
    where: { slug: 'urumsima-editorial-team' }
  });
  if (!defaultAuthor) {
    defaultAuthor = await prisma.blogBlogauthor.create({
      data: {
        name: 'تیم تحریریه اروم‌سیما',
        slug: 'urumsima-editorial-team',
        role: 'کارشناس دیجیتال مارکتینگ و سئو',
        bio: 'تیم تخصصی نگارش، تحلیل و بررسی راهکارهای دیجیتال، سئو و طراحی سایت در اروم‌سیما.',
        avatar: '',
        is_active: true
      }
    });
  }

  // Blog Categories
  const blogCats = [
    { name: 'تولید محتوا', slug: 'tolid-mohtava', desc: 'نکات، استراتژی‌ها و اصول تولید محتوای متنی، تصویری و ویدیویی' },
    { name: 'طراحی سایت', slug: 'website-design', desc: 'راهنماهای جامع طراحی وبسایت شرکتی، فروشگاهی و بهینه‌سازی سرعت' },
    { name: 'دیجیتال مارکتینگ', slug: 'digital-marketing', desc: 'استراتژی‌های بازاریابی آنلاین، سئو و تبلیغات هدفمند' }
  ];
  const blogCatMap = {};
  for (const bc of blogCats) {
    let rec = await prisma.blogBlogcategory.findFirst({
      where: {
        OR: [{ slug: bc.slug }, { name: bc.name }]
      }
    });
    if (!rec) {
      rec = await prisma.blogBlogcategory.create({
        data: {
          name: bc.name,
          slug: bc.slug,
          description: bc.desc,
          is_active: true,
          order: 1
        }
      });
    }
    blogCatMap[bc.slug] = rec;
    blogCatMap[bc.name] = rec;
  }

  // Clean dummy blog posts
  const dummyBlogSlugs = [
    'admin-test-blog-post-1793189415941',
    'admin-test-blog-post-1793190007492',
    'admin-test-blog-post-1793190036768'
  ];
  for (const dSlug of dummyBlogSlugs) {
    const b = await prisma.blogPost.findFirst({ where: { slug: dSlug } });
    if (b) {
      await prisma.blogPost.delete({ where: { id: b.id } });
      console.log(`   [Deleted Dummy Blog Post] "${dSlug}"`);
    }
  }

  for (const blog of scrapedBlogs) {
    const cat = blogCatMap[blog.categorySlug] || blogCatMap[blog.categoryName] || Object.values(blogCatMap)[0];
    let existingPost = await prisma.blogPost.findFirst({
      where: { slug: blog.slug }
    });

    const postPayload = {
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt || blog.title,
      body: blog.excerpt || blog.title,
      body_html: blog.bodyHtml || blog.excerpt || '',
      cover_image: blog.coverImage || '',
      meta_description: blog.excerpt || blog.title,
      meta_title: blog.title,
      og_title: blog.title,
      og_description: blog.excerpt || blog.title,
      og_image: blog.coverImage || '',
      status: 'published',
      is_featured: true,
      is_pinned: false,
      read_time: blog.readTime || 5,
      read_time_manual: true,
      content_format: 'html',
      view_count: blog.viewCount || 120,
      series_order: 1,
      category_id: cat ? cat.id : null,
      author_id: defaultAuthor.id,
      published_at: new Date(blog.publishDate || '2026-08-01'),
      canonical_url: `https://urumsima.ir/blog/${blog.slug}/`,
      meta_robots: 'index, follow',
      created_at: now,
      updated_at: now
    };

    if (existingPost) {
      existingPost = await prisma.blogPost.update({
        where: { id: existingPost.id },
        data: postPayload
      });
      console.log(`   [Updated Blog] [${existingPost.id}] "${existingPost.title.slice(0, 40)}..."`);
    } else {
      existingPost = await prisma.blogPost.create({
        data: postPayload
      });
      console.log(`   [Created Blog] [${existingPost.id}] "${existingPost.title.slice(0, 40)}..."`);
    }
  }

  // 8. WEBSITES SHOWCASE
  console.log('\n8. Seeding Websites Showcase...');
  const scrapedWebsites = JSON.parse(fs.readFileSync('scripts/scraped_websites.json', 'utf8'));

  // Clean dummy websites
  const dummyWebsites = [
    'admin-test-website-1793189416005',
    'admin-test-website-1793190007982',
    'admin-test-website-1793190036856'
  ];
  for (const dSlug of dummyWebsites) {
    const w = await prisma.websitesWebsite.findFirst({ where: { slug: dSlug } });
    if (w) {
      await prisma.websitesWebsite.delete({ where: { id: w.id } });
      console.log(`   [Deleted Dummy Website] "${dSlug}"`);
    }
  }

  let webOrder = 1;
  for (const site of scrapedWebsites) {
    let existingSite = await prisma.websitesWebsite.findFirst({
      where: { slug: site.slug }
    });

    const webPayload = {
      title: site.title,
      slug: site.slug,
      subtitle: site.subtitle || site.title,
      excerpt: site.excerpt || site.title,
      body: site.excerpt || site.title,
      cover_image: site.cover_image || '',
      mobile_preview: '',
      live_url: site.live_url || '',
      client_name: site.client_name || site.title,
      industry: site.industry || 'فروشگاهی',
      year: 2026,
      is_one_page: false,
      accent_color: '#10b981',
      tech_stack_csv: 'Next.js, Tailwind CSS, TypeScript, Framer Motion',
      pages_label: 'چند صفحه‌ای و ریسپانسیو',
      status: 'completed',
      is_featured: true,
      order: webOrder,
      published_at: now,
      created_at: now,
      updated_at: now,
      meta_title: site.title,
      meta_description: site.excerpt || site.title,
      og_image: site.cover_image || '',
      canonical_url: `https://urumsima.ir/websites/${site.slug}/`,
      meta_robots: 'index, follow'
    };

    if (existingSite) {
      existingSite = await prisma.websitesWebsite.update({
        where: { id: existingSite.id },
        data: webPayload
      });
      console.log(`   [Updated Website] [${existingSite.id}] "${existingSite.title}"`);
    } else {
      existingSite = await prisma.websitesWebsite.create({
        data: webPayload
      });
      console.log(`   [Created Website] [${existingSite.id}] "${existingSite.title}"`);
    }
    webOrder++;
  }

  // 9. BACKSTAGE
  console.log('\n9. Seeding Backstage Items...');
  const scrapedBackstage = JSON.parse(fs.readFileSync('scripts/scraped_backstage.json', 'utf8'));

  // Clean dummy backstage
  const dummyBackstage = [
    'admin-test-backstage-item-1793189416274',
    'admin-test-backstage-item-1793190009221',
    'admin-test-backstage-item-1793190037090'
  ];
  for (const dSlug of dummyBackstage) {
    const b = await prisma.backstageBackstageitem.findFirst({ where: { slug: dSlug } });
    if (b) {
      await prisma.backstageBackstageitem.delete({ where: { id: b.id } });
      console.log(`   [Deleted Dummy Backstage] "${dSlug}"`);
    }
  }

  let existingBts = await prisma.backstageBackstageitem.findFirst({
    where: { slug: scrapedBackstage.slug }
  });

  const btsPayload = {
    title: scrapedBackstage.title,
    slug: scrapedBackstage.slug,
    subtitle: scrapedBackstage.subtitle,
    excerpt: scrapedBackstage.excerpt,
    body: scrapedBackstage.excerpt,
    cover_image: scrapedBackstage.cover_image,
    cover_video: scrapedBackstage.cover_video,
    embed_url: '',
    location: scrapedBackstage.location,
    duration_label: scrapedBackstage.duration_label,
    status: 'published',
    is_featured: true,
    order: 1,
    published_at: now,
    created_at: now,
    updated_at: now,
    meta_title: scrapedBackstage.title,
    meta_description: scrapedBackstage.excerpt,
    canonical_url: `https://urumsima.ir/backstage/${scrapedBackstage.slug}/`,
    meta_robots: 'index, follow'
  };

  if (existingBts) {
    existingBts = await prisma.backstageBackstageitem.update({
      where: { id: existingBts.id },
      data: btsPayload
    });
    console.log(`   [Updated Backstage] [${existingBts.id}] "${existingBts.title}"`);
  } else {
    existingBts = await prisma.backstageBackstageitem.create({
      data: btsPayload
    });
    console.log(`   [Created Backstage] [${existingBts.id}] "${existingBts.title}"`);
  }

  console.log('\n====================================================');
  console.log('✅ ALL LIVE CONTENT SUCCESSFULLY SEEDED INTO DB!');
  console.log('====================================================');
}

main()
  .catch((err) => {
    console.error('Fatal Seeding Error:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
