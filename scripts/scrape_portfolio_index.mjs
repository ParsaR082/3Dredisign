import fs from 'fs';

async function scrapePortfolio() {
  const res = await fetch('https://urumsima.ir/portfolio/');
  const html = await res.text();
  fs.writeFileSync('scripts/portfolio_index.html', html, 'utf8');
  console.log('Saved portfolio_index.html, size:', html.length);

  // Extract category filters
  const catMatches = [...html.matchAll(/data-filter=["']([^"']+)["'][^>]*>([\s\S]*?)<\/button>/gi)];
  console.log('Category filters:');
  catMatches.forEach(m => console.log(' - slug:', m[1], 'label:', m[2].replace(/<[^>]+>/g, '').trim()));

  // Extract project links / cards
  const projectLinks = [...html.matchAll(/href=["'](\/portfolio\/[a-z0-9-]+(?:\/)?)[ "']/gi)].map(m => m[1]);
  const uniqueProjectLinks = [...new Set(projectLinks)].filter(l => l !== '/portfolio/' && !l.includes('/category/'));
  console.log('\nUnique Project links found:', uniqueProjectLinks.length);
  uniqueProjectLinks.forEach(l => console.log(' ->', l));
}

scrapePortfolio().catch(console.error);
