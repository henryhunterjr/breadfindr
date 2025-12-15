export interface Bakery {
  id: string;
  name: string;
  type: 'bakery' | 'farmers_market' | 'home_baker';
  description: string;
  specialties: string[];
  rating: number;
  reviewCount: number;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone?: string;
  website?: string;
  instagram?: string;
  hours?: string;
  image?: string;
  latitude?: number;
  longitude?: number;
  verified: boolean;
  featured: boolean;
  distance?: number; // Calculated client-side
  // Fields for auto-discovered bakeries
  source?: 'manual' | 'google_places' | 'user_submitted';
  googlePlaceId?: string;
}

// Keep BreadSource as alias for backwards compatibility
export type BreadSource = Bakery;

export interface Review {
  id: string;
  bakeryId: string;
  reviewerName: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface SearchFilters {
  query: string;
  type: 'all' | 'bakery' | 'farmers_market' | 'home_baker';
  location: string;
  radius: number;
  sortBy: 'distance' | 'rating' | 'name';
}

export interface UserLocation {
  lat: number;
  lng: number;
  displayName?: string;
}

export type ViewMode = 'grid' | 'list' | 'map';

// Specialty options for the submit form
export const SPECIALTY_OPTIONS = [
  'Sourdough',
  'Whole Grain',
  'Baguettes',
  'Croissants',
  'Focaccia',
  'Rye',
  'Ciabatta',
  'Brioche',
  'Gluten-Free',
  'Vegan',
  'Pastries',
  'Pretzels',
  'Pizza',
  'Seasonal Specials'
] as const;

// US States for the submit form
export const US_STATES = [
  { code: 'AL', name: 'Alabama' },
  { code: 'AK', name: 'Alaska' },
  { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' },
  { code: 'CA', name: 'California' },
  { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' },
  { code: 'DE', name: 'Delaware' },
  { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' },
  { code: 'HI', name: 'Hawaii' },
  { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' },
  { code: 'IN', name: 'Indiana' },
  { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' },
  { code: 'KY', name: 'Kentucky' },
  { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' },
  { code: 'MD', name: 'Maryland' },
  { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' },
  { code: 'MN', name: 'Minnesota' },
  { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' },
  { code: 'MT', name: 'Montana' },
  { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' },
  { code: 'NH', name: 'New Hampshire' },
  { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' },
  { code: 'NY', name: 'New York' },
  { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' },
  { code: 'OH', name: 'Ohio' },
  { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' },
  { code: 'PA', name: 'Pennsylvania' },
  { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' },
  { code: 'SD', name: 'South Dakota' },
  { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' },
  { code: 'UT', name: 'Utah' },
  { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' },
  { code: 'WA', name: 'Washington' },
  { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' },
  { code: 'WY', name: 'Wyoming' },
  { code: 'DC', name: 'District of Columbia' }
] as const;
