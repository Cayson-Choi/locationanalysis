import { create } from 'zustand';
import type { MapPosition } from '@/types/map';

interface MapState {
  center: MapPosition;
  zoom: number;
  radius: number;
  selectedLocation: MapPosition | null;
  selectedLocationName: string | null;
  layers: {
    businesses: boolean;
    schools: boolean;
    academies: boolean;
    transport: boolean;
    population: boolean;
  };
  setCenter: (center: MapPosition) => void;
  setZoom: (zoom: number) => void;
  setRadius: (radius: number) => void;
  setSelectedLocation: (location: MapPosition | null, name?: string | null) => void;
  toggleLayer: (layer: keyof MapState['layers']) => void;
  setLayer: (layer: keyof MapState['layers'], enabled: boolean) => void;
}

export const useMapStore = create<MapState>()((set) => ({
  center: { lat: 37.5665, lng: 126.978 }, // Seoul City Hall
  zoom: 15,
  radius: 500,
  selectedLocation: null,
  selectedLocationName: null,
  layers: {
    businesses: true,
    schools: false,
    academies: false,
    transport: false,
    population: false,
  },
  setCenter: (center) => set({ center }),
  setZoom: (zoom) => set({ zoom }),
  setRadius: (radius) => set({ radius }),
  setSelectedLocation: (location, name = null) =>
    set({ selectedLocation: location, selectedLocationName: name }),
  toggleLayer: (layer) =>
    set((state) => ({
      layers: { ...state.layers, [layer]: !state.layers[layer] },
    })),
  setLayer: (layer, enabled) =>
    set((state) => ({
      layers: { ...state.layers, [layer]: enabled },
    })),
}));
