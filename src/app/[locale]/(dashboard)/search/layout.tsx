import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'AI 데이터 검색',
  description: '자연어로 상권 데이터를 검색하세요. "카페가 가장 많은 동네는?" 같은 질문에 데이터 기반으로 답변합니다.',
};

export default function SearchLayout({ children }: { children: ReactNode }) {
  return children;
}
