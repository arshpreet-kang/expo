'use client';

import React from 'react';
import { Check } from 'lucide-react';

interface WorkflowStepperProps {
  currentStep: number;
  onStepClick: (step: number) => void;
}

const STEPS = [
  { num: 1, label: 'Requirement' },
  { num: 2, label: 'Specifications' },
  { num: 3, label: 'Current Data' },
  { num: 4, label: 'Options' },
  { num: 5, label: 'Budget' },
  { num: 6, label: 'TCO' },
  { num: 7, label: 'Quotes' },
  { num: 8, label: 'Report' },
];

export default function WorkflowStepper({ currentStep, onStepClick }: WorkflowStepperProps) {
  return (
    <div className="bg-surface-card border border-surface-border rounded-xl p-4 shadow-xl overflow-x-auto">
      <div className="flex items-center justify-between min-w-[760px] gap-2">
        {STEPS.map((step) => {
          const isActive = currentStep === step.num;
          const isPassed = currentStep > step.num;

          return (
            <React.Fragment key={step.num}>
              <button
                onClick={() => onStepClick(step.num)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg font-mono text-xs transition-all duration-300 ${
                  isActive
                    ? 'bg-chd-gold text-surface-dark font-bold shadow-lg shadow-chd-gold/20 ring-2 ring-chd-gold/40'
                    : isPassed
                    ? 'bg-brand-900/60 text-chd-gold border border-brand-700/50'
                    : 'bg-surface-dark text-surface-muted border border-surface-border hover:text-brand-200'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    isActive
                      ? 'bg-surface-dark text-chd-gold'
                      : isPassed
                      ? 'bg-chd-gold text-surface-dark'
                      : 'bg-surface-border text-surface-muted'
                  }`}
                >
                  {isPassed ? <Check className="w-3 h-3 stroke-[3]" /> : `0${step.num}`}
                </div>
                <span>{step.label}</span>
              </button>

              {step.num < STEPS.length && (
                <div
                  className={`h-0.5 flex-1 min-w-[12px] transition-colors duration-300 ${
                    isPassed ? 'bg-chd-gold/60' : 'bg-surface-border'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
