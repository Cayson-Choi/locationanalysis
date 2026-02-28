import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: '상권 분석',
  description: '선택한 지역의 업종 분포, 인구 통계, 임대료 동향, 교통 접근성, 경쟁 현황을 종합 분석합니다.',
};

export default function AnalysisLayout({ children }: { children: ReactNode }) {
  return children;
}
