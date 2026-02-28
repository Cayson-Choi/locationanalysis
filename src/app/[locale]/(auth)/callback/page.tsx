'use client';

import { useEffect } from 'react';
import { useRouter } from '@/i18n/navigation';
import { Skeleton } from '@/components/ui/skeleton';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    // OAuth callback is handled by /api/auth/callback
    // This page just shows a loading state then redirects
    const timer = setTimeout(() => {
      router.push('/explore');
    }, 2000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col items-center gap-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <Skeleton className="h-4 w-32" />
    </div>
  );
}
