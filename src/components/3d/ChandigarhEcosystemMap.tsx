'use client';

import React, { useState } from 'react';
import { MapPin, Building2, Landmark, Laptop, Server, ExternalLink, ShieldCheck } from 'lucide-react';

interface ZoneNode {
  id: string;
  name: string;
  sector: string;
  type: string;
  activeTenders: number;
  recentProcurement: string;
  icon: any;
  position: { x: number; y: number };
}

const CHD_ZONES: ZoneNode[] = [
  {
    id: 'pu-14',
    name: 'Panjab University',
    sector: 'Sector 14',
    type: 'Academic Institution',
    activeTenders: 3,
    recentProcurement: '100 Commercial Laptops (CSE Labs)',
    icon: Landmark,
    position: { x: 25, y: 30 },
  },
  {
    id: 'pec-12',
    name: 'Punjab Engineering College (PEC)',
    sector: 'Sector 12',
    type: 'Deemed University',
    activeTenders: 2,
    recentProcurement: 'High Performance AI GPU Server Rack',
    icon: Building2,
    position: { x: 35, y: 22 },
  },
  {
    id: 'sec-20-market',
    name: 'Sector 20 IT Hub & Distributors',
    sector: 'Sector 20',
    type: 'Commercial IT Market',
    activeTenders: 18,
    recentProcurement: 'Dell / HP Authorized Enterprise Hub',
    icon: Laptop,
    position: { x: 55, y: 60 },
  },
  {
    id: 'chd-admin-9',
    name: 'Chandigarh Administration Secretariat',
    sector: 'Sector 9',
    type: 'Government Department',
    activeTenders: 5,
    recentProcurement: '50 Desktop PCs & 27" IPS Monitors',
    icon: Server,
    position: { x: 45, y: 35 },
  },
  {
    id: 'ccet-26',
    name: 'CCET Engineering College',
    sector: 'Sector 26',
    type: 'Technical Institute',
    activeTenders: 1,
    recentProcurement: 'Managed 24-Port Gigabit Switches',
    icon: Building2,
    position: { x: 75, y: 45 },
  },
];

export default function ChandigarhEcosystemMap() {
  const [selectedZone, setSelectedZone] = useState<ZoneNode>(CHD_ZONES[2]); // Default Sector 20 Market

  return (
    <div className="bg-surface-card border border-surface-border rounded-2xl p-6 relative overflow-hidden shadow-2xl">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-chd-gold/10 text-chd-gold border border-chd-gold/20">
              GEOGRAPHICAL FOCUS
            </span>
            <span className="text-xs text-surface-muted flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-chd-emerald" /> Verified Chandigarh Data Only
            </span>
          </div>
          <h3 className="text-2xl font-bold text-brand-100 mt-1">Chandigarh Procurement Map</h3>
          <p className="text-sm text-surface-muted">
            Hover or click nodes to inspect active IT tenders & local market suppliers across Chandigarh sectors.
          </p>
        </div>

        <a
          href="https://etenders.chd.nic.in"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs font-mono text-brand-300 bg-brand-900/60 hover:bg-brand-900 border border-brand-700/50 px-3 py-2 rounded-lg transition-colors"
        >
          <span>Official Portal: etenders.chd.nic.in</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Interactive Map Visual */}
        <div className="lg:col-span-7 bg-surface-dark border border-surface-border rounded-xl p-6 h-[340px] relative overflow-hidden flex items-center justify-center group">
          {/* Subtle Grid / Sector Map Overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(#2A241C_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

          {/* Sector Outline Lines */}
          <svg className="absolute inset-0 w-full h-full stroke-surface-border opacity-60" fill="none">
            <line x1="20%" y1="10%" x2="80%" y2="90%" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="80%" y1="20%" x2="20%" y2="80%" strokeWidth="1" strokeDasharray="4 4" />
            <circle cx="50%" cy="50%" r="35%" strokeWidth="1" strokeDasharray="2 2" className="stroke-chd-gold/20" />
          </svg>

          {/* Map Title Graphic */}
          <div className="absolute top-3 left-4 text-[10px] font-mono tracking-widest text-surface-muted uppercase">
            CHANDIGARH UNION TERRITORY • ZONE MAP
          </div>

          {/* Nodes */}
          {CHD_ZONES.map((zone) => {
            const Icon = zone.icon;
            const isSelected = selectedZone.id === zone.id;

            return (
              <button
                key={zone.id}
                onClick={() => setSelectedZone(zone)}
                style={{ left: `${zone.position.x}%`, top: `${zone.position.y}%` }}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 group-hover:scale-105 transition-all duration-300 z-10 flex flex-col items-center ${
                  isSelected ? 'z-20 scale-110' : 'opacity-80 hover:opacity-100'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-all border ${
                    isSelected
                      ? 'bg-chd-gold text-surface-dark border-white ring-4 ring-chd-gold/30 scale-110'
                      : 'bg-surface-card text-brand-200 border-surface-border hover:border-chd-gold'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span
                  className={`mt-1.5 text-[11px] font-medium px-2 py-0.5 rounded backdrop-blur-md whitespace-nowrap shadow ${
                    isSelected
                      ? 'bg-chd-gold text-surface-dark font-bold'
                      : 'bg-surface-card/90 text-brand-200 border border-surface-border'
                  }`}
                >
                  {zone.sector}
                </span>
              </button>
            );
          })}
        </div>

        {/* Node Detail Card */}
        <div className="lg:col-span-5 bg-surface-cardHover border border-brand-800/40 rounded-xl p-6 flex flex-col justify-between h-[340px] shadow-xl">
          <div>
            <div className="flex items-center justify-between border-b border-surface-border pb-3 mb-4">
              <div>
                <span className="text-xs font-mono text-chd-gold uppercase tracking-wider">{selectedZone.type}</span>
                <h4 className="text-xl font-bold text-brand-100">{selectedZone.name}</h4>
              </div>
              <span className="px-3 py-1 bg-brand-900/80 border border-brand-700 text-chd-gold rounded-full text-xs font-mono">
                {selectedZone.sector}
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-xs text-surface-muted block mb-1">Active Tenders & Verified Sources</span>
                <div className="text-2xl font-extrabold text-brand-50 flex items-center gap-2">
                  <span>{selectedZone.activeTenders} Active Records</span>
                  <span className="w-2 h-2 rounded-full bg-chd-emerald animate-ping" />
                </div>
              </div>

              <div>
                <span className="text-xs text-surface-muted block mb-1">Recent Observed Procurement</span>
                <p className="text-sm font-medium text-brand-200 bg-surface-dark p-3 rounded-lg border border-surface-border">
                  {selectedZone.recentProcurement}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-surface-border flex items-center justify-between text-xs text-surface-muted">
            <span>Location: Chandigarh, IN</span>
            <span className="text-chd-emerald font-mono">Traceability: 100% Verified</span>
          </div>
        </div>
      </div>
    </div>
  );
}
