import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getCurrentAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'عدم دسترسی.' }, { status: 401 });
  }

  try {
    const [services, categories, features, faqs] = await Promise.all([
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
          why_us_bullets: true,
          why_us_title: true,
          features_section_title: true,
          faq_section_title: true,
        },
      }),
      prisma.serviceServicecategory.findMany({
        orderBy: { order: 'asc' },
      }),
      prisma.serviceServicefeature.findMany({
        orderBy: { order: 'asc' },
      }),
      prisma.serviceServicefaq.findMany({
        orderBy: { order: 'asc' },
      }),
    ]);

    const featureMap = new Map<number, any[]>();
    for (const f of features) {
      const list = featureMap.get(f.service_id) || [];
      list.push({ id: f.id, text: f.text, icon: f.icon, order: f.order });
      featureMap.set(f.service_id, list);
    }

    const faqMap = new Map<number, any[]>();
    for (const q of faqs) {
      const list = faqMap.get(q.service_id) || [];
      list.push({ id: q.id, question: q.question, answer: q.answer, order: q.order });
      faqMap.set(q.service_id, list);
    }

    const servicesWithExtras = services.map((s) => ({
      ...s,
      features: featureMap.get(s.id) || [],
      faqs: faqMap.get(s.id) || [],
    }));

    return NextResponse.json({ success: true, services: servicesWithExtras, categories });
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
      type = 'service',
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
      why_us_bullets = '',
      why_us_title = 'چرا اروم سیما؟',
      features = [],
      faqs = [],
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
        why_us_bullets: why_us_bullets || 'تضمین بالاترین کیفیت\nپشتیبانی فنی اختصاصی\nتیم متخصص و کارآزموده',
        why_us_intro: '',
        why_us_title: why_us_title || 'چرا اروم سیما؟',
        faq_section_title: 'سوالات متداول',
        card_image: null,
        canonical_url: `https://urumsima.ir/services/${slug}/`,
        meta_robots: 'index, follow',
      },
    });

    // Save Features if provided
    if (Array.isArray(features) && features.length > 0) {
      await prisma.serviceServicefeature.createMany({
        data: features.map((f: any, idx: number) => ({
          service_id: newService.id,
          text: f.text || f,
          icon: f.icon || 'Check',
          order: idx + 1,
          is_highlighted: Boolean(f.is_highlighted),
        })),
      });
    }

    // Save FAQs if provided
    if (Array.isArray(faqs) && faqs.length > 0) {
      await prisma.serviceServicefaq.createMany({
        data: faqs.map((q: any, idx: number) => ({
          service_id: newService.id,
          question: q.question,
          answer: q.answer,
          order: idx + 1,
        })),
      });
    }

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
    const {
      id,
      title,
      slug,
      short_description,
      description,
      icon,
      price_start,
      duration,
      difficulty,
      is_popular,
      is_featured,
      why_us_bullets,
      why_us_title,
      features,
      faqs,
    } = body;

    if (!id) {
      return NextResponse.json({ error: 'شناسه الزامی است.' }, { status: 400 });
    }

    const updated = await prisma.serviceService.update({
      where: { id: Number(id) },
      data: {
        ...(title !== undefined && { title }),
        ...(slug !== undefined && { slug: slug.trim().toLowerCase().replace(/\s+/g, '-') }),
        ...(short_description !== undefined && { short_description }),
        ...(description !== undefined && { description }),
        ...(icon !== undefined && { icon }),
        ...(price_start !== undefined && { price_start: Number(price_start) }),
        ...(duration !== undefined && { duration }),
        ...(difficulty !== undefined && { difficulty }),
        ...(is_popular !== undefined && { is_popular: Boolean(is_popular) }),
        ...(is_featured !== undefined && { is_featured: Boolean(is_featured) }),
        ...(why_us_bullets !== undefined && { why_us_bullets }),
        ...(why_us_title !== undefined && { why_us_title }),
        updated_at: new Date(),
      },
    });

    // Update features if provided
    if (features !== undefined && Array.isArray(features)) {
      await prisma.serviceServicefeature.deleteMany({
        where: { service_id: Number(id) },
      });
      if (features.length > 0) {
        await prisma.serviceServicefeature.createMany({
          data: features.map((f: any, idx: number) => ({
            service_id: Number(id),
            text: f.text || f,
            icon: f.icon || 'Check',
            order: idx + 1,
            is_highlighted: Boolean(f.is_highlighted),
          })),
        });
      }
    }

    // Update FAQs if provided
    if (faqs !== undefined && Array.isArray(faqs)) {
      await prisma.serviceServicefaq.deleteMany({
        where: { service_id: Number(id) },
      });
      if (faqs.length > 0) {
        await prisma.serviceServicefaq.createMany({
          data: faqs.map((q: any, idx: number) => ({
            service_id: Number(id),
            question: q.question,
            answer: q.answer,
            order: idx + 1,
          })),
        });
      }
    }

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

    const serviceId = Number(id);
    const srv = await prisma.serviceService.findUnique({
      where: { id: serviceId },
      select: { slug: true },
    });

    // Clean up relations first in an atomic transaction
    await prisma.$transaction([
      prisma.serviceServicefeature.deleteMany({ where: { service_id: serviceId } }),
      prisma.serviceServicefaq.deleteMany({ where: { service_id: serviceId } }),
      prisma.serviceServiceroi.deleteMany({ where: { service_id: serviceId } }),
      prisma.serviceService.delete({ where: { id: serviceId } }),
    ]);

    try {
      revalidatePath('/services');
      if (srv?.slug) revalidatePath(`/services/${srv.slug}`);
      revalidatePath('/');
    } catch (_) {}

    return NextResponse.json({ success: true, message: 'خدمت با موفقیت حذف شد.' });
  } catch (error: any) {
    console.error('Error deleting service:', error);
    return NextResponse.json({ error: error.message || 'خطا در حذف خدمت' }, { status: 500 });
  }
}
