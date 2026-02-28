import { create } from 'zustand';
import type { AnalysisReport } from '@/types/analysis';

type AnalysisStatus = 'idle' | 'loading' | 'success' | 'error';

interface AnalysisState {
  currentReport: AnalysisReport | null;
  status: AnalysisStatus;
  error: string | null;
  activeTab: string;
  setCurrentReport: (report: AnalysisReport | null) => void;
  setStatus: (status: AnalysisStatus) => void;
  setError: (error: string | null) => void;
  setActiveTab: (tab: string) => void;
  reset: () => void;
}

export const useAnalysisStore = create<AnalysisState>()((set) => ({
  currentReport: null,
  status: 'idle',
  error: null,
  activeTab: 'industry',
  setCurrentReport: (report) => set({ currentReport: report }),
  setStatus: (status) => set({ status }),
  setError: (error) => set({ error }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  reset: () =>
    set({
      currentReport: null,
      status: 'idle',
      error: null,
      activeTab: 'industry',
    }),
}));
