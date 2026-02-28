import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: '창업 타당성 분석',
  description: 'AI가 창업 성공 확률, SWOT 분석, 손익분기점, 매출 시나리오를 데이터 기반으로 분석합니다.',
};

export default function FeasibilityLayout({ children }: { children: ReactNode }) {
  return children;
}
