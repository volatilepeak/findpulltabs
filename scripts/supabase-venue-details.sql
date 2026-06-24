-- =============================================
-- RUN THIS IN YOUR SUPABASE SQL EDITOR
-- Creates venue_details table for Google ratings/photos
-- =============================================

CREATE TABLE IF NOT EXISTS venue_details (
  id SERIAL PRIMARY KEY,
  state_key TEXT NOT NULL,
  city_slug TEXT NOT NULL,
  venue_slug TEXT NOT NULL,
  venue_name TEXT NOT NULL,
  rating DECIMAL(2,1),
  review_count INTEGER DEFAULT 0,
  photo_url TEXT,
  google_place_id TEXT,
  fetched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(state_key, city_slug, venue_slug)
);

ALTER TABLE venue_details ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read venue details" ON venue_details FOR SELECT USING (true);

CREATE INDEX idx_venue_details_lookup ON venue_details(state_key, city_slug, venue_slug);
