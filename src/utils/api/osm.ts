// Routing via OpenRouteService (driving-car as default). Requires ROUTING_API_KEY.
import type { Coordinate, RouteSuggestion } from '@/types';

export async function fetchRoutes(origin: Coordinate, destination: Coordinate): Promise<RouteSuggestion[]> {
  const apiKey = process.env.ROUTING_API_KEY;
  if (!apiKey) throw new Error('Missing ROUTING_API_KEY');
  const start = `${origin[1]},${origin[0]}`; // lon,lat
  const end = `${destination[1]},${destination[0]}`; // lon,lat
  const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${start}&end=${end}`;
  const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
  if (!res.ok) throw new Error(`Routing failed: ${res.status}`);
  const json = await res.json();
  const features = json.features || [];
  const suggestions: RouteSuggestion[] = features.map((f: any, idx: number) => {
    const coords = (f.geometry?.coordinates || []).map((c: number[]) => [c[1], c[0]] as Coordinate);
    const distanceKm = (f.properties?.summary?.distance ?? 0) / 1000;
    const durationMin = (f.properties?.summary?.duration ?? 0) / 60;
    return {
      id: `r-${idx}`,
      summary: f.properties?.segments?.[0]?.steps?.[0]?.name || 'Suggested route',
      distanceKm: Number(distanceKm.toFixed(1)),
      durationMin: Math.round(durationMin),
      geometry: coords,
      riskScore: 0.5, // TODO: compute using rainfall/blocks overlays
    };
  });
  return suggestions;
}

