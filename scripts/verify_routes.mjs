import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const BASE_URL = 'http://localhost:3000';

async function checkUrl(url) {
  try {
    const res = await fetch(url);
    return { status: res.status, ok: res.ok };
  } catch (err) {
    return { status: 0, error: err.message };
  }
}

async function main() {
  console.log('--- Testing Project Detail Routes ---');
  const projects = await prisma.portfolioProject.findMany({
    where: { is_active: true },
    select: { id: true, slug: true, title: true }
  });

  let failCount = 0;
  let passCount = 0;

  for (const p of projects) {
    const url = `${BASE_URL}/portfolio/${encodeURIComponent(p.slug)}/`;
    const res = await checkUrl(url);
    if (res.status === 200) {
      console.log(`[PASS 200] /portfolio/${p.slug}/ (${p.title})`);
      passCount++;
    } else {
      console.error(`[FAIL ${res.status}] /portfolio/${p.slug}/ (${p.title})`);
      failCount++;
    }
  }

  // Check fallback static project
  const fallbackUrl = `${BASE_URL}/portfolio/araz-metal-industrial-portal/`;
  const fallbackRes = await checkUrl(fallbackUrl);
  if (fallbackRes.status === 200) {
    console.log(`[PASS 200] /portfolio/araz-metal-industrial-portal/ (Fallback)`);
    passCount++;
  } else {
    console.error(`[FAIL ${fallbackRes.status}] /portfolio/araz-metal-industrial-portal/ (Fallback)`);
    failCount++;
  }

  console.log('\n--- Testing Services Detail Routes ---');
  const services = await prisma.serviceService.findMany({
    where: { is_active: true },
    select: { id: true, slug: true, title: true }
  });
  for (const s of services) {
    const url = `${BASE_URL}/services/${encodeURIComponent(s.slug)}/`;
    const res = await checkUrl(url);
    if (res.status === 200) {
      console.log(`[PASS 200] /services/${s.slug}/ (${s.title})`);
      passCount++;
    } else {
      console.error(`[FAIL ${res.status}] /services/${s.slug}/ (${s.title})`);
      failCount++;
    }
  }

  console.log('\n--- Testing Blog Detail Routes ---');
  const blogPosts = await prisma.blogPost.findMany({
    where: { status: 'published' },
    select: { id: true, slug: true, title: true }
  });
  for (const b of blogPosts) {
    const url = `${BASE_URL}/blog/${encodeURIComponent(b.slug)}/`;
    const res = await checkUrl(url);
    if (res.status === 200) {
      console.log(`[PASS 200] /blog/${b.slug}/ (${b.title})`);
      passCount++;
    } else {
      console.error(`[FAIL ${res.status}] /blog/${b.slug}/ (${b.title})`);
      failCount++;
    }
  }

  console.log('\n--- Testing Websites Detail Routes ---');
  const websites = await prisma.websitesWebsite.findMany({
    select: { id: true, slug: true, title: true }
  });
  for (const w of websites) {
    const url = `${BASE_URL}/websites/${encodeURIComponent(w.slug)}/`;
    const res = await checkUrl(url);
    if (res.status === 200) {
      console.log(`[PASS 200] /websites/${w.slug}/ (${w.title})`);
      passCount++;
    } else {
      console.error(`[FAIL ${res.status}] /websites/${w.slug}/ (${w.title})`);
      failCount++;
    }
  }

  console.log('\n--- Testing Backstage Detail Routes ---');
  const backstage = await prisma.backstageBackstageitem.findMany({
    select: { id: true, slug: true, title: true }
  });
  for (const b of backstage) {
    const url = `${BASE_URL}/backstage/${encodeURIComponent(b.slug)}/`;
    const res = await checkUrl(url);
    if (res.status === 200) {
      console.log(`[PASS 200] /backstage/${b.slug}/ (${b.title})`);
      passCount++;
    } else {
      console.error(`[FAIL ${res.status}] /backstage/${b.slug}/ (${b.title})`);
      failCount++;
    }
  }

  console.log('\n--- Testing Main Listing Pages ---');
  const listPages = [
    '/portfolio/',
    '/services/',
    '/websites/',
    '/backstage/',
    '/blog/',
    '/pricing/',
    '/about-us/',
    '/contact-us/',
    '/abner/',
  ];
  for (const path of listPages) {
    const url = `${BASE_URL}${path}`;
    const res = await checkUrl(url);
    if (res.status === 200) {
      console.log(`[PASS 200] ${path}`);
      passCount++;
    } else {
      console.error(`[FAIL ${res.status}] ${path}`);
      failCount++;
    }
  }

  console.log(`\n========================================`);
  console.log(`TOTAL PASS: ${passCount}`);
  console.log(`TOTAL FAIL: ${failCount}`);
  console.log(`========================================`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
