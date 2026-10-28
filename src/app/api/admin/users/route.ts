import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { getCurrentAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'عدم دسترسی.' }, { status: 401 });
  }

  try {
    const users = await prisma.authUser.findMany({
      orderBy: { id: 'asc' },
      select: {
        id: true,
        username: true,
        email: true,
        first_name: true,
        last_name: true,
        is_superuser: true,
        is_staff: true,
        is_active: true,
        last_login: true,
        date_joined: true,
      },
    });

    return NextResponse.json({ success: true, users });
  } catch (error: any) {
    console.error('Error fetching admin users:', error);
    return NextResponse.json({ error: error.message || 'خطا در دریافت کاربران' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'عدم دسترسی.' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { username, password, email = '', first_name = '', last_name = '', is_superuser = true } = body;

    if (!username || !password) {
      return NextResponse.json({ error: 'نام کاربری و رمز عبور الزامی است.' }, { status: 400 });
    }

    const salt = crypto.randomBytes(12).toString('base64');
    const iterations = 870000;
    const hash = crypto.pbkdf2Sync(password, salt, iterations, 32, 'sha256').toString('base64');
    const djangoPasswordHash = `pbkdf2_sha256$${iterations}$${salt}$${hash}`;

    const now = new Date().toISOString().replace('T', ' ').slice(0, 19);

    const newUser = await prisma.authUser.create({
      data: {
        username,
        password: djangoPasswordHash,
        email,
        first_name,
        last_name,
        is_superuser: Boolean(is_superuser),
        is_staff: true,
        is_active: true,
        date_joined: now,
      },
      select: {
        id: true,
        username: true,
        email: true,
        first_name: true,
        last_name: true,
        is_superuser: true,
        is_active: true,
        date_joined: true,
      },
    });

    return NextResponse.json({ success: true, user: newUser });
  } catch (error: any) {
    console.error('Error creating admin user:', error);
    return NextResponse.json({ error: error.message || 'خطا در ایجاد کاربر' }, { status: 500 });
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

    // Safety: prevent deleting own active account if ID is 1
    if (Number(id) === 1) {
      return NextResponse.json({ error: 'کاربر اصلی سیستم قابل حذف نیست.' }, { status: 400 });
    }

    await prisma.authUser.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ success: true, message: 'کاربر با موفقیت حذف شد.' });
  } catch (error: any) {
    console.error('Error deleting admin user:', error);
    return NextResponse.json({ error: error.message || 'خطا در حذف کاربر' }, { status: 500 });
  }
}
