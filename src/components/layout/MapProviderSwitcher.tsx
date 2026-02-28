'use client';

import { useTranslations } from 'next-intl';
import { useUIStore } from '@/stores/uiStore';
import { cn } from '@/lib/utils';
import type { MapProvider } from '@/types/map';

const providers: { key: MapProvider; label: string }[] = [
  { key: 'kakao', label: 'kakao' },
  { key: 'naver', label: 'naver' },
];

export function MapProviderSwitcher() {
  const t = useTranslations('explore');
  const { mapProvider, setMapProvider } = useUIStore();

  return (
    <div className="relative flex items-center rounded-full bg-muted p-0.5 text-xs font-medium">
      {/* Sliding indicator */}
      <div
        className={cn(
          'absolute top-0.5 bottom-0.5 rounded-full bg-background shadow-sm transition-all duration-200 ease-in-out',
          mapProvider === 'kakao' ? 'left-0.5 right-1/2' : 'left-1/2 right-0.5'
        )}
      />
      {providers.map(({ key, label }) => (
        <button
          key={key}
          type="button"
          onClick={() => setMapProvider(key)}
          className={cn(
            'relative z-10 rounded-full px-3 py-1.5 transition-colors duration-200',
            mapProvider === key
              ? 'text-foreground'
              : 'text-muted-foreground hover:text-foreground/80'
          )}
        >
          {t(label)}
        </button>
      ))}
    </div>
  );
}
