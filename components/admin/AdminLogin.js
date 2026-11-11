'use client';
import { useState } from 'react';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth, ADMIN_EMAIL } from '@/lib/firebase';

const MAP = {
  'auth/user-not-found': 'No account found.',
  'auth/wrong-password': 'Incorrect password.',
  'auth/invalid-email': 'Invalid email address.',
  'auth/too-many-requests': 'Too many attempts. Try later.',
  'auth/invalid-credential': 'Invalid email or password.',
};

export default function AdminLogin({ open, onClose }) {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const close = () => { setEmail(''); setPass(''); setErr(''); onClose(); };

  async function attempt() {
    setErr('');
    if (!email.trim() || !pass) return setErr('Enter email and password.');
    setBusy(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), pass);
      if ((cred.user.email || '').toLowerCase() === ADMIN_EMAIL) close();
      else { await signOut(auth); setErr('Access denied. Admin only.'); }
    } catch (e) { setErr(MAP[e.code] || 'Login failed. Try again.'); }
    setBusy(false);
  }

  return (
    <div id="admin-login" className={`overlay ${open ? 'active' : ''}`}>
      <div className="login-box">
        <button className="close-login" onClick={close}><i className="ri-close-line" /></button>
        <h3>ADMIN ACCESS</h3>
        <input type="email" placeholder="Admin Email" autoComplete="off" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" autoComplete="off" value={pass} onChange={(e) => setPass(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && attempt()} />
        <button className="login-btn" disabled={busy} onClick={attempt}>{busy ? 'Verifying…' : 'Enter'}</button>
        {err && <p className="login-error">{err}</p>}
      </div>
    </div>
  );
}
