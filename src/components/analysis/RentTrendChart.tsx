'use client';

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { RentTrendItem, RealEstateTransaction } from '@/types/analysis';
import { formatWon } from '@/lib/utils/formatters';

interface RentTrendChartProps {
  trends: RentTrendItem[];
  transactions: RealEstateTransaction[];
}

export function RentTrendChart({ trends, transactions }: RentTrendChartProps) {
  return (
    <div className="space-y-4">
      {/* Rent Trend Line Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">임대료 추이</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            {trends.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trends}>
                  <XAxis dataKey="period" fontSize={10} />
                  <YAxis fontSize={10} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="rent"
                    name="임대료(원/㎡)"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="vacancyRate"
                    name="공실률(%)"
                    stroke="#EF4444"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                임대료 데이터 수집 중...
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">최근 거래 내역</CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs text-muted-foreground">
                    <th className="pb-2">날짜</th>
                    <th className="pb-2">유형</th>
                    <th className="pb-2">면적</th>
                    <th className="pb-2">가격</th>
                    <th className="pb-2">층</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.slice(0, 10).map((tx, i) => (
                    <tr key={i} className="border-b">
                      <td className="py-2">{tx.date}</td>
                      <td className="py-2">{tx.type}</td>
                      <td className="py-2">{tx.area}㎡</td>
                      <td className="py-2">{formatWon(tx.price)}</td>
                      <td className="py-2">{tx.floor}층</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">거래 데이터 수집 중...</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
