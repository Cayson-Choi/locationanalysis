'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslations } from 'next-intl';
import { INDUSTRY_COLORS } from '@/lib/utils/constants';

interface IndustryChartProps {
  categories: Array<{ name: string; count: number; percentage: number }>;
}

const COLORS = ['#EF4444', '#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EC4899', '#6366F1', '#14B8A6', '#F97316', '#6B7280'];

export function IndustryChart({ categories }: IndustryChartProps) {
  const t = useTranslations('analysis');
  const top10 = categories.slice(0, 10);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {/* Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">업종 분포</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={top10}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  dataKey="count"
                  nameKey="name"
                  label={({ name, percent }) => `${name} ${((percent as number) * 100).toFixed(0)}%`}
                  labelLine={false}
                  fontSize={10}
                >
                  {top10.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">업종별 사업체 수</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={top10} layout="vertical">
                <XAxis type="number" fontSize={10} />
                <YAxis type="category" dataKey="name" width={60} fontSize={10} />
                <Tooltip />
                <Bar dataKey="count" fill="#3B82F6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
