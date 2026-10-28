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
      name,
      role,
      tagline = '',
      skills_csv = '',
      total_projects = 10,
      years_experience = 3,
      accent_color = '#10B981',
      planet_type = 'cyber',
      poster_image = null,
      order = 1,
      is_active = true,
    } = body;

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
    console.error('Error creating team member:', error);
    return NextResponse.json({ error: error.message || 'خطا در افزودن عضو تیم' }, { status: 500 });
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
      role,
      tagline,
      skills_csv,
      total_projects,
      years_experience,
      accent_color,
      planet_type,
      poster_image,
      order,
      is_active,
    } = body;

    if (!id) {
      return NextResponse.json({ error: 'شناسه الزامی است.' }, { status: 400 });
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
    return NextResponse.json({ error: error.message || 'خطا در ویرایش عضو تیم' }, { status: 500 });
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

    await prisma.aboutTechlead.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ success: true, message: 'عضو تیم با موفقیت حذف شد.' });
  } catch (error: any) {
    console.error('Error deleting team member:', error);
    return NextResponse.json({ error: error.message || 'خطا در حذف عضو تیم' }, { status: 500 });
  }
}
