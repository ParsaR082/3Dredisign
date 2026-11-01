import fs from 'fs';

async function scrapeBackstage() {
  const url = 'https://urumsima.ir/backstage/%D9%BE%D8%B4%D8%AA-%D8%B5%D8%AD%D9%86%D9%87-%D9%81%DB%8C%D9%84%D9%85%D8%A8%D8%B1%D8%AF%D8%A7%D8%B1%DB%8C-%D8%B3%D9%BE%DB%8C%D8%AF-%D8%A8%D8%A7%D9%85-%DA%AF%D8%B3%D8%AA%D8%B1/';
  console.log('Scraping backstage from:', url);
  try {
    const res = await fetch(url);
    const html = await res.text();
    const titleMatch = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || html.match(/<title>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').split('|')[0].trim() : 'پشت صحنه فیلمبرداری سپید بام گستر';

    const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);
    const ogImg = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i);
    const videoMatch = html.match(/<video[^>]+src=["']([^"']+)["']/i) || html.match(/<source[^>]+src=["']([^"']+)["']/i);

    const backstageItem = {
      slug: 'پشت-صحنه-فیلمبرداری-سپید-بام-گستر',
      title,
      subtitle: descMatch ? descMatch[1] : '',
      excerpt: descMatch ? descMatch[1] : '',
      cover_image: ogImg ? ogImg[1].replace('https://urumsima.ir/', '').replace(/^media\//, '') : '',
      cover_video: videoMatch ? videoMatch[1].replace('https://urumsima.ir/', '').replace(/^media\//, '') : '',
      location: 'ارومیه',
      duration_label: '۳ دقیقه'
    };
    fs.writeFileSync('scripts/scraped_backstage.json', JSON.stringify(backstageItem, null, 2), 'utf8');
    console.log('Saved backstage:', backstageItem.title);
  } catch (err) {
    console.error('Error backstage:', err);
  }
}

async function scrapeSettings() {
  const url = 'https://urumsima.ir/contact-us/';
  console.log('Scraping settings from:', url);
  try {
    const res = await fetch(url);
    const html = await res.text();

    const phoneMatch = html.match(/(09\d{9})/);
    const phoneDisplay = phoneMatch ? phoneMatch[1] : '09144497787';

    const settings = {
      site_name: 'اروم سیما',
      site_slogan: 'آژانس جامع دیجیتال مارکتینگ و خلاقیت در ارومیه',
      phone_display: '۰۹۱۴ ۴۴۹ ۷۷۸۷',
      phone_e164: '+989144497787',
      whatsapp_number: '989144497787',
      office_address: 'ارومیه، خیابان خیام جنوبی، ساختمان سیما',
      office_city: 'ارومیه',
      office_region: 'آذربایجان غربی',
      office_latitude: 37.552,
      office_longitude: 45.076,
      map_zoom: 15,
      show_contact_map: true,
      instagram_url: 'https://instagram.com/urumsima',
      telegram_url: 'https://t.me/urumsima',
      linkedin_url: 'https://linkedin.com/company/urumsima',
      rubika_url: '',
      footer_about_text: 'اروم سیما، آژانس تخصصی دیجیتال مارکتینگ، طراحی وبسایت‌های پیشرفته مدرن، تیزر و تبلیغات و برندسازی یکپارچه.',
      footer_copyright_text: 'تمامی حقوق مادی و معنوی برای آژانس دیجیتال مارکتینگ اروم سیما محفوظ است.',
      footer_working_hours: 'شنبه تا چهارشنبه: ۹:۰۰ الی ۱۸:۰۰ | پنجشنبه‌ها: ۹:۰۰ الی ۱۴:۰۰'
    };
    fs.writeFileSync('scripts/scraped_settings.json', JSON.stringify(settings, null, 2), 'utf8');
    console.log('Saved settings:', settings.site_name);
  } catch (err) {
    console.error('Error settings:', err);
  }
}

async function main() {
  await scrapeBackstage();
  await scrapeSettings();
}

main().catch(console.error);
