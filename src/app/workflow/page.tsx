'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import WorkflowStepper from '@/components/ui/WorkflowStepper';
import SourceBadge from '@/components/ui/SourceBadge';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  FileText,
  Calculator,
  Sliders,
  Upload,
  Download,
  Printer,
  ShieldCheck,
  Building2,
  GraduationCap,
  ExternalLink,
  Edit2,
  RefreshCw,
  Plus,
} from 'lucide-react';

function WorkflowContent() {
  const searchParams = useSearchParams();
  const presetParam = searchParams.get('preset');

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Step 1 & 2 State
  const [inputText, setInputText] = useState(
    'We need 100 laptops for software developers with 16GB RAM, 512GB SSD and 3-year warranty.'
  );

  const [spec, setSpec] = useState({
    quantity: 100,
    category: 'Laptop',
    purpose: 'Software Development',
    ram: '16 GB',
    storage: '512 GB SSD',
    processor: 'Intel Core i5 / i7 (13th Gen)',
    gpu: 'Integrated Graphics (Iris Xe)',
    warranty: '3 Years Onsite Warranty',
    location: 'Chandigarh',
    maxBudget: undefined as number | undefined,
    assumptions: ['Assumed standard 16 GB RAM requirement.'],
    missingClarifications: [] as string[],
  });

  // Step 3 & 4 State
  const [matchData, setMatchData] = useState<any>(null);

  // Step 5 State (What-If Simulator)
  const [whatIfQty, setWhatIfQty] = useState(100);
  const [whatIfRam, setWhatIfRam] = useState('16 GB');
  const [whatIfStorage, setWhatIfStorage] = useState('512 GB SSD');
  const [whatIfGpu, setWhatIfGpu] = useState(false);
  const [whatIfWarranty, setWhatIfWarranty] = useState('3 Years Onsite Warranty');

  // Step 6 State (TCO)
  const [tcoData, setTcoData] = useState<any>(null);
  const [customAmc, setCustomAmc] = useState<number | undefined>(undefined);
  const [customInstallation, setCustomInstallation] = useState<number | undefined>(15000);

  // Step 7 State (Quotes)
  const [quotations, setQuotations] = useState<any[]>([]);
  const [uploadingPdf, setUploadingPdf] = useState(false);

  // Step 8 State (Report)
  const [reportData, setReportData] = useState<any>(null);

  // Load Presets if URL param passed
  useEffect(() => {
    if (presetParam === 'student') {
      const text = 'I am a CSE student in Chandigarh. I need a laptop for programming, Python, machine learning and college work under ₹70,000.';
      setInputText(text);
      handleParseRequirement(text);
    } else if (presetParam === 'college') {
      const text = 'Panjab University Department of Computer Science needs 100 commercial laptops for developer labs with 16GB RAM, 512GB SSD, 3-year onsite warranty.';
      setInputText(text);
      handleParseRequirement(text);
    }
  }, [presetParam]);

  // Handle Spec Extraction
  const handleParseRequirement = async (textToParse?: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/requirements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textToParse || inputText }),
      });
      const data = await res.json();
      if (data.spec) {
        setSpec(data.spec);
        setWhatIfQty(data.spec.quantity);
        setWhatIfRam(data.spec.ram);
        setWhatIfStorage(data.spec.storage);
        setWhatIfWarranty(data.spec.warranty);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Product Matches
  const handleFetchMatches = async (currentSpec: any) => {
    setLoading(true);
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentSpec),
      });
      const data = await res.json();
      setMatchData(data);

      // Trigger TCO calculation with top match
      if (data.matchedOptions && data.matchedOptions.length > 0) {
        const topOption = data.matchedOptions[0];
        calculateTcoForOption(topOption.price, currentSpec.quantity);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Trigger TCO Calculation
  const calculateTcoForOption = async (unitPrice: number, qty: number) => {
    try {
      const res = await fetch('/api/tco', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          unitPrice,
          quantity: qty,
          warrantyYears: 3,
          yearsOfOperation: 3,
          customAmcCostPerYear: customAmc,
          installationCost: customInstallation,
        }),
      });
      const data = await res.json();
      setTcoData(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Load Vendor Quotes
  const fetchQuotations = async () => {
    try {
      const res = await fetch('/api/quotations');
      const data = await res.json();
      setQuotations(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchQuotations();
  }, []);

  // Handle PDF Upload Simulation / Real
  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploadingPdf(true);

    const formData = new FormData();
    formData.append('file', e.target.files[0]);

    try {
      const res = await fetch('/api/quotations/extract', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      await fetchQuotations();
    } catch (err) {
      console.error(err);
    } finally {
      setUploadingPdf(false);
    }
  };

  // Handle Report Generation
  const handleGenerateReport = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organization: spec.purpose.includes('Academic') ? 'Panjab University / Educational Institution' : 'Chandigarh IT Procurement Team',
          rawRequirement: inputText,
          specification: spec,
          matchedOptions: matchData?.matchedOptions || [],
          procurementRecords: matchData?.procurementRecords || [],
          indicativeBudget: {
            min: matchData?.budgetMin || 0,
            max: matchData?.budgetMax || 0,
            notice: matchData?.budgetNotice || 'Indicative current procurement budget based on available verified data',
          },
          tcoBreakdown: tcoData,
          vendorQuotations: quotations,
        }),
      });
      const data = await res.json();
      setReportData(data.report);
      setCurrentStep(8);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Navigation handlers
  const goToNextStep = async () => {
    if (currentStep === 1) {
      await handleParseRequirement();
      setCurrentStep(2);
    } else if (currentStep === 2) {
      await handleFetchMatches(spec);
      setCurrentStep(3);
    } else if (currentStep === 3) {
      setCurrentStep(4);
    } else if (currentStep === 4) {
      setCurrentStep(5);
    } else if (currentStep === 5) {
      setCurrentStep(6);
    } else if (currentStep === 6) {
      setCurrentStep(7);
    } else if (currentStep === 7) {
      await handleGenerateReport();
    }
  };

  const goToPrevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="space-y-8 py-4">
      {/* Stepper Header */}
      <WorkflowStepper currentStep={currentStep} onStepClick={(s) => setCurrentStep(s)} />

      {/* STEP 1: REQUIREMENT BUILDER */}
      {currentStep === 1 && (
        <div className="bg-surface-card border border-surface-border rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between border-b border-surface-border pb-4">
            <div>
              <span className="text-xs font-mono text-chd-gold uppercase tracking-wider">STEP 01</span>
              <h2 className="text-2xl font-bold text-brand-50">AI Requirement Builder</h2>
              <p className="text-sm text-surface-muted">
                Describe your IT procurement need naturally. The system will convert it into a structured technical specification.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-semibold text-brand-200">Natural-Language Requirement Input</label>
            <textarea
              rows={4}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full bg-surface-dark border border-surface-border rounded-xl p-4 text-brand-50 placeholder-surface-muted focus:outline-none focus:border-chd-gold font-sans text-sm leading-relaxed"
              placeholder="e.g. We need 100 laptops for software developers with 16GB RAM, 512GB SSD and 3-year warranty."
            />

            {/* Presets */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-mono text-surface-muted">Quick Presets:</span>
              <button
                onClick={() => {
                  const t = 'Panjab University Department of Computer Science needs 100 commercial laptops for developer labs with 16GB RAM, 512GB SSD, 3-year onsite warranty.';
                  setInputText(t);
                }}
                className="text-xs font-mono bg-surface-dark border border-surface-border hover:border-chd-gold text-brand-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <Building2 className="w-3.5 h-3.5 text-chd-gold" />
                <span>100 Developer Laptops (PU Lab)</span>
              </button>

              <button
                onClick={() => {
                  const t = 'I am a CSE student in Chandigarh. I need a laptop for programming, Python, machine learning and college work under ₹70,000.';
                  setInputText(t);
                }}
                className="text-xs font-mono bg-surface-dark border border-surface-border hover:border-chd-gold text-brand-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <GraduationCap className="w-3.5 h-3.5 text-chd-emerald" />
                <span>Student Laptop (&lt; ₹70,000)</span>
              </button>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={goToNextStep}
              disabled={loading || !inputText.trim()}
              className="px-6 py-3 bg-chd-gold text-surface-dark font-extrabold rounded-xl hover:bg-yellow-400 transition-all flex items-center gap-2 text-sm shadow-lg disabled:opacity-50"
            >
              <span>{loading ? 'Analyzing Requirement...' : 'Extract Specifications'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: STRUCTURED SPECIFICATIONS */}
      {currentStep === 2 && (
        <div className="bg-surface-card border border-surface-border rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between border-b border-surface-border pb-4">
            <div>
              <span className="text-xs font-mono text-chd-gold uppercase tracking-wider">STEP 02</span>
              <h2 className="text-2xl font-bold text-brand-50">Structured Technical Specification</h2>
              <p className="text-sm text-surface-muted">
                Review and edit the extracted specification attributes below before searching market options.
              </p>
            </div>
          </div>

          {/* Spec Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { label: 'Procurement Quantity', field: 'quantity', type: 'number', val: spec.quantity },
              { label: 'Product Category', field: 'category', type: 'text', val: spec.category },
              { label: 'Primary Use Case', field: 'purpose', type: 'text', val: spec.purpose },
              { label: 'System Memory (RAM)', field: 'ram', type: 'text', val: spec.ram },
              { label: 'Storage Capacity', field: 'storage', type: 'text', val: spec.storage },
              { label: 'Processor Class', field: 'processor', type: 'text', val: spec.processor },
              { label: 'Graphics / GPU', field: 'gpu', type: 'text', val: spec.gpu },
              { label: 'Warranty & Support', field: 'warranty', type: 'text', val: spec.warranty },
              { label: 'Geographical Focus', field: 'location', type: 'text', val: spec.location },
            ].map((item) => (
              <div key={item.field} className="bg-surface-dark border border-surface-border rounded-xl p-4 space-y-1">
                <span className="text-xs font-mono text-surface-muted uppercase block">{item.label}</span>
                <input
                  type={item.type}
                  value={item.val}
                  onChange={(e) =>
                    setSpec({
                      ...spec,
                      [item.field]: item.type === 'number' ? parseInt(e.target.value, 10) || 1 : e.target.value,
                    })
                  }
                  className="w-full bg-transparent text-brand-100 font-semibold focus:outline-none focus:border-chd-gold text-sm border-b border-transparent focus:border-surface-border"
                />
              </div>
            ))}
          </div>

          {/* Assumptions & Clarifications */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {spec.assumptions.length > 0 && (
              <div className="bg-surface-dark border border-brand-800/40 rounded-xl p-4 text-xs space-y-2">
                <span className="font-bold text-chd-gold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-chd-gold" /> System Assumptions
                </span>
                <ul className="list-disc list-inside text-surface-muted space-y-1">
                  {spec.assumptions.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              </div>
            )}

            {spec.missingClarifications.length > 0 && (
              <div className="bg-surface-dark border border-chd-amber/40 rounded-xl p-4 text-xs space-y-2">
                <span className="font-bold text-chd-amber flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-chd-amber" /> Clarifications Asked
                </span>
                <ul className="list-disc list-inside text-surface-muted space-y-1">
                  {spec.missingClarifications.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="pt-4 flex items-center justify-between">
            <button
              onClick={goToPrevStep}
              className="px-4 py-2.5 bg-surface-dark border border-surface-border text-brand-200 rounded-xl text-xs font-mono flex items-center gap-2 hover:border-chd-gold"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Requirement
            </button>
            <button
              onClick={goToNextStep}
              disabled={loading}
              className="px-6 py-3 bg-chd-gold text-surface-dark font-extrabold rounded-xl hover:bg-yellow-400 transition-all flex items-center gap-2 text-sm shadow-lg"
            >
              <span>{loading ? 'Finding Options...' : 'Find Verified Market Data'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3 & 4: CURRENT MARKET DATA & OPTIONS */}
      {(currentStep === 3 || currentStep === 4) && (
        <div className="bg-surface-card border border-surface-border rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-surface-border pb-4">
            <div>
              <span className="text-xs font-mono text-chd-gold uppercase tracking-wider">
                STEP 0{currentStep} • {currentStep === 3 ? 'Current Market Data' : 'Option Matching & Comparison'}
              </span>
              <h2 className="text-2xl font-bold text-brand-50">
                {currentStep === 3 ? 'Verified Current Products' : 'Detailed Option Comparison'}
              </h2>
              <p className="text-sm text-surface-muted">
                Verified observed IT products in Chandigarh and active e-Procurement tenders matching your specifications.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentStep(3)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono ${
                  currentStep === 3 ? 'bg-chd-gold text-surface-dark font-bold' : 'bg-surface-dark text-surface-muted'
                }`}
              >
                Cards View
              </button>
              <button
                onClick={() => setCurrentStep(4)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono ${
                  currentStep === 4 ? 'bg-chd-gold text-surface-dark font-bold' : 'bg-surface-dark text-surface-muted'
                }`}
              >
                Comparison Table
              </button>
            </div>
          </div>

          {/* Notice if Insufficient Data */}
          {matchData && !matchData.hasVerifiedData && (
            <div className="bg-surface-dark border border-chd-amber rounded-xl p-4 text-sm text-chd-amber space-y-2">
              <div className="font-bold flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                <span>{matchData.budgetNotice}</span>
              </div>
              <p className="text-xs text-surface-muted">{matchData.insufficientDataReason}</p>
            </div>
          )}

          {/* Cards View (Step 3) */}
          {currentStep === 3 && matchData?.matchedOptions && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matchData.matchedOptions.map((opt: any) => (
                <div
                  key={opt.productId}
                  className="bg-surface-dark border border-surface-border rounded-xl p-5 hover:border-chd-gold/60 transition-all flex flex-col justify-between space-y-4 shadow-lg group"
                >
                  <div className="space-y-3">
                    <SourceBadge
                      sourceType={opt.sourceType}
                      sourceName={opt.sourceName}
                      sourceUrl={opt.sourceUrl}
                      geography={opt.geography}
                      collectionDate={opt.collectionDate}
                    />

                    <div>
                      <span className="text-[11px] font-mono text-chd-gold">{opt.brand} • Model {opt.model}</span>
                      <h3 className="text-lg font-bold text-brand-100 group-hover:text-chd-gold transition-colors">
                        {opt.productName}
                      </h3>
                    </div>

                    <div className="space-y-1 text-xs text-brand-200">
                      <div><span className="text-surface-muted">Processor:</span> {opt.processor || 'Standard'}</div>
                      <div><span className="text-surface-muted">RAM & Storage:</span> {opt.ram} | {opt.storage}</div>
                      <div><span className="text-surface-muted">Warranty:</span> {opt.warranty}</div>
                    </div>

                    <div className="pt-2 border-t border-surface-border/50">
                      <span className="text-[11px] font-mono text-surface-muted block mb-1">EVIDENCE MATCHING:</span>
                      <ul className="space-y-1">
                        {opt.matchReasons.map((r: string, idx: number) => (
                          <li key={idx} className="text-[11px] text-chd-emerald flex items-center gap-1.5">
                            <CheckCircle2 className="w-3 h-3 flex-shrink-0" />
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-surface-border flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-surface-muted block">OBSERVED UNIT PRICE</span>
                      <span className="text-xl font-extrabold text-brand-50">
                        ₹{opt.price.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <span className="text-[11px] text-surface-muted bg-surface-card px-2.5 py-1 rounded-md border border-surface-border">
                      {opt.availability}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Comparison Table View (Step 4) */}
          {currentStep === 4 && matchData?.matchedOptions && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-brand-200">
                <thead className="bg-surface-dark border-b border-surface-border text-surface-muted uppercase font-mono">
                  <tr>
                    <th className="p-3">Product</th>
                    <th className="p-3">Specs</th>
                    <th className="p-3">Source & Location</th>
                    <th className="p-3">Collection Date</th>
                    <th className="p-3">Observed Unit Price</th>
                    <th className="p-3">Total ({spec.quantity} Units)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border">
                  {matchData.matchedOptions.map((opt: any) => (
                    <tr key={opt.productId} className="hover:bg-surface-dark/60">
                      <td className="p-3 font-semibold text-brand-100">
                        {opt.productName}
                        <span className="block text-[10px] font-mono text-chd-gold">{opt.model}</span>
                      </td>
                      <td className="p-3">
                        {opt.ram} RAM • {opt.storage}
                        <span className="block text-[10px] text-surface-muted">{opt.warranty}</span>
                      </td>
                      <td className="p-3">
                        <SourceBadge sourceType={opt.sourceType} sourceName={opt.sourceName} showViewSource={false} />
                      </td>
                      <td className="p-3 font-mono text-surface-muted">{opt.collectionDate}</td>
                      <td className="p-3 font-bold text-brand-50">₹{opt.price.toLocaleString('en-IN')}</td>
                      <td className="p-3 font-extrabold text-chd-gold">
                        ₹{(opt.price * spec.quantity).toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Active Chandigarh e-Procurement Tenders */}
          {matchData?.procurementRecords && matchData.procurementRecords.length > 0 && (
            <div className="pt-6 border-t border-surface-border space-y-4">
              <h3 className="text-lg font-bold text-brand-100 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-chd-gold" />
                <span>Active Chandigarh e-Procurement Tenders ({matchData.procurementRecords.length})</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {matchData.procurementRecords.map((t: any) => (
                  <div key={t.id} className="bg-surface-dark border border-surface-border rounded-xl p-4 space-y-2 text-xs">
                    <div className="flex items-center justify-between font-mono text-chd-gold">
                      <span>Tender ID: {t.tenderId}</span>
                      <span>Date: {t.tenderDate}</span>
                    </div>
                    <h4 className="font-bold text-brand-100">{t.organization}</h4>
                    <p className="text-surface-muted">{t.item}</p>
                    <div className="pt-2 flex items-center justify-between text-[11px]">
                      <span className="text-brand-300 font-mono">Qty: {t.quantity} Units</span>
                      {t.sourceUrl && (
                        <a
                          href={t.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-chd-gold hover:underline flex items-center gap-1 font-mono"
                        >
                          <span>Official Tender Document</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4 flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-4 py-2.5 bg-surface-dark border border-surface-border text-brand-200 rounded-xl text-xs font-mono flex items-center gap-2 hover:border-chd-gold"
            >
              <ArrowLeft className="w-4 h-4" /> Edit Specifications
            </button>
            <button
              onClick={() => setCurrentStep(5)}
              className="px-6 py-3 bg-chd-gold text-surface-dark font-extrabold rounded-xl hover:bg-yellow-400 transition-all flex items-center gap-2 text-sm shadow-lg"
            >
              <span>Calculate Indicative Budget</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: INDICATIVE BUDGET & WHAT-IF SIMULATOR */}
      {currentStep === 5 && (
        <div className="bg-surface-card border border-surface-border rounded-2xl p-6 sm:p-8 space-y-8 shadow-2xl">
          <div className="flex items-center justify-between border-b border-surface-border pb-4">
            <div>
              <span className="text-xs font-mono text-chd-gold uppercase tracking-wider">STEP 05</span>
              <h2 className="text-2xl font-bold text-brand-50">Indicative Procurement Budget & What-If Simulator</h2>
              <p className="text-sm text-surface-muted">
                Calculated strictly from observed unit price ranges. Use the controls below to simulate what-if scenarios.
              </p>
            </div>
          </div>

          {/* Budget Summary Card */}
          <div className="bg-gradient-to-r from-surface-dark via-brand-950 to-surface-dark border border-chd-gold/40 rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono text-surface-muted block uppercase">REQUIRED QUANTITY</span>
                <span className="text-3xl font-black text-brand-50">{whatIfQty} Units</span>
              </div>
              <div>
                <span className="text-xs font-mono text-surface-muted block uppercase">OBSERVED UNIT PRICE RANGE</span>
                <span className="text-2xl font-bold text-brand-200">
                  ₹{matchData?.unitPriceMin?.toLocaleString('en-IN') || '0'} – ₹
                  {matchData?.unitPriceMax?.toLocaleString('en-IN') || '0'}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono text-chd-gold block uppercase font-bold">
                  INDICATIVE PROCUREMENT BUDGET
                </span>
                <span className="text-3xl sm:text-4xl font-black text-chd-gold">
                  ₹{( (matchData?.unitPriceMin || 0) * whatIfQty ).toLocaleString('en-IN')} – ₹
                  {( (matchData?.unitPriceMax || 0) * whatIfQty ).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-surface-border/60 text-xs font-mono text-surface-muted flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-chd-emerald">
                <ShieldCheck className="w-4 h-4" /> {matchData?.budgetNotice || 'Indicative current procurement budget based on available verified data'}
              </span>
              <span>No price prediction applied • 100% Observed Data</span>
            </div>
          </div>

          {/* What-If Simulator Panel */}
          <div className="bg-surface-dark border border-surface-border rounded-xl p-6 space-y-6">
            <h3 className="text-lg font-bold text-brand-100 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-chd-gold" />
              <span>Interactive What-If Scenario Simulator</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Quantity Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-surface-muted">Quantity</span>
                  <span className="text-chd-gold font-bold">{whatIfQty} Units</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="200"
                  value={whatIfQty}
                  onChange={(e) => setWhatIfQty(parseInt(e.target.value, 10))}
                  className="w-full accent-chd-gold"
                />
              </div>

              {/* RAM Dropdown */}
              <div className="space-y-2">
                <label className="text-xs font-mono text-surface-muted block">System RAM</label>
                <select
                  value={whatIfRam}
                  onChange={(e) => setWhatIfRam(e.target.value)}
                  className="w-full bg-surface-card border border-surface-border rounded-lg p-2.5 text-xs text-brand-100 focus:outline-none focus:border-chd-gold"
                >
                  <option value="8 GB">8 GB RAM</option>
                  <option value="16 GB">16 GB RAM</option>
                  <option value="32 GB">32 GB RAM</option>
                  <option value="64 GB">64 GB RAM</option>
                </select>
              </div>

              {/* Storage Dropdown */}
              <div className="space-y-2">
                <label className="text-xs font-mono text-surface-muted block">Storage Capacity</label>
                <select
                  value={whatIfStorage}
                  onChange={(e) => setWhatIfStorage(e.target.value)}
                  className="w-full bg-surface-card border border-surface-border rounded-lg p-2.5 text-xs text-brand-100 focus:outline-none focus:border-chd-gold"
                >
                  <option value="256 GB SSD">256 GB SSD</option>
                  <option value="512 GB SSD">512 GB SSD</option>
                  <option value="1 TB NVMe SSD">1 TB NVMe SSD</option>
                </select>
              </div>

              {/* Warranty Dropdown */}
              <div className="space-y-2">
                <label className="text-xs font-mono text-surface-muted block">Warranty Term</label>
                <select
                  value={whatIfWarranty}
                  onChange={(e) => setWhatIfWarranty(e.target.value)}
                  className="w-full bg-surface-card border border-surface-border rounded-lg p-2.5 text-xs text-brand-100 focus:outline-none focus:border-chd-gold"
                >
                  <option value="1 Year Warranty">1 Year Warranty</option>
                  <option value="3 Years Onsite Warranty">3 Years Onsite Warranty</option>
                  <option value="5 Years Premier Support">5 Years Premier Support</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(4)}
              className="px-4 py-2.5 bg-surface-dark border border-surface-border text-brand-200 rounded-xl text-xs font-mono flex items-center gap-2 hover:border-chd-gold"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Options
            </button>
            <button
              onClick={() => setCurrentStep(6)}
              className="px-6 py-3 bg-chd-gold text-surface-dark font-extrabold rounded-xl hover:bg-yellow-400 transition-all flex items-center gap-2 text-sm shadow-lg"
            >
              <span>Calculate TCO (Total Cost of Ownership)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 6: TOTAL COST OF OWNERSHIP (TCO) CALCULATOR */}
      {currentStep === 6 && (
        <div className="bg-surface-card border border-surface-border rounded-2xl p-6 sm:p-8 space-y-8 shadow-2xl">
          <div className="flex items-center justify-between border-b border-surface-border pb-4">
            <div>
              <span className="text-xs font-mono text-chd-gold uppercase tracking-wider">STEP 06</span>
              <h2 className="text-2xl font-bold text-brand-50">Total Cost of Ownership (TCO) Calculator</h2>
              <p className="text-sm text-surface-muted">
                Calculates full lifecycle procurement costs. Missing cost components remain clearly labeled as "Not provided".
              </p>
            </div>
          </div>

          {tcoData && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Cost Layer Stack */}
              <div className="lg:col-span-7 space-y-3">
                <h3 className="text-sm font-mono text-surface-muted uppercase">DOCUMENTED COST LAYERS</h3>
                {tcoData.formattedBreakdown.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="bg-surface-dark border border-surface-border rounded-xl p-4 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-brand-100 block">{item.label}</span>
                      <span className="text-[11px] text-surface-muted">
                        {item.isDocumented ? 'Documented / Calculated' : 'Not provided in quotation'}
                      </span>
                    </div>
                    <span
                      className={`font-mono text-sm font-bold ${
                        item.isDocumented ? 'text-chd-gold' : 'text-surface-muted'
                      }`}
                    >
                      {item.displayValue}
                    </span>
                  </div>
                ))}
              </div>

              {/* TCO Total Summary */}
              <div className="lg:col-span-5 bg-gradient-to-br from-surface-dark via-brand-950 to-surface-dark border border-chd-gold/40 rounded-xl p-6 flex flex-col justify-between space-y-6 shadow-xl">
                <div>
                  <span className="text-xs font-mono text-chd-gold uppercase block">3-YEAR ESTIMATED TOTAL COST OF OWNERSHIP</span>
                  <div className="text-4xl font-black text-brand-50 mt-2">
                    ₹{tcoData.totalTco.toLocaleString('en-IN')}
                  </div>
                  <p className="text-xs text-surface-muted mt-2">
                    Includes initial equipment purchase cost ({whatIfQty} units) plus documented warranty & deployment charges.
                  </p>
                </div>

                <div className="space-y-3 pt-4 border-t border-surface-border">
                  <span className="text-xs font-mono text-surface-muted block">ENTER CUSTOM DOCUMENTED COSTS:</span>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-surface-muted block mb-1">AMC / Year (₹)</label>
                      <input
                        type="number"
                        placeholder="e.g. 25000"
                        value={customAmc || ''}
                        onChange={(e) => {
                          const v = parseFloat(e.target.value);
                          setCustomAmc(isNaN(v) ? undefined : v);
                          if (matchData?.matchedOptions?.[0]) {
                            calculateTcoForOption(matchData.matchedOptions[0].price, whatIfQty);
                          }
                        }}
                        className="w-full bg-surface-dark border border-surface-border rounded-lg p-2 text-xs text-brand-100 focus:outline-none focus:border-chd-gold"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-surface-muted block mb-1">Installation (₹)</label>
                      <input
                        type="number"
                        placeholder="e.g. 15000"
                        value={customInstallation || ''}
                        onChange={(e) => {
                          const v = parseFloat(e.target.value);
                          setCustomInstallation(isNaN(v) ? undefined : v);
                          if (matchData?.matchedOptions?.[0]) {
                            calculateTcoForOption(matchData.matchedOptions[0].price, whatIfQty);
                          }
                        }}
                        className="w-full bg-surface-dark border border-surface-border rounded-lg p-2 text-xs text-brand-100 focus:outline-none focus:border-chd-gold"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="pt-4 flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(5)}
              className="px-4 py-2.5 bg-surface-dark border border-surface-border text-brand-200 rounded-xl text-xs font-mono flex items-center gap-2 hover:border-chd-gold"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Budget
            </button>
            <button
              onClick={() => setCurrentStep(7)}
              className="px-6 py-3 bg-chd-gold text-surface-dark font-extrabold rounded-xl hover:bg-yellow-400 transition-all flex items-center gap-2 text-sm shadow-lg"
            >
              <span>Vendor Quote Forensics & Comparison</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 7: VENDOR QUOTE FORENSICS & MULTI-VENDOR COMPARISON */}
      {currentStep === 7 && (
        <div className="bg-surface-card border border-surface-border rounded-2xl p-6 sm:p-8 space-y-8 shadow-2xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-surface-border pb-4">
            <div>
              <span className="text-xs font-mono text-chd-gold uppercase tracking-wider">STEP 07</span>
              <h2 className="text-2xl font-bold text-brand-50">Vendor Quote Forensics & Multi-Vendor Comparison</h2>
              <p className="text-sm text-surface-muted">
                Upload supplier PDF quotations or compare seeded Chandigarh vendor offers side-by-side.
              </p>
            </div>

            {/* PDF Upload Button */}
            <label className="cursor-pointer bg-chd-gold hover:bg-yellow-400 text-surface-dark px-4 py-2.5 rounded-xl font-extrabold text-xs flex items-center gap-2 shadow-lg transition-all">
              <Upload className="w-4 h-4" />
              <span>{uploadingPdf ? 'Parsing PDF Document...' : 'Upload PDF Quotation'}</span>
              <input type="file" accept=".pdf" onChange={handlePdfUpload} className="hidden" />
            </label>
          </div>

          {/* Quotation Comparison Table */}
          {quotations.length > 0 ? (
            <div className="overflow-x-auto border border-surface-border rounded-xl">
              <table className="w-full text-left text-xs text-brand-200">
                <thead className="bg-surface-dark border-b border-surface-border text-surface-muted uppercase font-mono">
                  <tr>
                    <th className="p-3">Vendor Name</th>
                    <th className="p-3">Quotation Date</th>
                    <th className="p-3">Equipment Offer</th>
                    <th className="p-3">Quantity</th>
                    <th className="p-3">Unit Price</th>
                    <th className="p-3">GST & Charges</th>
                    <th className="p-3">Total Amount</th>
                    <th className="p-3">Warranty & AMC Terms</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border">
                  {quotations.map((q: any) => (
                    <tr key={q.id} className="hover:bg-surface-dark/60">
                      <td className="p-3 font-bold text-brand-100 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-chd-gold flex-shrink-0" />
                        <span>{q.vendorName}</span>
                      </td>
                      <td className="p-3 font-mono text-surface-muted">{q.quotationDate}</td>
                      <td className="p-3 font-medium text-brand-200">
                        {q.items?.[0]?.productName || 'Commercial Laptop Spec'}
                        <span className="block text-[10px] text-surface-muted">{q.items?.[0]?.model}</span>
                      </td>
                      <td className="p-3 font-mono font-bold text-brand-100">{q.items?.[0]?.quantity || 100}</td>
                      <td className="p-3 font-mono font-bold text-brand-50">
                        ₹{q.items?.[0]?.unitPrice ? Math.round(q.items[0].unitPrice).toLocaleString('en-IN') : 'N/A'}
                      </td>
                      <td className="p-3 font-mono text-surface-muted">₹{Math.round(q.gstAmount).toLocaleString('en-IN')} (18%)</td>
                      <td className="p-3 font-mono font-extrabold text-chd-gold text-sm">
                        ₹{q.totalPrice.toLocaleString('en-IN')}
                      </td>
                      <td className="p-3 text-[11px] text-surface-muted max-w-xs">
                        <span className="text-chd-emerald font-semibold block">{q.warrantyYears} Years Warranty</span>
                        <span>{q.amcDetails || 'Standard Support'}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-surface-dark p-8 text-center rounded-xl text-surface-muted text-xs">
              No quotations uploaded yet. Drag and drop a supplier PDF quotation above.
            </div>
          )}

          <div className="pt-4 flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(6)}
              className="px-4 py-2.5 bg-surface-dark border border-surface-border text-brand-200 rounded-xl text-xs font-mono flex items-center gap-2 hover:border-chd-gold"
            >
              <ArrowLeft className="w-4 h-4" /> Back to TCO
            </button>
            <button
              onClick={handleGenerateReport}
              disabled={loading}
              className="px-8 py-3.5 bg-gradient-to-r from-chd-gold to-brand-500 text-surface-dark font-black rounded-xl hover:shadow-xl transition-all flex items-center gap-2 text-sm shadow-lg"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loading ? 'Building Report...' : 'Generate Procurement Report'}</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 8: PROCUREMENT REPORT */}
      {currentStep === 8 && reportData && (
        <div className="bg-surface-card border border-chd-gold/40 rounded-2xl p-6 sm:p-10 space-y-8 shadow-2xl print:border-none print:shadow-none">
          {/* Action Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-border pb-6 print:hidden">
            <div>
              <span className="text-xs font-mono text-chd-emerald uppercase tracking-wider font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> PROCUREMENT-READY REPORT GENERATED
              </span>
              <h2 className="text-3xl font-black text-brand-50">Procurement Intelligence Report</h2>
              <p className="text-xs font-mono text-surface-muted">
                Report Reference ID: {reportData.reportId} • Generated: {reportData.generatedAt}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => window.print()}
                className="px-4 py-2.5 bg-surface-dark border border-surface-border text-brand-200 hover:text-chd-gold hover:border-chd-gold rounded-xl font-mono text-xs flex items-center gap-2 transition-all"
              >
                <Printer className="w-4 h-4" /> Print Report
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2.5 bg-chd-gold text-surface-dark font-extrabold rounded-xl text-xs flex items-center gap-2 shadow-lg hover:bg-yellow-400 transition-all"
              >
                <Download className="w-4 h-4" /> Download PDF
              </button>
            </div>
          </div>

          {/* REPORT CONTENT DOCUMENT */}
          <div className="space-y-8 font-sans text-brand-100">
            {/* Header Title Banner */}
            <div className="border-b-2 border-chd-gold pb-4 flex justify-between items-end">
              <div>
                <h1 className="text-2xl font-black text-brand-50 uppercase tracking-wide">ProcureIntel AI</h1>
                <p className="text-xs font-mono text-chd-gold">CHANDIGARH IT PROCUREMENT INTELLIGENCE PLATFORM</p>
              </div>
              <div className="text-right text-xs font-mono text-surface-muted">
                <span>Scope: Chandigarh, UT, India</span>
                <span className="block">Date: {reportData.generatedAt}</span>
              </div>
            </div>

            {/* 1. Executive Summary */}
            <div className="space-y-2">
              <h3 className="text-base font-bold text-chd-gold uppercase font-mono">1. EXECUTIVE SUMMARY</h3>
              <p className="text-xs text-brand-200 leading-relaxed bg-surface-dark p-4 rounded-xl border border-surface-border">
                This procurement intelligence report summarizes the requirement for <strong>{reportData.specification?.quantity || 100} units</strong> of <strong>{reportData.specification?.category || 'IT Equipment'}</strong> for <strong>{reportData.organization}</strong>. Based on verified market options observed in Chandigarh, the indicative current procurement budget ranges from <strong>₹{reportData.indicativeBudget.min?.toLocaleString('en-IN')}</strong> to <strong>₹{reportData.indicativeBudget.max?.toLocaleString('en-IN')}</strong>. All underlying data points carry complete provenance without synthetic price prediction.
              </p>
            </div>

            {/* 2. Structured Specification */}
            <div className="space-y-3">
              <h3 className="text-base font-bold text-chd-gold uppercase font-mono">2. STRUCTURED TECHNICAL SPECIFICATION</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-surface-dark p-3 rounded-lg border border-surface-border">
                  <span className="text-surface-muted block text-[10px] uppercase">Quantity</span>
                  <span className="font-bold text-brand-50">{reportData.specification?.quantity} Units</span>
                </div>
                <div className="bg-surface-dark p-3 rounded-lg border border-surface-border">
                  <span className="text-surface-muted block text-[10px] uppercase">RAM / Storage</span>
                  <span className="font-bold text-brand-50">{reportData.specification?.ram} | {reportData.specification?.storage}</span>
                </div>
                <div className="bg-surface-dark p-3 rounded-lg border border-surface-border">
                  <span className="text-surface-muted block text-[10px] uppercase">Processor</span>
                  <span className="font-bold text-brand-50">{reportData.specification?.processor}</span>
                </div>
                <div className="bg-surface-dark p-3 rounded-lg border border-surface-border">
                  <span className="text-surface-muted block text-[10px] uppercase">Warranty</span>
                  <span className="font-bold text-brand-50">{reportData.specification?.warranty}</span>
                </div>
              </div>
            </div>

            {/* 3. Observed Market Options */}
            <div className="space-y-3">
              <h3 className="text-base font-bold text-chd-gold uppercase font-mono">3. VERIFIED OBSERVED MARKET OPTIONS</h3>
              <div className="overflow-x-auto border border-surface-border rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-surface-dark text-surface-muted font-mono uppercase">
                    <tr>
                      <th className="p-2.5">Product & Model</th>
                      <th className="p-2.5">Source & Location</th>
                      <th className="p-2.5">Collection Date</th>
                      <th className="p-2.5">Observed Unit Price</th>
                      <th className="p-2.5">Total Budget</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-border">
                    {reportData.matchedOptions.map((opt: any) => (
                      <tr key={opt.productId}>
                        <td className="p-2.5 font-bold text-brand-100">{opt.productName} ({opt.model})</td>
                        <td className="p-2.5">{opt.sourceName} ({opt.geography})</td>
                        <td className="p-2.5 font-mono">{opt.collectionDate}</td>
                        <td className="p-2.5 font-bold">₹{opt.price.toLocaleString('en-IN')}</td>
                        <td className="p-2.5 font-extrabold text-chd-gold">₹{(opt.price * (reportData.specification?.quantity || 1)).toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 4. Assumptions & Limitations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="bg-surface-dark p-4 rounded-xl border border-surface-border">
                <span className="font-bold text-chd-gold block mb-2">PROCUREMENT ASSUMPTIONS</span>
                <ul className="list-disc list-inside text-surface-muted space-y-1">
                  {reportData.assumptions.map((a: string, idx: number) => (
                    <li key={idx}>{a}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-surface-dark p-4 rounded-xl border border-surface-border">
                <span className="font-bold text-chd-amber block mb-2">DATA LIMITATIONS</span>
                <ul className="list-disc list-inside text-surface-muted space-y-1">
                  {reportData.dataLimitations.map((l: string, idx: number) => (
                    <li key={idx}>{l}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Footer Signature Block */}
            <div className="pt-6 border-t border-surface-border flex justify-between items-center text-xs font-mono text-surface-muted">
              <div>
                <span>Report Generated by ProcureIntel AI System</span>
                <span className="block text-[10px]">Verified Chandigarh IT Procurement Intelligence Engine</span>
              </div>
              <div className="border-t border-surface-border pt-1 px-8 text-center">
                <span>Authorized Procurement Officer Signature</span>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-start print:hidden">
            <button
              onClick={() => setCurrentStep(1)}
              className="px-4 py-2.5 bg-surface-dark border border-surface-border text-brand-200 rounded-xl text-xs font-mono hover:border-chd-gold"
            >
              Start New Procurement Analysis
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function WorkflowPage() {
  return (
    <Suspense fallback={<div className="h-96 w-full flex items-center justify-center text-surface-muted font-mono">Loading Workflow...</div>}>
      <WorkflowContent />
    </Suspense>
  );
}
