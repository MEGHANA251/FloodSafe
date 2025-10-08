import { create } from 'zustand';
import type { Coordinate } from '@/types';

type LayerVisibility = {
  floodRisk: boolean;
  rainfall: boolean;
  roads: boolean;
  blockedRoads: boolean;
  infrastructure: boolean;
};

type UserReport = { id: string; type: 'flood'|'blockage'; description?: string; location: Coordinate; createdAt: string };

// Extend app state to support directions and reports
type AppState = {
  isSidebarOpen: boolean;
  city: string;
  bbox?: [number, number, number, number];
  layers: LayerVisibility;
  userLocation: Coordinate | null;
  destination: Coordinate | null;
  showDirections: boolean;
  // Reports
  reports: UserReport[];
  reportModalOpen: boolean;
  addReport: (report: Omit<UserReport, 'id'|'createdAt'>) => void;
  setReportModalOpen: (open: boolean) => void;
  // Actions
  toggleSidebar: () => void;
  setCity: (city: string) => void;
  setBbox: (bbox: [number, number, number, number]) => void;
  setLayer: (key: keyof LayerVisibility, value: boolean) => void;
  setUserLocation: (location: Coordinate | null) => void;
  setDestination: (destination: Coordinate | null) => void;
  toggleDirections: (show?: boolean) => void;
};

export const useAppStore = create<AppState>((set) => ({
  isSidebarOpen: true,
  city: 'mumbai',
  bbox: undefined,
  layers: {
    floodRisk: true,
    rainfall: true,
    roads: true,
    blockedRoads: true,
    infrastructure: true,
  },
  userLocation: null,
  destination: null,
  showDirections: false,
  reports: [],
  reportModalOpen: false,
  toggleSidebar: () => set((s) => ({ isSidebarOpen: !s.isSidebarOpen })),
  setCity: (city) => set(() => ({ city })),
  setBbox: (bbox) => set(() => ({ bbox })),
  setLayer: (key, value) => set((s) => ({ layers: { ...s.layers, [key]: value } })),
  setUserLocation: (location) => set(() => ({ userLocation: location })),
  setDestination: (destination) => set(() => ({ destination })),
  toggleDirections: (show) => set((s) => ({ showDirections: show !== undefined ? show : !s.showDirections })),
  addReport: (report) => set((s) => ({
    reports: [
      ...s.reports,
      { id: `rep-${Date.now()}`, createdAt: new Date().toISOString(), ...report }
    ]
  })),
  setReportModalOpen: (open) => set(() => ({ reportModalOpen: open })),
}));

