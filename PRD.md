# 상권분석 Pro - Product Requirements Document (PRD)

**문서 버전**: 1.0
**작성일**: 2026-02-28
**소유권**: © 2026 CASON TECH. All rights reserved.

---

## 1. 제품 개요

### 1.1 제품명
**상권분석 Pro**

### 1.2 제품 요약
전국 상권/입지를 분석하는 상용 웹 애플리케이션. 정부 공공데이터 API와 AI(Gemini)를 활용하여 특정 위치의 상권 현황을 분석하고, 최적의 창업 업종을 추천하며, 특정 업종의 성공/실패 가능성을 구체적 근거와 함께 제시한다.

### 1.3 핵심 가치 제안
- **데이터 기반 의사결정**: 감이 아닌 실제 정부 공공데이터로 상권 분석
- **AI 기반 인사이트**: Gemini AI가 데이터를 종합하여 창업 추천 및 타당성 판단
- **무료 서비스**: 모든 기능 무료 제공
- **전국 커버리지**: 서울뿐 아니라 전국 모든 지역 분석 가능

### 1.4 대상 사용자
- 소상공인 창업 준비자
- 프랜차이즈 입점 담당자
- 부동산 투자자 / 상가 임대인
- 상권 분석이 필요한 컨설턴트
- 지역 경제 연구자

---

## 2. 기술 스택

| 구분 | 기술 | 선정 이유 |
|---|---|---|
| 프레임워크 | **Next.js 14+ (App Router) + TypeScript** | SSR/SSG로 SEO 최적, API Routes로 백엔드 통합 |
| UI 라이브러리 | **Tailwind CSS + shadcn/ui** | 상용 품질 디자인 시스템, 다크/라이트 테마 지원 |
| 지도 | **카카오맵 JS SDK + 네이버맵 JS SDK** | 추상화 레이어로 사용자 선택 전환 가능 |
| 상태관리 | **Zustand** | 경량, TypeScript 친화적, 지도/분석 상태 관리 |
| DB/인증 | **Supabase (PostgreSQL + PostGIS + Auth)** | 무료 티어, 공간 쿼리, OAuth 지원 |
| AI | **Google Gemini API (2.5 Flash / Flash-Lite)** | 무료 티어, SSE 스트리밍, 대형 컨텍스트 윈도우 |
| 차트/시각화 | **Recharts** | React 네이티브, 반응형, 무료 |
| 다국어 | **next-intl** | Next.js App Router 최적 통합 |
| 테마 | **next-themes** | 다크/라이트 전환, system 감지 |
| 배포 | **Vercel** | Next.js 최적화, 무료 티어, Edge Functions |

---

## 3. 데이터 소스 (무료 API)

### 3.1 공공데이터포털 (data.go.kr) 기반

| # | API명 | 제공기관 | 주요 데이터 | 일일 한도 | TTL(캐시) |
|---|---|---|---|---|---|
| 1 | **소상공인진흥공단 상가정보** | 소상공인시장진흥공단 | 전국 사업체 위치, 업종 대/중/소분류, 반경/사각형/다각형 검색 | 1,000(개발) → 10만(운영) | 7일 |
| 2 | **국토교통부 실거래가** | 국토교통부 | 아파트/상가 매매가, 전월세, 건축연도, 층 | 10,000 | 30일 |
| 3 | **한국부동산원 상업용 임대동향** | 한국부동산원 | 상가 공실률, 임대료(㎡당), 수익률, 층별 효용비율 | 1,000 | 90일 |
| 4 | **TAGO 대중교통 정보** | 국토교통부 | 버스정류장 위치, 노선정보, 도착정보 | 10,000 | 30일 |
| 5 | **전국 학원/교습소 표준데이터** | 교육부/시도교육청 | 학원명, 위치, 과목, 정원, 등록상태 | 파일 다운로드 | 14일 |

### 3.2 기타 정부/공공 API

| # | API명 | 제공기관 | 주요 데이터 | 일일 한도 | TTL(캐시) |
|---|---|---|---|---|---|
| 6 | **SGIS 통계지리정보** | 통계청(국가데이터처) | 인구총조사, 사업체센서스, 행정경계, 생활업종 분석 | 명시 없음 | 30일 |
| 7 | **KOSIS 통계청 OpenAPI** | 통계청 | 28만+ 통계표, 사업체/인구/경제활동 통계 | 1,000 | 30일 |
| 8 | **NEIS 학교기본정보** | 교육부/KERIS | 전국 초중고 위치, 학생수, 설립연도 | 명시 없음 | 30일 |
| 9 | **행안부 도로명주소** | 행정안전부 | 도로명주소 텍스트 검색, 자동완성 | **무제한** | - |
| 10 | **서울 열린데이터광장** | 서울시 | 생활인구(유동인구), 상권 매출, 지하철 승하차 | 1,000 | 14일 |

### 3.3 지도/좌표 API

| # | API명 | 제공사 | 주요 기능 | 일일 한도 |
|---|---|---|---|---|
| 11 | **카카오 Local API** | 카카오 | Geocoding, 장소검색, 카테고리검색, 지도 JS SDK | 10만건/일, 지도 30만건/일 |
| 12 | **네이버 Maps API** | 네이버 클라우드 | 지도 JS SDK, Geocoding, Reverse Geocoding | 대표 계정 무료량 |

### 3.4 AI API

| # | 모델 | 용도 | RPD | RPM | TPM |
|---|---|---|---|---|---|
| 13 | **Gemini 2.5 Flash-Lite** | 대량 분류, 간단 분석, 업종 추천 | 1,000 | 15 | 250,000 |
| 14 | **Gemini 2.5 Flash** | 심층 분석, 타당성 검토 리포트 | 250 | 10 | 250,000 |
| 15 | **Gemini 2.5 Pro** | 고품질 단건 분석 (필요 시) | 100 | 5 | 250,000 |

---

## 4. 기능 명세

### 4.1 인증 시스템

| 기능 | 상세 |
|---|---|
| 이메일/비밀번호 회원가입 | Supabase Auth, 이메일 인증 |
| 소셜 로그인 | 카카오 OAuth, 구글 OAuth |
| 프로필 관리 | 이름, 아바타, 선호 언어, 테마 설정 |
| 세션 관리 | Supabase 세션, middleware 자동 갱신 |

### 4.2 지도 탐색기 (Explore)

**목적**: 전국 어디든 위치를 선택하여 주변 상권을 시각적으로 탐색

| 기능 | 상세 |
|---|---|
| **지도 제공자 전환** | 카카오맵 ↔ 네이버맵 실시간 전환 (Adapter 패턴) |
| **주소 검색** | 도로명주소 API 기반 자동완성 (디바운스 300ms) |
| **현위치** | Geolocation API로 현재 위치 중심 |
| **반경 설정** | 슬라이더로 100m~2,000m 분석 반경 조절 |
| **사업체 마커** | 업종별 색상 구분 마커, 줌 레벨별 클러스터링 |
| **학교 레이어** | 초/중/고 아이콘 오버레이 (토글) |
| **학원 레이어** | 학원/교습소 오버레이 (토글) |
| **교통 레이어** | 버스정류장/지하철역 오버레이 (토글) |
| **인구 히트맵** | 행정동 단위 인구밀도 히트맵 (토글) |
| **마커 정보 패널** | 마커 클릭 시 사업체 상세 정보 + "분석하기" 버튼 |
| **범례** | 업종별 색상 + 레이어 아이콘 범례 |

### 4.3 상권 분석 리포트 (Analysis)

**목적**: 선택 지점의 종합적인 상권 현황 데이터 리포트

| 탭 | 분석 내용 | 시각화 |
|---|---|---|
| **업종 분석** | 업종별 사업체 수, 분포, 밀집도, 상위 10개 업종 | 파이차트 + 가로 바차트 |
| **인구 분석** | 상주인구, 연령대 분포, 성비, 가구 수, 유동인구 | 피라미드 차트 + 시간대별 막대그래프 |
| **임대료/부동산** | 평균 임대료(㎡), 공실률 추이, 실거래가 내역 | 라인차트 + 거래 목록 |
| **교통/접근성** | 대중교통 정류소 수, 도보 거리, 접근성 점수 | 정류소 목록 + 점수 카드 |
| **경쟁 분석** | 동종 업체 수, 경쟁 밀도, 포화도 | 경쟁 매트릭스 |

**부가 기능**:
- 데이터 신선도 배지 (초록=신선, 주황=오래됨, 빨강=만료)
- 데이터 신뢰도 배지 (사용 가능한 데이터 소스 비율)
- 리포트 저장 / PDF 내보내기

### 4.4 AI 업종 추천 (Recommend)

**목적**: "이 자리에 뭘 열면 좋을까?"에 대한 AI 기반 답변

| 항목 | 상세 |
|---|---|
| **입력** | 위치 (지도 선택 또는 주소 검색), 반경, 선호 업종(선택), 투자 예산(선택) |
| **분석 과정** | 상권 데이터 자동 수집 → Gemini Flash-Lite로 분석 → SSE 스트리밍 |
| **출력** | 상위 5개 추천 업종, 각각의: |
| | - 성공 점수 (0-100) |
| | - 추천 근거 (데이터 기반 3-5가지) |
| | - 리스크 요인 |
| | - 타깃 고객층 |
| | - 예상 월 매출 범위 |
| | - 경쟁 강도 |
| **추가 분석** | 시장 공백(수요 대비 공급 부족 업종) 분석 |

### 4.5 AI 창업 타당성 검토 (Feasibility)

**목적**: "여기서 카페를 열면 될까?"에 대한 심층 AI 분석

| 항목 | 상세 |
|---|---|
| **입력** | 위치, 반경, 업종(필수), 사업체명(선택), 투자금(선택) |
| **분석 과정** | 해당 업종 특화 데이터 수집 → 경쟁 분석 → Gemini Flash 심층 분석 → SSE 스트리밍 |
| **출력**: |
| 성공 확률 | 0-100% 게이지 차트 (중앙 배치, 큰 크기) |
| 신뢰도 | high / medium / low 배지 |
| SWOT 분석 | 4분면 매트릭스 (강점/약점/기회/위협) |
| 잘 될 이유 | 데이터 근거 포함 구체적 이유 목록 |
| 안 될 이유 | 데이터 근거 포함 구체적 위험 목록 |
| 손익분기점 | 예상 BEP 도달 개월 수 |
| 매출 추정 | 비관적 / 현실적 / 낙관적 시나리오 |
| 핵심 성공 요인 | 반드시 충족해야 할 조건 목록 |
| 실행 추천사항 | 구체적 액션 아이템 |

### 4.6 지역 비교 (Compare)

**목적**: 최대 3개 지역을 나란히 비교하여 최적 입지 선정

| 항목 | 상세 |
|---|---|
| **입력** | 2~3개 위치 선택 (지도 또는 주소) |
| **비교 항목** | 사업체 수, 인구, 유동인구, 임대료, 접근성, 경쟁밀도 |
| **시각화** | 비교 테이블 (나란히) + 레이더 차트 (다차원) |
| **AI 판단** | 종합 우위 분석 + 위치별 장단점 요약 |

### 4.7 AI 데이터 검색 어시스턴트 (AI Search)

**목적**: 자연어로 질문하면 DB에 축적된 전국 상권 데이터를 검색·분석하여 답변

| 항목 | 상세 |
|---|---|
| **UI** | 대시보드 상단 또는 전용 페이지에 검색창 배치. 채팅형 인터페이스로 질문-답변 표시 |
| **입력** | 자연어 질문 (한국어/영어) |
| **처리 흐름** | 사용자 질문 → Gemini가 질문 의도 파악 → 적절한 DB 쿼리 생성 → DB 실행 → 결과를 Gemini가 자연어로 정리 → 답변 |
| **출력** | 텍스트 답변 + 관련 데이터 테이블/차트 + 지도 위 결과 표시 (해당 시) |

#### 질문 예시

| 카테고리 | 질문 예시 |
|---|---|
| **부동산 검색** | "전국에서 가장 싼 아파트는 어디야?", "강남구 상가 평균 임대료 얼마야?" |
| **상권 탐색** | "카페가 가장 밀집된 동네 Top 10", "학원이 가장 많은 지역은?" |
| **경쟁 분석** | "서울에서 치킨집이 가장 적은 동네는?", "편의점 대비 인구가 가장 많은 곳은?" |
| **인구 분석** | "20대 인구 비율이 가장 높은 지역은?", "1인 가구가 가장 많은 동네는?" |
| **교통 분석** | "지하철역에서 도보 5분 이내 상가가 가장 많은 곳은?" |
| **입지 추천** | "향남에서 세탁소를 개업하면 어디가 좋을지 추천해줘", "수원에서 카페 열기 좋은 위치 분석해줘" |
| **복합 질문** | "임대료 저렴하고 유동인구 많은 곳에서 카페 열기 좋은 곳 추천해줘" |

#### 기술 구현

```
사용자 질문
    ↓
Gemini (질문 의도 분석 + SQL/쿼리 생성)
    ↓
┌─ 단순 조회: DB 쿼리 실행 → 결과 반환
├─ 복합 분석: 여러 캐시 테이블 조인 → 집계 → 결과 반환
└─ 캐시 미스: 필요한 데이터가 DB에 없으면 → 외부 API 호출 → 캐시 저장 → 재쿼리
    ↓
Gemini (결과를 자연어 답변으로 정리)
    ↓
SSE 스트리밍으로 답변 + 데이터 시각화 (테이블/차트/지도 핀)
```

#### 데이터 기반 원칙 (중요)
- **AI는 DB에 캐시된 공공데이터만을 근거로 답변한다.** AI가 자체 지식이나 인터넷 검색으로 답변하지 않는다.
- 모든 답변에는 **출처 데이터(숫자, 테이블명, 조회 조건)를 반드시 함께 표시**한다.
- Gemini의 역할은 "데이터 해석 및 정리"이지, "의견 제시"가 아니다.
- DB에 해당 지역 데이터가 없으면 "해당 지역 데이터가 아직 수집되지 않았습니다. 먼저 지도 탐색기에서 해당 지역을 조회해주세요."라고 안내한다.
- 프롬프트에 "제공된 데이터에 없는 내용은 추측하지 말고, 데이터 부족으로 판단 불가라고 답변하세요"를 명시한다.

#### 안전장치
- Gemini가 생성한 쿼리는 **읽기 전용(SELECT)만 허용**, 쓰기/삭제 쿼리 차단
- 쿼리 실행 시간 제한 (5초 타임아웃)
- 결과 행 수 제한 (최대 100건)
- 사용자당 분당 5회 질문 제한

#### 대화 히스토리
- 이전 질문-답변을 컨텍스트로 유지하여 후속 질문 가능
- 예: "서울에서 카페 많은 곳은?" → "거기 임대료는?" (이전 결과 지역 참조)
- 세션당 최대 20턴, 대화 내역 저장 가능

### 4.8 저장된 리포트 (Saved)

| 기능 | 상세 |
|---|---|
| 리포트 목록 | 타입별 필터 (상권분석/추천/타당성/비교) |
| 리포트 재조회 | 저장 당시 데이터 + 최신 데이터 비교 가능 |
| 리포트 삭제 | 본인 리포트만 삭제 가능 (RLS) |
| PDF 내보내기 | 리포트를 PDF로 다운로드 |

---

## 5. 지도 추상화 아키텍처

### 5.1 Adapter 패턴

카카오맵과 네이버맵을 동일한 인터페이스로 추상화하여, 사용자가 설정에서 실시간으로 전환 가능.

```
MapAdapter (인터페이스)
├── initialize(container, options)
├── setCenter(lat, lng)
├── setZoom(level)
├── addMarker(options) → MarkerInstance
├── removeMarker(marker)
├── addCircle(options) → CircleInstance
├── addClusterer(markers)
├── addEventListener(event, handler)
├── getBounds() → MapBounds
└── destroy()

KakaoMapAdapter (구현체) ─ 카카오맵 SDK
NaverMapAdapter (구현체) ─ 네이버맵 SDK
```

### 5.2 MapContainer 컴포넌트

```
MapContainer.tsx
├── uiStore에서 mapProvider 설정 읽기
├── 동적 import로 해당 Provider 로드 (SSR 비활성화)
├── 마커/레이어 컴포넌트는 Provider 독립적
└── 전환 시 현재 center/zoom 유지
```

### 5.3 사용자 전환 UX
- Header 또는 지도 컨트롤에 지도 전환 버튼 배치
- 전환 시 현재 보고 있는 위치와 줌 레벨 유지
- 마커/레이어 자동 재렌더링

---

## 6. 데이터베이스 설계

### 6.1 PostGIS 공간 확장
- 모든 위치 데이터는 `GEOMETRY(Point, 4326)` 타입 (WGS84 좌표계)
- GIST 인덱스로 공간 쿼리 성능 보장
- `ST_DWithin()` 함수로 반경 검색

### 6.2 핵심 테이블

**서비스 테이블**:
| 테이블 | 용도 | RLS |
|---|---|---|
| `profiles` | 사용자 프로필 (Auth 확장) | 본인만 읽기/수정 |
| `reports` | 저장된 분석 리포트 | 본인 CRUD + 공개 리포트 읽기 |
| `comparison_reports` | 지역 비교 리포트 | 본인 CRUD |
| `usage_logs` | 사용 기록 (유료화 대비) | 본인만 읽기 |

**캐시 테이블** (PostGIS 공간 인덱스):
| 테이블 | 데이터 소스 | TTL | 공간 인덱스 |
|---|---|---|---|
| `cache_businesses` | 소상공인진흥공단 | 7일 | GIST(location) |
| `cache_schools` | NEIS | 30일 | GIST(location) |
| `cache_academies` | 학원/교습소 표준데이터 | 14일 | GIST(location) |
| `cache_transit_stops` | TAGO | 30일 | GIST(location) |
| `cache_population_stats` | SGIS/KOSIS | 30일 | GIST(region_geom) |
| `cache_floating_population` | 서울 열린데이터 등 | 14일 | - |
| `cache_rent_trends` | 한국부동산원 | 90일 | - |
| `cache_real_estate_transactions` | 국토부 | 30일 | GIST(location) |
| `cache_coverage` | 캐시 범위 추적 | - | GIST(covered_area) |
| `api_request_log` | API 호출 기록 | - | - |

### 6.3 캐시 전략 (Cache-First + Stale-While-Revalidate)

#### 핵심 원칙
**외부 API 호출은 "해당 지역이 처음 요청될 때" 단 한 번만 발생한다.**
이후 동일 지역에 대한 모든 요청은 DB에서 직접 처리하므로, 일일 API 호출 한도와 무관하게 서비스할 수 있다. 사용자가 늘어나고 시간이 지날수록 전국이 점진적으로 캐시되어, 외부 API 호출은 갈수록 줄어든다.

#### 플로우

```
요청 → cache_coverage 공간 쿼리 (PostGIS ST_Covers)
  ├─ 캐시 히트 + 신선(TTL 이내) → DB 공간 쿼리로 즉시 반환 (외부 API 호출 0회)
  ├─ 캐시 히트 + 만료(TTL 초과) → 오래된 캐시 즉시 반환 + 백그라운드에서 외부 API 갱신
  └─ 캐시 미스 → 외부 API 호출 → DB에 저장 → cache_coverage에 커버 영역 기록 → 반환
```

#### 공간 캐시 커버리지 (cache_coverage)

`cache_coverage` 테이블은 **이미 캐시된 지리적 영역**을 폴리곤으로 기록한다. 이를 통해 더 작은 범위의 요청은 추가 API 호출 없이 DB 공간 쿼리만으로 처리한다.

```
예시:
  사용자 A: "강남역 반경 500m 상가 조회"
    → DB에 없음 (캐시 미스)
    → 소상공인진흥공단 API 호출 → 결과 DB 저장
    → cache_coverage에 "강남역 중심 500m 원형" 영역 기록
    → API 호출 1회 소모

  사용자 B: "강남역 반경 500m 상가 조회" (같은 날 또는 TTL 이내)
    → cache_coverage에서 해당 영역 발견 (캐시 히트)
    → DB 공간 쿼리(ST_DWithin)로 즉시 반환
    → API 호출 0회

  사용자 C: "강남역 반경 300m 상가 조회"
    → 이미 500m 범위가 캐시됨 → 500m 캐시가 300m를 완전히 포함 (ST_Covers)
    → DB 공간 쿼리로 300m 범위만 필터링하여 반환
    → API 호출 0회

  사용자 D: "강남역 반경 1000m 상가 조회"
    → 500m만 캐시됨, 1000m는 미충족 (캐시 부분 히트)
    → 부족한 외곽 영역만 추가 API 호출 → DB 저장 → 커버리지 확장
    → 또는 단순화: 1000m 전체를 새로 호출하여 캐시 갱신
```

#### 일일 API 한도 대비 충분성

| API | 일일 한도 | 1회 호출로 캐시되는 양 | 실질 영향 |
|---|---|---|---|
| 소상공인 상가정보 | 1,000건(개발) / 10만(운영) | 한 반경 내 전체 상가 (수십~수백 개) | 하루에 수백 개 지역 캐시 가능 |
| 국토부 실거래가 | 10,000건 | 법정동 단위 → 한번 저장하면 30일 유효 | 충분 |
| KOSIS 통계 | 1,000건 | 행정동 단위 → 한번 저장하면 30일 유효 | 충분 |
| 한국부동산원 | 1,000건 | 지역 단위 → 한번 저장하면 90일 유효 | 충분 |

서비스 초기에 주요 상권(서울 주요 역세권, 광역시 중심가 등)을 사전 캐싱(pre-warm)하여, 초기 사용자도 빠른 응답을 받을 수 있도록 한다.

#### AI 결과 캐시

Gemini AI 분석은 매번 호출이 필요하나, **동일 위치 + 동일 업종 + 동일 반경** 조합의 AI 결과를 `reports` 테이블에 저장하여 24시간 이내 동일 조건 요청 시 저장된 결과를 반환한다. 이를 통해 Gemini 무료 티어 한도(Flash-Lite 1,000건/일, Flash 250건/일) 내에서 충분히 운영 가능하다.

#### 데이터 신선도 표시 (TTL별)

| 데이터 | TTL | 갱신 주기 이유 |
|---|---|---|
| 사업체(상가) | 7일 | 개폐업 빈도 고려 |
| 학교 | 30일 | 변동 거의 없음 |
| 학원/교습소 | 14일 | 중간 빈도 변동 |
| 대중교통 | 30일 | 노선 변경 드묾 |
| 인구 통계 | 30일 | 월 단위 갱신 |
| 유동인구 | 14일 | 계절/기간 변동 |
| 임대동향 | 90일 | 분기별 발표 |
| 실거래가 | 30일 | 월 단위 신고 |

UI에서 각 데이터 항목 옆에 신선도 배지를 표시한다:
- **초록** (Fresh): TTL 50% 이내
- **주황** (Stale): TTL 이내이나 50% 초과
- **빨강** (Expired): TTL 초과 (백그라운드 갱신 중)

---

## 7. AI 통합 설계

### 7.1 모델 선택 전략

| 기능 | 모델 | 이유 |
|---|---|---|
| 업종 추천 | Gemini 2.5 Flash-Lite | 높은 RPD(1,000), 빠른 응답, 구조화 분류 |
| 타당성 분석 | Gemini 2.5 Flash | 깊은 추론, SWOT 산출, 중간 RPD(250) |
| 고품질 단건 | Gemini 2.5 Pro | 최고 품질 (필요 시, RPD 100) |

### 7.2 프롬프트 설계 원칙
- **데이터 기반 전용**: AI의 모든 판단은 DB에 캐시된 공공데이터에만 근거한다. AI 자체 지식이나 인터넷 정보로 답변하지 않는다.
- **시스템 역할**: 한국 상권 분석 전문가 (제공된 데이터만 분석)
- **컨텍스트 데이터**: 실제 수집된 상권 데이터를 구조화하여 프롬프트에 주입
- **출력 형식**: JSON 구조 강제 (파싱 안정성)
- **근거 필수**: 모든 판단에 출처 데이터(수치, 건수, 비율)를 반드시 포함
- **제약 조건**: 과도한 낙관/비관 금지, 데이터에 없는 내용 추측 금지
- **데이터 부족 시**: "해당 데이터가 부족하여 판단 불가"라고 명시 (추측으로 채우지 않음)
- **언어**: 한국어 응답 강제

### 7.3 스트리밍 응답 (SSE)
- Server-Sent Events로 실시간 텍스트 스트리밍
- 프론트엔드에서 타이핑 효과로 렌더링
- 완료 후 JSON 파싱 → 시각적 컴포넌트 렌더링

### 7.4 Rate Limiting
| 엔드포인트 | 분당 제한 |
|---|---|
| `/api/ai/recommend` | 5회 |
| `/api/ai/feasibility` | 5회 |
| `/api/ai/search` | 5회 |
| `/api/map/businesses` | 30회 |
| `/api/analysis/district` | 10회 |

---

## 8. UI/UX 설계

### 8.1 디자인 시스템
- **다크/라이트 테마**: next-themes 기반, system 감지 지원
- **컴포넌트**: shadcn/ui (Radix UI 기반, 접근성 내장)
- **반응형**: 모바일 → 태블릿 → 데스크톱 (Tailwind breakpoints)
- **폰트**: Pretendard (한국어) + Inter (영어)

### 8.2 페이지 구조

```
/ (랜딩)
├── 히어로 섹션 (검색바 + 퀵 액션 카드)
├── 기능 소개 섹션
├── 사용 방법 섹션
└── 푸터 (© CASON TECH)

/explore (지도 탐색기)
├── 풀스크린 카카오/네이버 지도
├── 상단 검색바
├── 우측 레이어 컨트롤
└── 마커 클릭 시 정보 패널

/analysis (상권 분석)
├── 위치 선택 → 분석 시작
└── /analysis/[reportId] (리포트 상세)
    ├── 요약 카드 (4개 핵심 지표)
    └── 탭: 업종 | 인구 | 임대료 | 교통 | AI인사이트

/recommend (AI 업종 추천)
├── 위치 + 선호도 입력
└── 스트리밍 AI 결과 (추천 카드 5개)

/feasibility (AI 타당성 검토)
├── 스텝 1: 위치 선택
├── 스텝 2: 업종 입력
├── 스텝 3: 분석 중 (프로그레스)
└── 결과 대시보드 (성공확률 게이지 + SWOT)

/compare (지역 비교)
├── 2-3개 위치 선택
└── 나란히 비교 테이블 + 레이더 차트

/search (AI 데이터 검색)
├── 검색창 + 채팅형 대화 인터페이스
├── 자연어 질문 → AI가 DB 쿼리 → 결과 답변
├── 결과에 테이블/차트/지도 핀 시각화
└── 대화 히스토리 유지 (후속 질문 가능)

/saved (저장된 리포트)
└── 리포트 목록 (필터/정렬)
```

### 8.3 다국어 (i18n)
- 지원 언어: 한국어 (ko), 영어 (en)
- 기본 언어: 한국어
- URL 구조: `/ko/explore`, `/en/explore`
- 헤더에 언어 전환 버튼

---

## 9. 프로젝트 구조

```
sangkwon-pro/
├── .env.local / .env.example
├── next.config.ts
├── tailwind.config.ts
├── middleware.ts
├── messages/
│   ├── ko.json
│   └── en.json
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx                    # 랜딩
│   │   │   ├── (auth)/
│   │   │   │   ├── login/page.tsx
│   │   │   │   ├── signup/page.tsx
│   │   │   │   └── callback/page.tsx
│   │   │   └── (dashboard)/
│   │   │       ├── layout.tsx
│   │   │       ├── explore/page.tsx
│   │   │       ├── analysis/
│   │   │       │   ├── page.tsx
│   │   │       │   └── [reportId]/page.tsx
│   │   │       ├── recommend/page.tsx
│   │   │       ├── feasibility/page.tsx
│   │   │       ├── compare/page.tsx
│   │   │       ├── search/page.tsx              # AI 데이터 검색
│   │   │       └── saved/page.tsx
│   │   └── api/
│   │       ├── auth/callback/route.ts
│   │       ├── map/
│   │       │   ├── businesses/route.ts
│   │       │   ├── schools/route.ts
│   │       │   ├── academies/route.ts
│   │       │   ├── transport/route.ts
│   │       │   └── population-heat/route.ts
│   │       ├── analysis/
│   │       │   ├── district/route.ts
│   │       │   ├── rent/route.ts
│   │       │   ├── realestate/route.ts
│   │       │   └── competition/route.ts
│   │       ├── ai/
│   │       │   ├── recommend/route.ts
│   │       │   ├── feasibility/route.ts
│   │       │   └── search/route.ts          # AI 데이터 검색
│   │       ├── address/search/route.ts
│   │       └── reports/
│   │           ├── route.ts
│   │           └── [reportId]/route.ts
│   ├── components/
│   │   ├── ui/                          # shadcn/ui
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── ThemeToggle.tsx
│   │   │   ├── LanguageSwitcher.tsx
│   │   │   └── MapProviderSwitcher.tsx
│   │   ├── map/
│   │   │   ├── MapContainer.tsx         # 추상화 컨테이너
│   │   │   ├── providers/
│   │   │   │   ├── KakaoMapProvider.tsx
│   │   │   │   └── NaverMapProvider.tsx
│   │   │   ├── MapControls.tsx
│   │   │   ├── BusinessMarkers.tsx
│   │   │   ├── SchoolLayer.tsx
│   │   │   ├── AcademyLayer.tsx
│   │   │   ├── TransportLayer.tsx
│   │   │   ├── PopulationHeatmap.tsx
│   │   │   ├── RadiusCircle.tsx
│   │   │   └── MapLegend.tsx
│   │   ├── analysis/
│   │   │   ├── DistrictOverview.tsx
│   │   │   ├── IndustryChart.tsx
│   │   │   ├── PopulationChart.tsx
│   │   │   ├── RentTrendChart.tsx
│   │   │   ├── CompetitionMatrix.tsx
│   │   │   └── ReportPDFExport.tsx
│   │   ├── ai/
│   │   │   ├── RecommendationPanel.tsx
│   │   │   ├── FeasibilityReport.tsx
│   │   │   ├── StreamingText.tsx
│   │   │   ├── ScoreGauge.tsx
│   │   │   ├── SWOTMatrix.tsx
│   │   │   ├── SearchChat.tsx               # AI 검색 채팅 UI
│   │   │   ├── SearchResultCard.tsx         # 검색 결과 카드
│   │   │   └── SearchMapPins.tsx            # 검색 결과 지도 핀
│   │   ├── compare/
│   │   │   ├── ComparisonTable.tsx
│   │   │   └── RadarChart.tsx
│   │   └── auth/
│   │       ├── LoginForm.tsx
│   │       ├── SignupForm.tsx
│   │       └── SocialLoginButtons.tsx
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts
│   │   │   ├── server.ts
│   │   │   └── middleware.ts
│   │   ├── api/                         # 외부 API 클라이언트
│   │   │   ├── sogisApi.ts
│   │   │   ├── sgisApi.ts
│   │   │   ├── kosisApi.ts
│   │   │   ├── neisApi.ts
│   │   │   ├── molitApi.ts
│   │   │   ├── krebApi.ts
│   │   │   ├── addressApi.ts
│   │   │   ├── tagoApi.ts
│   │   │   ├── kakaoApi.ts
│   │   │   └── naverApi.ts
│   │   ├── map/
│   │   │   ├── mapAdapter.ts            # 추상화 인터페이스
│   │   │   ├── kakaoAdapter.ts
│   │   │   └── naverAdapter.ts
│   │   ├── gemini/
│   │   │   ├── client.ts
│   │   │   ├── prompts.ts
│   │   │   ├── recommend.ts
│   │   │   └── feasibility.ts
│   │   ├── cache/
│   │   │   ├── cacheManager.ts
│   │   │   └── freshness.ts
│   │   ├── rate-limit/
│   │   │   └── rateLimiter.ts
│   │   └── utils/
│   │       ├── formatters.ts
│   │       ├── constants.ts
│   │       └── validators.ts
│   ├── hooks/
│   │   ├── useMap.ts
│   │   ├── useGeolocation.ts
│   │   ├── useAnalysis.ts
│   │   ├── useAIStream.ts
│   │   └── useDebounce.ts
│   ├── stores/
│   │   ├── mapStore.ts
│   │   ├── analysisStore.ts
│   │   └── uiStore.ts
│   ├── types/
│   │   ├── api.ts
│   │   ├── business.ts
│   │   ├── analysis.ts
│   │   ├── map.ts
│   │   └── database.ts
│   └── i18n/
│       ├── config.ts
│       └── request.ts
├── public/
│   ├── markers/
│   └── icons/
└── supabase/
    └── migrations/
        ├── 001_init_schema.sql
        ├── 002_spatial_indexes.sql
        └── 003_rls_policies.sql
```

---

## 10. 환경변수

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# 카카오
NEXT_PUBLIC_KAKAO_MAP_KEY=          # JavaScript 키
KAKAO_REST_API_KEY=                  # REST API 키

# 네이버
NEXT_PUBLIC_NAVER_MAP_CLIENT_ID=     # Client ID
NAVER_MAP_CLIENT_SECRET=             # Client Secret

# 구글 OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Gemini AI
GEMINI_API_KEY=

# 공공데이터 API (data.go.kr)
SOGIS_API_KEY=                       # 소상공인진흥공단
MOLIT_API_KEY=                       # 국토교통부
KREB_API_KEY=                        # 한국부동산원
TAGO_API_KEY=                        # TAGO 대중교통

# 기타 정부 API
SGIS_API_KEY=                        # SGIS
SGIS_API_SECRET=                     # SGIS Secret
KOSIS_API_KEY=                       # KOSIS 통계청
NEIS_API_KEY=                        # NEIS 학교정보
MOIS_ADDRESS_API_KEY=                # 도로명주소

# 앱 설정
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_DEFAULT_LOCALE=ko
```

---

## 11. 구현 로드맵

### Phase 1: 프로젝트 기반 구축
- Next.js 프로젝트 초기화 + TypeScript + Tailwind + shadcn/ui
- next-intl (한국어/영어) + next-themes (다크/라이트)
- Supabase 설정 (Auth + DB 스키마: profiles, usage_logs)
- 인증 플로우 (이메일 + 카카오 + 구글 OAuth)
- 기본 레이아웃 (Header, Sidebar, Footer with © CASON TECH)
- 랜딩 페이지
- **검증**: Vercel 배포, 로그인/회원가입, 테마/언어 전환 작동

### Phase 2: 지도 탐색기
- 지도 추상화 레이어 (MapAdapter 인터페이스)
- 카카오맵 Provider + 네이버맵 Provider 구현
- 지도 전환 UI (MapProviderSwitcher)
- 소상공인진흥공단 API 연동 + cache_businesses + cache_coverage
- 학교(NEIS) + 학원 + 교통(TAGO) API 연동 + 캐시 테이블
- 주소 검색 자동완성 (도로명주소 API)
- 업종별 마커 + 클러스터링 + 레이어 토글
- **검증**: 전국 주요 지점 검색 → 마커 표시 → 카카오/네이버 전환

### Phase 3: 상권 분석 리포트
- SGIS/KOSIS 인구통계 API 연동
- 한국부동산원 임대동향 + 국토부 실거래가 API 연동
- 상권 분석 집계 엔진 (POST /api/analysis/district)
- Recharts 차트 컴포넌트 (업종/인구/임대료/유동인구)
- 리포트 저장/조회 CRUD (RLS 적용)
- 데이터 신선도/신뢰도 배지
- **검증**: 지점 선택 → 종합 상권 리포트 생성, 저장/재조회

### Phase 4: AI 분석 기능
- Gemini 클라이언트 + 프롬프트 템플릿
- 업종 추천 (SSE 스트리밍 + StreamingText + ScoreGauge)
- 타당성 분석 (스텝 폼 + SWOTMatrix + 성공확률 게이지)
- AI 데이터 검색 어시스턴트 (채팅형 UI + DB 쿼리 생성 + 결과 시각화 + 지도 핀)
  - 입지 추천형 질문 지원 ("향남에서 세탁소 어디가 좋을지")
  - 데이터 조회형 질문 지원 ("전국에서 가장 싼 아파트는?")
  - 대화 히스토리 유지 (후속 질문 가능)
- Rate limiting (Supabase 기반)
- AI 결과 리포트 저장
- **검증**: AI 업종 추천, 타당성 분석, AI 검색 어시스턴트 모두 완전 작동

### Phase 5: 고급 기능
- 지역 비교 (2-3개 지점, 레이더 차트, AI 비교 판단)
- 인구 히트맵 (행정동 경계 GeoJSON + 색상 그라데이션)
- PDF 내보내기 (react-pdf 또는 html2canvas + jsPDF)
- 성능 최적화 (Suspense, 이미지 최적화, API 압축)
- **검증**: 지역 비교, PDF 다운로드 정상 작동

### Phase 6: 프로덕션 준비
- SEO (메타데이터, sitemap.xml, robots.txt, OG 이미지, JSON-LD)
- 에러 처리 (error.tsx, not-found.tsx, loading.tsx)
- 접근성 (ARIA, 키보드 네비게이션)
- 모바일 반응형 최종 점검
- Lighthouse 90+ 달성
- **검증**: 최종 통합 테스트, Lighthouse 점수 확인

---

## 12. 비기능 요구사항

| 항목 | 요구사항 |
|---|---|
| 성능 | Lighthouse Performance 90+, 지도 로딩 < 2초 |
| 보안 | API 키 서버 사이드 보호, RLS, CSRF 방지 |
| 접근성 | WCAG 2.1 AA, 키보드 네비게이션, ARIA |
| SEO | 각 페이지 메타데이터, 구조화 데이터, sitemap |
| 반응형 | 모바일 (375px+) → 태블릿 (768px+) → 데스크톱 (1280px+) |
| 가용성 | 외부 API 장애 시 캐시 데이터로 서비스 지속 (Graceful Degradation) |
| 데이터 보호 | 사용자 데이터 본인만 접근 가능 (Supabase RLS) |

---

## 13. 법적 고지

- 모든 지적재산권은 **CASON TECH**에 귀속됩니다.
- 푸터에 표시: **"© 2026 CASON TECH. All rights reserved."**
- 공공데이터는 공공누리 이용 조건에 따라 활용합니다.
- AI 분석 결과는 참고용이며, 투자/창업 결정에 대한 법적 책임을 지지 않습니다. (면책 조항 표시)

---

*이 문서는 CASON TECH 소유이며, 무단 복제 및 배포를 금지합니다.*
