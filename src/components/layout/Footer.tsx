'use client';

import { useTranslations } from 'next-intl';

export function Footer() {
  const t = useTranslations('common');

  return (
    <footer className="border-t px-4 py-6 text-center text-xs text-muted-foreground">
      <p>{t('copyright')}</p>
      <p className="mt-1">{t('disclaimer')}</p>
    </footer>
  );
}
