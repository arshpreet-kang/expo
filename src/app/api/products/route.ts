import { NextResponse } from 'next/server';
import { findMatchingProducts } from '@/lib/productMatcher';
import { parseRequirementText } from '@/lib/requirementParser';

export async function POST(req: Request) {
  try {
    const spec = await req.json();
    const result = await findMatchingProducts(spec);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to match products' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category') || 'Laptop';
  const query = searchParams.get('query') || '';

  const dummySpec = parseRequirementText(query || category);
  if (category) dummySpec.category = category;

  const result = await findMatchingProducts(dummySpec);
  return NextResponse.json(result);
}
