import { NextRequest, NextResponse } from 'next/server';

interface TransitStop {
  name: string;
  type: 'bus' | 'subway';
  latitude: number;
  longitude: number;
  nodeId: string;
}

async function fetchTagoBusStops(apiKey: string, lat: number, lng: number): Promise<TransitStop[]> {
  try {
    // Build URL manually to avoid double-encoding of serviceKey
    const base = 'https://apis.data.go.kr/1613000/BusSttnInfoInqireService/getCrdntPrxmtSttnList';
    const params = new URLSearchParams({
      pageNo: '1',
      numOfRows: '50',
      gpsLati: String(lat),
      gpsLong: String(lng),
      _type: 'json',
    });
    const fullUrl = `${base}?serviceKey=${apiKey}&${params.toString()}`;

    const response = await fetch(fullUrl);
    const text = await response.text();

    // data.go.kr sometimes returns XML even with _type=json
    if (!text.startsWith('{') && !text.startsWith('[')) {
      console.warn('TAGO returned non-JSON:', text.substring(0, 200));
      return [];
    }

    const data = JSON.parse(text);
    const items = data?.response?.body?.items?.item;
    if (!items) return [];
    const arr = Array.isArray(items) ? items : [items];

    return arr.map((item: Record<string, unknown>) => ({
      name: String(item.nodenm || ''),
      type: 'bus' as const,
      latitude: Number(item.gpslati || 0),
      longitude: Number(item.gpslong || 0),
      nodeId: String(item.nodeid || ''),
    }));
  } catch (e) {
    console.error('TAGO bus fetch error:', e);
    return [];
  }
}

async function fetchKakaoSubway(kakaoKey: string, lat: number, lng: number, radius: number): Promise<TransitStop[]> {
  try {
    const url = new URL('https://dapi.kakao.com/v2/local/search/category.json');
    url.searchParams.set('category_group_code', 'SW8');
    url.searchParams.set('x', String(lng));
    url.searchParams.set('y', String(lat));
    url.searchParams.set('radius', String(radius));
    url.searchParams.set('size', '15');
    url.searchParams.set('sort', 'distance');

    const res = await fetch(url.toString(), {
      headers: { Authorization: `KakaoAK ${kakaoKey}` },
    });

    if (!res.ok) return [];
    const data = await res.json();

    return (data.documents ?? []).map((doc: Record<string, string>) => ({
      name: doc.place_name,
      type: 'subway' as const,
      latitude: parseFloat(doc.y),
      longitude: parseFloat(doc.x),
      nodeId: doc.id,
    }));
  } catch (e) {
    console.error('Kakao subway fetch error:', e);
    return [];
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = parseFloat(searchParams.get('lat') || '');
  const lng = parseFloat(searchParams.get('lng') || '');
  const radius = Math.min(parseInt(searchParams.get('radius') || '500'), 2000);

  if (isNaN(lat) || isNaN(lng)) {
    return NextResponse.json({ success: false, error: 'Invalid coordinates' }, { status: 400 });
  }

  const tagoKey = process.env.TAGO_API_KEY;
  const kakaoKey = process.env.KAKAO_REST_API_KEY;

  try {
    const results: TransitStop[] = [];

    // Fetch bus stops from TAGO (works for non-Seoul areas, fixed 500m radius)
    if (tagoKey) {
      const busStops = await fetchTagoBusStops(tagoKey, lat, lng);
      results.push(...busStops);
    }

    // Fetch subway stations from Kakao (works everywhere)
    if (kakaoKey) {
      const subways = await fetchKakaoSubway(kakaoKey, lat, lng, radius);
      results.push(...subways);
    }

    return NextResponse.json({ success: true, data: results, total: results.length });
  } catch (error) {
    console.error('Transport API error:', error);
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: `Failed to fetch transport data: ${msg}` }, { status: 500 });
  }
}
