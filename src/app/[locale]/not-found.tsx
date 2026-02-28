import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { FileQuestion } from 'lucide-react';

export default function NotFoundPage() {
  const t = useTranslations('errors');

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 p-4">
      <FileQuestion className="h-12 w-12 text-muted-foreground" />
      <h1 className="text-2xl font-bold">{t('notFound')}</h1>
      <p className="text-muted-foreground">{t('notFoundDesc')}</p>
      <Link href="/">
        <Button variant="outline">{t('goHome')}</Button>
      </Link>
    </div>
  );
}
