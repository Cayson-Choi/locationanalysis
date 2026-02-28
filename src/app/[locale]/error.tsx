'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('errors');

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 p-4">
      <AlertTriangle className="h-12 w-12 text-destructive" />
      <h1 className="text-2xl font-bold">{t('serverError')}</h1>
      <p className="text-muted-foreground">{t('serverErrorDesc')}</p>
      <Button onClick={reset} variant="outline">
        {t('goHome')}
      </Button>
    </div>
  );
}
