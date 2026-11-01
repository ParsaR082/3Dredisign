import fs from 'fs';

const html = fs.readFileSync('scripts/portfolio_index.html', 'utf8');
const cardMatches = [...html.matchAll(/<article[^>]*>([\s\S]*?)<\/article>/gi)];

console.log('Parsed Projects from index:');
const parsed = [];

cardMatches.forEach((m, idx) => {
  const full = m[0];
  const inner = m[1];

  const catMatch = full.match(/data-cat=["']([^"']+)["']/i);
  const industryMatch = full.match(/data-industry=["']([^"']+)["']/i);
  const dateMatch = full.match(/data-date=["']([^"']+)["']/i);
  const isFeatured = full.includes('pf-card-featured') || inner.includes('pf-badge featured');

  const imgMatch = inner.match(/<img[^>]+src=["']([^"']+)["'][^>]*alt=["']([^"']*)["']/i);
  const linkMatch = inner.match(/href=["'](\/portfolio\/[^"']+)["']/i);
  const catNameMatch = inner.match(/class=["']pf-cat-new["'][^>]*>([^<]+)<\/a>/i);
  const industryNameMatch = inner.match(/class=["']pf-industry-tag["'][^>]*>([^<]+)<\/span>/i);
  const titleMatch = inner.match(/class=["']pf-name-new["'][^>]*>[\s\S]*?<a[^>]*>([\s\S]*?)<\/a>/i);
  const descMatch = inner.match(/class=["']pf-desc-new["'][^>]*>([\s\S]*?)<\/p>/i);
  const techs = [...inner.matchAll(/class=["']pf-tech(?:-badge)?["'][^>]*>([^<]+)<\/span>/gi)].map(t => t[1].trim());

  const slug = linkMatch ? linkMatch[1].replace(/^\/portfolio\//, '').replace(/\/$/, '') : '';

  const item = {
    idx: idx + 1,
    slug,
    title: titleMatch ? titleMatch[1].trim() : '',
    desc: descMatch ? descMatch[1].trim() : '',
    categorySlug: catMatch ? catMatch[1] : '',
    categoryName: catNameMatch ? catNameMatch[1].trim() : '',
    industrySlug: industryMatch ? industryMatch[1] : '',
    industryName: industryNameMatch ? industryNameMatch[1].trim() : '',
    date: dateMatch ? dateMatch[1] : '',
    isFeatured,
    thumbnail: imgMatch ? imgMatch[1] : '',
    techs: [...new Set(techs)]
  };
  parsed.push(item);
  console.log(`[${idx+1}] ${item.slug} (${item.categoryName}) - ${item.title.slice(0, 40)}...`);
});

fs.writeFileSync('scripts/parsed_portfolio_cards.json', JSON.stringify(parsed, null, 2), 'utf8');
console.log('Saved to scripts/parsed_portfolio_cards.json');
