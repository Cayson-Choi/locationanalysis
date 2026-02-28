import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { MapProvider } from '@/types/map';

interface UIState {
  mapProvider: MapProvider;
  sidebarOpen: boolean;
  setMapProvider: (provider: MapProvider) => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      mapProvider: 'naver',
      sidebarOpen: true,
      setMapProvider: (provider) => set({ mapProvider: provider }),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
    }),
    {
      name: 'sangkwon-ui-v2',
      partialize: (state) => ({
        mapProvider: state.mapProvider,
      }),
    }
  )
);
