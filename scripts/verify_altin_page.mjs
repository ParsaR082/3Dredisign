async function verify() {
  const url = 'http://localhost:3000/portfolio/altin-pasha-website-design/';
  const res = await fetch(url);
  console.log('Status:', res.status);
  const text = await res.text();

  const checks = [
    { name: 'Title', check: text.includes('طراحی وبسایت و تولید محتوای Altin Pasha') },
    { name: 'Subtitle', check: text.includes('برند تخصصی واردات خودروهای سواری و سنگین') },
    { name: 'Device Showcase Container', check: text.includes('ویترین پیش‌نمایش دستگاه‌ها و نسخه زنده') },
    { name: 'Desktop Ready Badge', check: text.includes('Desktop Ready') && text.includes('تجربه کامل دسکتاپ') },
    { name: 'Mobile Friendly Badge', check: text.includes('Mobile Friendly') && text.includes('نمایش بهینه موبایل') },
    { name: 'Live Website Toggle', check: text.includes('وب‌سایت زنده (Live)') },
    { name: 'Graphic Mockups Toggle', check: text.includes('موکاپ‌های گرافیکی') },
    { name: 'KPIs Section', check: text.includes('شاخص‌های کلیدی عملکرد') && text.includes('+240%') },
    { name: 'Challenge Section', check: text.includes('چالش اصلی و راه‌حل مهندسی اروم‌سیما') },
    { name: 'Timeline Section', check: text.includes('مراحل اجرای پروژه (Timeline & Milestones)') && text.includes('تحقیقات بازار') },
    { name: 'ROI Analysis Section', check: text.includes('تحلیل بازگشت سرمایه (ROI)') && text.includes('+300%') },
    { name: 'Videos Section', check: text.includes('ویدیوهای مستند و تیزرهای پروژه') },
    { name: 'Gallery Section', check: text.includes('گالری تصاویر و مستندات گرافیکی') && text.includes('اسکانیا') },
    { name: 'Technologies Section', check: text.includes('TypeScript') || text.includes('next.js') },
    { name: 'Website Link', check: text.includes('https://altinpasha.ir/') },
  ];

  console.log('\n--- VERIFICATION RESULTS ---');
  let allPassed = true;
  for (const c of checks) {
    console.log(`${c.check ? '✅' : '❌'} ${c.name}: ${c.check}`);
    if (!c.check) allPassed = false;
  }

  if (allPassed) {
    console.log('\n🎉 ALL CHECKS PASSED PERFECTLY!');
  } else {
    console.log('\n⚠️ Some checks failed!');
  }
}

verify();
