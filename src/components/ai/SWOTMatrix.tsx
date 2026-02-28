'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SWOTData {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

interface SWOTMatrixProps {
  data: SWOTData;
}

export function SWOTMatrix({ data }: SWOTMatrixProps) {
  const t = useTranslations('feasibility');

  const quadrants = [
    {
      key: 'strengths',
      title: t('strengths'),
      items: data.strengths,
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30',
      textColor: 'text-blue-700 dark:text-blue-300',
    },
    {
      key: 'weaknesses',
      title: t('weaknesses'),
      items: data.weaknesses,
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/30',
      textColor: 'text-red-700 dark:text-red-300',
    },
    {
      key: 'opportunities',
      title: t('opportunities'),
      items: data.opportunities,
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30',
      textColor: 'text-green-700 dark:text-green-300',
    },
    {
      key: 'threats',
      title: t('threats'),
      items: data.threats,
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/30',
      textColor: 'text-amber-700 dark:text-amber-300',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {quadrants.map((q) => (
        <Card key={q.key} className={`${q.bgColor} ${q.borderColor} border`}>
          <CardHeader className="pb-2">
            <CardTitle className={`text-sm ${q.textColor}`}>{q.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1">
              {q.items.map((item, i) => (
                <li key={i} className="text-xs leading-relaxed">
                  {item}
                </li>
              ))}
              {q.items.length === 0 && (
                <li className="text-xs text-muted-foreground">데이터 분석 중...</li>
              )}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
