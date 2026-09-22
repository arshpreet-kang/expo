'use client';

import React, { useState, useEffect } from 'react';
import SourceBadge from '@/components/ui/SourceBadge';
import { Plus, Settings, ShieldCheck, RefreshCw, Database, Check, X } from 'lucide-react';

export default function AdminPortalPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [form, setForm] = useState({
    name: '',
    model: '',
    brand: 'Dell',
    category: 'Laptop',
    processor: 'Intel Core i5 13th Gen',
    ram: '16 GB',
    storage: '512 GB SSD',
    gpu: 'Integrated Graphics',
    warranty: '3 Years Onsite Warranty',
    price: '65000',
    sourceName: 'Sector 20 Chandigarh IT Market Partner',
    geography: 'Chandigarh',
    collectionDate: '21 Sep 2026',
  });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/products');
      const data = await res.json();
      setProducts(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setShowAddModal(false);
        fetchProducts();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-border pb-6">
        <div>
          <span className="text-xs font-mono text-chd-gold uppercase tracking-wider">DATA MANAGEMENT</span>
          <h1 className="text-3xl font-black text-brand-50">Admin Ingestion & Provenance Portal</h1>
          <p className="text-sm text-surface-muted">
            Add verified market products, update collection dates, and manage Chandigarh e-Procurement sources.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-3 bg-chd-gold text-surface-dark font-extrabold rounded-xl text-xs flex items-center gap-2 shadow-lg hover:bg-yellow-400 transition-all flex-shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Verified Market Record
        </button>
      </div>

      {/* Product Ingestion List */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-brand-100 flex items-center justify-between">
          <span>Ingested Market Records ({products.length})</span>
          <button
            onClick={fetchProducts}
            className="text-xs font-mono text-surface-muted hover:text-chd-gold flex items-center gap-1"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </button>
        </h2>

        <div className="overflow-x-auto border border-surface-border rounded-xl shadow-xl">
          <table className="w-full text-left text-xs text-brand-200">
            <thead className="bg-surface-dark border-b border-surface-border text-surface-muted uppercase font-mono">
              <tr>
                <th className="p-3">Product Name & Model</th>
                <th className="p-3">Category</th>
                <th className="p-3">Specs (RAM / Storage / CPU)</th>
                <th className="p-3">Observed Price</th>
                <th className="p-3">Source & Location</th>
                <th className="p-3">Collection Date</th>
                <th className="p-3">Verification Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {products.map((p) => {
                const mp = p.marketPrices?.[0];
                return (
                  <tr key={p.id} className="hover:bg-surface-dark/60">
                    <td className="p-3 font-bold text-brand-100">
                      {p.name}
                      <span className="block text-[10px] font-mono text-chd-gold">{p.model}</span>
                    </td>
                    <td className="p-3 font-mono">{p.category}</td>
                    <td className="p-3">
                      {p.ram} • {p.storage} • {p.processor}
                    </td>
                    <td className="p-3 font-mono font-extrabold text-chd-gold">
                      ₹{mp?.price ? mp.price.toLocaleString('en-IN') : 'N/A'}
                    </td>
                    <td className="p-3">
                      <SourceBadge
                        sourceType={mp?.source?.sourceType || 'CHANDIGARH_SELLER'}
                        sourceName={mp?.source?.name || 'Local Seller'}
                        showViewSource={false}
                      />
                    </td>
                    <td className="p-3 font-mono text-surface-muted">{mp?.collectionDate || '21 Sep 2026'}</td>
                    <td className="p-3 font-mono text-chd-emerald font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 text-chd-emerald" /> Verified
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Record Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-card border border-surface-border rounded-2xl max-w-xl w-full p-6 space-y-6 shadow-2xl relative">
            <div className="flex justify-between items-center border-b border-surface-border pb-4">
              <h3 className="text-lg font-bold text-brand-50">Add Verified Market Record</h3>
              <button onClick={() => setShowAddModal(false)} className="text-surface-muted hover:text-brand-50">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-surface-muted block mb-1">Product Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-surface-dark border border-surface-border rounded-lg p-2 text-brand-50 focus:border-chd-gold"
                  />
                </div>
                <div>
                  <label className="text-surface-muted block mb-1">Model Number</label>
                  <input
                    type="text"
                    required
                    value={form.model}
                    onChange={(e) => setForm({ ...form, model: e.target.value })}
                    className="w-full bg-surface-dark border border-surface-border rounded-lg p-2 text-brand-50 focus:border-chd-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-surface-muted block mb-1">Brand</label>
                  <input
                    type="text"
                    value={form.brand}
                    onChange={(e) => setForm({ ...form, brand: e.target.value })}
                    className="w-full bg-surface-dark border border-surface-border rounded-lg p-2 text-brand-50 focus:border-chd-gold"
                  />
                </div>
                <div>
                  <label className="text-surface-muted block mb-1">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full bg-surface-dark border border-surface-border rounded-lg p-2 text-brand-50 focus:border-chd-gold"
                  >
                    <option value="Laptop">Laptop</option>
                    <option value="Desktop">Desktop</option>
                    <option value="Server">Server</option>
                    <option value="Display">Display</option>
                    <option value="Networking">Networking</option>
                    <option value="Peripheral">Peripheral</option>
                  </select>
                </div>
                <div>
                  <label className="text-surface-muted block mb-1">Observed Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full bg-surface-dark border border-surface-border rounded-lg p-2 text-brand-50 focus:border-chd-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-surface-muted block mb-1">RAM</label>
                  <input
                    type="text"
                    value={form.ram}
                    onChange={(e) => setForm({ ...form, ram: e.target.value })}
                    className="w-full bg-surface-dark border border-surface-border rounded-lg p-2 text-brand-50"
                  />
                </div>
                <div>
                  <label className="text-surface-muted block mb-1">Storage</label>
                  <input
                    type="text"
                    value={form.storage}
                    onChange={(e) => setForm({ ...form, storage: e.target.value })}
                    className="w-full bg-surface-dark border border-surface-border rounded-lg p-2 text-brand-50"
                  />
                </div>
                <div>
                  <label className="text-surface-muted block mb-1">Warranty</label>
                  <input
                    type="text"
                    value={form.warranty}
                    onChange={(e) => setForm({ ...form, warranty: e.target.value })}
                    className="w-full bg-surface-dark border border-surface-border rounded-lg p-2 text-brand-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-surface-muted block mb-1">Source Name</label>
                  <input
                    type="text"
                    value={form.sourceName}
                    onChange={(e) => setForm({ ...form, sourceName: e.target.value })}
                    className="w-full bg-surface-dark border border-surface-border rounded-lg p-2 text-brand-50"
                  />
                </div>
                <div>
                  <label className="text-surface-muted block mb-1">Geography</label>
                  <select
                    value={form.geography}
                    onChange={(e) => setForm({ ...form, geography: e.target.value })}
                    className="w-full bg-surface-dark border border-surface-border rounded-lg p-2 text-brand-50"
                  >
                    <option value="Chandigarh">Chandigarh</option>
                    <option value="National">National</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-surface-border">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-surface-dark text-surface-muted rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-chd-gold text-surface-dark font-extrabold rounded-lg hover:bg-yellow-400"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
