import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get('keyword');

  if (!keyword || keyword.length < 2) {
    return NextResponse.json({ success: false, error: 'Keyword must be at least 2 characters' }, { status: 400 });
  }

  const apiKey = process.env.MOIS_ADDRESS_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ success: false, error: 'Address API key not configured' }, { status: 500 });
  }

  try {
    const url = new URL('https://business.juso.go.kr/addrlink/addrLinkApi.do');
    url.searchParams.set('confmKey', apiKey);
    url.searchParams.set('currentPage', '1');
    url.searchParams.set('countPerPage', '10');
    url.searchParams.set('keyword', keyword);
    url.searchParams.set('resultType', 'json');

    const response = await fetch(url.toString());
    const data = await response.json();

    const results = data?.results?.juso?.map((item: Record<string, string>) => ({
      roadAddr: item.roadAddr,
      jibunAddr: item.jibunAddr,
      zipNo: item.zipNo,
      bdNm: item.bdNm,
      siNm: item.siNm,
      sggNm: item.sggNm,
      emdNm: item.emdNm,
    })) ?? [];

    return NextResponse.json({ success: true, data: results });
  } catch (error) {
    console.error('Address search error:', error);
    return NextResponse.json({ success: false, error: 'Failed to search address' }, { status: 500 });
  }
}
