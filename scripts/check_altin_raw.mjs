import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function check() {
  const p = await prisma.portfolioProject.findFirst({
    where: { slug: 'altin-pasha-website-design' },
  });
  console.log('p.timeline_steps:', p.timeline_steps);
  console.log('p.roi_cost:', p.roi_cost, 'p.roi_revenue:', p.roi_revenue, 'p.roi_percentage:', p.roi_percentage);
}

check().finally(() => prisma.$disconnect());
