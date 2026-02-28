import { create } from 'zustand';
import type { MapPosition } from '@/types/map';
import { DEFAULT_CATEGORIES } from '@/lib/utils/constants';

interface MapState {
  center: MapPosition;
  zoom: number;
  radius: number;
  selectedLocation: MapPosition | null;
  selectedLocationName: string | null;
  enabledCategories: string[]; // Kakao category codes e.g. ['FD6', 'CE7']
  setCenter: (center: MapPosition) => void;
  setZoom: (zoom: number) => void;
  setRadius: (radius: number) => void;
  setSelectedLocation: (location: MapPosition | null, name?: string | null) => void;
  toggleCategory: (code: string) => void;
  setCategories: (codes: string[]) => void;
}

export const useMapStore = create<MapState>()((set) => ({
  center: { lat: 37.5665, lng: 126.978 },
  zoom: 15,
  radius: 500,
  selectedLocation: null,
  selectedLocationName: null,
  enabledCategories: [...DEFAULT_CATEGORIES],
  setCenter: (center) => set({ center }),
  setZoom: (zoom) => set({ zoom }),
  setRadius: (radius) => set({ radius }),
  setSelectedLocation: (location, name = null) =>
    set({ selectedLocation: location, selectedLocationName: name }),
  toggleCategory: (code) =>
    set((state) => ({
      enabledCategories: state.enabledCategories.includes(code)
        ? state.enabledCategories.filter((c) => c !== code)
        : [...state.enabledCategories, code],
    })),
  setCategories: (codes) => set({ enabledCategories: codes }),
}));
