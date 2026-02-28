// 네이버 Maps API
const BASE_URL = 'https://naveropenapi.apigw.ntruss.com/map-geocode/v2';

async function naverFetch(url: string) {
  const clientId = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID;
  const clientSecret = process.env.NAVER_MAP_CLIENT_SECRET;

  if (!clientId || !clientSecret) throw new Error('Naver API keys not set');

  const response = await fetch(url, {
    headers: {
      'X-NCP-APIGW-API-KEY-ID': clientId,
      'X-NCP-APIGW-API-KEY': clientSecret,
    },
  });

  if (!response.ok) throw new Error(`Naver API error: ${response.status}`);
  return response.json();
}

export async function geocode(address: string) {
  const url = `${BASE_URL}/geocoding?query=${encodeURIComponent(address)}`;
  return naverFetch(url);
}

export async function reverseGeocode(lat: number, lng: number) {
  const url = `https://naveropenapi.apigw.ntruss.com/map-reversegeocode/v2/gc?coords=${lng},${lat}&output=json`;
  return naverFetch(url);
}
