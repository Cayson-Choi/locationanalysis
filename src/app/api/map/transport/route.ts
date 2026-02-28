import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = parseFloat(searchParams.get('lat') || '');
  const lng = parseFloat(searchParams.get('lng') || '');
  const radius = parseInt(searchParams.get('radius') || '500');

  if (isNaN(lat) || isNaN(lng)) {
    return NextResponse.json({ success: false, error: 'Invalid coordinates' }, { status: 400 });
  }

  const apiKey = process.env.TAGO_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ success: false, error: 'TAGO API key not configured' }, { status: 500 });
  }

  try {
    // TAGO API - bus stops nearby
    const url = new URL('https://apis.data.go.kr/1613000/BusSttnInfoInqireService/getCrdntPrxmtSttnList');
    url.searchParams.set('serviceKey', apiKey);
    url.searchParams.set('pageNo', '1');
    url.searchParams.set('numOfRows', '50');
    url.searchParams.set('gpsLati', String(lat));
    url.searchParams.set('gpsLong', String(lng));
    url.searchParams.set('_type', 'json');

    const response = await fetch(url.toString());
    const data = await response.json();

    const items = data?.response?.body?.items?.item ?? [];
    const stops = (Array.isArray(items) ? items : [items]).map((item: Record<string, unknown>) => ({
      name: String(item.nodenm || ''),
      type: 'bus' as const,
      latitude: Number(item.gpslati || 0),
      longitude: Number(item.gpslong || 0),
      nodeId: String(item.nodeid || ''),
    }));

    return NextResponse.json({ success: true, data: stops, total: stops.length });
  } catch (error) {
    console.error('Transport API error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch transport data' }, { status: 500 });
  }
}
