-- Cache tables for external API data

-- Business cache (소상공인진흥공단)
CREATE TABLE IF NOT EXISTS public.cache_businesses (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  branch_name TEXT,
  large_category TEXT NOT NULL,
  medium_category TEXT,
  small_category TEXT,
  address_road TEXT,
  address_jibun TEXT,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  location GEOMETRY(Point, 4326),
  floor TEXT,
  phone TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  fetched_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- School cache (NEIS)
CREATE TABLE IF NOT EXISTS public.cache_schools (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- elementary, middle, high
  address TEXT,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  location GEOMETRY(Point, 4326),
  student_count INTEGER,
  established_year INTEGER,
  fetched_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Academy cache
CREATE TABLE IF NOT EXISTS public.cache_academies (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  subject TEXT,
  address TEXT,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  location GEOMETRY(Point, 4326),
  capacity INTEGER,
  status TEXT,
  fetched_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Transit stops cache (TAGO)
CREATE TABLE IF NOT EXISTS public.cache_transit_stops (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- bus, subway
  node_id TEXT,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  location GEOMETRY(Point, 4326),
  lines JSONB,
  fetched_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Population statistics cache (SGIS/KOSIS)
CREATE TABLE IF NOT EXISTS public.cache_population_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  region_code TEXT NOT NULL,
  region_name TEXT NOT NULL,
  region_geom GEOMETRY(Polygon, 4326),
  total_population INTEGER,
  male_population INTEGER,
  female_population INTEGER,
  age_distribution JSONB,
  household_count INTEGER,
  population_density DOUBLE PRECISION,
  fetched_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Floating population cache
CREATE TABLE IF NOT EXISTS public.cache_floating_population (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  region_code TEXT NOT NULL,
  region_name TEXT NOT NULL,
  date DATE NOT NULL,
  hour INTEGER,
  population_count INTEGER,
  fetched_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Rent trends cache (한국부동산원)
CREATE TABLE IF NOT EXISTS public.cache_rent_trends (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  region_code TEXT NOT NULL,
  region_name TEXT NOT NULL,
  period TEXT NOT NULL,
  rent_per_sqm DOUBLE PRECISION,
  vacancy_rate DOUBLE PRECISION,
  yield_rate DOUBLE PRECISION,
  fetched_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Real estate transactions cache (국토부)
CREATE TABLE IF NOT EXISTS public.cache_real_estate_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  transaction_type TEXT NOT NULL, -- sale, rent
  property_type TEXT NOT NULL, -- apartment, commercial
  address TEXT NOT NULL,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  location GEOMETRY(Point, 4326),
  area_sqm DOUBLE PRECISION,
  price BIGINT,
  floor INTEGER,
  build_year INTEGER,
  transaction_date DATE,
  fetched_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Cache coverage tracking
CREATE TABLE IF NOT EXISTS public.cache_coverage (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  table_name TEXT NOT NULL,
  center_lat DOUBLE PRECISION NOT NULL,
  center_lng DOUBLE PRECISION NOT NULL,
  radius INTEGER NOT NULL,
  covered_area GEOMETRY(Polygon, 4326),
  fetched_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- API request log
CREATE TABLE IF NOT EXISTS public.api_request_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  api_name TEXT NOT NULL,
  endpoint TEXT NOT NULL,
  params JSONB,
  response_status INTEGER,
  response_time_ms INTEGER,
  error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- GIST spatial indexes
CREATE INDEX IF NOT EXISTS idx_cache_businesses_location ON public.cache_businesses USING GIST(location);
CREATE INDEX IF NOT EXISTS idx_cache_schools_location ON public.cache_schools USING GIST(location);
CREATE INDEX IF NOT EXISTS idx_cache_academies_location ON public.cache_academies USING GIST(location);
CREATE INDEX IF NOT EXISTS idx_cache_transit_stops_location ON public.cache_transit_stops USING GIST(location);
CREATE INDEX IF NOT EXISTS idx_cache_population_region ON public.cache_population_stats USING GIST(region_geom);
CREATE INDEX IF NOT EXISTS idx_cache_real_estate_location ON public.cache_real_estate_transactions USING GIST(location);
CREATE INDEX IF NOT EXISTS idx_cache_coverage_area ON public.cache_coverage USING GIST(covered_area);

-- Regular indexes
CREATE INDEX IF NOT EXISTS idx_cache_businesses_category ON public.cache_businesses(large_category);
CREATE INDEX IF NOT EXISTS idx_cache_coverage_table ON public.cache_coverage(table_name);
CREATE INDEX IF NOT EXISTS idx_api_request_log_api ON public.api_request_log(api_name, created_at DESC);
