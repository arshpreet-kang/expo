import { NextResponse } from 'next/server';
import { parseRequirementText } from '@/lib/requirementParser';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { text } = body;

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Requirement text is required.' }, { status: 400 });
    }

    const spec = parseRequirementText(text);

    // Optionally save requirement to DB
    const saved = await db.requirement.create({
      data: {
        rawInput: text,
        quantity: spec.quantity,
        category: spec.category,
        purpose: spec.purpose,
        ram: spec.ram,
        storage: spec.storage,
        processor: spec.processor,
        gpu: spec.gpu,
        warranty: spec.warranty,
        location: spec.location,
      },
    });

    return NextResponse.json({ requirementId: saved.id, spec });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to process requirement' }, { status: 500 });
  }
}
