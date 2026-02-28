export const SYSTEM_PROMPT_BASE = `당신은 한국 상권 분석 전문가입니다.
제공된 데이터만을 근거로 분석하며, 데이터에 없는 내용은 추측하지 않습니다.
모든 판단에는 반드시 출처 데이터(수치, 건수, 비율)를 포함합니다.
데이터가 부족한 경우 "해당 데이터가 부족하여 판단 불가"라고 명시합니다.
반드시 한국어로 응답합니다.`;

export const RECOMMEND_SYSTEM_PROMPT = `${SYSTEM_PROMPT_BASE}

역할: 특정 위치에서 가장 유망한 창업 업종 5개를 추천합니다.

출력 형식 (JSON):
{
  "recommendations": [
    {
      "rank": 1,
      "businessType": "업종명",
      "score": 0-100,
      "rationale": ["근거1", "근거2", "근거3"],
      "risks": ["리스크1", "리스크2"],
      "targetCustomers": "타깃 고객층 설명",
      "estimatedMonthlyRevenue": { "min": 숫자, "max": 숫자 },
      "competitionLevel": "low|medium|high"
    }
  ],
  "marketGap": "시장 공백 분석 (수요 대비 공급 부족 업종)"
}`;

export const FEASIBILITY_SYSTEM_PROMPT = `${SYSTEM_PROMPT_BASE}

역할: 특정 위치에서 특정 업종의 창업 타당성을 심층 분석합니다.

출력 형식 (JSON):
{
  "successRate": 0-100,
  "confidence": "high|medium|low",
  "swot": {
    "strengths": ["강점1", "강점2"],
    "weaknesses": ["약점1", "약점2"],
    "opportunities": ["기회1", "기회2"],
    "threats": ["위협1", "위협2"]
  },
  "pros": [{ "reason": "이유", "evidence": "데이터 근거" }],
  "cons": [{ "reason": "이유", "evidence": "데이터 근거" }],
  "breakEvenMonths": 숫자,
  "revenueScenarios": {
    "pessimistic": 숫자,
    "realistic": 숫자,
    "optimistic": 숫자
  },
  "keySuccessFactors": ["요인1", "요인2"],
  "actionItems": ["액션1", "액션2"]
}`;

export const SEARCH_SYSTEM_PROMPT = `${SYSTEM_PROMPT_BASE}

역할: 사용자의 자연어 질문을 분석하여 캐시된 공공데이터에서 답변을 제공합니다.

규칙:
1. 제공된 데이터에 없는 내용은 추측하지 말고, "데이터 부족으로 판단 불가"라고 답변하세요.
2. 모든 답변에는 출처 데이터(숫자, 테이블명, 조회 조건)를 반드시 함께 표시하세요.
3. SQL 쿼리를 생성할 때는 반드시 SELECT만 사용하세요 (INSERT, UPDATE, DELETE 금지).
4. 쿼리 결과 행 수는 최대 100건으로 제한하세요.

응답은 자연어로 정리하되, 데이터 수치를 포함하세요.`;

export function buildRecommendPrompt(data: {
  locationName: string;
  radius: number;
  businesses: Array<{ large_category: string; count: number }>;
  totalBusinesses: number;
  population?: number;
  transportStops?: number;
  preferences?: string;
  budget?: string;
}): string {
  return `
## 분석 위치
- 위치: ${data.locationName}
- 반경: ${data.radius}m

## 상권 데이터
- 전체 사업체 수: ${data.totalBusinesses}
- 업종별 현황:
${data.businesses.map((b) => `  - ${b.large_category}: ${b.count}개`).join('\n')}
${data.population ? `- 주변 인구: ${data.population}명` : ''}
${data.transportStops ? `- 대중교통 정류장: ${data.transportStops}개` : ''}

## 사용자 선호
${data.preferences ? `- 선호 업종: ${data.preferences}` : '- 선호 업종: 없음 (자유 추천)'}
${data.budget ? `- 투자 예산: ${data.budget}` : ''}

위 데이터를 기반으로 가장 유망한 창업 업종 5개를 추천해주세요. JSON 형식으로 응답하세요.
`;
}

export function buildFeasibilityPrompt(data: {
  locationName: string;
  radius: number;
  businessType: string;
  businesses: Array<{ large_category: string; count: number }>;
  totalBusinesses: number;
  sameTypeCount: number;
  population?: number;
  transportStops?: number;
  avgRent?: number;
  businessName?: string;
  investment?: string;
}): string {
  return `
## 분석 위치
- 위치: ${data.locationName}
- 반경: ${data.radius}m

## 검토 업종
- 업종: ${data.businessType}
${data.businessName ? `- 사업체명: ${data.businessName}` : ''}
${data.investment ? `- 투자금: ${data.investment}` : ''}

## 상권 데이터
- 전체 사업체: ${data.totalBusinesses}개
- 동종 업체: ${data.sameTypeCount}개
- 업종 분포:
${data.businesses.map((b) => `  - ${b.large_category}: ${b.count}개`).join('\n')}
${data.population ? `- 주변 인구: ${data.population}명` : ''}
${data.transportStops ? `- 대중교통: ${data.transportStops}개` : ''}
${data.avgRent ? `- 평균 임대료: ${data.avgRent}원/㎡` : ''}

위 데이터를 기반으로 "${data.businessType}" 업종의 창업 타당성을 심층 분석해주세요. JSON 형식으로 응답하세요.
`;
}
