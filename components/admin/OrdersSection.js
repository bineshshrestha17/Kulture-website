'use client';
import { useEffect, useMemo, useState } from 'react';
import { collection, deleteDoc, doc, getDocs, orderBy, query, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { formatDate } from '@/lib/utils';

const STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

export default function OrdersSection() {
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDocs(query(collection(db, 'orders'), orderBy('createdAt', 'desc')));
        setOrders(snap.docs.map((d) => ({ _docId: d.id, ...d.data() })));
      } catch (e) { setError(`Error loading orders: ${e.message}`); }
    })();
  }, []);

  const filtered = useMemo(() => (orders || []).filter((o) => {
    const s = search.toLowerCase();
    const okSearch = !s || (o.customer?.name || '').toLowerCase().includes(s) || (o.customer?.phone || '').toLowerCase().includes(s);
    return okSearch && (!status || o.status === status);
  }), [orders, search, status]);

  async function changeStatus(id, value) {
    try {
      await updateDoc(doc(db, 'orders', id), { status: value });
      setOrders((list) => list.map((o) => (o._docId === id ? { ...o, status: value } : o)));
    } catch { alert('Failed to update status. Check your connection.'); }
  }

  async function remove(id) {
    if (!confirm('Delete this order? This cannot be undone.')) return;
    try {
      await deleteDoc(doc(db, 'orders', id));
      setOrders((list) => list.filter((o) => o._docId !== id));
    } catch { alert('Failed to delete order.'); }
  }

  const empty = (text, cls) => <tr><td colSpan="10" className={cls}>{text}</td></tr>;

  return (
    <div>
      <div className="admin-section-title">Orders <span>{orders?.length || 0}</span></div>
      <div className="orders-toolbar">
        <input className="orders-search" type="text" placeholder="Search by name or phone…" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select className="orders-filter" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All Statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</option>)}
        </select>
      </div>
      <div className="orders-table-wrap">
        <table className="orders-table">
          <thead><tr>{['Order ID', 'Customer', 'Phone', 'Product', 'Size', 'Qty', 'Address', 'Date', 'Status', 'Actions'].map((h) => <th key={h}>{h}</th>)}</tr></thead>
          <tbody>
            {error ? empty(error, 'orders-empty')
              : orders === null ? empty('Loading orders…', 'orders-loading')
              : !filtered.length ? empty('No orders yet.', 'orders-empty')
              : filtered.map((o) => (
                <tr key={o._docId}>
                  <td className="order-id-cell">{o.orderId || o._docId.slice(0, 8)}</td>
                  <td style={{ fontWeight: 500 }}>{o.customer?.name || '—'}</td>
                  <td>{o.customer?.phone || '—'}</td>
                  <td style={{ fontFamily: 'var(--font-heading)', letterSpacing: 1, fontSize: '.8rem' }}>{o.product?.name || '—'}</td>
                  <td>{o.size || '—'}</td>
                  <td>{o.quantity || 1}</td>
                  <td style={{ maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={o.customer?.address || ''}>{o.customer?.address || '—'}</td>
                  <td style={{ color: 'var(--muted)', whiteSpace: 'nowrap' }}>{formatDate(o.createdAt)}</td>
                  <td>
                    <select className={`order-status-select ${o.status}`} value={o.status} onChange={(e) => changeStatus(o._docId, e.target.value)}>
                      {STATUSES.map((s) => <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</option>)}
                    </select>
                  </td>
                  <td><div className="tbl-actions"><button className="tbl-btn danger" onClick={() => remove(o._docId)}>Delete</button></div></td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
