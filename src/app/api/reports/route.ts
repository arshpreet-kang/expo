import { NextResponse } from 'next/server';
import { generateProcurementReportData } from '@/lib/reportGenerator';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const reportData = generateProcurementReportData(body);

    const saved = await db.procurementReport.create({
      data: {
        title: `IT Procurement Report - ${reportData.organization}`,
        organization: reportData.organization,
        budgetMin: reportData.indicativeBudget.min,
        budgetMax: reportData.indicativeBudget.max,
        tcoTotal: reportData.tcoBreakdown?.totalTco || 0,
        reportJson: JSON.stringify(reportData),
      },
    });

    return NextResponse.json({ reportId: saved.id, report: reportData });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to generate report' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const reports = await db.procurementReport.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
    });
    return NextResponse.json(reports);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch reports' }, { status: 500 });
  }
}
