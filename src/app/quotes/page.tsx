'use client';

import React, { useState, useEffect } from 'react';
import SourceBadge from '@/components/ui/SourceBadge';
import { Upload, FileText, CheckCircle2, ShieldCheck, AlertCircle, RefreshCw, Layers } from 'lucide-react';

export default function VendorQuotesPage() {
  const [quotations, setQuotations] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgressStep, setUploadProgressStep] = useState(0);

  const fetchQuotations = async () => {
    try {
      const res = await fetch('/api/quotations');
      const data = await res.json();
      setQuotations(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchQuotations();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);

    // Progress animation steps
    setUploadProgressStep(1); // Uploading
    setTimeout(() => setUploadProgressStep(2), 500); // Reading document
    setTimeout(() => setUploadProgressStep(3), 1000); // Extracting products & prices

    const formData = new FormData();
    formData.append('file', e.target.files[0]);

    try {
      const res = await fetch('/api/quotations/extract', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setUploadProgressStep(4); // Building quotation
      setTimeout(async () => {
        await fetchQuotations();
        setUploading(false);
        setUploadProgressStep(0);
      }, 500);
    } catch (err) {
      console.error(err);
      setUploading(false);
      setUploadProgressStep(0);
    }
  };

  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-border pb-6">
        <div>
          <span className="text-xs font-mono text-chd-gold uppercase tracking-wider">DOCUMENT INTELLIGENCE</span>
          <h1 className="text-3xl font-black text-brand-50">Vendor Quote Forensics & Comparison</h1>
          <p className="text-sm text-surface-muted">
            Upload supplier PDF quotations to automatically extract line items, prices, GST, and warranty terms for factual side-by-side comparison.
          </p>
        </div>

        <label className="cursor-pointer bg-chd-gold hover:bg-yellow-400 text-surface-dark px-5 py-3 rounded-xl font-extrabold text-xs flex items-center gap-2 shadow-lg transition-all flex-shrink-0">
          <Upload className="w-4 h-4" />
          <span>{uploading ? 'Processing Document...' : 'Upload PDF Quotation'}</span>
          <input type="file" accept=".pdf" onChange={handleFileUpload} className="hidden" disabled={uploading} />
        </label>
      </div>

      {/* Upload Processing Animation Bar */}
      {uploading && (
        <div className="bg-surface-card border border-chd-gold/50 rounded-2xl p-6 space-y-4 shadow-2xl animate-pulse">
          <div className="flex items-center justify-between text-xs font-mono text-chd-gold">
            <span>EXTRACTING STRUCTURED QUOTATION DATA</span>
            <span>Step {uploadProgressStep} of 4</span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {[
              '1. Uploading Document',
              '2. Reading PDF Text',
              '3. Extracting Prices & Specs',
              '4. Building Comparison',
            ].map((stepLabel, idx) => (
              <div
                key={idx}
                className={`p-2.5 rounded-lg text-[11px] font-mono border text-center transition-all ${
                  uploadProgressStep >= idx + 1
                    ? 'bg-chd-gold text-surface-dark font-bold border-chd-gold'
                    : 'bg-surface-dark text-surface-muted border-surface-border'
                }`}
              >
                {stepLabel}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quotation Comparison Table */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-brand-100 flex items-center justify-between">
          <span>Multi-Vendor Quotation Analysis ({quotations.length})</span>
          <span className="text-xs font-mono text-surface-muted flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-chd-emerald" /> Evidence-Based • No Price Scoring
          </span>
        </h2>

        {quotations.length > 0 ? (
          <div className="overflow-x-auto border border-surface-border rounded-xl shadow-xl">
            <table className="w-full text-left text-xs text-brand-200">
              <thead className="bg-surface-dark border-b border-surface-border text-surface-muted uppercase font-mono">
                <tr>
                  <th className="p-3">Vendor / Supplier</th>
                  <th className="p-3">Quote Date</th>
                  <th className="p-3">Equipment Offer</th>
                  <th className="p-3">Quantity</th>
                  <th className="p-3">Unit Price (ex. GST)</th>
                  <th className="p-3">GST (18%)</th>
                  <th className="p-3">Total Cost</th>
                  <th className="p-3">Warranty & Support Terms</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {quotations.map((q: any) => (
                  <tr key={q.id} className="hover:bg-surface-dark/60">
                    <td className="p-3 font-bold text-brand-100 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-chd-gold flex-shrink-0" />
                      <div>
                        <span>{q.vendorName}</span>
                        <span className="block text-[10px] font-mono text-surface-muted">{q.documentName}</span>
                      </div>
                    </td>
                    <td className="p-3 font-mono text-surface-muted">{q.quotationDate}</td>
                    <td className="p-3 font-medium text-brand-200">
                      {q.items?.[0]?.productName || 'Commercial Laptop Spec'}
                      <span className="block text-[10px] font-mono text-chd-gold">{q.items?.[0]?.model}</span>
                    </td>
                    <td className="p-3 font-mono font-bold text-brand-100">{q.items?.[0]?.quantity || 100}</td>
                    <td className="p-3 font-mono font-bold text-brand-50">
                      ₹{q.items?.[0]?.unitPrice ? Math.round(q.items[0].unitPrice).toLocaleString('en-IN') : 'N/A'}
                    </td>
                    <td className="p-3 font-mono text-surface-muted">₹{Math.round(q.gstAmount).toLocaleString('en-IN')}</td>
                    <td className="p-3 font-mono font-extrabold text-chd-gold text-sm">
                      ₹{q.totalPrice.toLocaleString('en-IN')}
                    </td>
                    <td className="p-3 text-[11px] text-surface-muted max-w-xs">
                      <span className="text-chd-emerald font-semibold block">{q.warrantyYears} Years Warranty</span>
                      <span>{q.amcDetails || 'Standard Onsite Support'}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-surface-card border border-surface-border rounded-xl p-12 text-center text-surface-muted text-xs space-y-3">
            <Upload className="w-8 h-8 text-surface-muted mx-auto" />
            <h3 className="text-base font-bold text-brand-100">No vendor quotations uploaded yet</h3>
            <p className="max-w-md mx-auto">
              Upload PDF quotations received from IT vendors in Chandigarh to parse line items and perform factual multi-vendor cost comparisons.
            </p>
          </div>
        )}
      </div>

      {/* Factual Comparison Explanation Box */}
      <div className="bg-surface-dark border border-brand-800/40 rounded-xl p-5 text-xs text-surface-muted space-y-2">
        <h4 className="font-bold text-chd-gold uppercase font-mono flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-chd-gold" /> FACTUAL COMPARISON PRINCIPLE
        </h4>
        <p className="leading-relaxed">
          ProcureIntel AI compares vendor quotations directly against observed current market options and user specifications. The system highlights price differentials and warranty scope differences without subjective labeling or fake anomaly scoring.
        </p>
      </div>
    </div>
  );
}
