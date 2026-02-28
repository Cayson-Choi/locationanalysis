import { NextRequest, NextResponse } from 'next/server';

// All Kakao category group codes
const CATEGORY_MAP: Record<string, string> = {
  MT1: '대형마트',
  CS2: '편의점',
  PS3: '어린이집',
  SC4: '학교',
  AC5: '학원',
  PK6: '주차장',
  OL7: '주유소',
  SW8: '지하철역',
  BK9: '은행',
  CT1: '문화시설',
  AG2: '중개업소',
  PO3: '공공기관',
  AT4: '관광명소',
  AD5: '숙박',
  FD6: '음식점',
  CE7: '카페',
  HP8: '병원',
  PM9: '약국',
};

// Valid codes: all Kakao categories + BUS (TAGO)
const VALID_CODES = new Set([...Object.keys(CATEGORY_MAP), 'BUS']);

interface KakaoDocument {
  id: string;
  place_name: string;
  category_group_code: string;
  category_group_name: string;
  category_name: string;
  road_address_name: string;
  address_name: string;
  phone: string;
  x: string;
  y: string;
}

interface BusinessResult {
  id: string;
  name: string;
  branch_name: string | null;
  large_category: string;
  medium_category: string;
  small_category: string;
  address_road: string;
  address_jibun: string;
  latitude: number;
  longitude: number;
  floor: string | null;
  phone: string | null;
  is_active: boolean;
  cached_at: string;
}

async function searchCategoryPage(
  kakaoKey: string,
  categoryCode: string,
  lng: number,
  lat: number,
  radius: number,
  page: number
): Promise<{ documents: KakaoDocument[]; is_end: boolean }> {
  const url = new URL('https://dapi.kakao.com/v2/local/search/category.json');
  url.searchParams.set('category_group_code', categoryCode);
  url.searchParams.set('x', String(lng));
  url.searchParams.set('y', String(lat));
  url.searchParams.set('radius', String(radius));
  url.searchParams.set('size', '15');
  url.searchParams.set('page', String(page));
  url.searchParams.set('sort', 'distance');

  const res = await fetch(url.toString(), {
    headers: { Authorization: `KakaoAK ${kakaoKey}` },
  });

  if (!res.ok) return { documents: [], is_end: true };
  const data = await res.json();
  return {
    documents: data.documents ?? [],
    is_end: data.meta?.is_end ?? true,
  };
}

async function searchCategory(
  kakaoKey: string,
  categoryCode: string,
  lng: number,
  lat: number,
  radius: number
): Promise<KakaoDocument[]> {
  const all: KakaoDocument[] = [];
  const maxPages = 3;

  for (let page = 1; page <= maxPages; page++) {
    const { documents, is_end } = await searchCategoryPage(kakaoKey, categoryCode, lng, lat, radius, page);
    all.push(...documents);
    if (is_end || documents.length === 0) break;
  }

  return all;
}

// Fetch bus stops from TAGO API
async function fetchTagoBusStops(
  tagoKey: string,
  lat: number,
  lng: number
): Promise<BusinessResult[]> {
  try {
    const base = 'https://apis.data.go.kr/1613000/BusSttnInfoInqireService/getCrdntPrxmtSttnList';
    const params = new URLSearchParams({
      pageNo: '1',
      numOfRows: '50',
      gpsLati: String(lat),
      gpsLong: String(lng),
      _type: 'json',
    });
    const fullUrl = `${base}?serviceKey=${tagoKey}&${params.toString()}`;

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
      id: String(item.nodeid || ''),
      name: String(item.nodenm || ''),
      branch_name: null,
      large_category: '버스정류장',
      medium_category: '',
      small_category: '',
      address_road: '',
      address_jibun: '',
      latitude: Number(item.gpslati || 0),
      longitude: Number(item.gpslong || 0),
      floor: null,
      phone: null,
      is_active: true,
      cached_at: new Date().toISOString(),
    }));
  } catch (e) {
    console.error('TAGO bus fetch error:', e);
    return [];
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = parseFloat(searchParams.get('lat') || '');
  const lng = parseFloat(searchParams.get('lng') || '');
  const radius = Math.min(parseInt(searchParams.get('radius') || '500'), 2000);
  const categories = searchParams.get('categories'); // comma-separated codes e.g. "FD6,CE7,BUS"

  if (isNaN(lat) || isNaN(lng)) {
    return NextResponse.json(
      { success: false, error: 'Invalid coordinates' },
      { status: 400 }
    );
  }

  const kakaoKey = process.env.KAKAO_REST_API_KEY;
  if (!kakaoKey) {
    return NextResponse.json(
      { success: false, error: 'Kakao REST API key not configured' },
      { status: 500 }
    );
  }

  // Default: main categories. If specified, use only those.
  const defaultCodes = ['FD6', 'CE7', 'CS2', 'HP8', 'PM9', 'AC5'];
  const codes = categories
    ? categories.split(',').filter((c) => VALID_CODES.has(c))
    : defaultCodes;

  // Separate Kakao category codes from TAGO bus
  const kakaoCodes = codes.filter((c) => c in CATEGORY_MAP);
  const busEnabled = codes.includes('BUS');

  try {
    // Fetch Kakao categories in parallel
    const categoryResults = await Promise.all(
      kakaoCodes.map((code) => searchCategory(kakaoKey, code, lng, lat, radius))
    );

    const businesses: BusinessResult[] = categoryResults.flatMap((docs) =>
      docs.map((doc) => {
        const largeCategory = CATEGORY_MAP[doc.category_group_code] || '기타';
        const categoryParts = doc.category_name.split(' > ');
        const mediumCategory = categoryParts[1] || '';
        const smallCategory = categoryParts[2] || '';

        return {
          id: doc.id,
          name: doc.place_name,
          branch_name: null,
          large_category: largeCategory,
          medium_category: mediumCategory,
          small_category: smallCategory,
          address_road: doc.road_address_name,
          address_jibun: doc.address_name,
          latitude: parseFloat(doc.y),
          longitude: parseFloat(doc.x),
          floor: null,
          phone: doc.phone || null,
          is_active: true,
          cached_at: new Date().toISOString(),
        };
      })
    );

    // Fetch bus stops from TAGO if enabled
    if (busEnabled) {
      const tagoKey = process.env.TAGO_API_KEY;
      if (tagoKey) {
        const busStops = await fetchTagoBusStops(tagoKey, lat, lng);
        businesses.push(...busStops);
      }
    }

    return NextResponse.json({
      success: true,
      data: businesses,
      total: businesses.length,
    });
  } catch (error) {
    console.error('Business API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch businesses' },
      { status: 500 }
    );
  }
}
