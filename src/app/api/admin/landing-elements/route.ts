import { NextResponse } from 'next/server';
import { getCurrentAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'عدم دسترسی.' }, { status: 401 });
  }

  try {
    const [processSteps, whyItems, growthStats, tickerItems, reels, roiConfig] = await Promise.all([
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
      prisma.publicLandingroiconfig.findFirst(),
    ]);

    return NextResponse.json({
      success: true,
      processSteps,
      whyItems,
      growthStats,
      tickerItems,
      reels,
      roiConfig,
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

    if (type === 'reel') {
      const { video_url = '', cover_image = '', reel_url = '', thumbnail = '', caption = '' } = body;
      const reel = await prisma.publicInstagramreel.create({
        data: {
          reel_url: reel_url || video_url || '',
          thumbnail: thumbnail || cover_image || '',
          caption: caption || title || 'ریلز اینستاگرام',
          order: Number(order) || 1,
          is_active: true,
        },
      });
      return NextResponse.json({ success: true, item: reel });
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

export async function PUT(request: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'عدم دسترسی.' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { type, roiConfig, id } = body;

    if (type === 'roi' || roiConfig) {
      const existing = await prisma.publicLandingroiconfig.findFirst();
      if (existing) {
        const updated = await prisma.publicLandingroiconfig.update({
          where: { id: existing.id },
          data: {
            title: roiConfig.title !== undefined ? roiConfig.title : existing.title,
            subtitle: roiConfig.subtitle !== undefined ? roiConfig.subtitle : existing.subtitle,
            disclaimer: roiConfig.disclaimer !== undefined ? roiConfig.disclaimer : existing.disclaimer,
            is_active: roiConfig.is_active !== undefined ? Boolean(roiConfig.is_active) : existing.is_active,
          },
        });
        return NextResponse.json({ success: true, roiConfig: updated });
      }
    }

    if (!id) {
      return NextResponse.json({ error: 'شناسه آیتم الزامی است.' }, { status: 400 });
    }

    if (type === 'reel') {
      const { reel_url, video_url, thumbnail, cover_image, caption, title, order, is_active } = body;
      const updated = await prisma.publicInstagramreel.update({
        where: { id: Number(id) },
        data: {
          reel_url: reel_url !== undefined ? reel_url : video_url !== undefined ? video_url : undefined,
          thumbnail: thumbnail !== undefined ? thumbnail : cover_image !== undefined ? cover_image : undefined,
          caption: caption !== undefined ? caption : title !== undefined ? title : undefined,
          order: order !== undefined ? Number(order) : undefined,
          is_active: is_active !== undefined ? Boolean(is_active) : undefined,
        },
      });
      return NextResponse.json({ success: true, item: updated });
    }

    if (type === 'step') {
      const { step_number, title, description, order, is_active } = body;
      const updated = await prisma.publicLandingprocessstep.update({
        where: { id: Number(id) },
        data: {
          step_number: step_number !== undefined ? String(step_number) : undefined,
          title: title !== undefined ? String(title) : undefined,
          description: description !== undefined ? String(description) : undefined,
          order: order !== undefined ? Number(order) : undefined,
          is_active: is_active !== undefined ? Boolean(is_active) : undefined,
        },
      });
      return NextResponse.json({ success: true, item: updated });
    }

    if (type === 'why') {
      const { number: step_num, step_number, title, description, order, is_active } = body;
      const updated = await prisma.publicLandingwhyitem.update({
        where: { id: Number(id) },
        data: {
          number: (step_num || step_number) !== undefined ? String(step_num || step_number) : undefined,
          title: title !== undefined ? String(title) : undefined,
          description: description !== undefined ? String(description) : undefined,
          order: order !== undefined ? Number(order) : undefined,
          is_active: is_active !== undefined ? Boolean(is_active) : undefined,
        },
      });
      return NextResponse.json({ success: true, item: updated });
    }

    if (type === 'growth') {
      const { icon, value, label, order, is_active } = body;
      const updated = await prisma.publicLandinggrowthstat.update({
        where: { id: Number(id) },
        data: {
          icon: icon !== undefined ? String(icon) : undefined,
          value: value !== undefined ? String(value) : undefined,
          label: label !== undefined ? String(label) : undefined,
          order: order !== undefined ? Number(order) : undefined,
          is_active: is_active !== undefined ? Boolean(is_active) : undefined,
        },
      });
      return NextResponse.json({ success: true, item: updated });
    }

    if (type === 'ticker') {
      const { title, text, order, is_active } = body;
      const updated = await prisma.publicLandingtickeritem.update({
        where: { id: Number(id) },
        data: {
          text: (title || text) !== undefined ? String(title || text) : undefined,
          order: order !== undefined ? Number(order) : undefined,
          is_active: is_active !== undefined ? Boolean(is_active) : undefined,
        },
      });
      return NextResponse.json({ success: true, item: updated });
    }

    return NextResponse.json({ error: 'نوع نامعتبر' }, { status: 400 });
  } catch (error: any) {
    console.error('Error updating landing element:', error);
    return NextResponse.json({ error: error.message || 'خطا در به‌روزرسانی' }, { status: 500 });
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
    } else if (type === 'reel') {
      await prisma.publicInstagramreel.delete({ where: { id: Number(id) } });
    } else {
      await prisma.publicLandingprocessstep.delete({ where: { id: Number(id) } });
    }

    return NextResponse.json({ success: true, message: 'آیتم با موفقیت حذف شد.' });
  } catch (error: any) {
    console.error('Error deleting landing element:', error);
    return NextResponse.json({ error: error.message || 'خطا در حذف المان' }, { status: 500 });
  }
}
