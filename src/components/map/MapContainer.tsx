'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
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

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.head.appendChild(script);
  });
}

function isKakaoReady(): boolean {
  return !!(window.kakao?.maps?.Map);
}

function isNaverReady(): boolean {
  return !!(window.naver?.maps?.Map);
}

export function MapContainer({ onMapReady, className = '' }: MapContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const adapterRef = useRef<MapAdapterInterface | null>(null);
  const { mapProvider } = useUIStore();
  const { center, zoom } = useMapStore();
  const [isReady, setIsReady] = useState(false);
  const prevProviderRef = useRef<MapProvider>(mapProvider);

  const kakaoKey = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY;
  const naverKey = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID;
  const hasKey = (mapProvider === 'kakao' && !!kakaoKey) || (mapProvider === 'naver' && !!naverKey);

  // Reset when provider changes
  useEffect(() => {
    if (prevProviderRef.current !== mapProvider) {
      prevProviderRef.current = mapProvider;
      if (adapterRef.current) {
        adapterRef.current.destroy();
        adapterRef.current = null;
      }
      setIsReady(false);
    }
  }, [mapProvider]);

  const initializeMap = useCallback((providerToInit: MapProvider) => {
    if (!containerRef.current || adapterRef.current) return;

    const adapter =
      providerToInit === 'kakao' ? new KakaoMapAdapter() : new NaverMapAdapter();

    adapter.initialize(containerRef.current, { center, zoom });
    adapterRef.current = adapter;
    setIsReady(true);
    onMapReady?.(adapter);
  }, [center, zoom, onMapReady]);

  // Load SDK and initialize map
  useEffect(() => {
    if (!hasKey) return;

    let cancelled = false;

    const loadAndInit = async () => {
      try {
        if (mapProvider === 'kakao' && kakaoKey) {
          if (isKakaoReady()) {
            if (!cancelled) initializeMap('kakao');
            return;
          }
          await loadScript(`//dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoKey}&autoload=false&libraries=services,clusterer`);
          if (cancelled) return;
          if (window.kakao?.maps) {
            window.kakao.maps.load(() => {
              if (!cancelled) initializeMap('kakao');
            });
          }
        } else if (mapProvider === 'naver' && naverKey) {
          if (isNaverReady()) {
            if (!cancelled) initializeMap('naver');
            return;
          }
          await loadScript(`https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${naverKey}`);
          if (cancelled) return;
          if (isNaverReady()) {
            initializeMap('naver');
          }
        }
      } catch {
        // Script load failed
      }
    };

    loadAndInit();

    return () => {
      cancelled = true;
    };
  }, [mapProvider, kakaoKey, naverKey, hasKey, initializeMap]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      adapterRef.current?.destroy();
    };
  }, []);

  return (
    <div className={`relative w-full h-full ${className}`}>
      <div ref={containerRef} className="w-full h-full" />

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
