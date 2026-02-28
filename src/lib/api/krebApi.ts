// 한국부동산원 상업용 임대동향 API
const BASE_URL = 'https://apis.data.go.kr/B551182';

export async function getCommercialRentTrend(params: {
  regionCode: string;
  period?: string;
}) {
  const apiKey = process.env.KREB_API_KEY;
  if (!apiKey) throw new Error('KREB_API_KEY not set');

  const url = new URL(`${BASE_URL}/commercialRentService/getCommercialRent`);
  url.searchParams.set('serviceKey', apiKey);
  url.searchParams.set('pageNo', '1');
  url.searchParams.set('numOfRows', '100');
  url.searchParams.set('type', 'json');
  url.searchParams.set('sigunguCd', params.regionCode);
  if (params.period) url.searchParams.set('dealYrMon', params.period);

  const response = await fetch(url.toString());
  return response.json();
}
