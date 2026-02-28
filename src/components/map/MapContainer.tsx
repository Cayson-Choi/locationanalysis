'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import Script from 'next/script';
import { useUIStore } from '@/stores/uiStore';
import { useMapStore } from '@/stores/mapStore';
import { KakaoMapAdapter } from '@/lib/map/kakaoAdapter';
import { NaverMapAdapter } from '@/lib/map/naverAdapter';
import type { MapAdapterInterface } from '@/lib/map/mapAdapter';
import type { MapProvider } from '@/types/map';
import { Skeleton } from '@/components/ui/skeleton';

interface MapContainerProps {
  onMapReady?: (adapter: MapAdapterInterface) => void;
  className?: string;
}

export function MapContainer({ onMapReady, className = '' }: MapContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const adapterRef = useRef<MapAdapterInterface | null>(null);
  const { mapProvider } = useUIStore();
  const { center, zoom } = useMapStore();
  const [sdkLoaded, setSdkLoaded] = useState<MapProvider | null>(null);
  const [isReady, setIsReady] = useState(false);

  const initializeMap = useCallback(() => {
    if (!containerRef.current) return;

    // Destroy previous adapter if provider changed
    if (adapterRef.current) {
      const currentCenter = adapterRef.current.getCenter();
      const currentZoom = adapterRef.current.getZoom();
      adapterRef.current.destroy();

      // Use previous center/zoom for continuity
      const adapter =
        mapProvider === 'kakao' ? new KakaoMapAdapter() : new NaverMapAdapter();

      adapter.initialize(containerRef.current, {
        center: currentCenter,
        zoom: currentZoom,
      });

      adapterRef.current = adapter;
      setIsReady(true);
      onMapReady?.(adapter);
      return;
    }

    const adapter =
      mapProvider === 'kakao' ? new KakaoMapAdapter() : new NaverMapAdapter();

    adapter.initialize(containerRef.current, { center, zoom });
    adapterRef.current = adapter;
    setIsReady(true);
    onMapReady?.(adapter);
  }, [mapProvider, center, zoom, onMapReady]);

  useEffect(() => {
    if (sdkLoaded === mapProvider) {
      initializeMap();
    }
  }, [sdkLoaded, mapProvider, initializeMap]);

  useEffect(() => {
    return () => {
      adapterRef.current?.destroy();
    };
  }, []);

  const handleSdkLoad = useCallback(() => {
    if (mapProvider === 'kakao' && window.kakao?.maps) {
      window.kakao.maps.load(() => {
        setSdkLoaded('kakao');
      });
    } else if (mapProvider === 'naver' && window.naver?.maps) {
      setSdkLoaded('naver');
    }
  }, [mapProvider]);

  // Check if SDK is already loaded (e.g., client-side navigation)
  useEffect(() => {
    if (sdkLoaded === mapProvider) return;
    if (mapProvider === 'kakao' && window.kakao?.maps) {
      window.kakao.maps.load(() => {
        setSdkLoaded('kakao');
      });
    } else if (mapProvider === 'naver' && window.naver?.maps) {
      setSdkLoaded('naver');
    }
  }, [mapProvider, sdkLoaded]);

  const kakaoKey = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY;
  const naverKey = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID;
  const hasKey = (mapProvider === 'kakao' && !!kakaoKey) || (mapProvider === 'naver' && !!naverKey);

  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* Load map SDKs */}
      {mapProvider === 'kakao' && kakaoKey && (
        <Script
          src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoKey}&autoload=false&libraries=services,clusterer`}
          strategy="afterInteractive"
          onLoad={handleSdkLoad}
        />
      )}
      {mapProvider === 'naver' && naverKey && (
        <Script
          src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${naverKey}`}
          strategy="afterInteractive"
          onLoad={handleSdkLoad}
        />
      )}

      {/* Map container */}
      <div ref={containerRef} className="w-full h-full" />

      {/* No API key configured */}
      {!hasKey && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/80">
          <div className="text-center space-y-3 max-w-sm px-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z"/><path d="M15 5.764v15"/><path d="M9 3.236v15"/></svg>
            </div>
            <p className="font-semibold">지도 API 키가 설정되지 않았습니다</p>
            <p className="text-sm text-muted-foreground">
              .env 파일에 {mapProvider === 'kakao' ? 'NEXT_PUBLIC_KAKAO_MAP_KEY' : 'NEXT_PUBLIC_NAVER_MAP_CLIENT_ID'}를 설정해주세요.
            </p>
          </div>
        </div>
      )}

      {/* Loading state (only when key exists but SDK not yet loaded) */}
      {hasKey && !isReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <div className="text-center space-y-2">
            <Skeleton className="h-8 w-32 mx-auto" />
            <p className="text-sm text-muted-foreground">지도 로딩 중...</p>
          </div>
        </div>
      )}
    </div>
  );
}
