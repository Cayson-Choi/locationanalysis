'use client';

import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface RadarChartData {
  metric: string;
  [location: string]: string | number;
}

interface RadarChartProps {
  data: RadarChartData[];
  locations: string[];
}

const COLORS = ['#3B82F6', '#EF4444', '#10B981'];

export function RadarChart({ data, locations }: RadarChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">다차원 비교</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsRadarChart data={data}>
              <PolarGrid />
              <PolarAngleAxis dataKey="metric" fontSize={10} />
              <PolarRadiusAxis fontSize={10} />
              {locations.map((loc, i) => (
                <Radar
                  key={loc}
                  name={loc}
                  dataKey={loc}
                  stroke={COLORS[i % COLORS.length]}
                  fill={COLORS[i % COLORS.length]}
                  fillOpacity={0.15}
                />
              ))}
              <Legend />
            </RechartsRadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
