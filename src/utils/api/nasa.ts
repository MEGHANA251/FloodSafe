// NASA GPM/IMERG sample: fetch raster tile-like precipitation near a point.
// Replace with proper NASA endpoint usage as needed.

export type GpmRainfallPoint = { lat: number; lon: number; mmPerHr: number };

export async function fetchGpmRainfall(lat: number, lon: number): Promise<GpmRainfallPoint[]> {
  const apiKey = process.env.NASA_API_KEY;
  if (!apiKey) throw new Error('Missing NASA_API_KEY');
  // Example placeholder call. Replace with a real GPM/IMERG endpoint.
  const url = `https://power.larc.nasa.gov/api/temporal/hourly/point?parameters=PRECTOT&community=RE&longitude=${lon}&latitude=${lat}&format=JSON`; // no key required but illustrative
  const res = await fetch(url);
  if (!res.ok) throw new Error(`NASA fetch failed: ${res.status}`);
  const data = await res.json();
  // Map some values to points near the requested coordinate
  const now = Object.values((data as any).properties?.parameter?.PRECTOT || {}).slice(-3) as number[];
  const out: GpmRainfallPoint[] = [
    { lat, lon, mmPerHr: Number(now[0] ?? 0) },
    { lat: lat + 0.03, lon, mmPerHr: Number(now[1] ?? 0) },
    { lat, lon: lon + 0.03, mmPerHr: Number(now[2] ?? 0) },
  ];
  return out;
}

