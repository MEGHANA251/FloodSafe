import { NextResponse } from 'next/server';
import { fetchFloodTweets } from '@/utils/api/twitter';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const bboxParam = searchParams.get('bbox') || '72.8,18.9,72.98,19.12';
  const bb = bboxParam.split(',').map(Number);
  try {
    const data = await fetchFloodTweets([bb[0], bb[1], bb[2], bb[3]] as [number, number, number, number]);
    return NextResponse.json({ ok: true, data });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? 'Failed' }, { status: 500 });
  }
}

