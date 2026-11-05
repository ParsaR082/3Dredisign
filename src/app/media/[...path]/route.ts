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

    const filePath = candidatePaths.find((p) => {
      try {
        return fs.existsSync(p) && fs.statSync(p).isFile();
      } catch {
        return false;
      }
    });

    if (!filePath) {
      return new NextResponse('File not found', { status: 404 });
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
