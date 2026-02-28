import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = parseFloat(searchParams.get('lat') || '');
  const lng = parseFloat(searchParams.get('lng') || '');
  const radius = parseInt(searchParams.get('radius') || '500');

  if (isNaN(lat) || isNaN(lng)) {
    return NextResponse.json(
      { success: false, error: 'Invalid coordinates' },
      { status: 400 }
    );
  }

  const apiKey = process.env.SOGIS_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { success: false, error: 'SOGIS API key not configured' },
      { status: 500 }
    );
  }

  try {
    // TODO: Check cache_coverage first with PostGIS ST_Covers
    // For now, call API directly

    const url = new URL('https://apis.data.go.kr/B553077/api/open/sdsc2/storeListInRadius');
    url.searchParams.set('serviceKey', apiKey);
    url.searchParams.set('pageNo', '1');
    url.searchParams.set('numOfRows', '200');
    url.searchParams.set('radius', String(radius));
    url.searchParams.set('cx', String(lng));
    url.searchParams.set('cy', String(lat));
    url.searchParams.set('type', 'json');

    const response = await fetch(url.toString());
    const data = await response.json();

    const items = data?.body?.items ?? [];
    const businesses = items.map((item: Record<string, unknown>) => ({
      id: String(item.bizesId || ''),
      name: String(item.bizesNm || ''),
      branch_name: item.brchNm || null,
      large_category: String(item.indsLclsNm || ''),
      medium_category: String(item.indsMclsNm || ''),
      small_category: String(item.indsSclsNm || ''),
      address_road: String(item.rdnmAdr || ''),
      address_jibun: String(item.lnoAdr || ''),
      latitude: Number(item.lat || 0),
      longitude: Number(item.lon || 0),
      floor: item.flrNo || null,
      phone: item.telNo || null,
      is_active: true,
      cached_at: new Date().toISOString(),
    }));

    // TODO: Save to cache_businesses and cache_coverage

    return NextResponse.json({
      success: true,
      data: businesses,
      total: data?.body?.totalCount ?? businesses.length,
    });
  } catch (error) {
    console.error('Business API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch businesses' },
      { status: 500 }
    );
  }
}
