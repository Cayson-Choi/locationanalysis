'use client';

import { useEffect, useRef } from 'react';
import type { MapAdapterInterface } from '@/lib/map/mapAdapter';

interface TransitStop {
  name: string;
  type: 'bus' | 'subway';
  latitude: number;
  longitude: number;
}

interface TransportLayerProps {
  adapter: MapAdapterInterface | null;
  stops: TransitStop[];
  visible: boolean;
}

export function TransportLayer({ adapter, stops, visible }: TransportLayerProps) {
  const markerIdsRef = useRef<string[]>([]);

  useEffect(() => {
    if (!adapter) return;

    markerIdsRef.current.forEach((id) => adapter.removeMarker(id));
    markerIdsRef.current = [];

    if (!visible || stops.length === 0) return;

    const ids = stops.map((stop) =>
      adapter.addMarker({
        position: { lat: stop.latitude, lng: stop.longitude },
        title: stop.name,
        icon: stop.type,
        clickable: true,
        data: { ...stop } as unknown as Record<string, unknown>,
      })
    );

    markerIdsRef.current = ids.filter(Boolean);

    return () => {
      markerIdsRef.current.forEach((id) => adapter.removeMarker(id));
      markerIdsRef.current = [];
    };
  }, [adapter, stops, visible]);

  return null;
}
