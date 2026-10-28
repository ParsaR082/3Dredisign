import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Testing Prisma connection to Django DB ---');
  
  const [
    usersCount,
    postsCount,
    projectsCount,
    servicesCount,
    websitesCount,
    contactsCount,
    bookingsCount,
    plansCount,
    techleadsCount,
    cityTvCount,
    backstageCount,
    testimonialsCount,
    countersCount
  ] = await Promise.all([
    prisma.authUser.count(),
    prisma.blogPost.count(),
    prisma.portfolioProject.count(),
    prisma.serviceService.count(),
    prisma.websitesWebsite.count(),
    prisma.contactContactmessage.count(),
    prisma.contactConsultationbooking.count(),
    prisma.pricingPricingplan.count(),
    prisma.aboutTechlead.count(),
    prisma.abnerAbnercitytvmodel.count(),
    prisma.backstageBackstageitem.count(),
    prisma.publicLandingtestimonial.count(),
    prisma.publicLandinggrowthstat.count(),
  ]);

  console.log({
    usersCount,
    postsCount,
    projectsCount,
    servicesCount,
    websitesCount,
    contactsCount,
    bookingsCount,
    plansCount,
    techleadsCount,
    cityTvCount,
    backstageCount,
    testimonialsCount,
    countersCount,
  });

  console.log('--- ALL 13 MODULES ACCESSED CLEANLY WITH ZERO ERRORS ---');
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
