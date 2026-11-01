import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const sites = await prisma.websitesWebsite.findMany({
    orderBy: { order: 'asc' },
  });
  const features = await prisma.websitesWebsitefeature.findMany({
    orderBy: { order: 'asc' },
  });
  const categories = await prisma.websitesWebsitecategory.findMany();
  console.log(`Categories:`, categories);
  console.log(`Found ${sites.length} websites:`);
  for (const s of sites) {
    const sFeats = features.filter(f => f.website_id === s.id);
    console.log(`- [${s.id}] ${s.title} (slug: ${s.slug}, order: ${s.order})`);
    console.log(`  live_url: ${s.live_url}`);
    console.log(`  cover_image: ${s.cover_image}`);
    console.log(`  industry: ${s.industry}, client_name: ${s.client_name}`);
    console.log(`  features: ${sFeats.map(f => f.title).join(', ')}`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
