import { NextResponse } from 'next/server';
import { fetchGpmRainfall } from '@/utils/api/nasa';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = Number(searchParams.get('lat')) || 19.076;
  const lon = Number(searchParams.get('lon')) || 72.8777;
  try {
    const data = await fetchGpmRainfall(lat, lon);
    return NextResponse.json({ ok: true, data });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? 'Failed' }, { status: 500 });
  }
}

