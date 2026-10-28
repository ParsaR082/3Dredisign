import { NextResponse } from 'next/server';
import { getCurrentAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'عدم دسترسی.' }, { status: 401 });
  }

  try {
    const [websites, categories, settings] = await Promise.all([
      prisma.websitesWebsite.findMany({
        orderBy: { order: 'asc' },
        select: {
          id: true,
          title: true,
          slug: true,
          subtitle: true,
          excerpt: true,
          cover_image: true,
          live_url: true,
          client_name: true,
          industry: true,
          year: true,
          status: true,
          accent_color: true,
          tech_stack_csv: true,
          is_featured: true,
          order: true,
          category_id: true,
        },
      }),
      prisma.websitesWebsitecategory.findMany({
        orderBy: { order: 'asc' },
      }),
      prisma.websitesWebsitepagesettings.findFirst(),
    ]);

    return NextResponse.json({
      success: true,
      websites,
      categories,
      settings,
    });
  } catch (error: any) {
    console.error('Error fetching websites data:', error);
    return NextResponse.json({ error: error.message || 'خطا در دریافت پروژه‌های وب' }, { status: 500 });
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
      title,
      slug,
      subtitle = '',
      excerpt = '',
      cover_image = '/images/placeholder.jpg',
      live_url = '',
      client_name = '',
      industry = 'طراحی سایت و پرتال',
      year = 1403,
      accent_color = '#10B981',
      tech_stack_csv = 'Next.js, Three.js, Tailwind',
      status = 'completed',
      is_featured = false,
      order = 1,
      category_id,
    } = body;

    if (!title || !slug) {
      return NextResponse.json({ error: 'عنوان و اسلاگ الزامی هستند.' }, { status: 400 });
    }

    const now = new Date().toISOString().replace('T', ' ').slice(0, 19);

    const newWebsite = await prisma.websitesWebsite.create({
      data: {
        title,
        slug: slug.trim().toLowerCase().replace(/\s+/g, '-'),
        subtitle,
        excerpt,
        body: excerpt || subtitle,
        cover_image: cover_image || '/images/placeholder.jpg',
        live_url,
        client_name,
        industry,
        year: Number(year) || 1403,
        is_one_page: false,
        accent_color: accent_color || '#10B981',
        tech_stack_csv: tech_stack_csv || 'Next.js, React, TailwindCSS',
        pages_label: '۵ صفحه اختصاصی',
        status: status || 'completed',
        is_featured: Boolean(is_featured),
        order: Number(order) || 1,
        created_at: now,
        updated_at: now,
        published_at: now,
        meta_title: title,
        meta_description: excerpt.slice(0, 300),
        canonical_url: `https://urumsima.ir/websites/${slug}/`,
        meta_robots: 'index, follow',
        category_id: category_id ? Number(category_id) : null,
      },
    });

    return NextResponse.json({ success: true, website: newWebsite });
  } catch (error: any) {
    console.error('Error creating website item:', error);
    return NextResponse.json({ error: error.message || 'خطا در ثبت وبسایت' }, { status: 500 });
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
      subtitle,
      excerpt,
      cover_image,
      live_url,
      client_name,
      industry,
      year,
      accent_color,
      tech_stack_csv,
      status,
      is_featured,
      order,
      category_id,
    } = body;

    if (!id) {
      return NextResponse.json({ error: 'شناسه الزامی است.' }, { status: 400 });
    }

    const now = new Date().toISOString().replace('T', ' ').slice(0, 19);

    const updated = await prisma.websitesWebsite.update({
      where: { id: Number(id) },
      data: {
        ...(title !== undefined && { title }),
        ...(slug !== undefined && { slug }),
        ...(subtitle !== undefined && { subtitle }),
        ...(excerpt !== undefined && { excerpt }),
        ...(cover_image !== undefined && { cover_image }),
        ...(live_url !== undefined && { live_url }),
        ...(client_name !== undefined && { client_name }),
        ...(industry !== undefined && { industry }),
        ...(year !== undefined && { year: Number(year) }),
        ...(accent_color !== undefined && { accent_color }),
        ...(tech_stack_csv !== undefined && { tech_stack_csv }),
        ...(status !== undefined && { status }),
        ...(is_featured !== undefined && { is_featured: Boolean(is_featured) }),
        ...(order !== undefined && { order: Number(order) }),
        ...(category_id !== undefined && { category_id: category_id ? Number(category_id) : null }),
        updated_at: now,
      },
    });

    return NextResponse.json({ success: true, website: updated });
  } catch (error: any) {
    console.error('Error updating website item:', error);
    return NextResponse.json({ error: error.message || 'خطا در ویرایش وبسایت' }, { status: 500 });
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

    await prisma.websitesWebsite.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ success: true, message: 'وبسایت با موفقیت حذف شد.' });
  } catch (error: any) {
    console.error('Error deleting website item:', error);
    return NextResponse.json({ error: error.message || 'خطا در حذف وبسایت' }, { status: 500 });
  }
}
