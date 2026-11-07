import { NextResponse } from 'next/server';
import { getCurrentAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'عدم دسترسی.' }, { status: 401 });
  }

  try {
    const [members, coreValues, timeline, settings] = await Promise.all([
      prisma.aboutTechlead.findMany({
        orderBy: { order: 'asc' },
      }),
      prisma.aboutCorevalue.findMany({
        orderBy: { order: 'asc' },
      }),
      prisma.aboutTimemachinestep.findMany({
        orderBy: { order: 'asc' },
      }),
      prisma.aboutAboutpagesettings.findFirst(),
    ]);

    return NextResponse.json({
      success: true,
      members,
      coreValues,
      timeline,
      settings,
    });
  } catch (error: any) {
    console.error('Error fetching team data:', error);
    return NextResponse.json({ error: error.message || 'خطا در دریافت اطلاعات تیم' }, { status: 500 });
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
      type = 'member',
      name,
      role,
      title,
      description = '',
      icon_label = 'diamond',
      year = '1403',
      tagline = '',
      skills_csv = '',
      total_projects = 10,
      years_experience = 3,
      accent_color = '#10B981',
      planet_type = 'cyber',
      poster_image = null,
      image = null,
      bg_video = null,
      order = 1,
      is_active = true,
    } = body;

    if (type === 'corevalue') {
      const valTitle = title || name;
      if (!valTitle) {
        return NextResponse.json({ error: 'عنوان ارزش الزامی است.' }, { status: 400 });
      }
      const newCoreValue = await prisma.aboutCorevalue.create({
        data: {
          title: valTitle,
          description: description || valTitle,
          icon_label: icon_label || 'diamond',
          bg_video,
          image,
          order: Number(order) || 1,
        },
      });
      return NextResponse.json({ success: true, coreValue: newCoreValue });
    }

    if (type === 'timemachine') {
      const stepTitle = title || name;
      if (!stepTitle) {
        return NextResponse.json({ error: 'عنوان رویداد تایم‌لاین الزامی است.' }, { status: 400 });
      }
      const newStep = await prisma.aboutTimemachinestep.create({
        data: {
          year: String(year || '1403'),
          title: stepTitle,
          description: description || stepTitle,
          order: Number(order) || 1,
          image,
        },
      });
      return NextResponse.json({ success: true, timemachine: newStep });
    }

    if (!name || !role) {
      return NextResponse.json({ error: 'نام و سمت الزامی هستند.' }, { status: 400 });
    }

    const newMember = await prisma.aboutTechlead.create({
      data: {
        name,
        role,
        tagline: tagline || role,
        skills_csv: skills_csv || 'UI/UX, 3D, Web',
        total_projects: Number(total_projects) || 10,
        years_experience: Number(years_experience) || 3,
        accent_color: accent_color || '#10B981',
        planet_type: planet_type || 'cyber',
        poster_image,
        order: Number(order) || 1,
        is_active: Boolean(is_active),
      },
    });

    return NextResponse.json({ success: true, member: newMember });
  } catch (error: any) {
    console.error('Error creating team item:', error);
    return NextResponse.json({ error: error.message || 'خطا در ثبت اطلاعات تیم' }, { status: 500 });
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
      type = 'member',
      id,
      name,
      role,
      title,
      description,
      icon_label,
      year,
      tagline,
      skills_csv,
      total_projects,
      years_experience,
      accent_color,
      planet_type,
      poster_image,
      image,
      bg_video,
      order,
      is_active,
    } = body;

    if (!id) {
      return NextResponse.json({ error: 'شناسه الزامی است.' }, { status: 400 });
    }

    if (type === 'corevalue') {
      const updated = await prisma.aboutCorevalue.update({
        where: { id: Number(id) },
        data: {
          ...(title !== undefined && { title }),
          ...(description !== undefined && { description }),
          ...(icon_label !== undefined && { icon_label }),
          ...(image !== undefined && { image }),
          ...(bg_video !== undefined && { bg_video }),
          ...(order !== undefined && { order: Number(order) }),
        },
      });
      return NextResponse.json({ success: true, coreValue: updated });
    }

    if (type === 'timemachine') {
      const updated = await prisma.aboutTimemachinestep.update({
        where: { id: Number(id) },
        data: {
          ...(year !== undefined && { year: String(year) }),
          ...(title !== undefined && { title }),
          ...(description !== undefined && { description }),
          ...(image !== undefined && { image }),
          ...(order !== undefined && { order: Number(order) }),
        },
      });
      return NextResponse.json({ success: true, timemachine: updated });
    }

    const updated = await prisma.aboutTechlead.update({
      where: { id: Number(id) },
      data: {
        ...(name !== undefined && { name }),
        ...(role !== undefined && { role }),
        ...(tagline !== undefined && { tagline }),
        ...(skills_csv !== undefined && { skills_csv }),
        ...(total_projects !== undefined && { total_projects: Number(total_projects) }),
        ...(years_experience !== undefined && { years_experience: Number(years_experience) }),
        ...(accent_color !== undefined && { accent_color }),
        ...(planet_type !== undefined && { planet_type }),
        ...(poster_image !== undefined && { poster_image }),
        ...(order !== undefined && { order: Number(order) }),
        ...(is_active !== undefined && { is_active: Boolean(is_active) }),
      },
    });

    return NextResponse.json({ success: true, member: updated });
  } catch (error: any) {
    console.error('Error updating team member:', error);
    return NextResponse.json({ error: error.message || 'خطا در ویرایش اطلاعات تیم' }, { status: 500 });
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
    const type = searchParams.get('type') || 'member';

    if (!id) {
      return NextResponse.json({ error: 'شناسه الزامی است.' }, { status: 400 });
    }

    if (type === 'corevalue') {
      await prisma.aboutCorevalue.delete({
        where: { id: Number(id) },
      });
      return NextResponse.json({ success: true, message: 'ارزش سازمانی با موفقیت حذف شد.' });
    }

    if (type === 'timemachine') {
      await prisma.aboutTimemachinestep.delete({
        where: { id: Number(id) },
      });
      return NextResponse.json({ success: true, message: 'مرحله تایم‌لاین با موفقیت حذف شد.' });
    }

    await prisma.aboutTechlead.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ success: true, message: 'عضو تیم با موفقیت حذف شد.' });
  } catch (error: any) {
    console.error('Error deleting team member:', error);
    return NextResponse.json({ error: error.message || 'خطا در حذف عضو تیم' }, { status: 500 });
  }
}
