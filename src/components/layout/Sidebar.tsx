'use client';

import { useTranslations } from 'next-intl';
import {
  Map,
  BarChart3,
  Sparkles,
  Bookmark,
  GitCompare,
  MessageSquare,
  ClipboardCheck,
} from 'lucide-react';
import { Link, usePathname } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { ThemeToggle } from './ThemeToggle';
import { LanguageSwitcher } from './LanguageSwitcher';
import { APP_NAME } from '@/lib/utils/constants';

const icons = {
  Map,
  BarChart3,
  Sparkles,
  Bookmark,
  GitCompare,
  MessageSquare,
  ClipboardCheck,
};

const navItems = [
  { key: 'explore', href: '/explore', icon: 'Map' },
  { key: 'analysis', href: '/analysis', icon: 'BarChart3' },
  { key: 'recommend', href: '/recommend', icon: 'Sparkles' },
  { key: 'feasibility', href: '/feasibility', icon: 'ClipboardCheck' },
  { key: 'compare', href: '/compare', icon: 'GitCompare' },
  { key: 'search', href: '/search', icon: 'MessageSquare' },
  { key: 'saved', href: '/saved', icon: 'Bookmark' },
] as const;

export function Sidebar() {
  const t = useTranslations('nav');
  const tCommon = useTranslations('common');
  const pathname = usePathname();

  return (
    <aside className="hidden xl:flex w-64 flex-col border-r bg-sidebar" role="navigation" aria-label="사이드바 내비게이션">
      {/* Logo */}
      <div className="flex h-14 items-center gap-2 border-b px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold">
            상
          </div>
          <span className="font-bold">{APP_NAME}</span>
        </Link>
      </div>

      {/* Navigation links */}
      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          const Icon = icons[item.icon as keyof typeof icons];
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.key}
              href={item.href}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
              )}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
              {t(item.key)}
            </Link>
          );
        })}
      </nav>

      {/* Bottom controls */}
      <div className="border-t p-3 space-y-2">
        <div className="flex items-center justify-between px-2">
          <span className="text-xs text-muted-foreground">{tCommon('theme')}</span>
          <ThemeToggle />
        </div>
        <div className="flex items-center justify-between px-2">
          <span className="text-xs text-muted-foreground">{tCommon('language')}</span>
          <LanguageSwitcher />
        </div>
      </div>
    </aside>
  );
}
