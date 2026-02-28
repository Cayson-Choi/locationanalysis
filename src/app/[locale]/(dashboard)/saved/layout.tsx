import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: '저장된 리포트',
  description: '저장한 상권 분석 리포트를 관리하고 다시 확인하세요.',
};

export default function SavedLayout({ children }: { children: ReactNode }) {
  return children;
}
