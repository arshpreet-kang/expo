'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck, MapPin, Sparkles, SlidersHorizontal, FileText, Search, Settings } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Overview', icon: Sparkles },
    { href: '/workflow', label: 'Procurement Workflow', icon: SlidersHorizontal },
    { href: '/market', label: 'Market Explorer', icon: Search },
    { href: '/quotes', label: 'Quote Forensics', icon: FileText },
    { href: '/admin', label: 'Data Admin', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-50 bg-surface-dark/90 backdrop-blur-md border-b border-surface-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo & Chandigarh Badge */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-chd-gold via-brand-500 to-brand-800 flex items-center justify-center text-surface-dark font-black text-lg shadow-lg group-hover:scale-105 transition-transform">
              P
            </div>
            <div>
              <span className="text-lg font-extrabold tracking-tight text-brand-100 group-hover:text-chd-gold transition-colors">
                ProcureIntel <span className="text-chd-gold">AI</span>
              </span>
              <span className="block text-[10px] font-mono text-surface-muted leading-none">
                Chandigarh IT Procurement
              </span>
            </div>
          </Link>

          <span className="hidden sm:flex items-center gap-1 text-[11px] font-mono bg-brand-900/60 text-chd-gold border border-brand-700/50 px-2.5 py-1 rounded-full">
            <MapPin className="w-3 h-3 text-chd-gold" />
            <span>Chandigarh UT Focus</span>
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-mono transition-all ${
                  isActive
                    ? 'bg-chd-gold/15 text-chd-gold font-bold border border-chd-gold/30'
                    : 'text-surface-muted hover:text-brand-100 hover:bg-surface-card'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* CTA Button */}
        <div className="flex items-center gap-3">
          <Link
            href="/workflow"
            className="px-4 py-2 bg-gradient-to-r from-chd-gold to-brand-500 text-surface-dark text-xs font-extrabold rounded-lg hover:shadow-lg hover:shadow-chd-gold/20 transition-all flex items-center gap-2"
          >
            <span>Start Analysis</span>
            <Sparkles className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
