'use client';

import { useEffect, useRef } from 'react';
import type { MapAdapterInterface } from '@/lib/map/mapAdapter';

interface School {
  name: string;
  type: string;
  latitude: number;
  longitude: number;
}

interface SchoolLayerProps {
  adapter: MapAdapterInterface | null;
  schools: School[];
  visible: boolean;
}

export function SchoolLayer({ adapter, schools, visible }: SchoolLayerProps) {
  const markerIdsRef = useRef<string[]>([]);

  useEffect(() => {
    if (!adapter) return;

    markerIdsRef.current.forEach((id) => adapter.removeMarker(id));
    markerIdsRef.current = [];

    if (!visible || schools.length === 0) return;

    const ids = schools.map((school) =>
      adapter.addMarker({
        position: { lat: school.latitude, lng: school.longitude },
        title: school.name,
        icon: 'school',
        clickable: true,
        data: { ...school } as unknown as Record<string, unknown>,
      })
    );

    markerIdsRef.current = ids.filter(Boolean);

    return () => {
      markerIdsRef.current.forEach((id) => adapter.removeMarker(id));
      markerIdsRef.current = [];
    };
  }, [adapter, schools, visible]);

  return null;
}
