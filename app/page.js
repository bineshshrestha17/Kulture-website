'use client';
import { useEffect, useRef, useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { loadProducts, saveProduct, removeProduct, loadSettings, saveSettings } from '@/lib/store';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ProductGrid from '@/components/ProductGrid';
import Lookbook from '@/components/Lookbook';
import Story from '@/components/Story';
import Newsletter from '@/components/Newsletter';
import Footer from '@/components/Footer';
import ProductModal from '@/components/ProductModal';
import CheckoutModal from '@/components/CheckoutModal';
import AuthModal from '@/components/AuthModal';
import OrderHistory from '@/components/OrderHistory';
import AdminLogin from '@/components/admin/AdminLogin';
import AdminPanel from '@/components/admin/AdminPanel';
import ProductForm from '@/components/admin/ProductForm';

export default function Home() {
  const { user, isAdmin } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({ _docId: null });

  const [viewing, setViewing] = useState(null);
  const [ordering, setOrdering] = useState(null);
  const [orderSize, setOrderSize] = useState('');
  const [authOpen, setAuthOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  const [adminLoginOpen, setAdminLoginOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    (async () => {
      const [p, s] = await Promise.all([loadProducts(), loadSettings()]);
      setProducts(p); setSettings(s); setLoading(false);
    })();
  }, []);

  // Admin shortcut: Ctrl + Shift + A, or triple-click the bottom-right corner
  useEffect(() => {
    const onKey = (e) => { if (e.ctrlKey && e.shiftKey && e.key === 'A') setAdminLoginOpen(true); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);
  const clicks = useRef({ n: 0, t: null });
  const onTrigger = () => {
    const c = clicks.current;
    c.n++; clearTimeout(c.t);
    c.t = setTimeout(() => { c.n = 0; }, 1000);
    if (c.n >= 3) { c.n = 0; setAdminLoginOpen(true); }
  };

  const openOrder = (p, size = '') => { setViewing(null); setOrderSize(size); setOrdering(p); };
  const closeOrder = () => { setOrdering(null); document.body.style.overflow = 'auto'; };
  const onAccount = () => (user ? setHistoryOpen(true) : setAuthOpen(true));

  const openForm = (p = null) => { setEditing(p); setFormOpen(true); };
  async function handleSaveProduct(data) {
    const saved = await saveProduct(data);
    setProducts((list) => (data._docId ? list.map((x) => (x._docId === saved._docId ? saved : x)) : [...list, saved]));
    setFormOpen(false); setEditing(null);
  }
  async function handleDelete(p) {
    if (!confirm('Delete this product?')) return;
    try { await removeProduct(p); } catch (e) { console.warn('Delete failed:', e); }
    setProducts((list) => list.filter((x) => (x._docId || x.id) !== (p._docId || p.id)));
  }
  async function handleSaveSettings(data) {
    try {
      setSettings(await saveSettings(settings, data));
      return true;
    }
    catch (e) { console.error(e); alert('Failed to save. Check connection.'); }
    return false;
  }
  const exitAdmin = async () => { setPanelOpen(false); await signOut(auth); };

  return (
    <>
      <Navbar onAccount={onAccount} settings={settings} />
      <Hero settings={settings} />
      <ProductGrid products={products} loading={loading} onOpen={setViewing} onOrder={(p) => openOrder(p)} onEdit={openForm} />
      <Lookbook settings={settings} />
      <Story />
      <Newsletter />
      <Footer settings={settings} />

      <ProductModal product={viewing} onClose={() => setViewing(null)} onOrder={openOrder} />
      <CheckoutModal product={ordering} initialSize={orderSize} onClose={closeOrder} />
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} onSuccess={() => setHistoryOpen(true)} />
      <OrderHistory open={historyOpen} onClose={() => setHistoryOpen(false)} />

      {!isAdmin && <div id="admin-trigger" onClick={onTrigger} />}
      <AdminLogin open={adminLoginOpen && !isAdmin} onClose={() => setAdminLoginOpen(false)} />
      {isAdmin && (
        <div id="admin-bar">
          <span>ADMIN MODE ACTIVE</span>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={() => setPanelOpen(true)}>Open Dashboard</button>
            <button onClick={exitAdmin}>Exit</button>
          </div>
        </div>
      )}
      {isAdmin && (
        <>
          <AdminPanel open={panelOpen} products={products} settings={settings}
            onClose={() => setPanelOpen(false)} onLogout={exitAdmin}
            onAdd={() => openForm(null)} onEdit={openForm} onDelete={handleDelete} onSaveSettings={handleSaveSettings} />
          <ProductForm open={formOpen} product={editing} onClose={() => { setFormOpen(false); setEditing(null); }} onSave={handleSaveProduct} />
        </>
      )}
    </>
  );
}
