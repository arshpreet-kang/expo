'use client';

import React, { useState, useEffect } from 'react';
import SourceBadge from '@/components/ui/SourceBadge';
import { Search, Filter, ShieldCheck, MapPin, Building2, ExternalLink, Calendar, RefreshCw } from 'lucide-react';

const CATEGORIES = [
  'All Categories',
  'Laptop',
  'Desktop',
  'Server',
  'Display',
  'Networking',
  'Peripheral',
  'IT_Service',
];

export default function MarketExplorerPage() {
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [tenders, setTenders] = useState<any[]>([]);

  const fetchMarketData = async () => {
    setLoading(true);
    try {
      const catParam = selectedCategory === 'All Categories' ? '' : selectedCategory;
      const res = await fetch(`/api/products?category=${encodeURIComponent(catParam)}&query=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      setProducts(data.matchedOptions || []);
      setTenders(data.procurementRecords || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketData();
  }, [selectedCategory]);

  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-surface-border pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-chd-gold/10 border border-chd-gold/30 text-chd-gold text-xs font-mono mb-2">
            <MapPin className="w-3.5 h-3.5" />
            <span>Chandigarh & National Verified Data</span>
          </div>
          <h1 className="text-3xl font-black text-brand-50">Current IT Market Explorer</h1>
          <p className="text-sm text-surface-muted">
            Explore verified IT product prices, local Chandigarh distributors, and active e-Procurement tenders with 100% provenance.
          </p>
        </div>

        <button
          onClick={fetchMarketData}
          className="px-4 py-2 bg-surface-card border border-surface-border text-brand-200 hover:text-chd-gold rounded-xl font-mono text-xs flex items-center gap-2"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-7 relative">
          <Search className="w-4 h-4 text-surface-muted absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search products, models, or brands (e.g. Dell Latitude, Core i7, Switch)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchMarketData()}
            className="w-full bg-surface-card border border-surface-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-brand-50 placeholder-surface-muted focus:outline-none focus:border-chd-gold"
          />
        </div>

        <div className="md:col-span-5 flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
          <Filter className="w-4 h-4 text-surface-muted flex-shrink-0" />
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-chd-gold text-surface-dark font-bold shadow-md'
                  : 'bg-surface-card text-surface-muted hover:text-brand-100 border border-surface-border'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Cards Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-brand-100 flex items-center justify-between">
          <span>Verified Observed IT Products ({products.length})</span>
          <span className="text-xs font-mono text-chd-emerald flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Zero Price Hallucination
          </span>
        </h2>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((opt) => (
              <div
                key={opt.productId}
                className="bg-surface-card border border-surface-border rounded-xl p-5 hover:border-chd-gold/60 transition-all flex flex-col justify-between space-y-4 shadow-lg group"
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
                </div>

                <div className="pt-4 border-t border-surface-border flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-surface-muted block">OBSERVED UNIT PRICE</span>
                    <span className="text-xl font-extrabold text-brand-50">
                      ₹{opt.price.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <span className="text-[11px] text-surface-muted bg-surface-dark px-2.5 py-1 rounded-md border border-surface-border">
                    {opt.availability}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-surface-card border border-surface-border rounded-xl p-8 text-center text-surface-muted text-xs">
            No products found matching your current filter. Try selecting "All Categories" or adjusting your search query.
          </div>
        )}
      </div>

      {/* Active Chandigarh Tenders Section */}
      {tenders.length > 0 && (
        <div className="pt-8 border-t border-surface-border space-y-4">
          <h2 className="text-xl font-bold text-brand-100 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-chd-gold" />
            <span>Active Chandigarh e-Procurement Tenders ({tenders.length})</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tenders.map((t) => (
              <div key={t.id} className="bg-surface-card border border-surface-border rounded-xl p-5 space-y-3 text-xs shadow-md">
                <div className="flex items-center justify-between font-mono text-chd-gold">
                  <span>Tender ID: {t.tenderId}</span>
                  <span className="flex items-center gap-1 text-surface-muted">
                    <Calendar className="w-3 h-3" /> {t.tenderDate}
                  </span>
                </div>
                <h3 className="font-bold text-brand-100 text-sm">{t.organization}</h3>
                <p className="text-surface-muted leading-relaxed">{t.item}</p>
                <div className="pt-2 border-t border-surface-border flex items-center justify-between text-[11px]">
                  <span className="text-brand-300 font-mono">Quantity: {t.quantity} Units</span>
                  {t.sourceUrl && (
                    <a
                      href={t.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-chd-gold hover:underline flex items-center gap-1 font-mono"
                    >
                      <span>View Tender Document</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
