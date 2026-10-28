import { NextResponse } from 'next/server';
import { getCurrentAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'عدم دسترسی.' }, { status: 401 });
  }

  try {
    const [bookings, wizardSubmissions, subscribers] = await Promise.all([
      prisma.contactConsultationbooking.findMany({
        orderBy: { id: 'desc' },
      }),
      prisma.contactProjectwizardsubmission.findMany({
        orderBy: { id: 'desc' },
      }),
      prisma.contactNewslettersubscriber.findMany({
        orderBy: { id: 'desc' },
      }),
    ]);

    return NextResponse.json({
      success: true,
      bookings,
      wizardSubmissions,
      subscribers,
    });
  } catch (error: any) {
    console.error('Error fetching leads:', error);
    return NextResponse.json({ error: error.message || 'خطا در دریافت سرنخ‌ها و رزروها' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'عدم دسترسی.' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { type = 'booking', id, status, is_seen } = body;

    if (!id) {
      return NextResponse.json({ error: 'شناسه الزامی است.' }, { status: 400 });
    }

    if (type === 'wizard') {
      const updated = await prisma.contactProjectwizardsubmission.update({
        where: { id: Number(id) },
        data: { is_seen: Boolean(is_seen) },
      });
      return NextResponse.json({ success: true, item: updated });
    }

    if (type === 'subscriber') {
      const updated = await prisma.contactNewslettersubscriber.update({
        where: { id: Number(id) },
        data: { is_active: Boolean(body.is_active) },
      });
      return NextResponse.json({ success: true, item: updated });
    }

    // Default: booking
    const updated = await prisma.contactConsultationbooking.update({
      where: { id: Number(id) },
      data: { status: status || 'confirmed' },
    });

    return NextResponse.json({ success: true, item: updated });
  } catch (error: any) {
    console.error('Error updating lead status:', error);
    return NextResponse.json({ error: error.message || 'خطا در تغییر وضعیت' }, { status: 500 });
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
    const type = searchParams.get('type') || 'booking';

    if (!id) {
      return NextResponse.json({ error: 'شناسه الزامی است.' }, { status: 400 });
    }

    if (type === 'wizard') {
      await prisma.contactProjectwizardsubmission.delete({ where: { id: Number(id) } });
    } else if (type === 'subscriber') {
      await prisma.contactNewslettersubscriber.delete({ where: { id: Number(id) } });
    } else {
      await prisma.contactConsultationbooking.delete({ where: { id: Number(id) } });
    }

    return NextResponse.json({ success: true, message: 'آیتم با موفقیت حذف شد.' });
  } catch (error: any) {
    console.error('Error deleting lead:', error);
    return NextResponse.json({ error: error.message || 'خطا در حذف آیتم' }, { status: 500 });
  }
}
