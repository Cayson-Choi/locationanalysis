// 국토교통부 실거래가 API
const BASE_URL = 'https://apis.data.go.kr/1613000';

export async function getApartmentTransactions(params: {
  regionCode: string;
  dealYear: string;
  dealMonth: string;
}) {
  const apiKey = process.env.MOLIT_API_KEY;
  if (!apiKey) throw new Error('MOLIT_API_KEY not set');

  const url = new URL(`${BASE_URL}/RTMSDataSvcAptTradeDev/getRTMSDataSvcAptTradeDev`);
  url.searchParams.set('serviceKey', apiKey);
  url.searchParams.set('pageNo', '1');
  url.searchParams.set('numOfRows', '100');
  url.searchParams.set('LAWD_CD', params.regionCode);
  url.searchParams.set('DEAL_YMD', `${params.dealYear}${params.dealMonth}`);

  const response = await fetch(url.toString());
  return response.json();
}

export async function getCommercialTransactions(params: {
  regionCode: string;
  dealYear: string;
  dealMonth: string;
}) {
  const apiKey = process.env.MOLIT_API_KEY;
  if (!apiKey) throw new Error('MOLIT_API_KEY not set');

  const url = new URL(`${BASE_URL}/RTMSDataSvcNrgTrade/getRTMSDataSvcNrgTrade`);
  url.searchParams.set('serviceKey', apiKey);
  url.searchParams.set('pageNo', '1');
  url.searchParams.set('numOfRows', '100');
  url.searchParams.set('LAWD_CD', params.regionCode);
  url.searchParams.set('DEAL_YMD', `${params.dealYear}${params.dealMonth}`);

  const response = await fetch(url.toString());
  return response.json();
}
