"use client";

import { useAppStore } from '@/store/useAppStore';
type LayerVisibility = {
  floodRisk: boolean;
  rainfall: boolean;
  roads: boolean;
  blockedRoads: boolean;
  infrastructure: boolean;
};
type ToggleDef = { key: keyof LayerVisibility; label: string };

const toggles: ToggleDef[] = [
  { key: 'floodRisk', label: 'Risk' },
  { key: 'rainfall', label: 'Rain' },
  { key: 'roads', label: 'Roads' },
  { key: 'blockedRoads', label: 'Blocks' },
  { key: 'infrastructure', label: 'Infra' },
];

export function LayerToggles() {
  const layers = useAppStore((s) => s.layers);
  const setLayer = useAppStore((s) => s.setLayer);
  return (
    <div className="pointer-events-auto glass flex items-center gap-2 rounded-xl p-2 shadow-soft">
      {toggles.map((t) => (
        <button
          key={t.key}
          onClick={() => setLayer(t.key, !layers[t.key])}
          className={`rounded-md px-2 py-1 text-xs font-medium transition-colors focus-ring ${
            layers[t.key] ? 'bg-brand-blue text-white' : 'bg-white text-gray-700 border border-gray-300'
          }`}
          aria-pressed={layers[t.key]}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

