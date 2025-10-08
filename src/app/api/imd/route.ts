import { NextResponse } from 'next/server';
import { fetchAccuAlerts } from '@/utils/api/accuweather';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city') || 'mumbai';
  try {
    const data = await fetchAccuAlerts(city);
    return NextResponse.json({ ok: true, data });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? 'Failed' }, { status: 500 });
  }
}

