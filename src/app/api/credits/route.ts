import { NextResponse } from 'next/server';

const APPS_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbzPHI_CjsMD7eyEVhcg80TUMLWcXpbgrExDFoWnIQratbjizaAEsBaWlSyDumPqhgSeqQ/exec';

export async function GET() {
  try {
    const res = await fetch(APPS_SCRIPT_URL, { cache: 'no-store' });
    const data = await res.json();
    return NextResponse.json(data, {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}
