import { NextResponse } from 'next/server';

// Fetch hospitals, police, and shelters via Overpass API near a bbox
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const bbox = (searchParams.get('bbox') || '72.8,18.9,72.98,19.12').split(',').map(Number);
  const [minLon, minLat, maxLon, maxLat] = bbox;
  const q = `
    [out:json][timeout:25];
    (
      node[amenity=hospital](${minLat},${minLon},${maxLat},${maxLon});
      node[amenity=police](${minLat},${minLon},${maxLat},${maxLon});
      node[amenity=shelter](${minLat},${minLon},${maxLat},${maxLon});
    );
    out body;`;
  try {
    const res = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
      body: new URLSearchParams({ data: q }).toString(),
    });
    if (!res.ok) throw new Error(`Overpass failed: ${res.status}`);
    const json = await res.json();
    const pois = (json.elements || []).map((e: any) => ({
      id: String(e.id),
      type: e.tags?.amenity,
      name: e.tags?.name || e.tags?.operator || e.tags?.brand || 'POI',
      location: [e.lat, e.lon],
    }));
    return NextResponse.json({ ok: true, data: pois });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? 'Failed' }, { status: 500 });
  }
}

