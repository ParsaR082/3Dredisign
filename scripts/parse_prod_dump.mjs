import fs from 'fs';

const content = fs.readFileSync('scratch/urumsima_prod.sql', 'utf8');

function extractTable(tableName) {
  const startMarker = `COPY public.${tableName} `;
  const startIndex = content.indexOf(startMarker);
  if (startIndex === -1) return null;
  const lineEnd = content.indexOf('\n', startIndex);
  const header = content.slice(startIndex, lineEnd);
  const endIndex = content.indexOf('\\.', lineEnd);
  const body = content.slice(lineEnd + 1, endIndex).trim();
  const rows = body ? body.split('\n').map(r => r.split('\t')) : [];
  return { header, rows };
}

console.log('=== ANALYZING PRODUCTION POSTGRESQL DUMP ===');

const projects = extractTable('portfolio_project');
console.log(`\nPortfolio Projects (${projects?.rows.length || 0}):`);
projects?.rows.forEach(r => console.log(`  - #${r[0]}: slug='${r[2]}' title='${r[1]}'`));

const websites = extractTable('websites_website');
console.log(`\nWebsites (${websites?.rows.length || 0}):`);
websites?.rows.forEach(r => console.log(`  - #${r[0]}: slug='${r[2]}' title='${r[1]}' (live_url: ${r[8]})`));

const pricing = extractTable('pricing_pricingplan');
console.log(`\nPricing Plans (${pricing?.rows.length || 0}):`);
pricing?.rows.forEach(r => console.log(`  - #${r[0]}: name='${r[1]}' price='${r[3]}'`));

const blogs = extractTable('blog_post');
console.log(`\nBlog Posts (${blogs?.rows.length || 0}):`);
blogs?.rows.slice(0, 5).forEach(r => console.log(`  - #${r[0]}: slug='${r[2]}' title='${r[1]}'`));
if ((blogs?.rows.length || 0) > 5) console.log(`  ... and ${blogs.rows.length - 5} more posts`);

const settings = extractTable('public_sitesettings');
console.log(`\nSite Settings (${settings?.rows.length || 0}):`);
settings?.rows.forEach(r => console.log(`  - phone: ${r[10]}, whatsapp: ${r[13]}, instagram: ${r[1]}`));
