import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Bakery, Review } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Check if Supabase is properly configured
export const isSupabaseConfigured = (): boolean => {
  if (!supabaseUrl || !supabaseAnonKey) return false;
  if (supabaseUrl.includes('your-project') || supabaseUrl.includes('your_project')) return false;
  if (supabaseAnonKey.includes('your-anon-key') || supabaseAnonKey.includes('your_anon_key')) return false;
  if (!supabaseUrl.startsWith('https://')) return false;
  return true;
};

// Only create client if properly configured
let supabase: SupabaseClient | null = null;
if (isSupabaseConfigured()) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  } catch (e) {
    console.warn('Failed to initialize Supabase client');
    supabase = null;
  }
}

export { supabase };

// Fetch all approved bakeries
export async function fetchBakeries(): Promise<Bakery[]> {
  if (!supabase) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('bakeries')
      .select('*')
      .eq('approved', true)
      .order('featured', { ascending: false })
      .order('rating', { ascending: false });

    if (error) {
      console.error('Error fetching bakeries:', error);
      return [];
    }

    return data?.map(transformBakery) || [];
  } catch (e) {
    console.error('Error fetching bakeries:', e);
    return [];
  }
}

// Search bakeries by city/state
export async function searchBakeriesByLocation(city: string, state?: string): Promise<Bakery[]> {
  if (!supabase) return [];

  try {
    let query = supabase
      .from('bakeries')
      .select('*')
      .eq('approved', true)
      .ilike('city', `%${city}%`);

    if (state) {
      query = query.ilike('state', `%${state}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error searching bakeries:', error);
      return [];
    }

    return data?.map(transformBakery) || [];
  } catch (e) {
    console.error('Error searching bakeries:', e);
    return [];
  }
}

// Submit a new bakery (pending approval)
export async function submitBakery(bakery: Omit<Bakery, 'id' | 'rating' | 'reviewCount' | 'verified' | 'featured'>): Promise<{ success: boolean; error?: string }> {
  if (!supabase) {
    return { success: false, error: 'Database not configured. Your submission has been noted!' };
  }

  try {
    const { error } = await supabase
      .from('bakeries')
      .insert({
        name: bakery.name,
        type: bakery.type,
        description: bakery.description,
        address: bakery.address,
        city: bakery.city,
        state: bakery.state,
        zip: bakery.zip,
        latitude: bakery.latitude,
        longitude: bakery.longitude,
        phone: bakery.phone,
        website: bakery.website,
        instagram: bakery.instagram,
        hours: bakery.hours,
        image_url: bakery.image,
        specialties: bakery.specialties,
        rating: 0,
        review_count: 0,
        verified: false,
        featured: false,
        approved: false
      });

    if (error) {
      console.error('Error submitting bakery:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (e) {
    console.error('Error submitting bakery:', e);
    return { success: false, error: 'Failed to submit. Please try again.' };
  }
}

// Fetch reviews for a bakery
export async function fetchReviews(bakeryId: string): Promise<Review[]> {
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('bakery_id', bakeryId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching reviews:', error);
      return [];
    }

    return data?.map(r => ({
      id: r.id,
      bakeryId: r.bakery_id,
      reviewerName: r.reviewer_name,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.created_at
    })) || [];
  } catch (e) {
    console.error('Error fetching reviews:', e);
    return [];
  }
}

// Submit a review
export async function submitReview(review: Omit<Review, 'id' | 'createdAt'>): Promise<{ success: boolean; error?: string }> {
  if (!supabase) {
    return { success: false, error: 'Database not configured' };
  }

  try {
    const { error } = await supabase
      .from('reviews')
      .insert({
        bakery_id: review.bakeryId,
        reviewer_name: review.reviewerName,
        rating: review.rating,
        comment: review.comment
      });

    if (error) {
      console.error('Error submitting review:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (e) {
    console.error('Error submitting review:', e);
    return { success: false, error: 'Failed to submit review' };
  }
}

// Save a discovered bakery to the database (pending approval)
export async function saveDiscoveredBakery(bakery: Bakery): Promise<{ success: boolean; error?: string }> {
  if (!supabase) {
    return { success: false, error: 'Database not configured' };
  }

  // Check if this bakery already exists (by google_place_id)
  if (bakery.googlePlaceId) {
    const { data: existing } = await supabase
      .from('bakeries')
      .select('id')
      .eq('google_place_id', bakery.googlePlaceId)
      .single();

    if (existing) {
      return { success: false, error: 'This bakery has already been saved' };
    }
  }

  try {
    const { error } = await supabase
      .from('bakeries')
      .insert({
        name: bakery.name,
        type: bakery.type,
        description: bakery.description || '',
        address: bakery.address,
        city: bakery.city,
        state: bakery.state,
        zip: bakery.zip,
        latitude: bakery.latitude,
        longitude: bakery.longitude,
        phone: bakery.phone,
        website: bakery.website,
        instagram: bakery.instagram,
        hours: bakery.hours,
        image_url: bakery.image,
        specialties: bakery.specialties,
        rating: bakery.rating || 0,
        review_count: bakery.reviewCount || 0,
        verified: false,
        featured: false,
        approved: false, // Pending admin approval
        source: 'google_places',
        google_place_id: bakery.googlePlaceId
      });

    if (error) {
      console.error('Error saving discovered bakery:', error);
      // Handle duplicate key error
      if (error.code === '23505') {
        return { success: false, error: 'This bakery has already been saved' };
      }
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (e) {
    console.error('Error saving discovered bakery:', e);
    return { success: false, error: 'Failed to save bakery' };
  }
}

// Transform database row to Bakery type
function transformBakery(row: any): Bakery {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    description: row.description || '',
    specialties: row.specialties || [],
    rating: row.rating || 0,
    reviewCount: row.review_count || 0,
    address: row.address || '',
    city: row.city,
    state: row.state,
    zip: row.zip || '',
    phone: row.phone,
    website: row.website,
    instagram: row.instagram,
    hours: row.hours,
    image: row.image_url,
    latitude: row.latitude ? parseFloat(row.latitude) : undefined,
    longitude: row.longitude ? parseFloat(row.longitude) : undefined,
    verified: row.verified || false,
    featured: row.featured || false,
    source: row.source || 'manual',
    googlePlaceId: row.google_place_id
  };
}
