export interface TcoInput {
  unitPrice: number;
  quantity: number;
  warrantyYears: number; // e.g. 3
  yearsOfOperation?: number; // e.g. 3 or 5
  customWarrantyCost?: number;
  customAmcCostPerYear?: number;
  installationCost?: number;
  logisticsCost?: number;
  otherCost?: number;
}

export interface TcoBreakdown {
  purchaseCost: number;
  warrantyCost: number | null;
  amcCost: number | null;
  installationCost: number | null;
  logisticsCost: number | null;
  otherCost: number | null;
  totalTco: number;
  formattedBreakdown: {
    label: string;
    value: number | null;
    displayValue: string;
    isDocumented: boolean;
  }[];
}

export function calculateTco(input: TcoInput): TcoBreakdown {
  const years = input.yearsOfOperation || 3;
  const purchaseCost = input.unitPrice * input.quantity;

  const warrantyCost = input.customWarrantyCost !== undefined ? input.customWarrantyCost : 0; // 0 if included in base purchase price

  // AMC after warranty expires (if years > warrantyYears)
  let amcCost: number | null = null;
  if (input.customAmcCostPerYear !== undefined) {
    const postWarrantyYears = Math.max(0, years - input.warrantyYears);
    amcCost = input.customAmcCostPerYear * postWarrantyYears * input.quantity;
  }

  const installationCost = input.installationCost !== undefined ? input.installationCost : null;
  const logisticsCost = input.logisticsCost !== undefined ? input.logisticsCost : null;
  const otherCost = input.otherCost !== undefined ? input.otherCost : null;

  let totalTco = purchaseCost + (warrantyCost || 0);
  if (amcCost !== null) totalTco += amcCost;
  if (installationCost !== null) totalTco += installationCost;
  if (logisticsCost !== null) totalTco += logisticsCost;
  if (otherCost !== null) totalTco += otherCost;

  const formatCurrency = (val: number | null) => (val === null ? 'Not provided' : `₹${val.toLocaleString('en-IN')}`);

  return {
    purchaseCost,
    warrantyCost,
    amcCost,
    installationCost,
    logisticsCost,
    otherCost,
    totalTco,
    formattedBreakdown: [
      {
        label: 'Purchase Cost (Unit Price × Quantity)',
        value: purchaseCost,
        displayValue: formatCurrency(purchaseCost),
        isDocumented: true,
      },
      {
        label: `Warranty & Support (${input.warrantyYears} Years)`,
        value: warrantyCost,
        displayValue: warrantyCost === 0 ? 'Included in Base Price' : formatCurrency(warrantyCost),
        isDocumented: true,
      },
      {
        label: `AMC Cost (${Math.max(0, years - input.warrantyYears)} Post-Warranty Years)`,
        value: amcCost,
        displayValue: formatCurrency(amcCost),
        isDocumented: amcCost !== null,
      },
      {
        label: 'Installation & Deployment Charges',
        value: installationCost,
        displayValue: formatCurrency(installationCost),
        isDocumented: installationCost !== null,
      },
      {
        label: 'Logistics & Shipping Charges',
        value: logisticsCost,
        displayValue: formatCurrency(logisticsCost),
        isDocumented: logisticsCost !== null,
      },
      {
        label: 'Other Documented Costs',
        value: otherCost,
        displayValue: formatCurrency(otherCost),
        isDocumented: otherCost !== null,
      },
    ],
  };
}
