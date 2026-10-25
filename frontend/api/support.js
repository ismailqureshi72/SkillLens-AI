import { prisma } from '../lib/prisma.js';

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, message } = req.body || {};
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required.' });
    }
    const ticket = await prisma.supportTicket.create({
      data: { name, email, message }
    });
    return res.status(201).json(ticket);
  } catch (error) {
    console.error('Support Ticket Creation Error:', error);
    return res.status(500).json({ error: 'Failed to create support ticket in database.' });
  }
}
