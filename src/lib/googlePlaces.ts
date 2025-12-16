/**
 * Google Places API Integration
 * Searches for bakeries near a location and returns normalized results
 */

import type { Bakery } from '../types';

const GOOGLE_PLACES_API_KEY = import.meta.env.VITE_GOOGLE_PLACES_API_KEY || '';

// Check if Google Places is configured
export const isGooglePlacesConfigured = (): boolean => {
  return !!GOOGLE_PLACES_API_KEY && !GOOGLE_PLACES_API_KEY.includes('your-api-key');
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

interface PlaceDetails {
  place_id: string;
  name: string;
  formatted_address?: string;
  formatted_phone_number?: string;
  website?: string;
  url?: string; // Google Maps URL
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  rating?: number;
  user_ratings_total?: number;
  types?: string[];
  opening_hours?: {
    weekday_text?: string[];
  };
  photos?: Array<{
    photo_reference: string;
  }>;
  address_components?: Array<{
    long_name: string;
    short_name: string;
    types: string[];
  }>;
}

interface NearbySearchResponse {
  results: PlaceResult[];
  status: string;
  next_page_token?: string;
  error_message?: string;
}

interface PlaceDetailsResponse {
  result: PlaceDetails;
  status: string;
  error_message?: string;
}

// Cache to avoid duplicate API calls
const searchCache = new Map<string, { results: Bakery[]; timestamp: number }>();
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

/**
 * Search for bakeries near a location using Google Places API
 */
export async function searchNearbyBakeries(
  lat: number,
  lng: number,
  radiusMeters: number = 40000 // Default 25 miles ≈ 40km
): Promise<Bakery[]> {
  if (!isGooglePlacesConfigured()) {
    console.warn('Google Places API not configured');
    return [];
  }

  // Check cache first
  const cacheKey = `${lat.toFixed(3)},${lng.toFixed(3)},${radiusMeters}`;
  const cached = searchCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.results;
  }

  try {
    // Search for bakeries
    const bakeryResults = await nearbySearch(lat, lng, radiusMeters, 'bakery');

    // Also search for "artisan bread" to catch more specialty shops
    const artisanResults = await textSearch(lat, lng, radiusMeters, 'artisan bakery sourdough');

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
 * Get detailed information about a specific place
 */
export async function getPlaceDetails(placeId: string): Promise<Bakery | null> {
  if (!isGooglePlacesConfigured()) {
    return null;
  }

  try {
    const fields = [
      'place_id', 'name', 'formatted_address', 'formatted_phone_number',
      'website', 'geometry', 'rating', 'user_ratings_total', 'types',
      'opening_hours', 'photos', 'address_components'
    ].join(',');

    const url = `https://maps.googleapis.com/maps/api/place/details/json?` +
      `place_id=${placeId}&fields=${fields}&key=${GOOGLE_PLACES_API_KEY}`;

    const response = await fetch(url);
    const data: PlaceDetailsResponse = await response.json();

    if (data.status !== 'OK' || !data.result) {
      console.error('Place details error:', data.status, data.error_message);
      return null;
    }

    return placeDetailsToBakery(data.result);
  } catch (error) {
    console.error('Error fetching place details:', error);
    return null;
  }
}

/**
 * Get a photo URL for a place
 */
export function getPhotoUrl(photoReference: string, maxWidth: number = 400): string {
  if (!isGooglePlacesConfigured() || !photoReference) {
    return '';
  }
  return `https://maps.googleapis.com/maps/api/place/photo?` +
    `maxwidth=${maxWidth}&photo_reference=${photoReference}&key=${GOOGLE_PLACES_API_KEY}`;
}

// --- Internal Functions ---

async function nearbySearch(
  lat: number,
  lng: number,
  radius: number,
  type: string
): Promise<PlaceResult[]> {
  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?` +
    `location=${lat},${lng}&radius=${radius}&type=${type}&key=${GOOGLE_PLACES_API_KEY}`;

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
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?` +
    `query=${encodeURIComponent(query)}&location=${lat},${lng}&radius=${radius}&key=${GOOGLE_PLACES_API_KEY}`;

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

function placeDetailsToBakery(place: PlaceDetails): Bakery {
  const addressParts = parseAddressComponents(place.address_components || []);

  return {
    id: `google_${place.place_id}`,
    name: place.name,
    type: 'bakery',
    description: '',
    specialties: inferSpecialties(place.name, place.types || []),
    rating: place.rating || 0,
    reviewCount: place.user_ratings_total || 0,
    address: addressParts.street,
    city: addressParts.city,
    state: addressParts.state,
    zip: addressParts.zip,
    phone: place.formatted_phone_number,
    website: place.website,
    hours: place.opening_hours?.weekday_text?.join('\n'),
    latitude: place.geometry.location.lat,
    longitude: place.geometry.location.lng,
    verified: false,
    featured: false,
    image: place.photos?.[0] ? getPhotoUrl(place.photos[0].photo_reference) : undefined,
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

function parseAddressComponents(components: PlaceDetails['address_components']): {
  street: string;
  city: string;
  state: string;
  zip: string;
} {
  if (!components) {
    return { street: '', city: '', state: '', zip: '' };
  }

  let streetNumber = '';
  let route = '';
  let city = '';
  let state = '';
  let zip = '';

  for (const component of components) {
    if (component.types.includes('street_number')) {
      streetNumber = component.long_name;
    } else if (component.types.includes('route')) {
      route = component.long_name;
    } else if (component.types.includes('locality')) {
      city = component.long_name;
    } else if (component.types.includes('administrative_area_level_1')) {
      state = component.short_name;
    } else if (component.types.includes('postal_code')) {
      zip = component.long_name;
    }
  }

  return {
    street: [streetNumber, route].filter(Boolean).join(' '),
    city,
    state,
    zip,
  };
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
