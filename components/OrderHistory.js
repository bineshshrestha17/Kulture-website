'use client';
import { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { formatDate } from '@/lib/utils';

export default function OrderHistory({ open, onClose }) {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : 'auto';
    if (!open || !user) return;
    setOrders(null); setError('');
    (async () => {
      try {
        const q = query(collection(db, 'orders'), where('customer.uid', '==', user.uid), orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        setOrders(snap.docs.map((d) => d.data()));
      } catch (e) { setError(`Could not load orders: ${e.message}`); }
    })();
  }, [open, user]);

  return (
    <div id="order-history-modal" className={`overlay ${open ? 'active' : ''}`}>
      <div className="oh-box">
        <button className="oh-close" onClick={onClose}><i className="ri-close-line" /></button>
        <h3>MY ORDERS</h3>
        <div className="oh-email">{user?.email || '—'}</div>
        <div>
          {error ? <div className="oh-empty">{error}</div>
            : orders === null ? <div className="oh-empty">Loading your orders…</div>
            : !orders.length ? <div className="oh-empty">No orders yet. Start shopping!</div>
            : orders.map((o, i) => (
              <div className="oh-order" key={i}>
                <div className="oh-order-header"><span className="oh-order-id">{o.orderId || '—'}</span><span className="oh-order-date">{formatDate(o.createdAt)}</span></div>
                <div className="oh-order-product">{o.product?.name || '—'}</div>
                <div className="oh-order-meta">Size: {o.size || '—'} &nbsp;|&nbsp; Qty: {o.quantity || 1} &nbsp;|&nbsp; {o.customer?.address || '—'}</div>
                <div><span className={`oh-status-badge ${o.status || 'pending'}`}>{o.status || 'pending'}</span></div>
              </div>
            ))}
        </div>
        <button className="oh-signout" onClick={async () => { await logout(); onClose(); }}>Sign Out</button>
      </div>
    </div>
  );
}
