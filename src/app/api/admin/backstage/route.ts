import { NextResponse } from 'next/server';
import { getCurrentAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'عدم دسترسی.' }, { status: 401 });
  }

  try {
    const [items, categories, settings] = await Promise.all([
      prisma.backstageBackstageitem.findMany({
        orderBy: { order: 'asc' },
        select: {
          id: true,
          title: true,
          slug: true,
          subtitle: true,
          excerpt: true,
          cover_image: true,
          location: true,
          duration_label: true,
          status: true,
          is_featured: true,
          order: true,
          category_id: true,
        },
      }),
      prisma.backstageBackstagecategory.findMany({
        orderBy: { order: 'asc' },
      }),
      prisma.backstageBackstagepagesettings.findFirst(),
    ]);

    return NextResponse.json({
      success: true,
      items,
      categories,
      settings,
    });
  } catch (error: any) {
    console.error('Error fetching backstage data:', error);
    return NextResponse.json({ error: error.message || 'خطا در دریافت پشت صحنه' }, { status: 500 });
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
      type = 'item',
      name,
      title,
      slug,
      subtitle = '',
      excerpt = '',
      cover_image = '/images/placeholder.jpg',
      location = 'استودیو اروم سیما',
      duration_label = '۳ روز تولید',
      status = 'published',
      is_featured = false,
      order = 1,
      category_id,
    } = body;

    if (type === 'category') {
      const catName = name || title;
      if (!catName) {
        return NextResponse.json({ error: 'نام دسته‌بندی الزامی است.' }, { status: 400 });
      }
      const catSlug = (slug || catName).trim().toLowerCase().replace(/\s+/g, '-');
      const newCategory = await prisma.backstageBackstagecategory.create({
        data: {
          name: catName,
          slug: catSlug,
          description: excerpt || subtitle || catName,
          order: Number(order) || 1,
          is_active: true,
        },
      });
      return NextResponse.json({ success: true, category: newCategory });
    }

    if (!title || !slug) {
      return NextResponse.json({ error: 'عنوان و اسلاگ الزامی هستند.' }, { status: 400 });
    }

    const now = new Date();

    let finalCatId: number | null = category_id ? Number(category_id) : null;
    if (finalCatId) {
      const exists = await prisma.backstageBackstagecategory.findUnique({ where: { id: finalCatId } });
      if (!exists) finalCatId = null;
    }

    const newItem = await prisma.backstageBackstageitem.create({
      data: {
        title,
        slug: slug.trim().toLowerCase().replace(/\s+/g, '-'),
        subtitle,
        excerpt,
        body: excerpt || subtitle,
        cover_image: cover_image || '/images/placeholder.jpg',
        embed_url: '',
        location,
        duration_label,
        status,
        is_featured: Boolean(is_featured),
        order: Number(order) || 1,
        created_at: now,
        updated_at: now,
        published_at: now,
        meta_title: title,
        meta_description: excerpt.slice(0, 300),
        canonical_url: `https://urumsima.ir/backstage/${slug}/`,
        meta_robots: 'index, follow',
        category_id: finalCatId,
      },
    });

    return NextResponse.json({ success: true, item: newItem });
  } catch (error: any) {
    console.error('Error creating backstage item:', error);
    return NextResponse.json({ error: error.message || 'خطا در افزودن آیتم پشت صحنه' }, { status: 500 });
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
      location,
      duration_label,
      status,
      is_featured,
      order,
      category_id,
    } = body;

    if (!id) {
      return NextResponse.json({ error: 'شناسه الزامی است.' }, { status: 400 });
    }

    const now = new Date();

    const updated = await prisma.backstageBackstageitem.update({
      where: { id: Number(id) },
      data: {
        ...(title !== undefined && { title }),
        ...(slug !== undefined && { slug }),
        ...(subtitle !== undefined && { subtitle }),
        ...(excerpt !== undefined && { excerpt }),
        ...(cover_image !== undefined && { cover_image }),
        ...(location !== undefined && { location }),
        ...(duration_label !== undefined && { duration_label }),
        ...(status !== undefined && { status }),
        ...(is_featured !== undefined && { is_featured: Boolean(is_featured) }),
        ...(order !== undefined && { order: Number(order) }),
        ...(category_id !== undefined && { category_id: category_id ? Number(category_id) : null }),
        updated_at: now,
      },
    });

    return NextResponse.json({ success: true, item: updated });
  } catch (error: any) {
    console.error('Error updating backstage item:', error);
    return NextResponse.json({ error: error.message || 'خطا در ویرایش پشت صحنه' }, { status: 500 });
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
    const type = searchParams.get('type') || 'item';

    if (!id) {
      return NextResponse.json({ error: 'شناسه الزامی است.' }, { status: 400 });
    }

    if (type === 'category') {
      await prisma.backstageBackstagecategory.delete({
        where: { id: Number(id) },
      });
      return NextResponse.json({ success: true, message: 'دسته‌بندی پشت صحنه با موفقیت حذف شد.' });
    }

    await prisma.backstageBackstageitem.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ success: true, message: 'آیتم پشت صحنه با موفقیت حذف شد.' });
  } catch (error: any) {
    console.error('Error deleting backstage item:', error);
    return NextResponse.json({ error: error.message || 'خطا در حذف آیتم' }, { status: 500 });
  }
}
