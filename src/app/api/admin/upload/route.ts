import { NextResponse } from 'next/server';
import { getCurrentAdmin } from '@/lib/auth';
import path from 'path';
import fs from 'fs/promises';
import fsSync from 'fs';

/**
 * Safely removes a file from public/media/uploads and /var/www/urumsima/media/uploads if present.
 */
async function safelyDeleteUploadedFile(fileUrl: string): Promise<boolean> {
  if (!fileUrl || typeof fileUrl !== 'string') return false;

  // Clean prefix if any
  let normalized = fileUrl.trim();
  if (normalized.startsWith('/')) {
    normalized = normalized.slice(1);
  }

  // Only allow deleting files strictly inside media/uploads/
  if (!normalized.startsWith('media/uploads/')) {
    return false;
  }

  const relativeSubpath = normalized.replace(/^media\/uploads\//, '');
  let anyDeleted = false;

  // 1. Delete from Next.js public directory
  try {
    const targetPath = path.resolve(process.cwd(), 'public', normalized);
    const baseUploadsDir = path.resolve(process.cwd(), 'public', 'media', 'uploads');
    if (targetPath.startsWith(baseUploadsDir)) {
      await fs.unlink(targetPath);
      anyDeleted = true;
    }
  } catch (_) {}

  // 2. Delete from production server Django media dir if exists
  try {
    const prodTarget = path.resolve('/var/www/urumsima/media/uploads', relativeSubpath);
    if (prodTarget.startsWith('/var/www/urumsima/media/uploads')) {
      await fs.unlink(prodTarget);
      anyDeleted = true;
    }
  } catch (_) {}

  return anyDeleted;
}

export async function POST(request: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'عدم دسترسی.' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'general';
    const previousUrl = formData.get('previousUrl') as string | null;

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
      'video/mp4',
      'video/webm',
      'video/quicktime',
      'video/x-matroska',
    ];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'فرمت فایل نامعتبر است. فقط تصاویر و ویدیوهای (MP4, WebM, MOV, JPG, PNG, WebP) مجاز هستند.' },
        { status: 400 }
      );
    }

    const isVideo = file.type.startsWith('video/');

    // Max file size: 100MB for video, 15MB for images
    const maxSize = isVideo ? 100 * 1024 * 1024 : 15 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `حجم فایل بیشتر از حد مجاز است (حداکثر ${isVideo ? '۱۰۰' : '۱۵'} مگابایت).` },
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
    let finalExt = path.extname(file.name).toLowerCase() || (isVideo ? '.mp4' : '.jpg');
    let finalMime = file.type;

    if (!isSvg && !isGif && !isVideo) {
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
    const filename = `${originalBase || (isVideo ? 'video' : 'img')}_${uniqueSuffix}${finalExt}`;
    const filePath = path.join(uploadDir, filename);

    // Write to Next.js local uploads
    await fs.writeFile(filePath, finalBuffer);

    // Mirror to production server Django media dir if running on host where /var/www/urumsima exists
    try {
      if (fsSync.existsSync('/var/www/urumsima/media')) {
        const prodDir = path.join('/var/www/urumsima/media/uploads', safeFolder);
        await fs.mkdir(prodDir, { recursive: true });
        await fs.writeFile(path.join(prodDir, filename), finalBuffer);
      }
    } catch (mirrorErr) {
      console.warn('Mirroring to /var/www/urumsima/media/uploads failed (normal in dev):', mirrorErr);
    }

    const publicUrl = `/media/uploads/${safeFolder}/${filename}`;

    // If a previous uploaded file was provided, safely delete it to avoid disk clutter
    if (previousUrl && previousUrl !== publicUrl) {
      await safelyDeleteUploadedFile(previousUrl);
    }

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
      { error: error.message || 'خطایی در پردازش و ذخیره فایل رخ داد.' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'عدم دسترسی.' }, { status: 401 });
  }

  try {
    const { url } = await request.json();
    if (!url) {
      return NextResponse.json({ error: 'آدرس فایل ارسال نشده است.' }, { status: 400 });
    }

    const deleted = await safelyDeleteUploadedFile(url);
    return NextResponse.json({ success: true, deleted });
  } catch (error: any) {
    console.error('Delete uploaded file error:', error);
    return NextResponse.json(
      { error: error.message || 'خطا در حذف فایل.' },
      { status: 500 }
    );
  }
}
