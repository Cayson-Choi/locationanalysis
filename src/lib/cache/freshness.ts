import type { FreshnessLevel } from '@/types/analysis';

const TTL_DAYS: Record<string, number> = {
  businesses: 7,
  schools: 30,
  academies: 14,
  transit: 30,
  population: 30,
  floating_population: 14,
  rent: 90,
  real_estate: 30,
};

/**
 * Calculate data freshness level based on TTL
 */
export function calculateFreshness(
  dataType: string,
  cachedAt: string
): FreshnessLevel {
  const ttl = TTL_DAYS[dataType] ?? 7;
  const fetchedAt = new Date(cachedAt);
  const now = new Date();
  const daysSinceFetch =
    (now.getTime() - fetchedAt.getTime()) / (1000 * 60 * 60 * 24);

  if (daysSinceFetch <= ttl * 0.5) return 'fresh';
  if (daysSinceFetch <= ttl) return 'stale';
  return 'expired';
}

/**
 * Get freshness color
 */
export function getFreshnessColor(level: FreshnessLevel): string {
  switch (level) {
    case 'fresh':
      return '#22C55E';
    case 'stale':
      return '#F59E0B';
    case 'expired':
      return '#EF4444';
  }
}
