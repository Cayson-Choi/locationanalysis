// 행정안전부 도로명주소 API
const BASE_URL = 'https://business.juso.go.kr/addrlink/addrLinkApi.do';

export interface AddressSearchResult {
  roadAddr: string;
  jibunAddr: string;
  zipNo: string;
  bdNm: string;
  siNm: string;
  sggNm: string;
  emdNm: string;
}

export async function searchAddress(keyword: string): Promise<AddressSearchResult[]> {
  const apiKey = process.env.MOIS_ADDRESS_API_KEY;
  if (!apiKey) throw new Error('MOIS_ADDRESS_API_KEY not set');

  const url = new URL(BASE_URL);
  url.searchParams.set('confmKey', apiKey);
  url.searchParams.set('currentPage', '1');
  url.searchParams.set('countPerPage', '10');
  url.searchParams.set('keyword', keyword);
  url.searchParams.set('resultType', 'json');

  const response = await fetch(url.toString());
  const data = await response.json();

  return data?.results?.juso?.map((item: Record<string, string>) => ({
    roadAddr: item.roadAddr,
    jibunAddr: item.jibunAddr,
    zipNo: item.zipNo,
    bdNm: item.bdNm,
    siNm: item.siNm,
    sggNm: item.sggNm,
    emdNm: item.emdNm,
  })) ?? [];
}
