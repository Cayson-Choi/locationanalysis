'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { INDUSTRY_COLORS } from '@/lib/utils/constants';
import { useIsMobile } from '@/hooks/useMediaQuery';

export function MapLegend() {
  const t = useTranslations('explore');
  const isMobile = useIsMobile();
  const [collapsed, setCollapsed] = useState(isMobile);

  const legendItems = Object.entries(INDUSTRY_COLORS);

  return (
    <div className="absolute bottom-20 left-3 z-30 rounded-lg border bg-background/95 p-2 shadow-lg backdrop-blur xl:bottom-3">
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex w-full items-center justify-between text-xs font-medium"
      >
        <span>범례</span>
        {collapsed ? (
          <ChevronUp className="h-3 w-3" />
        ) : (
          <ChevronDown className="h-3 w-3" />
        )}
      </button>

      {!collapsed && (
        <div className="mt-1.5 grid grid-cols-2 gap-x-3 gap-y-1">
          {legendItems.map(([name, color]) => (
            <div key={name} className="flex items-center gap-1.5">
              <div
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-[10px] text-muted-foreground">{name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
