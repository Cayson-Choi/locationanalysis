'use client';

import { useTranslations } from 'next-intl';
import { Locate, Layers, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useMapStore } from '@/stores/mapStore';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { MapProviderSwitcher } from '@/components/layout/MapProviderSwitcher';
import { MIN_RADIUS, MAX_RADIUS, RADIUS_STEP } from '@/lib/utils/constants';

interface MapControlsProps {
  onMyLocation?: (lat: number, lng: number) => void;
}

export function MapControls({ onMyLocation }: MapControlsProps) {
  const t = useTranslations('explore');
  const isMobile = useIsMobile();
  const { getCurrentPosition, lat, lng, loading } = useGeolocation();
  const { radius, setRadius, layers, toggleLayer } = useMapStore();

  const handleMyLocation = () => {
    getCurrentPosition();
    if (lat && lng) {
      onMyLocation?.(lat, lng);
    }
  };

  const layerItems = [
    { key: 'businesses' as const, label: t('businesses') },
    { key: 'schools' as const, label: t('schools') },
    { key: 'academies' as const, label: t('academies') },
    { key: 'transport' as const, label: t('transport') },
    { key: 'population' as const, label: t('population') },
  ];

  if (isMobile) {
    return (
      <div className="absolute bottom-20 right-3 z-30 flex flex-col gap-2">
        {/* My Location FAB */}
        <Button
          size="icon"
          variant="secondary"
          className="h-11 w-11 rounded-full shadow-lg"
          onClick={handleMyLocation}
          disabled={loading}
        >
          <Locate className="h-5 w-5" />
        </Button>

        {/* Layers Sheet */}
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
            <div className="space-y-4 py-4">
              {layerItems.map((item) => (
                <div key={item.key} className="flex items-center justify-between">
                  <Label htmlFor={item.key}>{item.label}</Label>
                  <Switch
                    id={item.key}
                    checked={layers[item.key]}
                    onCheckedChange={() => toggleLayer(item.key)}
                  />
                </div>
              ))}
              <Separator />
              <div className="flex items-center justify-between">
                <Label>{t('mapProvider')}</Label>
                <MapProviderSwitcher />
              </div>
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
    <div className="absolute top-3 right-3 z-30 w-56 space-y-2 rounded-xl border bg-background/95 p-3 shadow-lg backdrop-blur">
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

      <div className="space-y-2">
        <Label className="text-xs font-medium">{t('layers')}</Label>
        {layerItems.map((item) => (
          <div key={item.key} className="flex items-center justify-between">
            <Label htmlFor={`desktop-${item.key}`} className="text-xs">
              {item.label}
            </Label>
            <Switch
              id={`desktop-${item.key}`}
              checked={layers[item.key]}
              onCheckedChange={() => toggleLayer(item.key)}
              className="scale-75"
            />
          </div>
        ))}
      </div>

      <Separator />

      <div className="flex items-center justify-between">
        <Label className="text-xs">{t('mapProvider')}</Label>
        <MapProviderSwitcher />
      </div>
    </div>
  );
}
