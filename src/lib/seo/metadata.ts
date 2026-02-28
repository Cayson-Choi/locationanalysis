import type { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://sangkwon.pro';

interface PageMetadataOptions {
  title: string;
  description: string;
  locale?: string;
  path?: string;
  noIndex?: boolean;
}

export function generatePageMetadata({
  title,
  description,
  locale = 'ko',
  path = '',
  noIndex = false,
}: PageMetadataOptions): Metadata {
  const url = `${BASE_URL}/${locale}${path}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        ko: `${BASE_URL}/ko${path}`,
        en: `${BASE_URL}/en${path}`,
      },
    },
    openGraph: {
      title: `${title} | 상권분석 Pro`,
      description,
      url,
      siteName: '상권분석 Pro',
      locale: locale === 'ko' ? 'ko_KR' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | 상권분석 Pro`,
      description,
    },
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}

export function generateJsonLd(locale: string = 'ko') {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: locale === 'ko' ? '상권분석 Pro' : 'Commercial Analysis Pro',
    description:
      locale === 'ko'
        ? '전국 상권 데이터와 AI 분석으로 최적의 창업 입지를 찾아보세요.'
        : 'Find the optimal business location with nationwide commercial data and AI analysis.',
    url: BASE_URL,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'KRW',
    },
    author: {
      '@type': 'Organization',
      name: 'CASON TECH',
    },
  };
}
