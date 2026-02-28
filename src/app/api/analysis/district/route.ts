import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { lat, lng, radius } = body;

    if (!lat || !lng) {
      return NextResponse.json({ success: false, error: 'Coordinates required' }, { status: 400 });
    }

    // Aggregate data from multiple sources
    const [businessesRes, transportRes] = await Promise.allSettled([
      fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/map/businesses?lat=${lat}&lng=${lng}&radius=${radius || 500}`),
      fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/map/transport?lat=${lat}&lng=${lng}&radius=${radius || 500}`),
    ]);

    const businesses = businessesRes.status === 'fulfilled' ? await businessesRes.value.json() : { data: [] };
    const transport = transportRes.status === 'fulfilled' ? await transportRes.value.json() : { data: [] };

    // Aggregate industry data
    const bizData = businesses.data || [];
    const categoryCount: Record<string, number> = {};
    bizData.forEach((biz: { large_category: string }) => {
      categoryCount[biz.large_category] = (categoryCount[biz.large_category] || 0) + 1;
    });

    const totalBusinesses = bizData.length;
    const categories = Object.entries(categoryCount)
      .map(([name, count]) => ({
        name,
        count,
        percentage: totalBusinesses > 0 ? (count / totalBusinesses) * 100 : 0,
      }))
      .sort((a, b) => b.count - a.count);

    const transportData = transport.data || [];

    const report = {
      industry: {
        totalBusinesses,
        categories,
        topCategories: categories.slice(0, 10),
        density: totalBusinesses / (Math.PI * ((radius || 500) / 1000) ** 2),
      },
      population: {
        totalPopulation: 0, // Requires SGIS/KOSIS integration
        density: 0,
        ageDistribution: [],
        genderRatio: { male: 50, female: 50 },
        households: 0,
      },
      rent: {
        avgRentPerSqm: 0, // Requires KREB integration
        vacancyRate: 0,
        trends: [],
        transactions: [],
      },
      transport: {
        busStops: transportData.filter((s: { type: string }) => s.type === 'bus').length,
        subwayStations: transportData.filter((s: { type: string }) => s.type === 'subway').length,
        accessibilityScore: Math.min(100, transportData.length * 10),
        stops: transportData.slice(0, 20),
      },
      competition: {
        sameIndustryCount: 0,
        competitionDensity: 0,
        saturationIndex: 0,
        matrix: categories.slice(0, 10).map((cat) => ({
          category: cat.name,
          count: cat.count,
          avgDistance: 0,
          density: cat.count / (Math.PI * ((radius || 500) / 1000) ** 2),
        })),
      },
      freshness: {
        businesses: 'fresh' as const,
        population: 'stale' as const,
        rent: 'stale' as const,
        transport: 'fresh' as const,
      },
      reliability: {
        overall: 'medium' as const,
        availableSources: 2,
        totalSources: 5,
      },
    };

    return NextResponse.json({ success: true, data: report });
  } catch (error) {
    console.error('District analysis error:', error);
    return NextResponse.json({ success: false, error: 'Analysis failed' }, { status: 500 });
  }
}
