'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { useMapStore } from '@/stores/mapStore';
import { KakaoMapAdapter } from '@/lib/map/kakaoAdapter';
import type { MapAdapterInterface } from '@/lib/map/mapAdapter';
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

export function MapContainer({ onMapReady, className = '' }: MapContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const adapterRef = useRef<MapAdapterInterface | null>(null);
  const { center, zoom } = useMapStore();
  const [isReady, setIsReady] = useState(false);

  const kakaoKey = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY;

  const initializeMap = useCallback(() => {
    if (!containerRef.current || adapterRef.current) return;

    const adapter = new KakaoMapAdapter();
    adapter.initialize(containerRef.current, { center, zoom });
    adapterRef.current = adapter;
    setIsReady(true);
    onMapReady?.(adapter);
  }, [center, zoom, onMapReady]);

  // Load Kakao SDK and initialize map
  useEffect(() => {
    if (!kakaoKey) return;

    let cancelled = false;

    const loadAndInit = async () => {
      try {
        if (isKakaoReady()) {
          if (!cancelled) initializeMap();
          return;
        }
        await loadScript(`//dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoKey}&autoload=false&libraries=services,clusterer`);
        if (cancelled) return;
        if (window.kakao?.maps) {
          window.kakao.maps.load(() => {
            if (!cancelled) initializeMap();
          });
        }
      } catch {
        // Script load failed
      }
    };

    loadAndInit();

    return () => {
      cancelled = true;
    };
  }, [kakaoKey, initializeMap]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      adapterRef.current?.destroy();
    };
  }, []);

  return (
    <div className={`relative w-full h-full ${className}`}>
      <div ref={containerRef} className="w-full h-full" />

      {!kakaoKey && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/80">
          <div className="text-center space-y-3 max-w-sm px-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z"/><path d="M15 5.764v15"/><path d="M9 3.236v15"/></svg>
            </div>
            <p className="font-semibold">지도 API 키가 설정되지 않았습니다</p>
            <p className="text-sm text-muted-foreground">
              .env 파일에 NEXT_PUBLIC_KAKAO_MAP_KEY를 설정해주세요.
            </p>
          </div>
        </div>
      )}

      {kakaoKey && !isReady && (
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
