-- ==============================================================================
-- KHOJ MUMBAI: Production PostgreSQL + PostGIS Schema
-- Free Tier Compatible on Supabase (ap-south-1 / Mumbai Region)
-- ==============================================================================

-- 1. Enable PostGIS for ultra-fast spatial search (within radius, bounding box)
CREATE EXTENSION IF NOT EXISTS postgis;

-- 2. Places Table (Exact mapping to Khoj Mumbai Spots)
CREATE TABLE IF NOT EXISTS places (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  short_name TEXT,
  category TEXT NOT NULL,
  subcategory TEXT,
  spot_tier TEXT NOT NULL DEFAULT 'underrated',
  city TEXT NOT NULL DEFAULT 'Mumbai',
  neighborhood TEXT,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  access_type TEXT DEFAULT 'public',
  safety_level TEXT DEFAULT 'high',
  safety_notes TEXT,
  hiddenness_score NUMERIC(4, 2) DEFAULT 0.8,
  vibe_score NUMERIC(4, 2) DEFAULT 0.9,
  safety_score NUMERIC(4, 2) DEFAULT 0.85,
  accessibility_score NUMERIC(4, 2) DEFAULT 0.8,
  crowd_level INTEGER DEFAULT 2,
  best_time_to_visit TEXT,
  description TEXT,
  vibe_tags TEXT[] DEFAULT '{}',
  photo_url TEXT,
  source TEXT DEFAULT 'curated',
  budget_tier TEXT DEFAULT 'pocket_friendly',
  approx_cost TEXT,
  price_level INTEGER DEFAULT 1,
  
  -- Auto-computed PostGIS geometry coordinate (WGS84 4326)
  geom GEOMETRY(Point, 4326) GENERATED ALWAYS AS (ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)) STORED,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. High-Performance Indexes
-- Spatial GIST index: enables 2ms radius queries and viewport bounding-box queries
CREATE INDEX IF NOT EXISTS idx_places_geom ON places USING GIST (geom);

-- B-Tree indexes for fast filter studio queries
CREATE INDEX IF NOT EXISTS idx_places_category ON places (category);
CREATE INDEX IF NOT EXISTS idx_places_spot_tier ON places (spot_tier);
CREATE INDEX IF NOT EXISTS idx_places_budget_tier ON places (budget_tier);
CREATE INDEX IF NOT EXISTS idx_places_city ON places (city);

-- 4. Enable Row Level Security (RLS) - Public Read, Admin Write
ALTER TABLE places ENABLE ROW LEVEL SECURITY;

-- Allow anonymous visitors & app users to read all places
CREATE POLICY "Public places are viewable by everyone" 
  ON places FOR SELECT 
  USING (true);

-- ==============================================================================
-- 5. Helper Function: Find Places Within Radius (Direct Spatial Calculation in SQL)
-- ==============================================================================
CREATE OR REPLACE FUNCTION get_places_within_radius(
  user_lat DOUBLE PRECISION,
  user_lng DOUBLE PRECISION,
  radius_meters DOUBLE PRECISION
)
RETURNS SETOF places
LANGUAGE sql
STABLE
AS $$
  SELECT *
  FROM places
  WHERE ST_DWithin(
    geom::geography,
    ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography,
    radius_meters
  )
  ORDER BY ST_Distance(
    geom::geography,
    ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography
  ) ASC;
-- 6. Youth Malls & Fast Food Hub Columns
ALTER TABLE places ADD COLUMN IF NOT EXISTS hub_type TEXT;
ALTER TABLE places ADD COLUMN IF NOT EXISTS outlets JSONB;
ALTER TABLE places ADD COLUMN IF NOT EXISTS total_outlets_count INTEGER;
ALTER TABLE places ADD COLUMN IF NOT EXISTS more_outlets_text TEXT;
ALTER TABLE places ADD COLUMN IF NOT EXISTS more_outlets_url TEXT;
ALTER TABLE places ADD COLUMN IF NOT EXISTS entertainment TEXT[];
ALTER TABLE places ADD COLUMN IF NOT EXISTS amenities JSONB;

-- 7. Provenance & OpenStreetMap Ingestion Columns
ALTER TABLE places ADD COLUMN IF NOT EXISTS osm_id TEXT;
ALTER TABLE places ADD COLUMN IF NOT EXISTS osm_type TEXT;
ALTER TABLE places ADD COLUMN IF NOT EXISTS source_url TEXT;
ALTER TABLE places ADD COLUMN IF NOT EXISTS imported_at TIMESTAMPTZ;
ALTER TABLE places ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'curated';
ALTER TABLE places ADD COLUMN IF NOT EXISTS possible_duplicate_of TEXT;



