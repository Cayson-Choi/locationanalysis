'use client';

import { useTranslations } from 'next-intl';
import { MessageSquare } from 'lucide-react';
import { SearchChat } from '@/components/ai/SearchChat';

export default function SearchPage() {
  const t = useTranslations('search');

  return (
    <div className="-mx-4 -my-4 flex h-[calc(100dvh-3.5rem-4rem)] flex-col sm:-mx-6 lg:-mx-8 xl:h-[calc(100dvh-3.5rem)]">
      <SearchChat />
    </div>
  );
}
