import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'file:d:/Projects/UrumSima/Redesign3D/prisma/production_server.db',
    },
  },
});

async function main() {
  console.log('Testing Prisma queries...');
  const cats = await prisma.portfolioProjectcategory.findMany();
  console.log('Categories count:', cats.length);

  const blogs = await prisma.blogPost.findMany();
  console.log('Blog posts count:', blogs.length);

  const websites = await prisma.websitesWebsite.findMany();
  console.log('Websites count:', websites.length);

  const features = await prisma.websitesWebsitefeature.findMany();
  console.log('Features count:', features.length);

  const projects = await prisma.portfolioProject.findMany();
  console.log('Projects count:', projects.length);

  const plans = await prisma.pricingPricingplan.findMany();
  console.log('Plans count:', plans.length);

  console.log('ALL PRISMA QUERIES SUCCEEDED WITH ZERO ERRORS!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
