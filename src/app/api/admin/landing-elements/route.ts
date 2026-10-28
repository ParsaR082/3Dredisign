import { NextResponse } from 'next/server';
import { getCurrentAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'عدم دسترسی.' }, { status: 401 });
  }

  try {
    const [processSteps, whyItems, growthStats, tickerItems, reels] = await Promise.all([
      prisma.publicLandingprocessstep.findMany({
        orderBy: { order: 'asc' },
      }),
      prisma.publicLandingwhyitem.findMany({
        orderBy: { order: 'asc' },
      }),
      prisma.publicLandinggrowthstat.findMany({
        orderBy: { order: 'asc' },
      }),
      prisma.publicLandingtickeritem.findMany({
        orderBy: { order: 'asc' },
      }),
      prisma.publicInstagramreel.findMany({
        orderBy: { order: 'asc' },
      }),
    ]);

    return NextResponse.json({
      success: true,
      processSteps,
      whyItems,
      growthStats,
      tickerItems,
      reels,
    });
  } catch (error: any) {
    console.error('Error fetching landing elements:', error);
    return NextResponse.json({ error: error.message || 'خطا در دریافت المان‌های لندینگ' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'عدم دسترسی.' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { type = 'step', title, description = '', step_number = '۰۱', order = 1, icon = '🚀', value = '۱۰۰+' } = body;

    const landing = await prisma.publicLandingpage.findFirst();
    const landingPageId = landing?.id || 1;

    if (type === 'why') {
      const whyItem = await prisma.publicLandingwhyitem.create({
        data: {
          number: step_number,
          title: title || 'ویژگی برجسته اروم سیما',
          description: description || 'توضیحات مزیت رقابتی',
          order: Number(order) || 1,
          is_active: true,
          landing_page_id: landingPageId,
        },
      });
      return NextResponse.json({ success: true, item: whyItem });
    }

    if (type === 'growth') {
      const growth = await prisma.publicLandinggrowthstat.create({
        data: {
          icon,
          value,
          label: title || 'شاخص رشد',
          order: Number(order) || 1,
          is_active: true,
          landing_page_id: landingPageId,
        },
      });
      return NextResponse.json({ success: true, item: growth });
    }

    if (type === 'ticker') {
      const ticker = await prisma.publicLandingtickeritem.create({
        data: {
          text: title || 'خدمات ویژه آژانس',
          order: Number(order) || 1,
          is_active: true,
          landing_page_id: landingPageId,
        },
      });
      return NextResponse.json({ success: true, item: ticker });
    }

    // Default: process step
    const step = await prisma.publicLandingprocessstep.create({
      data: {
        step_number,
        title: title || 'مرحله جدید',
        description,
        order: Number(order) || 1,
        is_active: true,
        landing_page_id: landingPageId,
      },
    });

    return NextResponse.json({ success: true, item: step });
  } catch (error: any) {
    console.error('Error creating landing element:', error);
    return NextResponse.json({ error: error.message || 'خطا در ثبت المان لندینگ' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'عدم دسترسی.' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const type = searchParams.get('type') || 'step';

    if (!id) {
      return NextResponse.json({ error: 'شناسه الزامی است.' }, { status: 400 });
    }

    if (type === 'why') {
      await prisma.publicLandingwhyitem.delete({ where: { id: Number(id) } });
    } else if (type === 'growth') {
      await prisma.publicLandinggrowthstat.delete({ where: { id: Number(id) } });
    } else if (type === 'ticker') {
      await prisma.publicLandingtickeritem.delete({ where: { id: Number(id) } });
    } else {
      await prisma.publicLandingprocessstep.delete({ where: { id: Number(id) } });
    }

    return NextResponse.json({ success: true, message: 'آیتم با موفقیت حذف شد.' });
  } catch (error: any) {
    console.error('Error deleting landing element:', error);
    return NextResponse.json({ error: error.message || 'خطا در حذف المان' }, { status: 500 });
  }
}
