import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '상권분석 Pro - 데이터 기반 상권 분석',
    short_name: '상권분석 Pro',
    description: '전국 상권 데이터와 AI 분석으로 최적의 창업 입지를 찾아보세요.',
    start_url: '/ko',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#18181b',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
