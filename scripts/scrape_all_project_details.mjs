import fs from 'fs';

const projectSlugs = [
  'altin-pasha-website-design',
  'humazd-restaurant-branding-website',
  'knob-handle-smart-door-hardware-branding',
  'shoes-website-ui-design',
  'mdad-mobile-instagram-content-production',
  'salar-custom-instagram-content-management',
  'eyewear-ai-face-shape-ui',
  'altin-pasha-vehicle-import-website',
  'hypetez-supermarket-ecommerce-website',
  'loghmechi-cafe-branding-design',
  'sepid-bam-web-design-instagram-content',
  'iranian-mobleman-branding-ecommerce-website',
  'faraz-bam-gostar'
];

async function scrapeAll() {
  const results = [];

  for (const slug of projectSlugs) {
    const url = `https://urumsima.ir/portfolio/${slug}/`;
    console.log(`Scraping [${slug}] from ${url}...`);

    try {
      const res = await fetch(url);
      if (res.status !== 200) {
        console.warn(`  Failed with status ${res.status}`);
        continue;
      }
      const html = await res.text();

      // Title & Headings
      const titleTag = html.match(/<title>([^<]+)<\/title>/i);
      const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
      const fullTitle = h1Match ? h1Match[1].replace(/<[^>]+>/g, '').trim() : (titleTag ? titleTag[1].split('|')[0].trim() : slug);

      // Meta & OG
      const metaDesc = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);
      const ogImg = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i);

      // Breadcrumb / Subtitle / Meta row
      const subtitleMatch = html.match(/class=["']pd-hero-desc["'][^>]*>([\s\S]*?)<\/p>/i) ||
                            html.match(/class=["']pd-subtitle["'][^>]*>([\s\S]*?)<\/p>/i);
      const subtitle = subtitleMatch ? subtitleMatch[1].replace(/<[^>]+>/g, '').trim() : '';

      // Date, Category, Industry from page
      const dateMatch = html.match(/dateCreated["']:\s*["']([^"']+)["']/i) ||
                        html.match(/data-date=["']([^"']+)["']/i);
      const projectDate = dateMatch ? dateMatch[1] : '2026-01-01';

      // Category
      const catMatch = html.match(/<a[^>]+href=["']\/portfolio\/category\/([^"'/]+)\/["'][^>]*>([^<]+)<\/a>/i);
      const categorySlug = catMatch ? catMatch[1] : '';
      const categoryName = catMatch ? catMatch[2].trim() : '';

      // Industry
      const indMatch = html.match(/class=["']pd-meta-item[^"']*["'][^>]*>[\s\S]*?class=["']pd-meta-val["'][^>]*>([^<]+)<\/span>/i) ||
                       html.match(/<span class=["']pf-industry-tag["'][^>]*>([^<]+)<\/span>/i);
      const industryName = indMatch ? indMatch[1].trim() : '';

      // Challenge (مشکلی که حل کردیم)
      const challengeSec = html.match(/<div class=["']sec-lbl["'][^>]*>[\s\S]*?چالش[\s\S]*?<\/div>[\s\S]*?<p class=["']sec-desc["'][^>]*>([\s\S]*?)<\/p>/i);
      const challenge = challengeSec ? challengeSec[1].replace(/<[^>]+>/g, '').trim() : '';

      // Solution / Detailed description (چطور این مشکل را حل کردیم)
      const solutionSec = html.match(/<div class=["']sec-lbl["'][^>]*>[\s\S]*?راهکار[\s\S]*?<\/div>[\s\S]*?<p class=["']sec-desc["'][^>]*>([\s\S]*?)<\/p>/i);
      const detailedDesc = solutionSec ? solutionSec[1].replace(/<[^>]+>/g, '').trim() : '';

      // Technologies
      const techSection = html.match(/class=["']pd-tech-tags["'][^>]*>([\s\S]*?)<\/div>/i) ||
                          html.match(/class=["']pd-tech-list["'][^>]*>([\s\S]*?)<\/div>/i);
      let techs = [];
      if (techSection) {
        techs = [...techSection[1].matchAll(/<span[^>]*>([^<]+)<\/span>/gi)].map(m => m[1].trim());
      }

      // External website link
      const liveLink = html.match(/href=["'](https?:\/\/(?!urumsima\.ir)[^"']+)["'][^>]*class=["'][^"']*(?:live|website|visit)[^"']*["']/i) ||
                       html.match(/class=["'][^"']*(?:live|website|visit)[^"']*["'][^>]*href=["'](https?:\/\/(?!urumsima\.ir)[^"']+)["']/i);
      const websiteUrl = liveLink ? liveLink[1] : '';

      // Mockups
      const deskMockup = html.match(/class=["']pd-mk-desktop-screen["'][^>]*>[\s\S]*?<img[^>]+src=["']([^"']+)["']/i);
      const tabMockup = html.match(/class=["']pd-mk-tablet-screen["'][^>]*>[\s\S]*?<img[^>]+src=["']([^"']+)["']/i);
      const mobMockup = html.match(/class=["']pd-mk-mobile-screen["'][^>]*>[\s\S]*?<img[^>]+src=["']([^"']+)["']/i);

      // Gallery Images
      const galleryImgs = [...html.matchAll(/class=["']pd-gal-img["'][^>]*src=["']([^"']+)["']/gi)].map(m => m[1]);

      // Thumbnail Image
      let thumbnail = ogImg ? ogImg[1] : '';
      if (thumbnail.startsWith('https://urumsima.ir/')) {
        thumbnail = thumbnail.replace('https://urumsima.ir/', '').replace(/^media\//, '');
      }

      results.push({
        slug,
        title: fullTitle,
        subtitle,
        description: metaDesc ? metaDesc[1] : subtitle,
        detailed_description: detailedDesc,
        challenge,
        categorySlug,
        categoryName,
        industryName,
        projectDate,
        techs,
        websiteUrl,
        thumbnail,
        desktopMockup: deskMockup ? deskMockup[1].replace(/^\/media\//, '') : '',
        tabletMockup: tabMockup ? tabMockup[1].replace(/^\/media\//, '') : '',
        mobileMockup: mobMockup ? mobMockup[1].replace(/^\/media\//, '') : '',
        galleryImages: galleryImgs.map(img => img.replace(/^\/media\//, ''))
      });

      console.log(`  Done: "${fullTitle.slice(0, 35)}..." (Cat: ${categoryName}, Ind: ${industryName})`);
    } catch (err) {
      console.error(`  Error scraping ${slug}:`, err);
    }
  }

  fs.writeFileSync('scripts/scraped_projects_complete.json', JSON.stringify(results, null, 2), 'utf8');
  console.log(`\nSuccessfully scraped ${results.length} projects to scripts/scraped_projects_complete.json!`);
}

scrapeAll();
