-- Analytics Events Table for BreadFindr Dashboard
-- This table stores all user interaction events for analytics and monetization insights

CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Event details
  event VARCHAR(50) NOT NULL,
  page VARCHAR(255),

  -- Bakery-related data
  bakery_id UUID REFERENCES bakeries(id) ON DELETE SET NULL,
  bakery_name VARCHAR(255),

  -- Search-related data
  search_query VARCHAR(255),
  search_location VARCHAR(255),

  -- Filter/action data
  filter_type VARCHAR(50),
  filter_value VARCHAR(255),
  link_url TEXT,

  -- Additional metadata (JSON for flexibility)
  metadata JSONB DEFAULT '{}',

  -- Session/device info
  session_id VARCHAR(100) NOT NULL,
  user_agent TEXT,
  referrer TEXT,
  screen_width INTEGER,
  screen_height INTEGER
);

-- Indexes for common queries
CREATE INDEX idx_analytics_created_at ON analytics_events(created_at DESC);
CREATE INDEX idx_analytics_event ON analytics_events(event);
CREATE INDEX idx_analytics_session ON analytics_events(session_id);
CREATE INDEX idx_analytics_bakery ON analytics_events(bakery_id);
CREATE INDEX idx_analytics_search_location ON analytics_events(search_location);

-- Composite index for date range queries by event type
CREATE INDEX idx_analytics_event_date ON analytics_events(event, created_at DESC);

-- Enable Row Level Security
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert events (for tracking)
CREATE POLICY "Allow anonymous event insertion" ON analytics_events
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Policy: Only authenticated users can read events (for dashboard)
CREATE POLICY "Allow authenticated read" ON analytics_events
  FOR SELECT TO authenticated
  USING (true);

-- Create a materialized view for daily stats (for performance)
CREATE MATERIALIZED VIEW IF NOT EXISTS analytics_daily_stats AS
SELECT
  DATE(created_at) as date,
  event,
  COUNT(*) as count,
  COUNT(DISTINCT session_id) as unique_sessions
FROM analytics_events
GROUP BY DATE(created_at), event
ORDER BY date DESC, count DESC;

-- Index on the materialized view
CREATE UNIQUE INDEX idx_daily_stats_date_event ON analytics_daily_stats(date, event);

-- Function to refresh the materialized view (call periodically)
CREATE OR REPLACE FUNCTION refresh_analytics_stats()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY analytics_daily_stats;
END;
$$ LANGUAGE plpgsql;

-- Comment for documentation
COMMENT ON TABLE analytics_events IS 'Stores all user interaction events for the BreadFindr analytics dashboard';
COMMENT ON COLUMN analytics_events.event IS 'Event type: page_view, search, bakery_view, bakery_click, filter_change, location_search, near_me_click, submit_bakery, newsletter_signup, external_link_click, map_interaction, featured_bakery_click, blog_suggestion_click';
