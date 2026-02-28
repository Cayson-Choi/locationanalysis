import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import localFont from 'next/font/local';
import { getLocale } from 'next-intl/server';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import './globals.css';

const pretendard = localFont({
  src: [
    {
      path: '../../public/fonts/PretendardVariable.woff2',
      style: 'normal',
    },
  ],
  variable: '--font-pretendard',
  display: 'swap',
  fallback: [
    '-apple-system',
    'BlinkMacSystemFont',
    'system-ui',
    'Roboto',
    'Helvetica Neue',
    'Segoe UI',
    'Apple SD Gothic Neo',
    'Noto Sans KR',
    'Malgun Gothic',
    'sans-serif',
  ],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    template: '%s | 상권분석 Pro',
    default: '상권분석 Pro - 데이터 기반 상권 분석 · AI 창업 추천',
  },
  description:
    '전국 상권 데이터와 AI 분석으로 최적의 창업 입지를 찾아보세요. 소상공인진흥공단, 통계청 등 공공데이터를 실시간으로 분석합니다.',
  keywords: [
    '상권분석',
    '창업',
    '입지분석',
    '소상공인',
    'AI분석',
    '상가임대',
    '프랜차이즈',
  ],
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://sangkwon.pro'),
  openGraph: {
    type: 'website',
    siteName: '상권분석 Pro',
    title: '상권분석 Pro - 데이터 기반 상권 분석 · AI 창업 추천',
    description: '전국 상권 데이터와 AI 분석으로 최적의 창업 입지를 찾아보세요.',
  },
  twitter: {
    card: 'summary_large_image',
    title: '상권분석 Pro',
    description: '전국 상권 데이터와 AI 분석으로 최적의 창업 입지를 찾아보세요.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const locale = await getLocale();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${pretendard.variable} ${inter.variable} font-sans antialiased`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
