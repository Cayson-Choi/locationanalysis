// 소상공인진흥공단 상가정보 API
const BASE_URL = 'https://apis.data.go.kr/B553077/api/open/sdsc2';

export interface SogisSearchParams {
  lat: number;
  lng: number;
  radius: number;
  page?: number;
  pageSize?: number;
}

export async function searchBusinessesByRadius(params: SogisSearchParams) {
  const apiKey = process.env.SOGIS_API_KEY;
  if (!apiKey) throw new Error('SOGIS_API_KEY not set');

  const url = new URL(`${BASE_URL}/storeListInRadius`);
  url.searchParams.set('serviceKey', apiKey);
  url.searchParams.set('pageNo', String(params.page ?? 1));
  url.searchParams.set('numOfRows', String(params.pageSize ?? 200));
  url.searchParams.set('radius', String(params.radius));
  url.searchParams.set('cx', String(params.lng));
  url.searchParams.set('cy', String(params.lat));
  url.searchParams.set('type', 'json');

  const response = await fetch(url.toString());
  if (!response.ok) throw new Error(`SOGIS API error: ${response.status}`);

  return response.json();
}
