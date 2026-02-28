'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { AgeGroup } from '@/types/analysis';

interface PopulationChartProps {
  ageDistribution: AgeGroup[];
  genderRatio: { male: number; female: number };
}

export function PopulationChart({ ageDistribution, genderRatio }: PopulationChartProps) {
  // Transform for pyramid chart: male values negative for left side
  const pyramidData = ageDistribution.map((group) => ({
    ...group,
    maleDisplay: -group.male,
  }));

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {/* Population Pyramid */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">연령대별 인구 분포</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            {ageDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={pyramidData} layout="vertical">
                  <XAxis type="number" fontSize={10} />
                  <YAxis type="category" dataKey="label" width={40} fontSize={10} />
                  <Tooltip
                    formatter={(value) => Math.abs(Number(value)).toLocaleString()}
                  />
                  <Legend />
                  <Bar dataKey="maleDisplay" name="남성" fill="#3B82F6" stackId="stack" />
                  <Bar dataKey="female" name="여성" fill="#EC4899" stackId="stack" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                데이터 수집 중...
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Gender Ratio */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">성비</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-64 flex-col items-center justify-center gap-4">
            <div className="flex w-full max-w-xs items-center gap-2">
              <div
                className="h-8 rounded-l-full bg-blue-500 transition-all"
                style={{ width: `${genderRatio.male}%` }}
              />
              <div
                className="h-8 rounded-r-full bg-pink-500 transition-all"
                style={{ width: `${genderRatio.female}%` }}
              />
            </div>
            <div className="flex gap-6 text-sm">
              <span className="text-blue-500">남성 {genderRatio.male}%</span>
              <span className="text-pink-500">여성 {genderRatio.female}%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
