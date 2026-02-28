// 카카오 Local API
const BASE_URL = 'https://dapi.kakao.com/v2/local';

async function kakaoFetch(url: string) {
  const apiKey = process.env.KAKAO_REST_API_KEY;
  if (!apiKey) throw new Error('KAKAO_REST_API_KEY not set');

  const response = await fetch(url, {
    headers: { Authorization: `KakaoAK ${apiKey}` },
  });

  if (!response.ok) throw new Error(`Kakao API error: ${response.status}`);
  return response.json();
}

export async function geocode(address: string) {
  const url = `${BASE_URL}/search/address.json?query=${encodeURIComponent(address)}`;
  return kakaoFetch(url);
}

export async function reverseGeocode(lat: number, lng: number) {
  const url = `${BASE_URL}/geo/coord2address.json?x=${lng}&y=${lat}`;
  return kakaoFetch(url);
}

export async function searchPlace(keyword: string, lat?: number, lng?: number) {
  let url = `${BASE_URL}/search/keyword.json?query=${encodeURIComponent(keyword)}`;
  if (lat && lng) url += `&y=${lat}&x=${lng}&sort=distance`;
  return kakaoFetch(url);
}
