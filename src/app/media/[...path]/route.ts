import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const MIME_TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
};

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: segments } = await params;
    if (!segments || segments.length === 0) {
      return new NextResponse('Bad request', { status: 400 });
    }

    const relativePath = segments.join('/');
    // Prevent directory traversal attacks
    const safePath = path.normalize(relativePath).replace(/^(\.\.[\/\\])+/, '');
    const decodedPath = decodeURIComponent(safePath);

    const candidatePaths = [
      path.join('/var/www/urumsima/media', safePath),
      path.join('/var/www/urumsima/media', decodedPath),
      path.join(process.cwd(), 'public', 'media', safePath),
      path.join(process.cwd(), 'public', 'media', decodedPath),
      path.join(process.cwd(), '..', 'urumsima', 'media', safePath),
      path.join(process.cwd(), '..', 'urumsima', 'media', decodedPath),
    ];

    let filePath = candidatePaths.find((p) => {
      try {
        return fs.existsSync(p) && fs.statSync(p).isFile();
      } catch {
        return false;
      }
    });

    // If not found, check alternative extensions (.webp, .jpg, .jpeg, .png)
    if (!filePath) {
      const origExt = path.extname(safePath).toLowerCase();
      const baseSafe = safePath.slice(0, safePath.length - origExt.length);
      const baseDecoded = decodedPath.slice(0, decodedPath.length - origExt.length);
      const altExts = ['.webp', '.jpg', '.jpeg', '.png'].filter((e) => e !== origExt);

      for (const alt of altExts) {
        const altCandidates = [
          path.join('/var/www/urumsima/media', baseSafe + alt),
          path.join('/var/www/urumsima/media', baseDecoded + alt),
          path.join(process.cwd(), 'public', 'media', baseSafe + alt),
          path.join(process.cwd(), 'public', 'media', baseDecoded + alt),
          path.join(process.cwd(), '..', 'urumsima', 'media', baseSafe + alt),
          path.join(process.cwd(), '..', 'urumsima', 'media', baseDecoded + alt),
        ];
        filePath = altCandidates.find((p) => {
          try {
            return fs.existsSync(p) && fs.statSync(p).isFile();
          } catch {
            return false;
          }
        });
        if (filePath) break;
      }
    }

    // Fallback to default placeholder if file still missing on disk
    if (!filePath) {
      const fallbackPlaceholder = path.join(process.cwd(), 'public', 'images', 'urumsima3.webp');
      if (fs.existsSync(fallbackPlaceholder)) {
        filePath = fallbackPlaceholder;
      } else {
        return new NextResponse('File not found', { status: 404 });
      }
    }

    const stat = fs.statSync(filePath);

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    const fileBuffer = fs.readFileSync(filePath);

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Length': stat.size.toString(),
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err: any) {
    console.error('Error serving media file:', err);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
