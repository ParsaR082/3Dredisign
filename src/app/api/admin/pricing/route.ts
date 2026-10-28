import { NextResponse } from 'next/server';
import { getCurrentAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'عدم دسترسی.' }, { status: 401 });
  }

  try {
    const [plans, features, settings] = await Promise.all([
      prisma.pricingPricingplan.findMany({
        orderBy: { order: 'asc' },
      }),
      prisma.pricingPricingfeature.findMany({
        orderBy: { order: 'asc' },
      }),
      prisma.pricingPricingpagesettings.findFirst(),
    ]);

    // Attach features to their corresponding plans
    const enrichedPlans = plans.map((plan) => ({
      ...plan,
      features: features.filter((f) => f.plan_id === plan.id),
    }));

    return NextResponse.json({
      success: true,
      plans: enrichedPlans,
      settings,
    });
  } catch (error: any) {
    console.error('Error fetching pricing data:', error);
    return NextResponse.json({ error: error.message || 'خطا در دریافت تعرفه‌ها' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'عدم دسترسی.' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      name,
      description = '',
      monthly_price = 0,
      yearly_price = 0,
      billing_period = 'ماهانه',
      custom_price_text = '',
      is_popular = false,
      order = 1,
      features = [],
    } = body;

    if (!name) {
      return NextResponse.json({ error: 'نام پلن الزامی است.' }, { status: 400 });
    }

    const newPlan = await prisma.pricingPricingplan.create({
      data: {
        name,
        description,
        monthly_price: Number(monthly_price) || 0,
        yearly_price: Number(yearly_price) || 0,
        billing_period,
        custom_price_text: custom_price_text || '',
        is_popular: Boolean(is_popular),
        order: Number(order) || 1,
      },
    });

    if (Array.isArray(features) && features.length > 0) {
      for (let i = 0; i < features.length; i++) {
        const featTitle = typeof features[i] === 'string' ? features[i] : features[i]?.title;
        if (featTitle) {
          await prisma.pricingPricingfeature.create({
            data: {
              title: featTitle,
              order: i + 1,
              plan_id: newPlan.id,
            },
          });
        }
      }
    }

    return NextResponse.json({ success: true, plan: newPlan });
  } catch (error: any) {
    console.error('Error creating pricing plan:', error);
    return NextResponse.json({ error: error.message || 'خطا در افزودن پلن قیمت‌گذاری' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'عدم دسترسی.' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      id,
      name,
      description,
      monthly_price,
      yearly_price,
      billing_period,
      custom_price_text,
      is_popular,
      order,
    } = body;

    if (!id) {
      return NextResponse.json({ error: 'شناسه الزامی است.' }, { status: 400 });
    }

    const updated = await prisma.pricingPricingplan.update({
      where: { id: Number(id) },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(monthly_price !== undefined && { monthly_price: Number(monthly_price) }),
        ...(yearly_price !== undefined && { yearly_price: Number(yearly_price) }),
        ...(billing_period !== undefined && { billing_period }),
        ...(custom_price_text !== undefined && { custom_price_text }),
        ...(is_popular !== undefined && { is_popular: Boolean(is_popular) }),
        ...(order !== undefined && { order: Number(order) }),
      },
    });

    return NextResponse.json({ success: true, plan: updated });
  } catch (error: any) {
    console.error('Error updating pricing plan:', error);
    return NextResponse.json({ error: error.message || 'خطا در ویرایش پلن قیمت‌گذاری' }, { status: 500 });
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

    // Delete associated features first
    await prisma.pricingPricingfeature.deleteMany({
      where: { plan_id: Number(id) },
    });

    await prisma.pricingPricingplan.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ success: true, message: 'پلن تعرفه با موفقیت حذف شد.' });
  } catch (error: any) {
    console.error('Error deleting pricing plan:', error);
    return NextResponse.json({ error: error.message || 'خطا در حذف پلن' }, { status: 500 });
  }
}
