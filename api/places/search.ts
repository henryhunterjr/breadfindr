import type { VercelRequest, VercelResponse } from '@vercel/node';

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY || '';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { lat, lng, radius, query } = req.query;

  if (!lat || !lng || !query) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  if (!GOOGLE_PLACES_API_KEY) {
    return res.status(500).json({ error: 'Google Places API key not configured' });
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?` +
      `query=${encodeURIComponent(query as string)}&location=${lat},${lng}&radius=${radius || 40000}&key=${GOOGLE_PLACES_API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    return res.status(200).json(data);
  } catch (error) {
    console.error('Google Places API error:', error);
    return res.status(500).json({ error: 'Failed to fetch from Google Places' });
  }
}
