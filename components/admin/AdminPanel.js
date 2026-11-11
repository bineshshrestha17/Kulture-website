'use client';
import { useState } from 'react';
import OrdersSection from './OrdersSection';
import { HeroSection, LogoSection, LookbookSection } from './SettingsSections';

export default function AdminPanel({ open, products, settings, onClose, onLogout, onAdd, onEdit, onDelete, onSaveSettings }) {
  const [section, setSection] = useState('products');
  const tabs = [['products', 'Products'], ['orders', 'Orders'], ['hero', 'Hero'], ['logo', 'Logo'], ['lookbook', 'Lookbook']];
  return (
    <div id="admin-panel" className={open ? 'active' : ''}>
      <div className="admin-topbar">
        <div className="admin-logo">KULTURE <span>Admin</span></div>
        <div className="admin-topbar-actions">
          <button className="btn-add-product" onClick={onAdd}>+ Add Product</button>
          <button onClick={onClose} style={{ color: 'var(--muted)' }}>← Back to Site</button>
          <button className="admin-logout" onClick={onLogout}>Logout</button>
        </div>
      </div>
      <div className="admin-body">
        <div className="admin-sidebar">
          <ul>{tabs.map(([k, l]) => <li key={k} className={section === k ? 'active' : ''} onClick={() => setSection(k)}>{l}</li>)}</ul>
        </div>
        <div className="admin-main">
          {section === 'products' && (
            <div>
              <div className="admin-section-title">Products <span>{products.length}</span></div>
              <div className="product-table-wrap">
              <table className="product-table">
                <thead><tr><th>Image</th><th>Name</th><th>Price</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p._docId || p.id}>
                      <td><img src={p.img1} alt={p.name} /></td>
                      <td style={{ fontFamily: 'var(--font-heading)', letterSpacing: 1 }}>{p.name}</td>
                      <td style={{ color: 'var(--muted)' }}>{p.price}</td>
                      <td><span className={`status-badge ${p.status}`}>{p.status === 'coming' ? 'Coming Soon' : p.status === 'live' ? 'Live' : 'Sold Out'}</span></td>
                      <td><div className="tbl-actions">
                        <button className="tbl-btn" onClick={() => onEdit(p)}>Edit</button>
                        <button className="tbl-btn danger" onClick={() => onDelete(p)}>Delete</button>
                      </div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </div>
          )}
          {section === 'orders' && open && <OrdersSection />}
          {section === 'hero' && <HeroSection settings={settings} onSave={onSaveSettings} />}
          {section === 'logo' && <LogoSection settings={settings} onSave={onSaveSettings} />}
          {section === 'lookbook' && <LookbookSection settings={settings} onSave={onSaveSettings} />}
        </div>
      </div>
    </div>
  );
}
