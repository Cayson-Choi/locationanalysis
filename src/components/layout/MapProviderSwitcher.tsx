'use client';

import { useTranslations } from 'next-intl';
import { useUIStore } from '@/stores/uiStore';
import { Button } from '@/components/ui/button';
import type { MapProvider } from '@/types/map';

export function MapProviderSwitcher() {
  const t = useTranslations('explore');
  const { mapProvider, setMapProvider } = useUIStore();

  const toggle = () => {
    const next: MapProvider = mapProvider === 'kakao' ? 'naver' : 'kakao';
    setMapProvider(next);
  };

  return (
    <Button variant="outline" size="sm" onClick={toggle} className="text-xs">
      {mapProvider === 'kakao' ? t('naver') : t('kakao')}
    </Button>
  );
}
