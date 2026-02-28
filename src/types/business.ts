export interface Business {
  id: string;
  name: string;
  branch_name: string | null;
  large_category: string;
  medium_category: string;
  small_category: string;
  address_road: string;
  address_jibun: string;
  latitude: number;
  longitude: number;
  floor: string | null;
  phone: string | null;
  is_active: boolean;
  cached_at: string;
}

export interface BusinessCategory {
  code: string;
  name: string;
  count: number;
  color: string;
}
