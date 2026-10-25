export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  return res.json({ status: 'OK', timestamp: new Date().toISOString() });
}
