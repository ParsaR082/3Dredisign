import { NextResponse } from 'next/server';
import { getCurrentAdmin } from '@/lib/auth';
import path from 'path';
import fs from 'fs/promises';

export async function POST(request: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'عدم دسترسی.' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'general';

    if (!file) {
      return NextResponse.json({ error: 'فایلی ارسال نشده است.' }, { status: 400 });
    }

    // Validate mime type
    const validTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'image/svg+xml',
      'image/avif',
    ];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'فرمت فایل نامعتبر است. فقط تصاویر (JPG, PNG, WebP, SVG, GIF, AVIF) مجاز هستند.' },
        { status: 400 }
      );
    }

    // Max file size: 15MB
    const maxSize = 15 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'حجم فایل بیشتر از حد مجاز است (حداکثر ۱۵ مگابایت).' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize folder
    const safeFolder = folder.replace(/[^a-zA-Z0-9_-]/g, '') || 'general';
    const uploadDir = path.join(process.cwd(), 'public', 'media', 'uploads', safeFolder);
    await fs.mkdir(uploadDir, { recursive: true });

    const isSvg = file.type === 'image/svg+xml' || file.name.toLowerCase().endsWith('.svg');
    const isGif = file.type === 'image/gif' || file.name.toLowerCase().endsWith('.gif');

    let finalBuffer: Buffer = buffer;
    let finalExt = path.extname(file.name).toLowerCase() || '.jpg';
    let finalMime = file.type;

    if (!isSvg && !isGif) {
      try {
        const sharp = (await import('sharp')).default;
        finalBuffer = await sharp(buffer)
          .rotate()
          .resize({
            width: 2048,
            height: 2048,
            fit: 'inside',
            withoutEnlargement: true,
          })
          .webp({ quality: 82, effort: 4 })
          .toBuffer();

        finalExt = '.webp';
        finalMime = 'image/webp';
      } catch (sharpError) {
        console.warn('Sharp optimization fallback to original buffer:', sharpError);
      }
    }

    // Generate clean unique filename
    const originalBase = path
      .basename(file.name, path.extname(file.name))
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .slice(0, 30);
    const uniqueSuffix = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const filename = `${originalBase || 'img'}_${uniqueSuffix}${finalExt}`;
    const filePath = path.join(uploadDir, filename);

    await fs.writeFile(filePath, finalBuffer);

    const publicUrl = `/media/uploads/${safeFolder}/${filename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename,
      size: finalBuffer.length,
      originalSize: file.size,
      mimeType: finalMime,
      convertedToWebp: finalExt === '.webp',
    });
  } catch (error: any) {
    console.error('Upload API error:', error);
    return NextResponse.json(
      { error: error.message || 'خطایی در پردازش و ذخیره تصویر رخ داد.' },
      { status: 500 }
    );
  }
}
