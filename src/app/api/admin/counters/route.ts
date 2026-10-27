import { NextResponse } from 'next/server';
import { getCurrentAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'عدم دسترسی.' }, { status: 401 });
  }

  try {
    const counters = await prisma.publicLandingcounter.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json({ success: true, counters });
  } catch (error) {
    console.error('Error fetching counters:', error);
    return NextResponse.json({ error: 'خطا در دریافت شمارنده‌ها' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'عدم دسترسی.' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, value, suffix, label, icon } = body;

    if (!id) {
      return NextResponse.json({ error: 'شناسه الزامی است.' }, { status: 400 });
    }

    const updated = await prisma.publicLandingcounter.update({
      where: { id: Number(id) },
      data: {
        ...(value !== undefined && { value: Number(value) }),
        ...(suffix !== undefined && { suffix }),
        ...(label !== undefined && { label }),
        ...(icon !== undefined && { icon }),
      },
    });

    return NextResponse.json({ success: true, counter: updated });
  } catch (error: any) {
    console.error('Error updating counter:', error);
    return NextResponse.json({ error: error.message || 'خطا در ویرایش شمارنده' }, { status: 500 });
  }
}
