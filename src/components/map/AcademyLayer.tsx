'use client';

import { useEffect, useRef } from 'react';
import type { MapAdapterInterface } from '@/lib/map/mapAdapter';

interface Academy {
  name: string;
  subject: string;
  latitude: number;
  longitude: number;
}

interface AcademyLayerProps {
  adapter: MapAdapterInterface | null;
  academies: Academy[];
  visible: boolean;
}

export function AcademyLayer({ adapter, academies, visible }: AcademyLayerProps) {
  const markerIdsRef = useRef<string[]>([]);

  useEffect(() => {
    if (!adapter) return;

    markerIdsRef.current.forEach((id) => adapter.removeMarker(id));
    markerIdsRef.current = [];

    if (!visible || academies.length === 0) return;

    const ids = academies.map((academy) =>
      adapter.addMarker({
        position: { lat: academy.latitude, lng: academy.longitude },
        title: academy.name,
        icon: 'academy',
        clickable: true,
        data: { ...academy } as unknown as Record<string, unknown>,
      })
    );

    markerIdsRef.current = ids.filter(Boolean);

    return () => {
      markerIdsRef.current.forEach((id) => adapter.removeMarker(id));
      markerIdsRef.current = [];
    };
  }, [adapter, academies, visible]);

  return null;
}
