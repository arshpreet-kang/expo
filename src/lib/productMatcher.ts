import { db } from './db';
import { ExtractedSpecification } from './requirementParser';

export interface MatchedOption {
  productId: string;
  productName: string;
  model: string;
  brand: string;
  category: string;
  processor: string | null;
  ram: string | null;
  storage: string | null;
  gpu: string | null;
  warranty: string | null;
  price: number;
  currency: string;
  sourceName: string;
  sourceType: string; // CHANDIGARH_PROCUREMENT, CHANDIGARH_SELLER, NATIONAL_MARKET, USER_QUOTATION
  sourceUrl: string | null;
  geography: string;
  collectionDate: string;
  availability: string;
  matchReasons: string[];
}

export interface MatchingResult {
  hasVerifiedData: boolean;
  quantity: number;
  matchedOptions: MatchedOption[];
  procurementRecords: any[];
  unitPriceMin: number | null;
  unitPriceMax: number | null;
  budgetMin: number | null;
  budgetMax: number | null;
  budgetNotice: string;
  insufficientDataReason?: string;
}

export async function findMatchingProducts(spec: ExtractedSpecification): Promise<MatchingResult> {
  // Query DB for products in the category
  const products = await db.product.findMany({
    where: {
      category: {
        contains: spec.category,
      },
    },
    include: {
      marketPrices: {
        include: {
          source: true,
        },
      },
    },
  });

  // Query procurement records (tenders) in Chandigarh
  const tenders = await db.procurementRecord.findMany({
    where: {
      category: {
        contains: spec.category,
      },
    },
    include: {
      source: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const matchedOptions: MatchedOption[] = [];

  for (const prod of products) {
    for (const mp of prod.marketPrices) {
      const matchReasons: string[] = [];

      if (spec.ram && prod.ram?.toLowerCase().includes(spec.ram.toLowerCase().split(' ')[0])) {
        matchReasons.push(`Matches your ${spec.ram} RAM requirement.`);
      }
      if (spec.storage && prod.storage?.toLowerCase().includes(spec.storage.toLowerCase().split(' ')[0])) {
        matchReasons.push(`Meets your ${spec.storage} storage spec.`);
      }
      if (prod.warranty) {
        matchReasons.push(`Provides ${prod.warranty}.`);
      }
      if (mp.geography === 'Chandigarh') {
        matchReasons.push('Verified local Chandigarh market option.');
      } else {
        matchReasons.push('National Indian Market Data.');
      }

      // If budget specified, check condition
      if (spec.maxBudget && mp.price > spec.maxBudget) {
        // Exclude if explicitly above max budget constraint
        continue;
      }

      matchedOptions.push({
        productId: prod.id,
        productName: prod.name,
        model: prod.model,
        brand: prod.brand,
        category: prod.category,
        processor: prod.processor,
        ram: prod.ram,
        storage: prod.storage,
        gpu: prod.gpu,
        warranty: prod.warranty || mp.warranty,
        price: mp.price,
        currency: mp.currency,
        sourceName: mp.source.name,
        sourceType: mp.source.sourceType,
        sourceUrl: mp.source.url,
        geography: mp.geography,
        collectionDate: mp.collectionDate,
        availability: mp.availability,
        matchReasons,
      });
    }
  }

  // Sort by price ascending
  matchedOptions.sort((a, b) => a.price - b.price);

  if (matchedOptions.length === 0) {
    return {
      hasVerifiedData: false,
      quantity: spec.quantity,
      matchedOptions: [],
      procurementRecords: tenders,
      unitPriceMin: null,
      unitPriceMax: null,
      budgetMin: null,
      budgetMax: null,
      budgetNotice: 'Insufficient verified current data',
      insufficientDataReason:
        'We found limited matching data for this requirement. Add a vendor quotation or another verified source to continue the analysis.',
    };
  }

  const prices = matchedOptions.map((o) => o.price);
  const unitPriceMin = Math.min(...prices);
  const unitPriceMax = Math.max(...prices);

  const budgetMin = unitPriceMin * spec.quantity;
  const budgetMax = unitPriceMax * spec.quantity;

  return {
    hasVerifiedData: true,
    quantity: spec.quantity,
    matchedOptions,
    procurementRecords: tenders,
    unitPriceMin,
    unitPriceMax,
    budgetMin,
    budgetMax,
    budgetNotice: 'Indicative current procurement budget based on available verified data',
  };
}
