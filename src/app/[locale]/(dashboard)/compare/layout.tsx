import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: '지역 비교',
  description: '2~3개 지역을 나란히 비교하여 최적의 창업 입지를 선택하세요. 레이더 차트와 AI 종합 판단을 제공합니다.',
};

export default function CompareLayout({ children }: { children: ReactNode }) {
  return children;
}
