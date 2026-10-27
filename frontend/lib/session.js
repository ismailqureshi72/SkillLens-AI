import { randomBytes, createHash } from 'node:crypto';
import { prisma } from './prisma.js';

const COOKIE = 'skilllens_session';
const TOKEN = /^[a-f0-9]{64}$/;
const keyFor = token => createHash('sha256').update(token).digest('hex');

export function sessionToken(req) {
  const cookie = String(req.headers?.cookie || '').split(';').map(part => part.trim()).find(part => part.startsWith(COOKIE + '='));
  const value = cookie?.slice(COOKIE.length + 1);
  return value && TOKEN.test(value) ? value : null;
}

export function privateResponse(res) {
  res.setHeader('Cache-Control', 'private, no-store');
  res.setHeader('Vary', 'Cookie');
}

export async function currentOwner(req, db = prisma) {
  const token = sessionToken(req);
  if (!token) return null;
  const hash = keyFor(token);
  const user = await db.user.findUnique({ where: { email: `session-${hash}@anonymous.invalid` }, select: { id: true, passwordHash: true } });
  return user?.passwordHash === `session:${hash}` ? user.id : null;
}

export async function ensureOwner(req, res, db = prisma) {
  privateResponse(res);
  const existing = await currentOwner(req, db);
  if (existing) return existing;
  // Anonymous browser identity: only a hash is stored. No password or email login.
  const token = randomBytes(32).toString('hex');
  const hash = keyFor(token);
  const user = await db.user.create({ data: { email: `session-${hash}@anonymous.invalid`, passwordHash: `session:${hash}` }, select: { id: true } });
  const secure = process.env.VERCEL || req.headers?.['x-forwarded-proto'] === 'https';
  res.setHeader('Set-Cookie', `${COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000${secure ? '; Secure' : ''}`);
  return user.id;
}
