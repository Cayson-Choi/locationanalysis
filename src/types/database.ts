export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  preferred_locale: 'ko' | 'en';
  preferred_theme: 'light' | 'dark' | 'system';
  preferred_map_provider: 'kakao' | 'naver';
  created_at: string;
  updated_at: string;
}

export type ReportType = 'district' | 'recommend' | 'feasibility' | 'compare';

export interface Report {
  id: string;
  user_id: string;
  type: ReportType;
  title: string;
  location_name: string;
  latitude: number;
  longitude: number;
  radius: number;
  data: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface UsageLog {
  id: string;
  user_id: string;
  action: string;
  endpoint: string;
  metadata: Record<string, unknown> | null;
  created_at: string;
}
