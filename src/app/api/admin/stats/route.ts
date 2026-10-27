import { NextResponse } from 'next/server';
import { getCurrentAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'عدم دسترسی. لطفاً وارد شوید.' }, { status: 401 });
  }

  try {
    const [
      totalContacts,
      unreadContacts,
      totalProjects,
      totalServices,
      totalTestimonials,
      totalCounters,
      recentContacts,
    ] = await Promise.all([
      prisma.contactContactmessage.count(),
      prisma.contactContactmessage.count({ where: { is_seen: false } }),
      prisma.portfolioProject.count(),
      prisma.serviceService.count(),
      prisma.publicLandingtestimonial.count(),
      prisma.publicLandingcounter.count(),
      prisma.contactContactmessage.findMany({
        take: 5,
        orderBy: { created_at: 'desc' },
      }),
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        totalContacts,
        unreadContacts,
        totalProjects,
        totalServices,
        totalTestimonials,
        totalCounters,
      },
      recentContacts,
      dbStatus: 'اتصال به دیتابیس برقرار است (Active)',
    });
  } catch (error) {
    console.error('Failed to fetch admin stats:', error);
    return NextResponse.json(
      { error: 'خطا در دریافت آمار سیستم.' },
      { status: 500 }
    );
  }
}
