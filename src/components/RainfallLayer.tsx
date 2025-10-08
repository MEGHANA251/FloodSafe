"use client";
import { CircleMarker, Tooltip } from 'react-leaflet';
import { useEffect, useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { getRegion } from '@/config/regions';

type Pt = { lat: number; lon: number; mmPerHr: number };

export function RainfallLayer() {
  const city = useAppStore((s) => s.city);
  const bbox = useAppStore((s) => s.bbox);
  const [points, setPoints] = useState<Pt[]>([]);

  useEffect(() => {
    const r = getRegion(city);
    const rb = bbox ?? r?.bbox;
    if (!rb) return;
    const [minLon, minLat, maxLon, maxLat] = rb;
    fetch(`/api/nasa-grid?bbox=${minLon},${minLat},${maxLon},${maxLat}`).then(r=>r.json()).then(j=>{ if(j.ok) setPoints(j.data); });
  }, [city, bbox]);

  function colorFor(mm: number) {
    if (mm >= 20) return '#8b0000';
    if (mm >= 10) return '#d7263d';
    if (mm >= 5) return '#f77f00';
    if (mm >= 1) return '#f4c20d';
    return '#168F6E';
  }

  return (
    <>
      {points.map((p, idx) => (
        <CircleMarker key={idx} center={[p.lat, p.lon]} radius={6} pathOptions={{ color: colorFor(p.mmPerHr), fillOpacity: 0.5 }}>
          <Tooltip>{p.mmPerHr.toFixed(1)} mm/hr</Tooltip>
        </CircleMarker>
      ))}
    </>
  );
}

