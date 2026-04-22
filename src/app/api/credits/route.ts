import { NextResponse } from 'next/server';

const APPS_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbzPHI_CjsMD7eyEVhcg80TUMLWcXpbgrExDFoWnIQratbjizaAEsBaWlSyDumPqhgSeqQ/exec';

// ── GET：讀取 Sheets 資料 ──
export async function GET() {
  try {
    const res = await fetch(APPS_SCRIPT_URL, { cache: 'no-store' });
    const data = await res.json();
    return NextResponse.json(data, {
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

// ── POST：寫入修改回 Sheets ──
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const res = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data, {
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to post' }, { status: 500 });
  }
}

// ── OPTIONS：CORS preflight ──
export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
