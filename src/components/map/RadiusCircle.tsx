'use client';

import { useEffect, useRef } from 'react';
import type { MapAdapterInterface } from '@/lib/map/mapAdapter';
import { useMapStore } from '@/stores/mapStore';

interface RadiusCircleProps {
  adapter: MapAdapterInterface | null;
}

export function RadiusCircle({ adapter }: RadiusCircleProps) {
  const circleIdRef = useRef<string | null>(null);
  const { selectedLocation, radius } = useMapStore();

  useEffect(() => {
    if (!adapter) return;

    // Remove previous circle
    if (circleIdRef.current) {
      adapter.removeCircle(circleIdRef.current);
      circleIdRef.current = null;
    }

    // Add new circle if location is selected
    if (selectedLocation) {
      circleIdRef.current = adapter.addCircle({
        center: selectedLocation,
        radius,
        strokeColor: '#3B82F6',
        strokeWeight: 2,
        fillColor: '#3B82F6',
        fillOpacity: 0.08,
      });
    }

    return () => {
      if (circleIdRef.current && adapter) {
        adapter.removeCircle(circleIdRef.current);
      }
    };
  }, [adapter, selectedLocation, radius]);

  return null;
}
