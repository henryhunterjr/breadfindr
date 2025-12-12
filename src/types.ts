export interface BreadSource {
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
}

export interface SearchFilters {
  query: string;
  type: 'all' | 'bakery' | 'farmers_market' | 'home_baker';
  location: string;
  radius: number;
  sortBy: 'distance' | 'rating' | 'name';
}
