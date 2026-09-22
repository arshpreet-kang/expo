import React from 'react';
import { ShieldCheck, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-surface-dark border-t border-surface-border text-surface-muted text-xs py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <p className="text-brand-200 font-semibold">
            ProcureIntel AI — From requirements to smarter procurement.
          </p>
          <p className="mt-1 text-[11px]">
            Focused exclusively on IT procurement intelligence, current market data, and e-Procurement for Chandigarh, India.
          </p>
        </div>

        <div className="flex items-center gap-4 text-mono text-[11px]">
          <span className="flex items-center gap-1 text-chd-gold">
            <MapPin className="w-3 h-3" /> Chandigarh, India
          </span>
          <span className="flex items-center gap-1 text-chd-emerald">
            <ShieldCheck className="w-3 h-3" /> Zero Price Hallucination
          </span>
        </div>
      </div>
    </footer>
  );
}
