'use client';

import { useState, useCallback, useRef } from 'react';
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

export default function ExplorePage() {
  const t = useTranslations('explore');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{ roadAddr: string; jibunAddr: string }>>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [adapter, setAdapter] = useState<MapAdapterInterface | null>(null);
  const { selectedLocation, setSelectedLocation, setCenter, radius, layers } = useMapStore();
  const debouncedQuery = useDebounce(searchQuery, 300);

  // Search address
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

  // Fetch businesses when location changes
  const fetchBusinesses = useCallback(async (lat: number, lng: number, r: number) => {
    try {
      const res = await fetch(`/api/map/businesses?lat=${lat}&lng=${lng}&radius=${r}`);
      const data = await res.json();
      if (data.success) {
        setBusinesses(data.data);
      }
    } catch {
      // Ignore fetch errors
    }
  }, []);

  const handleMapReady = useCallback((mapAdapter: MapAdapterInterface) => {
    setAdapter(mapAdapter);

    mapAdapter.addEventListener('click', (e) => {
      if (e.position) {
        setSelectedLocation(e.position);
        setCenter(e.position);
        fetchBusinesses(e.position.lat, e.position.lng, radius);
      }
    });
  }, [setSelectedLocation, setCenter, fetchBusinesses, radius]);

  const handleAddressSelect = async (address: string) => {
    setSearchQuery(address);
    setSearchResults([]);

    // Geocode the address using Kakao API
    try {
      const res = await fetch(`/api/address/search?keyword=${encodeURIComponent(address)}`);
      // For now, just center the map — actual geocoding needs Kakao/Naver API
    } catch {
      // Ignore
    }
  };

  const handleMyLocation = (lat: number, lng: number) => {
    setCenter({ lat, lng });
    setSelectedLocation({ lat, lng });
    adapter?.setCenter(lat, lng);
    fetchBusinesses(lat, lng, radius);
  };

  // Auto-search when debounced query changes
  if (debouncedQuery.length >= 2) {
    searchAddress(debouncedQuery);
  }

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
                  onClick={() => handleAddressSelect(result.roadAddr)}
                >
                  <p className="font-medium">{result.roadAddr}</p>
                  <p className="text-xs text-muted-foreground">{result.jibunAddr}</p>
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
        visible={layers.businesses}
      />

      {/* Controls */}
      <MapControls onMyLocation={handleMyLocation} />
      <MapLegend />
    </div>
  );
}
