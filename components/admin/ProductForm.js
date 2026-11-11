'use client';
import { useEffect, useState } from 'react';
import ImageField from './ImageField';

const blank = { name: '', price: '', desc: '', img1: '', img2: '', status: 'coming', ig: '' };

export default function ProductForm({ open, product, onClose, onSave }) {
  const [f, setF] = useState(blank);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState({});
  useEffect(() => { if (open) setF(product ? { ...blank, ...product } : blank); }, [open, product]);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const isUploading = Object.values(uploading).some(Boolean);

  async function save() {
    if (isUploading) return;
    if (!f.name.trim() || !f.img1) return alert('Name and Main Image are required.');
    setBusy(true);
    try { await onSave({ ...f, name: f.name.trim(), price: f.price.trim(), desc: f.desc.trim(), ig: f.ig.trim() }); }
    catch (e) { console.error(e); alert('Failed to save product. Check your connection.'); }
    setBusy(false);
  }

  return (
    <div id="product-form-modal" className={`overlay ${open ? 'active' : ''}`}>
      <div className="pf-box">
        <h3>{product ? 'EDIT PRODUCT' : 'ADD PRODUCT'}</h3>
        <div className="pf-row">
          <div className="pf-field"><label>Product Name</label><input type="text" value={f.name} onChange={set('name')} placeholder="e.g. 001 Heavyweight Hoodie" /></div>
          <div className="pf-field"><label>Price / Label</label><input type="text" value={f.price} onChange={set('price')} placeholder="e.g. NPR 4,500 or Coming Soon" /></div>
        </div>
        <div className="pf-row full"><div className="pf-field"><label>Description</label><textarea value={f.desc} onChange={set('desc')} placeholder="Product description…" /></div></div>
        <div className="pf-row">
          <ImageField
            label="Main Image"
            value={f.img1}
            onChange={(v) => setF((s) => ({ ...s, img1: v }))}
            onBusyChange={(value) => setUploading((s) => ({ ...s, img1: value }))}
          />
          <ImageField
            label="Hover Image"
            value={f.img2 || ''}
            onChange={(v) => setF((s) => ({ ...s, img2: v }))}
            onBusyChange={(value) => setUploading((s) => ({ ...s, img2: value }))}
          />
        </div>
        <div className="pf-row">
          <div className="pf-field"><label>Status</label>
            <select value={f.status} onChange={set('status')}>
              <option value="coming">Coming Soon</option><option value="live">Live</option><option value="sold">Sold Out</option>
            </select>
          </div>
          <div className="pf-field"><label>Instagram DM Link</label><input type="text" value={f.ig} onChange={set('ig')} placeholder="https://instagram.com/…" /></div>
        </div>
        <div className="pf-actions">
          <button className="pf-cancel" onClick={onClose}>Cancel</button>
          <button className="pf-save" disabled={busy || isUploading} onClick={save}>{busy ? 'Saving…' : isUploading ? 'Optimizing image…' : 'Save Product'}</button>
        </div>
      </div>
    </div>
  );
}
