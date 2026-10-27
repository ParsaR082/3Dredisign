import { NextResponse } from 'next/server';
import { getCurrentAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'عدم دسترسی.' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const filter = searchParams.get('filter'); // 'unread' | 'read' | 'all'

  try {
    const where: any = {};
    if (filter === 'unread') where.is_seen = false;
    if (filter === 'read') where.is_seen = true;

    const contacts = await prisma.contactContactmessage.findMany({
      where,
      orderBy: { created_at: 'desc' },
    });

    return NextResponse.json({ success: true, contacts });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json({ error: 'خطا در دریافت پیام‌ها' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'عدم دسترسی.' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, is_seen } = body;

    if (id === undefined) {
      return NextResponse.json({ error: 'شناسه پیام الزامی است.' }, { status: 400 });
    }

    const updated = await prisma.contactContactmessage.update({
      where: { id: Number(id) },
      data: { is_seen: Boolean(is_seen) },
    });

    return NextResponse.json({ success: true, contact: updated });
  } catch (error) {
    console.error('Error updating contact:', error);
    return NextResponse.json({ error: 'خطا در بروزرسانی وضعیت پیام' }, { status: 500 });
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
      return NextResponse.json({ error: 'شناسه پیام الزامی است.' }, { status: 400 });
    }

    await prisma.contactContactmessage.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ success: true, message: 'پیام با موفقیت حذف شد.' });
  } catch (error) {
    console.error('Error deleting contact:', error);
    return NextResponse.json({ error: 'خطا در حذف پیام' }, { status: 500 });
  }
}
