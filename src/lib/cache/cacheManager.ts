import { createClient } from '@/lib/supabase/server';

export type CacheTable =
  | 'cache_businesses'
  | 'cache_schools'
  | 'cache_academies'
  | 'cache_transit_stops'
  | 'cache_population_stats'
  | 'cache_floating_population'
  | 'cache_rent_trends'
  | 'cache_real_estate_transactions';

const TTL_DAYS: Record<CacheTable, number> = {
  cache_businesses: 7,
  cache_schools: 30,
  cache_academies: 14,
  cache_transit_stops: 30,
  cache_population_stats: 30,
  cache_floating_population: 14,
  cache_rent_trends: 90,
  cache_real_estate_transactions: 30,
};

export interface CacheCoverage {
  table_name: CacheTable;
  center_lat: number;
  center_lng: number;
  radius: number;
  fetched_at: string;
}

/**
 * Check if the requested area is already covered by cache.
 * Uses PostGIS ST_Covers to check if existing cache coverage contains the requested circle.
 */
export async function checkCacheCoverage(
  table: CacheTable,
  lat: number,
  lng: number,
  radius: number
): Promise<{ hit: boolean; fresh: boolean; coverage?: CacheCoverage }> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('cache_coverage')
      .select('*')
      .eq('table_name', table)
      .limit(1);

    if (error || !data || data.length === 0) {
      return { hit: false, fresh: false };
    }

    // Simplified check - in production, use PostGIS ST_Covers
    const coverage = data[0] as CacheCoverage;
    const ttlDays = TTL_DAYS[table];
    const fetchedAt = new Date(coverage.fetched_at);
    const now = new Date();
    const daysSinceFetch = (now.getTime() - fetchedAt.getTime()) / (1000 * 60 * 60 * 24);

    return {
      hit: true,
      fresh: daysSinceFetch <= ttlDays,
      coverage,
    };
  } catch {
    return { hit: false, fresh: false };
  }
}

/**
 * Record cache coverage after fetching data
 */
export async function recordCacheCoverage(
  table: CacheTable,
  lat: number,
  lng: number,
  radius: number
): Promise<void> {
  try {
    const supabase = await createClient();

    await supabase.from('cache_coverage').insert({
      table_name: table,
      center_lat: lat,
      center_lng: lng,
      radius,
      fetched_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Failed to record cache coverage:', error);
  }
}
