/**
 * Google Places API Integration
 * Searches for bakeries near a location using server-side API proxy
 */

import type { Bakery } from '../types';

// For photo URLs, we still need the client-side key
const GOOGLE_PLACES_API_KEY = import.meta.env.VITE_GOOGLE_PLACES_API_KEY || '';

// Check if Google Places is configured (server-side handles the actual key)
export const isGooglePlacesConfigured = (): boolean => {
  // In production, the server has the key. We return true to attempt discovery.
  // The server will return an error if not configured.
  return true;
};

// Types for Google Places API responses
interface PlaceResult {
  place_id: string;
  name: string;
  formatted_address?: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  rating?: number;
  user_ratings_total?: number;
  types?: string[];
  business_status?: string;
  opening_hours?: {
    open_now?: boolean;
    weekday_text?: string[];
  };
  photos?: Array<{
    photo_reference: string;
    height: number;
    width: number;
  }>;
  vicinity?: string;
}

interface NearbySearchResponse {
  results: PlaceResult[];
  status: string;
  next_page_token?: string;
  error_message?: string;
}

// Cache to avoid duplicate API calls
const searchCache = new Map<string, { results: Bakery[]; timestamp: number }>();
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

/**
 * Search for bakeries near a location using Google Places API (via server proxy)
 */
export async function searchNearbyBakeries(
  lat: number,
  lng: number,
  radiusMeters: number = 40000 // Default 25 miles ≈ 40km
): Promise<Bakery[]> {
  // Check cache first
  const cacheKey = `${lat.toFixed(3)},${lng.toFixed(3)},${radiusMeters}`;
  const cached = searchCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log('Using cached bakery results');
    return cached.results;
  }

  try {
    console.log('Searching for bakeries near:', lat, lng);

    // Search for bakeries via API proxy
    const bakeryResults = await nearbySearch(lat, lng, radiusMeters, 'bakery');
    console.log('Found bakery results:', bakeryResults.length);

    // Also search for "artisan bread" to catch more specialty shops
    const artisanResults = await textSearch(lat, lng, radiusMeters, 'artisan bakery sourdough');
    console.log('Found artisan results:', artisanResults.length);

    // Combine and deduplicate results
    const allResults = [...bakeryResults, ...artisanResults];
    const uniqueResults = deduplicateByPlaceId(allResults);

    // Filter out chain bakeries and grocery stores
    const filteredResults = uniqueResults.filter(place => {
      const name = place.name.toLowerCase();
      const isChain = CHAIN_BAKERIES.some(chain => name.includes(chain.toLowerCase()));
      const isGrocery = place.types?.some(t =>
        ['supermarket', 'grocery_or_supermarket', 'convenience_store'].includes(t)
      );
      return !isChain && !isGrocery;
    });

    console.log('After filtering chains:', filteredResults.length);

    // Convert to Bakery format
    const bakeries = filteredResults.map(place => placeResultToBakery(place));

    // Cache results
    searchCache.set(cacheKey, { results: bakeries, timestamp: Date.now() });

    return bakeries;
  } catch (error) {
    console.error('Error searching Google Places:', error);
    return [];
  }
}

/**
 * Get a photo URL for a place
 */
export function getPhotoUrl(photoReference: string, maxWidth: number = 400): string {
  if (!GOOGLE_PLACES_API_KEY || !photoReference) {
    return '';
  }
  return `https://maps.googleapis.com/maps/api/place/photo?` +
    `maxwidth=${maxWidth}&photo_reference=${photoReference}&key=${GOOGLE_PLACES_API_KEY}`;
}

/**
 * Enrichment result from Google Places
 */
interface EnrichmentResult {
  found: boolean;
  place_id?: string;
  name?: string;
  formatted_address?: string;
  rating?: number;
  user_ratings_total?: number;
  photo_reference?: string | null;
  photoUrl?: string;
}

/**
 * Find and enrich a bakery with Google Places data
 * Use this to get real photos for database bakeries
 */
export async function enrichBakeryWithGoogle(
  name: string,
  lat?: number,
  lng?: number,
  address?: string
): Promise<EnrichmentResult> {
  try {
    const params = new URLSearchParams({ name });
    if (lat && lng) {
      params.set('lat', lat.toString());
      params.set('lng', lng.toString());
    }
    if (address) {
      params.set('address', address);
    }

    const response = await fetch(`/api/places/find?${params.toString()}`);
    const data = await response.json();

    if (data.found && data.photo_reference) {
      return {
        ...data,
        photoUrl: getPhotoUrl(data.photo_reference)
      };
    }

    return data;
  } catch (error) {
    console.error('Error enriching bakery:', error);
    return { found: false };
  }
}

/**
 * Enrich multiple bakeries in parallel
 * Returns a map of bakery ID to enrichment result
 */
export async function enrichBakeries(
  bakeries: Array<{ id: string; name: string; latitude?: number; longitude?: number; city?: string; state?: string }>
): Promise<Map<string, EnrichmentResult>> {
  const results = new Map<string, EnrichmentResult>();

  // Process in batches to avoid rate limiting
  const batchSize = 5;
  for (let i = 0; i < bakeries.length; i += batchSize) {
    const batch = bakeries.slice(i, i + batchSize);
    const promises = batch.map(async (bakery) => {
      const address = [bakery.city, bakery.state].filter(Boolean).join(', ');
      const result = await enrichBakeryWithGoogle(
        bakery.name,
        bakery.latitude,
        bakery.longitude,
        address
      );
      return { id: bakery.id, result };
    });

    const batchResults = await Promise.all(promises);
    batchResults.forEach(({ id, result }) => {
      results.set(id, result);
    });

    // Small delay between batches to be nice to the API
    if (i + batchSize < bakeries.length) {
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  }

  return results;
}

// --- Internal Functions ---

async function nearbySearch(
  lat: number,
  lng: number,
  radius: number,
  type: string
): Promise<PlaceResult[]> {
  // Use API proxy to avoid CORS issues
  const url = `/api/places/nearby?lat=${lat}&lng=${lng}&radius=${radius}&type=${type}`;

  const response = await fetch(url);
  const data: NearbySearchResponse = await response.json();

  if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
    console.error('Nearby search error:', data.status, data.error_message);
    return [];
  }

  return data.results || [];
}

async function textSearch(
  lat: number,
  lng: number,
  radius: number,
  query: string
): Promise<PlaceResult[]> {
  // Use API proxy to avoid CORS issues
  const url = `/api/places/search?lat=${lat}&lng=${lng}&radius=${radius}&query=${encodeURIComponent(query)}`;

  const response = await fetch(url);
  const data: NearbySearchResponse = await response.json();

  if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
    console.error('Text search error:', data.status, data.error_message);
    return [];
  }

  return data.results || [];
}

function deduplicateByPlaceId(places: PlaceResult[]): PlaceResult[] {
  const seen = new Set<string>();
  return places.filter(place => {
    if (seen.has(place.place_id)) {
      return false;
    }
    seen.add(place.place_id);
    return true;
  });
}

function placeResultToBakery(place: PlaceResult): Bakery {
  const addressParts = parseAddress(place.formatted_address || place.vicinity || '');

  return {
    id: `google_${place.place_id}`,
    name: place.name,
    type: 'bakery',
    description: '', // Not available in search results
    specialties: inferSpecialties(place.name, place.types || []),
    rating: place.rating || 0,
    reviewCount: place.user_ratings_total || 0,
    address: addressParts.street,
    city: addressParts.city,
    state: addressParts.state,
    zip: addressParts.zip,
    latitude: place.geometry.location.lat,
    longitude: place.geometry.location.lng,
    verified: false,
    featured: false,
    image: place.photos?.[0] ? getPhotoUrl(place.photos[0].photo_reference) : undefined,
    // Custom fields for discovered bakeries
    googlePlaceId: place.place_id,
    source: 'google_places' as const,
  };
}

function parseAddress(address: string): { street: string; city: string; state: string; zip: string } {
  // Try to parse "123 Main St, City, ST 12345, USA" format
  const parts = address.split(',').map(p => p.trim());

  if (parts.length >= 3) {
    const street = parts[0];
    const city = parts[1];
    // State and zip are usually in the same part: "CA 90210"
    const stateZipMatch = parts[2].match(/([A-Z]{2})\s*(\d{5})?/);
    const state = stateZipMatch?.[1] || '';
    const zip = stateZipMatch?.[2] || '';

    return { street, city, state, zip };
  }

  return { street: address, city: '', state: '', zip: '' };
}

function inferSpecialties(name: string, _types: string[]): string[] {
  const specialties: string[] = [];
  const nameLower = name.toLowerCase();

  if (nameLower.includes('sourdough')) specialties.push('Sourdough');
  if (nameLower.includes('artisan')) specialties.push('Sourdough');
  if (nameLower.includes('french') || nameLower.includes('baguette')) specialties.push('Baguettes');
  if (nameLower.includes('croissant') || nameLower.includes('patisserie')) specialties.push('Croissants');
  if (nameLower.includes('gluten') && nameLower.includes('free')) specialties.push('Gluten-Free');
  if (nameLower.includes('vegan')) specialties.push('Vegan');
  if (nameLower.includes('pastry') || nameLower.includes('pastries')) specialties.push('Pastries');
  if (nameLower.includes('pizza')) specialties.push('Pizza');
  if (nameLower.includes('bagel')) specialties.push('Bagels');

  return specialties;
}

// Common chain bakeries to filter out (looking for local/artisan spots)
const CHAIN_BAKERIES = [
  'Panera',
  'Au Bon Pain',
  'Corner Bakery',
  'La Boulange',
  'Cinnabon',
  "Auntie Anne's",
  'Great American Cookies',
  'Nothing Bundt Cakes',
  'Crumbl',
  'Insomnia Cookies',
  "Dunkin'",
  'Dunkin Donuts',
  'Krispy Kreme',
  'Starbucks',
];

// Clear old cache entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of searchCache.entries()) {
    if (now - value.timestamp > CACHE_DURATION) {
      searchCache.delete(key);
    }
  }
}, CACHE_DURATION);
