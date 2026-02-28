// NEIS 학교기본정보 API
const BASE_URL = 'https://open.neis.go.kr/hub/schoolInfo';

export async function getSchoolInfo(params: { region?: string; schoolName?: string }) {
  const apiKey = process.env.NEIS_API_KEY;
  if (!apiKey) throw new Error('NEIS_API_KEY not set');

  const url = new URL(BASE_URL);
  url.searchParams.set('KEY', apiKey);
  url.searchParams.set('Type', 'json');
  url.searchParams.set('pIndex', '1');
  url.searchParams.set('pSize', '100');

  if (params.region) url.searchParams.set('ATPT_OFCDC_SC_CODE', params.region);
  if (params.schoolName) url.searchParams.set('SCHUL_NM', params.schoolName);

  const response = await fetch(url.toString());
  return response.json();
}
