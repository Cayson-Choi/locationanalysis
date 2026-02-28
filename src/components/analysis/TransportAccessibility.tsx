'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bus, Train } from 'lucide-react';
import type { TransportData } from '@/types/analysis';
import { formatDistance } from '@/lib/utils/formatters';

interface TransportAccessibilityProps {
  data: TransportData;
}

export function TransportAccessibility({ data }: TransportAccessibilityProps) {
  const scoreColor =
    data.accessibilityScore >= 70
      ? 'bg-green-500'
      : data.accessibilityScore >= 40
        ? 'bg-amber-500'
        : 'bg-red-500';

  return (
    <div className="space-y-4">
      {/* Score Card */}
      <Card>
        <CardContent className="flex items-center justify-between p-4">
          <div>
            <p className="text-sm text-muted-foreground">교통 접근성 점수</p>
            <p className="text-3xl font-bold">{data.accessibilityScore}</p>
          </div>
          <div className={`h-16 w-16 rounded-full ${scoreColor} flex items-center justify-center text-white font-bold text-lg`}>
            {data.accessibilityScore}
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <Bus className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-xs text-muted-foreground">버스 정류장</p>
              <p className="text-lg font-bold">{data.busStops}개</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <Train className="h-5 w-5 text-green-500" />
            <div>
              <p className="text-xs text-muted-foreground">지하철역</p>
              <p className="text-lg font-bold">{data.subwayStations}개</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stop List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">주변 정류장 목록</CardTitle>
        </CardHeader>
        <CardContent>
          {data.stops.length > 0 ? (
            <div className="space-y-2">
              {data.stops.map((stop, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border p-2">
                  <div className="flex items-center gap-2">
                    {stop.type === 'bus' ? (
                      <Bus className="h-4 w-4 text-blue-500" />
                    ) : (
                      <Train className="h-4 w-4 text-green-500" />
                    )}
                    <span className="text-sm">{stop.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {stop.lines?.length > 0 && (
                      <div className="flex gap-1">
                        {stop.lines.slice(0, 3).map((line) => (
                          <Badge key={line} variant="secondary" className="text-xs">
                            {line}
                          </Badge>
                        ))}
                      </div>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {formatDistance(stop.distance)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">교통 데이터 수집 중...</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
