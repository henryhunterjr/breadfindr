import type { VercelRequest, VercelResponse } from '@vercel/node';

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY || '';

/**
 * Find a Google Place ID for a bakery by name and location
 * This allows us to enrich database bakeries with real Google photos
 */
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

  const { name, lat, lng, address } = req.query;

  if (!name) {
    return res.status(400).json({ error: 'Missing bakery name' });
  }

  if (!GOOGLE_PLACES_API_KEY) {
    return res.status(500).json({ error: 'Google Places API key not configured' });
  }

  try {
    // Build search query - use name + city/address for better matching
    const searchQuery = address ? `${name} ${address}` : name;

    let url: string;

    if (lat && lng) {
      // If we have coordinates, use them to improve search accuracy
      url = `https://maps.googleapis.com/maps/api/place/textsearch/json?` +
        `query=${encodeURIComponent(searchQuery as string)}` +
        `&location=${lat},${lng}&radius=5000` +
        `&type=bakery` +
        `&key=${GOOGLE_PLACES_API_KEY}`;
    } else {
      // Otherwise just search by name
      url = `https://maps.googleapis.com/maps/api/place/textsearch/json?` +
        `query=${encodeURIComponent(searchQuery as string)} bakery` +
        `&key=${GOOGLE_PLACES_API_KEY}`;
    }

    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK' || !data.results || data.results.length === 0) {
      return res.status(200).json({
        found: false,
        message: 'No matching place found'
      });
    }

    // Return the best match (first result)
    const place = data.results[0];

    return res.status(200).json({
      found: true,
      place_id: place.place_id,
      name: place.name,
      formatted_address: place.formatted_address,
      rating: place.rating,
      user_ratings_total: place.user_ratings_total,
      photo_reference: place.photos?.[0]?.photo_reference || null,
      location: place.geometry?.location
    });
  } catch (error) {
    console.error('Google Places find error:', error);
    return res.status(500).json({ error: 'Failed to search Google Places' });
  }
}
