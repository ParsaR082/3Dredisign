import { NextResponse } from 'next/server';
import { getCurrentAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'عدم دسترسی.' }, { status: 401 });
  }

  try {
    const [rawPosts, categories, authors, tags] = await Promise.all([
      prisma.blogPost.findMany({
        orderBy: { id: 'desc' },
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          category_id: true,
          author_id: true,
          read_time: true,
          view_count: true,
          status: true,
          is_featured: true,
          cover_image: true,
          published_at: true,
        },
      }),
      prisma.blogBlogcategory.findMany({
        orderBy: { order: 'asc' },
      }),
      prisma.blogBlogauthor.findMany({
        orderBy: { id: 'asc' },
      }),
      prisma.blogBlogtag.findMany({
        orderBy: { id: 'asc' },
      }),
    ]);

    const posts = rawPosts.map((p) => ({
      ...p,
      reading_time_minutes: p.read_time,
      is_published: p.status === 'published',
    }));

    return NextResponse.json({
      success: true,
      posts,
      categories,
      authors,
      tags,
    });
  } catch (error: any) {
    console.error('Error fetching blog data:', error);
    return NextResponse.json({ error: error.message || 'خطا در دریافت مقالات' }, { status: 500 });
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
      type = 'post', // 'post' | 'category' | 'author'
      title,
      name,
      slug,
      excerpt = '',
      body: content = '',
      description = '',
      role = '',
      bio = '',
      avatar = null,
      category_id,
      author_id,
      cover_image = null,
      reading_time_minutes = 5,
      is_published = true,
      is_featured = false,
      order = 1,
    } = body;

    // 1. Create Blog Category
    if (type === 'category') {
      const catName = name || title;
      if (!catName) {
        return NextResponse.json({ error: 'نام دسته‌بندی الزامی است.' }, { status: 400 });
      }
      const catSlug = (slug || catName).trim().toLowerCase().replace(/\s+/g, '-');
      const newCategory = await prisma.blogBlogcategory.create({
        data: {
          name: catName,
          slug: catSlug,
          description: description || `مقالات مرتبط با ${catName}`,
          is_active: true,
          order: Number(order) || 1,
        },
      });
      return NextResponse.json({ success: true, category: newCategory });
    }

    // 2. Create Blog Author
    if (type === 'author') {
      const authorName = name || title;
      if (!authorName) {
        return NextResponse.json({ error: 'نام نویسنده الزامی است.' }, { status: 400 });
      }
      const authorSlug = (slug || authorName).trim().toLowerCase().replace(/\s+/g, '-');
      const newAuthor = await prisma.blogBlogauthor.create({
        data: {
          name: authorName,
          slug: authorSlug,
          role: role || 'نویسنده و پژوهشگر اروم سیما',
          bio: bio || `نویسنده تخصصی در اروم سیما`,
          avatar,
          is_active: true,
        },
      });
      return NextResponse.json({ success: true, author: newAuthor });
    }

    // 3. Create Blog Post
    if (!title || !slug) {
      return NextResponse.json({ error: 'عنوان و اسلاگ الزامی هستند.' }, { status: 400 });
    }

    // Ensure valid category exists
    let defaultCategory = await prisma.blogBlogcategory.findFirst();
    if (!defaultCategory) {
      defaultCategory = await prisma.blogBlogcategory.create({
        data: {
          name: 'عمومی و دیجیتال مارکتینگ',
          slug: 'digital-marketing',
          description: 'مقالات جامع دیجیتال مارکتینگ و توسعه وب',
          is_active: true,
          order: 1,
        },
      });
    }

    // Ensure valid author exists
    let defaultAuthor = await prisma.blogBlogauthor.findFirst();
    if (!defaultAuthor) {
      defaultAuthor = await prisma.blogBlogauthor.create({
        data: {
          name: 'تحریریه اروم سیما',
          slug: 'urumsima-team',
          role: 'تیم محتوا و تحقیق و توسعه',
          bio: 'تیم تخصصی تولید محتوا، تحلیل بازار و مارکتینگ اروم سیما',
          is_active: true,
        },
      });
    }

    const now = new Date();

    const newPost = await prisma.blogPost.create({
      data: {
        title,
        slug: slug.trim().toLowerCase().replace(/\s+/g, '-'),
        excerpt,
        body: content || excerpt,
        category_id: category_id ? Number(category_id) : defaultCategory.id,
        author_id: author_id ? Number(author_id) : defaultAuthor.id,
        cover_image,
        read_time: Number(reading_time_minutes) || 5,
        view_count: 0,
        status: is_published ? 'published' : 'draft',
        is_featured: Boolean(is_featured),
        is_pinned: false,
        read_time_manual: false,
        body_html: content || excerpt,
        content_format: 'markdown',
        series_order: 1,
        created_at: now,
        updated_at: now,
        published_at: now,
        meta_title: title,
        meta_description: excerpt.slice(0, 300),
        og_title: title,
        og_description: excerpt.slice(0, 300),
        canonical_url: `https://urumsima.ir/blog/${slug}/`,
        meta_robots: 'index, follow',
      },
    });

    return NextResponse.json({ success: true, post: newPost });
  } catch (error: any) {
    console.error('Error creating blog post:', error);
    return NextResponse.json({ error: error.message || 'خطا در ایجاد مقاله' }, { status: 500 });
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
      excerpt,
      body: content,
      category_id,
      author_id,
      cover_image,
      reading_time_minutes,
      is_published,
      is_featured,
    } = body;

    if (!id) {
      return NextResponse.json({ error: 'شناسه الزامی است.' }, { status: 400 });
    }

    const now = new Date();

    const updated = await prisma.blogPost.update({
      where: { id: Number(id) },
      data: {
        ...(title !== undefined && { title }),
        ...(slug !== undefined && { slug }),
        ...(excerpt !== undefined && { excerpt }),
        ...(content !== undefined && { body: content, body_html: content }),
        ...(category_id !== undefined && { category_id: Number(category_id) }),
        ...(author_id !== undefined && { author_id: Number(author_id) }),
        ...(cover_image !== undefined && { cover_image }),
        ...(reading_time_minutes !== undefined && { read_time: Number(reading_time_minutes) }),
        ...(is_published !== undefined && { status: is_published ? 'published' : 'draft' }),
        ...(is_featured !== undefined && { is_featured: Boolean(is_featured) }),
        updated_at: now,
      },
    });

    return NextResponse.json({ success: true, post: updated });
  } catch (error: any) {
    console.error('Error updating blog post:', error);
    return NextResponse.json({ error: error.message || 'خطا در ویرایش مقاله' }, { status: 500 });
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
    const type = searchParams.get('type') || 'post';

    if (!id) {
      return NextResponse.json({ error: 'شناسه الزامی است.' }, { status: 400 });
    }

    if (type === 'category') {
      await prisma.blogBlogcategory.delete({
        where: { id: Number(id) },
      });
      return NextResponse.json({ success: true, message: 'دسته‌بندی با موفقیت حذف شد.' });
    }

    if (type === 'author') {
      await prisma.blogBlogauthor.delete({
        where: { id: Number(id) },
      });
      return NextResponse.json({ success: true, message: 'نویسنده با موفقیت حذف شد.' });
    }

    await prisma.blogPost.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ success: true, message: 'مقاله با موفقیت حذف شد.' });
  } catch (error: any) {
    console.error('Error deleting blog item:', error);
    return NextResponse.json({ error: error.message || 'خطا در حذف آیتم وبلاگ' }, { status: 500 });
  }
}
