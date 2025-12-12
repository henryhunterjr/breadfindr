-- BreadFindr Database Schema
-- Run this in Supabase SQL Editor

-- Bakeries table
CREATE TABLE IF NOT EXISTS bakeries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('bakery', 'farmers_market', 'home_baker')),
  description TEXT,
  address TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  phone TEXT,
  website TEXT,
  instagram TEXT,
  hours TEXT,
  image_url TEXT,
  specialties TEXT[],
  rating DECIMAL(2, 1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  verified BOOLEAN DEFAULT false,
  featured BOOLEAN DEFAULT false,
  approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  bakery_id UUID REFERENCES bakeries(id) ON DELETE CASCADE,
  reviewer_name TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE bakeries ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Public read access for approved bakeries
CREATE POLICY "Public can view approved bakeries" ON bakeries
  FOR SELECT USING (approved = true);

-- Public can submit new bakeries (pending approval)
CREATE POLICY "Anyone can submit bakeries" ON bakeries
  FOR INSERT WITH CHECK (approved = false);

-- Public read access for reviews
CREATE POLICY "Public can view reviews" ON reviews
  FOR SELECT USING (true);

-- Public can submit reviews
CREATE POLICY "Anyone can submit reviews" ON reviews
  FOR INSERT WITH CHECK (true);

-- Create index for location-based queries
CREATE INDEX IF NOT EXISTS bakeries_location_idx ON bakeries (city, state);
CREATE INDEX IF NOT EXISTS bakeries_approved_idx ON bakeries (approved);
CREATE INDEX IF NOT EXISTS reviews_bakery_idx ON reviews (bakery_id);

-- Function to update bakery rating when a review is added
CREATE OR REPLACE FUNCTION update_bakery_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE bakeries
  SET
    rating = (SELECT ROUND(AVG(rating)::numeric, 1) FROM reviews WHERE bakery_id = NEW.bakery_id),
    review_count = (SELECT COUNT(*) FROM reviews WHERE bakery_id = NEW.bakery_id)
  WHERE id = NEW.bakery_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update ratings
DROP TRIGGER IF EXISTS trigger_update_bakery_rating ON reviews;
CREATE TRIGGER trigger_update_bakery_rating
  AFTER INSERT ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_bakery_rating();
