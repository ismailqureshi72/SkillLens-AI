import { getMarketData } from '../../lib/market-data.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const role = req.query?.role;
  if (typeof role !== 'string' || !role.trim() || role.length > 120) {
    return res.status(400).json({ error: 'Enter a role or market between 1 and 120 characters.' });
  }
  return res.json(getMarketData(role.trim()));
}
