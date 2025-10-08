import { NextResponse } from 'next/server';
import { fetchRoutes } from '@/utils/api/osm';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const originParam = searchParams.get('origin') || '19.00,72.82';
  const destParam = searchParams.get('destination') || '19.05,72.86';
  const originNums = originParam.split(',').map(Number);
  const destNums = destParam.split(',').map(Number);
  if (originNums.length !== 2 || destNums.length !== 2 || originNums.some((v) => isNaN(v)) || destNums.some((v) => isNaN(v))) {
    return NextResponse.json({ ok: false, error: 'Invalid origin or destination values' }, { status: 400 });
  }
  const [oLat, oLon]: [number, number] = originNums as [number, number];
  const [dLat, dLon]: [number, number] = destNums as [number, number];
  try {
    const data = await fetchRoutes([oLat, oLon], [dLat, dLon]);
    return NextResponse.json({ ok: true, data });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? 'Failed' }, { status: 500 });
  }
}

