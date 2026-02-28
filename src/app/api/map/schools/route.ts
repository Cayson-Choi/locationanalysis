import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = parseFloat(searchParams.get('lat') || '');
  const lng = parseFloat(searchParams.get('lng') || '');
  const radius = parseInt(searchParams.get('radius') || '500');

  if (isNaN(lat) || isNaN(lng)) {
    return NextResponse.json({ success: false, error: 'Invalid coordinates' }, { status: 400 });
  }

  const apiKey = process.env.NEIS_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ success: false, error: 'NEIS API key not configured' }, { status: 500 });
  }

  try {
    // NEIS API - school info
    const url = new URL('https://open.neis.go.kr/hub/schoolInfo');
    url.searchParams.set('KEY', apiKey);
    url.searchParams.set('Type', 'json');
    url.searchParams.set('pIndex', '1');
    url.searchParams.set('pSize', '100');

    // Note: NEIS does not support radius search natively
    // We'd need to fetch by region and filter by distance
    // For now, return empty - actual implementation needs geocoding
    return NextResponse.json({ success: true, data: [], total: 0 });
  } catch (error) {
    console.error('Schools API error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch schools' }, { status: 500 });
  }
}
