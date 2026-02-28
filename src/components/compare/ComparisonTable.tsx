'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatKoreanNumber } from '@/lib/utils/formatters';

interface LocationData {
  name: string;
  businesses: number;
  population: number;
  floatingPopulation: number;
  avgRent: number;
  transportScore: number;
  competitionDensity: number;
}

interface ComparisonTableProps {
  locations: LocationData[];
}

const metrics = [
  { key: 'businesses', label: '사업체 수', format: (v: number) => formatKoreanNumber(v) },
  { key: 'population', label: '인구', format: (v: number) => formatKoreanNumber(v) },
  { key: 'floatingPopulation', label: '유동인구', format: (v: number) => formatKoreanNumber(v) },
  { key: 'avgRent', label: '평균 임대료', format: (v: number) => v > 0 ? `${formatKoreanNumber(v)}원/㎡` : '-' },
  { key: 'transportScore', label: '교통 접근성', format: (v: number) => `${v}점` },
  { key: 'competitionDensity', label: '경쟁 밀도', format: (v: number) => v.toFixed(1) },
];

export function ComparisonTable({ locations }: ComparisonTableProps) {
  const getBest = (key: string) => {
    if (key === 'avgRent' || key === 'competitionDensity') {
      return locations.reduce((min, loc) =>
        (loc[key as keyof LocationData] as number) < (min[key as keyof LocationData] as number) ? loc : min
      ).name;
    }
    return locations.reduce((max, loc) =>
      (loc[key as keyof LocationData] as number) > (max[key as keyof LocationData] as number) ? loc : max
    ).name;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">항목별 비교</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-2 pr-4">항목</th>
                {locations.map((loc) => (
                  <th key={loc.name} className="pb-2 pr-4 text-right">
                    {loc.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {metrics.map((metric) => {
                const best = getBest(metric.key);
                return (
                  <tr key={metric.key} className="border-b">
                    <td className="py-2 pr-4 font-medium">{metric.label}</td>
                    {locations.map((loc) => {
                      const val = loc[metric.key as keyof LocationData] as number;
                      const isBest = loc.name === best;
                      return (
                        <td key={loc.name} className="py-2 pr-4 text-right">
                          <span className={isBest ? 'font-bold text-primary' : ''}>
                            {metric.format(val)}
                          </span>
                          {isBest && (
                            <Badge variant="secondary" className="ml-1 text-[10px]">
                              최고
                            </Badge>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
