export interface ExtractedSpecification {
  quantity: number;
  category: string;
  purpose: string;
  ram: string;
  storage: string;
  processor: string;
  gpu: string;
  warranty: string;
  location: string;
  maxBudget?: number;
  assumptions: string[];
  missingClarifications: string[];
}

export function parseRequirementText(text: string): ExtractedSpecification {
  const lower = text.toLowerCase();
  const assumptions: string[] = [];
  const missingClarifications: string[] = [];

  // 1. Quantity Extraction
  let quantity = 1;
  const qtyMatch = text.match(/(\d+)\s*(?:laptops|pcs|computers|desktops|servers|units|monitors|switches|items)/i) || text.match(/need\s+(\d+)/i) || text.match(/quantity:?\s*(\d+)/i);
  if (qtyMatch) {
    quantity = parseInt(qtyMatch[1], 10);
  } else {
    assumptions.push('Default quantity set to 1 unit.');
    missingClarifications.push('What is your required procurement quantity?');
  }

  // 2. Category Extraction
  let category = 'Laptop';
  if (lower.includes('server') || lower.includes('rack') || lower.includes('nas')) {
    category = 'Server';
  } else if (lower.includes('desktop') || lower.includes('pc') || lower.includes('all-in-one') || lower.includes('aio')) {
    category = 'Desktop';
  } else if (lower.includes('switch') || lower.includes('router') || lower.includes('access point') || lower.includes('network')) {
    category = 'Networking';
  } else if (lower.includes('monitor') || lower.includes('display')) {
    category = 'Display';
  } else if (lower.includes('printer') || lower.includes('ups') || lower.includes('keyboard')) {
    category = 'Peripheral';
  } else if (lower.includes('amc') || lower.includes('support') || lower.includes('installation')) {
    category = 'IT_Service';
  } else {
    category = 'Laptop';
  }

  // 3. Purpose Extraction
  let purpose = 'General IT Workload';
  if (lower.includes('developer') || lower.includes('programming') || lower.includes('coding') || lower.includes('software')) {
    purpose = 'Software Development & Engineering';
  } else if (lower.includes('machine learning') || lower.includes('ml') || lower.includes('ai') || lower.includes('data science') || lower.includes('student')) {
    purpose = 'AI / ML & Academic Workloads';
  } else if (lower.includes('office') || lower.includes('secretariat') || lower.includes('admin')) {
    purpose = 'Institutional / Office Administration';
  } else if (lower.includes('enterprise') || lower.includes('datacenter') || lower.includes('lab')) {
    purpose = 'Data Center / Research Lab';
  }

  // 4. RAM Extraction
  let ram = '16 GB';
  if (lower.includes('32gb') || lower.includes('32 gb')) {
    ram = '32 GB';
  } else if (lower.includes('64gb') || lower.includes('64 gb')) {
    ram = '64 GB';
  } else if (lower.includes('8gb') || lower.includes('8 gb')) {
    ram = '8 GB';
  } else if (lower.includes('16gb') || lower.includes('16 gb')) {
    ram = '16 GB';
  } else {
    assumptions.push('Assumed standard 16 GB RAM requirement for commercial work.');
  }

  // 5. Storage Extraction
  let storage = '512 GB SSD';
  if (lower.includes('1tb') || lower.includes('1 tb')) {
    storage = '1 TB NVMe SSD';
  } else if (lower.includes('2tb') || lower.includes('2 tb')) {
    storage = '2 TB NVMe SSD';
  } else if (lower.includes('256gb') || lower.includes('256 gb')) {
    storage = '256 GB SSD';
  } else if (lower.includes('512gb') || lower.includes('512 gb')) {
    storage = '512 GB SSD';
  } else {
    assumptions.push('Assumed 512 GB SSD standard storage.');
  }

  // 6. Processor Class
  let processor = 'Intel Core i5 / i7 (13th Gen)';
  if (lower.includes('i7') || lower.includes('core i7')) {
    processor = 'Intel Core i7 (13th Gen)';
  } else if (lower.includes('ryzen') || lower.includes('amd')) {
    processor = 'AMD Ryzen 7 7000 Series';
  } else if (lower.includes('m2') || lower.includes('apple') || lower.includes('macbook')) {
    processor = 'Apple M2 8-core CPU';
  } else if (lower.includes('xeon') || lower.includes('epyc')) {
    processor = 'Dual Intel Xeon / AMD EPYC';
  }

  // 7. GPU Requirement
  let gpu = 'Integrated Graphics (Iris Xe / AMD Radeon)';
  if (lower.includes('rtx') || lower.includes('dedicated gpu') || lower.includes('graphics card') || lower.includes('nvidia') || lower.includes('3050') || lower.includes('4060')) {
    gpu = 'Dedicated GPU (NVIDIA RTX 3050 4GB VRAM+)';
  } else {
    if (purpose.includes('AI / ML')) {
      missingClarifications.push('Do you require a dedicated GPU (e.g. NVIDIA RTX) for deep learning training?');
    }
  }

  // 8. Warranty
  let warranty = '3 Years Onsite Warranty';
  if (lower.includes('1 year') || lower.includes('1-year') || lower.includes('1yr')) {
    warranty = '1 Year Warranty';
  } else if (lower.includes('2 year') || lower.includes('2-year')) {
    warranty = '2 Years Warranty';
  } else if (lower.includes('3 year') || lower.includes('3-year') || lower.includes('3yr')) {
    warranty = '3 Years Onsite ProSupport';
  } else {
    assumptions.push('Default commercial procurement standard: 3 Years Onsite Warranty.');
  }

  // 9. Max Budget Extraction
  let maxBudget: number | undefined = undefined;
  const budgetMatch = text.match(/(?:under|below|budget|max|up to)\s*(?:₹|rs\.?|inr)?\s*(\d+(?:,\d+)*(?:\.\d+)?)/i) || text.match(/₹\s*(\d+(?:,\d+)*)/);
  if (budgetMatch) {
    const cleanNum = budgetMatch[1].replace(/,/g, '');
    maxBudget = parseFloat(cleanNum);
  }

  return {
    quantity,
    category,
    purpose,
    ram,
    storage,
    processor,
    gpu,
    warranty,
    location: 'Chandigarh',
    maxBudget,
    assumptions,
    missingClarifications,
  };
}
