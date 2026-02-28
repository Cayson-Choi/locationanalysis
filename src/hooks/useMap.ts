'use client';

import { useRef, useCallback } from 'react';
import type { MapAdapterInterface } from '@/lib/map/mapAdapter';

export function useMap() {
  const adapterRef = useRef<MapAdapterInterface | null>(null);

  const setAdapter = useCallback((adapter: MapAdapterInterface) => {
    adapterRef.current = adapter;
  }, []);

  const getAdapter = useCallback((): MapAdapterInterface | null => {
    return adapterRef.current;
  }, []);

  return { adapterRef, setAdapter, getAdapter };
}
