import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = parseFloat(searchParams.get('lat') || '');
  const lng = parseFloat(searchParams.get('lng') || '');
  const radius = parseInt(searchParams.get('radius') || '500');

  if (isNaN(lat) || isNaN(lng)) {
    return NextResponse.json({ success: false, error: 'Invalid coordinates' }, { status: 400 });
  }

  try {
    // Academy data comes from file download (교육부 표준데이터)
    // Implementation: query from cache_academies
    return NextResponse.json({ success: true, data: [], total: 0 });
  } catch (error) {
    console.error('Academies API error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch academies' }, { status: 500 });
  }
}
