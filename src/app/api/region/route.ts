import { NextResponse } from 'next/server';

// Resolve an Indian region/city to center and bbox using Nominatim
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');
  if (!q) return NextResponse.json({ ok: false, error: 'Missing q' }, { status: 400 });
  const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=in&q=${encodeURIComponent(q)}`;
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'FloodSafeIndia/1.0' } });
    if (!res.ok) throw new Error(`Nominatim ${res.status}`);
    const arr = await res.json();
    if (!arr?.length) return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 });
    const item = arr[0];
    const bbox = (item.boundingbox || []).map((x: string) => Number(x)); // [minLat, maxLat, minLon, maxLon]
    const minLat = bbox[0], maxLat = bbox[1], minLon = bbox[2], maxLon = bbox[3];
    const center = [Number(item.lat), Number(item.lon)] as [number, number];
    return NextResponse.json({ ok: true, data: { center, bbox: [minLon, minLat, maxLon, maxLat] } });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? 'Failed' }, { status: 500 });
  }
}

