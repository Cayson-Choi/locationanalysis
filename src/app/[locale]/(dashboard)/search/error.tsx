'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function SearchError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex h-[60vh] items-center justify-center p-4">
      <Card className="max-w-md">
        <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
          <AlertTriangle className="h-10 w-10 text-destructive" />
          <div>
            <h2 className="text-lg font-semibold">검색 서비스에 오류가 발생했습니다</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              AI 검색 서비스에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.
            </p>
          </div>
          <Button onClick={reset} variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            다시 시도
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
