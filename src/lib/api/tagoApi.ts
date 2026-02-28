// TAGO 대중교통 정보 API
const BASE_URL = 'https://apis.data.go.kr/1613000/BusSttnInfoInqireService';

export async function getNearbyBusStops(lat: number, lng: number) {
  const apiKey = process.env.TAGO_API_KEY;
  if (!apiKey) throw new Error('TAGO_API_KEY not set');

  const url = new URL(`${BASE_URL}/getCrdntPrxmtSttnList`);
  url.searchParams.set('serviceKey', apiKey);
  url.searchParams.set('pageNo', '1');
  url.searchParams.set('numOfRows', '50');
  url.searchParams.set('gpsLati', String(lat));
  url.searchParams.set('gpsLong', String(lng));
  url.searchParams.set('_type', 'json');

  const response = await fetch(url.toString());
  return response.json();
}
