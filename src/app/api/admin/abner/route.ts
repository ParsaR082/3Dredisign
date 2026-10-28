import { NextResponse } from 'next/server';
import { getCurrentAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'عدم دسترسی.' }, { status: 401 });
  }

  try {
    const [page, products, cityTvModels, standModels, gallery] = await Promise.all([
      prisma.abnerAbnerpage.findFirst(),
      prisma.abnerAbnerproduct.findMany({
        orderBy: { order: 'asc' },
      }),
      prisma.abnerAbnercitytvmodel.findMany({
        orderBy: { order: 'asc' },
      }),
      prisma.abnerAbnerstandmodel.findMany({
        orderBy: { order: 'asc' },
      }),
      prisma.abnerAbnergalleryitem.findMany({
        orderBy: { order: 'asc' },
      }),
    ]);

    return NextResponse.json({
      success: true,
      page,
      products,
      cityTvModels,
      standModels,
      gallery,
    });
  } catch (error: any) {
    console.error('Error fetching Abner data:', error);
    return NextResponse.json({ error: error.message || 'خطا در دریافت اطلاعات آبنر' }, { status: 500 });
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
      type = 'product', // 'product' | 'citytv' | 'stand'
      name,
      slug,
      short_description = '',
      image = null,
      icon = '📺',
      is_featured = false,
      is_active = true,
      order = 1,
      // City TV specific fields
      environment = 'Outdoor',
      pixel_pitch = 'P4',
      brightness = '5500 nits',
      refresh_rate = '3840 Hz',
      // Stand specific fields
      resolution = '4K UHD',
      body_material = 'آلومینیوم آنودایز',
      body_color = 'مشکی مات',
    } = body;

    if (!name) {
      return NextResponse.json({ error: 'نام محصول الزامی است.' }, { status: 400 });
    }

    const page = await prisma.abnerAbnerpage.findFirst();
    const pageId = page?.id || 1;

    if (type === 'citytv') {
      const cityModel = await prisma.abnerAbnercitytvmodel.create({
        data: {
          name,
          environment,
          pixel_pitch,
          module_size: '320x160mm',
          module_resolution: '80x40',
          cabinet_size: '960x960mm',
          cabinet_resolution: '240x240',
          cabinet_material: 'Die-cast Aluminum',
          cabinet_weight: '28kg',
          aspect_ratio: '16:9',
          brightness,
          contrast: '5000:1',
          viewing_angle: '160° / 140°',
          ip_rating: 'IP65',
          input_voltage: 'AC 110-220V',
          operating_temp: '-20°C ~ +60°C',
          refresh_rate,
          maintenance: 'Front & Rear',
          order: Number(order) || 1,
          page_id: pageId,
        },
      });
      return NextResponse.json({ success: true, item: cityModel });
    }

    if (type === 'stand') {
      const stand = await prisma.abnerAbnerstandmodel.create({
        data: {
          name,
          height: '185cm',
          width: '65cm',
          resolution,
          pixel_pitch: 'P2.5',
          lifespan: '100,000 Hours',
          temp_range: '-10°C ~ +50°C',
          voltage: '220V',
          power: '250W',
          ip_rating: 'IP54',
          body_material,
          body_color,
          shock_water: 'مقاوم در برابر ضربه و رطوبت',
          ports: 'HDMI, USB, LAN, Wi-Fi',
          wifi: 'پشتیبانی از شبکه بی‌سیم',
          bezel: 'فریم باریک ۶ میلی‌متر',
          video_playback: 'پشتیبانی از تمامی فرمت‌های ویدیویی',
          portable: 'دارای چرخ‌های صنعتی روان و قفل‌دار',
          order: Number(order) || 1,
          page_id: pageId,
        },
      });
      return NextResponse.json({ success: true, item: stand });
    }

    // Default: general product
    const product = await prisma.abnerAbnerproduct.create({
      data: {
        name,
        slug: (slug || name).trim().toLowerCase().replace(/\s+/g, '-'),
        short_description,
        body: short_description,
        key_points_csv: 'کیفیت تصویر خیره‌کننده, گارانتی رسمی ۲۴ ماهه, ضد آب و گرد و غبار',
        image,
        icon,
        is_featured: Boolean(is_featured),
        is_active: Boolean(is_active),
        order: Number(order) || 1,
        page_id: pageId,
      },
    });

    return NextResponse.json({ success: true, item: product });
  } catch (error: any) {
    console.error('Error creating Abner item:', error);
    return NextResponse.json({ error: error.message || 'خطا در ثبت محصول آبنر' }, { status: 500 });
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
    const type = searchParams.get('type') || 'product';

    if (!id) {
      return NextResponse.json({ error: 'شناسه الزامی است.' }, { status: 400 });
    }

    if (type === 'citytv') {
      await prisma.abnerAbnercitytvmodel.delete({ where: { id: Number(id) } });
    } else if (type === 'stand') {
      await prisma.abnerAbnerstandmodel.delete({ where: { id: Number(id) } });
    } else {
      await prisma.abnerAbnerproduct.delete({ where: { id: Number(id) } });
    }

    return NextResponse.json({ success: true, message: 'محصول با موفقیت حذف شد.' });
  } catch (error: any) {
    console.error('Error deleting Abner item:', error);
    return NextResponse.json({ error: error.message || 'خطا در حذف محصول آبنر' }, { status: 500 });
  }
}
