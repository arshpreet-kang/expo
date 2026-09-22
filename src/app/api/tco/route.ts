import { NextResponse } from 'next/server';
import { calculateTco } from '@/lib/tcoEngine';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const tco = calculateTco(body);
    return NextResponse.json(tco);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to calculate TCO' }, { status: 500 });
  }
}
