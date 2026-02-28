import { NextRequest, NextResponse } from 'next/server';

// Kakao category codes → our industry categories
const CATEGORY_MAP: Record<string, { code: string; label: string }> = {
  음식점: { code: 'FD6', label: '음식점' },
  카페: { code: 'CE7', label: '카페' },
  편의점: { code: 'CS2', label: '편의점' },
  대형마트: { code: 'MT1', label: '대형마트' },
  의료: { code: 'HP8', label: '의료' },
  약국: { code: 'PM9', label: '약국' },
  학원: { code: 'AC5', label: '학원' },
  학교: { code: 'SC4', label: '학교' },
  숙박: { code: 'AD5', label: '숙박' },
  은행: { code: 'BK9', label: '은행' },
};

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
  const maxPages = 3; // up to 45 results per category

  for (let page = 1; page <= maxPages; page++) {
    const { documents, is_end } = await searchCategoryPage(kakaoKey, categoryCode, lng, lat, radius, page);
    all.push(...documents);
    if (is_end || documents.length === 0) break;
  }

  return all;
}

// Reverse map: kakao code → our label
const CODE_TO_LABEL: Record<string, string> = {};
for (const [, v] of Object.entries(CATEGORY_MAP)) {
  CODE_TO_LABEL[v.code] = v.label;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = parseFloat(searchParams.get('lat') || '');
  const lng = parseFloat(searchParams.get('lng') || '');
  const radius = Math.min(parseInt(searchParams.get('radius') || '500'), 2000);

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

  try {
    // Search all categories in parallel
    const categories = Object.values(CATEGORY_MAP);
    const results = await Promise.all(
      categories.map((cat) => searchCategory(kakaoKey, cat.code, lng, lat, radius))
    );

    const businesses = results.flatMap((docs) =>
      docs.map((doc) => {
        const largeCategory = CODE_TO_LABEL[doc.category_group_code] || '기타';
        // Extract medium category from category_name (e.g. "음식점 > 한식 > 국밥")
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
