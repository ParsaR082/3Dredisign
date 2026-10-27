import { NextResponse } from 'next/server';
import { getCurrentAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'عدم دسترسی.' }, { status: 401 });
  }

  try {
    const testimonials = await prisma.publicLandingtestimonial.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json({ success: true, testimonials });
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return NextResponse.json({ error: 'خطا در دریافت نظرات' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'عدم دسترسی.' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, role, company, text, stars = 5 } = body;

    if (!name || !text) {
      return NextResponse.json({ error: 'نام و متن نظر الزامی است.' }, { status: 400 });
    }

    const landing = await prisma.publicLandingpage.findFirst();

    const created = await prisma.publicLandingtestimonial.create({
      data: {
        name,
        role: role || 'مشتری اروم‌سیما',
        company: company || 'کسب‌وکار',
        text,
        stars: Number(stars) || 5,
        avatar_text: name.slice(0, 2),
        order: 1,
        is_active: true,
        landing_page_id: landing?.id || 1,
        embed_url: '',
        media_type: 'none',
        video_file: null,
        video_thumbnail: null,
      },
    });

    return NextResponse.json({ success: true, testimonial: created });
  } catch (error: any) {
    console.error('Error creating testimonial:', error);
    return NextResponse.json({ error: error.message || 'خطا در ثبت نظر' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'عدم دسترسی.' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, name, role, company, text, stars, is_active } = body;

    if (!id) {
      return NextResponse.json({ error: 'شناسه الزامی است.' }, { status: 400 });
    }

    const updated = await prisma.publicLandingtestimonial.update({
      where: { id: Number(id) },
      data: {
        ...(name !== undefined && { name, avatar_text: name.slice(0, 2) }),
        ...(role !== undefined && { role }),
        ...(company !== undefined && { company }),
        ...(text !== undefined && { text }),
        ...(stars !== undefined && { stars: Number(stars) }),
        ...(is_active !== undefined && { is_active: Boolean(is_active) }),
      },
    });

    return NextResponse.json({ success: true, testimonial: updated });
  } catch (error: any) {
    console.error('Error updating testimonial:', error);
    return NextResponse.json({ error: error.message || 'خطا در ویرایش نظر' }, { status: 500 });
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

    if (!id) {
      return NextResponse.json({ error: 'شناسه الزامی است.' }, { status: 400 });
    }

    await prisma.publicLandingtestimonial.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ success: true, message: 'نظر با موفقیت حذف شد.' });
  } catch (error: any) {
    console.error('Error deleting testimonial:', error);
    return NextResponse.json({ error: error.message || 'خطا در حذف نظر' }, { status: 500 });
  }
}
