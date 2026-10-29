import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testHiding() {
  const testSlug = `test-conditional-${Date.now()}`;
  console.log('Testing conditional rendering on slug:', testSlug);

  const cat = await prisma.portfolioProjectcategory.findFirst();
  const ind = await prisma.portfolioIndustry.findFirst();

  // 1. Create project with EMPTY/NULL optional fields
  const minimalProject = await prisma.portfolioProject.create({
    data: {
      title: 'پروژه آزمایشی بررسی فیلدهای خالی',
      slug: testSlug,
      description: 'یک توضیح ساده',
      detailed_description: '',
      challenge: '',
      subtitle: '',
      project_date: '',
      thumbnail_image: '',
      canonical_url: '',
      meta_description: '',
      meta_robots: '',
      meta_title: '',
      location_zone: '',
      featured_order: 1,
      order: 999,
      is_active: true,
      featured: false,
      recent: false,
      popular: false,
      show_on_map: false,
      category_id: cat ? cat.id : 1,
      industry_id: ind ? ind.id : 1,
      // All these left null:
      kpi_data: null,
      timeline_steps: null,
      roi_cost: null,
      roi_revenue: null,
      roi_percentage: null,
      website_url: null,
      pdf_url: null,
      desktop_mockup: null,
      mobile_mockup: null,
      tablet_mockup: null,
    },
  });

  console.log('Created minimal project id:', minimalProject.id);

  // 2. Fetch page from running Next.js server
  const res1 = await fetch(`http://localhost:3000/portfolio/${testSlug}/`);
  console.log('Status code for minimal project:', res1.status);
  const html1 = await res1.text();

  const hasChallenge1 = html1.includes('چالش اصلی و راه‌حل مهندسی');
  const hasKpi1 = html1.includes('شاخص‌های کلیدی عملکرد');
  const hasTimeline1 = html1.includes('مراحل اجرای پروژه');
  const hasRoi1 = html1.includes('تحلیل بازگشت سرمایه');
  const hasVideos1 = html1.includes('ویدیوهای مستند');
  const hasShowcase1 = html1.includes('ویترین پیش‌نمایش دستگاه‌ها');

  console.log('\n--- VERIFICATION WHEN FIELDS ARE EMPTY ---');
  console.log('Challenge hidden?', !hasChallenge1);
  console.log('KPIs hidden?', !hasKpi1);
  console.log('Timeline hidden?', !hasTimeline1);
  console.log('ROI hidden?', !hasRoi1);
  console.log('Videos hidden?', !hasVideos1);
  console.log('Showcase hidden?', !hasShowcase1);

  if (!hasChallenge1 && !hasKpi1 && !hasTimeline1 && !hasRoi1 && !hasVideos1 && !hasShowcase1) {
    console.log('✅ ALL empty sections were successfully HIDDEN from the page!');
  } else {
    console.log('❌ Some empty sections appeared!');
  }

  // 3. Now update the project: populate challenge, KPIs, and ROI
  await prisma.portfolioProject.update({
    where: { id: minimalProject.id },
    data: {
      challenge: 'این یک چالش تست است که توسط ادمین اضافه شد.',
      kpi_data: JSON.stringify([{ label: 'رشد فروش تست', value: '+75%' }]),
      roi_percentage: 150,
    },
  });

  // Re-fetch
  const res2 = await fetch(`http://localhost:3000/portfolio/${testSlug}/`);
  const html2 = await res2.text();

  const hasChallenge2 = html2.includes('این یک چالش تست است که توسط ادمین اضافه شد');
  const hasKpi2 = html2.includes('رشد فروش تست');
  const hasRoi2 = html2.includes('تحلیل بازگشت سرمایه');

  console.log('\n--- VERIFICATION WHEN FIELDS ARE POPULATED ---');
  console.log('Challenge appears?', hasChallenge2);
  console.log('KPIs appear?', hasKpi2);
  console.log('ROI appears?', hasRoi2);

  if (hasChallenge2 && hasKpi2 && hasRoi2) {
    console.log('✅ Populated sections successfully APPEARED on the page!');
  }
}

testHiding().finally(() => prisma.$disconnect());
