import { NextResponse } from 'next/server';
import { authenticateAdmin, generateSessionToken, ADMIN_COOKIE_NAME } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'نام کاربری و رمز عبور الزامی است.' },
        { status: 400 }
      );
    }

    const isValid = await authenticateAdmin(username, password);
    if (!isValid) {
      return NextResponse.json(
        { error: 'نام کاربری یا رمز عبور اشتباه است.' },
        { status: 401 }
      );
    }

    const token = generateSessionToken(username);
    const response = NextResponse.json({
      success: true,
      message: 'ورود با موفقیت انجام شد.',
      user: { username },
    });

    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'خطای سیستمی رخ داد. لطفاً مجدداً تلاش کنید.' },
      { status: 500 }
    );
  }
}
