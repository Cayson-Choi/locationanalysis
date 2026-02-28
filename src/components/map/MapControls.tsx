'use client';

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Locate, Layers, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useMapStore } from '@/stores/mapStore';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { MIN_RADIUS, MAX_RADIUS, RADIUS_STEP, CATEGORY_INFO } from '@/lib/utils/constants';

interface MapControlsProps {
  onMyLocation?: (lat: number, lng: number) => void;
}

const allCategories = Object.entries(CATEGORY_INFO);

export function MapControls({ onMyLocation }: MapControlsProps) {
  const t = useTranslations('explore');
  const isMobile = useIsMobile();
  const { getCurrentPosition, lat, lng, loading } = useGeolocation();
  const { radius, setRadius, enabledCategories, toggleCategory } = useMapStore();
  const pendingLocationRef = useRef(false);

  useEffect(() => {
    if (pendingLocationRef.current && lat && lng) {
      pendingLocationRef.current = false;
      onMyLocation?.(lat, lng);
    }
  }, [lat, lng, onMyLocation]);

  const handleMyLocation = () => {
    pendingLocationRef.current = true;
    getCurrentPosition();
    if (lat && lng) {
      pendingLocationRef.current = false;
      onMyLocation?.(lat, lng);
    }
  };

  const CategoryToggles = () => (
    <div className="grid grid-cols-2 gap-1.5">
      {allCategories.map(([code, { label, color }]) => {
        const enabled = enabledCategories.includes(code);
        return (
          <button
            key={code}
            type="button"
            onClick={() => toggleCategory(code)}
            className={`flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs transition-colors ${
              enabled
                ? 'bg-accent text-accent-foreground'
                : 'text-muted-foreground hover:bg-muted'
            }`}
          >
            <div
              className="h-3 w-3 rounded-full border-2 flex-shrink-0"
              style={{
                backgroundColor: enabled ? color : 'transparent',
                borderColor: color,
              }}
            />
            {label}
          </button>
        );
      })}
    </div>
  );

  if (isMobile) {
    return (
      <div className="absolute bottom-20 right-3 z-30 flex flex-col gap-2">
        <Button
          size="icon"
          variant="secondary"
          className="h-11 w-11 rounded-full shadow-lg"
          onClick={handleMyLocation}
          disabled={loading}
        >
          <Locate className="h-5 w-5" />
        </Button>

        {/* Categories Sheet */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              size="icon"
              variant="secondary"
              className="h-11 w-11 rounded-full shadow-lg"
            >
              <Layers className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="rounded-t-2xl">
            <SheetHeader>
              <SheetTitle>{t('layers')}</SheetTitle>
            </SheetHeader>
            <div className="py-4">
              <CategoryToggles />
            </div>
          </SheetContent>
        </Sheet>

        {/* Radius Sheet */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              size="icon"
              variant="secondary"
              className="h-11 w-11 rounded-full shadow-lg"
            >
              <SlidersHorizontal className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="rounded-t-2xl">
            <SheetHeader>
              <SheetTitle>{t('radius')}: {radius}m</SheetTitle>
            </SheetHeader>
            <div className="py-4">
              <input
                type="range"
                min={MIN_RADIUS}
                max={MAX_RADIUS}
                step={RADIUS_STEP}
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>{MIN_RADIUS}m</span>
                <span>{MAX_RADIUS}m</span>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    );
  }

  // Desktop: right panel
  return (
    <div className="absolute top-3 right-3 z-30 w-60 space-y-2 rounded-xl border bg-background/95 p-3 shadow-lg backdrop-blur max-h-[calc(100dvh-6rem)] overflow-y-auto">
      <Button
        variant="outline"
        size="sm"
        className="w-full justify-start"
        onClick={handleMyLocation}
        disabled={loading}
      >
        <Locate className="mr-2 h-4 w-4" />
        {t('myLocation')}
      </Button>

      <Separator />

      <div className="space-y-1">
        <Label className="text-xs font-medium">{t('radius')}: {radius}m</Label>
        <input
          type="range"
          min={MIN_RADIUS}
          max={MAX_RADIUS}
          step={RADIUS_STEP}
          value={radius}
          onChange={(e) => setRadius(Number(e.target.value))}
          className="w-full accent-primary"
        />
      </div>

      <Separator />

      <div className="space-y-1.5">
        <Label className="text-xs font-medium">{t('layers')}</Label>
        <CategoryToggles />
      </div>
    </div>
  );
}
