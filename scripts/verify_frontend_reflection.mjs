// scripts/verify_frontend_reflection.mjs
const BASE_URL = 'http://localhost:3000';

const routes = [
  { url: '/', title: 'صفحه اصلی (لندینگ و پردیس سه‌بعدی)' },
  { url: '/services', title: 'صفحه خدمات' },
  { url: '/portfolio', title: 'صفحه نمونه‌کارها' },
  { url: '/blog', title: 'صفحه وبلاگ و مقالات' },
  { url: '/websites', title: 'صفحه پروژه‌های وب' },
  { url: '/about-us', title: 'صفحه درباره ما (تیم و تایم‌لاین)' },
  { url: '/pricing', title: 'صفحه تعرفه‌ها و پلن‌ها' },
  { url: '/abner', title: 'صفحه محصولات آبنر و تلویزیون‌های شهری' },
  { url: '/backstage', title: 'صفحه پشت صحنه' },
];

async function verify() {
  console.log('--- Verifying Frontend Page Reflection ---');
  let passCount = 0;

  for (const r of routes) {
    try {
      const res = await fetch(`${BASE_URL}${r.url}`);
      const text = await res.text();
      if (res.ok) {
        console.log(`✓ [200 OK] ${r.url} - ${r.title} (HTML length: ${text.length} bytes)`);
        passCount++;
      } else {
        console.error(`✗ [${res.status}] ${r.url} - Error`);
      }
    } catch (e) {
      console.error(`✗ [ERR] ${r.url}:`, e.message);
    }
  }

  console.log(`\nVerified ${passCount} / ${routes.length} frontend pages rendered successfully!`);
}

verify();
