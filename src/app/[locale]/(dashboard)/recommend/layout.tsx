import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'AI 업종 추천',
  description: 'AI가 상권 데이터를 분석하여 해당 위치에 최적화된 업종 Top 5를 추천합니다. 적합도 점수, 근거, 리스크까지 한눈에.',
};

export default function RecommendLayout({ children }: { children: ReactNode }) {
  return children;
}
