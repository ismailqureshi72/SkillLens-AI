import { prisma } from '../lib/prisma.js';
import { currentOwner, privateResponse } from '../lib/session.js';

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    privateResponse(res);
    const userId = await currentOwner(req);
    if (!userId) return res.json([]);
    const analyses = await prisma.analysis.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
    return res.json(analyses);
  } catch (error) {
    console.error('List Analyses Error:', error);
    return res.status(500).json({ error: 'Failed to fetch analysis history.' });
  }
}
