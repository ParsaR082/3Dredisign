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
    const [items, categories, settings] = await Promise.all([
      prisma.backstageBackstageitem.findMany({
        orderBy: { order: 'asc' },
        select: {
          id: true,
          title: true,
          slug: true,
          subtitle: true,
          excerpt: true,
          body: true,
          cover_image: true,
          cover_video: true,
          embed_url: true,
          location: true,
          duration_label: true,
          status: true,
          is_featured: true,
          order: true,
          category_id: true,
          published_at: true,
          created_at: true,
          updated_at: true,
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
      description = '',
      body: itemBody = '',
      cover_image = '/images/urumsima3.webp',
      cover_video = '',
      embed_url = '',
      location = 'استودیو اروم سیما',
      duration_label = '۰۰:۴۵ | 4K 60fps',
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
          description: description || excerpt || subtitle || catName || '',
          order: Number(order) || 1,
          is_active: true,
        },
      });
      try {
        revalidatePath('/backstage');
      } catch (_) {}
      return NextResponse.json({ success: true, category: newCategory });
    }

    if (!title || !slug) {
      return NextResponse.json({ error: 'عنوان و اسلاگ الزامی هستند.' }, { status: 400 });
    }

    const now = new Date();
    const cleanSlug = slug.trim().toLowerCase().replace(/\s+/g, '-');

    let finalCatId: number | null = category_id ? Number(category_id) : null;
    if (finalCatId) {
      const exists = await prisma.backstageBackstagecategory.findUnique({ where: { id: finalCatId } });
      if (!exists) finalCatId = null;
    }

    const newItem = await prisma.backstageBackstageitem.create({
      data: {
        title,
        slug: cleanSlug,
        subtitle: subtitle || '',
        excerpt: excerpt || '',
        body: itemBody || excerpt || subtitle || '',
        cover_image: cover_image || '/images/urumsima3.webp',
        cover_video: cover_video || null,
        embed_url: embed_url || '',
        location: location || 'ارومیه',
        duration_label: duration_label || '۰۰:۴۵ | 4K 60fps',
        status: status || 'published',
        is_featured: Boolean(is_featured),
        order: Number(order) || 1,
        created_at: now,
        updated_at: now,
        published_at: now,
        meta_title: title,
        meta_description: (excerpt || title).slice(0, 300),
        canonical_url: `https://urumsima.ir/backstage/${cleanSlug}/`,
        meta_robots: 'index, follow',
        category_id: finalCatId,
      },
    });

    try {
      revalidatePath('/backstage');
      revalidatePath(`/backstage/${cleanSlug}`);
    } catch (_) {}

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
      type = 'item',
      id,
      name,
      title,
      slug,
      description,
      subtitle,
      excerpt,
      body: itemBody,
      cover_image,
      cover_video,
      embed_url,
      location,
      duration_label,
      status,
      is_featured,
      order,
      category_id,
      is_active,
    } = body;

    if (!id) {
      return NextResponse.json({ error: 'شناسه الزامی است.' }, { status: 400 });
    }

    if (type === 'category') {
      const catName = name || title;
      if (!catName) {
        return NextResponse.json({ error: 'نام دسته‌بندی الزامی است.' }, { status: 400 });
      }
      const cleanSlug = (slug || catName).trim().toLowerCase().replace(/\s+/g, '-');
      const updatedCategory = await prisma.backstageBackstagecategory.update({
        where: { id: Number(id) },
        data: {
          name: catName,
          slug: cleanSlug,
          description: description !== undefined ? description : (excerpt || subtitle || catName || ''),
          order: order !== undefined ? Number(order) : undefined,
          is_active: is_active !== undefined ? Boolean(is_active) : true,
        },
      });

      try {
        revalidatePath('/backstage');
      } catch (_) {}

      return NextResponse.json({ success: true, category: updatedCategory });
    }

    const now = new Date();
    const cleanSlug = slug ? slug.trim().toLowerCase().replace(/\s+/g, '-') : undefined;

    const updated = await prisma.backstageBackstageitem.update({
      where: { id: Number(id) },
      data: {
        ...(title !== undefined && { title }),
        ...(cleanSlug !== undefined && { slug: cleanSlug, canonical_url: `https://urumsima.ir/backstage/${cleanSlug}/` }),
        ...(subtitle !== undefined && { subtitle }),
        ...(excerpt !== undefined && { excerpt }),
        ...(itemBody !== undefined && { body: itemBody }),
        ...(cover_image !== undefined && { cover_image: cover_image || '/images/urumsima3.webp' }),
        ...(cover_video !== undefined && { cover_video: cover_video || null }),
        ...(embed_url !== undefined && { embed_url: embed_url || '' }),
        ...(location !== undefined && { location }),
        ...(duration_label !== undefined && { duration_label }),
        ...(status !== undefined && { status }),
        ...(is_featured !== undefined && { is_featured: Boolean(is_featured) }),
        ...(order !== undefined && { order: Number(order) }),
        ...(category_id !== undefined && { category_id: category_id ? Number(category_id) : null }),
        updated_at: now,
      },
    });

    try {
      revalidatePath('/backstage');
      if (cleanSlug) revalidatePath(`/backstage/${cleanSlug}`);
    } catch (_) {}

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
      // Unlink any backstage items from this category so delete succeeds safely
      await prisma.backstageBackstageitem.updateMany({
        where: { category_id: Number(id) },
        data: { category_id: null },
      });

      await prisma.backstageBackstagecategory.delete({
        where: { id: Number(id) },
      });
      try {
        revalidatePath('/backstage');
      } catch (_) {}
      return NextResponse.json({ success: true, message: 'دسته‌بندی پشت صحنه با موفقیت حذف شد.' });
    }

    const item = await prisma.backstageBackstageitem.findUnique({
      where: { id: Number(id) },
    });

    // Delete related child videos and images first in a transaction to satisfy foreign key constraints
    await prisma.$transaction([
      prisma.backstageBackstagevideo.deleteMany({
        where: { item_id: Number(id) },
      }),
      prisma.backstageBackstageimage.deleteMany({
        where: { item_id: Number(id) },
      }),
      prisma.backstageBackstageitem.delete({
        where: { id: Number(id) },
      }),
    ]);

    try {
      revalidatePath('/backstage');
      if (item?.slug) revalidatePath(`/backstage/${item.slug}`);
    } catch (_) {}

    return NextResponse.json({ success: true, message: 'آیتم پشت صحنه با موفقیت حذف شد.' });
  } catch (error: any) {
    console.error('Error deleting backstage item:', error);
    return NextResponse.json({ error: error.message || 'خطا در حذف آیتم' }, { status: 500 });
  }
}
