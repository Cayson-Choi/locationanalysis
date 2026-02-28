import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get('keyword');

  if (!keyword || keyword.length < 2) {
    return NextResponse.json({ success: false, error: 'Keyword must be at least 2 characters' }, { status: 400 });
  }

  const kakaoKey = process.env.KAKAO_REST_API_KEY;
  if (!kakaoKey) {
    return NextResponse.json({ success: false, error: 'Kakao REST API key not configured' }, { status: 500 });
  }

  try {
    // Use Kakao Address Search API
    const url = new URL('https://dapi.kakao.com/v2/local/search/keyword.json');
    url.searchParams.set('query', keyword);
    url.searchParams.set('size', '10');

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `KakaoAK ${kakaoKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Kakao API error: ${response.status}`);
    }

    const data = await response.json();

    const results = data.documents?.map((item: Record<string, string>) => ({
      roadAddr: item.road_address_name || item.address_name,
      jibunAddr: item.address_name,
      placeName: item.place_name,
      lat: parseFloat(item.y),
      lng: parseFloat(item.x),
      category: item.category_group_name,
    })) ?? [];

    return NextResponse.json({ success: true, data: results });
  } catch (error) {
    console.error('Address search error:', error);
    return NextResponse.json({ success: false, error: 'Failed to search address' }, { status: 500 });
  }
}
