export const APP_NAME = '상권분석 Pro';
export const APP_NAME_EN = 'Commercial Analysis Pro';
export const COMPANY_NAME = 'CASON TECH';

export const DEFAULT_CENTER = { lat: 37.5665, lng: 126.978 }; // Seoul City Hall
export const DEFAULT_ZOOM = 15;
export const MIN_RADIUS = 100;
export const MAX_RADIUS = 2000;
export const DEFAULT_RADIUS = 500;
export const RADIUS_STEP = 100;

export const DEBOUNCE_MS = 300;

// Kakao category code → label + color
export const CATEGORY_INFO: Record<string, { label: string; color: string }> = {
  FD6: { label: '음식점', color: '#EF4444' },
  CE7: { label: '카페', color: '#8B5CF6' },
  CS2: { label: '편의점', color: '#3B82F6' },
  MT1: { label: '대형마트', color: '#0EA5E9' },
  HP8: { label: '병원', color: '#F59E0B' },
  PM9: { label: '약국', color: '#F97316' },
  AC5: { label: '학원', color: '#EC4899' },
  SC4: { label: '학교', color: '#A855F7' },
  AD5: { label: '숙박', color: '#6366F1' },
  BK9: { label: '은행', color: '#10B981' },
  PS3: { label: '어린이집', color: '#F472B6' },
  PK6: { label: '주차장', color: '#94A3B8' },
  OL7: { label: '주유소', color: '#78716C' },
  SW8: { label: '지하철역', color: '#06B6D4' },
  CT1: { label: '문화시설', color: '#D946EF' },
  AG2: { label: '중개업소', color: '#84CC16' },
  PO3: { label: '공공기관', color: '#64748B' },
  AT4: { label: '관광명소', color: '#FB923C' },
};

// label → color map (for marker coloring by large_category)
export const INDUSTRY_COLORS: Record<string, string> = Object.fromEntries(
  Object.values(CATEGORY_INFO).map((v) => [v.label, v.color])
);
INDUSTRY_COLORS['기타'] = '#6B7280';

// Default enabled categories
export const DEFAULT_CATEGORIES = ['CS2'];

export const FRESHNESS_COLORS = {
  fresh: '#22C55E',
  stale: '#F59E0B',
  expired: '#EF4444',
} as const;

export const RELIABILITY_LABELS = {
  high: { ko: '높음', en: 'High' },
  medium: { ko: '보통', en: 'Medium' },
  low: { ko: '낮음', en: 'Low' },
} as const;

export const NAV_ITEMS = [
  { key: 'explore', href: '/explore', icon: 'Map' },
  { key: 'analysis', href: '/analysis', icon: 'BarChart3' },
  { key: 'recommend', href: '/recommend', icon: 'Sparkles' },
  { key: 'saved', href: '/saved', icon: 'Bookmark' },
] as const;

export const MORE_NAV_ITEMS = [
  { key: 'compare', href: '/compare', icon: 'GitCompare' },
  { key: 'search', href: '/search', icon: 'MessageSquare' },
  { key: 'feasibility', href: '/feasibility', icon: 'ClipboardCheck' },
] as const;
