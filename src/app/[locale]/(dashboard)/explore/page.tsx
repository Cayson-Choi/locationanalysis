'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { MapContainer } from '@/components/map/MapContainer';
import { MapControls } from '@/components/map/MapControls';
import { MapLegend } from '@/components/map/MapLegend';
import { RadiusCircle } from '@/components/map/RadiusCircle';
import { BusinessMarkers } from '@/components/map/BusinessMarkers';
import { useMapStore } from '@/stores/mapStore';
import { useDebounce } from '@/hooks/useDebounce';
import type { MapAdapterInterface } from '@/lib/map/mapAdapter';
import type { Business } from '@/types/business';

interface SearchResult {
  roadAddr: string;
  jibunAddr: string;
  placeName?: string;
  lat: number;
  lng: number;
  category?: string;
}

export default function ExplorePage() {
  const t = useTranslations('explore');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [adapter, setAdapter] = useState<MapAdapterInterface | null>(null);
  const { selectedLocation, setSelectedLocation, setCenter, radius, enabledCategories } = useMapStore();
  const debouncedQuery = useDebounce(searchQuery, 300);
  const skipSearchRef = useRef(false);

  // Search address via Kakao API
  const searchAddress = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    try {
      const res = await fetch(`/api/address/search?keyword=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data.success) {
        setSearchResults(data.data);
      }
    } catch {
      // Ignore search errors
    }
  }, []);

  // Auto-search when debounced query changes
  useEffect(() => {
    if (skipSearchRef.current) {
      skipSearchRef.current = false;
      return;
    }
    if (debouncedQuery.length >= 2) {
      searchAddress(debouncedQuery);
    } else {
      setSearchResults([]);
    }
  }, [debouncedQuery, searchAddress]);

  // Single effect: fetch businesses whenever location, radius, or categories change
  useEffect(() => {
    if (!selectedLocation || enabledCategories.length === 0) {
      setBusinesses([]);
      return;
    }

    let cancelled = false;
    const { lat, lng } = selectedLocation;
    const cats = enabledCategories.join(',');

    (async () => {
      try {
        const res = await fetch(`/api/map/businesses?lat=${lat}&lng=${lng}&radius=${radius}&categories=${cats}`);
        const data = await res.json();
        if (!cancelled && data.success) {
          setBusinesses(data.data);
        }
      } catch {
        // Ignore fetch errors
      }
    })();

    return () => { cancelled = true; };
  }, [selectedLocation, radius, enabledCategories]);

  const handleMapReady = useCallback((mapAdapter: MapAdapterInterface) => {
    setAdapter(mapAdapter);

    mapAdapter.addEventListener('click', (e) => {
      if (e.position) {
        const store = useMapStore.getState();
        store.setSelectedLocation(e.position);
        store.setCenter(e.position);
      }
    });
  }, []);

  const handleAddressSelect = (result: SearchResult) => {
    skipSearchRef.current = true;
    setSearchQuery(result.placeName || result.roadAddr);
    setSearchResults([]);

    const pos = { lat: result.lat, lng: result.lng };
    setCenter(pos);
    setSelectedLocation(pos);
    adapter?.setCenter(result.lat, result.lng);
  };

  const handleMyLocation = (lat: number, lng: number) => {
    setCenter({ lat, lng });
    setSelectedLocation({ lat, lng });
    adapter?.setCenter(lat, lng);
  };

  return (
    <div className="relative -mx-4 -my-4 sm:-mx-6 lg:-mx-8 h-[calc(100dvh-3.5rem-4rem)] xl:h-[calc(100dvh-3.5rem)]">
      {/* Search Bar */}
      <div className="absolute top-3 left-3 right-14 z-30 xl:left-3 xl:right-auto xl:w-80">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-10 bg-background/95 backdrop-blur shadow-lg"
            placeholder={t('searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 rounded-lg border bg-background shadow-lg max-h-60 overflow-y-auto">
              {searchResults.map((result, i) => (
                <button
                  key={i}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-muted transition-colors"
                  onClick={() => handleAddressSelect(result)}
                >
                  {result.placeName && (
                    <p className="font-medium">{result.placeName}</p>
                  )}
                  <p className={result.placeName ? 'text-xs text-muted-foreground' : 'font-medium'}>
                    {result.roadAddr}
                  </p>
                  {result.roadAddr !== result.jibunAddr && (
                    <p className="text-xs text-muted-foreground">{result.jibunAddr}</p>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Map */}
      <MapContainer onMapReady={handleMapReady} className="h-full" />

      {/* Overlays */}
      <RadiusCircle adapter={adapter} />
      <BusinessMarkers
        adapter={adapter}
        businesses={businesses}
        visible={enabledCategories.length > 0}
      />

      {/* Controls */}
      <MapControls onMyLocation={handleMyLocation} />
      <MapLegend visible={businesses.length > 0} />
    </div>
  );
}
