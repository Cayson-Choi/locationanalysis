import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: '지도 탐색',
  description: '카카오맵/네이버맵으로 전국 상권을 탐색하고 업종별 사업체를 확인하세요. 반경 설정, 교통, 학교, 학원 레이어를 활용한 입지 분석.',
};

export default function ExploreLayout({ children }: { children: ReactNode }) {
  return children;
}
