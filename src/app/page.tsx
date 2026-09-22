'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import EcosystemCanvas from '@/components/3d/EcosystemCanvas';
import ChandigarhEcosystemMap from '@/components/3d/ChandigarhEcosystemMap';
import {
  Sparkles,
  ShieldCheck,
  MapPin,
  ArrowRight,
  FileCheck2,
  Sliders,
  Calculator,
  Search,
  CheckCircle2,
  AlertTriangle,
  Building2,
  GraduationCap,
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();

  const handleDemoPreset = (type: 'college' | 'student') => {
    if (type === 'college') {
      router.push('/workflow?preset=college');
    } else {
      router.push('/workflow?preset=student');
    }
  };

  return (
    <div className="space-y-16 py-4">
      {/* 1. HERO SECTION */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-6 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-chd-gold/10 border border-chd-gold/30 text-chd-gold text-xs font-mono">
            <MapPin className="w-3.5 h-3.5" />
            <span>Exclusively Focused on Chandigarh, India</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-brand-50 tracking-tight leading-none">
            Procurement intelligence for <span className="text-chd-gold">Chandigarh’s</span> IT ecosystem.
          </h1>

          <p className="text-lg text-brand-200 leading-relaxed">
            Turn requirements into structured specifications, discover current market options, analyze procurement costs, and build evidence-backed procurement reports.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/workflow"
              className="px-6 py-3.5 bg-gradient-to-r from-chd-gold via-brand-500 to-brand-600 text-surface-dark font-extrabold rounded-xl hover:shadow-xl hover:shadow-chd-gold/20 transition-all flex items-center gap-2 text-sm"
            >
              <span>Start Procurement Analysis</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/market"
              className="px-6 py-3.5 bg-surface-card border border-surface-border text-brand-200 font-semibold rounded-xl hover:border-chd-gold hover:text-chd-gold transition-all text-sm flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Explore Verified Market Data</span>
            </Link>
          </div>

          {/* Quick Demo Launchers */}
          <div className="pt-4 border-t border-surface-border/60">
            <span className="text-xs font-mono text-surface-muted block mb-3">
              TRY PRE-CONFIGURED DEMO FLOWS:
            </span>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handleDemoPreset('college')}
                className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-surface-card border border-brand-800/60 hover:border-chd-gold text-xs font-mono text-brand-200 hover:text-chd-gold transition-all text-left"
              >
                <Building2 className="w-4 h-4 text-chd-gold" />
                <div>
                  <span className="font-bold block">100 Developer Laptops</span>
                  <span className="text-[10px] text-surface-muted">Panjab Univ / College Lab</span>
                </div>
              </button>

              <button
                onClick={() => handleDemoPreset('student')}
                className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-surface-card border border-brand-800/60 hover:border-chd-gold text-xs font-mono text-brand-200 hover:text-chd-gold transition-all text-left"
              >
                <GraduationCap className="w-4 h-4 text-chd-emerald" />
                <div>
                  <span className="font-bold block">CSE Student Laptop (&lt; ₹70k)</span>
                  <span className="text-[10px] text-surface-muted">Programming & ML Workload</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* 3D Ecosystem Canvas */}
        <div className="lg:col-span-6">
          <EcosystemCanvas />
        </div>
      </section>

      {/* 2. ZERO HALLUCINATION TRUST BANNER */}
      <section className="bg-gradient-to-r from-surface-card via-brand-950 to-surface-card border border-chd-gold/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-chd-gold/10 border border-chd-gold flex items-center justify-center text-chd-gold flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-brand-50 flex items-center gap-2">
                <span>Zero Price Hallucination Policy</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-chd-emerald/20 text-chd-emerald border border-chd-emerald/40">
                  VERIFIED DATA ONLY
                </span>
              </h3>
              <p className="text-sm text-surface-muted mt-1 max-w-2xl">
                ProcureIntel AI does not predict future prices, invent numbers, or assign subjective "reasonability" scores. Every price includes verified provenance, seller info, collection date, and source link.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono text-surface-muted bg-surface-dark/80 p-3 rounded-xl border border-surface-border">
            <span>Missing Data?</span>
            <span className="text-chd-amber font-bold flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" /> Shows "Price Unavailable"
            </span>
          </div>
        </div>
      </section>

      {/* 3. CHANDIGARH ECOSYSTEM MAP */}
      <section>
        <ChandigarhEcosystemMap />
      </section>

      {/* 4. THE 8-STEP WORKFLOW STORY */}
      <section className="space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="text-xs font-mono text-chd-gold uppercase tracking-widest">END-TO-END WORKFLOW</span>
          <h2 className="text-3xl font-extrabold text-brand-50">From requirements to procurement report</h2>
          <p className="text-sm text-surface-muted">
            ProcureIntel AI replaces manual searching and guesswork with a single structured workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { step: '01', title: 'Requirement Builder', desc: 'Convert natural-language requests into structured specs.', icon: FileCheck2 },
            { step: '02', title: 'Verified Data Match', desc: 'Find current Chandigarh e-Tenders & local distributor prices.', icon: Search },
            { step: '03', title: 'Indicative Budget', desc: 'Calculate unit price ranges and budget totals from observed data.', icon: Calculator },
            { step: '04', title: 'What-If & TCO', desc: 'Simulate spec variations and calculate 3-year Total Cost of Ownership.', icon: Sliders },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="bg-surface-card border border-surface-border rounded-xl p-5 hover:border-chd-gold/50 transition-all group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-bold text-chd-gold bg-chd-gold/10 px-2 py-0.5 rounded border border-chd-gold/20">
                    STEP {item.step}
                  </span>
                  <Icon className="w-5 h-5 text-brand-400 group-hover:text-chd-gold transition-colors" />
                </div>
                <h3 className="text-lg font-bold text-brand-100">{item.title}</h3>
                <p className="text-xs text-surface-muted mt-1 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. CALL TO ACTION */}
      <section className="bg-gradient-to-br from-brand-900 via-surface-card to-brand-950 border border-brand-800 rounded-2xl p-8 text-center space-y-4 shadow-2xl">
        <h2 className="text-3xl font-extrabold text-brand-50">Ready to build your procurement plan?</h2>
        <p className="text-sm text-surface-muted max-w-xl mx-auto">
          Start with natural language requirements or explore verified Chandigarh e-Procurement market records.
        </p>
        <div>
          <Link
            href="/workflow"
            className="inline-flex items-center gap-2 px-8 py-4 bg-chd-gold text-surface-dark font-black rounded-xl hover:bg-yellow-400 transition-all shadow-lg text-sm"
          >
            <span>Launch Procurement Workflow</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
