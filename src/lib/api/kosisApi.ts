// KOSIS 통계청 OpenAPI
const BASE_URL = 'https://kosis.kr/openapi';

export async function getStatData(params: {
  orgId: string;
  tblId: string;
  objL1?: string;
  objL2?: string;
  prdSe?: string;
  startPrdDe?: string;
  endPrdDe?: string;
}) {
  const apiKey = process.env.KOSIS_API_KEY;
  if (!apiKey) throw new Error('KOSIS_API_KEY not set');

  const url = new URL(`${BASE_URL}/Param/statisticsParameterData.do`);
  url.searchParams.set('method', 'getList');
  url.searchParams.set('apiKey', apiKey);
  url.searchParams.set('format', 'json');
  url.searchParams.set('jsonVD', 'Y');
  url.searchParams.set('orgId', params.orgId);
  url.searchParams.set('tblId', params.tblId);

  if (params.objL1) url.searchParams.set('objL1', params.objL1);
  if (params.objL2) url.searchParams.set('objL2', params.objL2);
  if (params.prdSe) url.searchParams.set('prdSe', params.prdSe);
  if (params.startPrdDe) url.searchParams.set('startPrdDe', params.startPrdDe);
  if (params.endPrdDe) url.searchParams.set('endPrdDe', params.endPrdDe);

  const response = await fetch(url.toString());
  return response.json();
}
