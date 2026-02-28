'use client';

import { useTranslations } from 'next-intl';
import { Map, BarChart3, Sparkles, Bookmark, MoreHorizontal, GitCompare, MessageSquare, ClipboardCheck, Settings } from 'lucide-react';
import { Link, usePathname } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useState } from 'react';

const icons = {
  Map,
  BarChart3,
  Sparkles,
  Bookmark,
  GitCompare,
  MessageSquare,
  ClipboardCheck,
  Settings,
};

const mainTabs = [
  { key: 'explore', href: '/explore', icon: 'Map' },
  { key: 'analysis', href: '/analysis', icon: 'BarChart3' },
  { key: 'recommend', href: '/recommend', icon: 'Sparkles' },
  { key: 'saved', href: '/saved', icon: 'Bookmark' },
] as const;

const moreTabs = [
  { key: 'compare', href: '/compare', icon: 'GitCompare' },
  { key: 'search', href: '/search', icon: 'MessageSquare' },
  { key: 'feasibility', href: '/feasibility', icon: 'ClipboardCheck' },
] as const;

export function BottomNav() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 xl:hidden" aria-label="주요 내비게이션" role="navigation">
      <div className="flex h-16 items-center justify-around pb-safe">
        {mainTabs.map((tab) => {
          const Icon = icons[tab.icon as keyof typeof icons];
          const isActive = pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.key}
              href={tab.href}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-0.5 rounded-lg px-2 py-1 text-xs transition-colors',
                isActive
                  ? 'text-primary font-medium'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
              <span>{t(tab.key)}</span>
            </Link>
          );
        })}

        {/* More button */}
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <button
              className="flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-0.5 rounded-lg px-2 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
              aria-label="더보기 메뉴 열기"
            >
              <MoreHorizontal className="h-5 w-5" aria-hidden="true" />
              <span>{t('more')}</span>
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="rounded-t-2xl">
            <SheetHeader>
              <SheetTitle>{t('more')}</SheetTitle>
            </SheetHeader>
            <div className="grid grid-cols-3 gap-4 py-4">
              {moreTabs.map((tab) => {
                const Icon = icons[tab.icon as keyof typeof icons];
                const isActive = pathname.startsWith(tab.href);
                return (
                  <Link
                    key={tab.key}
                    href={tab.href}
                    onClick={() => setSheetOpen(false)}
                    className={cn(
                      'flex min-h-[64px] flex-col items-center justify-center gap-1.5 rounded-xl border p-3 text-sm transition-colors',
                      isActive
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-border hover:bg-muted'
                    )}
                  >
                    <Icon className="h-6 w-6" />
                    <span className="font-medium">{t(tab.key)}</span>
                  </Link>
                );
              })}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
