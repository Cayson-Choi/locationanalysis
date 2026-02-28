'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { CompetitionMatrixItem } from '@/types/analysis';

interface CompetitionMatrixProps {
  matrix: CompetitionMatrixItem[];
  totalBusinesses: number;
}

export function CompetitionMatrix({ matrix, totalBusinesses }: CompetitionMatrixProps) {
  return (
    <div className="space-y-4">
      {/* Competition Density Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">경쟁 밀도 (업종별 사업체/km²)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            {matrix.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={matrix} layout="vertical">
                  <XAxis type="number" fontSize={10} />
                  <YAxis type="category" dataKey="category" width={60} fontSize={10} />
                  <Tooltip />
                  <Bar dataKey="density" fill="#EF4444" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                경쟁 데이터 분석 중...
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Competition Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">업종별 경쟁 현황</CardTitle>
        </CardHeader>
        <CardContent>
          {matrix.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs text-muted-foreground">
                    <th className="pb-2">업종</th>
                    <th className="pb-2 text-right">사업체 수</th>
                    <th className="pb-2 text-right">밀도(/km²)</th>
                    <th className="pb-2 text-right">비율</th>
                  </tr>
                </thead>
                <tbody>
                  {matrix.map((item, i) => (
                    <tr key={i} className="border-b">
                      <td className="py-2">{item.category}</td>
                      <td className="py-2 text-right">{item.count}</td>
                      <td className="py-2 text-right">{item.density.toFixed(1)}</td>
                      <td className="py-2 text-right">
                        {totalBusinesses > 0
                          ? ((item.count / totalBusinesses) * 100).toFixed(1)
                          : 0}
                        %
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">경쟁 데이터 분석 중...</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
