import { NextResponse } from 'next/server';
import { getCurrentAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'عدم دسترسی.' }, { status: 401 });
  }

  try {
    const [projects, categories, industries, additionalCats] = await Promise.all([
      prisma.portfolioProject.findMany({
        orderBy: [{ featured: 'desc' }, { order: 'asc' }],
      }),
      prisma.portfolioProjectcategory.findMany({
        orderBy: { order: 'asc' },
      }),
      prisma.portfolioIndustry.findMany(),
      prisma.portfolioProjectAdditionalCategories.findMany(),
    ]);

    const addCatMap = new Map<number, number[]>();
    for (const ac of additionalCats) {
      const list = addCatMap.get(ac.project_id) || [];
      list.push(ac.projectcategory_id);
      addCatMap.set(ac.project_id, list);
    }

    const projectsWithAddCats = projects.map((p) => ({
      ...p,
      additional_category_ids: addCatMap.get(p.id) || [],
    }));

    return NextResponse.json({
      success: true,
      projects: projectsWithAddCats,
      categories,
      industries,
    });
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
      type = 'project',
      name,
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
      category_id,
      industry_id,
      order = 1,
      icon = 'folder',
      cover_image = null,
      is_active = true,
      is_featured = false,
      additional_category_ids = [],
    } = body;

    if (type === 'category') {
      const catName = (name || title || '').trim();
      if (!catName) {
        return NextResponse.json({ error: 'نام دسته‌بندی الزامی است.' }, { status: 400 });
      }
      const catSlug = (slug || catName).trim().toLowerCase().replace(/\s+/g, '-');
      const newCategory = await prisma.portfolioProjectcategory.create({
        data: {
          name: catName,
          slug: catSlug,
          cover_image: cover_image || null,
          description: description || subtitle || catName,
          icon: icon || 'folder',
          order: Number(order) || 1,
          is_active: is_active !== undefined ? Boolean(is_active) : true,
          is_featured: Boolean(is_featured || featured),
          meta_title: catName,
          meta_description: (description || catName).slice(0, 300),
          created_at: new Date(),
          updated_at: new Date(),
        },
      });
      return NextResponse.json({ success: true, category: newCategory });
    }

    if (type === 'industry') {
      const indName = (name || title || '').trim();
      if (!indName) {
        return NextResponse.json({ error: 'نام صنعت الزامی است.' }, { status: 400 });
      }
      const indSlug = (slug || indName).trim().toLowerCase().replace(/\s+/g, '-');
      const newIndustry = await prisma.portfolioIndustry.create({
        data: {
          name: indName,
          slug: indSlug,
        },
      });
      return NextResponse.json({ success: true, industry: newIndustry });
    }

    if (!title || !slug) {
      return NextResponse.json({ error: 'عنوان و اسلاگ الزامی هستند.' }, { status: 400 });
    }

    // Default category and industry from existing database or create default fallback
    let cat = category_id
      ? await prisma.portfolioProjectcategory.findUnique({ where: { id: Number(category_id) } })
      : await prisma.portfolioProjectcategory.findFirst();

    if (!cat) {
      cat = await prisma.portfolioProjectcategory.create({
        data: {
          name: 'پروژه‌های عمومی',
          slug: 'general-projects',
          description: 'دسته‌بندی عمومی پروژه‌ها',
          icon: 'folder',
          order: 1,
          is_active: true,
          is_featured: false,
          meta_title: 'پروژه‌های عمومی',
          meta_description: 'دسته‌بندی عمومی پروژه‌ها',
          created_at: new Date(),
          updated_at: new Date(),
        },
      });
    }

    let ind = industry_id
      ? await prisma.portfolioIndustry.findUnique({ where: { id: Number(industry_id) } })
      : await prisma.portfolioIndustry.findFirst();

    if (!ind) {
      ind = await prisma.portfolioIndustry.create({
        data: {
          name: 'عمومی و تجاری',
          slug: 'general-commercial',
        },
      });
    }

    function serializeJson(val: any): string | null {
      if (!val) return null;
      if (typeof val === 'string') return val.trim() || null;
      try {
        return JSON.stringify(val);
      } catch {
        return null;
      }
    }

    const {
      challenge = '',
      tablet_mockup = '',
      pdf_url = '',
      kpi_data = null,
      timeline_steps = null,
      roi_cost = null,
      roi_revenue = null,
      roi_percentage = null,
      location_zone = 'مرکز شهر',
      latitude = null,
      longitude = null,
      show_on_map = false,
      meta_title = '',
      meta_description = '',
      recent = true,
    } = body;

    const newProject = await prisma.portfolioProject.create({
      data: {
        title,
        slug: slug.trim().toLowerCase().replace(/\s+/g, '-'),
        subtitle: subtitle || '',
        description: description || '',
        detailed_description: detailed_description || description || '',
        challenge: challenge || '',
        featured: Boolean(featured),
        recent: Boolean(recent),
        popular: Boolean(popular),
        project_date,
        thumbnail_image: thumbnail_image || 'portfolio/thumbnails/default.jpg',
        desktop_mockup: desktop_mockup || null,
        mobile_mockup: mobile_mockup || null,
        tablet_mockup: tablet_mockup || null,
        website_url: website_url || null,
        pdf_url: pdf_url || null,
        kpi_data: serializeJson(kpi_data),
        timeline_steps: serializeJson(timeline_steps),
        roi_cost: roi_cost != null && roi_cost !== '' ? Number(roi_cost) : null,
        roi_revenue: roi_revenue != null && roi_revenue !== '' ? Number(roi_revenue) : null,
        roi_percentage: roi_percentage != null && roi_percentage !== '' ? Number(roi_percentage) : null,
        order: Number(order) || 1,
        is_active: Boolean(is_active),
        category_id: cat.id,
        industry_id: ind.id,
        location_zone: location_zone || 'مرکز شهر',
        latitude: latitude != null && latitude !== '' ? Number(latitude) : null,
        longitude: longitude != null && longitude !== '' ? Number(longitude) : null,
        show_on_map: Boolean(show_on_map),
        featured_order: 1,
        canonical_url: `https://urumsima.ir/portfolio/${slug}/`,
        meta_description: meta_description || description.slice(0, 300),
        meta_robots: 'index, follow',
        meta_title: meta_title || title,
      },
    });

    // Save multi-categories (additional categories)
    if (Array.isArray(additional_category_ids) && additional_category_ids.length > 0) {
      const validAddCatIds = additional_category_ids
        .map(Number)
        .filter((catId) => !isNaN(catId) && catId !== cat.id);

      if (validAddCatIds.length > 0) {
        await prisma.portfolioProjectAdditionalCategories.createMany({
          data: validAddCatIds.map((catId) => ({
            project_id: newProject.id,
            projectcategory_id: catId,
          })),
        });
      }
    }

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
    const {
      type = 'project',
      id,
      name,
      title,
      slug,
      subtitle,
      description,
      detailed_description,
      challenge,
      featured,
      recent,
      popular,
      project_date,
      thumbnail_image,
      desktop_mockup,
      mobile_mockup,
      tablet_mockup,
      website_url,
      pdf_url,
      kpi_data,
      timeline_steps,
      roi_cost,
      roi_revenue,
      roi_percentage,
      category_id,
      industry_id,
      location_zone,
      latitude,
      longitude,
      show_on_map,
      meta_title,
      meta_description,
      order,
      is_active,
      is_featured,
      cover_image,
      icon,
      additional_category_ids,
    } = body;

    if (!id) {
      return NextResponse.json({ error: 'شناسه الزامی است.' }, { status: 400 });
    }

    // Category Update
    if (type === 'category') {
      const catName = name || title;
      const catSlug = slug ? slug.trim().toLowerCase().replace(/\s+/g, '-') : undefined;

      const updatedCategory = await prisma.portfolioProjectcategory.update({
        where: { id: Number(id) },
        data: {
          ...(catName !== undefined && { name: catName.trim() }),
          ...(catSlug !== undefined && { slug: catSlug }),
          ...(cover_image !== undefined && { cover_image: cover_image || null }),
          ...(description !== undefined && { description }),
          ...(icon !== undefined && { icon }),
          ...(order !== undefined && { order: Number(order) }),
          ...(is_active !== undefined && { is_active: Boolean(is_active) }),
          ...(is_featured !== undefined
            ? { is_featured: Boolean(is_featured) }
            : featured !== undefined
            ? { is_featured: Boolean(featured) }
            : {}),
          ...(meta_title !== undefined && { meta_title }),
          ...(meta_description !== undefined && { meta_description }),
          updated_at: new Date(),
        },
      });
      return NextResponse.json({ success: true, category: updatedCategory });
    }

    // Industry Update
    if (type === 'industry') {
      const indName = name || title;
      const indSlug = slug ? slug.trim().toLowerCase().replace(/\s+/g, '-') : undefined;

      const updatedIndustry = await prisma.portfolioIndustry.update({
        where: { id: Number(id) },
        data: {
          ...(indName !== undefined && { name: indName.trim() }),
          ...(indSlug !== undefined && { slug: indSlug }),
        },
      });
      return NextResponse.json({ success: true, industry: updatedIndustry });
    }

    // Project Update
    function serializeJson(val: any): string | null {
      if (val === undefined) return undefined as any;
      if (!val) return null;
      if (typeof val === 'string') return val.trim() || null;
      try {
        return JSON.stringify(val);
      } catch {
        return null;
      }
    }

    const updated = await prisma.portfolioProject.update({
      where: { id: Number(id) },
      data: {
        ...(title !== undefined && { title }),
        ...(slug !== undefined && { slug: slug.trim().toLowerCase().replace(/\s+/g, '-') }),
        ...(subtitle !== undefined && { subtitle }),
        ...(description !== undefined && { description }),
        ...(detailed_description !== undefined && { detailed_description }),
        ...(challenge !== undefined && { challenge }),
        ...(featured !== undefined && { featured: Boolean(featured) }),
        ...(recent !== undefined && { recent: Boolean(recent) }),
        ...(popular !== undefined && { popular: Boolean(popular) }),
        ...(project_date !== undefined && { project_date }),
        ...(thumbnail_image !== undefined && { thumbnail_image }),
        ...(desktop_mockup !== undefined && { desktop_mockup: desktop_mockup || null }),
        ...(mobile_mockup !== undefined && { mobile_mockup: mobile_mockup || null }),
        ...(tablet_mockup !== undefined && { tablet_mockup: tablet_mockup || null }),
        ...(website_url !== undefined && { website_url: website_url || null }),
        ...(pdf_url !== undefined && { pdf_url: pdf_url || null }),
        ...(kpi_data !== undefined && { kpi_data: serializeJson(kpi_data) }),
        ...(timeline_steps !== undefined && { timeline_steps: serializeJson(timeline_steps) }),
        ...(roi_cost !== undefined && { roi_cost: roi_cost !== '' && roi_cost != null ? Number(roi_cost) : null }),
        ...(roi_revenue !== undefined && { roi_revenue: roi_revenue !== '' && roi_revenue != null ? Number(roi_revenue) : null }),
        ...(roi_percentage !== undefined && { roi_percentage: roi_percentage !== '' && roi_percentage != null ? Number(roi_percentage) : null }),
        ...(category_id !== undefined && { category_id: Number(category_id) }),
        ...(industry_id !== undefined && { industry_id: Number(industry_id) }),
        ...(location_zone !== undefined && { location_zone }),
        ...(latitude !== undefined && { latitude: latitude !== '' && latitude != null ? Number(latitude) : null }),
        ...(longitude !== undefined && { longitude: longitude !== '' && longitude != null ? Number(longitude) : null }),
        ...(show_on_map !== undefined && { show_on_map: Boolean(show_on_map) }),
        ...(meta_title !== undefined && { meta_title }),
        ...(meta_description !== undefined && { meta_description }),
        ...(order !== undefined && { order: Number(order) }),
        ...(is_active !== undefined && { is_active: Boolean(is_active) }),
      },
    });

    // Update multi-categories (additional categories)
    if (additional_category_ids !== undefined && Array.isArray(additional_category_ids)) {
      await prisma.portfolioProjectAdditionalCategories.deleteMany({
        where: { project_id: Number(id) },
      });

      const currentPrimaryCatId = category_id !== undefined ? Number(category_id) : updated.category_id;
      const validAddCatIds = additional_category_ids
        .map(Number)
        .filter((catId) => !isNaN(catId) && catId !== currentPrimaryCatId);

      if (validAddCatIds.length > 0) {
        await prisma.portfolioProjectAdditionalCategories.createMany({
          data: validAddCatIds.map((catId) => ({
            project_id: Number(id),
            projectcategory_id: catId,
          })),
        });
      }
    }

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
    const type = searchParams.get('type') || 'project';

    if (!id) {
      return NextResponse.json({ error: 'شناسه الزامی است.' }, { status: 400 });
    }

    if (type === 'category') {
      const catId = Number(id);

      // Clean up junction table first
      await prisma.portfolioProjectAdditionalCategories.deleteMany({
        where: { projectcategory_id: catId },
      });

      // Check if any project has this category as its primary category
      const projectCount = await prisma.portfolioProject.count({
        where: { category_id: catId },
      });

      if (projectCount > 0) {
        // Find a fallback category
        const fallbackCat = await prisma.portfolioProjectcategory.findFirst({
          where: { id: { not: catId } },
        });

        if (fallbackCat) {
          await prisma.portfolioProject.updateMany({
            where: { category_id: catId },
            data: { category_id: fallbackCat.id },
          });
        }
      }

      await prisma.portfolioProjectcategory.delete({
        where: { id: catId },
      });
      return NextResponse.json({ success: true, message: 'دسته‌بندی با موفقیت حذف شد.' });
    }

    if (type === 'industry') {
      await prisma.portfolioIndustry.delete({
        where: { id: Number(id) },
      });
      return NextResponse.json({ success: true, message: 'صنعت با موفقیت حذف شد.' });
    }

    // Clean up junction rows before project deletion
    await prisma.portfolioProjectAdditionalCategories.deleteMany({
      where: { project_id: Number(id) },
    });

    await prisma.portfolioProject.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ success: true, message: 'پروژه با موفقیت حذف شد.' });
  } catch (error: any) {
    console.error('Error deleting project:', error);
    return NextResponse.json({ error: error.message || 'خطا در حذف پروژه' }, { status: 500 });
  }
}
