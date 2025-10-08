import { NextResponse } from 'next/server';

// Sample a small grid of rainfall points within a bbox using NASA POWER as proxy
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const bboxParam = searchParams.get('bbox');
  if (!bboxParam) return NextResponse.json({ ok: false, error: 'Missing bbox' }, { status: 400 });
  const bboxNums = bboxParam.split(',').map(Number);
  if (bboxNums.length !== 4 || bboxNums.some((v) => isNaN(v))) {
    return NextResponse.json({ ok: false, error: 'Invalid bbox values' }, { status: 400 });
  }
  const [minLon, minLat, maxLon, maxLat]: [number, number, number, number] = bboxNums as [number, number, number, number];
  const steps = 6;
  const points: { lat: number; lon: number; mmPerHr: number }[] = [];
  try {
    for (let i = 0; i <= steps; i++) {
      for (let j = 0; j <= steps; j++) {
        const lat = minLat + (i * (maxLat - minLat)) / steps;
        const lon = minLon + (j * (maxLon - minLon)) / steps;
        const url = `https://power.larc.nasa.gov/api/temporal/hourly/point?parameters=PRECTOT&community=RE&longitude=${lon}&latitude=${lat}&format=JSON`;
        const res = await fetch(url);
        if (!res.ok) continue;
        const data = await res.json();
        const vals = Object.values((data as any).properties?.parameter?.PRECTOT || {});
        const last = Number(vals[vals.length - 1] ?? 0);
        points.push({ lat, lon, mmPerHr: last });
      }
    }
    return NextResponse.json({ ok: true, data: points });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? 'Failed' }, { status: 500 });
  }
}

