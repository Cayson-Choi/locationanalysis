'use client';

import { useTranslations } from 'next-intl';
import { Building2, Users, DollarSign, Bus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { formatKoreanNumber, formatWon } from '@/lib/utils/formatters';

interface DistrictOverviewProps {
  totalBusinesses: number;
  populationDensity: number;
  avgRent: number;
  transitStops: number;
}

export function DistrictOverview({
  totalBusinesses,
  populationDensity,
  avgRent,
  transitStops,
}: DistrictOverviewProps) {
  const t = useTranslations('analysis');

  const metrics = [
    {
      label: t('totalBusinesses'),
      value: formatKoreanNumber(totalBusinesses),
      icon: Building2,
      color: 'text-blue-500',
    },
    {
      label: t('populationDensity'),
      value: `${formatKoreanNumber(populationDensity)}/km²`,
      icon: Users,
      color: 'text-green-500',
    },
    {
      label: t('avgRent'),
      value: avgRent > 0 ? formatWon(avgRent) + '/㎡' : '-',
      icon: DollarSign,
      color: 'text-amber-500',
    },
    {
      label: t('transitStops'),
      value: String(transitStops),
      icon: Bus,
      color: 'text-purple-500',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {metrics.map((metric) => (
        <Card key={metric.label}>
          <CardContent className="flex items-center gap-3 p-4">
            <div className={`rounded-lg bg-muted p-2 ${metric.color}`}>
              <metric.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{metric.label}</p>
              <p className="text-lg font-bold">{metric.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
