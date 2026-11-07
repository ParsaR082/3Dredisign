import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';

const MIME_TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.avif': 'image/avif',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mov': 'video/quicktime',
  '.m4v': 'video/mp4',
  '.ogg': 'video/ogg',
  '.ogv': 'video/ogg',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
};

export async function GET(
  request: NextRequest,
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
    let decodedPath = safePath;
    try {
      decodedPath = decodeURIComponent(safePath);
    } catch {
      // Keep safePath if decoding fails
    }

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

    const origExt = path.extname(safePath).toLowerCase();
    const isVideoRequest = ['.mp4', '.webm', '.mov', '.m4v', '.ogg', '.ogv'].includes(origExt);

    // If not found, check alternative extensions (.webp, .jpg, .jpeg, .png) for images ONLY
    if (!filePath && !isVideoRequest) {
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

    // Fallback handling
    if (!filePath) {
      if (isVideoRequest) {
        // Never return an image placeholder for a video request
        return new NextResponse('Video not found', { status: 404 });
      }
      const fallbackPlaceholder = path.join(process.cwd(), 'public', 'images', 'urumsima3.webp');
      if (fs.existsSync(fallbackPlaceholder)) {
        filePath = fallbackPlaceholder;
      } else {
        return new NextResponse('File not found', { status: 404 });
      }
    }

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || (isVideoRequest ? 'video/mp4' : 'application/octet-stream');
    const range = request.headers.get('range');

    // Handle HTTP 206 Partial Content for streaming (HTML5 video / audio / range requests)
    if (range && (isVideoRequest || contentType.startsWith('video/') || contentType.startsWith('audio/'))) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      // Chunk limit of 3MB per chunk to ensure fast buffering without memory spikes
      const maxChunk = 3 * 1024 * 1024;
      const end = parts[1]
        ? parseInt(parts[1], 10)
        : Math.min(start + maxChunk - 1, fileSize - 1);

      if (isNaN(start) || start >= fileSize || end >= fileSize || start > end) {
        return new NextResponse('Requested range not satisfiable', {
          status: 416,
          headers: {
            'Content-Range': `bytes */${fileSize}`,
          },
        });
      }

      const chunkLength = end - start + 1;
      const nodeStream = fs.createReadStream(filePath, { start, end });
      const webStream = Readable.toWeb(nodeStream) as ReadableStream<Uint8Array>;

      return new NextResponse(webStream, {
        status: 206,
        headers: {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunkLength.toString(),
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=31536000, immutable',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // For videos requested without range: stream with Accept-Ranges
    if (isVideoRequest || contentType.startsWith('video/')) {
      const nodeStream = fs.createReadStream(filePath);
      const webStream = Readable.toWeb(nodeStream) as ReadableStream<Uint8Array>;
      return new NextResponse(webStream, {
        headers: {
          'Content-Type': contentType,
          'Content-Length': fileSize.toString(),
          'Accept-Ranges': 'bytes',
          'Cache-Control': 'public, max-age=31536000, immutable',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // For static images and other assets: read and return
    const fileBuffer = fs.readFileSync(filePath);

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Length': fileSize.toString(),
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err: any) {
    console.error('Error serving media file:', err);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
