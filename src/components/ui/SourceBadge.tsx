'use client';

import React from 'react';
import { ShieldCheck, MapPin, ExternalLink, Calendar, FileText } from 'lucide-react';

interface SourceBadgeProps {
  sourceType: string;
  sourceName: string;
  sourceUrl?: string | null;
  geography?: string;
  collectionDate?: string;
  showViewSource?: boolean;
}

export default function SourceBadge({
  sourceType,
  sourceName,
  sourceUrl,
  geography = 'Chandigarh',
  collectionDate = '21 Sep 2026',
  showViewSource = true,
}: SourceBadgeProps) {
  let badgeStyle = 'bg-chd-gold/10 text-chd-gold border-chd-gold/30';
  let labelText = 'CHANDIGARH SELLER';

  if (sourceType === 'CHANDIGARH_PROCUREMENT') {
    badgeStyle = 'bg-chd-emerald/10 text-chd-emerald border-chd-emerald/30';
    labelText = 'CHANDIGARH PROCUREMENT';
  } else if (sourceType === 'NATIONAL_MARKET') {
    badgeStyle = 'bg-blue-500/10 text-blue-400 border-blue-500/30';
    labelText = 'NATIONAL INDIAN MARKET DATA';
  } else if (sourceType === 'USER_QUOTATION') {
    badgeStyle = 'bg-purple-500/10 text-purple-300 border-purple-500/30';
    labelText = 'USER QUOTATION';
  }

  return (
    <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
      {/* Badge Pill */}
      <span className={`px-2.5 py-1 rounded-md border font-semibold flex items-center gap-1.5 ${badgeStyle}`}>
        <ShieldCheck className="w-3.5 h-3.5" />
        <span>{labelText}</span>
      </span>

      {/* Collection Date */}
      {collectionDate && (
        <span className="text-surface-muted flex items-center gap-1 bg-surface-card border border-surface-border px-2 py-1 rounded-md">
          <Calendar className="w-3 h-3 text-brand-400" />
          <span>Collected: {collectionDate}</span>
        </span>
      )}

      {/* View Source Button */}
      {showViewSource && sourceUrl && (
        <a
          href={sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-brand-300 hover:text-chd-gold bg-brand-950 border border-brand-800 hover:border-chd-gold px-2.5 py-1 rounded-md transition-all"
        >
          <span>View Source</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      )}
    </div>
  );
}
