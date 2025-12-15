-- Migration: Add source tracking for auto-discovered bakeries
-- Run this if you have an existing database

-- Add source column
ALTER TABLE bakeries
ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'manual'
CHECK (source IN ('manual', 'google_places', 'user_submitted'));

-- Add google_place_id column for deduplication
ALTER TABLE bakeries
ADD COLUMN IF NOT EXISTS google_place_id TEXT UNIQUE;

-- Create index for google_place_id lookups
CREATE INDEX IF NOT EXISTS bakeries_google_place_id_idx ON bakeries (google_place_id);

-- Update existing bakeries to have 'manual' source
UPDATE bakeries SET source = 'manual' WHERE source IS NULL;
