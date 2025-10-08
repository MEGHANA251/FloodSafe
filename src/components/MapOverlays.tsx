"use client";
import { Polygon, Polyline, Marker, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import { useEffect, useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { getRegion } from '@/config/regions';

const riskColor = { low: '#F4C20D', medium: '#F77F00', high: '#D7263D' } as const;

function getPoiIcon(type: 'hospital' | 'shelter' | 'police') {
  const bg = type === 'hospital' ? '#0B5ED7' : type === 'police' ? '#1f2937' : '#168F6E';
  const emoji = type === 'hospital' ? '✚' : type === 'police' ? '✪' : '⌂';
  return L.divIcon({
    className: '',
    html: `<div style="transform: translate(-50%, -50%); display:inline-flex; align-items:center; justify-content:center; width:24px; height:24px; border-radius:9999px; background:${bg}; color:white; font-size:12px; box-shadow:0 6px 14px rgba(0,0,0,.25);">${emoji}</div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
}

type Poi = { id: string; type: 'hospital' | 'shelter' | 'police'; name: string; location: [number, number] };
type Route = { id: string; summary: string; distanceKm: number; durationMin: number; geometry: [number, number][] };
type FloodTweet = { id: string; text: string; lat?: number; lon?: number };

export function MapOverlays() {
  const layers = useAppStore((s) => s.layers);
  const city = useAppStore((s) => s.city);
  const bboxFromStore = useAppStore((s) => s.bbox);
  const reports = useAppStore((s) => s.reports) || [];
  const [pois, setPois] = useState<Poi[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [tweets, setTweets] = useState<FloodTweet[]>([]);

  useEffect(() => {
    const r = getRegion(city);
    const rb = bboxFromStore ?? r?.bbox;
    if (!rb) return;
    const [minLon, minLat, maxLon, maxLat] = rb;
    fetch(`/api/osm-pois?bbox=${minLon},${minLat},${maxLon},${maxLat}`).then(r=>r.json()).then(j=>{ if(j.ok) setPois(j.data); });
  }, [city]);

  useEffect(() => {
    const r = getRegion(city);
    const rb = bboxFromStore ?? r?.bbox;
    if (!r || !rb) return;
    const center = r.center;
    const oLat = center[0] - 0.05, oLon = center[1] - 0.05;
    const dLat = center[0] + 0.05, dLon = center[1] + 0.05;
    fetch(`/api/routes?origin=${oLat},${oLon}&destination=${dLat},${dLon}`).then(r=>r.json()).then(j=>{ if(j.ok) setRoutes(j.data); });
  }, [city]);

  useEffect(() => {
    const r = getRegion(city);
    const rb = bboxFromStore ?? r?.bbox;
    if (!rb) return;
    const [minLon, minLat, maxLon, maxLat] = rb;
    fetch(`/api/twitter?bbox=${minLon},${minLat},${maxLon},${maxLat}`).then(r=>r.json()).then(j=>{ if(j.ok) setTweets(j.data); });
  }, [city]);
  return (
    <>
      {routes.map((route) => (
        <Polyline key={route.id} positions={route.geometry.map(([lat, lon]) => [lat, lon])} pathOptions={{ color: '#168F6E', weight: 4, opacity: 0.9 }}>
          <Tooltip>
            {route.summary} • {route.distanceKm} km • {route.durationMin} min
          </Tooltip>
        </Polyline>
      ))}
      {layers.infrastructure && pois.map((p) => (
        <Marker key={p.id} position={[p.location[0], p.location[1]]} icon={getPoiIcon(p.type)}>
          <Tooltip>{p.name}</Tooltip>
        </Marker>
      ))}
      {layers.blockedRoads && reports.map((r) => (
        <Marker
          key={r.id}
          position={[r.location[0], r.location[1]]}
          icon={L.divIcon({ className: '', html: `<div style="transform: translate(-50%, -50%); background:${r.type==='blockage' ? '#D7263D' : '#0B5ED7'}; color:#fff; border-radius:9999px; width:22px; height:22px; display:flex; align-items:center; justify-content:center; box-shadow:0 6px 14px rgba(0,0,0,0.2); font-size:12px;">!</div>` })}
        >
          <Tooltip>{r.type === 'blockage' ? 'Blocked road' : 'Flooded area'}{r.description ? ` — ${r.description}` : ''}</Tooltip>
        </Marker>
      ))}
      {layers.blockedRoads && tweets.map((t) => (
        t.lat && t.lon ? (
          <Marker key={t.id} position={[t.lat, t.lon]} icon={L.divIcon({ className: '', html: '<div style="transform: translate(-50%, -50%); background:#1f2937;color:#fff;border-radius:9999px;width:20px;height:20px;display:flex;align-items:center;justify-content:center;box-shadow:0 6px 14px rgba(0,0,0,.25)">!</div>', iconSize:[20,20], iconAnchor:[10,10] })}>
            <Tooltip>{t.text}</Tooltip>
          </Marker>
        ) : null
      ))}
    </>
  );
}

