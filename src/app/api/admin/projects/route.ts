import { NextResponse } from 'next/server';
import { getCurrentAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'عدم دسترسی.' }, { status: 401 });
  }

  try {
    const projects = await prisma.portfolioProject.findMany({
      orderBy: [{ featured: 'desc' }, { order: 'asc' }],
    });
    return NextResponse.json({ success: true, projects });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'خطا در دریافت پروژه‌ها' }, { status: 500 });
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
      description = '',
      detailed_description = '',
      featured = false,
      popular = false,
      project_date = new Date().toISOString().split('T')[0],
      thumbnail_image = '',
      desktop_mockup = '',
      mobile_mockup = '',
      website_url = '',
    } = body;

    if (!title || !slug) {
      return NextResponse.json({ error: 'عنوان و اسلاگ الزامی هستند.' }, { status: 400 });
    }

    // Default category and industry from existing database
    const cat = await prisma.portfolioProjectcategory.findFirst();
    const ind = await prisma.portfolioIndustry.findFirst();

    const newProject = await prisma.portfolioProject.create({
      data: {
        title,
        slug: slug.trim().toLowerCase().replace(/\s+/g, '-'),
        subtitle,
        description,
        detailed_description: detailed_description || description,
        challenge: '',
        featured: Boolean(featured),
        recent: true,
        popular: Boolean(popular),
        project_date,
        thumbnail_image: thumbnail_image || 'portfolio/thumbnails/default.jpg',
        desktop_mockup: desktop_mockup || null,
        mobile_mockup: mobile_mockup || null,
        tablet_mockup: null,
        website_url: website_url || null,
        order: 1,
        is_active: true,
        category_id: cat?.id || 1,
        industry_id: ind?.id || 1,
        location_zone: 'iran',
        show_on_map: false,
        featured_order: 1,
        canonical_url: `https://urumsima.ir/portfolio/${slug}/`,
        meta_description: description.slice(0, 300),
        meta_robots: 'index, follow',
        meta_title: title,
      },
    });

    return NextResponse.json({ success: true, project: newProject });
  } catch (error: any) {
    console.error('Error creating project:', error);
    return NextResponse.json({ error: error.message || 'خطا در ثبت پروژه' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'عدم دسترسی.' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, title, slug, subtitle, description, featured, popular, project_date, thumbnail_image } = body;

    if (!id) {
      return NextResponse.json({ error: 'شناسه پروژه الزامی است.' }, { status: 400 });
    }

    const updated = await prisma.portfolioProject.update({
      where: { id: Number(id) },
      data: {
        ...(title !== undefined && { title }),
        ...(slug !== undefined && { slug }),
        ...(subtitle !== undefined && { subtitle }),
        ...(description !== undefined && { description }),
        ...(featured !== undefined && { featured: Boolean(featured) }),
        ...(popular !== undefined && { popular: Boolean(popular) }),
        ...(project_date !== undefined && { project_date }),
        ...(thumbnail_image !== undefined && { thumbnail_image }),
      },
    });

    return NextResponse.json({ success: true, project: updated });
  } catch (error: any) {
    console.error('Error updating project:', error);
    return NextResponse.json({ error: error.message || 'خطا در ویرایش پروژه' }, { status: 500 });
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

    await prisma.portfolioProject.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ success: true, message: 'پروژه با موفقیت حذف شد.' });
  } catch (error: any) {
    console.error('Error deleting project:', error);
    return NextResponse.json({ error: error.message || 'خطا در حذف پروژه' }, { status: 500 });
  }
}
