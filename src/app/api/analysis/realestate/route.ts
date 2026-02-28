import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const regionCode = searchParams.get('regionCode');

  if (!regionCode) {
    return NextResponse.json({ success: false, error: 'Region code required' }, { status: 400 });
  }

  // TODO: Integrate MOLIT API for real estate transactions
  return NextResponse.json({
    success: true,
    data: {
      transactions: [],
    },
  });
}
