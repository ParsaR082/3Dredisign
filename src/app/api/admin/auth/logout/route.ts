import { NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME, getCurrentAdmin } from '@/lib/auth';

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: 'خروج با موفقیت انجام شد.',
  });

  response.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: '',
    httpOnly: true,
    path: '/',
    maxAge: 0,
  });

  return response;
}

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  return NextResponse.json({ authenticated: true, user: admin });
}
