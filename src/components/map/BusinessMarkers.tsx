'use client';

import { useEffect, useRef } from 'react';
import type { MapAdapterInterface } from '@/lib/map/mapAdapter';
import type { Business } from '@/types/business';
import { INDUSTRY_COLORS } from '@/lib/utils/constants';

interface BusinessMarkersProps {
  adapter: MapAdapterInterface | null;
  businesses: Business[];
  visible: boolean;
  onMarkerClick?: (business: Business) => void;
}

export function BusinessMarkers({
  adapter,
  businesses,
  visible,
  onMarkerClick,
}: BusinessMarkersProps) {
  const markerIdsRef = useRef<string[]>([]);

  useEffect(() => {
    if (!adapter) return;

    // Clear existing markers
    markerIdsRef.current.forEach((id) => adapter.removeMarker(id));
    markerIdsRef.current = [];

    if (!visible || businesses.length === 0) return;

    // Add new markers
    const ids = businesses.map((biz) => {
      const color = INDUSTRY_COLORS[biz.large_category] ?? INDUSTRY_COLORS['기타'];
      return adapter.addMarker({
        position: { lat: biz.latitude, lng: biz.longitude },
        title: biz.name,
        color,
        clickable: true,
        data: biz as unknown as Record<string, unknown>,
      });
    });

    markerIdsRef.current = ids.filter(Boolean);

    // Enable clustering if many markers
    if (markerIdsRef.current.length > 50) {
      adapter.addClusterer(markerIdsRef.current);
    }

    return () => {
      markerIdsRef.current.forEach((id) => adapter.removeMarker(id));
      markerIdsRef.current = [];
      adapter.removeClusterer();
    };
  }, [adapter, businesses, visible]);

  return null;
}
