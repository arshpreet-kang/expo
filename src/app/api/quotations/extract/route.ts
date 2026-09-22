import { NextResponse } from 'next/server';
import { extractQuotationFromPdfBuffer } from '@/lib/pdfExtractor';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      // Fallback mock upload handler if text was passed
      const mockVendor = formData.get('vendorName') as string || 'Uploaded Vendor';
      const mockTotal = parseFloat(formData.get('totalPrice') as string || '6500000');
      
      const saved = await db.vendorQuotation.create({
        data: {
          vendorName: mockVendor,
          quotationDate: new Date().toLocaleDateString('en-IN'),
          documentName: 'Quotation_Document.pdf',
          totalPrice: mockTotal,
          gstAmount: mockTotal * 0.18,
          warrantyYears: 3,
          amcDetails: '3 Years Onsite Support Included',
          items: {
            create: [
              {
                productName: 'IT Equipment Specification',
                quantity: 100,
                unitPrice: mockTotal / 118,
                gstPercent: 18,
                totalAmount: mockTotal,
              },
            ],
          },
        },
        include: { items: true },
      });

      return NextResponse.json({ quotation: saved, warnings: [] });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const extracted = await extractQuotationFromPdfBuffer(buffer);

    // Save extracted quotation to DB
    const saved = await db.vendorQuotation.create({
      data: {
        vendorName: extracted.vendorName,
        quotationDate: extracted.quotationDate,
        documentName: file.name,
        totalPrice: extracted.totalPrice,
        gstAmount: extracted.gstAmount,
        warrantyYears: extracted.warrantyYears,
        amcDetails: extracted.amcDetails,
        otherCharges: extracted.otherCharges,
        items: {
          create: [
            {
              productName: extracted.productName,
              model: extracted.model,
              quantity: extracted.quantity,
              unitPrice: extracted.unitPrice,
              gstPercent: extracted.gstPercent,
              totalAmount: extracted.totalPrice,
              specs: `${extracted.warrantyYears} Yr Warranty, ${extracted.amcDetails}`,
            },
          ],
        },
      },
      include: { items: true },
    });

    return NextResponse.json({ quotation: saved, extracted, warnings: extracted.warnings });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to parse quotation' }, { status: 500 });
  }
}
