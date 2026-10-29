import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const projects = await prisma.portfolioProject.findMany({ select: { id: true, title: true, slug: true, is_active: true } });
  console.log(`Total Projects in DB: ${projects.length}`);
  projects.forEach(p => console.log(`Project: [${p.id}] slug: "${p.slug}" active: ${p.is_active} title: "${p.title}"`));

  const services = await prisma.serviceService.findMany({ select: { id: true, title: true, slug: true, is_active: true } });
  console.log(`\nTotal Services in DB: ${services.length}`);
  services.forEach(s => console.log(`Service: [${s.id}] slug: "${s.slug}" active: ${s.is_active} title: "${s.title}"`));

  const blogPosts = await prisma.blogPost.findMany({ select: { id: true, title: true, slug: true, status: true } });
  console.log(`\nTotal BlogPosts in DB: ${blogPosts.length}`);
  blogPosts.forEach(b => console.log(`BlogPost: [${b.id}] slug: "${b.slug}" status: ${b.status} title: "${b.title}"`));

  const websites = await prisma.websitesWebsite.findMany({ select: { id: true, title: true, slug: true, status: true } });
  console.log(`\nTotal Websites in DB: ${websites.length}`);
  websites.forEach(w => console.log(`Website: [${w.id}] slug: "${w.slug}" status: ${w.status} title: "${w.title}"`));

  const backstage = await prisma.backstageBackstageitem.findMany({ select: { id: true, title: true, slug: true, status: true } });
  console.log(`\nTotal Backstage in DB: ${backstage.length}`);
  backstage.forEach(b => console.log(`Backstage: [${b.id}] slug: "${b.slug}" status: ${b.status} title: "${b.title}"`));

  const cats = await prisma.portfolioProjectcategory.findMany();
  console.log(`\nTotal Project Categories in DB: ${cats.length}`);
  cats.forEach(c => console.log(`Cat: [${c.id}] name: "${c.name}" slug: "${c.slug}"`));

  const inds = await prisma.portfolioIndustry.findMany();
  console.log(`\nTotal Project Industries in DB: ${inds.length}`);
  inds.forEach(i => console.log(`Ind: [${i.id}] name: "${i.name}"`));

  const techs = await prisma.portfolioTechnology.findMany();
  console.log(`\nTotal Project Technologies in DB: ${techs.length}`);
  techs.forEach(t => console.log(`Tech: [${t.id}] name: "${t.name}"`));

  const images = await prisma.portfolioProjectimage.findMany();
  console.log(`\nTotal Project Images in DB: ${images.length}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
