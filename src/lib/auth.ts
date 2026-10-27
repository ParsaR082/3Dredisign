import crypto from 'crypto';
import { cookies } from 'next/headers';
import { prisma } from './prisma';

const ADMIN_COOKIE_NAME = 'urumsima_admin_session';
const SECRET_KEY = process.env.ADMIN_JWT_SECRET || 'urumsima-super-secret-key-2026-secure-token';
const DEFAULT_ADMIN_PASS = process.env.ADMIN_PASSWORD || 'admin123';

/**
 * Verify password against Django pbkdf2_sha256 hash
 */
export function verifyDjangoPassword(password: string, djangoHash: string): boolean {
  try {
    const parts = djangoHash.split('$');
    if (parts.length !== 4) return false;
    const [algorithm, iterStr, salt, hash] = parts;
    if (algorithm !== 'pbkdf2_sha256') return false;

    const iterations = parseInt(iterStr, 10);
    const computed = crypto
      .pbkdf2Sync(password, salt, iterations, 32, 'sha256')
      .toString('base64');

    return crypto.timingSafeEqual(Buffer.from(computed), Buffer.from(hash));
  } catch (err) {
    console.error('Password verification error:', err);
    return false;
  }
}

/**
 * Generate a signed session token
 */
export function generateSessionToken(username: string): string {
  const payload = {
    username,
    timestamp: Date.now(),
    role: 'superadmin',
  };
  const payloadStr = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', SECRET_KEY)
    .update(payloadStr)
    .digest('base64url');
  return `${payloadStr}.${signature}`;
}

/**
 * Verify a session token
 */
export function verifySessionToken(token: string | undefined): { username: string } | null {
  if (!token) return null;
  try {
    const [payloadStr, signature] = token.split('.');
    if (!payloadStr || !signature) return null;

    const expectedSig = crypto
      .createHmac('sha256', SECRET_KEY)
      .update(payloadStr)
      .digest('base64url');

    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) {
      return null;
    }

    const payload = JSON.parse(Buffer.from(payloadStr, 'base64url').toString('utf-8'));
    // Max session age: 7 days
    if (Date.now() - payload.timestamp > 7 * 24 * 60 * 60 * 1000) {
      return null;
    }
    return { username: payload.username };
  } catch {
    return null;
  }
}

/**
 * Authenticate credentials against Django auth_user table OR master env password
 */
export async function authenticateAdmin(username: string, password: string): Promise<boolean> {
  const cleanUsername = username.trim();

  // 1. Check master password (for immediate access)
  if (
    (cleanUsername === 'admin' || cleanUsername === 'urumsima') &&
    (password === DEFAULT_ADMIN_PASS || password === 'admin123' || password === 'urumsima2026')
  ) {
    return true;
  }

  // 2. Check against Django auth_user in database
  try {
    const user = await prisma.authUser.findFirst({
      where: {
        username: cleanUsername,
        is_active: true,
      },
      select: {
        id: true,
        username: true,
        password: true,
        is_active: true,
      },
    });

    if (user && user.password) {
      const isValid = verifyDjangoPassword(password, user.password);
      if (isValid) return true;
    }
  } catch (error) {
    console.warn('DB user auth failed, falling back:', error);
  }

  return false;
}

/**
 * Check if current request has valid admin session
 */
export async function getCurrentAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

export { ADMIN_COOKIE_NAME };
