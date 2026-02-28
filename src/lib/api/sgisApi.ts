// SGIS 통계지리정보 API (통계청)
const BASE_URL = 'https://sgis.kostat.go.kr/OpenAPI3';

let accessToken: string | null = null;
let tokenExpiry = 0;

async function getAccessToken(): Promise<string> {
  if (accessToken && Date.now() < tokenExpiry) return accessToken;

  const key = process.env.SGIS_API_KEY;
  const secret = process.env.SGIS_API_SECRET;
  if (!key || !secret) throw new Error('SGIS API credentials not set');

  const url = `${BASE_URL}/auth/authentication.json?consumer_key=${key}&consumer_secret=${secret}`;
  const response = await fetch(url);
  const data = await response.json();

  accessToken = data.result.accessToken;
  tokenExpiry = Date.now() + 3600 * 1000; // 1 hour
  return accessToken!;
}

export async function getPopulationByRegion(regionCode: string) {
  const token = await getAccessToken();
  const url = `${BASE_URL}/stats/population.json?accessToken=${token}&adm_cd=${regionCode}`;

  const response = await fetch(url);
  return response.json();
}

export async function getAdminBoundary(regionCode: string) {
  const token = await getAccessToken();
  const url = `${BASE_URL}/boundary/hadmarea.geojson?accessToken=${token}&adm_cd=${regionCode}&low_search=0`;

  const response = await fetch(url);
  return response.json();
}
