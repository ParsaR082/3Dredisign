import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const p7 = await prisma.portfolioProject.findUnique({
    where: { id: 7 },
  });
  console.log('Project 7:', p7 ? { id: p7.id, slug: p7.slug, title: p7.title } : null);

  const altin = await prisma.portfolioProject.findFirst({
    where: { slug: 'altin-pasha-website-design' },
  });
  console.log('Altin project:', altin ? { id: altin.id, slug: altin.slug, title: altin.title } : 'Not found');

  const categories = await prisma.portfolioProjectcategory.findMany();
  console.log('Categories count:', categories.length, categories.map(c => ({ id: c.id, name: c.name })));

  const industries = await prisma.portfolioIndustry.findMany();
  console.log('Industries count:', industries.length, industries.map(i => ({ id: i.id, name: i.name })));

  const technologies = await prisma.portfolioTechnology.findMany();
  console.log('Technologies count:', technologies.length, technologies.map(t => ({ id: t.id, name: t.name })));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
