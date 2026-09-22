export interface ReportData {
  reportId: string;
  generatedAt: string;
  organization: string;
  rawRequirement: string;
  specification: any;
  matchedOptions: any[];
  procurementRecords: any[];
  indicativeBudget: {
    min: number;
    max: number;
    notice: string;
  };
  tcoBreakdown: any;
  vendorQuotations: any[];
  assumptions: string[];
  dataLimitations: string[];
}

export function generateProcurementReportData(input: Partial<ReportData>): ReportData {
  const generatedAt = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return {
    reportId: `PROC-CHD-${Math.floor(100000 + Math.random() * 900000)}`,
    generatedAt,
    organization: input.organization || 'Institutional Procurement Team, Chandigarh',
    rawRequirement: input.rawRequirement || 'N/A',
    specification: input.specification || {},
    matchedOptions: input.matchedOptions || [],
    procurementRecords: input.procurementRecords || [],
    indicativeBudget: input.indicativeBudget || { min: 0, max: 0, notice: 'Indicative current procurement budget based on available verified data' },
    tcoBreakdown: input.tcoBreakdown || null,
    vendorQuotations: input.vendorQuotations || [],
    assumptions: input.assumptions || [
      'Indicative budget range is calculated directly from verified observed market prices.',
      'Prices include standard GST (18%) unless specified otherwise.',
      'Geographical priority is assigned to Chandigarh local distributors and e-Procurement records.',
    ],
    dataLimitations: input.dataLimitations || [
      'ProcureIntel AI does NOT predict future price movements or score vendor reasonability.',
      'All market prices reflect observed values on the indicated collection date.',
      'Final procurement decisions reside with the institutional buyer.',
    ],
  };
}
