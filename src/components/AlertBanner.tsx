"use client";
import { useEffect, useState } from 'react';
import { useAppStore } from '@/store/useAppStore';

type AlertItem = { id: string; severity: 'yellow' | 'orange' | 'red'; title: string };

export function AlertBanner() {
  const [lastUpdated, setLastUpdated] = useState<string>('—');
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const city = useAppStore((s) => s.city);

  useEffect(() => {
    const date = new Date();
    setLastUpdated(date.toLocaleString());
  }, []);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/accuweather?city=${city}`);
        const json = await res.json();
        if (json?.ok) setAlerts(json.data);
      } catch {}
    }
    load();
  }, [city]);

  const sevColor: Record<AlertItem['severity'], string> = {
    yellow: 'bg-yellow-500',
    orange: 'bg-orange-500',
    red: 'bg-red-600',
  };

  const headline = alerts[0]?.title ?? 'No active alerts';
  const sev = alerts[0]?.severity ?? 'yellow';

  return (
    <div className="w-full text-white" style={{ backgroundImage: 'linear-gradient(90deg, #0B5ED7, #168F6E)' }}>
      <div className="mx-auto max-w-7xl px-4 py-2 text-xs sm:text-sm flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className={`inline-flex h-2 w-2 rounded-full ${sevColor[sev as 'yellow' | 'orange' | 'red']} animate-pulse`} aria-hidden />
          <span className="font-semibold">AccuWeather:</span>
          <span className="opacity-90 truncate max-w-[70vw] sm:max-w-none">{headline}</span>
        </div>
        <div className="opacity-90">Updated: {lastUpdated}</div>
      </div>
    </div>
  );
}

