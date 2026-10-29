import { NextResponse } from 'next/server';
import { getCurrentAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'عدم دسترسی.' }, { status: 401 });
  }

  try {
    const [services, categories] = await Promise.all([
      prisma.serviceService.findMany({
        orderBy: { order: 'asc' },
        select: {
          id: true,
          title: true,
          slug: true,
          short_description: true,
          description: true,
          icon: true,
          price_start: true,
          duration: true,
          difficulty: true,
          is_popular: true,
          is_featured: true,
          is_active: true,
          order: true,
          category_id: true,
        },
      }),
      prisma.serviceServicecategory.findMany({
        orderBy: { order: 'asc' },
      }),
    ]);
    return NextResponse.json({ success: true, services, categories });
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json({ error: 'خطا در دریافت خدمات' }, { status: 500 });
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
      type = 'service', // 'service' | 'category'
      name,
      title,
      slug,
      short_description = '',
      description = '',
      icon = '🚀',
      price_start = 0,
      duration = '۳ تا ۴ هفته',
      difficulty = 'تخصصی',
      is_popular = false,
      is_featured = false,
      order = 1,
      category_id,
    } = body;

    // 1. Create Category
    if (type === 'category') {
      const catName = name || title;
      if (!catName) {
        return NextResponse.json({ error: 'نام دسته‌بندی الزامی است.' }, { status: 400 });
      }
      const catSlug = (slug || catName).trim().toLowerCase().replace(/\s+/g, '-');
      const newCategory = await prisma.serviceServicecategory.create({
        data: {
          name: catName,
          slug: catSlug,
          icon: icon || '⚡',
          description: description || `دسته‌بندی خدمات ${catName}`,
          order: Number(order) || 1,
          is_active: true,
        },
      });
      return NextResponse.json({ success: true, category: newCategory });
    }

    // 2. Create Service
    if (!title || !slug) {
      return NextResponse.json({ error: 'عنوان و اسلاگ الزامی هستند.' }, { status: 400 });
    }

    let cat = await prisma.serviceServicecategory.findFirst();
    if (!cat) {
      cat = await prisma.serviceServicecategory.create({
        data: {
          name: 'طراحی وب و توسعه نرم‌افزار',
          slug: 'web-development',
          icon: '💻',
          description: 'خدمات تخصصی طراحی، پیاده‌سازی و نگهداری پرتال‌های تحت وب',
          order: 1,
          is_active: true,
        },
      });
    }

    const newService = await prisma.serviceService.create({
      data: {
        title,
        slug: slug.trim().toLowerCase().replace(/\s+/g, '-'),
        short_description,
        description: description || short_description,
        icon: icon || '⚡',
        price_start: Number(price_start) || 0,
        duration,
        difficulty,
        is_popular: Boolean(is_popular),
        is_featured: Boolean(is_featured),
        is_active: true,
        order: Number(order) || 1,
        created_at: new Date(),
        updated_at: new Date(),
        category_id: category_id ? Number(category_id) : cat.id,
        breadcrumb_label: title,
        bts_poster: null,
        bts_title: '',
        bts_video_url: '',
        cta_primary_label: 'درخواست مشاوره',
        cta_primary_url: '/contact-us/',
        cta_secondary_label: 'مشاهده نمونه‌کارها',
        cta_secondary_url: '/portfolio/',
        cta_text: 'برای دریافت پروپوزال اختصاصی با ما در تماس باشید.',
        cta_title: 'شروع پروژه با اروم سیما',
        features_intro: '',
        features_section_title: 'ویژگی‌های اختصاصی',
        meta_description: short_description.slice(0, 300),
        meta_title: title,
        other_services_title: 'سایر خدمات آژانس',
        why_us_bullets: 'تضمین بالاترین کیفیت\nپشتیبانی فنی اختصاصی\nتیم متخصص و کارآزموده',
        why_us_intro: '',
        why_us_title: 'چرا اروم سیما؟',
        faq_section_title: 'سوالات متداول',
        card_image: null,
        canonical_url: `https://urumsima.ir/services/${slug}/`,
        meta_robots: 'index, follow',
      },
    });

    return NextResponse.json({ success: true, service: newService });
  } catch (error: any) {
    console.error('Error creating service:', error);
    return NextResponse.json({ error: error.message || 'خطا در افزودن خدمت' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'عدم دسترسی.' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, title, slug, short_description, description, icon, price_start, duration, is_popular, is_featured } = body;

    if (!id) {
      return NextResponse.json({ error: 'شناسه الزامی است.' }, { status: 400 });
    }

    const updated = await prisma.serviceService.update({
      where: { id: Number(id) },
      data: {
        ...(title !== undefined && { title }),
        ...(slug !== undefined && { slug }),
        ...(short_description !== undefined && { short_description }),
        ...(description !== undefined && { description }),
        ...(icon !== undefined && { icon }),
        ...(price_start !== undefined && { price_start: Number(price_start) }),
        ...(duration !== undefined && { duration }),
        ...(is_popular !== undefined && { is_popular: Boolean(is_popular) }),
        ...(is_featured !== undefined && { is_featured: Boolean(is_featured) }),
        updated_at: new Date(),
      },
    });

    return NextResponse.json({ success: true, service: updated });
  } catch (error: any) {
    console.error('Error updating service:', error);
    return NextResponse.json({ error: error.message || 'خطا در ویرایش خدمت' }, { status: 500 });
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

    await prisma.serviceService.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ success: true, message: 'خدمت با موفقیت حذف شد.' });
  } catch (error: any) {
    console.error('Error deleting service:', error);
    return NextResponse.json({ error: error.message || 'خطا در حذف خدمت' }, { status: 500 });
  }
}
