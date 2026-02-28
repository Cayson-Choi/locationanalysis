'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { CATEGORY_INFO } from '@/lib/utils/constants';
import { useMapStore } from '@/stores/mapStore';
import { useIsMobile } from '@/hooks/useMediaQuery';

interface MapLegendProps {
  visible?: boolean;
}

export function MapLegend({ visible = false }: MapLegendProps) {
  const isMobile = useIsMobile();
  const [collapsed, setCollapsed] = useState(isMobile);
  const { enabledCategories } = useMapStore();

  if (!visible) return null;

  const legendItems = enabledCategories
    .filter((code) => code in CATEGORY_INFO)
    .map((code) => CATEGORY_INFO[code]);

  if (legendItems.length === 0) return null;

  return (
    <div className="absolute bottom-20 left-3 z-30 rounded-lg border bg-background/95 p-2 shadow-lg backdrop-blur xl:bottom-3">
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex w-full items-center justify-between gap-2 text-xs font-medium"
      >
        <span>업종 범례</span>
        {collapsed ? (
          <ChevronUp className="h-3 w-3" />
        ) : (
          <ChevronDown className="h-3 w-3" />
        )}
      </button>

      {!collapsed && (
        <div className="mt-1.5 grid grid-cols-2 gap-x-3 gap-y-1">
          {legendItems.map(({ label, color }) => (
            <div key={label} className="flex items-center gap-1.5">
              <div
                className="h-2.5 w-2.5 rounded-full border border-white shadow-sm"
                style={{ backgroundColor: color }}
              />
              <span className="text-[10px] text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
