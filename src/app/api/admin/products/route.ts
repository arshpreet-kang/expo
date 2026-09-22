import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const products = await db.product.findMany({
      include: {
        marketPrices: {
          include: { source: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(products);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, model, category, brand, processor, ram, storage, gpu, warranty, price, sourceName, geography, collectionDate } = body;

    // Find or create source
    let source = await db.source.findFirst({ where: { name: sourceName || 'Chandigarh IT Market Partner' } });
    if (!source) {
      source = await db.source.create({
        data: {
          name: sourceName || 'Chandigarh IT Market Partner',
          sourceType: geography === 'Chandigarh' ? 'CHANDIGARH_SELLER' : 'NATIONAL_MARKET',
          geography: geography || 'Chandigarh',
        },
      });
    }

    const product = await db.product.create({
      data: {
        name,
        model,
        category: category || 'Laptop',
        brand: brand || 'Dell',
        processor,
        ram,
        storage,
        gpu,
        warranty,
        marketPrices: {
          create: [
            {
              price: parseFloat(price),
              sourceId: source.id,
              geography: geography || 'Chandigarh',
              collectionDate: collectionDate || new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
            },
          ],
        },
      },
      include: { marketPrices: { include: { source: true } } },
    });

    return NextResponse.json(product);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create product' }, { status: 500 });
  }
}
