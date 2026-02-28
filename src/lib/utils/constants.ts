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

export const INDUSTRY_COLORS: Record<string, string> = {
  음식점: '#EF4444',
  카페: '#8B5CF6',
  편의점: '#3B82F6',
  대형마트: '#0EA5E9',
  의료: '#F59E0B',
  약국: '#F97316',
  학원: '#EC4899',
  학교: '#A855F7',
  숙박: '#6366F1',
  은행: '#10B981',
  기타: '#6B7280',
};

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
