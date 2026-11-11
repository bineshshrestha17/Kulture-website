'use client';
import { useEffect, useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import emailjs from '@emailjs/browser';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';

const EMAIL_SERVICE = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'service_7u03pgi';
const EMAIL_TEMPLATE = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || 'template_ec4juq8';
const EMAIL_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || 'cGJByxbSktmxuAOWo';

const empty = { name: '', phone: '', address: '', size: '', qty: 1, notes: '' };

export default function CheckoutModal({ product, initialSize, onClose }) {
  const { user } = useAuth();
  const [f, setF] = useState(empty);
  const [busy, setBusy] = useState(false);
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    if (product) { setF({ ...empty, size: initialSize || '' }); setOrderId(null); setBusy(false); }
    document.body.style.overflow = product ? 'hidden' : 'auto';
  }, [product, initialSize]);

  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  async function submit() {
    if (!f.name.trim() || !f.phone.trim() || !f.address.trim() || !f.size) return alert('Please fill in all required fields.');
    if (!/^[0-9]{7,15}$/.test(f.phone.replace(/\s/g, ''))) return alert('Please enter a valid phone number.');
    setBusy(true);
    const id = 'KUL-' + Date.now().toString(36).toUpperCase();
    const qty = parseInt(f.qty) || 1;
    try {
      await addDoc(collection(db, 'orders'), {
        orderId: id,
        customer: { name: f.name.trim(), phone: f.phone.trim(), address: f.address.trim(), uid: user?.uid || null, email: user?.email || null },
        product: { id: product.id, name: product.name, price: product.price },
        size: f.size, quantity: qty, notes: f.notes.trim(),
        status: 'pending', total: product.price, createdAt: serverTimestamp(),
      });
      try {
        await emailjs.send(EMAIL_SERVICE, EMAIL_TEMPLATE, {
          order_id: id, customer_name: f.name, customer_phone: f.phone, customer_address: f.address,
          product_name: product.name, size: f.size, quantity: String(qty), notes: f.notes || 'None',
        }, EMAIL_KEY);
      } catch (e) { console.warn('Email notification failed:', e); }
      setOrderId(id);
    } catch (e) {
      console.error(e);
      setBusy(false);
      alert('Something went wrong. Please try again or contact us on Instagram.');
    }
  }

  return (
    <div id="checkout-modal" className={`overlay ${product ? 'active' : ''}`}>
      <div className="checkout-box">
        <h3>PLACE ORDER</h3>
        <div className="checkout-product-label">
          {product ? <><strong>{product.name}</strong> &mdash; {product.price} &mdash; Cash on Delivery</> : 'Product: —'}
        </div>
        {!orderId ? (
          <div>
            <div className="co-row">
              <div className="co-field"><label>Full Name *</label><input type="text" value={f.name} onChange={set('name')} placeholder="Your full name" /></div>
              <div className="co-field"><label>Phone Number *</label><input type="tel" value={f.phone} onChange={set('phone')} placeholder="98XXXXXXXX" /></div>
            </div>
            <div className="co-field"><label>Delivery Address *</label><input type="text" value={f.address} onChange={set('address')} placeholder="Street, Area, City" /></div>
            <div className="co-row">
              <div className="co-field">
                <label>Size *</label>
                <select value={f.size} onChange={set('size')}>
                  <option value="">Select size</option>
                  {['S', 'M', 'L', 'XL', 'XXL', 'One Size'].map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="co-field"><label>Quantity *</label><input type="number" min="1" max="10" value={f.qty} onChange={set('qty')} /></div>
            </div>
            <div className="co-field"><label>Notes (optional)</label><textarea value={f.notes} onChange={set('notes')} placeholder="Special requests, colour preference, etc." /></div>
            <p className="co-note"><i className="ri-truck-line" /> Cash on Delivery only. Our team will confirm your order via phone.</p>
            <div className="co-actions">
              <button className="co-cancel" onClick={onClose}>Cancel</button>
              <button className="co-submit" disabled={busy} onClick={submit}>{busy ? 'Placing Order…' : 'Confirm Order'}</button>
            </div>
          </div>
        ) : (
          <div className="order-confirm">
            <div className="confirm-icon">✓</div>
            <h3>ORDER PLACED</h3>
            <p>Thanks! We&apos;ll call you on your number to confirm delivery details.</p>
            <p className="order-id">Order ID: {orderId}</p>
            <div style={{ marginTop: '2rem' }}><button className="btn btn-outline" style={{ width: '100%', textAlign: 'center' }} onClick={onClose}>Close</button></div>
          </div>
        )}
      </div>
    </div>
  );
}
