import fs from 'fs';

const blogSlugs = [
  'tizer-tablighati-chist',
  'entekhab-sherkat-tarahi-site-uromiye',
  'marhale-tarahi-site-sherkati',
  'tafavot-site-sherkati-va-foroshgahi',
  'tarahi-site-sherkati-chist',
  'tarahi-site-sanati-chist',
  'hazine-tarahi-site-sherkati-uromiye',
  'tolid-mohtava-instagram-osooli-ya-bedoon-barnameh',
  'modiriat-instagram-herfei-ya-shakhsi',
  'seo-che-mizan-zaman-mibarad',
  'chera-site-shoma-dar-google-dide-nemishavad',
  'chera-site-niaz-be-seo-darad',
  'tarahi-site-forooshgahi-ya-sherkati',
  'tarahi-site-ekhtesasi-ya-wordpress',
  'chera-kasb-o-kar-niaz-be-site-darad'
];

const serviceSlugs = [
  'corporate-industrial-web-design',
  'instagram-content-creation-management',
  'industrial-commercial-video-production',
  'logo-corporate-identity-design',
  'billboard-outdoor-advertising-design'
];

const websiteSlugs = [
  'shoes-website',
  'jewelry-website',
  'glassia-website',
  'Home-Appliances-website',
  'Watch-website'
];

async function scrapeBlogs() {
  console.log('=== SCRAPING BLOG ARTICLES ===');
  const articles = [];

  for (const slug of blogSlugs) {
    const url = `https://urumsima.ir/blog/${slug}/`;
    try {
      const res = await fetch(url);
      if (res.status !== 200) {
        console.warn(`  Failed ${slug}: status ${res.status}`);
        continue;
      }
      const html = await res.text();

      const titleMatch = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || html.match(/<title>([^<]+)<\/title>/i);
      const title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').split('|')[0].trim() : slug;

      const metaDescMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);
      const metaDesc = metaDescMatch ? metaDescMatch[1].trim() : '';

      const ogImgMatch = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i);
      let ogImg = ogImgMatch ? ogImgMatch[1] : '';
      if (ogImg.startsWith('https://urumsima.ir/')) {
        ogImg = ogImg.replace('https://urumsima.ir/', '').replace(/^media\//, '');
      }

      // Breadcrumb category
      const catMatch = html.match(/<a[^>]+href=["']\/blog\/category\/([^"'/]+)\/["'][^>]*>([^<]+)<\/a>/i);
      const categorySlug = catMatch ? catMatch[1] : 'digital-marketing';
      const categoryName = catMatch ? catMatch[2].trim() : 'دیجیتال مارکتینگ';

      // Read time
      const readTimeMatch = html.match(/(\d+)\s*دقیقه\s*مطالعه/);
      const readTime = readTimeMatch ? parseInt(readTimeMatch[1], 10) : 5;

      // View count
      const viewMatch = html.match(/(\d+)\s*بازدید/);
      const viewCount = viewMatch ? parseInt(viewMatch[1], 10) : 45;

      // Date
      const dateMatch = html.match(/datePublished["']:\s*["']([^"']+)["']/i) ||
                        html.match(/(\d{4}-\d{2}-\d{2})/);
      const publishDate = dateMatch ? dateMatch[1] : '2026-08-01';

      // Extract article main content
      const articleContentMatch = html.match(/<article[^>]*>([\s\S]*?)<\/article>/i) ||
                                  html.match(/class=["']blog-content["'][^>]*>([\s\S]*?)<\/div>/i) ||
                                  html.match(/class=["']post-body["'][^>]*>([\s\S]*?)<\/div>/i);
      
      const bodyHtml = articleContentMatch ? articleContentMatch[1].trim() : metaDesc;

      articles.push({
        slug,
        title,
        excerpt: metaDesc,
        bodyHtml,
        coverImage: ogImg,
        categorySlug,
        categoryName,
        readTime,
        viewCount,
        publishDate
      });
      console.log(`  Scraped blog: "${title.slice(0, 35)}..." (${categoryName})`);
    } catch (err) {
      console.error(`  Error on blog ${slug}:`, err);
    }
  }

  fs.writeFileSync('scripts/scraped_blogs.json', JSON.stringify(articles, null, 2), 'utf8');
  console.log(`Saved ${articles.length} blogs to scripts/scraped_blogs.json`);
}

async function scrapeServices() {
  console.log('\n=== SCRAPING SERVICES ===');
  const services = [];

  for (const slug of serviceSlugs) {
    const url = `https://urumsima.ir/services/${slug}/`;
    try {
      const res = await fetch(url);
      if (res.status !== 200) {
        console.warn(`  Failed service ${slug}: status ${res.status}`);
        continue;
      }
      const html = await res.text();

      const titleMatch = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || html.match(/<title>([^<]+)<\/title>/i);
      const title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').split('|')[0].trim() : slug;

      const metaDescMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);
      const metaDesc = metaDescMatch ? metaDescMatch[1].trim() : '';

      const ogImgMatch = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i);
      let ogImg = ogImgMatch ? ogImgMatch[1] : '';
      if (ogImg.startsWith('https://urumsima.ir/')) {
        ogImg = ogImg.replace('https://urumsima.ir/', '').replace(/^media\//, '');
      }

      // Price start
      const priceMatch = html.match(/([0-9,]+)\s*تومان\s*قیمت\s*شروع/);
      let priceStart = 0;
      if (priceMatch) {
        priceStart = parseFloat(priceMatch[1].replace(/,/g, ''));
      }

      // Duration
      const durMatch = html.match(/([0-9-]+)\s*روز\s*مدت\s*زمان/);
      const duration = durMatch ? durMatch[1] + ' روز' : '۳۰ روز';

      // Full intro / description
      const descMatch = html.match(/class=["']srv-hero-desc["'][^>]*>([\s\S]*?)<\/p>/i) ||
                        html.match(/class=["']srv-desc["'][^>]*>([\s\S]*?)<\/p>/i);
      const desc = descMatch ? descMatch[1].replace(/<[^>]+>/g, '').trim() : metaDesc;

      // Extract FAQs if present
      const faqItems = [...html.matchAll(/class=["']faq-q["'][^>]*>([\s\S]*?)<\/div>[\s\S]*?class=["']faq-a["'][^>]*>([\s\S]*?)<\/div>/gi)].map(m => ({
        question: m[1].replace(/<[^>]+>/g, '').trim(),
        answer: m[2].replace(/<[^>]+>/g, '').trim()
      }));

      services.push({
        slug,
        title,
        short_description: metaDesc,
        description: desc,
        price_start: priceStart,
        duration,
        image: ogImg,
        faqs: faqItems
      });

      console.log(`  Scraped service: "${title.slice(0, 35)}..." (Price: ${priceStart}, Dur: ${duration})`);
    } catch (err) {
      console.error(`  Error on service ${slug}:`, err);
    }
  }

  fs.writeFileSync('scripts/scraped_services.json', JSON.stringify(services, null, 2), 'utf8');
  console.log(`Saved ${services.length} services to scripts/scraped_services.json`);
}

async function scrapeWebsites() {
  console.log('\n=== SCRAPING WEBSITES SHOWCASE ===');
  const websites = [];

  for (const slug of websiteSlugs) {
    const url = `https://urumsima.ir/websites/${slug}/`;
    try {
      const res = await fetch(url);
      if (res.status !== 200) {
        console.warn(`  Failed website ${slug}: status ${res.status}`);
        continue;
      }
      const html = await res.text();

      const titleMatch = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || html.match(/<title>([^<]+)<\/title>/i);
      const title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').split('|')[0].trim() : slug;

      const metaDescMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);
      const metaDesc = metaDescMatch ? metaDescMatch[1].trim() : '';

      const ogImgMatch = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i);
      let ogImg = ogImgMatch ? ogImgMatch[1] : '';
      if (ogImg.startsWith('https://urumsima.ir/')) {
        ogImg = ogImg.replace('https://urumsima.ir/', '').replace(/^media\//, '');
      }

      const liveUrlMatch = html.match(/href=["'](https?:\/\/[^"']+)["'][^>]*class=["'][^"']*live[^"']*["']/i) ||
                           html.match(/href=["'](https?:\/\/[^"']+)["'][^>]*target=["']_blank["']/i);
      const liveUrl = liveUrlMatch ? liveUrlMatch[1] : '';

      websites.push({
        slug,
        title,
        subtitle: metaDesc,
        excerpt: metaDesc,
        cover_image: ogImg,
        live_url: liveUrl,
        client_name: title,
        industry: 'فروشگاهی و اختصاصی'
      });

      console.log(`  Scraped website: "${title}" (Live: ${liveUrl})`);
    } catch (err) {
      console.error(`  Error on website ${slug}:`, err);
    }
  }

  fs.writeFileSync('scripts/scraped_websites.json', JSON.stringify(websites, null, 2), 'utf8');
  console.log(`Saved ${websites.length} websites to scripts/scraped_websites.json`);
}

async function main() {
  await scrapeBlogs();
  await scrapeServices();
  await scrapeWebsites();
}

main().catch(console.error);
