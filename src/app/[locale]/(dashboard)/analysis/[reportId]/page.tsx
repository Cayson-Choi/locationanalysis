'use client';

import { useEffect, useState, Suspense, lazy } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { DistrictOverview } from '@/components/analysis/DistrictOverview';
import { FRESHNESS_COLORS } from '@/lib/utils/constants';
import type { FreshnessLevel } from '@/types/analysis';

// Lazy load chart components for performance
const IndustryChart = lazy(() => import('@/components/analysis/IndustryChart').then(m => ({ default: m.IndustryChart })));
const PopulationChart = lazy(() => import('@/components/analysis/PopulationChart').then(m => ({ default: m.PopulationChart })));
const RentTrendChart = lazy(() => import('@/components/analysis/RentTrendChart').then(m => ({ default: m.RentTrendChart })));
const TransportAccessibility = lazy(() => import('@/components/analysis/TransportAccessibility').then(m => ({ default: m.TransportAccessibility })));
const CompetitionMatrix = lazy(() => import('@/components/analysis/CompetitionMatrix').then(m => ({ default: m.CompetitionMatrix })));

export default function ReportDetailPage() {
  const t = useTranslations('analysis');
  const params = useParams();
  const reportId = params.reportId as string;
  const [report, setReport] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReport() {
      try {
        const res = await fetch(`/api/reports/${reportId}`);
        const data = await res.json();
        if (data.success) {
          setReport(data.data);
        }
      } catch {
        // Error handled
      } finally {
        setLoading(false);
      }
    }
    fetchReport();
  }, [reportId]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-24" />)}
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="py-20 text-center text-muted-foreground">
        리포트를 찾을 수 없습니다
      </div>
    );
  }

  const data = report.data as Record<string, unknown> || {};
  const industry = data.industry as Record<string, unknown> || {};
  const population = data.population as Record<string, unknown> || {};
  const rent = data.rent as Record<string, unknown> || {};
  const transport = data.transport as Record<string, unknown> || {};
  const competition = data.competition as Record<string, unknown> || {};
  const freshness = data.freshness as Record<string, FreshnessLevel> || {};
  const reliability = data.reliability as Record<string, unknown> || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h1 className="text-xl font-bold">{report.title as string}</h1>
          <p className="text-sm text-muted-foreground">{report.location_name as string}</p>
        </div>
        <div className="flex gap-2">
          {Object.entries(freshness).map(([key, level]) => (
            <Badge
              key={key}
              variant="outline"
              style={{ borderColor: FRESHNESS_COLORS[level] }}
              className="text-xs"
            >
              <span
                className="mr-1 inline-block h-2 w-2 rounded-full"
                style={{ backgroundColor: FRESHNESS_COLORS[level] }}
              />
              {key}: {t(level as 'fresh' | 'stale' | 'expired')}
            </Badge>
          ))}
          <Badge variant="secondary" className="text-xs">
            {t('reliability')}: {(reliability.availableSources as number) || 0}/{(reliability.totalSources as number) || 5}
          </Badge>
        </div>
      </div>

      {/* Overview Cards */}
      <DistrictOverview
        totalBusinesses={(industry.totalBusinesses as number) || 0}
        populationDensity={(population.density as number) || 0}
        avgRent={(rent.avgRentPerSqm as number) || 0}
        transitStops={((transport.busStops as number) || 0) + ((transport.subwayStations as number) || 0)}
      />

      {/* Tabbed Analysis */}
      <Tabs defaultValue="industry" className="w-full">
        <TabsList className="w-full grid grid-cols-5">
          <TabsTrigger value="industry" className="text-xs">{t('industry')}</TabsTrigger>
          <TabsTrigger value="population" className="text-xs">{t('populationTab')}</TabsTrigger>
          <TabsTrigger value="rent" className="text-xs">{t('rent')}</TabsTrigger>
          <TabsTrigger value="transport" className="text-xs">{t('transportTab')}</TabsTrigger>
          <TabsTrigger value="competition" className="text-xs">{t('competition')}</TabsTrigger>
        </TabsList>

        <TabsContent value="industry" className="mt-4">
          <Suspense fallback={<Skeleton className="h-64" />}>
            <IndustryChart categories={(industry.categories as Array<{ name: string; count: number; percentage: number }>) || []} />
          </Suspense>
        </TabsContent>

        <TabsContent value="population" className="mt-4">
          <Suspense fallback={<Skeleton className="h-64" />}>
            <PopulationChart
              ageDistribution={(population.ageDistribution as Array<{ label: string; male: number; female: number }>) || []}
              genderRatio={(population.genderRatio as { male: number; female: number }) || { male: 50, female: 50 }}
            />
          </Suspense>
        </TabsContent>

        <TabsContent value="rent" className="mt-4">
          <Suspense fallback={<Skeleton className="h-64" />}>
            <RentTrendChart
              trends={(rent.trends as Array<{ period: string; rent: number; vacancyRate: number }>) || []}
              transactions={(rent.transactions as Array<{ date: string; type: string; area: number; price: number; floor: number; address: string }>) || []}
            />
          </Suspense>
        </TabsContent>

        <TabsContent value="transport" className="mt-4">
          <Suspense fallback={<Skeleton className="h-64" />}>
            <TransportAccessibility data={transport as unknown as import('@/types/analysis').TransportData} />
          </Suspense>
        </TabsContent>

        <TabsContent value="competition" className="mt-4">
          <Suspense fallback={<Skeleton className="h-64" />}>
            <CompetitionMatrix
              matrix={(competition.matrix as Array<{ category: string; count: number; avgDistance: number; density: number }>) || []}
              totalBusinesses={(industry.totalBusinesses as number) || 0}
            />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}
