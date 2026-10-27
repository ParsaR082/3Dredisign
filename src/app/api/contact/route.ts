import { NextResponse } from 'next/server';
import { saveContactMessage } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, email, message, serviceId } = body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'نام و نام خانوادگی الزامی است.' },
        { status: 400 }
      );
    }

    if (!phone || typeof phone !== 'string' || phone.trim().length === 0) {
      return NextResponse.json(
        { error: 'شماره تماس الزامی است.' },
        { status: 400 }
      );
    }

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'متن پیام الزامی است.' },
        { status: 400 }
      );
    }

    const saved = await saveContactMessage({
      fullName: name,
      phone,
      email,
      message,
      serviceId: serviceId ? Number(serviceId) : undefined,
    });

    return NextResponse.json({
      success: true,
      id: saved.id,
      message: 'پیام شما با موفقیت در سیستم ثبت شد و به‌زودی با شما تماس گرفته خواهد شد.',
    });
  } catch (error) {
    console.error('Failed to save contact message:', error);
    return NextResponse.json(
      { error: 'خطایی در ثبت پیام رخ داد. لطفاً با شماره پشتیبانی تماس بگیرید.' },
      { status: 500 }
    );
  }
}
