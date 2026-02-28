import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const regionCode = searchParams.get('regionCode');

  if (!regionCode) {
    return NextResponse.json({ success: false, error: 'Region code required' }, { status: 400 });
  }

  // TODO: Integrate KREB API for rent trends
  return NextResponse.json({
    success: true,
    data: {
      avgRentPerSqm: 0,
      vacancyRate: 0,
      trends: [],
    },
  });
}
