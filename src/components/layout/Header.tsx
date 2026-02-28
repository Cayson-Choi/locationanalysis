'use client';

import { useTranslations } from 'next-intl';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from './ThemeToggle';
import { LanguageSwitcher } from './LanguageSwitcher';
import { UserMenu } from './UserMenu';
import { Link } from '@/i18n/navigation';
import { APP_NAME } from '@/lib/utils/constants';

export function Header() {
  const t = useTranslations('common');

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60" role="banner">
      {/* Left: Logo (mobile) / empty (desktop, sidebar has logo) */}
      <div className="flex items-center gap-2 xl:hidden">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold">
            상
          </div>
          <span className="font-semibold text-sm">{APP_NAME}</span>
        </Link>
      </div>

      {/* Desktop: breadcrumb area placeholder */}
      <div className="hidden xl:block" />

      {/* Right: controls */}
      <div className="flex items-center gap-1">
        <ThemeToggle />
        <LanguageSwitcher />
        <UserMenu />
      </div>
    </header>
  );
}
